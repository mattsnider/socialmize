<?php
import('project.action.ControllerBase');

/**
 * @package project.action.page
 */
class ControllerSearchablesRead extends ControllerBase {

	function __construct() {
		$this->_requiresRegistration = false;
		$this->_requiredMethod = 'GET';
	}

	/**
	 * @Override
	 */
	public function executeActually(&$form, &$request, &$response, $aUser, $S) {
		// retrieve managers and create active user references
		list($man, $servMember) = $this->_getServices($request, 'BaseManager', 'ServiceMember');
		$sId = $S->getId();

		$query = $this->_getParameterAsString($request, c('QUERY_KEY_QUERY'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE'));
		$offset = $this->_getParameterAsInteger($request, c('QUERY_KEY_OFFSET'));
		$limit = $this->_getParameterAsInteger($request, c('QUERY_KEY_LIMIT'));
		$filter = $request->getParameterValues(c('QUERY_KEY_FILTER'));

		// fetch extra params for this search
		$typeOfSearch = $this->_getParameterAsString($request, 'typeOfSearch');

		$aBuffer = array();
		$aCheckedMap = array();
		$aDisabledMap = array();

		// fetch a list of all members
		$params = array(c('QK_TYPE') => sizeof($filter) ? $filter : Searchable::$TYPE_USER);

		switch ($typeOfSearch) {
			// nothing checked, all networks
			case 'allNetworks':
				$params[c('QK_TYPE')] = Searchable::$TYPE_NETWORK;
				break;

			// nothing checked, all networks
			case 'allGroupsAndUsers':
				$params[c('QK_TYPE')] = array(Searchable::$TYPE_GROUP, Searchable::$TYPE_USER);
				$params['nsId'] = $aUser->getId();
				break;

			// checked searchables are admins
			case 'membersCheckAdmins':
				// fetch a list of all admins
				list($admins) = $servMember->readMembers($sId, array('admin' => 'true'));
				$params['childrenOf'] = $sId;

				// create a map of admins
				foreach ($admins as $s) {
					$aCheckedMap[$s->getId()] = $s;

					if ($s->isSuperAdmin()) {
						$aDisabledMap[$s->getId()] = $s;
					}
				}
				break;

			// checked searchables are members
			case 'networkCheckMembers':
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
				break;

			// checked searchables are members
			case 'friendsCheckMembers':
				// augment the searchable fetching params
				$params['ownerId'] = $aUser->getId();
				$params['memberStatus'] = Searchable::$STATUS_ACTIVE;

			// intentional pass-through, to be DRY

			// checked searchables are members
			case 'usersCheckMembers':
				// fetch a list of all members
				list($members) = $servMember->readMembers($sId);

				// create a map of members
				foreach ($members as $s) {
					$aCheckedMap[$s->getId()] = $s;
					if ($s->isAdmin()) {
						$aDisabledMap[$s->getId()] = $s;
					}
				}

				// find pending users
				list($members) = $servMember->readMembers($sId, array('memberStatus' => Searchable::$STATUS_PENDING));
				foreach ($members as $s) {
					$aCheckedMap[$s->getId()] = $s;
					$aDisabledMap[$s->getId()] = $s;
				}
				break;

			default:
				$this->getLog()->error('Invalid $typeOfSearch=' . $typeOfSearch);
		}

		if ($query) {
			$params[c('QUERY_KEY_QUERY')] = $query;
		}
		list($searchables, $searchablen) = $man->readSearchables($params);

		// create a map of admins
		foreach ($searchables as $s) {
			$isChecked = array_key_exists($s->getId(), $aCheckedMap);
			$isDisabled = array_key_exists($s->getId(), $aDisabledMap);
			array_push($aBuffer, $this->_createJson($s, $isChecked, $isDisabled));
		}

		$sb = '{"resultn":';
		$sb .= $searchablen;
		$sb .= ',"results":[';
		$sb .= implode(',', $aBuffer);
		$sb .= ']}';

		$response->setContentType('text/json; charset=\"UTF-8\"');
		$request->setAttribute('json', $sb);

		return ref('json');
	}

	private function _createJson($s, $isChecked, $isDisabled) {
		$id = $s->getId();
		$aBuffer = array();
		array_push($aBuffer, '"id":"searchable-' . $id . '"');
		array_push($aBuffer, '"label":"' . $s->getName() . '"');
		array_push($aBuffer, '"value":' . $id);
		array_push($aBuffer, '"isChecked":' . ($isChecked ? 'true' : 'false'));
		array_push($aBuffer, '"isDisabled":' . ($isDisabled ? 'true' : 'false'));
		return '{' . implode(',', $aBuffer) . '}';
	}
}

?>
