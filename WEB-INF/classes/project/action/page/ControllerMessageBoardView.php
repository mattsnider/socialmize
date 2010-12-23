<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerMessageBoardView extends ControllerPage {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

        // get variables from parameters
		$mId = $this->_getParameterAsString($request, c('QUERY_KEY_MESSAGE_ID'));

		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'BaseManager');
		$aUserId = $aUser->getId();
		$sId = $S->getId();

        // fetch the message board to view
        $message = $mId ? $man->getMessageBoardByParams(array('messageId' => $mId)) : null;
		
        // initialize children, next, and previous messages
        $mbChildren = array();
        $mbNextId = 0;
        $mbPrevId = 0;

        if ($message) {
            // fetch the user who wrote message
            if ($message->getCreatorId() !== $aUserId) {
                $message->setCreator($man->getUserById($message->getCreatorId()));
            }
            else {
                $message->setCreator($aUser);
            }

            // fetch the children message board posts
            list($mbChildren, $postn) = $man->getMessageBoardsByParams(array('sId' => $S->getId(), 'S' => $S, 'pId' => $mId));

            // fetch the sibling posts
            list($siblings, $siblingn) = $man->getMessageBoardsByParams(array('sId' => $S->getId(), 'S' => $S, 'pId' => $message->getParentId()));

            // post has siblings, find the next/prev ones
            if (1 < $siblingn) {
                $hasFoundMB = false;

                // iterate on the siblings
                for ($i = 0; $i < $siblingn; $i += 1) {
                    $mb = $siblings[$i];

                    // found desired post, mark state
                    if ($mId == $mb->getId()) {
                        $hasFoundMB = true;
                    }
                    else if ($hasFoundMB) {
                        $mbPrevId = $mb->getId();
                        break;
                    }
                    else {
                        $mbNextId = $mb->getId();
                    }
                }
            }

            $message->setSearchable($S);
        }

        $name = $S->getName();

        $hd = $this->_getHeader($S->getName(), $request->getAttribute(c('MN_NAME_MESSAGE_BOARD')), $S->isAdmin() && $S->getId() === $aUser->getId());

        $request->setAttribute('o', $S);
        $request->setAttribute('mb', $message);
        $request->setAttribute('mbNextId', $mbNextId);
        $request->setAttribute('mbPrevId', $mbPrevId);
        $request->setAttribute('mbChildren', $mbChildren);
        $request->setAttribute('mbChildrenn', ref(sizeof($mbChildren)));
        $request->setAttribute('nameInTitle', $name);

        $this->updateHeadAttributes($request, $hd, array('group', 'wall'), array('messages', 'group', 'wall'));

        return ref('success');
	}

    /**
     * True, when searchable exists.
     * @method _hasRequired
     * @param  $aUser {Searchable} Required. The requester.
     * @param  $S {Searchable} Required. The requested context.
	 * @param  $request {Object} Required. The HTTP Servlet Request.
     * @return {Boolean} True, when requirements are met.
	 * @access Protected
	 * @since  Release 1.0
	 * @Override
     */
	protected function _hasRequired($aUser, $S, $request) {
	    $nameMember = $this->_getFeatureCustomName('member');
	    $nameMessageBoard = $this->_getFeatureCustomName('messageBoard');
		$aUserId = $aUser->getId();
	    
	    if ($S && $S->getId() && $S->hasMessageBoard() && ($S->isMember() || $S->isMessageBoardPublic())) {
	        return true;
        }
        else {
			$sId = $S->getId();
            $uError = '';
            $lError = '';

            if (! $S->hasMessageBoard()) {
                $uError = '{0} does not have a {1}.';
                $lError = $aUserId . " is attempting to access a Searchable ($sId) $nameMessageBoard that does not have one.";
            }
            else if (! $S->isMember()) {
                $uError = '{0} requires that you join before using their {1}.';
                $lError = $aUserId . " is attempting to access a private Searchable ($sId) $nameMessageBoard, but is not a $nameMember.";
            }

            if ($uError) {
				$this->_parseMessage($request, $uError, $S->getName(), $nameMessageBoard);
                $this->getLog()->warn($lError);
            }
            
            return false;
        }
	}
}

?>