/**
 *	Copyright (c) 2007, Matt Snider, LLC All rights reserved.
 *	Version: 1.0
 */

/**
 *  The Form Object manages DOM Form manipulation.
 *  @namespace Core.Util
 *  @class Form
 *  @dependencies Core, Dom
 */
Core.Util.Form = (function() {

    var F = function() {},
        that = null;

    // static methods and variables
	F.prototype = {

		/**
		 * Retrieves the first non-hidden element of the form.
		 * @method findFirstElement
	     * @param form {Element} Required. Pointer or string reference to DOM element to search.
		 * @param iTypes {Array} Optional. An array of input types to ignore; default is 'hidden'.
		 * @return {Element} The first field not of the ignored types or NULL.
		 * @static
		 */
		findFirstElement: function(form, iTypes) {
			var field = null;

			that.getElements(form, iTypes).batch(function(fld) {
				field = fld;
				return true;
			});

			return field;
		},

		/**
		 * Retrieves the first non-hidden element of the form and focuses on it.
		 * @method focusFirstElement
	     * @param form {Element} Required. Pointer or string reference to DOM element to search.
		 * @param iTypes {Array} Optional. An array of input types to ignore; default is 'hidden'.
		 * @static
		 */
		focusFirstElement: function(elem, iTypes) {
			var form = $(elem);
			that.Element.activate(that.findFirstElement(form, iTypes || ['hidden']));
		},

		/**
		 * Retrieves all serializable elements of the form; sorts them top to bottom, left to right by defualt.
		 * @method focusFirstElement
	     * @param elem {Element} Required. The pointer or string reference to DOM Form element.
		 * @param iTypes {Array} Optional. List of element types to ignore; default is hidden.
		 * @return {Array} A collection of Form fields.
		 * @static
		 */
		getElements: function(elem, iTypes) {
			var form = $(elem),
				set = [];

			if (! form) {return set;}
			if (! Array.is(iTypes)) {iTypes = [];}

			// should be redefined each time, because of closure on 'set'
			var fn = function(nodes) {
				for (var i = 0; i < nodes.length; i += 1) {
					var fld = nodes[i];

					if ($D.isNodeOfTagName(fld, 'input', 'select', 'textarea') && ! iTypes.contains(that.Element.getType(fld))) {
						set.push(fld);
					}
					else if (fld.childNodes.length) {
						fn(fld.childNodes);
					}
				}
			};

			fn(form.childNodes);

			return set;
		},

		/**
		 * Retrieves all input elements of the form with typeName and/or name.
		 * @method getElementsByName
	     * @param elem {htmlelement} pointer or string reference to DOM Form element to search fields of
		 * @param typeName {string}	the type of input elements you want
		 * @param name {string}	the name of input elements you want
		 * @param multi {boolean} do mulitple elements have this name
		 * @static
		 */
		getInputs: function(elem, typeName, name, multi) {
			var form = $(elem);
			if (! multi && name && form[name]) {return [form[name]];} // fast return for DOM compliant browsers, when name is provided
			var fields = $D.getElementsByTagName('input', form);

			if (! String.is(typeName) && ! String.is(name)) {return fields;}

			var matches = [];
			fields.batch(function(fld) {
				if ((typeName && that.Element.getType(fld) !== typeName) || (name && fld.name !== name)) {return;}
				matches.push(fld);
			});

			return matches;
		},

		/**
		 * Serializes the form into a query string, collection &key=value pairs.
		 * @method serialize
	     * @param form {Element} Required. The pointer or string reference to DOM Form element.
	     * @return {String} The serialized form.
		 * @static
		 */
		serialize: function(form) {
			var queryComponents = [];

			that.getElements(form).batch(function(fld) {
				var qc = that.Element.serialize(fld);
				if (qc) {queryComponents.push(qc);}
			});

			return queryComponents.join('&');
		}
	};

    that = new F();
    return that;
})();


// shortcuts
var $F = Core.Util.Form;/**
 * These Form utility functions are thanks in a large part to the Prototype group. I have modified them to improve
 * 	performance, remove redundancy, and get rid of the magic array crap. Use these functions to work with forms fields.
 *
 * @namespace Core.Util.Form
 * @class Element
 * @dependencies Core, Dom, Event
 */
