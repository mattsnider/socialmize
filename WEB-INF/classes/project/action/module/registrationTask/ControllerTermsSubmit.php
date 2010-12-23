<?php

import('project.action.module.ControllerModuleSubmitBase');
import('project.service.ServiceRegistration');

/**
 * @package project.action.user
 */
class ControllerTermsSubmit extends ControllerModuleSubmitBase {

	/**
	 * @Override
	 */
	public function executeActually(&$form, &$request, &$response, &$aUser, $S) {
		// Retrieve values from request
		$terms = $this->_getParameterAsBoolean($request, c('QUERY_KEY_TERMS'));

		$uri = $terms ? '/home.action' : '/registration_view_tos.action';

		if ($terms) {
			$this->_updateNextTask($request, $aUser->getRegistrationTask()->getId());
		}

		$response->sendRedirect($uri);
		return 'forward';
	}
}

?>
