<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerFaqView extends ControllerPage {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$this->getLog();

		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'BaseManager');

        $this->updateHeadAttributes($request, 'FAQ', array('faq'), array('faq'));

		return ref('success');
	}
}
?>
