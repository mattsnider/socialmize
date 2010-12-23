<?php

import('project.model.ModelBase');

/**
 * Member.php is used to manage a contact model.
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
 * @package    PackageName
 * @author     Matt Snider <mattsniderppl@gmail.com>
 * @copyright  2007-2012 Matt Snider, LLC
 * @license    http://www.php.net/license/3_0.txt  PHP License 3.0
 * @version    CVS: $Id:$
 * @since      File available since Release 0.5
 */

class Member extends ModelBase {

	// ********************** Constructor Method ********************** //

	/**
	 * Instantiation function for a Member model.
	 * @method Member
     * @access Public
     * @since  Release 1.0
     * @constructor
	 */
	public function __construct($id=0) {
		parent::__construct($id);
	}


	// ********************** Rendering Methods ********************** //


	// ********************** Business Methods ********************** //


	// ********************** Simple Getter/Setter Methods ********************** //

	function setAdmin($isAdmin) {$this->_isAdmin = $isAdmin;}
	function getAdmin() {return $this->_isAdmin;}
	function isAdmin() {return $this->_isAdmin;}

	function setSuperAdmin($isSuperAdmin) {$this->_isSuperAdmin = $isSuperAdmin;}
	function getSuperAdmin() {return $this->_isSuperAdmin;}
	function isSuperAdmin() {return $this->_isSuperAdmin;}

	function setSearchableA($o) {$this->_searchableA = $o;}
	function getSearchableA() {return $this->_searchableA;}

	function setSearchableB($o) {$this->_searchableB = $o;}
	function getSearchableB() {return $this->_searchableB;}


	// ********************** Private Variables ********************** //

	/**
	 * The admin status.
     * @property $_isAdmin
     * @var {Boolean}
     * @since Release 1.0
     * @access Private
	 */
	var $_isAdmin = null;

	/**
	 * The super admin status.
     * @property $_isSuperAdmin
     * @var {Boolean}
     * @since Release 1.0
     * @access Private
	 */
	var $_isSuperAdmin = null;

	/**
	 * The acceptor user object.
     * @property _searchableA
     * @var {Searchable} A Searchable DBO.
     * @since Release 1.0
     * @access Private
	 */
	var $_searchableA = null;

	/**
	 * The acceptor user object.
     * @property _searchableB
     * @var {Searchable} A Searchable DBO.
     * @since Release 1.0
     * @access Private
	 */
	var $_searchableB = null;


	// ********************** Static Variables ********************** //

	/**
	 * The SQL statement to left join the `searchable_searchable` table.
     * @property SQL_LEFT_JOIN
     * @var {String} The `searchable_searchable` table left join statement.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_LEFT_JOIN_FOR_MEMBERS = 'LEFT JOIN `searchable_searchable` ON `searchable_searchable`.`searchableA_id` = `S`.`id`';
	public static $SQL_LEFT_JOIN_FOR_OWNERS = 'LEFT JOIN `searchable_searchable` ON `searchable_searchable`.`searchableB_id` = `S`.`id`';

	/**
	 * The SQL statement to select a Member.
     * @property SQL_SELECT
     * @var {String} The select for a Member.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_SELECT_A = '`searchable_searchable`.`searchableA_id`';
	public static $SQL_SELECT_B = '`searchable_searchable`.`searchableB_id`';

	public static $SQL_SELECT_ADMIN = '`searchable_searchable`.`admin`';
	public static $SQL_SELECT_SUPER_ADMIN = '`searchable_searchable`.`sadmin`';

	/**
	 * The SQL statement to find a Member.
     * @property SQL_SELECT
     * @var {String} The where statement for a Member.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_WHERE_A = '`searchable_searchable`.`searchableA_id` = ?';
	public static $SQL_WHERE_B = '`searchable_searchable`.`searchableB_id` = ?';

	/**
	 * The SQL statement to find a Member by its admin state.
     * @property SQL_SELECT
     * @var {String} The where statement for a Member.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_WHERE_ADMIN = '`searchable_searchable`.`admin` = ?';
	public static $SQL_WHERE_SUPER_ADMIN = '`searchable_searchable`.`sadmin` = ?';
	public static $SQL_WHERE_STATUS = '`searchable_searchable`.`status` = ?';

	/**
	 * The SQL statement to reference the `searchable_searchable` table.
     * @property SQL_TABLE
     * @var {String} The `searchable_searchable` table.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_TABLE = '`searchable_searchable`';

	/**
	 * Status code when users are not connected as contacts in any direction.
     * @property STATUS_NOT_CONNECTED
     * @var {Integer} Connection status code.
     * @since Release 1.0
	 * @access Public
     * @const
     * @static
	 */
	public static $STATUS_NOT_CONNECTED = 0;

