<?php

/**
 * UserManager.php is used to query the database to User model related data.
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
 * @since      Release 1.0
 */
 
import('project.service.BaseManager');
import('project.model.User');
import('project.model.Message');
import('project.model.Member');

/**
 * @package project.service
 * @author Matt Snider
 *
 */
class UserManager extends BaseManager {


	// Join clauses

	var $_DB_JOIN_GROUP_USER = ' LEFT JOIN `group_user` ON `group_user`.`group_id` = `group`.`id`';

	var $_DB_JOIN_MESSAGE_SEARCHABLE = 'LEFT JOIN `message_searchable` AS `MS` ON `MS`.`message_id` = `M`.`id`';
	var $_DB_JOIN_MESSAGE_SEARCHABLE_MESSAGE_USER = 'LEFT JOIN `message_searchable` AS `MS2` ON `MS2`.`message_id` = `MS`.`message_id` AND `MS2`.`is_sender` <> `MS`.`is_sender`';

	var $_DB_JOIN_SEARCHABLE_COMPANY_GEOCITY = 'LEFT JOIN `city` ON `city`.`id` = `searchable_company`.`city_id`';
	var $_DB_JOIN_SEARCHABLE_COMPANY_POSITION = 'LEFT JOIN `position` ON `position`.`id` = `searchable_company`.`position_id`';
	
	var $_DB_JOIN_USER = 'LEFT JOIN `user` ON `S`.`id` = `user`.`searchable_id`';


	// Select clauses

	var $_DB_SELECT_MESSAGE_AND_USERS = '`MS`.`deleted`, `MS`.`hidden`, `MS`.`invalid`, `MS`.`is_sender`, `MS`.`message_id`, `MS`.`read`,
										 `MS`.`replied`, `MS`.`status`, `MS`.`unread`, `MS`.`searchable_id`';


	// Table clauses

	var $_DB_TABLE_CONTACT = '`contact`';

	var $_DB_TABLE_MESSAGE = '`message` AS `M`';
	var $_DB_TABLE_MESSAGE_SEARCHABLE = '`message_searchable`';
	
	var $_DB_TABLE_SEARCHABLE_COMPANY = '`searchable_company`';


	// Where clauses

	var $_DB_CONTACT_WHERE = '`contact`.`usera_id` = ? AND `contact`.`status` = 1';
	var $_DB_CONTACT_WHERE_NEW = '`contact`.`userb_id` = ? AND `contact`.`status` = 0';
	var $_DB_WHERE_MESSAGE = '`M`.`id` IN (SELECT `message_id` FROM `message_searchable` WHERE `user_id` = ? AND `is_sender`=?) AND `MS`.`user_id` <> ?';
	var $_DB_WHERE_MESSAGE_THREAD = '`M`.`thread` = ?';
	var $_DB_USERA_ID_EQUALS = 'usera_id=?';
	var $_DB_USERB_ID_EQUALS = 'userb_id=?';
	var $_DB_WHERE_STATUS_VALID = '`status` != "invalid" AND `status` != "deleted"';

	var $_DB_USER_EMAIL_LIKE = '`S`.`email` LIKE ?';
	var $_DB_USER_NAME_LIKE = '`S`.`name` LIKE ?';
	var $_DB_WHERE_USER_ID = '`user_id`=?';
	var $_DB_WHERE_USER_ACTIVE = '`S`.`status` = "active"';

	var $_DB_WHERE_KEY = '`key`=?';


	/** ========================== Public Functions ========================== */

	/**
	 * Creates a database entry represented by the User DBO.
	 *
	 * @method createUser
	 * @param o {User} Required. A User DBO.
	 * @access Public
	 * @since Release 1.0
	 */
	public function createUser(&$o) {
	    $this->createSearchable($o);
	    $this->updateSearchableField($o->getId(), 'uri_image', '/images/searchables/blank_user.gif');
	    $this->updateSearchableField($o->getId(), 'uri_thumb', '/images/thumbs/blank_user_thumb.gif');
		$this->_insert($this->_DB_TABLE_USER, array('password', 'searchable_id'), array($o->getPassword(), $o->getId()));
	}

