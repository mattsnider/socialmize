<?php

import('project.model.ModelBase');

/**
 * MessageBoard.php is used to manage message board model.
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
 * @package    project.model
 * @author     Matt Snider <mattsniderppl@gmail.com>
 * @copyright  2007-2012 Matt Snider, LLC
 * @license    http://www.php.net/license/3_0.txt  PHP License 3.0
 * @version    CVS: $Id:$
 * @since      File available since release 1.0
 */

class MessageBoard extends ModelBase {
	

	// ********************** Constructor Methods ********************** //
	
	/**
	 * Instantiation function for a MessageBoard model.
	 * @method MessageBoard
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
     * Returns the delete anchor tag HTML for the Message Board.
     * @method getAnchorDeleteHTML
     * @return {String} The HTML for the Message Board delete anchor.
     * @access Public
     * @since Release 1.0
     */
	public function getAnchorDeleteHTML() {
	    return '<a href="confirm.action?' . c('QUERY_KEY_MESSAGE_ID') . '=' . $this->getId() . '&' .
	    c('QUERY_KEY_KEY') . '=' . $this->getSearchable()->getKey() . '&' . c('QUERY_KEY_TASK') . '=messageBoardDelete">delete message</a>';
	}

	public function setCreator($o) {$this->_creator = $o;}
	public function getCreator() {return $this->_creator;}

    /**
     * Returns the proper original id for the hidden input fields in the view; original if set, otherwise DB PK of 'this'.
     * @method getInputOirginalId
     * @return {Integer} The value for original id input tag.
     * @access Public
     * @since Release 1.0
     */
	public function getInputOriginalId() {
	    return $this->getOriginalId() ? $this->getOriginalId() : $this->getId();
    }

    /**
     * Returns a shorter version of the body.
     * @method getShortBody
     * @return {String} The body, limited to 300 characters (including <br/>.
     * @access Public
     * @since Release 1.0
     */
	public function getShortBody() {
	    return getEllipses($this->getBodyBr(), 300);
	}

    /**
     * Returns a shorter version of the title.
     * @method getShortTitle
     * @return {String} The title, limited to thirty characters.
     * @access Public
     * @since Release 1.0
     */
	public function getShortTitle() {
	    return getEllipses($this->getTitle(), 30);
	}

	
	// ********************** Common Methods ********************** //


	// ********************** Simple Getter/Setter Methods ********************** //
	
	public function setBody($s) {$this->_body = $s;}
	public function getBody() {return $this->_body;}
	public function getBodyBr() {return $this->newlineToBr($this->_body);}

	public function setCreatorId($n) {$this->_creatorSearchableId = $n;}
	public function getCreatorId() {return $this->_creatorSearchableId;}

	public function setOriginalId($n) {$this->_originalId = $n;}
	public function getOriginalId() {return $this->_originalId;}

	public function setParentId($n) {$this->_parentId = $n;}
	public function getParentId() {return $this->_parentId;}

	public function setSearchable($o) {$this->_searchable = $o;}
	public function getSearchable() {return $this->_searchable;}

	public function setSearchableId($n) {$this->_searchableId = $n;}
	public function getSearchableId() {return $this->_searchableId;}

	public function setTitle($s) {$this->_title = $s;}
	public function getTitle() {return $this->_title;}


	// ********************** Private Variables ********************** //

	/**
	 * The content of the message board.
	 * @name _body
     * @var {String}
     * @access Private
     * @since Release 1.0
	 */
	var $_body = '';

	/**
	 * The creator Searchable DBO.
	 * @name _creator
     * @var {Searchable}
     * @access Private
     * @since Release 1.0
	 */
	var $_creator = null;

	/**
	 * The creating Searchable DB PK.
	 * @name _creatorSearchableId
     * @var {Integer}
     * @access Private
     * @since Release 1.0
	 */
	var $_creatorSearchableId = 0;

	/**
	 * The insert key used to identify the message board.
	 * @name _ikey
     * @var {String}
     * @access Private
     * @since Release 1.0
	 */
	var $_ikey = '';

	/**
	 * The message board DB PK of the original message board post for thread.
	 * @name _originalId
     * @var {Integer}
     * @access Private
     * @since Release 1.0
	 */
	var $_originalId = 0;

	/**
	 * The message board DB PK of the owning message board.
	 * @name _parentId
     * @var {Integer}
     * @access Private
     * @since Release 1.0
	 */
	var $_parentId = 0;

	/**
	 * The owning Searchable DB PK.
	 * @name _searchableId
     * @var {Integer}
     * @access Private
     * @since Release 1.0
	 */
	var $_searchableId = 0;

	/**
	 * The owning Searchable.
	 * @name _searchable
     * @var {Searchable}
     * @access Private
     * @since Release 1.0
	 */
	var $_searchable = null;

	/**
	 * The message board title.
	 * @name _title
     * @var {String}
     * @access Private
     * @since Release 1.0
	 */
	var $_title = '';


	// ********************** Static Variables ********************** //
}

?>