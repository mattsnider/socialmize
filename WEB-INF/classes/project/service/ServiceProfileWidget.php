<?php

import('project.service.BaseManager');
import('project.model.ProfileWidget');
import('project.model.ProfileWidgetField');

/**
 * Created by IDEA.
 * User: mattsniderppl
 * Date: Oct 2, 2010
 * Time: 7:45:56 PM
 * This service provides logic for managing profile widgets.
 */

class ServiceProfileWidget extends BaseManager {

	/**
	 * Coverts the DB PK to an instance or simply returns the instance.
	 * @method _getPW
	 * @param  integer|ProfileWidget $o Required. The DB PK or instance.
	 * @return ProfileWidget
	 * @since  version 1.0
	 * @access public
	 */
	public function _getPW($o) {
		return is_int($o) ? $this->getProfileWidgetById($o) : $o;
	}

	/**
	 * Coverts the DB PK to an instance or simply returns the instance.
	 * @method _getPWF
	 * @param  integer|ProfileWidget $o Required. The DB PK or instance.
	 * @return ProfileWidgetField
	 * @since  version 1.0
	 * @access public
	 */
	public function _getPWF($o) {
		return is_int($o) ? $this->getProfileWidgetFieldById($o) : $o;
	}

	/**
	 * Inserts a set of values into the select table.
	 * @method createSelectOptions
	 * @param  integer $pwfId Required. The profile widget db pk.
	 * @param  array $values Required. A collection of values to insert.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	public function createSelectOptions($pwfId, $values) {
		if (sizeof($values)) {
			$insertParams = array(ProfileWidgetField::$SQL_TABLE_SELECT_VALUES, array('created', 'f', 'name', 'profile_widget_field_id', 'status'));
			$now = getDatetime(time());

			foreach ($values as $value) {
				array_push($insertParams, array($now, 0, $value, $pwfId, Searchable::$STATUS_ACTIVE));
			}

			call_user_func_array(array($this, '_insert'), $insertParams);
		}
	}

	/**
	 * Reads the select options into an array of values.
	 * @method readSelectOptions
	 * @param  integer $pwfId Required. The profile widget db pk.
	 * @return string The found select options.
	 * @since  version 1.0
	 * @access public
	 */
	public function readSelectOptions($pwfId) {
		$values = array($pwfId);
		$wheres = array('`profile_widget_field_id`=?');
		$this->_setupSearchableStatus($wheres, $values, '', ProfileWidgetField::$SQL_TABLE_SELECT_VALUES);
		$rs = $this->_select(array(ProfileWidgetField::$SQL_TABLE_SELECT_VALUES), array('`id`', '`name`'), $values, $wheres);
		$options = array();

		while ($rs->next()) {
			$options[$rs->getInt('id')] = $rs->getString('name');
		}

		return $options;
	}

	/**
	 * Sets the status of the profile widget to deleted, can then only be restored by DB admin.
	 * @method deleteProfileWidget
	 * @param  integer|ProfileWidget $o Required. The DB PK or instance.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	public function deleteProfileWidget($o) {
		$pw = $this->_getPW($o);

		if ($pw) {
			$this->_update(ProfileWidget::$SQL_TABLE, array('status'), array(Searchable::$STATUS_DELETED, $pw->getId()), 'id=?');
			//			$this->_update(ProfileWidgetField::$SQL_TABLE, array('status'), array(Searchable::$STATUS_DELETED, $id), 'profile_widget_id=?');
		}
		else {
			$this->_getLog()->error("BM::deleteProfileWidget - Unable to Delete ProfileWidget: No DB PK found for - " + $o);
		}
	}

	/**
	 * Sets the status of the profile widget field to deleted, can then only be restored by DB admin.
	 * @method deleteProfileWidgetField
	 * @param  integer|ProfileWidget $o Required. The DB PK or instance.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	public function deleteProfileWidgetField($o) {
		$pwf = $this->_getPWF($o);

		if ($pwf) {
			$pw = $this->getProfileWidgetById($pwf->getProfileWidgetId());

			if ($pw) {
				$this->_update(ProfileWidgetField::$SQL_TABLE, array('status'), array(Searchable::$STATUS_DELETED, $pwf->getId()), 'id=?');
				$pw->setFieldCount($pw->getFieldCount() - 1);
				$this->_update(ProfileWidgetField::$SQL_TABLE, array('fieldn'), array($pw->getFieldCount(), $pw->getId()), 'id=?');
			}
			else {
				$this->_getLog()->error("BM::deleteProfileWidgetField - Unable to Update ProfileWidget: No DB PK found for - " + $pwf->getId());
			}
		}
		else {
			$this->_getLog()->error("BM::deleteProfileWidgetField - Unable to Delete ProfileWidgetField: No DB PK found for - " + $o);
		}
	}

	/**
	 * Deletes a set of values from the provided select table and removes all references thereto.
	 * @method deleteSelectOptions
	 * @param  integer $pwfId Required. The profile widget db pk.
	 * @param  array $values Required. A collection of values to delete.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	public function deleteSelectOptions($pwfId, $values) {
		if (sizeof($values)) {
			$whereId = '`id` IN (' . implode(',', $values) . ')';
			$this->_update(ProfileWidgetField::$SQL_TABLE_SELECT_VALUES, array('status'), array(Searchable::$STATUS_DELETED), $whereId);
		}
	}

	/**
	 * Attempts to find the autocomplete name by its ID.
	 * @method getAutocompleteNameById
	 * @param  integer $id Required. The DB PK of the autcomplete.
	 * @return string The name of the autocomplete element.
	 * @since  version 1.0
	 * @access public
	 */
	public function getAutocompleteNameById($id) {
		$rs = $this->_select(array(ProfileWidgetField::$SQL_TABLE_SELECT_VALUES), array('name'), array($id), array('`id`=?'));
		return $rs->next() ? $rs->getString('name') : '';
	}

