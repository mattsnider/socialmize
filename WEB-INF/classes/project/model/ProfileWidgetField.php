<?php

import('project.model.ModelBase');

/**
 * ProfileWidgetField.php is used to manage profile widget field models.
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
 * @since	  File available since Release 0.5
 */

class ProfileWidgetField extends ModelBase {


	// ********************** Constructor Methods ********************** //

	/**
	 * Instantiation function for a ProfileWidgetField model.
	 * @method ProfileWidgetField
	 * @param  number $id Optional. The DB PK.
	 * @param  ResultSet $rs Optional. The ResultSet to read store into `this` object.
	 * @access public
	 * @since  Release 1.0
	 * @constructor
	 */
	public function __construct($id = 0, $rs = null) {
		parent::__construct($id, $rs);
	}


	// ********************** Rendering Methods ********************** //

	public function getDisplayValue() {
		switch ($this->_type) {
			case ProfileWidgetField::$TYPE_BOOLEAN:
				return 'true' == $this->_value ? 'Yes' : 'No';

			case ProfileWidgetField::$TYPE_DATETIME:
				return convertDatetimeToDate($this->_value);

			case ProfileWidgetField::$TYPE_DATE_RANGE:
				$values = explode('||', $this->_value);
				$evalue = '1' === $values[2] ? 'the present' : convertDatetimeToDate($values[1]);
				return convertDatetimeToDate($values[0]) . ' to ' . $evalue;

			case ProfileWidgetField::$TYPE_IMAGE:
				return '<a href="/assets' . $this->_value . '"><img alt="' . $this->getName() . ' image" class="imageType" src="/assets' . $this->_value . '"/></a>';

			case ProfileWidgetField::$TYPE_SELECT:
				if ('year' == $this->getName()) {
					return $this->_value;
				}
				else {
					$values = c($this->getName());
					return inject_anchor_tags($values[$this->_value]);
				}

			case ProfileWidgetField::$TYPE_LIST:
			case ProfileWidgetField::$TYPE_TEXT_AREA:
				return inject_anchor_tags(str_replace("\n", '<br/>', $this->_value));

			default:
				return inject_anchor_tags($this->_value);
		}
	}


