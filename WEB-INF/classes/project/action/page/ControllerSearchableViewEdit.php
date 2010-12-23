<?php
import('project.action.page.ControllerPage');
import('project.model.ProfileWidget');
import('project.model.ProfileWidgetField');
import('project.util.CheckboxUtils');

/**
 * @package project.action.page
 */
class ControllerSearchableViewEdit extends ControllerPage {

	/**
	 * @Override
	 */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

		// Get parameters from the request
		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'), '', array('_'));
		$pagename = $this->getPagename($request);
		if ('account' == $pagename) {
			$task = 'manage';
		}

		$styles = array('profileEdit', 'widget/searchableListOfCheckboxes');

		// retrieve managers and create active user references
		list($man, $servMember) = $this->_getServices($request, 'BaseManager', 'ServiceMember');
		$aUserId = $aUser->getId();
		$sId = $S->getId();

		$aCheckedMap = array();
		$aDisabledMap = array();

		switch ($task) {
			case c('QUERY_KEY_ACCESS'):
				$name = 'Access';
				array_push($styles, 'privacy');
				$pagename = 'privacy';
				break;

			case 'member':
				$name = $this->_getFeatureCustomName('member', true, true);

				// fetch query parameter names
				$nameLimitParam = c('QUERY_KEY_LIMIT');
				$nameQueryParam = c('QUERY_KEY_QUERY');
				$nameOffsetParam = c('QUERY_KEY_OFFSET');

				// fetch parameters
				$offset = $this->_getParameterAsInteger($request, $nameOffsetParam);
				$searchCopy = $this->_getParameterAsString($request, $nameQueryParam, '', c('PARANOID_ALLOWED_AUTOCOMPLETE'));

				$useSearch = true;
				$listBoxId = 'memberList';

				$params = array();
/*
				$params = array(
					$nameOffsetParam => $offset,
					$nameLimitParam => -1,
					'nsId' => $sId,
					$nameQueryParam => $searchCopy
				);
*/
				if ($S->isNetwork()) {
					list($snetworks, $members, $submembers, $pnetworks) = $servMember->readNetworksAndMembers($sId);

					// create the member network map
					foreach ($members as $s) {
						$aCheckedMap[$s->getId()] = $s;
						if ($s->isSuperAdmin()) {
							$aDisabledMap[$s->getId()] = $s;
						}
					}
					// disable these subnetworks
					foreach ($submembers as $s) {
						$aCheckedMap[$s->getId()] = $s;
						$aDisabledMap[$s->getId()] = $s;
					}
					// disable these parent networks
					foreach ($pnetworks as $s) {
						$aDisabledMap[$s->getId()] = $s;
					}

					$request->setAttribute('snetworkn', sizeof($snetworks));
					$request->setAttribute('snetworks', $snetworks);
					$request->setAttribute('pnetworkn', sizeof($pnetworks));
					$request->setAttribute('pnetworks', $pnetworks);

					$typeOfSearch = 'networkCheckMembers';

					$request->setAttribute('listFilters', Searchable::getValidTypes());
				}
				else {
					$params[c('QK_TYPE')] = Searchable::$TYPE_USER;

					if ($S->isAdmin()) {
						$typeOfSearch = 'usersCheckMembers';
					}
						// when not-admin, you may only invite your friends
					else {
						$params['ownerId'] = $aUser->getId();
						$params['memberStatus'] = Searchable::$STATUS_ACTIVE;
						$typeOfSearch = 'friendsCheckMembers';
					}

					// find available users
					list($members) = $servMember->readMembers($S->getId());
					foreach ($members as $s) {
						$aCheckedMap[$s->getId()] = $s;

						// admins can not be removed as members, nor can non-admins remove members
						if ($s->isAdmin() || !$S->isAdmin()) {
							$aDisabledMap[$s->getId()] = $s;
						}
					}

					// find pending users
					list($members) = $servMember->readMembers($S->getId(), array('memberStatus' => Searchable::$STATUS_PENDING));
					foreach ($members as $s) {
						$aCheckedMap[$s->getId()] = $s;
						$aDisabledMap[$s->getId()] = $s;
					}
				}

				if (! $S->isUser() && $S->isClosed()) {
					list($pendingSearchables, $pendingSearchablen) = $servMember->readSearchables(array(
						'memberId' => $S->getId(),
						'memberStatus' => Searchable::$STATUS_PENDING
					));

					$request->setAttribute('pendingSearchables', $pendingSearchables);
					$request->setAttribute('pendingSearchablen', $pendingSearchablen);
				}

				list($searchables, $searchablen) = $man->readSearchables($params);
				list($checkboxes, $searchablenIds) = CheckboxUtils::_createCheckboxes($searchables, $aCheckedMap, $aDisabledMap);

				// create a parameter map for params unique to this checkbox list
				$aViewParams = array(
					c('QUERY_KEY_KEY') => $S->getKey(),
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
			break;

			case 'manage':
				if ($S->isUser()) {
					$name = 'Account';
					$pagename = 'account';
				}
				else {
					$name = 'Settings';

					// fetch query parameter names
					$nameQueryParam = c('QUERY_KEY_QUERY');
					$nameOffsetParam = c('QUERY_KEY_OFFSET');

					// fetch parameters
					$offset = $this->_getParameterAsInteger($request, $nameOffsetParam);
					$searchCopy = $this->_getParameterAsString($request, $nameQueryParam, '', c('PARANOID_ALLOWED_AUTOCOMPLETE'));

					$useSearch = true;
					$listBoxId = 'adminList';

					// fetch a list of all admins
					list($admins, $adminn) = $servMember->readMembers($S->getId(), array('admin' => 'true'));

					// create a map of admins
					foreach ($admins as $s) {
						$aCheckedMap[$s->getId()] = $s;
						if ($s->isSuperAdmin()) {
							$aDisabledMap[$s->getId()] = $s;
						}
					}

					$params = array(c('QK_TYPE') => Searchable::$TYPE_USER);

					// fetch a list of all members
					if ($S->isNetwork()) {
						list($aTypeMemberMap) = $servMember->readDescendents($S->getId());
						$members = $aTypeMemberMap[Searchable::$TYPE_USER];
						$membern = sizeof($members);
					}
					else {
						list($members, $membern) = $servMember->readMembers($S->getId(), $params);
					}

					$request->setAttribute('adminn', $adminn);
					$request->setAttribute('admins', $admins);
					$S->setMembers($members, $membern);

					// create checkboxes
					list($checkboxes, $searchablenIds) = CheckboxUtils::_createCheckboxes($members, $aCheckedMap, $aDisabledMap);

					// create a parameter map for params unique to this checkbox list
					$aViewParams = array(
						c('QUERY_KEY_KEY') => $S->getKey(),
						'typeOfSearch' => 'membersCheckAdmins',
						c('QUERY_KEY_TASK') => 'member'
					);

					$request->setAttribute($nameLimitParam, $membern);
					$request->setAttribute($nameQueryParam, $searchCopy);
					$request->setAttribute(c('QUERY_KEY_ID') . 's', implode(',', $searchablenIds));
					$request->setAttribute('listCheckboxes', $checkboxes);
					$request->setAttribute('listCheckboxSize', $membern);

					$request->setAttribute('listUseSearch', $useSearch);
					$request->setAttribute('listBoxId', $listBoxId);

					$request->setAttribute('params', $aViewParams);
				}
			break;

			default:
				def('ERROR', 'You are requesting a profile edit page that does not exists. We have redirected you to the permissions page.');
			// intentional
		}

		// Core page variables
		$request->setAttribute('task', $task);
		$request->setAttribute(c('MN_PAGENAME'), $pagename);
		$request->setAttribute(c('MN_PARAM_KEY'), ref(c('QUERY_KEY_KEY') . '=' . $S->getKey()));

		$title = ($aUserId === $sId ? 'Update Your ' . $name : 'Update ' . $name . ' For <q>' . $S->getName() . '</q>');
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
	protected function _isAuthorized(&$S, $request, $aUser) {
		if (!$S) {
			$S = $aUser;
		}
		return $S->isAdmin() || ('member' == $request->getParameter(c('QUERY_KEY_TASK')) && !$S->isPrivate());
	}
}

?>