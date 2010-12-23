<?php
/* $Id: Cookie.php 188 2005-04-07 04:52:31Z mojavelinux $
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

/**
 * <i>Based on javax.servlet.http.Cookie</i>
 *
 * @author Dan Allen <dan.allen@mojavelinux.com>
 * @package stratus.http
 * @access public
 */
class Cookie
{
	var $name;

	var $value;

	var $path;

	var $domain;

	var $expiry;

	var $secure;

	function Cookie($name, $value)
	{
		$this->name = $name;
		$this->value = $value;
	}

	function getName()
	{
		return $this->name;
	}

	function getValue()
	{
		return $this->value;
	}

	function getDomain()
	{
		return $this->domain;
	}

	function getPath()
	{
		return $this->path;
	}

	function getMaxAge()
	{
		return $this->expiry;
	}

	function isSecure()
	{
		return $this->secure;
	}

	function setName($name)
	{
		$this->name = $name;
	}

	function setValue($value)
	{
		$this->value = $value;
	}

	function setDomain($domain)
	{
		$this->domain = $domain;
	}

	function setPath($path)
	{
		$this->path = $path;
	}

	function setSecure($secure)
	{
		$this->secure = $secure;
	}
}
?>
