<?php
import('project.action.module.ControllerModuleViewBase');

/**
 * @package project.action.page
 */
class ControllerPaymentView extends ControllerModuleViewBase {

	/**
	 * @Override
	 */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$this->setupVariables($request, RegistrationTask::$TYPE_PAYMENT);
		return ref('success');
	}
}

?>