	/**
	 * Updates the user password, then returns the user.
	 * @method generateNewPassword
	 * @param email {String} Required. The user email.
	 * @return {String} The user readable password.
	 * @public
	 */
	public function generateNewPassword($email) {
		$user = $this->getUserByEmail($email);
		$pass = substr(md5(time()), 0, 8);
		$mpass = md5($pass);
		$user->setPassword($mpass);
		$this->_update(Searchable::$SQL_TABLE . ' ' . User::$SQL_LEFT_JOIN, array('password'), array($mpass, $email), '`email`=?');
		return $pass;
	}


	/**
	 * Retrieve a single Message DBO.
	 *
	 * @method getMessageById
	 * @param messageId {Integer} Required. The DB PK of Message.
	 * @param sId {Integer} Required. The DB PK of User.
	 * @return {Message} A Message DBO.
     * @access Public
     * @since Release 1.0
	 */
	public function getMessageById($messageId, $sId) {
		// sanity check
		if ($messageId) {
			$joinUser = str_replace('`searchable_id`', '`MS2`.`searchable_id`', $this->_DB_JOIN_SEARCHABLE);

			$tables = array($this->_DB_TABLE_MESSAGE, $this->_DB_JOIN_MESSAGE_SEARCHABLE, $this->_DB_JOIN_MESSAGE_SEARCHABLE_MESSAGE_USER, $joinUser);
			$wheres = array('`M`.`id`=?', '((`MS`.`is_sender`="true" AND `MS`.`searchable_id`=?) || (`MS2`.`is_sender`="false" AND `MS2`.`searchable_id`=?))', $this->_DB_WHERE_USER_ACTIVE);
			$values = array($messageId, $sId, $sId);

			$mu2 = preg_replace('/`MS`.`(.*?)`/u', '`MS2`.`$1` AS `${1}1`', $this->_DB_SELECT_MESSAGE_AND_USERS);

			$rs =& $this->_select($tables, array('`M`.*', $this->_DB_SELECT_MESSAGE_AND_USERS, $mu2), $values, $wheres);

			// ensure a result was fetched
			if ($rs->next()) {
				return $this->_getMessageDBO($rs);
			}

			$rs->close();
		}

		return null;
	}


	/**
	 * Retrieve the collection of Message DBOs for User; limit by sender/recipient and status.
	 *
	 * @method getMessageCount
	 * @param sId {Integer} Required. The DB PK of User.
	 * @param isSender {Boolean} Required. Sender or recipient; defaults to inbox.
	 * @param status {Integer} Optional. The desired message status; the default is 'valid'.
	 * @return {Integer} Number of messages matching criteria.
     * @access Public
     * @since Release 1.0
	 */
	public function getMessageCount($sId, $isSender=false, $status=null) {
		$joinUser = str_replace('`searchable_id`', '`MS2`.`searchable_id`', $this->_DB_JOIN_SEARCHABLE);

		$tables = array($this->_DB_TABLE_MESSAGE, $this->_DB_JOIN_MESSAGE_SEARCHABLE, $this->_DB_JOIN_MESSAGE_SEARCHABLE_MESSAGE_USER, $joinUser);
		$wheres = array('((`MS`.`is_sender`=? AND `MS`.`searchable_id`=?) || (`MS2`.`is_sender`=? AND `MS2`.`searchable_id`<>?))',
						'(`MS`.`searchable_id`=? OR `MS2`.`searchable_id`=?)',
						str_replace('`status`', "`MS`.`status`", $this->_DB_WHERE_STATUS_VALID), $this->_DB_WHERE_USER_ACTIVE);
		$values = array($isSender, $sId,  ($isSender ? 'false' : 'true') /* php was not typecasting to TRUE to evaluate to is_bool */, $sId, $sId, $sId);

//		$mu2 = preg_replace('/`MS`.`(.*?)`/u', '`MS2`.`$1` AS `${1}1`', $this->_DB_SELECT_MESSAGE_AND_USERS);

		if ($status) {
			$wheres[2] = '`MS`.`status` = ?';
			array_push($values, $status);
		}

		return $this->_getCount($tables, $values, $wheres);
	}


