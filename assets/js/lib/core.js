/**
 *	Copyright (c) 2007, Matt Snider, LLC All rights reserved.
 *	Version: 1.0
 */

/**
 *  The Core Object and namespace for attaching additional Framework, Toolkit, and Business Objects, Functions, etc.
 *  @namespace Core
 *  @class Core
 *  @dependencies DOM must be ready
 */

/**
 *  W3C DOM Level 2 standard node types; for older browsers and IE
 */
var $doc = document;
if (! $doc.ELEMENT_NODE) {
	$doc.ELEMENT_NODE = 1;
	$doc.ATTRIBUTE_NODE = 2;
	$doc.TEXT_NODE = 3;
	$doc.CDATA_SECTION_NODE = 4;
	$doc.ENTITY_REFERENCE_NODE = 5;
	$doc.ENTITY_NODE = 6;
	$doc.PROCESSING_INSTRUCTION_NODE = 7;
	$doc.COMMENT_NODE = 8;
	$doc.DOCUMENT_NODE = 9;
	$doc.DOCUMENT_TYPE_NODE = 10;
	$doc.DOCUMENT_FRAGMENT_NODE = 11;
	$doc.NOTATION_NODE = 12;
}


/**
 *  manages commonwealth variables: version, browser, debug state, namespace
 */
