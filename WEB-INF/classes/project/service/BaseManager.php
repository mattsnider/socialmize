<?php

import('project.model.Group');
import('project.model.MessageBoard');
import('project.model.Network');
import('project.model.News');
import('project.model.Notification');
import('project.model.Post');
import('project.model.User');
import('project.service.NotificationManager');
import('project.service.ContentManager');


def('RESULTS_LIMIT', 10);

/**
 * @package project.service
 */
class BaseManager extends Object {

	var $ds = null;

	/**
	 * The code to select all enum values in the DB.
	 * @property DB_ENUM_ALL
	 * @var {String} The enum wildcard.
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $DB_ENUM_ALL = 'ALL';


	//	Join statements

	var $_DB_JOIN_SEARCHABLE = 'LEFT JOIN `searchable` AS `S` ON `S`.`id` = `searchable_id`';

	var $_DB_JOIN_SEARCHABLE_SEARCHABLE_SEARCHABLE_B = 'LEFT JOIN `searchable` AS `S` ON `searchable_searchable`.`searchableB_id` = `S`.`id`';

	var $_DB_JOIN_SEARCHABLE_FROM_WALL = 'LEFT JOIN `searchable` AS `S` ON `SW`.`searchable_id` = `S`.`id`';
	var $_DB_JOIN_SEARCHABLE_FROM_MESSAGE_BOARD = 'LEFT JOIN `searchable` AS `S` ON `message_board`.`creator_searchable_id` = `S`.`id`';

	var $_DB_JOIN_DICTIONARY_WORD = 'LEFT JOIN `dictionary_word` AS `DW` ON `PWDW`.`word_id` = `DW`.`id`';
	var $_DB_JOIN_DICTIONARY_STEM_WORD = 'LEFT JOIN `dictionary_stem_word` AS `DSW` ON `DSW`.`word_id` = `DW`.`id`';
	var $_DB_JOIN_DICTIONARY_STEM = 'LEFT JOIN `dictionary_stem` AS `DS` ON `DSW`.`stem_id` = `DS`.`id`';


	// Other clauses

	var $_DB_ORDERBY_CREATED = 'ORDER BY `created` DESC';
	var $_DB_ORDERBY_WALL_DESC = 'ORDER BY `SW`.`created` DESC';


	//	Select statments

	var $_DB_SELECT_COUNT = 'COUNT(*) AS `count`';
	var $_DB_SELECT_GROUP_FOR_LIST = '`S`.*, `group`.*';
	var $_DB_SELECT_ID = '`S`.`id`';
	var $_DB_SELECT_SEARCHABLE = '`S`.*';
	var $_DB_SELECT_SEARCHABLES = '';
	var $_DB_SELECT_TYPE = '`S`.`type`';
	var $_DB_SELECT_USER = '`S`.*, `user`.*';


	// Table clauses

	var $_DB_TABLE_CITY = '`city`';
	var $_DB_TABLE_COUNTRY = '`country`';
	var $_DB_TABLE_STATE = '`state`';
	var $_DB_TABLE_GROUP = '`group`';
	var $_DB_TABLE_GROUP_CATEGORY = '`group_category`';
	var $_DB_TABLE_MESSAGE_BOARD = '`message_board`';
	var $_DB_TABLE_SEARCHABLE_FEATURE = '`searchable_profile_feature`';
	var $_DB_TABLE_SEARCHABLE = '`searchable` AS `S`';
	var $_DB_TABLE_SEARCHABLE_SCHOOL = '`searchable_school`';
	var $_DB_TABLE_USER = '`user`';
	var $_DB_TABLE_USER_search = '`user_search`';
	var $_DB_TABLE_WORD = '`word`';
	var $_DB_TABLE_PWDW = '`profile_widget_dictionary_word` AS `PWDW`';
	var $_DB_TABLES_SEARCHABLE = null;


	//	Where clauses

	var $_DB_WHERE_ID = '`id` = ?';
	var $_DB_WHERE_ID_NOT = '`id` <> ?';
	var $_DB_WHERE_CREATED = '`created` = ?';
	var $_DB_WHERE_CREATED_AFTER = '`created` > ?';
	var $_DB_WHERE_COMPANYID = '`company_id` = ?';
	var $_DB_WHERE_IKEY = '`ikey` = ?';
	var $_DB_WHERE_KEY = '`key` = ?';
	var $_DB_WHERE_MODIFIED = '`modified` = ?';
	var $_DB_WHERE_MODIFIED_AFTER = '`modified` > ?';
	var $_DB_WHERE_NAME = '`name` = ?';
	var $_DB_WHERE_EMAIL_LIKE = '`S`.`email` LIKE ?';
	var $_DB_WHERE_NAME_LIKE = '`S`.`name` LIKE ?';
	var $_DB_WHERE_SCHOOLID = '`school_id` = ?';
	var $_DB_WHERE_STATUS = '`status` = ?';

	var $_DB_WHERE_SEARCHABLE_RECENTLY_ONLINE = '`user`.`last_login` > ?';
	var $_DB_WHERE_SEARCHABLE_RECENTLY_UPDATED = '`S`.`modified` > ?';

	var $_DB_WHERE_PARENT_ID = '`parent_id` = ?';

	var $_DB_WHERE_SEARCHABLE_PK = '`S`.`id` = ?';
	var $_DB_WHERE_SEARCHABLE_ID_NOT = '`S`.`id` <> ?';
	var $_DB_WHERE_SEARCHABLE_ID = '`searchable_id` = ?';
	var $_DB_WHERE_SEARCHABLE_STATUS = '`S`.`status` = ?';

	var $_DB_WHERE_SEARCHABLE_ACCESS = '`S`.`access` = ?';
	var $_DB_WHERE_SEARCHABLE_ACCESS_NOT = '`S`.`access` <> ?';
	var $_DB_WHERE_GROUP_USER_ADMIN_EQUALS = '`group_user`.`admin` = ?';
	var $_DB_WHERE_GROUP_CATEGORYID = '`group`.`category_id`=?';
	var $_DB_WHERE_GROUP_CATEGORYID_BETWEEN = '`group`.`category_id` BETWEEN ? AND ?';
	var $_DB_WHERE_GROUP_USER_JOINED_ONLINE = '`group_user`.`created` > ?';
	var $_DB_WHERE_GROUP_NAME_LIKE = '`group`.`name` LIKE ?';
	var $_DB_WHERE_GROUP_RECENTLY_ADDED = '`group`.`created` > ?';
	var $_DB_WHERE_GROUP_STATUS_EQUALS = '`group`.`status` = ?';

	var $_DB_WHERE_MESSAGE_BOARD_STATUS = '`message_board`.`status`=?';

	var $_DB_WHERE_MEMBER_BA = '(`searchable_searchable`.`searchableB_id`=? AND `searchable_searchable`.`searchableA_id`=?)';
	var $_DB_WHERE_MEMBER_AB = '(`searchable_searchable`.`searchableA_id`=? AND `searchable_searchable`.`searchableB_id`=?)';
	var $_DB_WHERE_MEMBER_RECENTLY_ADDED = '`searchable_searchable`.`modified` > ?';


	/** ========================== Constructor ========================== */

	/**
	 * Create an internal reference to the DataSource object for SQL queries.
	 * @method BaseManager
	 * @param dataSource {DataSource} Required. Singleton object from the request that references the SQL related methods.
	 * @access Public
	 * @since Release 1.0
	 * @constructor
	 */
	public function __construct(&$dataSource) {
		$this->_DB_SELECT_USER = array(Searchable::$SQL_SELECT . ', `user`.`last_login`, `user`.`login_count`, `user`.`searchable_id`, `user`.`terms`');
		$this->_DB_SELECT_USER_RESULT = $this->_DB_SELECT_USER;
		$this->_DB_SELECT_SEARCHABLES = array(Searchable::$SQL_SELECT, User::$SQL_SELECT, Group::$SQL_SELECT, Network::$SQL_SELECT);
		$this->_DB_TABLES_SEARCHABLE = array(Searchable::$SQL_TABLE, User::$SQL_LEFT_JOIN, Group::$SQL_LEFT_JOIN, Network::$SQL_LEFT_JOIN);

		$this->ds =& $dataSource;
	}


	/** ========================== Public Functions ========================== */

	/**
	 * Creates a news DB instance from News DBO.
	 * @method createNews
	 * @param  $o {Message} Required. A News DBO.
	 * @param  $aUsers {Array} Optional. The users to receive this article.
	 * @access Public
	 * @since  Release 1.0
	 */
	public function createNews(&$o, $aUsers = array()) {
		if ($o->getId()) {
			call_user_func_array(array($this, '_update'), News::generateUpdateSQL($o));
		}
		else {
			$newsId = call_user_func_array(array($this, '_insert'), News::generateCreateSQL($o));
			$o->setId($newsId);

			$params = array('news_searchable', array('created', 'news_id', 'searchable_id'));
			$date = getDatetime(time());
			$i = sizeof($params);

			// iterate on each user and create an insert statement
			foreach ($aUsers as $oUser) {
				if (c('ADMIN_ID') !== $oUser->getId()) {
					$params[$i] = array($date, $newsId, $oUser->getId());
					$i += 1;
				}
			}

			call_user_func_array(array(&$this, "_insert"), $params);
		}
	}

	/**
	 * Creates a database entry represented by the MessageBoardDBO, updates the ID of DBO to match DB insertion.
	 * @method createMessageBoard
	 * @param o {MessageBoard} Required. A message board user DBO.
	 * @access Public
	 * @since Release 1.0
	 */
	public function createMessageBoard(&$o) {
		$created = getDatetime(time());
		$ikey = getInsertKey();

		$this->_insert($this->_DB_TABLE_MESSAGE_BOARD, array('body', 'created', 'creator_searchable_id', 'ikey', 'modified', 'original_id', 'parent_id', 'searchable_id', 'status', 'title'),
					   array($o->getBody(), $created, $o->getCreatorId(), $ikey, $created, $o->getOriginalId(), $o->getParentId(), $o->getSearchableId(), $o->getStatus(), $o->getTitle()));

		$rs = $this->_select(array($this->_DB_TABLE_MESSAGE_BOARD), array('id'), array($ikey), array($this->_DB_WHERE_IKEY));

		if ($rs->next()) {
			$o->setId($rs->getInt('id'));
		}
	}

	/**
	 * Creates a Notification.
	 * @method createNotification
	 * @param  $o {Searchable} Required. A Notification DBO or child class.
	 * @access Public
	 * @since  Release 1.0
	 */
	public function createNotification(&$o) {
		$o->setId(call_user_func_array(array($this, '_insert'), Notification::generateCreateSQL($o)));
	}

	/**
	 * Creates a searcahble.
	 * @method createSearchable
	 * @param o {Searchable} Required. A Searchable DBO or child class.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function createSearchable(&$o) {
		$o->setKey(getInsertKey());

		// create an image text, when the email exists
		if ($o->getEmail()) {
			createTextImage($o->getEmail(), 'emails/' . $o->getKey());
		}

		$o->setId(call_user_func_array(array($this, '_insert'), Searchable::generateCreateSQL($o)));
	}

	/**
	 * Creates a database object for the wall table.
	 * @method createWallPost
	 * @param sId {Integer} Required. The DB PK of the owning Searchable.
	 * @param pId {Integer} Required. The DB PK of the owning Searchable.
	 * @param text {String} Required. The body message.
	 * @access Public
	 * @since Release 1.0
	 */
	public function createWallPost($sId, $pId, $text) {
		$this->_insert(Post::$SQL_TABLE, array('searchable_id', 'poster_id', 'body', 'created'),
					   array($sId, $pId, $text, getDatetime(time())));
	}

	/**
	 * Deletes the provided code.
	 * @method deleteActivationCode
	 * @param code {String} Required. The code to evaluate.
	 * @public
	 */
	public function deleteActivationCode($code = '') {
		$this->_delete(array('`activation`'), array($code), array('`code`=?'));
	}

