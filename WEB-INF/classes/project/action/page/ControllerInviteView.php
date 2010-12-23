<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerInviteView extends ControllerPage {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

		$isSent = 'true' === $request->getSession()->getAttribute('sent');
		$request->getSession()->removeAttribute('sent');

        $project = $this->props->getProperty('project.nameUC');
		$text = 'You have been invited to join ' . $project . '!

' . $project . ' is a private, web-based community for people like you.';

		// process the invite page
		$request->setAttribute('errorDisplay', ref($isSent ? '' : 'displayNone'));
		$request->setAttribute('text', $text);

        $this->updateHeadAttributes($request, '', array('invite'), array('invite'));
		
		return ref('success');
	}

    /**
     * True, when requirements are met. Should overwritten by child class.
     * @method _hasRequired
     * @param aUser {Searchable} Required. The requester.
     * @param S {Searchable} Required. The requested context.
     * @return {Boolean} True, when requirements are met.
	 * @access Protected
	 * @since Release 1.0
     */
	protected function _hasRequired($aUser, $S, $request) {
	    return ! $request->getAttribute('isAdminInvite') || $aUser->isSiteAdmin();
	}
}

?>