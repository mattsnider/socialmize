
<?php

/**
 * ScriptManager.php is used to run non-synchronous scripts
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
 * @package    project.service
 * @author     Matt Snider <mattsniderppl@gmail.com>
 * @copyright  2007-2012 Matt Snider, LLC
 * @license    http://www.php.net/license/3_0.txt  PHP License 3.0
 * @version    CVS: $Id:$
 * @see        BaseManager
 * @since      File available since Release 0.5
 */
 
import('project.service.BaseManager');


/**
 * @package project.service
 * @author Matt Snider
 *
 */
class ScriptManager extends BaseManager {

	
	/**
	 *	Retrieves the countries as an array
     * 	@access public	
     * 	@since 	Release 1.0
	 */
	public function &getCountryAsArray() {
		return $this->_getTableAsArray($this->_db_table_geo_country, array('`name`', '`id`'));
	}
	
	
	/**
	 *	Retrieves the states as an array
     * 	@access public
     * 	@since 	Release 1.0
	 */
	public function &getStateAsArray() {
		return $this->_getTableAsArray($this->_db_table_geo_state, array('`name`', '`id`'));
	}
	
	
	/**
	 *	Retrieves the city as an array
     * 	@access public
     * 	@since 	Release 1.0
	 */
	public function &getCityAsArray() {
		return $this->_getTableAsArray($this->_db_table_geo_city, array('`name`', '`id`'));
	}
	
	
	/**
	 *	Retrieves the group categories as an array
     * 	@access public
     * 	@since 	Release 1.0
	 */
	public function &getGroupCategoryAsArray() {
		return $this->_getTableAsArray($this->_db_table_group_category, array('`name`', '`id`'));
	}


	/**
	 *	Retrieves the industry as an array
     * 	@access public
     * 	@since 	Release 1.0
	 */
	public function &getIndustryAsArray() {
		return $this->_getTableAsArray($this->_db_table_industry, array('`name`', '`id`'));
	}
}

?>
