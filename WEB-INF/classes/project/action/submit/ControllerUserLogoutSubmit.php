<?php

import('project.action.ControllerBase');

/**
 * @package project.action.submit
 */
class ControllerUserLogoutSubmit extends ControllerBase {

	function __construct() {
		$this->_requiresLogin = true;
		$this->_requiresRegistration = false;
		$this->_requiredMethod = 'GET';
	}

	/**
	 * @Override
	 */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

		if ($aUser) {
			$log->info($aUser->getName() . ' logged out out @ ' . getDatetime(time()));
		}

		$session = $request->getSession();
		$session->removeAttribute('User');
		$session->invalidate();

		$response->sendRedirect('login.action');

		return ref('success');
	}
}

?>
