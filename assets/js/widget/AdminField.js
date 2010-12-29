/**
 * Copyright (c) 2008, Matt Snider, LLC. All rights reserved.
 * Version: 1
 */

YUI($YO).add('gallery-admin-field', function(Y) {
	_initIO(Y);
var	COM_DELETE_FIELD = 'com_deleteField',
	COM_ORDER_WIDGET = 'com_orderWidget',
	COM_DELETE_WIDGET = 'com_deleteWidget',
	COM_SAVE_FIELD = 'com_saveField',
	COM_SAVE_WIDGET = 'com_saveWidget',
	COM_DISCLOSURE = 'com_disclosure',

	NAME_PW_IS_GROUP= 'profileWidgetIsgroup',
	NAME_PW_IS_NETWORK= 'profileWidgetIsnetwork',
	NAME_PW_IS_USER= 'profileWidgetIsuser',
	NAME_PW_ID= 'profileWidgetId',
	NAME_PWF_ID= 'profileWidgetFieldId',
	NAME_PWF_TYPE= 'profileWidgetFieldType',
	NAME_PW_NAME= 'profileWidgetName',
	NAME_PW_ORDER= 'profileWidgetOrder',
	NAME_PW_TAB= 'profileWidgetTab',

	CLS_ACCORDION_TAB= 'accordion-tabs',
	CLS_CLEARFIX= 'clearfix',
	CLS_DISABLED = 'disabled',
	CLS_FIRST = 'first',
	CLS_LAST = 'last',
	CLS_PW_OUTER_PANE= 'panel-slide',
	CLS_PWF= 'pwf',
	CLS_PWF_DYNAMIC= 'widget-dynamic-field',
	CLS_TEMPLATE= 'template',
	CLS_UP= 'up',

	AJAX_APPENDER = '&task=field&isAjax=T',

	TEXT_DELETE_FIELD = 'Are you sure? This may cause a nuclear meltdown.',
	TEXT_DELETE_WIDGET = 'Are you sure?\n\nThis cannot be undone and all changes will be lost.',
	LOADER_URL = '/assets/images/loader_lg.gif',

	_domLoadingImage = Y.Page.getImage(LOADER_URL);

/**
 * The AdminField manages admin field widgets.
 * @class AdminField
 * @dependencies library
 */
function AdminField() {
	AdminField.superclass.constructor.apply(this,arguments);
}

Y.mix(AdminField, {
	/**
	 * @property AdminField.NAME
	 * @type String
	 * @static
	 */
	NAME : 'gallery-admin-field',

	/**
	 * @property AdminField.ATTRS
	 * @type Object
	 * @static
	 */
	ATTRS : {

		/**
		 * @attribute dt
		 * @type String|Node
		 * @description The DT element.
		 */
		dt: {
			setter: function(value) {
				return Y.one(value);
			},
			writeOnce: true
		},

		/**
		 * @attribute dd
		 * @type String|Node
		 * @description The DT element.
		 */
		dd: {
			setter: function(value) {
				return Y.one(value);
			},
			writeOnce: true
		},

		/**
		 * @attribute widgetId
		 * @type Number
		 * @description The id of the widget.
		 */
		widgetId: {
			validator: Y.Lang.isNumber
		}
	}
});

Y.extend(AdminField, Y.Base, {

	/**
	 * @property _animBlind
	 * @type Object
	 * @description The blind animation widget.
	 */
	_animBlind: null,

	/**
	 * @property _animSlide
	 * @type Boolean
	 * @description The slide animation widget.
	 */
	_animSlide: null,

	/**
	 * @property _buttonFieldDelete
	 * @type Element
	 * @description The field delete button.
	 */
	_buttonFieldDelete: null,

	/**
	 * @property _buttonFieldSave
	 * @type Element
	 * @description The field save button.
	 */
	_buttonFieldSave: null,

	/**
	 * @property _buttonWidgetDelete
	 * @type Element
	 * @description The widget delete button.
	 */
	_buttonWidgetDelete: null,

	/**
	 * @property _buttonWidgetField
	 * @type Element
	 * @description The widget field button.
	 */
	_buttonWidgetField: null,

	/**
	 * @property _buttonWidgetSave
	 * @type Element
	 * @description The widget save button.
	 */
	_buttonWidgetSave: null,

	/**
	 * @property _dynamicContent
	 * @type Element
	 * @description The dynamic content node.
	 */
	_dynamicContent: null,

	/**
	 * @property _clickHandler
	 * @type Object
	 * @description The event handler for the trigger click listener.
	 */
	_clickHandler: null,

	/**
	 * @property _fieldChangeSet
	 * @type Object
	 * @description The fields that have changed.
	 */
	_fieldChangeSet: null,

	/**
	 * @property _fieldChangeCount
	 * @type Number
	 * @description The number of fields that have changed.
	 */
	_fieldChangeCount: null,

	/**
	 * Clears the current field changeset and count.
	 * @method _clearFieldChanges
	 * @public
	 */
	_clearFieldChanges: function() {
		this._fieldChangeSet = {};
		this._fieldChangeCount = 0;
	},

	/**
	 * Handles the callback for clicking event on the widget.
	 * @method _dispatchClick
	 * @param e {Event} Required. The triggered JavaScript event, click.
	 * @private
	 */
	_dispatchClick: function(e) {
		var targ = e.target;
		if ('a' == targ.getTagName()) {
			if ('_blank' != targ.get('target')) {
				e.halt();
			}
		}
		if (targ.hasClass(CLS_DISABLED)) {return;}

		// this in an input element
		if (targ.isTagName('input', 'select', 'textarea')) {
			// checkbox and radio buttons are changed on click, not on blur
			if (Y.FormElement.isCheckable(targ) || 'select' == targ.getTagName()) {
				this._handleBlur(e);
			}
			// everything else changes on blur
			else {
				targ.on('blur', this._handleBlur, this);
			}

			return;
		}

		// dispatch by class
		if (targ.hasClass(COM_DELETE_FIELD)) {
			this._handleDeleteField(targ);
		}
		else if (targ.hasClass(COM_DELETE_WIDGET)) {
			this._handleDeleteWidget(targ);
		}
		else if (targ.hasClass(COM_ORDER_WIDGET)) {
			this._handleOrderWidget(targ);
		}
		else if (targ.hasClass(COM_SAVE_FIELD)) {
			this._handleSaveProfileWidgetField(targ)
		}
		else if (targ.hasClass(COM_SAVE_WIDGET)) {
			this._handleSaveProfileWidget(targ);
		}
		else if (targ.hasClass(COM_DISCLOSURE)) {
			this._handleDisclosure(targ);
		}
	},

	/**
	 * Handles the functionality of a blurring field.
	 * @method _handleAfterBlur
	 * @private
	 */
	_handleAfterBlur: function() {
		var paneSlider = this._animSlide,
			isField = 0 < paneSlider.get('position'),
			id = (isField ? NAME_PWF_ID : NAME_PW_ID),
			name = isField ? 'Field' : 'Widget',
			s_btn = this['_button' + name + 'Save'],
			idNpt =  s_btn.ancestor('.' + paneSlider.get('classPosition')).one('input[name=' + id + ']'),
			d_btn = this['_button' + name + 'Delete'],
			f_btn = this['_button' + name + 'Field'],
			isTemplate = ! idNpt || '0' == idNpt.get('value');

		if (idNpt) {
			var pwfIdRx = new RegExp(id + '=\\d+');
			d_btn.set('href', d_btn.get('href').replace(pwfIdRx, id + '=' + idNpt.get('value')));
		}

		if (f_btn) {f_btn.toggleVisibility(! isTemplate);}
		d_btn.toggleVisibility(! isTemplate);
		s_btn.toggleClass(CLS_DISABLED, ! this._fieldChangeCount);
		this._updateErrorDisplay(s_btn, false); // hide error message on change
	},

	/**
	 * Handles the callback for blurring out of a field.
	 * @method _handleBlur
	 * @param e {Event} Required. The triggered JavaScript event; blur.
	 * @private
	 */
	_handleBlur: function(e) {
		var targ = e.target;
		this._updateFieldChangeSet(targ);
		this._handleAfterBlur();
		targ.detach('blur');
	},

	/**
	 * Callback function for a successful create or update of a PWF.
	 * @method _handleCreateOrUpdateField
	 * @param id {String} Required. The IO id.
	 * @param o {Object} Required. The YUI response object.
	 * @private
	 */
	_handleCreateOrUpdateField: function(id, o) {
		var xml = o.responseXML,
			pwfId = xml.getElementsByTagName(NAME_PWF_ID)[0].getAttribute('value'),
			pwId = xml.getElementsByTagName(NAME_PW_ID)[0].getAttribute('value'),
			pwf = Y.one('#' + CLS_ACCORDION_TAB + '-' + pwfId + '-' + pwId),
			n_npt = Y.one('#' + NAME_PW_NAME);

		if (! pwf) {
			var tmpl = Y.one('#' + CLS_ACCORDION_TAB + '-0-' + pwId).get('parentNode');
			pwf = tmpl.get('parentNode').insertBefore(tmpl.cloneNode(true), tmpl);

			var pwfIdRx = new RegExp('(' + NAME_PWF_ID + '=)\\d+');
			pwf = pwf.first();
			pwf.set('id', pwf.get('id').replace(/\d+/, pwfId));
			pwf.set('href', pwf.get('href').replace(pwfIdRx, '$1' + pwfId));
		}

		if (n_npt) {pwf.set('innerHTML', n_npt.get('value') + '&nbsp;&raquo;');}
		this._reqUpdateField(pwf);
	},

	/**
	 * Handles the callback for clicking the field delete button.
	 * @method _handleDeleteField
	 * @param targ {Element} Required. The target element.
	 * @private
	 */
	_handleDeleteField: function(targ) {
		if (confirm(TEXT_DELETE_FIELD)) {
			var href = targ.get('href'),
				pwfId = Y.String.getQueryValue(targ.get('href'), NAME_PWF_ID),
				pwf = Y.one('#' + CLS_ACCORDION_TAB + '-' + pwfId);

			Y.io(href.replace(/\?.*/, ''), {data: href.replace(/.*?\?/, '') + AJAX_APPENDER, context: this});

			this._animSlide.slidePrev();

			if (pwf) {pwf.get('parentNode').deleteNode(null, null, true);}

			this._dynamicContent.set('innerHTML', '');
		}
	},

	/**
	 * Handles the callback for clicking the widget delete button.
	 * @method _handleDeleteWidget
	 * @param targ {Element} Required. The target element.
	 * @private
	 */
	_handleDeleteWidget: function(targ) {
		if (confirm(TEXT_DELETE_WIDGET)) {
			var _this = this,
				href = targ.get('href'),
				dd = _this.get('dd'),
				dt = _this.get('dt'),
				nextDD = dd;

			// iterate on all next siblings that are 'dd', decrements the order by 1
			while (nextDD) {
				nextDD = nextDD.next(function(node) {
					if ('dd' === node.get('tagName').toLowerCase()) {
						_this._updateOrder(node, -1);
						return true;
					}
				});
			}

			// send request to delete
			var widgetId = dd.one('input[name=' + NAME_PW_ID + ']');
			if (widgetId) {
				Y.io(href.replace(/\?.*/, ''), {data: href.replace(/.*?\?/, '') + AJAX_APPENDER, context: this});
			}

			// update the up arrow o the last 'dt' as necessary
			if (dt.hasClass(CLS_LAST)) {
				dt.previous(function(node) {
					if ('dt' === node.getTagName().toLowerCase()) {
						node.addClass(CLS_LAST);
						return true;
					}
				});
			}

			// update the down arrow of the first 'dt' as necessary
			if (dt.hasClass(CLS_FIRST)) {
				dt.next(function(node) {
					if ('dt' === node.getTagName().toLowerCase()) {
						node.addClass(CLS_FIRST);
						return true;
					}
				});
			}

			// actually delete from the DOM
			dt.deleteNode(null, null, true);
			dd.deleteNode(null, null, true);
		}
	},

	/**
	 * Handles the callback for clicking the disclosure link.
	 * @method _handleDisclosure
	 * @param targ {Element} Required. The target element.
	 * @private
	 */
	_handleDisclosure: function(targ) {
		targ.ancestor('ul').toggleClass('hideDisclosure', targ.hasClass('disclose'));
		targ.toggleClass('disclose', ! targ.hasClass('disclose'));
		targ.set('innerHTML', (targ.hasClass('disclose') ? 'Hide' : 'Show') + " advanced options");
		this._animBlind.syncUI();
	},

	/**
	 * Handles the callback for clicking the order button.
	 * @method _handleOrderWidget
	 * @param targ {Element} Required. The target element.
	 * @private
	 */
	_handleOrderWidget: function(targ) {
		var dtDown = this.get('dt'),
			ddDown = dtDown.next(),
			dtUp, ddUp;

		// up arrow was clicked
		if (targ.hasClass(CLS_UP)) {
			ddUp = ddDown;
			dtUp = dtDown;
			ddDown = dtDown.previous();

			// just double checking that a previous sibling exists
			if (ddDown) {
				dtDown = ddDown.previous();
			}
		}
		// down arrow was clicked
		else {
			dtUp = ddDown.next();

			// just double checking that a next sibling exists
			if (dtUp) {
				ddUp = dtUp.next();
			}
		}

		// swap position
		ddUp = ddUp.get('parentNode').insertBefore(ddUp, dtDown);
		dtUp = ddUp.get('parentNode').insertBefore(dtUp, ddUp);
		dtUp.toggleClass(CLS_FIRST, ! dtUp.previous());
		dtUp.toggleClass(CLS_LAST, false);
		dtDown.toggleClass(CLS_FIRST, false);
		dtDown.toggleClass(CLS_LAST, ddDown.next().hasClass(CLS_TEMPLATE));

		// update order
		var orderB = this._updateOrder(ddUp, -1),
			orderA = this._updateOrder(ddDown, 1);
		if (! (orderA || orderB)) {return;} // something went very wrong, don't continue

		// fetch ID inputs
		var idA = orderA.previous(),
			idB = orderB.previous();

		// actually update DB
		var sb = [
			AJAX_APPENDER,
			'subtask=order',
			orderA.get('name') + 'A=' + orderA.get('value'),
			idA.get('name') + 'A=' + idA.get('value'),
			orderB.get('name')+ 'B=' + orderB.get('value'),
			idB.get('name') + 'B=' + idB.get('value')
		];
		Y.io('adminSubmit.action', {method: 'post', data:sb.join('&'), context: this});
	},

	/**
	 * Callback function for a successful refresh of the field DOM.
	 * @method _handleRefreshField
	 * @param id {String} Required. The IO id.
	 * @param o {Object} Required. The YUI response object.
	 * @private
	 */
	_handleRefreshField: function(id, o) {
		var xml = o.responseXML;
		this._dynamicContent.set('innerHTML', decodeURIComponent(Y.DataType.XML.format(xml.firstChild)).replace(/\+/g, ' ').replace(/<\/?response>/g, ''));
		this._animBlind.syncUI();
		this._handleAfterBlur();
	},

	/**
	 * Handles the callback for clicking event on the profile widget save button.
	 * @method _handleSaveProfileWidget
	 * @param btn {Element} Required. The button element.
	 * @private
	 */
	_handleSaveProfileWidget: function(btn) {
		var list = btn.get('parentNode').previous(),
			form = new Y.NodeForm({elem: list}),
			slz = form.serialize();

		if (! (Y.String.getQueryValue(slz, NAME_PW_IS_GROUP) || Y.String.getQueryValue(slz, NAME_PW_IS_NETWORK) || Y.String.getQueryValue(slz, NAME_PW_IS_USER))) {
			return this._updateError(btn, 'This Profile Widget must be associated with either a group or user.');
		}
		else if (! Y.String.getQueryValue(slz, NAME_PW_NAME)) {
			return this._updateError(btn, 'This Profile Widget must have a name.');
		}
		else if (! Y.String.getQueryValue(slz, NAME_PW_TAB)) {
			return this._updateError(btn, 'This Profile Widget must have a tab name.');
		}
		else {
			this._updateErrorDisplay(btn, false);
			btn.addClass(CLS_DISABLED);
		}

		var callback = {success: '0' === Y.String.getQueryValue(slz, NAME_PW_ID) ? Y.Page.reload : this._handleCreateOrUpdateField};
		Y.io('adminSubmit.action', {data: slz + AJAX_APPENDER, method:'post', on: callback, context: this});
		this._clearFieldChanges();
	},

	/**
	 * Handles the callback for clicking event on the profile widget field save button.
	 * @method _handleSaveProfileWidgetField
	 * @param btn {Element} Required. The button element.
	 * @private
	 */
	_handleSaveProfileWidgetField: function(btn) {
		var form = new Y.NodeForm({elem: this._dynamicContent}),
			slz = form.serialize();

		if (! Y.String.getQueryValue(slz, NAME_PW_ID)) {
			return this._updateError(btn.get, 'Critical error, please go "Back", and try again.');
		}
		else if (! Y.String.getQueryValue(slz, NAME_PW_NAME)) {
			return this._updateError(btn, 'This Field must have a name.');
		}
		else if (! (Y.String.getQueryValue(slz, NAME_PWF_ID) || Y.String.getQueryValue(slz, NAME_PWF_TYPE))) {
			return this._updateError(btn, 'This Field must have a type. Please choose one from the list.');
		}
		else {
			this._updateErrorDisplay(btn, false);
			btn.toggleClass(CLS_DISABLED, true);
		}

		Y.io('adminSubmit.action', {data: slz + AJAX_APPENDER, method:'post', on: {success: this._handleCreateOrUpdateField}, context: this});
		this._clearFieldChanges();
	},

	/**
	 * Initiate an ajax call to render a field.
	 * @method _reqUpdateField
	 * @param link {Element} Required. The field link.
	 * @private
	 */
	_reqUpdateField: function(link) {
		this._dynamicContent.set('innerHTML', '');
		this._dynamicContent.appendChild(_domLoadingImage.cloneNode(true));
		Y.io(link.get('href').replace(/(\w+)\/\w+\./, '$1/adminAjaxView.') + AJAX_APPENDER.replace('field', 'renderPWF'), {on: {success:this._handleRefreshField}, context: this}); // adminAjaxView.action
	},

    /**
     * Updates the error message display.
     * @method _updateErrorDisplay
     * @param btn {Element} Required. A pointer to an HTML anchor element.
     * @param b {Boolean} Required. True to display.
     * @private
     */
    _updateErrorDisplay: function(btn, b) {
        var errorDom = btn.get('parentNode').next();
        errorDom.toggleDisplay(b);
		this._animBlind.syncUI();
    },

    /**
     * Updates the error message that is displayed.
     * @method _updateError
     * @param btn {Element} Required. A pointer to an HTML anchor element.
     * @param s {String} Required. The error message.
     * @private
     */
    _updateError: function(btn, s) {
        var errorDom = btn.get('parentNode').next().first();
        this._updateErrorDisplay(btn, true);
        errorDom.set('innerHTML', s);
    },

    /**
     * Adds or removes the npt to the changeset depending on whether the default value equals the current value.
     * @method _updateFieldChangeSet
     * @param npt {Element} Required. A pointer to an HTML input element.
     * @private
     */
    _updateFieldChangeSet: function(npt) {
		var name = npt.get('name'),
			hasField = this._fieldChangeSet[name];

		if (Y.FormElement.isChanged(npt)) {
			if (! hasField) {this._fieldChangeCount += 1;}
			this._fieldChangeSet[name] = npt;
		}
		else {
			if (hasField) {this._fieldChangeCount -= 1;}
			delete this._fieldChangeSet[name];
		}
    },

    /**
     * Updates the order input inside of the form.
     * @method _updateOrder
     * @param node {Element} Required. The 'dd' element containing the desired input.
     * @param n {Number} Required. The amount to modify the order by.
     * @return {Element} The found input node, for convenience.
     * @private
     */
    _updateOrder: function(node, n) {
        var order = node.one('input[name=' + NAME_PW_ORDER + ']');
        if (! order) {return null;} // something went very wrong, fail gracefully
        order.set('value', Y.Number.parse(order.get('value'), true) + n);
        return order;
    },

	/**
	 * This method is responsible for attaching event listeners which bind the UI to the widget state. These listeners are generally
	 * 	attribute change listeners Ñ used to update the state of the UI in response to changes in the attribute's value. It also
	 * 	attaches DOM event listeners to the nodes making up the UI to map user interactions to the Widget's API.
	 */
	bindUI: function() {
		var _this = this;
		_this._clickHandler = Y.Event.attach('click', _this._dispatchClick, [
			_this._animBlind.get('trigger').get('parentNode'),
			_this._animSlide.get('boundingBox')
		], _this);
	},

	/**
	 * See widget destructor.
	 * @method destructor
	 * @public
	 */
	destructor: function() {
		var _this = this;
		_this._animBlind.destroy();
		_this._animSlide.destroy();
		if (_this._clickHandler) {_this._clickHandler.detach();}
		_this._buttonFieldDelete = null;
		_this._buttonFieldSave = null;
		_this._buttonWidgetSave = null;
		_this._buttonWidgetDelete = null;
		_this._dynamicContent = null;
	},

	/**
	 * See widget initializer.
	 * @method initializer
	 * @public
	 */
	initializer: function() {
		var _this = this,
			dt = _this.get('dt'),
			dd = _this.get('dd'),
			node = dd.first(),
			widgetId;
		
		_this._animBlind = new Y.AnimBlind({
			boundingBox: dd,
			contentBox: node,
			trigger: dt.last()
		});

		_this._animSlide = new Y.AnimSlide({
			boundingBox: node,
			contentBox: node.first()
		});

		_this._animBlind.render();
		_this._animSlide.render();

		// find the widget ID from the hidden field in first pane
		widgetId = _this._animSlide.getSlidePositions().item(0).one('input[name=profileWidgetId]').get('value');
		_this.set('widgetId', widgetId);

		_this._clearFieldChanges();

		// dynamic content is the non-button part of the third pane
		_this._dynamicContent = Y.one('#panel-slide-field-content-' + widgetId);

		// find buttons
		_this._buttonFieldSave = Y.one('#panel-slide-field-save-' + widgetId);
		_this._buttonFieldDelete = Y.one('#panel-slide-field-delete-' + widgetId);
		_this._buttonWidgetSave = Y.one('#panel-slide-widget-save-' + widgetId);
		_this._buttonWidgetDelete = Y.one('#panel-slide-widget-delete-' + widgetId);
		_this._buttonWidgetField = Y.one('#panel-slide-widget-field-' + widgetId);

		_this._animSlide.on('triggerSlide', function(link) {
			_this._clearFieldChanges();
			link = new Y.Node(link._node); // bizarre bug fix, the link is being converted to a Y.Node/Y.Event object... bizarre
			
			if (link.hasClass(CLS_ACCORDION_TAB)) {
				_this._reqUpdateField(link);
			}
			else {
				_this._handleAfterBlur();
			}
		});

		_this._animBlind.on('toggle', function() {
			_this._animSlide.reset();
			_this._handleAfterBlur();

			// reset values of template
			if (dt.hasClass('template')) {				
				dd.all('input').each(function(npt) {
					var type = npt.get('type').toLowerCase();

					if ('hidden' != type) {
						if (Y.FormElement.isCheckable(npt)) {
							npt.set('checked', 'profileWidgetStatus' == npt.get('name') && 'active' == npt.get('value'));
						}
						else {
							npt.set('value', '');
						}
					}
				});
			}
		});

		_this.bindUI();
	},

	/**
	 * This method is responsible for creating and adding the nodes which the widget needs to the document (or modifying existing nodes,
	 * 	in the case of progressive enhancement). It is usually the point at which the DOM is first modified by the Widget.
	 */
	renderUI: function() {

	},

	/**
	 * This method is responsible for setting the initial state of the UI based on the current state of the widget at the time of rendering.
	 */
	syncUI: function() {
	}
});

Y.AdminField = AdminField;

}, "@VERSION@", {requires: ['base', 'yui3-ext', 'gallery-anim-blind', 'gallery-anim-slider', 'collection']});