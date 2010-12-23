<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerAboutView extends ControllerPage {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$cm = $this->_getContentManager($request);
		$log = $this->getLog();

		$about = $cm->fetchContent(ContentManager::$CONTENT_ABOUT);
        $this->updateHeadAttributes($request, '', array('terms'), array('terms'));

        $request->setAttribute(c('QK_ABOUT'), $about);
		return ref('success');
	}
}

?>