	/**
	 * Fetch the number of fields in a profile widget.
	 * @method getFieldCount
	 * @param  integer|ProfileWidget $o Required. The DB PK or instance.
	 * @param  string $status Optional The status to check again, defaults to 'active'.
	 * @return {Number} The count.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	public function getFieldCount($o, $status = '') {
		$pw = $this->_getPW($o);
		$wheres = array('`PWF`.`profile_widget_id` = ?');
		$values = array($pw->getId());
		$this->_setupSearchableStatus($wheres, $values, $status, 'PWF');
		return $this->_getCount(array(ProfileWidgetField::$SQL_TABLE), $values, $wheres);
	}

	/**
	 * Retrieves a profile widget by its DB PK.
	 * @method getProfileWidgetById
	 * @param  integer $id Required. The field id.
	 * @param  boolean $fetchFields Optional. Fetch the fields as well.
	 * @param  array $fieldStatus Optional. When fetching feilds, indicate te desired status' to fetch.
	 * @return ProfileWidget The matching profile widget or null.
	 * @since  version 1.0
	 * @access public
	 */
	public function getProfileWidgetById($id, $fetchFields = true, $fieldStatus = null) {
		$pw = null;

		// don't continue if DB PK is not providede
		if ($id) {
			$rs = $this->_select(array(ProfileWidget::$SQL_TABLE), array(ProfileWidget::$SQL_SELECT), array($id), array('id=?'));

			if ($rs->next()) {
				$pw = new ProfileWidget();
				$pw->readResultSet($rs);

				if ($fetchFields) {
					$this->_getProfileWidgetFields($pw, $fieldStatus);
				}
			}
		}

		return $pw;
	}

	/**
	 * Retrieve a profile widgets field by its DB PK.
	 * @method getProfileWidgetFieldById
	 * @param  integer $id Required. The DB PK.
	 * @return ProfileWidgetField The found profile widget field.
	 * @since  version 1.0
	 * @access public
	 */
	public function getProfileWidgetFieldById($id) {
		$pwf = null;

		if ($id) {
			$rs = $this->_select(array(ProfileWidgetField::$SQL_TABLE), array(ProfileWidgetField::$SQL_SELECT), array($id), array('`PWF`.`id` = ?'));

			if ($rs->next()) {
				$pwf = new ProfileWidgetField();
				$pwf->readResultSet($rs);
			}
		}

		return $pwf;
	}

	/**
	 * Retrieves a profile widget by the name of one of its fields.
	 * @method getProfileWidgetByFieldName
	 * @param  string $name Required. The field name.
	 * @param  string $status Optional. The status to check again, defaults to 'active'.
	 * @return ProfileWidget The found ProfileWidget or null.
	 * @since  version 1.0
	 * @access public
	 */
	public function getProfileWidgetByFieldName($name, $status = '') {
		$pw = null;

		$tables = array(ProfileWidgetField::$SQL_TABLE, 'LEFT JOIN ' . ProfileWidget::$SQL_TABLE . ' ON `PW`.`id` = `PWF`.`profile_widget_id`');
		$wheres = array('`PWF`.`name` = ?');
		$values = array($name);

		$this->_setupSearchableStatus($wheres, $values, $status, 'PWF');
		$rs = $this->_select($tables, array(ProfileWidget::$SQL_SELECT), $values, $wheres);

		if ($rs->next()) {
			$pw = new ProfileWidget();
			$pw->readResultSet($rs);
			$this->_getProfileWidgetFields($pw);
		}

		return $pw;
	}

