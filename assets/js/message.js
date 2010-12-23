YUI($YO).use('node', 'dom', 'yui3-ext', 'searchableFilter', 'gallery-node-input', 'dataschema-json', 'gallery-node-form', function(Y) {
		// constants
	var Get = Y.one,

		// DOM nodes
		_domFormMessage = Get('#form-message'),
		_domFormMessageTo = Get('#form-message-to'),
		_domFormMessageMsg = Get('#form-message-message'),
		_domFormMessageSubject = Get('#form-message-subject'),
		_domFormMessageError = Get('#form-message-error'),

		searchableFilter;

	if (_domFormMessage) {
		if (Y.DOM.byId('form-message-list')) {
			searchableFilter = new Y.SearchableFilter({boundingBox: '#form-message'});
			searchableFilter.render();
		}

		_domFormMessageMsg.on('keypress', function() {
			_domFormMessageError.toggleVisibility(1000 < _domFormMessageMsg.get('value').length);
		});

		_domFormMessage.on('submit', function(e) {
			if (! _domFormMessageError.hasClass('hidden')) {
				e.halt();
			}
		});

		new Y.NodeInput({input: _domFormMessageSubject, blurText: 'type your subject here'});
		new Y.NodeInput({input: _domFormMessageMsg, blurText: 'type your message here'});

		// need s to go after the Y.NodeInput calls
		// todo: don't focus when reading a message, but do focus when there is an error
		if (_domFormMessageTo && ! _domFormMessageTo.get('disabled')) {
			_domFormMessageTo.focus();
		}
		else {
			_domFormMessageSubject.focus();
		}
	}
});