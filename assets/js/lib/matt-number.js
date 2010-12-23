/**
 * Copyright (c) 2008, Matt Snider, LLC. All rights reserved.
 * Version: 8
 */

/**
 * The Number utility extends the native JavaScript Number Object with additional methods and objects.
 * @class Number
 * @namespace Core.Util
 * @dependencies 
 */
YAHOO.lang.augmentObject(Number, {

    _uniqueIndex: 0,

    /**
	 * Tests if the passed parameter is a Number.
	 * @param n {Object} Required. An Object that want to ensure is a Number.
	 * @return {Boolean} True when parameter is a Number.
	 * @static
	 */
	is: function(n) {
		return isType(n, 'number');
	},

    /**
     * Generates a unique number string using the time and a unique index.
     * @method getUnique
     * @return {Number} The generated value.
     * @static
     */
    getUnique: function() {
        var val = Number._uniqueIndex + (new Date()).getTime();
        Number._uniqueIndex += 1;
        return parseInt(val);
    }
});

/**
 * The Number utility extends the native JavaScript Number Object prototype with additional methods and objects.
 * @class Number
 * @extends window.Number
 * @dependencies 
 */
YAHOO.lang.augmentObject(Number.prototype, {

	/**
	 * Returns the value of 'this' without any direction.
	 * @method abs
	 * @return {Number} The absolute value of 'this'.
	 * @see Math.abs
	 * @public
	 */
	abs: function() {
		return Math.abs(this);
	},

	/**
	 * Returns the value of 'this' rounded upwards to the nearest integer.
	 * @method ceil
	 * @return {Number} The rounded value of 'this'.
	 * @see Math.ceil
	 * @public
	 */
	ceil: function() {
		return Math.ceil(this);
	},

	/**
	 * Returns the value of 'this' rounded downwards to the nearest integer.
	 * @method floor
	 * @return {Number} The rounded value of 'this'.
	 * @see Math.floor
	 * @public
	 */
	floor: function() {
		return Math.floor(this);
	},

	/**
	 * Formats the number according to the 'format' string; adherses to the american number standard where a comma is inserted after every 3 digits.
	 *  Note: there should be only 1 contiguous number in the format, where a number consists of digits, period, and commas
	 *        any other characters can be wrapped around this number, including '$', '%', or text
	 *        examples (123456.789):
	 *          '0' - (123456) show only digits, no precision
	 *          '0.00' - (123456.78) show only digits, 2 precision
	 *          '0.0000' - (123456.7890) show only digits, 4 precision
	 *          '0,000' - (123,456) show comma and digits, no precision
	 *          '0,000.00' - (123,456.78) show comma and digits, 2 precision
	 *          '0,0.00' - (123,456.78) shortcut method, show comma and digits, 2 precision
	 *	Note: Fails on formats with multiple periods.
	 * @method format
	 * @param format {String} Required. The way you would like to format this text.
	 * @return {String} The formatted number.
	 * @public
	 */
	format: function(format) {
		if (! isType(format, 'string')) {return '';} // sanity check

		var hasComma = -1 < format.indexOf(','),
			psplit = format.replace(/[^0-9\u2013\-\.]/g, '').split('.'),
			that = this;

		// compute precision
		if (1 < psplit.length) {
			// fix number precision
			that = that.toFixed(psplit[1].length);
		}
		// error: too many periods
		else if (2 < psplit.length) {
			throw('NumberFormatException: invalid format, formats should have no more than 1 period: ' + format);
		}
		// remove precision
		else {
			that = that.toFixed(0);
		}

		// get the string now that precision is correct
		var fnum = that.toString();

		// format has comma, then compute commas
		if (hasComma) {
			// remove precision for computation
			psplit = fnum.split('.');

			var cnum = psplit[0],
				parr = [],
				j = cnum.length,
				m = Math.floor(j / 3),
				n = (cnum.length % 3) || 3; // n cannot be ZERO or causes infinite loop

			// break the number into chunks of 3 digits; first chunk may be less than 3
			for (var i = 0; i < j; i += n) {
				if (0 !== i) {n = 3;}
				parr[parr.length] = cnum.substr(i, n);
				m -= 1;
			}

			// put chunks back together, separated by comma
			fnum = parr.join(',');

			// add the precision back in
			if (psplit[1]) {fnum += '.' + psplit[1];}
		}

		// replace the number portion of the format with fnum
		return format.replace(/[\d,?\.?]+/, fnum);
	},

	/**
	 * Determines if the number value is between two other values.
	 * @method isBetween
	 * @param i {Number} Required. The lower bound of the range.
	 * @param j {Number} Required. The upper bound of the range.
	 * @param inlcusive {Boolean} Optional. True if i and j are to be included in the range.
	 * @return {Boolean} True if i < this < j or j > this > i.
	 * @static
	 */
	isBetween: function(i, j, inclusive) {
		if (! (Number.is(i) && Number.is(j))) {return false;}
		return inclusive ? ((i <= this && j >= this) || (j <= this && i >= this)) :
		                   ((i < this && j > this) || (j < this && i > this));
	},

	/**
	 * Determines if the number value is not between two other values.
	 * @method isNotBetween
	 * @param i {Number} Required. The lower bound of the range.
	 * @param j {Number} Required. The upper bound of the range.
	 * @param inlcusive {Boolean} Optional. True if i and j are to be included in the range.
	 * @return {Boolean} True if i > this || val > j.
	 * @static
	 */
	isNotBetween: function(i, j, inclusive) {
		return ! this.isBetween(i, j, inclusive);
	},

	/**
	 * Rounds a number to the nearest integer.
	 * @method round
	 * @return {Number} The rounded value of 'this'.
	 * @see Math.round
	 * @public
	 */
	round: function() {
		return Math.round(this);
	},

	/**
	 * Returns the square root of a number.
	 * @method round
	 * @return {Number} The sqrt value of 'this'.
	 * @see Math.sqrt
	 * @public
	 */
	sqrt: function() {
		return Math.sqrt(this);
	}
});