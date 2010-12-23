<?php

import('project.model.Searchable');

/**
 * User.php is used to manage user model.
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
 * @category   CategoryName
 * @package	PackageName
 * @author	 Matt Snider <mattsniderppl@gmail.com>
 * @copyright  2007-2012 Matt Snider, LLC
 * @license	http://www.php.net/license/3_0.txt  PHP License 3.0
 * @version	CVS: $Id:$
 * @since	  File available since release 0.5
 */

class User extends Searchable {


	// ********************** Constructor Methods ********************** //

	/**
	 * Instantiation function for a User model.
	 * @method User
	 * @param  fl {Boolean} Optional. True, when creating a new Network; defaults to false.
	 * @access Public
	 * @since  Release 1.0
	 * @constructor
	 */
	public function __construct($fl = false) {
		parent::__construct(Searchable::$TYPE_USER);
		$this->_lastLogin = getDatetime(time());
		if ($fl) {
			$this->_key = getInsertKey();
		}
		$this->_uriImage = c('defaultUserImageUri');
		$this->_uriThumb = c('defaultUserThumbUri');
	}


	// ********************** Rendering Methods ********************** //

	public function getLastLoginDisplay() {
		return $this->getTimeDisplay($this->_lastLogin);
	}


	// ********************** Business Methods ********************** //


	/**
	 * Return the number of Groups associated with the User
	 *
	 * @method getGroupn
	 * @return {int} number of Groups
	 * @access public
	 * @since release 1.0
	 */
	public function getGroupn() {
		return $this->_groupn;
	}


	/**
	 * Return the colletion of Group DBOs associated with the User
	 *
	 * @method getGroups
	 * @return {Array} a collection of Groups DBOs
	 * @access public
	 * @since release 1.0
	 */
	public function getGroups() {
		return $this->_groups;
	}


	/**
	 * Return the number of Messages associated with the User
	 *
	 * @method getMessagen
	 * @return {int} number of Messages
	 * @access public
	 * @since release 1.0
	 */
	public function getMessagen() {
		return $this->_messagen;
	}


	/**
	 * Returns the list of Message DBOs
	 *
	 * @method getMessages
	 * @return {Array} collection of Message DBOs
	 * @access public
	 * @since release 1.0
	 */
	public function getMessages() {
		return $this->_messages;
	}


	/**
	 * Attach the collection of Group DBOs and the number of Groups associated with the User
	 *
	 * @method setGroups
	 * @param {Array} a list of Groups
	 * @param {int} number of Groups
	 * @access public
	 * @since release 1.0
	 */
	public function setGroups($a, $n) {
		$this->_groups = $a;
		$this->_groupn = $n;
	}


	/**
	 * Attaches the list of Message DBOs and the number of Messages associated with the User
	 *
	 * @method setGroups
	 * @param a {Array} collection of Message DBOs
	 * @param n {int} the total number of messages
	 * @access public
	 * @since release 1.0
	 */
	public function setMessages($a, $n) {
		$this->_messages = $a;
		$this->_messagen = $n;
	}

	/**
	 * Generates the creation SQL for this object.
	 * @method generateCreateSQL
	 * @param $o {Searchable} Required. The searchable to create.
	 * @return {Array} The SQL as an array.
	 * @access Public
	 * @since Release 1.0
	 */
	public static function generateCreateSQL($o) {
		// todo: fill this out
	}


	/**
	 * Returns true if the User has any SearchAlerts
	 * @method hasSearchAlerts
	 * @return {boolean} true, when SearchAlerts are available
	 * @access public
	 * @since release 1.0
	 */
	public function hasSearchAlerts() { return 0 < sizeof($this->_searchAlerts); }

	public function getHasSearchAlerts() { return $this->hasSearchAlerts(); }

	/**
	 * Reads the result set, filling this object.
	 * @method readResultSet
	 * @param rs {ResultSet} Required. The result set to read.
	 * @access Public
	 * @since Release 1.0
	 */
	public function readResultSet($rs) {
		parent::readResultSet($rs);
		$this->setIsSiteAdmin($rs->getBoolean('isAdmin'));
		$this->setLastLogin($rs->getString('last_login'));
		$this->setLoginCount($rs->getInt('login_count'));
		$this->setTerms($rs->getBoolean('terms'));
	}


