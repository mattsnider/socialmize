/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.00
 */

YUI.add('yui3-ext', function(Y) {

	var Lang = Y.Lang,
			Dom = Y.DOM,

			CLS_ANIMATING = 'animating',
			CLS_DISPLAY_NONE = 'displayNone',
			CLS_DISABLED = 'disabled',
			CLS_HIDDEN = 'hidden',

			DEFAULT_DURATION = 0.5,

			RX_XML_TAGS = /<\/?[^>]+>/gi,
			RX_URL_DOMAIN = /\?.*/,
			RX_URL_SPLIT = /.*?\?/,

		// local variables
			_elBody = new Y.Node(Y.DOM.byId('project'));

	function fnWrapeNode(fn) {
		var oRet = null;

		if (fn) {
			oRet = ('string' == typeof fn) ?
				   function(n) {
					   return Y.Selector.test(n, fn);
				   } :
				   function(n) {
					   return fn(Y.one(n));
				   };
		}

		return oRet;
	}

	Y.stopTimer = function(timer) {
		if (timer) {timer.cancel();}
	};

	Y.Event.off = function(e) {
		if (e) {e.detach();}
	};

	Y.Lang.isPositiveNumber = function(o) {
		return Y.Lang.isNumber(o) && 0 <= o;
	};


	if (! Y.Page) {Y.Page = {};}
	Y.mix(Y.Page, {
		_mapImages: {},

		getBody: function() {
			return _elBody;
		},

		/**
		 * Returns an image object with src, useful for image caching.
		 * @method getImage
		 * @param sSrc {String} Required. The location of the image.
		 * @param sAlt {String} Optional. Alternate text.
		 * @return {Image} A Javascript Image Object with the src set.
		 * @static
		 */
		getImage: function(sSrc, sAlt) {
			var elImg = this._mapImages[sSrc],
					elParent;

			if (elImg) {
				elImg = elImg.cloneNode(true);
			} else {
				elParent = document.createElement('div');
				elImg = elParent.appendChild(document.createElement('img'));
				elImg.alt = sAlt;
				elImg.src = sSrc;
				elParent.style.left = '-4000px';
				elParent.style.position = 'absolute';
				elImg = _elBody._node.appendChild(elImg);
			}

			return new Y.Node(elImg);
		},

		reload: function() {
			Y.Page.replace(window.location.href);
		},

		replace: function(url) {
			window.location.href = url;
		}
	});

	Y.mix(Y.namespace('String'), {

		/**
		 * Retrieves value for the given key out of the url query string.
		 *  ex: url="?id=1234&type=special" then, getQueryValue(url,"id") == "1234"
		 * @method getQueryValue
		 * @param str {String} Required. The query value to parse.
		 * @param key {String} Required. The key value you want to retrieve.
		 * @return {String} The value of the key or empty string.
		 * @static
		 */
		getQueryValue: function(str, key) {
			var sUrl = ('&' === str.charAt(0) || '?' === str.charAt(0)) ? str : '?' + str, // prevents malformed url problem
					rxFindKeyValue = new RegExp('[\\?&]' + key + '=([^&#]*)'),
					aResults = rxFindKeyValue.exec(sUrl);
			return aResults ? aResults[1] : '';
		},

		/**
		 * Fetches the parsed URL, where [0] = url and [1] = query string.
		 * @method parseUrl
		 * @param str {String} Required. The URL to parse.
		 * return {Array} The URL.
		 * @static
		 */
		parseUrl: function(str) {
			return [str.replace(RX_URL_DOMAIN, ''), str.replace(RX_URL_SPLIT, '')];
		},

		/**
		 * Removes the rx pattern from the string.
		 * @method remove
		 * @param str {String} Required. The string to parse.
		 * @param rx {RegExp} Required. The regex to use for finding characters to remove.
		 * @return {String} The cleaned string.
		 * @public
		 */
		remove: function(str, rx) {
			return str.replace(rx, '');
		},

		/**
		 * HTML tags from the string.
		 * @method stripTags
		 * @param str {String} Required. The string to parse.
		 * @return {String} The cleaned string.
		 * @public
		 */
		stripTags: function(str) {
			return this.remove(str, RX_XML_TAGS);
		}
	});

	if (! Y.Number) {Y.Number = {};}
	Y.mix(Y.Number, {

		/**
		 * Convert the string to a number.
		 * @param str {String} Required. The string to convert.
		 * @param isInt {Boolean} Optional. Use parseInt instead of parseFloat.
		 */
		parse: function(str, isInt) {
			return isInt ? parseInt(str.replace(/\.\d+|\D/g, '')) : parseFloat(str.replace(/[^\.\D]+/g, ''));
		}
	});

	Y.mix(Y.Array, {

		/**
		 * Evaluates if the value is in the array.
		 * @method has
		 * @param aHaystack {Array} Required. The array to search.
		 * @param oNeedle {Mixed} Required. The value to evaluate.
		 * @return {Boolean} The needle is in the haystack.
		 * @public
		 */
    has: function(aHaystack, oNeedle) {
      return -1 < Y.Array.indexOf(aHaystack, oNeedle);
    },

		/**
		 * Remove the member at index (i) in the array; does not modify the original array.
		 * @method removeIndex
		 * @param aHaystack {Array} Required. The array to modify.
		 * @param nIndex {Number} Required. The index to remove.
		 * @return {Object} The new Array or Original.
		 * @public
		 */
		removeIndex: function(aHaystack, nIndex) {
			if (0 > nIndex || nIndex >= aHaystack.length) {return this;} // invalid index
			var aResp = aHaystack.slice(0, nIndex),
					aRest = aHaystack.slice(nIndex + 1);
			return aResp.concat(aRest);
		},

		/**
		 * Removes the provided value from the array, by leveraging the indexOf function to find the index and passing that to removeIndex.
		 * @method removeValue
		 * @param aHaystack {Array} Required. The array to modify.
		 * @param oNeedle {Mixed} Required. The value to remove.
		 * @return {Object} The new Array or Original.
		 * @public
		 */
		removeValue: function(aHaystack, oNeedle) {
			var nIndex = Y.Array.indexOf(aHaystack, oNeedle);

			if (-1 < nIndex) {
				return Y.Array.removeIndex(aHaystack, nIndex);
			}

			return aHaystack;
		}
	});

	// augment the Node object
	Y.mix(Y.Node.prototype, {

		/**
		 * Animates and toggles the display className.
		 * @method animateDisplay
		 * @param bool {Boolean} Required. Force class instead of toggle.
		 * @public
		 */
		animateDisplay: function(bool) {
			var that = this,
					fnEnd = bool ? function() {} : function() {that.toggleDisplay(bool);},
					fnStart = bool ? function() {that.toggleDisplay(bool);} : function() {},
					oAnim = new Y.Anim({duration: DEFAULT_DURATION, node: that, to: {opacity: bool ? 1 : 0}, on:{end: fnEnd, start: fnStart}});

			oAnim.run();
		},

		/**
		 * Delete the DOM node.
		 * @method deleteNode
		 * @param conf {Object} Optional. The configuration.
		 * @return {Object} The animation or NUll.
		 * @public
		 */
		deleteNode: function(conf) {
			var that = this,
					oAnim;

			function fnRemove() {
				that.parent().removeChild(that);
			}

			if (Lang.isObject(conf)) {
				oAnim = new Y.Anim({node: that, to: {opacity: 0}});

				if (this.hasClass(CLS_ANIMATING)) {return null;}

				Y.each(conf, function(fn, key) {
					oAnim.on(key, fn);
				});

				oAnim.on('end', fnRemove);

				that.addClass(CLS_ANIMATING);

				oAnim.run();
				return oAnim;
			} else {
				fnRemove();
				return null;
			}
		},

		first: function(fn, all) {
			return Y.one(Dom.elementByAxis({nextSibling: this._node.firstChild}, 'nextSibling', fnWrapeNode(fn), all));
		},

		/**
		 * Fetches normalizes tagName.
		 * @method getTagName
		 * @return {String} The tagName.
		 * @public
		 */
		getTagName: function() {
			return this.get('tagName').toLowerCase();
		},

		hasClassIn: function(arr) {
			return Y.Array.find(arr, function(o) {
				return this.hasClass(o);
			}, this);
		},

		hide: function() {
			this.addClass(CLS_DISPLAY_NONE);
		},

		/**
		 * Evaluate if the Node is disabled.
		 * @method isDisabled
		 * @return {Boolean} The `disabled` class is applied
		 * @public
		 */
		isDisabled: function() {
			return this.hasClass(CLS_DISABLED);
		},

		/**
		 * Evaluate if the element is of one of the provided tagNames.
		 * @method isTagName
		 * @param arg1 {String} Required. A tagName to evaluate.
		 * @param argX {String} Optional. Additional tagName to evaluate.
		 * @return {Boolean} The element type matches one of the provided types.
		 * @public
		 */
		isTagName: function() {
			var sTagName = this.getTagName();

			return Y.Array.find(arguments, function(o) {
				return o == sTagName;
			});
		},

		last: function(fn, all) {
			return Y.one(Dom.elementByAxis({previousSibling: this._node.lastChild}, 'previousSibling', fnWrapeNode(fn), all));
		},

		/**
		 * Replaces the content of this element with a loading graphic.
		 * @method loading
		 * @public
		 */
		loading: function() {
			this.set('innerHTML', '');
			this.appendChild(Y.Page.getImage('/assets/images/icons/ajax-loader.gif'));
			this.toggleDisplay(true);
		},

		parent: function() {
			return this.get('parentNode');
		},

		/**
		 * Removes all children from the node.
		 * @method removeChildNodes
		 * @param useCompliant {Boolean} Optional. Force use of standard compliant method (generally slower).
		 * @public
		 */
		removeChildNodes: function(useCompliant) {
			if (useCompliant) {
				var oChildNodes = this.get('childNodes');

				if (oChildNodes) {
					oChildNodes.each(function(el) {
						el.deleteNode();
					});
				}
			}
			else {
				this.set('innerHTML', '');
			}
		},

		show: function() {
			this.removeClass(CLS_DISPLAY_NONE);
		},

		/**
		 * Toggles the className for the provided element as a result of the boolean.
		 * @method toggleClass
		 * @param className {String} Required. The class name to apply.
		 * @param bool {Boolean} Optional. Force class instead of toggle.
		 * @return {Boolean} The class was added.
		 * @public
		 */
		toggleClass: function(className, bool) {
			bool = Lang.isUndefined(bool) ? ! this.hasClass(className) : bool;
			this[bool ? 'addClass' : 'removeClass'](className);
			return bool;
		},

		/**
		 * Toggles the display className.
		 * @method toggleClass
		 * @param bool {Boolean} Optional. Force class instead of toggle.
		 * @return {Boolean} Is displayed.
		 * @public
		 */
		toggleDisplay: function(bool) {
			return ! this.toggleClass(CLS_DISPLAY_NONE, Lang.isUndefined(bool) ? bool : ! bool);
		},

		/**
		 * Toggles the visibility className.
		 * @method toggleClass
		 * @param bool {Boolean} Optional. Force class instead of toggle.
		 * @return {Boolean} Is visible.
		 * @public
		 */
		toggleVisibility: function(bool) {
			return ! this.toggleClass(CLS_HIDDEN, Lang.isUndefined(bool) ? bool : ! bool);
		}
	}, true);

	Y.NodeList.prototype.find = function(fn) {
		if (this.size()) {
			var elNode = Y.Array.find(this._nodes, function(elem) {
				return fn(new Y.Node(elem));
			});

			return elNode ? new Y.Node(elNode) : null;
		}
	};

	Y.Base.prototype.sfx = function(fnConstructor, funcName, args) {
		fnConstructor.superclass[funcName].apply(this, args || []);
	};

	Y.mix(Y.Widget.prototype, {
		_idPrefix: null,

		_initializer: Y.Widget.prototype.initializer,

		initializer: function() {
			var sId,
					elBb = this.get('boundingBox');

			if (elBb) {
				sId = elBb.get('id');
			}

			if (! sId) {
				sId = this.get('id');
			}

			if (elBb) {
				elBb.set('id', sId);
			}

			this._idPrefix = '#' + sId;
			this._initializer.apply(this, arguments);
		},

		/**
		 * Fetches the node specified by the ID or returns the bounding box.
		 * @method getNode
		 * @param id {String} Optional. The id suffix.
		 * @public
		 */
		getNode: function(id) {
			return id ? Y.one(this._idPrefix + id) : this.get('boundingBox')
		},

		/**
		 * Executes the hide or show function based on the visibility value.
		 * @method toggle
		 * @param bIsVisible {Boolean} Required. Show the widget.
		 * @public
		 */
		toggle: function(bIsVisible) {
			this[bIsVisible ? 'show' : 'hide']();
		}
	}, true);

	Socialmize = YUI.namespace('Env.Socialmize');

	if (Socialmize.Dispatcher) {
		Y.Dispatcher = Socialmize.Dispatcher;
	}
	else {
		function is_cmd_class(sClass, sName) {
			return sClass && 0 === sClass.indexOf('cmd-' + (sName ? sName : ''));
		}

		function parse_class(sClass) {
			var sValue = sClass.substr(4),
				options = sValue.replace(/\w+\[(.*)\]/, '$1'),
				sName = sValue.replace(/(\w+)(\[.*)?/, '$1');

			return [sName, options]
		}

		////
		// Dispatch logic
		////
		Y.on('click', function(e) {
			var elTarg = e.target,
				that = this,
				elNode;

			while (elTarg && (elNode = elTarg.ancestor('*[class^=cmd-]', true))) {
				Y.each(elNode.get('className').split(/\s+/), function(sClass) {
					if (is_cmd_class(sClass)) {
						var aData = parse_class(sClass);

						Y.each(Socialmize.Dispatcher.data[aData[0]], function(fx) {
							fx.call(that, elNode, e, aData[1].split(','));
						});
					}
				});

				elTarg = elNode.parent();
			}
		}, document);

		Y.Dispatcher = Socialmize.Dispatcher = {
			data: {},

			register: function(sName, fxCallback) {
				if (! Socialmize.Dispatcher.data[sName]) {
					Socialmize.Dispatcher.data[sName] = [];
				}

				Socialmize.Dispatcher.data[sName].push(fxCallback);
			},

			unregister: function(sName, fxCallback) {
				if (Socialmize.Dispatcher.data[sName]) {
					var functions = [];

					Y.each(Socialmize.Dispatcher.data[sName], function(fx) {
						if (fx !== fxCallback) {
							functions.push(fx);
						}
					});

					Socialmize.Dispatcher.data[sName] = functions;
				}
			}
		};

		Socialmize.Dispatcher.register('dismiss', function(elTarg, e, aOptions) {
			var elAncestor = elTarg.ancestor('.parentOfClose', true),
				sUri = '/' + aOptions.join('/') + '/',
				oAnim;

			Y.io(sUri, {
				method: 'POST'
			});

			elAncestor.setStyle('overflow', 'hidden');

			oAnim = new Y.Anim({
				easing: Y.Easing.easeOut,
				to: {height: 0},
				node: elAncestor
			});

			oAnim.on('end', Y.bind(elAncestor.remove, elAncestor));

			oAnim.run();
		});

		Socialmize.Dispatcher.register('close', function(elTarg) {
			var oWidget = Y.Widget.getByNode(elTarg);

			if (oWidget) {
				oWidget.hide();
			}
		});

		Socialmize.Dispatcher.register('more', function(elTarg, e, aOptions) {
			Y.one(aOptions[0]).setStyle('height', 'auto');
			elTarg.addClass('dnone');
		});

		Socialmize.Dispatcher.register('tab', function(elTarg, e, aOptions) {
			e.halt();

			if (! elTarg.hasClass('selected')) {
				// iterate on each tab
				elTarg.parent().get('children').each(function(el) {
					el.removeClass('selected');

					// iterate on each tab class and look for tab commans
					Y.each(el.get('className').split(/\s+/), function(sClass) {
						if (is_cmd_class(sClass, 'tab')) {
							var aData = parse_class(sClass);
							Y.one(aData[1]).hide();
						}
					});
				});

				elTarg.addClass('selected');
				Y.one(aOptions[0]).show();
			}
		});
	}

  Y.replaceWithLoader = function(el) {
		var oImg = new Image();
		oImg.src = Socialmize.STATIC_URL + 'images/loader_lg.gif';
    el.replace(oImg);
  };

	/**
	 * Creates the Matt namespace.
	 */
	Y.Matt = {

	};

}, {requires: ['node', 'widget', 'dom', 'anim', 'collection']});