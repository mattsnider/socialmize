<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerMessageBoardViewList extends ControllerPage {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

        // get variables from parameters
		$q = $this->_getParameterAsString($request, c('QUERY_KEY_QUERY'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE'));
		$filter = $this->_getParameterAsInteger($request, c('QUERY_KEY_FILTER'));
		$offset = $this->_getParameterAsInteger($request, c('QUERY_KEY_OFFSET'));
		$sort = $this->_getParameterAsString($request, c('QUERY_KEY_SORT'));

		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'BaseManager');
		$aUserId = $aUser->getId();
        $sId = $S->getId();
        $name = $S->getName();

        // validate filter value
		if (0 > $filter || 2 < $filter) {$filter = 0;}
		
        // fetch the message board posts
        list($posts, $postn) = $man->getMessageBoardsByParams(array('sId' => $S->getId(), 'S' => $S,
                                                                   c('QUERY_KEY_QUERY') => $q,
                                                                   c('QUERY_KEY_FILTER') => $filter,
                                                                   c('QUERY_KEY_LIMIT') => c('RESULTS_LIMIT'),
                                                                   c('QUERY_KEY_OFFSET') => $offset,
                                                                   c('QUERY_KEY_SORT') => $sort));

        // there are posts
        if ($postn) {
            $subheader = array('Displaying');

            if (c('RESULTS_LIMIT') < $postn) {
                array_push($subheader, $offset . '-' . ($offset + c('RESULTS_LIMIT') > $postn ? $postn : $offset + c('RESULTS_LIMIT')));
                array_push($subheader, 'of');
            }

            array_push($subheader, (1 < $postn ? $postn : 'the only'));
            array_push($subheader, pluralize('Message', $postn));
        }
        // no posts
        else {
            $subheader = array('No results.');
        }

        $hd = $this->_getHeader($S->getName(), $request->getAttribute(c('MN_NAME_MESSAGE_BOARD')), $S->isAdmin() && $S->getId() === $aUser->getId());

        $request->setAttribute('o', $S);
        $request->setAttribute('nameInTitle', $name);
        $request->setAttribute('subhd', ref(implode(' ', $subheader)));

        $request->setAttribute('resultn', $postn);
        $request->setAttribute('results', $posts);

        $request->setAttribute(c('QUERY_KEY_QUERY'), $q);
        $request->setAttribute(c('QUERY_KEY_FILTER'), $filter);
        $request->setAttribute(c('QUERY_KEY_OFFSET'), $offset);

        // pagination parameters
        $request->setAttribute('showRating', ref(false));

        $this->updateHeadAttributes($request, $hd, array('group', 'wall'), array('messages', 'group','wall'));

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
                $uError =  '{0} does not have a {1}.';
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