<?php

import('project.model.ModelBase');

def('QUERY_KEY_MESSAGE_BOARD', 'board');
def('QUERY_KEY_RELATED', 'related');
def('QUERY_KEY_WALL', 'wall');


// local constants

def('defaultLogoImageUri', '/images/logos/missingLogo.png');

def('defaultGroupImageUri', '/images/searchables/blank_group.gif');
def('defaultGroupThumbUri', '/images/thumbs/blank_group_thumb.gif');

def('defaultUserImageUri', '/images/searchables/blank_user.gif');
def('defaultUserThumbUri', '/images/thumbs/blank_user_thumb.gif');


/**
 * Searchable.php is an interface that should be extended by any Object type used in conjunction with SearchListAction
 *
 * PHP versions 4 and 5
 *
 * LICENSE: This source file is subject to version 3.0 of the PHP license
 * that is available through the world-wide-web at the following URI:
 * http://www.php.net/license/3_0.txt.  If you did not receive a copy of
 * the PHP License and are unable to obtain it through the web, please
 * send a note to license@php.net so we can mail you a copy immediately.
 *
 * @class Searchable
 * @category   Searchable
 * @package	project.model.Searchable
 * @author	 Matt Snider <mattsniderppl@gmail.com>
 * @copyright  2007-2012 Matt Snider, LLC
 * @license	http://www.php.net/license/3_0.txt  PHP License 3.0
 * @version	CVS: $Id:$
 * @since	  Release 1.0
 */
class Searchable extends ModelBase {


	// ********************** Constructor Methods ********************** //

	/**
	 * Instanciation function for a Searchable model.
	 * @method Searchable
	 * @param type {String} the Searchable type
	 * @access public
	 * @since Release 1.0
	 */
	public function __construct($type = 'user') {
		parent::__construct();
		$this->_type = $type;
	}


	// ********************** Rendering Methods ********************** //

	/**
	 * Create the User name HTML linking to their profile; handles privacy.
	 * @method getNameHTML
	 * @return {String} The name anchor HTML.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getNameHTML() {
		return (! $this->isPrivate() || $this->_isMember) && 1 !== $this->_id ?
				'<a class="action-profile" href="profile.action?' . c('QUERY_KEY_KEY') . '=' . $this->_key . '">' . $this->_name . '</a>' : $this->_name;
	}

	/**
	 * Returns the User thumbnail HTML linking to their profile.
	 * @method getThumbnailHTML
	 * @return {String} Required. The thumbnail HTML.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getThumbnailHTML() {
		$img = '<img alt="Thumbnail of ' . $this->_name . '" src="/assets' . $this->_uriThumb . '" id="thumb-' . $this->_key . '" />';
		return ($this->isOpen() || $this->_isMember) && 1 !== $this->_id ? '<a href="profile.action?' . c('QUERY_KEY_KEY') . '=' . $this->_key . '">' . $img . '</a>' : $img;
	}


	// ********************** Business Methods ********************** //

	/**
	 * Retrieves the User DBOs with administrative access for Searchable DBO.
	 * @method getAdmins
	 * @return {User} The admin User DBOs of Searchable.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getAdmins() { return $this->_admins; }

	/**
	 * Retrieves the number of members in Searchable.
	 * @method getMembern
	 * @return {Integer} The number of User members of Searchable.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getMembern() { return $this->_membern; }

	/**
	 * Retrieves the User DBOs for members of Searchable.
	 * @method getMembers
	 * @return {User} The member User DBOs of Searchable.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getMembers() { return $this->_members; }

	/**
	 * Return an array of related Seachable DBOs.
	 * @method getRelated
	 * @return {Array} An array of related Seachable DBOs.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getRelated() { return $this->_related; }

	/**
	 * Returns true when this profile has a message board.
	 * @method hasMessageBoard
	 * @return {Boolean} True, if the Profile Feature (Message Board) is available on this Profile.
	 * @access Public
	 * @since Release 1.0
	 */
	public function hasMessageBoard() { return ($this->_features & Searchable::$BITMASK_MESSAGE_BOARD); }

	public function getHasMessageBoard() { return $this->hasMessageBoard(); }

