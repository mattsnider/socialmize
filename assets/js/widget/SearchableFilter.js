YUI($YO).add('searchableFilter', function(Y) {
	_initIO(Y);

var ATTR_CHECKBOX = 'chkbox',
	ATTR_FILTER = 'filter',
	ATTR_LIST = 'list',
	ATTR_NODE_TYPES = 'nodeTypes';

    /**
     * The SearchableFilter constructor.
     * @method SearchableFilter
	 * @constructor
     * @public
     */
	function SearchableFilter() {
		SearchableFilter.superclass.constructor.apply(this, arguments);
		var idPrefix = '#' + this.get('boundingBox').get('id');
		this.set(ATTR_CHECKBOX, idPrefix + '-' + ATTR_CHECKBOX);
		this.set('container', idPrefix + '-container');
		this.set(ATTR_FILTER, idPrefix + '-' + ATTR_FILTER);
		this.set('key', Y.FormElement.getValue(Y.one(idPrefix + '-key')));
		this.set(ATTR_NODE_TYPES, idPrefix + '-types');
		this.set(ATTR_LIST, new Y.CheckboxList({boundingBox: idPrefix + '-list', maxHeight: '250px', name: 'searchables[]'}));
	}

	SearchableFilter.ATTRS = {

		chkbox: {
			setter: Y.one
		},

		container: {
			setter: Y.one
		},

		filter: {
			setter: Y.one
		},

		list: {
			validator: function(value) {
				return value instanceof Y.CheckboxList;
			}
		},

		key: {
			validator: Y.Lang.isString
		},
		
		// the type selector node
		nodeTypes: {
			setter: Y.one
		}
	};

	SearchableFilter.NAME = "SearchableFilter";

	SearchableFilter.SCHEMA = {
		metaFields: {resultn:"resultn"},
		resultListLocator: "results",
		resultFields: ['id', 'isChecked', 'label', 'value']
	};

	Y.extend(SearchableFilter, Y.Widget, {
		_evtChangeSelectHandler: null,
		_evtChangeChkboxHandler: null,

		/**
		 * Handles the change event for the types.
		 * @method _handleChangeTypes
		 * @protected
		 */
		_handleChangeCheckbox: function() {
			this.get(ATTR_LIST).checkAll(this.get(ATTR_CHECKBOX).get('checked'));
		},

		/**
		 * Handles the change event for the types.
		 * @method _handleChangeTypes
		 * @protected
		 */
		_handleChangeTypes: function() {
			var value = Y.FormElement.getValue(this.get(ATTR_NODE_TYPES)),
				list = this.get(ATTR_LIST),
				isShow;

			switch (value) {
				case 'all':
					list.clear();
					isShow = false;
					break;

				default:
					list.get('contentBox').loading();
					this._fetchSearchables(value);
					isShow = true;
			}

			list.get('boundingBox').toggleDisplay(isShow);
			this.get('container').toggleDisplay(isShow);
		},

		_handleFilter: function() {
			var value = this.get('filter').get('value').toLowerCase();
			this.get('list').toggleItems(function(content) {
				return -1 < content.toLowerCase().indexOf(value);
			});
		},

		/**
		 * The XHR request callback.
		 * @method _handleSearchableRequest
		 * @param  id {Number} Required. The transaction id.
		 * @param  o {Object} Required. The XHR object.
		 * @protected
		 */
		_handleSearchableRequest: function(id, o) {
			var json = Y.DataSchema.JSON.apply(SearchableFilter.SCHEMA, o.responseText),
				list = this.get(ATTR_LIST);
			
			list.set('json', json.results);
			this.get('container').toggleDisplay(json.results.length);
			list[list.get('rendered') ? 'syncUI' : 'render']();
		},

		/**
		 * Execute the XHR to fetch the searcahbles.
		 * @method _fetchSearchables
		 * @param  type {String} Required. The searchable type.
		 * @protected
		 */
		_fetchSearchables: function(type) {
			var ntype = type.replace('admin', ''),
				isAdmin = type != ntype;

			Y.io('/readSearchables.action?type=' + ntype + '&admin=' + isAdmin + '&key=' + this.get('key') + '&limit=-1',
				{on:{success:this._handleSearchableRequest}, context: this});
		},

		/**
		 * @see Y.Widget.bindUI
		 */
		bindUI: function() {
			var _this = this,
				_nodeFilter = this.get('filter');

			_this._evtChangeSelectHandler = _this.get(ATTR_NODE_TYPES).on('change', _this._handleChangeTypes, _this);
			_this._evtChangeChkboxHandler = _this.get(ATTR_CHECKBOX).on('change', _this._handleChangeCheckbox, _this);
			new Y.NodeInput({input: _nodeFilter, blurText: 'filter names', keydownFn: Y.bind(_this._handleFilter, _this)});
		},

		/**
		 * @see Y.Base.destructor
		 */
		destructor: function() {
			Y.Event.off(this._evtChangeSelectHandler);
			Y.Event.off(this._evtChangeChkboxHandler);
		},

		/**
		 * @see Y.Base.initializer
		 */
		initializer: function() {
		},

		/**
		 * @see Y.Widget.syncUI
		 */
		syncUI: function() {
			this._handleChangeTypes();
		}
	});

	Y.SearchableFilter = SearchableFilter;
}, '1.0.0', {requires: ['io-base', 'checkboxList', 'gallery-node-form', 'gallery-node-field']});