<?php

import('project.service.BaseManager');
import('project.model.Member');

/**
 * Created by IDEA.
 * User: mattsniderppl
 * Date: Oct 2, 2010
 * Time: 7:45:56 PM
 * This service provides member logic for linking users.
 */

class ServiceMember extends BaseManager {

	/**
	 * Updates the member status for queries.
	 * @method _setupMemberStatus
	 * @param  array $wheres Required. An array of where statements.
	 * @param  array $values Required. An array of value statements.
	 * @param  string|array $status Required. A member status or an array of them.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	private function _setupMemberStatus(&$wheres, &$values, $status) {
		// empty strings, indicate that the default value should be used
		if ('' === $status) {
			$status = Searchable::$STATUS_ACTIVE;
		}

		// if status is null, then we don't check it
		if ($status) {
			if (is_array($status)) {
				array_push($wheres, str_replace('= ?', 'IN ("' . implode('","' . $status) . '")', Member::$SQL_WHERE_STATUS));
			}
			else {
				array_push($wheres, Member::$SQL_WHERE_STATUS);
				array_push($values, $status);
			}
		}
	}

	/**
	 * Fetches the number of members a given Searchable has.
	 * @method countMembers
	 * @param  int $sId Required. The Seachable DB PK.
	 * @param  string|array $type Optional. A searchable type or an array of them.
	 * @param  string|array $status Optional. A member status or an array of them.
	 * @return int The number of occurrances in DB.
	 * @since  version 1.0
	 * @access public
	 */
	public function countMembers($sId, $type = '', $status = '') {
		$tables = array(Searchable::$SQL_TABLE, Member::$SQL_LEFT_JOIN_FOR_OWNERS);
		$wheres = array(Member::$SQL_WHERE_A);
		$values = array($sId);
		$this->_setupMemberStatus($wheres, $values, $status);
		$this->_setupSearchableType($wheres, $values, $type);
		$this->_setupSearchableStatus($wheres, $values, '');
		return $this->_getCount($tables, $values, $wheres);
	}

	/**
	 * Save a Member DBO to the database; doesn't yet handle updates, only inserts.
	 * @method createMember
	 * @param  Member $oMember Required. A Member DBO.
	 * @param  boolean $isDelete Optional. Deletes any previous membership before creating a new one.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	public function createMember($oMember, $isDelete=true) {
		if ($isDelete) {
			$this->deleteMember($oMember->getSearchableA()->getId(), $oMember->getSearchableB()->getId());
		}

		call_user_func_array(array($this, '_insert'), Member::generateCreateSQL($oMember));

		if (Searchable::$STATUS_ACTIVE == $oMember->getStatus() && $oMember->getSearchableA()->isUser() && $oMember->getSearchableB()->isUser()) {
			$oMember2 = new Member();
			$oMember2->setStatus(Searchable::$STATUS_ACTIVE);
			$oMember2->setSearchableA($oMember->getSearchableB());
			$oMember2->setSearchableB($oMember->getSearchableA());
			call_user_func_array(array($this, '_insert'), Member::generateCreateSQL($oMember2));
		}
	}

	/**
	 * Creates a database entry represented by the Network DBO.
	 * @method createNetwork
	 * @param  o {User} Required. A Network DBO.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	public function createNetwork(&$o) {
		$this->createSearchable($o);
		call_user_func_array(array($this, '_insert'), Network::generateCreateSQL($o));

		if ($o->getParentId()) {
			$this->createMember(Member::createSimple($o->getParentId(), $o));
		}
	}

	/**
	 * Deletes the database rows facilitating the connection between to usera and userb.
	 * @method deleteMember
	 * @param  int|array $iIdA Required. The DB PK of Searchable A.
	 * @param  int|array $iIdB Required. The DB PK of Searchable B.
	 * @since  version 1.0
	 * @access public
	 */
	public function deleteMember($iIdA, $iIdB) {
		// make all arguments arrays
		if (!is_array($iIdA)) {
			$iIdA = array($iIdA);
			$iIdB = array($iIdB);
		}

		$values = array();
		$wheres = array();

		$where = '(' . Member::$SQL_WHERE_A . ' AND ' . Member::$SQL_WHERE_B . ') OR (' . Member::$SQL_WHERE_B . ' AND ' . Member::$SQL_WHERE_A . ')';

		for ($i = sizeof($iIdA) - 1; 0 <= $i; $i -= 1) {
			array_push($values, $iIdA[$i], $iIdB[$i], $iIdA[$i], $iIdB[$i]);
			array_push($wheres, $where);
		}

		$this->_delete(array(Member::$SQL_TABLE), $values, array(implode(' OR ', $wheres)));
	}

