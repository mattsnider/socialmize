<?php
import('project.action.admin.ControllerAdmin');
import('project.service.GroupManager');
import('include.upload');
import('include.XMLParser');
import('horizon.io.FileWriter');

def('QUERY_KEY_USERNAME_A', 'usernameA');
def('QUERY_KEY_USERNAME_B', 'usernameB');

/**
 * @package project.action.admin
 */
class ControllerAdminSubmit extends ControllerAdmin {

	/**
	 * @Override
	 */
	function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$l = $this->getLog();
		$message = '';
		$error = '';

		$pAC = c('PARANOID_ALLOWED_AUTOCOMPLETE');

		$DS = DIRECTORY_SEPARATOR;

		// fetch params
		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'));
		$stask = $this->_getParameterAsString($request, c('QK_SUB_TASK'));
		$page = $this->_getParameterAsString($request, c('QUERY_KEY_PAGE'), 'config');
		$username = $this->_getParameterAsString($request, c('QUERY_KEY_NAME'), '', $pAC);
		$isAjax = $this->_getParameterAsBoolean($request, c('QK_IS_AJAX'));

		$pageName = $this->getPagename($request);

		// fetch management objects
		list($man) = $this->_getServices($request, 'UserManager');

		// authorized
		if ('reset' === $task) {
			return ref('error');
		}

		// validate page forward
		switch ($page) {
			case 'config':
			case 'content':
			case 'custom':
			case 'message':
			case 'searchable':
				break;
			default:
				$page = 'config';
				break;
		}

