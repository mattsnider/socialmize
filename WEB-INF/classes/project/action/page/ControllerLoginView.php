<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerLoginView extends ControllerPage {

	function __construct() {
		$this->_requiresLogin = false;
		$this->_requiresRegistration = false;
	}

	/**
	 * @Override
	 */
	function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$cm = $this->_getContentManager($request);
		$login = $cm->fetchContent(ContentManager::$CONTENT_LOGIN);
		$signup = $cm->fetchContent(ContentManager::$CONTENT_SIGNUP);
		$this->updateHeadAttributes($request, '', array('login'), array('login'));

		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'), '', c('PARANOID_ALLOWED_URI'));

		$request->setAttribute(c('QUERY_KEY_TASK'), $task);
		$request->setAttribute('loginCopy', $login);
		$request->setAttribute('signupCopy', $signup);
		$request->setAttribute('emailMask', $this->props->getProperty('project.emailMask'));
		$request->setAttribute('displayEmailMaskMessage', ref($this->props->getProperty('project.emailMask') ? '' : 'displayNone'));

		return ref('login');
	}
}

?>
