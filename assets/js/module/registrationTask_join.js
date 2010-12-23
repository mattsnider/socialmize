YUI($YO).use('matt_searchableListOfCheckboxes', function(Y) {
	var oDs = new Y.DataSource.IO({
		source: '/readSearchables.action?'
	});

	oDs.plug({fn: Y.Plugin.DataSourceJSONSchema, cfg: {
		schema: Y.CheckboxList.SCHEMA
	}});

	var elCheckbox = new Y.CheckboxList({boundingBox: '#memberList', datasource: oDs, maxHeight: '21em'});
	elCheckbox.render();
});