/**
 * Copyright (c) 2008, Matt Snider, LLC. All rights reserved.
 * Version: 8
 */

/**
 * The Array utility class handles Array static methods.
 * @class Array
 * @namespace Core.Util
 * @dependencies library
 */
YAHOO.lang.augmentObject(Array, {

	/**
	 * Collection of types that are allowed, everything else will be converted to an empty Array.
	 * @property ALLOWED_TYPES
	 * @type String
	 * @const
	 * @static
	 */
	ALLOWED_TYPES: 'array,nodelist,collection,arguments',

	/**
	 * Converts the provided Object into an array, ensure it is not an array-like object.
	 * @method get
	 * @param o {Object} Required. An array or array-like object.
	 * @return {Array} The provided object as an Array.
	 * @static
	 */
	get: function(o) {
		var data = $defined(o) ? o : [], // defaults to Array when passed nothing or crap
			type = $type(data);

		// invalid type, use Array
		if (! Array.isArrayLike(data)) {
			data = [];
			type = 'array';
		}

		// take action based on Object-type
		switch (type) {
			case 'array':
				return data;

			default:
				var arr = [];

				// not an Array, but an Array-like object, let's make it an Array
				if (data.length) {
					var j = data.length,
						i = 0;

					// iterate through nodeList, this should be sequential, because we expect nodeList to be in a certain order
					for (i = 0; i < j; i += 1) {
						// only add keys with values
						if (data[i]) {
							arr[arr.length] = data[i];
						}
					}
				}

				return arr;
		}
	},

	/**
	 * Tests if the passed parameter is an Array.
	 * @param o {Object} Required. An Object that want to ensure is an Array.
	 * @return {Boolean} True when parameter is an Array.
	 * @static
	 */
	is: function(o) {
		return isType(o, 'array');
	},

	/**
	 * Tests if the object is Array-like.
	 *
	 * @method isArrayLike
	 * @param o {Object} Required. Any object.
	 * @return {Boolean} True when 'o' is Array-like.
	 * @static
	 */
	isArrayLike: function(o) {
		return -1 < Array.ALLOWED_TYPES.indexOf($type(o));
	}

});

/**
 * The Array utility extends the native JavaScript Array Object with additional methods.
 * @class Array
 * @namespace Core.Util
 * @extends window.Array
 */
