<?php

import('project.model.Searchable');

/**
 * Network.php is used to manage network model.
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
 * @since      File available since release 0.5
 */

class Network extends Searchable {

	// ********************** Constructor Methods ********************** //

	/**
	 * Instantiation function for a Network model.
	 * @method Network
	 * @param  fl {Boolean} Optional. True, when creating a new Network; defaults to false.
     * @access Public
     * @since  Release 1.0
     * @constructor
	 */
	public function __construct($fl=false) {
		parent::__construct(Searchable::$TYPE_NETWORK);
		if ($fl) {$this->_key = getInsertKey();}
		$this->_uriImage = c('defaultGroupImageUri');
		$this->_uriThumb = c('defaultGroupThumbUri');
		$this->_access = Searchable::$ACCESS_CLOSED;
	}


	// ********************** Rendering Methods ********************** //

	
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
	}


	// ********************** Common Methods ********************** //


	// ********************** Simple Getter/Setter Methods ********************** //


	// ********************** Private Variables ********************** //


	// ********************** Static Variables ********************** //

	/**
	 * The SQL statement to left join the `network` table.
     * @property SQL_LEFT_JOIN
     * @var {String} The `network` table left join statement.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_LEFT_JOIN = 'LEFT JOIN `network` ON `network`.`searchable_id` = `S`.`id`';

	/**
	 * The SQL statement to select a Network.
     * @property SQL_SELECT
     * @var {String} The select for a Network.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_SELECT = '`network`.`searchable_id`';

	/**
	 * The SQL statement to reference the `network` table.
     * @property SQL_TABLE
     * @var {String} The `network` table.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_TABLE = '`network`';


	// ********************** Static Methods ********************** //

    /**
     * Generates the creation SQL for this object.
     * @method generateCreateSQL
     * @return {Array} The SQL as an array.
     * @access Public
     * @since Release 1.0
     */
	public static function generateCreateSQL(&$o) {
	    return array(
	        str_replace(' AS `N`', '', Network::$SQL_TABLE),
	        array('searchable_id'),
	        array($o->getId())
	    );
	}
}

?>