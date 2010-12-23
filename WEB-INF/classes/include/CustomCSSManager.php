<?php

import('include.CustomCSSModel');
import('include.FileFunctions');

// custom color params
def('QUERY_KEY_COLOR_BG', 'colorbg');
def('QUERY_KEY_COLOR_TEXT', 'colortext');
def('QUERY_KEY_COLOR_LABEL', 'colorLabel');
def('QUERY_KEY_COLOR_LINK', 'colorlink');
def('QUERY_KEY_COLOR_VISITED', 'colorvisited');
def('QUERY_KEY_COLOR_HD', 'colorhd');

// custom icon params
def('QUERY_KEY_LOGO', 'logo');
def('QUERY_KEY_FAVICON', 'favicon');

def('MAP_SPECIFICITY_TO_KEY', array(
    'body.project' => 'body',
    'body.project #doc #main' => 'doc',
    'body.project a' => 'link',
    'body.project a:visited' => 'vlink',
    'body.project h1' => 'head1',
    'body.project h2' => 'head2',
    'body.project h3' => 'head3',
    'body.project h4' => 'head4',
    'body.project label' => 'label'
));

/**
 * CustomCSSManager.php is used to manage the custom.css file. Updates values inside the custom.css as
 *	key/value pairs where the key is the CSS specificity and the value is the styles.
 *
 * PHP versions 4 and 5
 *
 * LICENSE: This source file is subject to version 3.0 of the PHP license
 * that is available through the world-wide-web at the following URI:
 * http://www.php.net/license/3_0.txt.  If you did not receive a copy of
 * the PHP License and are unable to obtain it through the web, please
 * send a note to license@php.net so we can mail you a copy immediately.
 *
 * @package    Util
 * @author     Matt Snider <mattsniderppl@gmail.com>
 * @copyright  2007-2012 Matt Snider, LLC
 * @license    http://www.php.net/license/3_0.txt  PHP License 3.0
 * @version    CVS: $Id:$
 * @since      File available since Release 1.0
 */

class CustomCSSManager {

	/**
	 * A collection of model representation of for each specificity.
     * @var _cssModels
     * @type {Array}
     * @access private
	 */
    var $_cssModels = array();

	/**
	 * The content of custom.css, this manager will edit this value.
     * @var _fileContent
     * @type string
     * @access private
	 */
	var $_fileContent = '';

	/**
	 * The name of the custom CSS file.
     * @var fileName
     * @type string
     * @access private
	 */
	var $fileName = 'assets/css/custom/custom.css';

	/**
	 * The location of custom.css.
     * @var _path
     * @type string
     * @access private
	 */
	var $_path = '';

	/**
	 * A map of previously fetched specificities.
     * @var _specificityHash
     * @type {Array}
     * @access private
	 */
	var $_specificityHash = array();

	/**
	 * A pointers of specificity to style object.
     * @var _specificityPointer
     * @type {Array}
     * @access private
	 */
	var $_specificityPointer = array();

	/**
	 * The style prefix of custom.css.
     * @var stylePrefix
     * @type string
     * @access private
	 */
	var $stylePrefix = 'body.project';

	/**
	 * The constructor to create the Custom CSS Manager.
	 * @constructor
	 */
	function __construct() {
		$script = $_SERVER['SCRIPT_FILENAME'];
		$dir = preg_replace('/index.php/', '', $script);
		$this->_path = preg_replace('/\//', DIRECTORY_SEPARATOR, $dir . $this->fileName);
		$this->_fileContent = file_get_contents($this->_path);
		$this->read();
	}

	/**
	 * Fetches the CSS specificity styles, and filter on a specific style.
	 * @method getStyle
	 * @param specificity {String} Required. The CSS specificity.
	 * @param style {String} Required. The style.
	 * @public
	 */
	public function getStyle($specificity, $style) {
		$styles = $this->getSpecificity($specificity);
		return trim(preg_replace('/.*' . $style . ':(.*?);.*/', '$1', $styles));
	}

	/**
	 * Fetches the content of a specificity in a CSS file.
	 * @method getSpecificity
	 * @param specificity {String} Required. The CSS specificity.
	 * @public
	 */
	public function getSpecificity($specificity) {
	    // the specificity already exists, return cached value
	    if (array_key_exists($specificity, $this->_specificityHash)) {
	        return $this->_specificityHash[$specificity];
	    }
	    // the specificity does not exist, find it
	    else {
	        $value = trim(preg_replace('/.*' . $this->stylePrefix . ' ' . preg_quote($specificity) . '\s*\{(.*?)\}.*/s', '$1', $this->_fileContent));
	        $this->_specificityHash[$specificity] = $value;
	        return $value;
	    }
	}

	/**
	 * Fetches the url of a style for provided specificity.
	 * @method getStyleUrl
	 * @param specificity {String} Required. The CSS specificity.
	 * @param style {String} Required. The style.
	 * @public
	 */
	public function getStyleUrl($specificity, $style) {
	    return trim(preg_replace('/.*url(.*?).*/', '$1', $this->getSpecificity($specificity)));
	}

	/**
	 * Fetches the content of 'color' for specificity.
	 * @method getColor
	 * @param specificity {String} Required. The CSS specificity.
	 * @public
	 */
	public function getColor($specificity) {
	    return $this->getStyle($specificity, 'color');
	}

	/**
	 * Fetches the content of 'background' for specificity.
	 * @method getBackground
	 * @param specificity {String} Required. The CSS specificity.
	 * @public
	 */
	public function getBackground($specificity) {
	    return $this->getStyle($specificity, 'background');
	}