	// ********************** Common Methods ********************** //

	/**
	 * Prints a human readable string of member variables
	 *
	 * @method toString
	 * @return {string} string representation of object where members are key/value pairs
	 * @access public
	 * @since release 1.0
	 */
	public function toString() {
		return parent::toString() . '&lastLogin=' . $this->_lastLogin . '&loginCount=' . $this->_loginCount . '&terms=' . $this->_terms;
	}


	// ********************** Simple Getter/Setter Methods ********************** //

	public function setLastLogin($lastLogin) { $this->_lastLogin = $lastLogin; }

	public function getLastLogin() { return $this->_lastLogin; }

	public function setLoginCount($n) { $this->_loginCount = $n; }

	public function getLoginCount() { return $this->_loginCount; }

	public function setPassword($s) { $this->_password = $s; }

	public function getPassword() { return $this->_password; }

	public function setRegistrationTask($oRegistrationTask) { $this->_oRegistrationTask = $oRegistrationTask; }

	public function getRegistrationTask() { return $this->_oRegistrationTask; }

	public function setTerms($b) { $this->_terms = $b; }

	public function getTerms() { return $this->_terms; }

	public function setWasAdmin($b) { $this->_wasAdmin = $b; }

	public function getWasAdmin() { return $this->_wasAdmin; }

	public function getIsSiteAdmin() { return $this->_isSiteAdmin; }

	public function isSiteAdmin() { return $this->_isSiteAdmin; }

	public function setIsSiteAdmin($isSiteAdmin) { $this->_isSiteAdmin = $isSiteAdmin; }


	// ********************** Private Variables ********************** //

	/**
	 * The Groups associated with the User
	 *
	 * @var Array of Group
	 * @access private
	 */
	var $_groups = array();


	/**
	 * The number of Groups associated with the User
	 *
	 * @var int
	 * @access private
	 */
	var $_groupn = 0;

	/**
	 * The provided Searchable is a site administrator.
	 * @name _isSiteAdmin
	 * @var {Boolean} True, when site administrator.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_isSiteAdmin = false;

	/**
	 * The last time this user logged in
	 *
	 * @var datetime
	 * @access private
	 */
	var $_lastLogin = '0000-00-00 00:00:00';


	/**
	 * The number of times the user logged in
	 *
	 * @var int
	 * @access private
	 */
	var $_loginCount = 0;


	/**
	 * The number of messages a user has.
	 * @var Integer
	 * @access private
	 */
	var $_messagen = 0;


	/**
	 * A collection of Message DBO for the User
	 * @var array
	 * @access private
	 */
	var $_messages = array();


	/**
	 * User md5 password
	 *
	 * @var string
	 * @access private
	 */
	var $_password = '';


	/**
	 * The next registration task for the user; when falsy, user is completely registered.
	 * @var RegistrationTask
	 * @access private
	 */
	var $_oRegistrationTask = '';


	/**
	 * A collection of SearchAlerts for User
	 *
	 * @var string
	 * @access private
	 */
	var $_searchAlerts = array();


	/**
	 * A boolean value that indicates the current User is a super admin.
	 *
	 * @var boolean
	 * @access private
	 */
	var $_superAdmin = false;


	/**
	 * True when the user has accepted Terms of Service
	 *
	 * @var boolean
	 * @access private
	 */
	var $_terms = false;


	/**
	 * A boolean value that indicates the current User used to be an admin, used for resetting User
	 *
	 * @var boolean
	 * @access private
	 */
	var $_wasAdmin = false;


	// ********************** Static Variables ********************** //

	/**
	 * The SQL statement to left join the `user` table.
	 * @property SQL_LEFT_JOIN
	 * @var {String} The `user` table left join statement.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $SQL_LEFT_JOIN = 'LEFT JOIN `user` ON `user`.`searchable_id` = `S`.`id`';

	/**
	 * The SQL statement to select a User.
	 * @property SQL_SELECT
	 * @var {String} The select for a User.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $SQL_SELECT = '`user`.`last_login`, `user`.`login_count`, `user`.`searchable_id`, `user`.`terms`';

	/**
	 * The SQL statement to reference the `user` table.
	 * @property SQL_TABLE
	 * @var {String} The `user` table.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $SQL_TABLE = '`user`';
}

?>