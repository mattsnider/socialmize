<?php

import('project.action.ControllerBase');

/**
 * @package project.action.user
 */
class ControllerUserSubmit extends ControllerBase {

    /**
     * @Override
     */
	public function executeActually(&$form, &$request, &$response, $aUser, $S) {

		// Retrieve values from request
		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'));

		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'BaseManager');
		$aUserId = $aUser->getId();

		switch ($task) {

			case 'invite':
				$allowed = c('PARANOID_ALLOWED_URI');
				array_push($allowed, ',');
				$emails = $this->_getParameterAsString($request, c('QUERY_KEY_EMAIL'), '', $allowed);

				if ($emails) {
					$elist = array();
					$earr = explode(',', $emails);

					// EMAIL DOMAIN VALIDATION
//					$vstr = '@PROJECT_URL';
//
//					foreach ($earr as $email) {
//						if (strpos($email, $vstr)) {
//							$webauthId = str_replace($vstr, '', $email);
//							if (! $man->getUserByWebauthId($webauthId)) {array_push($elist, $email);}
//						}
//					}

					foreach ($earr as $email) {
						if (! $man->hasUserEmail($email)) {array_push($elist, $email);}
					}

					if (sizeof($elist)) {
						$to = implode(',', $elist);
						$msg = $this->_getParameterAsHTMLFreeString($request, c('QUERY_KEY_BODY'));
						$nm = $this->_getNotificationManager($request);

						if ('true' === $this->props->getProperty('project.adminInvite')) {
							$code = $man->getEmailActivationCode();
							$msg .= "<br/><br/>Your activation code is: $code</br></br>";
						}

						$nm->notifyByEmail($to, NotificationManager::$PROJECT_INVITE, array('NAME' => $aUser->getName(), 'BODY' => $msg));
						$request->getSession()->setAttribute('sent', ref('true'));
					}
					else {
						$this->_parseMessage($request, 'A valid email is required.');
					}
				}
				else {
					$this->_parseMessage($request, 'An email is required.');
				}

                $response->sendRedirect('/invite.action');
				return 'forward';

				break;

			case 'markAllRead': // mailbox request
			case 'markAllNew':
			case 'markAllDeleted':
				$out = $this->_getParameterAsBoolean($request, c('QUERY_KEY_OUT'));
				$commaDelimitedMessageIds = $this->_getParameterAsString($request, c('QUERY_KEY_MESSAGE_ID'), '', array(','));
				$messageIdArray = $commaDelimitedMessageIds? explode(',', $commaDelimitedMessageIds): array();
                $response->sendRedirect('/mailbox.action?out=' . $out);
				return ref($this->_handleMailboxActions($aUserId, $man, $task, $messageIdArray));
				break;

			case 'psearch':
				$access = $this->_getRequestAccess($request);
				$aUser->setAccess($access);
				$aUser->setStatus(Searchable::$STATUS_ACTIVE) ;
				$man->updateSearchableStatus($aUserId, Searchable::$STATUS_ACTIVE, $access);
				return ref('xml');

			default:
				return ref('failure');
				break;
		}
	}


	/**
	 *	Handles ajax requests for the mailbox page
	 *	@param	userId {Integer} the authorized User DB PK
	 *	@param	um {UserManager} the User SQL Manager Object
	 *	@param	task {String} the current action
	 *	@param	messageIdArray {Array of Integer} collection of Message DB PKs
	 *	@access	Private
	 *	@since	Release 1.0
	 */
	private function _handleMailboxActions($userId, $man, $task, $messageIdArray) {
		// todo: make this a batch process
		foreach ($messageIdArray as $id) {
			switch ($task) {
				case 'markAllRead':
					$man->updateMessageStatus($id, $userId, Message::$STATUS_READ);
					break;

				case 'markAllNew':
					$man->updateMessageStatus($id, $userId, Message::$STATUS_UNREAD);
					break;

				case 'markAllDeleted':
					$man->updateMessageStatus($id, $userId, Message::$STATUS_DELETED);
					break;

				default:
					// no safe action and assumed behavior of unclear, do nothing for now -mes
					return 'failure';
					break;
			}
		}

		return 'forward';
	}
}
?>