	/**
	 * Deletes a network and all its children.
	 * @method deleteNetwork
	 * @param  $S {Object} Required. The Searchable to delete.
	 * @access Public
	 * @since  Release 1.0
	 */
	public function deleteNetwork($S) {
		//		$children = $this->readDescendents($S->getId());
		//
		//		// iterate on the children and delete them as well
		//		foreach ($children as $child) {
		//			$this->deleteNetwork($child);
		//		}

		if ($S->isNetwork()) {
			$this->updateSearchableStatus($S->getId(), Searchable::$STATUS_DELETED, $S->getAccess());
		}
		else {
			$this->_getLog()->error('Attempting to delete a network, but actually deleting a ' . $S->getType());
		}
	}

	/**
	 * Deletes a database object for the wall table.
	 * @method deleteWallPost
	 * @param wallId {Integer} Required. The DB PK of the owning Searchable.
	 * @param sId {Integer} Required. The DB PK of the owning Searchable.
	 * @access Public
	 * @since Release 1.0
	 */
	public function deleteWallPost($wallId, $sId) {
		$this->_delete(array(Post::$SQL_TABLE), array($wallId, $sId), array($this->_DB_WHERE_ID, 'poster_id'));
	}

	/**
	 * Removes a News DB row.
	 * @method deleteNews
	 * @param id {Integer} Required. A Message DB PK.
	 * @access Public
	 * @since Release 1.0
	 */
	public function deleteNews($id) {
		$this->_delete(array(News::$SQL_TABLE), array($id), array($this->_DB_WHERE_ID));
	}

	/**
	 * Delete a set of ids from a table.
	 * @method deleteList
	 * @param table {String} Required. The table name.
	 * @param id {Integer} Required. The value of DB PK.
	 * @param fields {Array} Required. A collection of id field names.
	 * @param idList {Array} Required. A collection of DB PK for words.
	 * @access Public
	 * @since Release 1.0
	 */
	public function deleteList($table, $id, $fields, $idList) {
		// delete a selective list
		if ($idList) {
			$this->_delete(array($table), array($id), array('`' . $fields[0] . '` = ? AND `' . $fields[1] . '` NOT IN (' . implode(', ', $idList) . ')'));
		}
			// delete all
		else {
			$this->_delete(array($table), array($id), array('`' . $fields[0] . '` = ?'));
		}
	}

	/**
	 * Sets the status of the notification to deleted, can then only be restored by DB admin.
	 * @method deleteNotification
	 * @param id {Integer} Required. The DB PK.
	 * @param sId {Integer} Required. The Searchable DB PK.
	 * @access Public
	 * @since Release 1.0
	 */
	public function deleteNotification($id, $sId) {
		if ($id) {
			$this->_update(Notification::$SQL_TABLE, array('status'), array(Searchable::$STATUS_DELETED, $id, $sId), '`id`=? && `searchable_to_id`=?');
		}
	}

	/**
	 * Sets the status of the notification to deleted, can then only be restored by DB admin.
	 * @method deleteNotificationsByRelatedId
	 * @param id {Integer} Required. The DB PK.
	 * @access Public
	 * @since Release 1.0
	 */
	public function deleteNotificationsByRelatedId($id) {
		if ($id) {
			$this->_update(Notification::$SQL_TABLE, array('status'), array(Searchable::$STATUS_DELETED, $id), '`related_id`=?');
		}
	}

	/**
	 * Delete a set of words from a table.
	 * @method deleteWord
	 * @param table {String} Required. The table name.
	 * @param id {Integer} Required. The value of DB PK.
	 * @param idList {Array} Required. A collection of DB PK for words.
	 * @access Public
	 * @since Release 1.0
	 */
	public function deleteWord($table, $id, $idList) {
		$this->deleteList($table, $id, array('profile_id', 'word_id'), $idList);
	}

	/**
	 * Fetches the admin parameters from DB.
	 * @method getCustomization
	 * @param id {Integer} Optional. The DB PK of customization; defaults to first row.
	 * @return {Array} The DB row key/value pairs.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getCustomization($id = null) {
		$rs = $this->_select(array('admin'), array('bg_custom', 'bg_type', 'color_bg', 'color_hd1', 'color_hd2', 'color_hd3', 'color_hd4', 'color_label', 'color_link',
												   'color_text', 'color_visited', 'has_favicon'), array($id), $id ? array('id=?') : array(), '', array('ORDER BY `modified` DESC', 'LIMIT 1'));

		$hash = array('bgCustom' => 0, 'bgType' => 1, 'colorBg' => 'EFEFEF', 'colorHd1' => '830A04', 'colorHd2' => '830A04', 'colorHd3' => '830A04', 'colorHd4' => '830A04', 'colorLabel' => '999999',
					  'colorLink' => '000099', 'colorText' => '000000', 'colorVisited' => '000099', 'hasFavicon' => 0, 'idDefault' => true);

		if ($rs->next()) {
			$hash['colorBg'] = $rs->getString('color_bg');
			$hash['colorHd1'] = $rs->getString('color_hd1');
			$hash['colorHd2'] = $rs->getString('color_hd2');
			$hash['colorHd3'] = $rs->getString('color_hd3');
			$hash['colorHd4'] = $rs->getString('color_hd4');
			$hash['colorLabel'] = $rs->getString('color_label');
			$hash['colorLink'] = $rs->getString('color_link');
			$hash['colorText'] = $rs->getString('color_text');
			$hash['colorVisited'] = $rs->getString('color_visited');
			$hash['bgCustom'] = $rs->getInt('bg_custom');
			$hash['bgType'] = $rs->getInt('bg_type');
			$hash['hasFavicon'] = $rs->getInt('has_favicon');
			$hash['idDefault'] = false;
		}

		return $hash;
	}

	/**
	 * Fetches the ids of 'update to' the last 5 customizations.
	 * @method getCustomizationHistory
	 * @return {Array} The list of modified and ids.
	 * @public
	 */
	public function getCustomizationHistory() {
		$rs = $this->_select(array('admin'), array('id', 'modified'), array(), array(), '', array('ORDER BY `modified` DESC', 'LIMIT 1,5'));
		$data = array();
		$i = 0;

		while ($rs->next()) {
			$data[$i] = array('id' => $rs->getInt('id'), 'modified' => $rs->getString('modified'));
			$i += 1;
		}

		return $data;
	}

	/**
	 * Returns a list of close matches to the autocomplete name in the database.
	 * @method getAutocompleteByName
	 * @param table {String} Required. The table name.
	 * @param fields {Array} Required. A collection of id field names.
	 * @param name {String} Required. The exact value of the autcomplete.
	 * @param extraClauses {String} Optional. Additional where clause parameters may be defined here.
	 * @return {Array} The autocomplete ready array.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getAutocompleteByName($table, $fields = array(), $name, $extraClauses = '') {
		$data = array();
		$where = array('`name` LIKE ?');
		if ($extraClauses) {
			$where[1] = $extraClauses;
		}
		$rs = $this->_select(array($table), $fields, array('%' . $name . '%'), $where);

		$j = count($fields);
		// assert that the next result is parsable
		while ($rs->next()) {
			$rv = array();
			for ($i = 0; $i < $j; $i++) {
				$field = $fields[$i];
				$rv[$field] = -1 < strpos($field, 'id') ? $rs->getInt($field) : $rs->getString($field);
			}
			array_push($data, $rv);
		}

		$rs->close();
		return ref($data);
	}

	/**
	 * Attempts to find the exact match of the autocomplete field in the database, otherwise, will create a new row.
	 * @method getAutocompleteIdByName
	 * @param table {String} Required. The table name.
	 * @param name {String} Required. The exact value of the autcomplete.
	 * @return	{Integer} The DB PK of the autocomplete element.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getAutocompleteIdByName($table, $name) {
		if (!$this->_getCount(array($table), array($name), array($this->_DB_WHERE_NAME))) {
			$this->_insert($table, array('created', 'name'), array(getDatetime(time()), $name));
		}

		$rs = $this->_select(array($table), array('`id`'), array($name), array($this->_DB_WHERE_NAME));
		$id = $rs->next() ? $rs->getInt('id') : 0;
		$rs->close();

		return $id;
	}

	/**
	 * Fetches a unique activation code for a user to signup.
	 * @method getEmailActivationCode
	 * @return {String} A 6-digit code.
	 * @public
	 */
	public function getEmailActivationCode() {
		do {
			$code = substr(md5(time()), 2, 6);
			$rs = $this->_select(array('`activation`'), array('*'), array($code), array('`code`=?'));
		}
		while ($rs->next());
		$this->_insert('`activation`', array('code', 'created'), array($code, getDatetime(time())));
		return $code;
	}