$F.Element = (function() {

	// Module Private Variables

	var F = function() {},
		that = null;


	// Public Methods and Variables

	F.prototype = {

		/**
		 * Focuses on the elements or tries to select it, if function is supported.
		 * @method activate
		 * @param elem {Element} Required. Pointer or string reference to DOM element to activate.
		 * @param noSelect {Boolean} Optional. When true, input text is not selected; default is falsy.
		 * @return {Element} Activated DOM node for convenience.
		 * @static
		 */
		activate: function(elem, noSelect) {
			var node = $D.get(elem),
				dim = $D.getDimensions(node);

			// element only has dimensions when it is visible
			if ('hidden' !== node.type && (dim.x || dim.y || dim.width || dim.height)) {
				setTimeout(function() {node.focus();}, 1);
				if (isType(node.select, 'function') && ! noSelect) {setTimeout(function() {node.select();}, 1);}
			}

			return node;
		},

		/**
		 * Updates the onblur and onclick events of the element to show default text.
		 * @method onFocusAndBlur
		 * @param elem {Element} Required. Pointer or string reference to DOM element to attach events to.
		 * @param text {String} Required. The default text.
		 * @param c {String} Optional. The color to set default text to.
		 * @static
		 */
		attachFocusAndBlur: function(elem, text, c) {
			var fld = $(elem);

			// validate
			if (! fld) {return;}
			else if ('text' !== that.getType(fld) && 'textarea' !== that.getType(fld)) {
				throw('Core.Util.Form.Element.attachFocusAndBlur() Exception - invalid field type for type: ' + that.getType(fld));
			}

			var form = $D.getParent(fld, 'form'),
                color = c || '#999',
				oColor = fld.style.color || '#000';

            text = text.trim();

            // function that resets to the default
			var update = function(fld, text, color) {
				fld.value = text;
				fld.style.color = color;
			};

            var onfocus = function(e, fld) {
				if (e && text === that.getValue(fld).trim()) {
                    update(fld, '', oColor);
				}
			};

            // on focus clear value if equal to default
			$E.on(fld, $E.FOCUS, onfocus, fld);

			// onblur reset default if no value entered
			$E.on(fld, $E.BLUR, function(e, fld) {
				if (e && ! that.getValue(fld).trim()) {update(fld, text, color);}
			}, fld);

            // input is inside a form, don't submit default values
            if (form) {
                $E.on(form, $E.SUBMIT, onfocus, fld);
            }

            // update the initial state if needed
			var val = that.getValue(fld).trim();
			if (text === val || '' === val) {update(fld, text, color);}
		},

        /**
         * Short-cut method to do a browser safe check on any HTMLInputElement of type checkbox (possibly radio too).
         * @method check
         * @param elem {Element} Required. Pointer or string reference to checkable DOM element.
         * @param fl {Boolean} True when checkbox should be checked.
         * @static
         */
        check: function(elem, fl) {
            var node = $D.get(elem);
            // if this check isn't in place Safari & Opera will check false
            if (node.checked !== fl) {
                node.checked = fl;
                node.setAttribute('checked', fl);
                // required for Safari
                node.value = fl ? 'on' : 'off';
            }
        },
		
		/**
		 * Resets the value of the field.
		 * @method clear
		 * @param elem {Element} Required. Pointer or string reference to DOM element to clear.
		 * @static
		 */
		clear: function(elem) {
			var fld = $(elem);
			fld.value = '';
			if (fld.checked) {fld.checked = false;}
			else if (fld.selectedIndex) {fld.selectedIndex = 0;}
		},

		/**
		 * Disables the value of the field.
		 * @method disable
		 * @param elem {Element} Required. Pointer or string reference to DOM element to disable.
		 * @static
		 */
		disable: function(elem) {
			var fld = $(elem);
			$D.addClass(fld, 'disabled');
			fld.disabled = 'true';
		},

		/**
		 * Enables the value of the field.
		 * @method enable
		 * @param elem {Element} Required. Pointer or string reference to DOM element to enable.
		 * @static
		 */
		enable: function(elem) {
			var fld = $(elem);
			fld.disabled = '';
			$D.removeClass(fld, 'disabled');
		},
		
		/**
		 * Attempt to find the type attribute of the element.
		 * @method getType
		 * @param elem {Element} Required. Pointer or string reference to DOM element to evaluate.
		 * @return {String} The type or empty string.
		 * @static
		 */
		getType: function(elem) {
			var fld = $(elem);
			if (! fld || ! fld.getAttribute) {return '';}
			return ('' + (fld.type || fld.getAttribute('type'))).toLowerCase();
		},

		/**
		 * Attempt to find the value of field.
		 * @method getValue
		 * @param elem {Element} Required. Pointer or string reference to DOM element to evaluate.
		 * @return {String} The field value or empty string.
		 * @static
		 */
		getValue: function(elem) {
			var fld = $(elem);

			// This is the most common error when serializing, so I have added debug alert
			if (! fld || ! fld.tagName) {return '';}

			var method = fld.tagName.toLowerCase(),
				parameter = that.Serializers[method](fld);
			if (parameter) {return parameter[1];}
		},

		/**
		 * Tests if the field has a value.
		 * @method isSet
		 * @param elem {Element} Required. Pointer or string reference to DOM element to evaluate.
	     * @return {Boolean} True, when field is empty or non-existing.
		 * @static
		 */
		isSet: function(elem) {
			return '' !== that.getValue(elem);
		},

		/**
		 * Tests if the field is of one of the provided types.
		 * @method isType
		 * @param elem {Element} Required. Pointer or string reference to DOM element to evaluate.
		 * @param arg1 {String} Required. An input type to test.
		 * @param argX {String} Optional. Any number of additional input types to test.
	     * @return {Boolean} True, when input matches provided type.
		 * @static
		 */
        isType: function(elem/*, arg1, arg2, ...*/) {
			var type = that.getType(elem);
            if (! type) {return false;}

            for (var i = 1; i < arguments.length; i += 1) {
                if (type === arguments[i]) {return true;}
            }
            
            return false;
        },

        /**
		 * Serializes the form into a key value pair query string.
		 * @method serialize
		 * @param elem {Element} Required. Pointer or string reference to DOM element to evaluate.
	     * @return {string} the key/value pairs as a query string.
		 * @static
		 */
		serialize: function(elem) {
			var fld = $(elem);

			//	missing element is the most common error when serializing; also don't serialize validators
			if (! fld || ! fld.tagName || 'validator' === fld.name) {return '';}

			var method = fld.tagName.toLowerCase(),
				parameter = that.Serializers[method](fld);

			if (parameter) {
				var key = encodeURIComponent(parameter[0]);
				if (0 === key.length) {return '';}
				if (! isType(parameter[1], 'array')) {parameter[1] = [parameter[1]];}

				$A(parameter[1]).batch(function(value, i) {
					parameter[1][i] = key + '=' + encodeURIComponent(value);
				});

				return parameter[1].join('&');
			}
		}
	};

	that = new F();
	return that;
})();

