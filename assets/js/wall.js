/**
 * Copyright (c) 2007, Matt Snider, LLC. All rights reserved.
 * Version: 1.0
 */

/**
 * The Wall class manages business logic of the wall.action
 * @namespace Core.Controller
 * @class Wall
 * @dependencies library
 */
YUI($YO).use('node', 'yui3-ext', 'gallery-node-input', function(Y) {

	// DOM namespace
var	_domForm = Y.one('#wall-form'),
	_domList = Y.one('#wall-list'),
	_domText = Y.one('#wall-text'),

	_nodeInputText,

	// event namespace

	/**
	 * Callback function for deleting a wall post to assert user intention
	 * @method _handleDeleteWallPost
	 * @param e {Event} Required. The triggered JavaScript Event, onclick.
	 * @private
	 */
	_handleDeleteWallPost = function(e) {
		var targ = e.ancestor('table'),
			form;

		if (confirm("Are you sure you want to delete this wall post?\n\nWall Post Delete Action - Confirm")) {
			form = targ.one('form');
			form.one('input[type=text][name=task]').set('value',"D");
			form.submit();
		}
	},

	/**
	 * Callback function for checking the character length
	 * @method _handleCharlenCheck
	 * @param e {Event} Required. The triggered JavaScript Event, onclick.
	 * @private
	 */
	_handleCharlenCheck = function(e) {
		var targ = e.target,
			error = targ.get('parentNode').one('p.error');

		error.toggleVisibility(999 < targ.get('value').length);
	};

    if (_domForm) {
        _domText.on('keydown', _handleCharlenCheck);
		_nodeInputText = new Y.NodeInput({input: _domText, blurText: 'Write something...'});

        if ('T' == Y.String.getQueryValue(window.location.href,'edit')) {
            _domText.set('value',"");
			_domText.removeClass('empty');
            _domText.focus();
        }
    }

	Y.each(_domList.all('a.action-delete'), function(lnk) {
        lnk.on('click', _handleDeleteWallPost);
    });

    _domForm.on('submit', function(e) {
        var valid = true;

        if (valid) {
            _domForm.disabled = true;
        }
        else {
            e.halt(e);
        }
    });
});