	/**
	 * Retrieve a single group by its database id.
	 * @method getGroupById
	 * @param groupId {Integer} Required. The DB PK of group.
	 * @return {Group} Fetch group object.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getGroupById($groupId) {
		$rs =& $this->_select(array(Searchable::$SQL_TABLE, Group::$SQL_LEFT_JOIN),
							  array($this->_DB_SELECT_GROUP_FOR_LIST), array($groupId), array($this->_DB_WHERE_ID));
		$group = ref(null);

		// assert that the next result is parsable
		if ($rs->next()) {
			$group = $this->_getGroupDBO($rs);
		}

		$rs->close();

		return $group;
	}

	/**
	 * Retrieves a message board by parameters.
	 * @method getMessageBoardByParams
	 * @param params {Array} Required. A collection of parameters.
	 * @return {MessageBoard} A Message Board DBO.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getMessageBoardByParams($params) {
		$wheres = array();
		$values = array();
		$i = 0;

		if (array_key_exists('messageId', $params)) {
			$values[$i] = $params['messageId'];
			$wheres[$i] = $this->_DB_WHERE_ID;
			$i += 1;
		}

		if (array_key_exists('searchableId', $params)) {
			$values[$i] = $params['searchableId'];
			$wheres[$i] = $this->_DB_WHERE_SEARCHABLE_ID;
			$i += 1;
		}

		$values[$i] = array_key_exists('status', $params) ? $params['status'] : Searchable::$STATUS_ACTIVE;
		$wheres[$i] = $this->_DB_WHERE_MESSAGE_BOARD_STATUS;
		$i += 1;

		$rs =& $this->_select(array($this->_DB_TABLE_MESSAGE_BOARD), array('*'), $values, $wheres);
		$o = $rs->next() ? $this->_getMessageBoardDBO($rs) : null;
		return $o;
	}

	/**
	 * Retrieves a message board collection by parameters.
	 * @method getMessageBoardsByParams
	 * @param params {Array} Required. A collection of parameters.
	 * @return {Array} A collection of Message Board DBOs.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getMessageBoardsByParams($params) {
		$select = array('`message_board`.*');
		$tables = array($this->_DB_TABLE_MESSAGE_BOARD, $this->_DB_JOIN_SEARCHABLE_FROM_MESSAGE_BOARD);
		$wheres = array($this->_DB_WHERE_SEARCHABLE_STATUS);
		$values = array('active');
		$sortby = array('ORDER BY `modified` DESC');
		$i = 1;

		// test for required params
		if (!array_key_exists('S', $params)) {
			$this->_getLog()->error('getMessageBoardsByParams failed, missing parameter: S');
			return array();
		}

		$S = $params['S'];

		// limit to a specific searchable
		if (array_key_exists('sId', $params)) {
			$values[$i] = $params['sId'];
			$wheres[$i] = $this->_DB_WHERE_SEARCHABLE_ID;
			$i += 1;
		}

		// limit to a specific message board parent
		if (array_key_exists('pId', $params)) {
			$values[$i] = $params['pId'];
			$wheres[$i] = $this->_DB_WHERE_PARENT_ID;
			$i += 1;
		}

		// limit to a specific query
		if (array_key_exists(c('QUERY_KEY_QUERY'), $params)) {
			$v = $params[c('QUERY_KEY_QUERY')];
			$values[$i] = $v;
			$wheres[$i] = "(MATCH (title, body) AGAINST (? IN BOOLEAN MODE) OR " . $this->_DB_WHERE_NAME_LIKE . ')';
			$i += 1;

			// also search user names
			$values[$i] = '%' . $v . '%';
			$i += 1;
		}

		if (array_key_exists(c('QUERY_KEY_FILTER'), $params)) {
			switch ($params[c('QUERY_KEY_FILTER')]) {
				case 1:
					$values[$i] = 0;
					$wheres[$i] = $this->_DB_WHERE_PARENT_ID;
					$i += 1;
					break;

				case 2:
					$values[$i] = 0;
					$wheres[$i] = 'parent_id <> ?';
					$i += 1;
					break;

				default:
					// do nothing
					break;
			}
		}

		if (array_key_exists(c('QUERY_KEY_LIMIT'), $params)) {
			$sortby[1] = 'LIMIT ' . (array_key_exists(c('QUERY_KEY_OFFSET'), $params) ? $params[c('QUERY_KEY_OFFSET')] . ', ' : '') . $params[c('QUERY_KEY_LIMIT')];
		}

		$values[$i] = array_key_exists('status', $params) ? $params['status'] : Searchable::$STATUS_ACTIVE;
		$wheres[$i] = $this->_DB_WHERE_MESSAGE_BOARD_STATUS;
		$i += 1;

		$rs = $this->_select($tables, $select, $values, $wheres, '', $sortby);
		$posts = array();
		$creators = array();
		$i = 0;

		// cache the posts from the result set and fetch poster ids
		while ($rs->next()) {
			$mb = $this->_getMessageBoardDBO($rs);
			$posts[$i] = $mb;
			$creators[$i] = $mb->getCreatorId();
			$mb->setSearchable($S);
			$i += 1;
		}

		// array_unique does not compress the array
		$creators = array_values(array_unique($creators));
		$params2 = array();

		for ($i = count($creators) - 1; 0 <= $i; $i -= 1) {
			$arr = array('userId' => $creators[$i]);
			$arr[c('QUERY_KEY_STATUS')] = Searchable::$STATUS_ACTIVE;
			$arr[c('QUERY_KEY_LIMIT')] = 1;
			$params2[$i] = $arr;
		}

		// fetch the users through a batch process
		$users = $this->getUsersBatch($params2);

		$userMap = array();

		// iterate on the users and create a map by their ID
		for ($i = count($users) - 1; 0 <= $i; $i -= 1) {
			$user = $users[$i];
			$userMap[$user->getId()] = $user;
		}

		// iterate on the posts and inject the users
		for ($i = 0, $j = count($posts); $i < $j; $i += 1) {
			$mb = $posts[$i];
			$mb->setCreator($userMap[$mb->getCreatorId()]);
		}

		$rs->close();
		return array($posts, $this->_getCount($tables, $values, $wheres));
	}

	/**
	 * Find all children searchables and search the children of as well.
	 * @method getChildrenSearchableIds
	 * @param  $sId {Integer} Requried. The searchable DB PK.
	 * @param  $isAdmin {Boolean} Optional. FInd only admins.
	 * @return {Array} An array of searchable DB PKs.
	 * @access Public
	 * @since  Release 1.0
	 */
	public function getChildrenSearchableIds($sId, $isAdmin = false) {
		$wheres = array('`searchable_searchable`.`status`=?', '`S`.`status`=?');
		$values = array(Searchable::$STATUS_ACTIVE, Searchable::$STATUS_ACTIVE);
		$tables = array(Searchable::$SQL_TABLE, Member::$SQL_LEFT_JOIN_FOR_OWNERS);
		$searchableIds = array();
		$parentSearchableIds = array();

		if (is_array($sId)) {
			array_push($wheres, str_replace('= ?', 'IN (' . implode(',', $sId) . ')', Member::$SQL_WHERE_A));
		}
		else {
			array_push($wheres, Member::$SQL_WHERE_A);
			array_push($values, $sId);
		}

		if ($isAdmin) {
			array_push($wheres, '(' . Member::$SQL_WHERE_ADMIN . ' OR `S`.`type` <> ?)');
			array_push($values, true);
			array_push($values, Searchable::$TYPE_USER);
		}

		$rs = $this->_select($tables, array('id', 'type'), $values, $wheres);

		while ($rs->next()) {
			$id = $rs->getInt('id');
			array_push($searchableIds, $id);

			if (Searchable::$TYPE_USER != $rs->getString('type')) {
				array_push($parentSearchableIds, $id);
			}
		}

		if (sizeof($parentSearchableIds)) {
			$newSearchableId = $this->getChildrenSearchableIds($parentSearchableIds, $isAdmin);
			$searchableIds = array_merge($searchableIds, $newSearchableId);
			$searchableIds = array_unique($searchableIds);
		}

		return $searchableIds;
	}

	/**
	 * Retrieve a Network by its DB PK.
	 * @method getNetworkById
	 * @param id {Integer} Required. The DB PK of Network.
	 * @return {Object} Network DBO for PK.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getNetworkById($id) {
		$rs = $this->_select($this->_DB_TABLES_SEARCHABLE, $this->_DB_SELECT_SEARCHABLES, array($id), array($this->_DB_WHERE_ID));
		$o = ref(null);

		// assert that the next result is parsable
		if ($rs->next()) {
			$o = new Network();
			$o->readResultSet($rs);
		}

		$rs->close();

		return $o;
	}

	/**
	 * Retrieves all the News DBOs created after time.
	 * @method getNews
	 * @param  $sId {Integer} Optional. The user id to fetch news for.
	 * @param  $time {Integer} Optional. The time in milliseconds to fetch after.
	 * @return {Array} A collection of News DBOs.
	 * @access Public
	 * @since  Release 1.0
	 */
	public function getNews($sId = 0, $time = '') {
		if (!$time) {
			$time = time();
		}
		$tables = array(News::$SQL_TABLE);
		$values = array(getDatetime($time));
		$wheres = array('`expires` > ?');

		if ($sId) {
			$tables[1] = 'LEFT JOIN `news_searchable` ON `news_id` = `news`.`id`';
			$values[1] = $sId;
			$wheres[1] = '`searchable_id`=?';
		}

		$rs = $this->_select($tables, array(News::$SQL_SELECT), $values, $wheres, '', array($this->_DB_ORDERBY_CREATED));
		$articles = array();
		while ($rs->next()) {
			$o = new News();
			$o->readResultSet($rs);
			array_push($articles, $o);
		}

		return $articles;
	}

	/**
	 * Retrieves a News DBO by its DB PK.
	 * @method getNewsById
	 * @param id {Integer} Required. The News DB PK.
	 * @return {Message} A Message DBO.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getNewsById($id) {
		$rs = $this->_select(array(News::$SQL_TABLE), array(News::$SQL_SELECT), array($id), array($this->_DB_WHERE_ID));
		$o = null;
		if ($rs->next()) {
			$o = new News();
			$o->readResultSet($rs);
		}
		return $o;
	}

	/**
	 * Retrieve a Notification by its DB PK.
	 * @param  $id {Integer} Required. The DB PK.
	 * @return {Object} The Notification DBO.
	 * @access Public
	 * @since  Release 1.0
	 */
	public function getNotificationById($id) {
		$rs = $this->_select(array(Notification::$SQL_TABLE), array(Notification::$SQL_SELECT), array($id), array($this->_DB_WHERE_ID));
		$o = null;

		if ($rs->next()) {
			$o = new Notification();
			$o->readResultSet($rs);

			$searchables = $this->getSearchablesById(array($o->getSearchableById(), $o->getSearchableToId()));

			if ($searchables[0] == $o->getSearchableById()) {
				$o->setSearchableBy($searchables[0]);
				$o->setSearchableTo($searchables[1]);
			}
			else {
				$o->setSearchableBy($searchables[1]);
				$o->setSearchableTo($searchables[0]);
			}
		}

		return $o;
	}

	/**
	 * Retrieve a Notification by its searchableTo DB PK.
	 * @method getNotificationsBySearchable
	 * @param  $S {Object} Required. The DBO receiving Notification.
	 * @return {Array} A collection of Notification DBOs.
	 * @access Public
	 * @since  Release 1.0
	 */
	public function getNotificationsBySearchable($S) {
		$rs = $this->_select(array(Notification::$SQL_TABLE), array(Notification::$SQL_SELECT), array($S->getId()), array(Notification::$SQL_WHERE), '', array($this->_DB_ORDERBY_CREATED));
		$results = array();
		$sIdArray = array();

		// assert that the next result is parsable
		while ($rs->next()) {
			$o = new Notification();
			$o->readResultSet($rs);
			array_push($sIdArray, $o->getSearchableById());
			array_push($results, $o);
		}

		$rs->close();

		$sIdArray = array_unique($sIdArray);
		$searchables = $this->getSearchablesById($sIdArray);
		$sMap = array();

		foreach ($searchables as $s) {
			$sMap[$s->getId()] = $s;
		}

		foreach ($results as &$r) {
			$r->setSearchableBy($sMap[$r->getSearchableById()]);
			$r->setSearchableTo($S);
		}

		return $results;
	}

	/**
	 * Retrieves the administrating searchables for a collection of searchables of a given type.
	 * @method getSearchableAdminsByType
	 * @param  $type {String} Required. The type to filter by.
	 * @param  $sId {Number} Required. A Searchable DB PK.
	 * @return {Array} A collection of Searchable DBOs.
	 * @access Public
	 * @since  Relase 1.0
	 */
	public function getSearchableAdminsByType($type, $sId = '') {
		$wheres = array("`status`='active'", "`type`='user'", "`id` IN (SELECT DISTINCT `searchableB_id` FROM `searchable_searchable` AS `SS` LEFT JOIN `searchable` AS `S` ON `searchableA_id` = `id` WHERE `SS`.`admin`=? AND `SS`.`status`=? AND `S`.`status`=? AND `S`.`type`=?)");
		$values = array(true, Searchable::$STATUS_ACTIVE, Searchable::$STATUS_ACTIVE, $type);
		if ($sId) {
			$wheres[2] = str_replace(')', ' AND `S`.`id`=?)', $wheres[2]);
			array_push($values, $sId);
		}
		$rs = $this->_select($this->_DB_TABLES_SEARCHABLE, $this->_DB_SELECT_SEARCHABLES, $values, $wheres);
		$searchables = $this->_getSearchableResultsDBO($rs);
		return array($searchables, sizeof($searchables));
	}

	/**
	 * Retrieve a Searchable by its DB PK.
	 * @method getSearchableById
	 * @param id {Integer} Required. The DB PK of Searchable.
	 * @return {Searchable} Searchable DBO for PK.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getSearchableById($id) {
		$rs = $this->_select($this->_DB_TABLES_SEARCHABLE, $this->_DB_SELECT_SEARCHABLES, array($id), array($this->_DB_WHERE_ID));
		$S = ref(null);

		// assert that the next result is parsable
		if ($rs->next()) {
			$S = new Searchable();
			$S->readResultSet($rs);
		}

		$rs->close();

		return $S;
	}

	/**
	 * Retrieve the Searchable model for arbitrary user represented by key.
	 * @method getSearchableByKey
	 * @param key {String} Required. The unique key to identify a User.
	 * @return {Searchable} A User or Group DBO.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getSearchableByKey($key) {
		$s = null;

		if ($key) {
			$rs = $this->_select(array(Searchable::$SQL_TABLE), array($this->_DB_SELECT_TYPE, $this->_DB_SELECT_ID), array($key), array($this->_DB_WHERE_KEY));

			// assert that the next result is parsable
			if ($rs->next()) {
				$id = $rs->getString('id');
				$type = $rs->getString('type');

				// todo: if we knew the type, then we wouldn't need to make an extra call here
				if (Searchable::isValidType($type)) {
					$s = call_user_func_array(array($this, 'get' . ucfirst($type) . 'ById'), $id);
				}
			}

			$rs->close();
		}

		return $s;
	}

	/**
	 * Fetches a collection of searchables by there ids. When isMemberSearch is true, then additional parameters are fetched.
	 * @method getSearchablesById
	 * @param  idList {Array} Required. A collection of searchable DB PK.
	 * @param  $memberAdminState {Array} Optional. A map of admin states for members.
	 * @return {Array} A collection of Searchable DBOs.
	 * @access Public
	 * @since  Relase 1.0
	 */
	public function getSearchablesById($idList, $memberAdminState = array()) {
		$select = $this->_DB_SELECT_SEARCHABLES;
		$tables = array(Searchable::$SQL_TABLE, User::$SQL_LEFT_JOIN, Group::$SQL_LEFT_JOIN, Network::$SQL_LEFT_JOIN);

		$rs = $this->_select($tables, $select, array(), array('`S`.`id` IN (' . implode(',', $idList) . ')'));
		$searchables = $this->_getSearchableResultsDBO($rs, $memberAdminState);
		return $searchables;
	}

