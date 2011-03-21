<?php

import('studs.action.Action');
import('project.service.UserManager');

/**
 * @package project.action
 */
class ControllerPaypalIPN extends Action {

	function &execute(&$mapping, &$form, &$request, &$response) {
		$log =& Logger::getLogger('project.action.TestAction');

		dlog(var_export($request->getParameterMap(), true));

		$man = new UserManager($this->getDataSource($request));

//		$man->markSearchablePaid();

		return $mapping->findForward(ref('json'));
	}

}