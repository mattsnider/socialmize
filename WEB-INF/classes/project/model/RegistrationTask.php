<?php

import('project.model.ModelBase');

/**
 * Created by IDEA.
 * User: mattsniderppl
 * Date: Jul 31, 2010
 * Time: 4:52:20 PM
 * Steps for adding a new RegistrationTask:
 *	 Add a row in the DataTable to `registration_task`
 *	 Insert read/write URLs into struts-config.xml
 *  Write read controller (into project/action/module/registrationTask)
 *	 Write view
 *  Write write controller (into project/action/module/registrationTask)
 *  Add any CSS, JavaScript, or Images into their respective module directory
 */
class RegistrationTask extends ModelBase {


	// ********************** Constructor Methods ********************** //

	/**
	 * Constructor for a RegistrationTask model.
	 * @method RegistrationTask
	 * @param  number $id Optional. The DB PK.
	 * @param  ResultSet $rs Optional. The ResultSet to read store into `this` object.
	 * @access public
	 * @since  Version 1.0
	 * @constructor
	 */
	public function __construct($id = 0, $rs = null) {
		parent::__construct($id, $rs);
	}


	// ********************** Common Methods ********************** //

	/**
	 * Copy the provided object into 'this'.
	 * @method copyFrom
	 * @param  RegistrationTask $o Required. The object to copy.
	 * @access public
	 * @since  Version 1.0
	 */
	public function copyFrom($o) {
		parent::copyFrom($o);
		if (!$o instanceof RegistrationTask) {
			throw_exception(new IllegalArgumentException("$o is not an instance of RegistrationTask"));
		}

		$this->setDescription($o->getDescription());
		$this->setUri($o->getUri());
		$this->setPriority($o->getPriority());
		$this->setType($o->getType());
	}


	// ********************** Simple Getter/Setter Methods ********************** //

	public function setDescription($sDescription) { $this->_sDescription = $sDescription; }

	public function getDescription() { return $this->_sDescription; }

	public function isEnabled() { return Searchable::$STATUS_ACTIVE == $this->_status; }

	public function setName($sName) { $this->_sName = $sName; }

	public function getName() { return $this->_sName; }

	public function setPriority($iPriority) { $this->_iPriority = $iPriority; }

	public function getPriority() { return $this->_iPriority; }

	public function setType($sType) { $this->_sType = $sType; }

	public function getType() { return $this->_sType; }

	public function setUri($sUri) { $this->_sUri = $sUri; }

	public function getUri() { return $this->_sUri; }


	// ********************** Business Methods ********************** //

	/**
	 * Generates the creation SQL for this object.
	 * @method generateCreateSQL
	 * @param  RegistrationTask $o Required. The searchable to create.
	 * @return {Array} The SQL as an array.
	 * @access Public
	 * @since Release 1.0
	 */
	public static function generateCreateSQL($o) {
		return array(
			str_replace(' AS `REGT`', '', RegistrationTask::$SQL_TABLE), // p1 is the table
			array('created', 'description', 'modified', 'name', 'priority', 'status', 'type'), // p2 fields array
			array($o->__sCreated, $o->_sDescription, $o->__sCreated, $o->_sName, $o->_iPriority, $o->_status, $o->_sType) // p3 values array
		);
	}

	/**
	 * Generates the update SQL for this object.
	 * @method generateUpdateSQL
	 * @param  RegistrationTask $o Required. The searchable to update.
	 * @return {Array} The SQL as an array.
	 * @access Public
	 * @since Release 1.0
	 */
	public static function generateUpdateSQL(&$o) {
		$o->_modified = getDatetime(time());
		return array(
			str_replace(' AS `REGT`', '', RegistrationTask::$SQL_TABLE), // p1 is the table
			array('description', 'modified', 'name', 'priority', 'status', 'type'), // p2 fields array
			array($o->_sDescription, $o->__sCreated, $o->_sName, $o->_iPriority, $o->_status, $o->_sType, $o->_id), // p3 values array
			'`id` = ?' // p4 where string
		);
	}

	/**
	 * Reads the result set, filling this object.
	 * @method readResultSet
	 * @param  ResultSet $rs Required. The result set to read.
	 * @return void
	 * @access Public
	 * @since  Version 1.0
	 */
	public function readResultSet($rs) {
		parent::readResultSet($rs);
		$this->setDescription($rs->getString('description'));
		$this->setName($rs->getString('name'));
		$this->setPriority($rs->getInt('priority'));
		$this->setType($rs->getString('type'));
		$this->setUri('registration_view_' . $rs->getString('type'));
	}


	// ********************** Static Variables ********************** //

	/**
	 * The SQL statement to select a RegistrationTask.
	 * @since Version 1.0
	 * @var string
	 * @access public
	 * @final
	 * @static
	 */
	public static $SQL_SELECT = '`REGT`.*';

	/**
	 * The SQL statement to reference the `registration_task` table.
	 * @since Version 1.0
	 * @var string
	 * @access public
	 * @final
	 * @static
	 */
	public static $SQL_TABLE = '`registration_task` AS `REGT`';

	/**
	 * A RegistrationTask type for business task `Terms of Service`.
	 * @since Version 1.0
	 * @var string
	 * @access public
	 * @final
	 * @static
	 */
	public static $TYPE_TERMS = 'tos';

	/**
	 * A RegistrationTask type for business task `required fields`.
	 * @since Version 1.0
	 * @var string
	 * @access public
	 * @final
	 * @static
	 */
	public static $TYPE_REQUIRED = 'required';

	/**
	 * A RegistrationTask type for business task `joining a network`.
	 * @since Version 1.0
	 * @var string
	 * @access public
	 * @final
	 * @static
	 */
	public static $TYPE_JOIN_NETWORK = 'join';

	/**
	 * A RegistrationTask type for business task `pay required fees`.
	 * @since Version 1.0
	 * @var string
	 * @access public
	 * @final
	 * @static
	 */
	public static $TYPE_PAYMENT = 'payment';


	// ********************** Private Variables ********************** //

	/**
	 * The URI to forward to for evaluation.
	 * @var string
	 * @access private
	 * @since Version 1.0
	 */
	var $_sUri = '';

	/**
	 * The type of registration task.
	 * @var string
	 * @access private
	 * @since Version 1.0
	 */
	var $_sType = '';

	/**
	 * The priority of registration task.
	 * @var int
	 * @access private
	 * @since Version 1.0
	 */
	var $_iPriority = 0;

	/**
	 * The name of registration task.
	 * @var string
	 * @access private
	 * @since Version 1.0
	 */
	var $_sName = '';

	/**
	 * The a description of the registration task.
	 * @var string
	 * @access private
	 * @since Version 1.0
	 */
	var $_sDescription = '';
}