	/**
	 * Evaluate if the bitmask is set.
	 * @method hasPendingBit
	 * @access Public
	 * @return {Boolean} The bitmask is set.
	 * @since Release 1.0
	 */
	public function hasPendingBit($bitmask) { return bit_has($this->_pendingBit, $bitmask); }

	public function addPendingBit($bitmask) { bit_add($this->_pendingBit, $bitmask); }

	public function removePendingBit($bitmask) { bit_remove($this->_pendingBit, $bitmask); }

	/**
	 * Returns true when this profile has a related section.
	 * @method hasRelated
	 * @return {Boolean} True, if the Profile Feature (Related) is available on this Profile.
	 * @access Public
	 * @since Release 1.0
	 */
	public function hasRelated() { return ($this->_features & Searchable::$BITMASK_RELATED); }

	public function getHasRelated() { return $this->hasRelated(); }

	/**
	 * Returns true when this profile has a wall section.
	 * @method hasWall
	 * @return {Boolean} True, if the Profile Feature (Wall) is available on this Profile.
	 * @access Public
	 * @since Release 1.0
	 */
	public function hasWall() { return ($this->_features & Searchable::$BITMASK_WALL); }

	public function getHasWall() { return $this->hasWall(); }

	/**
	 * Retrieves the authorized User administration access of Searchable.
	 * @method isAdmin
	 * @return {Boolean} True, when authorized User is admin of Searchable.
	 * @access Public
	 * @since Release 1.0
	 */
	public function isAdmin() { return $this->_isAdmin; }

	public function getIsAdmin() { return $this->_isAdmin; }

	public function setIsAdmin($isAdmin) { $this->_isAdmin = $isAdmin; }

	/**
	 * Retrieves the authorized User member status for Searchable.
	 * @method isMember
	 * @return {Boolean} True, when authorized User is member of Searchable.
	 * @access Public
	 * @since Release 1.0
	 */
	public function isMember() { return $this->_isMember; }

	public function getIsMember() { return $this->_isMember; }

	/**
	 * Returns true when the related feature is public, meaning non-members can use it.
	 * @method isRelatedPublic
	 * @return {Boolean} True, if the Profile Feature (Related) is public.
	 * @access Public
	 * @since Release 1.0
	 */
	public function isRelatedPublic() { return ($this->_featureAccess & Searchable::$BITMASK_RELATED); }

	public function getIsRelatedPublic() { return $this->isRelatedPublic(); }

	/**
	 * Returns true when the message board feature is public, meaning non-members can use it.
	 * @method isMessageBoardPublic
	 * @return {Boolean} True, if the Profile Feature (MessageBoard) is public.
	 * @access Public
	 * @since Release 1.0
	 */
	public function isMessageBoardPublic() { return ($this->_featureAccess & Searchable::$BITMASK_MESSAGE_BOARD); }

	public function getIsMessageBoardPublic() { return $this->isMessageBoardPublic(); }

	/**
	 * Returns true when the wall feature is public, meaning non-members can use it.
	 * @method isWallPublic
	 * @return {Boolean} True, if the Profile Feature (Wall) is public.
	 * @access Public
	 * @since Release 1.0
	 */
	public function isWallPublic() { return ($this->_featureAccess & Searchable::$BITMASK_WALL); }

	public function getIsWallPublic() { return $this->isWallPublic(); }

	/**
	 * Retrieves the authorized User asuper dministration access of Searchable.
	 * @method isSuperAdmin
	 * @return {Boolean} True, when authorized User is asuper admin of Searchable.
	 * @access Public
	 * @since Release 1.0
	 */
	public function isSuperAdmin() { return $this->_isSuperAdmin; }

	public function getIsSuperAdmin() { return $this->_isSuperAdmin; }

	public function setIsSuperAdmin($isSuperAdmin) { $this->_isSuperAdmin = $isSuperAdmin; }

	/**
	 * Attaches the User DBOs with administrative access for Searchable DBO.
	 * @method setAdmins
	 * @param o {User} Required. The administration User DBOs of Searchable.
	 * @access Public
	 * @since Release 1.0
	 */
	public function setAdmins($a) { $this->_admins = $a; }

