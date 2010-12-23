/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.00
 */

YUI().add('gallery-node-form', function(Y) {

/**
 * Creates a Node object augmented with extra form functionality.
 *
 * @module NodeForm
 */

var LANG = Y.Lang;

/**
 * Creates an instance of NodeForm to manage tab interactions and their content.
 *
 * @class NodeForm
 * @extends Widget
 * @param config {Object} Configuration object
 * @constructor
 */
function NodeForm() {
	NodeForm.superclass.constructor.apply(this,arguments);
}

Y.mix(NodeForm, {
	/**
	 * @property NodeForm.NAME
	 * @type String
	 * @static
	 */
	NAME : 'node-form',

	/**
	 * @property NodeForm.ATTRS
	 * @type Object
	 * @static
	 */
	ATTRS : {

		/**
		 * @attribute elem
		 * @type Element
		 * @default null
		 * @description The text .
		 */
		elem: {
			value : null,
			setter: function(val) {
				return Y.one(val);
			}
		}
	}
});

Y.extend(NodeForm, Y.Base, {

	/**
	 * See widget destructor.
	 * @method destructor
	 * @public
	 */
	destructor: function () {
	},

	/**
	 * Retrieves all serializable elements of the form; sorts them top to bottom, left to right by defualt.
	 *  note: DOM iterating is faster than using getElementsByTagName("*")
	 * @method getFields
	 * @param fldName {String} Optional. A name to filter by.
	 * @param iTypes {Array} Optional. List of element types to ignore; default is hidden.
	 * @return {Array} A collection of Form fields.
	 * @static
	 */
	getFields: function(fldName, iTypes) {
		var set = [],
			ignoreTypes = LANG.isArray(iTypes) ? iTypes : [],

		// should be redefined each time, because of closure on 'set'
		fn = function(nodes) {
			nodes.each(function(node) {
				if (document.ELEMENT_NODE !== node.get('nodeType')) {return;}
				var isValidTag = Y.FormElement.isField(node),
					isValidName = (! fldName || fldName === node.get('name'));

				if (isValidTag && isValidName && -1 === ignoreTypes.indexOf(node.get('type'))) {
					set.push(node);
				}
				else if (node.hasChildNodes()) {
					fn(node.get('childNodes'));
				}
			});
		};

		fn(this.get('elem').get('childNodes'));

		return set;
	},

	/**
	 * See widget initializer.
	 * @method initializer
	 * @param config {Object} Required. A configuration object.
	 * @public
	 */
	initializer: function (config) {
	},

	/**
	 * Converts the form into a key/value paired string.
	 * @method serialize
	 * @return {String} The serialized fields.
	 * @public
	 */
	serialize: function() {
		var queryComponents = [];

		Y.each(this.getFields(), function(fld) {
			var qc = Y.FormElement.serialize(fld);
			if (qc) {queryComponents.push(qc);}
		});

		return queryComponents.join('&');
	}
});

Y.NodeForm = NodeForm;

}, {requires: ['node', 'base', 'gallery-node-field']});