window.Core = (function() {

	//	Private namespace

	var debugLevel = 0;
	
	
	//	Public namespace

	return {


		/**
		 * The current project version #
		 *
		 * @property Version
		 * @type string
		 */
		VERSION: '1.0',


		/**
		 * The controller namespace
		 *
		 * @property Controller
		 * @type object
		 */
		Controller: {},


		/**
		 *	Object namespace placeholder for attaching global constants; inner Function to create Client Singleton
		 *
		 * @property Constants
		 * @type object
		 */
		Constants: {},


		/**
		 * The model object namespace
		 *
		 * @property Model
		 * @type object
		 */
		Model: {},


		/**
		 * The utility namespaces
		 *
		 * @property Util
		 * @type object
		 */
		Util: {},


		/**
		 * The view object namespace
		 *
		 * @property View
		 * @type object
		 */
		View: {},


		/**
		 *	Object namespace for attaching client detection logic
		 */
		Client: function() {
			var F = function() {},
				that = null;

			F.prototype = {


				/**
				 * Collection fo browser constants
				 *
				 * @property DATA_BROWSER
				 * @type array
				 */
				DATA_BROWSER: [
					{string: navigator.userAgent, subString: 'OmniWeb', versionSearch: 'OmniWeb/', identity: 'OmniWeb'},
					{string: navigator['vendor'], subString: 'Apple', identity: 'Safari'},
					{prop: window['opera'], identity: 'Opera'},
					{string: navigator['vendor'], subString: 'iCab', identity: 'iCab'},
					{string: navigator['vendor'], subString: 'KDE', identity: 'Konqueror'},
					{string: navigator.userAgent, subString: 'Firefox', identity: 'Firefox'},
					{string: navigator['vendor'], subString: 'Camino', identity: 'Camino'},
					{string: navigator.userAgent, subString: 'Netscape', identity: 'Netscape'}, // for newer Netscapes (6+)
					{string: navigator.userAgent, subString: 'MSIE', identity: 'Explorer', versionSearch: 'MSIE'},
					{string: navigator.userAgent, subString: 'Gecko', identity: 'Mozilla', versionSearch: 'rv'},
					{string: navigator.userAgent, subString: 'Mozilla', identity: 'Netscape', versionSearch: 'Mozilla'}// for older Netscapes (4-)
				],


				/**
				 * Collection fo os constants
				 *
				 * @property DATA_BROWSER
				 * @type array
				 */
				dataOS: [
					{string: navigator.platform, subString: 'Win', identity: 'Windows'},
					{string: navigator.platform, subString: 'Mac', identity: 'Mac'},
					{string: navigator.platform, subString: 'Linux', identity: 'Linux'}
				],
			
			
				/**
				 * Creates a cookie with @ name set to value that expires in n days
				 *
				 * @method createCookie
				 * @param name {string}	The name of the cookie
				 * @param value {string} The value of the cookie
				 * @param days {string}	OPTIONAL: The number of days before cookie expires, otherwise expires at end of session
				 * @static
				 */
				createCookie: function(name, value, days) {
					var expires=null;
					if (days) {
						var date = new Date();
						date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
						expires = '; expires=' + date.toGMTString();
					}
					else {expires = '';}
					document.cookie = name + '=' + value + expires + '; path=/';
				},


				/**
				 * Expires the cookie
				 *
				 * @method eraseCookie
				 * @param name {string} The name of the cookie
				 * @static
				 */
				eraseCookie: function(name) {
					this.createCookie(name, '', -1);
				},

				
				/**
				 * The height of the total page (usually the body element).
				 *      when statement is true, targets all but MAX
				 *      when statement is false, targets Mac browsers
				 *
				 * @method getPageHeight
				 * @return {object} x = width, y = height of page as integers
				 * @static
				 */
				getPageHeight: function() {
					var bd = Core.getBody();
					return (bd.scrollHeight > bd.offsetHeight)? {x: bd.scrollWidth, y: bd.scrollHeight}: {x: bd.offsetWidth, y: bd.offsetHeight};
				},

				/**
				 * Returns how much the page has scrolled in an array [x,y]
				 *
				 * @method getScrollOffset
				 * @return {object} x = horizontal scroll offset, y = vertical scroll offset of page as integers
				 * @static
				 */
				getScrollOffset: function() {
					var dim = {}, bd = Core.getBody();

					if (self.pageYOffset) { // all except Explorer
						dim.x = self.pageXOffset;
						dim.y = self.pageYOffset;
					}
					else if (document.documentElement && document.documentElement.scrollTop) {	// Explorer 6 Strict
						dim.x = document.documentElement.scrollLeft;
						dim.y = document.documentElement.scrollTop;
					}
					else if (bd) { // all other Explorers
						dim.x = bd.scrollLeft;
						dim.y = bd.scrollTop;
					}

					return dim;
				},


				/**
				 * Returns the window size of the browser in an array [x,y]
				 *
				 * @method getSize
				 * @return {object} x = width, y = height of the window as integers
				 * @static
				 */
				getSize: function() {
					var dim = {x: 0, y: 0},
						bd = Core.getBody();

					if (isset(bd) && isNumber(bd.clientWidth)) {
						// Gecko 1.0 (Netscape 7) and Internet Explorer 5+
						dim.x = bd.clientWidth;
						dim.y = bd.clientHeight;
					}
					else if (isNumber(window.innerWidth)) {
						// Navigator 4.x, Netscape 6.x, CompuServe 7 and Opera
						dim.x = window.innerWidth;
						dim.y = window.innerHeight;
					}

					return dim;
				},


				/**
				 * Returns the viewport width
				 *
				 * @method getViewportWidth
				 * @return {int} the viewport widths
				 * @static
				 */
				getViewportWidth: function() {
					return self.innerWidth || (document.documentElement.clientWidth || Core.getBody().clientWidth);
				},


				/**
				 * Returns the viewport height
				 *
				 * @method getViewportHeight
				 * @return {int} the viewport height
				 * @static
				 */
				getViewportHeight: function() {
					return self.innerHeight || (document.documentElement.clientHeight || Core.getBody().clientHeight);
				},


				/**
				 * Returns the viewport size of the browser in an array [x,y]
				 *
				 * @method getViewportSize
				 * @return {object} x = width, y = height of the viewport as integers
				 * @static
				 */
				getViewportSize: function() {
					return {x: this.getViewportWidth(), y: this.getViewportHeight()};
				},


				/**
				 * Test if the client browser is IE
				 *
				 * @method isIE
				 * @return {boolean} true, when IE
				 * @public
				 */
				isIE: function() {
					return 'Explorer' === this.browser;
				},


				/**
				 * Test if the client browser is opera
				 *
				 * @method isOpera
				 * @return {boolean} true, when opera
				 * @public
				 */
				isOpera: function() {
					return 'Opera' === this.browser;
				},


				/**
				 * Test if the client browser is safari
				 *
				 * @method isSafari
				 * @return {boolean} true, when safari
				 * @public
				 */
				isSafari: function() {
					return 'Safari' === this.browser;
				},


				/**
				 * Test if the client OS is windows
				 *
				 * @method isWin
				 * @return {boolean} true, when windows
				 * @public
				 */
				isWin: function() {
					return 'Windows' === this.OS;
				},


				/**
				 * Retrieves the value of a cookie
				 *
				 * @method searchString
				 * @param name {string} The name of the cookie
				 * @return {string} Value of the cookie or null
				 * @static
				 */
				readCookie: function(name) {
					var nameEQ = name + '=',
						ca = document.cookie.split(';');
					
					for (var i=0; i < ca.length; i += 1) {
						var c = ca[i];
						while (c.charAt(0)==' ') {c = c.substring(1,c.length);}
						if (c.indexOf(nameEQ) == 0) {return c.substring(nameEQ.length,c.length);}
					}
					
					return null;
				},


				/**
				 * Set the internal variables from the data object
				 *
				 * @method searchString
				 * @param data {object} object representing the browser
				 * @return {string} the indentity from needle
				 * @static
				 */
				searchString: function (data) {
					for (var i=0; i < data.length; i++)	{
						var dataString = data[i].string,
							dataProp = data[i].prop;
						
						this.versionSearchString = data[i].versionSearch || data[i].identity;
						
						if (dataString) {
							if (dataString.indexOf(data[i].subString) != -1){return data[i].identity;}
						}
						else if (dataProp) {return data[i].identity;}
					}
				},


				/**
				 * Retrieve the version from the needle
				 *
				 * @method searchVersion
				 * @param dataString {string} needle to search for a version number
				 * @return {float} the version number
				 * @static
				 */
				searchVersion: function (dataString) {
					var index = dataString.indexOf(this.versionSearchString);
					if (index === -1) {return;}
					return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
				}
			};

			that = new F();
			
			that.browser = that.searchString(that.DATA_BROWSER) || 'An unknown browser';
			that.version = that.searchVersion(navigator.userAgent) || that.searchVersion(navigator.appVersion) || 'an unknown version';
			that.OS = that.searchString(that.dataOS) || 'an unknown OS';

			return that;
		}(),


		/**
		 *	Object namespace placeholder for attaching debug constants and functions
		 */
        Debug: {
			ALL: 0,
			ERROR: 1,
			DEBUG: 2,
			PRODUCTION: 5
		},
		
		
		/**
		 *  Placeholder function, used whenever an empty anonymous function is required 
		 */
		emptyFunction: function() {},


		/**
		 * Executes fn on each element in the set
		 *
		 * @method batch
		 * @param set {array} the collection to iterate on
		 * @param fn {function} the function to execute on each member of the collection
		 * @param {arguments} any number of arguments to pass into fn
		 * @public
		 */
		batch: function(set, fn) {
			if (! set.length) {return;}
			var args = Array.prototype.slice.apply(arguments, [2]),
				j = set.length;
			args.unshift(null, null);

			// iterate on the items, executing the function, and stoping when function returns true or touched all childnodes
			for (var i = 0; i < j; i++) {
				args[0] = set[i];
				args[1] = i;
				var rs = fn.apply(this, args);
				if (rs) {
					return rs; // allows the batch function to return a found result
				}
			}
		},


		/**
		 * Extends the prototype of the subclass with that of the superclass and apply additional methods
		 *
		 * @method extend
		 * @param subc {object} subclass
		 * @param superc {object} superclass
		 * @param overrides {object} class member overrides
		 * @static
		 */
		extend: function(subc, superc, overrides) {
			if (! (superc && subc)) {
				throw new Error('Core.extend failed, please check that all dependencies are included.');
			}

			var F = function() {};
			F.prototype = superc.prototype;
			subc.prototype = new F();
			subc.prototype.constructor = subc;
			subc.prototype.parent = superc.prototype;

			if (overrides) {
				for (var i in overrides) {
					subc.prototype[i] = overrides[i];
				}
			}

			return subc;
		},

		/**
		 * Retrieves the HTMLBodyElement, x-browser safe.
		 * @method getBody
		 * @return {Element} The Body Element.
		 * @static
		 */
		getBody: function() {
			// get body by the ID
			var body = YAHOO.util.Dom.get('body-mint');

			if (! body) { // find the body the tag
				body = $doc.getElementsByTagName('body')[0];

				if (! body) { // try find the body on the document
					body = $doc.body || $doc.childNodes[0].childNodes[1];

					if (! body) { // No body, try appending to document
						body = $doc;
					}
				}
			}

			return body;
		},


		/**
		 * returns an image object with src, useful for image caching
		 *
		 * @method getImage
		 * @param src {string} The location of the image
		 * @return {Image} A Javascript Image Object of the src
		 * @static
		 */
		getImage: function(src) {
			var img = new Image();
			img.src = src;
			return img;
		},


		/**
		 * Retrieves the page name
		 *
		 * @method getPageName
		 * @return {string} the name of the page
		 * @static
		 */
		getPageName: function() {
			return window.location.href.replace(/.*?(\w+)\.action.*/gi, '$1').replace(/\/|\?/, '');
		},


		/**
		 * Retrieves the value of JavaScript token from the DOM, or throws an exception when not found
		 *
		 * @method getToken
		 * @return {string} the token
		 * @static
		 */
		getToken: function() {
			var token = Dom.get('javascript-token');

			if (! token) {
				throw ('Token Node request before DOM was ready.');
			}

			token = $F(token);

			Core.getToken = function() {
				return token;
			};

			return Core.getToken();
		},

		
		/**
		 * Returns the debug level of the application
		 *
		 * @method getDebugLevel
		 * @return {int} the debug level
		 * @static
		 */
		getDebugLevel: function() {return debugLevel;},

		
		/**
		 * Sets the debug level of the application
		 *
		 * @method setDebugLevel
		 * @param lvl {int} the debug level
		 * @static
		 */
		setDebugLevel: function(lvl) {debugLevel = lvl;},


		/**
		 * Scroll to the top of the page using the native window.scroll method and 0,0 coordinates
		 *
		 * @method targetTop
		 * @static
		 */
		targetTop: function() {
			window.scroll(0,0);
		},


		/**
		 *  The JavaScript namespace used to store some 'unsensitive' information about the current user
		 *  @property USER
		 *  @type String
		 */
		USER: {


			/**
			 * The authorized user's key
			 *
			 * @property USER.key
			 * @type string
			 */
			key: '',


			/**
			 * The authorized user's name
			 *
			 * @property USER.name
			 * @type string
			 */
			name: ''
		}
	};
})();


