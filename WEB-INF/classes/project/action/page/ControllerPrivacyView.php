<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerPrivacyView extends ControllerPage {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

        $this->updateHeadAttributes($request, 'Your Privacy Settings', array('privacy'), array('widget', 'privacy'));
        
		return ref('success');
	}
}

?>