	/**
	 * Computes the connection status between two users.
	 * @method getMemberStatusCode
	 * @param  int sIdA Required. The DB PK of user A.
	 * @param  int sIdB Required. The DB PK of user B.
	 * @return int The status of connection: 0 = non contacts, 1 = are contacts, 2 = a requests b, 3 = b requests a.
	 * @since  version 1.0
	 * @access public
	 */
	public function getMemberStatusCode($sIdA, $sIdB) {
		$wheres = array(Member::$SQL_WHERE_A, Member::$SQL_WHERE_B);
		$doesLinkAtoBExist = $this->_getCount(array(Member::$SQL_TABLE), array($sIdA, $sIdB), $wheres);
		$doesLinkBtoAExist = $this->_getCount(array(Member::$SQL_TABLE), array($sIdB, $sIdA), $wheres);

		switch (strval($doesLinkAtoBExist) . strval($doesLinkBtoAExist)) {
			case '11':
				return Member::$STATUS_CONNECTED;
			case '10':
				return Member::$STATUS_CONNECTION_REQUESTED_AB;
			case '01':
				return Member::$STATUS_CONNECTION_REQUESTED_BA;
			default:
				return Member::$STATUS_NOT_CONNECTED;
		}
	}

	/**
	 * Determines whether the user A is a member of user B.
	 * @method isMember
	 * @param  int $userIdA Required. The owning searchable DB PK.
	 * @param  int $userIdB Required. The comparing searchable DB PK.
	 * @param  $status {Enum} Optional. The status of the member connection; default is active.
	 * @return array (A is a member of B, A is an admin of B, A is the super admin of B).
	 * @since  version 1.0
	 * @access public
	 */
	public function isMember($userIdA, $userIdB, $status = '') {
		$wheres = array(Member::$SQL_WHERE_A, Member::$SQL_WHERE_B);
		$values = array($userIdA, $userIdB);
		$this->_setupMemberStatus($wheres, $values, $status);

		$rs = $this->_select(Member::$SQL_TABLE, array('admin', 'sadmin'), $values, $wheres);

		$isMember = false;
		$isAdmin = false;
		$isSuperAdmin = false;

		if ($rs->next()) {
			$isMember = true;
			$isAdmin = $rs->getBoolean('admin');
			$isSuperAdmin = $rs->getBoolean('sadmin');
		}

		return array($isMember, $isAdmin, $isSuperAdmin);
	}

	/**
	 * Fetches the member count for the provided searchable.
	 * @method populateMemberCounts
	 * @param  array $searchables Required. A collection of searchables.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	public function populateMemberCounts(&$searchables) {
		foreach ($searchables as &$s) {
			$n = $this->countMembers($s->getId());
			$s->setMembers(array(), $n);
		}
	}

	/**
	 * Fills the member status for the searchable.
	 * @method populateMembers
	 * @param  array $searchables Required. A collection of searchables.
	 * @param  array $memberAdminState Required. The map of admin states.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	public function populateMembers(&$searchables, $memberAdminState) {
		foreach ($searchables as &$s) {
			$id = $s->getId();

			if (array_key_exists($id, $memberAdminState)) {
				$aMemberState = $memberAdminState[$id];
			}
			else {
				$aMemberState = array(true, false, false);
			}

			$s->setIsMember($aMemberState);
		}
	}

	/**
	 * Retrieve the members of a network.
	 * @method readNetworksAndMembers
	 * @param  int $sId Required. The DB PK of Network or array thereof.
	 * @return array A collection of Network and Searchable DBOs.
	 * @since  version 1.0
	 * @access public
	 */
	public function readNetworksAndMembers($sId) {
		list($oTypeMap, $oIdMap) = $this->readDescendents($sId);
		$ancestorNetworks = $this->readAncestors($sId, true);

		$networkMembers = array();
		$networkSubmembers = array();

		foreach ($oIdMap as $s) {
			if ($s->getParentId() == $sId) {
				array_push($networkMembers, $s);
			}
			else {
				array_push($networkSubmembers, $s);
			}
		}

		$networks = $oTypeMap[Searchable::$TYPE_NETWORK];

		return array($networks, $networkMembers, $networkSubmembers, $ancestorNetworks);
	}

