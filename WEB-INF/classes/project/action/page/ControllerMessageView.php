<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerMessageView extends ControllerPage {

    /**
     * @Override
     */
	public function executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'UserManager');
		$aUserId = $aUser->getId();
		
		$messageId = $this->_getParameterAsInteger($request, c('QUERY_KEY_MESSAGE_ID'));
		$subject = $this->_getParameterAsString($request, c('QUERY_KEY_SUBJECT'), '', c('PARANOID_ALLOWED_URI_PLUS'));
		$body = $this->_getParameterAsHTMLFreeString($request, c('QUERY_KEY_BODY'));
		$thread = '';
		$mAfterId = '';
		$mBeforeId = '';
		$hasReply = false;

		$sSubject = $this->readSessionValue($request, c('QUERY_KEY_SUBJECT'));
		$sBody = $this->readSessionValue($request, c('QUERY_KEY_BODY'));

		if ($sSubject) {$subject = $sSubject;}
		if ($sBody) {$body = $sBody;}
		
		$m = $man->getMessageById($messageId, $aUserId);
		$isSender = $m->getSender()->getId() === $aUserId;

		// retrieve messages where user is both sender and recipient
		$mset1 = $man->getMessagesByThread($aUserId, $isSender, $m->getThread(), $m->getCreated());
		$mset2 = $man->getMessagesByThread($aUserId, ! $isSender, $m->getThread(), $m->getCreated());

		// order by created
		$messages = array_merge($mset1, $mset2);
		usort($messages, 'sortByCreated');

		$request->setAttribute('message', $m);
		$subject = 're: ' . $m->getSubject();
		$thread = $m->getThread();
		$hasReply = $m->getSender()->isUser() && c('ADMIN_ID') !== $m->getSender()->getId();

		// fetch next message for next/prev
		$after = $man->getMessages($aUserId, $isSender, null, '`M`.`created` > TIMESTAMP("' . $m->getCreated() . '")');
		$before = $man->getMessages($aUserId, $isSender, null, '`M`.`created` < TIMESTAMP("' . $m->getCreated() . '")', 1);
		$mAfterId = sizeof($after) ? $after[sizeof($after) - 1]->getId() : '';
		$mBeforeId = sizeof($before) ? $before[0]->getId() : '';

		// if already read, don't waste MySQL connections
		if (Message::$STATUS_READ !== $m->getStatus() && ! $isSender) {
			// update the status of the message to read
			$man->updateMessageStatus($m->getId(), $aUserId, Message::$STATUS_READ);
			$man->deleteNotificationsByRelatedId($m->getId());
			$messagen = $man->getMessageCount($aUserId, false, 'unread');
			$request->setAttribute(c('MN_MESSAGEN'), $messagen);
		}

		// found threads, should always find 2 or more
		if (sizeof($messages)) {
			$request->setAttribute('messages', $messages);
		}
		// error, did not find threads of message
		else {
			$log->error('Missing message threads for message with id=' . $messageId . '.');
		}

        $nameMessage = $request->getAttribute(c('MN_NAME_MESSAGE'));

		$hd = 'Read ' . $nameMessage;
		$sentBy = $aUser->getKey();

		$request->setAttribute('hasReply', $hasReply);
		$request->setAttribute('body', $body);
		$request->setAttribute('isRead', ref(true));
		$request->setAttribute('mAfterId', $mAfterId);
		$request->setAttribute('mBeforeId', $mBeforeId);
		$request->setAttribute(c('QUERY_KEY_KEY').'By', $sentBy);
		$request->setAttribute(c('QUERY_KEY_PAGE'), ref('mailbox'));
		$request->setAttribute('sendTo', ref($isSender ? $m->getRecipient() : $m->getSender()));
		$request->setAttribute('subject', $subject);
		$request->setAttribute('thread', $thread);
		$request->setAttribute(c('QK_TYPE'), ref(null));
		$request->setAttribute('title', $hd);

        $this->updateHeadAttributes($request, $hd, array('message'), array('message'));
		
		return 'success';
	}

    /**
     * @Override
     */
	protected function _isAuthorized($S, $request, $aUser) {
		$messageId = $this->_getParameterAsInteger($request, c('QUERY_KEY_MESSAGE_ID'));
		$aUserId = $aUser->getId();
		list($man) = $this->_getServices($request, 'UserManager');
		$m = $man->getMessageById($messageId, $aUserId);

		if ($m) {
			return $m->getRecipient()->getId() === $aUserId || $m->getSender()->getId() === $aUserId;
		}
		else {
			$this->_parseMessage($request, 'Referencing a non-existing messge with id=' . $messageId . '.');
		}

		return false;
	}
}
?>