<?php

import('project.action.ControllerBase');
import('include.upload');
import('project.model.ProfileWidget');
import('project.model.ProfileWidgetField');

/**
 * @package project.action
 */
class ControllerProfileSubmit extends ControllerBase {

	/**
	 * @Override
	 */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		//		$logger = $this->getLog();

		// parameters
		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'));
//		dlog($task);

		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'ServiceProfileWidget');
		$sId = $S->getId();
		$widgets = $man->getProfileWidgetsBySearchableType($S->getType());
		$w = $this->_getTask($task, $widgets);
		$msg = '';
		$isValid = false;

		// true when values are found
		if ($w) {
			$msg = $this->_injectProfileWidgetValues($request, $w, $S, $aUser);

			if (!$msg) {
				$man->updateProfileWidgetFieldByWidget($sId, $w);
				$man->touchSearchable($S);
				$msg = 'M:' . ($S->isUser() ? 'Your profile' : 'The profile of <q>' . $S->getName() . '</q>') . ' was successfully updated.';
				$isValid = true;
			}
		} else {
			$msg = 'Unable to update profile, please try again.';
		}

		$this->_parseMessage($request, $msg);

		if ($isValid) {
			$response->sendRedirect('/profile.action?' . c('QUERY_KEY_KEY') . '=' . $S->getKey());
		} else {
			$response->sendRedirect('/editprofile.action?' . c('QUERY_KEY_KEY') . '=' . $S->getKey() . '&' . c('QUERY_KEY_TASK') . '=' . $task);
		}

		return $task;
	}

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
	private function _injectProfileWidgetValues($request, &$taskable, $S, $aUser) {
		$fields = $taskable->getFields();
		$size = $this->_getParameterAsInteger($request, c('QK_SIZE'));
		$updateSearchable = false;

		// todo: determine how to sanitize and validate
		$sb = array();

		$invalidFields = array();

		// iterate on the fields and inject data into them
		foreach ($fields as &$field) {
			$values = array();
			$name = $field->getName();

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
			}
			// image special-case
			else if (ProfileWidgetField::$TYPE_IMAGE === $field->getType()) {
				for ($i = 0; $i < $size; $i += 1) {
					$currentUrl = $this->_getParameterAsString($request, $name . 'chkbox' . $i, '', array('/', '.'));
					dlog('wtf');
					dlog($currentUrl);

					if ($currentUrl) {
						dlog($i . '=' . $currentUrl);
						$values[$i] = $currentUrl;
					}
					else {
						dlog($i . '=uploading');
						$images = $this->_uploadImage($request, $name . $i, false, $S);
						if (!$images || is_string($images)) {
							return $images;
						}
						$values[$i] = $images[0];
					}
				}
			}
			// portrait special-case
			else if (ProfileWidgetField::$TYPE_PORTRAIT === $field->getType()) {
				$images = $this->_uploadImage($request, c('QK_PIC'), true, $S);
				if (!$images || is_string($images)) {
					return $images;
				}
				
				if ('uriImage' === $name) {
					$values = array($images[0]);
				}
				else if ('uriThumb' === $name) {
					$values = array($images[1]);
				}
			}
			// date range requires 3 fields, must be hashed into 1 value
			else if (ProfileWidgetField::$TYPE_DATE_RANGE === $field->getType()) {
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
			}
			// other fields
			else {
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
					}
					else if (is_numeric($v)) {
						// do nothing; numbers and values aren't searchable
					}
					else if (2 < strlen($v)) {
						array_push($sb, $v);
					}
				}
			}

			$field->setValue($taskable->isMulti() ? $values : $values[0]);
			$isValid = true;

			// evaluate if the field is required
			if ($field->isRequired()) {
				if ($taskable->isMulti()) {
					foreach ($values as $o) {
						if (!$o) {
							$isValid = false;
						}
					}
				}
				else {
					$isValid = $values[0];
				}
			}

			if ($isValid) {
				// special-case field that also updates the Searchable
				if ($field->isUpdateSearchable()) { // note: will not work with multi profile widgets
					call_user_func(array($S, 'set' . ucfirst($name)), $field->getValue());
					$updateSearchable = true;
				}
			}
			else {
				array_push($invalidFields, $name);
			}
		}

		if (sizeof($invalidFields)) {
			return "The following fields are required: " . implode(',', $invalidFields);
		}
		else {
			list($man) = $this->_getServices($request, 'BaseManager');

			// there was a special-case searchable update
			if ($updateSearchable) {
				$man->updateSearchable($S);

				// special logic to capture portrait changes
				if ($aUser->getId() == $S->getId()) {
					$aUser->setUriImage($S->getUriImage());
					$aUser->setUriThumb($S->getUriThumb());
					$request->getSession()->setAttribute('User', $aUser);
				}
			}

			$man->updateSearchNodes($S->getId(), $taskable->getId(), $sb);
			return '';
		}
	}

	/**
	 * Ensures that the task is valid, or returns a valid one.
	 * @method _getTask
	 * @param s {String} Required. The task parameter.
	 * @param taskables {Array}  Required. A collection of taskable objects.
	 * @return {Taskable} The found taskable.
	 * @access Private
	 * @since Release 1.0
	 */
	private function _getTask($s, $taskables) {
		// there are taskables
		if (sizeof($taskables)) {
			// iterate on the taskables
			foreach ($taskables as $taskable) {
				if ($s === $taskable->getTask()) {
					return $taskable;
				} // tasks match, return
			}

			return null;
		}

		return null;
	}

	/**
	 * True, when searchable exists.
	 * @method _hasRequired
	 * @param aUser {Searchable} Required. The requester.
	 * @param S {Searchable} Required. The requested context.
	 * @return {Boolean} True, when requirements are met.
	 * @access Protected
	 * @since Release 1.0
	 * @Override
	 */
	protected function _hasRequired($aUser, $S, $request) {
		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'));
		$key = $this->_getParameterAsString($request, c('QUERY_KEY_KEY'));

		// critical key issue, prevent editing self when not intending to
		if ($key && $key !== $aUser->getKey() && $S && $key !== $S->getKey()) {
			$this->getLog()->warn('Key not found, preventing accidental update of user.');
			return false;
		}

		return $S && $S->getId() && $task && $S->isAdmin();
	}

	/**
	 * Update the Profile DB using the request and DBO.
	 * @method _uploadImage
	 * @param req {HttpRequestObject} Required. The http request for fetching parameters.
	 * @param key {String} Required. The parameter key.
	 * @param isPortrait {String} Required. Special-case for the portrait upload.
	 * @param S {Searchable} Required. The searchable.
	 * @access Private
	 * @since Release 1.0
	 */
	protected function _uploadImage($request, $key, $isPortrait, $S) {
		$name = md5($S->getKey() . time());
		$agree = $this->_getParameterAsBoolean($request, c('QK_AGREE')) || $request->getParameter(c('QK_REMOVE'));
		$file = $_FILES[$key];
		$isProcessed = false;

		//dlog($key);
		//dlog(implode(',', $file));

		if (!$agree && $isPortrait) {
			return 'You must certify that you have the right to distribute this image and that is it not pornography!';
		}

		$WWW_ROOT = substr($_SERVER['SCRIPT_FILENAME'], 0, strpos($_SERVER['SCRIPT_FILENAME'], 'index.php')) . 'assets/images/';
		$r = array();

		if ($file) {
			$uploader = new upload($file);
			$uploader->file_new_name_body = $name;
			$uploader->file_auto_rename = false;
			$uploader->image_convert = 'jpg';
			
			$img_thumb_x = 100;
			$img_thumb_y = 125;//$img_thumb_x * (1 + pow(5,.5)) / 2;

			if ($isPortrait) {
				$img_loc_raw = '/images/raw/' . $name . '.jpg';
				$img_loc_portrait = '/images/searchables/' . $name . '.jpg';
				$img_loc_thumb = '/images/thumbs/' . $name . '.jpg';

				$img_portrait_x = 200;
				$img_portrait_y = 250;//$img_portrait_x * (1 + pow(5,.5)) / 2;

				$thumb = new upload($file);
				$thumb->file_new_name_body = $name;
				$thumb->file_overwrite = true;
				$thumb->file_auto_rename = false;
//				$thumb->image_ratio_no_zoom_in = $thumb->image_src_x > $img_thumb_x || $thumb->image_src_y > $img_thumb_y;
//				$thumb->image_ratio_no_zoom_out = $thumb->image_src_x < $img_thumb_x || $thumb->image_src_y < $img_thumb_y;
				$thumb->image_ratio_y = true;
				$thumb->image_resize = true;
				$thumb->image_x = $img_thumb_x;
				$thumb->image_y = $img_thumb_y;
				$thumb->image_convert = 'jpg';
				$thumb->process($WWW_ROOT . 'thumbs/');

				$portrait = new upload($file);
				$portrait->file_new_name_body = $name;
				$portrait->file_overwrite = true;
				$portrait->file_auto_rename = false;
//				$portrait->image_ratio_no_zoom_in = $thumb->image_src_x > $img_portrait_x || $thumb->image_src_y > $img_portrait_y;
//				$portrait->image_ratio_no_zoom_out = $thumb->image_src_x < $img_portrait_x || $thumb->image_src_y < $img_portrait_y;
				$portrait->image_ratio_y = true;
				$portrait->image_resize = true;
				$portrait->image_x = $img_portrait_x;
				$portrait->image_y = $img_portrait_y;
				$portrait->process($WWW_ROOT . 'searchables/');

				$uploader->file_overwrite = true;
				$uploader->image_ratio_no_zoom_in = false;
				$uploader->image_ratio_no_zoom_out = false;
				$uploader->process($WWW_ROOT . 'raw/');

				$isProcessed = $uploader->processed && $thumb->processed && $portrait->processed;
				$r = array($img_loc_portrait, $img_loc_thumb);
			}
			else {
//				$uploader->file_overwrite = false;
//				$uploader->file_auto_rename = true;
//				$uploader->process($WWW_ROOT . 'originals/');
//				$isProcessed = $uploader->processed;

				$uploader = new upload($file);
				$uploader->file_overwrite = false;
				$uploader->file_auto_rename = true;
				$uploader->image_ratio_y = true;
				$uploader->image_resize = true;
				$uploader->image_x = $img_thumb_x;
				$uploader->image_y = $img_thumb_y;
				$uploader->process($WWW_ROOT . 'profile/');
				$isProcessed = $isProcessed && $uploader->processed;
				$r[0] = '/images/profile/' . $uploader->file_dst_name;
			}
		}

		if (!$isProcessed) {
			dlog($uploader->error);

			if ($isPortrait) {
				if ($S->isGroup()) {
					$r[0] = c('defaultGroupImageUri');
					$r[1] = c('defaultGroupThumbUri');
				}
				else {
					$r[0] = c('defaultUserImageUri');
					$r[1] = c('defaultUserThumbUri');
				}
			}
			else {
				return $uploader->error;
			}
		}

		return $r;
	}
}

?>