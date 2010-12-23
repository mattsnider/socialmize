<?php
import('project.action.ControllerBase');

/**
 * @package project.action.page
 */
class ControllerModuleSubmitBase extends ControllerBase {

	function __construct() {
		$this->_requiresRegistration = false;
		$this->_requiredMethod = 'POST';
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
