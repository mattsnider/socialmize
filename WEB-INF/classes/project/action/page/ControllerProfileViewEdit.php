<?php
import('project.action.page.ControllerPage');
import('project.model.ProfileWidget');
import('project.model.ProfileWidgetField');

/**
 * @package project.action.page
 */
class ControllerProfileViewEdit extends ControllerPage {

	/**
	 * @Override
	 */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

		// Get parameters from the request
		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'), '', array('_'));

		$styles = array('profileEdit');

		$pagename = $S->isUser() ? 'profile' : $S->getType() . 'Profile';

		// retrieve managers and create active user references
		list($man, $gm) = $this->_getServices($request, 'ServiceProfileWidget', 'GroupManager');
		$aUserId = $aUser->getId();
		$sId = $S->getId();

		$widgets = $man->getProfileWidgetsBySearchableType($S->getType());
		$w = $this->getTask($task, $widgets);

		if (!$w) {
			$w = $widgets[0];
		}

		// widget found, show appropriate tab
		if ($w) {
			$man->getProfileWidgetFieldValues($w, $sId, true);
			$task = $w->getTask();
			$name = $w->getName();
		}

		// Core page variables
		$request->setAttribute('task', $task);
		$request->setAttribute(c('MN_WIDGET'), $w);
		$request->setAttribute(c('MN_WIDGETS'), $widgets);
		$request->setAttribute(c('MN_PAGENAME'), $pagename);
		$request->setAttribute(c('MN_PARAM_KEY'), ref(c('QUERY_KEY_KEY') . '=' . $S->getKey()));

		$title = ($aUserId === $sId ? 'Edit Your Profile ' . $name : 'Edit ' . $name . ' For <q>' . $S->getName() . '</q>');

		$this->updateHeadAttributes($request, $title, array('profileEdit'), $styles);

		return ref('success');
	}

	/**
	 * Ensures that the task is valid, or returns a valid one.
	 * @method getTask
	 * @param s {String} Required. The task parameter.
	 * @param taskables {Array}  Required. A collection of taskable objects.
	 * @return {Taskable} The found taskable.
	 * @access Private
	 * @since Release 1.0
	 */
	private function getTask($s, $taskables) {
		// there are taskables
		if (sizeof($taskables)) {
			// iterate on the taskables
			foreach ($taskables as $taskable) {
				if ($s === $taskable->getTask()) {
					return $taskable;
				} // tasks match, return
			}

			return null;
		}

		return null;
	}

	/**
	 * @Override
	 */
	protected function _isAuthorized($S, $request) {
		return $S->isAdmin() || ('member' == $request->getParameter(c('QUERY_KEY_TASK')) && !$S->isPrivate());
	}
}

?>