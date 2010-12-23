<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerCreateSearchableView extends ControllerPage {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

        $this->updateHeadAttributes($request, '', array(), array('account', 'create'));
		$request->setAttribute(c('MN_PAGENAME'), ref($request->getParameter(c('QUERY_KEY_TASK')) . 'Create'));
		
		return ref('success');
	}
}
?>
