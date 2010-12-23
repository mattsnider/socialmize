
<?php

/**
 * GroupManager.php is used to query the database to Group model related data.
 *
 * Long description for file (if any)...
 *
 * PHP versions 4 and 5
 *
 * LICENSE: This source file is subject to version 3.0 of the PHP license
 * that is available through the world-wide-web at the following URI:
 * http://www.php.net/license/3_0.txt.  If you did not receive a copy of
 * the PHP License and are unable to obtain it through the web, please
 * send a note to license@php.net so we can mail you a copy immediately.
 *
 * @category   BaseManager
 * @package    project.service
 * @author     Matt Snider <mattsniderppl@gmail.com>
 * @copyright  2007-2012 Matt Snider, LLC
 * @license    http://www.php.net/license/3_0.txt  PHP License 3.0
 * @version    CVS: $Id:$
 * @see        BaseManager
 * @since      release 1.0
 */

import('project.service.UserManager');


/**
 * @package project.service
 * @author Matt Snider
 *
 */
class GroupManager extends BaseManager {

	//
	//	selects
	//

	var $_DB_SELECT_GROUP = '`group`.*';

	//
	//	joins
	//

	var $_db_join_group_group_user = 'LEFT JOIN `group` ON `group`.`id` = `group_user`.`group_id`';


	//
	//	group related where clauses
	//

	var $_db_where_group_status_equals = '`group`.`status`=?';
	var $_db_where_group_user_admin_equals = '`group_user`.`admin`=?';
	var $_db_where_group_id_equals = '`group`.`id`=?';
	var $_db_where_group_key_equal = '`group`.`key`=?';
	var $_db_where_profile_groupid_equal = '`profile`.`group_id`=?';
	

	//
	//	table names
	//

//	var $_db_table_group = ' `group`';


	//
	//	Other Clauses
	//

	var $_db_orderby_group_user_created_desc = 'ORDER BY `group_user`.`created` DESC';

	/**
	 * Creates a database object from the Group model.
	 * @param g {Group} Required. Group model from the application.
     * @access Public
     * @since Release 1.0
	 */
	public function createGroup(&$g) {
		if (! $g->getId() && $g->getUserId()) {
			$userId = $g->getUserId();

			$this->createSearchable($g);
			$this->updateSearchableField($g->getId(), 'uri_image', '/images/searchables/blank_group.gif');
			$this->updateSearchableField($g->getId(), 'uri_thumb', '/images/thumbs/blank_group_thumb.gif');

			// create the Group
			$this->_insert($this->_DB_TABLE_GROUP, array('category_id', 'searchable_id'),
			                                       array($g->getCategoryId(), $g->getId()));
		}
	}


	/**
	 * Deletes the group
	 *
	 * @param groupId {Integer} the group DB PK
     * @access public
     * @since release 1.0
	 */
	public function deleteGroup($groupId) {
		if (0 < $groupId) {
			$rs = $this->_select(array($this->_db_table_profile), array('`id`'), array($groupId), array($this->_db_where_groupid_equals));
			$profileId = $rs->next()? $rs->getInt('id'): 0;
			$this->_delete(array($this->_DB_TABLE_GROUP), array($groupId), array($this->_DB_WHERE_ID_EQUALS));

			if ($profileId) {
				$this->_deleteProfile($profileId);
				$this->_delete(array($this->_DB_TABLE_SEARCHABLE_SEARCHABLE), array($groupId), array($this->_db_where_groupid_equals));
			}
		}
	}


	/**
	 * Retrieve a single group by its database key.
	 *
	 * @method getGroupById
	 * @param groupId {Integer} Required. The DB PK of group.
	 * @return {Group} Fetch group object.
     * @access public
     * @since release 1.0
	 */
	public function &getGroupByKey($key) {
		if (! $key) {$key='0';}
		$group = new Group();
		$rs =& $this->_select(array($this->_DB_TABLE_GROUP), array($this->_DB_SELECT_GROUP),
																				array($key), array($this->_db_where_group_key_equal));

		// assert that the next result is parsable
		if ($rs->next()) {
			$group =& $this->_getGroupDBO($rs);
		}
		$rs->close();

		return $group;
	}


