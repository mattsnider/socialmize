/*
 * Copyright (c) 2010, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.01
 */

/**
 * The CheckboxList classes manages a scrollable list of checkboxes that is rendered via JavaScript.
 * @namespace Core.Widget
 * @class CheckboxList
 */
YUI().add('matt_searchableListOfCheckboxes', function(Y) {
	// constants
	var ATTR_BOUNDING_BOX = 'boundingBox',
			ATTR_CHECKBOXES = 'checkboxes',
			ITEM_TMPL = '<li><input id="{id}" name="{name}" type="checkbox" value={value} {checked}/><label for="{id}">{label}</label></li>',
			KEY_CODE_ENTER = 13,
			KEY_CODE_ESCAPE = 27,
			RX_STRIP_NON_NUMBER = /\D+/g,

		// shortcuts
			Lang = Y.Lang,

		/**
		 * The CheckboxList constructor.
		 * @method CheckboxList
		 * @param conf {Object} Optional. Configuration parameters.
		 * @constructor
		 * @extends Y.Widget
		 * @public
		 */
			CheckboxList = Y.Base.create('matt_searchableListOfCheckboxes', Y.Widget, [], {

				/**
				 * Callback function for clicking inside the widget node.
				 * @method _dispatchClick
				 * @param e {Event} Required. The triggered `click` JavaScript event.
				 * @private
				 */
				_dispatchClick: function(e) {
					var elTarg = e.target,
							that = this, sT1, sT2;


					if (elTarg.isTagName('input')) {
						// handle clicking on checkboxes
						if ('checkbox' == elTarg.get('type')) {
							// local variables required for equality to work corectly !?!?
							sT1 = that.get('name');
							sT2 = elTarg.get('name');

							if (sT1 == sT2) {
								that.fire(CheckboxList.CE_ONCHECKED, e);
							}
							else {
								that._lastSearchValue = Math.random(); // ensures searching will happen
								that.search();
							}
						}
						// handle search button
						else {
							if (that._elSearchButton.compareTo(elTarg)) {
								e.halt();
								that.search();
							}
						}
					}
					// handle clicking on prev/next
					else {
						if (elTarg.isTagName('a')) {
							// todo: handle prev/next
						}
					}
				},

				/**
				 * Bind events to the widget.
				 * @method bindUI
				 * @public
				 */
				bindUI: function() {
					var that = this;
					that._nodeClickHandle = that.get(ATTR_BOUNDING_BOX).on("click", Y.bind(that._dispatchClick, that));
					that.after(ATTR_CHECKBOXES + 'Change', Y.bind(that._renderCheckboxes, that));
					that._searchClickHandle = that._elSearchInput.on('keypress', Y.bind(that._handleKeyUp, that))
				},

				/**
				 * Update the checked state of all the inputs.
				 * @method checkAll
				 * @param bool {Boolean} Required. The checked state.
				 * @public
				 */
				checkAll: function(bool) {
					this.get(ATTR_BOUNDING_BOX).all('input[type=checkbox]').each(function(npt) {
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

				/*
				 * @see Y.Widget#destructor
				 */
				destructor: function() {
					var that = this;
					that.clear();

					if (that._nodeClickHandle) {
						that._nodeClickHandle.detach();
					}

					if (that._searchClickHandle) {
						that._searchClickHandle.detach();
					}
				},

				/**
				 * Handles the key events of the search input.
				 * @method _handleKeyUp
				 * @param  e {Event} Required. The `keyup` event.
				 * @protected
				 */
				_handleKeyUp: function(e) {
					// handle enter
					if (KEY_CODE_ENTER === e.charCode) {
						e.halt();
						this.search();
					}
					// handle escape
					else {
						if (KEY_CODE_ESCAPE === e.charCode) {
							if (e.target.get('value')) {
								e.target.set('value', '');
							}
						}
					}
				},

				/**
				 * Hides the node.
				 * @method hide
				 * @public
				 */
				hide: function() {
					var that = this;
					that._elParamsResults.hide();
					that._elSearchEmpty.show();
					that._elSearchEmpty.one('q').replace(that._elSearchInput.get('value'));
				},

				/*
				 * @see Y.Base#initializer
				 */
				initializer: function(config) {
					var that = this;

					// todo: this doesn't work if templateItem changes
					that.set('templateItem', that.get('templateItem').replace(/\{name\}/g, that.get('name')));
				},

				/**
				 * Renders the checkboxes from the internal JSON object.
				 * @method _renderCheckboxes
				 * @public
				 */
				_renderCheckboxes: function() {
					var that = this,
							aJson = that.get(ATTR_CHECKBOXES),
							aOutput = ['<ul>'],
							elCheckboxList = that._elCheckboxList,
							aIds = [];

					// initialize from data set
					if (aJson.length) {
						Y.each(aJson, function(o, i) {
							aOutput[i + 1] = that._renderItem(o.id, o.label, o.value, o.isChecked, o.isDisabled);
							aIds[i] = o.id.replace(RX_STRIP_NON_NUMBER, '');
						});

						aOutput.push('</ul>');
						elCheckboxList.replace(aOutput.join(''));

						if (that.get('maxHeight').replace(/\[\d\.]+/, '') < elCheckboxList.getStyle('height').replace(/\[\d\.]+/, '')) {
							elCheckboxList.setStyle('height', that.get('maxHeight'));
						}

						that.show();
					} else { // initialize from DOM
						that.hide();
					}

					that._elIdInput.set('value', aIds.join(','));
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
					var sHtml = this.get('templateItem').replace(/\{id\}/g, id).replace(/\{label\}/g, label).replace(/\{value\}/g, value)
							.replace('{checked}', isChecked ? 'checked="checked"' : '');

					return isDisabled ? sHtml.replace('<li>', '<li class="disabled">').replace('/>', 'disabled="disabled" />') : sHtml;
				},

				/**
				 * Renders the checklist DOM inside of the block-level node.
				 * @method renderUI
				 * @public
				 */
				renderUI: function() {
					var that = this,
							elInputs, aCheckboxJson;

					that._elCheckboxList = that.getNode('list');
					that._elIdInput = that.getNode('ids');
					that._elSearchInput = that.getNode('q');
					that._elSearchEmpty = that.getNode('empty');
					that._elSearchButton = that.getNode('filterButton');
					that._elSearchType = that.getNode('filterType');
					that._elLimitInput = that.getNode('limit');
					that._elOffsetInput = that.getNode('offset');
					that._elParamsInput = that.getNode('params');
					that._elParamsResults = that.getNode('results');
					that._lastSearchValue = '';

					elInputs = that._elCheckboxList.all('input[type=checkbox]');

					if (elInputs.size()) {
						aCheckboxJson = [];

						elInputs.each(function(npt) {
							aCheckboxJson.push({
								disabled: npt.get('disabled'),
								id: npt.get('id'),
								isChecked: npt.get('checked'),
								label: npt.next().get('innerHTML'),
								value: npt.get('value')
							});
						});

						// should prevent _renderCheckboxes function from firing
						that.set(ATTR_CHECKBOXES, aCheckboxJson);
					}
				},

				search: function(s) {
					var that = this,
							sSearchValue = s || that._elSearchInput.get('value'),
							sLimit = that._elLimitInput.get('value'),
							sOffset = that._elOffsetInput.get('value'),
							sQuery = that._elSearchInput.get('value'),
							sParams = that._elParamsInput.get('value'),
							sType = that._elSearchType ? Y.Form.serialize(that._elSearchType) : '';

					// don't perform searches on values we already have
					if (that._lastSearchValue != sSearchValue) {
						that._lastSearchValue = sSearchValue;
						that._elCheckboxList.loading();
						that.get('datasource').sendRequest({
							request: sParams + '&limit=' + sLimit + '&offset=' + sOffset + '&q=' + sQuery + '&' + sType,
							callback: {
								success: function(e) {
									that.set(ATTR_CHECKBOXES, e.response.results);
								},
								failure: function(e) {
									alert(e.error.message);
								}
							}
						});
					}
				},

				/**
				 * Serializes the root node for an AJAX request.
				 * @method serialize
				 * @return {String} The parameterized form.
				 * @public
				 */
				serialize: function() {
					return Y.Form.serialize(this.get(ATTR_BOUNDING_BOX));
				},

				/**
				 * Shows the node.
				 * @method show
				 * @public
				 */
				show: function() {
					this._elSearchEmpty.hide();
					this._elParamsResults.show();
				},

				/**
				 * Sync events to the widget.
				 * @method syncUI
				 * @public
				 */
				syncUI: function() {
					// initialize from data set when DOM not present
					if (! this._elCheckboxList.hasChildNodes()) {
						this._renderCheckboxes();
					}
				},

				/**
				 * Toggles the items in the list on and off based on the criteria.
				 * @method toggleItems
				 * @param fn {Function} Required. The callback function.
				 * @public
				 */
				toggleItems: function(fn) {
					Y.each(this.get(ATTR_CHECKBOXES), function(oJson) {
						var bIsDisplayed = fn(oJson),
								elChkbox = Y.one(oJson.id);

						elChkbox.parent().toggleDisplay(bIsDisplayed);

						// clear check-state when hidden, so it doesn't serialize; restore check-state when visible
						elChkbox.set('checked', bIsDisplayed ? oJson.checked : false);
					});
				}
			}, {

				ATTRS: {
					// the json for rendering
					checkboxes: {
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
						value: ATTR_CHECKBOXES + '[]'
					},

					// the template item
					templateItem: {
						value: ITEM_TMPL
					},

					datasource: {
						validator: function (value) {
							return value && Lang.isFunction(value.sendRequest);
						},
						writeOnce: true
					}
				},

				CE_BEFORE_ONCHECKED: 'before_onchecked',
				CE_ONCHECKED: 'onchecked',

				SCHEMA: {
					metaFields: {resultn:"resultn"},
					resultListLocator: "results",
					resultFields: ['id', 'isChecked', 'isDisabled', 'label', 'value']
				}

			});

	Y.CheckboxList = CheckboxList;
}, '1.0.0', {requires:['widget', 'datasource', 'json', 'yui3-ext', 'matt_form'], use: []});