<?php

/**
 * @package project.debug
 */
class Debug extends Action {

	var $logFile = '';
	
	/**
	 *	Instanciation function for a Dialog object.
	 *
     * @param datetime 	$activated		date the user first logged in
     * @access public	
     * @since Debug available since Release 0.5
	 */
	function Debug(&$filename='C:/tmp/php-debug-log.log', ) {
		$this->logFile = $filename;
		pr("directory permission: %04o\n", 0777 & (0777 - umask()));
	}
	
	/**
	 *	Instanciation function for a Dialog object.
	 *
     * @param datetime 	$activated		date the user first logged in
     * @access public	
     * @since Debug available since Release 0.5
	 */
	function error() {
	}
	
	function _write() {
		$this->checkDate
		$ourFileName = "";
		$fh = fopen($ourFileName, 'X') or die("Can't open file");
		fclose($fh);
	}
}
?>
