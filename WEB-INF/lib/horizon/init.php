<?php
/* $Id: init.php 370 2006-10-17 05:19:38Z mojavelinux $
 *
 * Copyright 2003-2005 Dan Allen, Mojavelinux.com (dan.allen@mojavelinux.com)
 *
 * This project was originally created by Dan Allen, but you are permitted to
 * use it, modify it and/or contribute to it.  It has been largely inspired by
 * a handful of other open source projects and public specifications, most
 * notably Apache's Jakarta Project and Sun Microsystem's J2EE SDK.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @package horizon
 * @packagetutorial package.html
 */

import('horizon.lang.Object');
import('horizon.lang.RootException');
import('horizon.lang.Clazz');
import('horizon.lang.String');
import('horizon.lang.IllegalArgumentException');
import('horizon.lang.IllegalStateException');
import('horizon.lang.NoSuchMethodException');
import('horizon.lang.NullPointerException');
import('horizon.lang.SecurityException');
import('horizon.lang.ClassNotFoundException');

// clear out legacy global variables which includes
// HTTP_* and the argc/argv (which are still available under _SERVER)
// this leaves behind _GET/_POST/_COOKIE/_SERVER/_SESSION/_ENV/_FILES
unset($GLOBALS['argv']);
unset($GLOBALS['argc']);
unset($GLOBALS['HTTP_POST_VARS']);
unset($GLOBALS['HTTP_GET_VARS']);
unset($GLOBALS['HTTP_COOKIE_VARS']);
unset($GLOBALS['HTTP_SERVER_VARS']);
unset($GLOBALS['HTTP_ENV_VARS']);
unset($GLOBALS['HTTP_POST_FILES']);

define('FATAL_ERROR_PREFIX', 'Fatal error: ');
set_error_handler('handle_exception');
// NOTE: it is necessary to handle array to solve some PHP reference problems
$_EXCEPTION = array();
// NOTE: we use a constants array to provide naming flexibility
$_CONSTANTS = array();
// NOTE: at certain points, the umask is unreliable, so let's track it manually
$_UMASK = umask();

/**
 * Assign the value of a constant, which internally is stored in the global
 * constant array.
 */
function def($name, $value) {
	global $_CONSTANTS;
	$_CONSTANTS[$name] = $value;
}

/**
 * Evaluate if the constant exists.
 */
function hasConstant($name) {
	global $_CONSTANTS;
	return array_key_exists($name, $_CONSTANTS);
}

/**
 * Get the value of a constant...a short little helper function that
 * will throw an exception if it doesn't exist.
 *
 * The convention for defining class constants is to use ClassName::CONSTANT_NAME
 * in a case-sensitive mechanism.  This will allow for each conversion to the PHP5
 * runtime environment since it follows the syntax used by zend2.  However, in PHP4,
 * it is necessary to quote the constant when defining it since :: is a reserved symbol
 * and will throw a parse error.  The c() method will allow for php4/5 compatibility.
 */
function c($name, $strict = true) {
	global $_CONSTANTS;
	if (!isset($_CONSTANTS[$name])) {
		if (!$strict) {
			return NULL;
		}
		// the equivalent of a parse error, since this should be caught before the fact
		trigger_error('cannot resolve symbol: constant ' . $name, E_USER_ERROR);
	}

	return $_CONSTANTS[$name];
}

function throw_exception(&$e) {
	global $_EXCEPTION;

	// only save the exception if one does not already exist
	// NOTE: it is necessary to use an array for purposes of reference bugs in PHP
	if (count($_EXCEPTION) == 0) {
		$_EXCEPTION[0] =& $e;
	}
}

function handle_exception($level, $message, $file, $line) {
	static $exceptionMatches = array(

		'missing argument' => 'IllegalArgumentException',

		'call to undefined function' => 'NoSuchMethodException',

		'call to a member function on a non-object' => 'NullPointerException',

	);

	// ignore if manually silenced with '@' or E_STRICT (PHP5)
	if (error_reporting() == 0 || $level == E_STRICT) {
		return;
	}
	else
	{
		foreach ($exceptionMatches as $match => $className)
		{
			if (stristr($message, $match)) {
				// file and line? we don't need with debug_backtrace
				throw_exception(new $className($message));
				return;
			}
		}

		// file and line? we don't need with debug_backtrace
		throw_exception(new RootException($message));
	}
}

/**
 * Simulate an exception catch by looking for the exception type
 * in the globally stored $_EXCEPTION variable.
 *
 * @return {@link RootException} The active exception or <kbd>null</kbd> if an
 * exception of the requested type is not active.
 */
function catch_exception($clazz = 'RootException') {
	global $_EXCEPTION;

	$instance = null;
	$clazz = strtolower($clazz);
	if (!empty($_EXCEPTION) && is_a($_EXCEPTION[0], $clazz)) {
		$instance = array_pop($_EXCEPTION);
	}

	return $instance;
}

/**
 * Return a boolean depending on whether an exception is bubbling
 *
 * By running <code>if (bubble_exception()) return;</code> we can allow
 * an existing exception to force the current block to stop executing and
 * return to the caller.  Unfortunately, this must be explicitly added to
 * the code in spots where code execution should not continue in the case
 * that an exception has been thrown.
 */
function bubble_exception() {
	global $_EXCEPTION;
	if (empty($_EXCEPTION)) {
		return false;
	}

	// attempt to log in the event that it doesn't propagate
	error_log('Exception detected: ' . $_EXCEPTION[0]->getStackTrace("\n"), 0);
	return true;
}

/**
 * Return the actual paths that have been included.
 *
 * If type is specified as 1, only class includes are returned and if type is
 * 2, only non-class includes are returned.  Any other type will return all the
 * includes.
 *
 * @param int $type Optional type
 */
function get_included_paths($type = 0) {
	// get all include files
	if ($type == 0) {
		return get_included_files();
	}
		// get only class includes
	elseif ($type == 1)
	{
		$paths = array();

		foreach (get_included_files() as $path)
		{
			$file = basename($path);
			// only consider files that begin with an upper case letter
			if (strtoupper($file[0]) == $file[0]) {
				$paths[] = $path;
			}
		}

		return $paths;
	}
		// get non-class includes
	elseif ($type == 2)
	{
		$paths = array();

		foreach (get_included_files() as $path)
		{
			$file = basename($path);
			if (strtolower($file[0]) == $file[0]) {
				$paths[] = $path;
			}
		}

		return $paths;
	}
}

/**
 * Return the include paths (or as java calls them resources directories) as an
 * array, each path represented as an absolute file on the system.
 *
 * @return array
 */
function get_include_paths() {
	return array_map('realpath', explode(PATH_SEPARATOR, get_include_path()));
}

/**
 * Import a class using the java naming syntax for a class name.
 *
 * For instance, the package <i>horizon.io.FileReader</i> would
 * be equivalent to requiring the file <i>horizon/io/FileReader.php</i>
 * which would search the include path.
 *
 * TODO: protect against the same class name in a different package by providing a warning!!
 *
 * @param string $name The name of the package to be imported
 * @return void
 */
