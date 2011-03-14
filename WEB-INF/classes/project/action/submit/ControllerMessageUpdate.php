<?php

import('project.action.ControllerBase');
import('project.util.SearchableCheckboxUtils');

/**
 * @package project.action.submit
 */
class ControllerMessageUpdate extends ControllerBase {

    /**
     * @Override
     */
	public function executeActually(&$form, &$request, &$response, $aUser, $S) {
		$l = $this->getLog();

		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'UserManager');

		$pageName = $this->getPagename($request);

		$url = $this->getHistory($request, 0);

		switch ($pageName) {
			case 'createMessage':
				list($message, $sUrl) = $this->_handleCreateMessage($request, $S, $aUser);
				if ($sUrl) {$url = $sUrl;}
				break;

			case 'deleteMessage':
				$messageId = $this->_getParameterAsInteger($request, c('QUERY_KEY_MESSAGE_ID'));
				$man->updateMessageStatus($messageId, $aUser->getId(), Message::$STATUS_DELETED);
				$man->deleteNotificationsByRelatedId($messageId);
				$url = $this->getHistory($request, 1);
				break;

			default:
				// todo: this should be a generic message with a CTA to contact support
				$message = 'Invalid URL requested. Try your last operation again, or notify an administrator.';
		}

		$this->_parseMessage($request, $message);
		$response->sendRedirect($url);
		return 'redirect';
	}

	/**
	 * Dispatch function to handle the creation of a Message.
	 * @method _handleCreateMessage
	 * @param  $request {HttpServletRequest} Required. The request object.
	 * @param  $man {BaseManager} Required. The DB communication object.
	 * @param  $S {Searchable} Required. The Searchable to update.
	 * @param  $aUser {Searchable} Required. The active user.
 	 * @return {String} The forwarding URL.
	 * @access private
	 * @since  Release 1.0
	 */
	private function _handleCreateMessage($request, $S, $aUser) {
		list($man, $serviceMember) = $this->_getServices($request, 'UserManager', 'ServiceMember');

		$subject = $this->_getParameterAsString($request, c('QUERY_KEY_SUBJECT'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS'));
		$body = $this->_getParameterAsHTMLFreeString($request, c('QUERY_KEY_BODY'));
		$thread = $this->_getParameterAsString($request, c('QUERY_KEY_THREAD'));
		$stype = $this->_getParameterAsString($request, c('QK_TYPE'));

		$isSearchableAdmin = $S->getId() == c('ADMIN_ID');

		if ('type your subject here' == $subject) {$subject = '';}
		if ('type your message here' == $body) {$body = '';}

		$session = $request->getSession();
		$session->setAttribute(c('QUERY_KEY_SUBJECT'), $subject);
		$session->setAttribute(c('QUERY_KEY_BODY'), $body);

		if ($body) {
			if ($subject) {
				$m = new Message();
				$m->setBody($body);
				$m->setSubject($subject);
				$m->setSender($S);

				if ($thread) {$m->setThread($thread);}

				list($searchables_to_add) = SearchableCheckboxUtils::processSearchableCheckbox($request);
				list($aCheckedSearchables) = $man->readSearchables(array('sId' => $searchables_to_add));
				$users = array();

				if (! sizeof($aCheckedSearchables)) {
					return array('You must select a recipient.', null);
				}

				$sb = array();
				foreach ($aCheckedSearchables as $o) {
					if ($o->isNetwork()) {
						list($snetworks, $members, $submembers, $pnetworks) = $serviceMember->readNetworksAndMembers($o->getId());
						$users = array_merge($users, $members, $submembers);
					}
					else if ($o->isGroup()) {
						list($members) = $serviceMember->readMembers($o->getId());
						$users = array_merge($users, $members);
					}
					else if ($o->isUser()) {
						array_push($users, $o);
					}
					
					array_push($sb, $o->getName());
				}

				$map_users = array();
				$new_users = array();

				// make unique
				foreach ($users as $user) {
					if (! array_key_exists($user->getId(), $map_users)) {
						$map_users[$user->getId()] = 1;
						array_push($new_users, $user);
					}
				}

				$users = $new_users;

				$man->saveMessageBatch($m, $users);
				$msg = 'M:Message sent to <q>'.implode('</q>,<q>',$sb).'</q>.';

				$i = strrpos($msg, ',');

				if ($i) {
					$msg = substr($msg, 0, $i) . ', and' . substr($msg, $i + 1);
				}

				if ($isSearchableAdmin) {
					$url = '/admin.action?page=message';
				}
				else if ($S->isUser()) {
					$url = '/message.action?'.c('QUERY_KEY_MESSAGE_ID').'='.$m->getId();
				}
				else {
					$url = '/profile.action?key=' . $S->getKey();
				}

				// iterate on the users and notify the users as necessary
				foreach ($users as $s) {
					// users should not be able to message themselves
					if ($s->getId() !== $aUser->getId()) {
						// send notification
						$nm = $this->_getNotificationManager($request);
						$nm->notifyByUser($s, NotificationManager::$MESSAGE_RECEIVED, array('NAME' => $S->getName(), 'BODY' => $m->getBody(), 'SUBJECT' => $m->getSubject()));

						$o = new Notification();
						$o->setRelatedId($m->getId());
						$o->setSearchableById($S->getId());
						$o->setSearchableToId($s->getId());
						$o->setType(c('NotificationTypeMessage'));
						$man->createNotification($o);
					}
				}

				$session = $request->getSession();
				$session->removeAttribute(c('QUERY_KEY_SUBJECT'));
				$session->removeAttribute(c('QUERY_KEY_BODY'));
				return array($msg, $url);
			}
			else {
				return array('You forgot to include a subject.', null);
			}
		}
		else {
			return array('You forgot to include a message body.', null);
		}
	}
}
?>