	/**
	 * Retrieve a User by its DB PK.
	 * @method getUserById
	 * @param id {Integer} Required. The DB PK of User.
	 * @return {Object} User DBO for PK.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getUserById($id) {
		$rs = $this->_select($this->_DB_TABLES_SEARCHABLE, $this->_DB_SELECT_SEARCHABLES, array($id), array($this->_DB_WHERE_ID));
		$user = ref(null);

		// assert that the next result is parsable
		if ($rs->next()) {
			$user = $this->_getUserDBO($rs);
		}

		$rs->close();

		return $user;
	}

	/**
	 * Execute a simple update for a field on a table and return the number of affected rows.
	 * @method _getTableAsArray
	 * @param tables {Array} A collection of SQL from clauses.
	 * @param fields {Array} A collection of SQL set fields.
	 * @param wheres {Array} A collection of SQL where clause.
	 * @return {Array} The results as an array.
	 * @access Public
	 * @since Release 1.0
	 */
	public function &_getTableAsArray($tables, $fields = array(), $values = array(), $wheres = array()) {
		$rs =& $this->_select($tables, $fields, $values, $wheres);

		$rsa = array();
		$j = count($fields);
		// assert that the next result is parsable
		while ($rs->next()) {
			$rv = array();
			for ($i = $j - 1; 0 <= $i; $i--) {
				$field = str_replace('`', '', $fields[$i]);
				$rv[$field] = $rs->getString($field);
			}
			array_push($rsa, $rv);
		}
		$rs->close();

		return $rsa;
	}

	/**
	 * Retrieve the number of User members matching criteria; set 'fl' to true for just admins.
	 * @method getUserCountByGroupId
	 * @param id {Integer} Required. The DK PK of group.
	 * @param status {Integer} Required. 1 = active, 0 = requested.
	 * @param fl {Boolean} Required. True, to only retrieve admins.
	 * @param active {Integer} Required. User status 1 = active, 0 = inactive.
	 * @return {Integer} The number of User members matching criteria.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getUserCountByGroupId($groupId, $status = 'active', $fl = false, $active = 'active') {
		if (!$groupId) {
			return 0;
		}
		$wheres = array($this->_DB_WHERE_SEARCHABLE_STATUS, Member::$SQL_WHERE_STATUS, Member::$SQL_WHERE_A);
		$values = array($active, $status, $groupId);

		if ($fl) {
			array_push($wheres, Member::$SQL_TABLE . '.`admin` = ?');
			array_push($values, 'true');
		}

		return $this->_getCount(array(Member::$SQL_TABLE, $this->_DB_JOIN_SEARCHABLE_SEARCHABLE_SEARCHABLE_B), $values, $wheres);
	}

	/**
	 * Fetch an optimized collection of users based on the passed in parameter collection.
	 * @method getUsersBatch
	 * @param params {Array} Required. An collection of 'param' variables for the 'getUsers' method.
	 * @return {Array} A collection of User DBOs.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getUsersBatch($params = array()) {
		$j = count($params);
		$users = array();

		for ($i = 0; $i < $j; $i += 1) {
			list($user) = $this->readSearchables($params[$i]);
			$users = array_merge($users, $user);
		}

		return $users;
	}

	/**
	 * Retrieve all Posts and limited User profile.
	 * @method getWallPosts
	 * @param o {Searchable} Required. Searchable DBO that owns the wall.
	 * @return {Array} A collection of User objects with extra post data.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getWallPosts($o) {
		$select = array(Post::$SQL_SELECT);
		$tables = array(Post::$SQL_TABLE_AS, $this->_DB_JOIN_SEARCHABLE_FROM_WALL);
		$values = array($o->getId(), 'active');
		$wheres = array($this->_DB_WHERE_SEARCHABLE_ID, $this->_DB_WHERE_SEARCHABLE_STATUS);

		$rs = $this->_select($tables, $select, $values, $wheres, '', array($this->_DB_ORDERBY_WALL_DESC));
		$posts = array();
		$posters = array();
		$i = 0;

		// cache the posts from the result set and fetch poster ids
		while ($rs->next()) {
			$post = new Post();
			$post->readResultSet($rs);
			$posts[$i] = $post;
			$posters[$i] = $post->getPosterId();
			$i += 1;
		}
		$rs->close();

		// array_unique does not compress the array
		$posters = array_values(array_unique($posters));
		$params = array();

		for ($i = count($posters) - 1; 0 <= $i; $i -= 1) {
			$arr = array('userId' => $posters[$i]);
			$arr[c('QUERY_KEY_STATUS')] = Searchable::$STATUS_ACTIVE;
			$arr[c('QUERY_KEY_LIMIT')] = 1;
			$params[$i] = $arr;
		}

		// fetch the users through a batch process
		$users = $this->getUsersBatch($params);

		$userMap = array();

		// iterate on the users and create a map by their ID
		for ($i = count($users) - 1; 0 <= $i; $i -= 1) {
			$user = $users[$i];
			$userMap[$user->getId()] = $user;
		}

		// iterate on the posts and inject the users
		for ($i = 0, $j = count($posts); $i < $j; $i += 1) {
			$post =& $posts[$i];
			$user = clone $userMap[$post->getPosterId()];
			$post->setPoster($user);
		}

		return array($posts, $this->_getCount($tables, $values, $wheres));
	}

	/**
	 * Insert a word into a table.
	 * @method insertWord
	 * @param table {String} Required. The table name.
	 * @param field {String} Required. The field.
	 * @param id {Integer} Required. The related table DB PK.
	 * @param wordId {Integer} Required. The DB PK of word.
	 * @access Public
	 * @since Release 1.0
	 */
	public function insertWord($table, $field, $id, $wordId) {
		$this->_insert($table, array($field, 'word_id'), array($id, $wordId));
	}

	/**
	 * Evaluates if the provided code is valid.
	 * @method isCodeValid
	 * @param code {String} Required. The code to evaluate.
	 * @public
	 */
	public function isCodeValid($code = '') {
		return $this->_getCount(array('`activation`'), array($code), array('`code`=?'));
	}

	public function isValidAutocomplete($table) {
		return $this->_doesTableExist($table);
	}

	/**
	 * Processes the word list into the appropriate DB table values.
	 * @method processWordList
	 * @param wordarrary {Array} Required. A list of Word objects.
	 * @param id {Integer} Required. The owning DB PK to use with field.
	 * @param table {String} Required. The DB table name.
	 * @param field {String} Required. The DB PK field name.
	 * @access Public
	 * @since Release 1.0
	 */
	public function processWordList($wordarrary, $id, $table, $field) {
		$words = array();

		if ($id && $wordarrary[0]) {
			$idList = array(0);
			foreach ($wordarrary as $k => $v) {
				$word =& new Word();
				$word->setName($v);
				$words[$k] = $word;

				$wordId =& $this->getAutocompleteIdByName($this->_DB_TABLE_WORD, $v);
				array_push($idList, $wordId);
				$this->_insert($table, array($field, 'word_id'), array($id, $wordId));
			}

			if (!empty($idList)) {
				$this->_delete(array($table), array($id), array('`' . $field . '`=?', '`word_id` NOT IN (' . implode(', ', $idList) . ')'));
			}
		}

		return $words;
	}

	/**
	 * Method updates the user defined site parameters.
	 * @method insertCustomization
	 * @param data (Array) Required. An associative array with required values:
	 *		isCustom=0,
	 *		bgType='1',
	 *		colorBg='EFEFEF',
	 *		colorHd='830A04',
	 *		colorLabel='999999',
	 *		colorLink='000099',
	 *		colorText='000000',
	 *		colorVisited='000099'
	 * @access Public
	 * @since Release 1.0
	 */
	public function insertCustomization($data) {
		$cols = array();
		$vals = array();

		// iterate on the keys in the data
		foreach ($data as $k => $v) {
			if ('' !== $v) {
				if (FALSE !== strpos($k, 'bg')) {
					array_push($cols, 'bg_' . strtolower(preg_replace('/bg(\w+)/', '$1', $k)));
				}
				else if (FALSE !== strpos($k, 'color')) {
					array_push($cols, 'color_' . strtolower(preg_replace('/color(\w+)/', '$1', $k)));
				}
				else {
					// not supported yet
					continue;
				}

				array_push($vals, $v);
			}
		}

		$timestamp = getDatetime(time());
		array_push($cols, 'created');
		array_push($cols, 'modified');
		array_push($vals, $timestamp);
		array_push($vals, $timestamp);

		$this->_insert('admin', $cols, $vals);
	}

