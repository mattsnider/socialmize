<?php

import('project.action.ControllerBase');

/**
 * @package project.action.user
 */
class ControllerSearchableUpdate extends ControllerBase {

	/**
	 * @Override
	 */
	public function executeActually(&$form, &$request, &$response, $aUser, $S) {
		// retrieve managers and create active user references
		list($man, $servUser) = $this->_getServices($request, 'ServiceMember', 'UserManager');

		$pageName = $this->getPagename($request);
		$this->getLog()->debug("Dispatching pagename: $pageName");

		$url = $this->getHistory($request, 0);
		$sId = $S ? $S->getId() : 0;
		$aUserId = $aUser->getId();

		/* DOES THIS STILL EXIST???
				$offset = $this->_getParameterAsInteger($request, c('QUERY_KEY_OFFSET'));
				$limit = $this->_getParameterAsInteger($request, c('QUERY_KEY_LIMIT'), 10);
				$filter = $this->_getParameterAsString($request, c('QUERY_KEY_FILTER'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE'));

				$this->_handleNetworkUpdate($request, $man, $S, $offset, $limit, $filter);

				if ($limit) {array_push($params, c('QUERY_KEY_LIMIT') . '=' . $limit);}
				array_push($params, c('QUERY_KEY_OFFSET') . '=' . $offset);
				array_push($params, c('QUERY_KEY_FILTER') . '=' . $filter);
		*/

		switch ($pageName) {

			// called by createGroup.action to create a new group, should forward to basic profile edit on success
			case 'createSearchable':
				list($message, $url) = $this->_handleCreateSearchable($request, $S, $aUser);
				break;

			case 'createSearchableFriend':
				$url = $this->getHistory($request, 0, true);
				$message = $this->_handleCreateSearchableFriend($request, $man, $S, $aUser);
				break;

			case 'confirmMember':
				list($servMember) = $this->_getServices($request, 'ServiceMember');
				$key2 = $this->_getParameterAsString($request, c('QUERY_KEY_KEY') . '2');
				$S2 = $man->getSearchableByKey($key2);
				$o = Member::createSimple($S, $S2->getId());
				$man->createMember($o, true);
				$message = 'M:'.$S2->getName().' is now a ' . $this->_getFeatureCustomName('member') . ' of '.$S->getName().'.';
				break;

			case 'deleteMember':
				list($servMember) = $this->_getServices($request, 'ServiceMember');
				$key2 = $this->_getParameterAsString($request, c('QUERY_KEY_KEY') . '2');
				$S2 = $man->getSearchableByKey($key2);
				$servMember->deleteMember($S2->getId(), $sId);
				$message = 'M:'.$S2->getName().' is no longer a ' . $this->_getFeatureCustomName('member') . ' of '.$S->getName().'.';
				break;

			case 'deleteSearchable':
				if ($S->isSuperAdmin() || $aUser->isSiteAdmin()) {
					$man->updateSearchableStatus($sId, Searchable::$STATUS_DELETED, $aUser->getAccess());
					$url = '/mygroups.action';
					$message = 'M:' . ucfirst($S->getType()) . ' successfully deleted.';
				}
				else {
					$message = 'You are not authorized to delete <q>' . $S->getName() . '</q>';
				}

				break;

			case 'deactivateSearchable':
				list($sUrl, $message) = $this->_handleDeactivateSearchable($request, $man, $S, $aUser);
				$url = $sUrl;
				break;

			case 'joinSearchable':
				$nameMember = $this->_getFeatureCustomName('member');

				list($isMember) = $man->isMember($sId, $aUserId, Searchable::$STATUS_PENDING);

				if ($S->isClosed() && ! $isMember) {
					$o = Member::createSimple($aUser, $S);
					$o->setStatus(Searchable::$STATUS_PENDING);
					$man->createMember($o);
					$message = 'M:You have successfully requested to become a ' . $nameMember . ' of <strong>' . $S->getName() . '</strong>.';
				}
				else {
					$o = Member::createSimple($S, $aUser);
					$man->createMember($o);
					$message = 'M:You are now a ' . $nameMember . ' of <strong>' . $S->getName() . '</strong>.';
				}

				$url = $this->getHistory($request, 0, true);
				break;

			case 'leaveSearchable':
				list($servMember) = $this->_getServices($request, 'ServiceMember');
				$servMember->deleteMember($sId, $aUserId);
				$message = 'M:You are no longer a ' . $this->_getFeatureCustomName($S->isUser() ? 'friend' : 'member') . ' of ' . $S->getName() . '.';
				if ('confirm' == $request->getParameter(c('QUERY_KEY_PAGE'))) {
					$url = $this->getHistory($request, 1);
				}
				break;

			case 'updateSearchableAccess':
				$this->_handleUpdateAccess($S, $man, $request, $aUser);
				$message = 'M:Privacy settings have been updated';
				break;

			case 'updateSearchableAdmins':
				$message = $this->_handleUpdateSearchableAdmins($request, $man, $S, $aUser);
				$memberStatus = $man->isMember($sId, $aUserId);

				// no longer an administrator, forward to profile
				if (!($memberStatus[1] || $aUser->isSiteAdmin())) {
					$this->_parseMessage($request, $message . '<br/>You are no longer an administrator, so we forwarded you to the profile page.');
					$response->sendRedirect('/profile.action?key=' . $S->getKey());
					return 'redirect';
				}

				break;

			case 'updateSearchableEmail':
				$message = $this->_handleUpdateSearchableEmail($request, $servUser, $S, $aUser);
				break;

			case 'updateSearchableFeatures':
				$this->_handleUpdateFeatures($S, $man, $request, $aUser);
				$message = 'M:Enabled features have been updated';
				break;

			case 'updateSearchableMembers':
				$message = $this->_handleUpdateSearchableMembers($request, $man, $S, $aUser);
				break;

			case 'updateSearchableName':
				$message = $this->_handleUpdateSearchableName($request, $servUser, $S, $aUser);
				break;

			case 'updateSearchablePortrait':
				$message = $this->_handleUpdateSearchablePortrait($request, $man, $S, $aUser);
				break;

			case 'updateSearchableNotification':
				$message = $this->_handleUpdateSearchableNotification($request, $man, $S, $aUser);
				break;

			default:
				// todo: this should be a generic message with a CTA to contact support
				$message = 'Invalid URL requested. Try your last operation again, or notify an administrator.';
		}

		$this->_parseMessage($request, $message);
		$response->sendRedirect($url);
		return 'redirect';
	}

