<?php

/**
 * ModelBase.php is an application-wide model interface.
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
 * @since	  File available since release 0.5
 */

class ModelBase {

	// ********************** Constructor Methods ********************** //

	/**
	 * Instantiation function for a generic model; should always be extended.
	 * @method Network
	 * @param  int $id Optional. The DB PK of model; also determines if create/modified/status should be set.
	 * @param  ResultSet $rs Optional. The ResultSet to read store into `this` object.
	 * @access Public
	 * @since  Release 1.0
	 * @constructor
	 */
	public function __construct($id = 0, $rs = null) {
		if ($id) {
			$this->_id = $id;
		}
		else {
			$this->__sCreated = getDatetime(time());
			$this->_modified = $this->__sCreated;
			$this->_status = Searchable::$STATUS_ACTIVE;
		}

		if ($rs) {
			$this->readResultSet($rs);
		}
	}


	// ********************** Rendering Methods ********************** //


	// ********************** Business Methods ********************** //

	/**
	 * Converts the str into anchors by spliting around empty space and commas
	 * @method convertLocationToAnchor
	 * @param str {string} value to convert
	 * @param prefix {string} OPTIONAL: the search url prefix
	 * @param target {string} OPTIONAL: the anchor tag target value; default empty string
	 * @param del {string} OPTIONAL: the regex to split on; default splits on commas and whitespaces
	 * @param fl {string} the delimiter characters for between anchors
	 * @return {string} html anchors representing the string
	 * @access public
	 * @since release 1.0
	 */
	function convertStringToAnchors($str, $prefix = '', $target = '', $del = '/[,\n\r]+[\s]*/', $fl = ', ') {
		if (!is_string($str)) {
			return '';
		}
		$arr = preg_split($del, $str);
		$lstr = '';

		for ($i = 0, $l = sizeof($arr); $i < $l; $i++) {
			$s = trim($arr[$i]);
			if ($s) {
				$lstr .= '<a href="' . $prefix . $s . '" target="' . $target . '">' . $s . '</a>' . ($i < ($l - 1) ? $fl : '');
			}
		}

		return $lstr;
	}

	/**
	 * Converts the passed address elements into a collection of search anchors
	 * @method convertLocationToAnchor
	 * @param addr {string} the address
	 * @param c {string} the city
	 * @param stateId {Integer} the state id
	 * @param countryId {Integer} the country id
	 * @param zip {string} the zipcode
	 * @return {string} html anchors representing the address
	 * @access public
	 * @since release 1.0
	 */
	protected function convertLocationToAnchor($addr, $c, $stateId, $countryId, $zip = '') {
		$sb = ($c) ? array('<a href="searchResult.action?adv=1&' . 'ci=' . $c . '">' . $c . '</a>') : array();

		if ($stateId) {
			$state = c('state');
			array_push($sb, '<a href="searchResult.action?adv=1&' . 'st=' . $stateId . '">' . $state[$stateId] . '</a>');
		}

		if ($countryId && 229 != $countryId) {
			$country = c('country');
			array_push($sb, '<a href="searchResult.action?adv=1&' . 'co=' . $countryId . '">' . $country[$countryId] . '</a>');
		}

		if ($zip) {
			array_push($sb, '<a href="searchResult.action?adv=1&' . 'zp=' . $zip . '">' . $zip . '</a>');
		}

		$str = implode(', ', $sb);
		if ($addr) {
			$str = $addr . '<br/>' . $str;
		}
		;
		return $str;
	}

	/**
	 * Converts the default address into a collection of search anchors
	 * @method getLocation
	 * @return {string} html anchors representing the address
	 * @access public
	 * @since release 1.0
	 */
	public function getLocation() {
		return $this->convertLocationToAnchor($this->_address, $this->_city, $this->_stateId, $this->_countryId, $this->_zipcode);
	}

	/**
	 * Returns the value with the newline character replaces with BR
	 * @method newlineToBr
	 * @param s {string} the value to convert
	 * @return {string} the converted value
	 * @access Protected
	 * @since release 1.0
	 */
	protected function newlineToBr($s) {
		return preg_replace('/\\n/', '<br />', $s);
	}

