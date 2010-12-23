/**
 * Copyright (c) 2007, Matt Snider, LLC. All rights reserved.
 * Version: 1.0
 */

/**
 * The Home class manages the Business Logic for the User Home
 *
 * @namespace Core.Controller
 * @class Home
 * @dependencies library
 */

//Core.Controller.Home = function() {
//
//	//
//	//	Module namespace
//	//
//
//	var self = null;
//
//
//	//
//	//	Module dom namespace
//	//
//
//	var dom = {
//		newGroups: 'search-newgroup',
//		news: 'news-list',
//		newContacts: 'search-newcontact',
//		siteRename: 'form-sitename'
//	};
//
//
//	//
//	//	Module event namespace
//	//
//
//	var evt = {
//
//
//		/**
//		 *	Event callback function for clicking more on the news articles
//		 *  @param 	e {Event} Triggering JavaScript Event, onclick
//		 */
//		onMore: function(e) {
//			var targ = Event.element(e),
//				result = Dom.getParent(targ, 'li', Core.Constants.CLASS_RESULT);
//
//			if ('[more]' == Dom.getContentAsString(targ)) {
//				Dom.replace(targ, '[less]');
//				Dom.hide(result.getElementsByTagName('span')[1]);
//				Dom.show(result.getElementsByTagName('div')[0]);
//			}
//			else {
//				Dom.replace(targ, '[more]');
//				Dom.show(result.getElementsByTagName('span')[1]);
//				Dom.hide(result.getElementsByTagName('div')[0]);
//			}
//		},
//
//
//		/**
//		 * Sends the request to add a new site name
//		 *
//		 * @method onRenameSubmit
//		 * @param e {Event} JavaScript Event, onsubmit
//		 * @private
//		 */
//		onRenameSubmit: function(e) {
//			Event.stopEvent(e);
//
//			YAHOO.util.Connect.asyncRequest('post', 'userSubmit.action', {
//				abort: 5000,
//				failer: emptyFunction,
//				success: emptyFunction
//			}, Form.serialize(Event.element(e, 'form')));
//
//			$('sitename').value = '';
//			Alert('Your entry has been successfully submitted. Thanks for your participation.', 'Entry Confirmation', {});
//		}
//	};
//
//
//	//
//	//	Public methods and constants
//	//
//
//	return {
//
//
//		/**
//		 *  initialize the object, put elements here that use global object elements (like static variables)
//		 */
//		init: function() {
//			// initialize DOM references that are not null
//			for (var k in dom) {
//				if (isString(dom[k])) {
//					dom[k] = $(dom[k]);
//				}
//			}
//
//			self = Core.Biz.Home;
//
//			if (dom.newContacts) {Core.Widget.MemberConfirmation(dom.newContacts);}
//			if (dom.newGroups) {Core.Widget.MemberConfirmation(dom.newGroups);}
//
//			if (dom.news) {
//				var anchors = dom.news.getElementsByTagName('a');
//				for (var i=anchors.length-1; 0<=i; i--) {
//					Event.addListener(anchors[i], Event.ON_MOUSE_DOWN, evt.onMore);
//				}
//			}
//
//			Event.addListener(dom.siteRename, Event.ON_SUBMIT, evt.onRenameSubmit);
//		}
//	};
//}();
//
//YAHOO.util.Event.onDOMReady(Core.Controller.Home.init);

// test methods
//Core.Controller.Controller.get('home.action', function(a, b, c, d) {
//	var testing = '';
//}, ['arg1', 'arg2', 'arg3']);

/**
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0
 */

/**
 * The Mailbox class manages the business logic of the mailbox page.
 * @namespace Core.Controller
 * @class Mailbox
 */

YUI($YO).use('node', 'yui3-ext', 'cameleon-notification', function(Y) {
	var notification = new Y.Notification({boundingBox: '#home-notification'});
	notification.render();
});