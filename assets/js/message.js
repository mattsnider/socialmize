YUI($YO).use('node', 'dom', 'yui3-ext', 'matt_searchableListOfCheckboxes', 'gallery-node-input', 'dataschema-json', 'gallery-node-form', function(Y) {
		// constants
	var Get = Y.one,

		// DOM nodes
		el_message_to = Get('#id_slist_message_to'),
		el_input_type_to_search = Get('#id_slist_type_to_search'),
		el_input_type_to_search2 = Get('#id_slist_type_to_search2'),
		_domFormMessage = Get('#form-message'),
		_domFormMessageTo = Get('#form-message-to'),
		_domFormMessageMsg = Get('#form-message-message'),
		_domFormMessageSubject = Get('#form-message-subject'),
		_domFormMessageError = Get('#form-message-error'),

		searchableFilter,

    searchable_checkboxes_conf;

  if (el_message_to) {
    searchable_checkboxes_conf = {
      boundingBox: el_message_to._node, // is not of current Y.Node type, so we must find the actual node
      hasButton: false,
//      types: ['network'],
      hasFilter: 'user' != el_input_type_to_search2.get('value'),
      typeToCheck: 'none',
      typeToSearch: el_input_type_to_search.get('value'),
      types: el_input_type_to_search2.get('value').split(',')
    },

    YUI($YO).use('searchable_checkboxes', 'matt_form', function(Y) {
      var bIsNetwork = true,
      oSearchableCheckboxes = new Y.SearchableCheckboxes(searchable_checkboxes_conf);

      if (-1 < window.location.href.indexOf('/admin.action?page=message')) {
        oSearchableCheckboxes.set('key', 'asdf1234');
      }

      oSearchableCheckboxes.render();
    });
  }

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