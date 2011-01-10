<?php

import('studs.action.Action');
import('project.service.GroupManager');
import('project.service.UserManager');
import('project.service.ServiceRegistration');
import('project.service.ServiceMember');
import('project.service.ServiceProfileWidget');
import('include.Profanity');
import('include.SelectOptions');
import('horizon.util.Properties');

// the project configuration file
def('Project::CONFIG', 'resources' . DIRECTORY_SEPARATOR . 'project.properties');

/**
 * @package project.action.user
 */
class ControllerBase extends Action {
	var $user;

	var $managerUser;

	var $_requiresLogin = true;

	var $_requiresRegistration = true;

	var $_requiredMethod = null;

	var $managerGroup;

	var $_managerNotification;

	var $_managerContent;

	var $session;

	var $props;

	/**
	 * Overrides UserAction.executeActually, to determine controller action.
	 * @method executeActually
	 * @param mapping {Object} Required. Data hash map.
	 * @param form {Object} Required. The form object.
	 * @param request {HttpServletRequest} Required. The servlet request.
	 * @param response {HttpServletRespond} Required. The servlet response.
	 * @access public
	 * @since release 1.0
	 */
	public function &execute(&$mapping, &$form, &$request, &$response) {
		$log = $this->getLog();

		$pagename = $this->getPagename($request);

		$log->info('$pagename=' . $pagename);

		$this->props =& new Properties();
		$this->readConfiguration();

//		$klass = get_class($this);

		if ($this->_requiredMethod && $this->_requiredMethod !== $request->getMethod()) {
			$log->error("Invalid method for " . $request->getRequestURI());
			return $mapping->findForward(ref('unauthorized'));
		}

		// is LoginView or LoginUser controllers, invalidate current session
		if (!$this->_requiresLogin) {
			//			dlog('removing User from session');
			$request->getSession()->removeAttribute('User');
			// do not invalidate the whole session, will mess up errors and nextPage
		}

		// Make User Manager and Authorized User objects available to children
		$aUser = $request->getSession()->getAttribute('User');
		$key = $this->_getParameterAsString($request, c('QUERY_KEY_KEY'));

		$S = null;
		$uMan = new UserManager($this->getDataSource($request));
		$session =& $request->getSession();
		$forward = '';

		// set the pagename
		$request->setAttribute(c('MN_PAGENAME'), $pagename);
		$request->setAttribute(c('MN_PROJECT_NAME'), $this->props->getProperty('project.name'));
		$request->setAttribute(c('MN_PROJECT_NAME_UC'), $this->props->getProperty('project.nameUC'));

		if ($aUser) {
			//dlog('User is logged in');
			//dlog($this->_requiresRegistration);

			// set the authorized user attribute
			$type = $this->_getParameterAsString($request, c('QK_TYPE'), 'user');
			$request->setAttribute(c('MN_AUTHORIZED_USER'), $aUser);
			$request->setAttribute(c('MN_AUTHORIZED_TYPE'), $this->_getType($type));
			$request->setAttribute('jsEnabled', $session->getAttribute('jsEnabled'));
			$request->setAttribute('isAdminView', ref($aUser->isSiteAdmin() && $session->getAttribute('isAdminView')));

			if ($this->_requiresRegistration) {
				// this page requires that the user is registered

				if ($aUser->getRegistrationTask()) {
					// user is logged in and has an outstanding registration task
					$oRegistrationTask = $aUser->getRegistrationTask();
					$response->sendRedirect($oRegistrationTask->getUri() . '.action');
					return $mapping->findForward(ref('redirect'));
				} else {
					// user is logged in and does not have an outstanding registration task
				}
			}
		} else {
			//dlog('User is not logged in');

			// not executing a login controller, forward to login
			if ($this->_requiresLogin) {
				//dlog('User login is requiredl forward to login page.');
				$session->setAttribute(c('MN_NEXT_PAGE'), ref(substr($request->getRequestURI(), 1) . '?' . $request->getQueryString()));
				$response->sendRedirect('login.action');
				return $mapping->findForward(ref('login'));
			}
		}

		if ($session->getAttribute('ERROR')) {
			$error = $this->readSessionValue($request, 'ERROR');
			def('ERROR', $error);
		}

		if ($session->getAttribute('MESSAGE')) {
			$error = $this->readSessionValue($request, 'MESSAGE');
			def('MESSAGE', $error);
		}

		// don't execute this block for pages that don't require users
		if ($this->_requiresLogin) {
			//dlog('Second login required check');
			$button = trim(strtolower($this->_getParameterAsString($request, c('QUERY_KEY_BUTTON'))));
			$noCache = $this->_getParameterAsBoolean($request, c('QUERY_KEY_NO_CACHE'));
			$hasMessageBoard = 'true' == $this->props->getProperty('project.features.messageBoard');
			$hasWall = 'true' == $this->props->getProperty('project.features.wall');
			$hasRelated = 'true' == $this->props->getProperty('project.features.related');

			// action was cancelled
			if ($button == 'cancel' || $button == 'no') {
				//dlog('Server-side cancel');
				$response->sendRedirect('/index.php' . $this->getHistory($request, 1));
				return $mapping->findForward(ref('redirect'));
			}
				// manage history
			else if (!$noCache && strpos(get_class($this), 'View')) {
				//dlog('Server-side back');
				$h = $session->getAttribute('HISTORY');
				$url = $request->getRequestURI() . '?' . $request->getQueryString();

				// ensure history cache exists
				if (!$h) {
					$h = array();
				}
					// remove cache greater than max size
				else if (10 < sizeof($h)) {
					array_pop($h);
				}

				// prevent double caching on refresh
				if (!sizeof($h) || $h[0] !== $url) {
					array_unshift($h, $url);
					$session->setAttribute(c('MN_HISTORY'), $h);
				}
			}

			// user exists
			if ($aUser) {
				//dlog('Active user exists');
				$S = $this->_getContext($request, $key, $pagename, $aUser);

				// user is not authorized to view content
				if (!$this->_isAuthorized($S, $request, $aUser)) {
					//dlog('User unauthorized to view content');
					return $mapping->findForward(ref('unauthorized'));
				}
					// non-post request, fetch some data
				else if ('get' == strtolower($request->getMethod())) {
					//dlog('Not a post request');
					$aUserId = $aUser->getId();
					$messagen = $uMan->getMessageCount($aUserId, false, 'unread');
					$request->setAttribute(c('MN_MESSAGEN'), $messagen);
				}

				$this->initProperties($request);
			}

			// valid key searchable
			if ($S) {
				//dlog('Searchable found.');
				$hasMessageBoard = $hasMessageBoard && ($S->isMember() || $S->isAdmin() || $S->isMessageBoardPublic());
				$hasRelated = $hasRelated && ($S->isMember() || $S->isAdmin() || $S->isRelatedPublic());
				$hasWall = $hasWall && ($S->isMember() || $S->isAdmin() || $S->isWallPublic());
				$type = $S->getType();

				$hasMessageBoard = $hasMessageBoard && 'true' == $this->props->getProperty('project.features.messageBoard.' . $type);
				$hasRelated = $hasRelated && 'true' == $this->props->getProperty('project.features.related.' . $type);
				$hasWall = $hasWall && 'true' == $this->props->getProperty('project.features.wall.' . $type);

				// set project properties
				$request->setAttribute(c('QK_HAS_MESSAGE_BOARD'), $hasMessageBoard);
				$request->setAttribute(c('QK_HAS_RELATED'), $hasRelated);
				$request->setAttribute(c('QK_HAS_WALL'), $hasWall);
			}
		}

		$request->setAttribute('S', $S);

		if ($this->_hasRequired($aUser, $S, $request)) {
			$stime = time();
			$log->info('=====>>>>>>>> Entering executeActually (' . $request->getMethod() . ') @' . getDatetime($stime));
			$forward = $this->executeActually(&$form, &$request, &$response, $aUser, $S);
			$uMan->shutdown();
			$etime = time();
			$log->info('=====>>>>>>>> Leaving execute took ' . ($etime - $stime) / 1000 . ' seconds, rendering view @' . getDatetime($etime));
		}
		else {
			if (!$key) {
				$log->warn('Missing subject key');
			}
			else {
				$log->warn('Invalid subject key: ' . $key);
			}

			$this->_parseMessage($request, 'Critical Internal Error, User Home Page Restored!');
			$forward = 'home';
		}

		// return the mapping
		return $mapping->findForward($forward);
	}

