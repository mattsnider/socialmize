<?php

import('project.action.ControllerBase');
import('project.service.ServiceRegistration');

/**
 * @package project.action.submit
 */
class ControllerUserLoginSubmit extends ControllerBase {

	function __construct() {
		$this->_requiresLogin = false;
		$this->_requiresRegistration = false;
		$this->_requiredMethod = 'POST';
	}

	/**
	 * @Override
	 */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		// Retrieve values from request
		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'));
		$email = $this->_getParameterAsString($request, c('QUERY_KEY_EMAIL'), '', c('PARANOID_ALLOWED_URI'));
		$name = $this->_getParameterAsString($request, c('QUERY_KEY_EMAIL'), '', array(' '));
		$pass = $this->_getParameterAsString($request, c('QUERY_KEY_PASSWORD'));
		$emailMask = $this->props->getProperty('project.emailMask');

		// retrieve manager
		list($man) = $this->_getServices($request, 'UserManager');

		$session = $request->getSession();

		$log = $this->getLog();
//		$errors =& new ActionMessages();

		// default behavior, is to redirect to the login page (should be overridden)
		$response->sendRedirect('login.action');

		// user requested to login
		if ('login' == $task) {
			$user = $man->getUserByEmailAndPassword($email, $pass);

			if (! $user) {
				$user = $man->getUserByNameAndPassword($name, $pass);
			}

			if ($user) {
				if ($user->isPending()) {
					if ($user->hasPendingBit(Searchable::$PENDING_BITMASK_REGISTRATION)) {
						$this->_parseMessage($request, 'You must register first. An email should have been sent to you. <a href="javascript://">Resend</a>');
					}
					else if ($user->hasPendingBit(Searchable::$PENDING_BITMASK_APPROVAL)) {
						$this->_parseMessage($request, 'An administrator must approve your request first. Please be patient. You will be notified.');
					}
				}
				else {
					$this->loginUser($request, $response, $user);
					$log->info($user->getName() . ' loggin in @ ' . getDatetime(time()));
				}
			}
			else {
				$this->_parseMessage($request, 'Invalid credentials; did you use the right {0} and {1}?', 'Username', 'Password');
			}
		}
			// user requested to signup
		else if ('signup' == $task) {
			$email = $this->_getParameterAsString($request, c('QUERY_KEY_EMAIL'), '', c('PARANOID_ALLOWED_URI'));
			$confirm = $this->_getParameterAsString($request, c('QUERY_KEY_CONFIRM'));
			$code = $this->_getParameterAsString($request, 'code');
			$isAdminInvite = 'true' == $this->props->getProperty('project.adminInvite');
			$response->sendRedirect('login.action?task=S');

			if (!$pass || $pass !== $request->getParameter(c('QUERY_KEY_PASSWORD'))) {
				$this->_parseMessage($request, 'Invalid {0}, only alpha-numeric characters allowed', 'Password');
			}
			else if (4 > strlen($pass) || 16 < strlen($pass)) {
				$this->_parseMessage($request, 'Invalid {0}, must be between 4 & 16 alpha-numeric characters long', 'Password');
			}
			else if ($confirm !== $pass) {
				$this->_parseMessage($request, 'Invalid {0}, passwords do not match', 'Password Confirmation');
			}
			else if (! preg_match('/^[\w._%-+]+@[\w.-]+\.[A-Z]{2,4}$/i', $email)) {
				$this->_parseMessage($request, 'Invalid {0}, emails should be like "admin@servername.com"', 'Email');
			}
				// create the User as student when they don't exist
			else if ($emailMask && !strpos($email, '@' . $emailMask)) {
				$this->_parseMessage($request, 'Email is not from required domain: {0}', $emailMask);
			}
			else if ($isAdminInvite && !$man->isCodeValid($code)) {
				$this->_parseMessage($request, 'Your code "{0}" is not valid, please check your email again.', $code);
			}
			else if (!$man->isEmailAvailable($email)) {
				$this->_parseMessage($request, 'Email "{0}" is already in use.', $email);
			}
			else {
				$requiresApproval = 'true' == $this->props->getProperty('project.requiresConfirm');
				$requiresRegistration = 'true' == $this->props->getProperty('project.requiresRegistration');

				$status = ($requiresRegistration || $requiresApproval) ? Searchable::$STATUS_PENDING : Searchable::$STATUS_ACTIVE;

				$user = new User(true);
				if ($requiresApproval) {
					$user->addPendingBit(Searchable::$PENDING_BITMASK_APPROVAL);
				}
				if ($requiresRegistration) {
					$user->addPendingBit(Searchable::$PENDING_BITMASK_REGISTRATION);
				}

				$name = preg_replace('/@[^@]+/', '', $email);

				$user->setName($name);
				$user->setEmail($email);
				$user->setPassword(md5($pass));
				$user->setStatus($status);
				$man->createUser($user);

				$this->loginUser($request, $response, $user);
				$log->info($user->getName() . ' loggin in @ ' . getDatetime(time()));

				if ($isAdminInvite) {
					$man->deleteActivationCode($code);
				}

				$nm = $this->_getNotificationManager($request);
				$data = array('NAME' => $user->getName());

				if ($requiresRegistration || $requiresApproval) {
					$data = array('KEY' => $user->getKey());

					if ($requiresRegistration) {
						$nm->notifyByUser($user, NotificationManager::$SIGNUP_CONFIRMATION, $data);
						$this->_parseMessage($request, 'Your account has been created. However, this site requires email activation. Your activation key has been sent to the e-mail address you provided. Please check your e-mail for additional information.');
					}
					else if ($requiresApproval) {
						$this->_parseMessage($request, 'You have been registered, but an administrator must approve your request first. Please be patient. You will be notified.');
					}

					$response->sendRedirect('login.action');
					return ref('success');
				}
				else {
					$nm->notifyByUser($user, NotificationManager::$NEW_USER_EMAIL, $data);
				}
			}
		}
		else if ('recoverPassword' == $task) {
			$email = $this->_getParameterAsString($request, c('QUERY_KEY_EMAIL'), '', c('PARANOID_ALLOWED_URI'));

			if ($man->hasUserEmail($email)) {
				$pass = $man->generateNewPassword($email);
				$data = array('PASSWORD' => $pass);
				$nm = $this->_getNotificationManager($request);
				$nm->notifyByEmail($email, NotificationManager::$RECOVER_PASSWORD, $data);
				$session->setAttribute('confirm', ref(true));
			}
			else {
				$this->_parseMessage($request, 'The provided email is not is use.');
			}

			$response->sendRedirect('recoverPassword.action');
			return ref('success');
		}

