<?php

/**
 * @package project.service
 */
class ContentManager extends Object {

	/**
	 * The filename of a `about`.
     * @var $CONTENT_ABOUT {String} The 'about' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $CONTENT_ABOUT = 'about';

	/**
	 * The filename of a `login`.
     * @var $CONTENT_LOGIN {String} The 'login' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $CONTENT_LOGIN = 'login';

	/**
	 * The filename of a `signup`.
     * @var $CONTENT_SIGNUP {String} The 'signup' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $CONTENT_SIGNUP = 'signup';

	/**
	 * The filename of a `terms`.
     * @var $CONTENT_TOS {String} The 'terms' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $CONTENT_TOS = 'terms';

	/**
	 * The filename of a `welcome`.
     * @var $CONTENT_WELCOME {String} The 'welcome' text.
     * @since Release 1.0
     * @const
     * @static
	 */
	public static $CONTENT_WELCOME = 'welcome';


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
		$this->_tplDir = preg_replace('/WEB-INF.*/', '', dirname(__FILE__)) . 'content' . $DS;
	}

	/**
	 * Fetches the content from the file system.
	 * @method fetchContent
	 * @param name {String} Required. The file name.
     * @access Public
     * @since Release 1.0
	 */
	public function fetchContent($name) {
		$file = $this->_tplDir . $name . '.txt';
		return file_exists($file) ? file_get_contents($file) : '';
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
}

?>