	/**
	 * Sets the owning Searchable member, admin, and superAdmin status for an active Searchable.
	 * @method setIsMember
	 * @param o {Object} Required. A collection of statuses: 0 = a member, 1 = an administrator, 2 = a super administrator.
	 * @access Public
	 * @since Release 1.0
	 */
	public function setIsMember($o) {
		$size = sizeof($o);
		$this->_isMember = $o && 0 < $size && $o[0];
		$this->_isAdmin = $o && 1 < $size && $o[1];
		$this->_isSuperAdmin = $o && 2 < $size && $o[2];
	}

	/**
	 * Attaches the User DBOs for members of and number of members in Searchable.
	 * @method setMembers
	 * @return a {Array} Required. The member User DBOs of Searchable; set to array() when just needed the member count.
	 * @return n {Integer} Required. The number of User members of Searchable.
	 * @access Public
	 * @since Release 1.0
	 */
	public function setMembers($a, $n) {
		$this->_members = $a;
		$this->_membern = $n;
	}

	// set/get the parent ID meta data
	public function setParentId($parentId) { $this->_parentId = $parentId; }

	public function getParentId() { return $this->_parentId; }

	/**
	 * Attach the related Searchable DBOs.
	 * @method setRelated
	 * @param a {Array} Required. An array of related Searchable DBOs.
	 * @access Public
	 * @since Release 1.0
	 */
	public function setRelated($a) { $this->_related = $a; }


	/**
	 * Returns the simple name represented by the access ID
	 *
	 * @method getAccessName
	 * @return {String} the name of access level
	 * @access public
	 * @since release 1.0
	 */
	public function getAccessName() {
		switch ($this->_access) {
			case Searchable::$ACCESS_OPEN:
				return 'Open';

			case Searchable::$ACCESS_CLOSED:
				return 'Closed';

			default:
				return 'Private';
		}
	}

	/**
	 * Fetch the appropriate member string.
	 * @method getMemberString
	 * @return {String} The member name.
	 * @access public
	 * @since release 1.0
	 */
	public function getMemberString() {
		return $this->isUser() ? 'friend' : 'member';
	}

	/**
	 * Create a url for the Searchable profile.
	 * @method getProfileUrl
	 * @return {String} The url of the searchable profile.
	 * @access public
	 * @since release 1.0
	 */
	public function getProfileUrl() {
		return 'profile.action?key=' . $this->_key;
	}


	/**
	 * Test if the group is of type closed.
	 *
	 * @method isClosed
	 * @return {Boolean} True, when group is closed access.
	 * @access Public
	 * @since Release 1.0
	 */
	public function isClosed() { return Searchable::$ACCESS_CLOSED === $this->_access; }

	public function getIsClosed() { return $this->isClosed(); }

	/**
	 * Test if the type is a group.
	 * @method isGroup
	 * @return {Boolean} True, when searchable is a group.
	 * @access Public
	 * @since Release 1.0
	 */
	public function isGroup() { return Searchable::$TYPE_GROUP == $this->_type; }

	public function getIsGroup() { return $this->isGroup(); }

	/**
	 * Test if the type is a network.
	 * @method isNetwork
	 * @return {Boolean} True, when searchable is a network.
	 * @access Public
	 * @since Release 1.0
	 */
	public function isNetwork() { return Searchable::$TYPE_NETWORK == $this->_type; }

	public function getIsNetwork() { return $this->isNetwork(); }


	/**
	 * Test if the group is of type open.
	 *
	 * @method isOpen
	 * @return {Boolean} True, when group is open access.
	 * @access Public
	 * @since Release 1.0
	 */
	public function isOpen() { return Searchable::$ACCESS_OPEN == $this->_access; }

	public function getIsOpen() { return $this->isOpen(); }

	/**
	 * Test if the group is of type open.
	 * @method isPending
	 * @return {Boolean} True, when group is open access.
	 * @access Public
	 * @since Release 1.0
	 */
	public function isPending() { return Searchable::$STATUS_PENDING == $this->_status; }

	public function getIsPending() { return $this->isPending(); }


