<?php

import('project.action.module.ControllerModuleSubmitBase');
import('project.service.ServiceRegistration');

/**
 * @package project.action.user
 */
class ControllerPaymentSubmit extends ControllerModuleSubmitBase {

	function __construct() {
		$this->_requiresRegistration = false;
		$this->_requiredMethod = 'GET';
	}

	public static function loginEvaluation($man, $userId) {
		return false;
	}

	/**
	 * @Override
	 */
	public function executeActually(&$form, &$request, &$response, &$aUser, $S) {
		list($man) = $this->_getServices($request, 'BaseManager');

		$isValid = true;

		$uri = $isValid ? '/home.action' : '/registration_view_payment.action';

		if ($isValid) {
			$aUser->setStatus(Searchable::$STATUS_ACTIVE);
			$request->getSession()->setAttribute('User', $aUser);
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
