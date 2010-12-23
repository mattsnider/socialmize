<?php
import('project.action.admin.ControllerAdmin');

/**
 * @package project.action.admin
 */
class ControllerProfileWidgetView extends ControllerAdmin {

    /**
     * @Override
     */
	function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$l = $this->getLog();

		// fetch params
		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'));
		$stask = $this->_getParameterAsString($request, c('QK_SUB_TASK'));
		$pwId = $this->_getParameterAsString($request, c('QK_PW_ID'));
		$showDetails = $this->_getParameterAsBoolean($request, c('QK_SHOW_DETAILS'));

		// fetch management objects
		list($servPW) = $this->_getServices($request, 'ServiceProfileWidget');

		$pw = $servPW->getProfileWidgetById($pwId, true, array(Searchable::$STATUS_ACTIVE, Searchable::$STATUS_INACTIVE));

        $query = array(c('QUERY_KEY_PAGE') . '=F');

//        $response->sendRedirect(ref('admin.action?' . implode('&', $query)));
        $request->setAttribute(c('MN_STYLES'), ref(array('admin')));
        $request->setAttribute('pw', $pw);
        $request->setAttribute(c('QK_PW_NAME'), ref($pw ? $pw->getName() : 'New Field'));
        $request->setAttribute(c('QK_SHOW_DETAILS'), $showDetails);
        $request->setAttribute(c('MN_PAGENAME'), ref('admin'));
        $request->setAttribute(c('QUERY_KEY_PAGE'), ref('content'));
		return ref('success');
	}
}
?>