	/**
	 * Retrieve the ancestor networks of a network.
	 * @method readAncestors
	 * @param  int|array $sId Required. The DB PK of Network or array thereof.
	 * @param  boolean $isFullTree ptional. Find the full parent tree.
	 * @return array A collection of Network DBOs.
	 * @since  version 1.0
	 * @access public
	 */
	public function readAncestors($sId, $isFullTree = false) {
		// todo: NEW INFRASTRUCTURE BREAKS PARENT LOGIC
		$wheres = array();
		$values = array();
		$tables = array_merge($this->_DB_TABLES_SEARCHABLE, array(Member::$SQL_LEFT_JOIN_FOR_MEMBERS));

		$this->_setupMemberStatus($wheres, $values, '');
		$this->_setupSearchableStatus($wheres, $values, '');
		$this->_setupSearchableType($wheres, $values, Searchable::$TYPE_NETWORK);

		if (is_array($sId)) {
			array_push($wheres, '`searchable_searchable`.`searchableB_id` IN (' . implode(',', $sId) . ')');
			//			$isArray = true;
		}
		else {
			array_push($wheres, '`searchable_searchable`.`searchableB_id`=?');
			array_push($values, $sId);
		}


		$rs = $this->_select($tables, $this->_DB_SELECT_SEARCHABLES, $values, $wheres);
		$networks = array();
		$networkIds = array();

		while ($rs->next()) {
			$o = new Network();
			$o->readResultSet($rs);
			array_push($networks, $o);
		}

		if ($isFullTree && sizeof($networkIds)) {
			$networks = array_merge($networks, $this->readAncestors($networkIds, $isFullTree));
		}

		return $networks;
	}

	/**
	 * Fetches the descedents from the parameters and appends them to the type map and all searchable map.
	 * @method _readDescendents
	 * @param  array $params Required. Query parameters.
	 * @param  array $oIdMap Required. A collection of found searchables.
	 * @param  array $oTypeMap Required. A collection of found searcahbles by type.
	 * @return void
	 * @since  version 1.0
	 * @access private
	 */
	private function _readDescendents($params, &$oIdMap, &$oTypeMap) {
		list($searchables, $searchablen, $memberAdminState) = $this->readSearchables($params, true);
		$ownerId = $params['ownerId'];
		$ownerIds = array();

		foreach ($searchables as $s) {
			$sId = $s->getId();
			$type = $s->getType();

			// todo: check to see if admin on each level
			// todo: automatically check all users from sublevels
			if (!array_key_exists($sId, $oIdMap)) {
				array_push($oTypeMap[$type], $s);
				$oIdMap[$sId] = $s;
				$s->setParentId($ownerId);

				if (!$s->isUser()) {
					array_push($ownerIds, $s->getId());
				}

//				dlog($s->getId() . ' - ' . implode(',', $memberAdminState[$s->getId()]));
				$s->setIsMember($memberAdminState[$s->getId()]);
			}
		}

		if (sizeof($ownerIds)) {
			$params['ownerId'] = $ownerIds;
			$this->_readDescendents($params, $oIdMap, $oTypeMap);
		}
	}

	/**
	 * Fetches the descedents of the provided searchable; by default all user types and only active members.
	 * @method readDescendents
	 * @param  int $sId Required. The Seachable DB PK.
	 * @param  array $params Required. Additional query parameters (careful, this is applied to all subqueries).
	 * @return array The descendent map and all descendent array.
	 * @since  version 1.0
	 * @access public
	 */
	public function readDescendents($sId, $params=array()) {
		$params['ownerId'] = $sId;

		$oIdMap = array();
		$oTypeMap = array(
			Searchable::$TYPE_GROUP => array(),
			Searchable::$TYPE_NETWORK => array(),
			Searchable::$TYPE_USER => array()
		);

		if (!array_key_exists('memberStatus', $params)) {
			$params['memberStatus'] = Searchable::$STATUS_ACTIVE;
		}

		if (!array_key_exists('type', $params)) {
			$params['type'] = Searchable::getValidTypes();
		}

		$this->_readDescendents($params, $oIdMap, $oTypeMap);
		return array($oTypeMap, $oIdMap);
	}

	/**
	 * Fetches the members a given Searchable has.
	 * @method readMembers
	 * @param  int $sId Required. The Seachable DB PK.
	 * @param  array $params Optional. Extra params to define.
	 * @param  boolean $isOwner Optional. Find members of sId, when false finds searchables sId is members of; defaults to true.
	 * @return {Array} The memebers and number of occurrances in DB.
	 * @since  version 1.0
	 * @access public
	 */
	public function readMembers($sId, $params = array(), $isOwner=true) {
		if ($sId) {
			$params[$isOwner ? 'ownerId' : 'memberId'] = $sId;
		}

		if (!array_key_exists('memberStatus', $params)) {
			$params['memberStatus'] = Searchable::$STATUS_ACTIVE;
		}

		list ($searchables, $searchablen, $memberAdminState) = $this->readSearchables($params, true);
		$this->populateMembers($searchables, $memberAdminState);

		return array($searchables, $searchablen);
	}