	/**
	 * Status code when users are connected as contacts (both directions).
     * @property STATUS_CONNECTED
     * @var {Integer} Connection status code.
     * @since Release 1.0
	 * @access Public
     * @const
     * @static
	 */
	public static $STATUS_CONNECTED = 1;

	/**
	 * Status code when user A requests user B to connected as contacts (A to B direction only).
     * @property STATUS_CONNECTION_REQUESTED_AB
     * @var {Integer} Connection status code.
     * @since Release 1.0
	 * @access Public
     * @const
     * @static
     * @var STATUS_CONNECTION_REQUESTED_AB
     * @access public static
	 */
	public static $STATUS_CONNECTION_REQUESTED_AB = 2;

	/**
	 * Status code when user B requests user A to connected as contacts (B to A direction only)
     * @property STATUS_CONNECTION_REQUESTED_BC
     * @var {Integer} Connection status code.
     * @since Release 1.0
	 * @access Public
     * @const
     * @static
	 */
	public static $STATUS_CONNECTION_REQUESTED_BA = 3;


	// ********************** Static Methods ********************** //

    /**
     * Generates a simple member Member from two sIds.
     * @method createSimple
	 * @param  $iIdA {Number|Searchable} Required. The owner Searchable DB PK.
	 * @param  $iIdB {Number|Searchable} Required. The member Searchable DB PK.
	 * @param  $isAdmin {Boolean} Required. The admin state of relationship.
     * @return {Object} The new Member DTO.
     * @access Public
     * @since  Release 1.0
     */
	public static function createSimple($iIdA, $iIdB, $isAdmin=false) {
		$m = new Member();

		if (is_int($iIdA)) {
			$sA = new Searchable();
			$sA->setId($iIdA);
		}
		else {
			$sA = $iIdA;
		}

		if (is_int($iIdB)) {
			$sB = new Searchable();
			$sB->setId($iIdB);
		}
		else {
			$sB = $iIdB;
		}

		$m->setStatus(Searchable::$STATUS_ACTIVE);
		$m->setSearchableA($sA);
		$m->setSearchableB($sB);
		$m->setAdmin($isAdmin);
		return $m;
	}

    /**
     * Generates the creation SQL for this object.
     * @method generateCreateSQL
     * @return {Array} The SQL as an array.
     * @access Public
     * @since  Release 1.0
     */
	public static function generateCreateSQL(&$o) {
		$fields = array('created', 'modified', 'status', 'searchableA_id', 'searchableB_id');
		$values = array($o->getCreated(), $o->getModified(), $o->getStatus(), $o->getSearchableA()->getId(), $o->getSearchableB()->getId());

	    if (! is_empty($o->getAdmin())) {
			array_push($fields, 'admin');
			array_push($values, $o->getAdmin() ? 'true' : 'false');
	    }

	    if (! is_empty($o->getSuperAdmin())) {
			array_push($fields, 'sadmin');
			array_push($values, $o->getSuperAdmin() ? 'true' : 'false');
	    }

	    return array(Member::$SQL_TABLE,$fields,$values);
	}

	/**
	 * Compares the status code with code constants to determine if status code represents a connection.
	 * @method isContact
     * @property STATUS_ACTIVE
     * @param status {Integer} Connection status code.
	 * @return {Boolean}
     * @since Release 1.0
	 * @access Public
     * @const
     * @static
	 */
	public static function isContact($status) {
		return 1 === $status; /* note: code $STATUS_CONNECTED, couldn't get php to properly reference the Contact namespace from the Contact namespace -mes */
	}
	
}

?>