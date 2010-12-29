/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.01
 */

/**
 * The CheckboxListFilter classes manages a scrollable list of checkboxes that is rendered via JavaScript.
 * @namespace Core.Widget
 * @class CheckboxListFilter
 */
YUI().add('checkboxListFilter', function(Y) {

var CLS_DISABLED = 'disabled';

// This CheckboxListFilter is designed to be added to Node instances (the host will be a Node instance)
function CheckboxListFilter(config) {
	// Hold onto the host instance (a Node in this case),
	// for other plugin methods to use.

	this._host = config.host;
	this._areTypesEnables = false;

	CheckboxListFilter.superclass.constructor.apply(this, arguments);
}

// When plugged into a node instance, the plugin will be
// available on the "anchors" property.
CheckboxListFilter.NS = "checkboxListFilter";

CheckboxListFilter.ATTRS = {

	// The filter node for this widget.
	filter: {
		setter: function(node) {
			var n = Y.one(node);
			if (!n) {
				Y.fail('CheckboxList: Invalid filter provided: ' + node);
			}
			return n;
		}
	},

	// The filter type node for this widget.
	filterTypes: {
	},

	// the datasource
	filterSource: {

	},

	// The filter btn node for this widget.
	filterTrigger: {
		setter: function(node) {
			var n = Y.one(node);
			if (!n) {
				Y.fail('CheckboxList: Invalid filter provided: ' + node);
			}
			return n;
		}
	},

	limit: {
		validator: function(val) {
			return Y.Lang.isNumber(val) && 10 <= val;
		},
		value: 10
	},

	limitNode: {
		setter: function(node) {
			var n = Y.one(node);
			if (!n) {
				Y.fail('CheckboxList: Invalid filter provided: ' + node);
			}
			return n;
		}
	},

	// The next link node for this widget.
	linkNext: {
		setter: function(node) {
			var n = Y.one(node);
			if (!n) {
				Y.fail('CheckboxList: Invalid next link provided: ' + node);
			}
			return n;
		}
	},

	// The previous link node for this widget.
	linkPrevious: {
		setter: function(node) {
			var n = Y.one(node);
			if (!n) {
				Y.fail('CheckboxList: Invalid previous link provided: ' + node);
			}
			return n;
		}
	},

	offset: {
		validator: function(val) {
			return Y.Lang.isNumber(val) && 0 <= val;
		},
		value: 0
	},

	offsetNode: {
		setter: function(node) {
			var n = Y.one(node);
			if (!n) {
				Y.fail('CheckboxList: Invalid filter provided: ' + node);
			}
			return n;
		}
	}
};

Y.extend(CheckboxListFilter, Y.Plugin.Base, {
	_filterKeyDownHandle: null,
	_filterKeyTimer: null,
	_host: null,
	_lastValue: null,
	_areTypesEnables: null,

	bindUI: function() {
		var that = this,
			filterTypes = that.get('filterTypes');

		that._filterKeyDownHandle = that.get('filter').on('keypress', Y.bind(that._handleKeyDown, that));
		Y.on('click', Y.bind(that._dispatchClick, that), [
			that.get('filterTrigger'),
			that.get('linkNext'),
			that.get('linkPrevious')
		]);
		if (filterTypes) {filterTypes.on('change', Y.bind(that._handleChange, that));}
	},

	/**
	 * Destroys the widget.
	 * @method destructor
	 * @public
	 */
	destructor: function() { 
		if (this._filterKeyDownHandle) {this._filterKeyDownHandle.detach();}
		if (this._filterKeyTimer) {this._filterKeyTimer.cancel();}
	},

	_dispatchClick: function(e) {
		var targ = e.target,
			_this = this,
			offset, limit;

		if ('a' == targ.get('tagName').toLowerCase()) {
			e.halt();
			offset = _this.get('offset');
			limit = _this.get('limit');
			offset += targ.hasClass('next') ? limit : -limit;
			_this.set('offset', offset);
			_this.get('linkPrevious').toggleDisplay(0 !== offset);
			_this.syncUI();
			_this.updateContent();
		}

		if (e.target.get('id') == _this.get('filterTrigger').get('id')) {
			_this.filter();
		}
	},

	/**
	 * Filters the checkbox list.
	 * @method filter
	 * @param str {String} Optional. A value to filter by.
	 * @public
	 */
	filter: function(str) {
		var value = (str || this.get('filter').get('value')).toLowerCase();

		if (this._lastValue != value) {
			this._lastValue = value;
			this.updateLocalContent(function(item) {
				return -1 < item.last().get('innerHTML').toLowerCase().indexOf(value);
			});
		}
	},

	/**
	 * Handles the checking/unchecking of the type filters.
	 * @method _handleChange
	 * @param e {Event} Required. The triggered `change` JavaScript event.
	 * @protected
	 */
	_handleChange: function(e) {
//		this.updateContent();
		var filterTypes = this.get('filterTypes'),
			classes = [];

		filterTypes.each(function(node) {
			if (node.get('checked')) {
				classes.push(node.parent().next().first().get('innerHTML'))
			}
		});

		this.updateLocalContent(function(item) {
			return item.hasClassIn(classes);
		});
	},

	/**
	 * Handles the AJAX response to update the searchable list.
	 * @method _handleFilterSource
	 * @param o {Object} Required. The response object.
	 * @public
	 */
	_handleFilterSource: function(o) {
		var list = this._host,
			limit = this.get('limit'),
			offset = this.get('offset'),
			rs = o.response;

		list.set('json', rs.results);
		list[list.get('rendered') ? 'syncUI' : 'render']();
		this.get('linkNext').toggleDisplay(limit + offset < rs.meta.resultn);
	},

	/**
	 * Handles the keystrokes in the filter.
	 * @method _handleKeyDown
	 * @param e {Event} Required. The triggered `keydown` JavaScript event.
	 * @protected
	 */
	_handleKeyDown: function(e) {
		var keyCode = e.keyCode;

		// stop on enter
		if (13 === keyCode) {
			e.halt();
			this.filter();
		}
		// only filter when a number, backspace, or character is used
		else if (8 === keyCode || (47 < keyCode && 58 > keyCode) || (64 < keyCode && 91 > keyCode) || (96 < keyCode && 123 > keyCode)) {
			if (this._filterKeyTimer) {this._filterKeyTimer.cancel();}
			this._filterKeyTimer = Y.later(2500, this, this.filter);
		}
	},

	/**
	 * Initialization method, automatically called by Base, during construction.
	 * @method initializer
	 * @public
	 */
	initializer: function() {
		var that = this,
			domFilter =  that.get('filter'),
			id, elTemp;

		if (! domFilter) {
			id = '#' + that._host.get('boundingBox').get('id') + '-';
			elTemp = Y.one(id + 'filterType');

			if (! elTemp.hasClass('displayNone')) {
				that._areTypesEnables = true;
				that.set('filterTypes', elTemp.all('input'));
			}

			that.set('filter', id + 'filter');
			that.set('filterTrigger', id + 'filter-btn');
			that.set('linkNext', id + 'next');
			that.set('linkPrevious', id + 'previous');
			that.set('limitNode', id + 'limit');
			that.set('offsetNode', id + 'offset');
			that.syncUI();
		}

		that.doBefore('destructor', that.destructor);
		that.doAfter('bindUI', that.bindUI);
	},

	/**
	 * @see Widget.syncUI
	 */
	syncUI: function() {
		this.get('limitNode').set('value', this.get('limit'));
		this.get('offsetNode').set('value', this.get('offset'));
	},

	/**
	 * Updates the content using the datasource.
	 * @method updateContent
	 * @public
	 */
	updateContent: function() {
		var that = this,
			sb, filterTypes, i, sb2;
		Y.Event.off(that._filterKeyTimer);
		
		sb = [
			'offset=' + that.get('offset')
		];
		i = 1;

		if (that._lastValue) {
			sb[i++] = 'filter=' + that._lastValue;
		}

		if (that._areTypesEnables) {
			sb2 = [];
			filterTypes = this.get('filterTypes');

			filterTypes.each(function(node) {
				if (node.get('checked')) {
					sb2.push(node.parent().next().first().get('innerHTML'))
				}
			});

			sb[i++] = 'types=' + (sb2.length ? sb2.join(',') : 'none');
		}

		that._host.get('boundingBox').one('ul').loading();
		// callback:{success: that._handleFilterSource}, failure: function() {alert('wtf');}
		that.get('filterSource').sendRequest({request: sb.join('&'), callback: {
			success: Y.bind(that._handleFilterSource, that),
			failure: function(e){
				alert(e.error.message);
			}
		}});
	},

	/**
	 * Updates the content using the datasource.
	 * @method updateContent
	 * @public
	 */
	updateLocalContent: function(fx) {
		this._host.get('boundingBox').all('li').each(function(item) {
			if (fx(item)) {
				item.show();

				if (! item.hasClass(CLS_DISABLED)) {
					item.first().set(CLS_DISABLED, '');
				}
			}
			else {
				item.hide();
				item.first().set(CLS_DISABLED, CLS_DISABLED);
			}
		});
	}
});

Y.CheckboxListFilter = CheckboxListFilter;

}, '@VERSION@', {requires:['plugin', 'checkboxList', 'datasource']});