<?php
import('project.action.page.ControllerPage');
import('project.util.SearchableCheckboxUtils');

/**
 * @package project.action.page
 */
class ControllerMessageCreateView extends ControllerPage {

    /**
     * @Override
     */
	public function executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

		// retrieve managers and create active user references
		list($man, $servMember) = $this->_getServices($request, 'UserManager', 'ServiceMember');
		
		$recipientKey = $this->_getParameterAsString($request, c('QUERY_KEY_KEY') . 'to');
		$recipient = $man->getSearchableByKey($recipientKey);

		$subject = $this->_getParameterAsString($request, c('QUERY_KEY_SUBJECT'), '', c('PARANOID_ALLOWED_URI_PLUS'));
		$body = $this->_getParameterAsHTMLFreeString($request, c('QUERY_KEY_BODY'));

		$sSubject = $this->readSessionValue($request, c('QUERY_KEY_SUBJECT'));
		$sBody = $this->readSessionValue($request, c('QUERY_KEY_BODY'));

		if ($sSubject) {$subject = $sSubject;}
		if ($sBody) {$body = $sBody;}

        $nameMessage = $request->getAttribute(c('MN_NAME_MESSAGE'));

		if (! $S->isUser()) {
			$request->setAttribute(c('MN_PAGENAME'), ref($S->getType() . 'WriteMessage'));
		}

		$request->setAttribute('body', $body);
		$request->setAttribute('isRead', ref(false));
		$request->setAttribute(c('QUERY_KEY_KEY').'By', $S->getKey());
		$request->setAttribute(c('QUERY_KEY_PAGE'), ref('mailbox'));
		$request->setAttribute('sendTo', $recipient);
		$request->setAttribute('subject', $subject);
		$request->setAttribute(c('QK_TYPE'), $S->getType());
		$request->setAttribute('title', ref('New ' . $nameMessage));

        $this->updateHeadAttributes($request, 'Compose a New ' . $nameMessage, array('message'), array('message'));

		return ref('success');
	}

    /**
     * @Override
     */
	protected function _isAuthorized($S) {
	    return $S && $S->isAdmin();
	}
}
?>