	protected function initProperties(&$request) {
		$request->setAttribute(c('QUERY_KEY_URL'), ref($request->getRequestURL()));
		$request->setAttribute(c('QUERY_KEY_SEARCH'), ref($request->getQueryString()));

		$searchableTypes = Searchable::getValidTypes();
		foreach ($searchableTypes as $type) {
			if (Searchable::$TYPE_USER != $type) {
				$request->setAttribute('has' . $type, ref('true' == $this->props->getProperty('project.features.' . $type)));
			}

			$uctype = ucfirst($type);
			$nameType = 'name' . $uctype;
			$request->setAttribute($nameType, $this->_getFeatureCustomName($type, true));
			$request->setAttribute($nameType . 's', $this->_getFeatureCustomName($type, true, true));
			$request->setAttribute('lc_' . $nameType, $this->_getFeatureCustomName($type));
			$request->setAttribute('lc_' . $nameType . 's', $this->_getFeatureCustomName($type, false, true));
		}

		// singular-upper case
		$request->setAttribute(c('MN_NAME_FRIEND'), $this->_getFeatureCustomName('friend', true));
		$request->setAttribute(c('MN_NAME_MEMBER'), $this->_getFeatureCustomName('member', true));
		$request->setAttribute(c('MN_NAME_MESSAGE'), $this->_getFeatureCustomName('message', true));
		$request->setAttribute(c('MN_NAME_MESSAGE_BOARD'), $this->_getFeatureCustomName('messageBoard', true));
		$request->setAttribute(c('MN_NAME_RELATED'), $this->_getFeatureCustomName('related', true));
		$request->setAttribute(c('MN_NAME_WALL'), $this->_getFeatureCustomName('wall', true));

		// plural-upper case
		$request->setAttribute(c('MN_NAME_FRIEND') . 's', $this->_getFeatureCustomName('friend', true, true));
		$request->setAttribute(c('MN_NAME_MEMBER') . 's', $this->_getFeatureCustomName('member', true, true));
		$request->setAttribute(c('MN_NAME_MESSAGE') . 's', $this->_getFeatureCustomName('message', true, true));
		$request->setAttribute(c('MN_NAME_MESSAGE_BOARD') . 's', $this->_getFeatureCustomName('messageBoard', true, true));
		$request->setAttribute(c('MN_NAME_RELATED') . 's', $this->_getFeatureCustomName('related', true, true));
		$request->setAttribute(c('MN_NAME_WALL') . 's', $this->_getFeatureCustomName('wall', true, true));
		def('TEMP_MESSAGE_NAME', $this->_getFeatureCustomName('message'));

		// singular-lower case
		$request->setAttribute('lc_' . c('MN_NAME_FRIEND'), $this->_getFeatureCustomName('friend'));
		$request->setAttribute('lc_' . c('MN_NAME_MEMBER'), $this->_getFeatureCustomName('member'));
		$request->setAttribute('lc_' . c('MN_NAME_MESSAGE'), c('TEMP_MESSAGE_NAME'));
		$request->setAttribute('lc_' . c('MN_NAME_MESSAGE_BOARD'), $this->_getFeatureCustomName('messageBoard'));
		$request->setAttribute('lc_' . c('MN_NAME_RELATED'), $this->_getFeatureCustomName('related'));
		$request->setAttribute('lc_' . c('MN_NAME_WALL'), $this->_getFeatureCustomName('wall'));

		// plural-lower case
		$request->setAttribute('lc_' . c('MN_NAME_FRIEND') . 's', $this->_getFeatureCustomName('friend', false, true));
		$request->setAttribute('lc_' . c('MN_NAME_MEMBER') . 's', $this->_getFeatureCustomName('member', false, true));
		$request->setAttribute('lc_' . c('MN_NAME_MESSAGE') . 's', $this->_getFeatureCustomName('message', false, true));
		$request->setAttribute('lc_' . c('MN_NAME_MESSAGE_BOARD') . 's', $this->_getFeatureCustomName('messageBoard', false, true));
		$request->setAttribute('lc_' . c('MN_NAME_RELATED') . 's', $this->_getFeatureCustomName('related', false, true));
		$request->setAttribute('lc_' . c('MN_NAME_WALL') . 's', $this->_getFeatureCustomName('wall', false, true));

		// set attributes from properties
		$host = request_hostname($request->getRequestURL());
		$request->setAttribute(c('MN_PROJECT_EMAIL'), ref('webmaster@' . str_replace('http://', '', $host)));
		$request->setAttribute(c('MN_PROJECT_URL'), $host);
		$request->setAttribute(c('MN_PROJECT_REVISION'), $this->props->getProperty('project.revision'));
		$request->setAttribute('contactEmail', $this->props->getProperty('project.contactEmail'));
		$request->setAttribute('helpHref', $this->props->getProperty('project.helpHref'));
		$request->setAttribute('isAdminInvite', ref('true' === $this->props->getProperty('project.adminInvite')));
		$request->setAttribute('bannerClass', ref('true' === $this->props->getProperty('project.useBannerLayout') ? 'banner' : ''));
	}