function import($name) {
	include_once str_replace('.', DIRECTORY_SEPARATOR, $name) . '.php';
}

function import_jsp($name) {
	if ((include_once str_replace('/', DIRECTORY_SEPARATOR, 'pages/' . $name) . '.php') !== false) {
		
	}
}

function rimplode($glue, $pieces, $lastGlue) {
	$n = sizeof($pieces);


	if (1 < $n) {
		$top = array_pop($pieces);
		$pieces = array(implode($glue, $pieces), $top);
	}

	return implode($pieces, $lastGlue);
}

/**
 * Get the current unix time in milliseconds
 */
function gettimemillis() {
	list($usec, $sec) = explode(' ', microtime());
	return round((1000 * $sec) + (1000 * $usec));
}

/**
 * Determine if the specified value is 'empty' in terms of having contents,
 * not in terms of its value, as is the default case in php
 *
 * @param mixed $value
 *
 * @return boolean
 */
function is_empty($value) {
	if (is_null($value) ||
		(is_string($value) && strlen($value) == 0) ||
		(is_array($value) && count($value) == 0)) {
		return true;
	}

	return false;
}

/**
 * An identity function which will return the value
 * passed in as a reference.  This is a workaround used
 * when parameters are required to be passed by reference
 * and the value being passed in is either a literal or
 * a function call that does not return a reference.
 *
 * @param mixed $value
 *
 * @return mixed
 */
function &ref($value) {
	return $value;
}

/**
 * Creates a clone of the object by serializing and then unserializing it.
 * @method clone_object
 * @param  Object $o Required. The object to cone.
 * @return mixed A copy of the copy.
 * @since  Version 1.0
 * @static
 */
function clone_object($o) {
	return unserialize(serialize($o));
}

/**
 * Replace the links in the text with anchor tags.
 * @method inject_anchor_tags
 * @param  $str {String} Required. The string to inject anchors into.
 * @return {String} The updated text.
 * @since Release 1.0
 * @static
 */
function inject_anchor_tags($str) {
	return preg_replace("/(https?:\/\/([\w+?\.\w+])+[\/\w+\.]*(\??\#?[\w~\!\@\#\$\%\^\&\*\(\)-\=\+\\/\?\.:;,']*)?)/", '<a href="$1" target="blank">$1</a>', $str);
}


//
// Utility functions added by: MESnider
//

def('PARANOID_ALLOWED_AUTOCOMPLETE', array(' ', '.', "'", '-', ',', '+'));
def('PARANOID_ALLOWED_AUTOCOMPLETE_PLUS', array(' ', '.', "'", '-', ',', '+', '&', ':', '_', '?', '!'));
def('PARANOID_ALLOWED_URI', array('_', '-', '.', '?', '&', '=', ';', '+', ':', '/', '%', '@', '#'));
def('PARANOID_ALLOWED_DATETIME', array(':', '-', ' '));
def('PARANOID_ALLOWED_URI_PLUS', array('_', '-', '.', '?', '&', '=', ';', '+', ':', '/', '%', '@', '#', ' '));
def('PARANOID_ALLOWED_EMAIL', array('_', '-', '.', '?', '&', '=', ',', ';', '+', ':', '/', '%', '@', '#', ' ', '$', '{', '}', '(', ')', '<', '>', '"', "'", "\n"));


/**
 * Sorts an Array containing two Objects with 'getCreated' member functions.
 *
 * @method sortByCreated
 * @param o1 {Object} Required. The left-hand object.
 * @param o2 {Object} Required. The right-hand object.
 * @since Release 1.0
 * @access Static
 */
function sortByCreated($o1, $o2) {
	$a = $o1->getCreated();
	$b = $o2->getCreated();
	if ($a === $b) {
		return 0;
	}
	return (strtotime($a) > strtotime($b) ? -1 : +1);
}

class Sanitize {


	/**
	 * Removes non-boolean values
	 * @param string {String} string to evaluate
	 * @return {String} escaped value
	 * @access public
	 */
	public static function boolean($string) {
		$lower = strtolower($string);
		return ($string && 'false' != $lower && 'f' != $lower && 'null' != $lower);
	}


	/**
	 * Removes any non-numeric characters.
	 * @param $i {Integer}				The number to evaluate
	 * @param $allowed {Array}			Array of allow characters
	 * @return string
	 * @access public
	 */
	public static function numeric($i, $allowed = array()) {
		$allow = null;
		if (!empty($allowed)) {
			foreach ($allowed as $value) {
				$allow .= "\\$value";
			}
		}

		if (is_array($i)) {
			foreach ($i as $key => $clean) {
				$cleaned[$key] = preg_replace("/[^{$allow}0-9\-]/", "", $clean);
			}
		}
		else {
			$cleaned = preg_replace("/[^{$allow}0-9\-]/", "", $i);
		}

		return $cleaned;
	}


	/**
	 * Removes any non-alphanumeric characters.
	 * @param $string {String}			String to evaluate
	 * @param $allowed {Array}			Array of allow characters
	 * @return string
	 * @access public
	 */
	public static function paranoid($string, $allowed = array()) {
		$allow = null;
		if (!empty($allowed)) {
			foreach ($allowed as $value) {
				$allow .= "\\$value";
			}
		}

		if (is_array($string)) {
			foreach ($string as $key => $clean) {
				$cleaned[$key] = preg_replace("/[^{$allow}a-zA-Z0-9]/", "", $clean);
			}
		}
		else {
			$cleaned = preg_replace("/[^{$allow}a-zA-Z0-9]/", "", $string);
		}

		return $cleaned;
	}


	/**
	 * Makes a string SQL-safe by adding slashes (if needed).
	 *
	 * @param string $string
	 * @param string $mq
	 * @return string
	 * @access public
	 */
	public static function sql($string, $mq = false) {
		if (!ini_get('magic_quotes_gpc') && $mq) {
			$string = addslashes($string);
		}
		return $string;
	}


	/**
	 * Returns given string safe for display as HTML. Renders entities.
	 *
	 * @param string $string
	 * @param boolean $remove If true, the string is stripped of all HTML tags
	 * @return string
	 * @access public
	 */
	public static function html($string, $remove = false) {
		if ($remove) {
			$string = strip_tags($string);
		}
		else {
			$patterns = array("/\&/", "/%/", "/</", "/>/", '/"/', "/'/", "/\(/", "/\)/", "/\+/", "/-/");
			$replacements = array("&amp;", "&#37;", "&lt;", "&gt;", "&quot;", "&#39;", "&#40;", "&#41;", "&#43;", "&#45;");
			$string = preg_replace($patterns, $replacements, $string);
		}
		return $string;
	}
}


def('ADMIN_ID', 99);
def('ERROR', '');
def('MESSAGE', '');
def('JS_HREF', 'javascript://');
def('EMAIL_WEBMASTER', 'webmaster@cameleon.mattsnider.com');

