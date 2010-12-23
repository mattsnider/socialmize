<?php
import('project.action.admin.ControllerAdmin');

/**
 * @package project.action.admin
 */
class ControllerNetworkView extends ControllerAdmin {

	/**
	 * @Override
	 */
	function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$l = $this->getLog();

		// fetch management objects
		list($servMember) = $this->_getServices($request, 'ServiceMember');

		$children = $servMember->readDescendents($S->getId());
		$parent = $servMember->readParent($S->getId());

		$request->setAttribute(c('MN_STYLES'), ref(array('admin')));
		$request->setAttribute('networks', $children);
		$request->setAttribute('parent', $parent);
		$request->setAttribute(c('MN_PAGENAME'), ref('admin'));
		return ref('success');
	}
}

?>
