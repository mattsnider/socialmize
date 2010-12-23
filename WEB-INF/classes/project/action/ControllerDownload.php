<?php

import('project.action.ControllerBase');

/**
 * @package project.action
 */
class ControllerDownload extends ControllerBase {

    /**
     * Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$l = $this->getLog();

		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'));

		if ($aUser->isAdmin()) {
		    switch($task) {
		        case 'custom':
		            $content = file_get_contents('assets/css/custom/custom.css');
		        break;

		        default:
		            $content = 'No content available for specified resource: ' . $task;
		        break;
		    }
		}
		else {
		    $content = 'You are not authorized. Only administrators can access this information.';
		}

		$request->setAttribute('content', $content);

		$response->setHeader('Content-Type', 'text/plain');
		$response->setHeader('Content-Disposition', 'attachment; filename=custom.css');

		return 'success';
	}

}