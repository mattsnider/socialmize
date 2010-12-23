/**
 * Copyright (c) 2007, Matt Snider, LLC. All rights reserved.
 * Version: 1.0
 */

/**
 * The ColorPicker class manages the YUI color picker inside of a layer.
 * @namespace Core.Controller
 * @class ColorPicker
 * @dependencies library, utility
 */
Core.Controller.ColorPicker = (function() {
    var _YD = YAHOO.util.Dom,
        _YE = YAHOO.util.Event,
        $ = _YD.get;

    // private namespace
    var _color = null,
        _domReferences = null,
        _F = function() {},
        _that = null;

    // DOM namespace
    var _D = {
        buttons: $('buttons_ColorPicker'),
        containerLayer: $('layer_ColorPicker'),
        containerYui: $('container_ColorPicker')
    };

    if (! _D.containerLayer) {return;}

    // move the _color picker to the layer
    _D.containerLayer.parentNode.removeChild(_D.containerLayer);
    $('layer').appendChild(_D.containerLayer);

    _YD.setStyle(_D.containerLayer, 'left', '-1000px');

    var picker = new YAHOO.widget.ColorPicker(_D.containerYui, {
        showhsvcontrols: true,
        showhexcontrols: true,
        images: {
            PICKER_THUMB: "/assets/images/colorpicker/picker_thumb.png",
            HUE_THUMB: "/assets/images/colorpicker/hue_thumb.png"
        }
    });

    _YD.setStyle(_D.containerLayer, 'left', '0px');

    // event namespace
    var _E = {

        /**
         * The callback function when canceling the _color change.
         * @method onCancel
         * @param e {Event} Required. The triggered JavaScript event, click.
         * @private
         */
        onCancel: function() {
            _that.hide();
        },

        /**
         * The callback function when the _color picker is reset.
         * @method onResetColor
         * @param e {Event} Required. The custom event.
         * @private
         */
        onResetColor: function() {
            picker.setValue([255, 255, 255], true);
        },

        /**
         * The callback function when the _color changes.
         * @method onRgbChange
         * @param o {Object} Required. The _color data.
         * @private
         */
        onRgbChange: function(o) {
            _color = o;
        },

        /**
         * The callback function when opening the _color picker.
         * @method onShowPicker
         * @param e {Event} Required. The triggered JavaScript event, click.
         * @param ref {Object} Required. The collection of DOM references.
         * @private
         */
        onShowPicker: function(e, ref) {
            _domReferences = ref;
            _YE.stopEvent(e);
            _that.show();

            var dim = _YD.getRegion(ref.input),
                _color = ref.input.value;

            // position the layer
            _D.containerLayer.style.left = dim.left + 'px';
            _D.containerLayer.style.top = dim.top + dim.height + 'px';

            // update the _color picker
            picker.setValue(String.hexToRGB('#' + _color), false);
        },

        /**
         * The callback function when saving the _color.
         * @method onSubmit
         * @param e {Event} Required. The triggered JavaScript event, click.
         * @private
         */
        onSubmit: function() {
            _that.hide();

            if (_domReferences && _color && _color.newValue) {
                var c = _color.newValue,
                    value = String.RGBtoHex(c[0], c[1], c[2]);
                _domReferences.input.value = value;
                if (_domReferences.swatch) {_domReferences.swatch.style.backgroundColor = '#' + value;}
            }
        }
    };

    // public namespace
    _F.prototype = {

        /**
         * Attach triggers to a button and link the other optional DOM references.
         * @method addTrigger
         * @param o {Object} Required. The collection of DOM references.
         * @public
         */
        addTrigger: function(o) {
            _YE.removeListener(o.trigger, 'click', _E.onShowPicker);
            _YE.on(o.trigger, 'click', _E.onShowPicker, o);
        },

        /**
         * The method to hide the container.
         * @method hide
         * @public
         */
        hide: function() {
            _YD.toggleVisibility(_D.containerLayer, false);
        },

        /**
         * The method to show the container.
         * @method show
         * @public
         */
        show: function() {
            _YD.toggleVisibility(_D.containerLayer, true);
        }
    };

    _that = new _F();

    //subscribe to the rgbChange event;
    picker.on("rgbChange", _E.onRgbChange);

    //use setValue to reset the value to white:
    _YE.on("reset", 'click', _E.onResetColor);

    // attach button events
    _YE.on(_YD.getFirstChild(_D.buttons), 'click', _E.onSubmit);
    _YE.on(_YD.getLastChild(_D.buttons), 'click', _E.onCancel);

    return _that;
})();