	/**
	 * Reads a collection of searchables from the databases, determined by the parameters provided.
	 * @method readSearchables
	 * @param words {Array} Required. A collection of words to search for.
	 * @param isMemberSearch {Boolean} Optional. This is a member search; default is false.
	 * @access Public
	 * @since Release 1.0
	 */
	public function readSearchables($params, $isMemberSearch = false) {
		$wheres = array();
		$wheresName = array();
		$wheresPWDW = array();
		$tables = array(Searchable::$SQL_TABLE);
		$values = array();
		$valuesName = array();
		$valuesPWDW = array();
		$select = array('`S`.`id`');
		$key = '';
		$preStmt = '';

		$status = Searchable::getValidStatus(array_key_exists(c('QUERY_KEY_STATUS'), $params) ? $params[c('QUERY_KEY_STATUS')] : '', Searchable::$STATUS_ACTIVE);
		if (BaseManager::$DB_ENUM_ALL !== $status) {
			array_push($wheres, $this->_DB_WHERE_SEARCHABLE_STATUS);
			array_push($values, $status);
		}

		if (array_key_exists(c('QUERY_KEY_ACCESS'), $params) && BaseManager::$DB_ENUM_ALL !== $params[c('QUERY_KEY_ACCESS')]) { // assume access is valid, developers should use ControllerBase._getRequestAccess when fetching this parameters
			array_push($wheres, $this->_DB_WHERE_SEARCHABLE_ACCESS);
			array_push($values, $params[c('QUERY_KEY_ACCESS')]);
		}

		$key = c('QK_TYPE');
		if (array_key_exists($key, $params)) {
			$value = $params[$key];

			if (is_array($value)) {
				$values = array_merge($values, $value);
				$aWhere = array_fill(0, sizeof($value), Searchable::$SQL_WHERE_TYPE);
				array_push($wheres, '(' . implode(' OR ', $aWhere) . ')');
			}
			else {
				array_push($wheres, Searchable::$SQL_WHERE_TYPE);
				array_push($values, $value);
			}
		}

		$key = Searchable::$TYPE_USER;
		if (array_key_exists($key, $params)) {
			array_push($tables, User::$SQL_LEFT_JOIN);
			array_push($select, '`user`.`last_login`');

			$key = 'lastLogin';
			if (array_key_exists($key, $params)) {
				array_push($wheres, 'last_login > ?');
				array_push($values, $params[$key]);
			}
		}

		$key = c('QK_PENDING');
		if (array_key_exists($key, $params)) {
			$val = $params[$key];
			array_push($wheres, '(pending_bit & ?) = ?');
			array_push($values, $val, $val);
		}

		$key = 'memberId';
		if (array_key_exists($key, $params)) {
			$value = $params[$key];

			if ($value) {
				array_push($values, $value);
				array_push($wheres, Member::$SQL_WHERE_B);
				array_push($tables, Member::$SQL_LEFT_JOIN_FOR_MEMBERS);
			}
				// special-case for a NULL value 'memberId'
			else {
				array_push($wheres, '`S`.`id` NOT IN (SELECT `searchableB_id` FROM `searchable_searchable` WHERE `admin`="false")');
			}
		}

		$key = 'childrenOf';
		if (array_key_exists($key, $params)) {
			$isAdmin = array_key_exists('childrenAreAdmin', $params) && $params['childrenAreAdmin'];
			$ptype = array_key_exists('parentIsType', $params) ? $params['parentIsType'] : '';
			$value = $params[$key];
			$ids = $this->getChildrenSearchableIds($value, $isAdmin);
			array_push($wheres, '`S`.`id` IN (' . implode(',', $ids) . ')');
			array_push($tables, Member::$SQL_LEFT_JOIN_FOR_OWNERS);
			$preStmt = 'DISTINCT';

			if ($ptype) {
				array_push($tables, 'LEFT JOIN `searchable` AS `S2` on `searchable_searchable`.`searchableA_id`=`S2`.`id`');
				array_push($wheres, str_replace('`S`', '`S2`', Searchable::$SQL_WHERE_TYPE));
				array_push($values, $ptype);
			}
		}

		$key = 'admin';
		if (array_key_exists($key, $params)) {
			$value = $params[$key];
			array_push($values, $value);
			array_push($wheres, Member::$SQL_WHERE_ADMIN);
		}

		$key = 'admins';
		if (array_key_exists($key, $params)) {
			array_push($values, true);
			array_push($wheres, Member::$SQL_WHERE_ADMIN);
			array_push($tables, Member::$SQL_LEFT_JOIN_FOR_MEMBERS);
		}

		$key = 'memberStatus';
		if (array_key_exists($key, $params)) {
			$value = $params[$key];
			$where = array();
			if (!is_array($value)) {
				$value = array($value);
			}

			foreach ($value as $v) {
				array_push($values, $v);
				array_push($where, Member::$SQL_WHERE_STATUS);
			}

			array_push($wheres, implode(' OR ', $where));
		}

		$key = 'ownerId';
		if (array_key_exists($key, $params)) {
			$value = $params[$key];

			if (is_array($value)) {
				array_push($wheres, str_replace('= ?', 'IN (' . implode(',', $value) . ')', Member::$SQL_WHERE_A));
				array_push($tables, Member::$SQL_LEFT_JOIN_FOR_OWNERS);
			}
			else {
				array_push($values, $value);
				array_push($wheres, Member::$SQL_WHERE_A);
				array_push($tables, Member::$SQL_LEFT_JOIN_FOR_OWNERS);
			}
		}

		$key = c('QUERY_KEY_PARENT_ID');
		if (array_key_exists($key, $params)) {
			array_push($values, $params[$key]);
			array_push($wheres, $params[$key] ? 'parent_network_id=?' : 'parent_network_id IS NULL');
			array_push($tables, Network::$SQL_LEFT_JOIN);
		}

		$key = 'networkId';
		if (array_key_exists($key, $params)) {
			array_push($values, $params[$key]);
			array_push($wheres, "`id` NOT IN (SELECT `searchableB_id` FROM `searchable_searchable` WHERE `searchableA_id` IN (select `id` from `searchable` where `type`='network' AND `id` <> ?))");
		}

		if (array_key_exists('naccess', $params)) {
			array_push($values, $params['naccess']);
			array_push($wheres, $this->_DB_WHERE_SEARCHABLE_ACCESS_NOT);
		}

		$key = 'nsId';
		if (array_key_exists($key, $params)) {
			array_push($values, $params[$key]);
			array_push($wheres, $this->_DB_WHERE_SEARCHABLE_ID_NOT);
		}

		if (array_key_exists('related', $params)) {
			array_push($values, Searchable::$ACCESS_PRIVATE);
			array_push($wheres, $this->_DB_WHERE_SEARCHABLE_ACCESS_NOT);
		}

		if (array_key_exists(c('QUERY_KEY_FILTER'), $params)) {
			$value = $params[c('QUERY_KEY_FILTER')];

			switch ($value) {
				case 1: // recently updated
					array_push($values, getDatetime(time() - 172800));
					array_push($wheres, $this->_DB_WHERE_SEARCHABLE_RECENTLY_UPDATED);
					break;

				case 2: // recently added
					array_push($values, getDatetime(time() - 172800));
					array_push($wheres, $this->_DB_WHERE_MEMBER_RECENTLY_ADDED);
					break;

				case 3: // recently online
					array_push($values, getDatetime(time() - 172800));
					array_push($wheres, $this->_DB_WHERE_SEARCHABLE_RECENTLY_ONLINE);
					break;

				default:
					break;
			}
		}

		$key = 'sId';
		if (array_key_exists($key, $params)) {
			$value = $params[$key];

			if (is_array($value)) {
				array_push($wheres, str_replace('= ?', 'IN (' . implode(',', $value) . ')', $this->_DB_WHERE_SEARCHABLE_PK));
			}
			else {
				array_push($wheres, $this->_DB_WHERE_SEARCHABLE_PK);
				array_push($values, $value);
			}
		}

		if (array_key_exists('sql', $params)) {
			array_push($wheres, $params['sql']);
		}

		if (array_key_exists('userId', $params)) {
			array_push($wheres, $this->_DB_WHERE_SEARCHABLE_PK);
			array_push($values, $params['userId']);
		}

		if (array_key_exists(c('QUERY_KEY_CATEGORY'), $params)) {
			$value = $params[c('QUERY_KEY_CATEGORY')];
			array_push($values, $value . '0');
			array_push($values, ($value + 1) . '0');
			array_push($wheres, '(' . $this->_DB_WHERE_GROUP_CATEGORYID . ' OR ' . $this->_DB_WHERE_GROUP_CATEGORYID_BETWEEN . ')');
		}

		$wheresPWDW = array_merge($wheres);
		$valuesPWDW = array_merge($values);
		$wheresName = array_merge($wheres);
		$valuesName = array_merge($values);
		$j = 0;

		// evaluate the query and build SQL statement
		if (array_key_exists(c('QUERY_KEY_QUERY'), $params)) {
			$query = trim($params[c('QUERY_KEY_QUERY')]);

			if ($query) {
				$words = preg_split("/[\s,]+/", $query);
				$orstmtName = array();
				$orstmtPWDW = array();

				for ($i = 0, $j = sizeof($words); $i < $j; $i += 1) {
					$word = $words[$i];
					$wordPer = '%' . $words[$i] . '%';
					$orstmtName[$i] = $this->_DB_WHERE_NAME_LIKE;
					$orstmtName[$i + $j] = $this->_DB_WHERE_EMAIL_LIKE;
					$orstmtPWDW[$i] = '`stem`=?';
					$orstmtPWDW[$j + $i] = '`word`=?';
					array_push($valuesPWDW, $word, $word);
					array_push($valuesName, $wordPer, $wordPer + '@');
				}

				array_push($wheresName, '(' . implode(' OR ', $orstmtName) . ')');
				array_push($wheresPWDW, '(' . implode(' OR ', $orstmtPWDW) . ')');
			}
		}

		list($offset, $limit) = $this->_getLimitFromParams($params);
		$sortby = $this->_getSortBy($params);

		$searchableIds = array();
		$notSearchableIds = array();
		$n = 0;

		if ($isMemberSearch) {
			array_push($select, Member::$SQL_SELECT_ADMIN, Member::$SQL_SELECT_SUPER_ADMIN);
		}
		$memberAdminState = array();

		$rs = $this->_select($tables, $select, $valuesName, $wheresName, $preStmt, array($sortby));

		while ($rs->next()) {
			$id = $rs->getInt('id');
			array_push($notSearchableIds, $id);
			if ($n >= $offset && ($n < $offset + $limit || !$limit)) {
				array_push($searchableIds, $id);

				if ($isMemberSearch) {
					$memberAdminState[$id] = array(true, $rs->getBoolean('admin'), $rs->getBoolean('sadmin'));
				}
			}
			$n += 1;
		}

		$searchableIds = array_unique($searchableIds);

		if (array_key_exists(c('QUERY_KEY_QUERY'), $params) && !array_key_exists('simple', $params)) {
			array_shift($tables);
			$tablePWDW = array_merge(array($this->_DB_TABLE_PWDW, $this->_DB_JOIN_DICTIONARY_WORD, $this->_DB_JOIN_DICTIONARY_STEM_WORD, $this->_DB_JOIN_DICTIONARY_STEM, $this->_DB_JOIN_SEARCHABLE), $tables);
			if (sizeof($notSearchableIds)) {
				array_push($wheresPWDW, '`PWDW`.`searchable_id` NOT IN (' . implode(',', $notSearchableIds) . ')');
			}
			$m = $this->_getCount($tablePWDW, $valuesPWDW, $wheresPWDW, '`S`.`id`');

			if ($j && ($n < $offset + $limit || !$limit)) {
				$offset = $offset - $n;
				if (0 > $offset) {
					$offset = 0;
				}
				$limitStmt = "LIMIT $offset";

				if ($limit) {
					$limit = $limit - sizeof($searchableIds);
					$limitStmt .= ", $limit";
				}

				$rs = $this->_select($tablePWDW, array($this->_DB_SELECT_ID, 'COUNT(*) AS `C`'), $valuesPWDW, $wheresPWDW, '',
									 array('GROUP BY `S`.`id`', 'ORDER BY `C` DESC, `S`.`id` ASC', $limitStmt));

				while ($rs->next()) {
					array_push($searchableIds, $rs->getInt('id'));
				}
			}
		}
		else {
			$m = 0;
		}

		return array(sizeof($searchableIds) ? $this->getSearchablesById($searchableIds) : array(), $m + $n, $memberAdminState);
	}

	/**
	 * Close open connection on the DataSource singleton object.
	 * @method shutdown
	 * @access Public
	 * @since Release 1.0
	 */
	public function shutdown() {
		// todo: understand the number of connections to the DB PHP is opening and when they close
		$conn =& $this->ds->getConnection();
		$conn->close();
	}

	/**
	 * Updates the modified time in the DB and on the Searchable.
	 * @method touchSearchable
	 * @param S {Searchable} Required. The serachable to update.
	 * @public
	 */
	public function touchSearchable(&$S) {
		$S->setModified(getDatetime(time()));
		$this->_updateModified('`searchable`', $S->getId(), '`id`=?');
	}

	/**
	 * Method to update the customization to id.
	 * @method updateCustomization
	 * @param id {Integer} Required. The DB PK.
	 * @public
	 */
	public function updateCustomization($id) {
		$this->_updateModified('admin', $id, '`id`=?');
	}

	/**
	 * Update the message status and handle important event time logging.
	 * @method updateMessageBoardStatus
	 * @param mId {Integer} Required. The DB PK of message.
	 * @param sId {Integer} Required. The DB PK of User.
	 * @param status {String} Optional. The message status; defaults to 'unread'.
	 * @access Public
	 * @since Release 1.0
	 */
	public function updateMessageBoardStatus($mId, $sId, $status = 'active') {
		$time = getDatetime(time());

		// create the update value statements
		$set = array('modified', 'status');
		$values = array($time, $status, $mId, $sId);

		// update this users status to message
		$this->_update($this->_DB_TABLE_MESSAGE_BOARD, $set, $values, '`id`=? AND `creator_searchable_id`=?');
	}

