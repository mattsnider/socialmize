
<?php

import('project.model.Searchable');


//
//	Constant: Priority sorted group filters
//

def('group-filter', array(
	0 => 'All Groups',
	1 => 'Recently Updated',
	2 => 'Recently Created',
	5 => 'Recently Joined',
	//40 => 'By Group Member Size',
	101 => '---',
	10 => 'Private Groups',
	99 => 'Groups You Admin'
	));


//
//	Constant: Access message string
//

def('accessTypeMessages', array(
	'O' => 'This is an open group. Anyone can join and invite others.',
	'C' => 'This is a closed group. Members must be invited or approved by an admin.',
	'P' => 'This is a private group. It will not show up in your profile, and only admins can invite members.'
	));


/**
 * Group.php is used to manage group model.
 *
 * PHP versions 4 and 5
 *
 * LICENSE: This source file is subject to version 3.0 of the PHP license
 * that is available through the world-wide-web at the following URI:
 * http://www.php.net/license/3_0.txt.  If you did not receive a copy of
 * the PHP License and are unable to obtain it through the web, please
 * send a note to license@php.net so we can mail you a copy immediately.
 *
 * @category   Groups
 * @package    project.model.Group
 * @author     Matt Snider <mattsniderppl@gmail.com>
 * @copyright  2007-2012 Matt Snider, LLC
 * @license    http://www.php.net/license/3_0.txt  PHP License 3.0
 * @version    CVS: $Id:$
 * @since      Release 1.0
 */
class Group extends Searchable {
	

	// ********************** Constructor Method ********************** //
	
	/**
	 * Instantiation function for a Group model.
	 * @method Group
     * @access Public
     * @since Release 1.0
	 */
	function Group() {
		parent::__construct('group');
		$this->_uriImage = c('defaultGroupImageUri');
		$this->_uriThumb = c('defaultGroupThumbUri');
	}



	// ********************** Business Methods ********************** //


	/**
	 * Retrieves the department
	 *
	 * @method getDepartment
	 * @return {string} the department name
	 * @since Release 1.0
	 * @public
	 */
	public function getDepartment() {return ConstantHelper::getNameFromConstantById('department', $this->getDepartmentId());}

	/**
	 * Returns the string associated with the access ID in the database, cached for performance
	 *
	 * @method getAccessMessage
	 * @return {string} the string associated with _access for a group
	 * @since Release 1.0
	 * @public
	 */
	public function getAccessMessage() {
		$messages = c('accessTypeMessages');
		return $messages[$this->_access];
	}


	/**
	 * Returns the Array of categories; if not admin, then the categories are pruned
	 *
	 * @method getCategories
	 * @return {array} collection of authorized categories
	 * @since Release 1.0
	 * @public
	 */
	public function getCategories($n) {
		$categories = c('category');

		if (c('ADMIN_ID') > $n) {
			$arr = array();

			foreach ($categories as $k=>$v) {
				switch ($k) {
					case 3:
					case 12:
					case 13:
					case 15:
					case 31:
						break;

					default:
						$arr[$k] = $v;
						break;
				}
			}

			return $arr;
		}

		return $categories;
	}


	/**
	 * Returns the category as a String; will include the parent category as well, if logical subcategory
	 *
	 * @method getCategoryAsString
	 * @return {string} the category as a string
	 * @access	Public
	 * @since	Release 1.0
	 * @since Release 1.0
	 * @public
	 */
	public function getCategoryAsString() {
		$categories = c('category');
		return (1 < strlen($this->_categoryId))? $categories[substr($this->_categoryId, 0, 1)] . ' - ' . $categories[$this->_categoryId]:
												 $categories[$this->_categoryId];
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
     * Reads the result set, filling this object.
     * @method readResultSet
     * @param rs {ResultSet} Required. The result set to read.
     * @access Public
     * @since Release 1.0
     */
	public function readResultSet($rs) {
	    parent::readResultSet($rs);
		$this->setCategoryId($rs->getInt('category_id'));
		$this->setCompanyId($rs->getInt('company_id'));
	}


	// ********************** Common Methods ********************** //

	/**
	 * Prints a human readable string of member variables.
	 * @method toString
	 * @return {String} A string representation of object where members are key/value pairs.
	 * @access Public
	 * @since Release 1.0
	 */
	public function toString() {
		return parent::toString() . '&catId=' . $this->_categoryId . '&companyId=' . $this->_companyId;
	}


	// ********************** Simple Getter/Setter Methods ********************** //

	public function getCategoryId() {return $this->_categoryId;}
	public function setCategoryId($n) {$this->_categoryId = intval($n);}

	public function getCompanyId() {return $this->_companyId;}
	public function setCompanyId($n) {$this->_companyId = intval($n);}

	public function getDepartmentId() {return $this->_departmentId;}
	public function setDepartmentId($n) {$this->_departmentId = intval($n);}

	public function getUserId() {return $this->_userId;}
	public function setUserId($n) {$this->_userId = intval($n);}


	// ********************** Private Variables ********************** //

	/**
	 * The id representing the category of the group.
	 *
     * @var {int} a group_category DB PK
     * @access Private
     * @since Release 1.0
	 */
	var $_categoryId = 1;


	/**
	 * The companies unique index associated to the group.
	 *
     * @var {int} a company DB PK
     * @access private
     * @since Release 1.0
	 */
	var $_companyId = 0;


	/**
	 * The department unique index associated to the group.
	 *
     * @var {int} a department DB PK
     * @access private
     * @since Release 1.0
	 */
	var $_departmentId = 0;


	/**
	 * The owning user DB PK
	 *
     * @var {int} a user DB PK
     * @access private
     * @since Release 1.0
	 */
	var $_userId = 0;


	// ********************** Static Variables ********************** //

	/**
	 * The SQL statement to select a Group.
     * @property SQL_SELECT
     * @var {String} The select for a Group.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_SELECT = '`group`.`category_id`, `group`.`company_id`, `group`.`searchable_id`';

	/**
	 * The SQL statement to reference the `group` table.
     * @property SQL_TABLE
     * @var {String} The `group` table.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_TABLE = '`group`';

	/**
	 * The SQL statement to left join the `group` table.
     * @property SQL_LEFT_JOIN
     * @var {String} The `group` table left join statement.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_LEFT_JOIN = 'LEFT JOIN `group` ON `group`.`searchable_id` = `S`.`id`';
}

?>
