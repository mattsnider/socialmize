<?php

import('project.model.ModelBase');

/**
 * Notification.php is used to manage Notification model.
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
 * @since      File available since release 1.0
 */

class Notification extends ModelBase {
	

	// ********************** Constructor Methods ********************** //

	/**
	 * Instantiation function for a Notification model.
	 * @method Notification
     * @access Public
     * @since  Release 1.0
     * @constructor
	 */
	public function __construct($id=0) {
		parent::__construct($id);
	}

	
	// ********************** Common Methods ********************** //

    /**
     * Copy the desirable Notification values into 'this'.
     * @method copyNotification
     * @param  $o {Notification} Required. The object to copy.
     * @access Public
     * @since  Release 1.0
     */
	public function copyNotification($o) {
	    $this->setCopy($o->getCopy());
	    $this->setCreated($o->getCreated());
	    $this->setModified($o->getModified());
	    $this->setId($o->getId());
	    $this->setStatus($o->getStatus());
		
	    $this->setRelatedId($o->getRelatedId());
	    $this->setSearchableById($o->getSearchableById());
	    $this->setSearchableToId($o->getSearchableToId());
	    $this->setType($o->getType());
	}


	// ********************** Simple Getter/Setter Methods ********************** //

	public function setCopy($copy) {$this->_copy = $copy;}
	public function getCopy() {return $this->_copy;}
	
	public function setRelatedId($id) {$this->_relatedId = $id;}
	public function getRelatedId() {return $this->_relatedId;}

	public function setSearchableById($searchableId) {$this->_searchableById = $searchableId;}
	public function getSearchableById() {return $this->_searchableById;}

	public function setSearchableToId($searchableId) {$this->_searchableToId = $searchableId;}
	public function getSearchableToId() {return $this->_searchableToId;}

	public function setType($type) {$this->_type = $type;}
	public function getType() {return $this->_type;}


	// ********************** Accessor Methods ********************** //

	public function setSearchableBy($searchable) {$this->_searchableBy = $searchable;}
	public function getSearchableBy() {return $this->_searchableBy;}

	public function setSearchableTo($searchable) {$this->_searchableTo = $searchable;}
	public function getSearchableTo() {return $this->_searchableTo;}
	
	// ********************** Business Methods ********************** //

    /**
     * Reads the result set, filling this object.
     * @method readResultSet
     * @param rs {ResultSet} Required. The result set to read.
     * @access Public
     * @since Release 1.0
     */
	public function readResultSet($rs) {
		parent::readResultSet($rs);
		$this->setCopy($rs->getString('copy'));
		$this->setRelatedId($rs->getString('related_id'));
		$this->setSearchableById($rs->getInt('searchable_by_id'));
		$this->setSearchableToId($rs->getInt('searchable_to_id'));
		$this->setType($rs->getString('type'));
	}


	// ********************** Private Variables ********************** //

	/**
	 * Related copy to render this notification.
	 * @name $_copy
     * @var {String}
     * @access Private
     * @since Release 1.0
	 */
	var $_copy = null;

	/**
	 * A related DB PK for this alert.
	 * @name $_relatedId
     * @var {Number}
     * @access Private
     * @since Release 1.0
	 */
	var $_relatedId = null;

	/**
	 * The Searchable Object DBO that sent this notification.
	 * @name $_searchableBy
     * @var {Object}
     * @access Private
     * @since Release 1.0
	 */
	var $_searchableBy = null;

	/**
	 * The Searchable Object DB PK that sent this notification.
	 * @name $_searchableById
     * @var {Number}
     * @access Private
     * @since Release 1.0
	 */
	var $_searchableById = null;

	/**
	 * The Searchable Object DBO that received this notification.
	 * @name $_searchableTo
     * @var {Object}
     * @access Private
     * @since Release 1.0
	 */
	var $_searchableTo = null;

	/**
	 * The Searchable Object DB PK that received this notification.
	 * @name $_searchableToId
     * @var {Number}
     * @access Private
     * @since Release 1.0
	 */
	var $_searchableToId = null;

	/**
	 * The type of this notification.
	 * @name $_type
     * @var {String}
     * @access Private
     * @since Release 1.0
	 */
	var $_type = null;


	// ********************** Static Functions ********************** //

    /**
     * Generates the creation SQL for this object.
     * @method generateCreateSQL
	 * @param $o {Searchable} Required. The Notification to create.
     * @return {Array} The SQL as an array.
     * @access Public
     * @since Release 1.0
	 * @static
     */
	public static function generateCreateSQL($o) {
	    return array(
	        Notification::$SQL_TABLE,
	        array('copy', 'created', 'modified', 'related_id', 'searchable_by_id', 'searchable_to_id', 'status', 'type'),
	        array($o->_copy, $o->__sCreated, $o->_modified, $o->_relatedId, $o->_searchableById, $o->_searchableToId, $o->_status, $o->_type)
	    );
	}


	// ********************** Static Variables ********************** //

	/**
	 * The SQL statement to select a Notification.
     * @property SQL_SELECT
     * @var {String} The select for a Notification.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_SELECT = '`notification`.`copy`, `notification`.`created`, `notification`.`id`, `notification`.`modified`,
		`notification`.`related_id`, `notification`.`searchable_by_id`, `notification`.`searchable_to_id`, `notification`.`status`, `notification`.`type`';

	/**
	 * The SQL statement to reference the `notification` table.
     * @property SQL_TABLE
     * @var {String} The `notification` table.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_TABLE = '`notification`';

	/**
	 * The SQL statement to find a Notification.
     * @property SQL_SELECT
     * @var {String} The where statement for a Notification.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_WHERE = '`notification`.`searchable_to_id` = ? AND `notification`.`status`="active"';

	/**
	 * The available Notification types.
     * @property $TYPES
     * @var {Array}
     * @access Public
     * @since Release 1.0
     * @static
	 */
	public static $TYPES = array('member','message','news');
}

def('NotificationTypeMember', 'member');
def('NotificationTypeMessage', 'message');
def('NotificationTypeNews', 'news');