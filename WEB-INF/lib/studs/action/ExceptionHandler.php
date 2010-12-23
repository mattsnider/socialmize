<?php
/* $Id: ExceptionHandler.php 188 2005-04-07 04:52:31Z mojavelinux $
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

import('studs.action.ActionMessage');
import('studs.action.ActionMessages');
import('studs.action.ActionForward');

/**
 * @package studs.action
 * @author Dan Allen <dan.allen@mojavelinux.com>
 */
class ExceptionHandler extends Object
{
	function execute(&$e, &$exceptionConfig, &$mapping, &$form, &$request, &$response)
	{
		if (!is_null($exceptionConfig->getPath()))
		{
			$forward =& new ActionForward(null, $exceptionConfig->getPath());
		}
		else
		{
			$forward =& $mapping->getInputForward();
		}

		$error =& new ActionMessage($exceptionConfig->getKey(), $e->getMessage());

		$request->setAttribute(c('StudsConstants::EXCEPTION'), $e);
		$this->storeException($request, $error->getKey(), $error, $forward, $exceptionConfig->getScope());

		return $forward;
	}

	/**
	 * Default implementation for storing an ActionMessage generated by an Exception as an error.
	 *
	 * @return void
	 */
	function storeException(&$request, $property, &$error, &$forward, $scope)
	{
		$errors =& new ActionMessages();
		$errors->add($property, $error);
		
		if ($scope == 'request')
		{
			$request->setAttribute(c('StudsConstants::ERRORS_KEY'), $errors);
		}
		else
		{
			$session =& $request->getSession();
			$session->setAttribute(c('StudsConstants::ERRORS_KEY'), $errors);
		}
	}
}
?>