	/**
	 * Fetch the status of a message from the DB.
	 *
	 * @method getMessageStatus
	 * @param mId {Integer} Required. The DB PK of Message.
	 * @param sId {Integer} Required. The DB PK of User.
	 * @return {Integer} Number of messages matching criteria.
     * @access Public
     * @since Release 1.0
	 */
	public function getMessageStatus($mId, $sId) {
		$rs = $this->_select(array($this->_DB_TABLE_MESSAGE_SEARCHABLE), array('`status`'),
		                     array($mId, $sId), array('`message_id` = ? AND `searchable_id` = ?'));

		if ($rs->next()) {
			return $rs->getString('status');
		}

		return Message::$STATUS_UNREAD;
	}


	/**
	 * Retrieve the collection of Message DBOs for User.
	 *
	 * @method getMessages
	 * @param sId {Integer} Required. The DB PK of User.
	 * @param isSender {Boolean} Required. Sender or recipient; defaults to inbox.
	 * @param status {Integer} Optional. The desired message status. The default is 'valid'.
	 * @param free {String} Optional. Free-form query that will be injected into where; defaults to empty string.
	 * @param limit {Integer} Optional. Number of results to limit query by; defaults to 0, which is not limit.
	 * @return {Array} A collection of Message DBOs.
     * @access Public
     * @since Release 1.0
	 */
	public function getMessages($sId, $isSender=false, $status=null, $free='', $limit=0) {
		$joinUser = str_replace('`searchable_id`', '`MS2`.`searchable_id`', $this->_DB_JOIN_SEARCHABLE);

		$tables = array($this->_DB_TABLE_MESSAGE, $this->_DB_JOIN_MESSAGE_SEARCHABLE, $this->_DB_JOIN_MESSAGE_SEARCHABLE_MESSAGE_USER, $joinUser);
		$wheres = array('((`MS`.`is_sender`=? AND `MS`.`searchable_id`=?) || (`MS2`.`is_sender`=? AND `MS2`.`searchable_id`<>?))',
						'(`MS`.`searchable_id`=? OR `MS2`.`searchable_id`=?)',
						str_replace('`status`', "`MS`.`status`", $this->_DB_WHERE_STATUS_VALID), $this->_DB_WHERE_USER_ACTIVE);
		$values = array($isSender, $sId, ($isSender ? 'false' : 'true') /* php was not typecasting to TRUE to evaluate to is_bool */, $sId, $sId, $sId);

		$mu2 = preg_replace('/`MS`.`(.*?)`/u', '`MS2`.`$1` AS `${1}1`', $this->_DB_SELECT_MESSAGE_AND_USERS);

//		$wheres = array($this->_DB_WHERE_MESSAGE, , $this->_DB_WHERE_USER_ACTIVE);
		$other = array($this->_DB_ORDERBY_CREATED);

		if ($status) {
			$wheres[2] = '`MS`.`status` = ?';
			array_push($values, $status);
		}

		// inject a limit
		if ($limit) {
			array_push($other, 'LIMIT ' . $limit);
		}

		// inject free-form where clause
		if ($free) {
			array_push($wheres, $free);
		}

		$rs =& $this->_select($tables, array('`M`.*', $this->_DB_SELECT_MESSAGE_AND_USERS, $mu2), $values, $wheres, '', $other);

		$messages = array();

		// iterate on all matching rows and create Message objects
		while ($rs->next()) {
			$m = $this->_getMessageDBO($rs);
			array_push($messages, $m);
		}

		$rs->close();

		return $messages;
	}


