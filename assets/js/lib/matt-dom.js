/**
 * Copyright (c) 2007, Matt Snider, LLC All rights reserved.
 * Version: 1.0
 */

/**
 * The Dom Object manages dom manipulation.
 *
 * @namespace Core.Util
 * @class Event
 * @dependencies Core
 */
Core.Util.Dom = YAHOO.util.Dom;

// shortcuts
var $D = Core.Util.Dom;
var $ = $D.get;

YAHOO.lang.augmentObject($D, {

	/**
	 * Removes a node from the DOM, using a fading animation and clearning all events.
	 * @method deleteNode
	 * @param elem {Element} Required. Pointer or string reference to DOM element to delete.
	 * @param obj {Object} Optional. The animation object data; default will fade opacity from 1 to 0.25.
	 * @param dur {Number} Optional. The duration of the animation; default is 0.5s.
	 * @param ease {Object} Optional. The easing method; default is easeOut.
	 * @param fucntions {Array} Optional. A collection of animation event callback functions {id: the event, fx: callback function}.
	 * @return {Object} YAHOO animation object.
	 * @static
	 */
	animate: function(elem, obj, dur, ease, functions) {
		var node = $D.get(elem),
			cfg = {
			duration: dur || 0.5,
			ease: ease || YAHOO.util.Easing.easeOut,
			obj: obj || {opacity: {from: 1, to: 0.25}}
		},
			fxs = functions || [],
			anim = new YAHOO.util.Anim(node, cfg.obj, cfg.duration, cfg.ease);

		// functions are provided
		if (fxs.length) {
			fxs.batch(function(o) {
				if (anim[o.id]) {anim[o.id].subscribe(o.fx);}
			});
		}

		anim.animate();
        return anim;
    },

	/**
	 * Removes whitespace-only text node children.
	 * @method cleanWhitespace
	 * @param elem {Element} Required. Pointer or string reference to DOM element to evaluate.
	 * @return {Element} Cleaned DOM node for convenience or NULL.
	 * @static
	 */
	cleanWhitespace: function(elem) {
		var node = $(elem);

		if (! node) {return null;}

		var cld = node.firstChild;

		while (cld) {
			var nextNode = cld.nextSibling;
			if ($doc.COMMENT_NODE === cld.nodeType || ($doc.TEXT_NODE === cld.nodeType && ! /\S/.test(cld.nodeValue))) {
				node.removeChild(cld);
			}
			cld = nextNode;
		}

		return node;
	},

	/**
	 * Positions the second element at the same coords as the first.
	 * @method cloneDimensions
	 * @param srcElem {Element|String} Required. The element to get position of.
	 * @param applyElem {Element|String} Required. The element to set position of.
	 * @static
	 */
	cloneDimensions: function(srcElem, applyElem) {
		var o = $D.getRectangle(srcElem),
			node = $S(applyElem);

		$D.setStyle(node, 'left', o.x + 'px');
		$D.setStyle(node, 'top', o.y + 'px');
		$D.setStyle(node, 'height', o.height + 'px');
		$D.setStyle(node, 'width', o.width + 'px');
	},

	/**
	 * If possible creates the document element according to the xhtml namespace, otherwise, normally;
	 *  failure returns a Function that throws an exception.
	 * @method createNode
	 * @param tagName {String} Required. Tag name to create.
	 * @return {Element} The newly created element.
	 * @static
	 */
	createNode: function(tagName) {
		if ($doc.createElementNS) {
			$D.createNode = function(tagName) {
				return tagName ? $doc.createElementNS('http://www.w3.org/1999/xhtml', tagName) : null;
			};
		}
		else if ($doc.createElement) {
			$D.createNode = function(tagName) {
				return tagName ? $doc.createElement(tagName) : null;
			};
		}
		else {
			$D.createNode = function() {throw 'createElement is not available.';};
		}

		return $D.createNode(tagName);
	},

	/**
	 * Creates and returns an html element and adds attributes from the hash.
	 * @method createTag
	 * @param tagName {String} Required. Tag name to create.
	 * @param hash {Object} Optional. The hashtable of attributes, styles, and classes; defaults is empty object.
	 * @return {Element} The newly created element; returns null otherwise.
	 * @static
	 */
	createTag: function(tagName, hash) {
		var el = $D.createNode(tagName);

		// iterate through the possible attributes
		Object.forEach(hash || {}, function(v, k) {
			switch (k.toLowerCase()) {
				case 'classname':
				case 'class':
				case 'cls':
					$D.addClass(el, v);
					break;

				case 'cellpadding':
					el.cellPadding = v;
					break;

				case 'cellspacing':
					el.cellSpacing = v;
					break;

				case 'colspan':
					el.colSpan = v;
					break;

				case 'checked':
				case 'disabled':
					// Capitolization is important in your hashtable for these to work properly in all browsers
					el[k] = v;
					break;

				case 'rowspan':
					el.rowSpan = v;
					break;

				case 'style':
					// iterate on the styles and set them
					Object.forEach(v, function(v, k) {
						$D.setStyle(el, k, v);
					});
					break;

				case 'innerhtml':
				case 'text':
					if (String.is(v) && ! v.match(/<.*?>/) && ! v.match(/&.*?;/)) {
						el.appendChild($doc.createTextNode(v));
					}
					else {
						//noinspection InnerHTMLJS
						el.innerHTML = v;
					}
					break;

				default:
					el.setAttribute(k, v);
					break;
			}
		});

		return el || null;
	},

	/**
	 * Removes a node from the DOM, using a fading animation and clearning all events.
	 * @method deleteNode
	 * @param elem {Element} Required. Pointer or string reference to DOM element to delete.
	 * @param fn {Function} Optional. The callback function after animation finishes; default is undefined.
	 * @param isRemoveListener {Boolean} Optional. True, when you want to purge event listeners from node and children; default is undefined.
	 * @static
	 */
	deleteNode: function(elem, fn, isRemoveListener) {
		var node = $(elem);
		if (! node) {return;}
		var parent = node.parentNode;
		if (isRemoveListener && window.Event && Event.purgeElement) {Event.purgeElement(node);}
		if (! isType(fn, 'function')) {fn = function() {};}

		// animation available
		if (YAHOO.util.Anim) {
			var anim = new YAHOO.util.Anim(node, {opacity: {from: 1, to: 0.25}}, 0.5, YAHOO.util.Easing.easeOut);
			anim.onComplete.subscribe(function() {
				parent.removeChild(node);
				if (fn) {fn();}
			});
			anim.animate();
		}
		else {
			parent.removeChild(node);
			fn();
		}
	},

    /**
     * Exectues a series of DOM manipulation tasks on the provided node, by splitting the provided string by '.'.
     * @method exec
	 * @param elem {Element} Required. Pointer or string reference to DOM element to delete.
     * @param task {String} Required. The DOM maninpulation tasks to execute (Ex. parentNode.firstChild.lastChild).
     * @static
     */
    exec: function(elem, task) {
		var node = $(elem);
		if (! (node && task)) {return;}
        task.split('.').batch(function(task) {
            if (node) {
                var yuiTask = 'get' + task.capitalize();

                if ($D[yuiTask]) {
                    node = $D[yuiTask](node);
                } // todo: support childNodes[]
                else if (node[task]) {
                    node = node[task];
                }
                else {
                    // unsupported technique
                }
            }
            else {
                return true;
            }
        });
        return node;
    },

    /**
	 * Find and replace the first text, or append a textnode when there is no textnode.
	 * @method findFirstText
	 * @param elem {Element} Required. Pointer or string reference to DOM element to search.
	 * @return {Element} The first available text node or null.
	 * @static
	 */
	findFirstText: function(elem) {
		var node = $(elem);
		if (! node) {return null;}

		// this is a text node, so update it
		if ($D.isTextNode(elem)) {
			return node;
		}
		// find text node
		else {
			$D.cleanWhitespace(node);
			var n = null;

			// iterate on the node children
			Array.get(node.childNodes).batch(function(cld) {
				n = $D.findFirstText(cld);
				if (n) {return true;}
			});

			return n;
		}
	},

    /**
     * Retrieves the HTMLBodyElement, x-browser safe.
     * @method getBody
     * @return {Element} Body DOM node for convenience or NULL.
     * @static
     */
    getBodyElement: function() {
        // get body by the ID
        var body = $('project');

        if (! $defined(body)) { // find the body the tag
            body = document.getElementsByTagName('body')[0];

            if (! $defined(body)) { // try find the body on the document
                //noinspection XHTMLIncompatabilitiesJS
                body = document.body || document.childNodes[0].childNodes[1];

                if (! $defined(body)) { // No body, try appending to document
                    body = document;
                }
            }
        }

        return body;
    },

	/**
	 * Retrieves the position of node inside its parent.
	 * @method getChildNodeIndex
	 * @param elem {Element} Required. Pointer or string reference to DOM element to search.
	 * @return {Number} The DOM node index.
	 * @static
	 */
	getChildNodeIndex: function(elem) {
		var node = $D.get(elem),
			index = -1;

		if (node && node.parentNode) {
			Array.get(node.parentNode.childNodes).batch(function(n, i) {
				if (node === n) {
					index = i;
					return true;
				}
			});
		}

		return index;
	},

	/**
	 * Returns the elements content as a float.
	 * @method getContentAsFloat
	 * @param elem {Element} Required. Pointer or string reference to DOM element to evaluate.
	 * @return {String} The innerHTML of the node as a float.
	 * @static
	 */
	getContentAsFloat: function(elem) {
		return parseFloat($D.getContentAsString(elem).stripNonNumeric().replace(/\u2013/, '-'));
	},

	/**
	 * Returns the elements content as a integer.
	 * @method getContentAsInteger
	 * @param elem {Element} Required. Pointer or string reference to DOM element to evaluate.
	 * @return {String} The innerHTML of the node as a integer.
	 * @static
	 */
	getContentAsInteger: function(elem) {
		return parseInt($D.getContentAsString(elem).stripNonNumeric().replace(/\u2013/, '-'), 10);
	},

	/**
	 * Returns the elements content.
	 * @method getContentAsString
	 * @param elem {Element} Required. Pointer or string reference to DOM element to evaluate.
	 * @return {String} The innerHTML of the node.
	 * @static
	 */
	getContentAsString: function(elem) {
		/**
		 * Returns the elements content.
		 * @method _getContentAsString
		 * @param nodes {Nodelist} Required. A collection of xml childnodes.
		 * @return {String} The innerHTML or equivalent of the node.
		 * @static
		 */
		var _getContentAsString = ! window.XMLSerializer ? function(nodes) { // IE
			var sb = [];

			Array.get(nodes).batch(function(node, i) {
				//noinspection InnerHTMLJS
				sb[i] = ($D.isTextNode(node))? node.nodeValue: node.xml || node.innerHTML;
			});

			return sb.join('').replace(/\/?\>\<\/input\>/gi, '\/>'); // IE tends to insert a bogus "</input>" element instead of understanding empty closure "<input ... />"
		} :  function(nodes) { // mozilla
			var xmlSerializer = new XMLSerializer(),
				sb = [];

			Array.get(nodes).batch(function(node, i) {
				sb[i] = ($doc.CDATA_SECTION_NODE === node.nodeType)? node.nodeValue: xmlSerializer.serializeToString(node);
			});

			return sb.join('').replace(/(\<textarea[^\<]*?)\/\>/, '$1>&nbsp;</textarea>');
		};

		$D.getContentAsString = function(elem) {
			var parentNode = $(elem);

			if (! parentNode || ! parentNode.childNodes.length) {return '';}

			if ($D.isTextNode(parentNode.firstChild.nodeType) && 1 === parentNode.childNodes.length) {
				return parentNode.firstChild.nodeValue;
			}
			else {
				return _getContentAsString(parentNode.childNodes);
			}
		};

		return $D.getContentAsString(elem);
	},

	/**
	 * Returns the height and width of a DOM Element.
	 * @method getContentAsString
	 * @param elem {Element} Required. Pointer or string reference to DOM element to evaluate.
	 * @return {Object} The {height, width} of DOM node.
	 * @static
	 */
	getDimensions: function(elem) {
		var node = $(elem);

		if (! node) {
			return {height: 0, width: 0};
		}

		var d = $D.getStyle(node, 'display'),
			disp = ('none' !== d || ! d) && ! $D.hasClass(node, C.html.cls.HIDE);

		if (disp) {
			return {height: node.offsetHeight, width: node.offsetWidth};
		}

		// All *Width and *Height properties give 0 on elements with display none,
		// so enable the element temporarily
		var els = node.style,
			originalVisibility = els.visibility,
			originalPosition = els.position,
			hasHide = $D.hasClass(node, C.html.cls.HIDE);
		els.visibility = 'hidden';
		els.position = 'absolute';

		if (hasHide) {
			$D.removeClass(node, C.html.cls.HIDE);
		}
		else {
			els.display = 'block';
		}

		var originalWidth = node.clientWidth,
			originalHeight = node.clientHeight;

		if (hasHide) {
			$D.addClass(node, C.html.cls.HIDE);
		}
		else {
			els.display = 'none';
		}

		els.position = originalPosition;
		els.visibility = originalVisibility;
		return {height: originalHeight, width: originalWidth};
	},

	/**
	 * Wraps the native getElementsByTagName method, converting the nodelist to an Array object.
	 * @method getElementsByTagName
	 * @param tagName {String} Required. The DOM node tag to search for.
	 * @param elem {Element} Required. Pointer or string reference to DOM element to search.
	 * @return {Model.Array} The collection of nodes.
	 * @static
	 */
	getElementsByTagName: function(tagName, elem) {
		return Array.get($(elem).getElementsByTagName(tagName));
	},

	/**
	 * Retrieves the first text nodes value.
	 * @method getFirstText
	 * @param elem {Element} Required. Pointer or string reference to DOM element to search.
	 * @return {String} The value of the first text node.
	 * @static
	 */
	getFirstText: function(elem) {
		var node = $D.findFirstText(elem);
		if (! node) {return '';}
		return $D.isTextNode(node) ? node.nodeValue : '';
	},

	/**
	 * Find the parent node of elem, will search tree for nodes that match optional tagName and className.
	 * @method getParent
	 * @param elem {Element} Required. Pointer or string reference to DOM element to search.
	 * @param tagName {String} Optional. The DOM node tag name to limit by.
	 * @param className {String} Optional. The DOM node attribute class name to limit by.
	 * @return {Element} The desired node or null.
	 * @static
	 */
	getParent: function(elem, tagName, className) {
		var node = $(elem);

		if (! (node && (String.is(tagName) || String.is(className)) && node.parentNode) || node === $doc || node === window) {return null;}
		else {
			var hasClass = ! className || $D.hasClass(node, className);
			return ((node.nodeName.toLowerCase() === tagName.toLowerCase() && hasClass) || (! tagName && hasClass)) ?
				node : $D.getParent(node.parentNode, tagName, className);
		}
	},

	/**
	 * Finds element's absolute position.
	 * @method getPos
	 * @param elem {Element} Required. Pointer or string reference to DOM element to evaluate.
	 * @return {Object} The {x:posX, y:posY} of DOM node.
	 * @static
	 */
	getPos: function(elem) {
		var node = $(elem),
			curleft = 0, curtop = 0;

		if (node && node.offsetParent) {
			curleft = node.offsetLeft;
			curtop = node.offsetTop;

			while (node.offsetParent) {
				node = node.offsetParent;
				curleft += node.offsetLeft;
				curtop += node.offsetTop;
			}
		}

		return {x:curleft, y:curtop};
	},

	/**
	 * Finds the element's absolute rectangle.
	 * @method getRectangle
	 * @param elem {Element} Required. Pointer or string reference to DOM element to evaluate.
	 * @return {Object} The {x:posX, y:posY, width:offsetWidth, height:offsetHeight} of the DOM node.
	 * @static
	 */
	getRectangle: function(elem) {
		var dim = $D.getDimensions(elem),
			pos = $D.getPos(elem);
		return {x:pos.x, y:pos.y, height:dim.height, width:dim.width};
	},

	/**
	 * Hides any number of elements using class 'hide'.
	 * @method hide
	 * @param arg1 {Element} Required. Pointer or string reference to DOM element to style.
	 * @param argX {Element} Optional. Additional pointers or string references to DOM element to style.
	 * @static
	 */
	hide: function() {
		Array.get(arguments).batch(function(el) {
			var n = $(el);
			if (! n || ! n.style) {return;}
			$D.addClass(n, C.html.cls.HIDE);
			if ('none' === n.style.display) {n.style.display = '';}
		});
	},

	/**
	 * Tests if the node has the same tag name as those included in arguments 2+.
	 * @method isTextNode
	 * @param elem {Element} Required. Pointer or string reference to DOM element to evaluate.
	 * @param arg1 {Element} Required. A node name to compare with.
	 * @param argX {Element} Optional. Additional node names to compare with.
	 * @return {Boolean} True when the DOM node attribute nodeName is included in the arguments.
	 * @static
	 *
	 * Example:
	 * isNodeOfTagName(domNode, 'div', 'input', 'div');
	 */
	isNodeOfTagName: function(elem/*, arg1, arg2, ...*/) {
        var node = $(elem);
        if (! (node && node.tagName)) {return false;}
        var tagName = node.tagName.toLowerCase();

        for (var i = 1; i < arguments.length; i += 1) {
            if (tagName === arguments[i]) {return true;}
        }

        return false;
	},

	/**
	 * Tests if the node has the same type as those included in arguments 2+.
	 * @method isNodeOfType
	 * @param elem {Element} Required. Pointer or string reference to DOM element to evaluate.
	 * @param arg1 {Element} Required. A node type to compare with.
	 * @param argX {Element} Optional. Additional node types to compare with.
	 * @return {Boolean} True when the DOM node attribute nodeType is included in the arguments.
	 * @see Dom.isTextNode
	 * @static
	 *
	 * Example:
	 * isNodeOfType(domNode, document.ELEMENT_NODE, document.ATTRIBUTE_NODE, document.TEXT_NODE);
	 */
	isNodeOfType: function(elem/*, arg1, arg2, ...*/) {
        var node = $(elem);
        if (! (node && node.nodeType)) {return false;}
        var nodeType = node.nodeType;

        for (var i = 1; i < arguments.length; i += 1) {
            if (nodeType === arguments[i]) {return true;}
        }

        return false;
	},

	/**
	 * Tests if the node is one of 3 text types.
	 * @method isTextNode
	 * @param elem {Element} Required. Pointer or string reference to DOM element to evaluate.
	 * @return {Boolean} True, if the elem is a comment, text, or cdata node.
	 * @static
	 */
	isTextNode: function(elem) {
		var node = $(elem); // not calling isNodeOfType because this is faster
		return node && node.nodeType && (node.nodeType === $doc.CDATA_SECTION_NODE || node.nodeType === $doc.COMMENT_NODE || node.nodeType === $doc.TEXT_NODE);
	},

	/**
	 * Tests if the node is displayed and visible.
	 * @method isVisible
	 * @return {Boolean} True when displayed.
	 * @static
	 */
	isVisible: function(elem) {
		var node = $(elem);
		return node && node.style && ! ($D.hasClass(node, C.CLASS_HIDE) || 'hidden' === node.style.visibility || 'none' === node.style.display);
	},

	/**
	 * Remove childNodes from node, should be used instead of element.innerHTML = '' as this is xhtml compliant.
	 * @method removeChildNodes
	 * @param elem {Element} Required. Pointer or string reference to DOM element to clear.
	 * @return {Boolean} True when there were elements removed (actually, the number of removed nodes).
	 * @static
	 */
	removeChildNodes: function(elem) {
		var val = 0,
			node = $(elem);

		if (node) {
			val = node.childNodes.length;
			while (node.hasChildNodes()) {
				var cn = node.firstChild;
				if (cn.tagName && cn.tagName.match(/^\/\w+/)) {val -= 2;} // fix count for stupid IE6, guessing "-2" will work
				node.removeChild(cn);
			}
		}

		return val;
	},

	/**
	 * Replaces all children of elem as a textnode of text.
	 * @method replace
	 * @param elem {Element} Required. Pointer or string reference to DOM element to replace content of.
	 * @param text {String} Required. The innerHTML value equivalent to replace content with.
	 * @return {Element} The node for convenience.
	 * @static
	 */
	replace: function(elem, text) {
		var node = $(elem);
		if (! node) {return null;}

		if (! $D.isTextNode(node)) {
			$D.removeChildNodes(node);
		}

		$D.setContent(node, String.is(text) ? text : '');
		return node;
	},

	/**
	 * Replaces the elements textNode with string content.
	 * @method setContent
	 * @param elem {Element} Required. Pointer or string reference to DOM element to set content of.
	 * @param text {String} Required. The innerHTML value equivalent to append to the DOM node.
	 * @return {Element} The pointer to the DOM element for convenience.
	 * @static
	 */
	setContent: function(elem, text) {
		var node = $D.cleanWhitespace(elem),
			fcld = null,
			regx = /<.*>/,
			isHTML = false;

		if (! node || ! $defined(text)) {return;}

		fcld = node.firstChild;
		text = (text + '').decode();
		isHTML = regx.test(text);

		try {
			if (node) {
				if (! fcld && $D.isTextNode(node)) {
					node.nodeValue = text;
				}
				else if (! fcld && ! isHTML && ' ' !== text) { // temporary fix
					node.appendChild($doc.createTextNode(text));
				}
				else if ($D.isTextNode(fcld) && 1 === node.childNodes.length && ! isHTML) {
					fcld.nodeValue = text;
				}
				// everything else failed, try innerHTML
				else {
					//noinspection InnerHTMLJS
					node.innerHTML = ' ' === text ? '&nbsp;' : text;
				}
			}
		}
		catch (e) {
			var t = ' ' === text ? '&nbsp;' : text;
			//noinspection InnerHTMLJS
			node.innerHTML = t;
			Mint.Logger.error('Issue with setContent innerHTML call with text: ' + t, e);
		}

		return node;
	},

	/**
	 * Find and replace the first text, or append a textnode when there is no textnode.
	 * @method setFirstText
	 * @param elem {Element} Required. A pointer or string reference to DOM element to set first text of.
	 * @param text {String} Required. The text value to set.
	 * @return {Element} The pointer to the DOM element for convenience.
	 * @static
	 */
	setFirstText: function(elem, text) {
		var node = $D.cleanWhitespace(elem);

		if (! node || ! $defined(text)) {return;}

		var tn = $D.findFirstText(node);

		$D.setContent(null === tn ? node : tn, text);

		return node;
	},

	/**
	 * Show any number of elements removing class 'hide'.
	 * @method show
	 * @param arg1 {Element} Required. Pointer or string reference to DOM element to style.
	 * @param argX {Element} Optional. Additional pointers or string references to DOM element to style.
	 * @static
	 */
	show: function() {
		Array.get(arguments).batch(function(el) {
			$D.removeClass(el, C.html.cls.HIDE);
		});
	},

	/**
	 * Hides displayed elements and shows non-displayed element.
	 * @method toggle
	 * @param elem {Element} Required. Pointer or string reference to DOM element to style.
	 * @param f {Boolean} Optional. Force show instead of toggle.
	 * @static
	 */
	toggle: function(elem, f) {
		var isShow = Boolean.get(f) || (! $defined(f) && $D.hasClass(elem, C.CLASS_HIDE));
		$D[isShow ? 'show' : 'hide'](elem);
		return isShow;
	},

	/**
	 * Toggles the className for the provided element as a result of the boolean.
	 * @param elem {Element} Required. Pointer or string reference to DOM element apply class to.
	 * @param className {String} Required. The class name to apply.
	 * @param b {Boolean} Optional. True, when adding, falsy otherwise.
	 */
	toggleClass: function(elem, className, b) {
		$D[b ? 'addClass' : 'removeClass'](elem, className);
	},

	/**
	 * Toggles the visibility of element
	 * @method visibility
	 * @param elem {Element} Required. Pointer or string reference to DOM element to toggle style of.
	 * @param f {Boolean} Optional. Force visible instead of toggle.
	 * @static
	 */
	visibility: function(elem, f) {
		var node = $(elem);
		if (! node || ! node.style) {return;}
		node.style.visibility = (Boolean.get(f) || (! $defined(f) && 'hidden' === node.style.visibility)) ? 'visible' : 'hidden';
	}
}, true);

// additional shortcuts
var $T = $D.toggle,
    $V = $D.visibility;