def('ROOT_DIR', preg_replace('/index.php/', '', $_SERVER['SCRIPT_FILENAME']));

// permission constants
def('PERM_DENIED', 0);
def('PERM_READ', 1);
def('PERM_CREATE', 2);
def('PERM_UPDATE', 4);
def('PERM_DELETE', 8);
def('GOLDEN', 1.6180339887);

function bit_add(&$bit, $bitmask) { if (!bit_has($bit, $bitmask)) {
	$bit |= $bitmask;
} }

function bit_has($bit, $bitmask) { return $bit & $bitmask; }

function bit_remove(&$bit, $bitmask) { if (bit_has($bit, $bitmask)) {
	$bit ^= $bitmask;
} }

/**
 * Print any variable to the web client in human readable formatted
 * @param $str {Object}					Any Object
 */
function pr($var) {
	echo "<pre>";
	print_r($var);
	echo "</pre>";
}

function glog($str) {
	$log =& StandardContext::getLog();
	$log->error($str);
}

function dlog($msg) {
	glog('================================================================================');
	glog('================================================================================');
	glog($msg);
	glog('================================================================================');
	glog('================================================================================');
}

function request_hostname($request) {
	$ds = '/';
	$i = strripos($request, $ds);
	return substr($request, 0, $i);
}

function trueUCFirst($str) {
	$arr = explode(' ', $str);

	for ($i = 0, $j = sizeof($arr); $i < $j; $i++) {
		$s = $arr[$i];
		$arr[$i] = strtoupper(substr($s, 0, 1)) . strtolower(substr($s, 1));
	}

	return implode(' ', $arr);
}


/**
 * Return the str and a DB safe integer or the default value
 *
 * @method getDBSafeInteger
 * @param str {string} string to convert
 * @param dfl {int} OPTIONAL: the default value; default is ZERO
 * @return {int} the parameter as a valid integer
 * @access Protected
 * @since Release 1.0
 */
function getDBSafeInteger($str, $dfl = 0) {
	$value = getValidatedInteger($str);
	return ($value || "0" === $str) ? $value : $dfl;
}


/**
 * Return the str and a DB safe string or the default value
 *
 * @method getDBSafeString
 * @param str {string} string to convert
 * @param dfl {string} OPTIONAL: the default value; default is empty string
 * @param arr {array} OPTIONAL: array of characters to allow; default is empty Array
 * @return {string} the parameter as a valid string
 * @access Protected
 * @since Release 1.0
 */
function getDBSafeString($str, $dfl = '', $arr = array()) {
	$value = Sanitize::paranoid($str, $arr);
	return $value ? stripProfanity($value) : $dfl;
}


/**
 * Returns a safe boolean value from characters true/false, T/F, or 1/0
 *
 * @method getValidatedBoolean
 * @param b {string} a value that is supposed to be a boolean
 * @return {boolean} the boolean value of the string; default is false
 */
function getValidatedBoolean($b) {
	$val = strtolower(Sanitize::paranoid($b));
	return '1' == $val || 't' == $val || 'true' == $val || 'on' == $val || 'y' == $val || 'yes' == $val;
}


/**
 * Returns a safe integer value; default is 0
 *
 * @method getValidatedInteger
 * @param n {string} a value that is supposed to be a number
 * @return {Integer} the integer value of the string; default is 0
 * @access Protected
 * @since Release 1.0
 */
function getValidatedInteger($n) {
	$val = Sanitize::numeric($n);
	return $val ? $val + 0 : 0;
}


/**
 * Uses regular expressions to remove key words (profanity) from the string; only matches exact words
 *
 * @method stripProfanity
 * @param str {string} the String to clean
 * @return {string} the cleaned String
 * @access Protected
 * @since Release 1.0
 */
function stripProfanity($str) {
	$regex = c('profanity');
	return '/\b\b/' !== $regex ? preg_replace($regex, "$1%$#*$2", $str) : $str;
}


/**
 * Creates a datetime object from the timestamp; generally used like $this->getDatetime(time());
 * @param timestamp {Integer} time in milliseconds
 * @param format {String} OPTIONAL: the format of the timestamp; default is MySQL datatime format
 * @return {String} a string representation of the timestamp
 * @access universal
 * @since	 Release 1.0
 */
function getDatetime($timestamp, $format = 'Y-m-d H:i:s') {
	return date(
		$format,
		mktime(
			date('H', $timestamp),
			date('i', $timestamp),
			date('s', $timestamp),
			date('m', $timestamp),
			date('d', $timestamp),
			date('Y', $timestamp)
		)
	);
}


srand(time());


/**
 * Retrieves value for the given key out of the url query string
 *   ex: url=http://www.mymint.com?id=1234&type=special	then, getQueryValue(url,"id") == "1234"
 *
 * @method getQueryValue
 * @param url {String} a url string with get request key/value
 * @param key {String} the key value you want to retrieve
 * @return {String} the value of the key
 * @access universal
 * @since Release 1.0
 */
function getQueryValue($url, $k) {
	if ('&' != substr($url, 0, 1)) {
		$url = '&' . $url;
	} // prevents malformed url problem
	return preg_replace("/.*[\?&]" . $k . "=([^&#]*).*/i", '$1', $url);
}

;


/**
 * Returns a random number and with a singleton seed
 * @param prefix {String} a prefix to append before MD5
 * @return {String} random key as md5
 */
function getInsertKey($prefix = '') {
	return strval(md5($prefix . rand()));
}


/**
 * Returns an ellipsed or original string as necessary; assumes natural language with ' '
 * @param str {String} the value to ellipses
 * @param len {Integer} the maximum length of value
 * @return {String} the ellipsed value
 * @access universal
 * @since	 Release 1.0
 */
function getEllipses($str, $len) {
	if ($len < strlen($str)) {
		$substr = explode(' ', substr($str, 0, $len));
		$substr[sizeof($substr) - 1] = '...';
		return implode(' ', $substr);
	}
	else {
		return $str;
	}
}

/**
 * Returns the time ago text for the provided datetime.
 * @method getTImeAgo
 * @param  $datefrom {String|Integer} Required. The date of event to evaluate.
 * @param  $dateto {Integer} Optional. The date of event to compare against; defaults to NOW.
 * @return {String} Time ago text for date difference.
 * @access Static
 * @since  Release 1.0
 */
