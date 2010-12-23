/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.01
 */

/**
 * The CheckboxList classes manages a scrollable list of checkboxes that is rendered via JavaScript.
 * @namespace Core.Widget
 * @class CheckboxList
 */
YUI().add('checkboxList', function(Y) {
	// constants
var Lang = Y.Lang,
	ATTR_BOUNDING_BOX = 'boundingBox',
	ITEM_TMPL = '<li><input id="{id}" name="{name}" type="checkbox" value={value} {checked}/><label for="{id}">{label}</label></li>',

    /**
     * The CheckboxList constructor.
     * @method CheckboxList
	 * @param conf {Object} Optional. Configuration parameters.
	 * @constructor
     * @public
     */
	CheckboxList = function(conf) {
		CheckboxList.superclass.constructor.apply(this, arguments);
	};

	CheckboxList.ATTRS = {
		// the json for rendering
		json: {
			lazyAdd: false,
			setter: function(v) {
				if (! Lang.isArray(v)) {
					Y.fail('CheckboxList: Invalid json provided: ' + typeof v);
				}
				return v;
			},
			value: []
		},

		// the maximum height to make the list
		maxHeight: {
			value: '100px'
		},

		// name to apply to each checkbox
		name: {
			value: 'checkboxListValue[]'
		},

		// the template item
		templateItem: {
			value: ''
		}
	};

	CheckboxList.NAME = "checkboxList";

	CheckboxList.CE_BEFORE_ONCHECKED = 'before_onchecked';
	CheckboxList.CE_ONCHECKED = 'onchecked';


	Y.extend(CheckboxList, Y.Widget, {

		/**
		 * Callback function for clicking inside the wdiget node.
		 * @method _dispatchClick
		 * @param e {Event} Required. The triggered `click` JavaScript event.
		 * @private
		 */
		_dispatchClick: function(e) {
			var targ = e.target;

			if ('input' == targ.get('tagName').toLowerCase()) {
				/*
				not working the same in YUI 3 as in YUI 2
				if (this.fire(CheckboxList.CE_BEFORE_ONCHECKED, e)) {
					e.halt();
					return;
				}
				*/
				this.fire(CheckboxList.CE_ONCHECKED, e);
			}
		},

		/**
		 * Renders a list item from the template.
		 * @method _renderItem
		 * @param id {String} Required. The checkbox ID.
		 * @param label {String} Required. The checkbox label.
		 * @param value {String} Required. The checkbox value.
		 * @param isChecked {Boolean} Optional. Check the checkbox.
		 * @param isDisabled {Boolean} Optional. Disable the checkbox.
		 * @return {String} The HTML for list item to render.
		 * @protected
		 */
		_renderItem: function(id, label, value, isChecked, isDisabled) {
			var html = this.get('templateItem').replace(/\{id\}/g, id).replace(/\{label\}/g, label).replace(/\{value\}/g, value)
							 .replace('{checked}', isChecked ? 'checked="checked"' : '');

			return isDisabled ? html.replace(/\<li\>/, '<li class="disabled">').replace(/\/\>/, 'disabled="disabled" />') : html;
		},

		/**
		 * Bind events to the widget.
		 * @method bindUI
		 * @public
		 */
		bindUI: function() {
			var _this = this;
			_this._nodeClickHandle = _this.get(ATTR_BOUNDING_BOX).on("click", Y.bind(_this._dispatchClick, _this));
		},

		/**
		 * Update the checked state of all the inputs.
		 * @method checkAll
		 * @param bool {Boolean} Required. The checked state.
		 * @public
		 */
		checkAll: function(bool) {
			Y.each(this.get(ATTR_BOUNDING_BOX).all('input[type=checkbox]'), function(npt) {
				npt.set('checked', bool);
			});
		},

		/**
		 * Hides the node and removes its content.
		 * @method clear
		 * @public
		 */
		clear: function() {
			this.hide();
			this.get(ATTR_BOUNDING_BOX).set('innerHTML', '');
		},

		/**
		 * Destroys the widget.
		 * @method destructor
		 * @public
		 */
		destructor: function() {
			this.clear();

			if (this._nodeClickHandle) {
				this._nodeClickHandle.detach();
			}
		},

		/**
		 * Hides the node.
		 * @method hide
		 * @public
		 */
		hide: function() {
			this.get(ATTR_BOUNDING_BOX).toggleDisplay(false);
		},

		/**
		 * Initialize the widget.
		 * @method initializer
		 * @param config {Object} Required. The initialization configuration.
		 * @public
		 */
		initializer: function(config) {
			this.set('templateItem', ITEM_TMPL.replace(/\{name\}/g, this.get('name')));
		},

		/**
		 * Renders the checklist DOM inside of the block-level node.
		 * @method renderUI
		 * @public
		 */
		renderUI: function() {
		},

		/**
		 * Serializes the root node for an AJAX request.
		 * @method serialize
		 * @return {String} The parameterized form.
		 * @public
		 */
		serialize: function() {
			var sb = [],
				npts = this.get(ATTR_BOUNDING_BOX).all('input');

			npts.each(function(npt, i) {
				if (npt.get('checked')) {
					sb.push(npt.get('name') + '=' + npt.get('value'));
				}
			});

			return sb.join('&');
		},

		/**
		 * Shows the node.
		 * @method show
		 * @public
		 */
		show: function() {
			this.get(ATTR_BOUNDING_BOX).toggleDisplay(true);
		},

		/**
		 * Sync events to the widget.
		 * @method syncUI
		 * @public
		 */
		syncUI: function() {
			var _this = this,
				json = _this.get('json'),
				i = 0, o,
				j = json.length,
				sb = ['<ul>'],
				node = _this.get(ATTR_BOUNDING_BOX),
				inputs;

			// initialize from data set
			if (json.length) {

				for (; i < j; i += 1) {
					o = json[i];
					sb[i + 1] = _this._renderItem(o.id, o.label, o.value, o.isChecked, o.isDisabled);
				}

				sb[i + 1] = '</ul>';
				node.set('innerHTML', sb.join(''));

				if (_this.get('maxHeight').replace(/\[\d\.]+/, '') < node.getStyle('height').replace(/\[\d\.]+/, '')) {
					node.setStyle('height', _this.get('maxHeight'));
				}
				
				_this.show();
			} else { // initialize from DOM
				inputs = node.all('input[type=checkbox]');

				if (inputs.size()) {
					json = [];

					inputs.each(function(npt) {
						json.push({
							disabled: npt.get('disabled'),
							id: npt.get('id'),
							isChecked: npt.get('checked'),
							label: npt.next().get('innerHTML'),
							value: npt.get('value')
						});
					});

					_this.set('json', json);
					_this.show();
				} else {
					_this.hide();
				}
			}
		},

		/**
		 * Toggles the items in the list on and off based on the criteria.
		 * @method toggleItems
		 * @param fn {Function} Required. The callback function.
		 * @public
		 */
		toggleItems: function(fn) {
			Y.each(this.get(ATTR_BOUNDING_BOX).all('label'), function(lbl) {
				var isDisplayed = fn(lbl.get('innerHTML'));
				lbl.get('parentNode').toggleDisplay(isDisplayed);
				if (! isDisplayed) {lbl.previous().set('checked', false);}
			});
		}
	});

Y.CheckboxList = CheckboxList;
}, '1.0.0' ,{requires:['widget'], use: []});