	/**
	 * Abstract class to be over-written by child classes, where the 'execute' code goes
	 */
	function executeActually(&$form, &$request, &$response, $aUser, $S) {
		// override in subclass
	}

	/**
	 * Returns the context from the provided key.
	 * @method _getContext
	 * @param  $request {Object} Required. The HTTP Servlet Request.
	 * @param  $key {String} Required. The User DB hash key.
	 * @param  $pn {String} Required. The requested pagename.
	 * @param  $aUser {Object} Required. The authorized user Searchable.
	 * @return {Array} The user context collection of objects.
	 * @access Protected
	 * @since  Release 1.0
	 */
	protected function _getContext($request, $key, $pn, $aUser) {
		$S = null;

		// when authorized user is content owner, then both users in the context are authorized user; preg statement allows us to default to $aUser for certain pages
		if ((!$key && preg_match('/profile|friends|home|account|my/', $pn)) || $key == $aUser->getKey()) {
			$S = new User();
			$S->copySearchable($aUser);
			$S->setIsMember(array(false, true, true));
		}
			// when authorized user is not content owner, then retrieve from the database; defaults to authorized user
		else {
			list($man) = $this->_getServices($request, 'ServiceMember');
			$S = $man->getSearchableByKey($key);

			// searchable exists
			if ($S) {
				$S->setIsMember($man->isMember($S->getId(), $aUser->getId()));
				/*
								if ($aUser->isSiteAdmin() && !$aUser->getWasAdmin()) {
									$S->setIsAdmin(true);
									$S->setIsSuperAdmin(true);
								}
				 */
			}
		}

		return $S;
	}

