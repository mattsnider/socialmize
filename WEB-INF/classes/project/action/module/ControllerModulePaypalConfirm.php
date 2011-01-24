<?php

import('project.action.module.ControllerModuleSubmitBase');
import('project.service.ServiceRegistration');

/**
 * @package project.action.user
 */
class ControllerModulePaypalConfirm extends ControllerModuleSubmitBase {

	public static function loginEvaluation($man, $userId) {
		return false;
	}

	/**
	 * @Override
	 */
	public function executeActually(&$form, &$request, &$response, &$aUser, $S) {
		list($man) = $this->_getServices($request, 'BaseManager');

		$isValid = true;

		dlog($request->$parameters);

		$uri = $isValid ? '/home.action' : '/registration_view_payment.action';

		if ($isValid) {
			$this->_updateNextTask($request, $aUser->getRegistrationTask()->getId());
		}
		else {
			$this->_parseMessage($request, 'Not implemented!');
		}

		$response->sendRedirect($uri);
		return 'forward';
	}
}

?>
