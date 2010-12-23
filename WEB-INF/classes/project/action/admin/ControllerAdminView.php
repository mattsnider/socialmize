<?php
import('project.action.admin.ControllerAdmin');

/**
 * @package project.action.admin
 */
class ControllerAdminView extends ControllerAdmin {

	/**
	 * @Override
	 */
	function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$l = $this->getLog();

		$page = $this->_getParameterAsString($request, c('QUERY_KEY_PAGE'));
		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'));

		list($man, $servPW) = $this->_getServices($request, 'UserManager', 'ServiceProfileWidget');

		$scripts = array('admin');
		$styles = array('admin', 'colorpicker');

		$DS = DIRECTORY_SEPARATOR;

		// ensures we have a valid page
		switch ($page) {
			case 'dash':
				switch ($task) {
					case 'more':

						break;

					default:
						$params = array(
							c('QUERY_KEY_LIMIT') => 3,
							c('QUERY_KEY_SORT') => 'ORDER BY `last_login` DESC',
							c('QK_TYPE') => Searchable::$TYPE_USER,
							Searchable::$TYPE_USER => true
						);
						list($lastLoginUsers) = $man->readSearchables($params);
						$request->setAttribute('lastLoginUsers', $lastLoginUsers);

						$params = array(
							c('QUERY_KEY_LIMIT') => 3,
							c('QUERY_KEY_SORT') => 'ORDER BY `modified` DESC'
						);
						list($lastUpdatedSearchables) = $man->readSearchables($params);
						$request->setAttribute('lastUpdatedSearchables', $lastUpdatedSearchables);

						$userCount = 20;
						$activeUserCount = 10;

						$params = array(
							c('QUERY_KEY_LIMIT') => 1,
							c('QK_TYPE') => Searchable::$TYPE_USER,
							Searchable::$TYPE_USER => true
						);
						list($null, $userCount) = $man->readSearchables($params);
						$params = array(
							c('QUERY_KEY_LIMIT') => 1,
							c('QK_TYPE') => Searchable::$TYPE_USER,
							Searchable::$TYPE_USER => true,
							'lastLogin' => getDatetime(time() - (86400 * 14))
						);
						list($null, $activeUserCount) = $man->readSearchables($params);
						$request->setAttribute('userCount', $userCount);
						$request->setAttribute('activeUserCount', $activeUserCount);
						$request->setAttribute('userActivePercent', round($activeUserCount / $userCount * 100, 1));

						$task = 'stats';
				}

				break;

			case 'custom':
				// fetch the styles
				$customCssMgr = new CustomCSSManager();
				$cHash = $customCssMgr->getData();

				$history = $customCssMgr->getCustomizationHistory();

				$cHash['hasFavicon'] = false; // todo: figure out how to popuplate this

				$request->setAttribute(c('MN_CUSTOMIZATION'), $cHash);
				$request->setAttribute(c('MN_CUSTOMIZATION_HISTORY'), $history);
				$request->setAttribute(c('MN_CUSTOMIZATION_HISTORY_LENGTH'), sizeof($history));
				$request->setAttribute('checkedUseBanner', $this->getCheckedState('project.useBannerLayout'));
				break;

			case 'content':
				switch ($task) {
					case 'content':
						$stask = $this->_getParameterAsString($request, c('QK_SUB_TASK'));
						$cm = $this->_getContentManager($request);
						$dir = $cm->getDir();
						$contents = array();
						$currentContent = '';

						if (is_dir($dir)) {
							if ($dh = opendir($dir)) {
								while (($file = readdir($dh)) !== false) {
									if (strpos($file, '.txt')) {
										$contentName = str_replace('.txt', '', $file);
										array_push($contents, $contentName);

										if (!$currentContent && (!$stask || $stask === $contentName)) {
											$currentContent = str_replace('<br />', "\n", file_get_contents($dir . '/' . $file));
											$currentContent = preg_replace("/\<.*?\>/", '', $currentContent);
										}
									}
								}
								closedir($dh);
							}
						}

						$request->setAttribute('currentContent', str_replace('<br/>', "\n", $currentContent));
						$request->setAttribute('contents', $contents);
						$request->setAttribute(c('QK_SUB_TASK'), $stask);
						break;
					case 'field':
						$status = array(Searchable::$STATUS_ACTIVE, Searchable::$STATUS_INACTIVE);
						$widgets = $servPW->getProfileWidgetsBySearchableType(null, $status, $status);
						$request->setAttribute(c('MN_WIDGETS'), $widgets);
						break;
					case 'registration':
						$regMan = new ServiceRegistration($this->getDataSource($request));
						$oRegTasks = $regMan->readRegistrationTasks(array());
						$request->setAttribute('registrationTasks', $oRegTasks);
						break;
					default:
						$task = 'email';
						$stask = $this->_getParameterAsString($request, c('QK_SUB_TASK'));
						$nm = $this->_getNotificationManager($request);
						$dir = $nm->getDir();
						$emails = array();
						$currentEmail = '';

						if (is_dir($dir)) {
							if ($dh = opendir($dir)) {
								while (($file = readdir($dh)) !== false) {
									if (strpos($file, '.txt')) {
										$emailName = str_replace('.txt', '', $file);
										array_push($emails, $emailName);

										if (!$currentEmail && (!$stask || $stask === $emailName)) {
											$currentEmail = str_replace('<br />', "\n", file_get_contents($dir . '/' . $file));
										}
									}
								}
								closedir($dh);
							}
						}

						$i = strpos($currentEmail, "\n");
						$subject = substr($currentEmail, 0, $i);
						$message = substr($currentEmail, $i + 1);

						$request->setAttribute(c('MN_EMAIL'), str_replace('<br/>', "\n", $message));
						$request->setAttribute(c('MN_EMAILS'), $emails);
						$request->setAttribute(c('MN_SUBJECT'), $subject);
						$request->setAttribute(c('QK_SUB_TASK'), $stask);
						break;
				}
				break;

			case 'message':
				switch ($task) {
					default:
						$body = '';
						$subject = '';
						$request->setAttribute(c('QUERY_KEY_BODY'), $body);
						$request->setAttribute(c('QUERY_KEY_SUBJECT'), $subject);
						$request->setAttribute(c('QK_TYPE'), ref('admin'));
						$request->setAttribute(c('QUERY_KEY_KEY') . 'By', c('ADMIN_KEY'));

						$task = 'message';
						array_push($styles, $task);
						array_push($scripts, $task);
						break;

					case 'news':
						$mid = $this->_getParameterAsInteger($request, c('QUERY_KEY_MESSAGE_ID'));

						$articles = $man->getNews();
						$article = $mid ? $man->getNewsById($mid) : new News();

						$request->setAttribute(c('MN_ARTICLE'), $article);
						$request->setAttribute(c('MN_ARTICLES'), $articles);
						$request->setAttribute(c('MN_ARTICLES_LENGTH'), count($articles));
						break;
				}
				break;

			case 'searchable':
				switch ($task) {
					case 'group':
						// new contacts params
						$params = array(
							c('QK_TYPE') => Searchable::$TYPE_GROUP
						);

						// retrieve new contacts
						list($groups, $groupn) = $man->readSearchables($params);
						$request->setAttribute('groups', $groups);
						$request->setAttribute('groupn', $groupn);
						break;

					case 'network':
						$params = array(
							c('QK_TYPE') => Searchable::$TYPE_NETWORK /*,
							'memberId' => null*/
						);

						// retrieve new contacts
						list($networks, $networkn) = $man->readSearchables($params);
						$request->setAttribute('networks', $networks);
						$request->setAttribute('networkn', $networkn);
						break;

					case 'user':
						break;

					case 'pending':
						$params = array();
						$params[c('QUERY_KEY_STATUS')] = Searchable::$STATUS_PENDING;
						$params[c('QK_PENDING')] = Searchable::$PENDING_BITMASK_APPROVAL;
						list($pendingSearchables, $pendingSearchablen) = $man->readSearchables($params);
						$request->setAttribute('pending', $pendingSearchables);
						$request->setAttribute('showPending', ref($pendingSearchablen ? '' : 'displayNone'));
						$request->setAttribute('hidePending', ref($pendingSearchablen ? 'displayNone' : ''));
						break;

					default:
						$request->setAttribute('checkedAdminInvite', $this->getCheckedState('project.adminInvite'));
						$request->setAttribute('checkedRequireRegistration', $this->getCheckedState('project.requiresRegistration'));
						$request->setAttribute('checkedRequireConfirm', $this->getCheckedState('project.requiresConfirm'));
						$request->setAttribute('emailMask', $this->props->getProperty('project.emailMask'));
						$task = 'configurationSignup';
				}
				break;

			default:
				switch ($task) {
					case 'configuration':
						$request->setAttribute('contactEmail', $this->props->getProperty('project.contactEmail'));
						$request->setAttribute('helpHref', $this->props->getProperty('project.helpHref'));
						break;

					case 'modules':
						$checkedStateSearchables = array();

						$types = Searchable::getValidTypes();

						foreach ($types as $type) {
							if (Searchable::$TYPE_USER != $type) {
								$checkedStateSearchables[$type] = $this->getCheckedState('project.features.' . $type);
							}
						}

						$modules = array( // todo: this should be populated from a list of installed modules
							'messageBoard',
							'related',
							'wall'
						);

						$propKey = 'project.features.';
						$checkedStateModules = array();

						foreach ($modules as $module) {
							$checkedStateModules[$module] = array();
							$checkedStateModules[$module]['general'] = $this->getCheckedState($propKey . $module);

							foreach ($types as $type) {
								$checkedStateModules[$module][$type] = $this->getCheckedState($propKey . $module . '.' . $type);
							}
						}

						$request->setAttribute(c('MN_CHECKED_SEARCHABLES'), $checkedStateSearchables);
						$request->setAttribute(c('MN_CHECKED_MODULES'), $checkedStateModules);
						break;

					case 'nameModules':
						$request->setAttribute(c('MN_NAME_FRIEND'), $this->props->getProperty('project.name.friend'));
						$request->setAttribute(c('MN_NAME_GROUP'), $this->props->getProperty('project.name.group'));
						$request->setAttribute(c('MN_NAME_MEMBER'), $this->props->getProperty('project.name.member'));
						$request->setAttribute(c('MN_NAME_MESSAGE'), $this->props->getProperty('project.name.message'));
						$request->setAttribute(c('MN_NAME_MESSAGE_BOARD'), $this->props->getProperty('project.name.messageBoard'));
						$request->setAttribute(c('MN_NAME_RELATED'), $this->props->getProperty('project.name.related'));
						$request->setAttribute(c('MN_NAME_WALL'), $this->props->getProperty('project.name.wall'));
						break;

					case 'profanity':
						break;

					default:
						$task = 'nameProject';
				}

				$page = 'config';
				break;
		}

		// Core page variables
		$request->setAttribute(c('MN_STYLES'), $styles);
		$request->setAttribute(c('MN_SCRIPTS'), $scripts);

		$request->setAttribute(c('MN_PAGE'), $page);
		$request->setAttribute(c('QUERY_KEY_TASK'), $task);

		/*
		// verifies that any retrieved user exists
		if (!empty($user)) {
			$request->setAttribute(c('MN_USER'), $user);
		}
		*/

		return ref('success');
	}

	/**
	 * Determine if the property for key is true, and when true return the checked attribute.
	 * @method getCheckedState
	 * @param key {String} Required. The property key.
	 * @private
	 */
	private function getCheckedState($key) {
		return 'true' === $this->props->getProperty($key) ? 'checked="checked"' : '';
	}
}

?>
