<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerModuleViewBase extends ControllerPage {

	function __construct() {
		$this->_requiresRegistration = false;
		$this->_requiresLogin = true;
		$this->_requiredMethod = 'GET';
	}

	function setupVariables($request, $sType, $aScripts = array(), $aStyles = array()) {
		array_push($aStyles, 'module/regtask');
		array_push($aStyles, 'module/registrationTask_' . $sType);
		array_push($aScripts, 'module/registrationTask_' . $sType);

		$this->updateHeadAttributes($request, '', $aScripts, $aStyles);

		// find all the registration tasks
		$regMan = new ServiceRegistration($this->getDataSource($request));
		$regTasks = $regMan->readRegistrationTasks(array('status'=>Searchable::$STATUS_ACTIVE));
		$request->setAttribute('registrationTasks', $regTasks);

		// find the current index
		$nRegIndex = 0;
		$i = 0;
		$oUser = $request->getSession()->getAttribute('User');
		if ($oUser->getRegistrationTask()) {
			foreach ($regTasks as $regTask) {
				if ($regTask->getId() === $oUser->getRegistrationTask()->getId()) {
					$nRegIndex = $i;
					break;
				}

				$i += 1;
			}
		}
		$request->setAttribute('regIndex', $nRegIndex);
	}

	/**
	 * Updates the next registration task for a user. Call this in submission controller, after completing a registration task.
	 * @method _updateNextTask
	 * @param  HttpServletRequest $request Required. The http request object.
	 * @param  int $taskId Required. The task DB PK to dismiss.
	 * @return void
	 * @since  Version 1.0
	 * @access public
	 */
	function _updateNextTask($request, $taskId) {
		$session = $request->getSession();
		$oUser = $session->getAttribute('User');

		$regMan = new ServiceRegistration($this->getDataSource($request));
		$regMan->updateRegistrationTaskSearchble($taskId, $oUser->getId());
		$oNextUserRegTask = $regMan->readNextSearchableRegistrationTask($oUser->getId());
		$oUser->setRegistrationTask($oNextUserRegTask);

		$session->setAttribute('User', $oUser);
	}
}

?>
