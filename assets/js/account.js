/**
 *	Copyright (c) 2007, Matt Snider, LLC. All rights reserved.
 *	Version: 1.0
 */

/**
 *  The Account class manages business logic for the "My Account" page
 *  @namespace Core.Controller
 *  @class Account
 *  @dependencies library
 */
YUI($YO).use('yui3-ext', 'io-base', 'gallery-node-form', function(Y) {
	// constants
	var EVENT_SUBMIT = 'submit',

		// DOM namespace
			_elFormAccount = Y.one('#form-account'),

		/**
		 * When data is valid, send the request, otherwise, show the error message.
		 * @method _fnValidateAndAction
		 * @param node {Element} Required. The error DOM node.
		 * @param msg {String} Required. The error message.
		 * @param func {Function} Required. The request Function.
		 * @param fl {Boolean} Required. The if data is valid.
		 * @private
		 */
			_fnValidateAndAction = function(node, msg, func, fl) {
				if (fl) {
					func();
					node.removeChildNodes();
				}
				else {
					node.set('content', msg);
				}

				node.toggleDisplay(! fl);
			},

		////
		// request namespace
		////

		/**
		 * Performs the AJAX request to deactivate a User.
		 * @method _fnDeactivate
		 * @private
		 */
			_fnDeactivate = function() {
				_elFormAccount.submit();
			},

		////
		// event namespace
		////

		/**
		 * Event callback function for submitting the deactivation form, verifies this request one last time.
		 * @method _fnHandleDeactivate
		 * @param e {Event} Required. The triggered JavaScript 'submit' event.
		 * @private
		 */
			_fnHandleDeactivate = function(e) {
				e.halt();
			};

	_elFormAccount.on(EVENT_SUBMIT, _fnHandleDeactivate);
});