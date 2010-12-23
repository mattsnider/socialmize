/**
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0
 */

/**
 * The Privacy class manages business logic for the "My Privacy" page.
 * @namespace Core.Controller
 * @class Privacy
 * @dependencies library
 */
(function() {
	// constants
var CLS = C.HTML.CLS,
	Y = YAHOO.util,
	D = Y.Dom,
	E = Y.Event,
	F = Y.Form,

	// local namespace
	_this = {},
	_timeoutId = 0,

	// DOM namespace
	_domFormPrivacy = $('form-privacy'),
	_domFormMessage = $('form-privacy-saved'),

	////
	// req namespace
	////

	/**
	 * Performs the AJAX request to update the form.
	 * @method _reqUpdatePrivacy
	 * @param form {HTMLElement} Required. The form to submit.
	 * @private
	 */
	_reqUpdatePrivacy = function(form) {
		// todo: write a method to handle writing messages (both error and informative) to the DOM
		var emptyFunction = function() {};
		D.show(_domFormMessage);
		clearTimeout(_timeoutId);
		_timeoutId = setTimeout(function() {D.hide(_domFormMessage);}, 5000);

		// todo: write a method to generalize this operation
		Y.Connect.asyncRequest('post', form.getAttribute('action'), {
			abort		: 5000,
			failure		: emptyFunction,
			success		: emptyFunction
		}, F.serialize(form));
	},

	////
	// evt namespace
	////

	/**
	 * Event callback function for managing the selection style of radios.
	 * @method _evtOnSelectRadio
	 * @param e {Event} Required. The triggered JavaScript event, onsubmit
	 * @private
	 */
	_evtOnSelectRadio = function(e) {
		var targ = E.getTarget(e),
			item = D.getAncestorByTagName(targ, 'li'),
			sel = D.getElementsByClassName(CLS.SELECTED, 'li', item.parentNode)[0];

		if (item != sel) {
			D.removeClass(sel, CLS.SELECTED);
			D.addClass(item, CLS.SELECTED);
		}
	},

	/**
	 * Event callback function for submitting the privacy forms.
	 * @method _evtOnUpdatePrivacy
	 * @param e {Event} Required. The triggered JavaScript event, onsubmit
	 * @private
	 */
	_evtOnUpdatePrivacy = function(e) {
		E.stopEvent(e);
		_reqUpdatePrivacy(E.getTarget(e));
	};

    F.getInputs(_domFormPrivacy, 'radio').batch(function(npt) {
        if (npt.checked) {
            D.addClass(npt.parentNode, CLS.SELECTED);
        }
        
        E.on(npt, 'change', _evtOnSelectRadio);
    });

    E.on(_domFormPrivacy, 'submit', _evtOnUpdatePrivacy);

    Core.Controller.Privacy = _this;
}());