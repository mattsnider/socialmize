<?php
/* $Id: Action.php 352 2006-05-15 04:27:35Z mojavelinux $
 *
 * Copyright 2003-2005 Dan Allen, Mojavelinux.com (dan.allen@mojavelinux.com)
 *
 * This project was originally created by Dan Allen, but you are permitted to
 * use it, modify it and/or contribute to it.  It has been largely inspired by
 * a handful of other open source projects and public specifications, most
 * notably Apache's Jakarta Project and Sun Microsystem's J2EE SDK.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import('studs.StudsConstants');
import('studs.util.ModuleUtils');
import('studs.action.ActionMessages');

/**
 * @package util
 * @author Matt Snider <mattesnider@gmail.com>
 * @access public
 */
class SearchableCheckboxUtils extends Object {

	public static function setupList($that, $request, $S, $aUser) {
		list($man) = $that->_getServices($request, 'ServiceMember');
		$sId = $S->getId();
		
		// fetch query parameter names
		$nameLimitParam = c('QUERY_KEY_LIMIT');
		$nameQueryParam = c('QUERY_KEY_QUERY');
		$nameOffsetParam = c('QUERY_KEY_OFFSET');

		// fetch parameters
		$offset = $that->_getParameterAsInteger($request, $nameOffsetParam);
		$searchCopy = $that->_getParameterAsString($request, $nameQueryParam, '', c('PARANOID_ALLOWED_AUTOCOMPLETE'));

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
			list($snetworks, $members, $submembers, $pnetworks) = $man->readNetworksAndMembers($sId);

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
			list($members) = $man->readMembers($S->getId());
			foreach ($members as $s) {
				$aCheckedMap[$s->getId()] = $s;

				// admins can not be removed as members, nor can non-admins remove members
				if ($s->isAdmin() || !$S->isAdmin()) {
					$aDisabledMap[$s->getId()] = $s;
				}
			}

			// find pending users
			list($members) = $man->readMembers($S->getId(), array('memberStatus' => Searchable::$STATUS_PENDING));
			foreach ($members as $s) {
				$aCheckedMap[$s->getId()] = $s;
				$aDisabledMap[$s->getId()] = $s;
			}
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
	}

	public static function areCheckedTypesValid($o) {
		$arr = explode(',', $o);

		foreach ($arr as $v) {
			if (FALSE === array_search($v, SearchableCheckboxUtils::$CHECKED_TYPES)) {
				return false;
			}
		}

		return true;
	}

	public static function areSearchTypesValid($o) {
		$arr = explode(',', $o);

		foreach ($arr as $v) {
			if (FALSE === array_search($v, SearchableCheckboxUtils::$SEARCH_TYPES)) {
				return false;
			}
		}

		return true;
	}

	public static function processSearchableCheckbox($request) {
		$aSearchables = explode(',', $request->getParameter(c('QUERY_KEY_ID') . 's'));
		$aCheckedSearchables = explode(',', $request->getParameter('checkboxes'));

		dlog('$aSearchables='.implode(',', $aSearchables));
		dlog('$aCheckedSearchables='.implode(',',$aCheckedSearchables));

		$aSearchablesToAdd = array();
		$aSearchablesToRemove = array();

		$oCheckedIds = array();

		/*
		if (!sizeof($aCheckedSearchables)) {
			return 'At least one member must remain the administrator of ' . $S->getType() . '.';
		}
		*/

		// find searchables that are checked
		foreach ($aCheckedSearchables as $id) {
			$oCheckedIds[$id] = true;
		}

//		dlog(implode(',', $aCheckedSearchables));

		// iterate on all shown searchables and create a list of searchables to and/remove as admin
		foreach ($aSearchables as $id) {
			if (array_key_exists($id, $oCheckedIds)) {
				array_push($aSearchablesToAdd, $id);
			}
			else {
				array_push($aSearchablesToRemove, $id);
			}
		}

		return array($aSearchablesToAdd, $aSearchablesToRemove);
	}

	public static $SEARCH_TYPES = array(
		'all', 'member'
	);

	public static $CHECKED_TYPES = array(
		'none', 'all', 'user', 'group', 'network', 'member', 'admin', 'sadmin'
	);
}

?>