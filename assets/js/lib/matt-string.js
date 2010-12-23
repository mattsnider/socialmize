/**
 * Copyright (c) 2008, Matt Snider, LLC. All rights reserved.
 * Version: 1.0
 */

/**
 * The String utility extends the native JavaScript String Object with additional methods and objects.
 * @class String
 * @namespace Core.Util
 * @dependencies YUI, Core
 */
YAHOO.lang.augmentObject(String, {

	/**
	 * An associative array containing select HTML character entities that we'd like to decode.
	 * @property htmlCharacterEntities
	 * @static
	 * @final
	 * @type {Array}
	 */
	htmlCharacterEntities: {"quot":'"',"nbsp":' ',"ndash":"\u2013","lt":'<',"gt":'>', "reg":'\xae',"copy":'\xa9',"cent":'\xa2',"amp":'&',"apos":"'","rsquo":'\x27'},

	/**
	 * Regex for color validation.
	 * @property RX_COLOR
	 * @static
	 * @final
	 * @type {RegExp}
	 */
	RX_COLOR: /^#[0-9a-fA-F]{6}$|^#[0-9a-fA-F]{3}$/,

	/**
	 * Regex for email validation.
	 * @property RX_EMAIL
	 * @static
	 * @final
	 * @type {RegExp}
	 */
	RX_EMAIL: /^\w(\+?\.?-?\w)*\-?@\w(\+?\.?[\-\w])*\.[a-z]{2,4}$/i,

	/**
	 * Regex for escaping String before using them as RegExp declarations.
	 * @property RX_ESCAPE
	 * @static
	 * @final
	 * @type {RegExp}
	 */
	RX_ESCAPE: new RegExp('(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\' ].join('|\\') + ')', 'g'),

    /**
     * Converts a hexidecimal color into it's RGB values.
     * @method hexToRGB
     * @param s {String} A hexidecimal color.
     * @static
     */
    hexToRGB: function(s) {
        var r = 0, g = 0, b = 0;
        
        if (s.isColor()) {
            var n = -1 < s.indexOf('#') ? 1 : 0;

            if (3 === s.length) {
                r = s.substr(n, 1);
                g = s.substr(n + 1, 1);
                b = s.substr(n + 2, 1);
                r = (r + r).fromHex();
                g = (g + g).fromHex();
                b = (b + b).fromHex();
            }
            else {
                r = s.substr(n, 2).fromHex();
                g = s.substr(n + 2, 2).fromHex();
                b = s.substr(n + 4, 2).fromHex();
            }
        }

        return [r, g, b];
    },

    /**
	 * Tests if the passed parameter is a String.
	 * @param o {Object} Required. An Object that want to ensure is a String.
	 * @return {Boolean} True when parameter is a String.
	 * @static
	 */
	is: function(o) {
		return isType(o, 'string');
	},

	/**
	 * Converts red, green, blue numeric values to hex.
	 * @method RGBtoHex
	 * @param r {String|Number} Required. The value from 0-255.
	 * @param g {String|Number} Required. The value from 0-255.
	 * @param b {String|Number} Required. The value from 0-255.
	 * @return {String} The numeric value as a hex 00-FF.
	 * @static
	 */
	RGBtoHex: function(r, g, b) {
		return ('' + r).toHex() + ('' + g).toHex() + ('' + b).toHex();
	}
});

/**
 * The String utility extends the native JavaScript String Object with additional methods.
 * @class String
 * @namespace Core.Util
 * @extends window.String
 * @dependencies YUI, Core
 */
