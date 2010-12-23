<?php

import('project.model.ModelBase');

/**
 * Newa.php is used to manage Newa model.
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

class News extends ModelBase {


	// ********************** Constructor Methods ********************** //

	/**
	 * Instantiation function for a Newa model.
	 * @method Newa
	 * @param  $id {Integer} Optional. The DB PK.
     * @access Public
     * @since  Release 1.0
     * @constructor
	 */
	public function __construct($id=0) {
		parent::__construct($id);
	}


	// ********************** Business Methods ********************** //

	/**
	 * Newa setter/getter for expire, piggy-backs off of the message timereplied variable
	 */
	public function getDateAgo() {return $this->getDate() ? $this->getTimeDisplay($this->getDate()) : 'unknown';}
	public function getDateDT() {return $this->getDate() ? convertDatetime($this->getDate()) : 'unknown';}
	public function getExpiresDT() {return $this->getExpires() ? convertDatetime($this->getExpires()) : 'unknown';}


	/**
	 * Returns the class style for the type
	 *
	 * @method getTypeClass
	 * @return {string} the className
	 * @access public
	 * @since Release 1.0
	 */
	public function getTypeClass() {
		switch ($this->_type) {
			case 'A':
				return 'alert';
				break;

			case 'E':
				return 'event';
				break;
				
			default:
				return 'news';
				break;
		}
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
		$this->setBody($rs->getString('body'));
		$this->setDate($rs->getString('date'));
		$this->setExpires($rs->getString('expires'));
		$this->setTitle($rs->getString('title'));
		$this->setType($rs->getString('type'));
	}

	
	// ********************** Common Methods ********************** //

    /**
     * Copy the desirable Newa values into 'this'.
     * @method copyArticle
     * @param o {Newa} Required. The object to copy.
     * @access Public
     * @since Release 1.0
     */
	public function copyArticle($o) {
	    $this->setBody($o->getBody());
	    $this->setCreated($o->getCreated());
	    $this->setDate($o->getDate());
	    $this->setExpires($o->getExpires());
	    $this->setId($o->getId());
	    $this->setModified($o->getModified());
	    $this->setTitle($o->getTitle());
	    $this->setType($o->getType());
	}


	// ********************** Simple Getter/Setter Methods ********************** //
	
	public function setBody($s) {$this->_body = $s;}
	public function getBody() {return $this->_body;}
	public function getBodyBr() {return inject_anchor_tags($this->newlineToBr($this->_body));}

	public function setDate($datetime) {$this->_date = $datetime;}
	public function getDate() {return $this->_date;}

	public function setExpires($datetime) {$this->_expire = $datetime;}
	public function getExpires() {return $this->_expire;}
	 
	public function setTitle($s) {$this->_title = $s;}
	public function getTitle() {return $this->_title;}

	public function setType($c) {$this->_type = $c;}
	public function getType() {return $this->_type;}


	// ********************** Private Variables ********************** //

	/**
	 * The content of the Newa.
	 * @name _body
     * @var {String}
     * @access Private
     * @since Release 1.0
	 */
	var $_body = '';

	/**
	 * The datetime of the Newa.
	 * @name _date
     * @var {DateTime}
     * @access Private
     * @since Release 1.0
	 */
	var $_date = '';

	/**
	 * The datetime of the Newa expires.
	 * @name _date
     * @var {DateTime}
     * @access Private
     * @since Release 1.0
	 */
	var $_expire = '';

	/**
	 * The Newa title.
	 * @name _title
     * @var {String}
     * @access Private
     * @since Release 1.0
	 */
	var $_title = '';

	/**
	 * The type of message enum; N=News, E=Event, S=Seminar.
	 * @name _title
     * @var {Char}
     * @access Private
     * @since Release 1.0
	 */
	var $_type = 'N';


	// ********************** Static Variables ********************** //

	/**
	 * The SQL statement to select a news Newa.
     * @property SQL_SELECT
     * @var {String} The select for a news Newa.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_SELECT = '`news`.`body`, `news`.`created`, `news`.`date`, `news`.`expires`, `news`.`id`, `news`.`modified`, `news`.`title`, `news`.`type`';

	/**
	 * The SQL statement to reference the `news` table.
     * @property SQL_TABLE
     * @var {String} The `news` table.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_TABLE = '`news`';


	// ********************** Static Method ********************** //

    /**
     * Generates the creation SQL for this object.
     * @method generateCreateSQL
	 * @param $o {News} Required. The News to create.
     * @return {Array} The SQL as an array.
     * @access Public
     * @since Release 1.0
	 * @static
     */
	public static function generateCreateSQL($o) {
	    return array(
	        News::$SQL_TABLE,
	        array('body', 'created', 'date', 'expires', 'title', 'type'),
	        array($o->_body, $o->__sCreated, $o->_date, $o->_expire, $o->_title, $o->_type)
	    );
	}

    /**
     * Generates the update SQL for this object.
     * @method generateUpdateSQL
	 * @param $o {News} Required. The News to update.
     * @return {Array} The SQL as an array.
     * @access Public
     * @since Release 1.0
     */
	public static function generateUpdateSQL(&$o) {
	    return array(
	        News::$SQL_TABLE,
	        array('body', 'created', 'date', 'expires', 'title', 'type'),
	        array($o->_body, $o->__sCreated, $o->_date, $o->_expire, $o->_title, $o->_type, $o->_id),
	        '`id` = ?'
	    );
	}

    /**
     * Fetches the news type array.
     * @method getTypes
     * @return {Array} The news types.
     * @access Public
     * @since  Release 1.0
	 * @static
     */
	public static function getTypes() {
		return array(
			'N' => 'news',
			'E' => 'event',
			'A' => 'alert'
		);
	}

    /**
     * Validates and returns the type.
     * @method validateType
	 * @param  $type {String} Required. The unsafe type.
     * @return {String} The news type.
     * @access Public
     * @since  Release 1.0
	 * @static
     */
	public static function validateType($type) {
		switch ($type) {
			case 'A':
			case 'E':
				return $type;

			default: return 'N';
		}
	}
}

?>