function getTimeAgo($datefrom, $dateto = 0) {
	$datefrom = is_string($datefrom) ? strtotime($datefrom) : $datefrom;
	if (!$dateto) {
		$dateto = time();
	}
	$diff = $dateto - $datefrom;
	$toAsArray = datetime_to_array($dateto);
	$midnightOfTo = strtotime($toAsArray['m'] . '/' . $toAsArray['d'] . '/' . $toAsArray['y'] . ' 00:00:00');


	switch (true) {
		// If difference is less than 60 seconds,
		// seconds is a good interval of choice
		case(strtotime('-1 min', $dateto) < $datefrom):
			$datediff = $diff;
			$res = ($datediff == 1) ? $datediff . ' second ago' : $datediff . ' seconds ago';
			break;
		// If difference is between 60 seconds and
		// 60 minutes, minutes is a good interval
		case(strtotime('-1 hour', $dateto) < $datefrom):
			$datediff = floor($diff / 60);
			$res = ($datediff == 1) ? $datediff . ' minute ago' : $datediff . ' minutes ago';
			break;
		// If difference is between 1 hour and midnight this morning
		// hours is a good interval
		case($midnightOfTo < $datefrom):
			$datediff = floor($diff / 60 / 60);
			$res = ($datediff == 1) ? $datediff . ' hour ago' : $datediff . ' hours ago';
			break;
		// If the time was anytime yesterday
		// use Yesterday at 9:21pm
		case(strtotime('-1 day', $midnightOfTo) < $datefrom):
			$datediff = floor($diff / 60 / 60);
			$res = 'Yesterday at ' . date('g:ia', $datefrom);
			break;
		// If the time was before yesterday, but still this week use
		// use Thursdays at 9:21pm
		case(strtotime('-' . date('N', $dateto) . ' day', $dateto) < $datefrom):
			$res = date('l \a\t g:ia', $datefrom);
			break;
		// otherwise default to 01/22/2010 at 9:21pm
		default:
			$res = date('m/d/Y \a\t g:ia', $datefrom);

	}
	return $res;
}

/**
 * Evaluates if a given string is a valid short word or should be ignored.
 * @method isAllowedShortWord
 * @param str {String} the value to ellipses
 * @access Static
 * @since Release 1.0
 */
function isAllowedShortWord($str) {
	$s = '' . $str;
	$len = strlen($s);
	if (is_numeric($s)) {
		return false;
	}
	if (4 < $len) {
		return true;
	}
	if (3 < $len) {
		switch ($s) {
			case 'also':
			case 'http':
			case 'that':
			case 'this':
				break;

			default:
				return true;
		}
	}

	return false;
}


/**
 * Adds an 's' to the end of string when the count is not 1
 * @param str {String} string to pluralize
 * @param count {Integer} the number of results
 * @return {String} a singular or pluralized string
 * @access universal
 * @since Release 1.0
 */
function pluralize($str, $count) {
	return 1 === $count ? $str : ($str . 's');
}

/**
 * Intelligently adds an 's' to the end of words, making them plural.
 * @method str_pluralize
 * @param  $str {String} Required. The value to pluralize.
 * @return {String} The pluralized value.
 * @access Static
 * @since  Release 1.0
 */
function str_pluralize($str) {
	if (0 < strlen($str)) {
		return 's' === strtolower(substr($str, -1, 1)) ? $str : $str . "s";
	}

	return $str;
}

/**
 * Converts all spaces to '_' and removes all non-alphanumeric characters.
 * @method str_convertValueToQueryKey
 * @param  $str {String} Required. The value to convert.
 * @return {String} The converted value.
 * @access Static
 * @since  Release 1.0
 */
function str_convertValueToQueryKey($str) {
	return strtolower(preg_replace('/\W/', '', str_replace(' ', '_', $str)));
}

/**
 * Evaluates if the needle is in the haystack.
 * @method in_string
 * @param  $needle {String} Required. The value to search.
 * @param  $haystack {String} Required. The value to search by.
 * @return {Boolean} The needle is in the haystack.
 * @access Static
 * @since  Release 1.0
 */
function in_string($needle, $haystack) {
	return -1 < strpos($haystack, $needle);
}

/**
 * Converts boolean-like values to actual booleans.
 * @method boolean_get
 * @param b {Object} Required. The object to convert.
 * @access Static
 * @since Release 1.0
 */
function boolean_get($b) {
	return $b ? true : false;
}


function createHash($key, $seed) {
	return md5($key . $seed);
}

function getApostrophedName($name) {
	return 's' == strtolower(substr($name, -1, 1)) ? $name . "'" : $name . "'s";
}


/**
 * Converts an array to a key/value pair string; preserves keys
 * @param arr {Array} any array
 * @return {String} the array as key/value pair string
 * @access Global
 * @since	Release 1.0
 */
function array_toquerystring($arr) {
	$str = array();

	foreach ($arr as $k => $v) {
		array_push($str, $k . '=' . $v);
	}

	return implode('&', $str);
}


/**
 * Creates a copy of the array
 * @param arr {Array} any array
 * @param fl {Boolean} true, when you want to copy each subarray as well
 * @return {Array} a copy of passed in array
 * @access Global
 * @since	Release 1.0
 */
function array_copy($arr, $fl = false) {
	$a = array();
	foreach ($arr as $k => $v) {
		$a[$k] = ($fl && is_array($v)) ? array_copy($v, true) : $v;
	}
	return $a;
}


/**
 * Tests if the string characters are all lowercase
 * @return {Boolean}								True, if str's characters are all lowercase
 */
function isLowerCase($str) {
	return $str == strtolower($str);
}


/**
 * Tests if the string characters are all uppercase
 * @return {Boolean}								True, if str's characters are all uppercase
 */
function isUpperCase($str) {
	return $str == strtoupper($str);
}

function checkEmail($email) {
	return eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$", $email);
}


/**
 * Creates an image from the supplied string with filename
 * @param str {String} the text to make into an image
 * @param filename {String} the name of the new file
 * @access Static
 * @since Release 1.0
 */
function createTextImage($str, $filename) {
	if (!function_exists('imagettfbbox')) {
		glog('GD2 is not installed on server. No image created for ' . $filename);
		return;
	}

	// determine file size
	//$size = imagettfbbox(12, 0, "/opt/lampp/etc/arial.ttf", $str);
	$size = imagettfbbox(12, 0, c('ROOT_DIR') . "assets/files/arial.ttf", $str);
//	$size = imagettfbbox(12, 0, "C:\projects\httproot\cameleon\assets\files\arial.ttf", $str);
	//Output the newly created image in gif format
	$image = imagecreate(($size[4] - $size[0]), $size[1] + abs($size[5]));
	//We are making three colors, white, black and gray
	$white = imagecolorallocate($image, 255, 255, 255);
	$black = imagecolorallocate($image, 0, 0, 0);
	// creates the text
	//imagettftext($image, 12, 0, 0, abs($size[5]), $black, "/opt/lampp/etc/arial.ttf", $str);
	imagettftext($image, 12, 0, 0, abs($size[5]), $black, c('ROOT_DIR') . "assets/files/arial.ttf", $str);
//	imagettftext($image, 12, 0, 0, abs($size[5]), $black, "C:\projects\httproot\cameleon\assets\files\arial.ttf", $str);
	// creates the image
//	imagegif($image, "/opt/lampp/htdocs/ssl/assets/images/" . $filename . ".gif");
	imagegif($image, c('ROOT_DIR') . "assets/images/" . $filename . ".gif");
//	imagegif($image, "C:\projects\httproot\cameleon\assets\images\\" . $filename . ".gif");
	//Free up resources
	imagedestroy($image);
}