	/**
	 * Comvert the created datetime into UI string.
	 * @method getShortCreated
	 * @return {String} The converted datetime.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getShortCreated() {
		return $this->getShortDate($this->__sCreated);
	}

	/**
	 * Comvert a datetime into UI string.
	 * @method getShortDate
	 * @param s {Datetime} Required. The datetime to convert.
	 * @return {String} The converted datetime.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getShortDate($s) {
		if (empty($s)) {
			return '';
		}
		$now = time();
		$year = date('Y', $now);
		$created = strtotime($s);
		$cyear = date('Y', $created);
		return getDatetime($created, $year === $cyear ? 'M j' : 'd/m/Y');
	}

	/**
	 * Comvert datetime into UI string.
	 * @method getTimeDisplay
	 * @param s {Datetime} Required. The datetime to convert.
	 * @return {String} The converted datetime.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getTimeDisplay($s) {
		if (empty($s)) {
			return '';
		}
		$now = time();
		$year = date('Y', $now);
		$created = strtotime($s);
		$cyear = date('Y', $created);
		$today = mktime(0, 0, 0, date('m', $now), date('d', $now), $year);
		return ($today > $created) ? getDatetime($created, $year === $cyear ? 'h:ia \o\n M dS' : 'h:ia M dS Y') : 'Today @ ' . getDatetime($created, 'H:i:s');
	}

	/**
	 * A human readable created string
	 * @method getCreatedDisplay
	 * @return {string} humanized last created string
	 * @access public
	 * @since release 1.0
	 */
	function getCreatedDisplay() {
		return $this->getTimeDisplay($this->__sCreated);
	}

	/**
	 * A human readable modified string
	 * @method getLastUpdated
	 * @return {string} humanized last modified string
	 * @access public
	 * @since release 1.0
	 */
	function getLastUpdated() {
		return $this->getTimeDisplay($this->_modified);
	}

	/**
	 * Return the computed rating for the model; this should be overridden by any object needing a rating (such as profiles)
	 * @method computeRating
	 * @return {int} the computed rating
	 * @access public
	 * @since release 1.0
	 */
	public function computeRating() {
		return 0;
	}


	// ********************** DB Methods ********************** //

	/**
	 * Generates the creation SQL for this object.
	 * @method generateCreateSQL
	 * @return {Array} The SQL as an array.
	 * @access Public
	 * @since  Release 1.0
	 */
	public function generateCreateSQL2() {
		$fields = array();
		$values = array();

		$arr = get_object_vars($this);
		$i = 0;

		// iterate on the members of 'this' object and create a key/value pair string
		foreach ($arr as $var => $value) {
			if ('__iId' != $var && in_string('__', $var)) {
				$fields[$i] = str_replace('__', '', $var);
				$values[$i] = $value;
				$i += 1;
			}
		}

		return array(Article::$SQL_TABLE, $fields, $values);
	}

	public function getDBVariables() {
		$arr = get_object_vars($this);
		$values = array();
		$i = 0;

		// iterate on the members of 'this' object and create a key/value pair string
		foreach ($arr as $var => $value) {
			if (in_string('__', $var)) {
				$values[$i] = substr($value, 3);
				$i += 1;
			}
		}

		return $values;
	}

	public static function generateSelect($table, $values) {
		return $table . '`' . implode('`,' . $table . '`', $values) . '`';
	}

	/**
	 * Reads the result set, filling this object.
	 * @method readResultSet
	 * @param  rs {ResultSet} Required. The result set to read.
	 * @access Public
	 * @since Release 1.0
	 */
	public function readResultSet2($rs) {
		$arr = get_object_vars($this);

		// iterate on the members of 'this' object and create a key/value pair string
		foreach ($arr as $var => $value) {
			if (in_string('__', $var)) {
				$name = substr($var, 3);
				switch (substr($var, 2, 1)) {
					case 'b':
						$this->$var = $rs->getBoolean($name);
						break;
					case 'i':
						$this->$var = $rs->getString($name);
						break;
					case 's':
						$this->$var = $rs->getInt($name);
						break;
				}
			}
		}
	}

	/**
	 * Reads the result set, filling this object.
	 * @method readResultSet
	 * @param  rs {ResultSet} Required. The result set to read.
	 * @access Public
	 * @since Release 1.0
	 */
	public function readResultSet($rs) {
		$this->setCreated($rs->getString('created'));
		$this->setId($rs->getInt('id'));
		$this->setModified($rs->getString('modified'));
		$this->setStatus($rs->getString('status'));
	}


	// ********************** Common Methods ********************** //

	protected function copyFrom($o) {
		if (!$o instanceof ModelBase) {
			throw_exception(new IllegalArgumentException("$o is not an instance of ModelBase"));
		}

		$this->__sCreated = $o->getCreated();
		$this->_id = $o->getId();
		$this->_modified = $o->getModified();
		$this->_status = $o->getStatus();
	}