    /**
     * Fetches the CSS data as a DB ready Array.
     * @method getData
     * @return {Array} Key value pairs of CSS styles.
     * @public
     */
	public function getData() {
		$customStyles = $this->read();
		$customBg = $customStyles[1]->getBackground();

	    return array(
            'bgCustom' => strpos($customBg, '/images/generated/'),
            'bgType' => strpos($customBg, 'em') ? 1 : 2,
            'colorBg' => $customStyles[1]->getBackgroundColor(true),
            'colorHd1' => $customStyles[5]->getColor(true),
            'colorHd2' => $customStyles[6]->getColor(true),
            'colorHd3' => $customStyles[7]->getColor(true),
            'colorHd4' => $customStyles[8]->getColor(true),
            'colorLabel' => $customStyles[3]->getColor(true),
            'colorLink' => $customStyles[2]->getColor(true),
            'colorText' => $customStyles[0]->getColor(true),
            'colorVisited' => $customStyles[4]->getColor(true)
        );
	}

    /**
     * Fetches the collection of CSS history files.
     * @method getCustomizationHistory
     * @return {Array} Collection of CSS history files.
     * @public
     */
	public function getCustomizationHistory() {
	    $dir = $this->getDir();
	    $files = loadFiles($dir, 1, array('.svn', 'custom.css'));
	    $cfiles = array();

	    for ($i = 0, $j = sizeof($files); $i < $j && $i < 5; $i +=1) {
	        $cfiles[$i] = $files[$i][0];
	    }

	    return $cfiles;
	}

    /**
     * Return the directory from the file path.
     * @method getDir
     * @return {String} The directory.
     * @private
     */
	private function getDir() {
	    return preg_replace('/custom.css/', '', $this->_path);
	}

	/**
	 * Reads the specificity from a CSS file.
	 * @method read
	 * @return {Array} A collection of CSS data.
	 * @public
	 */
	public function read() {
	    // get content between terminators
	    $content = preg_replace('/\/\*\* @_START_@ \*\/(.*)?\/\*\* @_END_@ \*\//s', '$1', $this->_fileContent);
	    preg_match_all('/[\w\.\:\#\s]+\{(.*?)\}/s', $content, $matches);
	    $specificityMap = c('MAP_SPECIFICITY_TO_KEY');
	    $this->_cssModels = array(); // reset
	    $k = 0;

	    // ensure that valid matches were found
	    if (sizeof($matches) && sizeof($matches[0]) && sizeof($matches[1])) {
            // iterate on each specificity
            foreach ($matches[0] as $i => $v) {
                $specificity = trim(preg_replace('/\{.*?\}/s', '', $v));
                $specificityContent = trim($matches[1][$i]);
                $styleStrings = 1 < substr_count($specificityContent, ';') ? explode(';', $specificityContent) :
                                                                             array(str_replace(';', '', $specificityContent));
                $styles = array();

                // iterate on each style in the specificity
                foreach ($styleStrings as $s) {
//                    dlog($specificity . ' - ' . $s);
                    $style = explode(':', trim($s));
                    $styles[trim($style[0])] = trim($style[1]);
                }

                // known entity
                if (array_key_exists($specificity, $specificityMap)) {
                    $key = $specificityMap[$specificity];
                    $this->_specificityPointer[$specificity] = $k;
                    $this->_cssModels[$k] = new CustomCSSModel($key, $specificity, $styles);
                    $k += 1;
                }
                // unknown entity
                else {
                    dlog('Unkown CSS entity: ' . $key);
                }
            }
	    }

	    return $this->_cssModels;
	}

    /**
     * Converts the filename to the current custom CSS.
     * @method revertTo
     * @param filename {String} Required. The name of the file.
     * @public
     */
	public function revertTo($filename) {
	    $file = $this->getDir() . $filename;

	    if (file_exists($file)) {
            copy($this->_path, str_replace('.css', getDatetime(time(), 'Y-m-d_H-i-s') . '.css', $this->_path));
            unlink($this->_path);
            rename($file, $this->_path);
		}
	}

    /**
     * The model collection converted into a CSS entries.
     * @method toString
     * @return {String} A set of CSS entries.
     * @public
     */
	public function toString() {
	    $sb = array();
	    $i = 0;

	    foreach ($this->_cssModels as $o) {
	        $sb[$i] = $o->toString();
	        $i += 1;
	    }

	    return implode('
', $sb);
	}

	/**
	 * Updates a CSS entry with the value.
	 * @method update
	 * @param specificity {String} Required. The CSS specificity.
	 * @param style {String} Required. The style name.
	 * @param value {String} Requied. The values of that CSS entry.
	 * @public
	 */
	public function update($specificity, $style, $value) {
	    if (array_key_exists($specificity, $this->_specificityPointer)) {
	        $i = $this->_specificityPointer[$specificity];
	        $this->_cssModels[$i]->updateStyle($style, $value);
	    }
	    else {
	        // todo: write style creation logic
	        dlog('Attempting to update an unknown specificity!');
	    }
	}

	/**
	 * Updates a CSS color with the value.
	 * @method updateColor
	 * @param specificity {String} Required. The CSS specificity.
	 * @param value {String} Requied. The values of that CSS entry.
	 * @public
	 */
	public function updateColor($specificity, $value) {
        $this->update($specificity, 'color', $value);
	}

	/**
	 * Writes all changes of the content back into the file.
	 * @method write
	 * @public
	 */
	public function write() {
		copy($this->_path, str_replace('.css', getDatetime(time(), 'Y-m-d_H-i-s') . '.css', $this->_path));
		$cssData = preg_replace('/\/\*\* @_START_@ \*\/(.*?)\/\*\* @_END_@ \*\//s', '/** @_START_@ */
' . $this->toString() . '
/** @_END_@ */', $this->_fileContent);
		file_put_contents($this->_path, $cssData);
	}
}

?>