<?php

import('project.model.Searchable');

/**
 * MessageSearchable.php is used to manage users associated with message model.
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
 * @since      File available since Release 0.5
 */

class MessageSearchable extends Searchable {


	// ********************** Constructor Methods ********************** //

	/**
	 * Instantiation function for a MessageSearchable model.
	 * @method MessageSearchable
	 * @param  $id {Integer} Optional. The DB PK.
     * @access Public
     * @since  Release 1.0
     * @constructor
	 */
	public function __construct($id=0) {
		parent::__construct($id);
	}


	// ********************** Business Methods ********************** //


	
	// ********************** Common Methods ********************** //
	
	public function toString() {
		return parent::toString() . '&deleted=' . $this->_timedeleted . '&isSender=' . $this->_isSender . '&messageId=' . $this->_messageId . '&hidden=' . $this->_timehidden .
			   '&invalid=' . $this->_timeinvalid . '&read=' . $this->_timeread . '&replied=' . $this->_timereplied .
			   '&status=' . $this->_status . '&unread=' . $this->_timeunread;
	}


	// ********************** Simple Getter/Setter Methods ********************** //

	public function setMessageId($n) {$this->_messageId = $n;}
	public function getMessageId() {return $this->_messageId;}

	public function setIsSender($b) {$this->_isSender = $b;}
	public function getIsSender() {return $this->_isSender;}
	public function isSender() {return $this->getIsSender();}
	 
	public function setStatus($s) {$this->_status = $s;}
	public function getStatus() {return $this->_status;}

	public function setTimeDeleted($d) {$this->_timedeleted = $d;}
	public function getTimeDeleted() {return $this->_timedeleted;}

	public function setTimeHidden($d) {$this->_timehidden = $d;}
	public function getTimeHidden() {return $this->_timehidden;}

	public function setTimeInvalid($d) {$this->_timeinvalid = $d;}
	public function getTimeInvalid() {return $this->_timeinvalid;}

	public function setTimeRead($d) {$this->_timeread = $d;}
	public function getTimeRead() {return $this->_timeread;}

	public function setTimeReplied($d) {$this->_timereplied = $d;}
	public function getTimeReplied() {return $this->_timereplied;}

	public function setTimeUnread($d) {$this->_timeunread = $d;}
	public function getTimeUnread() {return $this->_timeunread;}


	// ********************** Private Variables ********************** //


	/**
	 * The message DB PK.
	 *
     * @var integer
     * @access private
	 */
	var $_messageId = 0;


	/**
	 * The message is for an outbox.
	 *
     * @var boolean
     * @access private
	 */
	var $_isSender = false;


	/**
	 * The date this message was deleted.
	 *
     * @var datetime
     * @access private
	 */
	var $_timedeleted = '0000-00-00 00:00:00';


	/**
	 * The date this message was hidden.
	 *
     * @var datetime
     * @access private
	 */
	var $_timehidden = '0000-00-00 00:00:00';


	/**
	 * The date this message was invalidated.
	 *
     * @var datetime
     * @access private
	 */
	var $_timeinvalid = '0000-00-00 00:00:00';


	/**
	 * The date this message was read.
	 *
     * @var datetime
     * @access private
	 */
	var $_timeread = '0000-00-00 00:00:00';


	/**
	 * The date this message was replied.
	 *
     * @var datetime
     * @access private
	 */
	var $_timereplied = '0000-00-00 00:00:00';


	/**
	 * The date this message was marked as new.
	 *
     * @var datetime
     * @access private
	 */
	var $_timeunread = '0000-00-00 00:00:00';


	// ********************** Static Variables ********************** //
}

?>