	/**
	 * Returns a key/value pair of this object.
	 * @method toString
	 * @access Public
	 * @since  Release 1.0
	 */
	public function toString() {
		$arr = get_object_vars($this);
		$sb = array();
		$i = 0;

		// iterate on the members of 'this' object and create a key/value pair string
		foreach ($arr as $k => $v) {
			try {
				$sb[$i] = $k . '=' . (is_object($v) && method_exists($v, 'toString') ? $v->toString() : $v);
				$i += 1;
			}
			catch (Exception $e) {
				// do nothing
			}
		}

		return implode('&', $sb);
	}


	// ********************** Simple Getter/Setter Methods ********************** //

	public function setCreated($created) { $this->__sCreated = $created; }

	public function getCreated() { return $this->__sCreated; }

	public function setId($id) { $this->_id = $id; }

	public function getId() { return $this->_id; }

	public function setModified($modified) { $this->_modified = $modified; }

	public function getModified() { return $this->_modified; }

	public function setStatus($status) { $this->_status = $status; }

	public function getStatus() { return $this->_status; }

	public function isActive() {
		return Searchable::$STATUS_ACTIVE == $this->_status;
	}

	public function getIsActive() { return $this->isActive(); }


	// ********************** Static Variables ********************** //

	/**
	 * The SQL statement to fetch a model by its DB PK.
	 * @since Version 1.0
	 * @var string
	 * @access public
	 * @final
	 * @static
	 */
	public static $SQL_WHERE_ID = 'WHERE `id`=?';


	// ********************** Private Variables ********************** //

	/**
	 * The date this model was created.
	 * @property $__sCreated
	 * @var {Datetime} The creation date.
	 * @since  Release 1.0
	 * @access Private
	 */
	var $__sCreated = '0000-00-00 00:00:00';

	/**
	 * The unique database id for model.
	 * @property $_id
	 * @var {Integer} The model DB PK.
	 * @access Private
	 * @since  Release 1.0
	 */
	var $_id = 0;

	/**
	 * The date this model was modified.
	 * @property $_modified
	 * @var {Datetime} The last modified date.
	 * @since  Release 1.0
	 * @access Private
	 */
	var $_modified = '0000-00-00 00:00:00';

	/**
	 * The status of contact connection.
	 * @property _status
	 * @var {Enum} The status enum: 'active', 'deleted', 'pending'.
	 * @since Release 1.0
	 * @access Private
	 */
	var $_status = '';
}

class Word {

	/**
	 * The datetime this school_user was created
	 *  @var datetime
	 *  @access private
	 */
	var $created = null;

	/**
	 * The frequency which this word appears in database
	 *  @var integer
	 *  @access private
	 */
	var $f = 0;

	/**
	 * The database index of word and relational table
	 *  @var integer
	 *  @access private
	 */
	var $joinId = 0;

	/**
	 * The database index of word
	 *  @var integer
	 *  @access private
	 */
	var $id = 0;

	/**
	 * The name of word
	 *  @var string
	 *  @access private
	 */
	var $name = '';


	// ********************** Constructor Methods ********************** //

	/**
	 * Instanciation function for a Word model.
	 *	 @access public
	 *	 @since Word available since release 0.5
	 */
	function Word() { }


	// ********************** Common Methods ********************** //

	function toString() {
		return '&created=' . $this->created . '&f=' . $this->f . '&joinId=' . $this->joinId
			   . '&id=' . $this->id . '&name=' . $this->name;
	}


	// ********************** Simple Getter/Setter Methods ********************** //

	function setCreated($created) { $this->created = $created; }

	function getCreated() { return $this->created; }

	function setFrequency($f) { $this->f = $f; }

	function getFrequency() { return $this->f; }

	function setJoinId($id) { $this->joinId = $id; }

	function getJoinId() { return $this->joinId; }

	function setId($id) { $this->id = $id; }

	function getId() { return $this->id; }

	function setName($name) { $this->name = $name; }

	function getName() { return $this->name; }


	// ********************** Accessor Methods ********************** //


	// ********************** Business Methods ********************** //
}


/* ----- |  Model constants  | ----- */

def('FORM_FIELD_VALUE_TYPE_GROUP', 'group');
def('FORM_FIELD_VALUE_TYPE_USER', 'user');

def('defaultTime', '0000-00-00 00:00:00');

?>