	/**
	 * Dispatch function to handle the creation of a Searchable.
	 * @method _handleCreateSearchable
	 * @param  $request {HttpServletRequest} Required. The request object.
	 * @param  $S {Searchable} Required. The Searchable to update.
	 * @param  $aUser {Searchable} Required. The active user.
	 * @return {String} The forwarding URL.
	 * @access private
	 * @since  Release 1.0
	 */
	private function _handleCreateSearchable($request, $S, $aUser) {
		$name = $this->_getParameterAsString($request, c('QUERY_KEY_NAME'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS'));
		$email = $this->_getParameterAsString($request, c('QUERY_KEY_EMAIL'), '', c('PARANOID_ALLOWED_URI'));

		// todo: right now this logic assumes groups
		if ($name && $email) {
			$requiresApproval = 'true' == $this->props->getProperty('project.requiresConfirm');
			$status = ($requiresApproval) ? Searchable::$STATUS_PENDING : Searchable::$STATUS_ACTIVE;

			list($servGroup, $servMember) = $this->_getServices($request, 'GroupManager', 'ServiceMember');

			$S = new Group();
			if ($requiresApproval) {
				$S->addPendingBit(Searchable::$PENDING_BITMASK_APPROVAL);
			}
			$S->setStatus($status);
			$S->setEmail($email);
			$S->setName($name);
			$S->setUserId($aUser->getId());
			$servGroup->createGroup($S);

			// insert rows into other creation-time Group owned tables
			$m = Member::createSimple($S, $aUser, true);
			$m->setSuperAdmin(true);
			$servMember->createMember($m);

			$message = 'M:You successfully created ' . $name . '.';

			if ($requiresApproval) {
				$url = '/createGroup.action';
				$message .= ' However, an administrator must approve your request first. Please be patient. You will be notified.';
			}
			else {
				$url = '/editprofile.action?' . c('QUERY_KEY_TASK') . '=manage&' . c('QUERY_KEY_KEY') . '=' . $S->getKey();
			}
		}
		else {
			$message = $name ? 'You must provide a valid email.' : 'You forgot to include a name.';

			$q = array(
				c('QUERY_KEY_NAME') . '=' . $name,
				c('QUERY_KEY_TASK') . '=' . Searchable::$TYPE_GROUP,
				c('QUERY_KEY_NO_CACHE') . '=1',
			);

			$url = '/create.action?' . implode('&', $q);
		}

		return array($message, $url);
	}

	/**
	 * Dispatch function to handle the creation of a Searchable friend connections.
	 * @method _handleCreateSearchableFriend
	 * @param  $request {HttpServletRequest} Required. The request object.
	 * @param  $man {BaseManager} Required. The DB communication object.
	 * @param  $S {Searchable} Required. The Searchable to update.
	 * @param  $aUser {Searchable} Required. The active user.
	 * @return {String} The forwarding URL.
	 * @access private
	 * @since  Release 1.0
	 */
	private function _handleCreateSearchableFriend($request, $man, $S, $aUser) {
		$sId = $S->getId();
		$sName = $S->getNameHTML();
		$aUserId = $aUser->getId();
		$scode = $man->getMemberStatusCode($aUserId, $sId);
		$msg = '';
		$nameLcFriends = $this->_getFeatureCustomName('friend', false, true);
//		dlog($scode);

		// already friends
		if (Member::$STATUS_CONNECTED === $scode) {
			return $sName . ' is already one of your ' . $nameLcFriends . '.';
		}
			// waiting for confirmation
		else if (Member::$STATUS_CONNECTION_REQUESTED_AB === $scode) {
			return 'You have already requested to be ' . $nameLcFriends . ' with ' . $sName . '. Please wait until they confirm.';
		}
			// confirm or request friendship
		else {
			// confirmation
			if (Member::$STATUS_CONNECTION_REQUESTED_BA === $scode) {
				$m = Member::createSimple($aUser, $S);
				$man->createMember($m);

				import('project.action.submit.ControllerNotificationUpdate');
				$notificationId = $this->_getParameterAsInteger($request, c('QUERY_KEY_ID'));
				__delete_notification($man, $notificationId, $aUser->getId());
			}
				// request
			else {
				$m = Member::createSimple($aUser, $S);
				$m->setStatus(Searchable::$STATUS_PENDING);
				$man->createMember($m);
			}

			// send notification when not a confirmation
			if (Member::$STATUS_CONNECTION_REQUESTED_BA !== $scode) {
				$nm = $this->_getNotificationManager($request);
				$nm->notifyUser($man, $S, $aUser);

				return 'M:A confirmation request to become ' . $nameLcFriends . ' with ' . $sName . ' has been sent.';
			}
			else {
				return 'M:You are now ' . $nameLcFriends . ' with ' . $sName . '.';
			}
		}
	}

	/**
	 * Dispatch function to handle the deactivation of a Searchable.
	 * @method _handleDeactivateSearchable
	 * @param  $request {HttpServletRequest} Required. The request object.
	 * @param  $man {BaseManager} Required. The DB communication object.
	 * @param  $S {Searchable} Required. The Searchable to update.
	 * @param  $aUser {Searchable} Required. The active user.
	 * @return {String} The forwarding URL.
	 * @access private
	 * @since  Release 1.0
	 */
	private function _handleDeactivateSearchable($request, $man, $S, $aUser) {
		$man->updateSearchableStatus($S->getId(), Searchable::$STATUS_DELETED, $aUser->getAccess());
		$isSameUser = $aUser->getId() === $S->getId();
		$message = '<q>' . $S->getName() . '</q>';

		if ($isSameUser) {
			$request->session->removeAttribute('User');
			$request->getSession()->invalidate();
			$message = 'Your account';
		}

		$this->_parseMessage($request, $message . ' has been deactivated; If this was in error, please contact the system administrator.');
		return $isSameUser ? $request->getAttribute(c('MN_PROJECT_URL')) : 'home.action';
	}

	/**
	 * Reads access parameters and sets corresponding value on the Searchable.
	 * @method _handleUpdateAccess
	 * @param S {Searchable} Required. The Searchable DBO to modify.
	 * @param  $man {BaseManager} Required. The DB communication object.
	 * @param request {HttpRequestObject} Required. The http request for fetching parameters.
	 * @param  $aUser {Searchable} Required. The active user.
	 * @access Private
	 * @since Release 1.0
	 */
	private function _handleUpdateAccess(&$S, $man, $request, $aUser) {
		$access = $this->_getRequestAccess($request);
		$S->setAccess($access);
		$man->updateSearchable($S);
		$this->_replaceAuthorizedUser($request, $aUser, $S);
	}

	/**
	 * Reads feature parameters and sets corresponding value on the Searchable.
	 * @method _handleUpdateFeatures
	 * @param S {Searchable} Required. The Searchable DBO to modify.
	 * @param  $man {BaseManager} Required. The DB communication object.
	 * @param request {HttpRequestObject} Required. The http request for fetching parameters.
	 * @param  $aUser {Searchable} Required. The active user.
	 * @access Private
	 * @since Release 1.0
	 */
	private function _handleUpdateFeatures($S, $man, $request, $aUser) {
		$related = $this->_getParameterAsBoolean($request, c('QUERY_KEY_RELATED'));
		$board = $this->_getParameterAsBoolean($request, c('QUERY_KEY_MESSAGE_BOARD'));
		$wall = $this->_getParameterAsBoolean($request, c('QUERY_KEY_WALL'));

		$isRelatedPublic = $this->_getParameterAsBoolean($request, c('QUERY_KEY_ACCESS') . c('QUERY_KEY_RELATED'));
		$isMessageBoardPublic = $this->_getParameterAsBoolean($request, c('QUERY_KEY_ACCESS') . c('QUERY_KEY_MESSAGE_BOARD'));
		$isWallPublic = $this->_getParameterAsBoolean($request, c('QUERY_KEY_ACCESS') . c('QUERY_KEY_WALL'));

		$fAccess = 0;
		$features = 0;

		if ($related) {
			$features += Searchable::$BITMASK_RELATED;
		}
		if ($board) {
			$features += Searchable::$BITMASK_MESSAGE_BOARD;
		}
		if ($wall) {
			$features += Searchable::$BITMASK_WALL;
		}

		if ($isRelatedPublic) {
			$fAccess += Searchable::$BITMASK_RELATED;
		}
		if ($isMessageBoardPublic) {
			$fAccess += Searchable::$BITMASK_MESSAGE_BOARD;
		}
		if ($isWallPublic) {
			$fAccess += Searchable::$BITMASK_WALL;
		}

		$S->setFeatures($features);
		$S->setFeatureAccess($fAccess);
		$man->updateSearchable($S);
		$this->_replaceAuthorizedUser($request, $aUser, $S);
	}

	/**
	 * Dispatch function to handle the update of the admins for a Searchable.
	 * @method _handleUpdateSearchableAdmins
	 * @param  $request {HttpServletRequest} Required. The request object.
	 * @param  $man {BaseManager} Required. The DB communication object.
	 * @param  $S {Searchable} Required. The Searchable to update.
	 * @param  $aUser {Searchable} Required. The active user.
	 * @return {String} The error or message.
	 * @access private
	 * @since  Release 1.0
	 */
	private function _handleUpdateSearchableAdmins($request, $man, $S, $aUser) {
		$aSearchables = explode(',', $request->getParameter(c('QUERY_KEY_ID') . 's'));
		$aCheckedSearchables = $request->getParameterValues('checkboxes');

		$aSearchablesToAdd = array();
		$aSearchablesToRemove = array();

		$oCheckedIds = array();

		/*
		if (!sizeof($aCheckedSearchables)) {
			return 'At least one member must remain the administrator of ' . $S->getType() . '.';
		}
		*/

		// find searchables that are checked
		foreach ($aCheckedSearchables as $id) {
			$oCheckedIds[$id] = true;
		}

//		dlog(implode(',', $aCheckedSearchables));

		// iterate on all shown searchables and create a list of searchables to and/remove as admin
		foreach ($aSearchables as $id) {
			if (array_key_exists($id, $oCheckedIds)) {
				array_push($aSearchablesToAdd, $id);
			}
			else {
				array_push($aSearchablesToRemove, $id);
			}
		}

		// this request will prevent superadmins from being unchecked (super admins are disabled)
		$man->updateSearchableAdmins($S->getId(), $aSearchablesToAdd, $aSearchablesToRemove);

		return 'M: Administrator access has been successfully updated.';
	}

	/**
	 * Dispatch function to handle the update of a Searchable email.
	 * @method _handleUpdateSearchableEmail
	 * @param  $request {HttpServletRequest} Required. The request object.
	 * @param  $man {BaseManager} Required. The DB communication object.
	 * @param  $S {Searchable} Required. The Searchable to update.
	 * @param  $aUser {Searchable} Required. The active user.
	 * @return {String} The error or message.
	 * @access private
	 * @since  Release 1.0
	 */
	private function _handleUpdateSearchableEmail($request, $man, $S, $aUser) {
		$email = $this->_getParameterAsString($request, c('QUERY_KEY_EMAIL'), '', c('PARANOID_ALLOWED_URI'));
		$len = strlen($email);
		$error = 'The email <q>' . $email . '</q> ';
		$aUserId = $aUser->getId();
		$sId = $S->getId();
		$isSameUser = $aUserId === $sId;
		$msg = 'M:' . ($isSameUser ? 'Your email' : 'The email <q>' . $S->getEmail() . '</q>') . ' was successfully changed to <q>' . $email . '</q>.';

		// allow removing the email for non-users
		if ($S->isUser() || $email) {

			if (6 > $len || 256 < $len) {
				return $error . 'is the wrong length; it must be between 6 and 255 characters.';
			}
			else if (! preg_match('/^[\w._%-+]+@[\w.-]+\.[A-Z]{2,4}$/i', $email)) {
				return $error . 'is not a valid email address.';
			}
			else if (! $man->isEmailAvailable($email)) {
				return $error . 'is already in use. Please try another one.';
			}

			if ($isSameUser) {
				$aUser->setEmail($email);

				// must resend the registration email and mark the user as pending
				if ('true' === $this->props->getProperty('project.requiresRegistration')) {
					$nm = $this->_getNotificationManager($request);
					$man->updateSearchableField($aUserId, 'pending_bit', Searchable::$PENDING_BITMASK_REGISTRATION);
					$man->updateSearchableField($aUserId, 'status', Searchable::$STATUS_PENDING);
					$nm->notifyByUser($S, NotificationManager::$SIGNUP_CONFIRMATION);
					$msg .= " An email was sent to your new address. You won't be able to log in again until you follow the link in that email.";
				}
			}

			createTextImage($email, 'emails/' . $aUser->getKey());
		}

		$man->updateSearchableField($sId, c('QUERY_KEY_EMAIL'), $email);
		return $msg;
	}

	/**
	 * Dispatch function to handle the updating of a Searchable members.
	 * @method _handleUpdateSearchableMembers
	 * @param  $request {HttpServletRequest} Required. The request object.
	 * @param  $man {BaseManager} Required. The DB communication object.
	 * @param  $S {Searchable} Required. The Searchable to update.
	 * @param  $aUser {Searchable} Required. The active user.
	 * @return {String} The error or message.
	 * @access private
	 * @since  Release 1.0
	 */
	private function _handleUpdateSearchableMembers($request, $man, $S, $aUser) {
		$nm = $this->_getNotificationManager($request);
		$sId = $S->getId();

		$aSearchables = explode(',', $request->getParameter(c('QUERY_KEY_ID') . 's'));
		$aCheckedSearchables = $request->getParameterValues('checkboxes');

		list($members) = $man->readMembers($S->getId(), array('memberStatus' => Searchable::$STATUS_ACTIVE));

		$aSearchablesToAdd = array();
		$aSearchablesToRemove = array();
		$aSearchablesMembers = array();

		$oCheckedIds = array();

		foreach ($members as $s) {
			if (!$s->isAdmin()) {
				array_push($aSearchablesMembers, $s->getId());
			}
		}

		// find searchables that are checked
		foreach ($aCheckedSearchables as $id) {
			$oCheckedIds[$id] = true;
		}

		// iterate on all shown searchables and create a list of searchables to and/remove as admin
		foreach ($aSearchables as $id) {
			if (array_key_exists($id, $oCheckedIds)) {
				array_push($aSearchablesToAdd, $id);
			}
			else {
				array_push($aSearchablesToRemove, $id);
			}
		}

		// only add non-existing members
		$aSearchablesToAdd = array_diff($aSearchablesToAdd, $aSearchablesMembers);

		// only remove existing members; only admins have the rights to remove members
		$aSearchablesToRemove = $S->isAdmin() ? array_intersect($aSearchablesToRemove, $aSearchablesMembers) : array();

		// notify users
		if ($S->isGroup()) {
			foreach ($aSearchablesToAdd as $uId) {
				$user = $man->getSearchableById($uId);
				$data = array('NAME' => $S->getName());
				$nm->notifyByUser($user, NotificationManager::$GROUP_INVITED, $data);

				$o = new Notification();
				$o->setSearchableById($sId);
				$o->setSearchableToId($uId);
				$o->setType(c('NotificationTypeMember'));
				$man->createNotification($o);
			}
		}

		$status = $S->isNetwork() ? Searchable::$STATUS_ACTIVE : null;
		$man->updateSearchableMembers($S, $aSearchablesToAdd, $aSearchablesToRemove, $status);

		$m = sizeof($aSearchablesToAdd);
		$n = sizeof($aSearchablesToRemove);

		$textAdded = $S->isGroup() ? 'invited' : 'added';

		if (!($n + $m)) {
			return 'M: No changes were made.';
		}
		else {
			$addMemberName = $this->_getFeatureCustomName('member', false, 1 !== $m);
			$remMemberName = $this->_getFeatureCustomName('member', false, 1 !== $n);
			$addMemberName .= (1 === $m) ? ' was' : ' were';
			$remMemberName .= (1 === $n) ? ' was' : ' were';
			$textAdmin = $S->isAdmin() ? 'and ' . $n . ' ' . $remMemberName . ' removed from' : '';
			return 'M:' . $m . ' ' . $addMemberName . ' ' . $textAdded . ' to ' . $textAdmin . ' this ' . $S->getType() . '.';
		}
	}

	/**
	 * Dispatch function to handle the updating of a Searchable name.
	 * @method _handleUpdateSearchableName
	 * @param  $request {HttpServletRequest} Required. The request object.
	 * @param  $man {BaseManager} Required. The DB communication object.
	 * @param  $S {Searchable} Required. The Searchable to update.
	 * @param  $aUser {Searchable} Required. The active user.
	 * @return {String} The error or message.
	 * @access private
	 * @since  Release 1.0
	 */
	private function _handleUpdateSearchableName($request, $man, $S, $aUser) {
		$name = $this->_getParameterAsString($request, c('QUERY_KEY_NAME'), '', array(' ', '-', '_', "'"));
		$len = strlen($name);
		$error = 'The name <q>' . $name . '</q> ';
		$isSameUser = $aUser->getId() === $S->getId();

		if (!$name || $name !== $request->getParameter(c('QUERY_KEY_NAME'))) {
			return $error . 'contains invalid characters, only alpha-numeric, space, underscore, single-quote, and dash characters are allowed.';
		}
		else if (4 > $len && 45 < $len) {
			return $error . 'is the wrong length; it must be between 4 and 45 characters.';
		}
		else if (!$man->isNameAvailable($name)) {
			return $error . 'is already in use. Please try another one.';
		}

		if ($isSameUser) {
			$aUser->setName($name);
		}
		$man->updateSearchableField($S->getId(), c('QUERY_KEY_NAME'), $name);
		return 'M:' . ($isSameUser ? 'Your name' : 'The name <q>' . $S->getName() . '</q>') . ' was successfully changed to <q>' . $name . '</q>.';
	}

	/**
	 * Dispatch function to handle the update of a Searchable notification.
	 * @method _handleUpdateSearchableNotification
	 * @param  $request {HttpServletRequest} Required. The request object.
	 * @param  $man {BaseManager} Required. The DB communication object.
	 * @param  $S {Searchable} Required. The Searchable to update.
	 * @param  $aUser {Searchable} Required. The active user.
	 * @return {String} The error or message.
	 * @access private
	 * @since  Release 1.0
	 */
	private function _handleUpdateSearchableNotification($request, $man, $S, $aUser) {
		$bool = $this->_getParameterAsBoolean($request, c('QUERY_KEY_CONFIRM'));
		$man->updateSearchableField($S->getId(), 'notify', $bool);
		$isSameUser = $aUser->getId() === $S->getId();
		if ($isSameUser) {
			$aUser->setNotify($bool);
		}
		return 'M:' . ($isSameUser ? 'Your notification preferences' : 'The notification preferences for <q>' . $S->getName() . '</q>') . ' was successfully changed to <q>' . ($bool ? 'on' : 'off') . '</q>.';
	}

	/**
	 * Dispatch function to handle the updating of a Searchable portrait.
	 * @method _handleUpdateSearchablePortrait
	 * @param  $request {HttpServletRequest} Required. The request object.
	 * @param  $man {BaseManager} Required. The DB communication object.
	 * @param  $S {Searchable} Required. The Searchable to update.
	 * @param  $aUser {Searchable} Required. The active user.
	 * @return {String} The error or message.
	 * @access private
	 * @since  Release 1.0
	 */
	private function _handleUpdateSearchablePortrait($request, $man, $S, $aUser) {
		// todo: write this, requires removing portraits from custom fields logic
	}

	/**
	 * @Override
	 */
	protected function _isAuthorized($S) {
		return ($S && ($S->isAdmin() || (('joinSearchable') && $S->isOpen()))) || 'createSearchable' || 'createSearchableFriend';
	}
}

?>
