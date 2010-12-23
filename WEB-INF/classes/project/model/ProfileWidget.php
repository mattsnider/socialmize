<?php

import('project.model.ModelBase');

/**
 * ProfileWidget.php is used to manage profile widget models.
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

class ProfileWidget extends ModelBase {

	// ********************** Constructor Methods ********************** //

	/**
	 * Instantiation function for a ProfileWidget model.
	 * @method ProfileWidget
     * @access Public
     * @since  Release 1.0
     * @constructor
	 */
	public function __construct($id=0) {
		parent::__construct($id);
	}


	// ********************** Business Methods ********************** //

	public function addField($field) {
	    array_push($this->_fields, $field);
	}

	public function getFields() {
	    return $this->_fields;
	}

    /**
     * Returns the number of fields to be used as a divisor; ensures that this number is never ZERO.
     * @method getFieldCountDivisor
     * @return {Integer} The Profile Widget Field count.
     * @public
     */
	public function getFieldCountDivisor() {
        return 0 < $this->_fieldn ? $this->_fieldn : 1;
    }

	public function setFields($fields) {
	    $this->_fields = $fields;
	}

	public function isNetwork() {return bit_has($this->_searchableTypeBit, ProfileWidget::$BITMASK_NETWORK);}
	public function getIsNetwork() {return $this->isNetwork();}

	public function isGroup() {return bit_has($this->_searchableTypeBit, ProfileWidget::$BITMASK_GROUP);}
	public function getIsGroup() {return $this->isGroup();}

	public function isUser() {return bit_has($this->_searchableTypeBit, ProfileWidget::$BITMASK_USER);}
	public function getIsUser() {return $this->isUser();}

    /**
     * Generates the creation SQL for this object.
     * @method generateCreateSQL
	 * @param $o {Searchable} Required. The searchable to create.
     * @return {Array} The SQL as an array.
     * @access Public
     * @since Release 1.0
     */
	public static function generateCreateSQL($o) {
	    return array(
	        str_replace(' AS `PW`', '', ProfileWidget::$SQL_TABLE), // p1 is the table
	        array('created', 'fieldn', 'modified', 'multi', 'name', 'name_tab', 'order', 'searchable_type_bit'), // p2 fields array
	        array($o->__sCreated, $o->_fieldn, $o->__sCreated, boolean_get($o->_isMulti), $o->_name, $o->_nameTab, $o->_order, $o->_searchableTypeBit) // p3 values array
	    );
	}

    /**
     * Generates the update SQL for this object.
     * @method generateUpdateSQL
	 * @param $o {Searchable} Required. The searchable to update.
     * @return {Array} The SQL as an array.
     * @access Public
     * @since Release 1.0
     */
	public static function generateUpdateSQL(&$o) {
	    $o->_modified = getDatetime(time());
	    return array(
	        str_replace(' AS `PW`', '', ProfileWidget::$SQL_TABLE), // p1 is the table
	        array('fieldn', 'modified', 'multi', 'name', 'name_tab', 'order', 'searchable_type_bit', 'status'), // p2 fields array
	        array($o->_fieldn, $o->_modified, boolean_get($o->_isMulti), $o->_name, $o->_nameTab, $o->_order, $o->_searchableTypeBit, $o->_status, $o->_id), // p3 values array
	        '`id` = ?' // p4 where string
	    );
	}

    /**
     * Reads the result set, filling this object.
     * @method readResultSet
     * @param rs {ResultSet} Required. The result set to read.
     * @access Public
     * @since Release 1.0
     */
	public function readResultSet($rs) {
		parent::readResultSet($rs);
		$this->_fieldn = $rs->getInt('fieldn');
		$this->_isMulti =  $rs->getBoolean('multi');
		$this->_name = $rs->getString('name');
		$this->_nameTab = $rs->getString('name_tab');
		$this->_nameTask = strtolower(str_replace(' ', '', $this->_nameTab));
		$this->_order = $rs->getInt('order');
		$this->_searchableTypeBit = $rs->getInt('searchable_type_bit');
	}


	// ********************** Common Methods ********************** //

    /**
     * Copy the desirable profile widget values into 'this'.
     * @method copySearchable
     * @param PW {ProfileWidget} Required. The object to copy.
     * @access Public
     * @since Release 1.0
     */
	public function copyProfileWidget($PW) {
	    $this->setCreated($PW->getCreated());
	    $this->setFieldCount($PW->getFieldCount());
	    $this->setId($PW->getId());
	    $this->setIsMulti($PW->getIsMulti());
	    $this->setModified($PW->getModified());
	    $this->setName($PW->getName());
	    $this->setNameTab($PW->getNameTab());
	    $this->setNameTask($PW->getNameTask());
	    $this->setOrder($PW->getOrder());
	}


	// ********************** Simple Getter/Setter Methods ********************** //

	public function setFieldCount($n) {$this->_fieldn = $n;}
	public function getFieldCount() {return $this->_fieldn;}

	public function setIsMulti($b) {$this->_isMulti = $b;}
	public function getIsMulti() {return $this->_isMulti;}
	public function isMulti() {return $this->_isMulti;}

	public function setName($s) {$this->_name = $s;}
	public function getName() {return $this->_name;}

	public function setNameTab($s) {$this->_nameTab = $s;}
	public function getNameTab() {return $this->_nameTab;}

	public function setNameTask($s) {$this->_nameTask = $s;}
	public function getNameTask() {return $this->_nameTask;}
	public function getTask() {return $this->_nameTask;}

	public function setOrder($n) {$this->_order = $n;}
	public function getOrder() {return $this->_order;}

	public function setSearchableTypeBit($n) {$this->_searchableTypeBit = $n;}
	public function getSearchableTypeBit() {return $this->_searchableTypeBit;}


	// ********************** Private Variables ********************** //

	/**
	 * The number of fields in this widget.
	 * @name _fiendn
     * @var {Integer}
     * @access private
	 */
	var $_fieldn = 0;

	/**
	 * The collection of fields in this widget.
	 * @name _fiends
     * @var {Array}
     * @access private
	 */
	var $_fields = array();

	/**
	 * The profile_widget_field are repeatable.
	 * @name _isMulti
     * @var {Integer}
     * @access private
	 */
	var $_isMulti = 0;

	/**
	 * The name of the profile_widget.
	 * @name _name
     * @var {String}
     * @access private
	 */
	var $_name = '';

	/**
	 * The name of the profile_widget tab.
	 * @name _nameTab
     * @var {String}
     * @access private
	 */
	var $_nameTab = '';

	/**
	 * The name of the profile_widget task.
	 * @name _nameTask
     * @var {String}
     * @access private
	 */
	var $_nameTask = '';

	/**
	 * The order of this profile_widget.
	 * @name _order
     * @var {Integer}
     * @access private
	 */
	var $_order = 0;

	/**
	 * The type of searchable supported by this profile_widget.
	 * @name _searchableTypeBit
     * @var {Integer}
     * @access private
	 */
	var $_searchableTypeBit = 0;


	// ********************** Static Variables ********************** //


	/**
	 * The SQL statement to select a profile_widget.
     * @property SQL_SELECT
     * @var {String} The select for a profile_widget.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_SELECT = '`PW`.`created`, `PW`.`fieldn`, `PW`.`id`, `PW`.`modified`, `PW`.`multi`, `PW`.`name`, `PW`.`name_tab`, `PW`.`order`, `PW`.`searchable_type_bit`, `PW`.`status`';

	/**
	 * The SQL statement to reference the profile_widget table.
     * @property SQL_TABLE
     * @var {String} The profile_widget table.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_TABLE = '`profile_widget` AS `PW`';

	/**
	 * The SQL statement to order the profile_widget table.
     * @property SQL_ORDERBY_DEFAULT
     * @var {String} The profile_widget table.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_ORDERBY_DEFAULT = 'ORDER BY `PW`.`order`';

	/**
	 * The bitmask for the user searchable type.
     * @property BITMASK_USER
     * @var {Integer} The bitmaks value.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $BITMASK_USER = 1;

	/**
	 * The bitmask for the group searchable type.
     * @property BITMASK_GROUP
     * @var {Integer} The bitmaks value.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $BITMASK_GROUP = 2;

	/**
	 * The bitmask for the network searchable type.
     * @property $BITMASK_NETWORK
     * @var {Integer} The bitmaks value.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $BITMASK_NETWORK = 4;


	// ********************** Static Functions ********************** //

	public static function getSearchableTypeBitmask($type) {
		$types = is_array($type) ? $type : array($type);
		$bit = 0;

		foreach ($types as $type) {
			switch ($type) {
				case Searchable::$TYPE_GROUP:
					bit_add($bit, ProfileWidget::$BITMASK_GROUP);
				break;

				case Searchable::$TYPE_NETWORK:
					bit_add($bit, ProfileWidget::$BITMASK_NETWORK);
				break;

				case Searchable::$TYPE_USER:
					bit_add($bit, ProfileWidget::$BITMASK_USER);
				break;
			}
		}
	
        return $bit;
	}

	public static function getSearchableTypeBitByTypes($types) {
	    $val = 0;

	    foreach ($types as $type) {
	        switch ($type) {
	            case Searchable::$TYPE_GROUP:
	                $val += ProfileWidget::$BITMASK_GROUP;
	            break;

	            case Searchable::$TYPE_NETWORK:
	                $val += ProfileWidget::$BITMASK_NETWORK;
	            break;

	            case Searchable::$TYPE_USER:
	                $val += ProfileWidget::$BITMASK_USER;
	            break;
	        }
	    }

	    return $val;
	}

}

?>