/**
 * Copyright (c) 2008, Matt Snider, LLC. All rights reserved.
 * Version: 1
 */

/**
 * Creates the Event namespace that extends the YAHOO.util.Event with custom variables and functions. All the event constants are attached
 *  directly to the Event Object, while KEY constants are attached to the Event.KEY namespace (and are linked to YUI constants). Other
 *  event shortcuts have been added to extend the YUI features.
 *  Note: Event.element will only search the DOM for parameters tagName and className, when Dom.js has been included in JS library.
 * @class Event
 * @namespace Core.Util
 * @dependencies YAHOO.util.Event, Core
 */
Core.Util.Event = YAHOO.util.Event;
var Event = Core.Util.Event,
    $E = Event;

$E.stop = $E.stopEvent;

/**
 * Removes an event listener.
 * @method off
 * @param el {String|HTMLElement|Array|NodeList} Required. An id, an element reference, or a collection of ids and/or elements to remove the listener from.
 * @param sType {String} Required. The type of event to remove.
 * @param fn {Function} Optional. The method the event invokes. If fn is undefined, then all event handlers for the type of event are removed.
 * @return {Boolean} True if the unbind was successful, false otherwise.
 * @static
 * @see Event.removeListener
 */
Event.off = Event.removeListener;

YAHOO.lang.augmentObject(Event, {

	/**
	 * The Event name constant for listening to "blur" JavaScript events.
	 * @property BLUR
	 * @type {String}
	 * @const
	 * @static
	 */
	BLUR: 'blur',

	/**
	 * The Event name constant for listening to "change" JavaScript events.
	 * @property CHANGE
	 * @type {String}
	 * @const
	 * @static
	 */
	CHANGE: 'change',

	/**
	 * The Event name constant for listening to "click" JavaScript events.
	 * @property CLICK
	 * @type {String}
	 * @const
	 * @static
	 */
	CLICK: 'click',

	/**
	 * The Event name constant for listening to "focus" JavaScript events.
	 * @property FOCUS
	 * @type {String}
	 * @const
	 * @static
	 */
	FOCUS: 'focus',

	/**
	 * The Event name constant for listening to "change" CustomEvent events.
	 * @property FONT_RESIZE
	 * @type {String}
	 * @const
	 * @static
	 */
	FONT_RESIZE: 'fontResize',

	/**
	 * The Event name constant for listening to "keypress" JavaScript events. Not supported by all browsers, DON'T USE.
	 * @property KEY_PRESS
	 * @type {String}
	 * @const
	 * @static
	 * @depreciated
	 */
	KEY_PRESS: 'keypress',

	/**
	 * The Event name constant for listening to "keydown" JavaScript events.
	 * @property KEY_DOWN
	 * @type {String}
	 * @const
	 * @static
	 */
	KEY_DOWN: 'keydown',

	/**
	 * The Event name constant for listening to "keyup" JavaScript events.
	 * @property KEY_UP
	 * @type {String}
	 * @const
	 * @static
	 */
	KEY_UP: 'keyup',

	/**
	 * The Event name constant for listening to "load" JavaScript events.
	 * @property LOAD
	 * @type {String}
	 * @const
	 * @static
	 */
	LOAD: 'load',

	/**
	 * The Event name constant for listening to "dblclick" JavaScript events.
	 * @property MOUSE_DBL_CLICK
	 * @type {String}
	 * @const
	 * @static
	 */
	MOUSE_DBL_CLICK: 'dblclick',

	/**
	 * The Event name constant for listening to "mousedown" JavaScript events.
	 * @property MOUSE_DOWN
	 * @type {String}
	 * @const
	 * @static
	 */
	MOUSE_DOWN: 'mousedown', // cannot use with Event.stop()

	/**
	 * The Event name constant for listening to "mousemove" JavaScript events.
	 * @property MOUSE_MOVE
	 * @type {String}
	 * @const
	 * @static
	 */
	MOUSE_MOVE: 'mousemove',

	/**
	 * The Event name constant for listening to "mouseover" JavaScript events.
	 * @property MOUSE_OVER
	 * @type {String}
	 * @const
	 * @static
	 */
	MOUSE_OVER: 'mouseover',

	/**
	 * The Event name constant for listening to "mouseout" JavaScript events.
	 * @property MOUSE_OUT
	 * @type {String}
	 * @const
	 * @static
	 */
	MOUSE_OUT: 'mouseout',

	/**
	 * The Event name constant for listening to "mouseup" JavaScript events.
	 * @property MOUSE_UP
	 * @type {String}
	 * @const
	 * @static
	 */
	MOUSE_UP: 'mouseup',

	/**
	 * The Event name constant for listening to "scroll" JavaScript events.
	 * @property SCROLL
	 * @type {String}
	 * @const
	 * @static
	 */
	SCROLL: 'scroll',

	/**
	 * The Event name constant for listening to "submit" JavaScript events.
	 * @property SUBMIT
	 * @type {String}
	 * @const
	 * @static
	 */
	SUBMIT: 'submit',

	/**
	 * The Event name constant for listening to "unload" JavaScript events.
	 * @property UNLOAD
	 * @type {String}
	 * @const
	 * @static
	 */
	UNLOAD: 'unload',

	/**
	 * The Event name constant for listening to "windowResize" JavaScript events.
	 * @property WINDOW_RESIZE
	 * @type {String}
	 * @const
	 * @static
	 */
	WINDOW_RESIZE: 'windowResize',

	/**
	 * A collection of key codes, copied from YUI KeyListener.
	 * @property KEY
	 * @type {Number}
	 * @const
	 * @static
	 */
	KEY: YAHOO.util.KeyListener.KEY,

	/**
	 * Adds a listener to input that checks keydown events for keycode, then calls the appropriately scoped function, passing the event.
	 * @method addKeystrokeListener
	 * @param keycodes {Array} Required. A collection of desired keycodes.
	 * @param input {Element} Required. Pointer or string reference to DOM input element to listen on.
	 * @param func {Function} Required. The callback function.
	 * @param scope {Object} Optional. The execution scope of callback function.
	 * @static
	 */
	addKeystrokeListener: function(keycodes, input, func, scope) {
		var node = YAHOO.util.Dom.get(input),
			keymap = {};

		if (! scope) {scope = window;}

		// iterate on the keycodes and create a map for quick reference in keydown listener
		for (var i = 0; keycodes.length > i; i += 1) {
			keymap[keycodes[i]] = true;
		}

		Event.addListener(node, Event.KEY_DOWN, function(e) {
			if (keymap[Event.getCharCode(e)]) {func.call(scope, e);}
		}, scope, true);
	},

	/**
	 * Adds a listener to input that checks keypress events for enter, then
	 *  calls the appropriate function or method. (pass the window into obj for functions).
	 * @method addEnterListener
	 * @param input {Element} Required. Pointer or string reference to DOM input element to listen on.
	 * @param func {Function} Required. The callback function.
	 * @param scope {Object} Optional. The execution scope of callback function.
	 * @static
	 */
	addEnterListener: function(input, func, scope) {
		Event.addKeystrokeListener([Event.KEY.ENTER], input, func, scope);
	},

	/**
	 * Adds a listener to input that checks keypress events for escape, then
	 *  calls the appropriate function or method. (pass the window into obj for functions).
	 * @method addEscapeListener
	 * @param input {Element} Required. Pointer or string reference to DOM input element to listen on.
	 * @param func {Function} Required. The callback function.
	 * @param scope {Object} Optional. The execution scope of callback function.
	 * @static
	 */
	addEscapeListener: function(input, func, scope) {
		Event.addKeystrokeListener([Event.KEY.ESCAPE], input, func, scope);
	},

	/**
	 * Overload the prototype Event.element function for extra browser support. X-browser event target retrieval.
	 * @method element
	 * @param evt {Event} Required. The triggered JavaScript event.
	 * @param tagName {String} Optional. The DOM node tag name to match.
	 * @param className {String} Optional. The DOM node attribute class name to match.
	 * @return {Element} A pointer to a DOM element or null.
	 * @static
	 */
	element: function(evt, tagName, className) {
		var targ = Event.getTarget(evt);
		if ((tagName || className) && $D && $D.getParent) {targ = $D.getParent(targ, tagName, className);}
		return targ;
	},

	/**
	 * Retrieves the {x, y} coordinates of an event.
	 * @method getMousePosition
	 * @param e {Event} Required. The triggered JavaScript event; any mouse event.
	 * @return {Object} Where x = x coordinate and y = y coordinate of event.
	 * @static
	 */
	getMousePosition: function(e) {
		return {x:Event.getPageX(e), y:Event.getPageY(e)};
	}
}, true);

