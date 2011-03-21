/*
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

Socialmize.STATIC_URL = __STATIC_URL + '../';

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
}());