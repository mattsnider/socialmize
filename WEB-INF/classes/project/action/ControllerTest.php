<?php

import('studs.action.Action');
import('project.service.UserManager');

/**
 * @package project.action
 */
class ControllerTest extends Action {

	function &execute(&$mapping, &$form, &$request, &$response) {
		$log =& Logger::getLogger('project.action.TestAction');

		$aUser =& new User();

		$log->error(getDatetime(time()));

		$request->setAttribute('aUser', $aUser);

		return $mapping->findForward(ref('success'));
	}

}