function convertDatetime($datetime, $format = '\a\t h:i a \o\n F d, Y') {
	return date($format, strtotime($datetime));
}

function convertDatetimeToDate($datetime, $format = 'F d, Y') {
	return date($format, strtotime($datetime));
}

/**
 * Converts the datetime to an array.
 * @method datetime_to_array
 * @param datetime {String|Integer} Required. A datetime.
 * @access Static
 * @since Release 1.0
 */
function datetime_to_array($datetime) {
	$time = is_string($datetime) ? strtotime($datetime) : $datetime;

	return $time ? array(
		'm' => date('m', $time),
		'd' => date('d', $time),
		'y' => date('Y', $time),
		'h' => date('h', $time),
		's' => date('s', $time),
		'i' => date('i', $time)
	) : array(
		'm' => 0,
		'd' => 0,
		'y' => 0,
		'h' => 0,
		's' => 0,
		'i' => 0
	);
}

/**
 * Adds zeros to the from of numbers less than 10.
 * @method addZeros
 * @param n {Integer} Required. The number to pad.
 * @access Static
 * @since Release 1.0
 */
function addZeros($n, $len) {
	return $n < 10 ? '0' . $n : $n;
}

/**
 * Check if the String is a datetime
 *
 * @method isDateTime
 * @param datetime {string} value to test
 * @return {boolean} true, when is datetime
 */
function isDateTime($datetime) {
	return preg_match('/\d\d\d\d\-\d\d\-\d\d \d\d\:\d\d:\d\d/', $datetime);
}


/**
 * Compare the two datetime strings and check if they are on the same day
 *
 * @method isSameDay
 * @param dt1 {String} date and time to  compare
 * @param dt2 {String} date and time to  compare
 * @return {boolean} truen, when they are the same day
 * @access static
 * @release since 1.0
 */
function isSameDay($dt1, $dt2) {
	if (isString($dt1)) {
		$dt1 = strtotime($dt1);
	}
	if (isString($dt2)) {
		$dt2 = strtotime($dt2);
	}
	return date('Y-m-d', $dt1) === date('Y-m-d', $dt2);
}


class ConstantHelper {
	public static function getNameFromConstantById($constant, $id) {
		$list =& c($constant);
		return ($id) ? $list[$id] : '';
	}
}

class CameleonException extends RootException {

	/**
	 * Instanciation function for a CameleonException.
	 * @access Public
	 * @param message {String} Optional. A message associated with the exception.
	 * @param cause {RootException} Optional. A cause associated with the exception.
	 * @param arg1 {String} Optional. A string to replace the first '??' appearing in the message with.
	 * @param argX {String} Optional. Any number of additional strings to replace the '??' appearing in the message with.
	 * @since Release 1.0
	 * @constructor
	 */
	public function __construct($message = null, $cause = null) {
		super($message, $cause);
		$args = func_get_args();
		$n = sizeof($args);

		if ($message && 2 < $n) {
			for ($i = 0, $j = $n - 2; $i < $j; $i += 1) {
				$this->processArguments($args[$i]);
			}
		}
	}

	private function processArguments($item) {
		$this->message = str_replace('??', $item, $this->message);
	}
}


class HtmlHelper {

	/**
	 * The exception thrown when content is required an missing.
	 * @property EXCEPTION_NO_CONTENT
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $EXCEPTION_NO_CONTENT = 'HtmlHelper - Content is required for this element (tagName = ??)';

	/**
	 * The exception thrown when a required attribute is missing.
	 * @property EXCEPTION_MISSING_ATTRIBUTE
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $EXCEPTION_MISSING_ATTRIBUTE = 'HtmlHelper - Required attribute (??) missing for this element (tagName = ??)';

	public static function createTag($tagName = 'div', $attributes = array(), $content = '') {
		$attr = array();

		if ($attributes) {
			foreach ($attributes as $k => $v) {
				if ('cls' == $k) {
					$k = 'class';
				}
				array_push($attr, $k . '="' . $v . '"');
			}
		}

		switch ($tagName) {
			case 'input':
				return '<' . $tagName . ' ' . implode(' ', $attr) . '/>';
				break;
		}

		return '<' . $tagName . ' ' . implode(' ', $attr) . '>' . $content . '</' . $tagName . '>';
	}

	public static function createAnchorTag($attributes = array(), $content) {
		if (!$content) {
			throw_exception(new CameleonException(HtmlHelper::$EXCEPTION_NO_CONTENT, null, 'A'));
		}
		if (!$attributes['href']) {
			throw_exception(new CameleonException(HtmlHelper::$EXCEPTION_NO_CONTENT, null, 'href'));
		}
		return HtmlHelper::createTag('a', $attributes, $content);
	}

	public static function createLabelTag($attributes = array(), $content) {
		if (!$content) {
			throw_exception(new CameleonException(HtmlHelper::$EXCEPTION_NO_CONTENT, null, 'LABEL'));
		}
		if (!$attributes['for']) {
			throw_exception(new CameleonException(HtmlHelper::$EXCEPTION_NO_CONTENT, null, 'for'));
		}
		return HtmlHelper::createTag('label', $attributes, $content);
	}

	public static function createInputTag($attributes = array()) {
		if (!($attributes['class'] || $attributes['type'] || $attributes['name'])) {
			throw_exception(new CameleonException(HtmlHelper::$EXCEPTION_NO_CONTENT, null, 'class, type, or name'));
		}
		return HtmlHelper::createTag('input', $attributes);
	}

	public static function createOptionTag($attributes = array(), $content) {
		if (!($attributes['value'])) {
			throw_exception(new CameleonException(HtmlHelper::$EXCEPTION_NO_CONTENT, null, 'value'));
		}
		return HtmlHelper::createTag('option', $attributes, $content);
	}

	/**
	 * Returns a formatted SELECT element.
	 * @param array $optionElements Array of the OPTION elements (as 'value'=>'Text' pairs) to be used in the SELECT element
	 * @param mixed $selected Selected option
	 * @param array $attributes Array of HTML options for the opening SELECT element
	 * @param array $optionAttr Array of HTML options for the enclosed OPTION elements
	 * @param boolean $showEmpty If true, the empty select option is shown
	 * @return string Formatted SELECT element
	 * @access public
	 */
	public static function selectTag($options = array(), $selected = null, $attributes = array(), $optionAttr = array(), $showEmpty = true) {
		$opts = array_merge($optionAttr, array('value' => ''));
		if ($showEmpty) {
			array_push($opts, HtmlHelper::createTag('option', $optionAttr));
		}
		foreach ($options as $k => $v) {
			$attr = array('value' => $k);
			if (($selected == $v || $selected == $k) && $selected) {
				$attr['selected'] = 'selected';
			}
			$attr = array_merge($optionAttr, $attr);
			array_push($opts, HtmlHelper::createTag('option', $attr, $v));
		}
		return HtmlHelper::createTag("select", $attributes, implode('', $opts));
	}