	/**
	 * Retrieve the custom name for the feature.
	 * @method _getFeatureCustomName
	 * @param key {String} Required. The name of the feature.
	 * @param ucfirst {Boolean} Optional. True, when you want to UCFirst the name.
	 * @param plurzalize {Boolean} Optional. True, when you want to pluralize the name.
	 * @return {String} The admin defined name for feature.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getFeatureCustomName($key, $ucfirst = false, $pluralize = false) {
		$str = $this->props->getProperty('project.name.' . $key);
		if ($ucfirst) {
			$str = trueUCFirst($str);
		}
		return $pluralize ? str_pluralize($str) : $str;
	}


	/**
	 * Retrieves a url from the history cache.
	 * @method getHistory
	 * @param  $request {Object} Required. The HTTP Servlet Request.
	 * @param  $i {Integer} Optional. The number of pages ago to lookup; default is 1 page.
	 * @param  boolean $noConfirm Optional. Indicates if confirm page is not an acceptable last page.
	 * @return {String} The url of desired page.
	 * @access public
	 * @since  release 1.0
	 */
	protected function getHistory($request, $i = 0, $noConfirm=false) {
		$h = $request->getSession()->getAttribute('HISTORY');
		if ($i >= sizeof($h)) {
			return null;
		}

		$url = $h[$i];
		return FALSE === strpos($url, 'confirm.action') ? $url : $this->getHistory($request, ++$i, $noConfirm);
	}


	/**
	 * Get the logger statement for this class.
	 *
	 * @method getLog
	 * @return Logger
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function getLog() {
		return Logger::getLogger('project.action.' . get_class($this));
	}

	/**
	 * Fetches the notification manager singleton.
	 * @method _getNotificationManager
	 * @param request {HttpServletRequest} Required. The current request.
	 * @return {NotificationManager} The notification manager object.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getNotificationManager($request) {
		if (null == $this->_managerNotification) {
			$this->_managerNotification = new NotificationManager($this->props, request_hostname($request->getRequestURL()));
		}

		return $this->_managerNotification;
	}

	/**
	 * Fetches the content manager singleton.
	 * @method _getContentManager
	 * @param request {HttpServletRequest} Required. The current request.
	 * @return {NotificationManager} The content manager object.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getContentManager($request) {
		if (null == $this->_managerContent) {
			$this->_managerContent = new ContentManager($this->props, request_hostname($request->getRequestURL()));
		}

		return $this->_managerContent;
	}

	/**
	 * The pagename for this request.
	 * @method getPagename
	 * @param request {HttpServletRequest} Required. The current request.
	 * @return {String} The pagename from request.
	 * @access Private
	 * @since Release 1.0
	 */
	protected function getPagename($request) {
		return preg_replace('/\/(\w+)\.\w+/', '$1', $request->getRequestURI());
	}

