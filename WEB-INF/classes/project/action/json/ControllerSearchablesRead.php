<?php
import('project.action.ControllerBase');
import('project.util.SearchableCheckboxUtils');

/**
 * @package project.action.page
 */
class ControllerSearchablesRead extends ControllerBase {

	function __construct() {
		$this->_requiresRegistration = false;
		$this->_requiredMethod = 'GET';
	}

	function _addType($arr, $type) {
		if (! $arr) {
			$arr = array();
		}

		array_push($arr, $type);
		return $arr;
	}

	/**
	 * @Override
	 */
	public function executeActually(&$form, &$request, &$response, $aUser, $S) {
		// retrieve managers and create active user references
		try {
			list($searchables, $searchablen, $aCheckedMap, $aDisabledMap) = $this->getSearchables($request, $aUser, $S);
			$aBuffer = array();

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
		}
		catch(Exception $e) {
			$sb = '{"error": "' . $e->getMessage() . '"}';
		}

//		$response->setContentType('text/json; charset=\"UTF-8\"');
		$request->setAttribute('json', $sb);

		return ref('json');
	}

	function getSearchables($request, $aUser, $S) {
		list($man) = $this->_getServices($request, 'ServiceMember');
		$sId = $S->getId();

		$query = $this->_getParameterAsString($request, c('QUERY_KEY_QUERY'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE'));
		$offset = $this->_getParameterAsInteger($request, c('QUERY_KEY_OFFSET'));
		$limit = $this->_getParameterAsInteger($request, c('QUERY_KEY_LIMIT'));
		$filter = explode(',', $this->_getParameterAsString($request, 'types', '', array(',')));

		// fetch extra params for this search
		$typeToSearch = $this->_getParameterAsString($request, 'typeToSearch');
		$typeToCheck = $this->_getParameterAsString($request, 'typeToCheck');
		$typeToDisable = $this->_getParameterAsString($request, 'typeToDisable');

		if (! SearchableCheckboxUtils::areSearchTypesValid($typeToSearch)) {
			$error = 'invalid type to search';
		}

		if (! SearchableCheckboxUtils::areCheckedTypesValid($typeToCheck)) {
			$error = 'invalid type to check';
		}

		if ($error) {
			throw new Exception($error, 1001);
		}

		$aCheckedMap = array();
		$aDisabledMap = array();

		// fetch a list of all members
		$params = array(c('QK_TYPE') => sizeof($filter) ? $filter : Searchable::$TYPE_USER);

		if ($query) {
			$params[c('QUERY_KEY_QUERY')] = $query;
		}

		// find the searchables to show
		switch ($typeToSearch) {
			// nothing checked, all networks
			case 'member':
				// is this special network logic??
				$params['childrenOf'] = $sId;
				$params['memberStatus'] = Searchable::$STATUS_ACTIVE;
			break;
			default:
				// all case, do nothing
		}

//		dlog('params=' . var_export($params, true));
		if ($S && ! $S->isUser()) {
			$params['nsId'] = $S->getId();
		}

		list($searchables, $searchablen) = $man->readSearchables($params);
//		dlog('$typeToCheck=' . $typeToCheck);

		// find the searchables to check
		switch ($typeToCheck) {
			case 'all':
				foreach ($searchables as $s) {
					$aCheckedMap[$s->getId()] = $s;
				}
			break;

			case 'admin':
				// fetch a list of all admins
				list($admins) = $man->readMembers($sId, array('admin' => 'true'));
				$typeToDisable = 'sadmin';

				foreach ($admins as $s) {
					$aCheckedMap[$s->getId()] = $s;

					if ('sadmin' == $typeToDisable && $s->isSuperAdmin()) {
						$aDisabledMap[$s->getId()] = $s;
					}
				}
			break;

			// checked searchables are members of a network
			case 'member':
				$typeToDisable = 'admin';

				if (Searchable::$TYPE_NETWORK == $S->getType()) {
					list($snetworks, $members, $submembers, $pnetworks) = $man->readNetworksAndMembers($sId);

					// create the member network map
					foreach ($members as $s) {
						$aCheckedMap[$s->getId()] = $s;

						if (('admin' == $typeToDisable && $s->isAdmin()) || ('sadmin' == $typeToDisable && $s->isSuperAdmin())) {
							$aDisabledMap[$s->getId()] = $s;
						}
					}

					// disable these subnetworks
					foreach ($submembers as $s) {
						$aCheckedMap[$s->getId()] = $s;

//						if (Searchable::$TYPE_NETWORK == $s->getType()) {
//							$aDisabledMap[$s->getId()] = $s;
//						}
					}

					// disable these parent networks
					foreach ($pnetworks as $s) {
						$aDisabledMap[$s->getId()] = $s;
					}
				}
				else {
					list($members) = $man->readMembers($sId);

					foreach ($members as $s) {
						$aCheckedMap[$s->getId()] = $s;

						if ('admin' == $typeToDisable && $s->isAdmin()) {
							$aDisabledMap[$s->getId()] = $s;
						}
					}

					// find pending users
					list($members) = $man->readMembers($sId, array('memberStatus' => Searchable::$STATUS_PENDING));
					foreach ($members as $s) {
						$aCheckedMap[$s->getId()] = $s;
						$aDisabledMap[$s->getId()] = $s;
					}
				}
			break;

			case Searchable::$TYPE_GROUP:
			case Searchable::$TYPE_NETWORK:
			case Searchable::$TYPE_USER:
				foreach ($searchables as $s) {
					if ($typeToCheck == $s->getType()) {
						$aCheckedMap[$s->getId()] = $s;
					}
				}
			break;

			default:
				// none case, do nothing
		}

		return array($searchables, $searchablen, $aCheckedMap, $aDisabledMap);
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
