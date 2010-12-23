/*
 * Copyright (c) 2009, Mint Software Inc. All rights reserved.
 * Version: 11.00
 */

(function() {
var Y = YAHOO,
	YL = Y.lang,
	YD = Y.util.Dom,

    /**
     * The base class for all widgets.
     * @constructor
     * @namespace Core.Widget
     * @class WidgetBase
     * @param elem {Element|String} Required. The base node.
     * @param conf {String} Optional. A configuration object.
     */
    _F = function(elem, conf) {
        var _this = this;
		_this._cfg = YL.isObject(conf) ? conf : {};
        _this._node = YD.get(elem);
		if (! _this._node.id) {throw('Core.Widget.WidgetBase: Missing ID for root node.');}
        _this._idPrefix = _this._cfg.idPrefix || _this._node.id + '-';
        _this._isShowing = YD.isVisible(_this._node);
        _this._cachedNodes = {};
    };

	// for YUI 3 switchover
	_F.ATTR = {
		idPrefix: ''
	};

	_F.prototype = {

        /**
         * The widget root node.
         * @property _node
         * @type {Element}
         * @final
         * @protected
         */
        _node: null,

        /**
         * The nodes cached when using getNode with a `nodeId`.
         * @property _cachedNodes
         * @type {Object}
         * @final
         * @protected
         */
        _cachedNodes: null,

        /**
         * The widget configuration object.
         * @property _cfg
         * @type {Object}
         * @final
         * @protected
         */
        _cfg: null,

        /**
         * The widget node ID attribute prefix (inner IDs should all start with this prefix).
         * @property _idPrefix
         * @type {String}
         * @final
         * @protected
         */
        _idPrefix: null,

        /**
         * The visibility state of the widget; faster than actually testing the node.
         * @property _isShowing
         * @type {Boolean}
         * @final
         * @protected
         */
        _isShowing: false,

        /**
         * Fetches the id prefix string.
         * @method getIdPrefix
         * @return {String} The prefix.
         * @public
         */
        getIdPrefix: function() {
            return this._idPrefix;
        },

        /**
         * Fetches a node from the widget or by default the base node.
         * @method getNode
         * @param nodeId {String} Optional. An id of the node to retrieve (without id prefix); default retrieves the base node.
         * @return {Element} A widget node.
         * @public
         */
        getNode: function(nodeId) {
			var _this = this;
            if (nodeId) {
                if (! _this._cachedNodes[_this._idPrefix + nodeId]) {
                    _this._cachedNodes[_this._idPrefix + nodeId] = YD.get(_this._idPrefix + nodeId);
                }

                return _this._cachedNodes[_this._idPrefix + nodeId];
            }
            return _this._node;
        },

		/**
		 * Hide the widget.
		 * @method hide
		 * @public
		 */
		hide: function() {
            if (this._isShowing) {
                YD.hide(this._node);
                this._isShowing = false;
            }
		},

        /**
         * Return true if widget is visible, false otherwise.
         * @method show
         * @public
         */
        isShowing: function() {
            return this._isShowing;
        },

        /**
         * Parse the node id by stripping the id prefix
         * @method parseNodeId
         * @param node {Element} Required. The node whose id is to be parsed.
         * @return {String} The node id.
         * @public
         */
        parseNodeId: function(node) {
            return node.id.substring(this._idPrefix.length);
        },

		/**
		 * Show the widget.
		 * @method show
		 * @public
		 */
		show: function() {
            if (! this._isShowing) {
                YD.show(this._node);
                this._isShowing = true;
            }
		},

        /**
         * Toggle the widget display.
         * @method toggle
         * @public
         */
        toggle: function() {
            if (! this._isShowing) { this.show(); }
            else { this.hide(); }
            return this._isShowing;
        }
    };

    YL.augment(_F, Y.util.EventProvider);

    Core.Widget.WidgetBase = _F;

}());