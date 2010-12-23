/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.00
 */

YUI().add('gallery-node-input', function(Y) {

/**
 * Creates a Node object augmented with extra input functionality.
 *
 * @module NodeInput
 */

var Lang = Y.Lang,
	ATTR_BLUR_TEXT = 'blurText',
	ATTR_KEYDOWN_FN = 'keydownFn';

/**
 * Creates an instance of NodeInput to manage tab interactions and their content.
 *
 * @class NodeInput
 * @extends Base
 * @constructor
 */
function NodeInput() {
	NodeInput.superclass.constructor.apply(this,arguments);
}

Y.mix(NodeInput, {
	/**
	 * @property NodeInput.NAME
	 * @type String
	 * @static
	 */
	NAME : 'node-input',

	/**
	 * @property NodeInput.ATTRS
	 * @type Object
	 * @static
	 */
	ATTRS : {

		/**
		 * @attribute input
		 * @type Element
		 * @default null
		 * @description The text .
		 */
		input: {
			value : null,
			setter: Y.one
		},

		/**
		 * @attribute blurClass
		 * @type String
		 * @default ''
		 * @description The class to apply when empty.
		 */
		blurClass: {
			value : 'empty',
			validator : Lang.isString
		},

		/**
		 * @attribute blurText
		 * @type String
		 * @default ''
		 * @description The text to apply when empty.
		 */
		blurText: {
			validator : Lang.isString
		},

		/**
		 * @attribute keydownFn
		 * @type Function
		 * @default undefined
		 * @description The function to execute on keydown.
		 */
		keydownFn: {
			validator : Lang.isFunction
		},

		/**
		 * @attribute timeoutOnKeydown
		 * @type Number
		 * @default 2000 // two seconds
		 * @description The timeout before submitting on a keydown event.
		 */
		timeoutOnKeydown: {
			value : 500,
			validator: Lang.isNumber
		}
	}
});

Y.extend(NodeInput, Y.Base, {

	/**
	 * @property _blurHandle
	 * @type Object
	 * @description A blur event handler.
	 */
	_blurHandle: null,

	/**
	 * @property _focusHandle
	 * @type Object
	 * @description A focus event handler.
	 */
	_focusHandle: null,

	/**
	 * @property _keydownHandle
	 * @type Object
	 * @description A keydown handling event.
	 */
	_keydownHandle: null,

	/**
	 * @property _keydownTimer
	 * @type Number
	 * @description A timer triggered when a keydown occurs.
	 */
	_keydownTimer: null,

	/**
	 * The callback function to execute the keydown function.
	 * @method _handleEnter
	 * @protected
	 */
	_handleEnter: function() {
		Y.stopTimer(this._keydownTimer);
		this.get(ATTR_KEYDOWN_FN).call(this);
	},

	/**
	 * Callback function for keydown events.
	 * @method _handleKeyDown
	 * @param e {Event} Required. The triggered `keydown` event.
	 * @protected
	 */
	_handleKeyDown: function(e) {
		var _this = this;

		if (13 == e.charCode) {
			e.halt();
			_this._handleEnter();
		}
		else {
			_this._keydownTimer = Y.later(_this.get('timeoutOnKeydown'), _this, _this._handleEnter);
		}
	},

	/**
	 * Handles binding the blur and focus events.
	 * @method _addBlurText
	 * @protected
	 */
	_addBlurText: function() {
		var _this = this,
			npt = _this.get('input'),
			_handleBlur;

		// events have not yet been attached
		if (! _this._blurHandle) {
			_handleBlur = function() {
				var val = Y.Lang.trim(npt.get('value')),
					blurText = _this.get(ATTR_BLUR_TEXT);

				if (! (val || val == blurText)) {
					npt.set('value', blurText);
					npt.addClass(_this.get('blurClass'));
				}
			};

			_this._focusHandle = npt.on('focus', function() {
				var val = Y.Lang.trim(npt.get('value')),
					blurText = _this.get(ATTR_BLUR_TEXT);
				
				if (val == blurText) {
					npt.removeClass(_this.get('blurClass'));
					npt.set('value', '');
				}
			});

			_this._blurHandle = npt.on('blur', _handleBlur);
			_handleBlur();
		}
	},

	/**
	 * Handles binding the keydown event.
	 * @method _addEnterListener
	 * @protected
	 */
	_addEnterListener: function() {
		var _this = this,
			npt = _this.get('input');

		if (! _this._keydownHandle) {
			_this._keydownHandle = npt.on('keydown', _this._handleKeyDown, _this, true);
		}
	},

	/**
	 * See widget destructor.
	 * @method destructor
	 * @public
	 */
	destructor: function () {
		var _this = this;
		Y.Event.off(_this._blurHandle);
		Y.Event.off(_this._focusHandle);
		Y.Event.off(_this._keydownHandle);
	},

	/**
	 * See widget initializer.
	 * @method initializer
	 * @public
	 */
	initializer: function () {
		var _this = this;

		if (_this.get(ATTR_BLUR_TEXT)) {
			_this._addBlurText();
		}
		if (_this.get(ATTR_KEYDOWN_FN)) {
			this._addEnterListener();
		}
	},

	set: function(key, value) {
		NodeInput.superclass.set.call(this, key, value);
		if (ATTR_BLUR_TEXT == key) {
			this._addBlurText();
		}
		if (ATTR_KEYDOWN_FN == key) {
			this._addEnterListener();
		}
	}
});

Y.NodeInput = NodeInput;

}, {requires: ['node', 'base']});