/**
 * Copyright (c) 2008, Matt Snider, LLC. All rights reserved.
 * Version: 8
 */

/**
 * The Object utility class handles Object static methods.
 * @class Object
 * @namespace Core.Util
 * @dependencies library
 */
YAHOO.lang.augmentObject(Object, {

	/**
	 * Static method for executing a safe "for ... in" loop on the provided object, calling the function when provided.
	 * @method object_mes_foreach
	 * @param data {Object} Required. The object to loop through.
	 * @param fn {Function} Required. The callback function.
	 * @static
	 */
	forEach: function(data, fn) {
		if (! $defined(data) || ! isType(fn, 'function')) {return;}
		var ikey = Object.getIgnoreKeys();

		// iterate on the keys in data
		for (var k in data) {
			// ignore methods added to the prototype of Array and Object
			if (! ikey[k]) {
				fn(data[k], k);
			}
		}
	},

	/**
	 * Creates an empty Array, Object, and NodeList to determine which needless functions and values have been attached to
	 *     these important Objects. This collection can then be used to ignore these values when iterating with 'for in'.
	 * @method getIgnoreKeys
	 * @return {Array} Associative array of values to be ignored.
	 * @static
	 */
	getIgnoreKeys: function() {
		var l = null,
			tobj = {},
			tarr = [],
			tdom = document.getElementsByTagName("body"),
			keys = {'item': true, 'toJSONString': true, 'length': true, 'namedItem': true}; // default keys to ignore

		// iterate on the native object object
		for (l in tarr) {keys[l] = true;}

		// iterate on the native object object
		for (l in tobj) {keys[l] = true;}

		// iterate on the nodelist, but don't ignore indices
		for (l in tdom) {
			if (isType(parseInt(l, 10), 'number')) {continue;}
			keys[l] = true;
		}

		return keys;
	},

	/**
	 * Tests if the passed parameter is an Object.
	 * @param o {Object} Required. An Object that want to ensure is an Object.
	 * @return {Boolean} True when parameter is an Object.
	 * @static
	 */
	is: function(o) {
		return isType(o, 'object');
	},

	/**
	 * Static method for converting the object to a query string.
	 * @method toQueryString
	 * @param data {Object} Required. The object to loop through.
	 * @param encode {Boolean} Optional. True when you want to escape the string; default is falsy.
	 * @return {String} The object as a query string.
	 * @static
	 */
	toQueryString: function(data, encode) {
		var sb = [],
			i = 0;

		Object.forEach(data, function(v, k) {
			sb[i] = k + '=' + v;
			i += 1;
		});

		return encode ? encodeURIComponent(sb.join('&')) : sb.join('&');
	}
});