	/**
	 * Returns a SELECT element for days.
	 * @param string $selected Option which is selected.
	 * @param arrat $attributes Attribute array for the select elements.
	 * @param array $optionAttr Attribute array for the option elements.
	 * @param boolean $showEmpty Show/hide the empty select option
	 * @return mixed
	 * @access public
	 */
	public static function dayOptionTag($selected = null, $attributes = array(), $optionAttr = array(), $showEmpty = true) {
		$days = array();
		for ($i = 1; $i <= 31; $i++) {
			$days[$i] = $i;
		}
		$selected = empty($selected) ? ($showEmpty == true ? NULL : date('d')) : $selected;
		return HtmlHelper::selectTag($days, $selected, $attributes, $optionAttr, $showEmpty);
	}


	/**
	 * Returns a SELECT element for years
	 * @param integer $minYear First year in sequence
	 * @param integer $maxYear Last year in sequence
	 * @param string $selected Option which is selected.
	 * @param arrat $attributes Attribute array for the select elements.
	 * @param array $optionAttr Attribute array for the option elements.
	 * @param boolean $showEmpty Show/hide the empty select option
	 * @return mixed
	 * @access public
	 */
	public static function yearOptionTag($minYear = null, $maxYear = null, $selected = null, $attributes = array(),
										 $optionAttr = array(), $showEmpty = true) {
		$selected = empty($selected) ? ($showEmpty ? NULL : date('Y')) : $selected;
		$currentYear = date('Y');
		$years = array();
		$maxYear = is_null($maxYear) ? $currentYear + 11 : $currentYear - $maxYear;
		$minYear = is_null($minYear) ? $currentYear - 60 : $currentYear - $minYear;

		if ($minYear > $maxYear) {
			$tmpYear = $minYear;
			$minYear = $maxYear;
			$maxYear = $tmpYear;
		}

		for ($yearCounter = $maxYear; $yearCounter >= $minYear; $yearCounter--) {
			$years[$yearCounter] = $yearCounter;
		}
		return HtmlHelper::selectTag($years, $selected, $attributes, $optionAttr, $showEmpty);
	}


	/**
	 * Returns a SELECT element for months.
	 * @param string $selected Option which is selected.
	 * @param arrat $attributes Attribute array for the select elements.
	 * @param array $optionAttr Attribute array for the option elements.
	 * @param boolean $showEmpty Show/hide the empty select option
	 * @return String
	 * @access public
	 */
	public static function monthOptionTag($selected = null, $attributes = array(), $optionAttr = array(), $showEmpty = true) {
		$selected = empty($selected) ? ($showEmpty ? NULL : date('m')) : $selected;
		return HtmlHelper::selectTag(c('month'), $selected, $attributes, $optionAttr, $showEmpty);
	}


	/**
	 * Returns a SELECT element for abbreviated months.
	 * @param string $selected Option which is selected.
	 * @param arrat $attributes Attribute array for the select elements.
	 * @param array $optionAttr Attribute array for the option elements.
	 * @param boolean $showEmpty Show/hide the empty select option
	 * @return String
	 * @access public
	 */
	public static function monthAbbrOptionTag($selected = null, $attributes = array(), $optionAttr = array(), $showEmpty = true) {
		$selected = empty($selected) ? ($showEmpty ? NULL : date('m')) : $selected;
		return HtmlHelper::selectTag(c('monthAbr'), $selected, $attributes, $optionAttr, $showEmpty);
	}


	/**
	 * Returns a SELECT element for states.
	 * @param string $selected Option which is selected.
	 * @param arrat $attributes Attribute array for the select elements.
	 * @param array $optionAttr Attribute array for the option elements.
	 * @param boolean $showEmpty Show/hide the empty select option
	 * @return String
	 * @access public
	 */
	public static function stateOptionTag($selected = '', $attributes = array(), $optionAttr = array(), $showEmpty = true) {
		return HtmlHelper::selectTag(c('state'), $selected, $attributes, $optionAttr, $showEmpty);
	}


	/**
	 * Returns a SELECT element for country.
	 * @param string $selected Option which is selected.
	 * @param arrat $attributes Attribute array for the select elements.
	 * @param array $optionAttr Attribute array for the option elements.
	 * @param boolean $showEmpty Show/hide the empty select option
	 * @return String
	 * @access public
	 */
	public static function countryOptionTag($selected = '', $attributes = array(), $optionAttr = array(), $showEmpty = true) {
		return HtmlHelper::selectTag(c('country'), $selected, $attributes, $optionAttr, $showEmpty);
	}


	/**
	 * Returns a SELECT element for gender.
	 * @param string $selected Option which is selected.
	 * @param arrat $attributes Attribute array for the select elements.
	 * @param array $optionAttr Attribute array for the option elements.
	 * @param boolean $showEmpty Show/hide the empty select option
	 * @return String
	 * @access public
	 */
	public static function genderOptionTag($selected = '', $attributes = array(), $optionAttr = array(), $showEmpty = true) {
		return HtmlHelper::selectTag(c('gender'), $selected, $attributes, $optionAttr, $showEmpty);
	}

	/**
	 * Returns a SELECT element for title.
	 */
	public static function titleOptionTag($selected = '', $attributes = array(), $optionAttr = array(), $showEmpty = true) {
		return HtmlHelper::selectTag(c('title'), $selected, $attributes, $optionAttr, $showEmpty);
	}


	/**
	 * Returns a SELECT element for department.
	 */
	public static function departmentOptionTag($selected = '', $attributes = array(), $optionAttr = array(), $showEmpty = true) {
		return HtmlHelper::selectTag(c('department'), $selected, $attributes, $optionAttr, $showEmpty);
	}


	/**
	 * Returns a SELECT element for industry.
	 */
	public static function industryOptionTag($selected = '', $attributes = array(), $optionAttr = array(), $showEmpty = true) {
		return HtmlHelper::selectTag(c('industry'), $selected, $attributes, $optionAttr, $showEmpty);
	}
}

def('autocompleteTitle', 'Auto-suggest enabled, see results as you type.');


/**
 * A string manipulation function that returns the substring of str up to that last space token before len.
 * @param String $str
 * @param Integer $len
 * @param String $tok OPTIONAL: default is space
 * @return String
 */
function substrToLastToken($str, $len, $tok = ' ') {
	if (strlen($str) <= $len) {
		return $str;
	}
	else {
		$str = substr($str, 0, $len);
		$len = strrpos($str, $tok);
		return ($len) ? substr($str, 0, $len) : $str;
	}
}

