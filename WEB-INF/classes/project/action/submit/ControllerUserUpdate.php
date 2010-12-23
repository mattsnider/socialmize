<?php

import('project.action.ControllerBase');

/**
 * @package project.action.user
 */
class ControllerUserUpdate extends ControllerBase {

    /**
     * @Override
     */
	public function executeActually(&$form, &$request, &$response, $aUser, $S) {
		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'BaseManager');

		$pageName = $this->getPagename($request);
		$this->getLog()->debug("Dispatching pagename: $pageName");

		switch ($pageName) {

			case 'updateUserPassword':
				$message = $this->_handleUpdateSearchablePassword($request, $man, $S, $aUser);
				break;

			default:
				// todo: this should be a generic message with a CTA to contact support
				$message = 'Invalid URL requested. Try your last operation again, or notify an administrator.';
				break;
		}

		$this->_parseMessage($request, $message);
		$response->sendRedirect($this->getHistory($request, 0));
		return 'redirect';
	}

	/**
	 * Dispatch function to handle the updating of a Searchable name.
	 * @method _handleUpdateSearchablePassword
	 * @param  $request {HttpServletRequest} Required. The request object.
	 * @param  $man {BaseManager} Required. The DB communication object.
	 * @param  $S {Searchable} Required. The Searchable to update.
	 * @param  $aUser {Searchable} Required. The active user.
 	 * @return {String} The error or message.
	 * @access private
	 * @since  Release 1.0
	 */
	private function _handleUpdateSearchablePassword($request, $man, $S, $aUser) {
		$opassword = $this->_getParameterAsString($request, 'o' . c('QUERY_KEY_PASSWORD'));
		$cpassword = $this->_getParameterAsString($request, 'c' . c('QUERY_KEY_PASSWORD'));
		$npassword = $this->_getParameterAsString($request, 'n' . c('QUERY_KEY_PASSWORD'));
		$user = $man->getUserByNameAndPassword($aUser->getName(), $opassword);

		if ($user && $aUser->getId() === $S->getId()) {
			if (! $npassword || $npassword !== $request->getParameter('n' . c('QUERY_KEY_PASSWORD'))) {
				return 'Invalid New Password; only alpha-numeric characters allowed';
			}
			else if (4 > strlen($npassword) || 16 < strlen($npassword)) {
				return 'Invalid New Password; must be between 4 & 16 alpha-numeric characters long';
			}
			else if ($cpassword !== $npassword) {
				return 'Invalid Password Confirmation; New Password and Confirm Password do not match';
			}
		}
		else {
			return 'Invalid Current Password; did you use the right password?';
		}

		$pass = md5($npassword);
		$aUser->setPassword($pass);
		$man->updateUserField($aUser->getId(), c('QUERY_KEY_PASSWORD'), $pass);
		$this->_parseMessage($request, 'M:Password Change Successful.');

		$user = $man->getUserByNameAndPassword($aUser->getName(), $opassword);
		return 'M:Your password was successfully changed.';
	}

	/**
	 * @Override
	 */
	protected function _isAuthorized($S) {
	    return $S->isAdmin();
	}
}
?>
