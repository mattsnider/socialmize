<?php
    if (! defined('SIMPLE_TEST')) {
        define('SIMPLE_TEST', '../simpletest/');
    }
    require_once(SIMPLE_TEST . 'unit_tester.php');
    require_once(SIMPLE_TEST . 'reporter.php');

	ini_set('include_path', '../../../../lib:../../../../classes');

    require_once('horizon/init.php');
    import('horizon.sql.drivers.MySQLDriver');
    import('horizon.sql.BasicDataSource');
    import('project.service.ServiceProfileWidget');
	import('horizon.util.logging.Logger');

	$lm = LogManager::getLogManager();
	$lm->rootLevel = c('LogLevel::FATAL');

    class TestSetup extends UnitTestCase {
		public $_ds;
		public $_isMulti;
		public $_man;
		public $_name;
		public $_nameTab;
		public $_order;

        function __construct() {
			parent::__construct();
        }

		function setUp() {
			$ds = new BasicDataSource();
			$ds->setDriverClassName('horizon.sql.drivers.MySQLDriver');
			$ds->setPassword('purpose');
			$ds->setUrl('mysql://localhost/cameleon');
			$ds->setUsername('root');
			$ds->initializeConnection();

			$this->_ds = $ds;
			$this->_man = new ServiceProfileWidget($ds);

			$this->_name = 'Delete Me';
			$this->_nameTab = strtolower(preg_replace('/\w/s', '', str_replace(' ', '_', $this->_name)));
			$this->_order = 1;
			$this->_isMulti = false;
		}

		function tearDown() {
			$conn =& $this->_ds->getConnection();
			$stmt =& $conn->prepareStatement('DELETE FROM ' . str_replace(' AS `PW`', '', ProfileWidget::$SQL_TABLE) . ' where name="'.$this->_name.'"');
			$stmt->executeUpdate();
		}

		function _createProfileWidget($typeBit) {
			$pw = new ProfileWidget();
			$pw->setName($this->_name);
			$pw->setNameTab($this->_nameTab);
			$pw->setOrder($this->_order);
			$pw->setIsMulti($this->_isMulti);
			$pw->setSearchableTypeBit($typeBit);
			$pw->setStatus(Searchable::$STATUS_ACTIVE);

			$this->_man->updateProfileWidget($pw);
			$this->assertNotNull($pw->getId());
			return $pw;
		}

		function _createProfileWidgetField($pwId, $type) {
			$pwfId = null;
			$pwfML = 0;
			$order = 1;
			$label = 'test ' . $type;
			$isRequired = false;
			$status = Searchable::$STATUS_ACTIVE;
			$defaultValue = '';

			$pwf = new ProfileWidgetField();

			$name = str_convertValueToQueryKey($label);
			$pwf->setDefaultValue($defaultValue);
			$pwf->setLabel($label);
			$pwf->setName($name);
			$pwf->setOrder($order);
			$pwf->setStatus($status);

			if ($pwfML) {
				$pwf->setMaxlength($pwfML);
			}

			$pwf->setIsRequired($isRequired);

			$pwf->setType($type);
			$pwf->setProfileWidgetId($pwId);

			$pwf->updateDataTable();

			return $pwf;
		}

		function test_deleteProfileWidget() {
			$pw = $this->_createProfileWidget(1);
			$this->_man->deleteProfileWidget($pw->getId());
			$pw2 = $this->_man->getProfileWidgetById($pw->getId(), false);
			$this->assertNotNull($pw2);
			$this->assertEqual(Searchable::$STATUS_DELETED, $pw2->getStatus());
		}

		function test_getProfileWidgetById() {
			$pw = $this->_createProfileWidget(1);
			$pw2 = $this->_man->getProfileWidgetById($pw->getId(), false);
			$this->assertNotNull($pw2);
			$this->assertEqual($pw->getId(), $pw2->getId());
			$this->assertEqual(Searchable::$STATUS_ACTIVE, $pw2->getStatus());
		}

		function test_getProfileWidgetsBySearchableType() {
			$pwAll = $this->_man->getProfileWidgetsBySearchableType();
			$pwGroup = $this->_man->getProfileWidgetsBySearchableType(Searchable::$TYPE_GROUP);
			$pwNetwork = $this->_man->getProfileWidgetsBySearchableType(Searchable::$TYPE_NETWORK);
			$pwUser = $this->_man->getProfileWidgetsBySearchableType(Searchable::$TYPE_USER);
			$pwNetworkUser = $this->_man->getProfileWidgetsBySearchableType(array(Searchable::$TYPE_USER,Searchable::$TYPE_NETWORK));

			$sizeAll = sizeof($pwAll);
			$sizeGroup = sizeof($pwGroup);
			$sizeNetwork = sizeof($pwNetwork);
			$sizeUser = sizeof($pwUser);

			$this->assertTrue(0 < $sizeAll);
			$this->assertTrue(0 < $sizeGroup);
			$this->assertTrue($sizeGroup <= $sizeAll);
			$this->assertTrue(0 < $sizeNetwork);
			$this->assertTrue($sizeGroup <= $sizeAll);
			$this->assertTrue(0 < $sizeUser);
			$this->assertTrue($sizeUser <= $sizeAll);
			$this->assertTrue($sizeUser <= sizeof($pwNetworkUser));
			$this->assertTrue($sizeNetwork <= sizeof($pwNetworkUser));
		}
		
        function test_updateProfileWidget() {
			$typeBit = ProfileWidget::getSearchableTypeBitByTypes(array(
				Searchable::$TYPE_USER,
				Searchable::$TYPE_NETWORK
			));

			$pw = $this->_createProfileWidget($typeBit);

			$this->assertFalse($pw->isMulti());
			$this->assertFalse($pw->isGroup());
			$this->assertTrue($pw->isNetwork());
			$this->assertTrue($pw->isUser());
			$this->assertEqual($this->_name, $pw->getName());
			$this->assertEqual($this->_nameTab, $pw->getNameTab());
			$this->assertEqual($this->_order, $pw->getOrder());

			$pw->setOrder(12);
			$pw->setNameTab('bogus');
			$this->_man->updateProfileWidget($pw);

			$pw2 = $this->_man->getProfileWidgetById($pw->getId(), false);
			$this->assertEqual($pw->getId(), $pw2->getId());
			$this->assertEqual('bogus', $pw2->getNameTab());
			$this->assertEqual(12, $pw2->getOrder());
        }

		function test_updateProfileWidgetOrder() {
			$pwAll = $this->_man->getProfileWidgetsBySearchableType();
			$pw1 = $pwAll[0];
			$pw2 = $pwAll[1];

			$pw1OrigOrder = $pw1->getOrder();
			$pw2OrigOrder = $pw2->getOrder();

			$this->_man->updateProfileWidgetOrder($pw1->getId(), $pw2->getId(), $pw2OrigOrder, $pw1OrigOrder);

			$pw1 = $this->_man->getProfileWidgetById($pw1->getId());
			$pw2 = $this->_man->getProfileWidgetById($pw2->getId());

			$this->assertEqual($pw1->getOrder(), $pw2OrigOrder);
			$this->assertEqual($pw2->getOrder(), $pw1OrigOrder);

			$this->_man->updateProfileWidgetOrder($pw1->getId(), $pw2->getId(), $pw1OrigOrder, $pw2OrigOrder);
		}

		// massive test, because these things can't really be broken out until I have fixtures
		function test_profileWidgetField() {
			$pw = $this->_createProfileWidget(1);

			$pwf = $this->_createProfileWidgetField($pw->getId(), ProfileWidgetField::$TYPE_AUTOCOMPLETE);
			$this->assertEqual(ProfileWidgetField::$TYPE_SELECT, $pwf->getDataTable());
			$this->_man->updateProfileWidgetField($pwf);
			$nameToDelete = $pwf->getName();

			$pwf = $this->_createProfileWidgetField($pw->getId(), ProfileWidgetField::$TYPE_DATETIME);
			$this->assertEqual(ProfileWidgetField::$TYPE_DATETIME, $pwf->getDataTable());
			$this->_man->updateProfileWidgetField($pwf);

			$pwf = $this->_createProfileWidgetField($pw->getId(), ProfileWidgetField::$TYPE_DATE_RANGE);
			$this->assertEqual(ProfileWidgetField::$TYPE_DATE_RANGE, $pwf->getDataTable());
			$this->_man->updateProfileWidgetField($pwf);

			$pwf = $this->_createProfileWidgetField($pw->getId(), ProfileWidgetField::$TYPE_IMAGE);
			$this->assertEqual(ProfileWidgetField::$TYPE_TEXT, $pwf->getDataTable());
			$this->_man->updateProfileWidgetField($pwf);

			$pwf = $this->_createProfileWidgetField($pw->getId(), ProfileWidgetField::$TYPE_LIST);
			$this->assertEqual(ProfileWidgetField::$TYPE_TEXT_AREA, $pwf->getDataTable());
			$this->_man->updateProfileWidgetField($pwf);

			$pwf = $this->_createProfileWidgetField($pw->getId(), ProfileWidgetField::$TYPE_PORTRAIT);
			$this->assertEqual(ProfileWidgetField::$TYPE_TEXT, $pwf->getDataTable());
			$this->_man->updateProfileWidgetField($pwf);

			$pwf = $this->_createProfileWidgetField($pw->getId(), ProfileWidgetField::$TYPE_SELECT);
			$this->assertEqual(ProfileWidgetField::$TYPE_SELECT, $pwf->getDataTable());
			$this->_man->updateProfileWidgetField($pwf);

			$pwf = $this->_createProfileWidgetField($pw->getId(), ProfileWidgetField::$TYPE_TEXT);
			$this->assertEqual(ProfileWidgetField::$TYPE_TEXT, $pwf->getDataTable());
			$this->_man->updateProfileWidgetField($pwf);

			$pwf = $this->_createProfileWidgetField($pw->getId(), ProfileWidgetField::$TYPE_TEXT_AREA);
			$this->assertEqual(ProfileWidgetField::$TYPE_TEXT_AREA, $pwf->getDataTable());
			$this->_man->updateProfileWidgetField($pwf);

			$pw->setFieldCount($this->_man->getFieldCount($pw));
			$this->assertEqual(9, $pw->getFieldCount());
			$this->_man->deleteProfileWidgetField($pwf);
			$this->assertEqual(8, $this->_man->getFieldCount($pw));
			$this->assertEqual(1, $this->_man->getFieldCount($pw, Searchable::$STATUS_DELETED));

			$pw2 = $this->_man->getProfileWidgetByFieldName($nameToDelete);
			$this->assertEqual($pw2->getId(), $pw->getId());

			$pw = $this->_man->getProfileWidgetById($pw->getId());

			$pwf2 = $this->_man->getProfileWidgetFieldById($pwf->getId());

			$false = $this->_man->isProfileWidgetFieldNameAvailable('test_' . ProfileWidgetField::$TYPE_TEXT);
			$true = $this->_man->isProfileWidgetFieldNameAvailable('test_asdfad');

			$this->assertEqual(false, $false);
			$this->assertEqual(true, $true);

			$this->assertEqual($pwf->getId(), $pwf2->getId());

			$fields = $this->_man->getRequiredProfileWidgetFields(1, Searchable::$TYPE_USER);
			$this->assertTrue(0 < sizeof($fields));

			foreach ($pw->getFields() as $pwf) {
				$this->_man->deleteProfileWidgetField($pwf);
			}
			
			$this->_man->deleteProfileWidget($pw);

			// deleteSelectOptions, getProfileWidgetFieldValues, readProfileWidgetFieldValues, getProfileWidgetsFieldValues, updateProfileWidgetFieldByWidget, updateProfileWidgetFields
			// create a new profile widget
			// add one of each type of profile widget field to it
			// do some searching
			// do some changes
			// do some more searching
			// do some deletion
			// do some more searching
		}
    }

    $test = &new TestSetup();
    $test->run(new TextReporter());
?>