	/**
	 * Returns all the messages in the thread, with the current message as the first one.
	 *
	 * @method getMessagesByThread
	 * @param sId {Integer} Required. The DB PK of User.
	 * @param isSender {Boolean} Required. Sender or recipient; defaults to inbox.
	 * @param thread {String} Required. The thead to search by.
	 * @param created {String} Optional. The created by date of newest message to return; default ignores this restriction.
	 * @return {Array} A collection of Message DBOs matching criteria.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getMessagesByThread($sId, $isSender, $thread, $created=null) {
		$where = str_replace('?', '"' . $thread . '"', $this->_DB_WHERE_MESSAGE_THREAD);

		if ($created) {
			$where .= ' AND `M`.`created` <= TIMESTAMP("' . $created . '")';
		}

		return $this->getMessages($sId, $isSender, null, $where);
	}


	/**
	 * Test user for existance by their email.
	 *
	 * @method getUserByEmail
	 * @param email {String} Required. The suspect email.
	 * @return {User} A User DBO or null.
	 * @access Public
	 * @since Relase 1.0
	 */
	public function getUserByEmail($email) {
		$user = null;

		$rs =& $this->_select(array($this->_DB_TABLE_SEARCHABLE, $this->_DB_JOIN_USER), $this->_DB_SELECT_USER, array($email), array('`email`=?'), '', array('LIMIT 1'));

		if ($rs->next()) {
			$user = $this->_getUserDBO($rs);
			$rs->close();
		}

		return $user;
	}

	/**
	 * Get a user by email and password for logging a user in.
	 * @method getUserByNameAndPassword
	 * @param  string $name Required. The username to search for.
	 * @param  string $pass Required. The password to search for.
	 * @return User A user DBO or null.
	 * @since  version 1.0
	 * @access public
	 */
	public function getUserByNameAndPassword($name, $pass) {
		$user = null;

		$rs = $this->_select(array(Searchable::$SQL_TABLE, User::$SQL_LEFT_JOIN), $this->_DB_SELECT_USER, array($name, md5($pass)), array('`name`=? AND `password`=?'), '', array('LIMIT 1'));

		if ($rs->next()) {
			$user = $this->_getUserDBO($rs);
			$rs->close();
		}

		return $user;
	}

	/**
	 * Get a user by email and password for logging a user in.
	 * @method getUserByEmailAndPassword
	 * @param  string $email Required. The email to search for.
	 * @param  string $pass Required. The password to search for.
	 * @return User A user DBO or null.
	 * @since  version 1.0
	 * @access public
	 */
	public function getUserByEmailAndPassword($email, $pass) {
		$user = null;

		$rs = $this->_select(array(Searchable::$SQL_TABLE, User::$SQL_LEFT_JOIN), $this->_DB_SELECT_USER, array($email, md5($pass)), array('`email`=? AND `password`=?'), '', array('LIMIT 1'));

		if ($rs->next()) {
			$user = $this->_getUserDBO($rs);
			$rs->close();
		}

		return $user;
	}


	/**
	 * Retrieve the User DBO for mathcing username.
	 *
	 * @method getUsersByExactName
	 * @param name {String} Required. The name of the User.
	 * @return {User} User DBO for username.
     * @access Public
     * @since Release 1.0
	 */
	public function getUsersByExactName($name, $requireActive=true)
	{
		$values = array($name);
		$wheres = array($this->_DB_WHERE_NAME);

		if ($requireActive)
		{
			array_push($values, Searchable::$STATUS_ACTIVE);
			array_push($wheres, '`status`=?');
		}
		
		$rs = $this->_select(array($this->_DB_TABLE_SEARCHABLE, User::$SQL_LEFT_JOIN), $this->_DB_SELECT_USER, $values, $wheres);

		// assert that the next result is parsable
		if ($rs->next()) {$user = $this->_getUserDBO($rs);}
		else {$user = ref(null);}
		$rs->close();

		return $user;
	}

	/**
	 * Test if a user exists by their email.
	 * @method hasUserEmail
	 * @param email {String} Required. A suspect email.
	 * @return {Boolean} The user exists.
	 * @public
	 */
	public function hasUserEmail($email) {
		return $this->_getCount(array($this->_DB_TABLE_SEARCHABLE), array($email), array('`email`=?'));
	}

	/**
	 * Evaluate if the email already exists.
	 * @method isEmailAvailable
	 * @param  string $email Required. The email to evaluate.
	 * @return boolean The username is not in the DB.
	 * @since  version 1.0
	 * @access public
	 */
	public function isEmailAvailable($email) {
		return 0 === $this->_getCount(array(Searchable::$SQL_TABLE), array($email, Searchable::$STATUS_ACTIVE), array('`email`=? AND `status`=?'));
	}

