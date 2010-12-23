<?php
/* $Id: IteratorUtils.php 352 2006-05-15 04:27:35Z mojavelinux $
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

import('horizon.collections.iterators.ListIterator');
import('horizon.collections.iterators.ResultSetIterator');

/**
 * @package horizon.collections
 * @author Dan Allen
 */
class IteratorUtils
{
	/**
	 * @static
	 */
	function &getIterator(&$obj)
	{
		if (is_a($obj, 'IIterator'))
		{
			return $obj;
		}
		elseif (is_a($obj, 'ResultSet'))
		{
			$iter =& new ResultSetIterator($obj);
			return $iter;
		}
		elseif (is_array($obj))
		{
			$iter = & new ListIterator($obj);
			return $iter;
		}
		// @todo perhaps use MethodUtils or Class.getMethod() here?
		elseif (method_exists($obj, 'iterator'))
		{
			return $obj->iterator();
		}

		return ref(null);
	}
}
?>
