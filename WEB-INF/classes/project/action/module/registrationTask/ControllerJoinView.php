<?php
import('project.action.module.ControllerModuleViewBase');
import('project.util.SearchableCheckboxUtils');
import('project.util.CheckboxUtils');

/**
 * @package project.action.page
 */
class ControllerJoinView extends ControllerModuleViewBase {

	/**
	 * @Override
	 */
	public function &executeActually(&$form, &$request, &$response, $aUser) {
		$isGroupAndUser = $request->getSession()->getAttribute('listIsGroupAndUser');

		// hack auth user's registration task temporarily
		if ($isGroupAndUser) {
			$oRegTask = $aUser->getRegistrationTask();
			$aUser->setRegistrationTask($isGroupAndUser);
		}

		$this->setupVariables($request, RegistrationTask::$TYPE_JOIN_NETWORK, array(), array());

		// restore auth user's registration task
		if ($isGroupAndUser) {
			$aUser->setRegistrationTask($oRegTask);
		}

		list($man) = $this->_getServices($request, 'BaseManager');

		// fetch query parameter names
		$nameLimitParam = c('QUERY_KEY_LIMIT');
		$nameQueryParam = c('QUERY_KEY_QUERY');
		$nameOffsetParam = c('QUERY_KEY_OFFSET');

		// fetch parameters
		$offset = $this->_getParameterAsInteger($request, $nameOffsetParam);
		$searchCopy = $this->_getParameterAsString($request, $nameQueryParam, '', c('PARANOID_ALLOWED_AUTOCOMPLETE'));

		$aCheckedMap = array();
		$aDisabledMap = array();

		$useSearch = true;
		$listBoxId = 'memberList';

		$params = array();

		if ($isGroupAndUser) {
			$typeOfSearch = 'allGroupsAndUsers';
			$types = array(Searchable::$TYPE_GROUP, Searchable::$TYPE_USER);
			$params['nsId'] = $aUser->getId();
		}
		else {
			$typeOfSearch = 'allNetworks';
			$types = Searchable::$TYPE_NETWORK;
		}

		$params[c('QK_TYPE')] = $types;
		list($searchables, $searchablen) = $man->readSearchables($params);
		list($checkboxes, $searchablenIds) = CheckboxUtils::_createCheckboxes($searchables, $aCheckedMap, $aDisabledMap);

		// create a parameter map for params unique to this checkbox list
		$aViewParams = array(
			c('QUERY_KEY_KEY') => $aUser->getKey(),
			'typeOfSearch' => $typeOfSearch,
			c('QUERY_KEY_TASK') => 'member'
		);

		$request->setAttribute($nameLimitParam, $searchablen);
		$request->setAttribute($nameQueryParam, $searchCopy);
		$request->setAttribute(c('QUERY_KEY_ID') . 's', implode(',', $searchablenIds));
		$request->setAttribute('listCheckboxes', $checkboxes);
		$request->setAttribute('listCheckboxSize', $searchablen);

		$request->setAttribute('listUseSearch', $useSearch);
		$request->setAttribute('listBoxId', $listBoxId);

		$request->setAttribute('params', $aViewParams);

		$request->setAttribute('formAction', ref('registration_update_join.action'));
		$request->setAttribute('task', ref('join'));
		$request->setAttribute('S', $aUser);

		$buttons = array();

		if ($isGroupAndUser) {
			$buttons[0] = array(
				'class' => 'btn action',
				'name' => 'skip',
				'type' => 'submit',
				'value' => 'SKIP'
			);
		}
		else {
			$nameFriends = strtoupper($request->getAttribute(c('MN_NAME_FRIEND') . 's'));
			$nameGroups = strtoupper($request->getAttribute('name' . ucfirst(Searchable::$TYPE_GROUP) . 's'));
			$buttons[0] = array(
				'class' => 'btn action',
				'name' => 'more',
				'type' => 'submit',
				'value' => 'ADD '.$nameFriends.' &amp; ' . $nameGroups
			);
		}

		$request->setAttribute('listSubmitCopy', ref('OR CONTINUE'));
		$request->setAttribute('listButtons', $buttons);
		$request->setAttribute('isNetwork', ref(! $isGroupAndUser));
		$page = 'success';

		return ref('success');
	}
}

?>