	/**
	 * Executes the SQL statement to update all profile ratings; will probably timeout, if you call from the browser.
	 * @method updateAllRatings
	 * @access Public
	 * @since Release 1.0
	 */
	public function updateAllRatings() {
		//		$groups = $this->getGroups(array());

		//		foreach ($groups as $o) {
		//			// inject the profile into the User object
		//			$profile =& $this->getGroupProfile($o);
		//			$this->updateProfileRating($profile);
		//		}

		//		list($users, $usern) = $this->readSearchables(array());

		//		foreach ($users as $o) {
		//			// inject the profile into the User object
		//			$profile =& $this->getProfile($o);
		//			$profileId = $profile->getOwnerId();
		//
		//			$this->updateProfileRating($profile);
		//		}
	}

	/**
	 * Updates the searchable pending status.
	 * @method updatePendingStatus
	 * @param S {Object} Required. A Searchable.
	 * @param bitmask {Number} Required. The bitmask to apply.
	 * @access Public
	 * @since Release 1.0
	 */
	public function updatePendingStatus(&$S, $bitmask) {
		// remove the bitmask from the pending bit
		if ($S->hasPendingBit($bitmask)) {
			$S->removePendingBit($bitmask);
			$this->_update(Searchable::$SQL_TABLE, array('modified', 'pending_bit'),
						   array(getDatetime(time()), $S->getPendingBit(), $S->getId()), $this->_DB_WHERE_ID);

			// all pending reasons have been removed, change searchabel status to active
			if (!$S->getPendingBit()) {
				$this->updateSearchableStatus($S->getId(), Searchable::$STATUS_ACTIVE, $S->getAccess());
			}
		}
	}

	/**
	 * Executes the SQL statement to update a searchable.
	 * @method updateSearchable
	 * @param  S {Searchable} Required. A Searchable DBO to update.
	 * @access Public
	 * @since  Version 1.0
	 */
	public function updateSearchable(&$S) {
		call_user_func_array(array($this, '_update'), Searchable::generateUpdateSQL($S));
	}

	/**
	 * Creates the searchable connections between a users profile widget content and a user.
	 * @method updateSearchNodes
	 * @param sId {Number} Required. A searchable DB PK.
	 * @param pwId {Number} Required. A profile widget DB PK.
	 * @param data {Array} Required. An array of words to link.
	 * @public
	 */
	public function updateSearchNodes($sId, $pwId, $data) {
		$wordMap = $this->_updateDictionary(implode(' ', $data));
		$wordToIdMap = $wordMap[0];
		$wordToFMap = $wordMap[1];

		// remove existing word connections for this profile widget
		$this->_delete(array('`profile_widget_dictionary_word`'), array($sId, $pwId), array('`searchable_id`=? AND `profile_widget_id`=?'));

		// insert the new word connections
		$now = getDatetime(time());
		$insertParams = array('`profile_widget_dictionary_word`', array('created', 'f', 'profile_widget_id', 'searchable_id', 'word_id'));
		foreach ($wordToIdMap as $word => $wordId) {
			$wordF = $wordToFMap[$word];
			array_push($insertParams, array($now, $wordF, $pwId, $sId, $wordId));
		}

		// there are word connections
		if (2 < sizeof($insertParams)) {
			call_user_func_array(array($this, '_insert'), $insertParams); // actually insert
		}
	}

	/**
	 * Updates a field of a Searchable, safer than updating the whole user.
	 * @method updateSearchableField
	 * @param sId {Integer} Required. The DB PK of User.
	 * @param field {String} Required. The field to update.
	 * @param value {String} Required. The field value.
	 * @access Public
	 * @since Release 1.0
	 */
	public function updateSearchableField($sId, $field, $value) {
		$this->_update(Searchable::$SQL_TABLE, array('modified', $field), array(getDatetime(time()), $value, $sId), $this->_DB_WHERE_ID);
	}

	/**
	 * Updates the status of a user.
	 * @method updateUserStatus
	 * @param sId {Integer} Required. The DB PK of User.
	 * @param status {String} Required. Status to update a user by.
	 * @param access {Char} Required. The access rule.
	 * @access Public
	 * @since Release 1.0
	 */
	public function updateSearchableStatus($sId, $status, $access) {
		$this->_update(Searchable::$SQL_TABLE, array('modified', 'status', 'access'),
					   array(getDatetime(time()), $status, $access, $sId), $this->_DB_WHERE_ID);
	}


	/** ========================== Protected Functions ========================== */

	/**
	 * Executes an ALTER TABLE statement to add foreign keys to a DB table.
	 * @method _dropForeignKeys
	 * @param  $tableName {String} Required. The name of the table.
	 * @param  $keyDefinitions {Array} Required. The keys to add. Use the following format:
	 *		 array(
	 *			nameOfKey, (required)
	 *			nameOfColumnToIndex, (required)
	 *			foreignTableName, (required)
	 *			foreignTableColumn (optional, defaults to `id`)
	 *		)
	 * @param  $autoPrefix {Boolean} Optional. Should key names be autoprefixed with table name.
	 * @return {Integer} The number of affected rows; -1 when no rows affected.
	 * @access Protected
	 * @since  Release 1.0
	 */
	protected function _addForeignKeys($tableName, $keyDefinitions, $autoPrefix = true) {
		$sb = array();
		$i = 0;

		foreach ($keyDefinitions as $definition) {
			$keyName = $autoPrefix ? $tableName . $definition[0] : $definition[0];
			$columnName = $definition[1];
			$foreignTable = $definition[2];
			$foreignColumn = array_key_exists(3, $definition) && $definition[3] ? $definition[3] : 'id';
			$sb[$i++] = 'ADD KEY `' . $keyName . '` (`' . $columnName . '`), ADD CONSTRAINT `' . $keyName . '` FOREIGN KEY (`' . $columnName . '`) REFERENCES `' . $foreignTable . '` (`' . $foreignColumn . '`)';
		}

		$conn = $this->ds->getConnection();
		$stmt = $conn->prepareStatement("ALTER TABLE `$tableName` " . implode(',', $sb));
		$n = $stmt->executeUpdate();
		$stmt->close();
		return $n;
	}

	/**
	 * Executes an ALTER TABLE statement to modify a column in a DB table.
	 * @method _alterTableColumn
	 * @param tableName {String} Required. The name of the table.
	 * @param columnName {String} Required. The name of the column.
	 * @param definition {String} Required. The alter statement.
	 * @return {Integer} The number of affected rows; -1 when no rows affected.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _alterTableColumn($tableName, $columnName, $definition) {
		$conn =& $this->ds->getConnection();
		$stmt =& $conn->prepareStatement("ALTER TABLE `$tableName` MODIFY COLUMN `$columnName` $definition");
		$n = $stmt->executeUpdate();
		$stmt->close();
		return $n;
	}

	/**
	 * Creates a new word or stem entry from words that are in the unique list and not in the existing list.
	 * @method _createNewDictionaryItems
	 * @param column {String} Required. The table column; 'stem' or 'word'.
	 * @param uniqueList {Array} Required. A list of possible items to save.
	 * @param existingList {Array} Required. A list of items already created.
	 * @return {Array} A collect of items inserted into the DB.
	 * @private
	 */
	private function _createNewDictionaryItems($column, $uniqueList, $existingList) {
		$newList = array_diff($uniqueList, $existingList);
		$now = getDatetime(time());
		$insertParams = array("`dictionary_$column`", array('created', $column));
		// 'foreach' used because indices of 'newWordArray' are not reset
		foreach ($newList as $newItem) {
			array_push($insertParams, array($now, $newItem));
		}
		if (0 < sizeof($newList)) {
			call_user_func_array(array($this, '_insert'), $insertParams);
		}
		return $newList;
	}

	/**
	 * Executes a CREATE TABLE statement to insert a new DB table.
	 * @method _createTable
	 * @param tableName {String} Required. The name of the table.
	 * @param definition {Array} Required. An array of comma seperated statements.
	 * @param engine {String} Required. The egnine to user; default is 'MyISAM'.
	 * @param charset {String} Required. The charset set to use; default is 'utf8'.
	 * @return {Integer} The number of affected rows; -1 when no rows affected.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _createTable($tableName, $definition, $engine = 'InnoDB', $charset = 'utf8') {
		$conn =& $this->ds->getConnection();
		$stmt =& $conn->prepareStatement("CREATE TABLE `$tableName` (" . implode(',', $definition) . ") ENGINE=$engine DEFAULT CHARSET=$charset;");
		$n = $stmt->executeUpdate();
		$stmt->close();
		return $n;
	}

	/**
	 * Creates the word stem array for a provided word.
	 * @method _createWordStems
	 * @param word {String} Required. The word to parse.
	 * @return {Array} A collection of stems.
	 * @private
	 */
	private function _createWordStems($word) {
		$arr = array();
		$n = strlen($word);

		for ($i = 1; $i < $n - 1 && 3 < $n - $i; $i += 1) {
			array_push($arr, substr($word, 0, $n - $i)); // front stem
			array_push($arr, substr($word, $i)); // tail stem
		}

		return $arr;
	}

	/**
	 * Execute a DELETE FROM statement; not available to controllers, must be used by a child manager to force model/controller seperation.
	 * @method _delete
	 * @param table {String|Array} Required. A collection of SQL from/join clauses.
	 * @param values {String|Array} Optional. A collection SQL values to match in where clause.
	 * @param where {String|Array} Optional. A collection SQL where clause.
	 * @return {Integer} The number of affected rows; -1 when no rows affected.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _delete($tables, $values = '', $wheres = '') {
		if (is_array($tables)) {
			$tables = implode(' ', $tables);
		}
		if (is_string($values)) {
			$values = empty($values) ? array() : array($values);
		}
		if (is_array($wheres)) {
			$wheres = empty($wheres) ? '' : implode(' AND ', $wheres);
		}
		if ($wheres) {
			$wheres = ' WHERE ' . $wheres;
		}
		$conn =& $this->ds->getConnection();
		$stmt =& $conn->prepareStatement('DELETE FROM ' . $tables . $wheres);
		$this->_setStatementValues($stmt, $values);
		$n = $stmt->executeUpdate();
		$stmt->close();
		return $n;
	}

	/**
	 * Evaluates whether or not a table exists.
	 * @method _doesTableExist
	 * @param tableName {String} Required. The name of the table.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _doesTableExist($tableName) {
		$conn = $this->ds->getConnection();
		$stmt = $conn->prepareStatement('DESC ' . $tableName);
		$rs = $stmt->executeQuery();
		$stmt->close();
		return $rs->next();
	}

	/**
	 * Executes an ALTER TABLE statement to drop foreign keys from a DB table.
	 * @method _dropForeignKeys
	 * @param  $tableName {String} Required. The name of the table.
	 * @param  $keys {Array} Required. The keys to drop.
	 * @param  $autoPrefix {Boolean} Optional. Should key names be autoprefixed with table name.
	 * @return {Integer} The number of affected rows; -1 when no rows affected.
	 * @access Protected
	 * @since  Release 1.0
	 */
	protected function _dropForeignKeys($tableName, $keys, $autoPrefix = true) {
		$sb = array();
		$i = 0;
		if (is_string($keys)) {
			$keys = array($keys);
		}

		foreach ($keys as $key) {
			$keyName = $autoPrefix ? $tableName . $key : $key;
			$sb[$i++] = 'DROP FOREIGN KEY `' . $keyName . '`, DROP KEY `' . $keyName . '`';
		}

		$conn = $this->ds->getConnection();
		$stmt = $conn->prepareStatement("ALTER TABLE `$tableName` " . implode(',', $sb));
		$n = $stmt->executeUpdate();
		$stmt->close();
		return $n;
	}