YAHOO.lang.augmentObject(String.prototype, {

	/**
	 * Capitolize the first letter of every word.
	 * @method capitalize
	 * @param ucfirst {Boolean} Optional. When truthy, converts non-first letters to lower case; default is undefined.
	 * @param minLength {Integer} Optional. When set, this is the minimum number of characters a word must be before transforming; default is undefined.
	 * @return {String} The converted string.
	 * @public
	 */
	capitalize: function(ucfirst, minLength) {
		var words = this.split(/\s+/g),
			i = 0,
			rs = [];

		Core.batch(words, function(w) { // don't assume $A() is available
			w = w.trim();

			// this is not whitespace
			if (w) {
				// not applying a min length, or word is greater than min
				if (! minLength || (minLength && w.length >= minLength)) {
					rs[i] = w.charAt(0).toUpperCase() + (ucfirst? w.substring(1).toLowerCase(): w.substring(1));
				}
				// insert word directly
				else {
					rs[i] = w;
				}

				i += 1;
			}
		});

		return rs.join(' ');
	},

	/**
	 * Converts commas in the string into comma + newline characters.
	 * @method convertCommasToNewline
	 * @return {String} The converted string.
	 * @public
	 */
	convertCommasToNewline: function() {
		return this.replace(/,\s*/g, ",\n");
	},

	/**
	 * Decodes a string containing either HTML or XML character entities.  Not all HTML character entities are supported.
	 * @author Jason Yiin
	 * @method decode
	 * @return {String} The decoded string.
	 * @public
	 */
	decode: function() {
		return this.replace(/\&#?([a-z]+|[0-9]+);|\&#x([0-9a-fA-F]+);/g,
			/**
			 * Callback function callback by replace.
			 *
			 * @param matched {Object} Required. The matches from regex.
			 * @param htmlCharacterEntity {String} Required. The match for the first back-reference.
			 * @param xmlCharacterEntity {String} Required. The match for the second back-reference.
			 * @param offset {Number} Optional. The offset of match in String.
			 * @param whole {String} Optional. The reference to the original value.
			 */
			function(matched, htmlCharacterEntity, xmlCharacterEntity) {
				var returnString = matched;

				if (htmlCharacterEntity) {
					var hceValue = String.htmlCharacterEntities[htmlCharacterEntity];
					if (hceValue) {returnString = hceValue;}
				}
				else if (xmlCharacterEntity) {
					//if fromCharCode is passed something that it can't recognize, it returns a ?
					returnString = String.fromCharCode(parseInt(xmlCharacterEntity, 16));
				}
				
				return returnString;
			});
	},

	/**
	 * Checks if a 'this' ends with the needle.
	 * @method endsWith
	 * @param needle {String} Required. The search needle.
	 * @param ignoreCase {Boolean} Optional. True, ignores the case of the two strings.
	 * @return {Boolean} True, if 'this' ends with needle.
	 * @public
	 */
	endsWith: function(needle, ignoreCase) {
		var str = '' + this,
			end = '' + needle;

		// if the needle is longer than 'this', we know false
		if (0 === end.length || 0 > (this.length - end.length)) {return false;}

		if (ignoreCase) {
			str = str.toLowerCase();
			end = end.toLowerCase();
		}
		
		return str.lastIndexOf(end) === str.length - end.length;
	},

	/**
	 * Checks if a 'this' ends with any of the needles in the argument set.
	 * @method endsWithAny
	 * @param needle {String} Required. The search needle.
	 * @param needleX {String} Optional. Additional search needles.
	 * @param ignoreCase {Boolean} Optional. True, ignores the case of the two strings; last parameter if desired.
	 * @return {Boolean} True, if 'this' ends with any of the arguments.
	 * @public
	 */
	endsWithAny: function() {
		var args = arguments,
			last = args.length - 1,
			ignoreCase = isType(args[last], 'boolean') && args[last];
		
		for (var i = 0; i < args.length; i += 1) {
			if (this.endsWith(args[i], ignoreCase)) {return true;}
		}
		
		return false;
	},

	/**
	 * Escape regex literals in 'this'.
	 * @method escapeRx
	 * @return {String} The escaped text.
	 * @static
	 */
	escapeRx: function() {
		return this.replace(String.RX_ESCAPE, '\\$1');
	},

	/**
	 * Converts a 10-digit number into an american phone number (###-###-####).
	 * @method formatPhone
	 * @return {String} The formatted string; return "" when invalid.
	 * @public
	 */
	formatPhone: function() {
		var str = this.stripNonNumbers();
		if (10 !== str.length) {return '';}
		return str.replace(/(\d{3})(\d{3})(\d{4})/g, '$1-$2-$3');
	},

    /**
     * Converts a hexidecimal into a number.
     * @method fromHex
	 * @return {Number} The hexidecimal value of number.
	 * @public
     */
    fromHex: function() {
        return parseInt('' + this, 16);
    },

    /**
	 * Converts 'this' into a number, defaults to 0.
	 * @method getNumber
	 * @param isInt {Boolean} Optional. When true, converts to integer instead of float; default is falsy.
	 * @param strict {Boolean} Optional. When true, removes all non-numbers, otherwise remove non-numeric; default is falsy.
	 * @return {Number} The formatted number.
	 * @public
	 */
	getNumber: function(isInt, strict) {
		var str = strict ? this.stripNonNumbers() : this.stripNonNumeric();
		if (0 === str.length) {str = '0';}
		return isInt ? parseInt(str) : parseFloat(str);
	},

	/**
	 * Retrieves value for the given key out of the url query string.
	 *  ex: url=http://www.mattsnider.com?id=1234&type=special then, getQueryValue(url,"id") == "1234"
	 * @method getQueryValue
	 * @param key {String} Required. The key value you want to retrieve.
	 * @return {String} The value of the key or empty string.
	 * @static
	 */
	getQueryValue: function(key) {
		var url = '&' !== this.charAt(0) ? '&' + this : this; // prevents malformed url problem
		//noinspection JSDeprecatedSymbols
		var regex = new RegExp('[\\?&]' + ('' + key).escapeRx() + '=([^&#]*)'),
			results = regex.exec(url);
		return results ? results[1] : '';
	},

	/**
	 * Returns the number of words in a string (does not split on '_').
	 * @method getWordCount
	 * @return {Number} The number of words in 'this'.
	 * @public
	 */
	getWordCount: function() {
		var o = this.trim().match(/\b\w+\b/g);
		return o ? o.length : 0;
	},

	/**
	 * Checks if a string contains any of the strings in the arguement set.
	 * @method has
	 * @param needle {String} Required. The search needle.
	 * @param needleX {String} Optional. Additional needles to search.
	 * @param ignoreCase {Boolean} Optional. True, ignores the case of the two strings.
	 * @return {Boolean} True, if str contains any of the arguements.
	 * @static
	 */
	has: function() {
		var args = arguments,
			last = args.length - 1,
			ignoreCase = isType(args[last], 'boolean') && args[last],
			str = ignoreCase ? this.toLowerCase() : this;

		// if the needle is longer than 'this', we know false
		if (0 === str.length) {return false;}

		for (var i = 0; i < args.length; i += 1) {
			var s = '' + args[i];
			if (0 < s.length && -1 < str.indexOf(ignoreCase ? s.toLowerCase() : s)) {return true;}
		}

		return false;
	},

	/**
	 * Assert is a 'hexidecimal color'.
	 * @method isColor
	 * @return {Boolean} True, if the str contains a color string like '#F00' or '#FF00CC'.
	 * @static
	 */
	isColor: function() {
		return String.RX_COLOR.test(this);
	},

	/**
	 * Checks if the email string is an email by test it has an '@' and a '.' in the correct places.
	 * @method isEmail
	 * @return {Boolean} True, if the str contains only one email.
	 * @static
	 */
	isEmail: function() {
		return String.RX_EMAIL.test(this.trim());
	},

	/**
	 * Convert string new lines to newlineChar, useful for form submission.
	 * @method normalizeNewlines
	 * @param newlineChar {String} Optional. The character to replace newline with ("\n" or "\r").
	 * @return {String} The converted string.
	 * @public
	 */
	normalizeNewlines: function(newlineChar) {
		var text = this;
		
		if ('\n' === newlineChar || '\r' === newlineChar) {
			text = text.replace(/\r\n|\r|\n/g, newlineChar);
		}
		else {
			text = text.replace(/\r\n|\r|\n/g, "\r\n");
		}

		return text;
	},

	/**
	 * Removes the rx pattern from the string.
	 * @method remove
	 * @param rx {regex} Required. The regex to use for finding characters to remove.
	 * @return {String} The cleaned string.
	 * @public
	 */
	remove: function(rx) {
		return this.replace(rx, '');
	},

	/**
	 * Replaces the first currency in string with a value.
	 * @method replaceCurrency
	 * @param val {String} Required. The value to replace the first currency with.
	 * @return {String} The updated string.
	 * @public
	 */
	replaceCurrency: function(val) {
		// #_# replace is needed for safari and $0
		return val ? this.replace(/\$[\d{1,3},?]+(\.\d+)?/, val.replace(/\$/, '#_#')).replace(/#_#/, '$') : '' + this;
	},

	/**
	 * Replaces the first percent in string with a value.
	 * @method replacePercent
	 * @param val {String} Required. The value to replace the first percent with.
	 * @return {String} The updated string.
	 * @public
	 */
	replacePercent: function(val) {
		return val ? this.replace(/[\d{1,3},?]+(\.\d+)?\%/, val).replace(/\.00\.00/, '.00') : '' + this;
	},

	/**
	 * Checks if a 'this' starts with the needle.
	 * @method startsWith
	 * @param needle {String} Required. The search needle.
	 * @param ignoreCase {Boolean} Optional. True, ignores the case of the two strings.
	 * @return {Boolean} True, if 'this' starts with needle.
	 * @public
	 */
	startsWith: function(needle, ignoreCase) {
		var str = '' + this,
			start = '' + needle;

		// if the needle is longer than 'this', we know false
		if (0 === start.length || 0 > (this.length - start.length)) {return false;}

		if (ignoreCase) {
			str = str.toLowerCase();
			start = start.toLowerCase();
		}
		
		return 0 === str.indexOf(start);
	},

	/**
	 * Checks if a 'this' starts with any of the needles in the argument set.
	 * @method startsWithAny
	 * @param needle {String} Required. The search needle.
	 * @param needleX {String} Optional. Additional search needles.
	 * @param ignoreCase {Boolean} Optional. True, ignores the case of the two strings; last parameter if desired.
	 * @return {Boolean} True, if 'this' starts with any of the arguments.
	 * @public
	 */
	startsWithAny: function(){
		var args = arguments,
			last = args.length - 1,
			ignoreCase = isType(args[last], 'boolean') && args[last];

		for (var i = 0; i < args.length; i += 1) {
			if (this.startsWith(args[i], ignoreCase)) {return true;}
		}

		return false;
	},

	/**
	 * Remove all non-alpha characters;space ok.
	 * @method stripNonAlpha
	 * @return {String} The cleaned string.
	 * @public
	 */
	stripNonAlpha: function() {
		return this.remove(/[^A-Za-z ]+/g);
	},

	/**
	 * Remove all non-alpha-numeric characters; space ok.
	 * @method stripNonAlphaNumeric
	 * @return {String} The cleaned string.
	 * @public
	 */
	stripNonAlphaNumeric: function() {
		return this.remove(/[^A-Za-z0-9 ]+/g);
	},

	/**
	 * Removes non-numeric characters, except minus and decimal.
	 * @method stripNonNumeric
	 * @return {String} The cleaned string.
	 * @public
	 */
	stripNonNumeric: function() {
		return this.remove(/[^0-9\u2013\-\.]/g);
	},

	/**
	 * Remove all characters that are not 0-9.
	 * @method stripNonNumbers
	 * @return {String} The cleaned string.
	 * @public
	 */
	stripNonNumbers: function() {
		return this.remove(/[^0-9]/g);
	},

	/**
	 * Remove all characters that are 0-9.
	 * @method stripNumbers
	 * @return {String} The cleaned string.
	 * @public
	 */
	stripNumbers: function() {
		return this.remove(/[0-9]/g);
	},

	/**
	 * HTML script tags from the string.
	 * @method stripScripts
	 * @return {String} The cleaned string.
	 * @public
	 */
	stripScripts: function() {
		return this.remove(new RegExp('(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)', 'img'));
	},

	/**
	 * HTML tags from the string.
	 * @method stripTags
	 * @return {String} The cleaned string.
	 * @public
	 */
	stripTags: function() {
		return this.remove(/<\/?[^>]+>/gi);
	},

	/**
	 * Returns the substring up to or including the needle.
	 * @method substrToStr
	 * @param needle {String} Required. The search needle.
	 * @param sIndex {Number} Optional. The starting index, default will start from the beginning of 'this'.
	 * @param fl {Boolean} Optional. If truthy, will include the substring in the output.
	 * @return {String} A substring of 'this' or empty string.
	 * @public
	 */
	substrToStr: function(needle, sIndex, fl) {
		var sub = needle ? '' + needle : '';
		if (! isType(sIndex, 'number')) {sIndex = 0;}
		if (sIndex > this.length) {return '';}
		var i = this.indexOf(sub);
		if (-1 === i) {return '';}
		return this.substr(sIndex, i - sIndex) + (fl ? sub : '');
	},

	/**
	 * Converts 0-255 value into its hex equivalent. String should be numberic between 0 and 255.
	 * @method toHex
	 * @return {String} The hex 00-FF of numberic value.
	 * @static
	 */
	toHex: function() {
		var hex = '0123456789ABCDEF',
			n = parseInt(this, 10);

		if (0 === n || isNaN(n)) {return '00';}
		n %= 256; // ensures number is base 16
		n = Math.max(0, n);
		n = Math.min(n, 255);
		n = Math.round(n);
		return hex.charAt((n - n % 16) / 16) + hex.charAt(n % 16);
	},

	/**
	 * Truncates the string and inserts and elipsis.
	 * @method truncate
	 * @param n {Number} Optional. The max length of the string; defualt is 30.
	 * @param trancation {String} Optional. The string to use as the ellipsis; defualt is '...'.
	 * @return {String} The truncated string with ellipsis if necessary.
	 * @static
	 */
	truncate: function(n, truncation) {
		var str = '' + this,
			length = n || 30;
		truncation = $defined(truncation) ? truncation : '...';
		return str.length > length ? str.substring(0, length - truncation.length) + truncation : str;
	},

	/**
	 * Replaces the white spaces at the front and end of the string.
	 *  Optimized: http://blog.stevenlevithan.com/archives/faster-trim-javascript.
	 * @method trim
	 * @return {String} The cleaned string.
	 * @public
	 */
	trim: function() {
		return this.remove(/^\s\s*/).remove(/\s\s*$/);
	}
});