def('MYSQL_STOP_WORDS', array('able',
							  'about',
							  'above',
							  'according',
							  'accordingly',
							  'across',
							  'actually',
							  'after',
							  'afterwards',
							  'again',
							  'against',
							  'allow',
							  'allows',
							  'almost',
							  'alone',
							  'along',
							  'already',
							  'also',
							  'although',
							  'always',
							  'among',
							  'amongst',
							  'another',
							  'anybody',
							  'anyhow',
							  'anyone',
							  'anything',
							  'anyway',
							  'anyways',
							  'anywhere',
							  'apart',
							  'appear',
							  'appreciate',
							  'appropriate',
							  'around',
							  'aside',
							  'asking',
							  'associated',
							  'available',
							  'away',
							  'awfully',
							  'became',
							  'because',
							  'become',
							  'becomes',
							  'becoming',
							  'been',
							  'before',
							  'beforehand',
							  'behind',
							  'being',
							  'believe',
							  'below',
							  'beside',
							  'besides',
							  'best',
							  'better',
							  'between',
							  'beyond',
							  'both',
							  'brief',
							  'came',
							  'cannot',
							  'cant',
							  'cause',
							  'causes',
							  'certain',
							  'certainly',
							  'changes',
							  'clearly',
							  'come',
							  'comes',
							  'concerning',
							  'consequently',
							  'consider',
							  'considering',
							  'contain',
							  'containing',
							  'contains',
							  'corresponding',
							  'could',
							  'course',
							  'currently',
							  'definitely',
							  'described',
							  'despite',
							  'different',
							  'does',
							  'doing',
							  'done',
							  'down',
							  'downwards',
							  'during',
							  'each',
							  'eight',
							  'either',
							  'else',
							  'elsewhere',
							  'enough',
							  'entirely',
							  'especially',
							  'even',
							  'ever',
							  'every',
							  'everybody',
							  'everyone',
							  'everything',
							  'everywhere',
							  'exactly',
							  'example',
							  'except',
							  'fifth',
							  'first',
							  'five',
							  'followed',
							  'following',
							  'follows',
							  'former',
							  'formerly',
							  'forth',
							  'four',
							  'from',
							  'further',
							  'furthermore',
							  'gets',
							  'getting',
							  'given',
							  'gives',
							  'goes',
							  'going',
							  'gone',
							  'gotten',
							  'greetings',
							  'happens',
							  'hardly',
							  'have',
							  'having',
							  'hello',
							  'help',
							  'hence',
							  'here',
							  'hereafter',
							  'hereby',
							  'herein',
							  'hereupon',
							  'hers',
							  'herself',
							  'himself',
							  'hither',
							  'hopefully',
							  'howbeit',
							  'however',
							  'ignored',
							  'immediate',
							  'inasmuch',
							  'indeed',
							  'indicate',
							  'indicated',
							  'indicates',
							  'inner',
							  'insofar',
							  'instead',
							  'into',
							  'inward',
							  'itself',
							  'just',
							  'keep',
							  'keeps',
							  'kept',
							  'know',
							  'knows',
							  'known',
							  'last',
							  'lately',
							  'later',
							  'latter',
							  'latterly',
							  'least',
							  'less',
							  'lest',
							  'like',
							  'liked',
							  'likely',
							  'little',
							  'look',
							  'looking',
							  'looks',
							  'mainly',
							  'many',
							  'maybe',
							  'mean',
							  'meanwhile',
							  'merely',
							  'might',
							  'more',
							  'moreover',
							  'most',
							  'mostly',
							  'much',
							  'must',
							  'myself',
							  'name',
							  'namely',
							  'near',
							  'nearly',
							  'necessary',
							  'need',
							  'needs',
							  'neither',
							  'never',
							  'nevertheless',
							  'next',
							  'nine',
							  'nobody',
							  'none',
							  'noone',
							  'normally',
							  'nothing',
							  'novel',
							  'nowhere',
							  'obviously',
							  'often',
							  'okay',
							  'once',
							  'ones',
							  'only',
							  'onto',
							  'other',
							  'others',
							  'otherwise',
							  'ought',
							  'ours',
							  'ourselves',
							  'outside',
							  'over',
							  'overall',
							  'particular',
							  'particularly',
							  'perhaps',
							  'placed',
							  'please',
							  'plus',
							  'possible',
							  'presumably',
							  'probably',
							  'provides',
							  'quite',
							  'rather',
							  'really',
							  'reasonably',
							  'regarding',
							  'regardless',
							  'regards',
							  'relatively',
							  'respectively',
							  'right',
							  'said',
							  'same',
							  'saying',
							  'says',
							  'second',
							  'secondly',
							  'seeing',
							  'seem',
							  'seemed',
							  'seeming',
							  'seems',
							  'seen',
							  'self',
							  'selves',
							  'sensible',
							  'sent',
							  'serious',
							  'seriously',
							  'seven',
							  'several',
							  'shall',
							  'should',
							  'since',
							  'some',
							  'somebody',
							  'somehow',
							  'someone',
							  'something',
							  'sometime',
							  'sometimes',
							  'somewhat',
							  'somewhere',
							  'soon',
							  'sorry',
							  'specified',
							  'specify',
							  'specifying',
							  'still',
							  'such',
							  'sure',
							  'take',
							  'taken',
							  'tell',
							  'tends',
							  'than',
							  'thank',
							  'thanks',
							  'thanx',
							  'that',
							  'thats',
							  'their',
							  'theirs',
							  'them',
							  'themselves',
							  'then',
							  'thence',
							  'there',
							  'thereafter',
							  'thereby',
							  'therefore',
							  'therein',
							  'theres',
							  'thereupon',
							  'these',
							  'they',
							  'think',
							  'third',
							  'this',
							  'thorough',
							  'thoroughly',
							  'those',
							  'though',
							  'three',
							  'through',
							  'throughout',
							  'thru',
							  'thus',
							  'together',
							  'took',
							  'toward',
							  'towards',
							  'tried',
							  'tries',
							  'truly',
							  'trying',
							  'twice',
							  'under',
							  'unfortunately',
							  'unless',
							  'unlikely',
							  'until',
							  'unto',
							  'upon',
							  'used',
							  'useful',
							  'uses',
							  'using',
							  'usually',
							  'value',
							  'various',
							  'very',
							  'want',
							  'wants',
							  'welcome',
							  'well',
							  'went',
							  'were',
							  'what',
							  'whatever',
							  'when',
							  'whence',
							  'whenever',
							  'where',
							  'whereafter',
							  'whereas',
							  'whereby',
							  'wherein',
							  'whereupon',
							  'wherever',
							  'whether',
							  'which',
							  'while',
							  'whither',
							  'whoever',
							  'whole',
							  'whom',
							  'whose',
							  'will',
							  'willing',
							  'wish',
							  'with',
							  'within',
							  'without',
							  'wonder',
							  'would',
							  'would',
							  'your',
							  'yours',
							  'yourself',
							  'yourselves',
							  'zero'));

// Create functions which did not exist prior to PHP 5
if (strcmp(phpversion(), '5.0.0') < 0) {
	define('E_STRICT', 2048);
}