	/**
	 * Returns the name field of a DBO referenced by id.
	 * @method _getCityById
	 * @param cityId {Integer} Required. The DB PK of a city.
	 * @return	{String} The name of the city.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getCityById($cityId) {
		return $this->_getFieldById($this->_DB_TABLE_CITY, $cityId);
	}

	/**
	 * Retrieve the number of rows returned by the criteria query.
	 * @method _getCount
	 * @param table {Array} Required. A collection of SQL from/join clauses.
	 * @param values {Array} Required. A collection SQL values to match in where clause.
	 * @param where {Array} Required. A collection SQL where clause.
	 * @param subcategory {String} Optional. Additional arguments.
	 * @return {Integer} The number of rows affected by the query.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getCount($tables, $values = array(), $wheres = array(), $subcategory = '') {
		$select = $subcategory ? str_replace('*', "DISTINCT $subcategory", $this->_DB_SELECT_COUNT) : $this->_DB_SELECT_COUNT;
		$rs =& $this->_select($tables, array($select), $values, $wheres);
		return ($rs->next()) ? $rs->getInt('count') : 0;
	}

	/**
	 * Returns the field of a DBO referenced by id; always returns a string.
	 * @method _getFieldById
	 * @param table {String} Required. The table to query.
	 * @param id {Integer} Required. A DB PK.
	 * @param field {String} Optional. The DBO field desired; default 'name' field.
	 * @return	{String} The string value of field at id.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getFieldById($table, $id, $field = 'name') {
		$rs =& $this->_select(array($table), array($field), array($id), array($this->_DB_WHERE_ID));
		$str = '';
		if ($rs->next()) {
			$str = $rs->getString($field);
			if (!$str) {
				$str = '';
			}
		}
		return $str;
	}

	/**
	 * Creates a Group model from database query results.
	 * @method _getGroupDBO
	 * @return Group {Group} A Group model from the DBO.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getGroupDBO($rs) {
		$S = new Group();
		$S->readResultSet($rs);
		return $S;
	}

	/**
	 * Constructs the appropriate limit string from the provided parameters.
	 * @method _getLimitFromParams
	 * @param params {Array} Required. The collection of filter parameters.
	 * @param defaultLimit {String} Optional. A replacement limit, if required.
	 * @return {Array} The query offset and limit,
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getLimitFromParams($params, $defaultLimit = '') {
		$pOffset = c('QUERY_KEY_OFFSET');
		$pLimit = c('QUERY_KEY_LIMIT');
		$offset = array_key_exists($pOffset, $params) && !is_empty($params[$pOffset]) ? $params[$pOffset] : 0;
		$limit = array_key_exists($pLimit, $params) && !is_empty($params[$pLimit]) ? $params[$pLimit] : $defaultLimit;
		$limit = -1 == $limit ? null : $limit;
		return array($offset, $limit);
	}

	/**
	 * Get the logger for this class.
	 * @method _getLog
	 * @return {Logger} The log writer object.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function &_getLog() {
		$logger =& Logger::getLogger('project.service.BaseManager');
		return $logger;
	}

	/**
	 * Creates a Message DBO from DB Result Set.
	 * @method _getMessageDBO
	 * @param rs {ResultSet} Required. SQL Result Set Object.
	 * @return Message {Message} A Message DBO.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getMessageDBO($rs) {
		$o = new Message($rs->getInt('id'));
		$o->setBody($rs->getString('body'));
		$o->setCreated($rs->getString('created'));
		$o->setSubject($rs->getString('subject'));
		$o->setThread($rs->getString('thread'));

		$mu1 = new MessageSearchable();
		$mu1->copySearchable($this->getSearchableById($rs->getInt('searchable_id')));
		$mu1->setIsSender($rs->getBoolean('is_sender'));
		$mu1->setStatus($rs->getString('status'));
		$mu1->setTimeDeleted($rs->getString('deleted'));
		$mu1->setTimeHidden($rs->getString('hidden'));
		$mu1->setTimeInvalid($rs->getString('invalid'));
		$mu1->setTimeRead($rs->getString('read'));
		$mu1->setTimeReplied($rs->getString('replied'));
		$mu1->setTimeUnread($rs->getString('unread'));

		$mu2 = new MessageSearchable();
		$mu2->copySearchable($this->getSearchableById($rs->getInt('searchable_id1')));
		$mu2->setIsSender($rs->getBoolean('is_sender1'));
		$mu2->setStatus($rs->getString('status1'));
		$mu2->setTimeDeleted($rs->getString('deleted1'));
		$mu2->setTimeHidden($rs->getString('hidden1'));
		$mu2->setTimeInvalid($rs->getString('invalid1'));
		$mu2->setTimeRead($rs->getString('read1'));
		$mu2->setTimeReplied($rs->getString('replied1'));
		$mu2->setTimeUnread($rs->getString('unread1'));

		$o->setRecipient($mu2->isSender() ? $mu1 : $mu2);
		$o->setSender($mu2->isSender() ? $mu2 : $mu1);

		return $o;
	}

	/**
	 * Creates a message board object from result set.
	 * @method _getMessageBoardDBO
	 * @param rs {ResultSet} Required. The result set containing user data.
	 * @return	{MessageBoard} A Message Board DBO.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getMessageBoardDBO($rs) {
		$o = new MessageBoard();
		$o->setBody($rs->getString('body'));
		$o->setCreated($rs->getString('created'));
		$o->setCreatorId($rs->getInt('creator_searchable_id'));
		$o->setId($rs->getInt('id'));
		$o->setModified($rs->getString('modified'));
		$o->setOriginalId($rs->getInt('original_id'));
		$o->setParentId($rs->getInt('parent_id'));
		$o->setSearchableId($rs->getInt('searchable_id'));
		$o->setStatus($rs->getString('status'));
		$o->setTitle($rs->getString('title'));
		return $o;
	}

	/**
	 * Determines an appropriate sortby string.
	 * @method getSortBy
	 * @param params {Array} Required. The collection of filter parameters.
	 * @param useRating {Boolean} Optional. True, when you want to use rating comparison; defaults to true.
	 * @return {String} The sortby string or empty string,
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getSortBy($params, $useRating = true) {
		$sb = array_key_exists(c('QUERY_KEY_SORT'), $params) ? $params[c('QUERY_KEY_SORT')] : '';
//		$ob = 'ORDER BY ';

//		switch (strtolower($sb)) {
//			case 'rasc':
//				$ob .= '`profile`.`rating` ASC, `profile`.`modified` DESC';
//		    break;
//
//			case 'rdesc':
//				$ob .= '`profile`.`rating` DESC, `profile`.`modified` DESC';
//		    break;
//
//			case 'tasc':
//				$ob .= '`profile`.`modified` ASC, `profile`.`rating` DESC';
//		    break;
//
//			case 'tdesc':
//				$ob .= '`profile`.`modified` DESC, `profile`.`rating` DESC';
//		    break;
//
//			default:
//				$ob = $this->_DB_ORDERBY_PROFILE_DEFAULT;
//		    break;
//		}
//
//		return $useRating ? $ob : preg_replace('/,?\s*?`profile`\.`rating` (ASC|DESC),?/', '', $ob);
		return $sb;
	}

	/**
	 * Creates an array of Searchable search result data from the ResultSet.
	 * @method _getSearchableResultsDBO
	 * @param  $rs {ResultSet} Required. The result set containing user data.
	 * @return {Array} A collection of Searchable DBO.
	 * @access Protected
	 * @since  Release 1.0
	 */
	protected function _getSearchableResultsDBO($rs) {
		$objs = array();

		// assert that the next result is parsable
		while ($rs->next()) {
			switch ($rs->getString('type')) {
				case 'group':
					$o = $this->_getGroupDBO($rs);
					break;

				case 'network':
					$o = new Network();
					$o->readResultSet($rs);
					break;

				case 'user':
					$o = $this->_getUserDBO($rs);
					break;

				default:
					continue;
			}

			array_push($objs, $o);
		}

		$rs->close();
		return $objs;
	}

	/**
	 * Creates a User model from database query results.
	 * @method _getUserDBO
	 * @param rs {ResultSet} Required. A sql query result set; should contain a user.
	 * @return {User} A User object model representing the current authorized user.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getUserDBO($rs) {
		$S = new User();
		$S->readResultSet($rs);
		return $S;
	}

	/**
	 * Creates an array of User search result data from the ResultSet.
	 * @method _getUserResultsDBO
	 * @param rs {ResultSet} Required. The result set containing user data.
	 * @return {Array} A collection of User DBO.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getUserResultsDBO($rs) {
		$users = array();

		// assert that the next result is parsable
		while ($rs->next()) {
			$user =& $this->_getUserResultDBO($rs);
			$user->setIsSuperAdmin($rs->getBoolean('sadmin'));
			array_push($users, $user);
		}
		$rs->close();

		return $users;
	}

	/**
	 * Injects the user search result data from the ResultSet.
	 * @method _getUserResultDBO
	 * @param rs {ResultSet} Required. The result set containing user data.
	 * @return {User} A User object.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function &_getUserResultDBO($rs) {
		$user = $this->_getUserDBO($rs);
		return $user;
	}

	/**
	 * Execute a simple update for a field on a table and return the number of affected rows; not available to controllers, must be
	 *	 used by a child manager to force model/controller seperation.
	 * @method _insert
	 * @param table {String} Required. An SQL from clause.
	 * @param fields {Arrray} Required. A comma seperate list of table fields.
	 * @param values {Arrray} Required. A comma seperate list of field values; can have multiple values.
	 * @return {Integer} The last inserted ID; only use, when concurrency isn't an issue.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _insert($table, $fields = array()) {
		$conn =& $this->ds->getConnection();

		// retrieve arguments
		$numArgs = func_num_args();
		$args = func_get_args();

		// setup StringBuffer
		$sb = array();
		$values = array();

		// iterate on all possible MySQL value sets and append to the StringBuffer
		for ($i = 2; $i < $numArgs; $i += 1) {
			array_push($sb, '(' . implode(', ', array_fill(0, sizeof($fields), '?')) . ')');
			$values = array_merge($values, $args[$i]);
		}

		$stmt =& $conn->prepareStatement('INSERT INTO ' . $table . ' (`' . implode('`,`', $fields) . '`) VALUES ' . implode(',', $sb));
		$this->_setStatementValues($stmt, $values);

		if (!$stmt->executeUpdate()) {
			$this->_getLog()->warn('Last statement failed to insert.');
		}

		$stmt->close();
		$id = mysql_insert_id();
		return $id;
	}

	/**
	 * Reads the existing items from the DB that are in the unique list.
	 * @method _readExistingDictionaryItems
	 * @param column {String} Required. The table column; 'stem' or 'word'.
	 * @param uniqueList {Array} Required. A list of possible items to save.
	 * @param columntIdToMap {Array} Optional. A variable to map items to their DB PKs.
	 * @return {Array} A collection of items already in the DB.
	 * @private
	 */
	private function _readExistingDictionaryItems($column, $uniqueList, &$columnToIdMap = array()) {
		$existingList = array();
		$rs = $this->_select(array("`dictionary_$column`"), array('`id`', "`$column`"), array(implode(' ', $uniqueList)), array("MATCH (`$column`) AGAINST(?)"));
		while ($rs->next()) {
			$item = $rs->getString($column);
			array_push($existingList, $item);
			$columnToIdMap[$item] = $rs->getInt('id');
		}
		return $existingList;
	}

	/**
	 * Executes an SQL statement to rename a table column.
	 * @method _renameColumn
	 * @param table {String} Required. The table name to modify.
	 * @param oldName {String} Required. The old column name.
	 * @param newName {String} Required. The new column name.
	 * @param definition {String} Required. The column definition.
	 * @access Protected
	 * @since Release 1.0
	 */
	private function _renameColumn($table, $oldName, $newName, $definition) {
		$conn =& $this->ds->getConnection();
		$stmt =& $conn->prepareStatement("ALTER TABLE `$table` CHANGE `$oldName` `$newName` $definition");
		$stmt->executeQuery();
		$stmt->close();
	}

	/**
	 * Executes an SQL statement to rename a table.
	 * @method _renameTable
	 * @param oldName {String} Required. The old table name.
	 * @param newName {String} Required. The new table name.
	 * @access Protected
	 * @since Release 1.0
	 */
	private function _renameTable($oldName, $newName) {
		$conn =& $this->ds->getConnection();
		$stmt =& $conn->prepareStatement("RENAME TABLE `$oldName` TO `$newName`");
		$stmt->executeQuery();
		$stmt->close();
	}

