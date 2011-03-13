YUI($YO).use('node', function(Y) {
  var Socialmize = YUI.namespace('Env.Socialmize'),

  elBb = Y.one('#id_slist_regnetwork'),
  elCopy = Y.one('#id_join_copy'),
  elTitle = Y.one('#id_join_title');

  if (Y.one('#id_slist_regnetwork')) {
    YUI($YO).use('searchable_checkboxes', 'matt_form', function(Y) {
      var bIsNetwork = true,

      oConf = {
        boundingBox: elBb._node, // is not of current Y.Node type, so we must find the actual node
        buttons:
          {
            ID_POST: 'Submit',
            NAME : '',
            VALUE : 'CONTINUE'
          },
        hasFilter: false,
        types: ['network'],
        typeToCheck: 'none',
        typeToSearch: 'all'
      },
      oSearchableCheckboxes = new Y.SearchableCheckboxes(oConf);
      oSearchableCheckboxes.render();

      oSearchableCheckboxes.on(Y.SearchableCheckboxes.CE_SUBMIT, function(e) {
        if (bIsNetwork) {
          elCopy.next().removeClass('displayNone');
          elCopy.addClass('displayNone');

          elTitle.next().removeClass('displayNone');
          elTitle.addClass('displayNone');

          oSearchableCheckboxes.set('types', ['user', 'group']);
          oSearchableCheckboxes.set('hasFilter', true);

          bIsNetwork = false;

          Y.io(oSearchableCheckboxes._elForm.get('action'), {
            data: Y.Form.serialize(oSearchableCheckboxes._elForm),
            method: 'POST'
          });

          return bIsNetwork;
        }
      });
    });
  }
});