<?php

/**
 * XMLParser.php is used to simply parse XML docs.
 *
 * Iterates through an xml document or file and creates a processable array representing the xml.
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

class XMLParser {


	/**
	 *	The reference to the native php xml parser
     * 	@var parser
     * 	@access private
	 */
	var $parser = null;


	/**
	 *	Array for managing entire xml tree
     * 	@var data
     * 	@access private
	 */
	var $data = array();


	/**
	 *	Array for managing current depth xml elements
     * 	@var datas
     * 	@access private
	 */
	var $datas = array();

	/**
	 *	The constructor to create the xml parse manager
	 *	@constructor
	 */
	function XMLParser() {
		// create the parser
		$this->parser = xml_parser_create('UTF-8');

		// attach the scope of the parser to this
		xml_set_object($this->parser, $this);

		// have parser skip white spaces
		xml_parser_set_option($this->parser, XML_OPTION_SKIP_WHITE, 1);

		// attach the parser element handler callbacks to tag_open and tag_close
		xml_set_element_handler($this->parser, 'tag_open', 'tag_close');

		// attach the parser data handler callback to cdata
		xml_set_character_data_handler($this->parser, 'cdata');
	}


	/**
	 *	Parses an xml file
	 *	@param	file {String} the location of an xml file
	 *	@public
	 */
	public function parseFile($file) {
		// is data a file
		if (file_exists($file)) {
			if (! ($fp = fopen($file, 'r'))) {
				die('could not open XML input file ' . $file);
			}

			// iterate through the lines in the file and psuh them into xml parser
			while ($data = fread($fp, 4096)) {
				if (! xml_parse($this->parser, $data, feof($fp))) {
					$this->handleParseError();
				}
			}

			$this->data = $this->data['child'];
		}
	}


	/**
	 *	Parses an xml string
	 *	@param	data {String} a string of XML data
	 *	@public
	 */
	public function parseXml($data) {
		if (! xml_parse($this->parser, $data)) {
			$this->data = array();
			$this->handleParseError();
		}
		else {
			$this->data = $this->data['child'];
		}
	}


	/**
	 *	Frees the parser from memory. Should always be called once you have finished parsing all xml docs.
	 *		Not included in the parser functions, because one may want to parse multiple xml files.
	 *	@public
	 */
	public function freeParser() {
		xml_parser_free($this->parser);
	}


	/**
	 *	Returns the data array
	 *	@return	{Array} the xml document as an Array
	 *	@public
	 */
	public function getData() {
		return $this->data;
	}


	/**
	 *	Converts the array into a human readable string
	 *	@public
	 */
	public function toString() {
		print_r($this->data);
	}


	/**
	 *	Terminates the operation and prints a helpful debug message
	 *	@private
	 */
	private function handleParseError() {
		die(sprintf("XML error: %s at line %d", xml_error_string(xml_get_error_code($this->parser)),
												xml_get_current_line_number($this->parser)));
	}


	/**
	 *	Handles the opening of a tag, moving the array down to the next depth level
	 *	@param	parser {xml_parser} the reference to the php native xml parser
	 *	@param	tag {String} the string tag name
	 *	@param	attr {Array} a list of attributes of this node
	 *	@private
	 */
	private function tag_open($parser, $tag, $attr) {
		$this->data['child'][$tag][] = array('data' => '', 'attr' => $attr, 'child' => array());
		$this->datas[] =& $this->data;
		$this->data =& $this->data['child'][$tag][count($this->data['child'][$tag]) - 1];
	}


	/**
	 *	Injects the content of the node into the array
	 *	@param	parser {xml_parser} the reference to the php native xml parser
	 *	@param	cdata {String} the tag content
	 *	@private
	 */
	private function cdata($parser, $cdata) {
		$this->data['data'] .= $cdata;
	}


	/**
	 *	Handles the closing of a tag, moving the array up to the previous depth level
	 *	@param	parser {xml_parser} the reference to the php native xml parser
	 *	@param	tag {String} the string tag name
	 *	@private
	 */
	private function tag_close($parser, $tag) {
		$this->data =& $this->datas[count($this->datas)-1];
		array_pop($this->datas);
	}
}

?>