		return ref('success');
	}


	/**
	 * Handles logging the user in:
	 *  update login count
	 *  ensure user status is active
	 *  push user into the session
	 *
	 * @method loginUser
	 * @param  $request {HttpServletRequest} Required. The http request.
	 * @param  $response {HttpServletRequest} Required. The http response.
	 * @param  $oUser {Searchable} A User DBO representing user to login.
	 * @access Private
	 * @since  Release 1.0
	 */
	private function loginUser($request, &$response, $oUser) {
		list($man) = $this->_getServices($request, 'UserManager');
		$conn = $man->ds->getConnection();
		$stmt = $conn->prepareStatement('UPDATE ' . $this->managerUser->_DB_TABLE_USER . ' SET `login_count`=`login_count`+1, `last_login`=NOW() WHERE `searchable_id`=?');
		$stmt->setInt(1, $oUser->getId());
		$stmt->executeQuery();
		$oUser->setLoginCount($oUser->getLoginCount() + 1);
		$conn->close();

		$bJSEnabled = $this->_getParameterAsBoolean($request, 'jsEnabled');

		$session = $request->getSession();

		$regMan = new ServiceRegistration($this->getDataSource($request));
		$oNextUserRegTask = $regMan->readNextSearchableRegistrationTask($oUser->getId());
		$oUser->setRegistrationTask($oNextUserRegTask);

		// user is inactive, so re-activate them
		if (Searchable::$STATUS_INACTIVE == $oUser->getStatus()) {
			$man->updateSearchableStatus($oUser->getId(), Searchable::$STATUS_ACTIVE, $oUser->getAccess());
		}

		$oUser->setIsMember(array(false, true, true));
		$session->setAttribute('User', $oUser);
		$session->setAttribute('jsEnabled', $bJSEnabled);

		// setup the redirect to the next page
		if ($oNextUserRegTask) {
			$nextPage = $oNextUserRegTask->getUri() . '.action';
		} else {
			$nextPage = $session->getAttribute('nextPage');
			$session->removeAttribute('nextPage');

			// special-case next pages that should be cleared
			if (preg_replace('/\?.*/', '', $nextPage) == 'logout.action') {
				$nextPage = '';
			}
		}

//		dlog('$nextPage=' . $nextPage);
		$response->sendRedirect($nextPage ? $nextPage : 'home.action');
	}
}

?>