	/**
	 * Test if the group is of type Private.
	 *
	 * @method isPrivate
	 * @return {Boolean} True, when group is Private access.
	 * @access Public
	 * @since Release 1.0
	 */
	public function isPrivate() { return Searchable::$ACCESS_PRIVATE == $this->_access; }

	public function getIsPrivate() { return $this->isPrivate(); }

	/**
	 * Test if the type is a user.
	 * @method isUser
	 * @return {Boolean} True, when searchable is a user.
	 * @access Public
	 * @since Release 1.0
	 */
	public function isUser() { return Searchable::$TYPE_USER === $this->_type; }

	public function getIsUser() { return $this->isUser(); }

	/**
	 * Reads the result set, filling this object.
	 * @method readResultSet
	 * @param rs {ResultSet} Required. The result set to read.
	 * @access Public
	 * @since Release 1.0
	 */
	public function readResultSet($rs) {
		parent::readResultSet($rs);
		$this->setAccess($rs->getString('access'));
		$this->setEmail($rs->getString('email'));
		$this->setFeatures($rs->getInt('features'));
		$this->setFeatureAccess($rs->getInt('feature_access'));
		$this->setKey($rs->getString('key'));
		$this->setName($rs->getString('name'));
		$this->setNotify($rs->getBoolean('notify'));
		$this->setPendingBit($rs->getInt('pending_bit'));
		$this->setType($rs->getString('type'));
		$this->setUriImage($rs->getString('uri_image'));
		$this->setUriThumb($rs->getString('uri_thumb'));

		if (!$this->getId() && $rs->getInt('searchable_id')) {
			$this->setId($rs->getInt('searchable_id'));
		}
	}


	// ********************** Common Methods ********************** //

	// todo: these should be STATIC
	/**
	 * Copy the desirable searchable values into 'this'.
	 * @method copySearchable
	 * @param S {Searchable} Required. The object to copy.
	 * @access Public
	 * @since Release 1.0
	 */
	public function copySearchable($S) {
		$this->setAccess($S->getAccess());
		$this->setCreated($S->getCreated());
		$this->setEmail($S->getEmail());
		$this->setFeatures($S->getFeatures());
		$this->setFeatureAccess($S->getFeatureAccess());
		$this->setId($S->getId());
		$this->setKey($S->getKey());
		$this->setModified($S->getModified());
		$this->setName($S->getName());
		$this->setNotify($S->hasNotify());
		$this->setPendingBit($S->getPendingBit());
		$this->setStatus($S->getStatus());
		$this->setType($S->getType());
		$this->setUriImage($S->getUriImage());
		$this->setUriThumb($S->getUriThumb());
	}


	// ********************** Simple Getter/Setter Methods ********************** //

	/**
	 * An accessor method to fetch the Searchable access.
	 * @method getAccess
	 * @return {String} The access level.
	 * @access Private
	 * @since Release 1.0
	 */
	public function getAccess() { return $this->_access; }

	public function setAccess($c) { $this->_access = $c; }

	public function setEmail($s) { $this->_email = $s; }

	public function getEmail() { return $this->_email; }

	public function setFeatureAccess($n) { $this->_featureAccess = $n; }

	public function getFeatureAccess() { return $this->_featureAccess; }

	public function setFeatures($n) { $this->_features = $n; }

	public function getFeatures() { return $this->_features; }

	public function getKey() { return $this->_key; }

	public function setKey($s) { $this->_key = $s; }

	public function getName() { return $this->_name; }

	public function setName($s) { $this->_name = $s; }

	public function setNotify($b) { $this->_notify = $b; }

	public function hasNotify() { return $this->_notify; }

	public function getHasNotify() { return $this->_notify; }

	public function getPendingBit() { return $this->_pendingBit; }

	public function setPendingBit($n) { $this->_pendingBit = $n; }

	public function getToken() { return $this->_token; }

	public function setToken($token) { $this->_token = $token; }

	public function getType() { return $this->_type; }

	public function setType($s) { $this->_type = $s; }

	public function getUriImage() { return $this->_uriImage; }

	public function setUriImage($s) { $this->_uriImage = $s; }

