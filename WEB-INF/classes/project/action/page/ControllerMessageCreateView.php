<?php
import('project.action.page.ControllerPage');
import('project.util.CheckboxUtils');

/**
 * @package project.action.page
 */
class ControllerMessageCreateView extends ControllerPage {

    /**
     * @Override
     */
	public function executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

		// retrieve managers and create active user references
		list($man, $servMember) = $this->_getServices($request, 'UserManager', 'ServiceMember');
		
		$recipientKey = $this->_getParameterAsString($request, c('QUERY_KEY_KEY') . 'to');
		$recipient = $man->getSearchableByKey($recipientKey);

		$subject = $this->_getParameterAsString($request, c('QUERY_KEY_SUBJECT'), '', c('PARANOID_ALLOWED_URI_PLUS'));
		$body = $this->_getParameterAsHTMLFreeString($request, c('QUERY_KEY_BODY'));

		$sSubject = $this->readSessionValue($request, c('QUERY_KEY_SUBJECT'));
		$sBody = $this->readSessionValue($request, c('QUERY_KEY_BODY'));

		if ($sSubject) {$subject = $sSubject;}
		if ($sBody) {$body = $sBody;}

        $nameMessage = $request->getAttribute(c('MN_NAME_MESSAGE'));

		if (! $S->isUser()) {
			$request->setAttribute(c('MN_PAGENAME'), ref($S->getType() . 'WriteMessage'));
		}

		$request->setAttribute('body', $body);
		$request->setAttribute('isRead', ref(false));
		$request->setAttribute(c('QUERY_KEY_KEY').'By', $S->getKey());
		$request->setAttribute(c('QUERY_KEY_PAGE'), ref('mailbox'));
		$request->setAttribute('sendTo', $recipient);
		$request->setAttribute('subject', $subject);
		$request->setAttribute(c('QK_TYPE'), $S->getType());
		$request->setAttribute('title', ref('New ' . $nameMessage));

		$searchCopy = $this->_getParameterAsString($request, c('QUERY_KEY_QUERY'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE'));
		$type = $this->_getParameterAsString($request, c('QK_TYPE'), '', Searchable::$TYPE_USER);
		$aDisabledMap = array();

		if ('network' == $type) {
			$typeOfSearch = 'friendsCheckNone';
			list($snetworks, $members, $submembers, $pnetworks) = $servMember->readNetworksAndMembers($S->getId());
			$membern = sizeof($members);
		}
		else {
			$params['ownerId'] = $aUser->getId();
			$params['memberStatus'] = Searchable::$STATUS_ACTIVE;
			$typeOfSearch = Searchable::$TYPE_USER == $type ? 'friendsCheckNone' : 'membersCheckNone';

			// find pending users
			list($members) = $servMember->readMembers($S->getId(), array('memberStatus' => Searchable::$STATUS_PENDING));
			foreach ($members as $s) {
				$aDisabledMap[$s->getId()] = $s;
			}

			// find available users
			list($members, $membern) = $servMember->readMembers($S->getId());
		}

		list($checkboxes, $searchablenIds) = CheckboxUtils::_createCheckboxes($members, array(), $aDisabledMap);

		// create a parameter map for params unique to this checkbox list
		$aViewParams = array(
			c('QUERY_KEY_KEY') => $S->getKey(),
			'typeOfSearch' => $typeOfSearch,
			c('QUERY_KEY_TASK') => 'member'
		);

		$request->setAttribute(c('QUERY_KEY_LIMIT'), $membern);
		$request->setAttribute(c('QUERY_KEY_QUERY'), $searchCopy);
		$request->setAttribute(c('QUERY_KEY_ID') . 's', implode(',', $searchablenIds));
		$request->setAttribute('listCheckboxes', $checkboxes);
		$request->setAttribute('listCheckboxSize', $membern);

		$request->setAttribute('listUseSearch', ref(true));
		$request->setAttribute('listBoxId', ref('memberList'));

		$request->setAttribute('params', $aViewParams);

        $this->updateHeadAttributes($request, 'Compose a New ' . $nameMessage, array('message'), array('message'));

		return ref('success');
	}

    /**
     * @Override
     */
	protected function _isAuthorized($S) {
	    return $S && $S->isAdmin();
	}
}
?>