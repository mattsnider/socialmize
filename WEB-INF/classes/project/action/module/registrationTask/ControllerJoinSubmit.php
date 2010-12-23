<?php

import('project.action.module.ControllerModuleSubmitBase');
import('project.service.ServiceRegistration');

/**
 * @package project.action.user
 */
class ControllerJoinSubmit extends ControllerModuleSubmitBase {

	/**
	 * @Override
	 */
	public function executeActually(&$form, &$request, &$response, &$aUser, $S) {
		list($man) = $this->_getServices($request, 'ServiceMember');

		$aCheckedSearchables = $request->getParameterValues('checkboxes');
		$isGroupAndUser = $this->_getParameterAsString($request, 'more');
		$isSkip = $this->_getParameterAsString($request, 'skip');

		$isValid = sizeof($aCheckedSearchables) || $isSkip;
//		$isValid = false; // debug code to force failure

		$uri = $isValid ? '/home.action' : '/registration_view_join.action';

		// allGroupsAndUsers, allNetworks

		if ($isValid) {
//			$addActiveSearchables = array();
//			$addPendingSearchables = array();

			if ($isGroupAndUser) {
				$request->getSession()->setAttribute('listIsGroupAndUser', $aUser->getRegistrationTask());
				$uri = '/registration_view_join.action';
			}

			list($searchables) = $man->readSearchables(array('sId' => $aCheckedSearchables));

			foreach ($searchables as $s) {
				if ($s->isUser()) {
					$o = Member::createSimple($aUser, $s);
					$o->setStatus(Searchable::$STATUS_PENDING);
					$man->createMember($o);
					$nm = $this->_getNotificationManager($request);
					$nm->notifyUser($man, $s, $aUser);
				}
				else {
					if ($s->isOpen()) {
						$o = Member::createSimple($s, $aUser);
					}
					else {
						$o = Member::createSimple($aUser, $s);
						$o->setStatus(Searchable::$STATUS_PENDING);
					}

					$man->createMember($o);
				}
			}

//			if (sizeof($addActiveSearchables)) {
//				$man->updateSearchableMembers($aUser, $addActiveSearchables, array(), Searchable::$STATUS_ACTIVE);
//			}
//			else {
//				$man->updateSearchableMembers($aUser, $addPendingSearchables, array(), Searchable::$STATUS_PENDING);
//			}

			if ($aUser->getRegistrationTask()) {
				$this->_updateNextTask($request, $aUser->getRegistrationTask()->getId());
			}
		} else {
			$this->_parseMessage($request, 'You must join at least 1 network. Please choose one from the list below.');
		}

		$response->sendRedirect($uri);
		return 'forward';
	}
}

?>