	public function getUriThumb() { return $this->_uriThumb; }

	public function setUriThumb($s) { $this->_uriThumb = $s; }

	public function getRawImage() { return '/assets' . str_replace('thumbs', 'raw', $this->_uriThumb); }

	// ********************** Private Variables ********************** //

	/**
	 * The Searchable access level.
	 * @name _access
	 * @var {Char} The access level; possible values (C, O, P) // todo: should change to rxw
	 * @access Private
	 * @since Release 1.0
	 */
	var $_access = 'O';

	/**
	 * A collection of the administrators of Searchable.
	 * @name _admins
	 * @var {Array} A collection of Searchable DBOs.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_admins = array();

	/**
	 * The email address of the Searchable.
	 * @name _email
	 * @var {String} An email address.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_email = '';

	/**
	 * The binary value to store which features are accessable by non-members.
	 * @name _featureAccess
	 * @var {Integer} Binary value for feature access.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_featureAccess = 0;

	/**
	 * The binary value to store which features are turned on.
	 * @name _features
	 * @var {Integer} Binary value for features.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_features = 0;

	/**
	 * The provided Searchable has administration access to a second Searchable.
	 * @name isAdmin
	 * @var {Boolean} True, when administrator.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_isAdmin = false;

	/**
	 * The provided Searchable is a member of a second Searchable: member of Groups, friend of User, ... .
	 * @name _isMember
	 * @var {Boolean} True, when member.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_isMember = false;

	/**
	 * The provided Searchable is a super administrator of a second Searchable: member of Groups, friend of User, ... .
	 * @name _isSuperAdmin
	 * @var {Boolean} True, when super administrator.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_isSuperAdmin = null;

	/**
	 * The hashkey used to identify the Searchable.
	 * @name _key
	 * @var {String} Some random characters.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_key = '';

	/**
	 * The number of Searchable members.
	 * @name _membern
	 * @var {Integer} A number of members in the Searchable.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_membern = 0;

	/**
	 * A collection of members of the Searchable.
	 * @name _members
	 * @var {Array} A collection of User DBO.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_members = array();

	/**
	 * The name of the Searchable.
	 * @name _name
	 * @var {String} The name.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_name = '';

	/**
	 * User notification preference. //todo: move to a preference table
	 * @name _notify
	 * @var {Boolean} True, when turned on.
	 * @access private
	 */
	var $_notify = true;

	/**
	 * The parent of this Searchable.
	 * @name $_parentId
	 * @var {Integer} A Searchable DB PK.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_parentId = null;

	/**
	 * The reason bit for why the Searchable is pending.
	 * @name _pendingBit
	 * @var {Number} Bit value.
	 * @access private
	 */
	var $_pendingBit = 0;

	/**
	 * The a collection of related elements for this Searchable.
	 * @name _related
	 * @var {Array} Collection of related.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_related = array();

	/**
	 * Holds the Searchable type: "user", "group", ... .
	 * @name _type
	 * @var {String} An activation status.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_type = 'user';

	/**
	 * The session token, used for security purposes.
	 * @name $_token
	 * @var {String} The session token.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_token = '';

	/**
	 * The location of the profile image file.
	 * @name _uriImage
	 * @var {String} A url.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_uriImage = '';

	/**
	 * The location of the profile thumb image file.
	 * @name _uriThumb
	 * @var {String} A url.
	 * @access Private
	 * @since Release 1.0
	 */
	var $_uriThumb = '';


	// ********************** Static Variables ********************** //