	/**
	 * Performs an SQL select statement by joining the parameters.
	 * @method _select
	 * @param table {String|Array} Required. A collection of SQL from/join clauses.
	 * @param fields {String|Array} Required. A collection SQL fields to fetch.
	 * @param values {String|Array} Required. A collection SQL values to match in where clause.
	 * @param where {String|Array} Required. A collection SQL where clause.
	 * @param prestmt {String} Optional. An SQL pre statement (like 'DISTINCT').
	 * @param poststmt {String|String} Optional. A SQL post statement (like 'ORDER BY').
	 * @return {ResultSet} A collection of SQL results.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function &_select($tables = array(), $fields = '', $values = '', $wheres = '', $prestmt = '', $poststmt = '') {
		if (is_array($fields)) {
			$fields = implode(', ', $fields);
		}
		if (is_array($poststmt)) {
			$poststmt = implode(' ', $poststmt);
		}
		if (is_array($tables)) {
			$tables = implode(' ', $tables);
		}
		if (is_string($values)) {
			$values = empty($values) ? array() : array($values);
		}
		if (is_array($wheres)) {
			$wheres = empty($wheres) ? '' : implode(' AND ', $wheres);
		}
		if ($wheres) {
			$wheres = ' WHERE ' . $wheres;
		}
		$pstmt = "SELECT $prestmt " . $fields . ' FROM ' . $tables . $wheres . ' ' . $poststmt;
//		print "\n" . $pstmt . "\n";
		$conn =& $this->ds->getConnection();
		$stmt =& $conn->prepareStatement($pstmt);
		$this->_setStatementValues($stmt, $values);
		$rs = $stmt->executeQuery();
		$stmt->close();
		return $rs;
	}

	/**
	 * Wrapper to call the appropriate sql escape function to insert the value into the statment before querying the DB.
	 * @method _setStatementValues
	 * @param stmt {PreparedStatment} Required. A prepared SQL statement.
	 * @param values {Array} Required. A collection SQL values to match in where clause.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _setStatementValues(&$stmt, $values, $opt = 0) {
		$i = 1;
		foreach ($values as $v) {
			if (NULL === $v) {
				//				if ($opt) {dlog('null');}
				$stmt->setNULL($i, $v);
			}
			else if ('NOW()' === $v) {
				//				if ($opt) {dlog('NOW()');}
				$stmt->setDirectly($i, $v);
			}
			else if (is_string($v)) {
				//				if ($opt) {dlog('string');}
				$stmt->setString($i, $v);
			}
			else if (is_array($v)) {
				//				if ($opt) {dlog('array');}
				$stmt->setArray($i, $v);
			}
			else if (is_int($v)) {
				//				if ($opt) {dlog('int');}
				$stmt->setInt($i, $v);
			}
			else {
				//				if ($opt) {dlog('bool');}
				$stmt->setString($i, $v ? 'true' : 'false');
			}
			++$i;
		}
	}

	/**
	 * Updates the searchable type for queries.
	 * @method _setupSearchableType
	 * @param  array $wheres Required. An array of where statements.
	 * @param  array $values Required. An array of value statements.
	 * @param  string|array $type Required. A searchable types or an array of them.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	protected function _setupSearchableType(&$wheres, &$values, $type) {
		// empty strings, indicate that the default value should be used
		if ('' === $type) {
			$type = Searchable::$TYPE_USER;
		}

		// if type is null, then we don't check it
		if ($type) {
			if (is_array($type)) {
				array_push($wheres, str_replace('= ?', 'IN ("' . implode('","' . $type) . '")', Searchable::$SQL_WHERE_TYPE));
			}
			else {
				array_push($wheres, Searchable::$SQL_WHERE_TYPE);
				array_push($values, $type);
			}
		}
	}

	/**
	 * Updates the searchable status for queries.
	 * @method _setupSearchableStatus
	 * @param  array $wheres Required. An array of where statements.
	 * @param  array $values Required. An array of value statements.
	 * @param  string|array $status Required. A searchable status or an array of them.
	 * @param  string $tableName Optional. Override the `S` with a new table name.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	protected function _setupSearchableStatus(&$wheres, &$values, $status, $tableName = null) {
		// empty strings, indicate that the default value should be used
		if ('' === $status) {
			$status = Searchable::$STATUS_ACTIVE;
		}

		// if status is null, then we don't check it
		if ($status) {
			$tableName = str_replace('`', '', $tableName);
			$whereclaus = $tableName ? str_replace('`S`', '`' . $tableName . '`', Searchable::$SQL_WHERE_STATUS) : Searchable::$SQL_WHERE_STATUS;

			if (is_array($status)) {
				array_push($wheres, str_replace('= ?', 'IN ("' . implode('","', $status) . '")', $whereclaus));
			}
			else {
				array_push($wheres, $whereclaus);
				array_push($values, $status);
			}
		}
	}

	/**
	 * Executes a SHOW COLUMN statement to find column information for a DB table.
	 * @method _showColumn
	 * @param tableName {String} Required. The name of the table.
	 * @param columnName {String} Required. The name of the column.
	 * @param value {String} Optional. The value to fetch from the column; otherwise will return whole description.
	 * @return {Integer} The number of affected rows; -1 when no rows affected.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _showColumn($tableName, $columnName, $value = '') {
		$conn =& $this->ds->getConnection();
		$stmt =& $conn->prepareStatement("SHOW COLUMNS FROM `$tableName` where `Field` = '$columnName'");
		$rs = $stmt->executeQuery();
		$stmt->close();

		if ($value && $rs->next()) {
			return $rs->getString($value);
		}

		return $rs;
	}

	/**
	 * Performs an SQL select statement.
	 * @method _sql
	 * @param query {String} Required. The SQL statement to execute.
	 * @return {ResultSet} A collection of SQL results.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function &_sql($query) {
		$conn =& $this->ds->getConnection();
		$stmt =& $conn->prepareStatement($query);
		$rs = $stmt->executeQuery();
		$stmt->close();
		return $rs;
	}

	/**
	 * Performs an SQL union statement by joining the selects.
	 * @method _union
	 * @param unions {Array} Required. A collection of SQL select statements.
	 * @return {ResultSet} A collection of SQL results.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function &_union($unions = array()) {
		$conn =& $this->ds->getConnection();
		$stmt =& $conn->prepareStatement(implode(' UNION ', $unions));
		$rs = $stmt->executeQuery();
		$stmt->close();
		return $rs;
	}

	/**
	 * Execute a simple update for a field on a table and return the number of affected rows.
	 * @method _update
	 * @param table {String} Required. An SQL from clause.
	 * @param fields {Array} Required. A collection SQL fields to fetch.
	 * @param values {Array} Required. A collection SQL values to set during update.
	 * @param wheres {String|Array} Optional. An SQL where clause.
	 * @return {Integer} The number of affected rows; -1 when no rows affected.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _update($table, $fields = array(), $values = array(), $wheres = '') {
		if (is_array($wheres)) {
			$wheres = empty($wheres) ? '' : implode(' ', $wheres);
		}
		if ($wheres) {
			$wheres = ' WHERE ' . $wheres;
		}
		$conn =& $this->ds->getConnection();
		$stmt =& $conn->prepareStatement('UPDATE ' . $table . ' SET `' . implode('` = ? ,`', $fields) . '` = ? ' . $wheres);
//		dlog('UPDATE ' . $table . ' SET `' . implode('` = ? ,`', $fields) . '` = ? ' . $wheres);
		$this->_setStatementValues($stmt, $values);
		$n = $stmt->executeUpdate();
		$stmt->close();
		return $n;
	}

	/**
	 * Inserts new words and stems into the dictionary as necessary; returns a collection of words mapped to their IDs and frequency.
	 * @method _updateDictionary
	 * @param data {String} Required. A collection of space separated words.
	 * @return {Array} A map of words to their data.
	 * @private
	 */
	private function _updateDictionary($data) {
		$dataDivided = strtolower(preg_replace('/(\W)+/i', '|', $data));
		$unfilteredWordArray = explode('|', $dataDivided);
		$filteredWordArray = array(); // words in DATA
		$uniqueWordArray = array(); // words in DATA
		$stemToWordMap = array();
		$wordToIdMap = array();
		$wordFrequencyMap = array();

		// iterate on the unfiltered words and filter them
		for ($i = 0, $j = sizeof($unfilteredWordArray); $i < $j; $i += 1) {
			$word = $unfilteredWordArray[$i];
			if (isAllowedShortWord($word)) {
				array_push($filteredWordArray, $word);
				if (!array_key_exists($word, $wordFrequencyMap)) {
					$wordFrequencyMap[$word] = 0;
				}
				$wordFrequencyMap[$word] += 1;
			}
		}

		$uniqueWordArray = array_unique($filteredWordArray);
		$stopWordArray = c('MYSQL_STOP_WORDS');
		$uniqueWordArray = array_diff($uniqueWordArray, $stopWordArray);

		// determine if the filtered words are already in the dictionary
		$existingWordArray = $this->_readExistingDictionaryItems('word', $uniqueWordArray, $wordToIdMap);

		// find new words to insert into the dictionary
		$newWordArray = $this->_createNewDictionaryItems('word', $uniqueWordArray, $existingWordArray);

		// there are new words to insert
		if (0 < sizeof($newWordArray)) {
			$stemArray = array(); // stems in DATA

			// find the IDs of the new words just added to the dictionary
			$rs = $this->_select(array('`dictionary_word`'), array('`id`, `word`'), array(implode(' ', $newWordArray)), array('MATCH (`word`) AGAINST(?)'));
			while ($rs->next()) {
				$word = $rs->getString('word');
				$wordToIdMap[$word] = $rs->getInt('id');

				// create word stems
				if (4 < strlen($word)) {
					$stems = $this->_createWordStems($word);
					$stemArray = array_merge($stemArray, $stems);

					foreach ($stems as $stem) {
						$stemToWordMap[$stem] = $word;
					}
				}
			}

			$uniqueStemArray = array_unique($stemArray);

			// determine if the filtered words are already in the dictionary
			$existingStemArray = $this->_readExistingDictionaryItems('stem', $uniqueStemArray);

			// find new words to insert into the dictionary
			$newStemArray = $this->_createNewDictionaryItems('stem', $uniqueStemArray, $existingStemArray);

			// there are new stems to insert
			if (0 < sizeof($newStemArray)) {
				$insertParams = array('`dictionary_stem_word`', array('stem_id', 'word_id'));

				// find the IDs of the new stems just added to the dictionary
				$rs = $this->_select(array('`dictionary_stem`'), array('`id`, `stem`'), array(implode(' ', $newStemArray)), array('MATCH (`stem`) AGAINST(?)'));
				while ($rs->next()) {
					$stem = $rs->getString('stem');
					$word = $stemToWordMap[$stem];
					$wordId = $wordToIdMap[$word];
					array_push($insertParams, array($rs->getInt('id'), $wordId));
				}

				if (2 < sizeof($insertParams)) {
					call_user_func_array(array($this, '_insert'), $insertParams); // link the stems to the words
				}
			}
		}

//		$sb = array();
//		foreach ($wordToIdMap as $word => $v) {
//			array_push($sb, $v[0] . ' - ' . $word . ' - ' . $v[1]);
//		}
//		dlog(implode('|', $sb));

		return array($wordToIdMap, $wordFrequencyMap);
	}

	/**
	 * Method updates the table last modified time according to the where statement.
	 * @method _updateModified
	 * @param table {String} Required. An SQL from clause.
	 * @param id {Integer} Required. The DB PK value to be updated.
	 * @param where {String} Required. An SQL query where statement.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _updateModified($table, $id, $where) {
		$this->_update($table, array('modified'), array(getDatetime(time()), $id), $where);
	}
}

?>
