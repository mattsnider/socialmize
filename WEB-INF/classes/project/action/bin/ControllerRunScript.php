<?php
import('studs.action.Action');

import('project.service.ScriptManager');

/**
 * @package project.action.user
 */
class ControllerRunScript extends Action {
	function &execute(&$mapping, &$form, &$request, &$response) {
		$log = $this->getLog();
		
		$sm =& new ScriptManager($this->getDataSource($request));
		$action = $request->getParameter('action');
		
		switch ($action) {
			case 'createPHPContants':
				$country =& $sm->getCountryAsArray();
				$state =& $sm->getStateAsArray();
				$city =& $sm->getCityAsArray();
				$industry =& $sm->getIndustryAsArray();
				$request->setAttribute('country', $country);
				$request->setAttribute('state', $state);
				$request->setAttribute('city', $city);
				$request->setAttribute('industry', $industry);
				$sm->shutdown();
				return $mapping->findForward(ref('printPHPConstants'));
				break;
			default:
				break;
		}
		
		$sm->shutdown();
		return $mapping->findForward(ref('failure'));
	}


	/**
	 * 	Get the logger for this class.
	 * 	@access private
	 * 	@return Logger
	 */
	private function &getLog() {
		return Logger::getLogger('project.action.RunScriptAction');
	}
}
?>