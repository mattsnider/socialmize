<?php
import('project.action.admin.ControllerAdmin');

/**
 * @package project.action.admin
 */
class ControllerUnmakeAdmin extends ControllerAdmin {

    /**
     * @Override
     */
	function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$request->getSession()->setAttribute('isAdminView', ref(false));
		$response->sendRedirect('/home.action');
		return 'redirect';
	}
}