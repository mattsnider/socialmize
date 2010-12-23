<?php
/* $Id: FileLogAppender.php 370 2006-10-17 05:19:38Z mojavelinux $
 *
 * Copyright 2003-2005 Dan Allen, Mojavelinux.com (dan.allen@mojavelinux.com)
 *
 * This project was originally created by Dan Allen, but you are permitted to
 * use it, modify it and/or contribute to it.  It has been largely inspired by
 * a handful of other open source projects and public specifications, most
 * notably Apache's Jakarta Project and Sun Microsystem's J2EE SDK.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import('horizon.io.File');
import('horizon.io.FileWriter');
import('horizon.util.logging.LogLevel');

def('LOG_CACHE', array());
def('LOG_CACHE_SIZE', 20);

/**
 * @author Dan Allen <dan.allen@mojavelinux.com>
 *
 * @package horizon.util.logging
 * @access public
 * @version $Id: FileLogAppender.php 370 2006-10-17 05:19:38Z mojavelinux $
 */
class FileLogAppender extends Object // implements LogAppender
{
	var $writer = null;

	var $logFile = null;

	function append($level, $name, $msg)
	{
		$writer =& $this->getFileWriter();
		$out = array();
		$out[] = '[' . LogLevel::valueOf($level) . ']';
		$out[] = date('j M Y H:i:s');
		$out[] = $name;
		$out[] = '-';
		$out[] = $msg;
		$writer->write(implode($out, ' ') . "\n");
		$this->closeFile($writer);
	}

// todo: get this working. doesn't work because it is lost between pages. I should fire this whenever the page finishes
//	function append($level, $name, $msg)
//	{
//		$size = c('LOG_CACHE_SIZE');
//		$logCache = c('LOG_CACHE');
//
//		$out = array();
//		$out[] = '[' . LogLevel::valueOf($level) . ']';
//		$out[] = date('j M Y H:i:s');
//		$out[] = $name;
//		$out[] = '-';
//		$out[] = $msg;
//		$logCache[] = $out;
//
//		$j = sizeof($logCache);
//
//		if ($size < sizeof($logCache)) {
//			$writer =& $this->getFileWriter();
//
//			while ($j) {
//				$writer->write(implode($logCache[$j--], ' ') . "\n");
//			}
//
//			$this->closeFile($writer);
//		}
//	}

	function setFile($filename)
	{
		$now = time() - 86400000;
		$yday = mktime(0, 0, 0, date("m", $now), date("d", $now), date("Y", $now));
		$newfile = str_replace('.log', "-$yday.log", $filename);
		
		if (! file_exists($newfile)) {
			if (file_exists($filename)) {
				rename($filename, $newfile);
			}
		}
		
		$this->logFile = new File($filename);
	}

	function &getFileWriter()
	{
		if (is_null($this->writer))
		{
			$this->writer = new FileWriter($this->logFile, true);
		}

		return $this->writer;
	}

	function closeFile(&$writer)
	{
		// TODO: add catch stuff
		if ($writer != null)
		{
			$writer->close();
			$writer = null;
		}
	}
}
?>