	/**
	 * Retrieve the ancestor networks of a network.
	 * @method readParent
	 * @param  int|array $sId Required. The DB PK of Network or array thereof.
	 * @return A Network DBO or null.
	 * @since  version 1.0
	 * @access public
	 */
	public function readParent($sId) {
		$pnetworks = $this->readAncestors($sId);
		return sizeof($pnetworks) ? $pnetworks[0] : null;
	}

	/**
	 * Updates a collection of members.
	 * @method updateMembers
	 * @param  int $sId Required. The Searchable DB PK.
	 * @param  array $aSearchablesToAdd Required. A collection of Searchable DB PKs to add as members.
	 * @param  array $aSearchablesToRemove Required. A collection of Searchable DB PKs to remove as members.
	 * @param  string $status Optional. The status to override with, instead of active.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	public function updateMembers($sId, $aSearchablesToAdd, $aSearchablesToRemove, $status = null) {
		$n = sizeof($aSearchablesToRemove);

		if ($n) {
			$aSearchables = array_fill(0, $n, $sId);
			$this->deleteMember($aSearchables, $aSearchablesToRemove);
		}

		$n = sizeof($aSearchablesToAdd);

		if ($n) {
			foreach ($aSearchablesToAdd as $id) {
				$m = Member::createSimple($sId, intval($id));
				if ($status) {
					$m->setStatus($status);
				}
				$this->createMember($m);
			}
		}
	}

	/**
	 * Updates the admins of the searchable.
	 * @method updateSearchableAdmins
	 * @param  $sId {Number} Required. The searchable DB PK.
	 * @param  $aSearchablesToAdd {Array} Required. Searchables to become admins.
	 * @param  $aSearchablesToRemove {Array} Required. Searchables to remove admins.
	 * @return void
	 * @access Public
	 * @since  Version 1.0
	 */
	public function updateSearchableAdmins($sId, $aSearchablesToAdd, $aSearchablesToRemove) {
		// remove admins, except super admin
		$where = Member::$SQL_WHERE_A . ' AND `searchableB_id` IN (' . implode(',', $aSearchablesToRemove) . ') AND `sadmin`="false"';
		$this->_update(Member::$SQL_TABLE, array('admin', 'sadmin'), array(false, false, $sId), $where);

		// add in new admins
		$where = Member::$SQL_WHERE_A . ' AND `searchableB_id` IN (' . implode(',', $aSearchablesToAdd) . ')';
		$this->_update(Member::$SQL_TABLE, array('admin'), array('true', $sId), $where);

		// todo: need to handle transfering of superuser
	}

	/**
	 * Updates the admins of the searchable.
	 * @method updateSearchAdmins
	 * @param  $S {Searchable} Required. A searchable.
	 * @param  $aSearchablesToAdd {Array} Required. Searchables to become admins.
	 * @param  $aSearchablesToRemove {Array} Required. Searchables to remove admins.
	 * @return void
	 * @access Public
	 * @since  Version 1.0
	 */
	public function updateSearchableMembers($S, $aSearchablesToAdd, $aSearchablesToRemove, $status = '') {
		$sId = $S->getId();
		
		// remove members except admins and super admins
		if (sizeof($aSearchablesToRemove)) {
			$sSearchablesToRemove = implode(',', $aSearchablesToRemove);
			$where = '((' . Member::$SQL_WHERE_A . ' AND `searchableB_id` IN (' . $sSearchablesToRemove . ')) OR ' .
					 '(`searchableA_id` IN (' . $sSearchablesToRemove . ') AND ' . Member::$SQL_WHERE_B . '))';
			$this->_delete(Member::$SQL_TABLE, array($sId, $sId, false, false), array(
				$where, '`admin`=? AND `sadmin`=?'
			));
		}

		if (!$status) {
			$status = Searchable::$STATUS_PENDING;
		}

		// add in new members
		if (0 < sizeof($aSearchablesToAdd)) {
			$o = Member::createSimple($S, 0);
			$args = Member::generateCreateSQL($o);
			array_pop($args);

			foreach ($aSearchablesToAdd as $uId) {
				$o = Member::createSimple($S, intval($uId));
				$o->setStatus($status);
				$insertArgs = Member::generateCreateSQL($o);
				array_push($args, $insertArgs[2]);
			}

			call_user_func_array(array($this, '_insert'), $args);
		}
	}
}