/**
 * Copyright (c) 2008, Matt Snider, LLC. All rights reserved.
 * Version: 1
 */

/**
 * The EventDispatcher class dispatches events for an entire page, using .
 * @namespace Core.Util
 * @class EventDispatcher
 * @dependencies yahoo-dom-event.js
 */
Core.Util.EventDispatcher = (function() {
    // local variables
    var callbackMap = {},
        doc = document,
        F = function() {},
        rx = /\bcom_\w+\b/g,
        that = null,
        YUE = YAHOO.util.Event;

    // event namespace
    var E = {

        /**
         * The generic event dispatcher callback.
         * @method dispatcher
         * @param e {Event} Required. The triggered JavaScript event.
         * @private
         */
        dispatcher: function(e) {
            var node = YUE.getTarget(e);

            // simulate bubbling
            while (node && node !== doc) {
                var coms = node.className.match(rx);

                // not matched
                if (null === coms) {
                    // not found, do nothing for now
                }
                // command class exists
                else {
                    var i = 0, j = 0;

                    // iterate on matching commands
                    for (; i < coms.length; i += 1) {
                        var id = coms[i].replace(/com_/, ''),
                            carr = callbackMap[e.type][id];

                        // object for command exists, command could be for another event
                        if (carr && carr.length) {
                            // iterate on command callbacks
                            for (j = 0; j < carr.length; j += 1) {
                                var o = carr[j],
                                    args = [e];

                                if (o.eventFx) {o.eventFx(e);} // event stop events
                                o.callback.apply(o.scope, args.concat(o.arguments));
                            }
                        }
                    }
                }

                node = node.parentNode;
            }
        }
    };

   // public interface
    F.prototype = {

        /**
         * Method to register an event on the document.
         * @method register
         * @param type {String} Required. The event type (ie. 'click').
         * @param o {Object} Required. The event data.
         * @static
         */
        register: function(type, o) {
            // check for required
            if (! (type && o && o.id && o.callback)) {
                alert('Invalid regristration to EventDispatcher - missing required value, see source code.');
            }

            // allows for lazy-loading of events
            if (! callbackMap[type]) {
                callbackMap[type] = {};
                YUE.on(doc, type, E.dispatcher);
            }

            if (! callbackMap[type][o.id]) {callbackMap[type][o.id] = [];}
            if (! o.scope) {o.scope = window;}
            if (! o.arguments) {o.arguments = [];}
            if (! YAHOO.lang.isArray(o.arguments)) {o.arguments = [o.arguments];} // support arguments that are non arrays
            callbackMap[type][o.id].push(o);
        },

        /**
         * Call this method to register an event the first time that ID is provided, and not subsequent times.
         * @method registerOnce
         * @param type {String} Required. The event type (ie. 'click').
         * @param o {Object} Required. The event data.
         * @static
         */
        registerOnce: function(type, o) {
            if (! (callbackMap[type] || callbackMap[type][o.id])) {
                register(type, o);
            }
        }
    };

    that = new F();
    return that;
})();