/* Section: Type Detection Functions */

/**
Function: $defined
	Returns true if the passed in value/Object is defined, that means it is not null or undefined.

Arguments:
	o - the Object to inspect.
	
Returns:
	{boolean}
*/

function $defined(o){
	return (undefined !== o && null !== o);
};


/**
Function: $type
	Returns the type of Object that matches the element passed in.

Arguments:
	obj - the Object to inspect.
	
Example:
	>var myString = 'hello';
	>$type(myString); //returns "string"

Returns:
	'element' - if o is a DOM element node
	'textnode' - if o is a DOM text node
	'whitespace' - if o is a DOM whitespace node
	'arguments' - if o is an arguments object
	'array' - if o is an object
	'object' - if o is an object
	'string' - if o is a string
	'number' - if o is a number
	'boolean' - if o is a boolean
	'function' - if o is a function
	'regexp' - if o is a regular expression
	'date' - if o is a Date
	'class' - if o is a Class. (created with new Class, or the extend of another class).
	'collection' - if o is a native htmlelements collection, such as childNodes, getElementsByTagName .. etc.
	null - if the object is not defined or none of the above.
*/
function $type(o) {
	if (! $defined(o)) {return null;}
	if (o.htmlElement) {return 'element';}

	var type = typeof o;

	if ('object' === type || 'function' === type) {
		if (o.nodeName) {
			switch (o.nodeType) {
				case 1: return 'element';
				case 3: return (/\S/).test(o.nodeValue) ? 'textnode' : 'whitespace';
				default:
					break;
			}
		}

		if (o.constructor) {
			switch (o.constructor) {
				case Array: return 'array';
				case RegExp: return 'regexp';
				//case Class: return 'class'; not using the Class object
				case Date: return 'date';
				// add additional Object types that you care about here
				default:
					break;
			}
		}

		if ('number' === typeof o.length) {
			// IE 6 chokes on this test
			try {
				if (o.item) {return 'collection';}
			}
			catch (e) {
				return e ? 'collection' : null;
			}

			if (o.callee) {return 'arguments';}
		}
	}

	return type;
}


/**
Function: isType
	Returns true if the Object has the same type as supplied.

Arguments:
	o - the Object to inspect.
	type - the String name for type
	
Returns:
	{boolean}
*/

function isType(o, type) {
	return type == $type(o);
}