<?php
import('project.action.module.ControllerModuleViewBase');

/**
 * @package project.action.page
 */
class ControllerRequiredView extends ControllerModuleViewBase {

	/**
	 * @Override
	 */
	public function executeActually(&$form, &$request, &$response, $aUser, $S) {
		$this->setupVariables($request, RegistrationTask::$TYPE_REQUIRED, array('profileEdit'), array('profileEdit'));

		list($servPW) = $this->_getServices($request, 'ServiceProfileWidget');

		$aFields = $servPW->getRequiredProfileWidgetFields($aUser->getId(), Searchable::$TYPE_USER);
		$needsValue = false;

		// ensure that the fields do not have values yet
		foreach ($aFields as $oField) {
			if (!$oField->getValue()) {
				$needsValue = true;
				break;
			}
		}

		if ($needsValue) {
			$request->setAttribute('fields', $aFields);
			$request->setAttribute('formAction', ref('registration_update_required.action'));
			$request->setAttribute('task', ref('required'));
			$request->setAttribute('S', $aUser);
			$page = 'success';
		} else {
			$this->_updateNextTask($request, $aUser->getRegistrationTask()->getId());
			$response->sendRedirect('home.action');
			$page = 'redirect';
		}

		return $page;
	}
}

?>