// shortcut
var $FE = $F.Element;
var $FEV = $FE.getValue;/**
 * These Form utility functions are thanks in a large part to the Prototype group. I have modified them to improve
 * 	performance, remove redundancy, and get rid of the magic array crap.
 *
 * @namespace Core.Util.Form.Element
 * @class Serializers
 * @dependencies Core, Dom
 */
$FE.Serializers = {
	input: function(element) {		
		switch ($FE.getType(element)) {
			case 'checkbox':
			case 'radio':
				return $FE.Serializers.inputSelector(element);
			default:
				return $FE.Serializers.textarea(element);
		}
	},

	inputSelector: function(element) {
		if (element.checked) {
			return [element.name, element.value];
		}
	},

	textarea: function(element) {
		return [element.name, element.value];
	},

	select: function(element) {
		return $FE.Serializers['select-one' === $FE.getType(element) ? 'selectOne' : 'selectMany'](element);
	},

	selectOne: function(element) {
		var value = '', opt, index = element.selectedIndex;
		if (0 <= index) {
			opt = element.options[index];
			value = opt.value || opt.text;
		}
		return [element.name, value];
	},

	selectMany: function(element) {
		var value = [];

		for (var i = 0; i < element.length; i += 1) {
			var opt = element.options[i];
			if (opt.selected) {
				value.push(opt.value || opt.text);
			}
		}
		
		return [element.name, value];
	}
};