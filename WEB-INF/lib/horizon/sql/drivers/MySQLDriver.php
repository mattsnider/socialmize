<?php
/* $Id: MySQLDriver.php 352 2006-05-15 04:27:35Z mojavelinux $
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

import('horizon.sql.Driver');
import('horizon.sql.drivers.MySQLConnection');

/**
 * @package horizon.sql.drivers
 * @author Dan Allen
 */
class MySQLDriver extends Driver
{
	var $prefix = 'mysql';

	/**
	 * @see Driver#connect($url, &$info)
	 */
	public function &connect($url, &$info)
	{
		$props =& $this->parseURL($url, $info);
		if (is_null($props))
		{
			return ref(null);
		}

		$conn =& new MySQLConnection($props->getProperty('HOST'), $props->getProperty('PORT'), $props, $props->getProperty('DBNAME'), $url);
		return $conn;
	}
}
?>