	// ********************** Business Methods ********************** //

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
			str_replace(' AS `PWF`', '', ProfileWidgetField::$SQL_TABLE), // p1 is the table
			array('created', 'data_table', 'default_value', 'modified', 'label', 'maxlength', 'name', 'order', 'profile_widget_id', 'status', 'type'), // p2 fields array
			array($o->__sCreated, $o->_dataTable, $o->getDefaultValue(), $o->__sCreated, $o->_label, $o->_maxlength, $o->_name, $o->_order, $o->_profileWidgetId, $o->_status, $o->_type) // p3 values array
		);
	}

	/**
	 * Generates the update SQL for this object.
	 * @method generateUpdateSQL
	 * @param $o {Searchable} Required. The searchable to create.
	 * @return {Array} The SQL as an array.
	 * @access Public
	 * @since Release 1.0
	 */
	public static function generateUpdateSQL(&$o) {
		$o->_modified = getDatetime(time());
		return array(
			str_replace(' AS `PWF`', '', ProfileWidgetField::$SQL_TABLE), // p1 is the table
			array('data_table', 'default_value', 'modified', 'label', 'maxlength', 'name', 'order', 'private', 'required', 'status'), // p2 fields array
			array($o->_dataTable, $o->getDefaultValue(), $o->_modified, $o->_label, $o->_maxlength, $o->_name, $o->_order,
				  $o->_isPrivate, $o->_isRequired, $o->_status, $o->_id), // p3 values array
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
		$this->_dataTable = $rs->getString('data_table');
		$this->_defaultValue = $rs->getString('default_value');
		$this->_ikey = $rs->getInt('ikey');
		$this->_isPrivate = $rs->getBoolean('private');
		$this->_isRequired = $rs->getBoolean('required');
		$this->_label = $rs->getString('label');
		$this->_maxlength = $rs->getInt('maxlength');
		$this->_name = $rs->getString('name');
		$this->_order = $rs->getString('order');
		$this->_profileWidgetId = $rs->getInt('profile_widget_id');
		$this->_updateSearchable = $rs->getBoolean('update_searchable');
		$this->_type = $rs->getString('type');
	}

	/**
	 * Updates the data table, as defined by the type. Requires that type and name be set on this object.
	 * @method updateDataTable
	 * @access Public
	 * @since Release 1.0
	 */
	public function updateDataTable() {
		if (!($this->_type || $this->_name)) {
			return;
		}

		switch ($this->_type) {
			case ProfileWidgetField::$TYPE_TEXT_AREA:
			case ProfileWidgetField::$TYPE_LIST:
				$this->_dataTable = ProfileWidgetField::$TYPE_TEXT_AREA;
				$this->_maxlength = 65535;
				break;

			case ProfileWidgetField::$TYPE_TEXT:
			case ProfileWidgetField::$TYPE_PORTRAIT:
			case ProfileWidgetField::$TYPE_IMAGE:
				$this->_dataTable = ProfileWidgetField::$TYPE_TEXT;
				break;

			case ProfileWidgetField::$TYPE_AUTOCOMPLETE:
			case ProfileWidgetField::$TYPE_SELECT:
				$this->_dataTable = ProfileWidgetField::$TYPE_SELECT;
				break;

			case ProfileWidgetField::$TYPE_BOOLEAN:
			case ProfileWidgetField::$TYPE_DATETIME:
			case ProfileWidgetField::$TYPE_DATE_RANGE:
				$this->_dataTable = $this->_type;
				break;

			default:
				break;
		}
	}

	/**
	 * Determines if this profile widget field requires a foreign key.
	 * @method usesForeignKey
	 * @return {Boolean} Required. True, when this field has foreign key.
	 * @access Public
	 * @since Release 1.0
	 */
	public function usesForeignKey() {
		return ProfileWidgetField::$TYPE_AUTOCOMPLETE == $this->_type || ProfileWidgetField::$TYPE_SELECT == $this->_type;
	}


	// ********************** Common Methods ********************** //

	/**
	 * Copy the desirable profile widget field values into 'this'.
	 * @method copyProfileWidgetField
	 * @param $pwf {ProfileWidgetField} Required. The object to copy.
	 * @access Public
	 * @since Release 1.0
	 */
	public function copyProfileWidgetField($pwf) {
		$this->setCreated($pwf->getCreated());
		$this->setDataTable($pwf->getDataTable());
		$this->setId($pwf->getId());
		$this->setIsPrivate($pwf->getIsPrivate());
		$this->setIsRequired($pwf->getIsRequired());
		$this->setKey($pwf->getKey());
		$this->setLabel($pwf->getLabel());
		$this->setModified($pwf->getModified());
		$this->setMaxlength($pwf->getMaxlength());
		$this->setName($pwf->getName());
		$this->setProfileWidgetId($pwf->getProfileWidgetId());
		$this->setStatus($pwf->getStatus());
		$this->setType($pwf->getType());
		$this->setUpdateSearchable($pwf->getUpdateSearchable());
		$this->setValue($pwf->getValue());
	}


	// ********************** Simple Getter/Setter Methods ********************** //

	public function setDataTable($s) { $this->_dataTable = $s; }

	public function getDataTable() { return $this->_dataTable; }

	public function getForeignTable() { return $this->_dataTable; }

	public function setDefaultValue($defaultValue) { $this->_defaultValue = $defaultValue; }

	public function getDefaultValue() { return $this->_defaultValue; }

	public function setIsPrivate($isPrivate) { $this->_isPrivate = $isPrivate; }

	public function getIsPrivate() { return $this->_isPrivate; }

	public function isPrivate() { return $this->_isPrivate; }

	public function setIsRequired($isRequired) { $this->_isRequired = $isRequired; }

	public function getIsRequired() { return $this->_isRequired; }

	public function isRequired() { return $this->_isRequired; }

	public function getKey() { return $this->_ikey; }

	public function setKey($s) { $this->_ikey = $s; }

	public function setLabel($s) { $this->_label = $s; }

	public function getLabel() { return $this->_label; }

	public function setMaxlength($n) { $this->_maxlength = $n; }

	public function getMaxlength() { return $this->_maxlength; }

	public function setName($s) { $this->_name = $s; }

	public function getName() { return $this->_name; }

	public function setOrder($n) { $this->_order = $n; }

	public function getOrder() { return $this->_order; }

	public function setProfileWidgetId($n) { $this->_profileWidgetId = $n; }

	public function getProfileWidgetId() { return $this->_profileWidgetId; }

	public function setType($s) { $this->_type = $s; }

	public function getType() { return $this->_type; }

	public function setUpdateSearchable($s) { $this->_updateSearchable = $s; }

	public function getUpdateSearchable() { return $this->_updateSearchable; }

	public function isUpdateSearchable() { return $this->_updateSearchable; }

	public function setValue($s) { $this->_value = $s; }

	public function getValue() { return $this->_value; }

	public function getShowOnProfile() {
		return $this->_value && !$this->_isPrivate;
	}


	// ********************** Private Variables ********************** //

	/**
	 * The name of the field database.
	 * @name _dataTable
	 * @var {String}
	 * @access private
	 */
	var $_dataTable = '';

	/**
	 * The default value of the field.
	 * @name $_defaultValue
	 * @var {String}
	 * @access private
	 */
	var $_defaultValue = '';

	/**
	 * The hashkey used to identify the Searchable.
	 * @name _ikey
	 * @var {String} Some random characters.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_ikey = '';

	/**
	 * This field is only visible to site admins.
	 * @name $_isPrivate
	 * @var {Boolean}
	 * @access private
	 */
	var $_isPrivate = false;

	/**
	 * This field must be completed.
	 * @name $_isRequired
	 * @var {Boolean}
	 * @access private
	 */
	var $_isRequired = false;

	/**
	 * The name of the field label.
	 * @name _label
	 * @var {String}
	 * @access private
	 */
	var $_label = '';

	/**
	 * The maximum length of the field.
	 * @name _maxlength
	 * @var {Integer}
	 * @access private
	 */
	var $_maxlength = 64;

	/**
	 * The name of the profile_widget_field.
	 * @name _name
	 * @var {String}
	 * @access private
	 */
	var $_name = '';

	/**
	 * The order of this profile_widget_field.
	 * @name _order
	 * @var {Integer}
	 * @access private
	 */
	var $_order = 0;

	/**
	 * The DB PK of owning profile widget.
	 * @name _profileWidgetId
	 * @var {Integer}
	 * @access private
	 */
	var $_profileWidgetId = 0;

	/**
	 * The type of field.
	 * @name _type
	 * @var {String}
	 * @access private
	 */
	var $_type = '';

	/**
	 * The toggle to control whether or not to update the searchable with this value.
	 * @name _updateSearchable
	 * @var {Boolean}
	 * @access private
	 */
	var $_updateSearchable = false;

	/**
	 * The value of field.
	 * @name _value
	 * @var {String}
	 * @access private
	 */
	var $_value = '';


	// ********************** Static Variables ********************** //

	/**
	 * The SQL statement to select a profile_widget_field.
	 * @property SQL_SELECT
	 * @var {String} The select for a profile_widget_field.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $SQL_SELECT = '`PWF`.`created`, `PWF`.`data_table`, `PWF`.`default_value`, `PWF`.`id`, `PWF`.`label`, `PWF`.`modified`,
	`PWF`.`maxlength`, `PWF`.`name`, `PWF`.`order`, `PWF`.`private`, `PWF`.`profile_widget_id`, `PWF`.`required`, `PWF`.`status`, `PWF`.`type`, `PWF`.`update_searchable`';

	/**
	 * The SQL statement to reference the profile_widget_field table.
	 * @property SQL_TABLE
	 * @var {String} The profile_widget_field table.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $SQL_TABLE = '`profile_widget_field` AS `PWF`';

	/**
	 * The SQL statement to reference the profile_widget_field_select_values table.
	 * @property $SQL_TABLE_SELECT_VALUES
	 * @var {String} The profile_widget_field_select_values table.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $SQL_TABLE_SELECT_VALUES = '`profile_widget_field_select_values`';

	/**
	 * The SQL statement to order the profile_widget_field table.
	 * @property SQL_ORDERBY_DEFAULT
	 * @var {String} The profile_widget_field table.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $SQL_ORDERBY_DEFAULT = 'ORDER BY `PWF`.`order`';

	/**
	 * A autocomplete type of profile widget fields.
	 * @property $TYPE_AUTOCOMPLETE
	 * @var {String} A profile_widget_field type.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $TYPE_AUTOCOMPLETE = 'autocomplete';

	/**
	 * The boolean type of profile widget fields.
	 * @property $TYPE_BOOLEAN
	 * @var {String} A profile_widget_field type.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $TYPE_BOOLEAN = 'boolean';

	/**
	 * A date type of profile widget fields.
	 * @property TYPE_DATETIME
	 * @var {String} A profile_widget_field type.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $TYPE_DATETIME = 'datetime';

	/**
	 * A date range type of profile widget fields.
	 * @property TYPE_DATE_RANGE
	 * @var {String} A profile_widget_field type.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $TYPE_DATE_RANGE = 'daterange';

	/**
	 * An image type of profile widget fields.
	 * @property $TYPE_IMAGE
	 * @var {String} A profile_widget_field type.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $TYPE_IMAGE = 'image';

	/**
	 * A list type of profile widget fields.
	 * @property TYPE_LIST
	 * @var {String} A profile_widget_field type.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $TYPE_LIST = 'list';

	/**
	 * A portrait type of profile widget fields.
	 * @property TYPE_PORTRAIT
	 * @var {String} A profile_widget_field type.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $TYPE_PORTRAIT = 'portrait';

	/**
	 * A select type of profile widget fields.
	 * @property TYPE_SELECT
	 * @var {String} A profile_widget_field type.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $TYPE_SELECT = 'select';

	/**
	 * A text type of profile widget fields.
	 * @property TYPE_TEXT
	 * @var {String} A profile_widget_field type.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $TYPE_TEXT = 'text';

	/**
	 * A text are type of profile widget fields.
	 * @property TYPE_TEXT_AREA
	 * @var {String} A profile_widget_field type.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $TYPE_TEXT_AREA = 'textarea';


	// ********************** Static Methods ********************** //

	/**
	 * Retrieves the available types.
	 * @method getTypes
	 * @return {Array} A collection of types.
	 * @access Public
	 * @since Release 1.0
	 * @static
	 */
	public static function getTypes() {
		return array(ProfileWidgetField::$TYPE_AUTOCOMPLETE, ProfileWidgetField::$TYPE_DATETIME, ProfileWidgetField::$TYPE_BOOLEAN,
					 ProfileWidgetField::$TYPE_DATE_RANGE, ProfileWidgetField::$TYPE_IMAGE, ProfileWidgetField::$TYPE_LIST,
					 ProfileWidgetField::$TYPE_PORTRAIT, ProfileWidgetField::$TYPE_SELECT, ProfileWidgetField::$TYPE_TEXT,
					 ProfileWidgetField::$TYPE_TEXT_AREA);
	}

	/**
	 * Evaulates if the provided type is valid.
	 * @method isValidType
	 * @param type {String} Required. Value to test.
	 * @return {Boolean} The type is valid.
	 * @access Public
	 * @since Release 1.0
	 * @static
	 */
	public static function isValidType($type) {
		switch ($type) {
			case ProfileWidgetField::$TYPE_AUTOCOMPLETE:
			case ProfileWidgetField::$TYPE_BOOLEAN:
			case ProfileWidgetField::$TYPE_DATETIME:
			case ProfileWidgetField::$TYPE_DATE_RANGE:
			case ProfileWidgetField::$TYPE_IMAGE:
			case ProfileWidgetField::$TYPE_LIST:
			case ProfileWidgetField::$TYPE_PORTRAIT:
			case ProfileWidgetField::$TYPE_SELECT:
			case ProfileWidgetField::$TYPE_TEXT:
			case ProfileWidgetField::$TYPE_TEXT_AREA:
				return true;

			default:
				return false;
		}
	}
}

?>