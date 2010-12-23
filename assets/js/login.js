/**
 * Copyright (c) 2007, Matt Snider, LLC All rights reserved.
 * Version: 1.0
 */

(function() {
	document.getElementById('form-login-jsEnabled').value = 'true';
	document.getElementById('form-login-jsEnabled').value = 'true';
}());

/**
 * Manges the Login page controller logic.
 * @module Login
 */
YUI($YO).use('gallery-tab-manager', 'event-simulate', function(Y) {
	var tabManager = new Y.TabManager({
		boundingBox: '#tab-login-bb',
		contentBox: '#tab-login',
		tabLocator: 'li',
		contentLocator: 'rel'
	});
	tabManager.render();

	// todo: add form manager
});