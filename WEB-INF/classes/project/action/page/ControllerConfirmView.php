<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerConfirmView extends ControllerPage {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

		// Retrieve values from request
		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'));

		$aUserId = $aUser->getId();

		$action = '';
		$confirmText = '';
		$confirmTitle = '';

		$pUrl = $S->getNameHTML();

        $nameMember = $request->getAttribute('lc_' . c('MN_NAME_MEMBER'));
		$nameMemberUC = ucfirst($nameMember);

		// validate the task
		switch ($task) {
		    case 'delete':
				$action = 'deleteSearchable';
				$confirmTitle = 'Delete ' . $S->getName() . '?';
				$confirmText = 'Are you sure you want to delete ' . $pUrl . '? This operation cannot be undone.';
				$task = 'delete';
		    break;

		    case 'join':
				$action = 'joinSearchable';
				$confirmTitle = 'Become ' . $nameMemberUC . '?';

				if ($S->isClosed()) {
					$confirmText = 'Are you sure you want to join ' . $pUrl . '? The administrators of ' . $nameMember . ' will need to approve your request.';
				}
				else {
					$confirmText = 'Are you sure you want to join ' . $pUrl . '? You will immediately be added as a ' . $nameMember . '.';
				}

				$task = 'join';
		    break;
		    
		    case 'leave':
				$action = 'leaveSearchable';
				$confirmTitle = 'Remove ' . $nameMemberUC . '?';
				$confirmText = 'Are you sure you want to leave ' . $pUrl . '? This cannot be undone and ' . $pUrl . ' will not be notified.';
				$task = 'delete';
		    break;

			case 'memberAdd':
			    $name = $this->_getFeatureCustomName($S->isUser() ? 'friend' : 'member', true);
				$action = 'createSearchableFriend';
				$confirmTitle = 'Add ' . $name . '?';
				$confirmText = 'Are you sure you want to add ' . $pUrl . ' as a ' . strtolower($name) . '? ' . $pUrl . ' will be notified to confirm this request.';
				$task = 'add';
			break;
				
			case 'memberDelete':
			    $name = $this->_getFeatureCustomName($S->isUser() ? 'friend' : 'member', true);
				$action = 'leaveSearchable';
				$confirmTitle = 'Remove ' . $name . '?';
				$confirmText = 'Are you sure you want to remove ' . $pUrl . ' as a ' . strtolower($name) . '? This cannot be undone and ' . $pUrl . ' will not be notified.';
				$task = 'delete';
			break;

			case 'messageBoardDelete':
				$mId = $this->_getParameterAsInteger($request, c('QUERY_KEY_MESSAGE_ID'));
				$action = 'submitMessageBoard';
				$url = '<a href="messageBoardView.action?' . c('QUERY_KEY_MESSAGE_ID') . '=' . $mId . '&' . c('QUERY_KEY_KEY') . '=' . $S->getKey() . '">message board post</a>';
				$confirmTitle = 'Delete Message Board Post?';
				$confirmText = 'Are you sure you want to delete that ' . $url . ' and all replies? This cannot be undone and ' . $pUrl . ' will not be notified.';
				$task = 'delete';
			break;

			case 'messageDelete':
				$mId = $this->_getParameterAsInteger($request, c('QUERY_KEY_MESSAGE_ID'));
				$action = 'deleteMessage';
				$url = '<a href="message.action?' . c('QUERY_KEY_MESSAGE_ID') . '=' . $mId . '">message</a>';
				$confirmTitle = 'Delete Message?';
				$confirmText = 'Are you sure you want to delete that ' . $url . '? This cannot be undone and ' . $pUrl . ' will not be notified.';
				$task = 'delete';
			break;

			case 'deleteNetwork':
				$key = $this->_getParameterAsString($request, c('QUERY_KEY_KEY'));
				$action = 'adminSubmit';
				$confirmTitle = 'Delete Network?';
				$confirmText = 'Are you sure you want to delete ' . $pUrl . '? This cannot be undone.';
				$task = 'network';
			break;

			default:
				$this->_parseMessage($request, 'Invalid task: "{0}"; Restoring you to your homepage.', $task);
			    return ref('error');
		}

		// create inputs from query params
		$npts = array();
		$params = explode('&', str_replace('?', '', $request->getQueryString()));
		$i = 0;

		foreach ($params as $o) {
			$a = explode('=', $o);
			$k = $a[0];
			$v = $a[1];

			if ($k !== 'task') {
				$npts[$i] = '<input name="' . $k . '" type="hidden" value="' . $v . '"/>';
			}

			$i += 1;
		}

		$request->setAttribute('action', $action);
		$request->setAttribute('confirmText', $confirmText);
		$request->setAttribute('confirmTitle', $confirmTitle);
		$request->setAttribute('inputs', ref(implode('', $npts)));
		$request->setAttribute('task', $task);
		$request->setAttribute('title', $confirmTitle);

        $this->updateHeadAttributes($request, '', array(), array('confirm'));
		
		return ref('success');
	}

    /**
     * True, when searchable exists.
     * @method _hasRequired
     * @param aUser {Searchable} Required. The requester.
     * @param S {Searchable} Required. The requested context.
     * @return {Boolean} True, when requirements are met.
	 * @access Protected
	 * @since Release 1.0
	 * @Override
     */
	protected function _hasRequired($aUser, $S) {
	    return $S && $S->getId();
	}
}
?>
