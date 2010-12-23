<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerMessageViewList extends ControllerPage {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

		// Retrieve values from request

		$out =& $this->_getParameterAsBoolean($request, c('QUERY_KEY_OUT'));

		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'BaseManager');
		$aUserId = $aUser->getId();
		
		$messages = $man->getMessages($aUserId, $out);
		$messagen = $man->getMessageCount($aUserId, $out);
		$newmessagen = $man->getMessageCount($aUserId, $out, 1);

		// special code to retrieve the right status for inbox messages
//		if (! $out) {
//			foreach ($messages as &$o) {
//				$s = $man->getMessageStatus($o->getId(), $aUserId);
//				$o->setStatus($s);
//			}
//		}

		// iterate on the messages and inject group data as necessary
//		foreach ($messages as &$o) {
//			if (! $o->getSenderId()) {
//				$gname = str_replace('Message from Group: ', '', $o->getSubject());
//				$gid = $gm->getAutocompleteIdByName($gm->_db_table_group, $gname);
//				$group =& $gm->getGroupById($gid, $aUser);
//				$p =& $gm->getGroupProfile($group);
//				$o->setSender($group);
//			}
//			dlog('r:' . $o->getRecipient()->toString());
//			dlog('s:' . $o->getSender()->toString());
//		}

		$request->setAttribute('messages', $messages);
		$request->setAttribute('messagen', $messagen);
		$request->setAttribute('newmessagen', $newmessagen);
		$request->setAttribute('out', $out);
		$request->setAttribute(c('MN_PAGENAME'), ref($out ? 'outbox' : 'inbox'));

        $nameMessage = $request->getAttribute(c('MN_NAME_MESSAGE'));
        $this->updateHeadAttributes($request, "Your $nameMessage: " . ($out? 'Out': 'In') . 'box', array('mailbox'), array('mailbox'));
		
		return ref('success');
	}
}
?>