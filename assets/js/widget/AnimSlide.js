/**
 * Copyright (c) 2010, Matt Snider, LLC. All rights reserved.
 * Version: 1
 */

YUI($YO).add('gallery-anim-slide', function(Y) {

var Lang = Y.Lang,
	POSITION = 'position';

/**
 * The AnimSlide is a blind animation manager.
 * @class AnimSlide
 * @dependencies library
 */
function AnimSlide() {
	AnimSlide.superclass.constructor.apply(this,arguments);
	this._clickHandler = null;
	this._queue = [];
}

Y.mix(AnimSlide, {
	/**
	 * @property AnimSlide.NAME
	 * @type String
	 * @static
	 */
	NAME : 'gallery-anim-slide',

	/**
	 * @property AnimSlide.ATTRS
	 * @type Object
	 * @static
	 */
	ATTRS : {

		/**
		 * @attribute classNext
		 * @type String
		 * @default 'next'
		 * @description The class used to identify slide next direction.
		 */
		classNext: {
			value: 'next',
			validator: Lang.isString
		},

		/**
		 * @attribute classPosition
		 * @type String
		 * @default 'panel-slide'
		 * @description The class used to identify slide panels.
		 */
		classPosition: {
			value: 'panel-slide',
			validator: Lang.isString
		},

		/**
		 * @attribute classPrev
		 * @type String
		 * @default 'prev'
		 * @description The class used to identify slide previous direction.
		 */
		classPrev: {
			value: 'prev',
			validator: Lang.isString
		},

		/**
		 * @attribute classTrigger
		 * @type String
		 * @default 'com_slide'
		 * @description The class used to identify slide triggers.
		 */
		classTrigger: {
			value: 'com_slide',
			validator: Lang.isString
		},

		/**
		 * @attribute position
		 * @type Number
		 * @default 0
		 * @description The animated position.
		 */
		position: {
			value: 0
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

Y.extend(AnimSlide, Y.Widget, {

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
	 * @description A collection of slide positions to animate to.
	 */
	_queue: null,

	/**
	 * The callback function for ending the slide animation.
	 * @method _handleAnimEnd
	 * @protected
	 */
	_handleAnimEnd: function() {
		var that = this,
			nPos = that.get(POSITION);

		that._isAnimating = false;
		that.syncUI();
		that.fire('slide');

		that.getSlidePositions().each(function(node, i) {
			node.toggleVisibility(i === nPos);
		});

		if (that._queue.length) {that._slide.apply(that);}
	},

	/**
	 * The callback function for clicking on the content box; only proceeds if the element has the trigger class applied to it.
	 * @method _handleClick
	 * @param e {Event} Required. The triggered JavaScript 'click' event.
	 * @protected
	 */
	_handleClick: function(e) {
		var that = this,
			elTarg = e.target;

		if (elTarg.hasClass(that.get('classTrigger'))) {
			e.halt();
			that.fire('triggerSlide', elTarg);
			that[elTarg.hasClass(that.get('classNext')) ? 'slideNext' : 'slidePrev']();
		}
	},

	/**
	 * Actually performs the slide animation.
	 * @method _slide
	 * @protected
	 */
	_slide: function() {
		var that = this,
			nPos = that._queue.shift(),
			nTo, oAnim;

		if (! that._isAnimating && ! Lang.isUndefined(nPos)) {
			that._isAnimating = true;
			that.set(POSITION, nPos);
			that.getSlidePositions().item(nPos).toggleVisibility(true);

			nTo = that.getMarginLeft();
			oAnim = new Y.Anim({
				node: that.get('contentBox'),
				to: {marginLeft: nTo}
			});

			oAnim.set('duration', 0.5);
			oAnim.set('easing', Y.Easing.easeBoth);
			oAnim.on('end', that._handleAnimEnd, that);
			oAnim.run();
		}
	},

	/*
	 * @see Y.Widget#bindUI
	 */
	bindUI: function() {
		this._clickHandler = this.get('contentBox').on('click', this._handleClick, this);
	},

	/*
	 * @see Y.Base#destructor
	 */
	destructor: function () {
		AnimSlide.superclass.destructor.apply(this, arguments);
		if (this._clickHandler) {this._clickHandler.detach();}
		this._clickHandler = null;
	},

	/**
	 * Fetches the DOM node for the current slide position.
	 * @method getCurrentPosition
	 * @return {Element} A DOM element.
	 * @public
	 */
	getCurrentPosition: function() {
		return this.getSlidePositions().item(this.get(POSITION));
	},

	/**
	 * The left margin value to animate to for the current position.
	 * @method getMarginLeft
	 * @return {number} The desired left margin.
	 * @public
	 */
	getMarginLeft: function() {
		var that = this,
			nBoundingWidth = that.get('boundingBox').get('region').width,
			nContentWidth = that.get('contentBox').get('region').width,
			nPos = that.get(POSITION),
			nMaxMarginLeft = nBoundingWidth - nContentWidth,
			nTo = nBoundingWidth * -nPos;

		if (0 < nTo) {nTo = 0;}
		if (nMaxMarginLeft > nTo) {nTo = nMaxMarginLeft;}

		return nTo;
	},

	/**
	 * Fetches the DOM nodes representing a position in the slide animation.
	 * @method getSlidePositions
	 * @return {NodeList} A collection of elements.
	 * @public
	 */
	getSlidePositions: function() {
		return this.get('contentBox').all('.' + this.get('classPosition'));
	},

	/*
	 * @see Y.Base#initializer
	 */
	initializer: function () {
		AnimSlide.superclass.initializer.apply(this, arguments);
	},

	/*
	 * @see Y.Widget#renderUI
	 */
	renderUI: function() {

	},

	/**
	 * Reset the slider to the first position without animating.
	 * @method reset
	 * @public
	 */
	reset: function() {
		this.set(POSITION, 0);
		this._queue = [];
		this._handleAnimEnd();
	},

	/**
	 * Triggers a slide to the next position.
	 * @method slideNext
	 * @public
	 */
	slideNext: function() {
		var nPos = this.get(POSITION),
			nMaxPositions = this.getSlidePositions().size();

		if (nPos < nMaxPositions) {
			nPos += 1;
		}

		this._queue.push(nPos);
		this._slide();
	},

	/**
	 * Triggers a slide to the prev position.
	 * @method slidePrev
	 * @public
	 */
	slidePrev: function() {
		var nPos = this.get(POSITION);

		if (0 <= nPos) {
			nPos -= 1;
		}

		this._queue.push(nPos);
		this._slide();
	},

	/*
	 * @see Y.Widget#syncUI
	 */
	syncUI: function() {
		this.get('contentBox').setStyle('marginLeft', this.getMarginLeft() + 'px');
	}
});

Y.AnimSlide = AnimSlide;

}, "@VERSION@", {requires: ['widget', 'anim']});