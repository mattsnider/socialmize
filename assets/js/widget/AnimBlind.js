/**
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
				return Y.get(val);
			},
			validator: function(val) {
				return Y.get(val);
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

}, "@VERSION@", {requires: ['anim', 'widget']});