	/**
	 * Creates and stuffs the user profile object with the user profile elements and an id
	 * @param	groupId {Integer} a Group DB PK to exclude
	 * @param	catId {Integer} the Group category id
	 * @param	n {Integer} OPTIONAL: the number of groups to retrieve; default 4
	 * @return {List of Group} An array of basic Group DBOs
     * @access Public
     * @since release 1.0
	 */
	public function getRelatedGroups($groupId, $catId, $n=4) {
		$groups = array();
        $values = array(Searchable::$ACCESS_PRIVATE, $catId);
        $wheres = array($this->_DB_WHERE_ID_NOT, $this->_DB_WHERE_GROUP_ACCESS_NOT_EQUALS, $this->_db_where_group_categoryid_equals);

		$rs =& $this->_select(array($this->_DB_TABLE_GROUP), array('`group`.*'), $values, $wheres, 'DISTINCT', array('LIMIT 0, ' . $n));

		// assert that the next result is parsable
		while ($rs->next()) {
			$group =& $this->_getGroupDBO($rs);
			array_push($groups, $group);
		}
		$rs->close();

		return ref($groups);
	}


	/**
	 * Removes the user from the group_user table, and the group altogether if last group member
	 * @param	groupId {Integer} the group DB PK
	 * @param	userId {Integer} the user DB PK
     * @access Public
     * @since release 1.0
	 */
	public function removeUserFromGroup($groupId, $userId) {
		$adminn = $this->getUserCountByGroupId($groupId, true, 1);
		$membern = $this->getUserCountByGroupId($groupId, 1);
		$isAdmin = $this->isUserGroupMember($groupId, $userId, 1);
		$isOnlyAdmin = $isAdmin && 1 == $adminn;

		$this->_delete(array($this->_DB_TABLE_MEMBER), array($groupId, $userId),
							array($this->_db_where_group_user_groupid_equals, $this->_db_where_group_user_userid_equals));

		// this is the groups only user, remove group
		if ($isOnlyAdmin || 1 == $membern) {
			$this->deleteGroup($groupId);
			return true;
		}

		return false;
	}

	/**
	 * Executes the SQL statement to update the a Group
	 * @param g {Group} Required. A Group DBO.
     * @access Public
     * @since release 1.0
	 */
	public function updateGroup($g) {
	    $this->updateSearchable($g);
		$this->_update($this->_DB_TABLE_GROUP, array('category_id', 'company_id'),
				array($g->getCategoryId(), $g->getCompanyId(), $g->getId()), $this->_DB_WHERE_SEARCHABLE_ID);
	}

	/**
	 * Updates a field of the Group, safer than updating the whole Group
	 * @param	groupId {Integer} the DB PK of Group
	 * @param	field {String} field to update
	 * @param	value {String} field value
	 * @access	Public
	 * @since	release 1.0
	 */
	public function updateGroupField($groupId, $field, $value) {
		$this->_update($this->_DB_TABLE_GROUP, array('modified', $field),
					   array(getDatetime(time()), $value, $groupId), $this->_DB_WHERE_ID_EQUALS);
	}



	// todo: update methods below this line 07/12/07 -mes
	
	
	/**
	 * Retrieve a message board topics a group id
	 * @param groupId				The group id
	 * @return 					A collection of project.model.Group objects
     * @access public
     * @since UserManager.getMessageTopics available since release 0.5
	 */
	function &getMessageTopics($groupId) {
		$messages = null;
		$conn =& $this->ds->getConnection();
		$stmt =& $conn->prepareStatement('SELECT `user`.`*` FROM `group_topic` LEFT JOIN `user` ON `group_topic`.`user_id` = `user`.`id` WHERE `group_id` = ?');
		$stmt =& $conn->prepareStatement('SELECT `group_topic_message`.`*` FROM `group_topic_message` LEFT JOIN `group_topic` ON `group_topic_message`.`topic_id` = `group_topic`.`id` WHERE `group_id` = ?');
		$stmt->setString(1, $groupId);
		$rs =& $stmt->executeQuery();

		$messages = array();
		// assert that the next result is parsable
		while ($rs->next()) {
			$message =& $this->_getMessage($rs);
			array_push($topics, $message);
		}
		$rs->close();

		return $messages;
	}
}

?>
