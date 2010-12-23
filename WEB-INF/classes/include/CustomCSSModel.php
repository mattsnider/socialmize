<?php

/**
 * CustomCSSModel.php is used to determine the specificity and keys used to represent a CSS entry.
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

class CustomCSSModel {

	/**
	 * The additional parameter required for evaluation method.
	 * @name _data
     * @var {Mixed}
     * @access private
	 */
	var $_data = null;

	/**
	 * The method to use for evaluation.
	 * @name _eval
     * @var {String}
     * @access private
	 */
	var $_eval = null;

	/**
	 * The name of this model.
	 * @name _key
     * @var {String}
     * @access private
	 */
	var $_key = '';

	/**
	 * The style specificity.
	 * @name _specificity
     * @var {String}
     * @access private
	 */
	var $_specificity = '';

	/**
	 * A collection of styles at this specificity.
	 * @name _styles
     * @var {Array}
     * @access private
	 */
	var $_styles = array();


	// ********************** Constructor Methods ********************** //

	/**
	 * Instanciation function for a Custom CSS model.
     * @access Public
     * @since Release 1.0
     * @constructor
	 */
	public function __construct($key, $specificity, $styles, $eval=null, $data=null) {
	    $this->_key = $key;
	    $this->_eval = $eval;
	    $this->_data = $data;
	    $this->_specificity = $specificity;
	    $this->_styles = $styles;
	}


	// ********************** Common Methods ********************** //

    /**
     * This model converted into a CSS entry.
     * @method toString
     * @return {String} A CSS entry.
     * @public
     */
	public function toString() {
	    $s = '';

	    if (0 < sizeof($this->_styles)) {
	        $sb = array();
	        $i = 0;

	        foreach ($this->_styles as $k=>$v) {
	            $sb[$i] = $k . ': ' . $v;
	            $i += 1;
	        }

	        $s = 1 < sizeof($sb) ? implode(';
    ', $sb) : $sb[0] . ';';
	    }

	    return $this->_specificity . ' {
    ' . $s . '
}';
	}


	// ********************** Simple Getter/Setter Methods ********************** //

	public function getData() {return $this->_data;}
	public function setData($data) {$this->_data = $data;}

	public function getEval() {return $this->_eval;}
	public function setEval($eval) {$this->_eval = $eval;}

	public function getKey() {return $this->_key;}
	public function setKey($key) {$this->_key = $key;}

	public function getStyles() {return $this->_styles;}
	public function setStyles($s) {$this->_styles = $s;}


	// ********************** Business Methods ********************** //

	private function getStyle($style, $preg) {
	    if (array_key_exists($style, $this->_styles)) {
	        $value = $this->_styles[$style];
	        return $preg ? preg_replace('/' . $preg . '/', '', $value) : $value;
	    }

	    return '';
	}

	public function getUrl($style, $preg='') {
	    return preg_replace('/.*url\((.*)\).*/', '$1', $this->getStyle($style, $preg));
	}

	public function getBackground($preg='') {
	    return $this->getStyle('background', $preg);
	}

	public function getBackgroundColor($stripPound=false) {
	    return preg_replace('/.*(#)([0-9A-F]+).*/s', ($stripPound ? '' : '#') . '$2', $this->getBackground(false));
	}

	public function getBackgroundUrl($preg='') {
	    return $this->getUrl('background', $preg);
	}

	public function getColor($stripPound=false) {
	    return $this->getStyle('color', $stripPound ? '#' : '');
	}

    /**
     * Updates the style to the provided value.
     * @method updateStyle
	 * @param style {String} Required. The style name.
	 * @param value {String} Requied. The values of that CSS entry.
     * @public
     */
	public function updateStyle($style, $value) {
	    $this->_styles[$style] = $value;
	}
}