<?php
import('project.action.ControllerBase');

/**
 * @package project.action.page
 */
class ControllerSearchableRead extends ControllerBase {

	function __construct() {
		$this->_requiresRegistration = false;
		$this->_requiredMethod = 'GET';
	}

	/**
	 * @Override
	 */
	public function executeActually(&$form, &$request, &$response, $aUser, $S) {
		// retrieve managers and create active user references
		try {
			$sb = $S->toJson();
		}
		catch(Exception $e) {
			$sb = '{"error": "' . $e->getMessage() . '"}';
		}

		$sb = '{"results":[{' . $sb . '}]}';

		$response->setContentType('text/json; charset=\"UTF-8\"');
		$request->setAttribute('json', $sb);

		return ref('json');
	}
}

?>
