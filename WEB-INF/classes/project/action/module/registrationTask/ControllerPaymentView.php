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

		if ($aUser) {
			$aUser->setStatus(Searchable::$STATUS_PENDING);
			$man->updateSearchable($aUser);
			$request->getSession()->setAttribute('User', $aUser);
		}

		$request->setAttribute('S', $aUser);
		
		return ref('success');
	}
}

?>
