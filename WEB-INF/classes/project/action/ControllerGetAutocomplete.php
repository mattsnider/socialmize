<?php

import('studs.action.Action');
import('include.Profanity');
import('project.service.BaseManager');

/**
 * @package project.action
 */
class ControllerGetAutocomplete extends Action {

function &execute(&$mapping, &$form, &$request, &$response) {
	$man = new BaseManager($this->getDataSource($request));
	$log = Logger::getLogger('project.action.' . get_class($this));

	$pAC = c('PARANOID_ALLOWED_AUTOCOMPLETE');
	$table = $this->_getParameterAsString($request, 'task', '', array('_'));
	$subtask = $this->_getParameterAsString($request, 'subtask', '', array('_'));
	$query = $this->_getParameterAsString($request, 'query', '', $pAC);
	$extraClauses = '';

	switch ($table) {
		case 'name':
			$table = 'searchable';
			$extraClauses = '`type`="' . Searchable::$TYPE_USER . '"';
			if ('all' !== $subtask) {$extraClauses .= ' AND `status`="' . Searchable::$STATUS_ACTIVE . '"';}
			break;

		default: $table = 'pwf_' . $table;
	}

	// test if the table exists
	// if yes return the results
	// if no, log an error

	if ($man->isValidAutocomplete($table)) {
		// do not add '`' to the names here or will break algorithm (08/06/07) -mes
		$results = $man->getAutocompleteByName($table, array('id', 'name'), $query, $extraClauses);
	}
	else {
		$log->error('Invalid Autocomplete Table: ' + $table);
		return $mapping->findForward(ref('failure'));
	}

	$request->setAttribute('results', $results);
	$request->setAttribute('count', count($results));
	$response->setContentType('text/json');

	$man->shutdown();
	return $mapping->findForward(ref('success'));
}


/**
 * Retrieve a string from the request object by its hash key
 *
 * @method _getParameterAsString
 * @param req {HttpServletRequest} Servlet HTTP request object
 * @param key {string} the parameter hash key
 * @param dfl {string} OPTIONAL: the default string value; default is empty String
 * @param arr {array} OPTIONAL: array of characters to allow; default is empty Array
 * @return {string} the parameter as a valid string
 * @access Protected
 * @since Release 1.0
 */
protected function _getParameterAsString($request, $key, $dfl='', $arr=array()) {
	return getDBSafeString(urldecode($request->getParameter($key)), $dfl, $arr);
}

}