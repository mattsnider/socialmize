<?php

import('project.model.ModelBase');

/**
 * Post.php is used to manage post model.
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

class Post extends ModelBase {
	

	// ********************** Constructor Methods ********************** //

	/**
	 * Instantiation function for a Post model.
	 * @method Post
     * @access Public
     * @since  Release 1.0
     * @constructor
	 */
	public function __construct($id=0) {
		parent::__construct($id);
	}

	
	// ********************** Common Methods ********************** //

    /**
     * Copy the desirable post values into 'this'.
     * @method copyArticle
     * @param o {Post} Required. The object to copy.
     * @access Public
     * @since Release 1.0
     */
	public function copyArticle($o) {
	    $this->setBody($o->getBody());
	    $this->setCreated($o->getCreated());
	    $this->setId($o->getId());
	    $this->setPoster($o->getPoster());
	    $this->setPosterId($o->getPosterId());
	    $this->setSearchableId($o->getSearchableId());
	}


	// ********************** Simple Getter/Setter Methods ********************** //
	
	public function setBody($s) {$this->_body = $s;}
	public function getBody() {return $this->_body;}
	public function getBodyBr() {return $this->newlineToBr($this->_body);}

	public function setPosterId($n) {$this->_posterId = $n;}
	public function getPosterId() {return $this->_posterId;}

	public function setSearchableId($n) {$this->_searchableId = $n;}
	public function getSearchableId() {return $this->_searchableId;}


	// ********************** Accessor Methods ********************** //

	public function setPoster($o) {$this->_poster = $o;}
	public function getPoster() {return $this->_poster;}
	
	// ********************** Business Methods ********************** //

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
		$this->setPosterId($rs->getInt('poster_id'));
		$this->setSearchableId($rs->getInt('searchable_id'));
	}


	// ********************** Private Variables ********************** //

	/**
	 * The content of the post.
	 * @name _body
     * @var {String}
     * @access Private
     * @since Release 1.0
	 */
	var $_body = '';

	/**
	 * The Searchable Object that created this post.
	 * @name _poster
     * @var {Searchable}
     * @access Private
     * @since Release 1.0
	 */
	var $_poster = null;

	/**
	 * The Searchable Object DB PK that created this post.
	 * @name _posterId
     * @var {Number}
     * @access Private
     * @since Release 1.0
	 */
	var $_posterId = 0;

	/**
	 * The Searchable Object DB PK that received this post.
	 * @name _searchableId
     * @var {Number}
     * @access Private
     * @since Release 1.0
	 */
	var $_searchableId = 0;


	// ********************** Static Variables ********************** //

	/**
	 * The SQL statement to select a post.
     * @property SQL_SELECT
     * @var {String} The select for a post.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_SELECT = '`SW`.`body`, `SW`.`created`, `SW`.`id`, `SW`.`poster_id`, `SW`.`searchable_id`';

	/**
	 * The SQL statement to reference the `post` table.
     * @property SQL_TABLE
     * @var {String} The `news` table.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_TABLE = '`searchable_wall`';

	/**
	 * The SQL statement to reference the `post` table for selecting.
     * @property $SQL_TABLE_AS
     * @var {String} The `news` table.
     * @access Public
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SQL_TABLE_AS = '`searchable_wall` AS `SW`';
}