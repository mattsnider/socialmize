/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.00
 */

YUI().add('gallery-tab-manager', function(Y) {

/**
 * Create a tab management object to handle tabbing interactions.
 *
 * @module TabManager
 */

var LANG = Y.Lang;

/**
 * Creates an instance of TabManager to manage tab interactions and their content.
 *
 * @class TabManager
 * @extends Widget
 * @param config {Object} Configuration object
 * @constructor
 */
function TabManager() {
	TabManager.superclass.constructor.apply(this,arguments);
}

Y.mix(TabManager, {
	/**
	 * @property TabManager.NAME
	 * @type String
	 * @static
	 */
	NAME : 'gallery-tab-manager',

	/**
	 * @property TabManager.ATTRS
	 * @type Object
	 * @static
	 */
	ATTRS : {

		/**
		 * @attribute contentLocator
		 * @type String
		 * @default 'rel'
		 * @description The HTML attribute where the content ID is stored.
		 */
		contentLocator: {
			value : 'rel',
			validator : LANG.isString
		},
		
		/**
		 * @attribute registeredTabs
		 * @type Object
		 * @default []
		 * @description The registered tab objects.
		 */
		registeredTabs: {
			value : [],
			validator : LANG.isArray,
			setter : function (val) {
				var arr = [];
				Y.each(val, function(o) {
					if (TabManager.validateTabObject(o)) {
						arr.push(o);
					}
				});
				return arr;
			}
		},

		/**
		 * @attribute selectedTabClass
		 * @type String
		 * @default 'selected'
		 * @description The HTML class attribute applied to tab when selected.
		 */
		selectedTabClass: {
			value : 'selected',
			validator : LANG.isString
		},

		/**
		 * @attribute selectedContainerClass
		 * @type String
		 * @default 'selected'
		 * @description The HTML class attribute applied to tab container when selected.
		 */
		selectedContainerClass: {
			value : 'selected',
			validator : LANG.isString
		},

		/**
		 * @attribute tabClass
		 * @type String
		 * @default ''
		 * @description The HTML class attribute to tab against.
		 */
		tabClass: {
			value : '',
			validator : LANG.isString
		},
		
		/**
		 * @attribute tabLocator
		 * @type String
		 * @default 'a'
		 * @description The HTML tag to tab against.
		 */
		tabLocator: {
			value : 'a',
			validator : LANG.isString,
			setter : function (val) {
				return val.toLowerCase();
			}
		}
	},

	/**
	 * Validates the tab object before registration.
	 * @method validateTabObject
	 * @param o {Object} Required. The tab object to register.
	 * @return {Boolean} Tab object validates.
	 * @protected
	 */
	validateTabObject: function(o) {
		if (LANG.isString(o.container)) {o.container = Y.get(o.container);}
		if (LANG.isString(o.tab)) {o.tab = Y.get(o.tab);}
		return LANG.isObject(o) && o.container && o.tab;
	}
});

Y.extend(TabManager, Y.Widget, {

	/**
	 * @property _clickHandle
	 * @type Object
	 * @description A click handling event.
	 */
	_clickHandle: null,

	/**
	 * @property _selectedIndex
	 * @type Number
	 * @description The selected tab index.
	 */
	_selectedIndex: null,

	/**
	 * The callback function for clicking on the tab content box.
	 * @method _handleClick
	 * @param e {Event} Required. The triggered JavaScript 'click' event.
	 * @protected
	 */
	_handleClick: function(e) {
		var that = this,
			tagClass = that.get('tabClass'),
			root = this.get('contentBox'),
			targ = e.target,
			registeredTabs = that.get('registeredTabs'),
			selectedTabClass = that.get('selectedTabClass'),
			selectedContainerClass = that.get('selectedContainerClass'),
			selectedTab = registeredTabs[that._selectedIndex],
			isTargLocator = targ.isTagName(that.get('tabLocator')),
			ancestor;

		// special logic for when tabLocator is not the anchor
		if (! isTargLocator) {
			ancestor = targ.ancestor(that.get('tabLocator'));

			if (root.contains(ancestor)) {
				targ = ancestor;
				isTargLocator = true;
			}
		}

		if (isTargLocator && (! tagClass || targ.hasClass(tagClass))) {
			e.halt();
			
			Y.each(registeredTabs, function(o, i) {
				if (o.tab && o.tab.getAttribute('id') === targ.getAttribute('id')) {
					// update the classes of existing tab
					if (selectedTab) {
						selectedTab = registeredTabs[that._selectedIndex];
						selectedTab.tab.removeClass(selectedTabClass);
						selectedTab.container.removeClass(selectedContainerClass);
					}

					// select the new tab
					that._selectedIndex = i;
					selectedTab = o;
					selectedTab.tab.addClass(selectedTabClass);
					selectedTab.container.addClass(selectedContainerClass);

					var elInput = selectedTab.container.one('input[autofocus]');
					if (elInput) {
						elInput.focus();
					}
				}
			});
		}
	},

	/**
	 * See widget bindUI.
	 * @method bindUI
	 * @public
	 */
	bindUI: function () {
		this._evtClick = this.get('contentBox').on('click', this._handleClick, this);
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
	 * See widget initializer.
	 * @method initializer
	 * @param config {Object} Required. A configuration object.
	 * @public
	 */
	initializer: function (config) {
		var that = this;
		that.publish('tab');
		that.publish('tabclick');
		that._selectedIndex = 0;
	},

	/**
	 * Registers a tab; used when dynamically adding tabs after instantiation.
	 * @method registerTab
	 * @param o {Object} Required. The tab object to register.
	 * @public
	 */
	registerTab: function(o) {
		if (TabManager.validateTabObject(o)) {
			var registeredTabs = this.get('registeredTabs');
			registeredTabs.push(o);
		}
	},

	/**
	 * See widget renderUI.
	 * @method renderUI
	 * @public
	 */
	renderUI: function() {
		var that = this;
		Y.each(that.get('registeredTabs'), function(o, i) {
			if (o.isSelected) {
				that._handleClick({target: o.tab, halt: function() {}});
			}
		});
	},

	/**
	 * See widget syncUI.
	 * @method syncUI
	 * @public
	 */
	syncUI: function () {
		var that = this,
			contentLocator = that.get('contentLocator'),
			items = that.get('contentBox').getElementsByTagName(that.get('tabLocator')),
			registeredTabs = that.get('registeredTabs'),
			selectedTabClass = that.get('selectedTabClass');

		// only sync from the UI if tabs were not manually registered
		if (! registeredTabs.length) {
			// iterate on the tab items found in the content box
			Y.each(items, function(item) {
				var o = {
					container: item.getAttribute(contentLocator),
					isSelected: item.hasClass(selectedTabClass),
					tab: item
				};

				// register those items
				if (TabManager.validateTabObject(o)) {
					if (o.isSelected) {
						that._selectedIndex = registeredTabs.length;
					}

					registeredTabs.push(o);
				}
			});

			that.set('registeredTabs', registeredTabs);
		}
	}
});

Y.TabManager = TabManager;

}, {requires: ['widget', 'yui3-ext']});