	/**
	 * Evaluate if the name already exists.
	 * @method isNameAvailable
	 * @param  string $name Required. The name to evaluate.
	 * @return boolean The username is not in the DB.
	 * @since  version 1.0
	 * @access public
	 */
	public function isNameAvailable($name) {
		return 0 === $this->_getCount(array(Searchable::$SQL_TABLE), array($name, Searchable::$STATUS_ACTIVE), array('`name`=? AND `status`=?'));
	}

	/**
	 * Saves many messages at onces.
	 * @method saveMessageBatch
	 * @param  $m {Message} Required. The message to save.
	 * @param  $users {Array} Required. The collection of users to send the message to. Users are not allowed to message themselves.
     * @access Public
     * @since  Release 1.0
	 */
	public function saveMessageBatch(&$m, $users) {
		// ensure there are users and the message is saved
		if (sizeof($users)) {
			if ($this->_saveMessageDBO($m)) {
				$messageId = $m->getId();

				$params = array($this->_DB_TABLE_MESSAGE_SEARCHABLE, array('is_sender', 'message_id', 'searchable_id'), array('true', $messageId, $m->getSender()->getId()));
				$i = sizeof($params);

				// iterate on each user and create an insert statement
				foreach ($users as $o) {
				    if (c('ADMIN_ID') !== $o->getId()) {
                        $params[$i] = array('false', $messageId, $o->getId());
                        $i += 1;
				    }
				}

				call_user_func_array(array(&$this, "_insert"), $params);
			}
			else {
				$this->_getLog()->error('Message was not able to save to the DB: ' + $m->toString());
			}
		}
		else {
			$this->_getLog()->warn('No users passed into saveMessageBatch, message dropped: ' + $m->toString());
		}
	}


	/**
	 * Update the message status and handle important event time logging.
	 *
	 * @method updateMessageStatus
	 * @param messageId {Integer} Required. The DB PK of message.
	 * @param sId {Integer} Required. The DB PK of User.
	 * @param status {String} Optional. The message status; defaults to 'unread'.
     * @access Public
     * @since Release 1.0
	 */
	public function updateMessageStatus($messageId, $sId, $status='unread') {
		$time = getDatetime(time());

		// create the update value statements
		$set = array($status, 'status');
		$values = array($time, $status, $messageId, $sId);

		// update this users status to message
		$this->_update($this->_DB_TABLE_MESSAGE_SEARCHABLE, $set, $values, '`message_id`=? AND `searchable_id`=?');
	}

	/**
	 * Updates a field of a User, safer than updating the whole user.
	 * @method updateUserField
	 * @param sId {Integer} Required. The DB PK of User.
	 * @param field {String} Required. The field to update.
	 * @param value {String} Required. The field value.
	 * @access Public
	 * @since Release 1.0
	 */
	public function updateUserField($sId, $field, $value) {
		$this->_update($this->_DB_TABLE_USER, array($field), array($value, $sId), $this->_DB_WHERE_SEARCHABLE_ID);
		$this->_update($this->_DB_TABLE_SEARCHABLE, array('modified'), array(getDatetime(time()), $sId), $this->_DB_WHERE_ID);
	}


	/** ========================== Protected Functions ========================== */


	/**
	 * Saves a new message into the database and updates the DBO with the message ID when possible; otherwise throws an error.
	 *
	 * @method _saveMessageDBO
	 * @param o {Message} Required. A Message DBO.
     * @access Private
     * @since Release 1.0
	 */
	private function _saveMessageDBO(&$o) {
		// insert the message into the database
		$id = $this->_insert(str_replace(' AS `M`', '', $this->_DB_TABLE_MESSAGE), array('body', 'created', 'subject', 'thread'),
					   array($o->getBody(), $o->getCreated(), $o->getSubject(), $o->getThread()) );
		$o->setId($id);
		return $id;
	}
}

?>