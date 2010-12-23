<?php
import('project.action.admin.ControllerAdmin');
import('project.action.admin.ControllerProfileWidgetFieldView');

/**
 * @package project.action.admin
 */
class ControllerAdminAjaxView extends ControllerAdmin {

    /**
     * @Override
     */
	function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$l = $this->getLog();

		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'));

		$response->setContentType('text/xml; charset="UTF-8"');
		$url = '';

		switch ($task) {
			case 'renderPWF':
				$cTemp = new ControllerProfileWidgetFieldView();
				$cTemp->servlet = $this->servlet;
				$cTemp->setupModel($request, $this);
				$url = 'profileWidgetFieldAjax.jsp';
			break;

			case 'renderContent':
		    	$cm = $this->_getContentManager($request);
		    	$dir = $cm->getDir();
		    	$fileName = $this->_getParameterAsString($request, 'name');
		    	$file = $dir . $fileName . '.txt';
		    	$xml = '';

		    	if (is_file($file)) {
					$currentContent = file_get_contents($file);
					$xml = '<body>' . preg_replace("/\<.*?\>/", '', str_replace('<br />', "\n", $currentContent)) . '</body>';
				}
				
				$request->setAttribute('xml', $xml);
				return ref('xml');
			break;

			case 'renderEmail':
		    	$nm = $this->_getNotificationManager($request);
		    	$dir = $nm->getDir();
		    	$email = $this->_getParameterAsString($request, c('MN_EMAIL'));
		    	$file = $dir . $email . '.txt';
		    	$xml = '';

		    	if (is_file($file)) {
					$currentEmail = file_get_contents($file);
					$i = strpos($currentEmail, "\n");
					$xml .= '<subject>' . Sanitize::html(substr($currentEmail, 0, $i)) . '</subject>';
					$xml .= '<body>' . Sanitize::html(str_replace('<br />', "\n", substr($currentEmail, $i + 1))) . '</body>';
				}

				$request->setAttribute('xml', $xml);
				return ref('xml');
			break;

			default: // non-defined task
				return ref('error');
		}

		$request->setAttribute(c('MN_IMPORT_PAGE'), $url);
		return ref('success');
	}
}

def('MN_IMPORT_PAGE', 'importPage');
?>
