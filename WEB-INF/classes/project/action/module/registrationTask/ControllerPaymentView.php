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
		$man = new BaseManager($this->getDataSource($request));

		if ($S) {
			$S->setStatus(Searchable::$STATUS_PENDING);
			$man->updateSearchable($S);
		}
		
		return ref('success');
	}
}

?>
