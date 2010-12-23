<?php

import('include.SendMail');
import('horizon.util.Properties');

/**
 * @package project.service
 */
class NotificationManager extends Object {

	/**
	 * The filename of the email footer text.
     * @property $FOOTER
     * @var {String} The 'footer' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $FOOTER = 'footer';

	/**
	 * The filename of a 'adminApproved' email.
     * @property ADMIN_APPROVED
     * @var {String} The 'adminApproved' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $ADMIN_APPROVED = 'adminApproved';

	/**
	 * The filename of a 'adminDenied' email.
     * @property ADMIN_DENIED
     * @var {String} The 'adminDenied' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $ADMIN_DENIED = 'adminDenied';

	/**
	 * The filename of a friendRequest.
     * @property FRIEND_REQUEST
     * @var {String} The 'friendRequest' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $FRIEND_REQUEST = 'friendRequest';

	/**
	 * The filename of a groupApproved.
     * @property GROUP_APPROVED
     * @var {String} The 'groupApproved' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $GROUP_APPROVED = 'groupApproved';

	/**
	 * The filename of a groupInvited.
     * @property GROUP_INVITED
     * @var {String} The 'groupInvited' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $GROUP_INVITED = 'groupInvited';

	/**
	 * The filename of a messageReceived.
     * @property MESSAGE_RECEIVED
     * @var {String} The 'messageReceived' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $MESSAGE_RECEIVED = 'messageReceived';

	/**
	 * The filename of a newUserEmail.
     * @property NEW_USER_EMAIL
     * @var {String} The 'newUserEmail' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $NEW_USER_EMAIL = 'newUserEmail';

	/**
	 * The filename of a projectInvite.
     * @property $PROJECT_INVITE
     * @var {String} The 'projectInvite' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $PROJECT_INVITE = 'projectInvite';

	/**
	 * The filename of a recoverPassword.
     * @property RECOVER_PASSWORD
     * @var {String} The 'recoverPassword' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $RECOVER_PASSWORD = 'recoverPassword';

	/**
	 * The filename of a signupConfirmation.
     * @property SIGNUP_CONFIRMATION
     * @var {String} The 'signupConfirmation' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $SIGNUP_CONFIRMATION = 'signupConfirmation';

	/**
	 * The object containing project properties.
     * @property props
     * @var {Properties} The properties object.
     * @since Release 1.0
	 */
	public $_props = null;

	/**
	 * The project URL.
     * @property url
     * @var {String} A URL.
     * @since Release 1.0
	 */
	public $_url = null;


	// ********************** Constructor Methods ********************** //

	/**
	 * Instanciation function for a Notification Manager.
	 * @method NotificationManager
	 * @param props {Property} Required. The project properties.
	 * @param url {String} Required. The project url.
     * @access Public
     * @since Release 1.0
	 */
	public function __construct($props, $url) {
		$DS = DIRECTORY_SEPARATOR;
		$this->_props = $props;
		$this->_url = $url;
		$this->_tplDir = preg_replace('/WEB-INF.*/', '', dirname(__FILE__)) . 'content' . $DS . 'email' . $DS;
	}

	/**
	 * Fetches the email message from the file system.
	 * @method fetchMessage
	 * @param name {String} Required. The file name.
     * @access Public
     * @since Release 1.0
	 */
	public function fetchMessage($name) {
		$file = $this->_tplDir . $name . '.txt';
		$file2 = $this->_tplDir . NotificationManager::$FOOTER . '.txt';
		return file_exists($file) ? file_get_contents($file) . file_get_contents($file2) : '';
	}

	/**
	 * Fetches the template email dir.
	 * @method getDir
	 * @return {String} A dir.
     * @access Public
     * @since Release 1.0
	 */
	public function getDir() {
		return $this->_tplDir;
	}

	/**
	 * Get the logger statement for this class.
	 * @method _getLog
	 * @return {Logger} The logging object.
	 * @access Protected
	 * @since Release 1.0
	 */
	protected function _getLog() {
		return Logger::getLogger('project.service.' . get_class($this));
	}

	/**
	 * Sends a notification email to a user; evaluates whether the user has notification turned on.
	 * @method notifyByUsers
	 * @param  $man {Service} Required. A reference to the Service instance.
	 * @param  $S {Searchable} Required. The searchable to send to.
	 * @param  $aUser {Searchable} Required. The from searchable.
	 * @access public
	 * @since  version 1.0
	 */
	function notifyUser($man, $S, $aUser) {
		$data = array('NAME' => $aUser->getName());
		$this->notifyByUser($S, NotificationManager::$FRIEND_REQUEST, $data);

		$o = new Notification();
		$o->setSearchableById($aUser->getId());
		$o->setSearchableToId($S->getId());
		$o->setType(c('NotificationTypeMember'));
		$man->createNotification($o);
	}

	/**
	 * Sends a notification email to a user; evaluates whether the user has notification turned on.
	 * @method notifyByUsers
	 * @param S {Searchable} Required. The searchable to send to.
	 * @param messageName {String} Required. The file name.
	 * @param data {Array} Optional. A collection of key/value pairs; default is an empty array.
	 * @param force {Boolean} Optional. Force the email, despite notification; default false.
	 * @public
	 */
	function notifyByUser($S, $messageName, $data=array(), $force=false) {
		if ($S->hasNotify() || $force) {
			$this->notifyByEmail($S->getEmail(), $messageName, $data);
		}
	}

	/**
	 * Sends a notification email from admin.
	 * @method notifyByEmail
	 * @param to {String} Required. The recipient email.
	 * @param messageName {String} Required. The file name.
	 * @param data {Array} Optional. A collection of key/value pairs.
	 * @public
	 */
	function notifyByEmail($to, $messageName, $data=array()) {
		$message = $this->fetchMessage($messageName);
		
		$nameProject = $this->_props->getProperty('project.nameUC');
		$nameFriend = $this->_props->getProperty('project.name.friend');
		$nameGroup = $this->_props->getProperty('project.name.group');
		$nameMember = $this->_props->getProperty('project.name.member');
		$nameMessage = $this->_props->getProperty('project.name.message');
		$nameMessageBoard = $this->_props->getProperty('project.name.messageBoard');
		$nameWall = $this->_props->getProperty('project.name.wall');

		if ($message) {
			foreach ($data as $k=>$v) {
				$message = str_replace('${' . $k . '}', $v, $message);
			}

			// built in keywords required
			$message = str_replace('${PROJECT}', $nameProject, $message);
			$message = str_replace('${PROJECT_URL}', $this->_url, $message);
			$message = str_replace('${GROUP}', ucfirst($nameGroup), $message);
			$message = str_replace('${FRIEND}', ucfirst($nameFriend), $message);
			$message = str_replace('${MEMBER}', ucfirst($nameMember), $message);
			$message = str_replace('${MESSAGE}', ucfirst($nameMessage), $message);
			$message = str_replace('${MESSAGE_BOARD}', ucfirst($nameMessageBoard), $message);
			$message = str_replace('${WALL}', ucfirst($nameWall), $message);
		}
		else {
			$this->_getLog()->error('Notification - Invalid messageName: ' . $messageName);
		}

		// todo: split the subject and message
		$i = strpos($message, "\n");
		$subject = substr($message, 0, $i);
		$message = substr($message, $i + 1);

		$this->_getLog()->warn($to . "\n" . $subject . "\n" . $message);
		send_mail($to, $message, $subject, c('EMAIL_WEBMASTER'), $nameProject . ' Administrator');
	}
}

?>