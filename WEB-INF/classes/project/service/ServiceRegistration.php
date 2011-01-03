<?php

import('project.service.BaseManager');
import('project.model.RegistrationTask');

/**
 * Created by IDEA.
 * User: mattsniderppl
 * Date: Jul 31, 2010
 * Time: 4:45:56 PM
 * This service provides registration logic for a user.
 */

class ServiceRegistration extends BaseManager {

	/**
	 * Writes a RegistrationTask to the DB.
	 * @method createRegistrationTask
	 * @param  RegistrationTask $registrationTask Required. The registration task to create.
	 * @return void
	 * @since  Version 1.0
	 * @access public
	 */
	public function createRegistrationTask(&$registrationTask) {
		$registrationTask->setId(call_user_func_array(array($this, '_insert'), RegistrationTask::generateCreateSQL($registrationTask)));
	}

	/**
	 * Deletes a RegistrationTask from the DB.
	 * @method deleteRegistrationTask
	 * @param  int $registrationTaskId Required. The DB PK of RegistrationTask.
	 * @return boolean Whether the operation was successful.
	 * @since  Version 1.0
	 * @access public
	 */
	public function deleteRegistrationTask($registrationTaskId) {
		return $this->_delete(array(RegistrationTask::$SQL_TABLE), array($registrationTaskId), array(ModelBase::$SQL_WHERE_ID));
	}

	/**
	 * Converts the ResultSet into an array of RegistrationTask objects.
	 * @method _getRegistrationSet
	 * @param  ResultSet $rs Required. The SQL query result set.
	 * @return array The collection of found RegistrationTask.
	 * @since  Version 1.0
	 * @access private
	 */
	private function _getRegistrationSet($rs) {
		$results = array();

		while ($rs->next()) {
			array_push($results, new RegistrationTask(0, $rs));
		}

		return $results;
	}

	public function updateRegistrationTasksOnLogin($userId) {
		$rs = $this->_select(array(RegistrationTask::$SQL_TABLE), array(RegistrationTask::$SQL_SELECT), array(Searchable::$STATUS_ACTIVE));

		while ($rs->next()) {
			$type = $rs->getString('type');
			$regTaskId = $rs->getString('id');

			$className = 'Controller' . ucfirst($type) . 'Submit';
			import('project.action.module.registrationTask.' . $className);

			if (call_user_func(array($className, 'loginEvaluation'), $this, $userId)) {
				$this->_delete('registration_task_searchable', array($regTaskId, $userId), array('registration_task_id=?', 'searchable_id=?'));
			}
		}
	}

	/**
	 * Read the next uncompleted RegistrationTask from the DB, for a searchable.
	 * @method readNextSearchableRegistrationTask
	 * @param  int $userId Required. The DB PK of Searchable.
	 * @return RegistrationTask A RegistrationTask or null.
	 * @since  Version 1.0
	 * @access public
	 */
	public function readNextSearchableRegistrationTask($userId) {
		// INSERT INTO `registration_task_searchable` (`created`,`searchable_id`,`registration_task_id`) VALUES (NOW(), 13, 1);
		// SELECT * from registration_task WHERE `status`="active" AND `id` NOT IN (SELECT `registration_task_id` FROM `registration_task_searchable` WHERE `searchable_id` = 13) ORDER BY `priority` ASC;
		$rs = $this->_select(array(RegistrationTask::$SQL_TABLE), array(RegistrationTask::$SQL_SELECT), array(Searchable::$STATUS_ACTIVE, $userId),
							 array('`status`=?', '`id` NOT IN (SELECT `registration_task_id` FROM `registration_task_searchable` WHERE `searchable_id`=?)'),
							 null, array('ORDER BY `priority` ASC'));

		$results = $this->_getRegistrationSet($rs);

		return sizeof($results) ? $results[0] : null;
	}

	/**
	 * Read a RegistrationTask from the DB by its PK.
	 * @method readRegistrationTask
	 * @param  int|string $o Required. The DB PK of RegistrationTask or type.
	 * @return RegistrationTask The RegistrationTask at the provided DB PK or null.
	 * @since  Version 1.0
	 * @access public
	 */
	public function readRegistrationTask($o) {
		$registrationTaskId = 0;
		$type = '';

		if (is_integer($o)) {
			$registrationTaskId = $o;
		} else if (is_string($o)) {
			$type = $o;
		} else {
			return null;
		}

		if ($registrationTaskId) {
			$rs = $this->_select(array(RegistrationTask::$SQL_TABLE), array(RegistrationTask::$SQL_SELECT),
								 array($registrationTaskId), array(ModelBase::$SQL_WHERE_ID));
		} else {
			$rs = $this->_select(array(RegistrationTask::$SQL_TABLE), array(RegistrationTask::$SQL_SELECT),
								 array($type), array('type=?'));
		}

		return $rs->next() ? new RegistrationTask(0, $rs) : null;
	}

	public function readRegistrationTasks($params) {
		$wheres = array();
		$values = array();

		if ($params) {
			$key = 'status';

			if (array_key_exists($key, $params)) {
				array_push($wheres, '`status`=?');
				array_push($values, $params[$key]);
			}
		}

		$rs = $this->_select(array(RegistrationTask::$SQL_TABLE), array(RegistrationTask::$SQL_SELECT),
							 $values, $wheres, '', array('ORDER BY `priority` ASC'));

		return $this->_getRegistrationSet($rs);
	}

	/**
	 * Updates a RegistrationTask in the DB.
	 * @method updateRegistrationTask
	 * @param  RegistrationTask $registrationTask Required. The registration task to update.
	 * @return void
	 * @since  Version 1.0
	 * @access public
	 */
	public function updateRegistrationTask($registrationTask) {
		call_user_func_array(array($this, '_update'), RegistrationTask::generateUpdateSQL($registrationTask));
	}

	/**
	 * Updates a RegistrationTaskSearchable in the DB.
	 * @method updateRegistrationTaskSearchble
	 * @param  int $registrationTaskId Required. The DB PK of RegistrationTask.
	 * @param  int $userId Required. The DB PK of Searchable.
	 * @return int The last inserted ID; only use, when concurrency isn't an issue.
	 * @since  Version 1.0
	 * @access public
	 */
	public function updateRegistrationTaskSearchble($registrationTaskId, $userId) {
		return $this->_insert('registration_task_searchable', array('created', 'registration_task_id', 'searchable_id'), array('NOW()', $registrationTaskId, $userId));
	}
}
