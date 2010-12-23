<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerSearchView extends ControllerPage {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

        $task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'));

		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'BaseManager');
		$aUserId = $aUser->getId();
		
        $header = 'Search';

        switch ($task) {
            case 'A':
            case 'B':
                // nothing for now
                break;

            default:
                $task = 'B';
                break;
        }

        $request->setAttribute('task', $task);

//        $this->updateHeadAttributes($request, ('B' === $task ? 'Basic' : 'Advanced') . ' Search', array('search'), array('account', 'search'));
        $this->updateHeadAttributes($request, 'Search', array('searchResult'), array('results'));

		return 'success';
	}
}

?>