	/**
	 * Get the name of the type; defaults to user
	 *
	 * @method _getType
	 * @param type {string} the name of the type
	 * @return {string} the type name
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getType($type) {
		switch ($type) {
			case 'group':
				return c('FORM_FIELD_VALUE_TYPE_GROUP');
				break;

			case 'user':
			default:
				return c('FORM_FIELD_VALUE_TYPE_USER');
		}
	}


	/**
	 * Retrieves the header according to the variables supplied
	 *
	 * @method _getHeader
	 * @param name {string} the name of the Searchable
	 * @param type {string} the type of the Searchable
	 * @param fl {boolean} true, when this is the contect owner
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getHeader($name, $type, $fl) {
		$msg = $fl ? array('Your') : array(getApostrophedName($name));
		array_push($msg, ucfirst($type));
		return implode(' ', $msg);
	}

	/**
	 * Returns a list of desired services.
	 * @method _getManagers
	 * @param  HttpServletRequest $request Required. The current request.
	 * @param  string $arg1 Required. A service class name.
	 * @param  string $argX Optional. Any number of additional service class names.
	 * @return array List of services.
	 * @since  version 1.0
	 * @access protected
	 */
	protected function _getServices($request) {
		$aServices = array();
		$args = func_get_args();
		array_shift($args);

		foreach ($args as $klass) {
			array_push($aServices, new $klass($this->getDataSource($request)));
		}

		return $aServices;
	}

