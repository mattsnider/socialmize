<?php

import('project.action.module.ControllerModuleSubmitBase');
import('project.service.ServiceRegistration');

/**
 * @package project.action.user
 */
class ControllerRequiredSubmit extends ControllerModuleSubmitBase {

	public static function loginEvaluation($man, $userId) {
		$man = new ServiceProfileWidget($man->ds);
		$aFields = $man->getRequiredProfileWidgetFields($userId, Searchable::$TYPE_USER);
		list($aFields) = $man->readProfileWidgetFieldValues($aFields, $userId);

		foreach ($aFields as $oField) {
			if (! $oField->getValue()) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @Override
	 */
	public function executeActually(&$form, &$request, &$response, &$aUser, $S) {
		list($servPW) = $this->_getServices($request, 'ServiceProfileWidget');

		$aFields = $servPW->getRequiredProfileWidgetFields($aUser->getId(), Searchable::$TYPE_USER);

		$msg = $this->_injectProfileWidgetValues($request, $aFields, $aUser);
		$uri = !$msg ? '/home.action' : '/registration_view_required.action';

		if (!$msg) {
			$this->_updateNextTask($request, $aUser->getRegistrationTask()->getId());
		} else {
			$this->_parseMessage($request, $msg);
		}

		$response->sendRedirect($uri);
		return 'forward';
	}

	// todo: this is not DRY; replicated in ControllerProfileSubmit
	/**
	 * Stuffs the taskable object with data from the request.
	 * @method _injectProfileWidgetValues
	 * @param request {Object} Required. The HttpServletRequest.
	 * @param taskable {Object}  Required. A taskable objects.
	 * @param S {Searchable} Required. The searchable.
	 * @return {String} Error message.
	 * @access Private
	 * @since Release 1.0
	 */
	private function _injectProfileWidgetValues($request, $fields, $S) {
		$size = $this->_getParameterAsInteger($request, c('QK_SIZE'));

		$invalidFields = array();
		list($man, $servPW) = $this->_getServices($request, 'BaseManager', 'ServiceProfileWidget');

		// iterate on the fields and inject data into them
		foreach ($fields as &$field) {
			$values = array();
			$name = $field->getName();
			$sb = array();

			// datetime special-case
			if (ProfileWidgetField::$TYPE_DATETIME === $field->getType()) {
				$m = $request->getParameterValues($name . c('QK_MONTH'));
				$d = $request->getParameterValues($name . c('QK_DAY'));
				$y = $request->getParameterValues($name . c('QK_YEAR'));

				for ($i = 0, $j = sizeof($m); $i < $j; $i += 1) {
					if ($y[$i] && $m[$i] && $d[$i]) {
						$values[$i] = $y[$i] . '-' . addZeros($m[$i], 2) . '-' . addZeros($d[$i], 2) . ' 00:00:00';
					} else {
						$values[$i] = '';
					}
				}
				// image special-case
			} else if (ProfileWidgetField::$TYPE_IMAGE === $field->getType()) {
				for ($i = 0; $i < $size; $i += 1) {
					$currentUrl = $this->_getParameterAsString($request, $name . 'chkbox' . $i, '', array('/', '.'));

					if ($currentUrl) {
						$values[$i] = $currentUrl;
					} else {
						$images = $this->_uploadImage($request, $name . $i, false, $S);
						if (!$images || is_string($images)) {
							return $images;
						}
						$values[$i] = $images[0];
					}
				}
				// portrait special-case
			} else if (ProfileWidgetField::$TYPE_PORTRAIT === $field->getType()) {
				$images = $this->_uploadImage($request, c('QK_PIC'), true, $S);
				if (!$images || is_string($images)) {
					return $images;
				}
				if ('uriImage' === $name) {
					$values = array($images[0]);
				} else if ('uriThumb' === $name) {
					$values = array($images[1]);
				}
				// date range requires 3 fields, must be hashed into 1 value
			} else if (ProfileWidgetField::$TYPE_DATE_RANGE === $field->getType()) {
				$sm = $request->getParameterValues($name . 's' . c('QK_MONTH'));
				$sy = $request->getParameterValues($name . 's' . c('QK_YEAR'));
				$em = $request->getParameterValues($name . 'e' . c('QK_MONTH'));
				$ey = $request->getParameterValues($name . 'e' . c('QK_YEAR'));
				$b = $request->getParameterValues($name . c('QK_CURRENT'));

				for ($i = 0, $j = sizeof($sm); $i < $j; $i += 1) {
					if ($sm[$i] && $sy[$i] && ($b[$i] || ($em[$i] && $ey[$i]))) {
						array_push($values, $sy[$i] . '-' . addZeros($sm[$i], 2) . '-00 00:00:00||' . $ey[$i] . '-' . addZeros($em[$i], 2) . '-00 00:00:00||' . $b[$i]);
					}
					else {
						array_push($values, '');
					}
				}
				// other fields
			} else {
				$values = $request->getParameterValues($name);

				// list special-case, normalize newlines and commas
				if (ProfileWidgetField::$TYPE_LIST === $field->getType()) {
					foreach ($values as $i => $v) {
						$values[$i] = str_replace(', ,', ', ', preg_replace('/[\\r\\n,]+\s*/', ', ', $v));
					}
				}

				// this is a singular field
				foreach ($values as $v) {
					$sel = c($field->getName(), false);

					if ($sel) {
						$v = $sel[$v];

						if ($v) {
							array_push($sb, $v);
						}
					} else if (is_numeric($v)) {
						// do nothing; numbers and values aren't searchable
					}
					else if (2 < strlen($v)) {
						array_push($sb, $v);
					}
				}
			}

			$field->setValue($values[0]);
			$isValid = true;

			// evaluate if the field is required
			$isValid = $values[0];

			if ($isValid) {
				$man->updateSearchNodes($S->getId(), $field->getProfileWidgetId(), $sb);
			}
			else {
				array_push($invalidFields, $name);
			}
		}

		$servPW->updateProfileWidgetFields($fields, $S->getId(), true);
		return sizeof($invalidFields) ? "The following fields are required: " . implode(',', $invalidFields) : '';
	}
}

?>