	/**
	 * Retrieves all profile widgets by a Searchable type.
	 * @method getProfileWidgetsBySearchableType
	 * @param  string|array $type Optional. The searchable type.
	 * @param  string|array $status Optional. Additional status' to allow.
	 * @param  $fieldStatus {array} Optional. When fetching feilds, indicate te desired status' to fetch.
	 * @return array The matching profile widgets.
	 * @since  version 1.0
	 * @access public
	 */
	public function getProfileWidgetsBySearchableType($type = null, $status = '', $fieldStatus = '') {
		$widgets = array();
		$wheres = array();
		$values = array();

		$this->_setupSearchableStatus($wheres, $values, $status, 'PW');

		if ($type) {
			$bitmask = ProfileWidget::getSearchableTypeBitmask($type);
			array_push($values, $bitmask);
			array_push($wheres, '`PW`.`searchable_type_bit` & ?');
		}

		$rs = $this->_select(array(ProfileWidget::$SQL_TABLE), array(ProfileWidget::$SQL_SELECT), $values, $wheres, '', array(
			ProfileWidget::$SQL_ORDERBY_DEFAULT
		));

		while ($rs->next()) {
			$pw = new ProfileWidget();
			$pw->readResultSet($rs);
			array_push($widgets, $pw);
		}

		$this->_getProfileWidgetsFields($widgets, $fieldStatus);
		return $widgets;
	}

	/**
	 * Retrieves the profile widget fields for a widget.
	 * @method _getProfileWidgetFields
	 * @param  ProfileWidget $pw Required. The widget to fetch fields of.
	 * @return void
	 * @since  version 1.0
	 * @access private
	 */
	private function _getProfileWidgetFields(&$pw, $status = null) {
		if (!$status) {
			$status = Searchable::$STATUS_ACTIVE;
		}
		if (!is_array($status)) {
			$status = array($status);
		}
		$wheres = array('`PWF`.`profile_widget_id` = ?');
		$values = array($pw->getId());
		$w_sb = array();

		foreach ($status as $s) {
			array_push($values, $s);
			array_push($w_sb, '`PWF`.`status` = ?');
		}

		array_push($wheres, '(' . join(' OR ', $w_sb) . ')');
		$rs = $this->_select(array(ProfileWidgetField::$SQL_TABLE), array(ProfileWidgetField::$SQL_SELECT),
							 $values, $wheres, '', array(ProfileWidgetField::$SQL_ORDERBY_DEFAULT));

		while ($rs->next()) {
			$pwf = new ProfileWidgetField();
			$pwf->readResultSet($rs);
			$pw->addField($pwf);
		}
	}

