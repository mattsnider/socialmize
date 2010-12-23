<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerAccountView extends ControllerPage {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$this->getLog();

		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'BaseManager');

        $this->updateHeadAttributes($request, 'Account Settings', array('account'), array('account'));

		return ref('success');
	}
}
?>
