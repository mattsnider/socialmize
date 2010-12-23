<?php

import('project.action.ControllerBase');

function __delete_notification($man, $notificationId, $aUserId) {
	$notification = $man->getNotificationById($notificationId);

	if ($notification && $aUserId === $notification->getSearchableToId()) {
		$man->deleteNotification($notificationId, $aUserId);

		if (c('NotificationTypeMember') == $notification->getType()) {
			$url = '/leaveSearchable.action?' . c('QUERY_KEY_KEY') . '=' . $notification->getSearchableBy()->getKey();
		}
	}
}

/**
 * @package project.action.submit
 */
class ControllerNotificationUpdate extends ControllerBase {

    /**
     * @Override
     */
	public function executeActually(&$form, &$request, &$response, $aUser, $S) {
		$l = $this->getLog();

		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'BaseManager');

		$pageName = $this->getPagename($request);

		$url = $this->getHistory($request, 0);

		switch ($pageName) {

			case 'deleteNotification':
					$notificationId = $this->_getParameterAsInteger($request, c('QUERY_KEY_ID'));
					__delete_notification($man, $notificationId, $aUser->getId());
				break;

			default:
				// todo: this should be a generic message with a CTA to contact support
				$message = 'Invalid URL requested. Try your last operation again, or notify an administrator.';
		}

		if ($this->_getParameterAsBoolean($request, c('QK_IS_AJAX'))) {
			return 'xml';
		}

		$this->_parseMessage($request, $message);
		$response->sendRedirect($url);
		return 'redirect';
	}
}
?>