	/**
	 * Retrieves all profile widgets fields from a collection of widgets.
	 * @method _getProfileWidgetsFields
	 * @param  string|array $widgets Required. The widgets to fetch fields of.
	 * @param  string|array $status Optional. Additional status' to allow.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	private function _getProfileWidgetsFields(&$widgets, $status = null) {
		$widgetIds = array();
		$widgetIdMap = array();
		$values = array();

		if (!$status) {
			$status = Searchable::$STATUS_ACTIVE;
		}
		if (!is_array($status)) {
			$status = array($status);
		}
		$w_sb = array();

		foreach ($status as $s) {
			array_push($values, $s);
			array_push($w_sb, '`PWF`.`status` = ?');
		}

		// iterate on the widgets, create a list of IDs for SQL and an ID to widget map
		foreach ($widgets as &$pw) {
			array_push($widgetIds, $pw->getId());
			$widgetIdMap[$pw->getId()] = $pw;
		}

		$rs = $this->_select(array(ProfileWidgetField::$SQL_TABLE), array(ProfileWidgetField::$SQL_SELECT), $values,
							 array('`PWF`.`profile_widget_id` IN (' . implode(',', $widgetIds) . ')', '(' . implode(' OR ', $w_sb) . ')'), '', array(ProfileWidgetField::$SQL_ORDERBY_DEFAULT));

		while ($rs->next()) {
			$pwf = new ProfileWidgetField();
			$pwf->readResultSet($rs);
			$widgetIdMap[$pwf->getProfileWidgetId()]->addField($pwf);
		}
	}

	/**
	 * Retrieves all required profile widget fields for the searchable type.
	 * @method getProfileWidgetFieldValues
	 * @param  integer $sId Required. The owning searchable id.
	 * @param  boolean $type Required. The Searchable type to fetch fields from.
	 * @return array A collection of required fields.
	 * @since  version 1.0
	 * @access public
	 */
	public function getRequiredProfileWidgetFields($sId, $type) {
		$typeBit = ProfileWidget::getSearchableTypeBitmask($type);

		$aFields = array();
		$rs = $this->_select(array(ProfileWidgetField::$SQL_TABLE, 'LEFT JOIN', ProfileWidget::$SQL_TABLE, 'ON `PWF`.`profile_widget_id`=`PW`.`id`'),
							 array(ProfileWidgetField::$SQL_SELECT),
							 array(Searchable::$STATUS_ACTIVE, Searchable::$STATUS_ACTIVE, 'true', $typeBit),
							 array('`PWF`.`status`=?', '`PW`.`status`=?', '`PWF`.`required`=?', '`PW`.`searchable_type_bit` & ?'), '', array('ORDER BY `PWF`.`label`'));

		while ($rs->next()) {
			array_push($aFields, new ProfileWidgetField(0, $rs));
		}

		list($aFields) = $this->readProfileWidgetFieldValues($aFields, $sId);
		return $aFields;
	}

	/**
	 * Retrieves all profile widget field values for a widget.
	 * @method getProfileWidgetFieldValues
	 * @param pw {ProfileWidget} Required. The widget to fetch values of.
	 * @param sId {Integer} Required. The owning searchable id.
	 * @param hasEmptyMulti {Boolean} Required. True, when an empty set of fields should be prepended to a multi form.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getProfileWidgetFieldValues(&$pw, $sId, $hasEmptyMulti) {
		$fields = $pw->getFields();

		list($fieldsNew, $hasValue) = $this->readProfileWidgetFieldValues($fields, $sId);

		// prepend a blank set of fields to the list
		if ($hasEmptyMulti && $pw->isMulti() && $hasValue) {
			$fieldsNew = array_merge($fieldsNew, $fields);
		}

		$pw->setFields($fieldsNew);
	}

	public function readProfileWidgetFieldValues($aFields, $sId) {
		$hasValue = false;

		$union = array();
		$selectClause = '`ikey`, `value`, "?" AS `index`';
		$whereClause = '`searchable_id`=' . $sId . ' AND `profile_widget_field_id`=';

		// iterate on the widgets fields
		foreach ($aFields as $k => $oField) {
			$table = str_replace('` AS `PWF`', '_', ProfileWidgetField::$SQL_TABLE) . $oField->getDataTable() . '`';

			$sc = str_replace('?', $k, $selectClause);
			if ($oField->usesForeignKey()) {
				$sc = str_replace('`value`', '`related_id` as `value`', $sc);
			}
			else if (ProfileWidgetField::$TYPE_DATE_RANGE === $oField->getType()) {
				$sc = str_replace('`value`', "concat_ws('||', `valueA`, `valueB`, `current`) as `value`", $sc);
			}

			$wc = $whereClause . $oField->getId();
			array_push($union, "(SELECT $sc FROM $table WHERE $wc)");
		}

		$rs = $this->_union($union);
		$size = sizeof($aFields);
		$results = clone_object($aFields); // clones array
		$resultIndexOffsetMap = array();

		while ($rs->next()) {
			$hasValue = true;
			$index = $rs->getInt('index');

			if (array_key_exists($index, $resultIndexOffsetMap)) {
				// this ikey is already mapped so its index needs to be increased to the next set of fields
				$resultIndexOffsetMap[$index] += $size;
				$index = $resultIndexOffsetMap[$index];

				// the index is greater than the results. this is a multi PW, so add another set of fields
				if ($index >= sizeof($results)) {
					$results = array_merge($results, clone_object($aFields));
				}
			} else {
				// this ikey has not so, map its index
				$resultIndexOffsetMap[$index] = $index;
			}

			$pwf =& $results[$index];

			$type = $pwf->getType();
			$value = $pwf->usesForeignKey() ? $rs->getInt('value') : $rs->getString('value');

			// special autocomplete logic to fetch the value from the ID
			if (ProfileWidgetField::$TYPE_AUTOCOMPLETE === $type) {
				$value = $this->getAutocompleteNameById($value);
			}

			$pwf->setValue($value);
		}

		return array($results, $hasValue);
	}

	/**
	 * Retrieves all profile widgets field values from a collection of widgets.
	 * @method getProfileWidgetsFieldValues
	 * @param widgets {Array} Required. The widgets to fetch values of.
	 * @param sId {Integer} Required. The owning searchable id.
	 * @access Public
	 * @since Release 1.0
	 */
	public function getProfileWidgetsFieldValues(&$widgets, $sId) {
		foreach ($widgets as &$w) {
			$this->getProfileWidgetFieldValues($w, $sId, false);
		}
	}

