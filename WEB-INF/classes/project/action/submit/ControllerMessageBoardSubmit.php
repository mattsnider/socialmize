<?php

import('project.action.ControllerBase');

/**
 * @package project.action.submit
 */
class ControllerMessageBoardSubmit extends ControllerBase {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$l = $this->getLog();

		// Retrieve values from request
		$title = $this->_getParameterAsString($request, c('QK_TITLE'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS'));
		$body = $this->_getParameterAsHTMLFreeString($request, c('QUERY_KEY_BODY'));
		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'));

		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'BaseManager');
		$aUserId = $aUser->getId();
        $sId = $S->getId();

        // deleting a message
        if ($task === 'delete') {
            $mId = $this->_getParameterAsInteger($request, c('QUERY_KEY_MESSAGE_ID'));
            $aId = $aUserId;

            // if this is the admin, fetch the user from the message
            if ($S->isAdmin()) {
                // fetch the message board to view
                $message = $mId ? $man->getMessageBoardByParams(array('messageId' => $mId)) : null;
                if ($message) {$aId = $message->getCreatorId();}
            }

            $this->deleteMessage($man, $S, $aId, $mId);
			$this->_parseMessage($request, 'M:Message deleted successfully.');
        }
        // default: sending a message
        else if ('C' === $task) {
            if ($S->hasMessageBoard() && ($S->isMember() || $S->isMessageBoardPublic())) {
                // all required values are present
                if ($body && $title) {
                    $oId = $this->_getParameterAsInteger($request, c('QUERY_KEY_ORIGINAL_ID'));
                    $pId = $this->_getParameterAsInteger($request, c('QUERY_KEY_PARENT_ID'));

                    // test that the original ID exists, set to ZERO otherwise
                    if ($oId && ! $man->getMessageBoardByParams(array('messageId' => $oId))) {$oId = 0;}
                    // test that the parent ID exists, set to ZERO otherwise
                    if ($pId && ! $man->getMessageBoardByParams(array('messageId' => $pId))) {$pId = 0;}

                    $m = new MessageBoard();
                    $m->setBody($body);
                    $m->setCreatorId($aUserId);
                    $m->setOriginalId($oId);
                    $m->setParentId($pId);
                    $m->setSearchableId($S->getId());
                    $m->setTitle($title);

                    $man->createMessageBoard($m);

                    $response->sendRedirect('/messageBoardView.action?' . c('QUERY_KEY_MESSAGE_ID') . '=' . $m->getId() . '&' . c('QUERY_KEY_KEY') . '=' . $S->getKey());
                    return 'success';
                }
                // missing required value
                else {
                    if (! $title) {
                        $l->warn('Missing title');
						$this->_parseMessage($request, 'You forgot to include a title.');
                    }
                    else if (! $body) {
						$this->_parseMessage($request, 'You forgot to include a message body.');
                        $l->warn('Missing body');
                    }

                    $q = array();
                    $q[0] = c('QUERY_KEY_KEY');
                    $q[1] = '=';
                    $q[2] = $S->getKey();
                    $q[3] = '&';
                    $q[4] = c('QK_TITLE');
                    $q[5] = '=';
                    $q[6] = $title;
                    $q[7] = '&';
                    $q[8] = c('QUERY_KEY_BODY');
                    $q[9] = '=';
                    $q[10] = $body;
                    $q[11] = '&';
                    $q[12] = c('QUERY_KEY_NO_CACHE');
                    $q[13] = '=1';
                    $response->sendRedirect(ref('/messageBoardView.action?' . implode('', $q)));
                    return "redirect";
                }
            }
            else {
                $uError = 'Unknown error.';
                $lError = 'Unknown error.';
                $nameMember = $this->_getFeatureCustomName('member');
                $nameMessageBoard = $this->_getFeatureCustomName('messageBoard');

                if (! $S->hasMessageBoard()) {
                    $uError = '{0} does not have a {1}.';
                    $lError = $aUserId . " is attempting to access a Searchable ($sId) $nameMessageBoard that does not have one.";
                }
                else if (! $S->isMember()) {
                    $uError = '{0} requires that you join before using their {1}.';
                    $lError = $aUserId . " is attempting to access a private Searchable ($sId) $nameMessageBoard, but is not a $nameMember.";
                }

				$this->_parseMessage($request, $uError, $S->getName(), $nameMessageBoard);
                $log->warn($lError);
                $response->sendRedirect(ref('/home.action'));
                return "redirect";
            }
        } // end of $S test
        else {
            return ref('failure');
        }

        $response->sendRedirect('/index.php' . $this->getHistory($request, 1));
        return 'redirect';
	}

    /**
     * Deletes a message and all its children, recursively.
     * @method deleteMessage
     * @param man {Manager} Required. The DB manager.
     * @param S {Searchable} Required. The searchable MB belongs to.
     * @param aUserId {Integer} Required. The acting user DB PK.
     * @param mId {Integer} Required. The message DB PK to deleted.
     * @access Private
     * @since Release 1.0
     */
	private function deleteMessage($man, $S, $aUserId, $mId) {
        // fetch the message board to view
        $message = $mId ? $man->getMessageBoardByParams(array('messageId' => $mId)) : null;

        if ($message) {
            list($posts, $n) = $man->getMessageBoardsByParams(array('sId' => $S->getId(), 'S' => $S, 'pId' => $mId));

            if ($n) {
                for ($i = 0; $i < $n; $i += 1) {
                    $this->deleteMessage($man, $S, $aUserId, $posts[$i]->getId());
                }
            }

            $man->updateMessageBoardStatus($mId, $aUserId, Message::$STATUS_DELETED);
        }
	}

    /**
     * True, when searchable exists.
     * @method _hasRequired
     * @param aUser {Searchable} Required. The requester.
     * @param S {Searchable} Required. The requested context.
     * @return {Boolean} True, when requirements are met.
	 * @access Protected
	 * @since Release 1.0
	 * @Override
     */
	protected function _hasRequired($aUser, $S) {
	    return $S && $S->getId();
	}
}
?>
