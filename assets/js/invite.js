
/**
 *	Copyright (c) 2007, Matt Snider, LLC. All rights reserved.
 *	Version: 1.0
 */

/**
 *  The Invite class manages business logic for the "Invite" page
 *  @namespace Core.Biz
 *  @class Invite
 *  @dependencies library
 */

YUI($YO).use('node', 'yui3-ext', function(Y) {

	// DOM namespace
var _domNote = Y.one('#form-invite-note'),
	_domText = Y.one('#example-text'),

	////
	// event namespace
	////

	/**
	 *	Event callback function for changing the note
	 *  @param 	e {Event} Triggering JavaScript Event, onsubmit
	 *	@private
	 */
	_evtOnKeydown = function() {
		setTimeout(function() {
			var test = Y.String.stripTags(_domNote.get('value')).replace(/\n/g, '<br />');
			_domText.set('innerHTML', test)
		}, 100);
	};

	_evtOnKeydown();
	_domNote.on('keydown', _evtOnKeydown);
});