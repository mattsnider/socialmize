<?php

/**
 * Single.php is used to manage single model.
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

class Single extends Object {

	/**
	 * The value of this object.
     * @var String
     * @access private
	 */
	var $_value = '';
	

	// ********************** Constructor Methods ********************** //
	
	/**
	 * Instanciation function for a Single.
	 * @constructor
     * @param value {String} Required. The value.
     * @access public
     * @since Release 1.0
	 */
	public function __construct($value) {
		$this->_value = $value;
	}

	
	// ********************** Common Methods ********************** //
	
	public function toString() {
		return 'value=' . $this->_value;
	}


	// ********************** Simple Getter/Setter Methods ********************** //

	public function setValue($s) {$this->_value = $s;}
	public function getValue() {return $this->_value;}


	// ********************** Accessor Methods ********************** //
	
	
	// ********************** Business Methods ********************** //

	
}

?>