// Create functions which did not exist prior to PHP 4.3
if (strcmp(phpversion(), '4.3.0') < 0) {
	// assume PATH_SEPARATOR follows DIRECTORY_SEPARATOR
	define('PATH_SEPARATOR', DIRECTORY_SEPARATOR == '/' ? ':' : ';');

	function html_entity_decode($string) {
		$string = str_replace('&gt;', '>', $string);
		$string = str_replace('&lt;', '<', $string);
		$string = str_replace('&quot;', '"', $string);
		$string = str_replace('&amp;', '&', $string);
		return $string;
	}

	function apache_request_headers() {
		return getallheaders();
	}

	function get_include_path() {
		return ini_get('include_path');
	}

	function file_get_contents($filename) {
		$fd = fopen($filename, 'rb');
		$contents = fread($fd, filesize($filename));
		fclose($fd);
		return $contents;
	}

	function ob_get_clean() {
		$contents = ob_get_contents();
		ob_end_clean();
		return $contents;
	}
}

// Create functions which did not exist prior to PHP 4.2
if (strcmp(phpversion(), '4.2.0') < 0) {
	function is_a(&$object, $className) {
		$className = strtolower($className);
		return ($className == strtolower(get_class($object)) || is_subclass_of($object, $className));
	}
}

def('ADMIN_KEY', 'asdf1234');
def('ADMIN_ID', 1);
def('ROOT_NETWORK', 239);

// todo: deprecate these
def('QUERY_KEY_ACTION', 'action');
def('QUERY_KEY_ADVANCED', 'adv');
def('QUERY_KEY_CATEGORY', 'cat');
def('QUERY_KEY_ERROR', 'error');
def('QUERY_KEY_FLAG', 'flag');
def('QUERY_KEY_MODE', 'mode');
def('QUERY_KEY_NETWORK', 'network');
def('QUERY_KEY_POST_ID', 'postId');
def('QUERY_KEY_SAVE_SEARCH', 'ss');
def('QUERY_KEY_TIME', 'time');

// controller constants
def('QK_ABOUT', 'about');
def('QK_ADMIN', 'admin');
def('QUERY_KEY_ACCESS', 'access');
def('QK_AGREE', 'agree');
def('QUERY_KEY_BACKUP', 'backup');
def('QUERY_KEY_BODY', 'body');
def('QUERY_KEY_BGTYPE', 'bgtype');
def('QUERY_KEY_BUTTON', 'button');
def('QUERY_KEY_CONFIRM', 'confirm');
def('QK_CREATE', 'create');
def('QK_CURRENT', 'current');
def('QK_DAY', 'day');
def('QK_DELETE', 'delete');
def('QUERY_KEY_DESIGN', 'design');
def('QUERY_KEY_FILE', 'file');
def('QUERY_KEY_EDIT', 'edit');
def('QUERY_KEY_EMAIL', 'email');
def('QUERY_KEY_FILTER', 'filter');
def('QUERY_KEY_ID', 'id');
def('QUERY_KEY_KEY', 'key');
def('QK_MEMBER', 'member');
def('QUERY_KEY_MESSAGE_ID', 'mId');
def('QK_MONTH', 'month');
def('QUERY_KEY_NAME', 'name');
def('QUERY_KEY_NO_CACHE', 'nc');
def('QUERY_KEY_OFFSET', 'offset');
def('QUERY_KEY_ORIGINAL_ID', 'originalId');
def('QUERY_KEY_OUT', 'out');
def('QUERY_KEY_PARENT_ID', 'parentId');
def('QK_PIC', 'pic');
def('QUERY_KEY_PROFILE_ID', 'pid');
def('QUERY_KEY_PASSWORD', 'password');
def('QUERY_KEY_PAGE', 'page');
def('QUERY_KEY_QUERY', 'q');
def('QUERY_KEY_IS_ADV', 'adv');
def('QK_IS_AJAX', 'isAjax');
def('QUERY_KEY_IS_FRIEND', 'isFriend');
def('QUERY_KEY_IS_GROUP', 'isGroup');
def('QUERY_KEY_IS_READ', 'isRead');
def('QUERY_KEY_LIMIT', 'limit');
def('QK_ORDER', 'order');
def('QK_PENDING', 'pending');
def('QK_REMOVE', 'remove');
def('QUERY_KEY_REQUIRED', 'required');
def('QUERY_KEY_SEARCH', 'search');
def('QK_SEARCHABLE', 'searchable');
def('QK_SHOW_DETAILS', 'showDetails');
def('QUERY_KEY_SHOW_RATING', 'showRating');
def('QK_SIZE', 'size');
def('QUERY_KEY_SORT', 'sortby');
def('QUERY_KEY_STATUS', 'status');
def('QUERY_KEY_SUBJECT', 'subject');
def('QK_SUB_TASK', 'subtask');
def('QUERY_KEY_TASK', 'task');
def('QUERY_KEY_THREAD', 'thread');
def('QK_TITLE', 'title');
def('QK_TYPE', 'type');
def('QUERY_KEY_TERMS', 'terms');
def('QUERY_KEY_URL', 'url');
def('QUERY_KEY_USERNAME', 'username');
def('QK_YEAR', 'year');

def('QK_HAS_RELATED', 'hasRelated');
def('QK_HAS_WALL', 'hasWall');
def('QK_HAS_MESSAGE_BOARD', 'hasMessageBoard');

// defined model name constants
def('MN_AUTHORIZED_USER', 'aUser');
def('MN_AUTHORIZED_TYPE', 'type');
def('MN_HISTORY', 'HISTORY');
def('MN_MESSAGEN', 'messageCount');
def('MN_NEXT_PAGE', 'nextPage');
def('MN_PAGE', 'page');
def('MN_PAGENAME', 'pagename');
def('MN_PARAM_KEY', 'qkey');
def('MN_PROJECT_EMAIL', 'projectEmail');
def('MN_PROJECT_URL', 'projectUrl');
def('MN_PROJECT_NAME', 'projectName');
def('MN_PROJECT_NAME_UC', 'projectNameUC');
def('MN_PROJECT_REVISION', 'revision');
def('MN_SCRIPTS', 'scripts');
def('MN_STYLES', 'styles');
def('MN_WIDGET', 'widget');
def('MN_WIDGETS', 'widgets');

def('MN_NAME_FRIEND', 'nameFriend');
def('MN_NAME_GROUP', 'nameGroup');
def('MN_NAME_MEMBER', 'nameMember');
def('MN_NAME_MESSAGE', 'nameMessage');
def('MN_NAME_MESSAGE_BOARD', 'nameMessageBoard');
def('MN_NAME_NETWORK', 'nameNetwork');
def('MN_NAME_RELATED', 'nameRelated');
def('MN_NAME_USER', 'nameUser');
def('MN_NAME_WALL', 'nameWall');

def('ASEARCH', implode('', array('searchResult.action?', c('QUERY_KEY_ADVANCED'), '=T')));

def('user-filter', array(
	0 => 'All Time',
	1 => 'Recently Updated',
	2 => 'Recently Added',
	3 => 'Recently Online'
));
?>
