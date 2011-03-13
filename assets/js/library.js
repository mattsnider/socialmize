/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
/**
 * The YAHOO object is the single global object used by YUI Library.  It
 * contains utility function for setting up namespaces, inheritance, and
 * logging.  YAHOO.util, YAHOO.widget, and YAHOO.example are namespaces
 * created automatically for and used by the library.
 * @module yahoo
 * @title  YAHOO Global
 */

/**
 * YAHOO_config is not included as part of the library.  Instead it is an 
 * object that can be defined by the implementer immediately before 
 * including the YUI library.  The properties included in this object
 * will be used to configure global properties needed as soon as the 
 * library begins to load.
 * @class YAHOO_config
 * @static
 */

/**
 * A reference to a function that will be executed every time a YAHOO module
 * is loaded.  As parameter, this function will receive the version
 * information for the module. See <a href="YAHOO.env.html#getVersion">
 * YAHOO.env.getVersion</a> for the description of the version data structure.
 * @property listener
 * @type Function
 * @static
 * @default undefined
 */

/**
 * Set to true if the library will be dynamically loaded after window.onload.
 * Defaults to false 
 * @property injecting
 * @type boolean
 * @static
 * @default undefined
 */

/**
 * Instructs the yuiloader component to dynamically load yui components and
 * their dependencies.  See the yuiloader documentation for more information
 * about dynamic loading
 * @property load
 * @static
 * @default undefined
 * @see yuiloader
 */

/**
 * Forces the use of the supplied locale where applicable in the library
 * @property locale
 * @type string
 * @static
 * @default undefined
 */

if (typeof YAHOO == "undefined" || !YAHOO) {
    /**
     * The YAHOO global namespace object.  If YAHOO is already defined, the
     * existing YAHOO object will not be overwritten so that defined
     * namespaces are preserved.
     * @class YAHOO
     * @static
     */
    var YAHOO = {};
}

/**
 * Returns the namespace specified and creates it if it doesn't exist
 * <pre>
 * YAHOO.namespace("property.package");
 * YAHOO.namespace("YAHOO.property.package");
 * </pre>
 * Either of the above would create YAHOO.property, then
 * YAHOO.property.package
 *
 * Be careful when naming packages. Reserved words may work in some browsers
 * and not others. For instance, the following will fail in Safari:
 * <pre>
 * YAHOO.namespace("really.long.nested.namespace");
 * </pre>
 * This fails because "long" is a future reserved word in ECMAScript
 *
 * For implementation code that uses YUI, do not create your components
 * in the namespaces created by the library.  defined by YUI -- create 
 * your own (YAHOO.util, YAHOO.widget, YAHOO.lang, YAHOO.env)
 *
 * @method namespace
 * @static
 * @param  {String*} arguments 1-n namespaces to create 
 * @return {Object}  A reference to the last namespace object created
 */
YAHOO.namespace = function() {
    var a=arguments, o=null, i, j, d;
    for (i=0; i<a.length; i=i+1) {
        d=(""+a[i]).split(".");
        o=YAHOO;

        // YAHOO is implied, so it is ignored if it is included
        for (j=(d[0] == "YAHOO") ? 1 : 0; j<d.length; j=j+1) {
            o[d[j]]=o[d[j]] || {};
            o=o[d[j]];
        }
    }

    return o;
};

/**
 * Uses YAHOO.widget.Logger to output a log message, if the widget is
 * available.
 *
 * @method log
 * @static
 * @param  {String}  msg  The message to log.
 * @param  {String}  cat  The log category for the message.  Default
 *                        categories are "info", "warn", "error", time".
 *                        Custom categories can be used as well. (opt)
 * @param  {String}  src  The source of the the message (opt)
 * @return {Boolean}      True if the log operation was successful.
 */
YAHOO.log = function(msg, cat, src) {
    var l=YAHOO.widget.Logger;
    if(l && l.log) {
        return l.log(msg, cat, src);
    } else {
        return false;
    }
};

/**
 * Registers a module with the YAHOO object
 * @method register
 * @static
 * @param {String}   name    the name of the module (event, slider, etc)
 * @param {Function} mainClass a reference to class in the module.  This
 *                             class will be tagged with the version info
 *                             so that it will be possible to identify the
 *                             version that is in use when multiple versions
 *                             have loaded
 * @param {Object}   data      metadata object for the module.  Currently it
 *                             is expected to contain a "version" property
 *                             and a "build" property at minimum.
 */
YAHOO.register = function(name, mainClass, data) {
    var mods = YAHOO.env.modules, m, v, b, ls, i;

    if (!mods[name]) {
        mods[name] = { 
            versions:[], 
            builds:[] 
        };
    }

    m  = mods[name];
    v  = data.version;
    b  = data.build;
    ls = YAHOO.env.listeners;

    m.name = name;
    m.version = v;
    m.build = b;
    m.versions.push(v);
    m.builds.push(b);
    m.mainClass = mainClass;

    // fire the module load listeners
    for (i=0;i<ls.length;i=i+1) {
        ls[i](m);
    }
    // label the main class
    if (mainClass) {
        mainClass.VERSION = v;
        mainClass.BUILD = b;
    } else {
        YAHOO.log("mainClass is undefined for module " + name, "warn");
    }
};

/**
 * YAHOO.env is used to keep track of what is known about the YUI library and
 * the browsing environment
 * @class YAHOO.env
 * @static
 */
YAHOO.env = YAHOO.env || {

    /**
     * Keeps the version info for all YUI modules that have reported themselves
     * @property modules
     * @type Object[]
     */
    modules: [],
    
    /**
     * List of functions that should be executed every time a YUI module
     * reports itself.
     * @property listeners
     * @type Function[]
     */
    listeners: []
};

/**
 * Returns the version data for the specified module:
 *      <dl>
 *      <dt>name:</dt>      <dd>The name of the module</dd>
 *      <dt>version:</dt>   <dd>The version in use</dd>
 *      <dt>build:</dt>     <dd>The build number in use</dd>
 *      <dt>versions:</dt>  <dd>All versions that were registered</dd>
 *      <dt>builds:</dt>    <dd>All builds that were registered.</dd>
 *      <dt>mainClass:</dt> <dd>An object that was was stamped with the
 *                 current version and build. If 
 *                 mainClass.VERSION != version or mainClass.BUILD != build,
 *                 multiple versions of pieces of the library have been
 *                 loaded, potentially causing issues.</dd>
 *       </dl>
 *
 * @method getVersion
 * @static
 * @param {String}  name the name of the module (event, slider, etc)
 * @return {Object} The version info
 */
YAHOO.env.getVersion = function(name) {
    return YAHOO.env.modules[name] || null;
};

/**
 * Do not fork for a browser if it can be avoided.  Use feature detection when
 * you can.  Use the user agent as a last resort.  YAHOO.env.ua stores a version
 * number for the browser engine, 0 otherwise.  This value may or may not map
 * to the version number of the browser using the engine.  The value is 
 * presented as a float so that it can easily be used for boolean evaluation 
 * as well as for looking for a particular range of versions.  Because of this, 
 * some of the granularity of the version info may be lost (e.g., Gecko 1.8.0.9 
 * reports 1.8).
 * @class YAHOO.env.ua
 * @static
 */
YAHOO.env.ua = function() {
    var o={

        /**
         * Internet Explorer version number or 0.  Example: 6
         * @property ie
         * @type float
         */
        ie:0,

        /**
         * Opera version number or 0.  Example: 9.2
         * @property opera
         * @type float
         */
        opera:0,

        /**
         * Gecko engine revision number.  Will evaluate to 1 if Gecko 
         * is detected but the revision could not be found. Other browsers
         * will be 0.  Example: 1.8
         * <pre>
         * Firefox 1.0.0.4: 1.7.8   <-- Reports 1.7
         * Firefox 1.5.0.9: 1.8.0.9 <-- Reports 1.8
         * Firefox 2.0.0.3: 1.8.1.3 <-- Reports 1.8
         * Firefox 3 alpha: 1.9a4   <-- Reports 1.9
         * </pre>
         * @property gecko
         * @type float
         */
        gecko:0,

        /**
         * AppleWebKit version.  KHTML browsers that are not WebKit browsers 
         * will evaluate to 1, other browsers 0.  Example: 418.9.1
         * <pre>
         * Safari 1.3.2 (312.6): 312.8.1 <-- Reports 312.8 -- currently the 
         *                                   latest available for Mac OSX 10.3.
         * Safari 2.0.2:         416     <-- hasOwnProperty introduced
         * Safari 2.0.4:         418     <-- preventDefault fixed
         * Safari 2.0.4 (419.3): 418.9.1 <-- One version of Safari may run
         *                                   different versions of webkit
         * Safari 2.0.4 (419.3): 419     <-- Tiger installations that have been
         *                                   updated, but not updated
         *                                   to the latest patch.
         * Webkit 212 nightly:   522+    <-- Safari 3.0 precursor (with native SVG
         *                                   and many major issues fixed).  
         * 3.x yahoo.com, flickr:422     <-- Safari 3.x hacks the user agent
         *                                   string when hitting yahoo.com and 
         *                                   flickr.com.
         * Safari 3.0.4 (523.12):523.12  <-- First Tiger release - automatic update
         *                                   from 2.x via the 10.4.11 OS patch
         * Webkit nightly 1/2008:525+    <-- Supports DOMContentLoaded event.
         *                                   yahoo.com user agent hack removed.
         *                                   
         * </pre>
         * http://developer.apple.com/internet/safari/uamatrix.html
         * @property webkit
         * @type float
         */
        webkit: 0,

        /**
         * The mobile property will be set to a string containing any relevant
         * user agent information when a modern mobile browser is detected.
         * Currently limited to Safari on the iPhone/iPod Touch, Nokia N-series
         * devices with the WebKit-based browser, and Opera Mini.  
         * @property mobile 
         * @type string
         */
        mobile: null,

        /**
         * Adobe AIR version number or 0.  Only populated if webkit is detected.
         * Example: 1.0
         * @property air
         * @type float
         */
        air: 0,

        /**
         * Google Caja version number or 0.
         * @property caja
         * @type float
         */
        caja: 0

    },

    ua = navigator.userAgent, 
    
    m;

    // Modern KHTML browsers should qualify as Safari X-Grade
    if ((/KHTML/).test(ua)) {
        o.webkit=1;
    }
    // Modern WebKit browsers are at least X-Grade
    m=ua.match(/AppleWebKit\/([^\s]*)/);
    if (m&&m[1]) {
        o.webkit=parseFloat(m[1]);

        // Mobile browser check
        if (/ Mobile\//.test(ua)) {
            o.mobile = "Apple"; // iPhone or iPod Touch
        } else {
            m=ua.match(/NokiaN[^\/]*/);
            if (m) {
                o.mobile = m[0]; // Nokia N-series, ex: NokiaN95
            }
        }

        m=ua.match(/AdobeAIR\/([^\s]*)/);
        if (m) {
            o.air = m[0]; // Adobe AIR 1.0 or better
        }

    }

    if (!o.webkit) { // not webkit
        // @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316; fi; U; ssr)
        m=ua.match(/Opera[\s\/]([^\s]*)/);
        if (m&&m[1]) {
            o.opera=parseFloat(m[1]);
            m=ua.match(/Opera Mini[^;]*/);
            if (m) {
                o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
            }
        } else { // not opera or webkit
            m=ua.match(/MSIE\s([^;]*)/);
            if (m&&m[1]) {
                o.ie=parseFloat(m[1]);
            } else { // not opera, webkit, or ie
                m=ua.match(/Gecko\/([^\s]*)/);
                if (m) {
                    o.gecko=1; // Gecko detected, look for revision
                    m=ua.match(/rv:([^\s\)]*)/);
                    if (m&&m[1]) {
                        o.gecko=parseFloat(m[1]);
                    }
                }
            }
        }
    }

    m=ua.match(/Caja\/([^\s]*)/);
    if (m&&m[1]) {
        o.caja=parseFloat(m[1]);
    }
    
    return o;
}();

/*
 * Initializes the global by creating the default namespaces and applying
 * any new configuration information that is detected.  This is the setup
 * for env.
 * @method init
 * @static
 * @private
 */
(function() {
    YAHOO.namespace("util", "widget", "example");
    /*global YAHOO_config*/
    if ("undefined" !== typeof YAHOO_config) {
        var l=YAHOO_config.listener,ls=YAHOO.env.listeners,unique=true,i;
        if (l) {
            // if YAHOO is loaded multiple times we need to check to see if
            // this is a new config object.  If it is, add the new component
            // load listener to the stack
            for (i=0;i<ls.length;i=i+1) {
                if (ls[i]==l) {
                    unique=false;
                    break;
                }
            }
            if (unique) {
                ls.push(l);
            }
        }
    }
})();
/**
 * Provides the language utilites and extensions used by the library
 * @class YAHOO.lang
 */
YAHOO.lang = YAHOO.lang || {};

(function() {


var L = YAHOO.lang,

    ARRAY_TOSTRING = '[object Array]',
    FUNCTION_TOSTRING = '[object Function]',
    OP = Object.prototype,

    // ADD = ["toString", "valueOf", "hasOwnProperty"],
    ADD = ["toString", "valueOf"],

    OB = {

    /**
     * Determines wheather or not the provided object is an array.
     * @method isArray
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isArray: function(o) { 
        return OP.toString.apply(o) === ARRAY_TOSTRING;
    },

    /**
     * Determines whether or not the provided object is a boolean
     * @method isBoolean
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isBoolean: function(o) {
        return typeof o === 'boolean';
    },
    
    /**
     * Determines whether or not the provided object is a function.
     * Note: Internet Explorer thinks certain functions are objects:
     *
     * var obj = document.createElement("object");
     * YAHOO.lang.isFunction(obj.getAttribute) // reports false in IE
     *
     * var input = document.createElement("input"); // append to body
     * YAHOO.lang.isFunction(input.focus) // reports false in IE
     *
     * You will have to implement additional tests if these functions
     * matter to you.
     *
     * @method isFunction
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isFunction: function(o) {
        return OP.toString.apply(o) === FUNCTION_TOSTRING;
    },
        
    /**
     * Determines whether or not the provided object is null
     * @method isNull
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isNull: function(o) {
        return o === null;
    },
        
    /**
     * Determines whether or not the provided object is a legal number
     * @method isNumber
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isNumber: function(o) {
        return typeof o === 'number' && isFinite(o);
    },
      
    /**
     * Determines whether or not the provided object is of type object
     * or function
     * @method isObject
     * @param {any} o The object being testing
     * @return {boolean} the result
     */  
    isObject: function(o) {
return (o && (typeof o === 'object' || L.isFunction(o))) || false;
    },
        
    /**
     * Determines whether or not the provided object is a string
     * @method isString
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isString: function(o) {
        return typeof o === 'string';
    },
        
    /**
     * Determines whether or not the provided object is undefined
     * @method isUndefined
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isUndefined: function(o) {
        return typeof o === 'undefined';
    },
    
 
    /**
     * IE will not enumerate native functions in a derived object even if the
     * function was overridden.  This is a workaround for specific functions 
     * we care about on the Object prototype. 
     * @property _IEEnumFix
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @static
     * @private
     */
    _IEEnumFix: (YAHOO.env.ua.ie) ? function(r, s) {
            var i, fname, f;
            for (i=0;i<ADD.length;i=i+1) {

                fname = ADD[i];
                f = s[fname];

                if (L.isFunction(f) && f!=OP[fname]) {
                    r[fname]=f;
                }
            }
    } : function(){},
       
    /**
     * Utility to set up the prototype, constructor and superclass properties to
     * support an inheritance strategy that can chain constructors and methods.
     * Static members will not be inherited.
     *
     * @method extend
     * @static
     * @param {Function} subc   the object to modify
     * @param {Function} superc the object to inherit
     * @param {Object} overrides  additional properties/methods to add to the
     *                              subclass prototype.  These will override the
     *                              matching items obtained from the superclass 
     *                              if present.
     */
    extend: function(subc, superc, overrides) {
        if (!superc||!subc) {
            throw new Error("extend failed, please check that " +
                            "all dependencies are included.");
        }
        var F = function() {}, i;
        F.prototype=superc.prototype;
        subc.prototype=new F();
        subc.prototype.constructor=subc;
        subc.superclass=superc.prototype;
        if (superc.prototype.constructor == OP.constructor) {
            superc.prototype.constructor=superc;
        }
    
        if (overrides) {
            for (i in overrides) {
                if (L.hasOwnProperty(overrides, i)) {
                    subc.prototype[i]=overrides[i];
                }
            }

            L._IEEnumFix(subc.prototype, overrides);
        }
    },
   
    /**
     * Applies all properties in the supplier to the receiver if the
     * receiver does not have these properties yet.  Optionally, one or 
     * more methods/properties can be specified (as additional 
     * parameters).  This option will overwrite the property if receiver 
     * has it already.  If true is passed as the third parameter, all 
     * properties will be applied and _will_ overwrite properties in 
     * the receiver.
     *
     * @method augmentObject
     * @static
     * @since 2.3.0
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param {String*|boolean}  arguments zero or more properties methods 
     *        to augment the receiver with.  If none specified, everything
     *        in the supplier will be used unless it would
     *        overwrite an existing property in the receiver. If true
     *        is specified as the third parameter, all properties will
     *        be applied and will overwrite an existing property in
     *        the receiver
     */
    augmentObject: function(r, s) {
        if (!s||!r) {
            throw new Error("Absorb failed, verify dependencies.");
        }
        var a=arguments, i, p, overrideList=a[2];
        if (overrideList && overrideList!==true) { // only absorb the specified properties
            for (i=2; i<a.length; i=i+1) {
                r[a[i]] = s[a[i]];
            }
        } else { // take everything, overwriting only if the third parameter is true
            for (p in s) { 
                if (overrideList || !(p in r)) {
                    r[p] = s[p];
                }
            }
            
            L._IEEnumFix(r, s);
        }
    },
 
    /**
     * Same as YAHOO.lang.augmentObject, except it only applies prototype properties
     * @see YAHOO.lang.augmentObject
     * @method augmentProto
     * @static
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param {String*|boolean}  arguments zero or more properties methods 
     *        to augment the receiver with.  If none specified, everything 
     *        in the supplier will be used unless it would overwrite an existing 
     *        property in the receiver.  if true is specified as the third 
     *        parameter, all properties will be applied and will overwrite an 
     *        existing property in the receiver
     */
    augmentProto: function(r, s) {
        if (!s||!r) {
            throw new Error("Augment failed, verify dependencies.");
        }
        //var a=[].concat(arguments);
        var a=[r.prototype,s.prototype], i;
        for (i=2;i<arguments.length;i=i+1) {
            a.push(arguments[i]);
        }
        L.augmentObject.apply(this, a);
    },

      
    /**
     * Returns a simple string representation of the object or array.
     * Other types of objects will be returned unprocessed.  Arrays
     * are expected to be indexed.  Use object notation for
     * associative arrays.
     * @method dump
     * @since 2.3.0
     * @param o {Object} The object to dump
     * @param d {int} How deep to recurse child objects, default 3
     * @return {String} the dump result
     */
    dump: function(o, d) {
        var i,len,s=[],OBJ="{...}",FUN="f(){...}",
            COMMA=', ', ARROW=' => ';

        // Cast non-objects to string
        // Skip dates because the std toString is what we want
        // Skip HTMLElement-like objects because trying to dump 
        // an element will cause an unhandled exception in FF 2.x
        if (!L.isObject(o)) {
            return o + "";
        } else if (o instanceof Date || ("nodeType" in o && "tagName" in o)) {
            return o;
        } else if  (L.isFunction(o)) {
            return FUN;
        }

        // dig into child objects the depth specifed. Default 3
        d = (L.isNumber(d)) ? d : 3;

        // arrays [1, 2, 3]
        if (L.isArray(o)) {
            s.push("[");
            for (i=0,len=o.length;i<len;i=i+1) {
                if (L.isObject(o[i])) {
                    s.push((d > 0) ? L.dump(o[i], d-1) : OBJ);
                } else {
                    s.push(o[i]);
                }
                s.push(COMMA);
            }
            if (s.length > 1) {
                s.pop();
            }
            s.push("]");
        // objects {k1 => v1, k2 => v2}
        } else {
            s.push("{");
            for (i in o) {
                if (L.hasOwnProperty(o, i)) {
                    s.push(i + ARROW);
                    if (L.isObject(o[i])) {
                        s.push((d > 0) ? L.dump(o[i], d-1) : OBJ);
                    } else {
                        s.push(o[i]);
                    }
                    s.push(COMMA);
                }
            }
            if (s.length > 1) {
                s.pop();
            }
            s.push("}");
        }

        return s.join("");
    },

    /**
     * Does variable substitution on a string. It scans through the string 
     * looking for expressions enclosed in { } braces. If an expression 
     * is found, it is used a key on the object.  If there is a space in
     * the key, the first word is used for the key and the rest is provided
     * to an optional function to be used to programatically determine the
     * value (the extra information might be used for this decision). If 
     * the value for the key in the object, or what is returned from the
     * function has a string value, number value, or object value, it is 
     * substituted for the bracket expression and it repeats.  If this
     * value is an object, it uses the Object's toString() if this has
     * been overridden, otherwise it does a shallow dump of the key/value
     * pairs.
     * @method substitute
     * @since 2.3.0
     * @param s {String} The string that will be modified.
     * @param o {Object} An object containing the replacement values
     * @param f {Function} An optional function that can be used to
     *                     process each match.  It receives the key,
     *                     value, and any extra metadata included with
     *                     the key inside of the braces.
     * @return {String} the substituted string
     */
    substitute: function (s, o, f) {
        var i, j, k, key, v, meta, saved=[], token, 
            DUMP='dump', SPACE=' ', LBRACE='{', RBRACE='}',
            dump;


        for (;;) {
            i = s.lastIndexOf(LBRACE);
            if (i < 0) {
                break;
            }
            j = s.indexOf(RBRACE, i);
            if (i + 1 >= j) {
                break;
            }

            //Extract key and meta info 
            token = s.substring(i + 1, j);
            key = token;
            meta = null;
            k = key.indexOf(SPACE);
            if (k > -1) {
                meta = key.substring(k + 1);
                key = key.substring(0, k);
            }

            // lookup the value
            v = o[key];

            // if a substitution function was provided, execute it
            if (f) {
                v = f(key, v, meta);
            }

            if (L.isObject(v)) {
                if (L.isArray(v)) {
                    v = L.dump(v, parseInt(meta, 10));
                } else {
                    meta = meta || "";

                    // look for the keyword 'dump', if found force obj dump
                    dump = meta.indexOf(DUMP);
                    if (dump > -1) {
                        meta = meta.substring(4);
                    }

                    // use the toString if it is not the Object toString 
                    // and the 'dump' meta info was not found
                    if (v.toString===OP.toString || dump>-1) {
                        v = L.dump(v, parseInt(meta, 10));
                    } else {
                        v = v.toString();
                    }
                }
            } else if (!L.isString(v) && !L.isNumber(v)) {
                // This {block} has no replace string. Save it for later.
                v = "~-" + saved.length + "-~";
                saved[saved.length] = token;

                // break;
            }

            s = s.substring(0, i) + v + s.substring(j + 1);


        }

        // restore saved {block}s
        for (i=saved.length-1; i>=0; i=i-1) {
            s = s.replace(new RegExp("~-" + i + "-~"), "{"  + saved[i] + "}", "g");
        }

        return s;
    },


    /**
     * Returns a string without any leading or trailing whitespace.  If 
     * the input is not a string, the input will be returned untouched.
     * @method trim
     * @since 2.3.0
     * @param s {string} the string to trim
     * @return {string} the trimmed string
     */
    trim: function(s){
        try {
            return s.replace(/^\s+|\s+$/g, "");
        } catch(e) {
            return s;
        }
    },

    /**
     * Returns a new object containing all of the properties of
     * all the supplied objects.  The properties from later objects
     * will overwrite those in earlier objects.
     * @method merge
     * @since 2.3.0
     * @param arguments {Object*} the objects to merge
     * @return the new merged object
     */
    merge: function() {
        var o={}, a=arguments, l=a.length, i;
        for (i=0; i<l; i=i+1) {
            L.augmentObject(o, a[i], true);
        }
        return o;
    },

    /**
     * Executes the supplied function in the context of the supplied 
     * object 'when' milliseconds later.  Executes the function a 
     * single time unless periodic is set to true.
     * @method later
     * @since 2.4.0
     * @param when {int} the number of milliseconds to wait until the fn 
     * is executed
     * @param o the context object
     * @param fn {Function|String} the function to execute or the name of 
     * the method in the 'o' object to execute
     * @param data [Array] data that is provided to the function.  This accepts
     * either a single item or an array.  If an array is provided, the
     * function is executed with one parameter for each array item.  If
     * you need to pass a single array parameter, it needs to be wrapped in
     * an array [myarray]
     * @param periodic {boolean} if true, executes continuously at supplied 
     * interval until canceled
     * @return a timer object. Call the cancel() method on this object to 
     * stop the timer.
     */
    later: function(when, o, fn, data, periodic) {
        when = when || 0; 
        o = o || {};
        var m=fn, d=data, f, r;

        if (L.isString(fn)) {
            m = o[fn];
        }

        if (!m) {
            throw new TypeError("method undefined");
        }

        if (!L.isArray(d)) {
            d = [data];
        }

        f = function() {
            m.apply(o, d);
        };

        r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

        return {
            interval: periodic,
            cancel: function() {
                if (this.interval) {
                    clearInterval(r);
                } else {
                    clearTimeout(r);
                }
            }
        };
    },
    
    /**
     * A convenience method for detecting a legitimate non-null value.
     * Returns false for null/undefined/NaN, true for other values, 
     * including 0/false/''
     * @method isValue
     * @since 2.3.0
     * @param o {any} the item to test
     * @return {boolean} true if it is not null/undefined/NaN || false
     */
    isValue: function(o) {
        // return (o || o === false || o === 0 || o === ''); // Infinity fails
return (L.isObject(o) || L.isString(o) || L.isNumber(o) || L.isBoolean(o));
    }

};

/**
 * Determines whether or not the property was added
 * to the object instance.  Returns false if the property is not present
 * in the object, or was inherited from the prototype.
 * This abstraction is provided to enable hasOwnProperty for Safari 1.3.x.
 * There is a discrepancy between YAHOO.lang.hasOwnProperty and
 * Object.prototype.hasOwnProperty when the property is a primitive added to
 * both the instance AND prototype with the same value:
 * <pre>
 * var A = function() {};
 * A.prototype.foo = 'foo';
 * var a = new A();
 * a.foo = 'foo';
 * alert(a.hasOwnProperty('foo')); // true
 * alert(YAHOO.lang.hasOwnProperty(a, 'foo')); // false when using fallback
 * </pre>
 * @method hasOwnProperty
 * @param {any} o The object being testing
 * @param prop {string} the name of the property to test
 * @return {boolean} the result
 */
L.hasOwnProperty = (OP.hasOwnProperty) ?
    function(o, prop) {
        return o && o.hasOwnProperty(prop);
    } : function(o, prop) {
        return !L.isUndefined(o[prop]) && 
                o.constructor.prototype[prop] !== o[prop];
    };

// new lang wins
OB.augmentObject(L, OB, true);

/*
 * An alias for <a href="YAHOO.lang.html">YAHOO.lang</a>
 * @class YAHOO.util.Lang
 */
YAHOO.util.Lang = L;
 
/**
 * Same as YAHOO.lang.augmentObject, except it only applies prototype 
 * properties.  This is an alias for augmentProto.
 * @see YAHOO.lang.augmentObject
 * @method augment
 * @static
 * @param {Function} r  the object to receive the augmentation
 * @param {Function} s  the object that supplies the properties to augment
 * @param {String*|boolean}  arguments zero or more properties methods to 
 *        augment the receiver with.  If none specified, everything
 *        in the supplier will be used unless it would
 *        overwrite an existing property in the receiver.  if true
 *        is specified as the third parameter, all properties will
 *        be applied and will overwrite an existing property in
 *        the receiver
 */
L.augment = L.augmentProto;

/**
 * An alias for <a href="YAHOO.lang.html#augment">YAHOO.lang.augment</a>
 * @for YAHOO
 * @method augment
 * @static
 * @param {Function} r  the object to receive the augmentation
 * @param {Function} s  the object that supplies the properties to augment
 * @param {String*}  arguments zero or more properties methods to 
 *        augment the receiver with.  If none specified, everything
 *        in the supplier will be used unless it would
 *        overwrite an existing property in the receiver
 */
YAHOO.augment = L.augmentProto;
       
/**
 * An alias for <a href="YAHOO.lang.html#extend">YAHOO.lang.extend</a>
 * @method extend
 * @static
 * @param {Function} subc   the object to modify
 * @param {Function} superc the object to inherit
 * @param {Object} overrides  additional properties/methods to add to the
 *        subclass prototype.  These will override the
 *        matching items obtained from the superclass if present.
 */
YAHOO.extend = L.extend;

})();
YAHOO.register("yahoo", YAHOO, {version: "2.7.0", build: "1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
/**
 * The dom module provides helper methods for manipulating Dom elements.
 * @module dom
 *
 */

(function() {
    YAHOO.env._id_counter = YAHOO.env._id_counter || 0;     // for use with generateId (global to save state if Dom is overwritten)

        // internal shorthand
    var Y = YAHOO.util,
        lang = YAHOO.lang,
        UA = YAHOO.env.ua,
        trim = YAHOO.lang.trim,
        propertyCache = {}, // for faster hyphen converts
        reCache = {}, // cache className regexes
        RE_TABLE = /^t(?:able|d|h)$/i, // for _calcBorders
        RE_COLOR = /color$/i,

        // DOM aliases 
        document = window.document,     
        documentElement = document.documentElement,

        // string constants
        OWNER_DOCUMENT = 'ownerDocument',
        DEFAULT_VIEW = 'defaultView',
        DOCUMENT_ELEMENT = 'documentElement',
        COMPAT_MODE = 'compatMode',
        OFFSET_LEFT = 'offsetLeft',
        OFFSET_TOP = 'offsetTop',
        OFFSET_PARENT = 'offsetParent',
        PARENT_NODE = 'parentNode',
        NODE_TYPE = 'nodeType',
        TAG_NAME = 'tagName',
        SCROLL_LEFT = 'scrollLeft',
        SCROLL_TOP = 'scrollTop',
        GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',
        GET_COMPUTED_STYLE = 'getComputedStyle',
        CURRENT_STYLE = 'currentStyle',
        CSS1_COMPAT = 'CSS1Compat',
        _BACK_COMPAT = 'BackCompat',
        _CLASS = 'class', // underscore due to reserved word
        CLASS_NAME = 'className',
        EMPTY = '',
        SPACE = ' ',
        C_START = '(?:^|\\s)',
        C_END = '(?= |$)',
        G = 'g',
        POSITION = 'position',
        FIXED = 'fixed',
        RELATIVE = 'relative',
        LEFT = 'left',
        TOP = 'top',
        MEDIUM = 'medium',
        BORDER_LEFT_WIDTH = 'borderLeftWidth',
        BORDER_TOP_WIDTH = 'borderTopWidth',
    
    // brower detection
        isOpera = UA.opera,
        isSafari = UA.webkit, 
        isGecko = UA.gecko, 
        isIE = UA.ie; 
    
    /**
     * Provides helper methods for DOM elements.
     * @namespace YAHOO.util
     * @class Dom
     * @requires yahoo, event
     */
    Y.Dom = {
        CUSTOM_ATTRIBUTES: (!documentElement.hasAttribute) ? { // IE < 8
            'for': 'htmlFor',
            'class': CLASS_NAME
        } : { // w3c
            'htmlFor': 'for',
            'className': _CLASS
        },

        /**
         * Returns an HTMLElement reference.
         * @method get
         * @param {String | HTMLElement |Array} el Accepts a string to use as an ID for getting a DOM reference, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @return {HTMLElement | Array} A DOM reference to an HTML element or an array of HTMLElements.
         */
        get: function(el) {
            var id, nodes, c, i, len;

            if (el) {
                if (el[NODE_TYPE] || el.item) { // Node, or NodeList
                    return el;
                }

                if (typeof el === 'string') { // id
                    id = el;
                    el = document.getElementById(el);
                    if (el && el.id === id) { // IE: avoid false match on "name" attribute
                    return el;
                    } else if (el && document.all) { // filter by name
                        el = null;
                        nodes = document.all[id];
                        for (i = 0, len = nodes.length; i < len; ++i) {
                            if (nodes[i].id === id) {
                                return nodes[i];
                            }
                        }
                    }
                    return el;
                }
                
                if (el.DOM_EVENTS) { // YAHOO.util.Element
                    el = el.get('element');
                }

                if ('length' in el) { // array-like
                    c = [];
                    for (i = 0, len = el.length; i < len; ++i) {
                        c[c.length] = Y.Dom.get(el[i]);
                    }
                    
                    return c;
                }

                return el; // some other object, just pass it back
            }

            return null;
        },
    
        getComputedStyle: function(el, property) {
            if (window[GET_COMPUTED_STYLE]) {
                return el[OWNER_DOCUMENT][DEFAULT_VIEW][GET_COMPUTED_STYLE](el, null)[property];
            } else if (el[CURRENT_STYLE]) {
                return Y.Dom.IE_ComputedStyle.get(el, property);
            }
        },

        /**
         * Normalizes currentStyle and ComputedStyle.
         * @method getStyle
         * @param {String | HTMLElement |Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {String} property The style property whose value is returned.
         * @return {String | Array} The current value of the style property for the element(s).
         */
        getStyle: function(el, property) {
            return Y.Dom.batch(el, Y.Dom._getStyle, property);
        },

        // branching at load instead of runtime
        _getStyle: function() {
            if (window[GET_COMPUTED_STYLE]) { // W3C DOM method
                return function(el, property) {
                    property = (property === 'float') ? property = 'cssFloat' :
                            Y.Dom._toCamel(property);

                    var value = el.style[property],
                        computed;
                    
                    if (!value) {
                        computed = el[OWNER_DOCUMENT][DEFAULT_VIEW][GET_COMPUTED_STYLE](el, null);
                        if (computed) { // test computed before touching for safari
                            value = computed[property];
                        }
                    }
                    
                    return value;
                };
            } else if (documentElement[CURRENT_STYLE]) {
                return function(el, property) {                         
                    var value;

                    switch(property) {
                        case 'opacity' :// IE opacity uses filter
                            value = 100;
                            try { // will error if no DXImageTransform
                                value = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;

                            } catch(e) {
                                try { // make sure its in the document
                                    value = el.filters('alpha').opacity;
                                } catch(err) {
                                }
                            }
                            return value / 100;
                        case 'float': // fix reserved word
                            property = 'styleFloat'; // fall through
                        default: 
                            property = Y.Dom._toCamel(property);
                            value = el[CURRENT_STYLE] ? el[CURRENT_STYLE][property] : null;
                            return ( el.style[property] || value );
                    }
                };
            }
        }(),
    
        /**
         * Wrapper for setting style properties of HTMLElements.  Normalizes "opacity" across modern browsers.
         * @method setStyle
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {String} property The style property to be set.
         * @param {String} val The value to apply to the given property.
         */
        setStyle: function(el, property, val) {
            Y.Dom.batch(el, Y.Dom._setStyle, { prop: property, val: val });
        },

        _setStyle: function() {
            if (isIE) {
                return function(el, args) {
                    var property = Y.Dom._toCamel(args.prop),
                        val = args.val;

                    if (el) {
                        switch (property) {
                            case 'opacity':
                                if ( lang.isString(el.style.filter) ) { // in case not appended
                                    el.style.filter = 'alpha(opacity=' + val * 100 + ')';
                                    
                                    if (!el[CURRENT_STYLE] || !el[CURRENT_STYLE].hasLayout) {
                                        el.style.zoom = 1; // when no layout or cant tell
                                    }
                                }
                                break;
                            case 'float':
                                property = 'styleFloat';
                            default:
                            el.style[property] = val;
                        }
                    } else {
                    }
                };
            } else {
                return function(el, args) {
                    var property = Y.Dom._toCamel(args.prop),
                        val = args.val;
                    if (el) {
                        if (property == 'float') {
                            property = 'cssFloat';
                        }
                        el.style[property] = val;
                    } else {
                    }
                };
            }

        }(),
        
        /**
         * Gets the current position of an element based on page coordinates. 
         * Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method getXY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM
         * reference, or an Array of IDs and/or HTMLElements
         * @return {Array} The XY position of the element(s)
         */
        getXY: function(el) {
            return Y.Dom.batch(el, Y.Dom._getXY);
        },

        _canPosition: function(el) {
            return ( Y.Dom._getStyle(el, 'display') !== 'none' && Y.Dom._inDoc(el) );
        },

        _getXY: function() {
            if (document[DOCUMENT_ELEMENT][GET_BOUNDING_CLIENT_RECT]) {
                return function(node) {
                    var scrollLeft, scrollTop, box, doc,
                        off1, off2, mode, bLeft, bTop,
                        floor = Math.floor, // TODO: round?
                        xy = false;

                    if (Y.Dom._canPosition(node)) {
                        box = node[GET_BOUNDING_CLIENT_RECT]();
                        doc = node[OWNER_DOCUMENT];
                        scrollLeft = Y.Dom.getDocumentScrollLeft(doc);
                        scrollTop = Y.Dom.getDocumentScrollTop(doc);
                        xy = [floor(box[LEFT]), floor(box[TOP])];

                        if (isIE && UA.ie < 8) { // IE < 8: viewport off by 2
                            off1 = 2;
                            off2 = 2;
                            mode = doc[COMPAT_MODE];
                            bLeft = _getComputedStyle(doc[DOCUMENT_ELEMENT], BORDER_LEFT_WIDTH);
                            bTop = _getComputedStyle(doc[DOCUMENT_ELEMENT], BORDER_TOP_WIDTH);

                            if (UA.ie === 6) {
                                if (mode !== _BACK_COMPAT) {
                                    off1 = 0;
                                    off2 = 0;
                                }
                            }
                            
                            if ((mode == _BACK_COMPAT)) {
                                if (bLeft !== MEDIUM) {
                                    off1 = parseInt(bLeft, 10);
                                }
                                if (bTop !== MEDIUM) {
                                    off2 = parseInt(bTop, 10);
                                }
                            }
                            
                            xy[0] -= off1;
                            xy[1] -= off2;

                        }

                        if ((scrollTop || scrollLeft)) {
                            xy[0] += scrollLeft;
                            xy[1] += scrollTop;
                        }

                        // gecko may return sub-pixel (non-int) values
                        xy[0] = floor(xy[0]);
                        xy[1] = floor(xy[1]);
                    } else {
                    }

                    return xy;
                };
            } else {
                return function(node) { // ff2, safari: manually calculate by crawling up offsetParents
                    var docScrollLeft, docScrollTop,
                        scrollTop, scrollLeft,
                        bCheck,
                        xy = false,
                        parentNode = node;

                    if  (Y.Dom._canPosition(node) ) {
                        xy = [node[OFFSET_LEFT], node[OFFSET_TOP]];
                        docScrollLeft = Y.Dom.getDocumentScrollLeft(node[OWNER_DOCUMENT]);
                        docScrollTop = Y.Dom.getDocumentScrollTop(node[OWNER_DOCUMENT]);

                        // TODO: refactor with !! or just falsey
                        bCheck = ((isGecko || UA.webkit > 519) ? true : false);

                        // TODO: worth refactoring for TOP/LEFT only?
                        while ((parentNode = parentNode[OFFSET_PARENT])) {
                            xy[0] += parentNode[OFFSET_LEFT];
                            xy[1] += parentNode[OFFSET_TOP];
                            if (bCheck) {
                                xy = Y.Dom._calcBorders(parentNode, xy);
                            }
                        }

                        // account for any scrolled ancestors
                        if (Y.Dom._getStyle(node, POSITION) !== FIXED) {
                            parentNode = node;

                            while ((parentNode = parentNode[PARENT_NODE]) && parentNode[TAG_NAME]) {
                                scrollTop = parentNode[SCROLL_TOP];
                                scrollLeft = parentNode[SCROLL_LEFT];

                                //Firefox does something funky with borders when overflow is not visible.
                                if (isGecko && (Y.Dom._getStyle(parentNode, 'overflow') !== 'visible')) {
                                        xy = Y.Dom._calcBorders(parentNode, xy);
                                }

                                if (scrollTop || scrollLeft) {
                                    xy[0] -= scrollLeft;
                                    xy[1] -= scrollTop;
                                }
                            }
                            xy[0] += docScrollLeft;
                            xy[1] += docScrollTop;

                        } else {
                            //Fix FIXED position -- add scrollbars
                            if (isOpera) {
                                xy[0] -= docScrollLeft;
                                xy[1] -= docScrollTop;
                            } else if (isSafari || isGecko) {
                                xy[0] += docScrollLeft;
                                xy[1] += docScrollTop;
                            }
                        }
                        //Round the numbers so we get sane data back
                        xy[0] = Math.floor(xy[0]);
                        xy[1] = Math.floor(xy[1]);
                    } else {
                    }
                    return xy;                
                };
            }
        }(), // NOTE: Executing for loadtime branching
        
        /**
         * Gets the current X position of an element based on page coordinates.  The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method getX
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @return {Number | Array} The X position of the element(s)
         */
        getX: function(el) {
            var f = function(el) {
                return Y.Dom.getXY(el)[0];
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Gets the current Y position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method getY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @return {Number | Array} The Y position of the element(s)
         */
        getY: function(el) {
            var f = function(el) {
                return Y.Dom.getXY(el)[1];
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Set the position of an html element in page coordinates, regardless of how the element is positioned.
         * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setXY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @param {Array} pos Contains X & Y values for new position (coordinates are page-based)
         * @param {Boolean} noRetry By default we try and set the position a second time if the first fails
         */
        setXY: function(el, pos, noRetry) {
            Y.Dom.batch(el, Y.Dom._setXY, { pos: pos, noRetry: noRetry });
        },

        _setXY: function(node, args) {
            var pos = Y.Dom._getStyle(node, POSITION),
                setStyle = Y.Dom.setStyle,
                xy = args.pos,
                noRetry = args.noRetry,

                delta = [ // assuming pixels; if not we will have to retry
                    parseInt( Y.Dom.getComputedStyle(node, LEFT), 10 ),
                    parseInt( Y.Dom.getComputedStyle(node, TOP), 10 )
                ],

                currentXY,
                newXY;
        
            if (pos == 'static') { // default to relative
                pos = RELATIVE;
                setStyle(node, POSITION, pos);
            }

            currentXY = Y.Dom._getXY(node);

            if (!xy || currentXY === false) { // has to be part of doc to have xy
                return false; 
            }
            
            if ( isNaN(delta[0]) ) {// in case of 'auto'
                delta[0] = (pos == RELATIVE) ? 0 : node[OFFSET_LEFT];
            } 
            if ( isNaN(delta[1]) ) { // in case of 'auto'
                delta[1] = (pos == RELATIVE) ? 0 : node[OFFSET_TOP];
            } 

            if (xy[0] !== null) { // from setX
                setStyle(node, LEFT, xy[0] - currentXY[0] + delta[0] + 'px');
            }

            if (xy[1] !== null) { // from setY
                setStyle(node, TOP, xy[1] - currentXY[1] + delta[1] + 'px');
            }
          
            if (!noRetry) {
                newXY = Y.Dom._getXY(node);

                // if retry is true, try one more time if we miss 
               if ( (xy[0] !== null && newXY[0] != xy[0]) || 
                    (xy[1] !== null && newXY[1] != xy[1]) ) {
                   Y.Dom._setXY(node, { pos: xy, noRetry: true });
               }
            }        

        },
        
        /**
         * Set the X position of an html element in page coordinates, regardless of how the element is positioned.
         * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setX
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {Int} x The value to use as the X coordinate for the element(s).
         */
        setX: function(el, x) {
            Y.Dom.setXY(el, [x, null]);
        },
        
        /**
         * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
         * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {Int} x To use as the Y coordinate for the element(s).
         */
        setY: function(el, y) {
            Y.Dom.setXY(el, [null, y]);
        },
        
        /**
         * Returns the region position of the given element.
         * The element must be part of the DOM tree to have a region (display:none or elements not appended return false).
         * @method getRegion
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @return {Region | Array} A Region or array of Region instances containing "top, left, bottom, right" member data.
         */
        getRegion: function(el) {
            var f = function(el) {
                var region = false;
                if ( Y.Dom._canPosition(el) ) {
                    region = Y.Region.getRegion(el);
                } else {
                }

                return region;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Returns the width of the client (viewport).
         * @method getClientWidth
         * @deprecated Now using getViewportWidth.  This interface left intact for back compat.
         * @return {Int} The width of the viewable area of the page.
         */
        getClientWidth: function() {
            return Y.Dom.getViewportWidth();
        },
        
        /**
         * Returns the height of the client (viewport).
         * @method getClientHeight
         * @deprecated Now using getViewportHeight.  This interface left intact for back compat.
         * @return {Int} The height of the viewable area of the page.
         */
        getClientHeight: function() {
            return Y.Dom.getViewportHeight();
        },

        /**
         * Returns a array of HTMLElements with the given class.
         * For optimized performance, include a tag and/or root node when possible.
         * Note: This method operates against a live collection, so modifying the 
         * collection in the callback (removing/appending nodes, etc.) will have
         * side effects.  Instead you should iterate the returned nodes array,
         * as you would with the native "getElementsByTagName" method. 
         * @method getElementsByClassName
         * @param {String} className The class name to match against
         * @param {String} tag (optional) The tag name of the elements being collected
         * @param {String | HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point 
         * @param {Function} apply (optional) A function to apply to each element when found 
         * @param {Any} o (optional) An optional arg that is passed to the supplied method
         * @param {Boolean} overrides (optional) Whether or not to override the scope of "method" with "o"
         * @return {Array} An array of elements that have the given class name
         */
        getElementsByClassName: function(className, tag, root, apply, o, overrides) {
            className = lang.trim(className);
            tag = tag || '*';
            root = (root) ? Y.Dom.get(root) : null || document; 
            if (!root) {
                return [];
            }

            var nodes = [],
                elements = root.getElementsByTagName(tag),
                hasClass = Y.Dom.hasClass;

            for (var i = 0, len = elements.length; i < len; ++i) {
                if ( hasClass(elements[i], className) ) {
                    nodes[nodes.length] = elements[i];
                }
            }
            
            if (apply) {
                Y.Dom.batch(nodes, apply, o, overrides);
            }

            return nodes;
        },

        /**
         * Determines whether an HTMLElement has the given className.
         * @method hasClass
         * @param {String | HTMLElement | Array} el The element or collection to test
         * @param {String} className the class name to search for
         * @return {Boolean | Array} A boolean value or array of boolean values
         */
        hasClass: function(el, className) {
            return Y.Dom.batch(el, Y.Dom._hasClass, className);
        },

        _hasClass: function(el, className) {
            var ret = false,
                current;
            
            if (el && className) {
                current = Y.Dom.getAttribute(el, CLASS_NAME) || EMPTY;
                if (className.exec) {
                    ret = className.test(current);
                } else {
                    ret = className && (SPACE + current + SPACE).
                        indexOf(SPACE + className + SPACE) > -1;
                }
            } else {
            }

            return ret;
        },
    
        /**
         * Adds a class name to a given element or collection of elements.
         * @method addClass         
         * @param {String | HTMLElement | Array} el The element or collection to add the class to
         * @param {String} className the class name to add to the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        addClass: function(el, className) {
            return Y.Dom.batch(el, Y.Dom._addClass, className);
        },

        _addClass: function(el, className) {
            var ret = false,
                current;

            if (el && className) {
                current = Y.Dom.getAttribute(el, CLASS_NAME) || EMPTY;
                if ( !Y.Dom._hasClass(el, className) ) {
                    Y.Dom.setAttribute(el, CLASS_NAME, trim(current + SPACE + className));
                    ret = true;
                }
            } else {
            }

            return ret;
        },
    
        /**
         * Removes a class name from a given element or collection of elements.
         * @method removeClass         
         * @param {String | HTMLElement | Array} el The element or collection to remove the class from
         * @param {String} className the class name to remove from the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        removeClass: function(el, className) {
            return Y.Dom.batch(el, Y.Dom._removeClass, className);
        },
        
        _removeClass: function(el, className) {
            var ret = false,
                current,
                newClass,
                attr;

            if (el && className) {
                current = Y.Dom.getAttribute(el, CLASS_NAME) || EMPTY;
                Y.Dom.setAttribute(el, CLASS_NAME, current.replace(Y.Dom._getClassRegex(className), EMPTY));

                newClass = Y.Dom.getAttribute(el, CLASS_NAME);
                if (current !== newClass) { // else nothing changed
                    Y.Dom.setAttribute(el, CLASS_NAME, trim(newClass)); // trim after comparing to current class
                    ret = true;

                    if (Y.Dom.getAttribute(el, CLASS_NAME) === '') { // remove class attribute if empty
                        attr = (el.hasAttribute && el.hasAttribute(_CLASS)) ? _CLASS : CLASS_NAME;
                        el.removeAttribute(attr);
                    }
                }

            } else {
            }

            return ret;
        },
        
        /**
         * Replace a class with another class for a given element or collection of elements.
         * If no oldClassName is present, the newClassName is simply added.
         * @method replaceClass  
         * @param {String | HTMLElement | Array} el The element or collection to remove the class from
         * @param {String} oldClassName the class name to be replaced
         * @param {String} newClassName the class name that will be replacing the old class name
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        replaceClass: function(el, oldClassName, newClassName) {
            return Y.Dom.batch(el, Y.Dom._replaceClass, { from: oldClassName, to: newClassName });
        },

        _replaceClass: function(el, classObj) {
            var className,
                from,
                to,
                ret = false,
                current;

            if (el && classObj) {
                from = classObj.from;
                to = classObj.to;

                if (!to) {
                    ret = false;
                }  else if (!from) { // just add if no "from"
                    ret = Y.Dom._addClass(el, classObj.to);
                } else if (from !== to) { // else nothing to replace
                    // May need to lead with DBLSPACE?
                    current = Y.Dom.getAttribute(el, CLASS_NAME) || EMPTY;
                    className = (SPACE + current.replace(Y.Dom._getClassRegex(from), SPACE + to)).
                               split(Y.Dom._getClassRegex(to));

                    // insert to into what would have been the first occurrence slot
                    className.splice(1, 0, SPACE + to);
                    Y.Dom.setAttribute(el, CLASS_NAME, trim(className.join(EMPTY)));
                    ret = true;
                }
            } else {
            }

            return ret;
        },
        
        /**
         * Returns an ID and applies it to the element "el", if provided.
         * @method generateId  
         * @param {String | HTMLElement | Array} el (optional) An optional element array of elements to add an ID to (no ID is added if one is already present).
         * @param {String} prefix (optional) an optional prefix to use (defaults to "yui-gen").
         * @return {String | Array} The generated ID, or array of generated IDs (or original ID if already present on an element)
         */
        generateId: function(el, prefix) {
            prefix = prefix || 'yui-gen';

            var f = function(el) {
                if (el && el.id) { // do not override existing ID
                    return el.id;
                }

                var id = prefix + YAHOO.env._id_counter++;

                if (el) {
                    if (el[OWNER_DOCUMENT].getElementById(id)) { // in case one already exists
                        // use failed id plus prefix to help ensure uniqueness
                        return Y.Dom.generateId(el, id + prefix);
                    }
                    el.id = id;
                }
                
                return id;
            };

            // batch fails when no element, so just generate and return single ID
            return Y.Dom.batch(el, f, Y.Dom, true) || f.apply(Y.Dom, arguments);
        },
        
        /**
         * Determines whether an HTMLElement is an ancestor of another HTML element in the DOM hierarchy.
         * @method isAncestor
         * @param {String | HTMLElement} haystack The possible ancestor
         * @param {String | HTMLElement} needle The possible descendent
         * @return {Boolean} Whether or not the haystack is an ancestor of needle
         */
        isAncestor: function(haystack, needle) {
            haystack = Y.Dom.get(haystack);
            needle = Y.Dom.get(needle);
            
            var ret = false;

            if ( (haystack && needle) && (haystack[NODE_TYPE] && needle[NODE_TYPE]) ) {
                if (haystack.contains && haystack !== needle) { // contains returns true when equal
                    ret = haystack.contains(needle);
                }
                else if (haystack.compareDocumentPosition) { // gecko
                    ret = !!(haystack.compareDocumentPosition(needle) & 16);
                }
            } else {
            }
            return ret;
        },
        
        /**
         * Determines whether an HTMLElement is present in the current document.
         * @method inDocument         
         * @param {String | HTMLElement} el The element to search for
         * @param {Object} doc An optional document to search, defaults to element's owner document 
         * @return {Boolean} Whether or not the element is present in the current document
         */
        inDocument: function(el, doc) {
            return Y.Dom._inDoc(Y.Dom.get(el), doc);
        },

        _inDoc: function(el, doc) {
            var ret = false;
            if (el && el[TAG_NAME]) {
                doc = doc || el[OWNER_DOCUMENT]; 
                ret = Y.Dom.isAncestor(doc[DOCUMENT_ELEMENT], el);
            } else {
            }
            return ret;
        },
        
        /**
         * Returns a array of HTMLElements that pass the test applied by supplied boolean method.
         * For optimized performance, include a tag and/or root node when possible.
         * Note: This method operates against a live collection, so modifying the 
         * collection in the callback (removing/appending nodes, etc.) will have
         * side effects.  Instead you should iterate the returned nodes array,
         * as you would with the native "getElementsByTagName" method. 
         * @method getElementsBy
         * @param {Function} method - A boolean method for testing elements which receives the element as its only argument.
         * @param {String} tag (optional) The tag name of the elements being collected
         * @param {String | HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point 
         * @param {Function} apply (optional) A function to apply to each element when found 
         * @param {Any} o (optional) An optional arg that is passed to the supplied method
         * @param {Boolean} overrides (optional) Whether or not to override the scope of "method" with "o"
         * @return {Array} Array of HTMLElements
         */
        getElementsBy: function(method, tag, root, apply, o, overrides, firstOnly) {
            tag = tag || '*';
            root = (root) ? Y.Dom.get(root) : null || document; 

            if (!root) {
                return [];
            }

            var nodes = [],
                elements = root.getElementsByTagName(tag);
            
            for (var i = 0, len = elements.length; i < len; ++i) {
                if ( method(elements[i]) ) {
                    if (firstOnly) {
                        nodes = elements[i]; 
                        break;
                    } else {
                        nodes[nodes.length] = elements[i];
                    }
                }
            }

            if (apply) {
                Y.Dom.batch(nodes, apply, o, overrides);
            }

            
            return nodes;
        },
        
        /**
         * Returns the first HTMLElement that passes the test applied by the supplied boolean method.
         * @method getElementBy
         * @param {Function} method - A boolean method for testing elements which receives the element as its only argument.
         * @param {String} tag (optional) The tag name of the elements being collected
         * @param {String | HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point 
         * @return {HTMLElement}
         */
        getElementBy: function(method, tag, root) {
            return Y.Dom.getElementsBy(method, tag, root, null, null, null, true); 
        },

        /**
         * Runs the supplied method against each item in the Collection/Array.
         * The method is called with the element(s) as the first arg, and the optional param as the second ( method(el, o) ).
         * @method batch
         * @param {String | HTMLElement | Array} el (optional) An element or array of elements to apply the method to
         * @param {Function} method The method to apply to the element(s)
         * @param {Any} o (optional) An optional arg that is passed to the supplied method
         * @param {Boolean} overrides (optional) Whether or not to override the scope of "method" with "o"
         * @return {Any | Array} The return value(s) from the supplied method
         */
        batch: function(el, method, o, overrides) {
            var collection = [],
                scope = (overrides) ? o : window;
                
            el = (el && (el[TAG_NAME] || el.item)) ? el : Y.Dom.get(el); // skip get() when possible
            if (el && method) {
                if (el[TAG_NAME] || el.length === undefined) { // element or not array-like 
                    return method.call(scope, el, o);
                } 

                for (var i = 0; i < el.length; ++i) {
                    collection[collection.length] = method.call(scope, el[i], o);
                }
            } else {
                return false;
            } 
            return collection;
        },
        
        /**
         * Returns the height of the document.
         * @method getDocumentHeight
         * @return {Int} The height of the actual document (which includes the body and its margin).
         */
        getDocumentHeight: function() {
            var scrollHeight = (document[COMPAT_MODE] != CSS1_COMPAT || isSafari) ? document.body.scrollHeight : documentElement.scrollHeight,
                h = Math.max(scrollHeight, Y.Dom.getViewportHeight());

            return h;
        },
        
        /**
         * Returns the width of the document.
         * @method getDocumentWidth
         * @return {Int} The width of the actual document (which includes the body and its margin).
         */
        getDocumentWidth: function() {
            var scrollWidth = (document[COMPAT_MODE] != CSS1_COMPAT || isSafari) ? document.body.scrollWidth : documentElement.scrollWidth,
                w = Math.max(scrollWidth, Y.Dom.getViewportWidth());
            return w;
        },

        /**
         * Returns the current height of the viewport.
         * @method getViewportHeight
         * @return {Int} The height of the viewable area of the page (excludes scrollbars).
         */
        getViewportHeight: function() {
            var height = self.innerHeight, // Safari, Opera
                mode = document[COMPAT_MODE];
        
            if ( (mode || isIE) && !isOpera ) { // IE, Gecko
                height = (mode == CSS1_COMPAT) ?
                        documentElement.clientHeight : // Standards
                        document.body.clientHeight; // Quirks
            }
        
            return height;
        },
        
        /**
         * Returns the current width of the viewport.
         * @method getViewportWidth
         * @return {Int} The width of the viewable area of the page (excludes scrollbars).
         */
        
        getViewportWidth: function() {
            var width = self.innerWidth,  // Safari
                mode = document[COMPAT_MODE];
            
            if (mode || isIE) { // IE, Gecko, Opera
                width = (mode == CSS1_COMPAT) ?
                        documentElement.clientWidth : // Standards
                        document.body.clientWidth; // Quirks
            }
            return width;
        },

       /**
         * Returns the nearest ancestor that passes the test applied by supplied boolean method.
         * For performance reasons, IDs are not accepted and argument validation omitted.
         * @method getAncestorBy
         * @param {HTMLElement} node The HTMLElement to use as the starting point 
         * @param {Function} method - A boolean method for testing elements which receives the element as its only argument.
         * @return {Object} HTMLElement or null if not found
         */
        getAncestorBy: function(node, method) {
            while ( (node = node[PARENT_NODE]) ) { // NOTE: assignment
                if ( Y.Dom._testElement(node, method) ) {
                    return node;
                }
            } 

            return null;
        },
        
        /**
         * Returns the nearest ancestor with the given className.
         * @method getAncestorByClassName
         * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
         * @param {String} className
         * @return {Object} HTMLElement
         */
        getAncestorByClassName: function(node, className) {
            node = Y.Dom.get(node);
            if (!node) {
                return null;
            }
            var method = function(el) { return Y.Dom.hasClass(el, className); };
            return Y.Dom.getAncestorBy(node, method);
        },

        /**
         * Returns the nearest ancestor with the given tagName.
         * @method getAncestorByTagName
         * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
         * @param {String} tagName
         * @return {Object} HTMLElement
         */
        getAncestorByTagName: function(node, tagName) {
            node = Y.Dom.get(node);
            if (!node) {
                return null;
            }
            var method = function(el) {
                 return el[TAG_NAME] && el[TAG_NAME].toUpperCase() == tagName.toUpperCase();
            };

            return Y.Dom.getAncestorBy(node, method);
        },

        /**
         * Returns the previous sibling that is an HTMLElement. 
         * For performance reasons, IDs are not accepted and argument validation omitted.
         * Returns the nearest HTMLElement sibling if no method provided.
         * @method getPreviousSiblingBy
         * @param {HTMLElement} node The HTMLElement to use as the starting point 
         * @param {Function} method A boolean function used to test siblings
         * that receives the sibling node being tested as its only argument
         * @return {Object} HTMLElement or null if not found
         */
        getPreviousSiblingBy: function(node, method) {
            while (node) {
                node = node.previousSibling;
                if ( Y.Dom._testElement(node, method) ) {
                    return node;
                }
            }
            return null;
        }, 

        /**
         * Returns the previous sibling that is an HTMLElement 
         * @method getPreviousSibling
         * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
         * @return {Object} HTMLElement or null if not found
         */
        getPreviousSibling: function(node) {
            node = Y.Dom.get(node);
            if (!node) {
                return null;
            }

            return Y.Dom.getPreviousSiblingBy(node);
        }, 

        /**
         * Returns the next HTMLElement sibling that passes the boolean method. 
         * For performance reasons, IDs are not accepted and argument validation omitted.
         * Returns the nearest HTMLElement sibling if no method provided.
         * @method getNextSiblingBy
         * @param {HTMLElement} node The HTMLElement to use as the starting point 
         * @param {Function} method A boolean function used to test siblings
         * that receives the sibling node being tested as its only argument
         * @return {Object} HTMLElement or null if not found
         */
        getNextSiblingBy: function(node, method) {
            while (node) {
                node = node.nextSibling;
                if ( Y.Dom._testElement(node, method) ) {
                    return node;
                }
            }
            return null;
        }, 

        /**
         * Returns the next sibling that is an HTMLElement 
         * @method getNextSibling
         * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
         * @return {Object} HTMLElement or null if not found
         */
        getNextSibling: function(node) {
            node = Y.Dom.get(node);
            if (!node) {
                return null;
            }

            return Y.Dom.getNextSiblingBy(node);
        }, 

        /**
         * Returns the first HTMLElement child that passes the test method. 
         * @method getFirstChildBy
         * @param {HTMLElement} node The HTMLElement to use as the starting point 
         * @param {Function} method A boolean function used to test children
         * that receives the node being tested as its only argument
         * @return {Object} HTMLElement or null if not found
         */
        getFirstChildBy: function(node, method) {
            var child = ( Y.Dom._testElement(node.firstChild, method) ) ? node.firstChild : null;
            return child || Y.Dom.getNextSiblingBy(node.firstChild, method);
        }, 

        /**
         * Returns the first HTMLElement child. 
         * @method getFirstChild
         * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
         * @return {Object} HTMLElement or null if not found
         */
        getFirstChild: function(node, method) {
            node = Y.Dom.get(node);
            if (!node) {
                return null;
            }
            return Y.Dom.getFirstChildBy(node);
        }, 

        /**
         * Returns the last HTMLElement child that passes the test method. 
         * @method getLastChildBy
         * @param {HTMLElement} node The HTMLElement to use as the starting point 
         * @param {Function} method A boolean function used to test children
         * that receives the node being tested as its only argument
         * @return {Object} HTMLElement or null if not found
         */
        getLastChildBy: function(node, method) {
            if (!node) {
                return null;
            }
            var child = ( Y.Dom._testElement(node.lastChild, method) ) ? node.lastChild : null;
            return child || Y.Dom.getPreviousSiblingBy(node.lastChild, method);
        }, 

        /**
         * Returns the last HTMLElement child. 
         * @method getLastChild
         * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
         * @return {Object} HTMLElement or null if not found
         */
        getLastChild: function(node) {
            node = Y.Dom.get(node);
            return Y.Dom.getLastChildBy(node);
        }, 

        /**
         * Returns an array of HTMLElement childNodes that pass the test method. 
         * @method getChildrenBy
         * @param {HTMLElement} node The HTMLElement to start from
         * @param {Function} method A boolean function used to test children
         * that receives the node being tested as its only argument
         * @return {Array} A static array of HTMLElements
         */
        getChildrenBy: function(node, method) {
            var child = Y.Dom.getFirstChildBy(node, method),
                children = child ? [child] : [];

            Y.Dom.getNextSiblingBy(child, function(node) {
                if ( !method || method(node) ) {
                    children[children.length] = node;
                }
                return false; // fail test to collect all children
            });

            return children;
        },
 
        /**
         * Returns an array of HTMLElement childNodes. 
         * @method getChildren
         * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
         * @return {Array} A static array of HTMLElements
         */
        getChildren: function(node) {
            node = Y.Dom.get(node);
            if (!node) {
            }

            return Y.Dom.getChildrenBy(node);
        },

        /**
         * Returns the left scroll value of the document 
         * @method getDocumentScrollLeft
         * @param {HTMLDocument} document (optional) The document to get the scroll value of
         * @return {Int}  The amount that the document is scrolled to the left
         */
        getDocumentScrollLeft: function(doc) {
            doc = doc || document;
            return Math.max(doc[DOCUMENT_ELEMENT].scrollLeft, doc.body.scrollLeft);
        }, 

        /**
         * Returns the top scroll value of the document 
         * @method getDocumentScrollTop
         * @param {HTMLDocument} document (optional) The document to get the scroll value of
         * @return {Int}  The amount that the document is scrolled to the top
         */
        getDocumentScrollTop: function(doc) {
            doc = doc || document;
            return Math.max(doc[DOCUMENT_ELEMENT].scrollTop, doc.body.scrollTop);
        },

        /**
         * Inserts the new node as the previous sibling of the reference node 
         * @method insertBefore
         * @param {String | HTMLElement} newNode The node to be inserted
         * @param {String | HTMLElement} referenceNode The node to insert the new node before 
         * @return {HTMLElement} The node that was inserted (or null if insert fails) 
         */
        insertBefore: function(newNode, referenceNode) {
            newNode = Y.Dom.get(newNode); 
            referenceNode = Y.Dom.get(referenceNode); 
            
            if (!newNode || !referenceNode || !referenceNode[PARENT_NODE]) {
                return null;
            }       

            return referenceNode[PARENT_NODE].insertBefore(newNode, referenceNode); 
        },

        /**
         * Inserts the new node as the next sibling of the reference node 
         * @method insertAfter
         * @param {String | HTMLElement} newNode The node to be inserted
         * @param {String | HTMLElement} referenceNode The node to insert the new node after 
         * @return {HTMLElement} The node that was inserted (or null if insert fails) 
         */
        insertAfter: function(newNode, referenceNode) {
            newNode = Y.Dom.get(newNode); 
            referenceNode = Y.Dom.get(referenceNode); 
            
            if (!newNode || !referenceNode || !referenceNode[PARENT_NODE]) {
                return null;
            }       

            if (referenceNode.nextSibling) {
                return referenceNode[PARENT_NODE].insertBefore(newNode, referenceNode.nextSibling); 
            } else {
                return referenceNode[PARENT_NODE].appendChild(newNode);
            }
        },

        /**
         * Creates a Region based on the viewport relative to the document. 
         * @method getClientRegion
         * @return {Region} A Region object representing the viewport which accounts for document scroll
         */
        getClientRegion: function() {
            var t = Y.Dom.getDocumentScrollTop(),
                l = Y.Dom.getDocumentScrollLeft(),
                r = Y.Dom.getViewportWidth() + l,
                b = Y.Dom.getViewportHeight() + t;

            return new Y.Region(t, r, b, l);
        },

        /**
         * Provides a normalized attribute interface. 
         * @method setAttibute
         * @param {String | HTMLElement} el The target element for the attribute.
         * @param {String} attr The attribute to set.
         * @param {String} val The value of the attribute.
         */
        setAttribute: function(el, attr, val) {
            attr = Y.Dom.CUSTOM_ATTRIBUTES[attr] || attr;
            el.setAttribute(attr, val);
        },


        /**
         * Provides a normalized attribute interface. 
         * @method getAttibute
         * @param {String | HTMLElement} el The target element for the attribute.
         * @param {String} attr The attribute to get.
         * @return {String} The current value of the attribute. 
         */
        getAttribute: function(el, attr) {
            attr = Y.Dom.CUSTOM_ATTRIBUTES[attr] || attr;
            return el.getAttribute(attr);
        },

        _toCamel: function(property) {
            var c = propertyCache;

            function tU(x,l) {
                return l.toUpperCase();
            }

            return c[property] || (c[property] = property.indexOf('-') === -1 ? 
                                    property :
                                    property.replace( /-([a-z])/gi, tU ));
        },

        _getClassRegex: function(className) {
            var re;
            if (className !== undefined) { // allow empty string to pass
                if (className.exec) { // already a RegExp
                    re = className;
                } else {
                    re = reCache[className];
                    if (!re) {
                        // escape special chars (".", "[", etc.)
                        className = className.replace(Y.Dom._patterns.CLASS_RE_TOKENS, '\\$1');
                        re = reCache[className] = new RegExp(C_START + className + C_END, G);
                    }
                }
            }
            return re;
        },

        _patterns: {
            ROOT_TAG: /^body|html$/i, // body for quirks mode, html for standards,
            CLASS_RE_TOKENS: /([\.\(\)\^\$\*\+\?\|\[\]\{\}])/g
        },


        _testElement: function(node, method) {
            return node && node[NODE_TYPE] == 1 && ( !method || method(node) );
        },

        _calcBorders: function(node, xy2) {
            var t = parseInt(Y.Dom[GET_COMPUTED_STYLE](node, BORDER_TOP_WIDTH), 10) || 0,
                l = parseInt(Y.Dom[GET_COMPUTED_STYLE](node, BORDER_LEFT_WIDTH), 10) || 0;
            if (isGecko) {
                if (RE_TABLE.test(node[TAG_NAME])) {
                    t = 0;
                    l = 0;
                }
            }
            xy2[0] += l;
            xy2[1] += t;
            return xy2;
        }
    };
        
    var _getComputedStyle = Y.Dom[GET_COMPUTED_STYLE];
    // fix opera computedStyle default color unit (convert to rgb)
    if (UA.opera) {
        Y.Dom[GET_COMPUTED_STYLE] = function(node, att) {
            var val = _getComputedStyle(node, att);
            if (RE_COLOR.test(att)) {
                val = Y.Dom.Color.toRGB(val);
            }

            return val;
        };

    }

    // safari converts transparent to rgba(), others use "transparent"
    if (UA.webkit) {
        Y.Dom[GET_COMPUTED_STYLE] = function(node, att) {
            var val = _getComputedStyle(node, att);

            if (val === 'rgba(0, 0, 0, 0)') {
                val = 'transparent'; 
            }

            return val;
        };

    }
})();
/**
 * A region is a representation of an object on a grid.  It is defined
 * by the top, right, bottom, left extents, so is rectangular by default.  If 
 * other shapes are required, this class could be extended to support it.
 * @namespace YAHOO.util
 * @class Region
 * @param {Int} t the top extent
 * @param {Int} r the right extent
 * @param {Int} b the bottom extent
 * @param {Int} l the left extent
 * @constructor
 */
YAHOO.util.Region = function(t, r, b, l) {

    /**
     * The region's top extent
     * @property top
     * @type Int
     */
    this.top = t;
    
    /**
     * The region's top extent
     * @property y
     * @type Int
     */
    this.y = t;
    
    /**
     * The region's top extent as index, for symmetry with set/getXY
     * @property 1
     * @type Int
     */
    this[1] = t;

    /**
     * The region's right extent
     * @property right
     * @type int
     */
    this.right = r;

    /**
     * The region's bottom extent
     * @property bottom
     * @type Int
     */
    this.bottom = b;

    /**
     * The region's left extent
     * @property left
     * @type Int
     */
    this.left = l;
    
    /**
     * The region's left extent
     * @property x
     * @type Int
     */
    this.x = l;
    
    /**
     * The region's left extent as index, for symmetry with set/getXY
     * @property 0
     * @type Int
     */
    this[0] = l;

    /**
     * The region's total width 
     * @property width 
     * @type Int
     */
    this.width = this.right - this.left;

    /**
     * The region's total height 
     * @property height 
     * @type Int
     */
    this.height = this.bottom - this.top;
};

/**
 * Returns true if this region contains the region passed in
 * @method contains
 * @param  {Region}  region The region to evaluate
 * @return {Boolean}        True if the region is contained with this region, 
 *                          else false
 */
YAHOO.util.Region.prototype.contains = function(region) {
    return ( region.left   >= this.left   && 
             region.right  <= this.right  && 
             region.top    >= this.top    && 
             region.bottom <= this.bottom    );

};

/**
 * Returns the area of the region
 * @method getArea
 * @return {Int} the region's area
 */
YAHOO.util.Region.prototype.getArea = function() {
    return ( (this.bottom - this.top) * (this.right - this.left) );
};

/**
 * Returns the region where the passed in region overlaps with this one
 * @method intersect
 * @param  {Region} region The region that intersects
 * @return {Region}        The overlap region, or null if there is no overlap
 */
YAHOO.util.Region.prototype.intersect = function(region) {
    var t = Math.max( this.top,    region.top    ),
        r = Math.min( this.right,  region.right  ),
        b = Math.min( this.bottom, region.bottom ),
        l = Math.max( this.left,   region.left   );
    
    if (b >= t && r >= l) {
        return new YAHOO.util.Region(t, r, b, l);
    } else {
        return null;
    }
};

/**
 * Returns the region representing the smallest region that can contain both
 * the passed in region and this region.
 * @method union
 * @param  {Region} region The region that to create the union with
 * @return {Region}        The union region
 */
YAHOO.util.Region.prototype.union = function(region) {
    var t = Math.min( this.top,    region.top    ),
        r = Math.max( this.right,  region.right  ),
        b = Math.max( this.bottom, region.bottom ),
        l = Math.min( this.left,   region.left   );

    return new YAHOO.util.Region(t, r, b, l);
};

/**
 * toString
 * @method toString
 * @return string the region properties
 */
YAHOO.util.Region.prototype.toString = function() {
    return ( "Region {"    +
             "top: "       + this.top    + 
             ", right: "   + this.right  + 
             ", bottom: "  + this.bottom + 
             ", left: "    + this.left   + 
             ", height: "  + this.height + 
             ", width: "    + this.width   + 
             "}" );
};

/**
 * Returns a region that is occupied by the DOM element
 * @method getRegion
 * @param  {HTMLElement} el The element
 * @return {Region}         The region that the element occupies
 * @static
 */
YAHOO.util.Region.getRegion = function(el) {
    var p = YAHOO.util.Dom.getXY(el),
        t = p[1],
        r = p[0] + el.offsetWidth,
        b = p[1] + el.offsetHeight,
        l = p[0];

    return new YAHOO.util.Region(t, r, b, l);
};

/////////////////////////////////////////////////////////////////////////////


/**
 * A point is a region that is special in that it represents a single point on 
 * the grid.
 * @namespace YAHOO.util
 * @class Point
 * @param {Int} x The X position of the point
 * @param {Int} y The Y position of the point
 * @constructor
 * @extends YAHOO.util.Region
 */
YAHOO.util.Point = function(x, y) {
   if (YAHOO.lang.isArray(x)) { // accept input from Dom.getXY, Event.getXY, etc.
      y = x[1]; // dont blow away x yet
      x = x[0];
   }
 
    YAHOO.util.Point.superclass.constructor.call(this, y, x, y, x);
};

YAHOO.extend(YAHOO.util.Point, YAHOO.util.Region);

(function() {
/**
 * Add style management functionality to DOM.
 * @module dom
 * @for Dom
 */

var Y = YAHOO.util, 
    CLIENT_TOP = 'clientTop',
    CLIENT_LEFT = 'clientLeft',
    PARENT_NODE = 'parentNode',
    RIGHT = 'right',
    HAS_LAYOUT = 'hasLayout',
    PX = 'px',
    OPACITY = 'opacity',
    AUTO = 'auto',
    BORDER_LEFT_WIDTH = 'borderLeftWidth',
    BORDER_TOP_WIDTH = 'borderTopWidth',
    BORDER_RIGHT_WIDTH = 'borderRightWidth',
    BORDER_BOTTOM_WIDTH = 'borderBottomWidth',
    VISIBLE = 'visible',
    TRANSPARENT = 'transparent',
    HEIGHT = 'height',
    WIDTH = 'width',
    STYLE = 'style',
    CURRENT_STYLE = 'currentStyle',

// IE getComputedStyle
// TODO: unit-less lineHeight (e.g. 1.22)
    re_size = /^width|height$/,
    re_unit = /^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i,

    ComputedStyle = {
        get: function(el, property) {
            var value = '',
                current = el[CURRENT_STYLE][property];

            if (property === OPACITY) {
                value = Y.Dom.getStyle(el, OPACITY);        
            } else if (!current || (current.indexOf && current.indexOf(PX) > -1)) { // no need to convert
                value = current;
            } else if (Y.Dom.IE_COMPUTED[property]) { // use compute function
                value = Y.Dom.IE_COMPUTED[property](el, property);
            } else if (re_unit.test(current)) { // convert to pixel
                value = Y.Dom.IE.ComputedStyle.getPixel(el, property);
            } else {
                value = current;
            }

            return value;
        },

        getOffset: function(el, prop) {
            var current = el[CURRENT_STYLE][prop],                        // value of "width", "top", etc.
                capped = prop.charAt(0).toUpperCase() + prop.substr(1), // "Width", "Top", etc.
                offset = 'offset' + capped,                             // "offsetWidth", "offsetTop", etc.
                pixel = 'pixel' + capped,                               // "pixelWidth", "pixelTop", etc.
                value = '',
                actual;

            if (current == AUTO) {
                actual = el[offset]; // offsetHeight/Top etc.
                if (actual === undefined) { // likely "right" or "bottom"
                    value = 0;
                }

                value = actual;
                if (re_size.test(prop)) { // account for box model diff 
                    el[STYLE][prop] = actual; 
                    if (el[offset] > actual) {
                        // the difference is padding + border (works in Standards & Quirks modes)
                        value = actual - (el[offset] - actual);
                    }
                    el[STYLE][prop] = AUTO; // revert to auto
                }
            } else { // convert units to px
                if (!el[STYLE][pixel] && !el[STYLE][prop]) { // need to map style.width to currentStyle (no currentStyle.pixelWidth)
                    el[STYLE][prop] = current;              // no style.pixelWidth if no style.width
                }
                value = el[STYLE][pixel];
            }
            return value + PX;
        },

        getBorderWidth: function(el, property) {
            // clientHeight/Width = paddingBox (e.g. offsetWidth - borderWidth)
            // clientTop/Left = borderWidth
            var value = null;
            if (!el[CURRENT_STYLE][HAS_LAYOUT]) { // TODO: unset layout?
                el[STYLE].zoom = 1; // need layout to measure client
            }

            switch(property) {
                case BORDER_TOP_WIDTH:
                    value = el[CLIENT_TOP];
                    break;
                case BORDER_BOTTOM_WIDTH:
                    value = el.offsetHeight - el.clientHeight - el[CLIENT_TOP];
                    break;
                case BORDER_LEFT_WIDTH:
                    value = el[CLIENT_LEFT];
                    break;
                case BORDER_RIGHT_WIDTH:
                    value = el.offsetWidth - el.clientWidth - el[CLIENT_LEFT];
                    break;
            }
            return value + PX;
        },

        getPixel: function(node, att) {
            // use pixelRight to convert to px
            var val = null,
                styleRight = node[CURRENT_STYLE][RIGHT],
                current = node[CURRENT_STYLE][att];

            node[STYLE][RIGHT] = current;
            val = node[STYLE].pixelRight;
            node[STYLE][RIGHT] = styleRight; // revert

            return val + PX;
        },

        getMargin: function(node, att) {
            var val;
            if (node[CURRENT_STYLE][att] == AUTO) {
                val = 0 + PX;
            } else {
                val = Y.Dom.IE.ComputedStyle.getPixel(node, att);
            }
            return val;
        },

        getVisibility: function(node, att) {
            var current;
            while ( (current = node[CURRENT_STYLE]) && current[att] == 'inherit') { // NOTE: assignment in test
                node = node[PARENT_NODE];
            }
            return (current) ? current[att] : VISIBLE;
        },

        getColor: function(node, att) {
            return Y.Dom.Color.toRGB(node[CURRENT_STYLE][att]) || TRANSPARENT;
        },

        getBorderColor: function(node, att) {
            var current = node[CURRENT_STYLE],
                val = current[att] || current.color;
            return Y.Dom.Color.toRGB(Y.Dom.Color.toHex(val));
        }

    },

//fontSize: getPixelFont,
    IEComputed = {};

IEComputed.top = IEComputed.right = IEComputed.bottom = IEComputed.left = 
        IEComputed[WIDTH] = IEComputed[HEIGHT] = ComputedStyle.getOffset;

IEComputed.color = ComputedStyle.getColor;

IEComputed[BORDER_TOP_WIDTH] = IEComputed[BORDER_RIGHT_WIDTH] =
        IEComputed[BORDER_BOTTOM_WIDTH] = IEComputed[BORDER_LEFT_WIDTH] =
        ComputedStyle.getBorderWidth;

IEComputed.marginTop = IEComputed.marginRight = IEComputed.marginBottom =
        IEComputed.marginLeft = ComputedStyle.getMargin;

IEComputed.visibility = ComputedStyle.getVisibility;
IEComputed.borderColor = IEComputed.borderTopColor =
        IEComputed.borderRightColor = IEComputed.borderBottomColor =
        IEComputed.borderLeftColor = ComputedStyle.getBorderColor;

Y.Dom.IE_COMPUTED = IEComputed;
Y.Dom.IE_ComputedStyle = ComputedStyle;
})();
(function() {
/**
 * Add style management functionality to DOM.
 * @module dom
 * @for Dom
 */

var TO_STRING = 'toString',
    PARSE_INT = parseInt,
    RE = RegExp,
    Y = YAHOO.util;

Y.Dom.Color = {
    KEYWORDS: {
        black: '000',
        silver: 'c0c0c0',
        gray: '808080',
        white: 'fff',
        maroon: '800000',
        red: 'f00',
        purple: '800080',
        fuchsia: 'f0f',
        green: '008000',
        lime: '0f0',
        olive: '808000',
        yellow: 'ff0',
        navy: '000080',
        blue: '00f',
        teal: '008080',
        aqua: '0ff'
    },

    re_RGB: /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
    re_hex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
    re_hex3: /([0-9A-F])/gi,

    toRGB: function(val) {
        if (!Y.Dom.Color.re_RGB.test(val)) {
            val = Y.Dom.Color.toHex(val);
        }

        if(Y.Dom.Color.re_hex.exec(val)) {
            val = 'rgb(' + [
                PARSE_INT(RE.$1, 16),
                PARSE_INT(RE.$2, 16),
                PARSE_INT(RE.$3, 16)
            ].join(', ') + ')';
        }
        return val;
    },

    toHex: function(val) {
        val = Y.Dom.Color.KEYWORDS[val] || val;
        if (Y.Dom.Color.re_RGB.exec(val)) {
            var r = (RE.$1.length === 1) ? '0' + RE.$1 : Number(RE.$1),
                g = (RE.$2.length === 1) ? '0' + RE.$2 : Number(RE.$2),
                b = (RE.$3.length === 1) ? '0' + RE.$3 : Number(RE.$3);

            val = [
                r[TO_STRING](16),
                g[TO_STRING](16),
                b[TO_STRING](16)
            ].join('');
        }

        if (val.length < 6) {
            val = val.replace(Y.Dom.Color.re_hex3, '$1$1');
        }

        if (val !== 'transparent' && val.indexOf('#') < 0) {
            val = '#' + val;
        }

        return val.toLowerCase();
    }
};
}());
YAHOO.register("dom", YAHOO.util.Dom, {version: "2.7.0", build: "1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/

/**
 * The CustomEvent class lets you define events for your application
 * that can be subscribed to by one or more independent component.
 *
 * @param {String}  type The type of event, which is passed to the callback
 *                  when the event fires
 * @param {Object}  context The context the event will fire from.  "this" will
 *                  refer to this object in the callback.  Default value: 
 *                  the window object.  The listener can override this.
 * @param {boolean} silent pass true to prevent the event from writing to
 *                  the debugsystem
 * @param {int}     signature the signature that the custom event subscriber
 *                  will receive. YAHOO.util.CustomEvent.LIST or 
 *                  YAHOO.util.CustomEvent.FLAT.  The default is
 *                  YAHOO.util.CustomEvent.LIST.
 * @namespace YAHOO.util
 * @class CustomEvent
 * @constructor
 */
YAHOO.util.CustomEvent = function(type, context, silent, signature) {

    /**
     * The type of event, returned to subscribers when the event fires
     * @property type
     * @type string
     */
    this.type = type;

    /**
     * The context the the event will fire from by default.  Defaults to the window 
     * obj
     * @property scope
     * @type object
     */
    this.scope = context || window;

    /**
     * By default all custom events are logged in the debug build, set silent
     * to true to disable debug outpu for this event.
     * @property silent
     * @type boolean
     */
    this.silent = silent;

    /**
     * Custom events support two styles of arguments provided to the event
     * subscribers.  
     * <ul>
     * <li>YAHOO.util.CustomEvent.LIST: 
     *   <ul>
     *   <li>param1: event name</li>
     *   <li>param2: array of arguments sent to fire</li>
     *   <li>param3: <optional> a custom object supplied by the subscriber</li>
     *   </ul>
     * </li>
     * <li>YAHOO.util.CustomEvent.FLAT
     *   <ul>
     *   <li>param1: the first argument passed to fire.  If you need to
     *           pass multiple parameters, use and array or object literal</li>
     *   <li>param2: <optional> a custom object supplied by the subscriber</li>
     *   </ul>
     * </li>
     * </ul>
     *   @property signature
     *   @type int
     */
    this.signature = signature || YAHOO.util.CustomEvent.LIST;

    /**
     * The subscribers to this event
     * @property subscribers
     * @type Subscriber[]
     */
    this.subscribers = [];

    if (!this.silent) {
    }

    var onsubscribeType = "_YUICEOnSubscribe";

    // Only add subscribe events for events that are not generated by 
    // CustomEvent
    if (type !== onsubscribeType) {

        /**
         * Custom events provide a custom event that fires whenever there is
         * a new subscriber to the event.  This provides an opportunity to
         * handle the case where there is a non-repeating event that has
         * already fired has a new subscriber.  
         *
         * @event subscribeEvent
         * @type YAHOO.util.CustomEvent
         * @param {Function} fn The function to execute
         * @param {Object}   obj An object to be passed along when the event 
         *                       fires defaults to the custom event
         * @param {boolean|Object}  override If true, the obj passed in becomes 
         *                                   the execution context of the listener.
         *                                   if an object, that object becomes the
         *                                   the execution context. defaults to
         *                                   the custom event
         */
        this.subscribeEvent = 
                new YAHOO.util.CustomEvent(onsubscribeType, this, true);

    } 


    /**
     * In order to make it possible to execute the rest of the subscriber
     * stack when one thows an exception, the subscribers exceptions are
     * caught.  The most recent exception is stored in this property
     * @property lastError
     * @type Error
     */
    this.lastError = null;
};

/**
 * Subscriber listener sigature constant.  The LIST type returns three
 * parameters: the event type, the array of args passed to fire, and
 * the optional custom object
 * @property YAHOO.util.CustomEvent.LIST
 * @static
 * @type int
 */
YAHOO.util.CustomEvent.LIST = 0;

/**
 * Subscriber listener sigature constant.  The FLAT type returns two
 * parameters: the first argument passed to fire and the optional 
 * custom object
 * @property YAHOO.util.CustomEvent.FLAT
 * @static
 * @type int
 */
YAHOO.util.CustomEvent.FLAT = 1;

YAHOO.util.CustomEvent.prototype = {

    /**
     * Subscribes the caller to this event
     * @method subscribe
     * @param {Function} fn        The function to execute
     * @param {Object}   obj       An object to be passed along when the event 
     *                             fires
     * @param {boolean|Object}  overrideContext If true, the obj passed in becomes 
     *                                   the execution context of the listener.
     *                                   if an object, that object becomes the
     *                                   the execution context.
     */
    subscribe: function(fn, obj, overrideContext) {

        if (!fn) {
throw new Error("Invalid callback for subscriber to '" + this.type + "'");
        }

        if (this.subscribeEvent) {
            this.subscribeEvent.fire(fn, obj, overrideContext);
        }

        this.subscribers.push( new YAHOO.util.Subscriber(fn, obj, overrideContext) );
    },

    /**
     * Unsubscribes subscribers.
     * @method unsubscribe
     * @param {Function} fn  The subscribed function to remove, if not supplied
     *                       all will be removed
     * @param {Object}   obj  The custom object passed to subscribe.  This is
     *                        optional, but if supplied will be used to
     *                        disambiguate multiple listeners that are the same
     *                        (e.g., you subscribe many object using a function
     *                        that lives on the prototype)
     * @return {boolean} True if the subscriber was found and detached.
     */
    unsubscribe: function(fn, obj) {

        if (!fn) {
            return this.unsubscribeAll();
        }

        var found = false;
        for (var i=0, len=this.subscribers.length; i<len; ++i) {
            var s = this.subscribers[i];
            if (s && s.contains(fn, obj)) {
                this._delete(i);
                found = true;
            }
        }

        return found;
    },

    /**
     * Notifies the subscribers.  The callback functions will be executed
     * from the context specified when the event was created, and with the 
     * following parameters:
     *   <ul>
     *   <li>The type of event</li>
     *   <li>All of the arguments fire() was executed with as an array</li>
     *   <li>The custom object (if any) that was passed into the subscribe() 
     *       method</li>
     *   </ul>
     * @method fire 
     * @param {Object*} arguments an arbitrary set of parameters to pass to 
     *                            the handler.
     * @return {boolean} false if one of the subscribers returned false, 
     *                   true otherwise
     */
    fire: function() {

        this.lastError = null;

        var errors = [],
            len=this.subscribers.length;

        if (!len && this.silent) {
            return true;
        }

        var args=[].slice.call(arguments, 0), ret=true, i, rebuild=false;

        if (!this.silent) {
        }

        // make a copy of the subscribers so that there are
        // no index problems if one subscriber removes another.
        var subs = this.subscribers.slice(), throwErrors = YAHOO.util.Event.throwErrors;

        for (i=0; i<len; ++i) {
            var s = subs[i];
            if (!s) {
                rebuild=true;
            } else {
                if (!this.silent) {
                }

                var scope = s.getScope(this.scope);

                if (this.signature == YAHOO.util.CustomEvent.FLAT) {
                    var param = null;
                    if (args.length > 0) {
                        param = args[0];
                    }

                    try {
                        ret = s.fn.call(scope, param, s.obj);
                    } catch(e) {
                        this.lastError = e;
                        // errors.push(e);
                        if (throwErrors) {
                            throw e;
                        }
                    }
                } else {
                    try {
                        ret = s.fn.call(scope, this.type, args, s.obj);
                    } catch(ex) {
                        this.lastError = ex;
                        if (throwErrors) {
                            throw ex;
                        }
                    }
                }

                if (false === ret) {
                    if (!this.silent) {
                    }

                    break;
                    // return false;
                }
            }
        }

        return (ret !== false);
    },

    /**
     * Removes all listeners
     * @method unsubscribeAll
     * @return {int} The number of listeners unsubscribed
     */
    unsubscribeAll: function() {
        var l = this.subscribers.length, i;
        for (i=l-1; i>-1; i--) {
            this._delete(i);
        }

        this.subscribers=[];

        return l;
    },

    /**
     * @method _delete
     * @private
     */
    _delete: function(index) {
        var s = this.subscribers[index];
        if (s) {
            delete s.fn;
            delete s.obj;
        }

        // this.subscribers[index]=null;
        this.subscribers.splice(index, 1);
    },

    /**
     * @method toString
     */
    toString: function() {
         return "CustomEvent: " + "'" + this.type  + "', " + 
             "context: " + this.scope;

    }
};

/////////////////////////////////////////////////////////////////////

/**
 * Stores the subscriber information to be used when the event fires.
 * @param {Function} fn       The function to execute
 * @param {Object}   obj      An object to be passed along when the event fires
 * @param {boolean}  overrideContext If true, the obj passed in becomes the execution
 *                            context of the listener
 * @class Subscriber
 * @constructor
 */
YAHOO.util.Subscriber = function(fn, obj, overrideContext) {

    /**
     * The callback that will be execute when the event fires
     * @property fn
     * @type function
     */
    this.fn = fn;

    /**
     * An optional custom object that will passed to the callback when
     * the event fires
     * @property obj
     * @type object
     */
    this.obj = YAHOO.lang.isUndefined(obj) ? null : obj;

    /**
     * The default execution context for the event listener is defined when the
     * event is created (usually the object which contains the event).
     * By setting overrideContext to true, the execution context becomes the custom
     * object passed in by the subscriber.  If overrideContext is an object, that 
     * object becomes the context.
     * @property overrideContext
     * @type boolean|object
     */
    this.overrideContext = overrideContext;

};

/**
 * Returns the execution context for this listener.  If overrideContext was set to true
 * the custom obj will be the context.  If overrideContext is an object, that is the
 * context, otherwise the default context will be used.
 * @method getScope
 * @param {Object} defaultScope the context to use if this listener does not
 *                              override it.
 */
YAHOO.util.Subscriber.prototype.getScope = function(defaultScope) {
    if (this.overrideContext) {
        if (this.overrideContext === true) {
            return this.obj;
        } else {
            return this.overrideContext;
        }
    }
    return defaultScope;
};

/**
 * Returns true if the fn and obj match this objects properties.
 * Used by the unsubscribe method to match the right subscriber.
 *
 * @method contains
 * @param {Function} fn the function to execute
 * @param {Object} obj an object to be passed along when the event fires
 * @return {boolean} true if the supplied arguments match this 
 *                   subscriber's signature.
 */
YAHOO.util.Subscriber.prototype.contains = function(fn, obj) {
    if (obj) {
        return (this.fn == fn && this.obj == obj);
    } else {
        return (this.fn == fn);
    }
};

/**
 * @method toString
 */
YAHOO.util.Subscriber.prototype.toString = function() {
    return "Subscriber { obj: " + this.obj  + 
           ", overrideContext: " +  (this.overrideContext || "no") + " }";
};

/**
 * The Event Utility provides utilities for managing DOM Events and tools
 * for building event systems
 *
 * @module event
 * @title Event Utility
 * @namespace YAHOO.util
 * @requires yahoo
 */

// The first instance of Event will win if it is loaded more than once.
// @TODO this needs to be changed so that only the state data that needs to
// be preserved is kept, while methods are overwritten/added as needed.
// This means that the module pattern can't be used.
if (!YAHOO.util.Event) {

/**
 * The event utility provides functions to add and remove event listeners,
 * event cleansing.  It also tries to automatically remove listeners it
 * registers during the unload event.
 *
 * @class Event
 * @static
 */
    YAHOO.util.Event = function() {

        /**
         * True after the onload event has fired
         * @property loadComplete
         * @type boolean
         * @static
         * @private
         */
        var loadComplete =  false;

        /**
         * Cache of wrapped listeners
         * @property listeners
         * @type array
         * @static
         * @private
         */
        var listeners = [];

        /**
         * User-defined unload function that will be fired before all events
         * are detached
         * @property unloadListeners
         * @type array
         * @static
         * @private
         */
        var unloadListeners = [];

        /**
         * Cache of DOM0 event handlers to work around issues with DOM2 events
         * in Safari
         * @property legacyEvents
         * @static
         * @private
         */
        var legacyEvents = [];

        /**
         * Listener stack for DOM0 events
         * @property legacyHandlers
         * @static
         * @private
         */
        var legacyHandlers = [];

        /**
         * The number of times to poll after window.onload.  This number is
         * increased if additional late-bound handlers are requested after
         * the page load.
         * @property retryCount
         * @static
         * @private
         */
        var retryCount = 0;

        /**
         * onAvailable listeners
         * @property onAvailStack
         * @static
         * @private
         */
        var onAvailStack = [];

        /**
         * Lookup table for legacy events
         * @property legacyMap
         * @static
         * @private
         */
        var legacyMap = [];

        /**
         * Counter for auto id generation
         * @property counter
         * @static
         * @private
         */
        var counter = 0;
        
        /**
         * Normalized keycodes for webkit/safari
         * @property webkitKeymap
         * @type {int: int}
         * @private
         * @static
         * @final
         */
        var webkitKeymap = {
            63232: 38, // up
            63233: 40, // down
            63234: 37, // left
            63235: 39, // right
            63276: 33, // page up
            63277: 34, // page down
            25: 9      // SHIFT-TAB (Safari provides a different key code in
                       // this case, even though the shiftKey modifier is set)
        };
        
        // String constants used by the addFocusListener and removeFocusListener methods
        var _FOCUS = YAHOO.env.ua.ie ? "focusin" : "focus";
        var _BLUR = YAHOO.env.ua.ie ? "focusout" : "blur";      

        return {

            /**
             * The number of times we should look for elements that are not
             * in the DOM at the time the event is requested after the document
             * has been loaded.  The default is 2000@amp;20 ms, so it will poll
             * for 40 seconds or until all outstanding handlers are bound
             * (whichever comes first).
             * @property POLL_RETRYS
             * @type int
             * @static
             * @final
             */
            POLL_RETRYS: 2000,

            /**
             * The poll interval in milliseconds
             * @property POLL_INTERVAL
             * @type int
             * @static
             * @final
             */
            POLL_INTERVAL: 20,

            /**
             * Element to bind, int constant
             * @property EL
             * @type int
             * @static
             * @final
             */
            EL: 0,

            /**
             * Type of event, int constant
             * @property TYPE
             * @type int
             * @static
             * @final
             */
            TYPE: 1,

            /**
             * Function to execute, int constant
             * @property FN
             * @type int
             * @static
             * @final
             */
            FN: 2,

            /**
             * Function wrapped for context correction and cleanup, int constant
             * @property WFN
             * @type int
             * @static
             * @final
             */
            WFN: 3,

            /**
             * Object passed in by the user that will be returned as a 
             * parameter to the callback, int constant.  Specific to
             * unload listeners
             * @property OBJ
             * @type int
             * @static
             * @final
             */
            UNLOAD_OBJ: 3,

            /**
             * Adjusted context, either the element we are registering the event
             * on or the custom object passed in by the listener, int constant
             * @property ADJ_SCOPE
             * @type int
             * @static
             * @final
             */
            ADJ_SCOPE: 4,

            /**
             * The original obj passed into addListener
             * @property OBJ
             * @type int
             * @static
             * @final
             */
            OBJ: 5,

            /**
             * The original context parameter passed into addListener
             * @property OVERRIDE
             * @type int
             * @static
             * @final
             */
            OVERRIDE: 6,

            /**
             * addListener/removeListener can throw errors in unexpected scenarios.
             * These errors are suppressed, the method returns false, and this property
             * is set
             * @property lastError
             * @static
             * @type Error
             */
            lastError: null,

            /**
             * Safari detection
             * @property isSafari
             * @private
             * @static
             * @deprecated use YAHOO.env.ua.webkit
             */
            isSafari: YAHOO.env.ua.webkit,
            
            /**
             * webkit version
             * @property webkit
             * @type string
             * @private
             * @static
             * @deprecated use YAHOO.env.ua.webkit
             */
            webkit: YAHOO.env.ua.webkit,
            
            /**
             * IE detection 
             * @property isIE
             * @private
             * @static
             * @deprecated use YAHOO.env.ua.ie
             */
            isIE: YAHOO.env.ua.ie,

            /**
             * poll handle
             * @property _interval
             * @static
             * @private
             */
            _interval: null,

            /**
             * document readystate poll handle
             * @property _dri
             * @static
             * @private
             */
             _dri: null,

            /**
             * True when the document is initially usable
             * @property DOMReady
             * @type boolean
             * @static
             */
            DOMReady: false,

            /**
             * Errors thrown by subscribers of custom events are caught
             * and the error message is written to the debug console.  If
             * this property is set to true, it will also re-throw the
             * error.
             * @property throwErrors
             * @type boolean
             * @default false
             */
            throwErrors: false,

            /**
             * @method startInterval
             * @static
             * @private
             */
            startInterval: function() {
                if (!this._interval) {
                    var self = this;
                    var callback = function() { self._tryPreloadAttach(); };
                    this._interval = setInterval(callback, this.POLL_INTERVAL);
                }
            },

            /**
             * Executes the supplied callback when the item with the supplied
             * id is found.  This is meant to be used to execute behavior as
             * soon as possible as the page loads.  If you use this after the
             * initial page load it will poll for a fixed time for the element.
             * The number of times it will poll and the frequency are
             * configurable.  By default it will poll for 10 seconds.
             *
             * <p>The callback is executed with a single parameter:
             * the custom object parameter, if provided.</p>
             *
             * @method onAvailable
             *
             * @param {string||string[]}   id the id of the element, or an array
             * of ids to look for.
             * @param {function} fn what to execute when the element is found.
             * @param {object}   obj an optional object to be passed back as
             *                   a parameter to fn.
             * @param {boolean|object}  overrideContext If set to true, fn will execute
             *                   in the context of obj, if set to an object it
             *                   will execute in the context of that object
             * @param checkContent {boolean} check child node readiness (onContentReady)
             * @static
             */
            onAvailable: function(id, fn, obj, overrideContext, checkContent) {

                var a = (YAHOO.lang.isString(id)) ? [id] : id;

                for (var i=0; i<a.length; i=i+1) {
                    onAvailStack.push({id:         a[i], 
                                       fn:         fn, 
                                       obj:        obj, 
                                       overrideContext:   overrideContext, 
                                       checkReady: checkContent });
                }

                retryCount = this.POLL_RETRYS;

                this.startInterval();
            },

            /**
             * Works the same way as onAvailable, but additionally checks the
             * state of sibling elements to determine if the content of the
             * available element is safe to modify.
             *
             * <p>The callback is executed with a single parameter:
             * the custom object parameter, if provided.</p>
             *
             * @method onContentReady
             *
             * @param {string}   id the id of the element to look for.
             * @param {function} fn what to execute when the element is ready.
             * @param {object}   obj an optional object to be passed back as
             *                   a parameter to fn.
             * @param {boolean|object}  overrideContext If set to true, fn will execute
             *                   in the context of obj.  If an object, fn will
             *                   exectute in the context of that object
             *
             * @static
             */
            onContentReady: function(id, fn, obj, overrideContext) {
                this.onAvailable(id, fn, obj, overrideContext, true);
            },

            /**
             * Executes the supplied callback when the DOM is first usable.  This
             * will execute immediately if called after the DOMReady event has
             * fired.   @todo the DOMContentReady event does not fire when the
             * script is dynamically injected into the page.  This means the
             * DOMReady custom event will never fire in FireFox or Opera when the
             * library is injected.  It _will_ fire in Safari, and the IE 
             * implementation would allow for us to fire it if the defered script
             * is not available.  We want this to behave the same in all browsers.
             * Is there a way to identify when the script has been injected 
             * instead of included inline?  Is there a way to know whether the 
             * window onload event has fired without having had a listener attached 
             * to it when it did so?
             *
             * <p>The callback is a CustomEvent, so the signature is:</p>
             * <p>type &lt;string&gt;, args &lt;array&gt;, customobject &lt;object&gt;</p>
             * <p>For DOMReady events, there are no fire argments, so the
             * signature is:</p>
             * <p>"DOMReady", [], obj</p>
             *
             *
             * @method onDOMReady
             *
             * @param {function} fn what to execute when the element is found.
             * @param {object}   obj an optional object to be passed back as
             *                   a parameter to fn.
             * @param {boolean|object}  overrideContext If set to true, fn will execute
             *                   in the context of obj, if set to an object it
             *                   will execute in the context of that object
             *
             * @static
             */
            onDOMReady: function(fn, obj, overrideContext) {
                if (this.DOMReady) {
                    setTimeout(function() {
                        var s = window;
                        if (overrideContext) {
                            if (overrideContext === true) {
                                s = obj;
                            } else {
                                s = overrideContext;
                            }
                        }
                        fn.call(s, "DOMReady", [], obj);
                    }, 0);
                } else {
                    this.DOMReadyEvent.subscribe(fn, obj, overrideContext);
                }
            },


            /**
             * Appends an event handler
             *
             * @method _addListener
             *
             * @param {String|HTMLElement|Array|NodeList} el An id, an element 
             *  reference, or a collection of ids and/or elements to assign the 
             *  listener to.
             * @param {String}   sType     The type of event to append
             * @param {Function} fn        The method the event invokes
             * @param {Object}   obj    An arbitrary object that will be 
             *                             passed as a parameter to the handler
             * @param {Boolean|object}  overrideContext  If true, the obj passed in becomes
             *                             the execution context of the listener. If an
             *                             object, this object becomes the execution
             *                             context.
             * @param {boolen}      capture capture or bubble phase
             * @return {Boolean} True if the action was successful or defered,
             *                        false if one or more of the elements 
             *                        could not have the listener attached,
             *                        or if the operation throws an exception.
             * @private
             * @static
             */
            _addListener: function(el, sType, fn, obj, overrideContext, bCapture) {

                if (!fn || !fn.call) {
                    return false;
                }

                // The el argument can be an array of elements or element ids.
                if ( this._isValidCollection(el)) {
                    var ok = true;
                    for (var i=0,len=el.length; i<len; ++i) {
                        ok = this.on(el[i], 
                                       sType, 
                                       fn, 
                                       obj, 
                                       overrideContext) && ok;
                    }
                    return ok;

                } else if (YAHOO.lang.isString(el)) {
                    var oEl = this.getEl(el);
                    // If the el argument is a string, we assume it is 
                    // actually the id of the element.  If the page is loaded
                    // we convert el to the actual element, otherwise we 
                    // defer attaching the event until onload event fires

                    // check to see if we need to delay hooking up the event 
                    // until after the page loads.
                    if (oEl) {
                        el = oEl;
                    } else {
                        // defer adding the event until the element is available
                        this.onAvailable(el, function() {
                           YAHOO.util.Event.on(el, sType, fn, obj, overrideContext);
                        });

                        return true;
                    }
                }

                // Element should be an html element or an array if we get 
                // here.
                if (!el) {
                    return false;
                }

                // we need to make sure we fire registered unload events 
                // prior to automatically unhooking them.  So we hang on to 
                // these instead of attaching them to the window and fire the
                // handles explicitly during our one unload event.
                if ("unload" == sType && obj !== this) {
                    unloadListeners[unloadListeners.length] =
                            [el, sType, fn, obj, overrideContext];
                    return true;
                }


                // if the user chooses to override the context, we use the custom
                // object passed in, otherwise the executing context will be the
                // HTML element that the event is registered on
                var context = el;
                if (overrideContext) {
                    if (overrideContext === true) {
                        context = obj;
                    } else {
                        context = overrideContext;
                    }
                }

                // wrap the function so we can return the obj object when
                // the event fires;
                var wrappedFn = function(e) {
                        return fn.call(context, YAHOO.util.Event.getEvent(e, el), 
                                obj);
                    };

                var li = [el, sType, fn, wrappedFn, context, obj, overrideContext];
                var index = listeners.length;
                // cache the listener so we can try to automatically unload
                listeners[index] = li;

                if (this.useLegacyEvent(el, sType)) {
                    var legacyIndex = this.getLegacyIndex(el, sType);

                    // Add a new dom0 wrapper if one is not detected for this
                    // element
                    if ( legacyIndex == -1 || 
                                el != legacyEvents[legacyIndex][0] ) {

                        legacyIndex = legacyEvents.length;
                        legacyMap[el.id + sType] = legacyIndex;

                        // cache the signature for the DOM0 event, and 
                        // include the existing handler for the event, if any
                        legacyEvents[legacyIndex] = 
                            [el, sType, el["on" + sType]];
                        legacyHandlers[legacyIndex] = [];

                        el["on" + sType] = 
                            function(e) {
                                YAHOO.util.Event.fireLegacyEvent(
                                    YAHOO.util.Event.getEvent(e), legacyIndex);
                            };
                    }

                    // add a reference to the wrapped listener to our custom
                    // stack of events
                    //legacyHandlers[legacyIndex].push(index);
                    legacyHandlers[legacyIndex].push(li);

                } else {
                    try {
                        this._simpleAdd(el, sType, wrappedFn, bCapture);
                    } catch(ex) {
                        // handle an error trying to attach an event.  If it fails
                        // we need to clean up the cache
                        this.lastError = ex;
                        this.removeListener(el, sType, fn);
                        return false;
                    }
                }

                return true;
                
            },


            /**
             * Appends an event handler
             *
             * @method addListener
             *
             * @param {String|HTMLElement|Array|NodeList} el An id, an element 
             *  reference, or a collection of ids and/or elements to assign the 
             *  listener to.
             * @param {String}   sType     The type of event to append
             * @param {Function} fn        The method the event invokes
             * @param {Object}   obj    An arbitrary object that will be 
             *                             passed as a parameter to the handler
             * @param {Boolean|object}  overrideContext  If true, the obj passed in becomes
             *                             the execution context of the listener. If an
             *                             object, this object becomes the execution
             *                             context.
             * @return {Boolean} True if the action was successful or defered,
             *                        false if one or more of the elements 
             *                        could not have the listener attached,
             *                        or if the operation throws an exception.
             * @static
             */
            addListener: function (el, sType, fn, obj, overrideContext) {
                return this._addListener(el, sType, fn, obj, overrideContext, false);
            },

            /**
             * Appends a focus event handler.  (The focusin event is used for Internet Explorer, 
             * the focus, capture-event for Opera, WebKit.)
             *
             * @method addFocusListener
             *
             * @param {String|HTMLElement|Array|NodeList} el An id, an element 
             *  reference, or a collection of ids and/or elements to assign the 
             *  listener to.
             * @param {Function} fn        The method the event invokes
             * @param {Object}   obj    An arbitrary object that will be 
             *                             passed as a parameter to the handler
             * @param {Boolean|object}  overrideContext  If true, the obj passed in becomes
             *                             the execution context of the listener. If an
             *                             object, this object becomes the execution
             *                             context.
             * @return {Boolean} True if the action was successful or defered,
             *                        false if one or more of the elements 
             *                        could not have the listener attached,
             *                        or if the operation throws an exception.
             * @static
             */
            addFocusListener: function (el, fn, obj, overrideContext) {
                return this._addListener(el, _FOCUS, fn, obj, overrideContext, true);
            },          


            /**
             * Removes a focus event listener
             *
             * @method removeListener
             *
             * @param {String|HTMLElement|Array|NodeList} el An id, an element 
             *  reference, or a collection of ids and/or elements to remove
             *  the listener from.
             * @param {Function} fn the method the event invokes.  If fn is
             *  undefined, then all event handlers for the type of event are 
             *  removed.
             * @return {boolean} true if the unbind was successful, false 
             *  otherwise.
             * @static
             */
            removeFocusListener: function (el, fn) { 
                return this.removeListener(el, _FOCUS, fn);
            },

            /**
             * Appends a blur event handler.  (The focusout event is used for Internet Explorer, 
             * the focusout, capture-event for Opera, WebKit.)
             *
             * @method addBlurListener
             *
             * @param {String|HTMLElement|Array|NodeList} el An id, an element 
             *  reference, or a collection of ids and/or elements to assign the 
             *  listener to.
             * @param {Function} fn        The method the event invokes
             * @param {Object}   obj    An arbitrary object that will be 
             *                             passed as a parameter to the handler
             * @param {Boolean|object}  overrideContext  If true, the obj passed in becomes
             *                             the execution context of the listener. If an
             *                             object, this object becomes the execution
             *                             context.
             * @return {Boolean} True if the action was successful or defered,
             *                        false if one or more of the elements 
             *                        could not have the listener attached,
             *                        or if the operation throws an exception.
             * @static
             */
            addBlurListener: function (el, fn, obj, overrideContext) {
                return this._addListener(el, _BLUR, fn, obj, overrideContext, true);
            },          

            /**
             * Removes a blur event listener
             *
             * @method removeListener
             *
             * @param {String|HTMLElement|Array|NodeList} el An id, an element 
             *  reference, or a collection of ids and/or elements to remove
             *  the listener from.
             * @param {Function} fn the method the event invokes.  If fn is
             *  undefined, then all event handlers for the type of event are 
             *  removed.
             * @return {boolean} true if the unbind was successful, false 
             *  otherwise.
             * @static
             */
            removeBlurListener: function (el, fn) { 
            
                return this.removeListener(el, _BLUR, fn);
            
            },

            /**
             * When using legacy events, the handler is routed to this object
             * so we can fire our custom listener stack.
             * @method fireLegacyEvent
             * @static
             * @private
             */
            fireLegacyEvent: function(e, legacyIndex) {
                var ok=true, le, lh, li, context, ret;
                
                lh = legacyHandlers[legacyIndex].slice();
                for (var i=0, len=lh.length; i<len; ++i) {
                // for (var i in lh.length) {
                    li = lh[i];
                    if ( li && li[this.WFN] ) {
                        context = li[this.ADJ_SCOPE];
                        ret = li[this.WFN].call(context, e);
                        ok = (ok && ret);
                    }
                }

                // Fire the original handler if we replaced one.  We fire this
                // after the other events to keep stopPropagation/preventDefault
                // that happened in the DOM0 handler from touching our DOM2
                // substitute
                le = legacyEvents[legacyIndex];
                if (le && le[2]) {
                    le[2](e);
                }
                
                return ok;
            },

            /**
             * Returns the legacy event index that matches the supplied 
             * signature
             * @method getLegacyIndex
             * @static
             * @private
             */
            getLegacyIndex: function(el, sType) {
                var key = this.generateId(el) + sType;
                if (typeof legacyMap[key] == "undefined") { 
                    return -1;
                } else {
                    return legacyMap[key];
                }
            },

            /**
             * Logic that determines when we should automatically use legacy
             * events instead of DOM2 events.  Currently this is limited to old
             * Safari browsers with a broken preventDefault
             * @method useLegacyEvent
             * @static
             * @private
             */
            useLegacyEvent: function(el, sType) {
return (this.webkit && this.webkit < 419 && ("click"==sType || "dblclick"==sType));
            },
                    
            /**
             * Removes an event listener
             *
             * @method removeListener
             *
             * @param {String|HTMLElement|Array|NodeList} el An id, an element 
             *  reference, or a collection of ids and/or elements to remove
             *  the listener from.
             * @param {String} sType the type of event to remove.
             * @param {Function} fn the method the event invokes.  If fn is
             *  undefined, then all event handlers for the type of event are 
             *  removed.
             * @return {boolean} true if the unbind was successful, false 
             *  otherwise.
             * @static
             */
            removeListener: function(el, sType, fn) {
                var i, len, li;

                // The el argument can be a string
                if (typeof el == "string") {
                    el = this.getEl(el);
                // The el argument can be an array of elements or element ids.
                } else if ( this._isValidCollection(el)) {
                    var ok = true;
                    for (i=el.length-1; i>-1; i--) {
                        ok = ( this.removeListener(el[i], sType, fn) && ok );
                    }
                    return ok;
                }

                if (!fn || !fn.call) {
                    //return false;
                    return this.purgeElement(el, false, sType);
                }

                if ("unload" == sType) {

                    for (i=unloadListeners.length-1; i>-1; i--) {
                        li = unloadListeners[i];
                        if (li && 
                            li[0] == el && 
                            li[1] == sType && 
                            li[2] == fn) {
                                unloadListeners.splice(i, 1);
                                // unloadListeners[i]=null;
                                return true;
                        }
                    }

                    return false;
                }

                var cacheItem = null;

                // The index is a hidden parameter; needed to remove it from
                // the method signature because it was tempting users to
                // try and take advantage of it, which is not possible.
                var index = arguments[3];
  
                if ("undefined" === typeof index) {
                    index = this._getCacheIndex(el, sType, fn);
                }

                if (index >= 0) {
                    cacheItem = listeners[index];
                }

                if (!el || !cacheItem) {
                    return false;
                }


                if (this.useLegacyEvent(el, sType)) {
                    var legacyIndex = this.getLegacyIndex(el, sType);
                    var llist = legacyHandlers[legacyIndex];
                    if (llist) {
                        for (i=0, len=llist.length; i<len; ++i) {
                        // for (i in llist.length) {
                            li = llist[i];
                            if (li && 
                                li[this.EL] == el && 
                                li[this.TYPE] == sType && 
                                li[this.FN] == fn) {
                                    llist.splice(i, 1);
                                    // llist[i]=null;
                                    break;
                            }
                        }
                    }

                } else {
                    try {
                        this._simpleRemove(el, sType, cacheItem[this.WFN], false);
                    } catch(ex) {
                        this.lastError = ex;
                        return false;
                    }
                }

                // removed the wrapped handler
                delete listeners[index][this.WFN];
                delete listeners[index][this.FN];
                listeners.splice(index, 1);
                // listeners[index]=null;

                return true;

            },

            /**
             * Returns the event's target element.  Safari sometimes provides
             * a text node, and this is automatically resolved to the text
             * node's parent so that it behaves like other browsers.
             * @method getTarget
             * @param {Event} ev the event
             * @param {boolean} resolveTextNode when set to true the target's
             *                  parent will be returned if the target is a 
             *                  text node.  @deprecated, the text node is
             *                  now resolved automatically
             * @return {HTMLElement} the event's target
             * @static
             */
            getTarget: function(ev, resolveTextNode) {
                var t = ev.target || ev.srcElement;
                return this.resolveTextNode(t);
            },

            /**
             * In some cases, some browsers will return a text node inside
             * the actual element that was targeted.  This normalizes the
             * return value for getTarget and getRelatedTarget.
             * @method resolveTextNode
             * @param {HTMLElement} node node to resolve
             * @return {HTMLElement} the normized node
             * @static
             */
            resolveTextNode: function(n) {
                try {
                    if (n && 3 == n.nodeType) {
                        return n.parentNode;
                    }
                } catch(e) { }

                return n;
            },

            /**
             * Returns the event's pageX
             * @method getPageX
             * @param {Event} ev the event
             * @return {int} the event's pageX
             * @static
             */
            getPageX: function(ev) {
                var x = ev.pageX;
                if (!x && 0 !== x) {
                    x = ev.clientX || 0;

                    if ( this.isIE ) {
                        x += this._getScrollLeft();
                    }
                }

                return x;
            },

            /**
             * Returns the event's pageY
             * @method getPageY
             * @param {Event} ev the event
             * @return {int} the event's pageY
             * @static
             */
            getPageY: function(ev) {
                var y = ev.pageY;
                if (!y && 0 !== y) {
                    y = ev.clientY || 0;

                    if ( this.isIE ) {
                        y += this._getScrollTop();
                    }
                }


                return y;
            },

            /**
             * Returns the pageX and pageY properties as an indexed array.
             * @method getXY
             * @param {Event} ev the event
             * @return {[x, y]} the pageX and pageY properties of the event
             * @static
             */
            getXY: function(ev) {
                return [this.getPageX(ev), this.getPageY(ev)];
            },

            /**
             * Returns the event's related target 
             * @method getRelatedTarget
             * @param {Event} ev the event
             * @return {HTMLElement} the event's relatedTarget
             * @static
             */
            getRelatedTarget: function(ev) {
                var t = ev.relatedTarget;
                if (!t) {
                    if (ev.type == "mouseout") {
                        t = ev.toElement;
                    } else if (ev.type == "mouseover") {
                        t = ev.fromElement;
                    }
                }

                return this.resolveTextNode(t);
            },

            /**
             * Returns the time of the event.  If the time is not included, the
             * event is modified using the current time.
             * @method getTime
             * @param {Event} ev the event
             * @return {Date} the time of the event
             * @static
             */
            getTime: function(ev) {
                if (!ev.time) {
                    var t = new Date().getTime();
                    try {
                        ev.time = t;
                    } catch(ex) { 
                        this.lastError = ex;
                        return t;
                    }
                }

                return ev.time;
            },

            /**
             * Convenience method for stopPropagation + preventDefault
             * @method stopEvent
             * @param {Event} ev the event
             * @static
             */
            stopEvent: function(ev) {
                this.stopPropagation(ev);
                this.preventDefault(ev);
            },

            /**
             * Stops event propagation
             * @method stopPropagation
             * @param {Event} ev the event
             * @static
             */
            stopPropagation: function(ev) {
                if (ev.stopPropagation) {
                    ev.stopPropagation();
                } else {
                    ev.cancelBubble = true;
                }
            },

            /**
             * Prevents the default behavior of the event
             * @method preventDefault
             * @param {Event} ev the event
             * @static
             */
            preventDefault: function(ev) {
                if (ev.preventDefault) {
                    ev.preventDefault();
                } else {
                    ev.returnValue = false;
                }
            },
             
            /**
             * Finds the event in the window object, the caller's arguments, or
             * in the arguments of another method in the callstack.  This is
             * executed automatically for events registered through the event
             * manager, so the implementer should not normally need to execute
             * this function at all.
             * @method getEvent
             * @param {Event} e the event parameter from the handler
             * @param {HTMLElement} boundEl the element the listener is attached to
             * @return {Event} the event 
             * @static
             */
            getEvent: function(e, boundEl) {
                var ev = e || window.event;

                if (!ev) {
                    var c = this.getEvent.caller;
                    while (c) {
                        ev = c.arguments[0];
                        if (ev && Event == ev.constructor) {
                            break;
                        }
                        c = c.caller;
                    }
                }

                return ev;
            },

            /**
             * Returns the charcode for an event
             * @method getCharCode
             * @param {Event} ev the event
             * @return {int} the event's charCode
             * @static
             */
            getCharCode: function(ev) {
                var code = ev.keyCode || ev.charCode || 0;

                // webkit key normalization
                if (YAHOO.env.ua.webkit && (code in webkitKeymap)) {
                    code = webkitKeymap[code];
                }
                return code;
            },

            /**
             * Locating the saved event handler data by function ref
             *
             * @method _getCacheIndex
             * @static
             * @private
             */
            _getCacheIndex: function(el, sType, fn) {
                for (var i=0, l=listeners.length; i<l; i=i+1) {
                    var li = listeners[i];
                    if ( li                 && 
                         li[this.FN] == fn  && 
                         li[this.EL] == el  && 
                         li[this.TYPE] == sType ) {
                        return i;
                    }
                }

                return -1;
            },

            /**
             * Generates an unique ID for the element if it does not already 
             * have one.
             * @method generateId
             * @param el the element to create the id for
             * @return {string} the resulting id of the element
             * @static
             */
            generateId: function(el) {
                var id = el.id;

                if (!id) {
                    id = "yuievtautoid-" + counter;
                    ++counter;
                    el.id = id;
                }

                return id;
            },


            /**
             * We want to be able to use getElementsByTagName as a collection
             * to attach a group of events to.  Unfortunately, different 
             * browsers return different types of collections.  This function
             * tests to determine if the object is array-like.  It will also 
             * fail if the object is an array, but is empty.
             * @method _isValidCollection
             * @param o the object to test
             * @return {boolean} true if the object is array-like and populated
             * @static
             * @private
             */
            _isValidCollection: function(o) {
                try {
                    return ( o                     && // o is something
                             typeof o !== "string" && // o is not a string
                             o.length              && // o is indexed
                             !o.tagName            && // o is not an HTML element
                             !o.alert              && // o is not a window
                             typeof o[0] !== "undefined" );
                } catch(ex) {
                    return false;
                }

            },

            /**
             * @private
             * @property elCache
             * DOM element cache
             * @static
             * @deprecated Elements are not cached due to issues that arise when
             * elements are removed and re-added
             */
            elCache: {},

            /**
             * We cache elements bound by id because when the unload event 
             * fires, we can no longer use document.getElementById
             * @method getEl
             * @static
             * @private
             * @deprecated Elements are not cached any longer
             */
            getEl: function(id) {
                return (typeof id === "string") ? document.getElementById(id) : id;
            },

            /**
             * Clears the element cache
             * @deprecated Elements are not cached any longer
             * @method clearCache
             * @static
             * @private
             */
            clearCache: function() { },

            /**
             * Custom event the fires when the dom is initially usable
             * @event DOMReadyEvent
             */
            DOMReadyEvent: new YAHOO.util.CustomEvent("DOMReady", this),

            /**
             * hook up any deferred listeners
             * @method _load
             * @static
             * @private
             */
            _load: function(e) {

                if (!loadComplete) {
                    loadComplete = true;
                    var EU = YAHOO.util.Event;

                    // Just in case DOMReady did not go off for some reason
                    EU._ready();

                    // Available elements may not have been detected before the
                    // window load event fires. Try to find them now so that the
                    // the user is more likely to get the onAvailable notifications
                    // before the window load notification
                    EU._tryPreloadAttach();

                }
            },

            /**
             * Fires the DOMReady event listeners the first time the document is
             * usable.
             * @method _ready
             * @static
             * @private
             */
            _ready: function(e) {
                var EU = YAHOO.util.Event;
                if (!EU.DOMReady) {
                    EU.DOMReady=true;

                    // Fire the content ready custom event
                    EU.DOMReadyEvent.fire();

                    // Remove the DOMContentLoaded (FF/Opera)
                    EU._simpleRemove(document, "DOMContentLoaded", EU._ready);
                }
            },

            /**
             * Polling function that runs before the onload event fires, 
             * attempting to attach to DOM Nodes as soon as they are 
             * available
             * @method _tryPreloadAttach
             * @static
             * @private
             */
            _tryPreloadAttach: function() {

                if (onAvailStack.length === 0) {
                    retryCount = 0;
                    if (this._interval) {
                        clearInterval(this._interval);
                        this._interval = null;
                    } 
                    return;
                }

                if (this.locked) {
                    return;
                }

                if (this.isIE) {
                    // Hold off if DOMReady has not fired and check current
                    // readyState to protect against the IE operation aborted
                    // issue.
                    if (!this.DOMReady) {
                        this.startInterval();
                        return;
                    }
                }

                this.locked = true;


                // keep trying until after the page is loaded.  We need to 
                // check the page load state prior to trying to bind the 
                // elements so that we can be certain all elements have been 
                // tested appropriately
                var tryAgain = !loadComplete;
                if (!tryAgain) {
                    tryAgain = (retryCount > 0 && onAvailStack.length > 0);
                }

                // onAvailable
                var notAvail = [];

                var executeItem = function (el, item) {
                    var context = el;
                    if (item.overrideContext) {
                        if (item.overrideContext === true) {
                            context = item.obj;
                        } else {
                            context = item.overrideContext;
                        }
                    }
                    item.fn.call(context, item.obj);
                };

                var i, len, item, el, ready=[];

                // onAvailable onContentReady
                for (i=0, len=onAvailStack.length; i<len; i=i+1) {
                    item = onAvailStack[i];
                    if (item) {
                        el = this.getEl(item.id);
                        if (el) {
                            if (item.checkReady) {
                                if (loadComplete || el.nextSibling || !tryAgain) {
                                    ready.push(item);
                                    onAvailStack[i] = null;
                                }
                            } else {
                                executeItem(el, item);
                                onAvailStack[i] = null;
                            }
                        } else {
                            notAvail.push(item);
                        }
                    }
                }
                
                // make sure onContentReady fires after onAvailable
                for (i=0, len=ready.length; i<len; i=i+1) {
                    item = ready[i];
                    executeItem(this.getEl(item.id), item);
                }


                retryCount--;

                if (tryAgain) {
                    for (i=onAvailStack.length-1; i>-1; i--) {
                        item = onAvailStack[i];
                        if (!item || !item.id) {
                            onAvailStack.splice(i, 1);
                        }
                    }

                    this.startInterval();
                } else {
                    if (this._interval) {
                        clearInterval(this._interval);
                        this._interval = null;
                    }
                }

                this.locked = false;

            },

            /**
             * Removes all listeners attached to the given element via addListener.
             * Optionally, the node's children can also be purged.
             * Optionally, you can specify a specific type of event to remove.
             * @method purgeElement
             * @param {HTMLElement} el the element to purge
             * @param {boolean} recurse recursively purge this element's children
             * as well.  Use with caution.
             * @param {string} sType optional type of listener to purge. If
             * left out, all listeners will be removed
             * @static
             */
            purgeElement: function(el, recurse, sType) {
                var oEl = (YAHOO.lang.isString(el)) ? this.getEl(el) : el;
                var elListeners = this.getListeners(oEl, sType), i, len;
                if (elListeners) {
                    for (i=elListeners.length-1; i>-1; i--) {
                        var l = elListeners[i];
                        this.removeListener(oEl, l.type, l.fn);
                    }
                }

                if (recurse && oEl && oEl.childNodes) {
                    for (i=0,len=oEl.childNodes.length; i<len ; ++i) {
                        this.purgeElement(oEl.childNodes[i], recurse, sType);
                    }
                }
            },

            /**
             * Returns all listeners attached to the given element via addListener.
             * Optionally, you can specify a specific type of event to return.
             * @method getListeners
             * @param el {HTMLElement|string} the element or element id to inspect 
             * @param sType {string} optional type of listener to return. If
             * left out, all listeners will be returned
             * @return {Object} the listener. Contains the following fields:
             * &nbsp;&nbsp;type:   (string)   the type of event
             * &nbsp;&nbsp;fn:     (function) the callback supplied to addListener
             * &nbsp;&nbsp;obj:    (object)   the custom object supplied to addListener
             * &nbsp;&nbsp;adjust: (boolean|object)  whether or not to adjust the default context
             * &nbsp;&nbsp;scope: (boolean)  the derived context based on the adjust parameter
             * &nbsp;&nbsp;index:  (int)      its position in the Event util listener cache
             * @static
             */           
            getListeners: function(el, sType) {
                var results=[], searchLists;
                if (!sType) {
                    searchLists = [listeners, unloadListeners];
                } else if (sType === "unload") {
                    searchLists = [unloadListeners];
                } else {
                    searchLists = [listeners];
                }

                var oEl = (YAHOO.lang.isString(el)) ? this.getEl(el) : el;

                for (var j=0;j<searchLists.length; j=j+1) {
                    var searchList = searchLists[j];
                    if (searchList) {
                        for (var i=0,len=searchList.length; i<len ; ++i) {
                            var l = searchList[i];
                            if ( l  && l[this.EL] === oEl && 
                                    (!sType || sType === l[this.TYPE]) ) {
                                results.push({
                                    type:   l[this.TYPE],
                                    fn:     l[this.FN],
                                    obj:    l[this.OBJ],
                                    adjust: l[this.OVERRIDE],
                                    scope:  l[this.ADJ_SCOPE],
                                    index:  i
                                });
                            }
                        }
                    }
                }

                return (results.length) ? results : null;
            },

            /**
             * Removes all listeners registered by pe.event.  Called 
             * automatically during the unload event.
             * @method _unload
             * @static
             * @private
             */
            _unload: function(e) {

                var EU = YAHOO.util.Event, i, j, l, len, index,
                         ul = unloadListeners.slice(), context;

                // execute and clear stored unload listeners
                for (i=0, len=unloadListeners.length; i<len; ++i) {
                    l = ul[i];
                    if (l) {
                        context = window;
                        if (l[EU.ADJ_SCOPE]) {
                            if (l[EU.ADJ_SCOPE] === true) {
                                context = l[EU.UNLOAD_OBJ];
                            } else {
                                context = l[EU.ADJ_SCOPE];
                            }
                        }
                        l[EU.FN].call(context, EU.getEvent(e, l[EU.EL]), l[EU.UNLOAD_OBJ] );
                        ul[i] = null;
                    }
                }

                l = null;
                context = null;
                unloadListeners = null;

                // Remove listeners to handle IE memory leaks
                //if (YAHOO.env.ua.ie && listeners && listeners.length > 0) {
                
                // 2.5.0 listeners are removed for all browsers again.  FireFox preserves
                // at least some listeners between page refreshes, potentially causing
                // errors during page load (mouseover listeners firing before they
                // should if the user moves the mouse at the correct moment).
                if (listeners) {
                    for (j=listeners.length-1; j>-1; j--) {
                        l = listeners[j];
                        if (l) {
                            EU.removeListener(l[EU.EL], l[EU.TYPE], l[EU.FN], j);
                        } 
                    }
                    l=null;
                }

                legacyEvents = null;

                EU._simpleRemove(window, "unload", EU._unload);

            },

            /**
             * Returns scrollLeft
             * @method _getScrollLeft
             * @static
             * @private
             */
            _getScrollLeft: function() {
                return this._getScroll()[1];
            },

            /**
             * Returns scrollTop
             * @method _getScrollTop
             * @static
             * @private
             */
            _getScrollTop: function() {
                return this._getScroll()[0];
            },

            /**
             * Returns the scrollTop and scrollLeft.  Used to calculate the 
             * pageX and pageY in Internet Explorer
             * @method _getScroll
             * @static
             * @private
             */
            _getScroll: function() {
                var dd = document.documentElement, db = document.body;
                if (dd && (dd.scrollTop || dd.scrollLeft)) {
                    return [dd.scrollTop, dd.scrollLeft];
                } else if (db) {
                    return [db.scrollTop, db.scrollLeft];
                } else {
                    return [0, 0];
                }
            },
            
            /**
             * Used by old versions of CustomEvent, restored for backwards
             * compatibility
             * @method regCE
             * @private
             * @static
             * @deprecated still here for backwards compatibility
             */
            regCE: function() {
                // does nothing
            },

            /**
             * Adds a DOM event directly without the caching, cleanup, context adj, etc
             *
             * @method _simpleAdd
             * @param {HTMLElement} el      the element to bind the handler to
             * @param {string}      sType   the type of event handler
             * @param {function}    fn      the callback to invoke
             * @param {boolen}      capture capture or bubble phase
             * @static
             * @private
             */
            _simpleAdd: function () {
                if (window.addEventListener) {
                    return function(el, sType, fn, capture) {
                        el.addEventListener(sType, fn, (capture));
                    };
                } else if (window.attachEvent) {
                    return function(el, sType, fn, capture) {
                        el.attachEvent("on" + sType, fn);
                    };
                } else {
                    return function(){};
                }
            }(),

            /**
             * Basic remove listener
             *
             * @method _simpleRemove
             * @param {HTMLElement} el      the element to bind the handler to
             * @param {string}      sType   the type of event handler
             * @param {function}    fn      the callback to invoke
             * @param {boolen}      capture capture or bubble phase
             * @static
             * @private
             */
            _simpleRemove: function() {
                if (window.removeEventListener) {
                    return function (el, sType, fn, capture) {
                        el.removeEventListener(sType, fn, (capture));
                    };
                } else if (window.detachEvent) {
                    return function (el, sType, fn) {
                        el.detachEvent("on" + sType, fn);
                    };
                } else {
                    return function(){};
                }
            }()
        };

    }();

    (function() {
        var EU = YAHOO.util.Event;

        /**
         * YAHOO.util.Event.on is an alias for addListener
         * @method on
         * @see addListener
         * @static
         */
        EU.on = EU.addListener;

        /**
         * YAHOO.util.Event.onFocus is an alias for addFocusListener
         * @method on
         * @see addFocusListener
         * @static
         */
        EU.onFocus = EU.addFocusListener;

        /**
         * YAHOO.util.Event.onBlur is an alias for addBlurListener
         * @method onBlur
         * @see addBlurListener
         * @static
         */     
        EU.onBlur = EU.addBlurListener;


/*! DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller */

        // Internet Explorer: use the readyState of a defered script.
        // This isolates what appears to be a safe moment to manipulate
        // the DOM prior to when the document's readyState suggests
        // it is safe to do so.
        if (EU.isIE) {

            // Process onAvailable/onContentReady items when the 
            // DOM is ready.
            YAHOO.util.Event.onDOMReady(
                    YAHOO.util.Event._tryPreloadAttach,
                    YAHOO.util.Event, true);
            
            var n = document.createElement('p');  

            EU._dri = setInterval(function() {
                try {
                    // throws an error if doc is not ready
                    n.doScroll('left');
                    clearInterval(EU._dri);
                    EU._dri = null;
                    EU._ready();
                    n = null;
                } catch (ex) { 
                }
            }, EU.POLL_INTERVAL); 

        
        // The document's readyState in Safari currently will
        // change to loaded/complete before images are loaded.
        } else if (EU.webkit && EU.webkit < 525) {

            EU._dri = setInterval(function() {
                var rs=document.readyState;
                if ("loaded" == rs || "complete" == rs) {
                    clearInterval(EU._dri);
                    EU._dri = null;
                    EU._ready();
                }
            }, EU.POLL_INTERVAL); 

        // FireFox and Opera: These browsers provide a event for this
        // moment.  The latest WebKit releases now support this event.
        } else {

            EU._simpleAdd(document, "DOMContentLoaded", EU._ready);

        }
        /////////////////////////////////////////////////////////////


        EU._simpleAdd(window, "load", EU._load);
        EU._simpleAdd(window, "unload", EU._unload);
        EU._tryPreloadAttach();
    })();

}
/**
 * EventProvider is designed to be used with YAHOO.augment to wrap 
 * CustomEvents in an interface that allows events to be subscribed to 
 * and fired by name.  This makes it possible for implementing code to
 * subscribe to an event that either has not been created yet, or will
 * not be created at all.
 *
 * @Class EventProvider
 */
YAHOO.util.EventProvider = function() { };

YAHOO.util.EventProvider.prototype = {

    /**
     * Private storage of custom events
     * @property __yui_events
     * @type Object[]
     * @private
     */
    __yui_events: null,

    /**
     * Private storage of custom event subscribers
     * @property __yui_subscribers
     * @type Object[]
     * @private
     */
    __yui_subscribers: null,
    
    /**
     * Subscribe to a CustomEvent by event type
     *
     * @method subscribe
     * @param p_type     {string}   the type, or name of the event
     * @param p_fn       {function} the function to exectute when the event fires
     * @param p_obj      {Object}   An object to be passed along when the event 
     *                              fires
     * @param overrideContext {boolean}  If true, the obj passed in becomes the 
     *                              execution scope of the listener
     */
    subscribe: function(p_type, p_fn, p_obj, overrideContext) {

        this.__yui_events = this.__yui_events || {};
        var ce = this.__yui_events[p_type];

        if (ce) {
            ce.subscribe(p_fn, p_obj, overrideContext);
        } else {
            this.__yui_subscribers = this.__yui_subscribers || {};
            var subs = this.__yui_subscribers;
            if (!subs[p_type]) {
                subs[p_type] = [];
            }
            subs[p_type].push(
                { fn: p_fn, obj: p_obj, overrideContext: overrideContext } );
        }
    },

    /**
     * Unsubscribes one or more listeners the from the specified event
     * @method unsubscribe
     * @param p_type {string}   The type, or name of the event.  If the type
     *                          is not specified, it will attempt to remove
     *                          the listener from all hosted events.
     * @param p_fn   {Function} The subscribed function to unsubscribe, if not
     *                          supplied, all subscribers will be removed.
     * @param p_obj  {Object}   The custom object passed to subscribe.  This is
     *                        optional, but if supplied will be used to
     *                        disambiguate multiple listeners that are the same
     *                        (e.g., you subscribe many object using a function
     *                        that lives on the prototype)
     * @return {boolean} true if the subscriber was found and detached.
     */
    unsubscribe: function(p_type, p_fn, p_obj) {
        this.__yui_events = this.__yui_events || {};
        var evts = this.__yui_events;
        if (p_type) {
            var ce = evts[p_type];
            if (ce) {
                return ce.unsubscribe(p_fn, p_obj);
            }
        } else {
            var ret = true;
            for (var i in evts) {
                if (YAHOO.lang.hasOwnProperty(evts, i)) {
                    ret = ret && evts[i].unsubscribe(p_fn, p_obj);
                }
            }
            return ret;
        }

        return false;
    },
    
    /**
     * Removes all listeners from the specified event.  If the event type
     * is not specified, all listeners from all hosted custom events will
     * be removed.
     * @method unsubscribeAll
     * @param p_type {string}   The type, or name of the event
     */
    unsubscribeAll: function(p_type) {
        return this.unsubscribe(p_type);
    },

    /**
     * Creates a new custom event of the specified type.  If a custom event
     * by that name already exists, it will not be re-created.  In either
     * case the custom event is returned. 
     *
     * @method createEvent
     *
     * @param p_type {string} the type, or name of the event
     * @param p_config {object} optional config params.  Valid properties are:
     *
     *  <ul>
     *    <li>
     *      scope: defines the default execution scope.  If not defined
     *      the default scope will be this instance.
     *    </li>
     *    <li>
     *      silent: if true, the custom event will not generate log messages.
     *      This is false by default.
     *    </li>
     *    <li>
     *      onSubscribeCallback: specifies a callback to execute when the
     *      event has a new subscriber.  This will fire immediately for
     *      each queued subscriber if any exist prior to the creation of
     *      the event.
     *    </li>
     *  </ul>
     *
     *  @return {CustomEvent} the custom event
     *
     */
    createEvent: function(p_type, p_config) {

        this.__yui_events = this.__yui_events || {};
        var opts = p_config || {};
        var events = this.__yui_events;

        if (events[p_type]) {
        } else {

            var scope  = opts.scope  || this;
            var silent = (opts.silent);

            var ce = new YAHOO.util.CustomEvent(p_type, scope, silent,
                    YAHOO.util.CustomEvent.FLAT);
            events[p_type] = ce;

            if (opts.onSubscribeCallback) {
                ce.subscribeEvent.subscribe(opts.onSubscribeCallback);
            }

            this.__yui_subscribers = this.__yui_subscribers || {};
            var qs = this.__yui_subscribers[p_type];

            if (qs) {
                for (var i=0; i<qs.length; ++i) {
                    ce.subscribe(qs[i].fn, qs[i].obj, qs[i].overrideContext);
                }
            }
        }

        return events[p_type];
    },


   /**
     * Fire a custom event by name.  The callback functions will be executed
     * from the scope specified when the event was created, and with the 
     * following parameters:
     *   <ul>
     *   <li>The first argument fire() was executed with</li>
     *   <li>The custom object (if any) that was passed into the subscribe() 
     *       method</li>
     *   </ul>
     * @method fireEvent
     * @param p_type    {string}  the type, or name of the event
     * @param arguments {Object*} an arbitrary set of parameters to pass to 
     *                            the handler.
     * @return {boolean} the return value from CustomEvent.fire
     *                   
     */
    fireEvent: function(p_type, arg1, arg2, etc) {

        this.__yui_events = this.__yui_events || {};
        var ce = this.__yui_events[p_type];

        if (!ce) {
            return null;
        }

        var args = [];
        for (var i=1; i<arguments.length; ++i) {
            args.push(arguments[i]);
        }
        return ce.fire.apply(ce, args);
    },

    /**
     * Returns true if the custom event of the provided type has been created
     * with createEvent.
     * @method hasEvent
     * @param type {string} the type, or name of the event
     */
    hasEvent: function(type) {
        if (this.__yui_events) {
            if (this.__yui_events[type]) {
                return true;
            }
        }
        return false;
    }

};

(function() {

    var Event = YAHOO.util.Event, Lang = YAHOO.lang;

/**
* KeyListener is a utility that provides an easy interface for listening for
* keydown/keyup events fired against DOM elements.
* @namespace YAHOO.util
* @class KeyListener
* @constructor
* @param {HTMLElement} attachTo The element or element ID to which the key 
*                               event should be attached
* @param {String}      attachTo The element or element ID to which the key
*                               event should be attached
* @param {Object}      keyData  The object literal representing the key(s) 
*                               to detect. Possible attributes are 
*                               shift(boolean), alt(boolean), ctrl(boolean) 
*                               and keys(either an int or an array of ints 
*                               representing keycodes).
* @param {Function}    handler  The CustomEvent handler to fire when the 
*                               key event is detected
* @param {Object}      handler  An object literal representing the handler. 
* @param {String}      event    Optional. The event (keydown or keyup) to 
*                               listen for. Defaults automatically to keydown.
*
* @knownissue the "keypress" event is completely broken in Safari 2.x and below.
*             the workaround is use "keydown" for key listening.  However, if
*             it is desired to prevent the default behavior of the keystroke,
*             that can only be done on the keypress event.  This makes key
*             handling quite ugly.
* @knownissue keydown is also broken in Safari 2.x and below for the ESC key.
*             There currently is no workaround other than choosing another
*             key to listen for.
*/
YAHOO.util.KeyListener = function(attachTo, keyData, handler, event) {
    if (!attachTo) {
    } else if (!keyData) {
    } else if (!handler) {
    } 
    
    if (!event) {
        event = YAHOO.util.KeyListener.KEYDOWN;
    }

    /**
    * The CustomEvent fired internally when a key is pressed
    * @event keyEvent
    * @private
    * @param {Object} keyData The object literal representing the key(s) to 
    *                         detect. Possible attributes are shift(boolean), 
    *                         alt(boolean), ctrl(boolean) and keys(either an 
    *                         int or an array of ints representing keycodes).
    */
    var keyEvent = new YAHOO.util.CustomEvent("keyPressed");
    
    /**
    * The CustomEvent fired when the KeyListener is enabled via the enable() 
    * function
    * @event enabledEvent
    * @param {Object} keyData The object literal representing the key(s) to 
    *                         detect. Possible attributes are shift(boolean), 
    *                         alt(boolean), ctrl(boolean) and keys(either an 
    *                         int or an array of ints representing keycodes).
    */
    this.enabledEvent = new YAHOO.util.CustomEvent("enabled");

    /**
    * The CustomEvent fired when the KeyListener is disabled via the 
    * disable() function
    * @event disabledEvent
    * @param {Object} keyData The object literal representing the key(s) to 
    *                         detect. Possible attributes are shift(boolean), 
    *                         alt(boolean), ctrl(boolean) and keys(either an 
    *                         int or an array of ints representing keycodes).
    */
    this.disabledEvent = new YAHOO.util.CustomEvent("disabled");

    if (Lang.isString(attachTo)) {
        attachTo = document.getElementById(attachTo); // No Dom util
    }

    if (Lang.isFunction(handler)) {
        keyEvent.subscribe(handler);
    } else {
        keyEvent.subscribe(handler.fn, handler.scope, handler.correctScope);
    }

    /**
    * Handles the key event when a key is pressed.
    * @method handleKeyPress
    * @param {DOMEvent} e   The keypress DOM event
    * @param {Object}   obj The DOM event scope object
    * @private
    */
    function handleKeyPress(e, obj) {
        if (! keyData.shift) {  
            keyData.shift = false; 
        }
        if (! keyData.alt) {    
            keyData.alt = false;
        }
        if (! keyData.ctrl) {
            keyData.ctrl = false;
        }

        // check held down modifying keys first
        if (e.shiftKey == keyData.shift && 
            e.altKey   == keyData.alt &&
            e.ctrlKey  == keyData.ctrl) { // if we pass this, all modifiers match
            
            var dataItem, keys = keyData.keys, key;

            if (YAHOO.lang.isArray(keys)) {
                for (var i=0;i<keys.length;i++) {
                    dataItem = keys[i];
                    key = Event.getCharCode(e);

                    if (dataItem == key) {
                        keyEvent.fire(key, e);
                        break;
                    }
                }
            } else {
                key = Event.getCharCode(e);
                if (keys == key ) {
                    keyEvent.fire(key, e);
                }
            }
        }
    }

    /**
    * Enables the KeyListener by attaching the DOM event listeners to the 
    * target DOM element
    * @method enable
    */
    this.enable = function() {
        if (! this.enabled) {
            Event.on(attachTo, event, handleKeyPress);
            this.enabledEvent.fire(keyData);
        }
        /**
        * Boolean indicating the enabled/disabled state of the Tooltip
        * @property enabled
        * @type Boolean
        */
        this.enabled = true;
    };

    /**
    * Disables the KeyListener by removing the DOM event listeners from the 
    * target DOM element
    * @method disable
    */
    this.disable = function() {
        if (this.enabled) {
            Event.removeListener(attachTo, event, handleKeyPress);
            this.disabledEvent.fire(keyData);
        }
        this.enabled = false;
    };

    /**
    * Returns a String representation of the object.
    * @method toString
    * @return {String}  The string representation of the KeyListener
    */ 
    this.toString = function() {
        return "KeyListener [" + keyData.keys + "] " + attachTo.tagName + 
                (attachTo.id ? "[" + attachTo.id + "]" : "");
    };

};

var KeyListener = YAHOO.util.KeyListener;

/**
 * Constant representing the DOM "keydown" event.
 * @property YAHOO.util.KeyListener.KEYDOWN
 * @static
 * @final
 * @type String
 */
KeyListener.KEYDOWN = "keydown";

/**
 * Constant representing the DOM "keyup" event.
 * @property YAHOO.util.KeyListener.KEYUP
 * @static
 * @final
 * @type String
 */
KeyListener.KEYUP = "keyup";

/**
 * keycode constants for a subset of the special keys
 * @property KEY
 * @static
 * @final
 */
KeyListener.KEY = {
    ALT          : 18,
    BACK_SPACE   : 8,
    CAPS_LOCK    : 20,
    CONTROL      : 17,
    DELETE       : 46,
    DOWN         : 40,
    END          : 35,
    ENTER        : 13,
    ESCAPE       : 27,
    HOME         : 36,
    LEFT         : 37,
    META         : 224,
    NUM_LOCK     : 144,
    PAGE_DOWN    : 34,
    PAGE_UP      : 33, 
    PAUSE        : 19,
    PRINTSCREEN  : 44,
    RIGHT        : 39,
    SCROLL_LOCK  : 145,
    SHIFT        : 16,
    SPACE        : 32,
    TAB          : 9,
    UP           : 38
};

})();
YAHOO.register("event", YAHOO.util.Event, {version: "2.7.0", build: "1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
/**
 * Provides methods to parse JSON strings and convert objects to JSON strings.
 * @module json
 * @class JSON
 * @static
 */
YAHOO.lang.JSON = (function () {

var l = YAHOO.lang,

    /**
     * Replace certain Unicode characters that JavaScript may handle incorrectly
     * during eval--either by deleting them or treating them as line
     * endings--with escape sequences.
     * IMPORTANT NOTE: This regex will be used to modify the input if a match is
     * found.
     * @property _UNICODE_EXCEPTIONS
     * @type {RegExp}
     * @private
     */
    _UNICODE_EXCEPTIONS = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

    /**
     * First step in the validation.  Regex used to replace all escape
     * sequences (i.e. "\\", etc) with '@' characters (a non-JSON character).
     * @property _ESCAPES
     * @type {RegExp}
     * @static
     * @private
     */
    _ESCAPES = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,

    /**
     * Second step in the validation.  Regex used to replace all simple
     * values with ']' characters.
     * @property _VALUES
     * @type {RegExp}
     * @static
     * @private
     */
    _VALUES  = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,

    /**
     * Third step in the validation.  Regex used to remove all open square
     * brackets following a colon, comma, or at the beginning of the string.
     * @property _BRACKETS
     * @type {RegExp}
     * @static
     * @private
     */
    _BRACKETS = /(?:^|:|,)(?:\s*\[)+/g,

    /**
     * Final step in the validation.  Regex used to test the string left after
     * all previous replacements for invalid characters.
     * @property _INVALID
     * @type {RegExp}
     * @static
     * @private
     */
    _INVALID  = /^[\],:{}\s]*$/,

    /**
     * Regex used to replace special characters in strings for JSON
     * stringification.
     * @property _SPECIAL_CHARS
     * @type {RegExp}
     * @static
     * @private
     */
    _SPECIAL_CHARS = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

    /**
     * Character substitution map for common escapes and special characters.
     * @property _CHARS
     * @type {Object}
     * @static
     * @private
     */
    _CHARS = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };

/**
 * Traverses nested objects, applying a filter or reviver function to
 * each value.  The value returned from the function will replace the
 * original value in the key:value pair.  If the value returned is
 * undefined, the key will be omitted from the returned object.
 * @method _revive
 * @param data {MIXED} Any JavaScript data
 * @param reviver {Function} filter or mutation function
 * @return {MIXED} The results of the filtered/mutated data structure
 * @private
 */
function _revive(data, reviver) {
    var walk = function (o,key) {
        var k,v,value = o[key];
        if (value && typeof value === 'object') {
            for (k in value) {
                if (l.hasOwnProperty(value,k)) {
                    v = walk(value, k);
                    if (v === undefined) {
                        delete value[k];
                    } else {
                        value[k] = v;
                    }
                }
            }
        }
        return reviver.call(o,key,value);
    };

    return typeof reviver === 'function' ? walk({'':data},'') : data;
}

/**
 * Escapes a special character to a safe Unicode representation
 * @method _char
 * @param c {String} single character to escape
 * @return {String} safe Unicode escape
 */
function _char(c) {
    if (!_CHARS[c]) {
        _CHARS[c] =  '\\u'+('0000'+(+(c.charCodeAt(0))).toString(16)).slice(-4);
    }
    return _CHARS[c];
}

/**
 * Replace certain Unicode characters that may be handled incorrectly by
 * some browser implementations.
 * @method _prepare
 * @param s {String} parse input
 * @return {String} sanitized JSON string ready to be validated/parsed
 * @private
 */
function _prepare(s) {
    return s.replace(_UNICODE_EXCEPTIONS, _char);
}

/**
 * Four step determination whether a string is valid JSON.  In three steps,
 * escape sequences, safe values, and properly placed open square brackets
 * are replaced with placeholders or removed.  Then in the final step, the
 * result of all these replacements is checked for invalid characters.
 * @method _isValid
 * @param str {String} JSON string to be tested
 * @return {boolean} is the string safe for eval?
 * @static
 */
function _isValid(str) {
    return l.isString(str) &&
            _INVALID.test(str.
            replace(_ESCAPES,'@').
            replace(_VALUES,']').
            replace(_BRACKETS,''));
}

/**
 * Enclose escaped strings in quotes
 * @method _string
 * @param s {String} string to wrap
 * @return {String} '"'+s+'"' after s has had special characters escaped
 * @private
 */
function _string(s) {
    return '"' + s.replace(_SPECIAL_CHARS, _char) + '"';
}

/**
 * Worker function used by public stringify.
 * @method _stringify
 * @param h {Object} object holding the key
 * @param key {String} String key in object h to serialize
 * @param depth {Number} depth to serialize
 * @param w {Array|Function} array of whitelisted keys OR replacer function
 * @param pstack {Array} used to protect against recursion
 * @return {String} serialized version of o
 */
function _stringify(h,key,d,w,pstack) {
    var o = typeof w === 'function' ? w.call(h,key,h[key]) : h[key],
        i,len,j, // array iteration
        k,v,     // object iteration
        isArray, // forking in typeof 'object'
        a;       // composition array for performance over string concat

    if (o instanceof Date) {
        o = l.JSON.dateToString(o);
    } else if (o instanceof String || o instanceof Boolean || o instanceof Number) {
        o = o.valueOf();
    }

    switch (typeof o) {
        case 'string' : return _string(o);
        case 'number' : return isFinite(o) ? String(o) : 'null';
        case 'boolean': return String(o);
        case 'object' :
            // null
            if (o === null) {
                return 'null';
            }

            // Check for cyclical references
            for (i = pstack.length - 1; i >= 0; --i) {
                if (pstack[i] === o) {
                    return 'null';
                }
            }

            // Add the object to the processing stack
            pstack[pstack.length] = o;

            a = [];
            isArray = l.isArray(o);

            // Only recurse if we're above depth config
            if (d > 0) {
                // Array
                if (isArray) {
                    for (i = o.length - 1; i >= 0; --i) {
                        a[i] = _stringify(o,i,d-1,w,pstack) || 'null';
                    }

                // Object
                } else {
                    j = 0;
                    // Use whitelist keys if provided as an array
                    if (l.isArray(w)) {
                        for (i = 0, len = w.length; i < len; ++i) {
                            k = w[i];
                            v = _stringify(o,k,d-1,w,pstack);
                            if (v) {
                                a[j++] = _string(k) + ':' + v;
                            }
                        }
                    } else {
                        for (k in o) {
                            if (typeof k === 'string' && l.hasOwnProperty(o,k)) {
                                v = _stringify(o,k,d-1,w,pstack);
                                if (v) {
                                    a[j++] = _string(k) + ':' + v;
                                }
                            }
                        }
                    }

                    // sort object keys for easier readability
                    a.sort();
                }
            }

            // remove the object from the stack
            pstack.pop();

            return isArray ? '['+a.join(',')+']' : '{'+a.join(',')+'}';
    }

    return undefined; // invalid input
}

// Return the public API
return {
    /**
     * Four step determination whether a string is valid JSON.  In three steps,
     * escape sequences, safe values, and properly placed open square brackets
     * are replaced with placeholders or removed.  Then in the final step, the
     * result of all these replacements is checked for invalid characters.
     * @method isValid
     * @param str {String} JSON string to be tested
     * @return {boolean} is the string safe for eval?
     * @static
     */
    isValid : function (s) {
        return _isValid(_prepare(s));
    },

    /**
     * Parse a JSON string, returning the native JavaScript representation.
     * Only minor modifications from http://www.json.org/json2.js.
     * @param s {string} JSON string data
     * @param reviver {function} (optional) function(k,v) passed each key:value
     *          pair of object literals, allowing pruning or altering values
     * @return {MIXED} the native JavaScript representation of the JSON string
     * @throws SyntaxError
     * @method parse
     * @static
     */
    parse : function (s,reviver) {
        // sanitize
        s = _prepare(s);

        // Ensure valid JSON
        if (_isValid(s)) {
            // Eval the text into a JavaScript data structure, apply the
            // reviver function if provided, and return
            return _revive( eval('(' + s + ')'), reviver );
        }

        // The text is not valid JSON
        throw new SyntaxError('parseJSON');
    },

    /**
     * Converts an arbitrary value to a JSON string representation.
     * Cyclical object or array references are replaced with null.
     * If a whitelist is provided, only matching object keys will be included.
     * If a depth limit is provided, objects and arrays at that depth will
     * be stringified as empty.
     * @method stringify
     * @param o {MIXED} any arbitrary object to convert to JSON string
     * @param w {Array|Function} (optional) whitelist of acceptable object keys to include OR a function(value,key) to alter values before serialization
     * @param d {number} (optional) depth limit to recurse objects/arrays (practical minimum 1)
     * @return {string} JSON string representation of the input
     * @static
     */
    stringify : function (o,w,d) {
        if (o !== undefined) {
            // Ensure whitelist keys are unique (bug 2110391)
            if (l.isArray(w)) {
                w = (function (a) {
                    var uniq=[],map={},v,i,j,len;
                    for (i=0,j=0,len=a.length; i<len; ++i) {
                        v = a[i];
                        if (typeof v === 'string' && map[v] === undefined) {
                            uniq[(map[v] = j++)] = v;
                        }
                    }
                    return uniq;
                })(w);
            }

            // Default depth to POSITIVE_INFINITY
            d = d >= 0 ? d : 1/0;

            // process the input
            return _stringify({'':o},'',d,w,[]);
        }

        return undefined;
    },

    /**
     * Serializes a Date instance as a UTC date string.  Used internally by
     * stringify.  Override this method if you need Dates serialized in a
     * different format.
     * @method dateToString
     * @param d {Date} The Date to serialize
     * @return {String} stringified Date in UTC format YYYY-MM-DDTHH:mm:SSZ
     * @static
     */
    dateToString : function (d) {
        function _zeroPad(v) {
            return v < 10 ? '0' + v : v;
        }

        return d.getUTCFullYear()         + '-' +
            _zeroPad(d.getUTCMonth() + 1) + '-' +
            _zeroPad(d.getUTCDate())      + 'T' +
            _zeroPad(d.getUTCHours())     + ':' +
            _zeroPad(d.getUTCMinutes())   + ':' +
            _zeroPad(d.getUTCSeconds())   + 'Z';
    },

    /**
     * Reconstitute Date instances from the default JSON UTC serialization.
     * Reference this from a reviver function to rebuild Dates during the
     * parse operation.
     * @method stringToDate
     * @param str {String} String serialization of a Date
     * @return {Date}
     */
    stringToDate : function (str) {
        if (/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/.test(str)) {
            var d = new Date();
            d.setUTCFullYear(RegExp.$1, (RegExp.$2|0)-1, RegExp.$3);
            d.setUTCHours(RegExp.$4, RegExp.$5, RegExp.$6);
            return d;
        }
        return str;
    }
};

})();
YAHOO.register("json", YAHOO.lang.JSON, {version: "2.7.0", build: "1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function() {

var Y = YAHOO.util;

/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * The animation module provides allows effects to be added to HTMLElements.
 * @module animation
 * @requires yahoo, event, dom
 */

/**
 *
 * Base animation class that provides the interface for building animated effects.
 * <p>Usage: var myAnim = new YAHOO.util.Anim(el, { width: { from: 10, to: 100 } }, 1, YAHOO.util.Easing.easeOut);</p>
 * @class Anim
 * @namespace YAHOO.util
 * @requires YAHOO.util.AnimMgr
 * @requires YAHOO.util.Easing
 * @requires YAHOO.util.Dom
 * @requires YAHOO.util.Event
 * @requires YAHOO.util.CustomEvent
 * @constructor
 * @param {String | HTMLElement} el Reference to the element that will be animated
 * @param {Object} attributes The attribute(s) to be animated.  
 * Each attribute is an object with at minimum a "to" or "by" member defined.  
 * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").  
 * All attribute names use camelCase.
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to YAHOO.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a YAHOO.util.Easing method)
 */

var Anim = function(el, attributes, duration, method) {
    if (!el) {
    }
    this.init(el, attributes, duration, method); 
};

Anim.NAME = 'Anim';

Anim.prototype = {
    /**
     * Provides a readable name for the Anim instance.
     * @method toString
     * @return {String}
     */
    toString: function() {
        var el = this.getEl() || {};
        var id = el.id || el.tagName;
        return (this.constructor.NAME + ': ' + id);
    },
    
    patterns: { // cached for performance
        noNegatives:        /width|height|opacity|padding/i, // keep at zero or above
        offsetAttribute:  /^((width|height)|(top|left))$/, // use offsetValue as default
        defaultUnit:        /width|height|top$|bottom$|left$|right$/i, // use 'px' by default
        offsetUnit:         /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i // IE may return these, so convert these to offset
    },
    
    /**
     * Returns the value computed by the animation's "method".
     * @method doMethod
     * @param {String} attr The name of the attribute.
     * @param {Number} start The value this attribute should start from for this animation.
     * @param {Number} end  The value this attribute should end at for this animation.
     * @return {Number} The Value to be applied to the attribute.
     */
    doMethod: function(attr, start, end) {
        return this.method(this.currentFrame, start, end - start, this.totalFrames);
    },
    
    /**
     * Applies a value to an attribute.
     * @method setAttribute
     * @param {String} attr The name of the attribute.
     * @param {Number} val The value to be applied to the attribute.
     * @param {String} unit The unit ('px', '%', etc.) of the value.
     */
    setAttribute: function(attr, val, unit) {
        var el = this.getEl();
        if ( this.patterns.noNegatives.test(attr) ) {
            val = (val > 0) ? val : 0;
        }

        if ('style' in el) {
            Y.Dom.setStyle(el, attr, val + unit);
        } else if (attr in el) {
            el[attr] = val;
        }
    },                        
    
    /**
     * Returns current value of the attribute.
     * @method getAttribute
     * @param {String} attr The name of the attribute.
     * @return {Number} val The current value of the attribute.
     */
    getAttribute: function(attr) {
        var el = this.getEl();
        var val = Y.Dom.getStyle(el, attr);

        if (val !== 'auto' && !this.patterns.offsetUnit.test(val)) {
            return parseFloat(val);
        }
        
        var a = this.patterns.offsetAttribute.exec(attr) || [];
        var pos = !!( a[3] ); // top or left
        var box = !!( a[2] ); // width or height
        
        if ('style' in el) {
            // use offsets for width/height and abs pos top/left
            if ( box || (Y.Dom.getStyle(el, 'position') == 'absolute' && pos) ) {
                val = el['offset' + a[0].charAt(0).toUpperCase() + a[0].substr(1)];
            } else { // default to zero for other 'auto'
                val = 0;
            }
        } else if (attr in el) {
            val = el[attr];
        }

        return val;
    },
    
    /**
     * Returns the unit to use when none is supplied.
     * @method getDefaultUnit
     * @param {attr} attr The name of the attribute.
     * @return {String} The default unit to be used.
     */
    getDefaultUnit: function(attr) {
         if ( this.patterns.defaultUnit.test(attr) ) {
            return 'px';
         }
         
         return '';
    },
        
    /**
     * Sets the actual values to be used during the animation.  Should only be needed for subclass use.
     * @method setRuntimeAttribute
     * @param {Object} attr The attribute object
     * @private 
     */
    setRuntimeAttribute: function(attr) {
        var start;
        var end;
        var attributes = this.attributes;

        this.runtimeAttributes[attr] = {};
        
        var isset = function(prop) {
            return (typeof prop !== 'undefined');
        };
        
        if ( !isset(attributes[attr]['to']) && !isset(attributes[attr]['by']) ) {
            return false; // note return; nothing to animate to
        }
        
        start = ( isset(attributes[attr]['from']) ) ? attributes[attr]['from'] : this.getAttribute(attr);

        // To beats by, per SMIL 2.1 spec
        if ( isset(attributes[attr]['to']) ) {
            end = attributes[attr]['to'];
        } else if ( isset(attributes[attr]['by']) ) {
            if (start.constructor == Array) {
                end = [];
                for (var i = 0, len = start.length; i < len; ++i) {
                    end[i] = start[i] + attributes[attr]['by'][i] * 1; // times 1 to cast "by" 
                }
            } else {
                end = start + attributes[attr]['by'] * 1;
            }
        }
        
        this.runtimeAttributes[attr].start = start;
        this.runtimeAttributes[attr].end = end;

        // set units if needed
        this.runtimeAttributes[attr].unit = ( isset(attributes[attr].unit) ) ?
                attributes[attr]['unit'] : this.getDefaultUnit(attr);
        return true;
    },

    /**
     * Constructor for Anim instance.
     * @method init
     * @param {String | HTMLElement} el Reference to the element that will be animated
     * @param {Object} attributes The attribute(s) to be animated.  
     * Each attribute is an object with at minimum a "to" or "by" member defined.  
     * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").  
     * All attribute names use camelCase.
     * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
     * @param {Function} method (optional, defaults to YAHOO.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a YAHOO.util.Easing method)
     */ 
    init: function(el, attributes, duration, method) {
        /**
         * Whether or not the animation is running.
         * @property isAnimated
         * @private
         * @type Boolean
         */
        var isAnimated = false;
        
        /**
         * A Date object that is created when the animation begins.
         * @property startTime
         * @private
         * @type Date
         */
        var startTime = null;
        
        /**
         * The number of frames this animation was able to execute.
         * @property actualFrames
         * @private
         * @type Int
         */
        var actualFrames = 0; 

        /**
         * The element to be animated.
         * @property el
         * @private
         * @type HTMLElement
         */
        el = Y.Dom.get(el);
        
        /**
         * The collection of attributes to be animated.  
         * Each attribute must have at least a "to" or "by" defined in order to animate.  
         * If "to" is supplied, the animation will end with the attribute at that value.  
         * If "by" is supplied, the animation will end at that value plus its starting value. 
         * If both are supplied, "to" is used, and "by" is ignored. 
         * Optional additional member include "from" (the value the attribute should start animating from, defaults to current value), and "unit" (the units to apply to the values).
         * @property attributes
         * @type Object
         */
        this.attributes = attributes || {};
        
        /**
         * The length of the animation.  Defaults to "1" (second).
         * @property duration
         * @type Number
         */
        this.duration = !YAHOO.lang.isUndefined(duration) ? duration : 1;
        
        /**
         * The method that will provide values to the attribute(s) during the animation. 
         * Defaults to "YAHOO.util.Easing.easeNone".
         * @property method
         * @type Function
         */
        this.method = method || Y.Easing.easeNone;

        /**
         * Whether or not the duration should be treated as seconds.
         * Defaults to true.
         * @property useSeconds
         * @type Boolean
         */
        this.useSeconds = true; // default to seconds
        
        /**
         * The location of the current animation on the timeline.
         * In time-based animations, this is used by AnimMgr to ensure the animation finishes on time.
         * @property currentFrame
         * @type Int
         */
        this.currentFrame = 0;
        
        /**
         * The total number of frames to be executed.
         * In time-based animations, this is used by AnimMgr to ensure the animation finishes on time.
         * @property totalFrames
         * @type Int
         */
        this.totalFrames = Y.AnimMgr.fps;
        
        /**
         * Changes the animated element
         * @method setEl
         */
        this.setEl = function(element) {
            el = Y.Dom.get(element);
        };
        
        /**
         * Returns a reference to the animated element.
         * @method getEl
         * @return {HTMLElement}
         */
        this.getEl = function() { return el; };
        
        /**
         * Checks whether the element is currently animated.
         * @method isAnimated
         * @return {Boolean} current value of isAnimated.     
         */
        this.isAnimated = function() {
            return isAnimated;
        };
        
        /**
         * Returns the animation start time.
         * @method getStartTime
         * @return {Date} current value of startTime.      
         */
        this.getStartTime = function() {
            return startTime;
        };        
        
        this.runtimeAttributes = {};
        
        
        
        /**
         * Starts the animation by registering it with the animation manager. 
         * @method animate  
         */
        this.animate = function() {
            if ( this.isAnimated() ) {
                return false;
            }
            
            this.currentFrame = 0;
            
            this.totalFrames = ( this.useSeconds ) ? Math.ceil(Y.AnimMgr.fps * this.duration) : this.duration;
    
            if (this.duration === 0 && this.useSeconds) { // jump to last frame if zero second duration 
                this.totalFrames = 1; 
            }
            Y.AnimMgr.registerElement(this);
            return true;
        };
          
        /**
         * Stops the animation.  Normally called by AnimMgr when animation completes.
         * @method stop
         * @param {Boolean} finish (optional) If true, animation will jump to final frame.
         */ 
        this.stop = function(finish) {
            if (!this.isAnimated()) { // nothing to stop
                return false;
            }

            if (finish) {
                 this.currentFrame = this.totalFrames;
                 this._onTween.fire();
            }
            Y.AnimMgr.stop(this);
        };
        
        var onStart = function() {            
            this.onStart.fire();
            
            this.runtimeAttributes = {};
            for (var attr in this.attributes) {
                this.setRuntimeAttribute(attr);
            }
            
            isAnimated = true;
            actualFrames = 0;
            startTime = new Date(); 
        };
        
        /**
         * Feeds the starting and ending values for each animated attribute to doMethod once per frame, then applies the resulting value to the attribute(s).
         * @private
         */
         
        var onTween = function() {
            var data = {
                duration: new Date() - this.getStartTime(),
                currentFrame: this.currentFrame
            };
            
            data.toString = function() {
                return (
                    'duration: ' + data.duration +
                    ', currentFrame: ' + data.currentFrame
                );
            };
            
            this.onTween.fire(data);
            
            var runtimeAttributes = this.runtimeAttributes;
            
            for (var attr in runtimeAttributes) {
                this.setAttribute(attr, this.doMethod(attr, runtimeAttributes[attr].start, runtimeAttributes[attr].end), runtimeAttributes[attr].unit); 
            }
            
            actualFrames += 1;
        };
        
        var onComplete = function() {
            var actual_duration = (new Date() - startTime) / 1000 ;
            
            var data = {
                duration: actual_duration,
                frames: actualFrames,
                fps: actualFrames / actual_duration
            };
            
            data.toString = function() {
                return (
                    'duration: ' + data.duration +
                    ', frames: ' + data.frames +
                    ', fps: ' + data.fps
                );
            };
            
            isAnimated = false;
            actualFrames = 0;
            this.onComplete.fire(data);
        };
        
        /**
         * Custom event that fires after onStart, useful in subclassing
         * @private
         */    
        this._onStart = new Y.CustomEvent('_start', this, true);

        /**
         * Custom event that fires when animation begins
         * Listen via subscribe method (e.g. myAnim.onStart.subscribe(someFunction)
         * @event onStart
         */    
        this.onStart = new Y.CustomEvent('start', this);
        
        /**
         * Custom event that fires between each frame
         * Listen via subscribe method (e.g. myAnim.onTween.subscribe(someFunction)
         * @event onTween
         */
        this.onTween = new Y.CustomEvent('tween', this);
        
        /**
         * Custom event that fires after onTween
         * @private
         */
        this._onTween = new Y.CustomEvent('_tween', this, true);
        
        /**
         * Custom event that fires when animation ends
         * Listen via subscribe method (e.g. myAnim.onComplete.subscribe(someFunction)
         * @event onComplete
         */
        this.onComplete = new Y.CustomEvent('complete', this);
        /**
         * Custom event that fires after onComplete
         * @private
         */
        this._onComplete = new Y.CustomEvent('_complete', this, true);

        this._onStart.subscribe(onStart);
        this._onTween.subscribe(onTween);
        this._onComplete.subscribe(onComplete);
    }
};

    Y.Anim = Anim;
})();
/**
 * Handles animation queueing and threading.
 * Used by Anim and subclasses.
 * @class AnimMgr
 * @namespace YAHOO.util
 */
YAHOO.util.AnimMgr = new function() {
    /** 
     * Reference to the animation Interval.
     * @property thread
     * @private
     * @type Int
     */
    var thread = null;
    
    /** 
     * The current queue of registered animation objects.
     * @property queue
     * @private
     * @type Array
     */    
    var queue = [];

    /** 
     * The number of active animations.
     * @property tweenCount
     * @private
     * @type Int
     */        
    var tweenCount = 0;

    /** 
     * Base frame rate (frames per second). 
     * Arbitrarily high for better x-browser calibration (slower browsers drop more frames).
     * @property fps
     * @type Int
     * 
     */
    this.fps = 1000;

    /** 
     * Interval delay in milliseconds, defaults to fastest possible.
     * @property delay
     * @type Int
     * 
     */
    this.delay = 1;

    /**
     * Adds an animation instance to the animation queue.
     * All animation instances must be registered in order to animate.
     * @method registerElement
     * @param {object} tween The Anim instance to be be registered
     */
    this.registerElement = function(tween) {
        queue[queue.length] = tween;
        tweenCount += 1;
        tween._onStart.fire();
        this.start();
    };
    
    /**
     * removes an animation instance from the animation queue.
     * All animation instances must be registered in order to animate.
     * @method unRegister
     * @param {object} tween The Anim instance to be be registered
     * @param {Int} index The index of the Anim instance
     * @private
     */
    this.unRegister = function(tween, index) {
        index = index || getIndex(tween);
        if (!tween.isAnimated() || index == -1) {
            return false;
        }
        
        tween._onComplete.fire();
        queue.splice(index, 1);

        tweenCount -= 1;
        if (tweenCount <= 0) {
            this.stop();
        }

        return true;
    };
    
    /**
     * Starts the animation thread.
	* Only one thread can run at a time.
     * @method start
     */    
    this.start = function() {
        if (thread === null) {
            thread = setInterval(this.run, this.delay);
        }
    };

    /**
     * Stops the animation thread or a specific animation instance.
     * @method stop
     * @param {object} tween A specific Anim instance to stop (optional)
     * If no instance given, Manager stops thread and all animations.
     */    
    this.stop = function(tween) {
        if (!tween) {
            clearInterval(thread);
            
            for (var i = 0, len = queue.length; i < len; ++i) {
                this.unRegister(queue[0], 0);  
            }

            queue = [];
            thread = null;
            tweenCount = 0;
        }
        else {
            this.unRegister(tween);
        }
    };
    
    /**
     * Called per Interval to handle each animation frame.
     * @method run
     */    
    this.run = function() {
        for (var i = 0, len = queue.length; i < len; ++i) {
            var tween = queue[i];
            if ( !tween || !tween.isAnimated() ) { continue; }

            if (tween.currentFrame < tween.totalFrames || tween.totalFrames === null)
            {
                tween.currentFrame += 1;
                
                if (tween.useSeconds) {
                    correctFrame(tween);
                }
                tween._onTween.fire();          
            }
            else { YAHOO.util.AnimMgr.stop(tween, i); }
        }
    };
    
    var getIndex = function(anim) {
        for (var i = 0, len = queue.length; i < len; ++i) {
            if (queue[i] == anim) {
                return i; // note return;
            }
        }
        return -1;
    };
    
    /**
     * On the fly frame correction to keep animation on time.
     * @method correctFrame
     * @private
     * @param {Object} tween The Anim instance being corrected.
     */
    var correctFrame = function(tween) {
        var frames = tween.totalFrames;
        var frame = tween.currentFrame;
        var expected = (tween.currentFrame * tween.duration * 1000 / tween.totalFrames);
        var elapsed = (new Date() - tween.getStartTime());
        var tweak = 0;
        
        if (elapsed < tween.duration * 1000) { // check if falling behind
            tweak = Math.round((elapsed / expected - 1) * tween.currentFrame);
        } else { // went over duration, so jump to end
            tweak = frames - (frame + 1); 
        }
        if (tweak > 0 && isFinite(tweak)) { // adjust if needed
            if (tween.currentFrame + tweak >= frames) {// dont go past last frame
                tweak = frames - (frame + 1);
            }
            
            tween.currentFrame += tweak;      
        }
    };
};
/**
 * Used to calculate Bezier splines for any number of control points.
 * @class Bezier
 * @namespace YAHOO.util
 *
 */
YAHOO.util.Bezier = new function() {
    /**
     * Get the current position of the animated element based on t.
     * Each point is an array of "x" and "y" values (0 = x, 1 = y)
     * At least 2 points are required (start and end).
     * First point is start. Last point is end.
     * Additional control points are optional.     
     * @method getPosition
     * @param {Array} points An array containing Bezier points
     * @param {Number} t A number between 0 and 1 which is the basis for determining current position
     * @return {Array} An array containing int x and y member data
     */
    this.getPosition = function(points, t) {  
        var n = points.length;
        var tmp = [];

        for (var i = 0; i < n; ++i){
            tmp[i] = [points[i][0], points[i][1]]; // save input
        }
        
        for (var j = 1; j < n; ++j) {
            for (i = 0; i < n - j; ++i) {
                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }
    
        return [ tmp[0][0], tmp[0][1] ]; 
    
    };
};
(function() {
/**
 * Anim subclass for color transitions.
 * <p>Usage: <code>var myAnim = new Y.ColorAnim(el, { backgroundColor: { from: '#FF0000', to: '#FFFFFF' } }, 1, Y.Easing.easeOut);</code> Color values can be specified with either 112233, #112233, 
 * [255,255,255], or rgb(255,255,255)</p>
 * @class ColorAnim
 * @namespace YAHOO.util
 * @requires YAHOO.util.Anim
 * @requires YAHOO.util.AnimMgr
 * @requires YAHOO.util.Easing
 * @requires YAHOO.util.Bezier
 * @requires YAHOO.util.Dom
 * @requires YAHOO.util.Event
 * @constructor
 * @extends YAHOO.util.Anim
 * @param {HTMLElement | String} el Reference to the element that will be animated
 * @param {Object} attributes The attribute(s) to be animated.
 * Each attribute is an object with at minimum a "to" or "by" member defined.
 * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").
 * All attribute names use camelCase.
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to YAHOO.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a YAHOO.util.Easing method)
 */
    var ColorAnim = function(el, attributes, duration,  method) {
        ColorAnim.superclass.constructor.call(this, el, attributes, duration, method);
    };
    
    ColorAnim.NAME = 'ColorAnim';

    ColorAnim.DEFAULT_BGCOLOR = '#fff';
    // shorthand
    var Y = YAHOO.util;
    YAHOO.extend(ColorAnim, Y.Anim);

    var superclass = ColorAnim.superclass;
    var proto = ColorAnim.prototype;
    
    proto.patterns.color = /color$/i;
    proto.patterns.rgb            = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;
    proto.patterns.hex            = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;
    proto.patterns.hex3          = /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;
    proto.patterns.transparent = /^transparent|rgba\(0, 0, 0, 0\)$/; // need rgba for safari
    
    /**
     * Attempts to parse the given string and return a 3-tuple.
     * @method parseColor
     * @param {String} s The string to parse.
     * @return {Array} The 3-tuple of rgb values.
     */
    proto.parseColor = function(s) {
        if (s.length == 3) { return s; }
    
        var c = this.patterns.hex.exec(s);
        if (c && c.length == 4) {
            return [ parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16) ];
        }
    
        c = this.patterns.rgb.exec(s);
        if (c && c.length == 4) {
            return [ parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10) ];
        }
    
        c = this.patterns.hex3.exec(s);
        if (c && c.length == 4) {
            return [ parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16) ];
        }
        
        return null;
    };

    proto.getAttribute = function(attr) {
        var el = this.getEl();
        if (this.patterns.color.test(attr) ) {
            var val = YAHOO.util.Dom.getStyle(el, attr);
            
            var that = this;
            if (this.patterns.transparent.test(val)) { // bgcolor default
                var parent = YAHOO.util.Dom.getAncestorBy(el, function(node) {
                    return !that.patterns.transparent.test(val);
                });

                if (parent) {
                    val = Y.Dom.getStyle(parent, attr);
                } else {
                    val = ColorAnim.DEFAULT_BGCOLOR;
                }
            }
        } else {
            val = superclass.getAttribute.call(this, attr);
        }

        return val;
    };
    
    proto.doMethod = function(attr, start, end) {
        var val;
    
        if ( this.patterns.color.test(attr) ) {
            val = [];
            for (var i = 0, len = start.length; i < len; ++i) {
                val[i] = superclass.doMethod.call(this, attr, start[i], end[i]);
            }
            
            val = 'rgb('+Math.floor(val[0])+','+Math.floor(val[1])+','+Math.floor(val[2])+')';
        }
        else {
            val = superclass.doMethod.call(this, attr, start, end);
        }

        return val;
    };

    proto.setRuntimeAttribute = function(attr) {
        superclass.setRuntimeAttribute.call(this, attr);
        
        if ( this.patterns.color.test(attr) ) {
            var attributes = this.attributes;
            var start = this.parseColor(this.runtimeAttributes[attr].start);
            var end = this.parseColor(this.runtimeAttributes[attr].end);
            // fix colors if going "by"
            if ( typeof attributes[attr]['to'] === 'undefined' && typeof attributes[attr]['by'] !== 'undefined' ) {
                end = this.parseColor(attributes[attr].by);
            
                for (var i = 0, len = start.length; i < len; ++i) {
                    end[i] = start[i] + end[i];
                }
            }
            
            this.runtimeAttributes[attr].start = start;
            this.runtimeAttributes[attr].end = end;
        }
    };

    Y.ColorAnim = ColorAnim;
})();
/*!
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright 2001 Robert Penner All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Singleton that determines how an animation proceeds from start to end.
 * @class Easing
 * @namespace YAHOO.util
*/

YAHOO.util.Easing = {

    /**
     * Uniform speed between points.
     * @method easeNone
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeNone: function (t, b, c, d) {
    	return c*t/d + b;
    },
    
    /**
     * Begins slowly and accelerates towards end.
     * @method easeIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeIn: function (t, b, c, d) {
    	return c*(t/=d)*t + b;
    },

    /**
     * Begins quickly and decelerates towards end.
     * @method easeOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeOut: function (t, b, c, d) {
    	return -c *(t/=d)*(t-2) + b;
    },
    
    /**
     * Begins slowly and decelerates towards end.
     * @method easeBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeBoth: function (t, b, c, d) {
    	if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        
    	return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    
    /**
     * Begins slowly and accelerates towards end.
     * @method easeInStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeInStrong: function (t, b, c, d) {
    	return c*(t/=d)*t*t*t + b;
    },
    
    /**
     * Begins quickly and decelerates towards end.
     * @method easeOutStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeOutStrong: function (t, b, c, d) {
    	return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    
    /**
     * Begins slowly and decelerates towards end.
     * @method easeBothStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeBothStrong: function (t, b, c, d) {
    	if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        
    	return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },

    /**
     * Snap in elastic effect.
     * @method elasticIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */

    elasticIn: function (t, b, c, d, a, p) {
    	if (t == 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*.3;
        }
        
    	if (!a || a < Math.abs(c)) {
            a = c; 
            var s = p/4;
        }
    	else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
    	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },

    /**
     * Snap out elastic effect.
     * @method elasticOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */
    elasticOut: function (t, b, c, d, a, p) {
    	if (t == 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*.3;
        }
        
    	if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
    	else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
    	return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    
    /**
     * Snap both elastic effect.
     * @method elasticBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */
    elasticBoth: function (t, b, c, d, a, p) {
    	if (t == 0) {
            return b;
        }
        
        if ( (t /= d/2) == 2 ) {
            return b+c;
        }
        
        if (!p) {
            p = d*(.3*1.5);
        }
        
    	if ( !a || a < Math.abs(c) ) {
            a = c; 
            var s = p/4;
        }
    	else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
    	if (t < 1) {
            return -.5*(a*Math.pow(2,10*(t-=1)) * 
                    Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
    	return a*Math.pow(2,-10*(t-=1)) * 
                Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },


    /**
     * Backtracks slightly, then reverses direction and moves to end.
     * @method backIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backIn: function (t, b, c, d, s) {
    	if (typeof s == 'undefined') {
            s = 1.70158;
        }
    	return c*(t/=d)*t*((s+1)*t - s) + b;
    },

    /**
     * Overshoots end, then reverses and comes back to end.
     * @method backOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backOut: function (t, b, c, d, s) {
    	if (typeof s == 'undefined') {
            s = 1.70158;
        }
    	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    
    /**
     * Backtracks slightly, then reverses direction, overshoots end, 
     * then reverses and comes back to end.
     * @method backBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backBoth: function (t, b, c, d, s) {
    	if (typeof s == 'undefined') {
            s = 1.70158; 
        }
        
    	if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
    	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },

    /**
     * Bounce off of start.
     * @method bounceIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceIn: function (t, b, c, d) {
    	return c - YAHOO.util.Easing.bounceOut(d-t, 0, c, d) + b;
    },
    
    /**
     * Bounces off end.
     * @method bounceOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceOut: function (t, b, c, d) {
    	if ((t/=d) < (1/2.75)) {
    		return c*(7.5625*t*t) + b;
    	} else if (t < (2/2.75)) {
    		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    	} else if (t < (2.5/2.75)) {
    		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    	}
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    },
    
    /**
     * Bounces off start and end.
     * @method bounceBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceBoth: function (t, b, c, d) {
    	if (t < d/2) {
            return YAHOO.util.Easing.bounceIn(t*2, 0, c, d) * .5 + b;
        }
    	return YAHOO.util.Easing.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
};

(function() {
/**
 * Anim subclass for moving elements along a path defined by the "points" 
 * member of "attributes".  All "points" are arrays with x, y coordinates.
 * <p>Usage: <code>var myAnim = new YAHOO.util.Motion(el, { points: { to: [800, 800] } }, 1, YAHOO.util.Easing.easeOut);</code></p>
 * @class Motion
 * @namespace YAHOO.util
 * @requires YAHOO.util.Anim
 * @requires YAHOO.util.AnimMgr
 * @requires YAHOO.util.Easing
 * @requires YAHOO.util.Bezier
 * @requires YAHOO.util.Dom
 * @requires YAHOO.util.Event
 * @requires YAHOO.util.CustomEvent 
 * @constructor
 * @extends YAHOO.util.ColorAnim
 * @param {String | HTMLElement} el Reference to the element that will be animated
 * @param {Object} attributes The attribute(s) to be animated.  
 * Each attribute is an object with at minimum a "to" or "by" member defined.  
 * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").  
 * All attribute names use camelCase.
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to YAHOO.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a YAHOO.util.Easing method)
 */
    var Motion = function(el, attributes, duration,  method) {
        if (el) { // dont break existing subclasses not using YAHOO.extend
            Motion.superclass.constructor.call(this, el, attributes, duration, method);
        }
    };


    Motion.NAME = 'Motion';

    // shorthand
    var Y = YAHOO.util;
    YAHOO.extend(Motion, Y.ColorAnim);
    
    var superclass = Motion.superclass;
    var proto = Motion.prototype;

    proto.patterns.points = /^points$/i;
    
    proto.setAttribute = function(attr, val, unit) {
        if (  this.patterns.points.test(attr) ) {
            unit = unit || 'px';
            superclass.setAttribute.call(this, 'left', val[0], unit);
            superclass.setAttribute.call(this, 'top', val[1], unit);
        } else {
            superclass.setAttribute.call(this, attr, val, unit);
        }
    };

    proto.getAttribute = function(attr) {
        if (  this.patterns.points.test(attr) ) {
            var val = [
                superclass.getAttribute.call(this, 'left'),
                superclass.getAttribute.call(this, 'top')
            ];
        } else {
            val = superclass.getAttribute.call(this, attr);
        }

        return val;
    };

    proto.doMethod = function(attr, start, end) {
        var val = null;

        if ( this.patterns.points.test(attr) ) {
            var t = this.method(this.currentFrame, 0, 100, this.totalFrames) / 100;				
            val = Y.Bezier.getPosition(this.runtimeAttributes[attr], t);
        } else {
            val = superclass.doMethod.call(this, attr, start, end);
        }
        return val;
    };

    proto.setRuntimeAttribute = function(attr) {
        if ( this.patterns.points.test(attr) ) {
            var el = this.getEl();
            var attributes = this.attributes;
            var start;
            var control = attributes['points']['control'] || [];
            var end;
            var i, len;
            
            if (control.length > 0 && !(control[0] instanceof Array) ) { // could be single point or array of points
                control = [control];
            } else { // break reference to attributes.points.control
                var tmp = []; 
                for (i = 0, len = control.length; i< len; ++i) {
                    tmp[i] = control[i];
                }
                control = tmp;
            }

            if (Y.Dom.getStyle(el, 'position') == 'static') { // default to relative
                Y.Dom.setStyle(el, 'position', 'relative');
            }
    
            if ( isset(attributes['points']['from']) ) {
                Y.Dom.setXY(el, attributes['points']['from']); // set position to from point
            } 
            else { Y.Dom.setXY( el, Y.Dom.getXY(el) ); } // set it to current position
            
            start = this.getAttribute('points'); // get actual top & left
            
            // TO beats BY, per SMIL 2.1 spec
            if ( isset(attributes['points']['to']) ) {
                end = translateValues.call(this, attributes['points']['to'], start);
                
                var pageXY = Y.Dom.getXY(this.getEl());
                for (i = 0, len = control.length; i < len; ++i) {
                    control[i] = translateValues.call(this, control[i], start);
                }

                
            } else if ( isset(attributes['points']['by']) ) {
                end = [ start[0] + attributes['points']['by'][0], start[1] + attributes['points']['by'][1] ];
                
                for (i = 0, len = control.length; i < len; ++i) {
                    control[i] = [ start[0] + control[i][0], start[1] + control[i][1] ];
                }
            }

            this.runtimeAttributes[attr] = [start];
            
            if (control.length > 0) {
                this.runtimeAttributes[attr] = this.runtimeAttributes[attr].concat(control); 
            }

            this.runtimeAttributes[attr][this.runtimeAttributes[attr].length] = end;
        }
        else {
            superclass.setRuntimeAttribute.call(this, attr);
        }
    };
    
    var translateValues = function(val, start) {
        var pageXY = Y.Dom.getXY(this.getEl());
        val = [ val[0] - pageXY[0] + start[0], val[1] - pageXY[1] + start[1] ];

        return val; 
    };
    
    var isset = function(prop) {
        return (typeof prop !== 'undefined');
    };

    Y.Motion = Motion;
})();
(function() {
/**
 * Anim subclass for scrolling elements to a position defined by the "scroll"
 * member of "attributes".  All "scroll" members are arrays with x, y scroll positions.
 * <p>Usage: <code>var myAnim = new YAHOO.util.Scroll(el, { scroll: { to: [0, 800] } }, 1, YAHOO.util.Easing.easeOut);</code></p>
 * @class Scroll
 * @namespace YAHOO.util
 * @requires YAHOO.util.Anim
 * @requires YAHOO.util.AnimMgr
 * @requires YAHOO.util.Easing
 * @requires YAHOO.util.Bezier
 * @requires YAHOO.util.Dom
 * @requires YAHOO.util.Event
 * @requires YAHOO.util.CustomEvent 
 * @extends YAHOO.util.ColorAnim
 * @constructor
 * @param {String or HTMLElement} el Reference to the element that will be animated
 * @param {Object} attributes The attribute(s) to be animated.  
 * Each attribute is an object with at minimum a "to" or "by" member defined.  
 * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").  
 * All attribute names use camelCase.
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to YAHOO.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a YAHOO.util.Easing method)
 */
    var Scroll = function(el, attributes, duration,  method) {
        if (el) { // dont break existing subclasses not using YAHOO.extend
            Scroll.superclass.constructor.call(this, el, attributes, duration, method);
        }
    };

    Scroll.NAME = 'Scroll';

    // shorthand
    var Y = YAHOO.util;
    YAHOO.extend(Scroll, Y.ColorAnim);
    
    var superclass = Scroll.superclass;
    var proto = Scroll.prototype;

    proto.doMethod = function(attr, start, end) {
        var val = null;
    
        if (attr == 'scroll') {
            val = [
                this.method(this.currentFrame, start[0], end[0] - start[0], this.totalFrames),
                this.method(this.currentFrame, start[1], end[1] - start[1], this.totalFrames)
            ];
            
        } else {
            val = superclass.doMethod.call(this, attr, start, end);
        }
        return val;
    };

    proto.getAttribute = function(attr) {
        var val = null;
        var el = this.getEl();
        
        if (attr == 'scroll') {
            val = [ el.scrollLeft, el.scrollTop ];
        } else {
            val = superclass.getAttribute.call(this, attr);
        }
        
        return val;
    };

    proto.setAttribute = function(attr, val, unit) {
        var el = this.getEl();
        
        if (attr == 'scroll') {
            el.scrollLeft = val[0];
            el.scrollTop = val[1];
        } else {
            superclass.setAttribute.call(this, attr, val, unit);
        }
    };

    Y.Scroll = Scroll;
})();
YAHOO.register("animation", YAHOO.util.Anim, {version: "2.7.0", build: "1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
/**
 * The Connection Manager provides a simplified interface to the XMLHttpRequest
 * object.  It handles cross-browser instantiantion of XMLHttpRequest, negotiates the
 * interactive states and server response, returning the results to a pre-defined
 * callback you create.
 *
 * @namespace YAHOO.util
 * @module connection
 * @requires yahoo
 * @requires event
 */

/**
 * The Connection Manager singleton provides methods for creating and managing
 * asynchronous transactions.
 *
 * @class Connect
 */

YAHOO.util.Connect =
{
  /**
   * @description Array of MSFT ActiveX ids for XMLHttpRequest.
   * @property _msxml_progid
   * @private
   * @static
   * @type array
   */
	_msxml_progid:[
		'Microsoft.XMLHTTP',
		'MSXML2.XMLHTTP.3.0',
		'MSXML2.XMLHTTP'
		],

  /**
   * @description Object literal of HTTP header(s)
   * @property _http_header
   * @private
   * @static
   * @type object
   */
	_http_headers:{},

  /**
   * @description Determines if HTTP headers are set.
   * @property _has_http_headers
   * @private
   * @static
   * @type boolean
   */
	_has_http_headers:false,

 /**
  * @description Determines if a default header of
  * Content-Type of 'application/x-www-form-urlencoded'
  * will be added to any client HTTP headers sent for POST
  * transactions.
  * @property _use_default_post_header
  * @private
  * @static
  * @type boolean
  */
    _use_default_post_header:true,

 /**
  * @description The default header used for POST transactions.
  * @property _default_post_header
  * @private
  * @static
  * @type boolean
  */
    _default_post_header:'application/x-www-form-urlencoded; charset=UTF-8',

 /**
  * @description The default header used for transactions involving the
  * use of HTML forms.
  * @property _default_form_header
  * @private
  * @static
  * @type boolean
  */
    _default_form_header:'application/x-www-form-urlencoded',

 /**
  * @description Determines if a default header of
  * 'X-Requested-With: XMLHttpRequest'
  * will be added to each transaction.
  * @property _use_default_xhr_header
  * @private
  * @static
  * @type boolean
  */
    _use_default_xhr_header:true,

 /**
  * @description The default header value for the label
  * "X-Requested-With".  This is sent with each
  * transaction, by default, to identify the
  * request as being made by YUI Connection Manager.
  * @property _default_xhr_header
  * @private
  * @static
  * @type boolean
  */
    _default_xhr_header:'XMLHttpRequest',

 /**
  * @description Determines if custom, default headers
  * are set for each transaction.
  * @property _has_default_header
  * @private
  * @static
  * @type boolean
  */
    _has_default_headers:true,

 /**
  * @description Determines if custom, default headers
  * are set for each transaction.
  * @property _has_default_header
  * @private
  * @static
  * @type boolean
  */
    _default_headers:{},

 /**
  * @description Property modified by setForm() to determine if the data
  * should be submitted as an HTML form.
  * @property _isFormSubmit
  * @private
  * @static
  * @type boolean
  */
    _isFormSubmit:false,

 /**
  * @description Property modified by setForm() to determine if a file(s)
  * upload is expected.
  * @property _isFileUpload
  * @private
  * @static
  * @type boolean
  */
    _isFileUpload:false,

 /**
  * @description Property modified by setForm() to set a reference to the HTML
  * form node if the desired action is file upload.
  * @property _formNode
  * @private
  * @static
  * @type object
  */
    _formNode:null,

 /**
  * @description Property modified by setForm() to set the HTML form data
  * for each transaction.
  * @property _sFormData
  * @private
  * @static
  * @type string
  */
    _sFormData:null,

 /**
  * @description Collection of polling references to the polling mechanism in handleReadyState.
  * @property _poll
  * @private
  * @static
  * @type object
  */
    _poll:{},

 /**
  * @description Queue of timeout values for each transaction callback with a defined timeout value.
  * @property _timeOut
  * @private
  * @static
  * @type object
  */
    _timeOut:{},

  /**
   * @description The polling frequency, in milliseconds, for HandleReadyState.
   * when attempting to determine a transaction's XHR readyState.
   * The default is 50 milliseconds.
   * @property _polling_interval
   * @private
   * @static
   * @type int
   */
     _polling_interval:50,

  /**
   * @description A transaction counter that increments the transaction id for each transaction.
   * @property _transaction_id
   * @private
   * @static
   * @type int
   */
     _transaction_id:0,

  /**
   * @description Tracks the name-value pair of the "clicked" submit button if multiple submit
   * buttons are present in an HTML form; and, if YAHOO.util.Event is available.
   * @property _submitElementValue
   * @private
   * @static
   * @type string
   */
	 _submitElementValue:null,

  /**
   * @description Determines whether YAHOO.util.Event is available and returns true or false.
   * If true, an event listener is bound at the document level to trap click events that
   * resolve to a target type of "Submit".  This listener will enable setForm() to determine
   * the clicked "Submit" value in a multi-Submit button, HTML form.
   * @property _hasSubmitListener
   * @private
   * @static
   */
	 _hasSubmitListener:(function()
	 {
		if(YAHOO.util.Event){
			YAHOO.util.Event.addListener(
				document,
				'click',
				function(e){
					var obj = YAHOO.util.Event.getTarget(e),
						name = obj.nodeName.toLowerCase();
					if((name === 'input' || name === 'button') && (obj.type && obj.type.toLowerCase() == 'submit')){
						YAHOO.util.Connect._submitElementValue = encodeURIComponent(obj.name) + "=" + encodeURIComponent(obj.value);
					}
				});
			return true;
	    }
	    return false;
	 })(),

  /**
   * @description Custom event that fires at the start of a transaction
   * @property startEvent
   * @private
   * @static
   * @type CustomEvent
   */
	startEvent: new YAHOO.util.CustomEvent('start'),

  /**
   * @description Custom event that fires when a transaction response has completed.
   * @property completeEvent
   * @private
   * @static
   * @type CustomEvent
   */
	completeEvent: new YAHOO.util.CustomEvent('complete'),

  /**
   * @description Custom event that fires when handleTransactionResponse() determines a
   * response in the HTTP 2xx range.
   * @property successEvent
   * @private
   * @static
   * @type CustomEvent
   */
	successEvent: new YAHOO.util.CustomEvent('success'),

  /**
   * @description Custom event that fires when handleTransactionResponse() determines a
   * response in the HTTP 4xx/5xx range.
   * @property failureEvent
   * @private
   * @static
   * @type CustomEvent
   */
	failureEvent: new YAHOO.util.CustomEvent('failure'),

  /**
   * @description Custom event that fires when handleTransactionResponse() determines a
   * response in the HTTP 4xx/5xx range.
   * @property failureEvent
   * @private
   * @static
   * @type CustomEvent
   */
	uploadEvent: new YAHOO.util.CustomEvent('upload'),

  /**
   * @description Custom event that fires when a transaction is successfully aborted.
   * @property abortEvent
   * @private
   * @static
   * @type CustomEvent
   */
	abortEvent: new YAHOO.util.CustomEvent('abort'),

  /**
   * @description A reference table that maps callback custom events members to its specific
   * event name.
   * @property _customEvents
   * @private
   * @static
   * @type object
   */
	_customEvents:
	{
		onStart:['startEvent', 'start'],
		onComplete:['completeEvent', 'complete'],
		onSuccess:['successEvent', 'success'],
		onFailure:['failureEvent', 'failure'],
		onUpload:['uploadEvent', 'upload'],
		onAbort:['abortEvent', 'abort']
	},

  /**
   * @description Member to add an ActiveX id to the existing xml_progid array.
   * In the event(unlikely) a new ActiveX id is introduced, it can be added
   * without internal code modifications.
   * @method setProgId
   * @public
   * @static
   * @param {string} id The ActiveX id to be added to initialize the XHR object.
   * @return void
   */
	setProgId:function(id)
	{
		this._msxml_progid.unshift(id);
	},

  /**
   * @description Member to override the default POST header.
   * @method setDefaultPostHeader
   * @public
   * @static
   * @param {boolean} b Set and use default header - true or false .
   * @return void
   */
	setDefaultPostHeader:function(b)
	{
		if(typeof b == 'string'){
			this._default_post_header = b;
		}
		else if(typeof b == 'boolean'){
			this._use_default_post_header = b;
		}
	},

  /**
   * @description Member to override the default transaction header..
   * @method setDefaultXhrHeader
   * @public
   * @static
   * @param {boolean} b Set and use default header - true or false .
   * @return void
   */
	setDefaultXhrHeader:function(b)
	{
		if(typeof b == 'string'){
			this._default_xhr_header = b;
		}
		else{
			this._use_default_xhr_header = b;
		}
	},

  /**
   * @description Member to modify the default polling interval.
   * @method setPollingInterval
   * @public
   * @static
   * @param {int} i The polling interval in milliseconds.
   * @return void
   */
	setPollingInterval:function(i)
	{
		if(typeof i == 'number' && isFinite(i)){
			this._polling_interval = i;
		}
	},

  /**
   * @description Instantiates a XMLHttpRequest object and returns an object with two properties:
   * the XMLHttpRequest instance and the transaction id.
   * @method createXhrObject
   * @private
   * @static
   * @param {int} transactionId Property containing the transaction id for this transaction.
   * @return object
   */
	createXhrObject:function(transactionId)
	{
		var obj,http;
		try
		{
			// Instantiates XMLHttpRequest in non-IE browsers and assigns to http.
			http = new XMLHttpRequest();
			//  Object literal with http and tId properties
			obj = { conn:http, tId:transactionId };
		}
		catch(e)
		{
			for(var i=0; i<this._msxml_progid.length; ++i){
				try
				{
					// Instantiates XMLHttpRequest for IE and assign to http
					http = new ActiveXObject(this._msxml_progid[i]);
					//  Object literal with conn and tId properties
					obj = { conn:http, tId:transactionId };
					break;
				}
				catch(e2){}
			}
		}
		finally
		{
			return obj;
		}
	},

  /**
   * @description This method is called by asyncRequest to create a
   * valid connection object for the transaction.  It also passes a
   * transaction id and increments the transaction id counter.
   * @method getConnectionObject
   * @private
   * @static
   * @return {object}
   */
	getConnectionObject:function(isFileUpload)
	{
		var o;
		var tId = this._transaction_id;

		try
		{
			if(!isFileUpload){
				o = this.createXhrObject(tId);
			}
			else{
				o = {};
				o.tId = tId;
				o.isUpload = true;
			}

			if(o){
				this._transaction_id++;
			}
		}
		catch(e){}
		finally
		{
			return o;
		}
	},

  /**
   * @description Method for initiating an asynchronous request via the XHR object.
   * @method asyncRequest
   * @public
   * @static
   * @param {string} method HTTP transaction method
   * @param {string} uri Fully qualified path of resource
   * @param {callback} callback User-defined callback function or object
   * @param {string} postData POST body
   * @return {object} Returns the connection object
   */
	asyncRequest:function(method, uri, callback, postData)
	{
		var o = (this._isFileUpload)?this.getConnectionObject(true):this.getConnectionObject();
		var args = (callback && callback.argument)?callback.argument:null;

		if(!o){
			return null;
		}
		else{

			// Intialize any transaction-specific custom events, if provided.
			if(callback && callback.customevents){
				this.initCustomEvents(o, callback);
			}

			if(this._isFormSubmit){
				if(this._isFileUpload){
					this.uploadFile(o, callback, uri, postData);
					return o;
				}

				// If the specified HTTP method is GET, setForm() will return an
				// encoded string that is concatenated to the uri to
				// create a querystring.
				if(method.toUpperCase() == 'GET'){
					if(this._sFormData.length !== 0){
						// If the URI already contains a querystring, append an ampersand
						// and then concatenate _sFormData to the URI.
						uri += ((uri.indexOf('?') == -1)?'?':'&') + this._sFormData;
					}
				}
				else if(method.toUpperCase() == 'POST'){
					// If POST data exist in addition to the HTML form data,
					// it will be concatenated to the form data.
					postData = postData?this._sFormData + "&" + postData:this._sFormData;
				}
			}

			if(method.toUpperCase() == 'GET' && (callback && callback.cache === false)){
				// If callback.cache is defined and set to false, a
				// timestamp value will be added to the querystring.
				uri += ((uri.indexOf('?') == -1)?'?':'&') + "rnd=" + new Date().valueOf().toString();
			}

			o.conn.open(method, uri, true);

			// Each transaction will automatically include a custom header of
			// "X-Requested-With: XMLHttpRequest" to identify the request as
			// having originated from Connection Manager.
			if(this._use_default_xhr_header){
				if(!this._default_headers['X-Requested-With']){
					this.initHeader('X-Requested-With', this._default_xhr_header, true);
				}
			}

			//If the transaction method is POST and the POST header value is set to true
			//or a custom value, initalize the Content-Type header to this value.
			if((method.toUpperCase() === 'POST' && this._use_default_post_header) && this._isFormSubmit === false){
				this.initHeader('Content-Type', this._default_post_header);
			}

			//Initialize all default and custom HTTP headers,
			if(this._has_default_headers || this._has_http_headers){
				this.setHeader(o);
			}

			this.handleReadyState(o, callback);
			o.conn.send(postData || '');


			// Reset the HTML form data and state properties as
			// soon as the data are submitted.
			if(this._isFormSubmit === true){
				this.resetFormState();
			}

			// Fire global custom event -- startEvent
			this.startEvent.fire(o, args);

			if(o.startEvent){
				// Fire transaction custom event -- startEvent
				o.startEvent.fire(o, args);
			}

			return o;
		}
	},

  /**
   * @description This method creates and subscribes custom events,
   * specific to each transaction
   * @method initCustomEvents
   * @private
   * @static
   * @param {object} o The connection object
   * @param {callback} callback The user-defined callback object
   * @return {void}
   */
	initCustomEvents:function(o, callback)
	{
		var prop;
		// Enumerate through callback.customevents members and bind/subscribe
		// events that match in the _customEvents table.
		for(prop in callback.customevents){
			if(this._customEvents[prop][0]){
				// Create the custom event
				o[this._customEvents[prop][0]] = new YAHOO.util.CustomEvent(this._customEvents[prop][1], (callback.scope)?callback.scope:null);

				// Subscribe the custom event
				o[this._customEvents[prop][0]].subscribe(callback.customevents[prop]);
			}
		}
	},

  /**
   * @description This method serves as a timer that polls the XHR object's readyState
   * property during a transaction, instead of binding a callback to the
   * onreadystatechange event.  Upon readyState 4, handleTransactionResponse
   * will process the response, and the timer will be cleared.
   * @method handleReadyState
   * @private
   * @static
   * @param {object} o The connection object
   * @param {callback} callback The user-defined callback object
   * @return {void}
   */

    handleReadyState:function(o, callback)

    {
		var oConn = this;
		var args = (callback && callback.argument)?callback.argument:null;

		if(callback && callback.timeout){
			this._timeOut[o.tId] = window.setTimeout(function(){ oConn.abort(o, callback, true); }, callback.timeout);
		}

		this._poll[o.tId] = window.setInterval(
			function(){
				if(o.conn && o.conn.readyState === 4){

					// Clear the polling interval for the transaction
					// and remove the reference from _poll.
					window.clearInterval(oConn._poll[o.tId]);
					delete oConn._poll[o.tId];

					if(callback && callback.timeout){
						window.clearTimeout(oConn._timeOut[o.tId]);
						delete oConn._timeOut[o.tId];
					}

					// Fire global custom event -- completeEvent
					oConn.completeEvent.fire(o, args);

					if(o.completeEvent){
						// Fire transaction custom event -- completeEvent
						o.completeEvent.fire(o, args);
					}

					oConn.handleTransactionResponse(o, callback);
				}
			}
		,this._polling_interval);
    },

  /**
   * @description This method attempts to interpret the server response and
   * determine whether the transaction was successful, or if an error or
   * exception was encountered.
   * @method handleTransactionResponse
   * @private
   * @static
   * @param {object} o The connection object
   * @param {object} callback The user-defined callback object
   * @param {boolean} isAbort Determines if the transaction was terminated via abort().
   * @return {void}
   */
    handleTransactionResponse:function(o, callback, isAbort)
    {
		var httpStatus, responseObject;
		var args = (callback && callback.argument)?callback.argument:null;

		try
		{
			if(o.conn.status !== undefined && o.conn.status !== 0){
				httpStatus = o.conn.status;
			}
			else{
				httpStatus = 13030;
			}
		}
		catch(e){

			 // 13030 is a custom code to indicate the condition -- in Mozilla/FF --
			 // when the XHR object's status and statusText properties are
			 // unavailable, and a query attempt throws an exception.
			httpStatus = 13030;
		}

		if(httpStatus >= 200 && httpStatus < 300 || httpStatus === 1223){
			responseObject = this.createResponseObject(o, args);
			if(callback && callback.success){
				if(!callback.scope){
					callback.success(responseObject);
				}
				else{
					// If a scope property is defined, the callback will be fired from
					// the context of the object.
					callback.success.apply(callback.scope, [responseObject]);
				}
			}

			// Fire global custom event -- successEvent
			this.successEvent.fire(responseObject);

			if(o.successEvent){
				// Fire transaction custom event -- successEvent
				o.successEvent.fire(responseObject);
			}
		}
		else{
			switch(httpStatus){
				// The following cases are wininet.dll error codes that may be encountered.
				case 12002: // Server timeout
				case 12029: // 12029 to 12031 correspond to dropped connections.
				case 12030:
				case 12031:
				case 12152: // Connection closed by server.
				case 13030: // See above comments for variable status.
					responseObject = this.createExceptionObject(o.tId, args, (isAbort?isAbort:false));
					if(callback && callback.failure){
						if(!callback.scope){
							callback.failure(responseObject);
						}
						else{
							callback.failure.apply(callback.scope, [responseObject]);
						}
					}

					break;
				default:
					responseObject = this.createResponseObject(o, args);
					if(callback && callback.failure){
						if(!callback.scope){
							callback.failure(responseObject);
						}
						else{
							callback.failure.apply(callback.scope, [responseObject]);
						}
					}
			}

			// Fire global custom event -- failureEvent
			this.failureEvent.fire(responseObject);

			if(o.failureEvent){
				// Fire transaction custom event -- failureEvent
				o.failureEvent.fire(responseObject);
			}

		}

		this.releaseObject(o);
		responseObject = null;
    },

  /**
   * @description This method evaluates the server response, creates and returns the results via
   * its properties.  Success and failure cases will differ in the response
   * object's property values.
   * @method createResponseObject
   * @private
   * @static
   * @param {object} o The connection object
   * @param {callbackArg} callbackArg The user-defined argument or arguments to be passed to the callback
   * @return {object}
   */
    createResponseObject:function(o, callbackArg)
    {
		var obj = {};
		var headerObj = {};

		try
		{
			var headerStr = o.conn.getAllResponseHeaders();
			var header = headerStr.split('\n');
			for(var i=0; i<header.length; i++){
				var delimitPos = header[i].indexOf(':');
				if(delimitPos != -1){
					headerObj[header[i].substring(0,delimitPos)] = header[i].substring(delimitPos+2);
				}
			}
		}
		catch(e){}

		obj.tId = o.tId;
		// Normalize IE's response to HTTP 204 when Win error 1223.
		obj.status = (o.conn.status == 1223)?204:o.conn.status;
		// Normalize IE's statusText to "No Content" instead of "Unknown".
		obj.statusText = (o.conn.status == 1223)?"No Content":o.conn.statusText;
		obj.getResponseHeader = headerObj;
		obj.getAllResponseHeaders = headerStr;
		obj.responseText = o.conn.responseText;
		obj.responseXML = o.conn.responseXML;

		if(callbackArg){
			obj.argument = callbackArg;
		}

		return obj;
    },

  /**
   * @description If a transaction cannot be completed due to dropped or closed connections,
   * there may be not be enough information to build a full response object.
   * The failure callback will be fired and this specific condition can be identified
   * by a status property value of 0.
   *
   * If an abort was successful, the status property will report a value of -1.
   *
   * @method createExceptionObject
   * @private
   * @static
   * @param {int} tId The Transaction Id
   * @param {callbackArg} callbackArg The user-defined argument or arguments to be passed to the callback
   * @param {boolean} isAbort Determines if the exception case is caused by a transaction abort
   * @return {object}
   */
    createExceptionObject:function(tId, callbackArg, isAbort)
    {
		var COMM_CODE = 0;
		var COMM_ERROR = 'communication failure';
		var ABORT_CODE = -1;
		var ABORT_ERROR = 'transaction aborted';

		var obj = {};

		obj.tId = tId;
		if(isAbort){
			obj.status = ABORT_CODE;
			obj.statusText = ABORT_ERROR;
		}
		else{
			obj.status = COMM_CODE;
			obj.statusText = COMM_ERROR;
		}

		if(callbackArg){
			obj.argument = callbackArg;
		}

		return obj;
    },

  /**
   * @description Method that initializes the custom HTTP headers for the each transaction.
   * @method initHeader
   * @public
   * @static
   * @param {string} label The HTTP header label
   * @param {string} value The HTTP header value
   * @param {string} isDefault Determines if the specific header is a default header
   * automatically sent with each transaction.
   * @return {void}
   */
	initHeader:function(label, value, isDefault)
	{
		var headerObj = (isDefault)?this._default_headers:this._http_headers;
		headerObj[label] = value;

		if(isDefault){
			this._has_default_headers = true;
		}
		else{
			this._has_http_headers = true;
		}
	},


  /**
   * @description Accessor that sets the HTTP headers for each transaction.
   * @method setHeader
   * @private
   * @static
   * @param {object} o The connection object for the transaction.
   * @return {void}
   */
	setHeader:function(o)
	{
		var prop;
		if(this._has_default_headers){
			for(prop in this._default_headers){
				if(YAHOO.lang.hasOwnProperty(this._default_headers, prop)){
					o.conn.setRequestHeader(prop, this._default_headers[prop]);
				}
			}
		}

		if(this._has_http_headers){
			for(prop in this._http_headers){
				if(YAHOO.lang.hasOwnProperty(this._http_headers, prop)){
					o.conn.setRequestHeader(prop, this._http_headers[prop]);
				}
			}
			delete this._http_headers;

			this._http_headers = {};
			this._has_http_headers = false;
		}
	},

  /**
   * @description Resets the default HTTP headers object
   * @method resetDefaultHeaders
   * @public
   * @static
   * @return {void}
   */
	resetDefaultHeaders:function(){
		delete this._default_headers;
		this._default_headers = {};
		this._has_default_headers = false;
	},

  /**
   * @description This method assembles the form label and value pairs and
   * constructs an encoded string.
   * asyncRequest() will automatically initialize the transaction with a
   * a HTTP header Content-Type of application/x-www-form-urlencoded.
   * @method setForm
   * @public
   * @static
   * @param {string || object} form id or name attribute, or form object.
   * @param {boolean} optional enable file upload.
   * @param {boolean} optional enable file upload over SSL in IE only.
   * @return {string} string of the HTML form field name and value pairs..
   */
	setForm:function(formId, isUpload, secureUri)
	{
        var oForm, oElement, oName, oValue, oDisabled,
            hasSubmit = false,
            data = [], item = 0,
            i,len,j,jlen,opt;

		this.resetFormState();

		if(typeof formId == 'string'){
			// Determine if the argument is a form id or a form name.
			// Note form name usage is deprecated by supported
			// here for legacy reasons.
			oForm = (document.getElementById(formId) || document.forms[formId]);
		}
		else if(typeof formId == 'object'){
			// Treat argument as an HTML form object.
			oForm = formId;
		}
		else{
			return;
		}

		// If the isUpload argument is true, setForm will call createFrame to initialize
		// an iframe as the form target.
		//
		// The argument secureURI is also required by IE in SSL environments
		// where the secureURI string is a fully qualified HTTP path, used to set the source
		// of the iframe, to a stub resource in the same domain.
		if(isUpload){

			// Create iframe in preparation for file upload.
			this.createFrame(secureUri?secureUri:null);

			// Set form reference and file upload properties to true.
			this._isFormSubmit = true;
			this._isFileUpload = true;
			this._formNode = oForm;

			return;

		}

		// Iterate over the form elements collection to construct the
		// label-value pairs.
		for (i=0,len=oForm.elements.length; i<len; ++i){
			oElement  = oForm.elements[i];
			oDisabled = oElement.disabled;
            oName     = oElement.name;

			// Do not submit fields that are disabled or
			// do not have a name attribute value.
			if(!oDisabled && oName)
			{
                oName  = encodeURIComponent(oName)+'=';
                oValue = encodeURIComponent(oElement.value);

				switch(oElement.type)
				{
                    // Safari, Opera, FF all default opt.value from .text if
                    // value attribute not specified in markup
					case 'select-one':
                        if (oElement.selectedIndex > -1) {
                            opt = oElement.options[oElement.selectedIndex];
                            data[item++] = oName + encodeURIComponent(
                                (opt.attributes.value && opt.attributes.value.specified) ? opt.value : opt.text);
                        }
                        break;
					case 'select-multiple':
                        if (oElement.selectedIndex > -1) {
                            for(j=oElement.selectedIndex, jlen=oElement.options.length; j<jlen; ++j){
                                opt = oElement.options[j];
                                if (opt.selected) {
                                    data[item++] = oName + encodeURIComponent(
                                        (opt.attributes.value && opt.attributes.value.specified) ? opt.value : opt.text);
                                }
                            }
                        }
						break;
					case 'radio':
					case 'checkbox':
						if(oElement.checked){
                            data[item++] = oName + oValue;
						}
						break;
					case 'file':
						// stub case as XMLHttpRequest will only send the file path as a string.
					case undefined:
						// stub case for fieldset element which returns undefined.
					case 'reset':
						// stub case for input type reset button.
					case 'button':
						// stub case for input type button elements.
						break;
					case 'submit':
						if(hasSubmit === false){
							if(this._hasSubmitListener && this._submitElementValue){
                                data[item++] = this._submitElementValue;
							}
							hasSubmit = true;
						}
						break;
					default:
                        data[item++] = oName + oValue;
				}
			}
		}

		this._isFormSubmit = true;
		this._sFormData = data.join('&');


		this.initHeader('Content-Type', this._default_form_header);

		return this._sFormData;
	},

  /**
   * @description Resets HTML form properties when an HTML form or HTML form
   * with file upload transaction is sent.
   * @method resetFormState
   * @private
   * @static
   * @return {void}
   */
	resetFormState:function(){
		this._isFormSubmit = false;
		this._isFileUpload = false;
		this._formNode = null;
		this._sFormData = "";
	},

  /**
   * @description Creates an iframe to be used for form file uploads.  It is remove from the
   * document upon completion of the upload transaction.
   * @method createFrame
   * @private
   * @static
   * @param {string} optional qualified path of iframe resource for SSL in IE.
   * @return {void}
   */
	createFrame:function(secureUri){

		// IE does not allow the setting of id and name attributes as object
		// properties via createElement().  A different iframe creation
		// pattern is required for IE.
		var frameId = 'yuiIO' + this._transaction_id;
		var io;
		if(YAHOO.env.ua.ie){
			io = document.createElement('<iframe id="' + frameId + '" name="' + frameId + '" />');

			// IE will throw a security exception in an SSL environment if the
			// iframe source is undefined.
			if(typeof secureUri == 'boolean'){
				io.src = 'javascript:false';
			}
		}
		else{
			io = document.createElement('iframe');
			io.id = frameId;
			io.name = frameId;
		}

		io.style.position = 'absolute';
		io.style.top = '-1000px';
		io.style.left = '-1000px';

		document.body.appendChild(io);
	},

  /**
   * @description Parses the POST data and creates hidden form elements
   * for each key-value, and appends them to the HTML form object.
   * @method appendPostData
   * @private
   * @static
   * @param {string} postData The HTTP POST data
   * @return {array} formElements Collection of hidden fields.
   */
	appendPostData:function(postData)
	{
		var formElements = [],
			postMessage = postData.split('&'),
			i, delimitPos;
		for(i=0; i < postMessage.length; i++){
			delimitPos = postMessage[i].indexOf('=');
			if(delimitPos != -1){
				formElements[i] = document.createElement('input');
				formElements[i].type = 'hidden';
				formElements[i].name = decodeURIComponent(postMessage[i].substring(0,delimitPos));
				formElements[i].value = decodeURIComponent(postMessage[i].substring(delimitPos+1));
				this._formNode.appendChild(formElements[i]);
			}
		}

		return formElements;
	},

  /**
   * @description Uploads HTML form, inclusive of files/attachments, using the
   * iframe created in createFrame to facilitate the transaction.
   * @method uploadFile
   * @private
   * @static
   * @param {int} id The transaction id.
   * @param {object} callback User-defined callback object.
   * @param {string} uri Fully qualified path of resource.
   * @param {string} postData POST data to be submitted in addition to HTML form.
   * @return {void}
   */
	uploadFile:function(o, callback, uri, postData){

		// Each iframe has an id prefix of "yuiIO" followed
		// by the unique transaction id.
		var frameId = 'yuiIO' + o.tId,
		    uploadEncoding = 'multipart/form-data',
		    io = document.getElementById(frameId),
		    oConn = this,
			args = (callback && callback.argument)?callback.argument:null,
            oElements,i,prop,obj;

		// Track original HTML form attribute values.
		var rawFormAttributes =
		{
			action:this._formNode.getAttribute('action'),
			method:this._formNode.getAttribute('method'),
			target:this._formNode.getAttribute('target')
		};

		// Initialize the HTML form properties in case they are
		// not defined in the HTML form.
		this._formNode.setAttribute('action', uri);
		this._formNode.setAttribute('method', 'POST');
		this._formNode.setAttribute('target', frameId);

		if(YAHOO.env.ua.ie){
			// IE does not respect property enctype for HTML forms.
			// Instead it uses the property - "encoding".
			this._formNode.setAttribute('encoding', uploadEncoding);
		}
		else{
			this._formNode.setAttribute('enctype', uploadEncoding);
		}

		if(postData){
			oElements = this.appendPostData(postData);
		}

		// Start file upload.
		this._formNode.submit();

		// Fire global custom event -- startEvent
		this.startEvent.fire(o, args);

		if(o.startEvent){
			// Fire transaction custom event -- startEvent
			o.startEvent.fire(o, args);
		}

		// Start polling if a callback is present and the timeout
		// property has been defined.
		if(callback && callback.timeout){
			this._timeOut[o.tId] = window.setTimeout(function(){ oConn.abort(o, callback, true); }, callback.timeout);
		}

		// Remove HTML elements created by appendPostData
		if(oElements && oElements.length > 0){
			for(i=0; i < oElements.length; i++){
				this._formNode.removeChild(oElements[i]);
			}
		}

		// Restore HTML form attributes to their original
		// values prior to file upload.
		for(prop in rawFormAttributes){
			if(YAHOO.lang.hasOwnProperty(rawFormAttributes, prop)){
				if(rawFormAttributes[prop]){
					this._formNode.setAttribute(prop, rawFormAttributes[prop]);
				}
				else{
					this._formNode.removeAttribute(prop);
				}
			}
		}

		// Reset HTML form state properties.
		this.resetFormState();

		// Create the upload callback handler that fires when the iframe
		// receives the load event.  Subsequently, the event handler is detached
		// and the iframe removed from the document.
		var uploadCallback = function()
		{
			if(callback && callback.timeout){
				window.clearTimeout(oConn._timeOut[o.tId]);
				delete oConn._timeOut[o.tId];
			}

			// Fire global custom event -- completeEvent
			oConn.completeEvent.fire(o, args);

			if(o.completeEvent){
				// Fire transaction custom event -- completeEvent
				o.completeEvent.fire(o, args);
			}

			obj = {
			    tId : o.tId,
			    argument : callback.argument
            };

			try
			{
				// responseText and responseXML will be populated with the same data from the iframe.
				// Since the HTTP headers cannot be read from the iframe
				obj.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:io.contentWindow.document.documentElement.textContent;
				obj.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
			}
			catch(e){}

			if(callback && callback.upload){
				if(!callback.scope){
					callback.upload(obj);
				}
				else{
					callback.upload.apply(callback.scope, [obj]);
				}
			}

			// Fire global custom event -- uploadEvent
			oConn.uploadEvent.fire(obj);

			if(o.uploadEvent){
				// Fire transaction custom event -- uploadEvent
				o.uploadEvent.fire(obj);
			}

			YAHOO.util.Event.removeListener(io, "load", uploadCallback);

			setTimeout(
				function(){
					document.body.removeChild(io);
					oConn.releaseObject(o);
				}, 100);
		};

		// Bind the onload handler to the iframe to detect the file upload response.
		YAHOO.util.Event.addListener(io, "load", uploadCallback);
	},

  /**
   * @description Method to terminate a transaction, if it has not reached readyState 4.
   * @method abort
   * @public
   * @static
   * @param {object} o The connection object returned by asyncRequest.
   * @param {object} callback  User-defined callback object.
   * @param {string} isTimeout boolean to indicate if abort resulted from a callback timeout.
   * @return {boolean}
   */
	abort:function(o, callback, isTimeout)
	{
		var abortStatus;
		var args = (callback && callback.argument)?callback.argument:null;


		if(o && o.conn){
			if(this.isCallInProgress(o)){
				// Issue abort request
				o.conn.abort();

				window.clearInterval(this._poll[o.tId]);
				delete this._poll[o.tId];

				if(isTimeout){
					window.clearTimeout(this._timeOut[o.tId]);
					delete this._timeOut[o.tId];
				}

				abortStatus = true;
			}
		}
		else if(o && o.isUpload === true){
			var frameId = 'yuiIO' + o.tId;
			var io = document.getElementById(frameId);

			if(io){
				// Remove all listeners on the iframe prior to
				// its destruction.
				YAHOO.util.Event.removeListener(io, "load");
				// Destroy the iframe facilitating the transaction.
				document.body.removeChild(io);

				if(isTimeout){
					window.clearTimeout(this._timeOut[o.tId]);
					delete this._timeOut[o.tId];
				}

				abortStatus = true;
			}
		}
		else{
			abortStatus = false;
		}

		if(abortStatus === true){
			// Fire global custom event -- abortEvent
			this.abortEvent.fire(o, args);

			if(o.abortEvent){
				// Fire transaction custom event -- abortEvent
				o.abortEvent.fire(o, args);
			}

			this.handleTransactionResponse(o, callback, true);
		}

		return abortStatus;
	},

  /**
   * @description Determines if the transaction is still being processed.
   * @method isCallInProgress
   * @public
   * @static
   * @param {object} o The connection object returned by asyncRequest
   * @return {boolean}
   */
	isCallInProgress:function(o)
	{
		// if the XHR object assigned to the transaction has not been dereferenced,
		// then check its readyState status.  Otherwise, return false.
		if(o && o.conn){
			return o.conn.readyState !== 4 && o.conn.readyState !== 0;
		}
		else if(o && o.isUpload === true){
			var frameId = 'yuiIO' + o.tId;
			return document.getElementById(frameId)?true:false;
		}
		else{
			return false;
		}
	},

  /**
   * @description Dereference the XHR instance and the connection object after the transaction is completed.
   * @method releaseObject
   * @private
   * @static
   * @param {object} o The connection object
   * @return {void}
   */
	releaseObject:function(o)
	{
		if(o && o.conn){
			//dereference the XHR instance.
			o.conn = null;


			//dereference the connection object.
			o = null;
		}
	}
};
YAHOO.register("connection", YAHOO.util.Connect, {version: "2.7.0", build: "1799"});
(function () {

var lang   = YAHOO.lang,
    util   = YAHOO.util,
    Ev     = util.Event;

/**
 * The DataSource utility provides a common configurable interface for widgets to
 * access a variety of data, from JavaScript arrays to online database servers.
 *
 * @module datasource
 * @requires yahoo, event
 * @optional json, get, connection 
 * @title DataSource Utility
 */

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Base class for the YUI DataSource utility.
 *
 * @namespace YAHOO.util
 * @class YAHOO.util.DataSourceBase
 * @constructor
 * @param oLiveData {HTMLElement}  Pointer to live data.
 * @param oConfigs {object} (optional) Object literal of configuration values.
 */
util.DataSourceBase = function(oLiveData, oConfigs) {
    if(oLiveData === null || oLiveData === undefined) {
        return;
    }
    
    this.liveData = oLiveData;
    this._oQueue = {interval:null, conn:null, requests:[]};
    this.responseSchema = {};   

    // Set any config params passed in to override defaults
    if(oConfigs && (oConfigs.constructor == Object)) {
        for(var sConfig in oConfigs) {
            if(sConfig) {
                this[sConfig] = oConfigs[sConfig];
            }
        }
    }
    
    // Validate and initialize public configs
    var maxCacheEntries = this.maxCacheEntries;
    if(!lang.isNumber(maxCacheEntries) || (maxCacheEntries < 0)) {
        maxCacheEntries = 0;
    }

    // Initialize interval tracker
    this._aIntervals = [];

    /////////////////////////////////////////////////////////////////////////////
    //
    // Custom Events
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Fired when a request is made to the local cache.
     *
     * @event cacheRequestEvent
     * @param oArgs.request {Object} The request object.
     * @param oArgs.callback {Object} The callback object.
     * @param oArgs.caller {Object} (deprecated) Use callback.scope.
     */
    this.createEvent("cacheRequestEvent");

    /**
     * Fired when data is retrieved from the local cache.
     *
     * @event cacheResponseEvent
     * @param oArgs.request {Object} The request object.
     * @param oArgs.response {Object} The response object.
     * @param oArgs.callback {Object} The callback object.
     * @param oArgs.caller {Object} (deprecated) Use callback.scope.
     */
    this.createEvent("cacheResponseEvent");

    /**
     * Fired when a request is sent to the live data source.
     *
     * @event requestEvent
     * @param oArgs.request {Object} The request object.
     * @param oArgs.callback {Object} The callback object.
     * @param oArgs.tId {Number} Transaction ID.     
     * @param oArgs.caller {Object} (deprecated) Use callback.scope.
     */
    this.createEvent("requestEvent");

    /**
     * Fired when live data source sends response.
     *
     * @event responseEvent
     * @param oArgs.request {Object} The request object.
     * @param oArgs.response {Object} The raw response object.
     * @param oArgs.callback {Object} The callback object.
     * @param oArgs.tId {Number} Transaction ID.     
     * @param oArgs.caller {Object} (deprecated) Use callback.scope.
     */
    this.createEvent("responseEvent");

    /**
     * Fired when response is parsed.
     *
     * @event responseParseEvent
     * @param oArgs.request {Object} The request object.
     * @param oArgs.response {Object} The parsed response object.
     * @param oArgs.callback {Object} The callback object.
     * @param oArgs.caller {Object} (deprecated) Use callback.scope.
     */
    this.createEvent("responseParseEvent");

    /**
     * Fired when response is cached.
     *
     * @event responseCacheEvent
     * @param oArgs.request {Object} The request object.
     * @param oArgs.response {Object} The parsed response object.
     * @param oArgs.callback {Object} The callback object.
     * @param oArgs.caller {Object} (deprecated) Use callback.scope.
     */
    this.createEvent("responseCacheEvent");
    /**
     * Fired when an error is encountered with the live data source.
     *
     * @event dataErrorEvent
     * @param oArgs.request {Object} The request object.
     * @param oArgs.response {String} The response object (if available).
     * @param oArgs.callback {Object} The callback object.
     * @param oArgs.caller {Object} (deprecated) Use callback.scope.
     * @param oArgs.message {String} The error message.
     */
    this.createEvent("dataErrorEvent");

    /**
     * Fired when the local cache is flushed.
     *
     * @event cacheFlushEvent
     */
    this.createEvent("cacheFlushEvent");

    var DS = util.DataSourceBase;
    this._sName = "DataSource instance" + DS._nIndex;
    DS._nIndex++;
};

var DS = util.DataSourceBase;

lang.augmentObject(DS, {

/////////////////////////////////////////////////////////////////////////////
//
// DataSourceBase public constants
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Type is unknown.
 *
 * @property TYPE_UNKNOWN
 * @type Number
 * @final
 * @default -1
 */
TYPE_UNKNOWN : -1,

/**
 * Type is a JavaScript Array.
 *
 * @property TYPE_JSARRAY
 * @type Number
 * @final
 * @default 0
 */
TYPE_JSARRAY : 0,

/**
 * Type is a JavaScript Function.
 *
 * @property TYPE_JSFUNCTION
 * @type Number
 * @final
 * @default 1
 */
TYPE_JSFUNCTION : 1,

/**
 * Type is hosted on a server via an XHR connection.
 *
 * @property TYPE_XHR
 * @type Number
 * @final
 * @default 2
 */
TYPE_XHR : 2,

/**
 * Type is JSON.
 *
 * @property TYPE_JSON
 * @type Number
 * @final
 * @default 3
 */
TYPE_JSON : 3,

/**
 * Type is XML.
 *
 * @property TYPE_XML
 * @type Number
 * @final
 * @default 4
 */
TYPE_XML : 4,

/**
 * Type is plain text.
 *
 * @property TYPE_TEXT
 * @type Number
 * @final
 * @default 5
 */
TYPE_TEXT : 5,

/**
 * Type is an HTML TABLE element. Data is parsed out of TR elements from all TBODY elements.
 *
 * @property TYPE_HTMLTABLE
 * @type Number
 * @final
 * @default 6
 */
TYPE_HTMLTABLE : 6,

/**
 * Type is hosted on a server via a dynamic script node.
 *
 * @property TYPE_SCRIPTNODE
 * @type Number
 * @final
 * @default 7
 */
TYPE_SCRIPTNODE : 7,

/**
 * Type is local.
 *
 * @property TYPE_LOCAL
 * @type Number
 * @final
 * @default 8
 */
TYPE_LOCAL : 8,

/**
 * Error message for invalid dataresponses.
 *
 * @property ERROR_DATAINVALID
 * @type String
 * @final
 * @default "Invalid data"
 */
ERROR_DATAINVALID : "Invalid data",

/**
 * Error message for null data responses.
 *
 * @property ERROR_DATANULL
 * @type String
 * @final
 * @default "Null data"
 */
ERROR_DATANULL : "Null data",

/////////////////////////////////////////////////////////////////////////////
//
// DataSourceBase private static properties
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Internal class variable to index multiple DataSource instances.
 *
 * @property DataSourceBase._nIndex
 * @type Number
 * @private
 * @static
 */
_nIndex : 0,

/**
 * Internal class variable to assign unique transaction IDs.
 *
 * @property DataSourceBase._nTransactionId
 * @type Number
 * @private
 * @static
 */
_nTransactionId : 0,

/////////////////////////////////////////////////////////////////////////////
//
// DataSourceBase public static methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Executes a configured callback.  For object literal callbacks, the third
 * param determines whether to execute the success handler or failure handler.
 *  
 * @method issueCallback
 * @param callback {Function|Object} the callback to execute
 * @param params {Array} params to be passed to the callback method
 * @param error {Boolean} whether an error occurred
 * @param scope {Object} the scope from which to execute the callback
 * (deprecated - use an object literal callback)
 * @static     
 */
issueCallback : function (callback,params,error,scope) {
    if (lang.isFunction(callback)) {
        callback.apply(scope, params);
    } else if (lang.isObject(callback)) {
        scope = callback.scope || scope || window;
        var callbackFunc = callback.success;
        if (error) {
            callbackFunc = callback.failure;
        }
        if (callbackFunc) {
            callbackFunc.apply(scope, params.concat([callback.argument]));
        }
    }
},

/**
 * Converts data to type String.
 *
 * @method DataSourceBase.parseString
 * @param oData {String | Number | Boolean | Date | Array | Object} Data to parse.
 * The special values null and undefined will return null.
 * @return {String} A string, or null.
 * @static
 */
parseString : function(oData) {
    // Special case null and undefined
    if(!lang.isValue(oData)) {
        return null;
    }
    
    //Convert to string
    var string = oData + "";

    // Validate
    if(lang.isString(string)) {
        return string;
    }
    else {
        return null;
    }
},

/**
 * Converts data to type Number.
 *
 * @method DataSourceBase.parseNumber
 * @param oData {String | Number | Boolean} Data to convert. Note, the following
 * values return as null: null, undefined, NaN, "". 
 * @return {Number} A number, or null.
 * @static
 */
parseNumber : function(oData) {
    if(!lang.isValue(oData) || (oData === "")) {
        return null;
    }

    //Convert to number
    var number = oData * 1;
    
    // Validate
    if(lang.isNumber(number)) {
        return number;
    }
    else {
        return null;
    }
},
// Backward compatibility
convertNumber : function(oData) {
    return DS.parseNumber(oData);
},

/**
 * Converts data to type Date.
 *
 * @method DataSourceBase.parseDate
 * @param oData {Date | String | Number} Data to convert.
 * @return {Date} A Date instance.
 * @static
 */
parseDate : function(oData) {
    var date = null;
    
    //Convert to date
    if(!(oData instanceof Date)) {
        date = new Date(oData);
    }
    else {
        return oData;
    }
    
    // Validate
    if(date instanceof Date) {
        return date;
    }
    else {
        return null;
    }
},
// Backward compatibility
convertDate : function(oData) {
    return DS.parseDate(oData);
}

});

// Done in separate step so referenced functions are defined.
/**
 * Data parsing functions.
 * @property DataSource.Parser
 * @type Object
 * @static
 */
DS.Parser = {
    string   : DS.parseString,
    number   : DS.parseNumber,
    date     : DS.parseDate
};

// Prototype properties and methods
DS.prototype = {

/////////////////////////////////////////////////////////////////////////////
//
// DataSourceBase private properties
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Name of DataSource instance.
 *
 * @property _sName
 * @type String
 * @private
 */
_sName : null,

/**
 * Local cache of data result object literals indexed chronologically.
 *
 * @property _aCache
 * @type Object[]
 * @private
 */
_aCache : null,

/**
 * Local queue of request connections, enabled if queue needs to be managed.
 *
 * @property _oQueue
 * @type Object
 * @private
 */
_oQueue : null,

/**
 * Array of polling interval IDs that have been enabled, needed to clear all intervals.
 *
 * @property _aIntervals
 * @type Array
 * @private
 */
_aIntervals : null,

/////////////////////////////////////////////////////////////////////////////
//
// DataSourceBase public properties
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Max size of the local cache.  Set to 0 to turn off caching.  Caching is
 * useful to reduce the number of server connections.  Recommended only for data
 * sources that return comprehensive results for queries or when stale data is
 * not an issue.
 *
 * @property maxCacheEntries
 * @type Number
 * @default 0
 */
maxCacheEntries : 0,

 /**
 * Pointer to live database.
 *
 * @property liveData
 * @type Object
 */
liveData : null,

/**
 * Where the live data is held:
 * 
 * <dl>  
 *    <dt>TYPE_UNKNOWN</dt>
 *    <dt>TYPE_LOCAL</dt>
 *    <dt>TYPE_XHR</dt>
 *    <dt>TYPE_SCRIPTNODE</dt>
 *    <dt>TYPE_JSFUNCTION</dt>
 * </dl> 
 *  
 * @property dataType
 * @type Number
 * @default YAHOO.util.DataSourceBase.TYPE_UNKNOWN
 *
 */
dataType : DS.TYPE_UNKNOWN,

/**
 * Format of response:
 *  
 * <dl>  
 *    <dt>TYPE_UNKNOWN</dt>
 *    <dt>TYPE_JSARRAY</dt>
 *    <dt>TYPE_JSON</dt>
 *    <dt>TYPE_XML</dt>
 *    <dt>TYPE_TEXT</dt>
 *    <dt>TYPE_HTMLTABLE</dt> 
 * </dl> 
 *
 * @property responseType
 * @type Number
 * @default YAHOO.util.DataSourceBase.TYPE_UNKNOWN
 */
responseType : DS.TYPE_UNKNOWN,

/**
 * Response schema object literal takes a combination of the following properties:
 *
 * <dl>
 * <dt>resultsList</dt> <dd>Pointer to array of tabular data</dd>
 * <dt>resultNode</dt> <dd>Pointer to node name of row data (XML data only)</dd>
 * <dt>recordDelim</dt> <dd>Record delimiter (text data only)</dd>
 * <dt>fieldDelim</dt> <dd>Field delimiter (text data only)</dd>
 * <dt>fields</dt> <dd>Array of field names (aka keys), or array of object literals
 * such as: {key:"fieldname",parser:YAHOO.util.DataSourceBase.parseDate}</dd>
 * <dt>metaFields</dt> <dd>Object literal of keys to include in the oParsedResponse.meta collection</dd>
 * <dt>metaNode</dt> <dd>Name of the node under which to search for meta information in XML response data</dd>
 * </dl>
 *
 * @property responseSchema
 * @type Object
 */
responseSchema : null,

/**
 * Additional arguments passed to the JSON parse routine.  The JSON string
 * is the assumed first argument (where applicable).  This property is not
 * set by default, but the parse methods will use it if present.
 *
 * @property parseJSONArgs
 * @type {MIXED|Array} If an Array, contents are used as individual arguments.
 *                     Otherwise, value is used as an additional argument.
 */
// property intentionally undefined
 
/////////////////////////////////////////////////////////////////////////////
//
// DataSourceBase public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Public accessor to the unique name of the DataSource instance.
 *
 * @method toString
 * @return {String} Unique name of the DataSource instance.
 */
toString : function() {
    return this._sName;
},

/**
 * Overridable method passes request to cache and returns cached response if any,
 * refreshing the hit in the cache as the newest item. Returns null if there is
 * no cache hit.
 *
 * @method getCachedResponse
 * @param oRequest {Object} Request object.
 * @param oCallback {Object} Callback object.
 * @param oCaller {Object} (deprecated) Use callback object.
 * @return {Object} Cached response object or null.
 */
getCachedResponse : function(oRequest, oCallback, oCaller) {
    var aCache = this._aCache;

    // If cache is enabled...
    if(this.maxCacheEntries > 0) {        
        // Initialize local cache
        if(!aCache) {
            this._aCache = [];
        }
        // Look in local cache
        else {
            var nCacheLength = aCache.length;
            if(nCacheLength > 0) {
                var oResponse = null;
                this.fireEvent("cacheRequestEvent", {request:oRequest,callback:oCallback,caller:oCaller});
        
                // Loop through each cached element
                for(var i = nCacheLength-1; i >= 0; i--) {
                    var oCacheElem = aCache[i];
        
                    // Defer cache hit logic to a public overridable method
                    if(this.isCacheHit(oRequest,oCacheElem.request)) {
                        // The cache returned a hit!
                        // Grab the cached response
                        oResponse = oCacheElem.response;
                        this.fireEvent("cacheResponseEvent", {request:oRequest,response:oResponse,callback:oCallback,caller:oCaller});
                        
                        // Refresh the position of the cache hit
                        if(i < nCacheLength-1) {
                            // Remove element from its original location
                            aCache.splice(i,1);
                            // Add as newest
                            this.addToCache(oRequest, oResponse);
                        }
                        
                        // Add a cache flag
                        oResponse.cached = true;
                        break;
                    }
                }
                return oResponse;
            }
        }
    }
    else if(aCache) {
        this._aCache = null;
    }
    return null;
},

/**
 * Default overridable method matches given request to given cached request.
 * Returns true if is a hit, returns false otherwise.  Implementers should
 * override this method to customize the cache-matching algorithm.
 *
 * @method isCacheHit
 * @param oRequest {Object} Request object.
 * @param oCachedRequest {Object} Cached request object.
 * @return {Boolean} True if given request matches cached request, false otherwise.
 */
isCacheHit : function(oRequest, oCachedRequest) {
    return (oRequest === oCachedRequest);
},

/**
 * Adds a new item to the cache. If cache is full, evicts the stalest item
 * before adding the new item.
 *
 * @method addToCache
 * @param oRequest {Object} Request object.
 * @param oResponse {Object} Response object to cache.
 */
addToCache : function(oRequest, oResponse) {
    var aCache = this._aCache;
    if(!aCache) {
        return;
    }

    // If the cache is full, make room by removing stalest element (index=0)
    while(aCache.length >= this.maxCacheEntries) {
        aCache.shift();
    }

    // Add to cache in the newest position, at the end of the array
    var oCacheElem = {request:oRequest,response:oResponse};
    aCache[aCache.length] = oCacheElem;
    this.fireEvent("responseCacheEvent", {request:oRequest,response:oResponse});
},

/**
 * Flushes cache.
 *
 * @method flushCache
 */
flushCache : function() {
    if(this._aCache) {
        this._aCache = [];
        this.fireEvent("cacheFlushEvent");
    }
},

/**
 * Sets up a polling mechanism to send requests at set intervals and forward
 * responses to given callback.
 *
 * @method setInterval
 * @param nMsec {Number} Length of interval in milliseconds.
 * @param oRequest {Object} Request object.
 * @param oCallback {Function} Handler function to receive the response.
 * @param oCaller {Object} (deprecated) Use oCallback.scope.
 * @return {Number} Interval ID.
 */
setInterval : function(nMsec, oRequest, oCallback, oCaller) {
    if(lang.isNumber(nMsec) && (nMsec >= 0)) {
        var oSelf = this;
        var nId = setInterval(function() {
            oSelf.makeConnection(oRequest, oCallback, oCaller);
        }, nMsec);
        this._aIntervals.push(nId);
        return nId;
    }
    else {
    }
},

/**
 * Disables polling mechanism associated with the given interval ID.
 *
 * @method clearInterval
 * @param nId {Number} Interval ID.
 */
clearInterval : function(nId) {
    // Remove from tracker if there
    var tracker = this._aIntervals || [];
    for(var i=tracker.length-1; i>-1; i--) {
        if(tracker[i] === nId) {
            tracker.splice(i,1);
            clearInterval(nId);
        }
    }
},

/**
 * Disables all known polling intervals.
 *
 * @method clearAllIntervals
 */
clearAllIntervals : function() {
    var tracker = this._aIntervals || [];
    for(var i=tracker.length-1; i>-1; i--) {
        clearInterval(tracker[i]);
    }
    tracker = [];
},

/**
 * First looks for cached response, then sends request to live data. The
 * following arguments are passed to the callback function:
 *     <dl>
 *     <dt><code>oRequest</code></dt>
 *     <dd>The same value that was passed in as the first argument to sendRequest.</dd>
 *     <dt><code>oParsedResponse</code></dt>
 *     <dd>An object literal containing the following properties:
 *         <dl>
 *         <dt><code>tId</code></dt>
 *         <dd>Unique transaction ID number.</dd>
 *         <dt><code>results</code></dt>
 *         <dd>Schema-parsed data results.</dd>
 *         <dt><code>error</code></dt>
 *         <dd>True in cases of data error.</dd>
 *         <dt><code>cached</code></dt>
 *         <dd>True when response is returned from DataSource cache.</dd> 
 *         <dt><code>meta</code></dt>
 *         <dd>Schema-parsed meta data.</dd>
 *         </dl>
 *     <dt><code>oPayload</code></dt>
 *     <dd>The same value as was passed in as <code>argument</code> in the oCallback object literal.</dd>
 *     </dl> 
 *
 * @method sendRequest
 * @param oRequest {Object} Request object.
 * @param oCallback {Object} An object literal with the following properties:
 *     <dl>
 *     <dt><code>success</code></dt>
 *     <dd>The function to call when the data is ready.</dd>
 *     <dt><code>failure</code></dt>
 *     <dd>The function to call upon a response failure condition.</dd>
 *     <dt><code>scope</code></dt>
 *     <dd>The object to serve as the scope for the success and failure handlers.</dd>
 *     <dt><code>argument</code></dt>
 *     <dd>Arbitrary data that will be passed back to the success and failure handlers.</dd>
 *     </dl> 
 * @param oCaller {Object} (deprecated) Use oCallback.scope.
 * @return {Number} Transaction ID, or null if response found in cache.
 */
sendRequest : function(oRequest, oCallback, oCaller) {
    // First look in cache
    var oCachedResponse = this.getCachedResponse(oRequest, oCallback, oCaller);
    if(oCachedResponse) {
        DS.issueCallback(oCallback,[oRequest,oCachedResponse],false,oCaller);
        return null;
    }


    // Not in cache, so forward request to live data
    return this.makeConnection(oRequest, oCallback, oCaller);
},

/**
 * Overridable default method generates a unique transaction ID and passes 
 * the live data reference directly to the  handleResponse function. This
 * method should be implemented by subclasses to achieve more complex behavior
 * or to access remote data.          
 *
 * @method makeConnection
 * @param oRequest {Object} Request object.
 * @param oCallback {Object} Callback object literal.
 * @param oCaller {Object} (deprecated) Use oCallback.scope.
 * @return {Number} Transaction ID.
 */
makeConnection : function(oRequest, oCallback, oCaller) {
    var tId = DS._nTransactionId++;
    this.fireEvent("requestEvent", {tId:tId, request:oRequest,callback:oCallback,caller:oCaller});

    /* accounts for the following cases:
    YAHOO.util.DataSourceBase.TYPE_UNKNOWN
    YAHOO.util.DataSourceBase.TYPE_JSARRAY
    YAHOO.util.DataSourceBase.TYPE_JSON
    YAHOO.util.DataSourceBase.TYPE_HTMLTABLE
    YAHOO.util.DataSourceBase.TYPE_XML
    YAHOO.util.DataSourceBase.TYPE_TEXT
    */
    var oRawResponse = this.liveData;
    
    this.handleResponse(oRequest, oRawResponse, oCallback, oCaller, tId);
    return tId;
},

/**
 * Receives raw data response and type converts to XML, JSON, etc as necessary.
 * Forwards oFullResponse to appropriate parsing function to get turned into
 * oParsedResponse. Calls doBeforeCallback() and adds oParsedResponse to 
 * the cache when appropriate before calling issueCallback().
 * 
 * The oParsedResponse object literal has the following properties:
 * <dl>
 *     <dd><dt>tId {Number}</dt> Unique transaction ID</dd>
 *     <dd><dt>results {Array}</dt> Array of parsed data results</dd>
 *     <dd><dt>meta {Object}</dt> Object literal of meta values</dd> 
 *     <dd><dt>error {Boolean}</dt> (optional) True if there was an error</dd>
 *     <dd><dt>cached {Boolean}</dt> (optional) True if response was cached</dd>
 * </dl>
 *
 * @method handleResponse
 * @param oRequest {Object} Request object
 * @param oRawResponse {Object} The raw response from the live database.
 * @param oCallback {Object} Callback object literal.
 * @param oCaller {Object} (deprecated) Use oCallback.scope.
 * @param tId {Number} Transaction ID.
 */
handleResponse : function(oRequest, oRawResponse, oCallback, oCaller, tId) {
    this.fireEvent("responseEvent", {tId:tId, request:oRequest, response:oRawResponse,
            callback:oCallback, caller:oCaller});
    var xhr = (this.dataType == DS.TYPE_XHR) ? true : false;
    var oParsedResponse = null;
    var oFullResponse = oRawResponse;
    
    // Try to sniff data type if it has not been defined
    if(this.responseType === DS.TYPE_UNKNOWN) {
        var ctype = (oRawResponse && oRawResponse.getResponseHeader) ? oRawResponse.getResponseHeader["Content-Type"] : null;
        if(ctype) {
             // xml
            if(ctype.indexOf("text/xml") > -1) {
                this.responseType = DS.TYPE_XML;
            }
            else if(ctype.indexOf("application/json") > -1) { // json
                this.responseType = DS.TYPE_JSON;
            }
            else if(ctype.indexOf("text/plain") > -1) { // text
                this.responseType = DS.TYPE_TEXT;
            }
        }
        else {
            if(YAHOO.lang.isArray(oRawResponse)) { // array
                this.responseType = DS.TYPE_JSARRAY;
            }
             // xml
            else if(oRawResponse && oRawResponse.nodeType && oRawResponse.nodeType == 9) {
                this.responseType = DS.TYPE_XML;
            }
            else if(oRawResponse && oRawResponse.nodeName && (oRawResponse.nodeName.toLowerCase() == "table")) { // table
                this.responseType = DS.TYPE_HTMLTABLE;
            }    
            else if(YAHOO.lang.isObject(oRawResponse)) { // json
                this.responseType = DS.TYPE_JSON;
            }
            else if(YAHOO.lang.isString(oRawResponse)) { // text
                this.responseType = DS.TYPE_TEXT;
            }
        }
    }

    switch(this.responseType) {
        case DS.TYPE_JSARRAY:
            if(xhr && oRawResponse && oRawResponse.responseText) {
                oFullResponse = oRawResponse.responseText; 
            }
            try {
                // Convert to JS array if it's a string
                if(lang.isString(oFullResponse)) {
                    var parseArgs = [oFullResponse].concat(this.parseJSONArgs);
                    // Check for YUI JSON Util
                    if(lang.JSON) {
                        oFullResponse = lang.JSON.parse.apply(lang.JSON,parseArgs);
                    }
                    // Look for JSON parsers using an API similar to json2.js
                    else if(window.JSON && JSON.parse) {
                        oFullResponse = JSON.parse.apply(JSON,parseArgs);
                    }
                    // Look for JSON parsers using an API similar to json.js
                    else if(oFullResponse.parseJSON) {
                        oFullResponse = oFullResponse.parseJSON.apply(oFullResponse,parseArgs.slice(1));
                    }
                    // No JSON lib found so parse the string
                    else {
                        // Trim leading spaces
                        while (oFullResponse.length > 0 &&
                                (oFullResponse.charAt(0) != "{") &&
                                (oFullResponse.charAt(0) != "[")) {
                            oFullResponse = oFullResponse.substring(1, oFullResponse.length);
                        }

                        if(oFullResponse.length > 0) {
                            // Strip extraneous stuff at the end
                            var arrayEnd =
Math.max(oFullResponse.lastIndexOf("]"),oFullResponse.lastIndexOf("}"));
                            oFullResponse = oFullResponse.substring(0,arrayEnd+1);

                            // Turn the string into an object literal...
                            // ...eval is necessary here
                            oFullResponse = eval("(" + oFullResponse + ")");

                        }
                    }
                }
            }
            catch(e1) {
            }
            oFullResponse = this.doBeforeParseData(oRequest, oFullResponse, oCallback);
            oParsedResponse = this.parseArrayData(oRequest, oFullResponse);
            break;
        case DS.TYPE_JSON:
            if(xhr && oRawResponse && oRawResponse.responseText) {
                oFullResponse = oRawResponse.responseText;
            }
            try {
                // Convert to JSON object if it's a string
                if(lang.isString(oFullResponse)) {
                    var parseArgs = [oFullResponse].concat(this.parseJSONArgs);
                    // Check for YUI JSON Util
                    if(lang.JSON) {
                        oFullResponse = lang.JSON.parse.apply(lang.JSON,parseArgs);
                    }
                    // Look for JSON parsers using an API similar to json2.js
                    else if(window.JSON && JSON.parse) {
                        oFullResponse = JSON.parse.apply(JSON,parseArgs);
                    }
                    // Look for JSON parsers using an API similar to json.js
                    else if(oFullResponse.parseJSON) {
                        oFullResponse = oFullResponse.parseJSON.apply(oFullResponse,parseArgs.slice(1));
                    }
                    // No JSON lib found so parse the string
                    else {
                        // Trim leading spaces
                        while (oFullResponse.length > 0 &&
                                (oFullResponse.charAt(0) != "{") &&
                                (oFullResponse.charAt(0) != "[")) {
                            oFullResponse = oFullResponse.substring(1, oFullResponse.length);
                        }
    
                        if(oFullResponse.length > 0) {
                            // Strip extraneous stuff at the end
                            var objEnd = Math.max(oFullResponse.lastIndexOf("]"),oFullResponse.lastIndexOf("}"));
                            oFullResponse = oFullResponse.substring(0,objEnd+1);
    
                            // Turn the string into an object literal...
                            // ...eval is necessary here
                            oFullResponse = eval("(" + oFullResponse + ")");
    
                        }
                    }
                }
            }
            catch(e) {
            }

            oFullResponse = this.doBeforeParseData(oRequest, oFullResponse, oCallback);
            oParsedResponse = this.parseJSONData(oRequest, oFullResponse);
            break;
        case DS.TYPE_HTMLTABLE:
            if(xhr && oRawResponse.responseText) {
                var el = document.createElement('div');
                el.innerHTML = oRawResponse.responseText;
                oFullResponse = el.getElementsByTagName('table')[0];
            }
            oFullResponse = this.doBeforeParseData(oRequest, oFullResponse, oCallback);
            oParsedResponse = this.parseHTMLTableData(oRequest, oFullResponse);
            break;
        case DS.TYPE_XML:
            if(xhr && oRawResponse.responseXML) {
                oFullResponse = oRawResponse.responseXML;
            }
            oFullResponse = this.doBeforeParseData(oRequest, oFullResponse, oCallback);
            oParsedResponse = this.parseXMLData(oRequest, oFullResponse);
            break;
        case DS.TYPE_TEXT:
            if(xhr && lang.isString(oRawResponse.responseText)) {
                oFullResponse = oRawResponse.responseText;
            }
            oFullResponse = this.doBeforeParseData(oRequest, oFullResponse, oCallback);
            oParsedResponse = this.parseTextData(oRequest, oFullResponse);
            break;
        default:
            oFullResponse = this.doBeforeParseData(oRequest, oFullResponse, oCallback);
            oParsedResponse = this.parseData(oRequest, oFullResponse);
            break;
    }


    // Clean up for consistent signature
    oParsedResponse = oParsedResponse || {};
    if(!oParsedResponse.results) {
        oParsedResponse.results = [];
    }
    if(!oParsedResponse.meta) {
        oParsedResponse.meta = {};
    }

    // Success
    if(!oParsedResponse.error) {
        // Last chance to touch the raw response or the parsed response
        oParsedResponse = this.doBeforeCallback(oRequest, oFullResponse, oParsedResponse, oCallback);
        this.fireEvent("responseParseEvent", {request:oRequest,
                response:oParsedResponse, callback:oCallback, caller:oCaller});
        // Cache the response
        this.addToCache(oRequest, oParsedResponse);
    }
    // Error
    else {
        // Be sure the error flag is on
        oParsedResponse.error = true;
        this.fireEvent("dataErrorEvent", {request:oRequest, response: oRawResponse, callback:oCallback, 
                caller:oCaller, message:DS.ERROR_DATANULL});
    }

    // Send the response back to the caller
    oParsedResponse.tId = tId;
    DS.issueCallback(oCallback,[oRequest,oParsedResponse],oParsedResponse.error,oCaller);
},

/**
 * Overridable method gives implementers access to the original full response
 * before the data gets parsed. Implementers should take care not to return an
 * unparsable or otherwise invalid response.
 *
 * @method doBeforeParseData
 * @param oRequest {Object} Request object.
 * @param oFullResponse {Object} The full response from the live database.
 * @param oCallback {Object} The callback object.  
 * @return {Object} Full response for parsing.
  
 */
doBeforeParseData : function(oRequest, oFullResponse, oCallback) {
    return oFullResponse;
},

/**
 * Overridable method gives implementers access to the original full response and
 * the parsed response (parsed against the given schema) before the data
 * is added to the cache (if applicable) and then sent back to callback function.
 * This is your chance to access the raw response and/or populate the parsed
 * response with any custom data.
 *
 * @method doBeforeCallback
 * @param oRequest {Object} Request object.
 * @param oFullResponse {Object} The full response from the live database.
 * @param oParsedResponse {Object} The parsed response to return to calling object.
 * @param oCallback {Object} The callback object. 
 * @return {Object} Parsed response object.
 */
doBeforeCallback : function(oRequest, oFullResponse, oParsedResponse, oCallback) {
    return oParsedResponse;
},

/**
 * Overridable method parses data of generic RESPONSE_TYPE into a response object.
 *
 * @method parseData
 * @param oRequest {Object} Request object.
 * @param oFullResponse {Object} The full Array from the live database.
 * @return {Object} Parsed response object with the following properties:<br>
 *     - results {Array} Array of parsed data results<br>
 *     - meta {Object} Object literal of meta values<br>
 *     - error {Boolean} (optional) True if there was an error<br>
 */
parseData : function(oRequest, oFullResponse) {
    if(lang.isValue(oFullResponse)) {
        var oParsedResponse = {results:oFullResponse,meta:{}};
        return oParsedResponse;

    }
    return null;
},

/**
 * Overridable method parses Array data into a response object.
 *
 * @method parseArrayData
 * @param oRequest {Object} Request object.
 * @param oFullResponse {Object} The full Array from the live database.
 * @return {Object} Parsed response object with the following properties:<br>
 *     - results (Array) Array of parsed data results<br>
 *     - error (Boolean) True if there was an error
 */
parseArrayData : function(oRequest, oFullResponse) {
    if(lang.isArray(oFullResponse)) {
        var results = [],
            i, j,
            rec, field, data;
        
        // Parse for fields
        if(lang.isArray(this.responseSchema.fields)) {
            var fields = this.responseSchema.fields;
            for (i = fields.length - 1; i >= 0; --i) {
                if (typeof fields[i] !== 'object') {
                    fields[i] = { key : fields[i] };
                }
            }

            var parsers = {}, p;
            for (i = fields.length - 1; i >= 0; --i) {
                p = (typeof fields[i].parser === 'function' ?
                          fields[i].parser :
                          DS.Parser[fields[i].parser+'']) || fields[i].converter;
                if (p) {
                    parsers[fields[i].key] = p;
                }
            }

            var arrType = lang.isArray(oFullResponse[0]);
            for(i=oFullResponse.length-1; i>-1; i--) {
                var oResult = {};
                rec = oFullResponse[i];
                if (typeof rec === 'object') {
                    for(j=fields.length-1; j>-1; j--) {
                        field = fields[j];
                        data = arrType ? rec[j] : rec[field.key];

                        if (parsers[field.key]) {
                            data = parsers[field.key].call(this,data);
                        }

                        // Safety measure
                        if(data === undefined) {
                            data = null;
                        }

                        oResult[field.key] = data;
                    }
                }
                else if (lang.isString(rec)) {
                    for(j=fields.length-1; j>-1; j--) {
                        field = fields[j];
                        data = rec;

                        if (parsers[field.key]) {
                            data = parsers[field.key].call(this,data);
                        }

                        // Safety measure
                        if(data === undefined) {
                            data = null;
                        }

                        oResult[field.key] = data;
                    }                
                }
                results[i] = oResult;
            }    
        }
        // Return entire data set
        else {
            results = oFullResponse;
        }
        var oParsedResponse = {results:results};
        return oParsedResponse;

    }
    return null;
},

/**
 * Overridable method parses plain text data into a response object.
 *
 * @method parseTextData
 * @param oRequest {Object} Request object.
 * @param oFullResponse {Object} The full text response from the live database.
 * @return {Object} Parsed response object with the following properties:<br>
 *     - results (Array) Array of parsed data results<br>
 *     - error (Boolean) True if there was an error
 */
parseTextData : function(oRequest, oFullResponse) {
    if(lang.isString(oFullResponse)) {
        if(lang.isString(this.responseSchema.recordDelim) &&
                lang.isString(this.responseSchema.fieldDelim)) {
            var oParsedResponse = {results:[]};
            var recDelim = this.responseSchema.recordDelim;
            var fieldDelim = this.responseSchema.fieldDelim;
            if(oFullResponse.length > 0) {
                // Delete the last line delimiter at the end of the data if it exists
                var newLength = oFullResponse.length-recDelim.length;
                if(oFullResponse.substr(newLength) == recDelim) {
                    oFullResponse = oFullResponse.substr(0, newLength);
                }
                if(oFullResponse.length > 0) {
                    // Split along record delimiter to get an array of strings
                    var recordsarray = oFullResponse.split(recDelim);
                    // Cycle through each record
                    for(var i = 0, len = recordsarray.length, recIdx = 0; i < len; ++i) {
                        var bError = false,
                            sRecord = recordsarray[i];
                        if (lang.isString(sRecord) && (sRecord.length > 0)) {
                            // Split each record along field delimiter to get data
                            var fielddataarray = recordsarray[i].split(fieldDelim);
                            var oResult = {};
                            
                            // Filter for fields data
                            if(lang.isArray(this.responseSchema.fields)) {
                                var fields = this.responseSchema.fields;
                                for(var j=fields.length-1; j>-1; j--) {
                                    try {
                                        // Remove quotation marks from edges, if applicable
                                        var data = fielddataarray[j];
                                        if (lang.isString(data)) {
                                            if(data.charAt(0) == "\"") {
                                                data = data.substr(1);
                                            }
                                            if(data.charAt(data.length-1) == "\"") {
                                                data = data.substr(0,data.length-1);
                                            }
                                            var field = fields[j];
                                            var key = (lang.isValue(field.key)) ? field.key : field;
                                            // Backward compatibility
                                            if(!field.parser && field.converter) {
                                                field.parser = field.converter;
                                            }
                                            var parser = (typeof field.parser === 'function') ?
                                                field.parser :
                                                DS.Parser[field.parser+''];
                                            if(parser) {
                                                data = parser.call(this, data);
                                            }
                                            // Safety measure
                                            if(data === undefined) {
                                                data = null;
                                            }
                                            oResult[key] = data;
                                        }
                                        else {
                                            bError = true;
                                        }
                                    }
                                    catch(e) {
                                        bError = true;
                                    }
                                }
                            }            
                            // No fields defined so pass along all data as an array
                            else {
                                oResult = fielddataarray;
                            }
                            if(!bError) {
                                oParsedResponse.results[recIdx++] = oResult;
                            }
                        }
                    }
                }
            }
            return oParsedResponse;
        }
    }
    return null;
            
},


/**
 * Overridable method parses XML data for one result into an object literal.
 *
 * @method parseXMLResult
 * @param result {XML} XML for one result.
 * @return {Object} Object literal of data for one result.
 */
parseXMLResult : function(result) {
    var oResult = {},
        schema = this.responseSchema;
        
    try {
        // Loop through each data field in each result using the schema
        for(var m = schema.fields.length-1; m >= 0 ; m--) {
            var field = schema.fields[m];
            var key = (lang.isValue(field.key)) ? field.key : field;
            var data = null;
            // Values may be held in an attribute...
            var xmlAttr = result.attributes.getNamedItem(key);
            if(xmlAttr) {
                data = xmlAttr.value;
            }
            // ...or in a node
            else {
                var xmlNode = result.getElementsByTagName(key);
                if(xmlNode && xmlNode.item(0)) {
                    var item = xmlNode.item(0);
                    // For IE, then DOM...
                    data = (item) ? ((item.text) ? item.text : (item.textContent) ? item.textContent : null) : null;
                    // ...then fallback, but check for multiple child nodes
                    if(!data) {
                        var datapieces = [];
                        for(var j=0, len=item.childNodes.length; j<len; j++) {
                            if(item.childNodes[j].nodeValue) {
                                datapieces[datapieces.length] = item.childNodes[j].nodeValue;
                            }
                        }
                        if(datapieces.length > 0) {
                            data = datapieces.join("");
                        }
                    }
                }
            }
            // Safety net
            if(data === null) {
                   data = "";
            }
            // Backward compatibility
            if(!field.parser && field.converter) {
                field.parser = field.converter;
            }
            var parser = (typeof field.parser === 'function') ?
                field.parser :
                DS.Parser[field.parser+''];
            if(parser) {
                data = parser.call(this, data);
            }
            // Safety measure
            if(data === undefined) {
                data = null;
            }
            oResult[key] = data;
        }
    }
    catch(e) {
    }

    return oResult;
},



/**
 * Overridable method parses XML data into a response object.
 *
 * @method parseXMLData
 * @param oRequest {Object} Request object.
 * @param oFullResponse {Object} The full XML response from the live database.
 * @return {Object} Parsed response object with the following properties<br>
 *     - results (Array) Array of parsed data results<br>
 *     - error (Boolean) True if there was an error
 */
parseXMLData : function(oRequest, oFullResponse) {
    var bError = false,
        schema = this.responseSchema,
        oParsedResponse = {meta:{}},
        xmlList = null,
        metaNode      = schema.metaNode,
        metaLocators  = schema.metaFields || {},
        i,k,loc,v;

    // In case oFullResponse is something funky
    try {
        xmlList = (schema.resultNode) ?
            oFullResponse.getElementsByTagName(schema.resultNode) :
            null;

        // Pull any meta identified
        metaNode = metaNode ? oFullResponse.getElementsByTagName(metaNode)[0] :
                   oFullResponse;

        if (metaNode) {
            for (k in metaLocators) {
                if (lang.hasOwnProperty(metaLocators, k)) {
                    loc = metaLocators[k];
                    // Look for a node
                    v = metaNode.getElementsByTagName(loc)[0];

                    if (v) {
                        v = v.firstChild.nodeValue;
                    } else {
                        // Look for an attribute
                        v = metaNode.attributes.getNamedItem(loc);
                        if (v) {
                            v = v.value;
                        }
                    }

                    if (lang.isValue(v)) {
                        oParsedResponse.meta[k] = v;
                    }
                }
                
            }
        }
    }
    catch(e) {
    }
    if(!xmlList || !lang.isArray(schema.fields)) {
        bError = true;
    }
    // Loop through each result
    else {
        oParsedResponse.results = [];
        for(i = xmlList.length-1; i >= 0 ; --i) {
            var oResult = this.parseXMLResult(xmlList.item(i));
            // Capture each array of values into an array of results
            oParsedResponse.results[i] = oResult;
        }
    }
    if(bError) {
        oParsedResponse.error = true;
    }
    else {
    }
    return oParsedResponse;
},

/**
 * Overridable method parses JSON data into a response object.
 *
 * @method parseJSONData
 * @param oRequest {Object} Request object.
 * @param oFullResponse {Object} The full JSON from the live database.
 * @return {Object} Parsed response object with the following properties<br>
 *     - results (Array) Array of parsed data results<br>
 *     - error (Boolean) True if there was an error
 */
parseJSONData : function(oRequest, oFullResponse) {
    var oParsedResponse = {results:[],meta:{}};
    
    if(lang.isObject(oFullResponse) && this.responseSchema.resultsList) {
        var schema = this.responseSchema,
            fields          = schema.fields,
            resultsList     = oFullResponse,
            results         = [],
            metaFields      = schema.metaFields || {},
            fieldParsers    = [],
            fieldPaths      = [],
            simpleFields    = [],
            bError          = false,
            i,len,j,v,key,parser,path;

        // Function to convert the schema's fields into walk paths
        var buildPath = function (needle) {
            var path = null, keys = [], i = 0;
            if (needle) {
                // Strip the ["string keys"] and [1] array indexes
                needle = needle.
                    replace(/\[(['"])(.*?)\1\]/g,
                    function (x,$1,$2) {keys[i]=$2;return '.@'+(i++);}).
                    replace(/\[(\d+)\]/g,
                    function (x,$1) {keys[i]=parseInt($1,10)|0;return '.@'+(i++);}).
                    replace(/^\./,''); // remove leading dot

                // If the cleaned needle contains invalid characters, the
                // path is invalid
                if (!/[^\w\.\$@]/.test(needle)) {
                    path = needle.split('.');
                    for (i=path.length-1; i >= 0; --i) {
                        if (path[i].charAt(0) === '@') {
                            path[i] = keys[parseInt(path[i].substr(1),10)];
                        }
                    }
                }
                else {
                }
            }
            return path;
        };


        // Function to walk a path and return the pot of gold
        var walkPath = function (path, origin) {
            var v=origin,i=0,len=path.length;
            for (;i<len && v;++i) {
                v = v[path[i]];
            }
            return v;
        };

        // Parse the response
        // Step 1. Pull the resultsList from oFullResponse (default assumes
        // oFullResponse IS the resultsList)
        path = buildPath(schema.resultsList);
        if (path) {
            resultsList = walkPath(path, oFullResponse);
            if (resultsList === undefined) {
                bError = true;
            }
        } else {
            bError = true;
        }
        
        if (!resultsList) {
            resultsList = [];
        }

        if (!lang.isArray(resultsList)) {
            resultsList = [resultsList];
        }

        if (!bError) {
            // Step 2. Parse out field data if identified
            if(schema.fields) {
                var field;
                // Build the field parser map and location paths
                for (i=0, len=fields.length; i<len; i++) {
                    field = fields[i];
                    key    = field.key || field;
                    parser = ((typeof field.parser === 'function') ?
                        field.parser :
                        DS.Parser[field.parser+'']) || field.converter;
                    path   = buildPath(key);
    
                    if (parser) {
                        fieldParsers[fieldParsers.length] = {key:key,parser:parser};
                    }
    
                    if (path) {
                        if (path.length > 1) {
                            fieldPaths[fieldPaths.length] = {key:key,path:path};
                        } else {
                            simpleFields[simpleFields.length] = {key:key,path:path[0]};
                        }
                    } else {
                    }
                }

                // Process the results, flattening the records and/or applying parsers if needed
                for (i = resultsList.length - 1; i >= 0; --i) {
                    var r = resultsList[i], rec = {};
                    if(r) {
                        for (j = simpleFields.length - 1; j >= 0; --j) {
                            // Bug 1777850: data might be held in an array
                            rec[simpleFields[j].key] =
                                    (r[simpleFields[j].path] !== undefined) ?
                                    r[simpleFields[j].path] : r[j];
                        }

                        for (j = fieldPaths.length - 1; j >= 0; --j) {
                            rec[fieldPaths[j].key] = walkPath(fieldPaths[j].path,r);
                        }

                        for (j = fieldParsers.length - 1; j >= 0; --j) {
                            var p = fieldParsers[j].key;
                            rec[p] = fieldParsers[j].parser(rec[p]);
                            if (rec[p] === undefined) {
                                rec[p] = null;
                            }
                        }
                    }
                    results[i] = rec;
                }
            }
            else {
                results = resultsList;
            }

            for (key in metaFields) {
                if (lang.hasOwnProperty(metaFields,key)) {
                    path = buildPath(metaFields[key]);
                    if (path) {
                        v = walkPath(path, oFullResponse);
                        oParsedResponse.meta[key] = v;
                    }
                }
            }

        } else {

            oParsedResponse.error = true;
        }

        oParsedResponse.results = results;
    }
    else {
        oParsedResponse.error = true;
    }

    return oParsedResponse;
},

/**
 * Overridable method parses an HTML TABLE element reference into a response object.
 * Data is parsed out of TR elements from all TBODY elements. 
 *
 * @method parseHTMLTableData
 * @param oRequest {Object} Request object.
 * @param oFullResponse {Object} The full HTML element reference from the live database.
 * @return {Object} Parsed response object with the following properties<br>
 *     - results (Array) Array of parsed data results<br>
 *     - error (Boolean) True if there was an error
 */
parseHTMLTableData : function(oRequest, oFullResponse) {
    var bError = false;
    var elTable = oFullResponse;
    var fields = this.responseSchema.fields;
    var oParsedResponse = {results:[]};

    if(lang.isArray(fields)) {
        // Iterate through each TBODY
        for(var i=0; i<elTable.tBodies.length; i++) {
            var elTbody = elTable.tBodies[i];
    
            // Iterate through each TR
            for(var j=elTbody.rows.length-1; j>-1; j--) {
                var elRow = elTbody.rows[j];
                var oResult = {};
                
                for(var k=fields.length-1; k>-1; k--) {
                    var field = fields[k];
                    var key = (lang.isValue(field.key)) ? field.key : field;
                    var data = elRow.cells[k].innerHTML;
    
                    // Backward compatibility
                    if(!field.parser && field.converter) {
                        field.parser = field.converter;
                    }
                    var parser = (typeof field.parser === 'function') ?
                        field.parser :
                        DS.Parser[field.parser+''];
                    if(parser) {
                        data = parser.call(this, data);
                    }
                    // Safety measure
                    if(data === undefined) {
                        data = null;
                    }
                    oResult[key] = data;
                }
                oParsedResponse.results[j] = oResult;
            }
        }
    }
    else {
        bError = true;
    }

    if(bError) {
        oParsedResponse.error = true;
    }
    else {
    }
    return oParsedResponse;
}

};

// DataSourceBase uses EventProvider
lang.augmentProto(DS, util.EventProvider);



/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * LocalDataSource class for in-memory data structs including JavaScript arrays,
 * JavaScript object literals (JSON), XML documents, and HTML tables.
 *
 * @namespace YAHOO.util
 * @class YAHOO.util.LocalDataSource
 * @extends YAHOO.util.DataSourceBase 
 * @constructor
 * @param oLiveData {HTMLElement}  Pointer to live data.
 * @param oConfigs {object} (optional) Object literal of configuration values.
 */
util.LocalDataSource = function(oLiveData, oConfigs) {
    this.dataType = DS.TYPE_LOCAL;
    
    if(oLiveData) {
        if(YAHOO.lang.isArray(oLiveData)) { // array
            this.responseType = DS.TYPE_JSARRAY;
        }
         // xml
        else if(oLiveData.nodeType && oLiveData.nodeType == 9) {
            this.responseType = DS.TYPE_XML;
        }
        else if(oLiveData.nodeName && (oLiveData.nodeName.toLowerCase() == "table")) { // table
            this.responseType = DS.TYPE_HTMLTABLE;
            oLiveData = oLiveData.cloneNode(true);
        }    
        else if(YAHOO.lang.isString(oLiveData)) { // text
            this.responseType = DS.TYPE_TEXT;
        }
        else if(YAHOO.lang.isObject(oLiveData)) { // json
            this.responseType = DS.TYPE_JSON;
        }
    }
    else {
        oLiveData = [];
        this.responseType = DS.TYPE_JSARRAY;
    }
    
    util.LocalDataSource.superclass.constructor.call(this, oLiveData, oConfigs); 
};

// LocalDataSource extends DataSourceBase
lang.extend(util.LocalDataSource, DS);

// Copy static members to LocalDataSource class
lang.augmentObject(util.LocalDataSource, DS);













/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * FunctionDataSource class for JavaScript functions.
 *
 * @namespace YAHOO.util
 * @class YAHOO.util.FunctionDataSource
 * @extends YAHOO.util.DataSourceBase  
 * @constructor
 * @param oLiveData {HTMLElement}  Pointer to live data.
 * @param oConfigs {object} (optional) Object literal of configuration values.
 */
util.FunctionDataSource = function(oLiveData, oConfigs) {
    this.dataType = DS.TYPE_JSFUNCTION;
    oLiveData = oLiveData || function() {};
    
    util.FunctionDataSource.superclass.constructor.call(this, oLiveData, oConfigs); 
};

// FunctionDataSource extends DataSourceBase
lang.extend(util.FunctionDataSource, DS, {

/////////////////////////////////////////////////////////////////////////////
//
// FunctionDataSource public properties
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Context in which to execute the function. By default, is the DataSource
 * instance itself. If set, the function will receive the DataSource instance
 * as an additional argument. 
 *
 * @property scope
 * @type Object
 * @default null
 */
scope : null,


/////////////////////////////////////////////////////////////////////////////
//
// FunctionDataSource public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Overriding method passes query to a function. The returned response is then
 * forwarded to the handleResponse function.
 *
 * @method makeConnection
 * @param oRequest {Object} Request object.
 * @param oCallback {Object} Callback object literal.
 * @param oCaller {Object} (deprecated) Use oCallback.scope.
 * @return {Number} Transaction ID.
 */
makeConnection : function(oRequest, oCallback, oCaller) {
    var tId = DS._nTransactionId++;
    this.fireEvent("requestEvent", {tId:tId,request:oRequest,callback:oCallback,caller:oCaller});

    // Pass the request in as a parameter and
    // forward the return value to the handler
    
    
    var oRawResponse = (this.scope) ? this.liveData.call(this.scope, oRequest, this) : this.liveData(oRequest);
    
    // Try to sniff data type if it has not been defined
    if(this.responseType === DS.TYPE_UNKNOWN) {
        if(YAHOO.lang.isArray(oRawResponse)) { // array
            this.responseType = DS.TYPE_JSARRAY;
        }
         // xml
        else if(oRawResponse && oRawResponse.nodeType && oRawResponse.nodeType == 9) {
            this.responseType = DS.TYPE_XML;
        }
        else if(oRawResponse && oRawResponse.nodeName && (oRawResponse.nodeName.toLowerCase() == "table")) { // table
            this.responseType = DS.TYPE_HTMLTABLE;
        }    
        else if(YAHOO.lang.isObject(oRawResponse)) { // json
            this.responseType = DS.TYPE_JSON;
        }
        else if(YAHOO.lang.isString(oRawResponse)) { // text
            this.responseType = DS.TYPE_TEXT;
        }
    }

    this.handleResponse(oRequest, oRawResponse, oCallback, oCaller, tId);
    return tId;
}

});

// Copy static members to FunctionDataSource class
lang.augmentObject(util.FunctionDataSource, DS);













/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * ScriptNodeDataSource class for accessing remote data via the YUI Get Utility. 
 *
 * @namespace YAHOO.util
 * @class YAHOO.util.ScriptNodeDataSource
 * @extends YAHOO.util.DataSourceBase  
 * @constructor
 * @param oLiveData {HTMLElement}  Pointer to live data.
 * @param oConfigs {object} (optional) Object literal of configuration values.
 */
util.ScriptNodeDataSource = function(oLiveData, oConfigs) {
    this.dataType = DS.TYPE_SCRIPTNODE;
    oLiveData = oLiveData || "";
    
    util.ScriptNodeDataSource.superclass.constructor.call(this, oLiveData, oConfigs); 
};

// ScriptNodeDataSource extends DataSourceBase
lang.extend(util.ScriptNodeDataSource, DS, {

/////////////////////////////////////////////////////////////////////////////
//
// ScriptNodeDataSource public properties
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Alias to YUI Get Utility, to allow implementers to use a custom class.
 *
 * @property getUtility
 * @type Object
 * @default YAHOO.util.Get
 */
getUtility : util.Get,

/**
 * Defines request/response management in the following manner:
 * <dl>
 *     <!--<dt>queueRequests</dt>
 *     <dd>If a request is already in progress, wait until response is returned before sending the next request.</dd>
 *     <dt>cancelStaleRequests</dt>
 *     <dd>If a request is already in progress, cancel it before sending the next request.</dd>-->
 *     <dt>ignoreStaleResponses</dt>
 *     <dd>Send all requests, but handle only the response for the most recently sent request.</dd>
 *     <dt>allowAll</dt>
 *     <dd>Send all requests and handle all responses.</dd>
 * </dl>
 *
 * @property asyncMode
 * @type String
 * @default "allowAll"
 */
asyncMode : "allowAll",

/**
 * Callback string parameter name sent to the remote script. By default,
 * requests are sent to
 * &#60;URI&#62;?&#60;scriptCallbackParam&#62;=callbackFunction
 *
 * @property scriptCallbackParam
 * @type String
 * @default "callback"
 */
scriptCallbackParam : "callback",


/////////////////////////////////////////////////////////////////////////////
//
// ScriptNodeDataSource public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Creates a request callback that gets appended to the script URI. Implementers
 * can customize this string to match their server's query syntax.
 *
 * @method generateRequestCallback
 * @return {String} String fragment that gets appended to script URI that 
 * specifies the callback function 
 */
generateRequestCallback : function(id) {
    return "&" + this.scriptCallbackParam + "=YAHOO.util.ScriptNodeDataSource.callbacks["+id+"]" ;
},

/**
 * Overridable method gives implementers access to modify the URI before the dynamic
 * script node gets inserted. Implementers should take care not to return an
 * invalid URI.
 *
 * @method doBeforeGetScriptNode
 * @param {String} URI to the script 
 * @return {String} URI to the script
 */
doBeforeGetScriptNode : function(sUri) {
    return sUri;
},

/**
 * Overriding method passes query to Get Utility. The returned
 * response is then forwarded to the handleResponse function.
 *
 * @method makeConnection
 * @param oRequest {Object} Request object.
 * @param oCallback {Object} Callback object literal.
 * @param oCaller {Object} (deprecated) Use oCallback.scope.
 * @return {Number} Transaction ID.
 */
makeConnection : function(oRequest, oCallback, oCaller) {
    var tId = DS._nTransactionId++;
    this.fireEvent("requestEvent", {tId:tId,request:oRequest,callback:oCallback,caller:oCaller});
    
    // If there are no global pending requests, it is safe to purge global callback stack and global counter
    if(util.ScriptNodeDataSource._nPending === 0) {
        util.ScriptNodeDataSource.callbacks = [];
        util.ScriptNodeDataSource._nId = 0;
    }
    
    // ID for this request
    var id = util.ScriptNodeDataSource._nId;
    util.ScriptNodeDataSource._nId++;
    
    // Dynamically add handler function with a closure to the callback stack
    var oSelf = this;
    util.ScriptNodeDataSource.callbacks[id] = function(oRawResponse) {
        if((oSelf.asyncMode !== "ignoreStaleResponses")||
                (id === util.ScriptNodeDataSource.callbacks.length-1)) { // Must ignore stale responses
                
            // Try to sniff data type if it has not been defined
            if(oSelf.responseType === DS.TYPE_UNKNOWN) {
                if(YAHOO.lang.isArray(oRawResponse)) { // array
                    oSelf.responseType = DS.TYPE_JSARRAY;
                }
                 // xml
                else if(oRawResponse.nodeType && oRawResponse.nodeType == 9) {
                    oSelf.responseType = DS.TYPE_XML;
                }
                else if(oRawResponse.nodeName && (oRawResponse.nodeName.toLowerCase() == "table")) { // table
                    oSelf.responseType = DS.TYPE_HTMLTABLE;
                }    
                else if(YAHOO.lang.isObject(oRawResponse)) { // json
                    oSelf.responseType = DS.TYPE_JSON;
                }
                else if(YAHOO.lang.isString(oRawResponse)) { // text
                    oSelf.responseType = DS.TYPE_TEXT;
                }
            }

            oSelf.handleResponse(oRequest, oRawResponse, oCallback, oCaller, tId);
        }
        else {
        }
    
        delete util.ScriptNodeDataSource.callbacks[id];
    };
    
    // We are now creating a request
    util.ScriptNodeDataSource._nPending++;
    var sUri = this.liveData + oRequest + this.generateRequestCallback(id);
    sUri = this.doBeforeGetScriptNode(sUri);
    this.getUtility.script(sUri,
            {autopurge: true,
            onsuccess: util.ScriptNodeDataSource._bumpPendingDown,
            onfail: util.ScriptNodeDataSource._bumpPendingDown});

    return tId;
}

});

// Copy static members to ScriptNodeDataSource class
lang.augmentObject(util.ScriptNodeDataSource, DS);

// Copy static members to ScriptNodeDataSource class
lang.augmentObject(util.ScriptNodeDataSource,  {

/////////////////////////////////////////////////////////////////////////////
//
// ScriptNodeDataSource private static properties
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Unique ID to track requests.
 *
 * @property _nId
 * @type Number
 * @private
 * @static
 */
_nId : 0,

/**
 * Counter for pending requests. When this is 0, it is safe to purge callbacks
 * array.
 *
 * @property _nPending
 * @type Number
 * @private
 * @static
 */
_nPending : 0,

/**
 * Global array of callback functions, one for each request sent.
 *
 * @property callbacks
 * @type Function[]
 * @static
 */
callbacks : []

});














/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * XHRDataSource class for accessing remote data via the YUI Connection Manager
 * Utility
 *
 * @namespace YAHOO.util
 * @class YAHOO.util.XHRDataSource
 * @extends YAHOO.util.DataSourceBase  
 * @constructor
 * @param oLiveData {HTMLElement}  Pointer to live data.
 * @param oConfigs {object} (optional) Object literal of configuration values.
 */
util.XHRDataSource = function(oLiveData, oConfigs) {
    this.dataType = DS.TYPE_XHR;
    this.connMgr = this.connMgr || util.Connect;
    oLiveData = oLiveData || "";
    
    util.XHRDataSource.superclass.constructor.call(this, oLiveData, oConfigs); 
};

// XHRDataSource extends DataSourceBase
lang.extend(util.XHRDataSource, DS, {

/////////////////////////////////////////////////////////////////////////////
//
// XHRDataSource public properties
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Alias to YUI Connection Manager, to allow implementers to use a custom class.
 *
 * @property connMgr
 * @type Object
 * @default YAHOO.util.Connect
 */
connMgr: null,

 /**
 * Defines request/response management in the following manner:
 * <dl>
 *     <dt>queueRequests</dt>
 *     <dd>If a request is already in progress, wait until response is returned
 *     before sending the next request.</dd>
 *
 *     <dt>cancelStaleRequests</dt>
 *     <dd>If a request is already in progress, cancel it before sending the next
 *     request.</dd>
 *
 *     <dt>ignoreStaleResponses</dt>
 *     <dd>Send all requests, but handle only the response for the most recently
 *     sent request.</dd>
 *
 *     <dt>allowAll</dt>
 *     <dd>Send all requests and handle all responses.</dd>
 *
 * </dl>
 *
 * @property connXhrMode
 * @type String
 * @default "allowAll"
 */
connXhrMode: "allowAll",

 /**
 * True if data is to be sent via POST. By default, data will be sent via GET.
 *
 * @property connMethodPost
 * @type Boolean
 * @default false
 */
connMethodPost: false,

 /**
 * The connection timeout defines how many  milliseconds the XHR connection will
 * wait for a server response. Any non-zero value will enable the Connection Manager's
 * Auto-Abort feature.
 *
 * @property connTimeout
 * @type Number
 * @default 0
 */
connTimeout: 0,

/////////////////////////////////////////////////////////////////////////////
//
// XHRDataSource public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Overriding method passes query to Connection Manager. The returned
 * response is then forwarded to the handleResponse function.
 *
 * @method makeConnection
 * @param oRequest {Object} Request object.
 * @param oCallback {Object} Callback object literal.
 * @param oCaller {Object} (deprecated) Use oCallback.scope.
 * @return {Number} Transaction ID.
 */
makeConnection : function(oRequest, oCallback, oCaller) {

    var oRawResponse = null;
    var tId = DS._nTransactionId++;
    this.fireEvent("requestEvent", {tId:tId,request:oRequest,callback:oCallback,caller:oCaller});

    // Set up the callback object and
    // pass the request in as a URL query and
    // forward the response to the handler
    var oSelf = this;
    var oConnMgr = this.connMgr;
    var oQueue = this._oQueue;

    /**
     * Define Connection Manager success handler
     *
     * @method _xhrSuccess
     * @param oResponse {Object} HTTPXMLRequest object
     * @private
     */
    var _xhrSuccess = function(oResponse) {
        // If response ID does not match last made request ID,
        // silently fail and wait for the next response
        if(oResponse && (this.connXhrMode == "ignoreStaleResponses") &&
                (oResponse.tId != oQueue.conn.tId)) {
            return null;
        }
        // Error if no response
        else if(!oResponse) {
            this.fireEvent("dataErrorEvent", {request:oRequest, response:null,
                    callback:oCallback, caller:oCaller,
                    message:DS.ERROR_DATANULL});

            // Send error response back to the caller with the error flag on
            DS.issueCallback(oCallback,[oRequest, {error:true}], true, oCaller);

            return null;
        }
        // Forward to handler
        else {
            // Try to sniff data type if it has not been defined
            if(this.responseType === DS.TYPE_UNKNOWN) {
                var ctype = (oResponse.getResponseHeader) ? oResponse.getResponseHeader["Content-Type"] : null;
                if(ctype) {
                    // xml
                    if(ctype.indexOf("text/xml") > -1) {
                        this.responseType = DS.TYPE_XML;
                    }
                    else if(ctype.indexOf("application/json") > -1) { // json
                        this.responseType = DS.TYPE_JSON;
                    }
                    else if(ctype.indexOf("text/plain") > -1) { // text
                        this.responseType = DS.TYPE_TEXT;
                    }
                }
            }
            this.handleResponse(oRequest, oResponse, oCallback, oCaller, tId);
        }
    };

    /**
     * Define Connection Manager failure handler
     *
     * @method _xhrFailure
     * @param oResponse {Object} HTTPXMLRequest object
     * @private
     */
    var _xhrFailure = function(oResponse) {
        this.fireEvent("dataErrorEvent", {request:oRequest, response: oResponse,
                callback:oCallback, caller:oCaller,
                message:DS.ERROR_DATAINVALID});

        // Backward compatibility
        if(lang.isString(this.liveData) && lang.isString(oRequest) &&
            (this.liveData.lastIndexOf("?") !== this.liveData.length-1) &&
            (oRequest.indexOf("?") !== 0)){
        }

        // Send failure response back to the caller with the error flag on
        oResponse = oResponse || {};
        oResponse.error = true;
        DS.issueCallback(oCallback,[oRequest,oResponse],true, oCaller);

        return null;
    };

    /**
     * Define Connection Manager callback object
     *
     * @property _xhrCallback
     * @param oResponse {Object} HTTPXMLRequest object
     * @private
     */
     var _xhrCallback = {
        success:_xhrSuccess,
        failure:_xhrFailure,
        scope: this
    };

    // Apply Connection Manager timeout
    if(lang.isNumber(this.connTimeout)) {
        _xhrCallback.timeout = this.connTimeout;
    }

    // Cancel stale requests
    if(this.connXhrMode == "cancelStaleRequests") {
            // Look in queue for stale requests
            if(oQueue.conn) {
                if(oConnMgr.abort) {
                    oConnMgr.abort(oQueue.conn);
                    oQueue.conn = null;
                }
                else {
                }
            }
    }

    // Get ready to send the request URL
    if(oConnMgr && oConnMgr.asyncRequest) {
        var sLiveData = this.liveData;
        var isPost = this.connMethodPost;
        var sMethod = (isPost) ? "POST" : "GET";
        // Validate request
        var sUri = (isPost || !lang.isValue(oRequest)) ? sLiveData : sLiveData+oRequest;
        var sRequest = (isPost) ? oRequest : null;

        // Send the request right away
        if(this.connXhrMode != "queueRequests") {
            oQueue.conn = oConnMgr.asyncRequest(sMethod, sUri, _xhrCallback, sRequest);
        }
        // Queue up then send the request
        else {
            // Found a request already in progress
            if(oQueue.conn) {
                var allRequests = oQueue.requests;
                // Add request to queue
                allRequests.push({request:oRequest, callback:_xhrCallback});

                // Interval needs to be started
                if(!oQueue.interval) {
                    oQueue.interval = setInterval(function() {
                        // Connection is in progress
                        if(oConnMgr.isCallInProgress(oQueue.conn)) {
                            return;
                        }
                        else {
                            // Send next request
                            if(allRequests.length > 0) {
                                // Validate request
                                sUri = (isPost || !lang.isValue(allRequests[0].request)) ? sLiveData : sLiveData+allRequests[0].request;
                                sRequest = (isPost) ? allRequests[0].request : null;
                                oQueue.conn = oConnMgr.asyncRequest(sMethod, sUri, allRequests[0].callback, sRequest);

                                // Remove request from queue
                                allRequests.shift();
                            }
                            // No more requests
                            else {
                                clearInterval(oQueue.interval);
                                oQueue.interval = null;
                            }
                        }
                    }, 50);
                }
            }
            // Nothing is in progress
            else {
                oQueue.conn = oConnMgr.asyncRequest(sMethod, sUri, _xhrCallback, sRequest);
            }
        }
    }
    else {
        // Send null response back to the caller with the error flag on
        DS.issueCallback(oCallback,[oRequest,{error:true}],true,oCaller);
    }

    return tId;
}

});

// Copy static members to XHRDataSource class
lang.augmentObject(util.XHRDataSource, DS);













/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * Factory class for creating a BaseDataSource subclass instance. The sublcass is
 * determined by oLiveData's type, unless the dataType config is explicitly passed in.  
 *
 * @namespace YAHOO.util
 * @class YAHOO.util.DataSource
 * @constructor
 * @param oLiveData {HTMLElement}  Pointer to live data.
 * @param oConfigs {object} (optional) Object literal of configuration values.
 */
util.DataSource = function(oLiveData, oConfigs) {
    oConfigs = oConfigs || {};
    
    // Point to one of the subclasses, first by dataType if given, then by sniffing oLiveData type.
    var dataType = oConfigs.dataType;
    if(dataType) {
        if(dataType == DS.TYPE_LOCAL) {
            lang.augmentObject(util.DataSource, util.LocalDataSource);
            return new util.LocalDataSource(oLiveData, oConfigs);            
        }
        else if(dataType == DS.TYPE_XHR) {
            lang.augmentObject(util.DataSource, util.XHRDataSource);
            return new util.XHRDataSource(oLiveData, oConfigs);            
        }
        else if(dataType == DS.TYPE_SCRIPTNODE) {
            lang.augmentObject(util.DataSource, util.ScriptNodeDataSource);
            return new util.ScriptNodeDataSource(oLiveData, oConfigs);            
        }
        else if(dataType == DS.TYPE_JSFUNCTION) {
            lang.augmentObject(util.DataSource, util.FunctionDataSource);
            return new util.FunctionDataSource(oLiveData, oConfigs);            
        }
    }
    
    if(YAHOO.lang.isString(oLiveData)) { // strings default to xhr
        lang.augmentObject(util.DataSource, util.XHRDataSource);
        return new util.XHRDataSource(oLiveData, oConfigs);
    }
    else if(YAHOO.lang.isFunction(oLiveData)) {
        lang.augmentObject(util.DataSource, util.FunctionDataSource);
        return new util.FunctionDataSource(oLiveData, oConfigs);
    }
    else { // ultimate default is local
        lang.augmentObject(util.DataSource, util.LocalDataSource);
        return new util.LocalDataSource(oLiveData, oConfigs);
    }
};

// Copy static members to DataSource class
lang.augmentObject(util.DataSource, DS);

})();

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The static Number class provides helper functions to deal with data of type
 * Number.
 *
 * @namespace YAHOO.util
 * @requires yahoo
 * @class Number
 * @static
 */
 YAHOO.util.Number = {
 
     /**
     * Takes a native JavaScript Number and formats to string for display to user.
     *
     * @method format
     * @param nData {Number} Number.
     * @param oConfig {Object} (Optional) Optional configuration values:
     *  <dl>
     *   <dt>prefix {String}</dd>
     *   <dd>String prepended before each number, like a currency designator "$"</dd>
     *   <dt>decimalPlaces {Number}</dd>
     *   <dd>Number of decimal places to round.</dd>
     *   <dt>decimalSeparator {String}</dd>
     *   <dd>Decimal separator</dd>
     *   <dt>thousandsSeparator {String}</dd>
     *   <dd>Thousands separator</dd>
     *   <dt>suffix {String}</dd>
     *   <dd>String appended after each number, like " items" (note the space)</dd>
     *  </dl>
     * @return {String} Formatted number for display. Note, the following values
     * return as "": null, undefined, NaN, "".     
     */
    format : function(nData, oConfig) {
        var lang = YAHOO.lang;
        if(!lang.isValue(nData) || (nData === "")) {
            return "";
        }

        oConfig = oConfig || {};
        
        if(!lang.isNumber(nData)) {
            nData *= 1;
        }

        if(lang.isNumber(nData)) {
            var bNegative = (nData < 0);
            var sOutput = nData + "";
            var sDecimalSeparator = (oConfig.decimalSeparator) ? oConfig.decimalSeparator : ".";
            var nDotIndex;

            // Manage decimals
            if(lang.isNumber(oConfig.decimalPlaces)) {
                // Round to the correct decimal place
                var nDecimalPlaces = oConfig.decimalPlaces;
                var nDecimal = Math.pow(10, nDecimalPlaces);
                sOutput = Math.round(nData*nDecimal)/nDecimal + "";
                nDotIndex = sOutput.lastIndexOf(".");

                if(nDecimalPlaces > 0) {
                    // Add the decimal separator
                    if(nDotIndex < 0) {
                        sOutput += sDecimalSeparator;
                        nDotIndex = sOutput.length-1;
                    }
                    // Replace the "."
                    else if(sDecimalSeparator !== "."){
                        sOutput = sOutput.replace(".",sDecimalSeparator);
                    }
                    // Add missing zeros
                    while((sOutput.length - 1 - nDotIndex) < nDecimalPlaces) {
                        sOutput += "0";
                    }
                }
            }
            
            // Add the thousands separator
            if(oConfig.thousandsSeparator) {
                var sThousandsSeparator = oConfig.thousandsSeparator;
                nDotIndex = sOutput.lastIndexOf(sDecimalSeparator);
                nDotIndex = (nDotIndex > -1) ? nDotIndex : sOutput.length;
                var sNewOutput = sOutput.substring(nDotIndex);
                var nCount = -1;
                for (var i=nDotIndex; i>0; i--) {
                    nCount++;
                    if ((nCount%3 === 0) && (i !== nDotIndex) && (!bNegative || (i > 1))) {
                        sNewOutput = sThousandsSeparator + sNewOutput;
                    }
                    sNewOutput = sOutput.charAt(i-1) + sNewOutput;
                }
                sOutput = sNewOutput;
            }

            // Prepend prefix
            sOutput = (oConfig.prefix) ? oConfig.prefix + sOutput : sOutput;

            // Append suffix
            sOutput = (oConfig.suffix) ? sOutput + oConfig.suffix : sOutput;

            return sOutput;
        }
        // Still not a Number, just return unaltered
        else {
            return nData;
        }
    }
 };



/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

(function () {

var xPad=function (x, pad, r)
{
    if(typeof r === 'undefined')
    {
        r=10;
    }
    for( ; parseInt(x, 10)<r && r>1; r/=10) {
        x = pad.toString() + x;
    }
    return x.toString();
};


/**
 * The static Date class provides helper functions to deal with data of type Date.
 *
 * @namespace YAHOO.util
 * @requires yahoo
 * @class Date
 * @static
 */
 var Dt = {
    formats: {
        a: function (d, l) { return l.a[d.getDay()]; },
        A: function (d, l) { return l.A[d.getDay()]; },
        b: function (d, l) { return l.b[d.getMonth()]; },
        B: function (d, l) { return l.B[d.getMonth()]; },
        C: function (d) { return xPad(parseInt(d.getFullYear()/100, 10), 0); },
        d: ['getDate', '0'],
        e: ['getDate', ' '],
        g: function (d) { return xPad(parseInt(Dt.formats.G(d)%100, 10), 0); },
        G: function (d) {
                var y = d.getFullYear();
                var V = parseInt(Dt.formats.V(d), 10);
                var W = parseInt(Dt.formats.W(d), 10);
    
                if(W > V) {
                    y++;
                } else if(W===0 && V>=52) {
                    y--;
                }
    
                return y;
            },
        H: ['getHours', '0'],
        I: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, 0); },
        j: function (d) {
                var gmd_1 = new Date('' + d.getFullYear() + '/1/1 GMT');
                var gmdate = new Date('' + d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate() + ' GMT');
                var ms = gmdate - gmd_1;
                var doy = parseInt(ms/60000/60/24, 10)+1;
                return xPad(doy, 0, 100);
            },
        k: ['getHours', ' '],
        l: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, ' '); },
        m: function (d) { return xPad(d.getMonth()+1, 0); },
        M: ['getMinutes', '0'],
        p: function (d, l) { return l.p[d.getHours() >= 12 ? 1 : 0 ]; },
        P: function (d, l) { return l.P[d.getHours() >= 12 ? 1 : 0 ]; },
        s: function (d, l) { return parseInt(d.getTime()/1000, 10); },
        S: ['getSeconds', '0'],
        u: function (d) { var dow = d.getDay(); return dow===0?7:dow; },
        U: function (d) {
                var doy = parseInt(Dt.formats.j(d), 10);
                var rdow = 6-d.getDay();
                var woy = parseInt((doy+rdow)/7, 10);
                return xPad(woy, 0);
            },
        V: function (d) {
                var woy = parseInt(Dt.formats.W(d), 10);
                var dow1_1 = (new Date('' + d.getFullYear() + '/1/1')).getDay();
                // First week is 01 and not 00 as in the case of %U and %W,
                // so we add 1 to the final result except if day 1 of the year
                // is a Monday (then %W returns 01).
                // We also need to subtract 1 if the day 1 of the year is 
                // Friday-Sunday, so the resulting equation becomes:
                var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
                if(idow === 53 && (new Date('' + d.getFullYear() + '/12/31')).getDay() < 4)
                {
                    idow = 1;
                }
                else if(idow === 0)
                {
                    idow = Dt.formats.V(new Date('' + (d.getFullYear()-1) + '/12/31'));
                }
    
                return xPad(idow, 0);
            },
        w: 'getDay',
        W: function (d) {
                var doy = parseInt(Dt.formats.j(d), 10);
                var rdow = 7-Dt.formats.u(d);
                var woy = parseInt((doy+rdow)/7, 10);
                return xPad(woy, 0, 10);
            },
        y: function (d) { return xPad(d.getFullYear()%100, 0); },
        Y: 'getFullYear',
        z: function (d) {
                var o = d.getTimezoneOffset();
                var H = xPad(parseInt(Math.abs(o/60), 10), 0);
                var M = xPad(Math.abs(o%60), 0);
                return (o>0?'-':'+') + H + M;
            },
        Z: function (d) {
		var tz = d.toString().replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, '$2').replace(/[a-z ]/g, '');
		if(tz.length > 4) {
			tz = Dt.formats.z(d);
		}
		return tz;
	},
        '%': function (d) { return '%'; }
    },

    aggregates: {
        c: 'locale',
        D: '%m/%d/%y',
        F: '%Y-%m-%d',
        h: '%b',
        n: '\n',
        r: 'locale',
        R: '%H:%M',
        t: '\t',
        T: '%H:%M:%S',
        x: 'locale',
        X: 'locale'
        //'+': '%a %b %e %T %Z %Y'
    },

     /**
     * Takes a native JavaScript Date and formats to string for display to user.
     *
     * @method format
     * @param oDate {Date} Date.
     * @param oConfig {Object} (Optional) Object literal of configuration values:
     *  <dl>
     *   <dt>format &lt;String&gt;</dt>
     *   <dd>
     *   <p>
     *   Any strftime string is supported, such as "%I:%M:%S %p". strftime has several format specifiers defined by the Open group at 
     *   <a href="http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html">http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html</a>
     *   </p>
     *   <p>   
     *   PHP added a few of its own, defined at <a href="http://www.php.net/strftime">http://www.php.net/strftime</a>
     *   </p>
     *   <p>
     *   This javascript implementation supports all the PHP specifiers and a few more.  The full list is below:
     *   </p>
     *   <dl>
     *    <dt>%a</dt> <dd>abbreviated weekday name according to the current locale</dd>
     *    <dt>%A</dt> <dd>full weekday name according to the current locale</dd>
     *    <dt>%b</dt> <dd>abbreviated month name according to the current locale</dd>
     *    <dt>%B</dt> <dd>full month name according to the current locale</dd>
     *    <dt>%c</dt> <dd>preferred date and time representation for the current locale</dd>
     *    <dt>%C</dt> <dd>century number (the year divided by 100 and truncated to an integer, range 00 to 99)</dd>
     *    <dt>%d</dt> <dd>day of the month as a decimal number (range 01 to 31)</dd>
     *    <dt>%D</dt> <dd>same as %m/%d/%y</dd>
     *    <dt>%e</dt> <dd>day of the month as a decimal number, a single digit is preceded by a space (range ' 1' to '31')</dd>
     *    <dt>%F</dt> <dd>same as %Y-%m-%d (ISO 8601 date format)</dd>
     *    <dt>%g</dt> <dd>like %G, but without the century</dd>
     *    <dt>%G</dt> <dd>The 4-digit year corresponding to the ISO week number</dd>
     *    <dt>%h</dt> <dd>same as %b</dd>
     *    <dt>%H</dt> <dd>hour as a decimal number using a 24-hour clock (range 00 to 23)</dd>
     *    <dt>%I</dt> <dd>hour as a decimal number using a 12-hour clock (range 01 to 12)</dd>
     *    <dt>%j</dt> <dd>day of the year as a decimal number (range 001 to 366)</dd>
     *    <dt>%k</dt> <dd>hour as a decimal number using a 24-hour clock (range 0 to 23); single digits are preceded by a blank. (See also %H.)</dd>
     *    <dt>%l</dt> <dd>hour as a decimal number using a 12-hour clock (range 1 to 12); single digits are preceded by a blank. (See also %I.) </dd>
     *    <dt>%m</dt> <dd>month as a decimal number (range 01 to 12)</dd>
     *    <dt>%M</dt> <dd>minute as a decimal number</dd>
     *    <dt>%n</dt> <dd>newline character</dd>
     *    <dt>%p</dt> <dd>either `AM' or `PM' according to the given time value, or the corresponding strings for the current locale</dd>
     *    <dt>%P</dt> <dd>like %p, but lower case</dd>
     *    <dt>%r</dt> <dd>time in a.m. and p.m. notation equal to %I:%M:%S %p</dd>
     *    <dt>%R</dt> <dd>time in 24 hour notation equal to %H:%M</dd>
     *    <dt>%s</dt> <dd>number of seconds since the Epoch, ie, since 1970-01-01 00:00:00 UTC</dd>
     *    <dt>%S</dt> <dd>second as a decimal number</dd>
     *    <dt>%t</dt> <dd>tab character</dd>
     *    <dt>%T</dt> <dd>current time, equal to %H:%M:%S</dd>
     *    <dt>%u</dt> <dd>weekday as a decimal number [1,7], with 1 representing Monday</dd>
     *    <dt>%U</dt> <dd>week number of the current year as a decimal number, starting with the
     *            first Sunday as the first day of the first week</dd>
     *    <dt>%V</dt> <dd>The ISO 8601:1988 week number of the current year as a decimal number,
     *            range 01 to 53, where week 1 is the first week that has at least 4 days
     *            in the current year, and with Monday as the first day of the week.</dd>
     *    <dt>%w</dt> <dd>day of the week as a decimal, Sunday being 0</dd>
     *    <dt>%W</dt> <dd>week number of the current year as a decimal number, starting with the
     *            first Monday as the first day of the first week</dd>
     *    <dt>%x</dt> <dd>preferred date representation for the current locale without the time</dd>
     *    <dt>%X</dt> <dd>preferred time representation for the current locale without the date</dd>
     *    <dt>%y</dt> <dd>year as a decimal number without a century (range 00 to 99)</dd>
     *    <dt>%Y</dt> <dd>year as a decimal number including the century</dd>
     *    <dt>%z</dt> <dd>numerical time zone representation</dd>
     *    <dt>%Z</dt> <dd>time zone name or abbreviation</dd>
     *    <dt>%%</dt> <dd>a literal `%' character</dd>
     *   </dl>
     *  </dd>
     * </dl>
     * @param sLocale {String} (Optional) The locale to use when displaying days of week,
     *  months of the year, and other locale specific strings.  The following locales are
     *  built in:
     *  <dl>
     *   <dt>en</dt>
     *   <dd>English</dd>
     *   <dt>en-US</dt>
     *   <dd>US English</dd>
     *   <dt>en-GB</dt>
     *   <dd>British English</dd>
     *   <dt>en-AU</dt>
     *   <dd>Australian English (identical to British English)</dd>
     *  </dl>
     *  More locales may be added by subclassing of YAHOO.util.DateLocale.
     *  See YAHOO.util.DateLocale for more information.
     * @return {String} Formatted date for display.
     * @sa YAHOO.util.DateLocale
     */
    format : function (oDate, oConfig, sLocale) {
        oConfig = oConfig || {};
        
        if(!(oDate instanceof Date)) {
            return YAHOO.lang.isValue(oDate) ? oDate : "";
        }

        var format = oConfig.format || "%m/%d/%Y";

        // Be backwards compatible, support strings that are
        // exactly equal to YYYY/MM/DD, DD/MM/YYYY and MM/DD/YYYY
        if(format === 'YYYY/MM/DD') {
            format = '%Y/%m/%d';
        } else if(format === 'DD/MM/YYYY') {
            format = '%d/%m/%Y';
        } else if(format === 'MM/DD/YYYY') {
            format = '%m/%d/%Y';
        }
        // end backwards compatibility block
 
        sLocale = sLocale || "en";

        // Make sure we have a definition for the requested locale, or default to en.
        if(!(sLocale in YAHOO.util.DateLocale)) {
            if(sLocale.replace(/-[a-zA-Z]+$/, '') in YAHOO.util.DateLocale) {
                sLocale = sLocale.replace(/-[a-zA-Z]+$/, '');
            } else {
                sLocale = "en";
            }
        }

        var aLocale = YAHOO.util.DateLocale[sLocale];

        var replace_aggs = function (m0, m1) {
            var f = Dt.aggregates[m1];
            return (f === 'locale' ? aLocale[m1] : f);
        };

        var replace_formats = function (m0, m1) {
            var f = Dt.formats[m1];
            if(typeof f === 'string') {             // string => built in date function
                return oDate[f]();
            } else if(typeof f === 'function') {    // function => our own function
                return f.call(oDate, oDate, aLocale);
            } else if(typeof f === 'object' && typeof f[0] === 'string') {  // built in function with padding
                return xPad(oDate[f[0]](), f[1]);
            } else {
                return m1;
            }
        };

        // First replace aggregates (run in a loop because an agg may be made up of other aggs)
        while(format.match(/%[cDFhnrRtTxX]/)) {
            format = format.replace(/%([cDFhnrRtTxX])/g, replace_aggs);
        }

        // Now replace formats (do not run in a loop otherwise %%a will be replace with the value of %a)
        var str = format.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g, replace_formats);

        replace_aggs = replace_formats = undefined;

        return str;
    }
 };
 
 YAHOO.namespace("YAHOO.util");
 YAHOO.util.Date = Dt;

/**
 * The DateLocale class is a container and base class for all
 * localised date strings used by YAHOO.util.Date. It is used
 * internally, but may be extended to provide new date localisations.
 *
 * To create your own DateLocale, follow these steps:
 * <ol>
 *  <li>Find an existing locale that matches closely with your needs</li>
 *  <li>Use this as your base class.  Use YAHOO.util.DateLocale if nothing
 *   matches.</li>
 *  <li>Create your own class as an extension of the base class using
 *   YAHOO.lang.merge, and add your own localisations where needed.</li>
 * </ol>
 * See the YAHOO.util.DateLocale['en-US'] and YAHOO.util.DateLocale['en-GB']
 * classes which extend YAHOO.util.DateLocale['en'].
 *
 * For example, to implement locales for French french and Canadian french,
 * we would do the following:
 * <ol>
 *  <li>For French french, we have no existing similar locale, so use
 *   YAHOO.util.DateLocale as the base, and extend it:
 *   <pre>
 *      YAHOO.util.DateLocale['fr'] = YAHOO.lang.merge(YAHOO.util.DateLocale, {
 *          a: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
 *          A: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
 *          b: ['jan', 'f&eacute;v', 'mar', 'avr', 'mai', 'jun', 'jui', 'ao&ucirc;', 'sep', 'oct', 'nov', 'd&eacute;c'],
 *          B: ['janvier', 'f&eacute;vrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'ao&ucirc;t', 'septembre', 'octobre', 'novembre', 'd&eacute;cembre'],
 *          c: '%a %d %b %Y %T %Z',
 *          p: ['', ''],
 *          P: ['', ''],
 *          x: '%d.%m.%Y',
 *          X: '%T'
 *      });
 *   </pre>
 *  </li>
 *  <li>For Canadian french, we start with French french and change the meaning of \%x:
 *   <pre>
 *      YAHOO.util.DateLocale['fr-CA'] = YAHOO.lang.merge(YAHOO.util.DateLocale['fr'], {
 *          x: '%Y-%m-%d'
 *      });
 *   </pre>
 *  </li>
 * </ol>
 *
 * With that, you can use your new locales:
 * <pre>
 *    var d = new Date("2008/04/22");
 *    YAHOO.util.Date.format(d, {format: "%A, %d %B == %x"}, "fr");
 * </pre>
 * will return:
 * <pre>
 *    mardi, 22 avril == 22.04.2008
 * </pre>
 * And
 * <pre>
 *    YAHOO.util.Date.format(d, {format: "%A, %d %B == %x"}, "fr-CA");
 * </pre>
 * Will return:
 * <pre>
 *   mardi, 22 avril == 2008-04-22
 * </pre>
 * @namespace YAHOO.util
 * @requires yahoo
 * @class DateLocale
 */
 YAHOO.util.DateLocale = {
        a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        c: '%a %d %b %Y %T %Z',
        p: ['AM', 'PM'],
        P: ['am', 'pm'],
        r: '%I:%M:%S %p',
        x: '%d/%m/%y',
        X: '%T'
 };

 YAHOO.util.DateLocale['en'] = YAHOO.lang.merge(YAHOO.util.DateLocale, {});

 YAHOO.util.DateLocale['en-US'] = YAHOO.lang.merge(YAHOO.util.DateLocale['en'], {
        c: '%a %d %b %Y %I:%M:%S %p %Z',
        x: '%m/%d/%Y',
        X: '%I:%M:%S %p'
 });

 YAHOO.util.DateLocale['en-GB'] = YAHOO.lang.merge(YAHOO.util.DateLocale['en'], {
        r: '%l:%M:%S %P %Z'
 });
 YAHOO.util.DateLocale['en-AU'] = YAHOO.lang.merge(YAHOO.util.DateLocale['en']);

})();

YAHOO.register("datasource", YAHOO.util.DataSource, {version: "@VERSION@", build: "@BUILD@"});
/////////////////////////////////////////////////////////////////////////////
//
// YAHOO.widget.DataSource Backwards Compatibility
//
/////////////////////////////////////////////////////////////////////////////

YAHOO.widget.DS_JSArray = YAHOO.util.LocalDataSource;

YAHOO.widget.DS_JSFunction = YAHOO.util.FunctionDataSource;

YAHOO.widget.DS_XHR = function(sScriptURI, aSchema, oConfigs) {
    var DS = new YAHOO.util.XHRDataSource(sScriptURI, oConfigs);
    DS._aDeprecatedSchema = aSchema;
    return DS;
};

YAHOO.widget.DS_ScriptNode = function(sScriptURI, aSchema, oConfigs) {
    var DS = new YAHOO.util.ScriptNodeDataSource(sScriptURI, oConfigs);
    DS._aDeprecatedSchema = aSchema;
    return DS;
};

YAHOO.widget.DS_XHR.TYPE_JSON = YAHOO.util.DataSourceBase.TYPE_JSON;
YAHOO.widget.DS_XHR.TYPE_XML = YAHOO.util.DataSourceBase.TYPE_XML;
YAHOO.widget.DS_XHR.TYPE_FLAT = YAHOO.util.DataSourceBase.TYPE_TEXT;

// TODO: widget.DS_ScriptNode.scriptCallbackParam



 /**
 * The AutoComplete control provides the front-end logic for text-entry suggestion and
 * completion functionality.
 *
 * @module autocomplete
 * @requires yahoo, dom, event, datasource
 * @optional animation
 * @namespace YAHOO.widget
 * @title AutoComplete Widget
 */

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The AutoComplete class provides the customizable functionality of a plug-and-play DHTML
 * auto completion widget.  Some key features:
 * <ul>
 * <li>Navigate with up/down arrow keys and/or mouse to pick a selection</li>
 * <li>The drop down container can "roll down" or "fly out" via configurable
 * animation</li>
 * <li>UI look-and-feel customizable through CSS, including container
 * attributes, borders, position, fonts, etc</li>
 * </ul>
 *
 * @class AutoComplete
 * @constructor
 * @param elInput {HTMLElement} DOM element reference of an input field.
 * @param elInput {String} String ID of an input field.
 * @param elContainer {HTMLElement} DOM element reference of an existing DIV.
 * @param elContainer {String} String ID of an existing DIV.
 * @param oDataSource {YAHOO.widget.DataSource} DataSource instance.
 * @param oConfigs {Object} (optional) Object literal of configuration params.
 */
YAHOO.widget.AutoComplete = function(elInput,elContainer,oDataSource,oConfigs) {
    if(elInput && elContainer && oDataSource) {
        // Validate DataSource
        if(oDataSource instanceof YAHOO.util.DataSourceBase) {
            this.dataSource = oDataSource;
        }
        else {
            return;
        }

        // YAHOO.widget.DataSource schema backwards compatibility
        // Converted deprecated schema into supported schema
        // First assume key data is held in position 0 of results array
        this.key = 0;
        var schema = oDataSource.responseSchema;
        // An old school schema has been defined in the deprecated DataSource constructor
        if(oDataSource._aDeprecatedSchema) {
            var aDeprecatedSchema = oDataSource._aDeprecatedSchema;
            if(YAHOO.lang.isArray(aDeprecatedSchema)) {
                
                if((oDataSource.responseType === YAHOO.util.DataSourceBase.TYPE_JSON) || 
                (oDataSource.responseType === YAHOO.util.DataSourceBase.TYPE_UNKNOWN)) { // Used to default to unknown
                    // Store the resultsList
                    schema.resultsList = aDeprecatedSchema[0];
                    // Store the key
                    this.key = aDeprecatedSchema[1];
                    // Only resultsList and key are defined, so grab all the data
                    schema.fields = (aDeprecatedSchema.length < 3) ? null : aDeprecatedSchema.slice(1);
                }
                else if(oDataSource.responseType === YAHOO.util.DataSourceBase.TYPE_XML) {
                    schema.resultNode = aDeprecatedSchema[0];
                    this.key = aDeprecatedSchema[1];
                    schema.fields = aDeprecatedSchema.slice(1);
                }                
                else if(oDataSource.responseType === YAHOO.util.DataSourceBase.TYPE_TEXT) {
                    schema.recordDelim = aDeprecatedSchema[0];
                    schema.fieldDelim = aDeprecatedSchema[1];
                }                
                oDataSource.responseSchema = schema;
            }
        }
        
        // Validate input element
        if(YAHOO.util.Dom.inDocument(elInput)) {
            if(YAHOO.lang.isString(elInput)) {
                    this._sName = "instance" + YAHOO.widget.AutoComplete._nIndex + " " + elInput;
                    this._elTextbox = document.getElementById(elInput);
            }
            else {
                this._sName = (elInput.id) ?
                    "instance" + YAHOO.widget.AutoComplete._nIndex + " " + elInput.id:
                    "instance" + YAHOO.widget.AutoComplete._nIndex;
                this._elTextbox = elInput;
            }
            YAHOO.util.Dom.addClass(this._elTextbox, "yui-ac-input");
        }
        else {
            return;
        }

        // Validate container element
        if(YAHOO.util.Dom.inDocument(elContainer)) {
            if(YAHOO.lang.isString(elContainer)) {
                    this._elContainer = document.getElementById(elContainer);
            }
            else {
                this._elContainer = elContainer;
            }
            if(this._elContainer.style.display == "none") {
            }
            
            // For skinning
            var elParent = this._elContainer.parentNode;
            var elTag = elParent.tagName.toLowerCase();
            if(elTag == "div") {
                YAHOO.util.Dom.addClass(elParent, "yui-ac");
            }
            else {
            }
        }
        else {
            return;
        }

        // Default applyLocalFilter setting is to enable for local sources
        if(this.dataSource.dataType === YAHOO.util.DataSourceBase.TYPE_LOCAL) {
            this.applyLocalFilter = true;
        }
        
        // Set any config params passed in to override defaults
        if(oConfigs && (oConfigs.constructor == Object)) {
            for(var sConfig in oConfigs) {
                if(sConfig) {
                    this[sConfig] = oConfigs[sConfig];
                }
            }
        }

        // Initialization sequence
        this._initContainerEl();
        this._initProps();
        this._initListEl();
        this._initContainerHelperEls();

        // Set up events
        var oSelf = this;
        var elTextbox = this._elTextbox;

        // Dom events
        YAHOO.util.Event.addListener(elTextbox,"keyup",oSelf._onTextboxKeyUp,oSelf);
        YAHOO.util.Event.addListener(elTextbox,"keydown",oSelf._onTextboxKeyDown,oSelf);
        YAHOO.util.Event.addListener(elTextbox,"focus",oSelf._onTextboxFocus,oSelf);
        YAHOO.util.Event.addListener(elTextbox,"blur",oSelf._onTextboxBlur,oSelf);
        YAHOO.util.Event.addListener(elContainer,"mouseover",oSelf._onContainerMouseover,oSelf);
        YAHOO.util.Event.addListener(elContainer,"mouseout",oSelf._onContainerMouseout,oSelf);
        YAHOO.util.Event.addListener(elContainer,"click",oSelf._onContainerClick,oSelf);
        YAHOO.util.Event.addListener(elContainer,"scroll",oSelf._onContainerScroll,oSelf);
        YAHOO.util.Event.addListener(elContainer,"resize",oSelf._onContainerResize,oSelf);
        YAHOO.util.Event.addListener(elTextbox,"keypress",oSelf._onTextboxKeyPress,oSelf);
        YAHOO.util.Event.addListener(window,"unload",oSelf._onWindowUnload,oSelf);

        // Custom events
        this.textboxFocusEvent = new YAHOO.util.CustomEvent("textboxFocus", this);
        this.textboxKeyEvent = new YAHOO.util.CustomEvent("textboxKey", this);
        this.dataRequestEvent = new YAHOO.util.CustomEvent("dataRequest", this);
        this.dataReturnEvent = new YAHOO.util.CustomEvent("dataReturn", this);
        this.dataErrorEvent = new YAHOO.util.CustomEvent("dataError", this);
        this.containerPopulateEvent = new YAHOO.util.CustomEvent("containerPopulate", this);
        this.containerExpandEvent = new YAHOO.util.CustomEvent("containerExpand", this);
        this.typeAheadEvent = new YAHOO.util.CustomEvent("typeAhead", this);
        this.itemMouseOverEvent = new YAHOO.util.CustomEvent("itemMouseOver", this);
        this.itemMouseOutEvent = new YAHOO.util.CustomEvent("itemMouseOut", this);
        this.itemArrowToEvent = new YAHOO.util.CustomEvent("itemArrowTo", this);
        this.itemArrowFromEvent = new YAHOO.util.CustomEvent("itemArrowFrom", this);
        this.itemSelectEvent = new YAHOO.util.CustomEvent("itemSelect", this);
        this.unmatchedItemSelectEvent = new YAHOO.util.CustomEvent("unmatchedItemSelect", this);
        this.selectionEnforceEvent = new YAHOO.util.CustomEvent("selectionEnforce", this);
        this.containerCollapseEvent = new YAHOO.util.CustomEvent("containerCollapse", this);
        this.textboxBlurEvent = new YAHOO.util.CustomEvent("textboxBlur", this);
        this.textboxChangeEvent = new YAHOO.util.CustomEvent("textboxChange", this);
        
        // Finish up
        elTextbox.setAttribute("autocomplete","off");
        YAHOO.widget.AutoComplete._nIndex++;
    }
    // Required arguments were not found
    else {
    }
};

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * The DataSource object that encapsulates the data used for auto completion.
 * This object should be an inherited object from YAHOO.widget.DataSource.
 *
 * @property dataSource
 * @type YAHOO.widget.DataSource
 */
YAHOO.widget.AutoComplete.prototype.dataSource = null;

/**
 * By default, results from local DataSources will pass through the filterResults
 * method to apply a client-side matching algorithm. 
 * 
 * @property applyLocalFilter
 * @type Boolean
 * @default true for local arrays and json, otherwise false
 */
YAHOO.widget.AutoComplete.prototype.applyLocalFilter = null;

/**
 * When applyLocalFilter is true, the local filtering algorthim can have case sensitivity
 * enabled. 
 * 
 * @property queryMatchCase
 * @type Boolean
 * @default false
 */
YAHOO.widget.AutoComplete.prototype.queryMatchCase = false;

/**
 * When applyLocalFilter is true, results can  be locally filtered to return
 * matching strings that "contain" the query string rather than simply "start with"
 * the query string.
 * 
 * @property queryMatchContains
 * @type Boolean
 * @default false
 */
YAHOO.widget.AutoComplete.prototype.queryMatchContains = false;

/**
 * Enables query subset matching. When the DataSource's cache is enabled and queryMatchSubset is
 * true, substrings of queries will return matching cached results. For
 * instance, if the first query is for "abc" susequent queries that start with
 * "abc", like "abcd", will be queried against the cache, and not the live data
 * source. Recommended only for DataSources that return comprehensive results
 * for queries with very few characters.
 *
 * @property queryMatchSubset
 * @type Boolean
 * @default false
 *
 */
YAHOO.widget.AutoComplete.prototype.queryMatchSubset = false;

/**
 * Number of characters that must be entered before querying for results. A negative value
 * effectively turns off the widget. A value of 0 allows queries of null or empty string
 * values.
 *
 * @property minQueryLength
 * @type Number
 * @default 1
 */
YAHOO.widget.AutoComplete.prototype.minQueryLength = 1;

/**
 * Maximum number of results to display in results container.
 *
 * @property maxResultsDisplayed
 * @type Number
 * @default 10
 */
YAHOO.widget.AutoComplete.prototype.maxResultsDisplayed = 10;

/**
 * Number of seconds to delay before submitting a query request.  If a query
 * request is received before a previous one has completed its delay, the
 * previous request is cancelled and the new request is set to the delay. If 
 * typeAhead is also enabled, this value must always be less than the typeAheadDelay
 * in order to avoid certain race conditions. 
 *
 * @property queryDelay
 * @type Number
 * @default 0.2
 */
YAHOO.widget.AutoComplete.prototype.queryDelay = 0.2;

/**
 * If typeAhead is true, number of seconds to delay before updating input with
 * typeAhead value. In order to prevent certain race conditions, this value must
 * always be greater than the queryDelay.
 *
 * @property typeAheadDelay
 * @type Number
 * @default 0.5
 */
YAHOO.widget.AutoComplete.prototype.typeAheadDelay = 0.5;

/**
 * When IME usage is detected, AutoComplete will switch to querying the input
 * value at the given interval rather than per key event.
 *
 * @property queryInterval
 * @type Number
 * @default 500
 */
YAHOO.widget.AutoComplete.prototype.queryInterval = 500;

/**
 * Class name of a highlighted item within results container.
 *
 * @property highlightClassName
 * @type String
 * @default "yui-ac-highlight"
 */
YAHOO.widget.AutoComplete.prototype.highlightClassName = "yui-ac-highlight";

/**
 * Class name of a pre-highlighted item within results container.
 *
 * @property prehighlightClassName
 * @type String
 */
YAHOO.widget.AutoComplete.prototype.prehighlightClassName = null;

/**
 * Query delimiter. A single character separator for multiple delimited
 * selections. Multiple delimiter characteres may be defined as an array of
 * strings. A null value or empty string indicates that query results cannot
 * be delimited. This feature is not recommended if you need forceSelection to
 * be true.
 *
 * @property delimChar
 * @type String | String[]
 */
YAHOO.widget.AutoComplete.prototype.delimChar = null;

/**
 * Whether or not the first item in results container should be automatically highlighted
 * on expand.
 *
 * @property autoHighlight
 * @type Boolean
 * @default true
 */
YAHOO.widget.AutoComplete.prototype.autoHighlight = true;

/**
 * If autohighlight is enabled, whether or not the input field should be automatically updated
 * with the first query result as the user types, auto-selecting the substring portion
 * of the first result that the user has not yet typed.
 *
 * @property typeAhead
 * @type Boolean
 * @default false
 */
YAHOO.widget.AutoComplete.prototype.typeAhead = false;

/**
 * Whether or not to animate the expansion/collapse of the results container in the
 * horizontal direction.
 *
 * @property animHoriz
 * @type Boolean
 * @default false
 */
YAHOO.widget.AutoComplete.prototype.animHoriz = false;

/**
 * Whether or not to animate the expansion/collapse of the results container in the
 * vertical direction.
 *
 * @property animVert
 * @type Boolean
 * @default true
 */
YAHOO.widget.AutoComplete.prototype.animVert = true;

/**
 * Speed of container expand/collapse animation, in seconds..
 *
 * @property animSpeed
 * @type Number
 * @default 0.3
 */
YAHOO.widget.AutoComplete.prototype.animSpeed = 0.3;

/**
 * Whether or not to force the user's selection to match one of the query
 * results. Enabling this feature essentially transforms the input field into a
 * &lt;select&gt; field. This feature is not recommended with delimiter character(s)
 * defined.
 *
 * @property forceSelection
 * @type Boolean
 * @default false
 */
YAHOO.widget.AutoComplete.prototype.forceSelection = false;

/**
 * Whether or not to allow browsers to cache user-typed input in the input
 * field. Disabling this feature will prevent the widget from setting the
 * autocomplete="off" on the input field. When autocomplete="off"
 * and users click the back button after form submission, user-typed input can
 * be prefilled by the browser from its cache. This caching of user input may
 * not be desired for sensitive data, such as credit card numbers, in which
 * case, implementers should consider setting allowBrowserAutocomplete to false.
 *
 * @property allowBrowserAutocomplete
 * @type Boolean
 * @default true
 */
YAHOO.widget.AutoComplete.prototype.allowBrowserAutocomplete = true;

/**
 * Enabling this feature prevents the toggling of the container to a collapsed state.
 * Setting to true does not automatically trigger the opening of the container.
 * Implementers are advised to pre-load the container with an explicit "sendQuery()" call.   
 *
 * @property alwaysShowContainer
 * @type Boolean
 * @default false
 */
YAHOO.widget.AutoComplete.prototype.alwaysShowContainer = false;

/**
 * Whether or not to use an iFrame to layer over Windows form elements in
 * IE. Set to true only when the results container will be on top of a
 * &lt;select&gt; field in IE and thus exposed to the IE z-index bug (i.e.,
 * 5.5 < IE < 7).
 *
 * @property useIFrame
 * @type Boolean
 * @default false
 */
YAHOO.widget.AutoComplete.prototype.useIFrame = false;

/**
 * Whether or not the results container should have a shadow.
 *
 * @property useShadow
 * @type Boolean
 * @default false
 */
YAHOO.widget.AutoComplete.prototype.useShadow = false;

/**
 * Whether or not the input field should be updated with selections.
 *
 * @property suppressInputUpdate
 * @type Boolean
 * @default false
 */
YAHOO.widget.AutoComplete.prototype.suppressInputUpdate = false;

/**
 * For backward compatibility to pre-2.6.0 formatResults() signatures, setting
 * resultsTypeList to true will take each object literal result returned by
 * DataSource and flatten into an array.  
 *
 * @property resultTypeList
 * @type Boolean
 * @default true
 */
YAHOO.widget.AutoComplete.prototype.resultTypeList = true;

/**
 * For XHR DataSources, AutoComplete will automatically insert a "?" between the server URI and 
 * the "query" param/value pair. To prevent this behavior, implementers should
 * set this value to false. To more fully customize the query syntax, implementers
 * should override the generateRequest() method. 
 *
 * @property queryQuestionMark
 * @type Boolean
 * @default true
 */
YAHOO.widget.AutoComplete.prototype.queryQuestionMark = true;

/**
 * If true, before each time the container expands, the container element will be
 * positioned to snap to the bottom-left corner of the input element. If
 * autoSnapContainer is set to false, this positioning will not be done.  
 *
 * @property autoSnapContainer
 * @type Boolean
 * @default true
 */
YAHOO.widget.AutoComplete.prototype.autoSnapContainer = true;

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Public accessor to the unique name of the AutoComplete instance.
 *
 * @method toString
 * @return {String} Unique name of the AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.toString = function() {
    return "AutoComplete " + this._sName;
};

 /**
 * Returns DOM reference to input element.
 *
 * @method getInputEl
 * @return {HTMLELement} DOM reference to input element.
 */
YAHOO.widget.AutoComplete.prototype.getInputEl = function() {
    return this._elTextbox;
};

 /**
 * Returns DOM reference to container element.
 *
 * @method getContainerEl
 * @return {HTMLELement} DOM reference to container element.
 */
YAHOO.widget.AutoComplete.prototype.getContainerEl = function() {
    return this._elContainer;
};

 /**
 * Returns true if widget instance is currently active.
 *
 * @method isFocused
 * @return {Boolean} Returns true if widget instance is currently active.
 */
YAHOO.widget.AutoComplete.prototype.isFocused = function() {
    return this._bFocused;
};

 /**
 * Returns true if container is in an expanded state, false otherwise.
 *
 * @method isContainerOpen
 * @return {Boolean} Returns true if container is in an expanded state, false otherwise.
 */
YAHOO.widget.AutoComplete.prototype.isContainerOpen = function() {
    return this._bContainerOpen;
};

/**
 * Public accessor to the &lt;ul&gt; element that displays query results within the results container.
 *
 * @method getListEl
 * @return {HTMLElement[]} Reference to &lt;ul&gt; element within the results container.
 */
YAHOO.widget.AutoComplete.prototype.getListEl = function() {
    return this._elList;
};

/**
 * Public accessor to the matching string associated with a given &lt;li&gt; result.
 *
 * @method getListItemMatch
 * @param elListItem {HTMLElement} Reference to &lt;LI&gt; element.
 * @return {String} Matching string.
 */
YAHOO.widget.AutoComplete.prototype.getListItemMatch = function(elListItem) {
    if(elListItem._sResultMatch) {
        return elListItem._sResultMatch;
    }
    else {
        return null;
    }
};

/**
 * Public accessor to the result data associated with a given &lt;li&gt; result.
 *
 * @method getListItemData
 * @param elListItem {HTMLElement} Reference to &lt;LI&gt; element.
 * @return {Object} Result data.
 */
YAHOO.widget.AutoComplete.prototype.getListItemData = function(elListItem) {
    if(elListItem._oResultData) {
        return elListItem._oResultData;
    }
    else {
        return null;
    }
};

/**
 * Public accessor to the index of the associated with a given &lt;li&gt; result.
 *
 * @method getListItemIndex
 * @param elListItem {HTMLElement} Reference to &lt;LI&gt; element.
 * @return {Number} Index.
 */
YAHOO.widget.AutoComplete.prototype.getListItemIndex = function(elListItem) {
    if(YAHOO.lang.isNumber(elListItem._nItemIndex)) {
        return elListItem._nItemIndex;
    }
    else {
        return null;
    }
};

/**
 * Sets HTML markup for the results container header. This markup will be
 * inserted within a &lt;div&gt; tag with a class of "yui-ac-hd".
 *
 * @method setHeader
 * @param sHeader {String} HTML markup for results container header.
 */
YAHOO.widget.AutoComplete.prototype.setHeader = function(sHeader) {
    if(this._elHeader) {
        var elHeader = this._elHeader;
        if(sHeader) {
            elHeader.innerHTML = sHeader;
            elHeader.style.display = "";
        }
        else {
            elHeader.innerHTML = "";
            elHeader.style.display = "none";
        }
    }
};

/**
 * Sets HTML markup for the results container footer. This markup will be
 * inserted within a &lt;div&gt; tag with a class of "yui-ac-ft".
 *
 * @method setFooter
 * @param sFooter {String} HTML markup for results container footer.
 */
YAHOO.widget.AutoComplete.prototype.setFooter = function(sFooter) {
    if(this._elFooter) {
        var elFooter = this._elFooter;
        if(sFooter) {
                elFooter.innerHTML = sFooter;
                elFooter.style.display = "";
        }
        else {
            elFooter.innerHTML = "";
            elFooter.style.display = "none";
        }
    }
};

/**
 * Sets HTML markup for the results container body. This markup will be
 * inserted within a &lt;div&gt; tag with a class of "yui-ac-bd".
 *
 * @method setBody
 * @param sBody {String} HTML markup for results container body.
 */
YAHOO.widget.AutoComplete.prototype.setBody = function(sBody) {
    if(this._elBody) {
        var elBody = this._elBody;
        YAHOO.util.Event.purgeElement(elBody, true);
        if(sBody) {
            elBody.innerHTML = sBody;
            elBody.style.display = "";
        }
        else {
            elBody.innerHTML = "";
            elBody.style.display = "none";
        }
        this._elList = null;
    }
};

/**
* A function that converts an AutoComplete query into a request value which is then
* passed to the DataSource's sendRequest method in order to retrieve data for 
* the query. By default, returns a String with the syntax: "query={query}"
* Implementers can customize this method for custom request syntaxes.
* 
* @method generateRequest
* @param sQuery {String} Query string
* @return {MIXED} Request
*/
YAHOO.widget.AutoComplete.prototype.generateRequest = function(sQuery) {
    var dataType = this.dataSource.dataType;
    
    // Transform query string in to a request for remote data
    // By default, local data doesn't need a transformation, just passes along the query as is.
    if(dataType === YAHOO.util.DataSourceBase.TYPE_XHR) {
        // By default, XHR GET requests look like "{scriptURI}?{scriptQueryParam}={sQuery}&{scriptQueryAppend}"
        if(!this.dataSource.connMethodPost) {
            sQuery = (this.queryQuestionMark ? "?" : "") + (this.dataSource.scriptQueryParam || "query") + "=" + sQuery + 
                (this.dataSource.scriptQueryAppend ? ("&" + this.dataSource.scriptQueryAppend) : "");        
        }
        // By default, XHR POST bodies are sent to the {scriptURI} like "{scriptQueryParam}={sQuery}&{scriptQueryAppend}"
        else {
            sQuery = (this.dataSource.scriptQueryParam || "query") + "=" + sQuery + 
                (this.dataSource.scriptQueryAppend ? ("&" + this.dataSource.scriptQueryAppend) : "");
        }
    }
    // By default, remote script node requests look like "{scriptURI}&{scriptCallbackParam}={callbackString}&{scriptQueryParam}={sQuery}&{scriptQueryAppend}"
    else if(dataType === YAHOO.util.DataSourceBase.TYPE_SCRIPTNODE) {
        sQuery = "&" + (this.dataSource.scriptQueryParam || "query") + "=" + sQuery + 
            (this.dataSource.scriptQueryAppend ? ("&" + this.dataSource.scriptQueryAppend) : "");    
    }
    
    return sQuery;
};

/**
 * Makes query request to the DataSource.
 *
 * @method sendQuery
 * @param sQuery {String} Query string.
 */
YAHOO.widget.AutoComplete.prototype.sendQuery = function(sQuery) {
    // Activate focus for a new interaction
    this._bFocused = true;
    
    // Adjust programatically sent queries to look like they were input by user
    // when delimiters are enabled
    var newQuery = (this.delimChar) ? this._elTextbox.value + sQuery : sQuery;
    this._sendQuery(newQuery);
};

/**
 * Snaps container to bottom-left corner of input element
 *
 * @method snapContainer
 */
YAHOO.widget.AutoComplete.prototype.snapContainer = function() {
    var oTextbox = this._elTextbox,
        pos = YAHOO.util.Dom.getXY(oTextbox);
    pos[1] += YAHOO.util.Dom.get(oTextbox).offsetHeight + 2;
    YAHOO.util.Dom.setXY(this._elContainer,pos);
};

/**
 * Expands container.
 *
 * @method expandContainer
 */
YAHOO.widget.AutoComplete.prototype.expandContainer = function() {
    this._toggleContainer(true);
};

/**
 * Collapses container.
 *
 * @method collapseContainer
 */
YAHOO.widget.AutoComplete.prototype.collapseContainer = function() {
    this._toggleContainer(false);
};

/**
 * Clears entire list of suggestions.
 *
 * @method clearList
 */
YAHOO.widget.AutoComplete.prototype.clearList = function() {
    var allItems = this._elList.childNodes,
        i=allItems.length-1;
    for(; i>-1; i--) {
          allItems[i].style.display = "none";
    }
};

/**
 * Handles subset matching for when queryMatchSubset is enabled.
 *
 * @method getSubsetMatches
 * @param sQuery {String} Query string.
 * @return {Object} oParsedResponse or null. 
 */
YAHOO.widget.AutoComplete.prototype.getSubsetMatches = function(sQuery) {
    var subQuery, oCachedResponse, subRequest;
    // Loop through substrings of each cached element's query property...
    for(var i = sQuery.length; i >= this.minQueryLength ; i--) {
        subRequest = this.generateRequest(sQuery.substr(0,i));
        this.dataRequestEvent.fire(this, subQuery, subRequest);
        
        // If a substring of the query is found in the cache
        oCachedResponse = this.dataSource.getCachedResponse(subRequest);
        if(oCachedResponse) {
            return this.filterResults.apply(this.dataSource, [sQuery, oCachedResponse, oCachedResponse, {scope:this}]);
        }
    }
    return null;
};

/**
 * Executed by DataSource (within DataSource scope via doBeforeParseData()) to
 * handle responseStripAfter cleanup.
 *
 * @method preparseRawResponse
 * @param sQuery {String} Query string.
 * @return {Object} oParsedResponse or null. 
 */
YAHOO.widget.AutoComplete.prototype.preparseRawResponse = function(oRequest, oFullResponse, oCallback) {
    var nEnd = ((this.responseStripAfter !== "") && (oFullResponse.indexOf)) ?
        oFullResponse.indexOf(this.responseStripAfter) : -1;
    if(nEnd != -1) {
        oFullResponse = oFullResponse.substring(0,nEnd);
    }
    return oFullResponse;
};

/**
 * Executed by DataSource (within DataSource scope via doBeforeCallback()) to
 * filter results through a simple client-side matching algorithm. 
 *
 * @method filterResults
 * @param sQuery {String} Original request.
 * @param oFullResponse {Object} Full response object.
 * @param oParsedResponse {Object} Parsed response object.
 * @param oCallback {Object} Callback object. 
 * @return {Object} Filtered response object.
 */

YAHOO.widget.AutoComplete.prototype.filterResults = function(sQuery, oFullResponse, oParsedResponse, oCallback) {
    // If AC has passed a query string value back to itself, grab it
    if(oCallback && oCallback.argument && oCallback.argument.query) {
        sQuery = oCallback.argument.query;
    }

    // Only if a query string is available to match against
    if(sQuery && sQuery !== "") {
        // First make a copy of the oParseResponse
        oParsedResponse = YAHOO.widget.AutoComplete._cloneObject(oParsedResponse);
        
        var oAC = oCallback.scope,
            oDS = this,
            allResults = oParsedResponse.results, // the array of results
            filteredResults = [], // container for filtered results,
            nMax = oAC.maxResultsDisplayed, // max to find
            bMatchCase = (oDS.queryMatchCase || oAC.queryMatchCase), // backward compat
            bMatchContains = (oDS.queryMatchContains || oAC.queryMatchContains); // backward compat
            
        // Loop through each result object...
        for(var i=0, len=allResults.length; i<len; i++) {
            var oResult = allResults[i];

            // Grab the data to match against from the result object...
            var sResult = null;
            
            // Result object is a simple string already
            if(YAHOO.lang.isString(oResult)) {
                sResult = oResult;
            }
            // Result object is an array of strings
            else if(YAHOO.lang.isArray(oResult)) {
                sResult = oResult[0];
            
            }
            // Result object is an object literal of strings
            else if(this.responseSchema.fields) {
                var key = this.responseSchema.fields[0].key || this.responseSchema.fields[0];
                sResult = oResult[key];
            }
            // Backwards compatibility
            else if(this.key) {
                sResult = oResult[this.key];
            }
            
            if(YAHOO.lang.isString(sResult)) {
                
                var sKeyIndex = (bMatchCase) ?
                sResult.indexOf(decodeURIComponent(sQuery)) :
                sResult.toLowerCase().indexOf(decodeURIComponent(sQuery).toLowerCase());

                // A STARTSWITH match is when the query is found at the beginning of the key string...
                if((!bMatchContains && (sKeyIndex === 0)) ||
                // A CONTAINS match is when the query is found anywhere within the key string...
                (bMatchContains && (sKeyIndex > -1))) {
                    // Stash the match
                    filteredResults.push(oResult);
                }
            }
            
            // Filter no more if maxResultsDisplayed is reached
            if(len>nMax && filteredResults.length===nMax) {
                break;
            }
        }
        oParsedResponse.results = filteredResults;
    }
    else {
    }
    
    return oParsedResponse;
};

/**
 * Handles response for display. This is the callback function method passed to
 * YAHOO.util.DataSourceBase#sendRequest so results from the DataSource are
 * returned to the AutoComplete instance.
 *
 * @method handleResponse
 * @param sQuery {String} Original request.
 * @param oResponse {Object} Response object.
 * @param oPayload {MIXED} (optional) Additional argument(s)
 */
YAHOO.widget.AutoComplete.prototype.handleResponse = function(sQuery, oResponse, oPayload) {
    if((this instanceof YAHOO.widget.AutoComplete) && this._sName) {
        this._populateList(sQuery, oResponse, oPayload);
    }
};

/**
 * Overridable method called before container is loaded with result data.
 *
 * @method doBeforeLoadData
 * @param sQuery {String} Original request.
 * @param oResponse {Object} Response object.
 * @param oPayload {MIXED} (optional) Additional argument(s)
 * @return {Boolean} Return true to continue loading data, false to cancel.
 */
YAHOO.widget.AutoComplete.prototype.doBeforeLoadData = function(sQuery, oResponse, oPayload) {
    return true;
};

/**
 * Overridable method that returns HTML markup for one result to be populated
 * as innerHTML of an &lt;LI&gt; element. 
 *
 * @method formatResult
 * @param oResultData {Object} Result data object.
 * @param sQuery {String} The corresponding query string.
 * @param sResultMatch {HTMLElement} The current query string. 
 * @return {String} HTML markup of formatted result data.
 */
YAHOO.widget.AutoComplete.prototype.formatResult = function(oResultData, sQuery, sResultMatch) {
    var sMarkup = (sResultMatch) ? sResultMatch : "";
    return sMarkup;
};

/**
 * Overridable method called before container expands allows implementers to access data
 * and DOM elements.
 *
 * @method doBeforeExpandContainer
 * @param elTextbox {HTMLElement} The text input box.
 * @param elContainer {HTMLElement} The container element.
 * @param sQuery {String} The query string.
 * @param aResults {Object[]}  An array of query results.
 * @return {Boolean} Return true to continue expanding container, false to cancel the expand.
 */
YAHOO.widget.AutoComplete.prototype.doBeforeExpandContainer = function(elTextbox, elContainer, sQuery, aResults) {
    return true;
};


/**
 * Nulls out the entire AutoComplete instance and related objects, removes attached
 * event listeners, and clears out DOM elements inside the container. After
 * calling this method, the instance reference should be expliclitly nulled by
 * implementer, as in myAutoComplete = null. Use with caution!
 *
 * @method destroy
 */
YAHOO.widget.AutoComplete.prototype.destroy = function() {
    var instanceName = this.toString();
    var elInput = this._elTextbox;
    var elContainer = this._elContainer;

    // Unhook custom events
    this.textboxFocusEvent.unsubscribeAll();
    this.textboxKeyEvent.unsubscribeAll();
    this.dataRequestEvent.unsubscribeAll();
    this.dataReturnEvent.unsubscribeAll();
    this.dataErrorEvent.unsubscribeAll();
    this.containerPopulateEvent.unsubscribeAll();
    this.containerExpandEvent.unsubscribeAll();
    this.typeAheadEvent.unsubscribeAll();
    this.itemMouseOverEvent.unsubscribeAll();
    this.itemMouseOutEvent.unsubscribeAll();
    this.itemArrowToEvent.unsubscribeAll();
    this.itemArrowFromEvent.unsubscribeAll();
    this.itemSelectEvent.unsubscribeAll();
    this.unmatchedItemSelectEvent.unsubscribeAll();
    this.selectionEnforceEvent.unsubscribeAll();
    this.containerCollapseEvent.unsubscribeAll();
    this.textboxBlurEvent.unsubscribeAll();
    this.textboxChangeEvent.unsubscribeAll();

    // Unhook DOM events
    YAHOO.util.Event.purgeElement(elInput, true);
    YAHOO.util.Event.purgeElement(elContainer, true);

    // Remove DOM elements
    elContainer.innerHTML = "";

    // Null out objects
    for(var key in this) {
        if(YAHOO.lang.hasOwnProperty(this, key)) {
            this[key] = null;
        }
    }

};

/////////////////////////////////////////////////////////////////////////////
//
// Public events
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Fired when the input field receives focus.
 *
 * @event textboxFocusEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.textboxFocusEvent = null;

/**
 * Fired when the input field receives key input.
 *
 * @event textboxKeyEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param nKeycode {Number} The keycode number.
 */
YAHOO.widget.AutoComplete.prototype.textboxKeyEvent = null;

/**
 * Fired when the AutoComplete instance makes a request to the DataSource.
 * 
 * @event dataRequestEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param sQuery {String} The query string. 
 * @param oRequest {Object} The request.
 */
YAHOO.widget.AutoComplete.prototype.dataRequestEvent = null;

/**
 * Fired when the AutoComplete instance receives query results from the data
 * source.
 *
 * @event dataReturnEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param sQuery {String} The query string.
 * @param aResults {Object[]} Results array.
 */
YAHOO.widget.AutoComplete.prototype.dataReturnEvent = null;

/**
 * Fired when the AutoComplete instance does not receive query results from the
 * DataSource due to an error.
 *
 * @event dataErrorEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param sQuery {String} The query string.
 * @param oResponse {Object} The response object, if available.
 */
YAHOO.widget.AutoComplete.prototype.dataErrorEvent = null;

/**
 * Fired when the results container is populated.
 *
 * @event containerPopulateEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.containerPopulateEvent = null;

/**
 * Fired when the results container is expanded.
 *
 * @event containerExpandEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.containerExpandEvent = null;

/**
 * Fired when the input field has been prefilled by the type-ahead
 * feature. 
 *
 * @event typeAheadEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param sQuery {String} The query string.
 * @param sPrefill {String} The prefill string.
 */
YAHOO.widget.AutoComplete.prototype.typeAheadEvent = null;

/**
 * Fired when result item has been moused over.
 *
 * @event itemMouseOverEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param elItem {HTMLElement} The &lt;li&gt element item moused to.
 */
YAHOO.widget.AutoComplete.prototype.itemMouseOverEvent = null;

/**
 * Fired when result item has been moused out.
 *
 * @event itemMouseOutEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param elItem {HTMLElement} The &lt;li&gt; element item moused from.
 */
YAHOO.widget.AutoComplete.prototype.itemMouseOutEvent = null;

/**
 * Fired when result item has been arrowed to. 
 *
 * @event itemArrowToEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param elItem {HTMLElement} The &lt;li&gt; element item arrowed to.
 */
YAHOO.widget.AutoComplete.prototype.itemArrowToEvent = null;

/**
 * Fired when result item has been arrowed away from.
 *
 * @event itemArrowFromEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param elItem {HTMLElement} The &lt;li&gt; element item arrowed from.
 */
YAHOO.widget.AutoComplete.prototype.itemArrowFromEvent = null;

/**
 * Fired when an item is selected via mouse click, ENTER key, or TAB key.
 *
 * @event itemSelectEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param elItem {HTMLElement} The selected &lt;li&gt; element item.
 * @param oData {Object} The data returned for the item, either as an object,
 * or mapped from the schema into an array.
 */
YAHOO.widget.AutoComplete.prototype.itemSelectEvent = null;

/**
 * Fired when a user selection does not match any of the displayed result items.
 *
 * @event unmatchedItemSelectEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param sSelection {String} The selected string.  
 */
YAHOO.widget.AutoComplete.prototype.unmatchedItemSelectEvent = null;

/**
 * Fired if forceSelection is enabled and the user's input has been cleared
 * because it did not match one of the returned query results.
 *
 * @event selectionEnforceEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @param sClearedValue {String} The cleared value (including delimiters if applicable). 
 */
YAHOO.widget.AutoComplete.prototype.selectionEnforceEvent = null;

/**
 * Fired when the results container is collapsed.
 *
 * @event containerCollapseEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.containerCollapseEvent = null;

/**
 * Fired when the input field loses focus.
 *
 * @event textboxBlurEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.textboxBlurEvent = null;

/**
 * Fired when the input field value has changed when it loses focus.
 *
 * @event textboxChangeEvent
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 */
YAHOO.widget.AutoComplete.prototype.textboxChangeEvent = null;

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Internal class variable to index multiple AutoComplete instances.
 *
 * @property _nIndex
 * @type Number
 * @default 0
 * @private
 */
YAHOO.widget.AutoComplete._nIndex = 0;

/**
 * Name of AutoComplete instance.
 *
 * @property _sName
 * @type String
 * @private
 */
YAHOO.widget.AutoComplete.prototype._sName = null;

/**
 * Text input field DOM element.
 *
 * @property _elTextbox
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elTextbox = null;

/**
 * Container DOM element.
 *
 * @property _elContainer
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elContainer = null;

/**
 * Reference to content element within container element.
 *
 * @property _elContent
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elContent = null;

/**
 * Reference to header element within content element.
 *
 * @property _elHeader
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elHeader = null;

/**
 * Reference to body element within content element.
 *
 * @property _elBody
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elBody = null;

/**
 * Reference to footer element within content element.
 *
 * @property _elFooter
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elFooter = null;

/**
 * Reference to shadow element within container element.
 *
 * @property _elShadow
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elShadow = null;

/**
 * Reference to iframe element within container element.
 *
 * @property _elIFrame
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elIFrame = null;

/**
 * Whether or not the widget instance is currently active. If query results come back
 * but the user has already moved on, do not proceed with auto complete behavior.
 *
 * @property _bFocused
 * @type Boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._bFocused = false;

/**
 * Animation instance for container expand/collapse.
 *
 * @property _oAnim
 * @type Boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._oAnim = null;

/**
 * Whether or not the results container is currently open.
 *
 * @property _bContainerOpen
 * @type Boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._bContainerOpen = false;

/**
 * Whether or not the mouse is currently over the results
 * container. This is necessary in order to prevent clicks on container items
 * from being text input field blur events.
 *
 * @property _bOverContainer
 * @type Boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._bOverContainer = false;

/**
 * Internal reference to &lt;ul&gt; elements that contains query results within the
 * results container.
 *
 * @property _elList
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elList = null;

/*
 * Array of &lt;li&gt; elements references that contain query results within the
 * results container.
 *
 * @property _aListItemEls
 * @type HTMLElement[]
 * @private
 */
//YAHOO.widget.AutoComplete.prototype._aListItemEls = null;

/**
 * Number of &lt;li&gt; elements currently displayed in results container.
 *
 * @property _nDisplayedItems
 * @type Number
 * @private
 */
YAHOO.widget.AutoComplete.prototype._nDisplayedItems = 0;

/*
 * Internal count of &lt;li&gt; elements displayed and hidden in results container.
 *
 * @property _maxResultsDisplayed
 * @type Number
 * @private
 */
//YAHOO.widget.AutoComplete.prototype._maxResultsDisplayed = 0;

/**
 * Current query string
 *
 * @property _sCurQuery
 * @type String
 * @private
 */
YAHOO.widget.AutoComplete.prototype._sCurQuery = null;

/**
 * Selections from previous queries (for saving delimited queries).
 *
 * @property _sPastSelections
 * @type String
 * @default "" 
 * @private
 */
YAHOO.widget.AutoComplete.prototype._sPastSelections = "";

/**
 * Stores initial input value used to determine if textboxChangeEvent should be fired.
 *
 * @property _sInitInputValue
 * @type String
 * @private
 */
YAHOO.widget.AutoComplete.prototype._sInitInputValue = null;

/**
 * Pointer to the currently highlighted &lt;li&gt; element in the container.
 *
 * @property _elCurListItem
 * @type HTMLElement
 * @private
 */
YAHOO.widget.AutoComplete.prototype._elCurListItem = null;

/**
 * Whether or not an item has been selected since the container was populated
 * with results. Reset to false by _populateList, and set to true when item is
 * selected.
 *
 * @property _bItemSelected
 * @type Boolean
 * @private
 */
YAHOO.widget.AutoComplete.prototype._bItemSelected = false;

/**
 * Key code of the last key pressed in textbox.
 *
 * @property _nKeyCode
 * @type Number
 * @private
 */
YAHOO.widget.AutoComplete.prototype._nKeyCode = null;

/**
 * Delay timeout ID.
 *
 * @property _nDelayID
 * @type Number
 * @private
 */
YAHOO.widget.AutoComplete.prototype._nDelayID = -1;

/**
 * TypeAhead delay timeout ID.
 *
 * @property _nTypeAheadDelayID
 * @type Number
 * @private
 */
YAHOO.widget.AutoComplete.prototype._nTypeAheadDelayID = -1;

/**
 * Src to iFrame used when useIFrame = true. Supports implementations over SSL
 * as well.
 *
 * @property _iFrameSrc
 * @type String
 * @private
 */
YAHOO.widget.AutoComplete.prototype._iFrameSrc = "javascript:false;";

/**
 * For users typing via certain IMEs, queries must be triggered by intervals,
 * since key events yet supported across all browsers for all IMEs.
 *
 * @property _queryInterval
 * @type Object
 * @private
 */
YAHOO.widget.AutoComplete.prototype._queryInterval = null;

/**
 * Internal tracker to last known textbox value, used to determine whether or not
 * to trigger a query via interval for certain IME users.
 *
 * @event _sLastTextboxValue
 * @type String
 * @private
 */
YAHOO.widget.AutoComplete.prototype._sLastTextboxValue = null;

/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Updates and validates latest public config properties.
 *
 * @method __initProps
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initProps = function() {
    // Correct any invalid values
    var minQueryLength = this.minQueryLength;
    if(!YAHOO.lang.isNumber(minQueryLength)) {
        this.minQueryLength = 1;
    }
    var maxResultsDisplayed = this.maxResultsDisplayed;
    if(!YAHOO.lang.isNumber(maxResultsDisplayed) || (maxResultsDisplayed < 1)) {
        this.maxResultsDisplayed = 10;
    }
    var queryDelay = this.queryDelay;
    if(!YAHOO.lang.isNumber(queryDelay) || (queryDelay < 0)) {
        this.queryDelay = 0.2;
    }
    var typeAheadDelay = this.typeAheadDelay;
    if(!YAHOO.lang.isNumber(typeAheadDelay) || (typeAheadDelay < 0)) {
        this.typeAheadDelay = 0.2;
    }
    var delimChar = this.delimChar;
    if(YAHOO.lang.isString(delimChar) && (delimChar.length > 0)) {
        this.delimChar = [delimChar];
    }
    else if(!YAHOO.lang.isArray(delimChar)) {
        this.delimChar = null;
    }
    var animSpeed = this.animSpeed;
    if((this.animHoriz || this.animVert) && YAHOO.util.Anim) {
        if(!YAHOO.lang.isNumber(animSpeed) || (animSpeed < 0)) {
            this.animSpeed = 0.3;
        }
        if(!this._oAnim ) {
            this._oAnim = new YAHOO.util.Anim(this._elContent, {}, this.animSpeed);
        }
        else {
            this._oAnim.duration = this.animSpeed;
        }
    }
    if(this.forceSelection && delimChar) {
    }
};

/**
 * Initializes the results container helpers if they are enabled and do
 * not exist
 *
 * @method _initContainerHelperEls
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initContainerHelperEls = function() {
    if(this.useShadow && !this._elShadow) {
        var elShadow = document.createElement("div");
        elShadow.className = "yui-ac-shadow";
        elShadow.style.width = 0;
        elShadow.style.height = 0;
        this._elShadow = this._elContainer.appendChild(elShadow);
    }
    if(this.useIFrame && !this._elIFrame) {
        var elIFrame = document.createElement("iframe");
        elIFrame.src = this._iFrameSrc;
        elIFrame.frameBorder = 0;
        elIFrame.scrolling = "no";
        elIFrame.style.position = "absolute";
        elIFrame.style.width = 0;
        elIFrame.style.height = 0;
        elIFrame.style.padding = 0;
        elIFrame.tabIndex = -1;
        elIFrame.role = "presentation";
        elIFrame.title = "Presentational iframe shim";
        this._elIFrame = this._elContainer.appendChild(elIFrame);
    }
};

/**
 * Initializes the results container once at object creation
 *
 * @method _initContainerEl
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initContainerEl = function() {
    YAHOO.util.Dom.addClass(this._elContainer, "yui-ac-container");
    
    if(!this._elContent) {
        // The elContent div is assigned DOM listeners and 
        // helps size the iframe and shadow properly
        var elContent = document.createElement("div");
        elContent.className = "yui-ac-content";
        elContent.style.display = "none";

        this._elContent = this._elContainer.appendChild(elContent);

        var elHeader = document.createElement("div");
        elHeader.className = "yui-ac-hd";
        elHeader.style.display = "none";
        this._elHeader = this._elContent.appendChild(elHeader);

        var elBody = document.createElement("div");
        elBody.className = "yui-ac-bd";
        this._elBody = this._elContent.appendChild(elBody);

        var elFooter = document.createElement("div");
        elFooter.className = "yui-ac-ft";
        elFooter.style.display = "none";
        this._elFooter = this._elContent.appendChild(elFooter);
    }
    else {
    }
};

/**
 * Clears out contents of container body and creates up to
 * YAHOO.widget.AutoComplete#maxResultsDisplayed &lt;li&gt; elements in an
 * &lt;ul&gt; element.
 *
 * @method _initListEl
 * @private
 */
YAHOO.widget.AutoComplete.prototype._initListEl = function() {
    var nListLength = this.maxResultsDisplayed,
        elList = this._elList || document.createElement("ul"),
        elListItem;
    
    while(elList.childNodes.length < nListLength) {
        elListItem = document.createElement("li");
        elListItem.style.display = "none";
        elListItem._nItemIndex = elList.childNodes.length;
        elList.appendChild(elListItem);
    }
    if(!this._elList) {
        var elBody = this._elBody;
        YAHOO.util.Event.purgeElement(elBody, true);
        elBody.innerHTML = "";
        this._elList = elBody.appendChild(elList);
    }
    
    this._elBody.style.display = "";
};

/**
 * Focuses input field.
 *
 * @method _focus
 * @private
 */
YAHOO.widget.AutoComplete.prototype._focus = function() {
    // http://developer.mozilla.org/en/docs/index.php?title=Key-navigable_custom_DHTML_widgets
    var oSelf = this;
    setTimeout(function() {
        try {
            oSelf._elTextbox.focus();
        }
        catch(e) {
        }
    },0);
};

/**
 * Enables interval detection for IME support.
 *
 * @method _enableIntervalDetection
 * @private
 */
YAHOO.widget.AutoComplete.prototype._enableIntervalDetection = function() {
    var oSelf = this;
    if(!oSelf._queryInterval && oSelf.queryInterval) {
        oSelf._queryInterval = setInterval(function() { oSelf._onInterval(); }, oSelf.queryInterval);
    }
};

/**
 * Enables query triggers based on text input detection by intervals (rather
 * than by key events).
 *
 * @method _onInterval
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onInterval = function() {
    var currValue = this._elTextbox.value;
    var lastValue = this._sLastTextboxValue;
    if(currValue != lastValue) {
        this._sLastTextboxValue = currValue;
        this._sendQuery(currValue);
    }
};

/**
 * Cancels text input detection by intervals.
 *
 * @method _clearInterval
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._clearInterval = function() {
    if(this._queryInterval) {
        clearInterval(this._queryInterval);
        this._queryInterval = null;
    }
};

/**
 * Whether or not key is functional or should be ignored. Note that the right
 * arrow key is NOT an ignored key since it triggers queries for certain intl
 * charsets.
 *
 * @method _isIgnoreKey
 * @param nKeycode {Number} Code of key pressed.
 * @return {Boolean} True if key should be ignored, false otherwise.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._isIgnoreKey = function(nKeyCode) {
    if((nKeyCode == 9) || (nKeyCode == 13)  || // tab, enter
            (nKeyCode == 16) || (nKeyCode == 17) || // shift, ctl
            (nKeyCode >= 18 && nKeyCode <= 20) || // alt, pause/break,caps lock
            (nKeyCode == 27) || // esc
            (nKeyCode >= 33 && nKeyCode <= 35) || // page up,page down,end
            /*(nKeyCode >= 36 && nKeyCode <= 38) || // home,left,up
            (nKeyCode == 40) || // down*/
            (nKeyCode >= 36 && nKeyCode <= 40) || // home,left,up, right, down
            (nKeyCode >= 44 && nKeyCode <= 45) || // print screen,insert
            (nKeyCode == 229) // Bug 2041973: Korean XP fires 2 keyup events, the key and 229
        ) { 
        return true;
    }
    return false;
};

/**
 * Makes query request to the DataSource.
 *
 * @method _sendQuery
 * @param sQuery {String} Query string.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._sendQuery = function(sQuery) {
    // Widget has been effectively turned off
    if(this.minQueryLength < 0) {
        this._toggleContainer(false);
        return;
    }
    // Delimiter has been enabled
    if(this.delimChar) {
        var extraction = this._extractQuery(sQuery);
        // Here is the query itself
        sQuery = extraction.query;
        // ...and save the rest of the string for later
        this._sPastSelections = extraction.previous;
    }

    // Don't search queries that are too short
    if((sQuery && (sQuery.length < this.minQueryLength)) || (!sQuery && this.minQueryLength > 0)) {
        if(this._nDelayID != -1) {
            clearTimeout(this._nDelayID);
        }
        this._toggleContainer(false);
        return;
    }

    sQuery = encodeURIComponent(sQuery);
    this._nDelayID = -1;    // Reset timeout ID because request is being made
    
    // Subset matching
    if(this.dataSource.queryMatchSubset || this.queryMatchSubset) { // backward compat
        var oResponse = this.getSubsetMatches(sQuery);
        if(oResponse) {
            this.handleResponse(sQuery, oResponse, {query: sQuery});
            return;
        }
    }
    
    if(this.dataSource.responseStripAfter) {
        this.dataSource.doBeforeParseData = this.preparseRawResponse;
    }
    if(this.applyLocalFilter) {
        this.dataSource.doBeforeCallback = this.filterResults;
    }
    
    var sRequest = this.generateRequest(sQuery);
    this.dataRequestEvent.fire(this, sQuery, sRequest);

    this.dataSource.sendRequest(sRequest, {
            success : this.handleResponse,
            failure : this.handleResponse,
            scope   : this,
            argument: {
                query: sQuery
            }
    });
};

/**
 * Populates the array of &lt;li&gt; elements in the container with query
 * results.
 *
 * @method _populateList
 * @param sQuery {String} Original request.
 * @param oResponse {Object} Response object.
 * @param oPayload {MIXED} (optional) Additional argument(s)
 * @private
 */
YAHOO.widget.AutoComplete.prototype._populateList = function(sQuery, oResponse, oPayload) {
    // Clear previous timeout
    if(this._nTypeAheadDelayID != -1) {
        clearTimeout(this._nTypeAheadDelayID);
    }
        
    sQuery = (oPayload && oPayload.query) ? oPayload.query : sQuery;
    
    // Pass data through abstract method for any transformations
    var ok = this.doBeforeLoadData(sQuery, oResponse, oPayload);

    // Data is ok
    if(ok && !oResponse.error) {
        this.dataReturnEvent.fire(this, sQuery, oResponse.results);
        
        // Continue only if instance is still active (i.e., user hasn't already moved on)
        if(this._bFocused) {
            
            //TODO: is this still necessary?
            /*var isOpera = (YAHOO.env.ua.opera);
            var contentStyle = this._elContent.style;
            contentStyle.width = (!isOpera) ? null : "";
            contentStyle.height = (!isOpera) ? null : "";*/
        
            // Store state for this interaction
            var sCurQuery = decodeURIComponent(sQuery);
            this._sCurQuery = sCurQuery;
            this._bItemSelected = false;
        
            var allResults = oResponse.results,
                nItemsToShow = Math.min(allResults.length,this.maxResultsDisplayed),
                sMatchKey = (this.dataSource.responseSchema.fields) ? 
                    (this.dataSource.responseSchema.fields[0].key || this.dataSource.responseSchema.fields[0]) : 0;
            
            if(nItemsToShow > 0) {
                // Make sure container and helpers are ready to go
                if(!this._elList || (this._elList.childNodes.length < nItemsToShow)) {
                    this._initListEl();
                }
                this._initContainerHelperEls();
                
                var allListItemEls = this._elList.childNodes;
                // Fill items with data from the bottom up
                for(var i = nItemsToShow-1; i >= 0; i--) {
                    var elListItem = allListItemEls[i],
                    oResult = allResults[i];
                    
                    // Backward compatibility
                    if(this.resultTypeList) {
                        // Results need to be converted back to an array
                        var aResult = [];
                        // Match key is first
                        aResult[0] = (YAHOO.lang.isString(oResult)) ? oResult : oResult[sMatchKey] || oResult[this.key];
                        // Add additional data to the result array
                        var fields = this.dataSource.responseSchema.fields;
                        if(YAHOO.lang.isArray(fields) && (fields.length > 1)) {
                            for(var k=1, len=fields.length; k<len; k++) {
                                aResult[aResult.length] = oResult[fields[k].key || fields[k]];
                            }
                        }
                        // No specific fields defined, so pass along entire data object
                        else {
                            // Already an array
                            if(YAHOO.lang.isArray(oResult)) {
                                aResult = oResult;
                            }
                            // Simple string 
                            else if(YAHOO.lang.isString(oResult)) {
                                aResult = [oResult];
                            }
                            // Object
                            else {
                                aResult[1] = oResult;
                            }
                        }
                        oResult = aResult;
                    }

                    // The matching value, including backward compatibility for array format and safety net
                    elListItem._sResultMatch = (YAHOO.lang.isString(oResult)) ? oResult : (YAHOO.lang.isArray(oResult)) ? oResult[0] : (oResult[sMatchKey] || "");
                    elListItem._oResultData = oResult; // Additional data
                    elListItem.innerHTML = this.formatResult(oResult, sCurQuery, elListItem._sResultMatch);
                    elListItem.style.display = "";
                }
        
                // Clear out extraneous items
                if(nItemsToShow < allListItemEls.length) {
                    var extraListItem;
                    for(var j = allListItemEls.length-1; j >= nItemsToShow; j--) {
                        extraListItem = allListItemEls[j];
                        extraListItem.style.display = "none";
                    }
                }
                
                this._nDisplayedItems = nItemsToShow;
                
                this.containerPopulateEvent.fire(this, sQuery, allResults);
                
                // Highlight the first item
                if(this.autoHighlight) {
                    var elFirstListItem = this._elList.firstChild;
                    this._toggleHighlight(elFirstListItem,"to");
                    this.itemArrowToEvent.fire(this, elFirstListItem);
                    this._typeAhead(elFirstListItem,sQuery);
                }
                // Unhighlight any previous time
                else {
                    this._toggleHighlight(this._elCurListItem,"from");
                }
        
                // Pre-expansion stuff
                ok = this._doBeforeExpandContainer(this._elTextbox, this._elContainer, sQuery, allResults);
                
                // Expand the container
                this._toggleContainer(ok);
            }
            else {
                this._toggleContainer(false);
            }

            return;
        }
    }
    // Error
    else {
        this.dataErrorEvent.fire(this, sQuery, oResponse);
    }
        
};

/**
 * Called before container expands, by default snaps container to the
 * bottom-left corner of the input element, then calls public overrideable method.
 *
 * @method _doBeforeExpandContainer
 * @param elTextbox {HTMLElement} The text input box.
 * @param elContainer {HTMLElement} The container element.
 * @param sQuery {String} The query string.
 * @param aResults {Object[]}  An array of query results.
 * @return {Boolean} Return true to continue expanding container, false to cancel the expand.
 * @private 
 */
YAHOO.widget.AutoComplete.prototype._doBeforeExpandContainer = function(elTextbox, elContainer, sQuery, aResults) {
    if(this.autoSnapContainer) {
        this.snapContainer();
    }

    return this.doBeforeExpandContainer(elTextbox, elContainer, sQuery, aResults);
};

/**
 * When forceSelection is true and the user attempts
 * leave the text input box without selecting an item from the query results,
 * the user selection is cleared.
 *
 * @method _clearSelection
 * @private
 */
YAHOO.widget.AutoComplete.prototype._clearSelection = function() {
    var extraction = (this.delimChar) ? this._extractQuery(this._elTextbox.value) :
            {previous:"",query:this._elTextbox.value};
    this._elTextbox.value = extraction.previous;
    this.selectionEnforceEvent.fire(this, extraction.query);
};

/**
 * Whether or not user-typed value in the text input box matches any of the
 * query results.
 *
 * @method _textMatchesOption
 * @return {HTMLElement} Matching list item element if user-input text matches
 * a result, null otherwise.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._textMatchesOption = function() {
    var elMatch = null;

    for(var i=0; i<this._nDisplayedItems; i++) {
        var elListItem = this._elList.childNodes[i];
        var sMatch = ("" + elListItem._sResultMatch).toLowerCase();
        if(sMatch == this._sCurQuery.toLowerCase()) {
            elMatch = elListItem;
            break;
        }
    }
    return(elMatch);
};

/**
 * Updates in the text input box with the first query result as the user types,
 * selecting the substring that the user has not typed.
 *
 * @method _typeAhead
 * @param elListItem {HTMLElement} The &lt;li&gt; element item whose data populates the input field.
 * @param sQuery {String} Query string.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._typeAhead = function(elListItem, sQuery) {
    // Don't typeAhead if turned off or is backspace
    if(!this.typeAhead || (this._nKeyCode == 8)) {
        return;
    }

    var oSelf = this,
        elTextbox = this._elTextbox;
        
    // Only if text selection is supported
    if(elTextbox.setSelectionRange || elTextbox.createTextRange) {
        // Set and store timeout for this typeahead
        this._nTypeAheadDelayID = setTimeout(function() {
                // Select the portion of text that the user has not typed
                var nStart = elTextbox.value.length; // any saved queries plus what user has typed
                oSelf._updateValue(elListItem);
                var nEnd = elTextbox.value.length;
                oSelf._selectText(elTextbox,nStart,nEnd);
                var sPrefill = elTextbox.value.substr(nStart,nEnd);
                oSelf.typeAheadEvent.fire(oSelf,sQuery,sPrefill);
            },(this.typeAheadDelay*1000));            
    }
};

/**
 * Selects text in the input field.
 *
 * @method _selectText
 * @param elTextbox {HTMLElement} Text input box element in which to select text.
 * @param nStart {Number} Starting index of text string to select.
 * @param nEnd {Number} Ending index of text selection.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._selectText = function(elTextbox, nStart, nEnd) {
    if(elTextbox.setSelectionRange) { // For Mozilla
        elTextbox.setSelectionRange(nStart,nEnd);
    }
    else if(elTextbox.createTextRange) { // For IE
        var oTextRange = elTextbox.createTextRange();
        oTextRange.moveStart("character", nStart);
        oTextRange.moveEnd("character", nEnd-elTextbox.value.length);
        oTextRange.select();
    }
    else {
        elTextbox.select();
    }
};

/**
 * Extracts rightmost query from delimited string.
 *
 * @method _extractQuery
 * @param sQuery {String} String to parse
 * @return {Object} Object literal containing properties "query" and "previous".  
 * @private
 */
YAHOO.widget.AutoComplete.prototype._extractQuery = function(sQuery) {
    var aDelimChar = this.delimChar,
        nDelimIndex = -1,
        nNewIndex, nQueryStart,
        i = aDelimChar.length-1,
        sPrevious;
        
    // Loop through all possible delimiters and find the rightmost one in the query
    // A " " may be a false positive if they are defined as delimiters AND
    // are used to separate delimited queries
    for(; i >= 0; i--) {
        nNewIndex = sQuery.lastIndexOf(aDelimChar[i]);
        if(nNewIndex > nDelimIndex) {
            nDelimIndex = nNewIndex;
        }
    }
    // If we think the last delimiter is a space (" "), make sure it is NOT
    // a false positive by also checking the char directly before it
    if(aDelimChar[i] == " ") {
        for (var j = aDelimChar.length-1; j >= 0; j--) {
            if(sQuery[nDelimIndex - 1] == aDelimChar[j]) {
                nDelimIndex--;
                break;
            }
        }
    }
    // A delimiter has been found in the query so extract the latest query from past selections
    if(nDelimIndex > -1) {
        nQueryStart = nDelimIndex + 1;
        // Trim any white space from the beginning...
        while(sQuery.charAt(nQueryStart) == " ") {
            nQueryStart += 1;
        }
        // ...and save the rest of the string for later
        sPrevious = sQuery.substring(0,nQueryStart);
        // Here is the query itself
        sQuery = sQuery.substr(nQueryStart);
    }
    // No delimiter found in the query, so there are no selections from past queries
    else {
        sPrevious = "";
    }
    
    return {
        previous: sPrevious,
        query: sQuery
    };
};

/**
 * Syncs results container with its helpers.
 *
 * @method _toggleContainerHelpers
 * @param bShow {Boolean} True if container is expanded, false if collapsed
 * @private
 */
YAHOO.widget.AutoComplete.prototype._toggleContainerHelpers = function(bShow) {
    var width = this._elContent.offsetWidth + "px";
    var height = this._elContent.offsetHeight + "px";

    if(this.useIFrame && this._elIFrame) {
    var elIFrame = this._elIFrame;
        if(bShow) {
            elIFrame.style.width = width;
            elIFrame.style.height = height;
            elIFrame.style.padding = "";
        }
        else {
            elIFrame.style.width = 0;
            elIFrame.style.height = 0;
            elIFrame.style.padding = 0;
        }
    }
    if(this.useShadow && this._elShadow) {
    var elShadow = this._elShadow;
        if(bShow) {
            elShadow.style.width = width;
            elShadow.style.height = height;
        }
        else {
            elShadow.style.width = 0;
            elShadow.style.height = 0;
        }
    }
};

/**
 * Animates expansion or collapse of the container.
 *
 * @method _toggleContainer
 * @param bShow {Boolean} True if container should be expanded, false if container should be collapsed
 * @private
 */
YAHOO.widget.AutoComplete.prototype._toggleContainer = function(bShow) {

    var elContainer = this._elContainer;

    // If implementer has container always open and it's already open, don't mess with it
    // Container is initialized with display "none" so it may need to be shown first time through
    if(this.alwaysShowContainer && this._bContainerOpen) {
        return;
    }
    
    // Reset states
    if(!bShow) {
        this._toggleHighlight(this._elCurListItem,"from");
        this._nDisplayedItems = 0;
        this._sCurQuery = null;
        
        // Container is already closed, so don't bother with changing the UI
        if(this._elContent.style.display == "none") {
            return;
        }
    }

    // If animation is enabled...
    var oAnim = this._oAnim;
    if(oAnim && oAnim.getEl() && (this.animHoriz || this.animVert)) {
        if(oAnim.isAnimated()) {
            oAnim.stop(true);
        }

        // Clone container to grab current size offscreen
        var oClone = this._elContent.cloneNode(true);
        elContainer.appendChild(oClone);
        oClone.style.top = "-9000px";
        oClone.style.width = "";
        oClone.style.height = "";
        oClone.style.display = "";

        // Current size of the container is the EXPANDED size
        var wExp = oClone.offsetWidth;
        var hExp = oClone.offsetHeight;

        // Calculate COLLAPSED sizes based on horiz and vert anim
        var wColl = (this.animHoriz) ? 0 : wExp;
        var hColl = (this.animVert) ? 0 : hExp;

        // Set animation sizes
        oAnim.attributes = (bShow) ?
            {width: { to: wExp }, height: { to: hExp }} :
            {width: { to: wColl}, height: { to: hColl }};

        // If opening anew, set to a collapsed size...
        if(bShow && !this._bContainerOpen) {
            this._elContent.style.width = wColl+"px";
            this._elContent.style.height = hColl+"px";
        }
        // Else, set it to its last known size.
        else {
            this._elContent.style.width = wExp+"px";
            this._elContent.style.height = hExp+"px";
        }

        elContainer.removeChild(oClone);
        oClone = null;

    	var oSelf = this;
    	var onAnimComplete = function() {
            // Finish the collapse
    		oAnim.onComplete.unsubscribeAll();

            if(bShow) {
                oSelf._toggleContainerHelpers(true);
                oSelf._bContainerOpen = bShow;
                oSelf.containerExpandEvent.fire(oSelf);
            }
            else {
                oSelf._elContent.style.display = "none";
                oSelf._bContainerOpen = bShow;
                oSelf.containerCollapseEvent.fire(oSelf);
            }
     	};

        // Display container and animate it
        this._toggleContainerHelpers(false); // Bug 1424486: Be early to hide, late to show;
        this._elContent.style.display = "";
        oAnim.onComplete.subscribe(onAnimComplete);
        oAnim.animate();
    }
    // Else don't animate, just show or hide
    else {
        if(bShow) {
            this._elContent.style.display = "";
            this._toggleContainerHelpers(true);
            this._bContainerOpen = bShow;
            this.containerExpandEvent.fire(this);
        }
        else {
            this._toggleContainerHelpers(false);
            this._elContent.style.display = "none";
            this._bContainerOpen = bShow;
            this.containerCollapseEvent.fire(this);
        }
   }

};

/**
 * Toggles the highlight on or off for an item in the container, and also cleans
 * up highlighting of any previous item.
 *
 * @method _toggleHighlight
 * @param elNewListItem {HTMLElement} The &lt;li&gt; element item to receive highlight behavior.
 * @param sType {String} Type "mouseover" will toggle highlight on, and "mouseout" will toggle highlight off.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._toggleHighlight = function(elNewListItem, sType) {
    if(elNewListItem) {
        var sHighlight = this.highlightClassName;
        if(this._elCurListItem) {
            // Remove highlight from old item
            YAHOO.util.Dom.removeClass(this._elCurListItem, sHighlight);
            this._elCurListItem = null;
        }
    
        if((sType == "to") && sHighlight) {
            // Apply highlight to new item
            YAHOO.util.Dom.addClass(elNewListItem, sHighlight);
            this._elCurListItem = elNewListItem;
        }
    }
};

/**
 * Toggles the pre-highlight on or off for an item in the container.
 *
 * @method _togglePrehighlight
 * @param elNewListItem {HTMLElement} The &lt;li&gt; element item to receive highlight behavior.
 * @param sType {String} Type "mouseover" will toggle highlight on, and "mouseout" will toggle highlight off.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._togglePrehighlight = function(elNewListItem, sType) {
    if(elNewListItem == this._elCurListItem) {
        return;
    }

    var sPrehighlight = this.prehighlightClassName;
    if((sType == "mouseover") && sPrehighlight) {
        // Apply prehighlight to new item
        YAHOO.util.Dom.addClass(elNewListItem, sPrehighlight);
    }
    else {
        // Remove prehighlight from old item
        YAHOO.util.Dom.removeClass(elNewListItem, sPrehighlight);
    }
};

/**
 * Updates the text input box value with selected query result. If a delimiter
 * has been defined, then the value gets appended with the delimiter.
 *
 * @method _updateValue
 * @param elListItem {HTMLElement} The &lt;li&gt; element item with which to update the value.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._updateValue = function(elListItem) {
    if(!this.suppressInputUpdate) {    
        var elTextbox = this._elTextbox;
        var sDelimChar = (this.delimChar) ? (this.delimChar[0] || this.delimChar) : null;
        var sResultMatch = elListItem._sResultMatch;
    
        // Calculate the new value
        var sNewValue = "";
        if(sDelimChar) {
            // Preserve selections from past queries
            sNewValue = this._sPastSelections;
            // Add new selection plus delimiter
            sNewValue += sResultMatch + sDelimChar;
            if(sDelimChar != " ") {
                sNewValue += " ";
            }
        }
        else { 
            sNewValue = sResultMatch;
        }
        
        // Update input field
        elTextbox.value = sNewValue;
    
        // Scroll to bottom of textarea if necessary
        if(elTextbox.type == "textarea") {
            elTextbox.scrollTop = elTextbox.scrollHeight;
        }
    
        // Move cursor to end
        var end = elTextbox.value.length;
        this._selectText(elTextbox,end,end);
    
        this._elCurListItem = elListItem;
    }
};

/**
 * Selects a result item from the container
 *
 * @method _selectItem
 * @param elListItem {HTMLElement} The selected &lt;li&gt; element item.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._selectItem = function(elListItem) {
    this._bItemSelected = true;
    this._updateValue(elListItem);
    this._sPastSelections = this._elTextbox.value;
    this._clearInterval();
    this.itemSelectEvent.fire(this, elListItem, elListItem._oResultData);
    this._toggleContainer(false);
};

/**
 * If an item is highlighted in the container, the right arrow key jumps to the
 * end of the textbox and selects the highlighted item, otherwise the container
 * is closed.
 *
 * @method _jumpSelection
 * @private
 */
YAHOO.widget.AutoComplete.prototype._jumpSelection = function() {
    if(this._elCurListItem) {
        this._selectItem(this._elCurListItem);
    }
    else {
        this._toggleContainer(false);
    }
};

/**
 * Triggered by up and down arrow keys, changes the current highlighted
 * &lt;li&gt; element item. Scrolls container if necessary.
 *
 * @method _moveSelection
 * @param nKeyCode {Number} Code of key pressed.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._moveSelection = function(nKeyCode) {
    if(this._bContainerOpen) {
        // Determine current item's id number
        var elCurListItem = this._elCurListItem,
            nCurItemIndex = -1;

        if(elCurListItem) {
            nCurItemIndex = elCurListItem._nItemIndex;
        }

        var nNewItemIndex = (nKeyCode == 40) ?
                (nCurItemIndex + 1) : (nCurItemIndex - 1);

        // Out of bounds
        if(nNewItemIndex < -2 || nNewItemIndex >= this._nDisplayedItems) {
            return;
        }

        if(elCurListItem) {
            // Unhighlight current item
            this._toggleHighlight(elCurListItem, "from");
            this.itemArrowFromEvent.fire(this, elCurListItem);
        }
        if(nNewItemIndex == -1) {
           // Go back to query (remove type-ahead string)
            if(this.delimChar) {
                this._elTextbox.value = this._sPastSelections + this._sCurQuery;
            }
            else {
                this._elTextbox.value = this._sCurQuery;
            }
            return;
        }
        if(nNewItemIndex == -2) {
            // Close container
            this._toggleContainer(false);
            return;
        }
        
        var elNewListItem = this._elList.childNodes[nNewItemIndex],

        // Scroll the container if necessary
            elContent = this._elContent,
            sOF = YAHOO.util.Dom.getStyle(elContent,"overflow"),
            sOFY = YAHOO.util.Dom.getStyle(elContent,"overflowY"),
            scrollOn = ((sOF == "auto") || (sOF == "scroll") || (sOFY == "auto") || (sOFY == "scroll"));
        if(scrollOn && (nNewItemIndex > -1) &&
        (nNewItemIndex < this._nDisplayedItems)) {
            // User is keying down
            if(nKeyCode == 40) {
                // Bottom of selected item is below scroll area...
                if((elNewListItem.offsetTop+elNewListItem.offsetHeight) > (elContent.scrollTop + elContent.offsetHeight)) {
                    // Set bottom of scroll area to bottom of selected item
                    elContent.scrollTop = (elNewListItem.offsetTop+elNewListItem.offsetHeight) - elContent.offsetHeight;
                }
                // Bottom of selected item is above scroll area...
                else if((elNewListItem.offsetTop+elNewListItem.offsetHeight) < elContent.scrollTop) {
                    // Set top of selected item to top of scroll area
                    elContent.scrollTop = elNewListItem.offsetTop;

                }
            }
            // User is keying up
            else {
                // Top of selected item is above scroll area
                if(elNewListItem.offsetTop < elContent.scrollTop) {
                    // Set top of scroll area to top of selected item
                    this._elContent.scrollTop = elNewListItem.offsetTop;
                }
                // Top of selected item is below scroll area
                else if(elNewListItem.offsetTop > (elContent.scrollTop + elContent.offsetHeight)) {
                    // Set bottom of selected item to bottom of scroll area
                    this._elContent.scrollTop = (elNewListItem.offsetTop+elNewListItem.offsetHeight) - elContent.offsetHeight;
                }
            }
        }

        this._toggleHighlight(elNewListItem, "to");
        this.itemArrowToEvent.fire(this, elNewListItem);
        if(this.typeAhead) {
            this._updateValue(elNewListItem);
        }
    }
};

/////////////////////////////////////////////////////////////////////////////
//
// Private event handlers
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Handles container mouseover events.
 *
 * @method _onContainerMouseover
 * @param v {HTMLEvent} The mouseover event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onContainerMouseover = function(v,oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(v);
    var elTag = elTarget.nodeName.toLowerCase();
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "li":
                if(oSelf.prehighlightClassName) {
                    oSelf._togglePrehighlight(elTarget,"mouseover");
                }
                else {
                    oSelf._toggleHighlight(elTarget,"to");
                }
            
                oSelf.itemMouseOverEvent.fire(oSelf, elTarget);
                break;
            case "div":
                if(YAHOO.util.Dom.hasClass(elTarget,"yui-ac-container")) {
                    oSelf._bOverContainer = true;
                    return;
                }
                break;
            default:
                break;
        }
        
        elTarget = elTarget.parentNode;
        if(elTarget) {
            elTag = elTarget.nodeName.toLowerCase();
        }
    }
};

/**
 * Handles container mouseout events.
 *
 * @method _onContainerMouseout
 * @param v {HTMLEvent} The mouseout event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onContainerMouseout = function(v,oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(v);
    var elTag = elTarget.nodeName.toLowerCase();
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "li":
                if(oSelf.prehighlightClassName) {
                    oSelf._togglePrehighlight(elTarget,"mouseout");
                }
                else {
                    oSelf._toggleHighlight(elTarget,"from");
                }
            
                oSelf.itemMouseOutEvent.fire(oSelf, elTarget);
                break;
            case "ul":
                oSelf._toggleHighlight(oSelf._elCurListItem,"to");
                break;
            case "div":
                if(YAHOO.util.Dom.hasClass(elTarget,"yui-ac-container")) {
                    oSelf._bOverContainer = false;
                    return;
                }
                break;
            default:
                break;
        }

        elTarget = elTarget.parentNode;
        if(elTarget) {
            elTag = elTarget.nodeName.toLowerCase();
        }
    }
};

/**
 * Handles container click events.
 *
 * @method _onContainerClick
 * @param v {HTMLEvent} The click event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onContainerClick = function(v,oSelf) {
    var elTarget = YAHOO.util.Event.getTarget(v);
    var elTag = elTarget.nodeName.toLowerCase();
    while(elTarget && (elTag != "table")) {
        switch(elTag) {
            case "body":
                return;
            case "li":
                // In case item has not been moused over
                oSelf._toggleHighlight(elTarget,"to");
                oSelf._selectItem(elTarget);
                return;
            default:
                break;
        }

        elTarget = elTarget.parentNode;
        if(elTarget) {
            elTag = elTarget.nodeName.toLowerCase();
        }
    }    
};


/**
 * Handles container scroll events.
 *
 * @method _onContainerScroll
 * @param v {HTMLEvent} The scroll event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onContainerScroll = function(v,oSelf) {
    oSelf._focus();
};

/**
 * Handles container resize events.
 *
 * @method _onContainerResize
 * @param v {HTMLEvent} The resize event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onContainerResize = function(v,oSelf) {
    oSelf._toggleContainerHelpers(oSelf._bContainerOpen);
};


/**
 * Handles textbox keydown events of functional keys, mainly for UI behavior.
 *
 * @method _onTextboxKeyDown
 * @param v {HTMLEvent} The keydown event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxKeyDown = function(v,oSelf) {
    var nKeyCode = v.keyCode;

    // Clear timeout
    if(oSelf._nTypeAheadDelayID != -1) {
        clearTimeout(oSelf._nTypeAheadDelayID);
    }
    
    switch (nKeyCode) {
        case 9: // tab
            if(!YAHOO.env.ua.opera && (navigator.userAgent.toLowerCase().indexOf("mac") == -1) || (YAHOO.env.ua.webkit>420)) {
                // select an item or clear out
                if(oSelf._elCurListItem) {
                    if(oSelf.delimChar && (oSelf._nKeyCode != nKeyCode)) {
                        if(oSelf._bContainerOpen) {
                            YAHOO.util.Event.stopEvent(v);
                        }
                    }
                    oSelf._selectItem(oSelf._elCurListItem);
                }
                else {
                    oSelf._toggleContainer(false);
                }
            }
            break;
        case 13: // enter
            if(!YAHOO.env.ua.opera && (navigator.userAgent.toLowerCase().indexOf("mac") == -1) || (YAHOO.env.ua.webkit>420)) {
                if(oSelf._elCurListItem) {
                    if(oSelf._nKeyCode != nKeyCode) {
                        if(oSelf._bContainerOpen) {
                            YAHOO.util.Event.stopEvent(v);
                        }
                    }
                    oSelf._selectItem(oSelf._elCurListItem);
                }
                else {
                    oSelf._toggleContainer(false);
                }
            }
            break;
        case 27: // esc
            oSelf._toggleContainer(false);
            return;
        case 39: // right
            oSelf._jumpSelection();
            break;
        case 38: // up
            if(oSelf._bContainerOpen) {
                YAHOO.util.Event.stopEvent(v);
                oSelf._moveSelection(nKeyCode);
            }
            break;
        case 40: // down
            if(oSelf._bContainerOpen) {
                YAHOO.util.Event.stopEvent(v);
                oSelf._moveSelection(nKeyCode);
            }
            break;
        default: 
            oSelf._bItemSelected = false;
            oSelf._toggleHighlight(oSelf._elCurListItem, "from");

            oSelf.textboxKeyEvent.fire(oSelf, nKeyCode);
            break;
    }

    if(nKeyCode === 18){
        oSelf._enableIntervalDetection();
    }    
    oSelf._nKeyCode = nKeyCode;
};

/**
 * Handles textbox keypress events.
 * @method _onTextboxKeyPress
 * @param v {HTMLEvent} The keypress event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxKeyPress = function(v,oSelf) {
    var nKeyCode = v.keyCode;

        // Expose only to non SF3 (bug 1978549) Mac browsers (bug 790337) and  Opera browsers (bug 583531),
        // where stopEvent is ineffective on keydown events 
        if(YAHOO.env.ua.opera || (navigator.userAgent.toLowerCase().indexOf("mac") != -1) && (YAHOO.env.ua.webkit < 420)) {
            switch (nKeyCode) {
            case 9: // tab
                // select an item or clear out
                if(oSelf._bContainerOpen) {
                    if(oSelf.delimChar) {
                        YAHOO.util.Event.stopEvent(v);
                    }
                    if(oSelf._elCurListItem) {
                        oSelf._selectItem(oSelf._elCurListItem);
                    }
                    else {
                        oSelf._toggleContainer(false);
                    }
                }
                break;
            case 13: // enter
                if(oSelf._bContainerOpen) {
                    YAHOO.util.Event.stopEvent(v);
                    if(oSelf._elCurListItem) {
                        oSelf._selectItem(oSelf._elCurListItem);
                    }
                    else {
                        oSelf._toggleContainer(false);
                    }
                }
                break;
            default:
                break;
            }
        }

        //TODO: (?) limit only to non-IE, non-Mac-FF for Korean IME support (bug 811948)
        // Korean IME detected
        else if(nKeyCode == 229) {
            oSelf._enableIntervalDetection();
        }
};

/**
 * Handles textbox keyup events to trigger queries.
 *
 * @method _onTextboxKeyUp
 * @param v {HTMLEvent} The keyup event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxKeyUp = function(v,oSelf) {
    var sText = this.value; //string in textbox
    
    // Check to see if any of the public properties have been updated
    oSelf._initProps();

    // Filter out chars that don't trigger queries
    var nKeyCode = v.keyCode;
    if(oSelf._isIgnoreKey(nKeyCode)) {
        return;
    }

    // Clear previous timeout
    /*if(oSelf._nTypeAheadDelayID != -1) {
        clearTimeout(oSelf._nTypeAheadDelayID);
    }*/
    if(oSelf._nDelayID != -1) {
        clearTimeout(oSelf._nDelayID);
    }

    // Set new timeout
    oSelf._nDelayID = setTimeout(function(){
            oSelf._sendQuery(sText);
        },(oSelf.queryDelay * 1000));

     //= nDelayID;
    //else {
        // No delay so send request immediately
        //oSelf._sendQuery(sText);
   //}
};

/**
 * Handles text input box receiving focus.
 *
 * @method _onTextboxFocus
 * @param v {HTMLEvent} The focus event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxFocus = function (v,oSelf) {
    // Start of a new interaction
    if(!oSelf._bFocused) {
        oSelf._elTextbox.setAttribute("autocomplete","off");
        oSelf._bFocused = true;
        oSelf._sInitInputValue = oSelf._elTextbox.value;
        oSelf.textboxFocusEvent.fire(oSelf);
    }
};

/**
 * Handles text input box losing focus.
 *
 * @method _onTextboxBlur
 * @param v {HTMLEvent} The focus event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onTextboxBlur = function (v,oSelf) {
    // Is a true blur
    if(!oSelf._bOverContainer || (oSelf._nKeyCode == 9)) {
        // Current query needs to be validated as a selection
        if(!oSelf._bItemSelected) {
            var elMatchListItem = oSelf._textMatchesOption();
            // Container is closed or current query doesn't match any result
            if(!oSelf._bContainerOpen || (oSelf._bContainerOpen && (elMatchListItem === null))) {
                // Force selection is enabled so clear the current query
                if(oSelf.forceSelection) {
                    oSelf._clearSelection();
                }
                // Treat current query as a valid selection
                else {
                    oSelf.unmatchedItemSelectEvent.fire(oSelf, oSelf._sCurQuery);
                }
            }
            // Container is open and current query matches a result
            else {
                // Force a selection when textbox is blurred with a match
                if(oSelf.forceSelection) {
                    oSelf._selectItem(elMatchListItem);
                }
            }
        }

        oSelf._clearInterval();
        oSelf._bFocused = false;
        if(oSelf._sInitInputValue !== oSelf._elTextbox.value) {
            oSelf.textboxChangeEvent.fire(oSelf);
        }
        oSelf.textboxBlurEvent.fire(oSelf);

        oSelf._toggleContainer(false);
    }
    // Not a true blur if it was a selection via mouse click
    else {
        oSelf._focus();
    }
};

/**
 * Handles window unload event.
 *
 * @method _onWindowUnload
 * @param v {HTMLEvent} The unload event.
 * @param oSelf {YAHOO.widget.AutoComplete} The AutoComplete instance.
 * @private
 */
YAHOO.widget.AutoComplete.prototype._onWindowUnload = function(v,oSelf) {
    if(oSelf && oSelf._elTextbox && oSelf.allowBrowserAutocomplete) {
        oSelf._elTextbox.setAttribute("autocomplete","on");
    }
};

/////////////////////////////////////////////////////////////////////////////
//
// Deprecated for Backwards Compatibility
//
/////////////////////////////////////////////////////////////////////////////
/**
 * @method doBeforeSendQuery
 * @deprecated Use generateRequest.
 */
YAHOO.widget.AutoComplete.prototype.doBeforeSendQuery = function(sQuery) {
    return this.generateRequest(sQuery);
};

/**
 * @method getListItems
 * @deprecated Use getListEl().childNodes.
 */
YAHOO.widget.AutoComplete.prototype.getListItems = function() {
    var allListItemEls = [],
        els = this._elList.childNodes;
    for(var i=els.length-1; i>=0; i--) {
        allListItemEls[i] = els[i];
    }
    return allListItemEls;
};

/////////////////////////////////////////////////////////////////////////
//
// Private static methods
//
/////////////////////////////////////////////////////////////////////////

/**
 * Clones object literal or array of object literals.
 *
 * @method AutoComplete._cloneObject
 * @param o {Object} Object.
 * @private
 * @static     
 */
YAHOO.widget.AutoComplete._cloneObject = function(o) {
    if(!YAHOO.lang.isValue(o)) {
        return o;
    }
    
    var copy = {};
    
    if(YAHOO.lang.isFunction(o)) {
        copy = o;
    }
    else if(YAHOO.lang.isArray(o)) {
        var array = [];
        for(var i=0,len=o.length;i<len;i++) {
            array[i] = YAHOO.widget.AutoComplete._cloneObject(o[i]);
        }
        copy = array;
    }
    else if(YAHOO.lang.isObject(o)) { 
        for (var x in o){
            if(YAHOO.lang.hasOwnProperty(o, x)) {
                if(YAHOO.lang.isValue(o[x]) && YAHOO.lang.isObject(o[x]) || YAHOO.lang.isArray(o[x])) {
                    copy[x] = YAHOO.widget.AutoComplete._cloneObject(o[x]);
                }
                else {
                    copy[x] = o[x];
                }
            }
        }
    }
    else {
        copy = o;
    }

    return copy;
};




YAHOO.register("autocomplete", YAHOO.widget.AutoComplete, {version: "@VERSION@", build: "@BUILD@"});
/*
 * Copyright (c) 2009, Matt Snider, LLC All rights reserved.
 * Version: 1.0.01
 */

/**
 * Extending YAHOO.lang.
 * @class YAHOO.lang
 * @static
 */
(function() {    
    var _YL = YAHOO.lang,
		_YENV = YAHOO.env,
        _YUA = _YENV.ua;

	var _that = {

        /**
         * The error text to throw when a method is not implemetented.
         * @property ERROR_NOT_IMPLEMENTED
         * @type String
         * @static
         * @final
         */
        ERROR_NOT_IMPLEMENTED: 'Method "??.??" not available without including "??" in your library.',

        /**
         * The error text to throw when invalid parameters are passed into a method.
         * @property ERROR_INVALID_PARAMETERS
         * @type String
         * @static
         * @final
         */
        ERROR_INVALID_PARAMETERS: 'Method "??.??" is missing required parameter of (??) "??".',

        /**
         * The error text to throw when a required value is not defined.
         * @property ERROR_NOT_DEFINED
         * @type String
         * @static
         * @final
         */
        ERROR_NOT_DEFINED: '?? - "??" not defined, unable to ?? "??"',

        /**
         * The error text to throw when an object is missing a required key.
         * @property ERROR_MALFORMED_OBJECT
         * @type String
         * @static
         * @final
         */
        ERROR_MALFORMED_OBJECT: '?? - Object "??" does not contain required parameter (??) "??"',

        /**
		 * Iterates on the provided array and calls provided function with the value of each index.
		 * @method arrayWalk
		 * @param arr {Array} Required. The array or array-like object to iterate on (must have a length).
		 * @param fx {Function} Required. The function to execute.
		 * @param scope {Object} Optional. The execution scope.
		 * @static
		 */
		arrayWalk: function(arr, fx, scope) {
			if (! (arr || arr.length)) {return;}
			var n = arr.length;
			for (var i = 0; i < n; i+= 1) {
				var o = fx.call(scope || window, arr[i], i);
				if (_YL.isDefined(o)) {return o;}
			}
		},

		/**
		 * Wrapper for simple lazy-loading functions.
		 * @method callLazy
		 * @param callback {Function} Required. The callback method.
		 * @param isReady {Function} Required. The is ready test function.
		 * @param conf {Object} Optional. Configuration options for execution.
		 *          failure: {Function} The method to call if max iteration is reached.
		 *          maxExec: {Number} The maximum number of time to execute; default is 25.
		 *          timeout: {Number} The number of milliseconds to wait before checking 'isReady'; default is 100ms.
		 *          params: {Object} An object to pass through to callback function.
		 * @static
		 */
		callLazy: function(callback, isReady, conf) {
            // define cfg and set default values
            var cfg = _YL.isObject(conf) ? conf : {};
            if (! (0 < cfg.maxExec)) {cfg.maxExec = 25;}
            if (! (0 < cfg.timeout)) {cfg.timeout = 100;}
            if (! _YL.isFunction(callback)) {_YL.throwError(_YL.ERROR_INVALID_PARAMETERS, 'YAHOO.lang', 'callLazy', 'Function', callback);}
            if (! _YL.isFunction(isReady)) {_YL.throwError(_YL.ERROR_INVALID_PARAMETERS, 'YAHOO.lang', 'callLazy', 'Function', isReady);}

            var fx = function(index) {
                // index does not yet exceed maxExec
                if (cfg.maxExec > index) {
                    if (isReady()) {
                        callback(cfg.params);
                    }
                    else {
					    setTimeout(function() {fx.call(this, index + 1);}, cfg.timeout);
                    }
                }
                // exceeding maxExec; terminate
                else {
                    // was a failutre function provided
                    if (_YL.isFunction(cfg.failure)) {
                        cfg.failure(fx, cfg, i);
                    }
                }
            };

            fx(0);
		},

        /**
         * Provides a safe method for executing a for ... in" loop on the provided object, calling the function with the object and key.
         * @method forEach
         * @param obj {Object} Required. The object to loop through.
         * @param fx {Function} Required. The callback function.
         * @static
         */
        forEach: function(obj, fx) {
            if (! (_YL.isDefined(obj) && _YL.isFunction(fx))) {return;}
    
            // iterate on the keys in data
            for (var k in obj) {
                var o = obj[k];

                if (! _YL.isFunction(o)) { // ignore functions
                    fx(o, k);
                }
            }
        },

		/**
		 * Retrieves value for the given key out of the url query string.
		 * @method getUniqueId
		 * @param prefix {String} Optional. A string to prefix the ID with.
		 * @param isNotInDOM {Boolean} Optional. True, when you want to ensure it is not already in the DOM.
		 * @return {String} The generated unique Id string.
		 * @static
		 */
		getUniqueId: function(prefix, isNotInDOM) {
			var pfx = prefix || 'yui-gen', id;

			do {
				id = pfx + _YENV.getNextIdCounter();
			}
			while (isNotInDOM && document.getElementById(id));

			return id;
		},

        /**
         * Evaluates if the provided object is an arguments object or not.
         * @method isArgument
         * @param o {Object} Required. The object to evaluate.
         * @return {Boolean} The object is an argument.
         * @static
         */
        isArgument: function(o) {
            return _YL.isObject(o) && o.callee;
        },

        /**
         * Evaluates if the provided object is an Date object or not; the special "o.length" check is for Array-Like object that may not have 'constructor'.
         * @method isDate
         * @param o {Object} Required. The object to evaluate.
         * @return {Boolean} The object is a Date.
         * @static
         */
        isDate: function(o) {
            return _YL.isObject(o) && _YL.isUndefined(o.length) && Date === o.constructor;
        },

        /**
         * Evaluates if the provided object is defined or not; defined means not NULL and not UNDEFINED. Slightly more performance than YAHOO.lang.isValue.
         * @see YAHOO.lang.isValue
         * @method isDefined
         * @param o {Object} Required. The object to evaluate.
         * @return {Boolean} The object is a defined.
         * @static
         */
        isDefined: function(o) {
		    return o || ! (undefined === o || null === o);
        },

        /**
         * Test if the client browser is firefox.
         * @method isFireFox
         * @return {Boolean} The client is firefox.
         * @static
         */
        isFireFox: function() {
            return 0 < _YUA.firefox;
        },

        /**
         * Test if the client browser is IE.
         * @method isIE
         * @return {Boolean} The client is IE.
         * @static
         */
        isIE: function() {
            return 0 < _YUA.ie;
        },

        /**
         * Test if the client browser is IE 6.
         * @method isIE6
         * @return {Boolean} The client is IE 6.
         * @static
         */
        isIE6: function() {
            return 4 <= _YUA.ie && 7 > _YUA.ie;
        },

        /**
         * Test if the client browser is IE 7.
         * @method isIE7
         * @return {Boolean} The client is IE 7.
         * @static
         */
        isIE7: function() {
            return 7 <= _YUA.ie || 8 >= _YUA.ie;
        },

        /**
         * Test if the client browser is opera.
         * @method isOpera
         * @return {Boolean} The client is opera.
         * @static
         */
        isOpera: function() {
            return 7 > _YUA.opera;
        },

        /**
         * Evaluates if the provided object is a regular expression object or not.
         * @method isRegExp
         * @param o {Object} Required. The object to evaluate.
         * @return {Boolean} The object is a RegExp.
         * @static
         */
        isRegExp: function(o) {
            return _YL.isObject(o) && o.match;
        },

        /**
         * Test if the client browser is safari.
         * @method isSafari
         * @return {Boolean} The client is safari.
         * @static
         */
        isSafari: function() {
            return 0 < _YUA.webkit;
        },

        /**
         * Throws the provided error text after performing text replacement.
         * @method throwError
         * @param text {String} Required. The error text.
         * @param arg1 {String} Optional. A value to replace the first '??' with.
         * @param argX {String} Optional. Addtional values to replace the corresponding '??' with.
         * @static
         */
        throwError: function(text, arg1, argX) {
			var params = [];
			
			var fx = function() {
				_YL.arrayWalk(arguments, function(o) {
					if (_YL.isArray(o) || _YL.isArgument(o)) {
						fx.apply(this, o);
					}
					else {
						params.push(o);
					}
				});
			};
			
			_YL.throwError = function() {
				params = [];
				fx.apply(this, arguments);
				
				var str = '' + params[0];
				_YL.arrayWalk(params.slice(1), function(o) {
					str = str.replace(/\?\?/, o);
				});
				
				throw(str);
			};
			
			_YL.throwError.apply(this, arguments);
        }
    };

    // fixing IE; index of is assumed to be available
    if (! Array.prototype.indexOf) {

        // this is not to be JavaDoc'ed as it will confuse the compiler
        /*
         * The last index of value in the array.
         * @namespace window
         * @method indexOf
         * @param val {Object} Required. Any non-Object, object.
         * @param strict {Boolean} Optional. True when also comparing type.
         * @return {Number} The index of value or -1 when object is not in array.
         * @public
         */
        Array.prototype.indexOf = function(val, strict) {
            var t1 = _YL.arrayWalk(this, function(o, i) {
                return (o === val) || (! strict && o == val) ? i : false;
            });
            return _YL.isNumber(t1) ? t1 : -1;
        };
    }
	
    _YL.augmentObject(_YL, _that);

	var _thatEnv = {

		/**
		 * Fetches the internal ID counter from YUI, and auto increments it.
		 * @method getNextIdCounter
		 * @return {Number} A number.
		 * @static
		 */
		getNextIdCounter: function() {
			return _YENV._id_counter++;
		}
	};

    _YL.augmentObject(_YENV, _thatEnv);

})();/*
 * Copyright (c) 2009, Matt Snider, LLC All rights reserved.
 * Version: 1.0.04
 */

/**
 * Define global constants.
 * @module window
 */
(function() {
	var YL = YAHOO.lang, CLS = {};
    
    /**
     * This Class contains global constants that to made be available throughout the codebase.
     * @class C
     * @static
     */
    if (! YL.isObject(window.C)) {window.C = {};} // don't override C, unless necessary
	YL.augmentObject(window, {
		F: false,
		N: null,
		T: true
	});

    /**
     * The global object to hold all HTML constants.
     * @namespace C
     * @class HTML
     * @static
     */
    C.HTML={};

	YL.augmentObject(CLS, {
		/**
		 * The DOM class attribute for applying "disabled" styles and/or identifying element state.
		 * @property DISABLED
		 * @type {String}
		 * @static
		 * @final
		 * @readonly Defined at build time.
		 */
		DISABLED:'disabled',

		/**
		 * The DOM class attribute for applying "error" styles.
		 * @property ERROR
		 * @type {String}
		 * @static
		 * @final
		 * @readonly Defined at build time.
		 */
		ERROR:'error',

		/**
		 * The DOM class attribute for emulating ":first-child" psuedo class.
		 * @property FIRST
		 * @type {String}
		 * @static
		 * @final
		 * @readonly Defined at build time.
		 */
		FIRST:'first',

		/**
		 * The DOM class attribute for applying the "visibility:hidden" style.
		 * @property HIDDEN
		 * @type {String}
		 * @static
		 * @final
		 * @readonly Defined at build time.
		 */
		HIDDEN:'hidden',

		/**
		 * The DOM class attribute for applying the "display:none" style.
		 * @property HIDE
		 * @type {String}
		 * @static
		 * @final
		 * @readonly Defined at build time.
		 */
		HIDE:'displayNone',

		/**
		 * The DOM class attribute for emulating ":hover" psuedo class.
		 * @property HOVER
		 * @type {String}
		 * @static
		 * @final
		 * @readonly Defined at build time.
		 */
		HOVER:'hover',

		/**
		 * The DOM class attribute for emulating ":last-child" psuedo class.
		 * @property LAST
		 * @type {String}
		 * @static
		 * @final
		 * @readonly Defined at build time.
		 */
		LAST:'last',

		/**
		 * The DOM class attribute for applying "masked" styles.
		 * @property MASKED
		 * @type {String}
		 * @static
		 * @final
		 * @readonly Defined at build time.
		 */
		MASKED:'masked',

		/**
		 * The DOM class attribute for applying "message" styles.
		 * @property MESSAGE
		 * @type {String}
		 * @static
		 * @final
		 * @readonly Defined at build time.
		 */
		MESSAGE:'message',

		/**
		 * The DOM class attribute for identifying "next" elements (usually used in pagination).
		 * @property NEXT
		 * @type {String}
		 * @static
		 * @final
		 * @readonly Defined at build time.
		 */
		NEXT:'next',

		/**
		 * The DOM class attribute for applying "open" styles and/or identifying element state.
		 * @property OPEN
		 * @type {String}
		 * @static
		 * @final
		 * @readonly Defined at build time.
		 */
		OPEN:'open',

		/**
		 * The DOM class attribute for identifying "previous" elements (usually used in pagination).
		 * @property PREV
		 * @type {String}
		 * @static
		 * @final
		 * @readonly Defined at build time.
		 */
		PREV:'prev',

		/**
		 * The DOM class attribute for applying "selected" styles and/or identifying element state.
		 * @property SELECTED
		 * @type {String}
		 * @static
		 * @final
		 * @readonly Defined at build time.
		 */
		SELECTED:'selected'
	});

    /**
     * The global object to hold all className constants.
     * @namespace C.HTML
     * @class CLS
     * @static
     */
	C.HTML.CLS = CLS;

    /**
     * The global object to hold all ID constants.
     * @namespace C.HTML
     * @class ID
     * @static
     */
    C.HTML.ID={};

    /**
     * The DOM id attribute for identifying the project's body element.
     * @property BODY
     * @type {String}
     * @static
     * @final
     * @readonly Defined at build time.
     */
    C.HTML.ID.BODY = 'project';

    /**
     * The name object to hold all naming constants.
     * @namespace C.HTML
     * @class NAME
     * @static
     */
    C.HTML.NAME={};

    /**
     * The DOM name attribute for tasks.
     * @property TASK
     * @type {String}
     * @static
     * @final
     * @readonly Defined at build time.
     */
    C.HTML.NAME.TASK='task';
}());/*
 * Copyright (c) 2009, Matt Snider, LLC All rights reserved.
 * Version: 1.0.06
 */

/**
 * Extending YAHOO.util.Dom.
 * @class Dom
 * @namespace YAHOO.util
 * @static
 */
(function() {
    var CLS = C.HTML.CLS,
		DOC = document,
		Y = YAHOO,
		YU = Y.util,
        YD = YU.Dom,
        YE = YU.Event,
        YL = Y.lang;

    if (! YD) {YL.throwError.call(this, YL.ERROR_NOT_DEFINED, 'YAHOO.util.Dom', 'extend', 'yahoo-ext/dom.js');}
		
	var $ = YD.get,
        _scrollIntervalId = 0;

    CLS.IS_DELETING = 'isDeleting';

    /*
	 * W3C DOM Level 2 standard node types; for older browsers and IE.
	 */
	if (! DOC.ELEMENT_NODE) {
		YL.augmentObject(DOC, {
			ELEMENT_NODE: 1,
			ATTRIBUTE_NODE: 2,
			TEXT_NODE: 3,
			CDATA_SECTION_NODE: 4,
			ENTITY_REFERENCE_NODE: 5,
			ENTITY_NODE: 6,
			PROCESSING_INSTRUCTION_NODE: 7,
			COMMENT_NODE: 8,
			DOCUMENT_NODE: 9,
			DOCUMENT_TYPE_NODE: 10,
			DOCUMENT_FRAGMENT_NODE: 11,
			NOTATION_NODE: 12
		});
	}

    var _throwNotImplemented = YL.throwError ? function() {
		YL.throwError.call(this, YL.ERROR_NOT_IMPLEMENTED, 'YAHOO.util.Dom', arguments);
	}: function(text) {throw(text);};

    var _that = {

        /* defined below */
        animate: function() {_throwNotImplemented('animate', 'yahoo/animation.js');},

        /**
         * Removes whitespace-only text node children.
         * @method cleanWhitespace
         * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
         * @return {Element} Cleaned DOM node for convenience or NULL.
         * @static
         */
        cleanWhitespace: function(elem) {
            var node = $(elem);
            if (! node) {return N;}
            var cld = node.firstChild;

            while (cld) {
                var nextNode = cld.nextSibling;
                
                if (DOC.COMMENT_NODE === cld.nodeType || (DOC.TEXT_NODE === cld.nodeType && ! /\S/.test(cld.nodeValue))) {
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
            var o = YD.getRegion(srcElem),
                node = $(applyElem);

            if (YL.isUndefined(o.height)) { // for YUI < 2.7
                o.height = o.bottom - o.top;
                o.width = o.right - o.left;
            }

            YD.setStyle(node, 'left', o.left + 'px');
            YD.setStyle(node, 'top', o.top + 'px');
            YD.setStyle(node, 'height', o.height + 'px');
            YD.setStyle(node, 'width', o.width + 'px');

            // debugging tools
            // YD.setStyle(node, 'border', 'red solid 1px');
    		// alert(node.id + 'left: ' + o.left + ', top: ' + o.top + ', height: ' + o.height + ', width: ' + o.width);
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
            if (DOC.createElementNS) {
                YD.createNode = function(tagName) {
                    return tagName ? DOC.createElementNS('http://www.w3.org/1999/xhtml', tagName) : N;
                };
            }
            else if (DOC.createElement) {
                YD.createNode = function(tagName) {
                    return tagName ? DOC.createElement(tagName) : N;
                };
            }
            else {
                YD.createNode = function() {throw 'createElement is not available.';};
            }

            return YD.createNode(tagName);
        },

        /* defined below */
        createTag: function() {_throwNotImplemented('createTag', 'yahoo.ext/lang.js');},

        /**
         * Removes a node from the DOM, using a fading animation and clearning all events.
         * @method deleteNode
         * @param elem {String|Element} Required. Pointer or string reference to DOM element to delete.
         * @param func {Function} Optional. The callback function after animation finishes; default is undefined.
         * @param isRemoveListener {Boolean} Optional. True, when you want to purge event listeners from node and children; default is undefined.
         * @param isAnimate {Boolean} Optional. Animated this action.
         * @return {Boolean} Node deleted.
         * @static
         */
        deleteNode: function(elem, func, isRemoveListener, isAnimate) {
            var node = $(elem),
                fn = YL.isFunction(func) ? func : function() {};
            if (! node || YD.hasClass(node, CLS.IS_DELETING)) {return F;}
            var parent = node.parentNode;

            // remove listeners when YAHOO.util.Event is available, but not required
            if (isRemoveListener && YE && YE.purgeElement) {YE.purgeElement(node);}

            // animate when YAHOO.util.Anim  is available, but not required
            if (YU.Anim && isAnimate) {
                YD.addClass(node, CLS.IS_DELETING);
                YD.animate(node, {opacity: {from: 1, to: 0.25}}, 0.5, YU.Easing.easeOut, [{id: 'onComplete', fx: function() {
                    parent.removeChild(node);
                    YD.addClass(node, CLS.IS_DELETING);
                    if (fn) {fn(parent);}
                }}]);
            }
            else {
                parent.removeChild(node);
                fn(parent);
            }

            return T;
        },

        /**
         * Navigates on the element through native JavaScript properties or YUI equivalent, as provided by instructions.
         * @method exec
         * @param elem {String|Element} Required. Pointer or string reference to DOM element to search from.
         * @param instructions (String} Required. The '.' delimited navigation instructions.
         * @return {Element} The found node or NULL.
         * @static
         */
        exec: function(elem, instructions) {
            var node = $(elem);

            if (! (node && instructions)) {return N;}

            var _s = instructions.split('.');

            for (var i = 0; i < _s.length; i += 1) {
                if (node) {
                    var task = _s[i];

                    if (YD[task]) {
                        node = YD[task](node);
                    } // todo: support childNodes[]
                    else if (node[task]) {
                        node = node[task];
                    }
                    else {
                        // unsupported technique
                    }
                }
                else {
                    return T;
                }
            }

            return node;
        },

        /**
         * Find and replace the first text (ignores whitespaces), or append a textnode when there is no textnode.
         * @method findFirstText
         * @param elem {String|Element} Required. Pointer or string reference to DOM element to search.
         * @return {Element} The first available text node or N.
         * @static
         */
        findFirstText: function(elem) {
			var node = $(elem);
			if (! node) {return N;}

            // this is a text node and not a whitespace, so update it
            if (YD.isTextNode(node) && ('' === node.nodeValue || /\S/.test(node.nodeValue))) {
				return node;
			}
			// find text node
			else {
                var firstText = N,
                    nextSibling = node.firstChild;

                // iterate until nextSibling is N or set to F, indicating we have found a matching node
                while (! firstText && nextSibling) {
                    firstText = YD.findFirstText(nextSibling);
                    nextSibling = nextSibling.nextSibling;
                }

                return firstText;
			}
        },

        /**
         * Animates the background color of the element with a color flash.
         * @method flashBackgroundColor
         * @param node {Element} Required. Pointer or string reference to DOM element to animate.
         * @param color {String} Required. The color to animate to.
         * @static
         */
        flashBackgroundColor: function(node, color) {
            if (! (node || color)) {return;}

            var attr = {backgroundColor: {to: color}},
                anim = new YU.ColorAnim(node, attr),
                oColor = YD.getBackgroundColor(node);

            anim.onComplete.subscribe(function() {
                setTimeout(function() {
                    var attr = {backgroundColor: {to: oColor}},
                        anim = new YU.ColorAnim(node, attr);

                    anim.animate();
                }, 500);
            });

            anim.animate();
        },

        /**
         * Determines the background color of an element in Hexidecimal format, will head up the document stack, if transparent.
         * @method getBackgroundColor
         * @param node {Element} Required. Pointer or string reference to DOM element to evaluate.
         * @return {String} The background color.
         * @static
         */
        getBackgroundColor: function(node) {
            if (! node) {return N;}
            var backgroundColor = YD.getStyle(node, 'backgroundColor');
            if ('transparent' === backgroundColor) {return YD.getBackgroundColor(node.parentNode);}
            var rgb = backgroundColor.replace(/rgba?\((.*?)\)/, '$1').split(', ');
            return String.RGBtoHex(rgb[0], rgb[1], rgb[2]);
        },

        /**
         * Retrieves the HTMLBodyElement, x-browser safe.
         * @method getBodyElement
         * @param newDoc {Document} Optional. The document to use.
         * @return {Element} Body DOM node for convenience or NULL.
         * @static
         */
        getBodyElement: function(newDoc) {
            var body;

            if (! newDoc || newDoc === DOC) {body = $(C.HTML.ID.BODY);} // get body by the ID

            if (! body) { // find the body the tag
                var doc = newDoc || DOC;
                body = doc.getElementsByTagName('body')[0];

                if (! body) { // try find the body on the document
                    //noinspection XHTMLIncompatabilitiesJS
                    body = doc.body || doc.childNodes[0].childNodes[1];

                    if (! body) { // No body, try appending to document
                        body = doc;
                    }
                }
            }

            return body;
        },

        /**
         * Fetchs the childNode of the node, whilst ignoring whitespaces.
         * @method getChildNode
         * @param elem {String|Element} Required. Pointer or string reference to DOM element to search.
         * @param i {Number} Required. The index of the node to get;
         * @return {Element} The pointer to the found DOM node or NULL.
         * @static
         */
        getChildNode: function(elem, i) {
            var j = 0,
                node = $(elem);

            if (! node) {return N;}

            return YD.getFirstChildBy(node, function() {
                if (i === j) {return T;}
                j += 1;
            });
        },

        /**
         * Find the common ancestor shared by two elements, or NULL otherwise.
         * @method getCommonAncestor
         * @param elem1 {Element} Required. Pointer or string reference to DOM element to search.
         * @param elem1 {Element} Required. Pointer or string reference to DOM element to search.
         * @return {Element} The desired node or N.
         * @static
         */
        getCommonAncestor: function(elem1, elem2) {
            var node1 = $(elem1),
                node2 = $(elem2);

            if (! (node1 && node2)) {return N;} // missing parameter, fail
            node1 = node1.parentNode;

            // iterate up the DOM tree
            while (node1) {
                if (YD.isAncestor(node1, node2)) {return node1;}
                node1 = node1.parentNode;
            }

            return N;
        },

        /* defined below */
		getContentAsFloat: function() {_throwNotImplemented('getContentAsFloat', 'yahoo.ext/lang.js');},

        /* defined below */
		getContentAsInteger: function() {_throwNotImplemented('getContentAsInteger', 'yahoo.ext/lang.js');},

        /* defined below */
		getContentAsString: function() {_throwNotImplemented('getContentAsString', 'yahoo.ext/lang.js');},

        /**
         * Returns the left and top scroll value of the document.
         * @method getDocumentScroll
         * @param doc {HTMLDocument} Optional. The document to evaluate.
         * @return {Object} An object where left/top (Number) are the values the document is scrolled to.
         * @static
         */
        getDocumentScroll: function(doc) {
            return {left: YD.getDocumentScrollLeft(doc), top: YD.getDocumentScrollTop(doc)};
        },

        /**
         * Returns the height and width of the document.
         * @method getDocumentSize
         * @param doc {HTMLDocument} Optional. The document to evaluate.
         * @return {Object} An object where height/width (Number) are the actual height/width of document (which includes the body and its margin).
         * @static
         */
        getDocumentSize: function(doc) {
            return {height: YD.getDocumentHeight(doc), width: YD.getDocumentWidth(doc)};
        },

        /* defined below */
		getElementsByTagName: function() {_throwNotImplemented('getElementsByTagName', 'native.ext/array.js');},

		/**
		 * Returns the first childnode of the node with tag name and class name.
		 * @method getFirstChildByTagAndClass
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to search.
		 * @param tagName {String} Optional. The DOM node tag name to limit by.
		 * @param className {String} Optional. The DOM node attribute class name to limit by.
		 * @return {Element} The first matching element or N.
		 * @static
		 */
		getFirstChildByTagAndClass: function(elem, tagName, className) {
			var node = $(elem);

			if (! (node && YL.isString(tagName) && YL.isString(className))) {return N;}

			return YD.getFirstChildBy(node, function(node) {
				var tn = YD.getTagName(node);
				return (tn === tagName && YD.hasClass(node, className));
			});
		},

        /**
         * Retrieves the first text nodes value.
         * @method getFirstText
         * @param elem {String|Element} Required. Pointer or string reference to DOM element to search.
         * @return {String} The value of the first text node.
         * @static
         */
        getFirstText: function(elem) {
            var node = YD.findFirstText(elem);
            if (! node) {return '';}
            return YD.isTextNode(node) ? node.nodeValue : '';
        },

		/**
		 * Returns an image object with src, useful for image caching.
		 * @method getImage
		 * @param src {String} Required. The location of the image.
		 * @return {Image} A Javascript Image Object with the src set.
		 * @static
		 */
		getImage: function(src) {
			var img = new Image();
			img.src = src;
			return img;
		},

		/*
		 * Finds element's absolute position.
		 * @method getPos
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
		 * @return {Object} The {x:posX, y:posY} of DOM node.
		 * @static
		 *//*
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
		},*/

        /**
         * Safe method for fetching the tagName of a node; also converts to lower-case.
         * @method getTagName
         * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
         * @return {String} The tagName or an emtpy string.
         * @static
         */
        getTagName: function(elem) {
            var node = $(elem);
            return node ? ('' + node.tagName).toLowerCase() : '';
        },

        /**
         * Finds a node matching the provided criteria, starting at the event target node, then going up the DOM tree; required YAHOO.event.
         * @method getTargetAncestor
         * @param e {Event} Required. The triggered JavaScript event.
		 * @param tagName {String} Optional. The tagName to find.
		 * @param className {String} Optional. The className to find.
         * @return {Element} The desired node or N.
         * @static
         */
		getTargetAncestor: function(e, tagName, className) {
			var node = YE.getTarget(e),
				nodeTagName;
			
			do {
				nodeTagName = YD.getTagName(node);
				
				if ((! tagName || nodeTagName === tagName) && (! className || YD.hasClass(node, className))) {
					return node;
				}
				
				node = node.parentNode;
			}
			while (node);
			
			return N;
		},

        /**
         * Returns the current height and width of the viewport.
         * @method getViewport
         * @return {Object} An object where height/width (Number) are the current viewable area of the page (excludes scrollbars).
         * @static
         */
        getViewport: function(doc) {
            return {height: YD.getViewportHeight(doc), width: YD.getViewportWidth(doc)};
        },

        /* defined below */
        hide: function() {_throwNotImplemented('hide', 'yahoo.ext/lang.js');},

		/*
		 * X-browser importNode function to insert.
		 * @method _importNode
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to activate.
		 * @param allChildren {Boolean} Required. Set to T, when you want to copy the children nodes as well.
		 * @static
		 * @deprecated Note: keeping around, as I might one day want to use it again
		 *
		 * Example:
		 *  var newNode = N, importedNode = N;
		 *
		 *  newNode = xhrResponse.responseXML.getElementsByTagName ('title')[0].childNodes[0];
		 *  if (newNode.nodeType != document.ELEMENT_NODE) {newNode = newNode.nextSibling;}
		 *  if (newNode) {
		 *  importedNode = document._importNode(newNode, T);
		 *  document.getElementById('divTitleContainer').appendChild(importedNode);
		 *  if (!document.importNode) {
		 *     document.getElementById('divTitleContainer').innerHTML = document.getElementById('divTitleContainer').innerHTML;
		 *  }
		 *  }
		 *//*
		_importNode: function(elem, allChildren) {
			var node = YAHOO.util.$(elem);

			switch (node ? N : node.nodeType) {
				case document.ELEMENT_NODE:
					var newNode = document.createElement(node.nodeName);

					// does the node have any attributes to add?
					if (node.attributes && node.getAttribute && newNode.setAttribute && 0 < node.attributes.length) {
						Mint.batch(node.attributes, function(n) {
							if (n && Object.is(n) && node.getAttribute(n.nodeName)) {
								newNode.setAttribute(n.nodeName, node.getAttribute(n.nodeName));
							}
						});
					}

					// are we going after children too, and does the node have any?
					if (allChildren && node.childNodes && 0 < node.childNodes.length) {
						Mint.batch(node.childNodes, function(n) {
							newNode.appendChild(document._importNode(n, allChildren));
						});
					}

					return newNode;

				case document.TEXT_NODE:
				case document.CDATA_SECTION_NODE:
				case document.COMMENT_NODE:
					return document.createTextNode(node.nodeValue);

				default:
					return N;
			}
		},*/

        /**
         * Determines whether an HTMLElement is an ancestor of another HTML element in the DOM hierarchy; this is different from YUI method,
         * because it takes no shortcuts and works right all the time.
         * @method isAncestorOf
         * @param ancestor {String | HTMLElement} Required. The possible ancestor.
         * @param decendant {String | HTMLElement} Required. The possible decendant.
         * @return {Boolean} Is ancestor of decendant.
         * @static
         */
        isAncestorOf: function(ancestor, decendant) {
            var haystack = YD.get(ancestor),
                needle = YD.get(decendant);

            if (! (haystack && needle)) {return N;}

            while (needle && needle !== DOC) {
                if (needle === ancestor) {return T;}
                needle = needle.parentNode;
            }

            return F;
        },

        /* defined below */
        isTagName: function() {_throwNotImplemented('isTagName', 'yahoo.ext/lang.js');},

        /* defined below */
        isElementType: function() {_throwNotImplemented('isElementType', 'yahoo.ext/lang.js');},

        /**
         * Tests if the node is one of 3 text types.
         * @method isTextNode
         * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
         * @return {Boolean} True, if the elem is a comment, text, or cdata node.
         * @static
         */
        isTextNode: function(elem) {
            var node = $(elem),
                isValidNode = node && node.nodeType; // not calling isNodeOfType because this is faster

            return isValidNode && (node.nodeType === DOC.CDATA_SECTION_NODE || node.nodeType === DOC.COMMENT_NODE || node.nodeType === DOC.TEXT_NODE);
        },

        /**
         * Remove childNodes from node, should be used instead of element.innerHTML = '' as this is xhtml compliant.
         * @method removeChildNodes
         * @param elem {String|Element} Required. Pointer or string reference to DOM element to clear.
         * @return {Number} The number of removed nodes.
         * @static
         */
        removeChildNodes: function(elem) {
            var val = F,
                node = $(elem);

            if (node) {
                val = node.childNodes.length;
                while (node.hasChildNodes()) {
                    node.removeChild(node.firstChild);
                }
            }

            return val;
        },

		/**
		 * Replaces all children of elem as a textnode of text.
		 * @method replace
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to replace content of.
		 * @param text {String} Required. The innerHTML value equivalent to replace content with.
		 * @static
		 */
		replace: function(elem, text) {
			var node = $(elem);
            if (! node) {return;}
            //noinspection InnerHTMLJS
            node.innerHTML = text;
		},

        /**
         * Scrolls to a given position, animating using a fractal algorithm.
         * @method scrollTo
         * @param x {Number} Required. The x position to scroll to.
         * @param y {Number} Required. The y position to scroll to.
         * @param n {Number} Optional. The number of steps to take; default is 5.
         * @param ms {Number} Optional. The length of time to animate.
         * @param ease {Function} Optional. The easing function.
         * @static
         */
        scrollTo: function(x, y, n, ms, ease) {
            //noinspection UnnecessaryLocalVariableJS
            var offset = YD.getDocumentScroll(),
                steps = n || 5,
                i = steps,
                time = ms || 250,
                xdiff = x - offset.left,
                ydiff = y - offset.top,
                fx = ease ? ease : function(i) {
                    return Math.pow(2, i); // easing out; fast then slow
                };

            if (offset.left === x && offset.top === y) {return;} // no need to scroll

            clearInterval(_scrollIntervalId);
            _scrollIntervalId = setInterval(function() {
                i -= 1;
                var divisor = fx(i, steps);

                window.scroll(xdiff / divisor + offset.left, ydiff / divisor + offset.top);

                // last step
                if (0 === i) {
                    clearInterval(_scrollIntervalId);
                    window.scroll(x, y);
                }
            }, time / steps);
        },

		/**
		 * Scroll to the top of the page using the native window.scroll method and 0,0 coordinates.
		 * @method scrollTop
		 * @static
		 */
		scrollTop: function() {
			_that.scrollTo(0, 0);
		},

        /**
         * Find and replace the first text, or append a textnode when there is no textnode.
         * @method setFirstText
         * @param elem {String|Element} Required. A pointer or string reference to DOM element to set first text of.
         * @param text {String} Required. The text value to set.
         * @static
         */
        setFirstText: function(elem, text) {
            var node = $(elem);
            if (! node || ! YL.isDefined(text)) {return;}
            var tn = YD.findFirstText(node);

            if (tn) {
				tn.nodeValue = text;
			}
			else {
				//noinspection UnusedCatchParameterJS
				try {
					node.appendChild(DOC.createTextNode(text));
				}
				// appendChild doesn't work with certain elements, like 'var'
				catch (e) {
					YD.replace(node, text);
				}
			}
        },

        /* defined below */
        show: function() {_throwNotImplemented('show', 'yahoo.ext/lang.js');},

		/**
		 * Toggles the className for the provided element as a result of the boolean.
		 * @method toggleClass
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element apply class to.
		 * @param className {String} Required. The class name to apply.
		 * @param b {Boolean} Optional. Force class instead of toggle.
         * @return {Boolean} The class was added.
		 * @static
		 */
		toggleClass: function(elem, className, b) {
			var bool = YL.isUndefined(b) ? ! YD.hasClass(elem, className) : b;
			YD[bool ? 'addClass' : 'removeClass'](elem, className);
            return bool;
		},

		/**
		 * Hides displayed elements and shows non-displayed element.
		 * @method toggleDisplay
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to style.
		 * @param b {Boolean} Optional. Force display instead of toggle.
         * @return {Boolean} The class was added.
		 * @static
		 */
		toggleDisplay: function(elem, b) {
			return YD.toggleClass(elem, CLS.HIDE, YL.isUndefined(b) ? b : ! b);
		},

		/**
		 * Toggles the visibility of element.
		 * @method visibility
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to toggle style of.
		 * @param b {Boolean} Optional. Force visible instead of toggle.
         * @return {Boolean} The class was added.
		 * @static
		 */
		toggleVisibility: function(elem, b) {
			return YD.toggleClass(elem, CLS.HIDDEN, YL.isUndefined(b) ? b : ! b);
		}
    };

    YL.augmentObject(YD, _that);

    // backwards compatibility for 'getRegion', height/width added in YUI 2.7
    var bodyRegion = YD.getRegion(YD.getBodyElement());
    if (! bodyRegion.height) {
        YD.$old_getRegion = YD.getRegion;
        YD.getRegion = function() {
            var dim = YD.$old_getRegion.apply(this, arguments);
            dim.height = dim.bottom - dim.top;
            dim.width = dim.right - dim.left;
            return dim;
        };
    }

    // YAHOO.lang extensions are included
    if (YL.arrayWalk) {
        var _thatIfLangExtended = {

            /**
             * Creates and returns an html element and adds attributes from the hash.
             * @method createTag
             * @param tagName {String} Required. Tag name to create.
             * @param hash {Object} Optional. The hashtable of attributes, styles, and classes; defaults is empty object.
             * @return {Element} The newly created element; returns N otherwise.
             * @static
             */
            createTag: function(tagName, hash) {
                var node = YD.createNode(tagName);

                // iterate through the possible attributes
                YL.forEach(hash || {}, function(v, k) {
                    switch (k.toLowerCase()) {
                        case 'classname':
                        case 'class':
                        case 'cls':
                            YD.addClass(node, v);
                            break;

                        case 'cellpadding':
                            node.cellPadding = v;
                            break;

                        case 'cellspacing':
                            node.cellSpacing = v;
                            break;

                        case 'colspan':
                            node.colSpan = v;
                            break;

                        case 'src':
                        case 'checked':
                        case 'disabled':
                            // Capitolization is important in your hashtable for these to work properly in all browsers
                            node[k] = v;
                            break;

                        case 'rowspan':
                            node.rowSpan = v;
                            break;

                        case 'style':
                            // iterate on the styles and set them
                            YL.forEach(v, function(v, k) {
                                YD.setStyle(node, k, v);
                            });
                            break;

                        case 'innerhtml':
                        case 'text':
                            var text = ('' + v);

                            if (text.match(/<.*?>/) || text.match(/&.*?;/)) {
	                            YD.replace(node, text);
                            }
                            else {
	                            node.appendChild(DOC.createTextNode(text));
                            }
                                
                            break;

                        default:
                            node.setAttribute(k, v);
                            break;
                    }
                });

                return node || N;
            },

            /**
             * Returns the elements content as a float.
             * @method getContentAsFloat
             * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
             * @return {String} The innerHTML of the node as a float.
             * @static
             */
            getContentAsFloat: function(elem) {
                return parseFloat(YD.getContentAsString(elem));
            },

            /**
             * Returns the elements content as a integer.
             * @method getContentAsInteger
             * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
             * @return {String} The innerHTML of the node as a integer.
             * @static
             */
            getContentAsInteger: function(elem) {
                return parseInt(YD.getContentAsString(elem), 10);
            },

            /**
             * Returns the elements content.
             * @method getContentAsString
             * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
             * @return {String} The innerHTML of the node.
             * @static
             */
            getContentAsString: function(elem) {
                /*
                 * Returns the elements content of nodes as a string.
                 */
                var _getContentAsString = window.XMLSerializer ? function(nodes) { // mozilla
                    var xmlSerializer = new XMLSerializer(),
                        sb = [];

                    YL.arrayWalk(nodes, function(node, i) {
                        //noinspection NestedConditionalExpressionJS
                        sb[i] = (DOC.CDATA_SECTION_NODE === node.nodeType) ? node.nodeValue : xmlSerializer.serializeToString(node);
                    });

                    return sb.join('').replace(/(\<textarea[^\<]*?)\/\>/, '$1>&nbsp;</textarea>');
                } : function(nodes) { // IE
                    var sb = [];

                    YL.arrayWalk(nodes, function(node, i) {
                    //noinspection NestedConditionalExpressionJS,InnerHTMLJS
                        sb[i] = (YD.isTextNode(node)) ? node.nodeValue : node.xml || node.innerHTML;
                    });

                    return sb.join('').replace(/\/?\>\<\/input\>/gi, '\/>'); // IE tends to insert a bogus "</input>" element instead of understanding empty closure "<input ... />"
                };

                YD.getContentAsString = function(elem) {
                    var parentNode = YD.get(elem);

                    if (! parentNode || ! parentNode.childNodes.length) {return '';}

                    if (YD.isTextNode(parentNode.firstChild) && 1 === parentNode.childNodes.length) {
                        return parentNode.firstChild.nodeValue;
                    }
                    else {
                        return _getContentAsString(parentNode.childNodes);
                    }
                };

                return YD.getContentAsString(elem);
            },

			/**
			 * Hides any number of elements using class 'hide'; doesn't attempt to correct "display:none", designers should use a class to apply display instead.
			 * @method hide
			 * @param arg1 {String|Element} Required. Pointer or string reference to DOM element to style.
			 * @param argX {String|Element} Optional. Additional pointers or string references to DOM element to style.
			 * @static
			 */
			hide: function(arg1, argX) {
				YL.arrayWalk(arguments, function(elem) {
					YD.addClass(elem, CLS.HIDE);
				});
			},

            /**
             * Tests if the node has the same type as those included in arguments 2+.
             * @method isElementType
             * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
             * @param arg1 {Number} Required. A node type to compare with.
             * @param argX {Number} Optional. Additional node types to compare with.
             * @return {Boolean} True when the DOM node attribute nodeType is included in the arguments.
             * @static
             *
             * Example:
             * isElementType(domNode, document.ELEMENT_NODE, document.ATTRIBUTE_NODE, document.TEXT_NODE);
             */
            isElementType: function(elem, arg1, argX) {
                var node = $(elem);
                if (! (node && node.nodeType)) {return F;}

                return YL.arrayWalk(arguments, function(nodetype) {
                    if (node.nodeType === nodetype) {return T;}
                });
            },

            /**
             * Tests if the node has the same tag name as those included in arguments 2+.
             * @method isTagName
             * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
             * @param arg1 {String} Required. A node name to compare with.
             * @param argX {String} Optional. Additional node names to compare with.
             * @return {Boolean} True when the DOM node attribute nodeName is included in the arguments.
             * @static
             *
             * Example:
             * isTagName(domNode, 'div', 'input', 'div');
             */
            isTagName: function(elem, arg1, argX) {
                var tagName = YD.getTagName(elem);                
                if (! tagName) {return F;}

                return YL.arrayWalk(arguments, function(tagname) {
                    if (tagName === tagname) {return T;}
                });
            },

			/**
			 * Tests if the node is displayed and visible.
			 * @method isVisible
			 * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
			 * @param ignoreVis {Boolean} Required. True, when you don't care about visibility.
			 * @return {Boolean} True when displayed.
			 * @static
			 */
			isVisible: function(elem, ignoreVis) {
				var node = $(elem);

				if (node && node.style) {
					if (YD.hasClass(node, CLS.HIDE) || 'none' === YD.getStyle(node, 'display')) {return F;}
					if (node.type && 'hidden' === node.type) {return F;}
					return Boolean.get(ignoreVis || ! (YD.hasClass(node, CLS.HIDDEN) || 'hidden' === node.style.visibility));
				}

				return F;
			},

			/**
			 * Show any number of elements removing class 'hide'.
			 * @method show
			 * @param arg1 {String|Element} Required. Pointer or string reference to DOM element to style.
			 * @param argX {String|Element} Optional. Additional pointers or string references to DOM element to style.
			 * @static
			 */
			show: function(arg1, argX) {
				YL.arrayWalk(arguments, function(node) {
					YD.removeClass(node, CLS.HIDE);
				});
			}
		};
		
		YL.augmentObject(YD, _thatIfLangExtended, T);
	}

    // extend helper methods requiring yahoo/animation.js
    if (YU.Anim) {
        var _thatIfAnim = {

            /**
             * Removes a node from the DOM, using a fading animation and clearning all events.
             * @method animate
             * @param elem {String|Element} Required. Pointer or string reference to DOM element to delete.
             * @param obj {Object} Optional. The animation object data; default will fade opacity from 1 to 0.25.
             * @param dur {Number} Optional. The duration of the animation; default is 0.5s.
             * @param ease {Object} Optional. The easing method; default is easeOut.
             * @param functions {Array} Optional. A collection of animation event callback functions {id: the event, fx: callback function}.
             * @return {Object} YAHOO animation object.
             * @static
             */
            animate: function(elem, obj, dur, ease, functions) {
                var node = $(elem),
                    cfg = {
                    duration: dur || 0.5,
                    ease: ease || YU.Easing.easeOut,
                    obj: obj || {opacity: {from: 1, to: 0.25}}
                },
                    fxs = functions || [],
                    anim = new YU.Anim(node, cfg.obj, cfg.duration, cfg.ease);

                // functions are provided
                if (fxs.length) {
                    for (var i = 0; i < fxs.length; i += 1) {
                        var o = fxs[i];
                        if (anim[o.id]) {anim[o.id].subscribe(o.fx);}
                    }
                }

                anim.animate();
                return anim;
            }
        };

        YL.augmentObject(YD, _thatIfAnim, T);
    }

    // extend helper methods requiring native-ext/array.js
    var _augmentDomWithArrayMethods = function() {

        var _thatIfArray = {

			/**
			 * Wraps the native getElementsByTagName method, converting the nodelist to an Array object.
			 * @method getElementsByTagName
			 * @param tagName {String} Required. The DOM node tag to search for.
			 * @param elem {String|Element} Required. Pointer or string reference to DOM element to search.
			 * @return {NodeList} The collection of nodes.
			 * @static
			 */
			getElementsByTagName: function(tagName, elem) {
				var node = $(elem);
				if (! node) {return N;}
				return Array.get(node.getElementsByTagName(tagName));
			}
        };

        YL.augmentObject(YD, _thatIfArray, T);
    };

    if (Array.get) {
        _augmentDomWithArrayMethods();
    }
    else {
        YD.augmentWithArrayMethods = function() {
            _augmentDomWithArrayMethods();
            delete YD.augmentWithArrayMethods;
        };
    }
})();/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.03
 */

/**
 * Extending YAHOO.util.Event.
 * @class Event
 * @namespace YAHOO.util
 * @static
 */
(function() {
    var _YL = YAHOO.lang,
        _YE = YAHOO.util.Event,
        _YK = YAHOO.util.KeyListener.KEY;

    if (! _YE) {_YL.throwError.call(this, _YL.ERROR_NOT_DEFINED, 'YAHOO.util.Event', 'extend', 'yahoo-ext/event.js');}

    var _throwNotImplemented = _YL.throwError ? function() {
		_YL.throwError.call(this, _YL.ERROR_NOT_IMPLEMENTED, 'YAHOO.util.Dom', arguments);
	}: function(text) {throw(text);};

    _YE.throwErrors = true;

    var _that = {

        /**
         * An alias for YAHOO.util.Event.removeListener.
         * @method off
         * @see YAHOO.util.Event.removeListener
         */
        off: _YE.removeListener,

        /**
         * Adds a listener to input that checks keydown events for keycode, then calls the appropriately scoped function, passing the event.
         * @method addKeyListener
         * @param attachTo {Element} Required. Pointer or string reference to DOM input element to listen on.
         * @param keycodes {Array} Required. A collection of desired keycodes.
         * @param callback {Function} Required. The callback function.
         * @param scope {Object} Optional. The execution scope of callback function.
         * @param correctScope {Boolean} Optional. True, if you want to correct the scope of callback.
         * @static
         */
        addKeyListener: function(attachTo, keycodes, callback, scope, correctScope) {
            var kl = new YAHOO.util.KeyListener(attachTo, keycodes, {fn: callback, scope: scope ? scope: window, correctScope: correctScope});
            kl.enable();
            return kl;
        },

        /**
         * Adds a listener to input that checks keypress events for enter, then
         *  calls the appropriate function or method. (pass the window into obj for functions).
         * @method addEnterListener
         * @param attachTo {Element} Required. Pointer or string reference to DOM input element to listen on.
         * @param callback {Function} Required. The callback function.
         * @param scope {Object} Optional. The execution scope of callback function.
         * @static
         */
        addEnterListener: function(attachTo, callback, scope) {
            return _YE.addKeyListener(attachTo, {keys: _YK.ENTER}, callback, scope);
        },

        /**
         * Adds a listener to input that checks keypress events for escape, then
         *  calls the appropriate function or method. (pass the window into obj for functions).
         * @method addEscapeListener
         * @param attachTo {Element} Required. Pointer or string reference to DOM input element to listen on.
         * @param callback {Function} Required. The callback function.
         * @param scope {Object} Optional. The execution scope of callback function.
         * @static
         */
        addEscapeListener: function(attachTo, callback, scope) {
            return _YE.addKeyListener(attachTo, {keys: _YK.ESCAPE}, callback, scope);
        },

        /**
         * Retrieves the {x, y} coordinates of an event.
         * @method getMousePosition
         * @param e {Event} Required. The triggered JavaScript event; any mouse event.
         * @return {Object} Where x = x coordinate and y = y coordinate of event.
         * @static
         */
        getMousePosition: function(e) {
            return {x:_YE.getPageX(e), y:_YE.getPageY(e)};
        },

        /* defined below */
		simulateClick: function() {_throwNotImplemented('simulateClick', 'yahoo.ext/lang.js');},

        /* defined below */
		simulateEvent: function() {_throwNotImplemented('simulateEvent', 'yahoo.ext/lang.js');}
    };

    _YL.augmentObject(_YE, _that);

    // YAHOO.lang extensions are included
    if (_YL.arrayWalk) {
        var _thatIfLangExtended = {

            /**
             * Simulates a click event on an element. Will iterate up the DOM tree until the root is reached or node becomes undefined.
             * @method simulateClick
             * @param elem {Element} Required. The element to click on.
             * @param rt {Element} Optional. The ancestor to stop on; default is document.
             * @static
             */
            simulateClick: function(elem, rt) {
                _YE.simulateEvent(elem, 'click', rt);
            },

            /**
             * Simulates an event on an element. Will iterate up the DOM tree until the root is reached or node becomes undefined.
             * @method simulateEvent
             * @param node {Element} Required. The element to click on.
             * @param eventType {String} Required. The event type to fire.
             * @param rt {Element} Optional. The ancestor to stop on; default is document.
             * @static
             */
            simulateEvent: function(node, eventType, rt) {
                var root = rt || document,
                    searchNode = node;

                // iterate up the DOM tree
                while (searchNode && root !== searchNode) {
                    var listeners = _YE.getListeners(searchNode, eventType),
						cancelBubble = false;

                    // node has listeners
                    if (listeners && listeners.length) {
                        // iterate on those listeners
                        _YL.arrayWalk(listeners, function(o) {
							var emulatedEvent = {target: node};
                            o.fn.call(o.adjust ? o.scope : this, emulatedEvent, o.obj); // execute function
							cancelBubble = emulatedEvent.cancelBubble;
                        });
                    }

					if (cancelBubble) {break;}

                    searchNode = searchNode.parentNode;
                }
            }
        };

        _YL.augmentObject(_YE, _thatIfLangExtended, true);
    }
})();/*
 * Copyright (c) 2009, Matt Snider, LLC All rights reserved.
 * Version: 1.0.01
 */

/**
 * The Form module provides helper methods for manipulating Form elements.
 * @module form
 * @title form Utility
 */

// Only use first inclusion of this class.
if (! YAHOO.util.Form) {

/**
 * Provides helper methods for Form elements.
 * @class Form
 * @namespace YAHOO.util
 * @static
 */
(function() {
    var _YL = YAHOO.lang,
        _YD = YAHOO.util.Dom;

    if (! _YD) {_YL.throwError.call(this, _YL.ERROR_NOT_DEFINED, 'YAHOO.util.Dom', 'extend', 'yahoo-ext/form.js');}
    if (! _YL.arrayWalk) {_YL.throwError.call(this, _YL.ERROR_NOT_IMPLEMENTED, 'YAHOO.util.Form', '', 'yahoo-ext/lang.js');}

    var _YF = YAHOO.namespace('util.Form'),
        $ = _YD.get;

	// static namespace
    var _that = {

        /**
         * Removes all values from form fields.
         * @method clear
         * @param elem {String|Element} Required. Pointer or string reference to DOM element to search.
         * @param iTypes {Array} Optional. An array of input types to ignore.
         * @static
         */
        clear: function(elem, iTypes) {
            var form = $(elem),
                ignoreTypes = Array.is(iTypes) ? iTypes : [];

            var fx = function(fld) {
                // IE 7 will insert some elements without a type; then test if the node type is supposed to be ignored.
                var type = _YF.Element.getType(fld);

                if (type && -1 === ignoreTypes.indexOf(type)) {
                    _YF.Element.clear(fld);
                }
            };

            _YL.arrayWalk(form.getElementsByTagName('input'), fx);
            _YL.arrayWalk(form.getElementsByTagName('textarea'), fx);
            _YL.arrayWalk(form.getElementsByTagName('select'), function(fld) {
                _YF.Element.clear(fld);
            });
        },

        /**
         * Disables the form and all it's serializable elements.
         * @method disable
         * @param elem {String|Element} Required. Pointer or string reference to DOM element to search.
         * @static
         */
        disable: function(elem) {
            var form = $(elem);
            form.disabled = 'true';
            _YL.arrayWalk(_YF.getFields(form), _YF.Element.disable);
        },

        /**
         * Enables the form and all it's serializable elements.
         * @method enable
         * @param elem {String|Element} Required. Pointer or string reference to DOM element to search.
         * @static
         */
        enable: function(elem) {
            var form = $(elem);
            form.disabled = '';
            _YL.arrayWalk(_YF.getFields(form), _YF.Element.enable);
        },

		/**
		 * Retrieves the first non-hidden element of the form.
		 * @method findFirstElement
	     * @param elem {String|Element} Required. Pointer or string reference to DOM element to search.
		 * @param iTypes {Array} Optional. An array of input types to ignore; default is 'hidden'.
		 * @return {Element} The first field not of the ignored types or NULL.
		 * @static
		 */
		findFirstElement: function(elem, iTypes) {
			return _YL.arrayWalk(_YF.getFields(elem, '', iTypes), function(fld) {
				return fld;
			});
		},

		/**
		 * Retrieves the first non-hidden element of the form and focuses on it.
		 * @method focusFirstElement
	     * @param elem {String|Element} Required. Pointer or string reference to DOM element to search.
		 * @param iTypes {Array} Optional. An array of input types to ignore; default is 'hidden'.
		 * @static
		 */
		focusFirstElement: function(elem, iTypes) {
			_YF.Element.focus(_YF.findFirstElement(elem, iTypes || ['hidden']));
		},

		/**
		 * Retrieves all serializable elements of the form; sorts them top to bottom, left to right by defualt.
		 *  note: DOM iterating is faster than using getElementsByTagName("*")
		 * @method getFields
	     * @param elem {String|Element} Required. The pointer or string reference to DOM Form element.
	     * @param fldName {String} Optional. A name to filter by.
		 * @param iTypes {Array} Optional. List of element types to ignore; default is hidden.
		 * @return {Array} A collection of Form fields.
		 * @static
		 */
		getFields: function(elem, fldName, iTypes) {
			var form = $(elem),
				set = [];

			if (! form) {return set;}
            var ignoreTypes = _YL.isArray(iTypes) ? iTypes : [];

			// should be redefined each time, because of closure on 'set'
			var fn = function(nodes) {
				for (var i = 0; i < nodes.length; i += 1) {
					var fld = nodes[i],
                        tagName = _YD.getTagName(fld),
                        isValidTag = ('input' === tagName || 'textarea' === tagName || 'select' === tagName),
                        isValidName = (! fldName || fldName === fld.name);

					if (isValidTag && isValidName && -1 === ignoreTypes.indexOf(_YF.Element.getType(fld))) {
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
	     * @param elem {String|Element} Required. Pointer or string reference to DOM element to search.
		 * @param typeName {String}	Optional. The type of input to filter by.
	     * @param name {String} Optional. The name to filter by.
		 * @param multi {Boolean} Optional. True, when mulitple elements use this name.
		 * @static
		 */
		getInputs: function(elem, typeName, name, multi) {
			var form = $(elem);
			if (! multi && name && form[name]) {return [form[name]];} // fast return for DOM compliant browsers, when name is provided; may cause issue if name is something like 'parentNode'
			var fields = form.getElementsByTagName('input');

			if (! (_YL.isString(typeName) || _YL.isString(name)) && Array.get) {return Array.get(fields);}

			var matches = [];
			_YL.arrayWalk(fields, function(fld) {
				if ((typeName && _YF.Element.getType(fld) !== typeName) || (name && fld.name !== name)) {return;}
				matches.push(fld);
			});

			return matches;
		},

		/**
		 * Serializes the form into a query string, collection &key=value pairs.
		 * @method serialize
	     * @param elem {String|Element} Required. The pointer or string reference to DOM Form element.
	     * @return {String} The serialized form.
		 * @static
		 */
		serialize: function(elem) {
			var queryComponents = [];

			_YL.arrayWalk(_YF.getFields(elem), function(fld) {
				var qc = _YF.Element.serialize(fld);
				if (qc) {queryComponents.push(qc);}
			});

			return queryComponents.join('&');
		},

		/**
		 * Enables the value of the field.
		 * @method toggleEnabled
	     * @param elem {String|Element} Required. Pointer or string reference to DOM element to enable fields of.
		 * @param b {Boolean} Optional. True, when enabling, falsy to disable.
		 * @static
		 */
		toggleEnabled: function(elem, b) {
            var form = $(elem);
            
            if (form) {
                var bool = _YL.isUndefined(b) ? ! form.disabled : b;
                _YF[bool ? 'enable' : 'disable'](form);
            }
        }
    };

    _YL.augmentObject(_YF, _that);
})();

}/*
 * Copyright (c) 2009, Matt Snider, LLC All rights reserved.
 * Version: 1.0.02
 */

// Only use first inclusion of this class.
if (! YAHOO.util.Form.Element) {

/**
 * These Form utility functions are thanks in a large part to the Prototype group. I have modified them to improve
 * 	performance, remove redundancy, and get rid of the magic array crap. Use these functions to work with forms fields.
 * @class Element
 * @namespace YAHOO.util.Form
 * @static
 */
(function() {
    var _YL = YAHOO.lang,
        _YD = YAHOO.util.Dom,
        _YE = YAHOO.util.Event,
        _YF = YAHOO.util.Form;

    if (! _YD) {_YL.throwError.call(this, _YL.ERROR_NOT_DEFINED, 'YAHOO.util.Dom', 'implement', 'yahoo-ext/form.js');}
    if (! _YF) {_YL.throwError.call(this, _YL.ERROR_NOT_DEFINED, 'YAHOO.util.Form', 'implement', 'yahoo-ext/form.js');}
    if (! _YL.arrayWalk) {_YL.throwError.call(this, _YL.ERROR_NOT_IMPLEMENTED, 'YAHOO.util.Form', '', 'yahoo-ext/lang.js');}

    var _throwNotImplemented = _YL.throwError ? function() {
		_YL.throwError.call(this, _YL.ERROR_NOT_IMPLEMENTED, 'YAHOO.util.Form', arguments);
	}: function(text) {throw(text);};

    var _YFE = YAHOO.namespace('util.Form.Element'),
        $ = _YD.get;

    var _that = {

        attachFocusAndBlur: function() {_throwNotImplemented('attachFocusAndBlur', 'YAHOO.util.Event');},

        /**
		 * Short-cut method to do a browser safe check on any HTMLInputElement of type checkbox (possibly radio too).
		 * @method check
		 * @param elem {String|Element} Required. Pointer or string reference to checkable DOM element.
		 * @param fl {Boolean} Required. True when checkbox should be checked.
		 * @param doNotChangeValue {Boolean} Optional. True, when we should not change values.
		 * @static
		 */
		check: function(elem, fl, doNotChangeValue) {
			var node = $(elem);

			// node exists
			if (node) {
                var type = _YFE.getType(node);
                
                // node is of a valid type
				if ('checkbox' === type || 'radio' === type) {
					// if this check isn't in place Safari & Opera will check false
					if (node.checked != fl) { // do not make strict
						try {
							node.checked = fl;
							if (node.setAttribute) {node.setAttribute('checked', fl);} // insurance against some browser issues
						}
						catch (ex) {
							if (ex) {
								// squelch exception thrown by IE 8
							}
						}
						if ('checkbox' === type && ! doNotChangeValue) {node.value = fl ? 'on' : 'off';} // required for Safari, don't change value of radios
					}
				}
				// not of a valid type
				else {
					throw('Attempting to check the wrong node type: ' + type + '.');
				}
			}
			// node does not exist
			else {
				throw('Attempting to check a non-existant node.');
			}
		},

		/**
		 * Resets the value of the field.
		 * @method clear
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to clear.
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
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to disable.
		 * @static
		 */
		disable: function(elem) {
			var fld = $(elem);
			_YD.addClass(fld, C.HTML.CLS.DISABLED);
			fld.disabled = 'true';
		},

		/**
		 * Enables the value of the field.
		 * @method enable
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to enable.
		 * @static
		 */
		enable: function(elem) {
			var fld = $(elem);
			fld.disabled = '';
			_YD.removeClass(fld, C.HTML.CLS.DISABLED);
		},

		/**
		 * Focuses on the field.
		 * @method focus
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to enable.
		 * @param select {Boolean} Optional. True when text should be selected; may not be possible, but will attempt.
		 * @param i {Number} Optional. The recursion counter, should be managed by this function.
		 * @static
		 */
        focus: function(elem, select, i) {
			var nodeFocus = function(node, select, i) {
				if (node) {
					try {
						if (node.focus) {
                            // 'simulateClick' fucntion exist, go ahead and simulate that the field was clicked into
                            if (_YE.simulateClick) {
                                var tagName = _YD.getTagName(node), isCheckable, isClickable;

                                // some input types need special logic
                                if ('input' === tagName) {
                                    var type = _YFE.getType(node);
                                    isCheckable = 'checkbox' === type || 'radio' === type,
                                    isClickable = 'button' === type || 'submit' === type || 'image' === type || 'reset' === type;
                                }
        
                                // don't simulate clicks on checkable and clickable elements
                                if (! (isCheckable || isClickable)) {_YE.simulateClick(node);}
                            }

                            node.setAttribute('autocomplete', 'off'); // this fixes possible "Permission denied to set property XULElement.selectedIndex ..." exception
							node.focus();
						}
						if (node.select && select) {node.select();}
					}
					catch (e) {
						if (e.message && -1 < ('' + e.message).indexOf("object doesn't support")) {return;} // squelch
						if (e && 10 > i) {
							setTimeout(function() {nodeFocus(node, select, i + 1);}, 250); // timeout, hopefully will catch IE exceptions
						}
						// taking too long, after 2.5s stop process
						else {
							// do nothing for now, just stop recursion
						}
					}
				}
			};

			_YFE.focus = function(elem, select, i) {
				var node = $(elem);
				if (! node) {return;}

                var dim = _YD.getRegion(node),
					execN = 0 < i ? i : 0;

                if (10 < execN) {return;} // stop recursion

				// element only has dimensions when it is visible
				if ('hidden' === node.type || ! (dim.width || dim.height)) {
					setTimeout(function() {_YFE.focus(node, select, i);}, 250); // timeout, hopefully will catch IE exceptions
				}
				else { // has layout
					nodeFocus(node, select, 0);
//					alert(node.outerHTML + ' | width: ' + dim.width + ' | height: ' + dim.height + ' | type: ' + node.type + ' | bool: ' + ! (dim.width || dim.height));
				}

				return node;
			};

			return _YFE.focus(elem, select, i);
        },

        /**
		 * Attempt to find the type attribute of the element.
		 * @method getType
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
		 * @return {String} The type or empty string.
		 * @static
		 */
		getType: function(elem) {
			var fld = $(elem);
			if (! (fld || fld.type || fld.getAttribute)) {return '';}
			return (fld.type || fld.getAttribute('type') || '').toLowerCase();
		},

		/**
		 * Attempt to find the value of field.
		 * @method getValue
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
		 * @return {String} The field value or empty string.
		 * @static
		 */
		getValue: function(elem) {
			var fld = $(elem),
                method = _YD.getTagName(fld);

			//	missing element is the most common error when serializing; also don't serialize validators
			if (! method) {return '';}

			var parameter = _YFE.Serializers[method](fld);
			if (parameter) {return parameter[1];}
		},

        /**
         * Tests if the element is a checkbox or radio.
         * @method isCheckable
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
	     * @return {Boolean} The input is type checkbox or radio.
		 * @static
         */
        isCheckable: function(elem) {
            return _YFE.isType(elem, 'checkbox', 'radio');
        },

        /**
		 * Tests if the field has changed from the default.
		 * @method isChanged
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
	     * @return {Boolean} The field has changed.
		 * @static
         */
        isChanged: function(elem) {
            var fld = $(elem);
            if (! fld) {return false;}

            if (_YFE.isCheckable(fld)) {
                return fld.defaultChecked !== fld.checked;
            }
            else {
                return fld.defaultValue !== fld.value;
            }
        },

        /**
		 * Tests if the field has a value.
		 * @method isSet
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
	     * @return {Boolean} The field is empty or non-existing.
		 * @static
		 */
		isSet: function(elem) {
			return '' !== _YFE.getValue(elem);
		},

        /**
         * Tests if the element is a type text, password, or a textarea.
         * @method isText
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
	     * @return {Boolean} The element is type text or password or is a textarea.
		 * @static
         */
        isText: function(elem) {
            var tagName = _YD.getTagName(elem);
            return 'textarea' === tagName || _YFE.isType(elem, 'text', 'password');
        },

        /**
         * Tests if the field is one of the provided types.
         * @method isType
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
		 * @param arg1 {String} Required. A type to evaluate.
		 * @param argX {String} Required. Aditional types to evaluate.
	     * @return {Boolean} The field is one of the provided types.
		 * @static
         */
        isType: function(elem, arg1, argX) {
            var type = _YFE.getType(elem);
            if (! type) {return false;}

            return _YL.arrayWalk(arguments, function(t) {
                if (type === t) {return true;}
            });
        },

        /**
		 * Serializes the form into a key value pair query string.
		 * @method serialize
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to evaluate.
	     * @return {string} the key/value pairs as a query string.
		 * @static
		 */
		serialize: function(elem) {
			var fld = $(elem),
                method = _YD.getTagName(fld);

			//	missing element is the most common error when serializing; also don't serialize validators
			if (! method) {return '';}

			var parameter = _YFE.Serializers[method](fld);

			if (parameter) {
				var key = encodeURIComponent(parameter[0]);
				if (0 === key.length) {return '';}
				if (! _YL.isArray(parameter[1])) {parameter[1] = [parameter[1]];}

				_YL.arrayWalk(parameter[1], function(value, i) {
					parameter[1][i] = key + '=' + encodeURIComponent(value);
				});

				return parameter[1].join('&');
			}
		},

		/**
		 * Enables the value of the field.
		 * @method toggleEnabled
	     * @param elem {String|Element} Required. Pointer or string reference to DOM Form field element to enable.
		 * @param b {Boolean} Optional. True, when enabling, falsy to disable.
		 * @static
		 */
		toggleEnabled: function(elem, b) {
            var node = $(elem);

            if (node) {
                var bool = _YL.isUndefined(b) ? ! node.disabled : b;
                _YFE[bool ? 'enable' : 'disable'](node);
            }
		}
    };

    _YL.augmentObject(_YFE, _that);

    // YAHOO.json extensions are included
    if (_YE) {

        /**
		 * Updates the onblur and onclick events of the element to show default text.
		 * @method onFocusAndBlur
		 * @param elem {String|Element} Required. Pointer or string reference to DOM element to attach events to.
		 * @param text {String} Required. The default text.
		 * @param c {String} Optional. The color to set default text to.
		 * @static
		 */
        _YFE.attachFocusAndBlur = function(elem, text, c) {
			var fld = $(elem);

			// validate
	        if (fld) {
		        if (! ('text' === _YFE.getType(fld) || 'textarea' === _YD.getTagName(fld))) {
					throw('YAHOO.util.Form.Element.attachFocusAndBlur() Exception - invalid field type for type: ' + _YFE.getType(fld));
				}
	        }
	        else {
		        return;
	        }

			var color = c || '#999',
				oColor = fld.style.color || '#000';

			// function that resets to the default
			var update = function(fld, text, color) {
				fld.value = text;
				fld.style.color = color;
			};

			// on focus clear value if equal to default
			_YE.on(fld, 'focus', function(e, fld) {
				if (e && text === _YFE.getValue(fld).trim()) {
					update(fld, '', oColor);
				}
			}, fld);

			// onblur reset default if no value entered
			_YE.on(fld, 'blur', function(e, fld) {
				if (e && ! _YFE.getValue(fld).trim()) {update(fld, text, color);}
			}, fld);

			// update the initial state if needed
			var val = _YFE.getValue(fld).trim();
			if (text === val || '' === val) {update(fld, text, color);}
		};
    }
})();

}/*
 * Copyright (c) 2009, Matt Snider, LLC All rights reserved.
 * Version: 1.0.01
 */

// Only use first inclusion of this class.
if (! YAHOO.util.Form.Element.Serializers) {

/**
 * These Form utility functions are thanks in a large part to the Prototype group. I have modified them to improve
 * 	performance, remove redundancy, and get rid of the magic array functionality.
 * @class Serializers
 * @namespace YAHOO.util.Form.Element
 * @static
 */
(function() {
    var _YL = YAHOO.lang,
        _YD = YAHOO.util.Dom,
        _YF = YAHOO.util.Form,
        _YFE = YAHOO.util.Form.Element;

    if (! _YD) {_YL.throwError.call(this, _YL.ERROR_NOT_DEFINED, 'YAHOO.util.Dom', 'implement', 'yahoo-ext/form.js');}
    if (! _YF) {_YL.throwError.call(this, _YL.ERROR_NOT_DEFINED, 'YAHOO.util.Form', 'implement', 'yahoo-ext/form.js');}
    if (! _YFE) {_YL.throwError.call(this, _YL.ERROR_NOT_DEFINED, 'YAHOO.util.Form.Element', 'implement', 'yahoo-ext/form.js');}
    if (! _YL.arrayWalk) {_YL.throwError.call(this, _YL.ERROR_NOT_IMPLEMENTED, 'YAHOO.util.Form', '', 'yahoo-ext/lang.js');}

    var _YFS = YAHOO.namespace('util.Form.Element.Serializers');
    
    var _that = {

        /**
         * Finds the value of a checkbox/radio input element.
         * @method input
         * @param element {String|Element} Required. The input node.
         * @return {Array} The name/value pairs.
         * @static
         */
        input: function(element) {		
            switch (_YFE.getType(element)) {
                case 'checkbox':
                case 'radio':
                    return _YFS.inputSelector(element);
                default:
                    return _YFS.textarea(element);
            }
        },

        /**
         * Finds the value of a checkbox/radio input element.
         * @method inputSelector
         * @param element {String|Element} Required. The input node.
         * @return {Array} The name/value pairs.
         * @static
         */
        inputSelector: function(element) {
            if (element.checked) {
                return [element.name, element.value];
            }
        },

        /**
         * Finds the value of a select-one element.
         * @method textarea
         * @param element {String|Element} Required. The select node.
         * @return {Array} The name/value pairs.
         * @static
         */
        textarea: function(element) {
            return [element.name, element.value];
        },

        /**
         * Finds the value of a select tag element.
         * @method select
         * @param element {String|Element} Required. The select node.
         * @return {Array} The name/value pairs.
         * @static
         */
        select: function(element) {
            return _YFS['select-one' === _YFE.getType(element) ? 'selectOne' : 'selectMany'](element);
        },

        /**
         * Finds the value of a select-one element.
         * @method selectOne
         * @param element {String|Element} Required. The select node.
         * @return {Array} The name/value pairs.
         * @static
         */
        selectOne: function(element) {
            var value = '', opt, index = element.selectedIndex;
            if (0 <= index) {
                opt = element.options[index];
                value = opt.value || opt.text;
            }
            return [element.name, value];
        },

        /**
         * Finds the value of a select-many element.
         * @method selectMany
         * @param element {String|Element} Required. The select node.
         * @return {Array} The name/value pairs.
         * @static
         */
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

    _YL.augmentObject(_YFS, _that);
})();

}/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.02
 */

/**
 * The Array utility extends the native JavaScript Array Object with additional methods and objects.
 * @class Array
 */
(function() {
    var _YL = YAHOO.lang;

    var _that = {

        /**
         * Converts the provided Object into an array, ensure it is not an array-like object.
         * @method get
         * @param o {Object} Required. An array or array-like object.
         * @return {Array} The provided object as an Array.
         * @static
         */
        get: function(o) {
            var data = (o && o.length) ? o : []; // defaults to Array when passed nothing or crap

            if (_YL.isArray(data)) {
                return data;
            }
            else {
                var arr;

                try {
                    arr = Array.prototype.slice.call(data, 0);
                }
                catch (e) {
                    if (! e) {return [];}
                    arr = [];

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
            return _YL.isArray(o);
        }
        
    };

	_YL.augmentObject(Array, _that);
})();

/**
 * The Array utility extends the native JavaScript Array Object prototype with additional methods.
 * @class Array
 * @namespace Window
 * @extends Array
 * @dependencies YAHOO.lang
 */
(function() {
    var _YL = YAHOO.lang,
        _YD = YAHOO.util.Dom;

    var _throwNotImplemented = _YL.throwError ? function() {
		_YL.throwError.call(this, _YL.ERROR_NOT_IMPLEMENTED, 'Array.prototype', arguments);
	}: function(text) {throw(text);};

    var _that = {

        /**
         * The number current position of the pointer. Should be considered private, even though it is attached to the prototoype.
         * @property _pointer
         * @type Number
         * @const
         * @public
         */
        _pointer: 0,

        /* defined below */
        batch: function() {_throwNotImplemented('batch', 'yahoo.ext/lang.js');},

        /* defined below */
        compact: function() {_throwNotImplemented('compact', 'yahoo.ext/lang.js');},

        /* defined below */
        contains: function() {_throwNotImplemented('contains', 'yahoo.ext/lang.js');},

        /* defined below */
        copy: function() {_throwNotImplemented('copy', 'yahoo.ext/lang.js');},

        /**
         * Returns the element currently pointed to.
         * @method current
         * @returrn {Object} The object in 'this' at pointer.
         * @public
         */
        current: function() {
            return this[this._pointer];
        },

        /* defined below */
        equals: function() {_throwNotImplemented('equals', 'yahoo.ext/lang.js');},

        /* defined below */
        forEach: function() {_throwNotImplemented('forEach', 'yahoo.ext/lang.js');},

        /**
         * Returns the first element in the Array or Undefined.
         * @method first
         * @return {Object} The first element in array.
         * @public
         */
        first: function() {
            return this[0];
        },

        /* defined below */
        indexOf: function() {_throwNotImplemented('indexOf', 'yahoo.ext/lang.js');},

        /**
         * Returns the last element in the Array or Undefined.
         * @method last
         * @return {Object} The last element in array.
         * @public
         */
        last: function() {
            return (this.length) ? this[this.length - 1] : undefined;
        },

        /* defined below */
        lastIndexOf: function() {_throwNotImplemented('lastIndexOf', 'yahoo.ext/lang.js');},

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

        /* defined below */
        removeIndex: function() {_throwNotImplemented('removeIndex', 'yahoo.ext/lang.js');},

        /* defined below */
        removeValue: function() {_throwNotImplemented('removeValue', 'yahoo.ext/lang.js');},

        /**
         * Resets the Array pointer to the first position.
         * @method reset
         * @public
         */
        reset: function() {
            this._pointer = 0;
        },

        /* defined below */
        toJsonString: function() {_throwNotImplemented('toJsonString', 'yahoo.ext/lang.js');},

        /* defined below */
        unique: function() {_throwNotImplemented('unique', 'yahoo.ext/lang.js');},

        /* defined below */
        walk: function() {_throwNotImplemented('walk', 'yahoo.ext/lang.js');}
    };

    _YL.augmentObject(Array.prototype, _that);

    // YAHOO.lang extensions are included
    if (_YL.arrayWalk) {
        var _thatIfArrayWalk = {

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
                this.walk(function(o, k) {
                    if (_YL.isDefined(o)) {
                        if (compress && _YL.isNumber(k)) {
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
	            return -1 < this.indexOf(val, strict);
            },

            /**
             * Returns a new Array object with the same keys/values as current Array.
             * @method copy
             * @return {ModelArray} The copy of this.
             * @public
             */
            copy: function() {
                var arr = [];
                this.walk(function(o, k) {arr[k] = o;});
                return arr;
            },

            /**
             * Compares the objects for equality, defeats javascript objects compare by reference.
             * @method Equals
             * @param compare {Array} Required. An object to compare to with.
             * @return {Boolean} True, when values in object and array are equal.
             * @public
             */
            equals: function(compare) {
                if (this.length !== compare.length) {return false;}
                if (! this.length) {return true;}
                var isEqual = true;

                this.walk(function(o, i) {
                    isEqual &= o === compare[i];
                });

                return isEqual;
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
                var t1 = this.walk(function(o, i) {
                    return (o === val) || (! strict && o == val) ? i : null;
                });
                return _YL.isNumber(t1) ? t1 : -1;
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
             * Remove the member at index (i) in the array; does not modify the original array.
             * @method removeIndex
             * @param n {Number} Required. The index to remove.
             * @return {Object} The new Array or Original.
             * @public
             */
            removeIndex: function(n) {
                if (0 > n || n >= this.length) {return this;} // invalid index
                var resp = this.slice(0, n),
                    rest = this.slice(n + 1);
                return resp.concat(rest);
            },

            /**
             * Finds the object in the array and removes it; does not modify the original array.
             * @method removeValue
             * @param val {Object} Required. The object to remove.
             * @return {Object} The new Array or Original.
             * @public
             */
            removeValue: function(val) {
                return this.removeIndex(this.indexOf(val));
            },

            /**
             * Convert the array to a JSONArray object.
             * @method toJsonString
             * @return {String} This JSON array as a string.
             * @public
             */
            toJsonString: function() {
                var sb = [];

                this.walk(function(o) {
                    sb.push(Object.convertToJsonString(o));
                });

                return '[' + sb.join(',') + ']';
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
                this.walk(function(o) {
                    // test if object with type already exists
                    if (! sorter[o + typeof o]) {
                        out.push(o);
                        sorter[o + typeof o] = true;
                    }
                });

                return out;
            },

            /**
             * Iterates on the array, executing 'fx' with each value.
             * @method walk
             * @param fx {Function} Required. The function to execute.
             * @param scope {Object} Optional. The scope to execute 'fx' in.
             * @public
             */
            walk: function(fx, scope) {
                return _YL.arrayWalk(this, fx, scope);
            }
        };

        /**
         * An alias for Array.walk.
         * @method batch
         * @see Array.walk
         * @public
         */
        _thatIfArrayWalk.batch = _thatIfArrayWalk.walk;

        /**
         * An alias for Array.walk.
         * @method forEach
         * @see Array.walk
         * @public
         */
        _thatIfArrayWalk.forEach = _thatIfArrayWalk.walk;

        _YL.augmentObject(Array.prototype, _thatIfArrayWalk, true);
    }

    // augment the DOM methods that use Array, if not already augmented
    if (_YD && _YD.augmentWithArrayMethods) {
        _YD.augmentWithArrayMethods();
    }
}());/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.00
 */

/**
 * The Boolean utility extends the native JavaScript Boolean Object with additional methods and objects.
 * @class Boolean
 */
(function() {
    var _YL = YAHOO.lang;

    var _that = {

        /**
         * Converts truthy/falsy to Boolean.
         * @method get
         * @param o {Object} Required. An Object that want to convert to Boolean.
         * @return {Boolean} True when parameter is truthy or true.
         * @static
         */
        get: function(o) {
		    //noinspection RedundantConditionalExpressionJS
            return (o && _YL.isDefined(o)) ? true : false; // ensures proper type for ===
        },

        /**
         * Tests if the passed parameter is a Boolean.
         * @method is
         * @param o {Object} Required. An Object that want to ensure is a Boolean.
         * @return {Boolean} True when parameter is a Boolean.
         * @static
         */
        is: function(o) {
            return _YL.isBoolean(o);
        }

    };

	_YL.augmentObject(Boolean, _that);
})();/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.01
 */

/**
 * The Date utility extends the native JavaScript Date Object with additional methods and objects.
 * @class Date
 */
(function() {
    var _YL = YAHOO.lang;

    var _throwNotImplemented = _YL.throwError ? function() {
		_YL.throwError.call(this, _YL.ERROR_NOT_IMPLEMENTED, 'Date', arguments);
	}: function(text) {throw(text);};

    var _that = {

        /**
         * Constant type for hours.
         * @property HOUR
         * @static
         * @final
         * @type String
         */
        HOUR: 'H',

        /**
         * Constant type for milliseconds.
         * @property MILLISECOND
         * @static
         * @final
         * @type String
         */
        MILLISECOND: 'MS',

        /**
         * Constant type for minutes.
         * @property MINUTE
         * @static
         * @final
         * @type String
         */
        MINUTE: 'I',

        /**
         * Constant value for 1 second in milliseconds.
         * @property ONE_SECOND_MS
         * @static
         * @final
         * @type Number
         */
        ONE_SECOND_MS: 1000,

        /**
         * Constant value for 1 minute in milliseconds.
         * @property ONE_MINUTE_MS
         * @static
         * @final
         * @type Number
         */
        ONE_MINUTE_MS: 60 * 1000,

        /**
         * Constant value for 1 hour in milliseconds.
         * @property ONE_HOUR_MS
         * @static
         * @final
         * @type Number
         */
        ONE_HOUR_MS: 60 * 60 * 1000,

        /**
         * Constant value for 1 day in milliseconds.
         * @property ONE_DAY_MS
         * @static
         * @final
         * @type Number
         */
        ONE_DAY_MS: 24 * 60 * 60 * 1000,

        /**
         * Constant value for 1 week in milliseconds.
         * @property ONE_WEEK_MS
         * @static
         * @final
         * @type Number
         */
        ONE_WEEK_MS: 7 * 24 * 60 * 60 * 1000,

        /**
         * Constant type for seconds.
         * @property SECOND
         * @static
         * @final
         * @type String
         */
        SECOND: 'S',

        /**
         * Date constant for full month names.
         * @property MONTHS
         * @static
         * @final
         * @type String
         */
        MONTHS: ['January','February','March','April','May','June','July','August','September','October','November','December'],

        /**
         * Collection of abbreviated Month names.
         * @property MONTHS_ABBR
         * @static
         * @final
         * @type Array
         */
        MONTHS_ABBR: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
		
		/**
		 * Determines the timezone offset from GMT.
		 *	Originally by Josh Fraser (http://www.onlineaspect.com)
		 * @method getTimeZoneOffset
		 * @return {Number} The timezone offset.
		 * @static
		 */
		getTimeZoneOffset: function() {
			var rightNow = new Date(),
				jan1 = Date.getJan1(rightNow),
				june1 = Date.getDate(rightNow.getFullYear(), 6, 1),
				tempGMT = jan1.toGMTString(),
				jan2 = new Date(tempGMT.substring(0, tempGMT.lastIndexOf(" ") - 1));

			tempGMT = june1.toGMTString();
			var june2 = new Date(tempGMT.substring(0, tempGMT.lastIndexOf(" ") - 1)),
				std_time_offset = (jan1 - jan2) / Date.ONE_HOUR_MS,
				daylight_time_offset = (june1 - june2) / Date.ONE_HOUR_MS,
				dst;

			if (std_time_offset === daylight_time_offset) {
				dst = 0; // daylight savings time is NOT observed
			}
			else {
				// positive is southern, negative is northern hemisphere
				var hemisphere = std_time_offset - daylight_time_offset;
				if (0 <= hemisphere) {std_time_offset = daylight_time_offset;}
				dst = 1; // daylight savings time is observed
			}
			
			var n = Math.floor(Math.abs(std_time_offset)) + dst;
			
			return (0 > std_time_offset) ? (-1 * n) : n;
		},

        /**
         * Calculates the difference between calA and calB in units of field. CalB should be before calA or the result will be negative.
         * @method diff
         * @param cA {Date} Optional. The JavaScript Date that is after than calB, or if invalid will assume 'Now'.
         * @param cB {Date} Optional. The JavaScript Date that is before than calA, or if invalid will assume 'Now'.
         * @param field {String} Optional. The field constant to be used for performing date math.
         * @return {Number} A number representing the length of time, in units of field, between dates calA & calB (rounded up).
         * @static
         */
        diff: function(cA, cB, field) {
            var calA = _YL.isDate(cA) ? cA : new Date(),
                calB = _YL.isDate(cB) ? cB : new Date(),
                val = 0,
                preround = 0,
	            isFieldTimeOfDay = Date.MILLISECOND === field || Date.HOUR === field || Date.MINUTE === field || Date.SECOND === field;

            // any period shorter than a week can be calculated using milliseconds, otherwise will require the year
            var diff = (Date.DAY === field || isFieldTimeOfDay) ? calA.getTime() - calB.getTime() : calA.getFullYear() - calB.getFullYear();

            switch (field) {
                case Date.YEAR: // year(s)
                    val = diff;
                    // correct for months
                    if (calA.getMonth() === calB.getMonth()) {
                        // correct for days
                        if (calA.getDate() < calB.getDate()) {
                            val -= 1;
                        }
                    }
                    else if (calA.getMonth() < calB.getMonth()) {
                        val -= 1;
                    }
                    break;

                case this.MONTH: // month(s)
                    val = diff * 12 + calA.getMonth() - calB.getMonth();
                    // correct for days
                    if (calA.getDate() < calB.getDate()) {
                        val -= 1;
                    }
                    break;

                case this.DAY: // day(s)
                    preround = diff / Date.ONE_DAY_MS;
                    break;

                case this.HOUR: // hour(s)
                    preround = diff / Date.ONE_HOUR_MS;
                    break;

                case this.MINUTE: // minute(s)
                    preround = diff / Date.ONE_MINUTE_MS;
                    break;

                case this.SECOND: // second(s)
                    preround = diff / Date.ONE_SECOND_MS;
                    break;

                case this.MILLISECOND: // millisecond(s)
                default:
                    val = diff;
                    break;
            }

            return preround ? Math.round(preround) : val;
        },

        /**
         * Returns a new JavaScript Date object, representing the given year, month and date. Time fields (hr, min, sec, ms) on the new Date object
         *  are set to 0. The method allows Date instances to be created with the a year less than 100. 'new Date(year, month, date)' implementations
         *  set the year to 19xx if a year (xx) which is less than 100 is provided.
         *
         * Note: Validation on argument values is not performed. It is the caller's responsibility to ensure
         *  arguments are valid as per the ECMAScript-262 Date object specification for the new Date(year, month[, date]) constructor.
         *
         * @method getDate
         * @param y {Number} Required. The date year.
         * @param m {Number} Required. The month index from 0 (Jan) to 11 (Dec).
         * @param d {Number} Optional. The date from 1 to 31. If not provided, defaults to 1.
         * @param h {Number} Optional. The date from 0 to 59. If not provided, defaults to 0.
         * @param i {Number} Optional. The date from 0 to 59. If not provided, defaults to 0.
         * @param s {Number} Optional. The date from 0 to 59. If not provided, defaults to 0.
         * @param ms {Number} Optional. The date from 0 to 999. If not provided, defaults to 0.
         * @return {Date} The JavaScript date object with year, month, date set as provided.
         * @static
         */
        getDate: function(y, m, d, h, i, s, ms) {
            var dt = null;

            if (_YL.isDefined(y) && _YL.isDefined(m)) {
                if (100 <= y) {
                    dt = new Date(y, m, d || 1);
                }
                else {
                    dt = new Date();
                    dt.setFullYear(y);
                    dt.setMonth(m);
                    dt.setDate(d || 1);
                }

                dt.setHours(h || 0, i || 0, s || 0, ms || 0);
            }

            return dt;
        },

        /**
         * Returns a date object from the String; expects 'MonthName, DayNr Year Hrs:Min:Sec', may not work properly on other strings in all browsers.
         * @method getDate
         * @param s {String} Required. The date as a String.
         * @return {Date} A date object, defined by the passed String; null when s is an invalid date.
         * @static
         */
        getDateFromTime: function(s) {
            var d = new Date();
            d.setTime(Date.parse('' + s));
            return ('Invalid Date' === ('' + d) || isNaN(d)) ? null : d;
        },

        /**
         * Retrieves the month value from the months short or abreviated name (ex. jan == Jan == January == january == 1).
         * @method getMonthIndexFromName
         * @param s {String} Required. The textual name of the month, can be any case and 3 letters or full name.
         * @return {Number} The index of the month (1-12) or -1 if invalid.
         * @static
         */
        getMonthIndexFromName: function(s) {
            var month = ('' + s).toLowerCase().substr(0, 3),
                mlist = Date.MONTHS_ABBR,
                i = 0;

            for (i = 0; i < mlist.length; i += 1) {
                if (mlist[i].toLowerCase() === month) {return i + 1;}
            }

            return -1;
        },

        /**
         * Shortcut method to get the current time in milliseconds.
         * @method getTime
         * @return {Number} the current time in milliseconds
         * @static
         */
        getTime: function() {
            return (new Date()).getTime();
        },

        /**
         * Calculates an appropriate time window then returns a String representation of that window.
         * @method getTimeAgo
         * @param c1 {Date} Required. The JavaScript Date that is before now, or will default to 'Now'.
         * @param c2 {Date} Optional. The JavaScript Date that is after 'then'; default is 'Now'.
         * @return {String} A String representing the length of time with units between date and 'Now'.
         * @static
         */
        getTimeAgo: function(c1, c2) {
            var now = _YL.isDate(c2) ? c2 : new Date(),
                then = _YL.isDate(c1) ? c1 : now,
                diff = (then.getTime() === now.getTime()) ? 0 : Date.diff(now, then, Date.MILLISECOND);

            if (diff < Date.ONE_SECOND_MS) {return '0 seconds';}

            if (diff < Date.ONE_MINUTE_MS) {
                diff = Date.diff(now, then, Date.SECOND);
                return diff + ' second' + (1 === diff ? '' : 's');
            }

            if (diff < Date.ONE_HOUR_MS) {
                diff = Date.diff(now, then, Date.MINUTE);
                return diff + ' minute' + (1 === diff ? '' : 's');
            }

            if (diff < Date.ONE_DAY_MS) {
                diff = Date.diff(now, then, Date.HOUR);
                return diff + ' hour' + (1 === diff ? '' : 's');
            }

            if (diff < Date.ONE_WEEK_MS) {
                diff = Date.diff(now, then, Date.DAY);
                return diff + ' day' + (1 === diff ? '' : 's');
            }

            if (diff < Date.ONE_WEEK_MS * 4) {
                diff = parseInt(Date.diff(now, then, Date.DAY) / 7, 10);
                return diff + ' week' + (1 === diff ? '' : 's');
            }

            diff = this.diff(now, then, Date.YEAR);

            if (1 < diff) {
                return diff + ' years';
            }
            else {
                diff = Date.diff(now, then, Date.MONTH);
                return diff + ' month' + (1 === diff ? '' : 's');
            }
        },

        /* defined below */
        is: function() {_throwNotImplemented('is', 'yahoo.ext/lang.js');}

    };

	_YL.augmentObject(Date, _that);

    // YAHOO.widget.DateMath included, use instead of custom Date methods
    if (YAHOO.widget && YAHOO.widget.DateMath) {
        var _DM = YAHOO.widget.DateMath;

        var _thatIfDateMath = {

            /**
             * @see YAHOO.widget.DateMath.DAY
             */
            DAY: _DM.DAY,

            /**
             * @see YAHOO.widget.DateMath.MONTH
             */
            MONTH: _DM.MONTH,

            /**
             * @see YAHOO.widget.DateMath.WEEK
             */
            WEEK: _DM.WEEK,

            /**
             * @see YAHOO.widget.DateMath.YEAR
             */
            YEAR: _DM.YEAR,

            /**
             * @see YAHOO.widget.DateMath.getJan1
             */
            getJan1: _DM.getJan1
        };

	    _YL.augmentObject(Object, _thatIfDateMath);
    }
    else {
        var _thatIfNotDateMath = {

            /**
             * Constant field representing Day.
             * @property DAY
             * @static
             * @final
             * @type String
             */
            DAY: 'D',

            /**
             * Constant field representing Month.
             * @property MONTH
             * @static
             * @final
             * @type String
             */
            MONTH: 'M',

            /**
             * Constant field representing Week.
             * @property WEEK
             * @static
             * @final
             * @type String
             */
            WEEK: 'W',

            /**
             * Constant field representing Year.
             * @property YEAR
             * @static
             * @final
             * @type String
             */
            YEAR: 'Y',

            /**
             * Retrieves a JavaScript Date object representing January 1 of any given year.
             * @method getJan1
             * @param calendarYear {Number} Optional. The calendar year for which to retrieve January 1; default is this year.
             * @return {Date} The Date for January 1 of the calendar year specified.
             * @static
             */
            getJan1: function(calendarYear) {
                return Date.getDate(_YL.isNumber(calendarYear) ? calendarYear : (new Date()).getFullYear(), 0, 1, 0, 0, 0, 1);
            }
        };

	    _YL.augmentObject(Date, _thatIfNotDateMath);
    }

    // YAHOO.lang extensions are included
    if (_YL.isDate) {
        var _thatIfIsDate = {

            /**
             * Tests if the passed parameter is a date.
             * @method is
             * @param date {Object} Required. An Object that want to ensure is a Date.
             * @return {Boolean} True when parameter is a date.
             * @static
             */
            is: function(date) {
                return _YL.isDate(date);
            }
        };

	    _YL.augmentObject(Date, _thatIfIsDate);
    }
})();

/**
 * The Date utility extends the native JavaScript Date Object prototype with additional methods and objects.
 * @class Date
 * @namespace Window
 * @extends Date
 * @dependencies YAHOO.lang
 */
(function() {
    var _YL = YAHOO.lang;

    var _that = {

        /**
         * Creates a new Date Object with the same time as 'this'.
         * @method clone
         * @return {Date} The copied date.
         * @public
         */
        clone: function() {
            var date = new Date();
            date.setTime(this.getTime());
            return date;
        },

        /**
         * Converts the JavaScript Date into a date String. Recognizes the following format characters:
         *  y = year, m = month, d = day of month, h = hour, i = minute, s = second.
         * @method toDateString
         * @param format (String} Optional. The String format to convert the JavaScript Date into (ie. 'm/d/y' or 'm. d, y'); default is 'm/d/y'.
         * @param showZeros {Boolean} Optional. Forces leading zeros, so 9/1/2006 becomes 09/01/2006.
         * @param useMonthName {String|Boolean} Optional. String or Boolean, use the month name instead of the digit, ('abbr' uses the short name).
         * @return {String} the JavaScript Date as a String
         * @public
         */
        format: function(format, showZeros, useMonthName) {
            var f = (_YL.isString(format) ? format : Date.MONTH + '/' + Date.DAY + '/' + Date.YEAR).toUpperCase();

            // cast all values to strings
            var day = '' + this.getDate(),
                month = '' + (this.getMonth() + 1),
                hour = '' + this.getHours(),
                minute = '' + this.getMinutes(),
                second = '' + this.getSeconds(),
                year = '' + this.getFullYear();

            // pad leading zeros
            if (showZeros) {
                if (1 === day.length) {day = '0' + day;}
                if (1 === month.length) {month = '0' + month;}
                if (1 === hour.length) {hour = '0' + hour;}
                if (1 === minute.length) {minute = '0' + minute;}
                if (1 === second.length) {second = '0' + second;}
            }

            // use month name
            if (useMonthName) {
                month = (_YL.isString(useMonthName) && 'abbr' === useMonthName.toLowerCase()) ? this.getMonthNameAbbr() : this.getMonthName();
            }

            // do month last as some months contain reserved letters
            return f.replace(Date.YEAR, year).replace(Date.DAY, day).replace(Date.HOUR, hour).replace(Date.MINUTE, minute)
                    .replace(Date.SECOND, second).replace(Date.MONTH, month);
        },

        /**
         * Converts JavaScript Date into a MySQL dateTime String '1969-12-31 00:00:00'.
         * @method formatTime
         * @return {String} The JavaScript Date as a MySQL time String.
         * @public
         */
        formatTime: function() {
            return this.format('y-m-d h:i:s', true);
        },

        /**
         * Retrieves the name of the month.
         * @method getMonthName
         * @return {String} The month fullname.
         * @public
         */
        getMonthName: function() {
            return Date.MONTHS[this.getMonth()];
        },

        /**
         * Retrieves the abbreviated name of the month.
         * @method getMonthNameAbbr
         * @return {String} The month abbreviated name.
         * @public
         */
        getMonthNameAbbr: function() {
            return this.getMonthName().substr(0,3);
        },

        /**
         * Returns whether the Javascript Date or 'Now' is on a leap year.
         * @method isLeapYear
         * @return {Boolean} True if the year matches traditional leap year rules.
         * @static
         */
        isLeapYear: function() {
            var year = this.getFullYear();
            return (0 === year % 4 && (0 !== year % 100 || 0 === year % 400));
        },

        /**
         * Returns whether the Javascript Date or 'Now' is on a weekend.
         * @method isWeekend
         * @return {Boolean} True if the day of the week matches traditional weekend rules.
         * @static
         */
        isWeekend: function() {
            return (2 > this.getDay());
        }
    };

	_YL.augmentObject(Date.prototype, _that);

    // YAHOO.widget.DateMath included, use instead of custom Date methods
    if (YAHOO.widget && YAHOO.widget.DateMath) {
        var _DM = YAHOO.widget.DateMath;

        var _thatIfDateMath = {

            /**
             * @see YAHOO.widget.DateMath.add
             */
            add: function() {
                return _DM.add.call(this, this, arguments[0], arguments[1]);
            },

            /**
             * @see YAHOO.widget.DateMath.after
             */
            after: function() {
                return _DM.after.call(this, this, arguments[0]);
            },

            /**
             * @see YAHOO.widget.DateMath.before
             */
            before: function() {
                return _DM.before.call(this, this, arguments[0]);
            },

            /**
             * @see YAHOO.widget.DateMath.between
             */
            between: function() {
                return _DM.between.call(this, this, arguments[0], arguments[1]);
            },

            /**
             * @see YAHOO.widget.DateMath.clearTime
             */
            clearTime: function() {
                return _DM.clearTime.call(this, this);
            },

            /**
             * @see YAHOO.widget.DateMath.getDayOffset
             */
            getDayOffset: function() {
                return _DM.getDayOffset.call(this, this, arguments[0]);
            },

            /**
             * @see YAHOO.widget.DateMath.getJan1
             */
            getJan1: function() {
                return _DM.getJan1.call(this, this, arguments[0]);
            },

            /**
             * @see YAHOO.widget.DateMath.subtract
             */
            subtract: function() {
                return _DM.subtract.call(this, this, arguments[0], arguments[1]);
            }
        };

	    _YL.augmentObject(Date.prototype, _thatIfDateMath);
    }
    else {
        var _thatIfNotDateMath = {

            /**
             * Adds the specified amount of time to the this instance.
             * @method add
             * @param field {String} Required. The field constant to be used for performing addition.
             * @param amount {Number} Required. The number of units (measured in the field constant) to add to the date.
             * @return {Date} The resulting Date object.
             * @public
             */
            add : function(field, amount) {
                var d = new Date(this.getTime()),
                    amt = _YL.isNumber(amount) ? amount : 0;

                switch (field) {
                    case Date.MONTH:
                        var newMonth = this.getMonth() + amt,
                            years = 0;

                        if (0 > newMonth) {
                            while (0 > newMonth) {
                                newMonth += 12;
                                years -= 1;
                            }
                        }
                        else if (11 < newMonth) {
                            while (11 < newMonth) {
                                newMonth -= 12;
                                years += 1;
                            }
                        }

                        d.setMonth(newMonth);
                        d.setFullYear(this.getFullYear() + years);
                        break;

                    case Date.YEAR:
                        d.setFullYear(this.getFullYear() + amt);
                        break;

                    case Date.WEEK:
                        d.setDate(this.getDate() + (amt * 7));
                        break;

                    case Date.DAY:
                    default:
                        d.setDate(this.getDate() + amt);
                        break;
                }

                return d;
            },

            /**
             * Determines whether a given date is after another date on the calendar.
             * @method after
             * @param compareTo {Date} Required. The Date object to use for the comparison.
             * @return {Boolean} True if the date occurs after the compared date; false if not.
             * @public
             */
            after : function(compareTo) {
                return _YL.isDate(compareTo) && (this.getTime() > compareTo.getTime());
            },

            /**
             * Determines whether a given date is before another date on the calendar.
             * @method before
             * @param compareTo {Date} Required. The Date object to use for the comparison.
             * @return {Boolean} True if the date occurs before the compared date; false if not.
             * @public
             */
            before : function(compareTo) {
                return _YL.isDate(compareTo) && (this.getTime() < compareTo.getTime());
            },

            /**
             * Determines whether a given date is between two other dates on the calendar.
             * @method between
             * @param dateA {Date} Required. One end of the range.
             * @param dateB {Date} Required. Another end of the range.
             * @return {Boolean} True if the date occurs between the compared dates; false if not.
             * @public
             */
            between : function(dateA, dateB) {
	            if (! (_YL.isDate(dateA) && _YL.isDate(dateB))) {return false;}
                return ( (this.after(dateA) && this.before(dateB)) || (this.before(dateA) && this.after(dateB)) );
            },

            /**
             * Removes the time only values from the 'this'.
             * @method clearTime
             * @return {Date} Returns a reference to 'this'.
             * @public
             */
            clearTime: function() {
                this.setHours(0, 0, 0, 0);
                return this;
            },

            /**
             * Calculates the number of days the specified date is from January 1 of the specified calendar year.
             *  Passing January 1 to this function would return an offset value of zero.
             * @method getDayOffset
             * @return {Number} The number of days since January 1 of the given year.
             * @public
             */
            getDayOffset : function() {
                // clear hours first
                var date = this.clone();
                date.setHours(0, 0, 0, 0);
                return Date.diff(date, this.getJan1(), Date.DAY);
            },

            /**
             * Retrieves a JavaScript Date object representing January 1 of the year for 'this'.
             * @method getJan1
             * @return {Date} The Date for January 1 of the year for 'this'.
             * @static
             */
            getJan1: function() {
                return Date.getDate(this.getFullYear(), 0, 1, 0, 0, 0, 1);
            },

            /**
             * Subtracts the specified amount of time from the this instance.
             * @method subtract
             * @param field {Number} Required. The this field constant to be used for performing subtraction.
             * @param amount {Number} Required. The number of units (measured in the field constant) to subtract from the date.
             * @return {Date} The resulting Date object.
             * @public
             */
            subtract: function(field, amount) {
                return this.add(field, _YL.isNumber(amount) ? (amount * -1) : 0);
            }
        };

	    _YL.augmentObject(Date.prototype, _thatIfNotDateMath);
    }
})();/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.00
 */

/**
 * The Number utility extends the native JavaScript Number Object with additional methods and objects.
 * @class Number
 */
(function() {
    var _YL = YAHOO.lang;

    var _that = {

        /**
         * Tests if the passed parameter is a Number.
         * @param n {Object} Required. An Object that want to ensure is a Number.
         * @return {Boolean} True when parameter is a Number.
         * @static
         */
        is: function(n) {
            return _YL.isNumber(n);
        }

    };

	_YL.augmentObject(Number, _that);
})();

/**
 * The Number utility extends the native JavaScript Number Object prototype with additional methods and objects.
 * @class Number
 * @namespace Window
 * @extends Number
 * @dependencies YAHOO.lang
 */
(function() {
    var _YL = YAHOO.lang;

    var _that = {

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
            if (! _YL.isString(format)) {return '';} // sanity check

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
         * Determines the number of significant figures in Number.
         * @method getPrecision
         * @retrun {Number} The number of significant figures.
         * @public
         */
        getPrecision: function() {
            var sb = ('' + Math.abs(this)).split('.');

            if ('0' === sb[0] && sb[1] && sb[1].length) {
                return -1 * sb[1].length;
            }
            else {
                return sb[0].length;
            }
        },

        /**
         * Determines if the number value is between two other values.
         * @method isBetween
         * @param i {Number} Required. The lower bound of the range.
         * @param j {Number} Required. The upper bound of the range.
         * @param inclusive {Boolean} Optional. True if i and j are to be included in the range.
         * @return {Boolean} True if i < this < j or j > this > i.
         * @public
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
         * @param inclusive {Boolean} Optional. True if i and j are to be included in the range.
         * @return {Boolean} True if i > this || val > j.
         * @public
         */
        isNotBetween: function(i, j, inclusive) {
            return ! this.isBetween(i, j, inclusive);
        },

        /**
         * Computes a random integer from 'this'; if parameter n is passed, then computes a number in the range between 'this' and 'n'.
         * @method random
         * @param n {Number} Optional. End of range.
         * @return {Number} A random integer.
         * @public
         */
        random: function(n) {
            var offset = 0,
                m = this;

            // compute min/max
            if (_YL.isNumber(n) && n !== m) {
                var max = (n < m) ? m : n,
                    min = n === max ? m : n;

                offset = min;
                m = max - min;
            }

            return offset + Math.floor(Math.random() * m + 1);
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
         * Rounds to the nearest whole number.
         * @method roundToPrecision
         * @param prec {Number} Optional. The precision to round to: 1, 10, 100, etc...; default is 10, which rounds to the nearest tenth.
         * @return {Number} The converted number.
         * @public
         */
        roundToPrecision: function(prec) {
            if (1 > this) {return 1;}
            var pstr = ('' + prec),
                precision = Number.is(prec) ? (Math.pow(10, pstr.length) / 10) : 10,
                n = Math.ceil(this / precision);
            return n * precision;
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
    };

	_YL.augmentObject(Number.prototype, _that);
})();/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.01
 */

/**
 * The Object utility extends the native JavaScript Object Object with additional methods and objects.
 * @class Object
 */
// !IMPORTANT! Do not put anything on the Object.prototype as this can cause issues.
(function() {
    var _YL = YAHOO.lang;

    var _throwNotImplemented = _YL.throwError ? function() {
		_YL.throwError.call(this, _YL.ERROR_NOT_IMPLEMENTED, 'Object', arguments);
	}: function(text) {throw(text);};

    var _that = {

	    /**
	     * Determines the appropriate JSON representation for object.
	     * @method convertToJsonString
	     * @param o {Object} Required. An object.
	     * @static
	     */
	    convertToJsonString: function(o) {
			// this is a String
			if (_YL.isString(o)) {
				// this is actually a number cast as a string, convert back to number
				if ('' !== o && o === o.stripNonNumeric()) {
					return parseFloat(o);
				}
				else {
					return ('"' + o + '"').replace(/^""(.*?)""$/, '"$1"');
				}
			}
			else {
				// Number
				if (_YL.isNumber(o)) {
					return parseFloat(o);
				}
				// Array
				else if (_YL.isArray(o)) {
					return o.toJsonString();
				}
				// Objects should be parsed
				else if (_YL.isObject(o)) {
					return Object.toJsonString(o);
				}

				return ('"' + o + '"'); // some unknown object, just use native 'toString' method of object
			}
	    },

        /* defined below */
        forEach: function() {_throwNotImplemented('forEach', 'yahoo.ext/lang.js');},

        /**
         * Tests if the passed parameter is an Object.
         * @param o {Object} Required. An Object that want to ensure is an Object.
         * @return {Boolean} True when parameter is an Object.
         * @static
         */
        is: function(o) {
            return _YL.isObject(o);
        },

        /* defined below */
        toJsonString: function() {_throwNotImplemented('toJsonString', 'yahoo.ext/lang.js');},

        /* defined below */
        toQueryString: function() {_throwNotImplemented('toQueryString', 'yahoo.ext/lang.js');}
    };

	_YL.augmentObject(Object, _that);

    // YAHOO.lang extensions are included
    if (_YL.forEach) {
        var _thatIfLangExtended = {

            /**
             * Alias for YAHOO.lang.forEach.
             * @method forEach
             * @see YAHOO.lang.forEach
             * @static
             */
            forEach: _YL.forEach,

            /**
             * Static method for converting the object to a JSON string.
             * @method toJsonString
             * @param data {Object} Required. The object to loop through.
             * @return {String} The object as a JSON string.
             * @static
             */
            toJsonString: function(data) {
                var sb = [];

                Object.forEach(data, function(o, k) {
                    sb.push(('"' + k + '":') + Object.convertToJsonString(o));
                });

                return '{' + sb.join(',') + '}';
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

                _YL.forEach(data, function(v, k) {
					// only care about strings and numbers
					if (_YL.isString(v) || _YL.isNumber(v)) {
						sb[i] = (k + '=' + v);
						i += 1;
					}
                });

                return encode ? encodeURIComponent(sb.join('&')) : sb.join('&');
            }
        };

		_YL.augmentObject(Object, _thatIfLangExtended, true);
    }
})();/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.00
 */

/**
 * The RegExp utility extends the native JavaScript RegExp Object with additional methods and objects.
 * @class RegExp
 */
(function() {
    var _YL = YAHOO.lang;

    var _throwNotImplemented = _YL.throwError ? function() {
		_YL.throwError.call(this, _YL.ERROR_NOT_IMPLEMENTED, 'RegExp', arguments);
	}: function(text) {throw(text);};

    var _that = {

        /**
         * Static method to escape regex literals.
         * @method esc
         * @param text {String} Required. The literal to search.
         * @return {String} The text escaped.
         * @static
         */
        esc: function(text) {
          if (! arguments.callee.sRE) {
            var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\' ];
            arguments.callee.sRE = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
          }

          return text.replace(arguments.callee.sRE, '\\$1');
        },

        /* defined below */
        is: function() {_throwNotImplemented('is', 'yahoo.ext/lang.js');}

    };

	_YL.augmentObject(RegExp, _that);

    if (_YL.isRegExp) {
        var _thatIfIsRegExp = {

            /**
             * Tests if the passed parameter is a RegExp.
             * @method is
             * @param o {Object} Required. An Object that want to ensure is a RegExp.
             * @return {Boolean} True when parameter is a RegExp.
             * @static
             */
            is: function(o) {
                return _YL.isRegExp(o);
            }
        };

	    _YL.augmentObject(RegExp, _thatIfIsRegExp, true);
    }
})();

/**
 * The RegExp utility extends the native JavaScript RegExp Object prototype with additional methods and objects.
 * @class RegExp
 * @namespace Window
 * @dependencies YAHOO.lang
 */
(function() {
    var _YL = YAHOO.lang;

    var _that = {

        /**
         * Returns the number of times this regex matches the haystack.
         * @method count
         * @param haystack {String} Required. The string to search; fails gracefull on non-string haystacks.
         * @return {Number} The number of matches.
         * @public
         */
        count: function(haystack) {
            return ('' + haystack).match(this).length;
        }
    };

	_YL.augmentObject(RegExp.prototype, _that);
})();/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.01
 */

/**
 * The String utility extends the native JavaScript String Object with additional methods and objects.
 * @class String
 */
(function() {
    var _YL = YAHOO.lang,
        _YD = YAHOO.util.Dom,
        _DOC = document;
    
    var _that = {

        /**
         * An associative array containing select HTML character entities that we'd like to decode.
         * @property htmlCharacterEntities
         * @static
         * @final
         * @type {Array}
         */
        htmlCharacterEntities: {"quot":'"',"nbsp":' ',"ndash":"\u2013","lt":'<',"gt":'>', "reg":'\xae',"copy":'\xa9',
                                "cent":'\xa2',"amp":'&',"apos":"'","rsquo":'\x27'},

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
         * Converts a hexidecimal color into it's RGB values.
         * @method hexToRGB
         * @param s {String} A hexidecimal color.
         * @static
         */
        hexToRGB: function(s) {
            var r = 0, g = 0, b = 0;

            if (s.isColor()) {
                var n = -1 < s.indexOf('#') ? 1 : 0;

                if (3 === (s.length - n)) {
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
            return _YL.isString(o);
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
    };

	_YL.augmentObject(String, _that);

    // DOM extensions are included
    if (_YD.replace) {
        var _thatIfDomReplace = {

            /**
             * Method to search a string for long words and break them into manageable chunks.
             * @method breakLongWords
             * @param node {Element} Required. Pointer reference to DOM element to append to.
             * @param s {String} The text.
             * @param n {Number} The character position to split around.
             * @static
             */
            breakLongWords: function(node, s, n) {
                if (! s) {return;}
                var tokens = s.split(' '),
                    span = node.appendChild(_DOC.createElement('span')),
                    sb = [];

                // iterate on each word in the string
                _YL.arrayWalk(tokens, function(token) {
                    var tok = token + ' ',
                        m = tok.length;

                    // the length of the word exceeds the threshold
                    if (m > n) {
                        _YD.replace(span, sb.join(''));

                        for (var k=0; k < m; k += n) {
                            var wspan = (0 === k && 0 === sb.length)? span: node.appendChild(_DOC.createElement('span'));

                            if (k + n < m) {
                                _YD.replace(wspan, tok.substr(k, n));
                                node.appendChild(_DOC.createElement('wbr'));
                            }
                            else {
                                _YD.replace(wspan, tok.substring(k));
                            }
                        }

                        span = node.appendChild(_DOC.createElement('span'));
                        sb = [];
                    }
                    // the length of the word is less than threshold
                    else {
                        sb.push(tok);
                    }
                });

                _YD.replace(span, sb.join(''));
                if (! sb.length) {node.removeChild(span);}
            }
        };

        _YL.augmentObject(String, _thatIfDomReplace);
    }
})();

/**
 * The String utility extends the native JavaScript String Object prototype with additional methods.
 * @class String
 * @namespace Window
 * @extends String
 * @dependencies YAHOO.lang
 */
(function() {
    var _YL = YAHOO.lang;

    var _throwNotImplemented = _YL.throwError ? function() {
		_YL.throwError.call(this, _YL.ERROR_NOT_IMPLEMENTED, 'String.prototype', arguments);
	}: function(text) {throw(text);};

    var _that = {

        capitalize: function() {_throwNotImplemented('capitalize', 'yahoo.ext/lang.js');},

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
                /*
                 * Callback function callback by replace.
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
         * Decodes the URL and then corrects any discrepencies.
         * @method decodeUrl
         * @return {String} The decoded URL.
         * @public
         */
        decodeUrl: function() {
            return decodeURIComponent(this).replace(/\+/g, ' ');
        },
    
        /**
         * Encodes the URL and then corrects any discrepencies.
         * @method encodeUrl
         * @return {String} The encoded URL.
         * @public
         */
        encodeUrl: function() {
            return encodeURIComponent(this);
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
        endsWithAny: function(needle, needleX, ignoreCase) {
            var args = arguments,
                last = args.length - 1,
                iCase = _YL.isBoolean(args[last]) && args[last];

            for (var i = 0; i < args.length; i += 1) {
                if (this.endsWith(args[i], iCase)) {return true;}
            }

            return false;
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

        /* defined below */
        getQueryValue: function() {_throwNotImplemented('getQueryValue', 'native.ext/regexp.js');},

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
        has: function(needle, needleX, ignoreCase) {
            var args = arguments,
                last = args.length - 1,
                iCase = _YL.isBoolean(args[last]) && args[last],
                str = iCase ? this.toLowerCase() : this;

            // if the needle is longer than 'this', we know false
            if (0 === str.length) {return false;}

            for (var i = 0; i < args.length; i += 1) {
                var s = '' + args[i];
                if (0 < s.length && -1 < str.indexOf(iCase ? s.toLowerCase() : s)) {return true;}
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
         * Checks if the string is a number (numeric).
         * @method isNumber
         * @return {Boolean} True, if 'this' is a number.
         * @static
         */
        isNumber: function() {
            return this.trim().length === this.stripNonNumeric().length;
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
         * @param rx {RegExp} Required. The regex to use for finding characters to remove.
         * @return {String} The cleaned string.
         * @public
         */
        remove: function(rx) {
            return this.replace(rx, '');
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
        startsWithAny: function(needle, needleX, ignoreCase){
            var args = arguments,
                last = args.length - 1,
                iCase = _YL.isBoolean(args[last]) && args[last];

            for (var i = 0; i < args.length; i += 1) {
                if (this.startsWith(args[i], iCase)) {return true;}
            }

            return false;
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
            if (! _YL.isNumber(sIndex)) {sIndex = 0;}
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
         * @param truncation {String} Optional. The string to use as the ellipsis; defualt is '...'.
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
        },

        /* defined below */
        toJsonObject: function() {_throwNotImplemented('toJsonObject', 'yahoo/json.js');}
    };

    _YL.augmentObject(String.prototype, _that);

    // YAHOO.json extensions are included
    if (''.parseJSON || _YL.JSON) {
        // JSON changed for the better in v2.7
        var _parseJSON = _YL.JSON ? _YL.JSON.parse : function(s) {return s.parseJSON();};

        var _thatIfJSON = {

            /**
             * Converts the string to a JSON object; contains special logic for older safari versions that choke on large strings.
             * @method toJsonObject
             * @param forceEval {Boolean} Optional. True, when using eval instead of parseJSON.
             * @return {Array} JSON formatted array [{}, {}, {}, ...].
             * @public
             */
            toJsonObject: function(forceEval) {
                if (! this) {return [];}
                return ((522 > YAHOO.env.ua.webkit && 4000 < this.length) || forceEval) ? eval("(" + this + ")") : _parseJSON(this);
            }
        };

        _YL.augmentObject(String.prototype, _thatIfJSON, true);
    }

    // YAHOO.lang extensions are included
    if (_YL.arrayWalk) {
        var _thatIfLangExtended = {

            /**
             * Capitolize the first letter of every word.
             * @method capitalize
             * @param ucfirst {Boolean} Optional. When truthy, converts non-first letters to lower case; default is undefined.
             * @param minLength {Number} Optional. When set, this is the minimum number of characters a word must be before transforming; default is undefined.
             * @return {String} The converted string.
             * @public
             */
            capitalize: function(ucfirst, minLength) {
                var i = 0,
                    rs = [];

                _YL.arrayWalk(this.split(/\s+/g), function(w) { // don't assume $A() is available
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
            }
        };

		_YL.augmentObject(String.prototype, _thatIfLangExtended, true);
    }

    // RegExp extensions are included
    if (RegExp.esc) {
        var _thatIfRegExp = {

            /**
             * Escape regex literals in 'this'.
             * @method escapeRx
             * @return {String} The escaped text.
             * @static
             */
            escapeRx: function() {
                return RegExp.esc(this);
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
                var regex = new RegExp('[\\?&]' + RegExp.esc('' + key) + '=([^&#]*)'),
                    results = regex.exec(url);
                return results ? results[1] : '';
            }
        };

		_YL.augmentObject(String.prototype, _thatIfRegExp, true);
    }
})();/*
 * Copyright (c) 2009, Matt Snider, LLC All rights reserved.
 * Version: 1.0.01
 */

/**
 * The Core object manages the MVC architecture of the pages and namespacing.
 * @module mvc
 */

/**
 * This file setups the Core MVC namespace.
 * @class Core
 * @static
 */
(function() {
	// constants
var _LOG_LEVEL = { // the log severity level constants, used to determine if a debug statmenet should be logged or not
		ALL: 1, // developer environments
		DEBUG: 2,
		INFO: 3, // production environments should be set to 3 or higher
		WARN: 4,
		SEVERE: 5
	},
	WL = window.location,

    // local namespace
	_logLevel = _LOG_LEVEL.INFO;

    // static namespace
    window.Core = {

		/**
		 * The current project version #.
		 * @property Version
		 * @type String
		 * @static
		 * @final
		 */
		VERSION: '1.0',

        /**
         * The controller namespace.
         * @property Controller
         * @type Object
		 * @static
         */
        Controller: {},

        /**
         * Object namespace placeholder for attaching global constants; inner Function to create Client Singleton.
         * @property Constants
         * @type Object
		 * @static
         */
        Constants: {},

        /**
         * The model object namespace.
         * @property Model
         * @type Object
         */
        Model: {},

        /**
         * The utility namespaces.
         * @property Util
         * @type Object
		 * @static
         */
        Util: {},

        /**
         * The widget namespaces.
         * @property Widget
         * @type Object
		 * @static
         */
        Widget: {},

        /**
         * The view object namespace.
         * @property View
         * @type Object
		 * @static
         */
        View: {},

        /**
         * This is a generic method to use instead of an anonymous function, allows for better debugging.
         * @method emptyFunction
         * @static
         */
        emptyFunction: function() {
            var args = arguments,
				pause = '';
        },

		/**
		 * Returns the log level of the application.
		 * @method getLogLevel
		 * @return {Number} The current log level.
		 * @static
		 */
		getLogLevel: function() {return _logLevel;},

        /**
		 * Retrieves the hash from the location object; ensures is a string.
		 * @method getHash
		 * @return {String} The page hash.
		 * @static
		 */
        getHash: function() {
            return ('' + WL.hash);
        },

        /**
		 * Retrieves the host from the location object; ensures is a string.
		 * @method getHost
		 * @return {String} The page host.
		 * @static
		 */
        getHost: function() {
            return ('' + WL.host);
        },

        /**
		 * Retrieves the page name from the URL.
		 * @method getPageName
		 * @return {String} The page name.
		 * @static
		 */
		getPageName: function() {
			return Core.getUrl().replace(/.*\/(.*)(\.|\?|\/).*/, '$1');
		},

        /**
		 * Retrieves the port from the location object; ensures is a string.
		 * @method getPort
		 * @return {String} The page port.
		 * @static
		 */
        getPort: function() {
            return ('' + WL.port);
        },

        /**
		 * Retrieves the protocol from the location object; ensures is a string.
		 * @method getProtocol
		 * @return {String} The page protocol.
		 * @static
		 */
        getProtocol: function() {
            return ('' + WL.protocol);
        },

        /**
		 * Retrieves the search from the location object; ensures is a string.
		 * @method getSearch
		 * @return {String} The page query string.
		 * @static
		 */
        getSearch: function() {
            return ('' + WL.search);
        },

		/**
		 * Retrieves the value of XSRF token from the DOM, or throws an exception when not found.
		 * @method getToken
		 * @return {String} The XSRF token.
		 * @static
		 */
		getToken: function() {
			var token = YAHOO.util.Dom.get('javascript-token').value;

			if (! token) {
				throw ('Token Node requested before DOM INPUT node "javascript-token" was made available.');
			}

			Core.getToken = function() {
				return token;
			};

			return Core.getToken();
		},

        /**
		 * Retrieves the URL from the location object; ensures is a string.
		 * @method getUrl
		 * @return {String} The page URL.
		 * @static
		 */
        getUrl: function() {
            return ('' + WL.href);
        },

		/**
		 * Sets the log level of the application.
		 * @method setLogLevel
		 * @param lvl {Number} Required. The new log level.
		 * @static
		 */
		setLogLevel: function(lvl) {_logLevel = lvl;},

        /**
         * Refreshes the page by calling window.location.reload.
         * @method reload
         * @static
         */
        reload: function() {
            WL.reload();
        },

        /**
         * Replaces the page by calling window.location.replace(DOMString URL); does not call create a browser history node.
         * @method replace
         * @param url {String} Optional. The URL.
         * @static
         */
        replace: function(url) {
            if (! url) {url = WL.href;}
            WL.replace('' + url);
        }
    };
}());/*
 * Copyright (c) 2009, Matt Snider, LLC All rights reserved.
 * Version: 1.0.00
 */

/**
 * The Controller class handles communication between JavaScript services, other media, and the server.
 * @namespace Core
 * @class Controller
 * @static
 */
(function() {
	// constants
var DEFAULT_TIMEOUT = 30000,
	YD = YAHOO.util.Dom,
	YL = YAHOO.lang,
	YC = YAHOO.util.Connect,
	TEXT_OBJ_NAME = Core.Controller,

	// local namespace
	_F = function () {},
	_this = null,
	_registeredConfigurationMap = {},

	// dom namespace
	_domBody = YD.getBodyElement(),
	_domLayer = YD.get('layer'),
	_domSearch = 'query';

    /**
     * Asserts that the current type is the same as the static type and that isType evaluates to true.
     * @method _assertType
     * @param type {String} Required. The expected response type.
     * @param sType {String} Required. The static type to compare to.
     * @param isType {Boolean} Required. The found response type.
     * @private
     */
    var _assertType = function(type, sType, isType) {
        if (isType && type !== sType) {
            YL.throwError('Assertion Failed - type="' + type + '" does not equal staticType="' + sType + '"');
        }
    };

	/**
	 * Updates the configuration object to the right value: call-time configuration, then cached, then default.
	 * @method _configureRequest
	 * @param vFx {String} Required. The YAHOO.lang validation function name.
	 * @param cfg {Object} Required. The current configuration object.
	 * @param cached {Object} Required. The cached configuration object.
	 * @param key {String} Required. The key on the configuration object.
	 * @param dflt {Object} Requried. The default value.
	 * @private
	 */
	var _configureRequest = function(vFx, cfg, cached, key, dflt) {
		if (! YL[vFx](cfg[key])) {
			cfg[key] = YL[vFx](cached[key]) ? cached[key] : dflt;
		}
	};

    /**
     * Evaluates if the provided type is valid.
     * @method _getValidType
     * @param type {String} Required. The type to evaluate.
     * @private
     */
    var _getValidType = function(type) {
        return (YL.isString(type) && (_this.TYPE_TEXT === type || _this.TYPE_JSON === type || _this.TYPE_XML === type)) ? type : _this.TYPE_UNKNOWN;
    };


	// event namespace
	var _E = {

	};


	// request namespace
	var _R = {

		/**
		 * YC callback function for aborted transactions.
		 * @method onAbort
		 * @param eventType {String} Required. The YUI event name.
		 * @param YUIObj {Object} Required. The YUI wrapped response.
		 * @private
		 */
		onAbort: function(eventType, YUIObj) {
			// todo: log error
		},

		/**
		 * YC callback function for complete transactions.
		 * @method onComplete
		 * @param eventType {String} Required. The YUI event name.
		 * @param YUIObj {Object} Required. The YUI wrapped response.
		 * @private
		 */
		onComplete: function(eventType, YUIObj) {
			// todo: stop showing the AJAX loading effect
		},


		/**
		 * YC callback function for failed transactions.
		 * @method onFailure
		 * @param eventType {String} Required. The YUI event name.
		 * @param YUIObj {Object} Required. The YUI wrapped response.
		 * @private
		 */
		onFailure: function(eventType, YUIObj) {
			var data = YUIObj[0],
                cfg = data.argument;

            if (YL.isFunction(cfg.failure)) {
                cfg.failure.call(this, data, cfg);
            }
		},

		/**
		 * YC callback function before starting transactions.
		 * @method onStart
		 * @param eventType {String} Required. The YUI event name.
		 * @param YUIObj {Object} Required. The YUI wrapped response.
		 * @private
		 */
		onStart: function(eventType, YUIObj) {
			// todo: start showing the AJAX loading effect
		},

		/**
		 * YC callback function for successful transactions.
		 * @method onSuccess
		 * @param eventType {String} Required. The YUI event name.
		 * @param YUIObj {Object} Required. The YUI wrapped response.
		 * @private
		 */
		onSuccess: function(eventType, YUIObj) {
			var data = YUIObj[0],
                cfg = data.argument;

			if (! cfg) {return;}

			// retrieve response values, test response type, and initialize local variables
			var doc = (data.responseXML), // parens are necessary for certain browsers
				txt = (data.responseText),
				hdr = (data.getResponseHeader),
				contentType = (hdr && hdr['Content-Type']) ? hdr['Content-Type'] : '',
				isJSON = YL.isDefined(txt) && (contentType.has(_this.TYPE_JSON, 'application/json') || '{' === txt.charAt(0)),
				isXML = YL.isDefined(doc) && contentType.has(_this.TYPE_XML, 'application/xml'),
                type = cfg.type,
                response = null;

            _assertType(type, _this.TYPE_JSON, isJSON);
            _assertType(type, _this.TYPE_XML, isXML);

            // is this a JSON response?
            if (isJSON) {
                response = txt.toJsonObject();
            }
            // is this an XML repsonse?
            else if (isXML) {
                response = doc;
            }
            // default to text
            else {
                response = txt;
            }

            if (YL.isFunction(cfg.success)) {
				_registeredConfigurationMap[cfg.requestId].isSending = false;
				_registeredConfigurationMap[cfg.requestId].response = response;
                cfg.success.call(this, response, cfg.argument, cfg);
            }
		},

		/**
		 * YC callback function for uploaded transactions.
		 * @method onUpload
		 * @param eventType {String} Required. The YUI event name.
		 * @param YUIObj {Object} Required. The YUI wrapped response.
		 * @private
		 */
		onUpload: function() {
			// do nothing for now
		},

		/**
		 * Make an asynchronous requests.
		 * @method send
		 * @param m {String} Required. The request method.
		 * @param url {String} Required. The request URL.
		 * @param cb {Object|Function} Optional. The YUI callback object or success callback function.
		 * @param args {Object} Optional. The argument object.
		 * @param data {String} Optional. The post data as a query string.
		 * @public
		 */
		send: function(m, url, cb, args, data) {
            var cfg = YL.isObject(cb) ? cb : {},
				cachedCfg = _registeredConfigurationMap[cfg.requestId] || {};

            // configure request object; will be placed into the YUIObject.argument value
            if (YL.isFunction(cb)) {cfg.success = cb;} // the callback object is a success function
            if (! YL.isString(cfg.requestId)) {cfg.requestId = 'ajaxRequest' + YL.getUniqueId();}
            if (! cachedCfg.success) { // success function declares at call-time; register it
                _this.registerAjaxCallback(cfg.requestId, cfg.type, cfg.success, cfg.failure);
				cachedCfg = _registeredConfigurationMap[cfg.requestId];
            }
			
			_configureRequest('isFunction', cfg, cachedCfg, 'failure', Core.emptyFunction);
			_configureRequest('isFunction', cfg, cachedCfg, 'success', Core.emptyFunction);
			_configureRequest('isObject', cfg, cachedCfg, 'scope', _this);
			_configureRequest('isNumber', cfg, cachedCfg, 'timeout', DEFAULT_TIMEOUT);
			_configureRequest('isString', cfg, cachedCfg, 'type', _this.TYPE_UNKNOWN);
			_configureRequest('isDefined', cfg, cachedCfg, 'argument', args);

			if (url) {
				cfg.url = url;
				if (data) {cfg.url += '?' + data;}
			}

			_registeredConfigurationMap[cfg.requestId].isSending = true;
			_registeredConfigurationMap[cfg.requestId].response = null;
			_registeredConfigurationMap[cfg.requestId].url = cfg.url;

			YC.asyncRequest(m, url || cfg.url, {argument: cfg, timeout: cfg.timeout}, data);
		}
	};

    /**
     * Inner function to handle 'post' and 'pget' requests as they need the same validation.
     * @method _postGet
     * @param functionName {String} Required. The function that called this method.
     * @param url {String} Required. The request URL w/ query parameters.
     * @param data {String|Array} Required. The post data as a query string or array of key/value pairs.
     * @param cb {Object|Function} Optional. The YUI callback object or success callback function.
     * @param a {Object} Optional. The argument object.
     * @private
     */
    var _postGet = function(functionName, url, data, cb, a) {
        var qData = YL.isString(data) ? data : '';

        if (YL.isArray(data)) {
            qData = data.join('&');
        }

        if (! YL.isString(url)) {YL.throwError(YL.ERROR_INVALID_PARAMETERS, TEXT_OBJ_NAME, functionName, 'String', url);}
        if (! qData) {YL.throwError(YL.ERROR_INVALID_PARAMETERS, TEXT_OBJ_NAME, functionName, 'String', data);}

        _R.send('post' === functionName ? 'POST' : 'GET', url, cb, a, qData);
    };


	// public namespace
	_F.prototype = {

        /**
         * The JSON type definition.
         * @property TYPE_JSON
         * @type {String}
         * @static
         * @final
         * @readonly Do not change this variable.
         */
        TYPE_JSON: 'text/json',

        /**
         * The text type definition.
         * @property TYPE_TEXT
         * @type {String}
         * @static
         * @final
         * @readonly Do not change this variable.
         */
        TYPE_TEXT: 'text/text',

        /**
         * The xml type definition.
         * @property TYPE_XML
         * @type {String}
         * @static
         * @final
         * @readonly Do not change this variable.
         */
        TYPE_XML: 'text/xml',

        /**
         * The unknown type definition.
         * @property TYPE_UNKNOWN
         * @type {String}
         * @static
         * @final
         * @readonly Do not change this variable.
         */
        TYPE_UNKNOWN: '',

		/**
		 * Command pattern method for fetching data from the backend.
		 * @method call
         * @param rId {String} Required. The id of the request.
		 * @param fx {String} Required. The callback function.
		 * @param url {String} Required. The request URL w/ query parameters; only use this for requests with dynamic variables.
		 * @static
		 */
		call: function(rId, fx, url) {
			var cfg = _registeredConfigurationMap[rId];

			if (! cfg) {
				YL.throwError('Core.Controlller.call - the provided requestId=' + rId + ' is not yet registered');
			}

			var callback = YL.isFunction(fx) ? fx : cfg.success; // execute provided function, default to success function

			// data is cached, go ahead an immediately execute the callback function
			if (cfg.response) {
				callback.call(this, cfg.response, cfg.argument, cfg);
			}
			// data is invalid or is being requested
			else {
				// date is not yet being fetched, fetch it
				if (! cfg.isSending) {
					_R.send('get', url || cfg.url, cfg);
				}

				// a new callback was provided; Wait until until the request has finished to execute.
				if (callback === fx) {
					YL.callLazy(function() {
						_this.call(rId, fx, url);
					}, function() {return ! _registeredConfigurationMap[rId].isSending;});
				}
			}
		},

		/**
		 * Make an asynchronous GET requests.
		 * @method get
		 * @param url {String} Required. The request URL w/ query parameters.
		 * @param cb {Object|Function} Optional. The YUI callback object or success callback function.
		 * @param a {Object} Optional. The argument object.
		 * @static
		 */
		get: function(url, cb, a) {
            if (! YL.isString(url)) {YL.throwError(YL.ERROR_INVALID_PARAMETERS, TEXT_OBJ_NAME, 'get', 'String', url);}
			_R.send('GET', url, cb, a, null);
		},

		/**
		 * Invalidates an object, so the next time it is requested, it is retrieved from the server.
		 * @method invalidate
         * @param rId {String} Required. The id of the request.
		 * @static
		 */
		invalidate: function(rId) {
			if (_registeredConfigurationMap[rId]) {
				_registeredConfigurationMap[rId].response = null;
			}
		},

		/**
		 * Make an asynchronous GET requests.
		 * @method pget
		 * @param url {String} Required. The request URL w/ query parameters.
		 * @param data {String|Array} Required. The query string or an array of query parameters, needing to be separated by '&'.
		 * @param cb {Object|Function} Optional. The YUI callback object or success callback function.
		 * @param a {Object} Optional. The argument object.
		 * @static
		 */
		pget: function(url, data, cb, a) {
            _postGet('pget', url, data, cb, a);
		},

		/**
		 * Make an asynchronous POST requests.
		 * @method post
		 * @param url {String} Required. The request URL.
		 * @param data {String|Array} Required. The query string or an array of query parameters, needing to be separated by '&'.
		 * @param cb {Object|Function} Optional. The YUI callback object or success callback function.
		 * @param a {Object} Optional. The argument object.
		 * @static
		 */
		post: function(url, data, cb, a) {
            _postGet('post', url, data, cb, a);
		},

        /**
         * Registers the provided function to execute when an AJAX request returns of the provided type and id.
         * @method registerAjaxCallback
         * @param rId {String} Required. The id of the request.
         * @param type {String} Required. The type of response expected.
		 * @param cb {Object|Function} Optional. The YUI callback object or success callback function.
         * @static
         */
        registerAjaxCallback: function(rId, type, cb) {
            if (! YL.isString(rId)) {return null;}
			var callback = YL.isObject(cb) ? cb : {};
			if (YL.isFunction(cb)) {callback.success = cb;}
			if (! YL.isFunction(callback.success)) {callback.success = Core.emptyFunction;} // this request has no static callback
			callback.type = _getValidType(type);
			callback.requestId = rId;
            _registeredConfigurationMap[rId] = callback;
        }
	};


	_this = new _F();
//
//	// Subscribe to all custom events fired by Connection Manager.
//	YC.startEvent.subscribe(evt.onStart, _this);
	YC.completeEvent.subscribe(_R.onComplete, _this);

	// This event will not fire for file upload transactions.  Instead,
	// subscribe to the uploadEvent.
	YC.successEvent.subscribe(_R.onSuccess, _this);

	// This event will not fire for file upload transactions.  Instead,
	// subscribe to the uploadEvent.
	YC.failureEvent.subscribe(_R.onFailure, _this);

	// This event is fired only for file upload transactions in place of
	// successEvent and failureEvent
	YC.uploadEvent.subscribe(_R.onUpload, _this);
	YC.abortEvent.subscribe(_R.onAbort, _this);

    Core.Controller = _this;
}());/*
 * Copyright (c) 2009, Matt Snider, LLC All rights reserved.
 * Version: 1.0.01
 */

/**
 * The console pacakge extends the "mvc/core.js" package with additional console logging capabilities. This package
 *  first attempts to use the FireBug console logger, and then, when that is not available will open a new browser window
 *  and log there.
 * @class Console
 * @static
 */
(function() {
    var _YD = YAHOO.util.Dom,
        _YL = YAHOO.lang;

    var _consoleBody,
        _consoleDoc,
        _consoleObject = {},
        _consoleWindow,
        _countTimerMap = {},
        _countNameMap = {},
        _nextLogType = null,
        _timeNameMap = {};

    var _HTML = '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><head><title>Mint Console Logger</title><style type="text/css">p{margin:0; padding: 0.25em;}div.log{font-family: console, arial, san-serif; font-size: 12px; border: 1px solid #EEE;color: #333; margin: 0; padding: 0.25em;}span.label{color:#009; font-weight:bold; padding-right: 0.25em;}</style></head><body><div>&nbsp;</div></body></html>';

    /**
     * Prepends the time onto the message.
     * @method _prependTime
     * @param message {String} Required. The value to prepend.
     * @private
     */
    var _prependTime = function(message) {
        return ('@' + (new Date()).formatTime() + ': ') + message;
    };

    /**
     * Evaluates if the FireBug console object is available.
     * @method _hasConsole
     * @return {Boolean} The console exists.
     * @private
     */
    var _hasConsole = function() {
        return window.console && window.console.firebug;
    };

    /**
     * Create a new one and pointers to interal document.
     * @method _setWindow
     * @private
     */
    var _setWindow = function() {
        if (! _consoleWindow) {
            _consoleWindow = window.open("","_consoleWindow","width=500,height=300,scrollbars=1,resizable=1");
            _consoleDoc = _consoleWindow.window.document;
            _consoleDoc.open();
            _consoleDoc.write(_HTML);
            _consoleDoc.close();
        }

        if (! _consoleBody) {
            _consoleBody = _YD.getBodyElement(_consoleDoc);
        }

        return (_consoleWindow && _consoleBody && _consoleDoc);
    };

    /**
     * Inserts a log statement into the logging window.
     * @method _log
     * @param message {String} Required. The message.
     * @param objectX {Object} Optional. Objects to substitue in message.
     * @private
     */
    var _log = function(message, objectX) {
        var args = arguments;

        _YL.callLazy(function() {
            var p = _consoleBody.insertBefore(_consoleDoc.createElement('div'), _YD.getFirstChild(_consoleBody)),
                j = args.length;

            message = _prependTime(message);
            p.className = 'log';

            if (_nextLogType) {
                var color = '#333',
                    symbol = '';

                switch (_nextLogType) {
                    case 'error':
                        color = '#900';
                        symbol = '(X)';
                    break;

                    case 'info':
                        symbol = '(i)';
                    break;

                    case 'warn':
                        _YD.setStyle(p, 'backgroundColor', '#0FF');
                        symbol = '(!)';
                    break;

                    default: // do nothing
                }

                _YD.setStyle(p, 'color', color);

                if (symbol) {
                    message = '<strong>' + symbol + ' </strong>' + message;
                }

                _nextLogType = null;
            }

            for (var i = 1; i < j; i += 1) {
                var arg = args[i], rx;

                if (_YL.isString(arg)) {
                    rx = /\%s/;
                }
                else if (_YL.isNumber(arg)) {
                    if (parseInt(arg) === arg) {
                        rx = /\%d|\%i/;
                    }
                    else {
                        rx = /\%f/;
                    }
                }
                else {
                    rx = /\%o/;
                }

                message = message.replace(rx, arg);
            }

            _YD.replace(p, message);
        }, _setWindow);
    };

    /**
     * Fetches the console object for logging; emulates console in non-FF browsers.
     * @method getConsole
     * @return {Object} The console object.
     * @static
     */
    Core.getConsole = function() {
        if (_hasConsole()) {
            /*
                note: the FireBug implementation of string substitution patterns does not check type, it simply
                    finds the first instance of a substitution pattern and replaces it with the agument in that position.
                    this means that console.log('test - %d %s', 's1', 's2') will produce the message "test - s1 s2" not "test - %d s1"
             */

			_consoleObject = window.console;
        }
        else {

            _YL.augmentObject(_consoleObject, {

                /**
                 * Tests an expression, inserting an error message, when false.
                 * @method assert
                 * @param message {String} Required. The message.
                 * @param objectX {Object} Optional. Objects to substitue in message.
                 * @param fileName {String} Required. The JavaScript filename; the second to last parameter.
                 * @param lineNumber {Number} Required. The line number; the last parameter.
                 * @public
                 */
                assert: function(message, objectX, fileName, lineNumber) {
                    var args = arguments;

                    if (! args[0]) {
                        args[0] = 'assertion <span class="label">false</span>';
                        _consoleObject.error.apply(this, args);
                    }
                },

                /**
                 * Writes the number of times that the line of code where count was called was executed.
                 * @method count
                 * @param name {String} Required. The name of this event.
                 * @param fileName {String} Required. The JavaScript filename.
                 * @param lineNumber {Number} Required. The line number.
                 * @public
                 */
                count: function(name, fileName, lineNumber) {
                    if (! _countNameMap[name]) {_countNameMap[name] = 0;}
                    _countNameMap[name] += 1;

                    // attempt to emulate the count logic logging that fires after codeblock is done in FireBug
                    clearTimeout(_countTimerMap[name]);
                    _countTimerMap[name] = setTimeout(function() {
                        _consoleObject.debug.call(this, '%s %i', name, _countNameMap[name], fileName, lineNumber);
                    }, 1000);
                },

                /**
                 * Inserts a debug statement into the logging window with a line number.
                 * @method debug
                 * @param message {String} Required. The message.
                 * @param objectX {Object} Optional. Objects to substitue in message.
                 * @param fileName {String} Required. The JavaScript filename; the second to last parameter.
                 * @param lineNumber {Number} Required. The line number; the last parameter.
                 * @public
                 */
                debug: function(message, objectX, fileName, lineNumber) {
                    var args = arguments;
                    args[0] += '; %s (line %d)';
                    _log.apply(this, args);
                },

                /**
                 * Prints a listing of all properties of the object.
                 * @method dir
                 * @param o {Object} Required. The evaluation object.
                 * @public
                 */
                dir: function(o) {
                    var sb = [];

                    for (var k in o) {
                        var obj = o[k],
                            s = '<p><span class="label">' + k + '</span>';

                        if (_YL.isFunction(obj)) {
                            s += 'function()';
                        }
                        else if (_YL.isDate(obj)) {
                            s += obj.formatTime();
                        }
                        else if (_YL.isObject(obj)) {
                            s += 'Object';
                        }
                        else if (_YL.isArray(obj)) {
                            s += 'Array';
                        }
                        else if (_YL.isString(obj)) {
                            s += '"' + obj + '"';
                        }
                        else if (_YL.isNumber(obj)) {
                            s += obj;
                        }
                        else if (_YL.isUndefined(obj)) {
                            s += 'Undefined';
                        }
                        else if (_YL.isNull(obj)) {
                            s += 'Null';
                        }

                        s += '</p>';
                        sb.push(s);
                    }

                    // sorts the functions to the end, everything else alphabetically
                    sb.sort(function(a, b) {
                        var aIsFunction = -1 < a.indexOf('function()');
                        var bIsFunction = -1 < b.indexOf('function()');

                        if (aIsFunction && ! bIsFunction) {
                            return 1;
                        }
                        else if (bIsFunction && ! aIsFunction) {
                            return -1;
                        }
                        // sort alpha
                        else {
                            var rx = /.*?\"\>(.*)?\<\/span\>.*/,
                                nameA = a.replace(rx, '$1'),
                                temp = [nameA, b.replace(rx, '$1')];

                            temp.sort();
                            return nameA === temp[0] ? -1 : 1;
                        }
                    });

                    _log(sb.join(''));
                },

                /**
                 * Prints the XML source tree of an HTML or XML element.
                 * @method dirxml
                 * @param node {Element} Required. The evaluation element.
                 * @public
                 */
                dirxml: function(node) {
                    // todo: implement
                },

                /**
                 * Inserts an error statement into the logging window with a line number.
                 * @method error
                 * @param message {String} Required. The message.
                 * @param objectX {Object} Optional. Objects to substitue in message.
                 * @param fileName {String} Required. The JavaScript filename; the second to last parameter.
                 * @param lineNumber {Number} Required. The line number; the last parameter.
                 * @public
                 */
                error: function(message, objectX, fileName, lineNumber) {
                    _nextLogType = 'error';
                    _consoleObject.debug.apply(this, arguments);
                },

                /**
                 * Writes a message to the console and opens a nested block to indent all future messages sent to the console; filename and linenumber required.
                 * @method group
                 * @param message {String} Required. The message.
                 * @param objectX {Object} Optional. Objects to substitue in message.
                 * @param fileName {String} Required. The JavaScript filename; the second to last parameter.
                 * @param lineNumber {Number} Required. The line number; the last parameter.
                 * @public
                 */
                group: function(message, objectX, fileName, lineNumber) {
                    // todo: implement
                },

                /**
                 * Closes the most recently opened block created by a call to console.group.
                 * @method groupEnd
                 * @param message {String} Required. The message.
                 * @param objectX {Object} Optional. Objects to substitue in message.
                 * @param fileName {String} Required. The JavaScript filename; the second to last parameter.
                 * @param lineNumber {Number} Required. The line number; the last parameter.
                 * @public
                 */
                groupEnd: function(message, objectX, fileName, lineNumber) {
                    // todo: implement
                },

                /**
                 * Inserts an info statement into the logging window with a line number.
                 * @method info
                 * @param message {String} Required. The message.
                 * @param objectX {Object} Optional. Objects to substitue in message.
                 * @param fileName {String} Required. The JavaScript filename; the second to last parameter.
                 * @param lineNumber {Number} Required. The line number; the last parameter.
                 * @public
                 */
                info: function(message, objectX, fileName, lineNumber) {
                    _nextLogType = 'info';
                    _consoleObject.debug.apply(this, arguments);
                },

                /**
                 * Inserts a log statement into the logging window.
                 * @method log
                 * @param message {String} Required. The message.
                 * @param objectX {Object} Optional. Objects to substitue in message.
                 * @public
                 */
                log: _log,

                /**
                 * Prevents the profile call from throwing an exception in non-FireBug enabled browsers.
                 * @method profile
                 * @public
                 */
                profile: function() {
                    _log('profile unimplemented');
                },

                /**
                 * Prevents the profileEnd call from throwing an exception in non-FireBug enabled browsers.
                 * @method profileEnd
                 * @public
                 */
                profileEnd: function() {
                    _log('profileEnd unimplemented');
                },

                /**
                 * Creates a new timer under the given name. Call console.timeEnd(name) with the same name to stop the timer and print the time elapsed.
                 * @method time
                 * @param name {String} Required. The name of this event.
                 * @public
                 */
                time: function(name) {
                    _timeNameMap['' + name] = new Date();
                },

                /**
                 * Stops a timer created by a call to console.time(name) and writes the time elapsed.
                 * @method timeEnd
                 * @param name {String} Required. The name of this event.
                 * @param fileName {String} Required. The JavaScript filename.
                 * @param lineNumber {Number} Required. The line number.
                 * @public
                 */
                timeEnd: function(name) {
                    if (_timeNameMap['' + name]) {
                        var args = arguments;
                        args[0] = name + ': ' + Date.diff(null, _timeNameMap['' + name], Date.MILLISECOND) + 'ms';
                        _consoleObject.debug.apply(this, args);
                    }
                },

                /**
                 * Prevents the trace call from throwing an exception in non-FireBug enabled browsers.
                 * @method trace
                 * @public
                 */
                trace: function() {
                    _log('Trace unimplemented');
                },

                /**
                 * Inserts a warn statement into the logging window with a line number.
                 * @method warn
                 * @param message {String} Required. The message.
                 * @param objectX {Object} Optional. Objects to substitue in message.
                 * @param fileName {String} Required. The JavaScript filename; the second to last parameter.
                 * @param lineNumber {Number} Required. The line number; the last parameter.
                 * @public
                 */
                warn: function() {
                    _nextLogType = 'warn';
                    _consoleObject.debug.apply(this, arguments);
                }
            });
        }

        Core.getConsole = function() {return _consoleObject;};
        return _consoleObject;
    };
})();/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.01.00
 */

/**
 * The EventDispatcher class dispatches events for an entire page, using .
 * @namespace Core.Util
 * @class EventDispatcher
 * @static
 */
(function() {
    // local variables
    var _callbackMap = {},
        _DOC = document,
        _rx = /\bcom_\w+\b/g,
        _YE = YAHOO.util.Event;

    // event namespace
    var _E = {

        /**
         * The generic event dispatcher callback; passes these parameters into callback(event, targetNode, flattenedArguments...).
         * @method dispatcher
         * @param e {Event} Required. The triggered JavaScript event.
         * @private
         */
        dispatcher: function(e) {
            var node = _YE.getTarget(e);

            // simulate bubbling
            while (node && node !== _DOC) {
                var coms = node.className.match(_rx);

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
                            carr = _callbackMap[e.type][id];

                        // object for command exists, command could be for another event
                        if (carr && carr.length) {
                            // iterate on command callbacks
                            for (j = 0; j < carr.length; j += 1) {
                                var o = carr[j],
                                    args = [e, node];

                                if (o.eventFx) {o.eventFx.call(_YE, e);} // event stop events
                                o.callback.apply(o.scope, args.concat(o.arguments));
                            }
                        }
                    }
                }

                node = node.parentNode;
            }
        }
    };

   	// public namespace
	Core.Util.EventDispatcher = {

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
            if (! _callbackMap[type]) {
                _callbackMap[type] = {};
                _YE.on(_DOC, type, _E.dispatcher);
            }

            if (! _callbackMap[type][o.id]) {_callbackMap[type][o.id] = [];}
            if (! o.scope) {o.scope = window;}
            if (! o.arguments) {o.arguments = [];}
            if (! YAHOO.lang.isArray(o.arguments)) {o.arguments = [o.arguments];} // support arguments _that are non arrays
            _callbackMap[type][o.id].push(o);
        },

        /**
         * Call this method to register an event the first time _that ID is provided, and not subsequent times.
         * @method registerOnce
         * @param type {String} Required. The event type (ie. 'click').
         * @param o {Object} Required. The event data.
         * @static
         */
        registerOnce: function(type, o) {
            if (! (_callbackMap[type] || _callbackMap[type][o.id])) {
                register(type, o);
            }
        }
    };
}());/*
 * Copyright (c) 2010, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.00
 */

(function() {
	var DOC = document;

	/*
	 * W3C DOM Level 2 standard node types; for older browsers and IE.
	 */
	if (! DOC.ELEMENT_NODE) {
		DOC.ELEMENT_NODE = 1;
		DOC.ATTRIBUTE_NODE = 2;
		DOC.TEXT_NODE = 3;
		DOC.CDATA_SECTION_NODE = 4;
		DOC.ENTITY_REFERENCE_NODE = 5;
		DOC.ENTITY_NODE = 6;
		DOC.PROCESSING_INSTRUCTION_NODE = 7;
		DOC.COMMENT_NODE = 8;
		DOC.DOCUMENT_NODE = 9;
		DOC.DOCUMENT_TYPE_NODE = 10;
		DOC.DOCUMENT_FRAGMENT_NODE = 11;

		/**
		 * The DOM nodeType for notation node.
		 * @type Number
		 * @property NOTATION_NODE
		 * @constant
		 */
		DOC.NOTATION_NODE = 12;
	}

var Socialmize,
__STATIC_URL = '/assets/js/',
//var base = '../';
$VERSION = '.js?r=3';
//var $VERSION = '.js?r=' + Math.random(),
window.$YO = {
//		base: 'http://yui.localhost/yui3/build/',
	filter: 'raw',
	combine: true,
	timeout: 10000,
	useBrowserConsole: true,
	logLevel: 'warn',
	debug: true,
	modules: {

		'cameleon-notification': {
			fullpath: __STATIC_URL + 'widget/Notification' + $VERSION,
			requires: ['node', 'widget', 'yui3-ext', 'io'],
			optional: [],
			supersedes: []
		},

		'core': {
			fullpath: __STATIC_URL + 'js/upvote' + $VERSION,
			requires: ['node', 'dom', 'event', 'io', 'anim', 'widget', 'container']
		},

		'gallery-admin-field': {
			fullpath: __STATIC_URL + 'widget/AdminField' + $VERSION,
			requires: ['gallery-anim-blind', 'gallery-anim-slide', 'collection'],
			optional: [],
			supersedes: []
		},

		'gallery-anim-blind': {
			fullpath: __STATIC_URL + 'widget/AnimBlind' + $VERSION,
			requires: ['anim', 'widget'],
			optional: [],
			supersedes: []
		},

		'gallery-anim-slide': {
			fullpath: __STATIC_URL + 'widget/AnimSlide' + $VERSION,
			requires: ['anim', 'widget'],
			optional: [],
			supersedes: []
		},

		'gallery-node-field': {
			fullpath: __STATIC_URL + 'widget/NodeField' + $VERSION,
			requires: ['base', 'node'],
			optional: [],
			supersedes: []
		},

		'gallery-node-form': {
			fullpath: __STATIC_URL + 'widget/NodeForm' + $VERSION,
			requires: ['base', 'node', 'gallery-node-field'],
			optional: [],
			supersedes: []
		},

		'gallery-node-input': {
			fullpath: __STATIC_URL + 'widget/NodeInput' + $VERSION,
			requires: ['base', 'node'],
			optional: [],
			supersedes: []
		},

		'gallery-tab-manager': {
			fullpath: __STATIC_URL + 'widget/TabManager' + $VERSION,
			requires: ['widget', 'yui3-ext'],
			optional: [],
			supersedes: []
		},

//		'matt_searchableListOfCheckboxes': {
//			fullpath: __STATIC_URL + 'widget/SearchableListOfCheckboxes' + $VERSION,
//			requires: ['widget', 'datasource', 'json', 'yui3-ext', 'matt_form'],
//			optional: [],
//			supersedes: []
//		},

		'searchable_checkboxes': {
			fullpath: __STATIC_URL + 'widget/SearchableCheckboxes' + $VERSION,
			requires: ['widget', 'datasource-io', 'datasource-jsonschema', 'datasource-cache', 'json', 'substitute', 'yui3-ext', 'matt_form'],
			optional: [],
			supersedes: []
		},

		'matt_form': {
			fullpath: __STATIC_URL + 'util/form' + $VERSION,
			requires: ['base', 'collection'],
			optional: [],
			supersedes: []
		},

		'searchableFilter': {
			fullpath: __STATIC_URL + 'widget/SearchableFilter' + $VERSION,
			requires: ['io-base', 'checkboxList', 'gallery-node-form', 'gallery-node-field'],
			optional: [],
			supersedes: []
		},

		'yui3-ext': {
			fullpath: __STATIC_URL + 'widget/YUI3-Ext' + $VERSION,
			requires: ['base', 'widget', 'node', 'anim', 'collection'],
			optional: [],
			supersedes: []
		}
	}
};

YUI($YO).use('yui3-ext', 'gallery-node-input', 'node', 'io-base', function(Y) {

	var _domXhrLoading = Y.one('#xhr-loading'),
		//	_domNptSearch = Y.one('#query'),

			_lastTransactionId, _timer,

			_clearTimer = function() {
				if (_timer) {_timer.cancel();}
			},

			_handleComplete = function() {
				if (0 <= _lastTransactionId) {
					_lastTransactionId = null;
					toggleXhrLoader(false);
					_clearTimer();
				}
			};

	//if (_domNptSearch) {new Y.NodeInput({input: _domNptSearch, blurText: 'search by name or keyword'});}

	function toggleXhrLoader(fl, i) {
		var text = i ? 'saving...' : 'loading...', dim, viewport;
		_domXhrLoading.set('innerHTML', text);
		_domXhrLoading.toggleDisplay(fl);
		dim = _domXhrLoading.get('region');
		viewport = _domXhrLoading.get('viewportRegion');
		_domXhrLoading.setXY([(viewport.width / 2) - (dim.width / 2), 0]);
	}

	window._initIO = function(Y) {
		Y.on('io:start', function(transactionId) {
			_lastTransactionId = transactionId;
			toggleXhrLoader(true);
			_clearTimer();
			_timer = Y.later(2500, this, _handleComplete);

		});

		Y.on('io:complete', _handleComplete);
	};

	Y.on('domready', function() {
		document.getElementById('project').onclick = null;
	});

});

Socialmize = YUI.namespace('Env.Socialmize');

Socialmize.STATIC_URL = __STATIC_URL;

// create Global namespace variables
Socialmize.FB = {
	fb_cmd_queue: [],

	exec: function(sFuncName, args) {
		if (! window.FB) {
			this.fb_cmd_queue.push(arguments)
		}
	},

	exec_actual: function(sFuncName, args) {
		FB[sFuncName].apply(FB, args);
	}
};

Socialmize.trackGA = function(sPageName) {
	if (window._gaq) {
		_gaq.push(['_trackPageview', sPageName]);
	}
};
}());/**
 * Copyright (c) 2010, Matt Snider, LLC. All rights reserved.
 * Version: 1
 */

YUI($YO).add('gallery-anim-blind', function(Y) {

var CLS_IS_OPEN = 'isOpen';

/**
 * The AnimBlind is a blind animation manager.
 * @class AnimBlind
 * @dependencies library
 */
function AnimBlind() {
	AnimBlind.superclass.constructor.apply(this,arguments);
	this._clickHandler = null;
	this._queue = [];
}

Y.mix(AnimBlind, {
	/**
	 * @property AnimBlind.NAME
	 * @type String
	 * @static
	 */
	NAME : 'gallery-anim-blind',

	/**
	 * @property AnimBlind.ATTRS
	 * @type Object
	 * @static
	 */
	ATTRS : {

		/**
		 * @attribute isOpen
		 * @type Boolean
		 * @default false
		 * @description The animated state.
		 */
		isOpen: {
			value: false
		},

		/**
		 * @attribute trigger
		 * @type String|Node
		 * @default null
		 * @description The triggering element.
		 */
		trigger: {
			value: null,
			setter: function(val) {
				return Y.one(val);
			},
			validator: function(val) {
				return Y.one(val);
			}
		}
	}
});

Y.extend(AnimBlind, Y.Widget, {

	/**
	 * @property _isAnimating
	 * @type Boolean
	 * @description The animating state.
	 */
	_isAnimating: null,

	/**
	 * @property _clickHandler
	 * @type Object
	 * @description The event handler for the trigger click listener.
	 */
	_clickHandler: null,

	/**
	 * @property _queue
	 * @type Array
	 * @description A collection of triggering events.
	 */
	_queue: null,

	/**
	 * The callback function for ending the blind animation.
	 * @method _handleAnimEnd
	 * @protected
	 */
	_handleAnimEnd: function() {
		var that = this;
		that._isAnimating = false;
		that._queue.shift();
		that.set(CLS_IS_OPEN, ! that.get(CLS_IS_OPEN));
		that.syncUI();
		that.fire('toggle');

		if (that._queue.length) {that._handleClick.apply(that, that._queue.shift());}
	},

	/**
	 * The callback function for each step of the blind animation; scrolls the page as necessary.
	 * @method _handleAnimTween
	 * @protected
	 */
	_handleAnimTween: function() {
		if (! this.get(CLS_IS_OPEN)) {
			var elBb = this.get('boundingBox'),
				oDim = elBb.get('region'),
				nViewportHeight = elBb.get('winHeight'),
				nScrollTop, nTopToScroll;

			// if the dim.height is greater than viewport, then don't animate scroll, as it will not work well
			if (oDim.height < nViewportHeight) {
				nScrollTop = elBb.get('docscrollY');
				nTopToScroll = oDim.bottom + 20 - (nScrollTop + nViewportHeight);

				// need to scroll, viewable area exceeds the bottom of the animating div
				if (0 < nTopToScroll) {
					window.scroll(0, nScrollTop + nTopToScroll);
				}
			}
		}
	},

	/**
	 * The callback function for clicking on the trigger.
	 * @method _handleClick
	 * @param e {Event} Required. The triggered JavaScript 'click' event.
	 * @protected
	 */
	_handleClick: function(e) {
		var that = this,
			elBb, elContent, oAnim, nTo;

		e.halt();
		that._queue.push(arguments);

        if (! that._isAnimating) {
			elBb = that.get('boundingBox');
			elContent = that.get('contentBox');
            nTo = that.get(CLS_IS_OPEN) ? 0 : elContent.get('region').height;

            that._isAnimating = true;

			oAnim = new Y.Anim({
				node: elBb,
				to: {height: nTo}
			});

			oAnim.set('duration', 0.5);
			oAnim.set('easing', Y.Easing.easeBoth);
			oAnim.on('end', that._handleAnimEnd, that);
			oAnim.on('tween', that._handleAnimTween, that);
			oAnim.run();
        }
	},

	/*
	 * @see Y.Widget#bindUI
	 */
	bindUI: function() {
		this._clickHandler = this.get('trigger').on('click', this._handleClick, this);
	},

	/*
	 * @see Y.Base#destructor
	 */
	destructor: function () {
		AnimBlind.superclass.destructor.apply(this, arguments);
		if (this._clickHandler) {this._clickHandler.detach();}
		this._clickHandler = null;
	},

	/*
	 * @see Y.Base#initializer
	 */
	initializer: function () {
		AnimBlind.superclass.initializer.apply(this, arguments);
	},

	/*
	 * @see Y.Widget#renderUI
	 */
	renderUI: function() {

	},

	/*
	 * @see Y.Widget#syncUI
	 */
	syncUI: function() {
		var elBb = this.get('boundingBox'),
			nHeight = this.get('contentBox').get('region').height,
			bIsOpen = this.get(CLS_IS_OPEN);

		elBb.toggleClass(CLS_IS_OPEN, bIsOpen);
		this.get('trigger').toggleClass(CLS_IS_OPEN, bIsOpen);
		if (bIsOpen) {elBb.setStyle('height', nHeight + 'px');}
	},

	/**
	 * Triggers a toggle as if a trigger anchor is clicked by a user.
	 * @method toggle
	 * @static
	 */
	toggle: function() {
		Y.Event.simulate(this.get('trigger')._node, "click");
	}
});

Y.AnimBlind = AnimBlind;

}, "@VERSION@", {requires: ['anim', 'widget']});/**
 *	Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 *	Version: 1.0
 */

/**
 *  The SearchResult class manages the business logic of all search result pages.
 *  @namespace Core.Controller
 *  @class SearchResult
 *  @dependencies library
 *//*
Core.Controller.SearchResult = (function() {
	// constants
var YU = YAHOO.util,
	E = YU.Event,
	FE = YU.Form.Element,

    // DOM namespace
	_domQuery = $('q'),
	_domQueryGroupFooter = $('group-footer-search'),
	_domResultFilter = $('resultFilter');

    FE.attachFocusAndBlur(_domQuery, 'user name or email');
    FE.attachFocusAndBlur(_domQueryGroupFooter, 'group name or email');

    E.addListener(_domResultFilter, 'submit', function() {
        if (FE.getValue(_domQuery)) {

        }
    });

	return {};
}());*/

YUI($YO).use('gallery-node-input', function(Y) {
	var searchFooter = Y.one('#group-footer-search'),
		blurText = searchFooter ? 'group name or email' : 'user name or email';
	
	new Y.NodeInput({input: '#q', blurText: blurText});
	if (searchFooter) {new Y.NodeInput({input: searchFooter, blurText: blurText});}
});