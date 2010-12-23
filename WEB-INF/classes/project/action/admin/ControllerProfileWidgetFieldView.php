<?php
import('project.action.admin.ControllerAdmin');

/**
 * @package project.action.admin
 */
class ControllerProfileWidgetFieldView extends ControllerAdmin {

	public function setupModel(&$request, &$that) {
		// fetch params
		$task = $that->_getParameterAsString($request, c('QUERY_KEY_TASK'));
		$stask = $that->_getParameterAsString($request, c('QK_SUB_TASK'));
		$pwfId = $that->_getParameterAsString($request, c('QK_PWF_ID'));
		$pwId = $that->_getParameterAsString($request, c('QK_PW_ID'));

		// fetch management objects
		list($man) = $this->_getServices($request, 'ServiceProfileWidget');

		$field = $man->getProfileWidgetFieldById($pwfId);

		if ($field) {
		    $pwId = $field->getProfileWidgetId();
		}

		$pw = $man->getProfileWidgetById($pwId, false);

		if (! $pw) {return ref('error');}

//        $query = array(c('QUERY_KEY_PAGE') . '=content&task=field');

//        $response->sendRedirect(ref('admin.action?' . implode('&', $query)));
        $request->setAttribute(c('MN_STYLES'), ref(array('admin')));
        $request->setAttribute('pw', $pw);
        $request->setAttribute('pwf', $field);
        $request->setAttribute('name', ref($field ? $field->getLabel() : 'New'));
        $request->setAttribute(c('MN_PAGENAME'), ref('admin'));
	}

    /**
     * @Override
     */
	function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$l = $this->getLog();

		$this->setupModel($request, $this);

		return ref('success');
	}
}
?>
