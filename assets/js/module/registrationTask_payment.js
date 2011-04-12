YUI($YO).use('node', 'datasource-io', 'datasource-polling', 'datasource-jsonschema', 'yui3-ext', function(Y) {
  var oDs = new Y.DataSource.IO({source:'/readSearchable.action?key=' + Socialmize.user.key + '&force_auth=T&r='}),
  oRequest = {
    callback: {
      success: function(e, o) {
        var user = e.response.results[0];

        if ('active' == user.status) {
          window.location.href='/registration_update_payment.action'
        }
      },
      failure: function(e) {
        Y.log("Could not retrieve data: " + e.error.message, 'error');
      }
    }
  };

  oDs.plug({fn: Y.Plugin.DataSourceJSONSchema, cfg: {
    schema: {
      resultListLocator: "results",
      resultFields: ["status", "name"]
    }
  }});

  Y.one('#id_form_paypal').on('submit', function(e) {
    Y.replaceWithLoader(e.target.one('input[name=submit]'));

    setInterval(function() {
      oRequest.request = '' + Math.random();
      oDs.sendRequest(oRequest);
    }, 5000);
  });
});