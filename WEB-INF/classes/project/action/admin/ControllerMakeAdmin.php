<?php
import('project.action.admin.ControllerAdmin');

/**
 * @package project.action.admin
 */
class ControllerMakeAdmin extends ControllerAdmin {

    /**
     * @Override
     */
	function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$request->getSession()->setAttribute('isAdminView', ref(true));
		$response->sendRedirect('/admin.action?' . c('QUERY_KEY_PAGE') . '=dash');
		return 'redirect';
	}
}