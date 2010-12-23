<?php
import('project.action.module.ControllerModuleViewBase');

/**
 * @package project.action.page
 */
class ControllerTermsView extends ControllerModuleViewBase {

	/**
	 * @Override
	 */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$cm = $this->_getContentManager($request);
		$terms = $cm->fetchContent(ContentManager::$CONTENT_TOS);
		$isRead = $this->_getParameterAsBoolean($request, c('QUERY_KEY_IS_READ'));

		$this->setupVariables($request, RegistrationTask::$TYPE_TERMS);

		$request->setAttribute(c('QUERY_KEY_TERMS'), $terms);
		$request->setAttribute(c('QUERY_KEY_IS_READ'), ref($isRead ? 'displayNone' : ''));
		return ref('success');
	}
}

?>