	/**
	 * Access code when the searchable is in the 'closed' state.
	 * @property ACCESS_CLOSED
	 * @var {String} The 'closed' state.
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $ACCESS_CLOSED = 'C';

	/**
	 * Access code when the searchable is in the 'open' state.
	 * @property ACCESS_OPEN
	 * @var {String} The 'open' state.
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $ACCESS_OPEN = 'O';

	/**
	 * Access code when the searchable is in the 'private' state.
	 * @property ACCESS_PRIVATE
	 * @var {String} The 'private' state.
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $ACCESS_PRIVATE = 'P';

	/**
	 * The bitmask to test whether related feature is public.
	 * @property BITMASK_RELATED
	 * @var {Integer} Bitmask for feature.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $BITMASK_RELATED = 1;

	/**
	 * The bitmask to test whether message board feature is public.
	 * @property BITMASK_MESSAGE_BOARD
	 * @var {Integer} Bitmask for feature.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $BITMASK_MESSAGE_BOARD = 2;

	/**
	 * The bitmask to test whether wall feature is public.
	 * @property BITMASK_WALL
	 * @var {Integer} Bitmask for feature.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $BITMASK_WALL = 4;

	/**
	 * The bitmask to evaluate if a pending searchable requires admin approval.
	 * @property PENDING_BITMASK_APPROVAL
	 * @var {Integer} Bitmask for pending.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $PENDING_BITMASK_APPROVAL = 1;

	/**
	 * The bitmask to evaluate if a pending searchable requires email registration.
	 * @property PENDING_BITMASK_REGISTRATION
	 * @var {Integer} Bitmask for pending.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $PENDING_BITMASK_REGISTRATION = 2;

	/**
	 * The SQL statement to select a Searchable.
	 * @property SQL_SELECT
	 * @var {String} The select for a Searchable.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $SQL_SELECT = '`S`.`access`, `S`.`created`, `S`.`email`, `S`.`features`, `S`.`feature_access`, `S`.`id`, `S`.`isAdmin`, `S`.`key`, `S`.`modified`, `S`.`name`, `S`.`notify`, `S`.`pending_bit`, `S`.`status`, `S`.`type`, `S`.`uri_image`, `S`.`uri_thumb`';

	/**
	 * The SQL statement to select a Searchable by status.
	 * @property $SQL_WHERE_STATUS
	 * @var {String}
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $SQL_WHERE_STATUS = '`S`.`status` = ?';

	/**
	 * The SQL statement to select a Searchable by type.
	 * @property $SQL_WHERE_TYPE
	 * @var {String}
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $SQL_WHERE_TYPE = '`S`.`type` = ?';

	/**
	 * The SQL statement to reference the `searchable` table.
	 * @property SQL_TABLE
	 * @var {String} The `searchable` table.
	 * @access Public
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $SQL_TABLE = '`searchable` AS `S`';

	/**
	 * Status code when the searchable is in the 'active' state.
	 * @property STATUS_ACTIVE
	 * @var {String} The 'active' state.
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $STATUS_ACTIVE = 'active';

	/**
	 * Status code when the searchable is in the 'deleted' state.
	 * @property STATUS_DELETED
	 * @var {String} The 'deleted' state.
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $STATUS_DELETED = 'deleted';

	/**
	 * Status code when the searchable is in the 'inactive' state.
	 * @property STATUS_INACTIVE
	 * @var {String} The 'inactive' state.
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $STATUS_INACTIVE = 'inactive';

	/**
	 * Status code when the searchable is in the 'pending' state.
	 * @property STATUS_PENDING
	 * @var {String} The 'pending' state.
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $STATUS_PENDING = 'pending';

	/**
	 * Type when the searchable is a 'group'.
	 * @property TYPE_GROUP
	 * @var {String} The 'group' type.
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $TYPE_GROUP = 'group';

	/**
	 * Type when the searchable is a 'network'.
	 * @property $TYPE_NETWORK
	 * @var {String} The 'network' type.
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $TYPE_NETWORK = 'network';

	/**
	 * Type when the searchable is a 'user'.
	 * @property TYPE_USER
	 * @var {String} The 'user' type.
	 * @since Release 1.0
	 * @const
	 * @static
	 */
	public static $TYPE_USER = 'user';


	// ********************** Static Functions ********************** //

	/**
	 * Generates the creation SQL for this object.
	 * @method generateCreateSQL
	 * @param $o {Searchable} Required. The searchable to create.
	 * @return {Array} The SQL as an array.
	 * @access Public
	 * @since Release 1.0
	 * @static
	 */
	public static function generateCreateSQL($o) {
		return array(
			str_replace(' AS `S`', '', Searchable::$SQL_TABLE),
			array('created', 'email', 'key', 'modified', 'name', 'pending_bit', 'status', 'type'),
			array($o->__sCreated, $o->_email, $o->_key, $o->_modified, $o->_name, $o->_pendingBit, $o->_status, $o->_type)
		);
	}

