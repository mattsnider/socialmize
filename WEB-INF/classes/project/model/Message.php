<?php

import('project.model.ModelBase');
import('project.model.MessageSearchable');

def('QUERY_KEY_OUT', 'out');

// TODO: the message state should be represented on this object, not special searchables

/**
 * Message.php is used to manage message model.
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

class Message extends ModelBase {

	// ********************** Constructor Methods ********************** //

	/**
	 * Instanciation function for a Member model.
	 * @method Network
     * @access Public
     * @since  Release 1.0
     * @constructor
	 */
	public function __construct($id=0) {
		parent::__construct($id);

		if (! $id) {
			$this->_thread = md5(time() + rand());
		}
	}


	// ********************** Business Methods ********************** //

	/**
	 * Article setter/getter for expire, piggy-backs off of the message timereplied variable
	 */
	public function setExpires($datetime) {$this->_timereplied = $datetime;}
	public function getExpires() {return c('defaultTime') === $this->_timereplied? '': $this->_timereplied;}
	public function getExpiresDT() {return $this->getExpires()? convertDatetime($this->getExpires()): 'unknown';}


	/**
	 * The message body as a length limited string, ' ' tokenized to prevent splitting words
	 *
	 * @method getBodySnippet
	 * @return {string}	the message body limited to 50 characters
	 * @access public
	 * @since Release 1.0
	 */
	public function getBodySnippet() {
		return substrToLastToken($this->_body, 50);
	}

	/**
	 * True, when the body length exceeds snippet size
	 *
	 * @return {boolean} true, when len < 50
	 * @access public
	 * @since Release 1.0
	 */
	public function showSnippet() {return 50 < strlen($this->_body);}
	public function getShowSnippet() {return $this->showSnippet();}

	public function isNew() {
		return Message::$STATUS_UNREAD === $this->_status && c('defaultTime') === $this->_timereplied && c('defaultTime') === $this->_timeread;
	}


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
			case 'E':
				return 'event';
				break;

			case 'S':
				return 'seminar';
				break;

			default:
				return 'news';
				break;
		}
	}


	// ********************** Simple Getter/Setter Methods ********************** //

	public function setBody($s) {$this->_body = $s;}
	public function getBody() {return $this->_body;}
	public function getBodyBr() {return inject_anchor_tags($this->newlineToBr($this->_body));}

	public function getStatus() {return $this->_recipient->getStatus();}

	public function setSubject($s) {$this->_subject = $s;}
	public function getSubject() {return $this->_subject;}

	public function setThread($s) {$this->_thread = $s;}
	public function getThread() {return $this->_thread;}

	public function setType($c) {$this->_type = $c;}
	public function getType() {return $this->_type;}

	public function setRecipient($o) {$this->_recipient = $o;}
	public function getRecipient() {return $this->_recipient;}

	public function setSender($o) {$this->_sender = $o;}
	public function getSender() {return $this->_sender;}


	// ********************** Private Variables ********************** //

	
	/**
	 * The message content
	 *
     * @var string
     * @access private
	 */
	var $_body = '';

	
	/**
	 * The message subject
	 *
     * @var string
     * @access private
	 */
	var $_subject = '';

	
	/**
	 * The thread that message belongs to.
	 *
     * @var string
     * @access private
	 */
	var $_thread = '';


	/**
	 * The type of message; N=News, E=Event, S=Seminar.
	 *
     * @var char
     * @access private
	 */
	var $_type = 'N';


	/**
	 * The Searchable Object that receiveds this Message.
	 *
     * @var Searchable
     * @access private
	 */
	var $_recipient = null;


	/**
	 * The Searchable Object that sent this Message.
	 *
     * @var Searchable
     * @access private
	 */
	var $_sender = null;


	// ********************** Static Variables ********************** //


	/**
	 * Status code when the message should be in the 'unread' state
	 *
     * @var STATUS_UNREAD
     * @access public static
	 */
	public static $STATUS_UNREAD = 'unread';


	/**
	 * Status code when the message should be in the 'read' state
	 *
     * @var STATUS_READ
     * @access public static
	 */
	public static $STATUS_READ = 'read';


	/**
	 * Status code when the message should be in the 'replied' state
	 *
     * @var STATUS_REPLIED
     * @access public static
	 */
	public static $STATUS_REPLIED = 'replied';


	/**
	 * Status code when the message should be in the 'deleted' state, we keep messages around in case the user makes a mistake
	 *
     * @var STATUS_DELETED
     * @access public static
	 */
	public static $STATUS_DELETED = 'deleted';


	/**
	 * Status code when the message indefined
	 *
     * @var STATUS_INVALID
     * @access public static
	 */
	public static $STATUS_INVALID = 'invalid';
}

?>