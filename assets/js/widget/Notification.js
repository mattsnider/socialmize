/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.00
 */

YUI().add('cameleon-notification', function(Y) {
	_initIO(Y);

	/**
	 * Creates a Node object augmented with extra input functionality.
	 *
	 * @module Notification
	 */

	var LANG = Y.Lang;

	/**
	 * Creates an instance of Notification to manage tab interactions and their content.
	 *
	 * @class Notification
	 * @extends Y.Widget
	 * @param config {Object} Configuration object
	 * @constructor
	 */
	Notification = Y.Base.create('cameleon-notification', Y.Widget, [], {

		/**
		 * @property _clickHandle
		 * @type Object
		 * @description A click handling event.
		 */
		_clickHandle: null,

		_handleClick: function(e) {
			var elTarg = e.target,
					sClsDimiss;

			if (elTarg.isTagName('a')) {
				sClsDimiss = this.get('classForDismissAction');

				if (elTarg.hasClass(sClsDimiss)) {
					e.halt();
					this.dismissNotification(elTarg);
				}
			}
		},

		/**
		 * See widget initializer.
		 * @method bindUI
		 * @public
		 */
		bindUI: function (config) {
			this._clickHandle = this.get('boundingBox').on('click', this._handleClick, this);
		},

		/**
		 * See widget destructor.
		 * @method destructor
		 * @public
		 */
		destructor: function () {
			if (this._clickHandle) {this._clickHandle.detach();}
		},

		/**
		 * Deletes the notification using AJAX.
		 * @method dismissNotification
		 * @param anchor {Element} Required. The `A` element that triggers the dismiss.
		 * @public
		 */
		dismissNotification: function(anchor) {
			var elRoot = anchor.ancestor('li'),
					aUrl, oAnim, elUl;

			if (! elRoot.isDisabled()) {
				elUl = elRoot.ancestor('ul');
				oAnim = elRoot.deleteNode({});

				oAnim.after('end', function() {
					if (! elUl.all('li').size()) {
						elUl.next().toggleDisplay(true);
					}
				});

				aUrl = Y.String.parseUrl(anchor.get('href'));
				aUrl[1] += "&isAjax=t";
				Y.io(aUrl[0], {data: aUrl[1], method: 'POST'});
			}
		}
	}, {

		/**
		 * @property Notification.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS : {
			classForAcceptAction: {
				validator: LANG.isString,
				value: 'accept'
			},
			classForDismissAction: {
				validator: LANG.isString,
				value: 'dismiss'
			}
		}
	});

	Y.Notification = Notification;

}, {requires: ['node', 'widget', 'yui3-ext', 'io']});