	/**
	 * Tests if the provided name is available on the provided profile widget.
	 * @method isProfileWidgetFieldNameAvailable
	 * @param  string $name Required. The name to evaluate.
	 * @param  integer $pwfId Optional. The profile widget field id.
	 * @return boolean The name is available.
	 * @since  version 1.0
	 * @access public
	 */
	public function isProfileWidgetFieldNameAvailable($name, $pwfId=null) {
		$values = array($name);
		$wheres = array($this->_DB_WHERE_NAME);

		$this->_setupSearchableStatus($wheres, $values, array(Searchable::$STATUS_ACTIVE,Searchable::$STATUS_INACTIVE), 'PWF');

		if ($pwfId) {
			array_push($values, $pwfId);
			array_push($wheres, '`id` != ?');
		}

		return ! $this->_getCount(array(ProfileWidgetField::$SQL_TABLE), $values, $wheres);
	}

	/**
	 * Creates or updates the provided profile widget database row.
	 * @method updateProfileWidget
	 * @param  $pw {Array} Required. The profile widget to update; passed-by-reference to update pk.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	public function updateProfileWidget(&$pw) {
		// does profile already exist, then update
		if ($pw->getId()) {
			$pw->setFieldCount($this->getFieldCount($pw->getId()));
			call_user_func_array(array($this, '_update'), ProfileWidget::generateUpdateSQL($pw));
		}
			// does profile not exist, then add it
		else {
			$pw->setId(call_user_func_array(array($this, '_insert'), ProfileWidget::generateCreateSQL($pw)));
		}
	}

	/**
	 * Creates or updates the provided profile widget field database row.
	 * @method updateProfileWidgetField
	 * @param pwf {ProfileWidgetField} Required. The profile widget field to update.
	 * @access Public
	 * @since Release 1.0
	 */
	public function updateProfileWidgetField(&$pwf) {
		// does profile already exist, then update
		if ($pwf->getId()) {
			call_user_func_array(array($this, '_update'), ProfileWidgetField::generateUpdateSQL($pwf));
		}
			// does profile not exist, then add it
		else {
			if ($pwf->getProfileWidgetId()) {
				$pw = $this->getProfileWidgetById($pwf->getProfileWidgetId(), false);

				if ($pw) {
					$id = call_user_func_array(array($this, '_insert'), ProfileWidgetField::generateCreateSQL($pwf));
					$pwf->setId($id);
					$this->updateProfileWidget($pw);
				}
				else {
					throw_exception(new CameleonException('Profile Widget Missing; unable to update Profile Widget Field', null));
				}
			}
		}
	}

