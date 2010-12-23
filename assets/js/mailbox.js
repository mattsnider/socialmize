/**
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0
 */

/**
 * The Mailbox class manages the business logic of the mailbox page.
 * @namespace Core.Controller
 * @class Mailbox
 */

YUI($YO).use('node', 'yui3-ext', function(Y) {
	// constants
var CLS_CHECKED = 'checked',
	CLS_RESULT = 'result',
	IMG_NEW = 'mail_new.gif',
	IMG_READ = 'mail_read.gif',
	IMG_REPLIED = 'mail_replied.gif',

	// DOM namespace
	_domCheckboxes,
	_domFilterAction,
	_domMessageCheckAll = Y.one('#message-chk-all'),
	_domMessageForm = Y.one('#message-form'),
	_domMessageFormTask = _domMessageForm.one('#message-form-task'),
	_domMessageFormId = _domMessageForm.one('#message-form-mId'),
	_domMessageList = Y.one('#message-list'),
	_domMessageListTb,

	// event namespace

	/**
	 * Handles the dispatching of click events.
	 * @method _dispatchClick
	 * @param e {Event} Required. The triggered JavaScript click event.
	 * @private
	 */
	_dispatchClick = function(e) {
		var targ = e.target
			tagName = targ.getTagName();

		if ('a' === tagName) {
			var rel = targ.get('rel');

			if (rel) {
				_toggleCheckboxesByType(rel);
			}
		}

		if ('input' === tagName) {
			if ('checkbox' === targ.get('type')) {
				if (targ === _domMessageCheckAll) {
					_toggleCheckboxesByType(targ.get('checked')? 'all': 'none');
				}
				else {
					_toggleCheckedState(targ, targ.get('checked'));
				}
			}
		}
	},

	/**
	 * Event callback function for changing the multiple update dropdown.
	 * @method _handleGroupAction
	 * @param e {Event} Required. The triggered JavaScript change event.
	 * @private
	 */
	_handleGroupAction = function(e) {
		_domMessageFormTask.set('value', e.target.get('value'));
		_domMessageFormId.set('value', _getCheckedMessageIds().join(','));
		_domMessageForm.submit();
	},

	// local functions

	/**
	 * Fetches the message IDs of the checked rows.
	 * @method _getCheckedMessageIds
	 * @return {Array} A list of message IDs.
	 * @private
	 */
	_getCheckedMessageIds = function() {
		var list = [];
		Y.each(_domCheckboxes, function(chkbox) {
			if (chkbox.get('checked')) {
				var row = chkbox.ancestor('tr'),
					id = row.get('id').replace(/.*?\-/, '');
				list.push(id);
			}
		});
		return list;
	},

	/**
	 * Checks or unchecks a row by its checkbox.
	 * @method _toggleCheckedState
	 * @param chkbox {Element} Required. An input checkbox element.
	 * @param isChecked {Boolean} Required. The desired checked state of element.
	 * @private
	 */
	_toggleCheckedState = function(chkbox, isChecked) {
		var row = chkbox.ancestor('tr.' + CLS_RESULT);
		chkbox.set('checked', isChecked);
		row.toggleClass(CLS_CHECKED, isChecked);
	},

	/**
	 * Iterates through the checkboxes, checking the checkboxes that match the provided status.
	 * @method _toggleCheckboxesByType
	 * @param status {String} Required. The message status.
	 * @private
	 */
	_toggleCheckboxesByType = function(status) {
		var isAll = 'all' === status;
		_domMessageCheckAll.set('check', 'all' === status);

		// iterate on the inputs and check them
		Y.each(_domCheckboxes, function(chkbox) {
			_toggleCheckedState(chkbox, isAll || chkbox.get('alt') === status);
		});
	};


if (_domMessageList) {
	// fetch nodes
	_domMessageListTb = _domMessageList.one('tbody');
	_domCheckboxes = _domMessageListTb.all('input[type=checkbox]');
	_domFilterAction = Y.one('#filter-action'),

	// attach listeners
	Y.one('#filter-action-chooser').on('change', _handleGroupAction);
	_domMessageList.on('click', _dispatchClick);
	_domFilterAction.on('click', _dispatchClick);
}
});