	/**
	 * Generates the update SQL for this object.
	 * @method generateUpdateSQL
	 * @param $o {Searchable} Required. The searchable to update.
	 * @return {Array} The SQL as an array.
	 * @access Public
	 * @since Release 1.0
	 * @static
	 */
	public static function generateUpdateSQL($o) {
		$o->_modified = getDatetime(time());
		return array(
			str_replace(' AS `PW`', '', Searchable::$SQL_TABLE), // p1 is the table
			array('access', 'email', 'features', 'feature_access', 'modified', 'name', 'notify', 'status', 'uri_image', 'uri_thumb'),
			array($o->_access, $o->_email, $o->_features, $o->_featureAccess, $o->_modified, $o->_name, $o->_notify, $o->_status, $o->_uriImage, $o->_uriThumb, $o->_id),
			'`id` = ?' // p4 where string
		);
	}

	/**
	 * Returns a valid access from the one provided.
	 * @method getValidAccess
	 * @param access {String} Required. The suspicious access string.
	 * @param default {String} Optional. A special default value; defaults to ACCESS_CLOSED.
	 * @return {String} The access.
	 * @access Public
	 * @static
	 * @since Release 1.0
	 */
	public static function getValidAccess($access, $default = '') {
		switch ($access) {
			case Searchable::$ACCESS_CLOSED:
			case Searchable::$ACCESS_OPEN:
			case Searchable::$ACCESS_PRIVATE:
				return $access;

			default:
				return $default ? $default : Searchable::$ACCESS_CLOSED;
		}
	}

	/**
	 * Returns a valid status from the one provided.
	 * @method getValidStatus
	 * @param status {String} Required. The suspicious status string.
	 * @param default {String} Optional. A special default value; defaults to STATUS_ACTIVE.
	 * @return {String} The status.
	 * @access Public
	 * @static
	 * @since Release 1.0
	 */
	public static function getValidStatus($status, $default = '') {
		switch ($status) {
			case Searchable::$STATUS_ACTIVE:
			case Searchable::$STATUS_INACTIVE:
			case Searchable::$STATUS_DELETED:
			case Searchable::$STATUS_PENDING:
				return $status;

			default:
				return $default ? $default : Searchable::$STATUS_ACTIVE;
		}
	}

	/**
	 * Returns a valid type from the one provided.
	 * @method getValidType
	 * @param type {String} Required. The suspicious type string.
	 * @param default {String} Optional. A special default value; defaults to TYPE_USER.
	 * @return {String} The type.
	 * @access Public
	 * @static
	 * @since Release 1.0
	 */
	public static function getValidType($type, $default = '') {
		switch ($type) {
			case Searchable::$TYPE_USER:
			case Searchable::$TYPE_GROUP:
			case Searchable::$TYPE_NETWORK:
				return $type;

			default:
				return $default ? $type : Searchable::$TYPE_USER;
		}
	}

	/**
	 * Fetch the valid searchable types.
	 * @method getValidTypes
	 * @return {Array} The valid types.
	 * @access Public
	 * @since Release 1.0
	 * @static
	 */
	public static function getValidTypes() {
		return array(Searchable::$TYPE_GROUP, Searchable::$TYPE_NETWORK, Searchable::$TYPE_USER);
	}

	/**
	 * Evaluate if the provided type is valid.
	 * @method isValidType
	 * @param  $type {String} Required. The type to evaluate.
	 * @return {Boolean} The type is valid.
	 * @access Public
	 * @since Release 1.0
	 * @static
	 */
	public static function isValidType($type) {
		switch ($type) {
			case Searchable::$TYPE_GROUP:
			case Searchable::$TYPE_NETWORK:
			case Searchable::$TYPE_USER:
				return true;

			default:
				return false;
		}
	}
}

def('searchable_status', array(
	Searchable::$STATUS_ACTIVE,
	Searchable::$STATUS_DELETED
));

?>