		// do task
		switch ($task) {

			// become another user
			case 'become':
				$user = $man->getUsersByExactName($username);

				if ($user) {
					$request->getSession()->setAttribute('isAdminView', ref(false));
					$request->getSession()->setAttribute('oUser', $aUser);
					$user->setWasAdmin(true);
					$aUser =& $user;
					$request->getSession()->setAttribute('User', $aUser);

					$this->_parseMessage($request, 'M:You have become user "{0}".', $user->getName());
					return ref('home'); // do not move this, as user may not be an admin
				}
				else {
					$error = 'User change did not work.';
				}

				$task = 'user';
				break;

			// configuration
			case 'configuration':
				$contactEmail = $this->_getParameterAsString($request, c('QK_CONTACT_EMAIL'), '', c('PARANOID_ALLOWED_EMAIL'));
				$helpHref = $this->_getParameterAsString($request, c('QK_HELP_HREF'), '', c('PARANOID_ALLOWED_EMAIL'));

				$this->props->setProperty('project.contactEmail', $contactEmail);
				$this->props->setProperty('project.helpHref', $helpHref);

				// write properties
				$this->writeProperties();
				$message = 'Configuration updated.';
				break;

			// configuration
			case 'configurationSignup':
				$adminInvite = $this->_getParameterAsBoolean($request, c('QK_ADMIN_INVITE'));
				$requiresRegistration = $this->_getParameterAsBoolean($request, c('QK_REQUIRE_REGISTRATION'));
				$requiresTerms = $this->_getParameterAsBoolean($request, c('QK_REQUIRE_TERMS'));
				$requiresConfirm = $this->_getParameterAsBoolean($request, c('QK_REQUIRE_CONFIRM'));
				$emailMask = $this->_getParameterAsString($request, c('MN_EMAIL'), '', c('PARANOID_ALLOWED_EMAIL'));

				$this->props->setProperty('project.adminInvite', ref($adminInvite ? 'true' : 'false'));
				$this->props->setProperty('project.requiresRegistration', ref($requiresRegistration ? 'true' : 'false'));
				$this->props->setProperty('project.requiresConfirm', ref($requiresConfirm ? 'true' : 'false'));
				$this->props->setProperty('project.emailMask', $emailMask);

				// write properties
				$this->writeProperties();
				$message = 'Configuration updated.';
				break;

			// connect to users
			case 'connect':
				list($message, $error) = $this->_handleUserConnection($request);
				$task = 'user';
				break;

			// customize project experience
			case 'content':
				$cm = $this->_getContentManager($request);
				$stask = $this->_getParameterAsString($request, 'contents');
				$content = "\n" . $this->_getParameterAsString($request, 'content', '', c('PARANOID_ALLOWED_EMAIL')) . "\n"; // required for regex
				$content = preg_replace('/(\n+[^0-9\s].*?(?=\n+))/', '<p>$1</p>', $content);
				
				if (c('QUERY_KEY_TERMS') === $stask) {
					$content = preg_replace('/(\d+\.\s.*?(?=\<p\>))/', '<h3>$1</h3>', $content);
				}

				$file = $cm->getDir() . $stask . '.txt';
				$content = str_replace("\n", "", nl2br($content));
				$xml = '';

				if (is_file($file)) {
					if (file_put_contents($file, $content)) {
						$message = 'Content successfully updated.';
					}
					else {
						$l->error("Content `$stask` did not save successfully.");
						$error = 'Content did not update, could not write. Please notify contact your system administrator.';
					}
				}
				else {
					$l->error("Content `$file` is missing.");
					$error = 'Content did not update, missing the file. Please notify contact your sales rep.';
				}
				
				break;

			// customize project experience
			case 'adv':
			case 'background':
			case 'color':
			case 'fonts':
			case 'history':
			case 'themes':
				$this->_handleUpdateCustomizationRequest($request, $task);
				$message = $this->props->getProperty('project.nameUC') . ' Succesfully Customized.';

				switch ($task) {
					case 'background':
						$task = 'themes';
						break;
					case 'color':
						$task = 'fonts';
						break;
				}
				break;

			// customize project experience
			case 'email':
				$stask = $this->_getParameterAsString($request, c('MN_EMAILS'));
				$body = $this->_getParameterAsString($request, c('MN_EMAIL'), '', c('PARANOID_ALLOWED_EMAIL'));
				$subject = $this->_getParameterAsString($request, c('MN_SUBJECT'), '', c('PARANOID_ALLOWED_EMAIL'));

				$content = $subject . "\n" . str_replace("\n", "", nl2br($body));

				$nm = $this->_getNotificationManager($request);
				$dir = $nm->getDir();
				$file = $dir . $stask . '.txt';
				$xml = '';

				if (is_file($file)) {
					if (file_put_contents($file, $content)) {
						$message = 'Email content updated.';
					}
					else
					{
						$l->error("Email $stask did not save successfully.");
						$error = 'Email did not update, could not write. Please notify contact your system administrator.';
					}
				}
				else
				{
					$l->error("Email $file is missing.");
					$error = 'Email did not update, missing the file. Please notify contact your sales rep.';
				}
				break;

			// update a profile widget fields
			case 'field':
				$page = 'content';
				$subtask = $this->_getParameterAsString($request, c('QK_SUB_TASK'));
				$isDelete = $this->_getParameterAsBoolean($request, c('QK_DELETE'));
				$error = '';
				$url = '';
				$message = 'Successfully updated!';
				$pwId = 0;
				$pwfId = 0;
				$task = 'field';

				list($man) = $this->_getServices($request, 'ServiceProfileWidget');

				switch ($subtask) {
					case 'pw':
						if ($isDelete) {
							$pwId = $this->_getParameterAsInteger($request, c('QK_PW_ID'));

							if ($pwId) {
								$man->deleteProfileWidget($pwId);
								$message = 'Successfully deleted!';
								$url = 'admin.action?' . c('QUERY_KEY_PAGE') . '=F';
							}
							else {
								return ref('error');
							}
						}
						else {
							list($error, $pwId) = $this->_handleUpdateProfileWidgetRequest($request);

							// not actually an error, returning the PWF ID
							if (!$error && $pwId) {
								$url = str_replace(c('QK_PW_ID') . '=0', c('QK_PW_ID') . '=' . $pwId, $_SERVER['HTTP_REFERER']);
							}
						}
						break;

					case 'pwf':
						if ($isDelete) {
							$pwfId = $this->_getParameterAsInteger($request, c('QK_PWF_ID'));
							$pwId = $this->_getParameterAsInteger($request, c('QK_PW_ID'));

							if ($pwfId) {
								$man->deleteProfileWidgetField($pwfId);
								$url = 'profileWidget.action?' . c('QK_PW_ID') . '=' . $pwId . '&' . c('QK_SHOW_DETAILS') . '=T';
								$message = 'Successfully deleted!';
							}
							else {
								return ref('error');
							}
						}
						else {
							list($error, $pwf) = $this->_handleUpdateProfileWidgetFieldRequest($request);
							if ($pwf) {
								$pwfId = $pwf->getId();
								$pwId = $pwf->getProfileWidgetId();
							}
						}
						break;

					case 'order':
						$idA = $this->_getParameterAsInteger($request, c('QK_PW_ID') . 'A');
						$idB = $this->_getParameterAsInteger($request, c('QK_PW_ID') . 'B');
						$orderA = $this->_getParameterAsInteger($request, c('QK_PW_ORDER') . 'A');
						$orderB = $this->_getParameterAsInteger($request, c('QK_PW_ORDER') . 'B');
						$man->updateProfileWidgetOrder($idA, $idB, $orderA, $orderB);
						break;

					default: // nothing for now
						break;
				}

				if ($isAjax) {
					$response->setContentType('text/xml; charset="UTF-8"');
					$xml = '<' . c('QK_PWF_ID') . ' value="' . $pwfId . '"/><' . c('QK_PW_ID') . ' value="' . $pwId . '"/>';
					$request->setAttribute('xml', $xml);
					return ref('xml');
				} else if ($error) {
					$response->sendRedirect(ref($_SERVER['HTTP_REFERER']));
					$this->_parseMessage($request, $error);
					return ref('forward');
					// todo: handle non-AJAX situations
				} else if ($url) {
					$response->sendRedirect($url);
					$this->_parseMessage($request, 'M:' . $message);
					return ref('forward');
				}
				break;

			// send a message to all users
			case 'message':
				$body = $this->_getParameterAsHTMLFreeString($request, c('QUERY_KEY_BODY'));
				$type = $this->_getParameterAsString($request, c('QK_TYPE'));
				$sIds = $request->getParameterValues('searchables');
				$subject = 'Message from the ' . $this->props->getProperty('project.nameUC') . ' team: ';

				$params = array(c('QK_TYPE') => $type, 'nsId' => 1);

				switch ($type)
				{
					case Searchable::$TYPE_USER:
						$params['sId'] = $sIds;
						break;
					case Searchable::$TYPE_GROUP:
						// todo: improve this logic, we shouldn't need to iterate through all the groups, this is just an easy way out
						$params['sId'] = $sIds;
						list($groups) = $man->readSearchables($params);
						$memberIds = array();

						foreach ($groups as $s)
						{
							$iparams = array('memberStatus' => Searchable::$STATUS_ACTIVE, 'ownerId' => $s->getId(), c('QUERY_KEY_LIMIT') => 9999);
							list($results) = $man->readSearchables($iparams);
							foreach ($results as $s2)
							{
								array_push($memberIds, $s2->getId());
							}
						}

						$memberIds = array_unique($memberIds);
						$params['sId'] = $memberIds;
					// fallthrough is intentional

					default:
						$params[c('QK_TYPE')] = Searchable::$TYPE_USER;
				}

				list($users, $usern) = $man->readSearchables($params);

				$tempUser = new User();
				$tempUser->setId(c('ADMIN_ID'));

				$m = new Message();
				$m->setBody($body);
				$m->setSender($tempUser);
				$m->setSubject($subject);
				$m->setThread(createHash($tempUser->getId(), time()));

				// iterate on the userkeys and fetch users
				foreach ($users as $o)
				{
					// users should not be able to message themselves
					if ($o->getId() !== $aUser->getId()) {
						$nm = $this->_getNotificationManager($request);
						$nm->notifyByUser($o, NotificationManager::$MESSAGE_RECEIVED, array('BODY' => $body, 'NAME' => 'Administrator'));
					}
				}

				$man->saveMessageBatch($m, $users);
				$message = 'Your message was sent to ' . $usern . ' ' . pluralize('user', $usern) . '.';
				break;

			// update a feature setting
			case 'modules':
				$this->_handleUpdateFeaturesRequest($request);
				$message = 'Features Updated Successfully.';
				break;

			// rename modules
			case 'nameModules':
				$this->_handleRenameFeatureRequest($request);
				$message = 'Features Renamed Successfully.';
				break;

			// update a property
			case 'nameProject':
				$projectNameUC = $this->_getParameterAsString($request, c('QUERY_KEY_NAME'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS'));
				$projectName = str_replace(' ', '_', preg_replace('/[^ 0-9a-z]/', '', strtolower($projectNameUC)));
				$page = 'P';

				// requires a value
				if ($projectName) {
					$old = $this->props->getProperty('project.nameUC');

					// update the properties
					$this->props->setProperty('project.name', $projectName);
					$this->props->setProperty('project.nameUC', $projectNameUC);

					// write properties
					$this->writeProperties();

					$message = '"' . $old . '" Successfully Renamed To "' . $projectNameUC . '".';
				}
				else
				{
					$error = 'Project Name Not Updated! Project name was invalid, please use only letters, numbers, and spaces.';
				}
				break;

			// change the network of a user
			case 'network':
				$isFirstNetwork = ($aUser == $S);
				$newNetwork = null;
				$msg = $this->_handleNetworkRequest($request, $isFirstNetwork ? null : $S, $aUser, $newNetwork);
				list($type) = $this->_parseMessage($request, $msg);

				if ($newNetwork) {
					$S = $newNetwork;
				}

				if ($isAjax) {
					$response->setContentType('text/xml; charset="UTF-8"');
					//$xml = '<' . c('QK_PWF_ID') . ' value="' . $pwfId . '"/><' . c('QK_PW_ID') . ' value="' . $pwId . '"/>';
					$xml = 'todo: fix this';
					$request->setAttribute('xml', $xml);
					return ref('xml');
				} else if ('ERROR' == $type) {
					$response->sendRedirect(ref($_SERVER['HTTP_REFERER']));
					return ref('forward');
				}

				// forward back to the network page
				if (strpos($msg, 'success')) {
					//                    $response->sendRedirect($isFirstNetwork ? '/admin.action?page=searchable&task=network' : '/network.action?' . c('QUERY_KEY_KEY') . '=' . $S->getKey());
					//					$response->sendRedirect($newNetwork ? "/profile.action?" . c('QUERY_KEY_KEY') . '=' . $newNetwork->getKey() : $this->getHistory($request, 0));
					$response->sendRedirect($this->getHistory($request, 0));
					return ref('forward');
				}
				break;

			// send news to the user
			case 'news':
				$mid = $this->_getParameterAsInteger($request, c('QUERY_KEY_MESSAGE_ID'));

				if ($this->_getParameterAsBoolean($request, c('QK_DELETE'))) {
					if ($mid) {
						$man->deleteNews($mid);
						$man->deleteNotificationsByRelatedId($mid);
						$message = 'Successfully deleted.';
					}
					else {
						$error = 'Missing id parameter, please try again.';
					}
				}
				else {
					$body = $this->_getParameterAsHTMLFreeString($request, c('QUERY_KEY_BODY'));
					$title = $this->_getParameterAsString($request, c('QUERY_KEY_SUBJECT'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS'));
					$type = $this->_getParameterAsString($request, c('QK_TYPE'));
					$date = $this->_getParameterAsString($request, 's' . c('QUERY_KEY_TIME'), '', c('PARANOID_ALLOWED_DATETIME'));
					$expires = $this->_getParameterAsString($request, 'e' . c('QUERY_KEY_TIME'), '', c('PARANOID_ALLOWED_DATETIME'));
					$type = News::validateType($type);

					if (!isDateTime($expires)) {
						$expires = time() + 1209600000; // 14 days from now
					}

					// don't create a message if required variables aren't present
					if ($body && $title && isDateTime($date)) {
						$article = null;
						$isCreate = false;
						$users = array();

						if ($mid) {
							$article = $man->getNewsById($mid);
						}
						else {
							$users = $this->_getUsersFromCheckboxes($request, $S, $man);
						}

						if (!$article) {
							$isCreate = true;
							$article = new News();
						}

						$article->setBody($body);
						$article->setDate($date);
						$article->setExpires($expires);
						$article->setTitle($title);
						$article->setType($type);
						$man->createNews($article, $users);

						if ($article->getId()) {
							if ($isCreate && 'A' != $type) {
								$o = new Notification();
								$o->setRelatedId($article->getId());
								$o->setSearchableById(c('ADMIN_ID'));
								$o->setType(c('NotificationTypeNews'));

								foreach ($users as $s) {
									$o->setSearchableToId($s->getId());
									$man->createNotification($o);
								}
							}

							$newsTypes = c('article-type');
							$message = ucfirst($newsTypes[$article->getType()]);
							$message .= $isCreate ? ' Created ' : ' Modified ';
							$message .= 'Successful.';
						}
						else {
							$error = 'News creation failed, try again.';
						}
					}
					else {
						if (!$body) {
							$error = 'The body was empty.';
						}
						else if (!$title) {
							$error = 'The title was empty.';
						}
						else {
							$error = 'Please use valid dates formated like "YYYY-MM-DD HH:II:SS", where "I" is minutes.';
						}
					}
				}

				break;

			// update the pending state of a searchable
			case 'pending':
				$type = $this->_getParameterAsString($request, c('QK_TYPE'));
				$sId = $this->_getParameterAsInteger($request, c('QUERY_KEY_ID'));
				$searchable = $man->getSearchableById($sId);

				if ($searchable) {
					$data = array('KEY' => $searchable->getKey(), 'TYPE' => ucfirst($searchable->getType()), 'NAME' => $searchable->getName());
					$nm = $this->_getNotificationManager($request);

					if ('approve' === $type) {
						$man->updatePendingStatus($searchable, Searchable::$PENDING_BITMASK_APPROVAL);
						$emailName = NotificationManager::$ADMIN_APPROVED;
					}
					else
					{
						$man->updateSearchableStatus($searchable->getId(), Searchable::$STATUS_DELETED, $searchable->getAccess());
						$emailName = NotificationManager::$ADMIN_DENIED;
					}

					$nm->notifyByUser($searchable, $emailName, $data);
				}

				$request->setAttribute('xml', $sId);
				return ref('xml');
				break;

			// update the profofanity filter
			case 'profanity':
				$writer = new FileWriter(new File('WEB-INF/classes/include/Profanity.php'));
				$body = $request->getParameter('profanity');
				$str = "<?php def('profanity', '/\b" . preg_replace("/\\r?\\n+\\r?/", '\b|\b', $body) . "\b/'); ?>";
				$writer->write($str);
				$page = 'G';

				$message = 'Profanity Filter Successfully Updated.';
				break;

			// reset become task
			case 'revert':
				$user = $request->getSession()->getAttribute('oUser');
				$request->getSession()->removeAttribute('oUser');

				if ($user) {
					$request->getSession()->setAttribute('isAdminView', ref(true));
					$user->setWasAdmin(false);
					$aUser =& $user;
					$request->getSession()->setAttribute('User', $aUser);
					$message = 'Administrator successfully reverted.';
					$page = 'searchable';
					$task = 'user';
				}
				break;

			// update user status
			case c('QUERY_KEY_STATUS'):
				$user = $man->getUsersByExactName($username, false);
				$status = $this->_getParameterAsInteger($request, c('QUERY_KEY_STATUS'));
				$status_array = c('searchable_status');

				if ($user) {
					if (false !== array_key_exists($status, $status_array)) {
						$status = $status_array[$status];
						$man->updateSearchableStatus($user->getId(), $status, $user->getAccess());
						$message = 'Status for "' . $user->getName() . '" updated from "' . $user->getStatus() . '" to "' . $status . '".';
					}
					else
					{
						$error = 'Status not updated, invalid status used.';
					}
				}
				else
				{
					$error = 'Status not updated, invalid username.';
				}

				$task = 'user';
				break;

			// upload styles
			case 'upload':
				$logo = $this->_getParameterAsString($request, c('QUERY_KEY_BACKUP'), '', array('-', '/', '.', ':'));
				$name = 'custom' . time();
				$file = $_FILES[c('QUERY_KEY_BACKUP')];
				$WWW_ROOT = substr($_SERVER['SCRIPT_FILENAME'], 0, strpos($_SERVER['SCRIPT_FILENAME'], 'index.php'));

				if ($file) {
					$uploader = new upload($file);
					$uploader->file_new_name_body = $name;
					$uploader->file_overwrite = true;
					$uploader->process($WWW_ROOT . 'assets/css/custom/');
				}

				if ($uploader->processed) {
					rename($WWW_ROOT . 'assets/css/custom/custom.css', $WWW_ROOT . 'assets/css/custom/custom' . getDatetime(time()) . '.css');
					rename($WWW_ROOT . 'assets/css/custom/' . $name . '.css.txt', $WWW_ROOT . 'assets/css/custom/custom.css');
					$customCssMgr = new CustomCSSManager();
					$man->insertCustomization($customCssMgr->getData());
					$message = 'Styles uploaded successfully.';
				}
				else
				{
					$l->error('Custom file not uploaded properly.');
					$error = 'Style Upload failed, please contact your system administrator.';
				}

				break;

			default:
				// todo:" stop-gap measure intil I fix the URLs for admins
				switch ($pageName) {

					case 'updateRegistrationTask':
						$regMan = new ServiceRegistration($this->getDataSource($request));
						$oRegTasks = $regMan->readRegistrationTasks(array());

						foreach ($oRegTasks as $oRegTask) {
							$bEnabled = $this->_getParameterAsBoolean($request, 'taskEnabled' . $oRegTask->getId());
							$priority = $this->_getParameterAsInteger($request, c('QK_ORDER') . $oRegTask->getId());

							if ($bEnabled != $oRegTask->isEnabled() || $priority != $oRegTask->getPriority()) {
								$oRegTask->setStatus($bEnabled ? Searchable::$STATUS_ACTIVE : Searchable::$STATUS_INACTIVE);
								if ($priority) {
									$oRegTask->setPriority($priority);
								}
								$regMan->updateRegistrationTask($oRegTask);
							}
						}

						break;
				}
		}

		$query = array(c('QUERY_KEY_PAGE') . '=' . $page);
		array_push($query, c('QUERY_KEY_TASK') . '=' . $task);
		array_push($query, c('QK_SUB_TASK') . '=' . $stask);

		if ($message) {
			$this->_parseMessage($request, 'M:' . $message);
		}

		if ($error) {
			$this->_parseMessage($request, $error);
		}

		// verifies that any retrieved user exists
		if (!empty($user)) {
			array_push($query, c('QUERY_KEY_NAME') . '=' . $user->getName());
		}

		$response->sendRedirect(ref('admin.action?' . implode('&', $query)));
		return ref('forward');
	}

	/**
	 * Handles the processing of a network request.
	 * @method _handleNetworkRequest
	 * @param  $request {HttpServletRequest} Required. The http request.
	 * @param  $S {Searchable} Required. The Searchable to modify or NULL.
	 * @param  $aUser {User} Required. The Searchable adnistrator.
	 * @param  $newNetwork {Object} Required. The newly created network.
	 * @access Private
	 * @since  Release 1.0
	 */
	private function _handleNetworkRequest($request, $S, $aUser, &$newNetwork) {
		$subtask = $this->_getParameterAsString($request, c('QK_SUB_TASK'));
		list($man) = $this->_getServices($request, 'ServiceMember');

		switch ($subtask) {
			case c('QK_CREATE'):
				$networkName = $this->_getParameterAsString($request, c('QUERY_KEY_NAME'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS'));

				// validate
				if ($networkName) {
					$o = new Network();
					$o->setName($networkName);
					$o->setParentId($S ? $S->getId() : NULL);
					$man->createNetwork($o);
					$member = Member::createSimple($o->getId(), $aUser->getId(), true);
					$member->setSuperAdmin(true);
					$man->createMember($member);
					$newNetwork = $o;
					return "M:Network \"$networkName\" created successfully.";
				}
				else {
					return 'Please provide a name for the network.';
				}
				break;

			case c('QK_DELETE'):
				if ($S) {
					$man->deleteNetwork($S);
					return 'M:Network successfully deleted.';
				}
				else {
					return 'Missing parameter, please refresh the page and try again.';
				}
				break;

			default:
				return 'Unknown subtask provided for network request.';
		}
	}

	/**
	 * Handles the rename of project features.
	 * @method _handleRenameFeatureRequest
	 * @param request {HttpServletRequest} Required. The http request.
	 * @access Private
	 * @since Release 1.0
	 */
	private function _handleRenameFeatureRequest($request) {
		// static names
		$nameFriend = $this->_getParameterAsString($request, c('QK_FRIEND'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS'));
		$nameMember = $this->_getParameterAsString($request, c('QK_MEMBER'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS'));
		$nameMessage = $this->_getParameterAsString($request, c('QK_MESSAGE'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS'));
		if ($nameFriend) {
			$this->props->setProperty('project.name.friend', $nameFriend);
		}
		if ($nameMember) {
			$this->props->setProperty('project.name.member', $nameMember);
		}
		if ($nameMessage) {
			$this->props->setProperty('project.name.message', $nameMessage);
		}

		// feature names
		$nameMessageBoard = $this->_getParameterAsString($request, c('QK_MESSAGE_BOARD'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS'));
		$nameRelated = $this->_getParameterAsString($request, c('QK_RELATED'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS'));
		$nameWall = $this->_getParameterAsString($request, c('QK_WALL'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS'));
		if ($nameMessageBoard) {
			$this->props->setProperty('project.name.messageBoard', $nameMessageBoard);
		}
		if ($nameRelated) {
			$this->props->setProperty('project.name.related', $nameRelated);
		}
		if ($nameWall) {
			$this->props->setProperty('project.name.wall', $nameWall);
		}

		// searchable names
		$searchableTypes = Searchable::getValidTypes();
		foreach ($searchableTypes as $type) {
			$name = $this->_getParameterAsString($request, $type, '', c('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS'));
			if ($name) {
				$this->props->setProperty('project.name.' . $type, $name);
			}
			;
		}

		// update the properties
		$this->writeProperties();
	}

	/**
	 * Handles the update of project customizations.
	 * @method _handleUpdateCustomizationRequest
	 * @param request {HttpServletRequest} Required. The http request.
	 * @access Private
	 * @since Release 1.0
	 */
	private function _handleUpdateCustomizationRequest($request, $stask) {
		$customCssMgr = new CustomCSSManager();
		$data = $customCssMgr->getData();

		// updating to a history file
		if ('history' === $stask) {
			$name = $this->_getParameterAsString($request, c('QUERY_KEY_NAME'), '', c('PARANOID_ALLOWED_URI'));
			$customCssMgr->revertTo($name);
		}
			// modifying current
		else {
			$prefix = $customCssMgr->stylePrefix;

			if ('color' === $stask) {
				$data['colorBg'] = $this->_getParameterAsString($request, c('QUERY_KEY_COLOR_BG'), 'EFEFEF');
				$data['colorHd1'] = $this->_getParameterAsString($request, c('QUERY_KEY_COLOR_HD') . '1', '040A83');
				$data['colorHd2'] = $this->_getParameterAsString($request, c('QUERY_KEY_COLOR_HD') . '2', '040A83');
				$data['colorHd3'] = $this->_getParameterAsString($request, c('QUERY_KEY_COLOR_HD') . '3', '040A83');
				$data['colorHd4'] = $this->_getParameterAsString($request, c('QUERY_KEY_COLOR_HD') . '4', '830A04');
				$data['colorLabel'] = $this->_getParameterAsString($request, c('QUERY_KEY_COLOR_LABEL'), '999999');
				$data['colorLink'] = $this->_getParameterAsString($request, c('QUERY_KEY_COLOR_LINK'), '000099');
				$data['colorText'] = $this->_getParameterAsString($request, c('QUERY_KEY_COLOR_TEXT'), '000000');
				$data['colorVisited'] = $this->_getParameterAsString($request, c('QUERY_KEY_COLOR_VISITED'), '000099');

				$customCssMgr->updateColor($prefix . ' h1', '#' . $data['colorHd1']);
				$customCssMgr->updateColor($prefix . ' h2', '#' . $data['colorHd2']);
				$customCssMgr->updateColor($prefix . ' h3', '#' . $data['colorHd3']);
				$customCssMgr->updateColor($prefix . ' h4', '#' . $data['colorHd4']);
				$customCssMgr->updateColor($prefix . ' label', '#' . $data['colorLabel']);
				$customCssMgr->updateColor($prefix, '#' . $data['colorText']);
				$customCssMgr->updateColor($prefix . ' a', '#' . $data['colorLink']);
				$customCssMgr->updateColor($prefix . ' a:visited', '#' . $data['colorVisited']);

				$bg = $customCssMgr->getBackground('#doc #main');
				$customCssMgr->update($prefix . ' #doc #main', 'background', preg_replace('/[0-9a-fA-F]{6}/', $data['colorBg'], $bg));
			}
			else if ('logo' === $stask) {
				$time = time();
				$this->_uploadImage(c('QUERY_KEY_LOGO'), 'assets/images/bg/', 'icon', 'gif') ? 1 : 0;
				$this->_uploadImage(c('QUERY_KEY_FAVICON'), 'assets/images/generated/favicon/', 'icon') ? 1 : 0;

				// update the property
				$useBanner = $this->_getParameterAsBoolean($request, c('QK_USE_BANNER'));
				$this->props->setProperty('project.useBannerLayout', $useBanner ? 'true' : 'false');
				$this->writeProperties();
			}
			else if ('background' === $stask) {
				$isCustom = $this->_getParameterAsBoolean($request, c('QUERY_KEY_DESIGN')) ? 0 : 1;
				$type = $this->_getParameterAsInteger($request, c('QUERY_KEY_BGTYPE'));
				$bgColor = $data['colorBg'];

				// force type to be 1 or 2, 1 by default
				switch ($type) {
					case 2:
						$padding = '0 10px';
						break;

					default:
						$type = 1;
						$padding = '21em 10px';
						break;
				}

				// user has requested default
				if ($isCustom && $this->_uploadImage(c('QUERY_KEY_FILE'), 'assets/images/generated/bg/', $time, 'gif')) {
					$bgUrl = 'generated/bg/' . $time . '.gif';
				}
					// user is uploading new content
				else {
					$bgUrl = (2 === $type) ? 'bg/fixed.gif' : 'bg/elastic.gif';
				}

				$customCssMgr->update($prefix . ' #doc #main', 'background', '#' . $bgColor . ' url(../../images/' . $bgUrl . ') repeat-y ' . $padding);
			}

			$customCssMgr->write();
		}

		// update the revision number
		$this->props->setProperty('project.revision', preg_replace('/[^0-9]/', '', $this->props->getProperty('project.revision')) + 1);
		$this->writeProperties();
	}

	/**
	 * Handles the update of project features.
	 * @method _handleUpdateFeaturesRequest
	 * @param request {HttpServletRequest} Required. The http request.
	 * @access Private
	 * @since Release 1.0
	 */
	private function _handleUpdateFeaturesRequest($request) {
		$types = Searchable::getValidTypes();

		$modules = array( // todo: this should be populated from a list of installed modules
			'messageBoard',
			'related',
			'wall'
		);

		foreach ($types as $type) {
			if (Searchable::$TYPE_USER != $type) {
				$hasType = $this->_getParameterAsBoolean($request, 'has' . $type);
				$this->setPropertyBoolean('project.features.' . $type, $hasType);
			}
		}

		foreach ($modules as $module) {
			$hasModule = $this->_getParameterAsBoolean($request, 'has' . $module . 'general');
			$this->setPropertyBoolean('project.features.' . $module, $hasModule);

			foreach ($types as $type) {
				$hasModule = $this->_getParameterAsBoolean($request, 'has' . $module . $type);
				$this->setPropertyBoolean('project.features.' . $module . '.' . $type, $hasModule);
			}
		}

		$this->writeProperties();
	}

	/**
	 * Handles the update of a profile widget.
	 * @method _handleUpdateProfileWidgetRequest
	 * @param request {HttpServletRequest} Required. The http request.
	 * @access Private
	 * @since Release 1.0
	 */
	private function _handleUpdateProfileWidgetRequest($request) {
		list($man) = $this->_getServices($request, 'ServiceProfileWidget');

		$id = $this->_getParameterAsInteger($request, c('QK_PW_ID'));
		$isMulti = $this->_getParameterAsBoolean($request, c('QK_PW_MULTI'));
		$name = $this->_getParameterAsString($request, c('QK_PW_NAME'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS'));
		$tab = $this->_getParameterAsString($request, c('QK_PW_TAB'), '', array(' '));
		$order = $this->_getParameterAsInteger($request, c('QK_PW_ORDER'));
		$status = $this->_getParameterAsString($request, c('QK_PW_STATUS') . $id);

		// must be for group or user and have a name and a tab name
		if (!$name) {
			return array('Please provide a name for the profile widget before saving.');
		}
		if (!$tab) {
			return array('Please provide a tab name for the profile widget before saving.');
		}

		// determine type
		$types = array();
		$allTypes = Searchable::getValidTypes();
		foreach ($allTypes as $type) {
			if ($this->_getParameterAsBoolean($request, 'profileWidgetIs' . $type)) {
				array_push($types, $type);
			}
		}
		$typeBit = ProfileWidget::getSearchableTypeBitByTypes($types);

		if (0 == sizeof($types)) {
			return array('Please choose the data type to associate the profile widget with, before saving.');
		}

		$pw = (0 < $id) ? $man->getProfileWidgetById($id) : new ProfileWidget();

		if (!(Searchable::$STATUS_ACTIVE == $status || Searchable::$STATUS_INACTIVE == $status)) {
			$status = Searchable::$STATUS_ACTIVE;
		}

		// update fields
		$pw->setName($name);
		$pw->setNameTab($tab);
		$pw->setOrder($order);
		$pw->setIsMulti($isMulti);
		$pw->setSearchableTypeBit($typeBit);
		$pw->setStatus($status);

		$man->updateProfileWidget($pw);

		return array('', $pw->getId());
	}

	/**
	 * Handles the update of a profile widget field.
	 * @method _handleUpdateProfileWidgetFieldRequest
	 * @param request {HttpServletRequest} Required. The http request.
	 * @param map {BaseManager} Required. The DB manager object.
	 * @access Private
	 * @since Release 1.0
	 */
	private function _handleUpdateProfileWidgetFieldRequest($request) {
		list($man) = $this->_getServices($request, 'ServiceProfileWidget');

		$pwId = $this->_getParameterAsInteger($request, c('QK_PW_ID'));
		$pwfId = $this->_getParameterAsInteger($request, c('QK_PWF_ID'));
		$pwfML = $this->_getParameterAsInteger($request, c('QK_PW_FIELD_ML'));
		$type = $this->_getParameterAsString($request, c('QK_PW_FIELD_TYPE'));
		$order = $this->_getParameterAsString($request, c('QK_PW_ORDER'));
		$label = $this->_getParameterAsString($request, c('QK_PW_NAME'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS'));
		$isPrivate = $this->_getParameterAsBoolean($request, c('QK_PW_PRIVATE'));
		$isRequired = $this->_getParameterAsBoolean($request, c('QK_PWF_REQUIRED'));
		$status = $this->_getParameterAsString($request, c('QK_PW_STATUS'));
		$defaultValue = $this->_getParameterAsString($request, c('QK_PWF_DEFAULT'));

		if (!$pwId) {
			return array('Missing required data, please return to admin page and try again.');
		}

		$pwf = (0 < $pwfId) ? $man->getProfileWidgetFieldById($pwfId) : new ProfileWidgetField();

		if (!(Searchable::$STATUS_ACTIVE == $status || Searchable::$STATUS_INACTIVE == $status)) {
			$status = Searchable::$STATUS_ACTIVE;
		}

		$oldName = $pwf->getName();

		// always validate the name
		if (!$label) {
			return array('Please provide a name for the field before saving.');
		}
		$name = str_convertValueToQueryKey($label);
		$pwf->setDefaultValue($defaultValue);
		$pwf->setLabel($label);
		$pwf->setName($name);
		$pwf->setOrder($order);
		$pwf->setStatus($status);

		if (! $man->isProfileWidgetFieldNameAvailable($name, $pwfId)) {
			return array('That name is already in use.');
		}

		// handle update validation
		if ($pwf->getId()) {
			if ($pwfML) {
				$pwf->setMaxlength($pwfML);
			}

			$pwf->setIsRequired($isRequired);
			$pwf->setIsPrivate($isPrivate);
		} else { // handle create validation

			if (!ProfileWidgetField::isValidType($type)) {
				return array('Please choose the type of field before saving.');
			}

			$pwf->setType($type);
			$pwf->setProfileWidgetId($pwId);
		}

		$pwf->updateDataTable();

		// todo: test select updates
		$man->updateProfileWidgetField($pwf);

		if ($pwf->getId()) {
			$pwfId = $pwf->getId();
			$pwId = $pwf->getProfileWidgetId();
//			$url = str_replace(c('QK_PWF_ID') . '=0', c('QK_PWF_ID') . '=' . $pwfId, $_SERVER['HTTP_REFERER']);

			if (ProfileWidgetField::$TYPE_SELECT == $pwf->getType()) {
				$this->_handleUpdateSelectOptions($request, $man, $oldName, $pwf);
			}
		}

		return array('', $pwf);
	}

	/**
	 * Handles the update of a profile widget field options.
	 * @method _handleUpdateSelectOptions
	 * @param request {HttpServletRequest} Required. The http request.
	 * @param map {BaseManager} Required. The DB manager object.
	 * @param tableName {String} Required. The select name.
	 * @param newTableName {String} Required. The new select name.
	 * @return {Array} Required. The error code or empty string and the updated profile widet field.
	 * @access Private
	 * @since Release 1.0
	 */
	protected function _handleUpdateSelectOptions($request, $man, $oldName, $pwf) {
		$newName = $pwf->getName();

		$cOptions = c($oldName);
		$isNew = !$cOptions;
		$newOptions = array();
		$options = array();
		$clen = $isNew ? 0 : sizeof($cOptions);

		$isDelete = $this->_getParameterAsInteger($request, c('QK_DELETE') . 'Option');
		$isCreate = $this->_getParameterAsString($request, c('QK_CREATE'));
		$size = $this->_getParameterAsInteger($request, c('QK_SIZE'));

		if (!$isDelete) {
			$optionsToDelete = array();
			$optionsToUpdate = array();

			// find deleted or changed options
			for ($i = 0; $i < $clen; $i += 1) {
				$value = $this->_getParameterAsString($request, c('QK_PWF_OPTION_NAME') . $i, '', c('PARANOID_ALLOWED_URI_PLUS'));
				$id = $this->_getParameterAsString($request, c('QK_PWF_OPTION_ID') . $i);

				if ($value) {
					if ($value !== $cOptions[$id]) {
						$optionsToUpdate[$id] = $value;
					}
				}
				else {
					array_push($optionsToDelete, $id);
				}
			}

			// insert new options
			for ($i = $clen; $i <= $size; $i += 1) { // array, in-case we allow more than 1 option to be added later
				$value = $this->_getParameterAsString($request, c('QK_PWF_OPTION_NAME') . $i, '', c('PARANOID_ALLOWED_URI_PLUS'));

				if ($value) {
					array_push($newOptions, $value);
				}
			}

			$man->createSelectOptions($pwf->getId(), $newOptions);
			$man->updateSelectOptions($pwf->getId(), $optionsToUpdate);
			$man->deleteSelectOptions($pwf->getId(), $optionsToDelete);

			$options = $man->readSelectOptions($pwf->getId());

			// are we editing, adding, or deleting a select option
			$fileLocation = 'WEB-INF/classes/include/SelectOptions.php';
			$haystack = file_get_contents($fileLocation);
			$writer = new FileWriter(new File($fileLocation), false);
			$optionsKeyValue = array();

			foreach ($options as $k => $v) {
				array_push($optionsKeyValue, "$k => '$v'");
			}

			$dl = '/* --';
			$dr = '-- */';

			// clear existing values
			$needle = '/' . preg_quote($dl . $oldName . $dr, '/') . '.*?' . preg_quote($dl . 'end' . $dr, '/') . '/is';
			$body = preg_replace($needle, '', $haystack);

			$replacementText = ($dl . $newName . $dr) . "\n\ndef('$newName', array(\n\t" . implode(",\n\t", $optionsKeyValue) . "\n));\n\n" . ($dl . 'end' . $dr);
			$body = str_replace('?>', $replacementText . "\n\n?>", $body);

			$writer->write($body);
			$writer->close();
		}
	}

	/**
	 * Handles the connection logic for two users.
	 * @method _handleUserConnection
	 * @param request {HttpServletRequest} Required. The http request.
	 * @return {Array} Required. The success message or error code.
	 * @access Private
	 * @since Release 1.0
	 */
	function _handleUserConnection($request) {
		$pAC = c('PARANOID_ALLOWED_AUTOCOMPLETE');
		$usernameA = $this->_getParameterAsString($request, c('QUERY_KEY_USERNAME_A'), '', $pAC);
		$usernameB = $this->_getParameterAsString($request, c('QUERY_KEY_USERNAME_B'), '', $pAC);
		$status = $this->_getParameterAsInteger($request, c('QUERY_KEY_STATUS'));

		list($man) = $this->_getServices($request, 'ServiceMember');

		if ($usernameA && $usernameB && $status) {
			$userA = $man->getUsersByExactName($usernameA);
			$userB = $man->getUsersByExactName($usernameB);

			if ($userA && $userB) {
				$status = $man->getMemberStatusCode($userA->getId(), $userB->getId());

				$member = Member::createSimple($userA->getId(), $userB->getId());

				if (Member::$STATUS_CONNECTED == $status) {
					$man->createMember($member);
				}
				else if (Member::$STATUS_NOT_CONNECTED == $status) {
					$man->deleteMember($userA->getId(), $userB->getId());
				}
				else if (Member::$STATUS_CONNECTION_REQUESTED_AB == $status) {
					$member->setStatus(Searchable::$STATUS_PENDING);
					$man->createMember($member);
				}
				else if (Member::$STATUS_CONNECTION_REQUESTED_BA == $status) {
					$member->setStatus(Searchable::$STATUS_PENDING);
					$member->setSearchableA($userB);
					$member->setSearchableB($userA);
					$man->createMember($member);
				}

				return array('Users connected successfully.', '');
			}
			else {
				return array('', 'User Connection failed, invalid username.');
			}
		}
		else {
			return array('', 'User Connection failed, missing one or fields.');
		}
	}
}

?>
