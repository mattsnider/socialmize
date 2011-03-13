<?php

import('project.action.module.ControllerModuleSubmitBase');
import('project.service.ServiceRegistration');
import('project.util.SearchableCheckboxUtils');

/**
 * @package project.action.user
 */
class ControllerJoinSubmit extends ControllerModuleSubmitBase {

	public static function loginEvaluation($man, $userId) {
		return false;
	}

	/**
	 * @Override
	 */
	public function executeActually(&$form, &$request, &$response, &$aUser, $S) {
		list($man) = $this->_getServices($request, 'ServiceMember');

		list($searchables_to_add) = SearchableCheckboxUtils::processSearchableCheckbox($request);

		$uri = '/home.action';

		// ensure always a member of the root network
		if (! in_array(c('ROOT_NETWORK'), $searchables_to_add)) {
			array_push($searchables_to_add, c('ROOT_NETWORK'));
		}

		list($searchables) = $man->readSearchables(array('sId' => $searchables_to_add));

		$msg = '';
		$privateMembers = array();
		$privateTypes = array();

		foreach ($searchables as $s) {
			if ($s->isUser()) {
				$o = Member::createSimple($aUser, $s);
				$o->setStatus(Searchable::$STATUS_PENDING);
				$man->createMember($o);
				$nm = $this->_getNotificationManager($request);
				$nm->notifyUser($man, $s, $aUser);

				array_push($privateMembers, '<q>' . $s->getName() . '</q>');
				array_push($privateTypes, $s->getType());
			}
			else {
				if ($s->isOpen()) {
					$o = Member::createSimple($s, $aUser);
				}
				else {
					$o = Member::createSimple($aUser, $s);
					$o->setStatus(Searchable::$STATUS_PENDING);
					array_push($privateMembers, '<q>' . $s->getName() . '</q>');
					array_push($privateTypes, $s->getType());
				}

				$man->createMember($o);
			}
		}

		if (sizeof($privateMembers)) {
			array_unique($privateTypes);
			$msg = rimplode(', ', $privateMembers, ' and ') . (1 == sizeof($privateMembers) ? ' has' : ' have') .
				   ' restricted privacy settings. They must confirm your connection before it shows up on your pages.';
		}

		if ($msg) {
			$this->_parseMessage($request, $msg);
		}

		if ($aUser->getRegistrationTask()) {
			$this->_updateNextTask($request, $aUser->getRegistrationTask()->getId());
		}

		$response->sendRedirect($uri);
		return 'forward';
	}
}

?>
