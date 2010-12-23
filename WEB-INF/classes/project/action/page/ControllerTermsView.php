<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerTermsView extends ControllerPage {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

		$cm = $this->_getContentManager($request);
		$terms = $cm->fetchContent(ContentManager::$CONTENT_TOS);
		$isRead = $this->_getParameterAsBoolean($request, c('QUERY_KEY_IS_READ'));

        $this->updateHeadAttributes($request, '', array('terms'), array('terms'));

        $request->setAttribute(c('QUERY_KEY_TERMS'), $terms);
        $request->setAttribute(c('QUERY_KEY_IS_READ'), ref($isRead ? 'displayNone' : ''));
		return ref('success');
	}
}

?>
