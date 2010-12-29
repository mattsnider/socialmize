/*
 * Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 * Version: 1.0.00
 */

//(function() {
//	// constant
//var YU = YAHOO.util,
//	FE = YU.Form.Element,
//	$ = YU.Dom.get,
//
//	// local namespace
//	_domQuery = $('query');
//
///**
// * The JavaScript namespace used to store some 'unsensitive' information about the current user.
// * @property USER
// * @type String
// * @static
// */
//Core.USER = {
//
//    /**
//     * The authorized user's key.
//     * @property USER.key
//     * @type String
//     * @static
//     */
//    key: '',
//
//    /**
//     * The authorized user's name.
//     * @property USER.name
//     * @type String
//     * @static
//     */
//    name: ''
//};
//
//if (! window.$) {
//    window.$ = $;
//}
//
//FE.attachFocusAndBlur(_domQuery, 'search by name or keyword');
//
//}());


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
}());

var base = '/assets/js/';
//var base = '../';
var $VERSION = '.js?r=75',
	//var $VERSION = '.js?r=' + Math.random(),
		$YO = {
			base: 'http://yui.localhost/yui3/build/',
			filter: 'raw',
//			combine: true,
			timeout: 10000,
			useBrowserConsole: true,
			logLevel: 'warn',
			debug: true,
			modules: {
				'ac-plugin-local': {
					fullpath: base + 'widget/ac-plugin-min' + $VERSION,
					requires: ['node', 'plugin', 'value-change', 'event-key'],
					optional: ['event-custom'],
					supersedes: []
				},

				'ac-widget-local': {
					fullpath: base + 'widget/ac-widget-min' + $VERSION,
					requires: ['widget','ac-plugin'],
					optional: [],
					supersedes: []
				},

				'cameleon-notification': {
					fullpath: base + 'widget/Notification' + $VERSION,
					requires: ['node', 'widget', 'yui3-ext', 'io'],
					optional: [],
					supersedes: []
				},

				'checkboxList': {
					fullpath: base + 'widget/CheckboxList' + $VERSION,
					requires: ['widget'],
					optional: [],
					supersedes: []
				},

				'checkboxListFilter': {
					fullpath: base + 'widget/CheckboxListFilter' + $VERSION,
					requires: ['plugin', 'datasource', 'checkboxList'],
					optional: [],
					supersedes: []
				},

				'gallery-admin-field': {
					fullpath: base + 'widget/AdminField' + $VERSION,
					requires: ['gallery-anim-blind', 'gallery-anim-slide', 'collection'],
					optional: [],
					supersedes: []
				},

				'gallery-anim-blind': {
					fullpath: base + 'widget/AnimBlind' + $VERSION,
					requires: ['anim', 'widget'],
					optional: [],
					supersedes: []
				},

				'gallery-anim-slide': {
					fullpath: base + 'widget/AnimSlide' + $VERSION,
					requires: ['anim', 'widget'],
					optional: [],
					supersedes: []
				},

				'gallery-node-field': {
					fullpath: base + 'widget/NodeField' + $VERSION,
					requires: ['base', 'node'],
					optional: [],
					supersedes: []
				},

				'gallery-node-form': {
					fullpath: base + 'widget/NodeForm' + $VERSION,
					requires: ['base', 'node', 'gallery-node-field'],
					optional: [],
					supersedes: []
				},

				'gallery-node-input': {
					fullpath: base + 'widget/NodeInput' + $VERSION,
					requires: ['base', 'node'],
					optional: [],
					supersedes: []
				},

				'gallery-tab-manager': {
					fullpath: base + 'widget/TabManager' + $VERSION,
					requires: ['widget', 'yui3-ext'],
					optional: [],
					supersedes: []
				},

				'matt_searchableListOfCheckboxes': {
					fullpath: base + 'widget/SearchableListOfCheckboxes' + $VERSION,
					requires: ['widget', 'datasource', 'json', 'yui3-ext', 'matt_form'],
					optional: [],
					supersedes: []
				},

				'matt_form': {
					fullpath: base + 'util/form' + $VERSION,
					requires: ['base', 'collection'],
					optional: [],
					supersedes: []
				},

				'searchableFilter': {
					fullpath: base + 'widget/SearchableFilter' + $VERSION,
					requires: ['io-base', 'checkboxList', 'gallery-node-form', 'gallery-node-field'],
					optional: [],
					supersedes: []
				},

				'yui3-ext': {
					fullpath: base + 'widget/YUI3-Ext' + $VERSION,
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