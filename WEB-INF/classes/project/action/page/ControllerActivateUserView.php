<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerActivateUserView extends ControllerPage {

	function __construct() {
		$this->_requiresLogin = false;
	}

    /**
     * @Override
     */
	function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		// retrieve manager
		list($man) = $this->_getServices($request, 'BaseManager');
		$session = $request->getSession();

		$confirm = $session->getAttribute('confirm');
		$session->removeAttribute('confirm');

        $this->updateHeadAttributes($request, '', array('login'), array('login'));

        $key = $this->_getParameterAsString($request, c('QUERY_KEY_KEY'));
        $S = $man->getSearchableByKey($key);

        if ($S) {
        	$man->updatePendingStatus($S, Searchable::$PENDING_BITMASK_REGISTRATION);
        	$confirm = true;
        }

        $request->setAttribute('confirm', $confirm);
        
		return ref('activateUser');
	}
}
?>
