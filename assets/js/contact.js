
/**
 *	Copyright (c) 2007, Matt Snider, LLC. All rights reserved.
 *	Version: 1.0
 */

/**
 *  The Contact class manages business logic of the contact.action
 *  @namespace Core.Biz
 *  @class Contact
 *  @dependencies library
 */

Core.Biz.Contact = function() {
	var cFilterValues = {
		AllFriends		: 0,
		RecentlyUpdated	: 1,
		RecentlyAdded	: 2,
		RecentlyOnline	: 3
	};

	var dom = {
		newContactList: 'info-box-searchlist'
	};

	var SearchResults = null;

	return {


		/**
		 *  initialize the object, put elements here that use global object elements (like static variables)
		 */
		init: function() {
			// initialize DOM references that are not null
			for (var k in dom) {
				if (isString(dom[k])) {
					dom[k] = $(dom[k]);
				}
			}

			var fades = document.getElementsByTagAndClass(Core.Constants.CLASS_FADE, 'li', dom.newContactList);
			for (var i=0, li; li=fades[i]; i++) {
				var anim = new YAHOO.util.ColorAnim(li, {backgroundColor: {to: '#CFEBF7'}});
				anim.animate();
			}

			SearchResults = new Core.Widget.SearchResults('searchList');
		}
	};
}();

YAHOO.util.Event.onDOMReady(Core.Biz.Contact.init);
