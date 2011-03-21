<?php

import('studs.action.Action');
import('project.service.UserManager');

/**
 * @package project.action
 */
class ControllerPaypalIPN extends Action {

	function &execute(&$mapping, &$form, &$request, &$response) {
		$log =& Logger::getLogger('project.action.TestAction');

		$payment_status = $request->getParameter('payment_status');
		$invoice = $request->getParameter('invoice'); // should be the user id

		dlog(var_export($request->getParameterMap(), true));

		$man = new UserManager($this->getDataSource($request));

		$S = $man->getSearchableById($invoice);

		if ($S && 'Completed' == $payment_status) {
			$S->setStatus(Searchable::$STATUS_ACTIVE);
			$man->updateSearchable($S);
		}

		return $mapping->findForward(ref('json'));
	}

}

//HashMap::__set_state(array(
//   '_entries' =>
//  array (
//	'test_ipn' =>
//	array (
//	  0 => '1',
//	),
//	'payment_type' =>
//	array (
//	  0 => 'instant',
//	),
//	'payment_date' =>
//	array (
//	  0 => '19:06:40 Mar 20, 2011 PDT',
//	),
//	'payment_status' =>
//	array (
//	  0 => 'Completed',
//	),
//	'payer_status' =>
//	array (
//	  0 => 'verified',
//	),
//	'first_name' =>
//	array (
//	  0 => 'John',
//	),
//	'last_name' =>
//	array (
//	  0 => 'Smith',
//	),
//	'payer_email' =>
//	array (
//	  0 => 'buyer@paypalsandbox.com',
//	),
//	'payer_id' =>
//	array (
//	  0 => 'TESTBUYERID01',
//	),
//	'business' =>
//	array (
//	  0 => 'seller@paypalsandbox.com',
//	),
//	'receiver_email' =>
//	array (
//	  0 => 'seller@paypalsandbox.com',
//	),
//	'receiver_id' =>
//	array (
//	  0 => 'TESTSELLERID1',
//	),
//	'residence_country' =>
//	array (
//	  0 => 'US',
//	),
//	'item_name1' =>
//	array (
//	  0 => 'something',
//	),
//	'item_number1' =>
//	array (
//	  0 => 'AK-1234',
//	),
//	'quantity1' =>
//	array (
//	  0 => '1',
//	),
//	'tax' =>
//	array (
//	  0 => '2.02',
//	),
//	'mc_currency' =>
//	array (
//	  0 => 'USD',
//	),
//	'mc_fee' =>
//	array (
//	  0 => '0.44',
//	),
//	'mc_gross' =>
//	array (
//	  0 => '15.34',
//	),
//	'mc_gross_1' =>
//	array (
//	  0 => '12.34',
//	),
//	'mc_handling' =>
//	array (
//	  0 => '2.06',
//	),
//	'mc_handling1' =>
//	array (
//	  0 => '1.67',
//	),
//	'mc_shipping' =>
//	array (
//	  0 => '3.02',
//	),
//	'mc_shipping1' =>
//	array (
//	  0 => '1.02',
//	),
//	'txn_type' =>
//	array (
//	  0 => 'cart',
//	),
//	'txn_id' =>
//	array (
//	  0 => '4032126',
//	),
//	'notify_version' =>
//	array (
//	  0 => '2.4',
//	),
//	'custom' =>
//	array (
//	  0 => 'xyz123',
//	),
//	'invoice' =>
//	array (
//	  0 => 'abc1234',
//	),
//	'charset' =>
//	array (
//	  0 => 'windows-1252',
//	),
//	'verify_sign' =>
//	array (
//	  0 => 'AIGwKknWeu5UBOCAJs-vUFiHuhNIAKQCUyJLA8ijCu7pn3mNvBVPw-C4',
//	),
//  ),
//))