YAHOO.lang.augmentObject(Array.prototype, {

	/**
	 * The number current position of the pointer. Should be considered private, even though it is attached to the prototoype.
	 * @property _pointer
	 * @type Number
	 * @const
	 * @public
	 */
	_pointer: 0,

	/**
	 * Executes the function on the items in the iterator.
	 * @method batch
	 * @param fx {function} Required. The function to execute on each element.
	 * @public
	 */
	batch: function(fx) {
		return Core.batch(this, fx);
	},

	/**
	 * Return a copy of the array with null and undefined elements removed; this is not a DEEP COPY, sub-references remain intact.
	 *  This method does not change the existing arrays, it only returns a copy of the joined arrays.
	 * @method compact
	 * @param compress {Boolean} Optional. When true, this function will not preserve indices.
	 * @return {Array} Copy of 'this' array without null/undefined elements.
	 * @public
	 */
	compact: function(compress) {
		var arr = [];

		// iterate on the
		this.batch(function(o, k) {
			if ($defined(o)) {
				if (compress && isType(parseInt(k, 10), 'number')) {
					arr.push(o);
				}
				else {
					arr[k] = o;
				}
			}
		});

		return arr;
	},

	/**
	 * Returns true if the object is in the array.
	 * @method contains
	 * @param val {Object} Required. The object to compare.
	 * @param strict {Boolean} Optional. True when also comparing type.
	 * @return {Boolean} True when the object is in the Array.
	 * @public
	 */
	contains: function(val, strict) {
		//noinspection PointlessBooleanExpressionJS
		return this.batch(function(o) {
			return (o === val) || (! strict && o == val);
		}) || false;
	},

	/**
	 * Returns a new Array object with the same keys/values as current Array.
	 * @method copy
	 * @return {ModelArray} The copy of this.
	 * @public
	 */
	copy: function() {
		var arr = [];
		this.batch(function(o, k) {arr[k] = o;});
		return arr;
	},

	/**
	 * Returns the element currently pointed to.
	 * @method current
	 * @returrn {Object} The object in 'this' at pointer.
	 * @public
	 */
	current: function() {
		return this[this._pointer];
	},

	/**
	 * Compares the objects for equality, defeats javascript objects compare by reference.
	 * @method Equals
	 * @param compare {Array} Required. An object to compare to with.
	 * @return {Boolean} True, when values in object and array are equal.
	 * @public
	 */
	equals: function(compare) {
		if (! Array.isArrayLike(compare) || this.length !== compare.length) {return false;}
		if (! this.length) {return true;}
		var isEqual = true;

		//noinspection PointlessBooleanExpressionJS
		this.batch(function(o, i) {
			//noinspection AssignmentReplaceableWithOperatorAssignmentJS
			isEqual = isEqual && o === compare[i];
		});

		return isEqual;
	},

	/**
	 * Returns the first element in the Array or Undefined.
	 * @method first
	 * @return {Object} The first element in array.
	 * @public
	 */
	first: function() {
		return this[0];
	},

	/**
	 * The last index of value in the array.
	 * @method indexOf
	 * @param val {Object} Required. Any non-Object, object.
	 * @param strict {Boolean} Optional. True when also comparing type.
	 * @return {Number} The index of value or -1 when object is not in array.
	 * @public
	 */
	indexOf: function(val, strict) {
		var t1 = this.batch(function(o, i) {
			return (o === val) || (! strict && o == val) ? i : false;
		});
		return isType(t1, 'number') ? t1 : -1;
	},

	/**
	 * Returns the last element in the Array or Undefined.
	 * @method last
	 * @return {Object} The last element in array.
	 * @public
	 */
	last: function() {
		return (this.length) ? this[this.length - 1] : undefined;
	},

	/**
	 * The last index of value in the Array.
	 * @method lastIndexOf
	 * @param val {Object} Required. Any non-Object, object.
	 * @param strict {Boolean} Optional. True when also comparing type.
	 * @return {Number} The index of value or -1 when object is not in array.
	 * @public
	 */
	lastIndexOf: function(val, strict) {
		// iterate on the data, in the reversed direction
		for (var i = this.length - 1; -1 < i; i -= 1) {
			var o = this[i];
			if ((o === val) || (! strict && o == val)) {return i;}
		}

		return -1;
	},

	/**
	 * Updates the array pointer to the next position; wraps to ZERO when wrap is true.
	 * @method next
	 * @param wrap {Boolean} Optional. True when you want to wrap to ZERO when exceeding array length.
	 * @return {Object} The next element in the Array.
	 * @public
	 */
	next: function(wrap) {
		var i = this._pointer;
		i += 1;
		if (wrap && this.length - 1 < i) {i = 0;}
		this._pointer = i;
		return this[i];
	},

	/**
	 * Updates the array pointer to the prev position; wraps to length - 1.
	 * @method prev
	 * @param wrap {Boolean} Optional. True when you want to wrap to ZERO when exceeding array length.
	 * @return {Object} The previous element in the Array.
	 * @public
	 */
	prev: function(wrap) {
		var i = this._pointer;
		i -= 1;
		if (wrap && 0 > i) {i = this.length - 1;}
		this._pointer = i;
		return this[i];
	},

	/**
	 * Remove the member at index (i) in the array.
	 * @method removeIndex
	 * @param n {Number} Required. The index to remove.
	 * @return {Object} The new Array or Original.
	 * @public
	 */
	removeIndex: function(n) {
		var arr = [],
			i = 0;

		// invalid index
		if (0 > n || n >= this.length) {return this;}

		// iterate on self
		this.batch(function(o) {
			// index to remove
			if (i === n) {
				n -= 1;
			}
			// other values
			else {
				arr[i] = o;
				i += 1;
			}
		});

		return arr;
	},

	/**
	 * Finds the object in the array and removes it.
	 * @method removeValue
	 * @param val {Object} Required. The object to remove.
	 * @return {Object} The new Array or Original.
	 * @public
	 */
	removeValue: function(val) {
		return this.removeIndex(this.indexOf(val));
	},

	/**
	 * Resets the Array pointer to the first position.
	 * @method reset
	 * @public
	 */
	reset: function() {
		this._pointer = 0;
	},

	/**
	 * Iterates through the array and removes duplicate values.
	 * @method unique
	 * @return {Array} Array with only unique values.
	 * @public
	 */
	unique: function() {
		var sorter = {},
			out = [];

		// iterate on this
		this.batch(function(o) {
			// test if object with type already exists
			if (! sorter[o + typeof o]) {
				out.push(o);
				sorter[o + typeof o] = true;
			}
		});

		return out;
	}
}, true);

/**
 * Same as "batch".
 * @method forEach
 * @see batch
 * @public
 */
if (! $defined(Array.prototype.forEach)) {
	Array.prototype.forEach = Array.prototype.batch;
}
/**
 * Same as "Array.get".
 * @method $A
 * @see Array.get
 * @static
 */
var $A = Array.get;