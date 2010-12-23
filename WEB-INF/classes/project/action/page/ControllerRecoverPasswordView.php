<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerRecoverPasswordView extends ControllerPage {

	function __construct() {
		$this->_requiresLogin = false;
		$this->_requiresRegistration = false;
	}

	/**
	 * @Override
	 */
	function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		// retrieve manager
		list($man) = $this->_getServices($request, 'BaseManager');
		$session = $request->getSession();

		$confirm = $session->getAttribute('confirm');
		$session->removeAttribute('confirm');

		$this->updateHeadAttributes($request, '', array('login'), array('login'));

		$request->setAttribute('confirm', $confirm);

		return ref('recoverPassword');
	}
}

?>