	/**
	 * Updates the order or the provided profile widgets.
	 * @method updateProfileWidgetOrder
	 * @param  $pwIdA {integer} Required. The DB PK of first profile widget.
	 * @param  $pwIdB {integer} Required. The DB PK of second profile widget.
	 * @param  $pwOrderA {integer} Required. The order of first profile widget.
	 * @param  $pwOrderB {integer} Required. The order of second profile widget.
	 * @return {boolean} Success status.
	 * @since  version 1.0
	 * @access private
	 */
	public function updateProfileWidgetOrder($pwIdA, $pwIdB, $pwOrderA, $pwOrderB) {
		$pwA = $this->getProfileWidgetById($pwIdA, false);
		$pwB = $this->getProfileWidgetById($pwIdB, false);

		if ($pwA && $pwB) {
			$pwA->setOrder($pwOrderA);
			$pwB->setOrder($pwOrderB);
			$this->updateProfileWidget($pwA);
			$this->updateProfileWidget($pwB);
			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * Updates all field values in a profile widget.
	 * @method updateProfileWidgetFieldByWidget
	 * @param sId {Integer} Required. The searchable DB PK.
	 * @param widget {Array} Required. The profile widget to update.
	 * @access Public
	 * @since Release 1.0
	 */
	public function updateProfileWidgetFieldByWidget($sId, $widget) {
		$tableMap = array();

		$fields = $widget->getFields();

		// iterate on the fields and organize data into tables
		foreach ($fields as $field) {
			$table = $field->getDataTable();

			// only update if there is value
			if ($field->getValue()) {
				if (!array_key_exists($table, $tableMap)) {
					$tableMap[$table] = array();
				}
				array_push($tableMap[$table], $field);
			}

			// deletes any existing profile data for this widget field
			$table = str_replace('` AS `PWF`', '_', ProfileWidgetField::$SQL_TABLE) . $table . '`';
			$this->_delete($table, array($sId, $field->getId()), '`searchable_id` = ? && `profile_widget_field_id` = ?');
		}

		// iterate on the tables and update
		foreach ($tableMap as $type => $aPWF) {
			$this->updateProfileWidgetFields($aPWF, $sId);
		}
	}

	public function updateProfileWidgetFields($aFields, $sId, $isDelete = false) {
		$i = 2;

		// iterate on the ProfileWidgetFields and update the DB
		foreach ($aFields as $pwf) {
			$type = $pwf->getDataTable();
			$table = str_replace('` AS `PWF`', '_', ProfileWidgetField::$SQL_TABLE) . $type . '`';

			$datetime = getDatetime(time());
			$keyHash = array();

			$fieldName = $pwf->usesForeignKey() ? 'related_id' : 'value';

			$valueSet = array($table, array('created', 'profile_widget_field_id', 'searchable_id', 'ikey', $fieldName));
			$values = is_array($pwf->getValue()) ? $pwf->getValue() : array($pwf->getValue());
			$wfId = $pwf->getId();
			$k = 0;

			foreach ($values as $v) {
				if ($v) {
					// autocomplete must link to a foreign table
					if (ProfileWidgetField::$TYPE_AUTOCOMPLETE == $pwf->getType()) {
						$irs = $this->_select(array(ProfileWidgetField::$SQL_TABLE_SELECT_VALUES), array('`id`'), array(
							$v,
							$pwf->getId()
						), array(
							$this->_DB_WHERE_NAME,
							'profile_widget_field_id=?'
						));

						// autocomplete already exists, don't insert
						if ($irs->next()) {
							$v = $irs->getInt('id');
						} else { // autocomplete does not exist, insert
							$v = $this->_insert(ProfileWidgetField::$SQL_TABLE_SELECT_VALUES, array(
								'created',
								'name',
								'profile_widget_field_id'
							), array(
								$datetime,
								$v,
								$pwf->getId()
							));
						}
					}
						// date range requires 3 fields, instead of 1 like everything else
					else if (ProfileWidgetField::$TYPE_DATE_RANGE == $pwf->getType()) {
						$v = explode('||', $v);
						$valueSet[1][4] = 'valueA';
						$valueSet[1][5] = 'valueB';
						$valueSet[1][6] = 'current';
						if (!$v[2]) {
							$v[2] = 'false';
						}
					}

					// a key does not exist yet for this index
					if (!array_key_exists($k, $keyHash)) {
						$keyHash[$k] = getInsertKey($type + $k);
					}

					$valueSet[$i] = array($datetime, $wfId, $sId, $keyHash[$k]);

					// value is an array, merge into value set
					if (is_array($v)) {
						$valueSet[$i] = array_merge($valueSet[$i], $v);
					} else { // value is not an array, append to value set
						$valueSet[$i][] = $v;
					}

					$i += 1;
					$k += 1;
				}
			}

			if (sizeof($valueSet)) {
				if ($isDelete) {
					$this->_delete($table, array($sId, $pwf->getId()), '`searchable_id` = ? && `profile_widget_field_id` = ?');
				}

				if (ProfileWidgetField::$TYPE_AUTOCOMPLETE === $pwf->getType()) {
					dlog('look at next');
				}
				call_user_func_array(array($this, '_insert'), $valueSet);
			}
		}
	}

	/**
	 * Updates the provided option in the select table.
	 * @method updateSelectOptions
	 * @param  integer $pwfId Required. The profile widget db pk.
	 * @param  array $values Required. A collection of values to update.
	 * @return void
	 * @since  version 1.0
	 * @access public
	 */
	public function updateSelectOptions($pwfId, $values) {
		foreach ($values as $id => $name) {
			$this->_update(ProfileWidgetField::$SQL_TABLE_SELECT_VALUES, array('name'), array($name, $id), $this->_DB_WHERE_ID);
		}
	}
}

?>