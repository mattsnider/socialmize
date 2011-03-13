<?php
/* $Id: Action.php 352 2006-05-15 04:27:35Z mojavelinux $
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

import('studs.StudsConstants');
import('studs.util.ModuleUtils');
import('studs.action.ActionMessages');

/**
 * @package util
 * @author Matt Snider <mattesnider@gmail.com>
 * @access public
 */
class CheckboxUtils extends Object {

	public static function _createCheckbox($s, $checked = false, $disabled = false) {
		//		dlog($s->getName() . ': $checked=' . $checked . ', $disabled=' . $disabled);
		return array(
			'id' => $s->getId(),
			'type' => $s->getType(),
			'name' => $s->getName(),
			'checked' => $checked,
			'disabled' => $disabled
		);
	}

	public static function _createCheckboxes($searchables, $aCheckedMap=array(), $aDisabledMap=array()) {
		$checkboxes = array();
		$searchablenIds = array();

		// create checkboxes
		foreach ($searchables as $s) {
			$isChecked = array_key_exists($s->getId(), $aCheckedMap);
			$isDisabled = array_key_exists($s->getId(), $aDisabledMap);

			array_push($checkboxes, CheckboxUtils::_createCheckbox($s, $isChecked, $isDisabled));
			array_push($searchablenIds, $s->getId());
		}

		return array($checkboxes, $searchablenIds);
	}
}

?>