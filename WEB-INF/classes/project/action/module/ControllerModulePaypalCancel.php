<?php

import('project.action.ControllerBase');

/**
 * @package project.action.user
 */
class ControllerModulePaypalCancel extends ControllerBase {

	public static function loginEvaluation($man, $userId) {
		return false;
	}

	/**
	 * @Override
	 */
	public function executeActually(&$form, &$request, &$response, &$aUser, $S) {
		$request->setAttribute('hideSidebar', ref(true));
		return 'success';
	}
}

?>