	/**
	 * Iterates through the collection of Objects and tests if 'id' matches the 'getId' Function
	 *
	 * @method getObjectFromArrayById
	 * @param object {array} collection of Objects
	 * @param id {Integer} DB PK
	 * @return {Object} an instance of Object in collection
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function &getObjectFromArrayById($object, $id) {
		foreach ($object as $v) {
			if ($id == $v->getId()) {
				return ref($v);
			}
		}

		return ref(null);
	}

	/**
	 * Retrieve an boolean from the request object by its hash key; has no default, because sub-function ensures state
	 *
	 * @method _getParameterAsBoolean
	 * @param req {HttpServletRequest} Servlet HTTP request object
	 * @param key {string} the parameter hash key
	 * @return {boolean} the parameter as a valid boolean
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getParameterAsBoolean($request, $key) {
		return getValidatedBoolean($request->getParameter($key));
	}


	/**
	 * Retrieve an integer from the request object by its hash key; when value is not found (or 0), then use default
	 *
	 * @method _getParameterAsInteger
	 * @param req {HttpServletRequest} Servlet HTTP request object
	 * @param key {string} the parameter hash key
	 * @param dfl {Integer} the default integer value; default is ZERO
	 * @return {Integer} OPTIONAL: the parameter as a valid integer
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getParameterAsInteger($request, $key, $dfl = 0) {
		return getDBSafeInteger($request->getParameter($key), $dfl);
	}


	/**
	 * Retrieve a string from the request object by its hash key
	 *
	 * @method _getParameterAsString
	 * @param req {HttpServletRequest} Servlet HTTP request object
	 * @param key {string} the parameter hash key
	 * @param dfl {string} OPTIONAL: the default string value; default is empty String
	 * @param arr {array} OPTIONAL: array of characters to allow; default is empty Array
	 * @return {string} the parameter as a valid string
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getParameterAsString($request, $key, $dfl = '', $arr = array()) {
//		return getDBSafeString(urldecode($request->getParameter($key)), $dfl, $arr);
		return getDBSafeString($request->getParameter($key), $dfl, $arr);
	}


	/**
	 * Retrieve a string from the request object by its hash key
	 *
	 * @method _getParameterAsHTMLFreeString
	 * @param req {HttpServletRequest} Servlet HTTP request object
	 * @param key {string} the parameter hash key
	 * @param dfl {string} OPTIONAL: the default string value; default is empty String
	 * @return {string} the parameter as a valid string
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getParameterAsHTMLFreeString($request, $key, $dfl = '') {
//		$value = Sanitize::html(urldecode($request->getParameter($key)), true);
		$value = Sanitize::html($request->getParameter($key), true);
		return $value ? $value : $dfl;
	}

	/**
	 * Fetches the access from the request.
	 * @method _getRequestAccess
	 * @param request {HttpServletRequest} Required. The HTTP request.
	 * @param suffix {String} Optional. The parameter name suffix (use when sending multiple access from client).
	 * @param default {String} Optional. The value to set the access to, if it isn't value.
	 * @return {String} The access.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getRequestAccess($request, $suffix = '', $default = '') {
		$access = $this->_getParameterAsString($request, c('QUERY_KEY_ACCESS') . $suffix);
		return Searchable::getValidAccess($access, $default);
	}

	/**
	 * Fetches the users passed in via the checkbox widget.
	 * @method _getUsersFromCheckboxes
	 * @param  $request {HttpServletRequest} Required. The HTTP request.
	 * @param  $S {Searchable} Required. The active user.
	 * @param  $man {BaseManager} Required. The database communication object.
	 * @return {String} The access.
	 * @access Protected
	 * @since  Release 1.0
	 */
	protected function _getUsersFromCheckboxes($request, $S, $man) {
		$messageType = $this->_getParameterAsString($request, 'message' . c('QK_TYPE'));

		$checkedSearchables = $request->getParameterValues('searchables');
		$n = sizeof($checkedSearchables);

		if ('all' == $messageType) {
			$params[c('QK_TYPE')] = Searchable::$TYPE_USER;

			if ($S && c('ADMIN_KEY') != $S->getKey()) {
				if ($S->isUser()) {
					$params['ownerId'] = $S->getId();
				}
			}

			list($searchables, $n) = $man->readSearchables($params);
		}
		else if ($n) {
			list($searchables) = $man->readSearchables(array('sId' => $checkedSearchables));
		}

		$users = array();
		$sb = array();
		$i = 0;

		$mSearchables = array();
		$n = sizeof($searchables);

		while ($n) {
			$aSearchables = array();

			// iterate on the $checkedSearchables and fetch users
			foreach ($searchables as $s) {
				$sId = $s->getId();

				if (!array_key_exists($sId, $mSearchables)) {
					$mSearchables[$sId] = 1;

					if ($s->isUser()) {
						array_push($users, $s);
						$sb[$i] = $s->getName();
						$i += 1;
					}
					else {
						array_push($aSearchables, $sId);
					}
				}
			}

			if (sizeof($aSearchables)) {
				list($searchables, $n) = $man->readSearchables(array('ownerId' => $aSearchables, 'memberStatus' => Searchable::$STATUS_ACTIVE));
			}
			else {
				$n = 0;
			}
		}

		return $users;
	}


	/**
	 * Returns an SQL safe key, only alpha-numeric
	 *
	 * @method _getValidatedKey
	 * @param key {string} a database key
	 * @return {string} the hack safe key
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getValidatedKey($key) {
		return Sanitize::paranoid($key);
	}

	/**
	 * True, when requirements are met. Should overwritten by child class.
	 * @method _hasRequired
	 * @param aUser {Searchable} Required. The requester.
	 * @param S {Searchable} Required. The requested context.
	 * @return {Boolean} True, when requirements are met.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _hasRequired($aUser, $S, $request) {
		return true;
	}

	/**
	 * True, when Searchable is authorized to view content. Should overwritten by child class.
	 * @method _isAuthorized
	 * @param S {Searchable} Required. The requester.
	 * @return {Boolean} True, when requirements are met.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _isAuthorized($S) {
		return true;
	}

	/**
	 * Parses messages and errors, then writes them to the session for the UI.
	 * @method _parseMessage
	 * @param  $request {Object} Required. The HTTP Servlet Request.
	 * @param  $msg {String} Required. The message to parse.
	 * @param  $r1 {String} Optional. A replacement value for {0}.
	 * @param  $rN {String} Optional. A replacement value for {N-1}.
	 * @return {Array} The type of message and the message.
	 * @access Protected
	 * @since  Release 1.0
	 */
	protected function _parseMessage($request, $msg, $r1 = null, $rN = null) {
		$session = $request->getSession();

		if ('M:' == substr($msg, 0, 2)) {
			$message = substr($msg, 2);
			$type = 'MESSAGE';
		}
			/*else if ('E:' == substr($msg, 0, 2)) {
			 $message = substr($msg, 2);
			 $type = 'ERROR';
		 }*/
		else {
			$message = $msg;
			$type = 'ERROR';
		}

		for ($i = 2, $j = func_num_args(); $i < $j; $i += 1) {
			$t = func_get_arg($i); // can't pass func_get_arg directly into another PHP function
			$message = str_replace('{' . ($i - 2) . '}', $t, $message);
		}

		if ('MESSAGE' != $type) {
			$this->getLog()->error($message);
		}
		$session->setAttribute($type, $message);
		return array($type, $message);
	}

