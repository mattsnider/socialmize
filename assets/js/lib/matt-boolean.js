/**
 * Copyright (c) 2008, Mint Software Inc. All rights reserved.
 * Version: 8
 */

/**
 * The Boolean utility extends the native JavaScript Boolean Object with additional methods and objects.
 * @class Boolean
 * @namespace Mint.Util
 * @dependencies YUI, MintCore
 */
YAHOO.lang.augmentObject(Boolean, {

	/**
	 * Converts truthy/falsy to Boolean.
	 * @method get
	 * @param o {Object} Required. An Object that want to convert to Boolean.
	 * @return {Boolean} True when parameter is truthy or true.
	 * @static
	 */
	get: function(o) {
		//noinspection RedundantConditionalExpressionJS
		return ($defined(o) && o) ? true : false; // ensures proper type for ===
	},

	/**
	 * Tests if the passed parameter is a Boolean.
	 * @method is
	 * @param o {Object} Required. An Object that want to ensure is a Boolean.
	 * @return {Boolean} True when parameter is a Boolean.
	 * @static
	 */
	is: function(o) {
		return isType(o, 'boolean');
	}
});