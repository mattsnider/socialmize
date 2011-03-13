<?php
import('project.action.module.ControllerModuleViewBase');
import('project.util.SearchableCheckboxUtils');
import('project.util.CheckboxUtils');

/**
 * @package project.action.page
 */
class ControllerJoinView extends ControllerModuleViewBase {

	/**
	 * @Override
	 */
	public function &executeActually(&$form, &$request, &$response, $aUser) {
		$isGroupAndUser = $request->getSession()->getAttribute('listIsGroupAndUser');

		$this->setupVariables($request, RegistrationTask::$TYPE_JOIN_NETWORK, array(), array());

		return ref('success');
	}
}

?>
