<?php

import('project.action.ControllerBase');
import('project.model.ProfileWidget');
import('project.model.ProfileWidgetField');

/**
 * @package project.action.submit
 */
class ControllerManageSubmit extends ControllerBase {

	/**
	 * @Override
	 */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

		// Retrieve values from request
		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'));
		$userkey = $this->_getParameterAsString($request, 'u' . c('QUERY_KEY_KEY'));

		// retrieve managers and create active user references
		list($man. $gm) = $this->_getServices($request, 'BaseManager', 'GroupManager');
		$aUserId = $aUser->getId();

		if (($S || 'create' === $task) && $task && $S->isAdmin()) {
			$sId = $S->getId();
			$user = null;

			if ($userkey) {
				$user = $man->getSearchableByKey($userkey);
			}

			$url = '/manage.action?' . c('QUERY_KEY_KEY') . '=' . $S->getKey();

			switch ($task) {
				case 'addAdmin':
					if ($S->isSuperAdmin() && $user) {
						$m = Member::createSimple($sId, $user->getId());
						$m->setAdmin(true);
						$gm->createMember($m);
						$this->_parseMessage($request, 'M:Administrator added.');
					}
					else {
						$this->_parseMessage($request, 'You are not authorized to add an Administrator.');
					}
					break;

				case 'change':
					if ($S->isSuperAdmin() && $user) {
						$m = Member::createSimple($sId, $user->getId());
						$m->setAdmin(true);
						$m->setSuperAdmin(true);
						$gm->createMember($m);

						$m = Member::createSimple($sId, $aUserId);
						$m->setAdmin(true);
						$m->setSuperAdmin(false);
						$gm->createMember($m);
						$this->_parseMessage($request, 'M:Super Administrator changed.');
					}
					else {
						$this->_parseMessage($request, 'You are not authorized to change a Super Administrator.');
					}
					break;

				case 'delete':
					if ($S->isSuperAdmin()) {
						$man->updateSearchableStatus($S->getId(), Searchable::$STATUS_DELETED, $aUser->getAccess());
						$response->sendRedirect('/mygroups.action');
						return ref('forward');
					}

					break;

				case 'remove':
					if ($S->isAdmin() && $user && !$user->isSuperAdmin()) {
						if (!$user->isAdmin() || $S->isSuperAdmin()) {
							$m = Member::createSimple($sId, $user->getId());
							$m->setStatus(Searchable::$STATUS_DELETED);
							$m->setAdmin(false);
							$m->setSuperAdmin(false);
							$gm->createMember($m);
							$this->_parseMessage($request, 'M:User successfully removed from the group.');
						}
						else {
							$this->_parseMessage($request, 'You are not authorized to remove an Administrator.');
						}
					}
					else {
						$this->_parseMessage($request, 'You are not authorized to remove a member.');
					}
					break;

				case 'removeAdmin':
					if ($S->isSuperAdmin() && $user) {
						$m = Member::createSimple($sId, $user->getId());
						$m->setAdmin(false);
						$gm->createMember($m);
						$this->_parseMessage($request, 'M:Administrator removed.');
					}
					else {
						$this->_parseMessage($request, 'You are not authorized to remove an Administrator.');
					}
					break;

				default:
					return ref('failure');
					break;
			}

			$response->sendRedirect($url);
			return ref('redirect');
		}
		else {
			return ref('failure');
		}
	}
}

?>