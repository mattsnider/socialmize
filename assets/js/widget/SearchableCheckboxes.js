/*
 * Copyright (c) 2011, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.01
 */

/**
 * The SearchableCheckboxes classes manages a scrollable list of checkboxes that is rendered via JavaScript.
 * @namespace Core.Widget
 * @class SearchableCheckboxes
 */
YUI.add('searchable_checkboxes', function(Y) {
	// constants
	function _detach(o) {
		if (o) {
			o.detach();
		}
	}

  var ATTRS = {},
  ATTR_BOUNDING_BOX = 'boundingBox',
  ATTR_BUTTONS = 'buttons',
  ATTR_CHKBOXS = 'checkboxes',
  ATTR_CHECKED_BOXES = 'checkedboxes',
  ATTR_HAS_BUTTON = 'hasButton',
  ATTR_HAS_FILTER = 'hasFilter',
  ATTR_HAS_SEARCH = 'hasSearch',
  ATTR_JSON = 'jsonData',
  ATTR_KEY = 'key',
  ATTR_LIMIT = 'limit',
  ATTR_MAX_HEIGHT = 'maxHeight',
  ATTR_NAME_CHKBOX = 'nameCheckbox',
  ATTR_NAME_FILTER = 'nameFilter',
  ATTR_NAME_IDS = 'nameShownIds',
  ATTR_NAME_QUERY = 'nameQuery',
  ATTR_OFFSET = 'offset',
  ATTR_PARAMS = 'params',
  ATTR_QUERY = 'query',
  ATTR_TASK = 'task',
  ATTR_TYPES = 'types',
  ATTR_TYPE_TO_CHECK = 'typeToCheck',
  ATTR_TYPE_TO_SEARCH = 'typeToSearch',

  CLS_ROOT = 'slist',
  CLS_PREVIOUS = 'previous',
  CLS_SEARCH = CLS_ROOT + 'Search',
  CLS_FILTER = CLS_ROOT + 'Filter',
  CLS_CONTENT = CLS_ROOT + 'Content',
  CLS_PAGINATION = CLS_ROOT + 'Pagination',
  CLS_BUTTON = CLS_ROOT + 'Button',

  DS_CACHE_SIZE = 10, // datasource cache size

  HTML_SEARCH =
  '<table id="{ID}_{CLS}" class="{CLS}"><tbody><tr>\
    <td colspan="2"><label for="{ID}_{NAME}">name or email:</label></td>\
  </tr><tr>\
    <td class="col1"><input type="text" value="{QUERY}" name="{NAME}" id="{ID}_{NAME}" class="txt" autocomplete="off"/></td>\
    <td class="col2"><input type="button" value="Search" id="{ID}_{NAME}Button" class="btn btn-round"/></td>\
  </tr></tbody></table>',
  HTML_FILTER = '<dl id="{ID}_{CLS}" class="{CLS} hidden clearfix">{FILTERS}</dl>',
  HTML_FILTER_ENTRY = '<dd><input id="{ID}chk{TYPE}" name="{NAME}" type="checkbox" value="{TYPE}"/></dd><dt><label for="{ID}chk{TYPE}">{TYPE}</label></dt>',
  HTML_CONTENT = '{HIDDEN}<div id="{ID}_{CLS}" class="{CLS}"></div>',
  HTML_PAGINATION = '<div id="{ID}_{CLS}" class="{CLS} hidden"><a class="previous" href="#!previous" id="${ID}previous">Previous</a><a class="next" href="#!next" id="${ID}next">Next</a></div>',
  HTML_BUTTON = '<div id="{ID}_{CLS}" class="buttons {CLS}">{BUTTONS}</div>',
  HTML_BUTTON_ENTRY = '<input name="{NAME}" type="submit" class="btn btn-round action" id="{ID}_{CLS}{ID_POST}" value="{VALUE}"/>',
  HTML_BUTTON_DFTL = Y.substitute(HTML_BUTTON_ENTRY, {NAME: '', ID_POST: 'Submit', VALUE: 'Submit'}),
  HTML_CONTENT_EMPTY = '<div class="empty" id="{ID}empty">There are no results matching <q>{QUERY}</q>. Please try another search.</div>',
  HTML_HIDDEN = '<input id="{ID}_{NAME}" type="hidden" value="{VALUE}" name="{NAME}"/>',
  HTML_CONTENT_VALUES = '<div class="slistChkall"><input name="checkall" type="checkbox" /></div><ul>{CONTENT}</ul>',
  ITEM_TMPL = '<li><input id="{ID}" name="{NAME}" type="checkbox" value="{VALUE}" {CHECKED}/><label for="{ID}">{LABEL}</label></li>',
  KEY_CODE_ENTER = 13,
  KEY_CODE_ESCAPE = 27,

  POUND = '#',

  RX_STRIP_NON_NUMBER = /\D+/g,

    // shortcuts
  Lang = Y.Lang,
  Socialmize = YUI.namespace('Env.Socialmize'),

    // local variables
  oDs = new Y.DataSource.IO({
    source: '/readSearchables.action?'
  }),

  sFilters = '';

	ATTRS[ATTR_BUTTONS] = {
		validator: Y.Lang.isArray,
		value: null
	};

	ATTRS[ATTR_CHKBOXS] = {
		setter: function(val) {
			if (this._elInputIds) {
				this._elInputIds.set('value', val.join(','));
			}

      return val;
		},
		validator: Y.Lang.isArray,
		value: []
	};

	ATTRS[ATTR_CHECKED_BOXES] = {
		setter: function(val) {
			if (this._elInputChecked) {
				this._elInputChecked.set('value', val.join(','));
			}

      return val;
		},
		validator: Y.Lang.isArray,
		value: []
	};

	ATTRS[ATTR_JSON] = {
		validator: Y.Lang.isArray,
		value: []
	};

	ATTRS[ATTR_LIMIT] = {
		validator: Y.Lang.isPositiveNumber,
		value: 10
	};

	ATTRS[ATTR_OFFSET] = {
		validator: Y.Lang.isPositiveNumber,
		value: 0
	};

	ATTRS[ATTR_HAS_FILTER] = {
    setter: function(val) {
      if (this._elFilter) {
        this._elFilter.toggleClass('hidden', ! val);
      }

      return val;
    },
		validator: Y.Lang.isBoolean,
		value: true
	};

	ATTRS[ATTR_HAS_BUTTON] = ATTRS[ATTR_HAS_FILTER];
	ATTRS[ATTR_HAS_SEARCH] = ATTRS[ATTR_HAS_FILTER];

	// the maximum height to make the list
	ATTRS[ATTR_KEY] = {
		value: Y.String.getQueryValue(window.location.search, 'key') || Socialmize.user.key
	};

	// the maximum height to make the list
	ATTRS[ATTR_MAX_HEIGHT] = {
		value: '100px'
	};

	ATTRS[ATTR_NAME_CHKBOX] = {
		validator: Y.Lang.isString,
		value: 'checkboxes'
	};

	ATTRS[ATTR_NAME_FILTER] = {
		validator: Y.Lang.isString,
		value: ATTR_TYPES
	};

	ATTRS[ATTR_NAME_IDS] = {
		validator: Y.Lang.isString,
		value: 'ids'
	};

	ATTRS[ATTR_NAME_QUERY] = {
		validator: Y.Lang.isString,
		value: 'q'
	};

	ATTRS[ATTR_PARAMS] = {
		validator: Y.Lang.isString,
		value: ''
	};

	ATTRS[ATTR_QUERY] = ATTRS[ATTR_PARAMS];

	ATTRS[ATTR_TASK] = ATTRS[ATTR_PARAMS];

	ATTRS[ATTR_TYPES] = {
		validator: function(o) {
			if (Lang.isArray(o) && o.length) {
				for (var i=0, j=o.length; i<j; i+=1) {
					if (-1 == Y.Array.indexOf(Socialmize.TYPES, o[i])) {
						return false
					}
				}

				return true;
			}

			return false;
		},
    setter: function(val) {
      var that = this;

      if (that._elFilter) {
        that._elFilter.all('input').each(function(el) {
          var is_available = -1 < Y.Array.indexOf(val, el.get('value'));
          el.set('checked', is_available);
          el.parent().toggleDisplay(is_available);
          el.parent().next().toggleDisplay(is_available);
        });

        if (that.get('rendered')) {
          that.syncUI();
        }
      }

      return val;
    },
		value: Socialmize.TYPES
	};

	ATTRS[ATTR_TYPE_TO_CHECK] = {
		validator: function(s) {
			return -1 != Y.Array.indexOf(Socialmize.CHECKED_TYPES, s);
		},
		value: (Socialmize.CHECKED_TYPES || [])[0]
	};

	ATTRS[ATTR_TYPE_TO_SEARCH] = {
		validator: function(s) {
			return -1 != Y.Array.indexOf(Socialmize.SEARCH_TYPES, s);
		},
    value: (Socialmize.SEARCH_TYPES || [])[0]
	};

	/**
	 * The SearchableCheckboxes constructor.
	 * @method SearchableCheckboxes
	 * @param conf {Object} Optional. Configuration parameters.
	 * @constructor
	 * @extends Y.Widget
	 * @public
	 */
	var SearchableCheckboxes = Y.Base.create('searchable_checkboxes', Y.Widget, [], {

		/**
		 * Callback function for clicking inside the widget node.
		 * @method _dispatchClick
		 * @param e {Event} Required. The triggered `click` JavaScript event.
		 * @private
		 */
		_dispatchClick: function(e) {
			var elTarg = e.target,
			that = this,
			o, sId;

			if (elTarg.isTagName('input')) {
				// handle clicking on checkboxes
				if ('checkbox' == elTarg.get('type')) {
					switch (elTarg.get('name')) {
						case '_' + that.get(ATTR_NAME_CHKBOX): // checkbox clicked
							that.fire(SearchableCheckboxes.CE_CHECKED, e);
							o = that.get(ATTR_CHECKED_BOXES);
							sId = elTarg.get('value');

							if (elTarg.get('checked')) {
								o.push(sId);
							}
							else {
								o = Y.Array.removeValue(o, sId);
							}

							that.set(ATTR_CHECKED_BOXES, o);
						break;

						case that.get(ATTR_NAME_FILTER): // filter clicked
							that.syncUI();
						break;

						default: // checkall
							that.checkAll(elTarg.get('checked'));
					}
				}
				// handle search button
				else {
					if (that._elSearchButton.compareTo(elTarg)) {
						e.halt();
						that._search();
					}
				}
			}
			// handle pagination
			else if (elTarg.isTagName('a')) {
				if (elTarg.hasClass(CLS_PREVIOUS)) {
					that.set(ATTR_OFFSET, that.get(ATTR_OFFSET) - that.get(ATTR_LIMIT));
				}
				else {
					that.set(ATTR_OFFSET, that.get(ATTR_OFFSET) + that.get(ATTR_LIMIT));
				}

				that.syncUI();
			}
		},

		/**
		 * Bind events to the widget.
		 * @method bindUI
		 * @public
		 */
		bindUI: function() {
			var that = this,
			elBb = that.get(ATTR_BOUNDING_BOX);

			if (that._elForm) {
				that._elForm.on('submit', Y.bind(that._handleSubmit, that));
			}

			that._nodeClickHandle = elBb.on("click", Y.bind(that._dispatchClick, that));

			if (that._elSearchInput) {
				that._searchClickHandle = that._elSearchInput.on('keypress', Y.bind(that._handleKeyUp, that))
			}
		},

		/**
		 * Update the checked state of all the inputs.
		 * @method checkAll
		 * @param bool {Boolean} Required. The checked state.
		 * @public
		 */
		checkAll: function(bool) {
			this._elContent.all('input[type=checkbox]').each(function(el) {
				el.set('checked', bool || el.get('disabled'));
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
			_detach(that._nodeClickHandle);
			_detach(that._searchClickHandle);
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
				this._search();
			}
			// handle escape
			else {
				if (KEY_CODE_ESCAPE === e.charCode) {
					e.target.set('value', '');
				}
			}
		},

		/**
		 * The filtering AJAX request failure callback.
		 * @method _handleFailure
		 * @param  o {Object} A formatted JSON object.
		 * @protected
		 */
		_handleFailure: function(o) {
			Y.log("Could not retrieve data: " + o.error.message);
		},

		/**
		 * Handles the form submit event.
		 * @method _handleSubmit
		 * @param  e {Event} Required. The `submit` event.
		 * @protected
		 */
    _handleSubmit: function(e) {
      if (false === this.fire(SearchableCheckboxes.CE_SUBMIT, e)) {
        e.halt();
      }
    },

		/**
		 * The filtering AJAX request success callback.
		 * @method _handleSuccess
		 * @param  o {Object} A formatted JSON object.
		 * @protected
		 */
		_handleSuccess: function(o) {
			if (o.response.error) {
				Y.log(o.response.error);
			}
			else {
				this.set(ATTR_JSON, o.response.results);
				this._renderCheckboxes();
				this._updatePagination(o.response.resultn)
			}
		},

		/*
		 * @see Y.Base#initializer
		 */
		initializer: function(config) {
			var that = this;
			
			that.sfx(SearchableCheckboxes, 'initializer', arguments);

			/**
			 * The currently checked values.
			 * @property _checkedValues
			 */
			that._checkedValues = [];
		},

		/**
		 * Renders the checkboxes from the internal JSON object.
		 * @method _renderCheckboxes
		 * @public
		 */
		_renderCheckboxes: function() {
			var that = this,
			aJson = that.get(ATTR_JSON),
			aCheckedBoxes = [],
			aCurrentIds = [],
			aOutput = [],
			sContent;

			// initialize from data set
			if (aJson.length) {
				Y.each(aJson, function(o, i) {
					aOutput[i] = that._renderItem(o.id, o.label, o.value, o.isChecked, o.isDisabled);

					if (! o.isDisabled) {
						aCurrentIds[i] = o.id.replace(RX_STRIP_NON_NUMBER, '');

						if (o.isChecked) {
							aCheckedBoxes.push(aCurrentIds[i]);
						}
					}
				});

				sContent = Y.substitute(HTML_CONTENT_VALUES, {CONTENT: aOutput.join('')});
			}
			else { // initialize from DOM
				sContent = Y.substitute(HTML_CONTENT_EMPTY, {QUERY: that.get(ATTR_QUERY)});
			}

			that._elContent.setContent(sContent);
			that.set(ATTR_CHKBOXS, aCurrentIds);
			that.set(ATTR_CHECKED_BOXES, aCheckedBoxes);

			if (that.get(ATTR_MAX_HEIGHT).replace(/[^\d\.]+/, '') < that._elContent.getStyle('region').height) {
				that._elContent.setStyle('height', that.get(ATTR_MAX_HEIGHT));
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
			var sHtml = Y.substitute(ITEM_TMPL, {
				CHECKED: isChecked ? 'checked="checked"' : '',
				ID: id,
				LABEL: label,
				NAME: '_' + this.get(ATTR_NAME_CHKBOX),
				VALUE: value
			});

			return isDisabled ? sHtml.replace('<li>', '<li class="disabled">').replace('/>', 'disabled="disabled" />') : sHtml;
		},

		/**
		 * Renders the checklist DOM inside of the block-level node.
		 * @method renderUI
		 * @public
		 */
		renderUI: function() {
			var that = this,

			elBb = that.get(ATTR_BOUNDING_BOX),
      elFilterChkboxs,

			nLimit = that.get(ATTR_LIMIT),
			nOffset = that.get(ATTR_OFFSET),

			sId = elBb.get('id'),
			sQuery = that.get(ATTR_QUERY),
			sNameChkbox = that.get(ATTR_NAME_CHKBOX),
			sNameIds = that.get(ATTR_NAME_IDS),
			sNameQuery = that.get(ATTR_NAME_QUERY),
			sFilters = '',
			sHtml = '',
      sValue = '',

			aButtons = that.get(ATTR_BUTTONS),

      // hidden inputs used for submitting
			aHiddenInputs = [
				Y.substitute(HTML_HIDDEN, {NAME: ATTR_KEY, ID: sId, VALUE: that.get(ATTR_KEY)}),
				Y.substitute(HTML_HIDDEN, {NAME: sNameChkbox, ID: sId}),
				Y.substitute(HTML_HIDDEN, {NAME: sNameIds, ID: sId})
			];

			if (that.get(ATTR_HAS_SEARCH)) {
				sHtml += Y.substitute(HTML_SEARCH, {QUERY: sQuery, CLS: CLS_SEARCH, NAME: sNameQuery});
			}

      Y.each(Socialmize.TYPES, function(sType) {
        sFilters += Y.substitute(HTML_FILTER_ENTRY, {TYPE: sType});
      });

      sFilters = Y.substitute(sFilters, {CLS: CLS_FILTER, NAME: that.get(ATTR_NAME_FILTER)});
      sHtml += Y.substitute(HTML_FILTER, {FILTERS: sFilters, CLS: CLS_FILTER});
      sHtml += Y.substitute(HTML_CONTENT, {CLS: CLS_CONTENT, HIDDEN: aHiddenInputs.join('')});
      sHtml += Y.substitute(HTML_PAGINATION, {CLS: CLS_PAGINATION});

      // show buttons in the form
      if (that.get(ATTR_HAS_BUTTON)) {
        // override the default button
        if (aButtons) {
          Y.each(aButtons, function(o) {
            sValue += Y.substitute(HTML_BUTTON_ENTRY, o);
          });
        }
        // show the default button
        else {
			    sValue += HTML_BUTTON_DFTL;
        }

        sHtml += Y.substitute(HTML_BUTTON, {BUTTONS: sValue, CLS: CLS_BUTTON});
      }

			elBb.set('innerHTML', Y.substitute(sHtml, {
				'ID': sId
			}));

			that._elContent = Y.one(POUND + sId + '_' + CLS_CONTENT);
			that._elFilter = Y.one(POUND + sId + '_' + CLS_FILTER);
			that._elForm = elBb.ancestor('form');
			that._elInputChecked = Y.one(POUND + sId + '_' + sNameChkbox);
			that._elInputIds = Y.one(POUND + sId + '_' + sNameIds);
			that._elInputKey = Y.one(POUND + sId + '_' + ATTR_KEY);
			that._elSearchInput = Y.one(POUND + sId + '_' + sNameQuery);
			that._elSearchButton = Y.one(POUND + sId + '_' + sNameQuery + 'Button');
			that._elSubmitButton = Y.one(POUND + sId + '_' + CLS_BUTTON + 'Submit');
			that._elPagination = Y.one(POUND + sId + '_' + CLS_PAGINATION);

      if (that.get(ATTR_HAS_FILTER)) {
        that._elFilter.removeClass('hidden');
      }

      that.set(ATTR_TYPES, that.get(ATTR_TYPES));
		},

		/**
		 * Evaluates if the search has changed, before syncing the UI.
		 * @method _search
		 * @protected
		 */
		_search: function() {
			var that = this,
			sNewSearch = that._elSearchInput.get('value');

			if (sNewSearch != that.get(ATTR_QUERY)) {
				that.set(ATTR_QUERY, sNewSearch);
				that.syncUI();
			}
		},

		/**
		 * Serializes the root node for an AJAX request.
		 * @method serialize
		 * @return {String} The parameterized form.
		 * @public
		 */
		serialize: function() {
			var that = this,
			aQuery = [
				ATTR_KEY + '=' + that.get(ATTR_KEY),
				ATTR_LIMIT + '=' + that.get(ATTR_LIMIT),
				ATTR_OFFSET + '=' + that.get(ATTR_OFFSET),
				that.get(ATTR_NAME_QUERY) + '=' + that.get(ATTR_QUERY),
				ATTR_TYPE_TO_CHECK + '=' + that.get(ATTR_TYPE_TO_CHECK),
				ATTR_TYPE_TO_SEARCH + '=' + that.get(ATTR_TYPE_TO_SEARCH)
			],
			aTypes = [];

			if (that._elFilter) {
				that._elFilter.all('input').each(function(el) {
					if (el.get('checked')) {
						aTypes.push(el.get('value'))
					}
				});
				aQuery.push(that.get(ATTR_NAME_FILTER) + '=' + aTypes.join(','))
			}

			return aQuery.join('&');
		},

		/**
		 * Sync events to the widget.
		 * @method syncUI
		 * @public
		 */
		syncUI: function() {
			var that = this,
			aQuery = that.serialize();

			that.get(ATTR_BOUNDING_BOX).addClass(CLS_ROOT);

			oDs.sendRequest({
				request: aQuery,
				callback: {
					success: Y.bind(that._handleSuccess, that),
					failure: Y.bind(that._handleFailure, that)
				}
			});
		},

		/**
		 * Updates the pagination based on the current state and the total number of available checkboxes.
		 * @method _updatePagination
		 * @param nCheckboxes {Number} Required. The total number of checkboxes, if all were shown.
		 * @protected
		 */
		_updatePagination: function(nCheckboxes) {
			var that = this,
			nOffset = that.get(ATTR_OFFSET),
			nLimit = that.get(ATTR_LIMIT),
			bOverLimit = nCheckboxes > nOffset + nLimit;

			if (nOffset || bOverLimit) {
				that._elPagination.first().toggle(nOffset);
				that._elPagination.last().toggle(bOverLimit);
				that._elPagination.show();
			}
			else {
				that._elPagination.hide();
			}
		}
	}, {

		ATTRS: ATTRS,

		CE_CHECKED: 'onchecked',
		CE_SUBMIT: 'onsubmit',

		SCHEMA: {
			metaFields: {resultn:'resultn'},
			resultListLocator: 'results',
			resultFields: ['id', 'isChecked', 'isDisabled', 'label', 'value']
		}

	});

	oDs.plug({fn: Y.Plugin.DataSourceJSONSchema, cfg: {
		schema: SearchableCheckboxes.SCHEMA
	}});

	oDs.plug(Y.Plugin.DataSourceCache, {max: DS_CACHE_SIZE});

	Y.SearchableCheckboxes = SearchableCheckboxes;
}, '1.0.0', {requires:['widget', 'datasource-io', 'datasource-jsonschema', 'datasource-cache', 'json', 'substitute', 'yui3-ext'], use: []});