	/**
	 * Reads the project properties from a file.
	 * @method readConfiguration
	 * @access private
	 */
	private function readConfiguration() {
		$config = c('Project::CONFIG');
		$is =& Clazz::getResourceAsStream($config);
		if (is_null($is)) {
			return;
		}
		$this->props->load($is);
		$is->close();
	}

	/**
	 * Reads a value from the session and then deletes the vlaue from the session.
	 * @method readSessionValue
	 * @param  $request {Object} Required. The HTTP Servlet Request.
	 * @param  $key {String} Required. The session key.
	 * @return {Object} The value in session at key.
	 * @access Protected
	 * @since  Release 1.0
	 */
	protected function readSessionValue($request, $key) {
		$session = $request->getSession();
		$value = $session->getAttribute($key);
		$session->removeAttribute($key);
		return $value;
	}

	/**
	 * Replaces the existing aUser with an updated one, if the provided Searchable has the same id.
	 * @method _replaceAuthorizedUser
	 * @access protected
	 * @param  $request
	 * @param  $aUser
	 * @param  $S
	 */
	protected function _replaceAuthorizedUser($request, &$aUser, $S) {
		if ($aUser->getId() === $S->getId()) {
			$aUser->copySearchable($S);
			$request->getSession()->setAttribute('User', $aUser);
		}
	}

	/**
	 * Updated the property of 'key' with the string 'true'|'false'.
	 * @method setPropertyBoolean
	 * @param key {String} Required. The property key.
	 * @param b {Boolean} Required. The boolean state.
	 * @access Protected
	 * @since release 1.0
	 */
	protected function setPropertyBoolean($key, $b) {
		$this->props->setProperty($key, $b ? 'true' : 'false');
	}

	/**
	 * Uploading an image from request
	 *
	 * @method _uploadImage
	 * @param key {string} the query param key
	 * @param dir {string} the directory of file
	 * @param name {string} the filename of result
	 * @param convert {string} OPTIONAL: filetype to convert to; defualt is empty string
	 * @return {boolean} true, when successfully uploaded
	 * @access protected
	 * @since release 1.0
	 */
	protected function _uploadImage($key, $dir, $name, $convert = '') {
		$file = $_FILES[$key];
		$WWW_ROOT = substr($_SERVER['SCRIPT_FILENAME'], 0, strpos($_SERVER['SCRIPT_FILENAME'], 'index.php'));

		if ($file && $file['name']) {
			$uploader = new upload($file);
			$uploader->file_new_name_body = $name;
			$uploader->file_overwrite = true;
			$uploader->image_resize = false;

			if ($convert) {
				$uploader->image_convert = $convert;
			}

			$url = $WWW_ROOT . $dir . $name . '.' . $convert;
			if (file_exists($url)) {
				unlink($url);
			}
			$uploader->process($WWW_ROOT . $dir);

			if ($uploader->processed) {
				$this->getLog()->warn('Image uploaded successfully (' . $file['name'] . ').');
			}
			else {
				$this->getLog()->error($uploader->error);
			}

			return $uploader->processed;
		}
		else {
			$this->getLog()->warn('No image provided for upload.');
		}

		return false;
	}

	/**
	 * Updates the properties file from the cached hashmap.
	 * @method writeProperties
	 * @protected
	 * @since release 1.0
	 */
	protected function writeProperties() {
		$this->props->store(ref(c('ROOT_DIR') . 'WEB-INF' . DIRECTORY_SEPARATOR . 'classes' . DIRECTORY_SEPARATOR . c('Project::CONFIG')), '# == Setup project properties ==');
	}
}
?>
