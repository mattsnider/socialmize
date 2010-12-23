<?php

import('project.action.ControllerBase');

/**
 * @package project.action.user
 */
class ControllerWallSubmit extends ControllerBase {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

		// Retrieve values from request
		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'));

		$text = $this->_getParameterAsHTMLFreeString($request, c('QUERY_KEY_BODY'));
		$wallId = $this->_getParameterAsInteger($request, c('QUERY_KEY_POST_ID'), 0);

		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'BaseManager');
		$aUserId = $aUser->getId();
		$sId = $S->getId();

        switch ($task) {
            case 'C': // handle wall create action
                // todo: is user authorized to write on this wall?
                // todo: validate values before committing to database


                if (0 < strlen($text)) {
                    $man->createWallPost($sId, $aUserId, $text);
                }
            break;

            case 'D': // handle wall delete action
                $man->deleteWallPost($wallId, $aUserId);
            break;

            default:
                // todo: write error
            break;
        }

        $response->sendRedirect('/wall.action?' . c('QUERY_KEY_KEY') . '=' . $S->getKey());
        return 'forward';
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
