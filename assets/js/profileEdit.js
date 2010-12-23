/**
 *	Copyright (c) 2007, Matt Snider, LLC. All rights reserved.
 *	Version: 1.0
 */

/**
 *  The ProfileEdit class manages the business logic of all profile edit pages.
 *  @namespace Core.Controller
 *  @class SearchResult
 *  @dependencies library
 *//*
 (function() {
 var ID_AC_NPT = 'autocomplete-npt-',
 ID_AC_DIV = 'autocomplete-ac-',
 Y = YAHOO,
 YU = Y.util,
 YE = YU.Event,
 YD = YU.Dom,
 YFE = YU.Form.Element,

 // local namespace
 _this = {},

 // DOM namespace
 _domAcNpt,
 _domAcDiv,

 // widget namespace
 _wgtAutoComplete,
 _xhr,

 // event namespace

 for (var i = 0; ; i += 1) {
 _domAcNpt = $(ID_AC_NPT + i);
 _domAcDiv = $(ID_AC_DIV + i);

 if (_domAcNpt && _domAcDiv) {
 _xhr = new YU.XHRDataSource('autocomplete.action');

 _xhr.scriptQueryAppend = 'task=' + _domAcNpt.name.replace(/[\[\]\d]/g, '');
 _xhr.responseType = YU.XHRDataSource.TYPE_JSON;
 _xhr.responseSchema = ["ResultSet.Result","name","id"];
 _xhr.responseSchema = {
 resultsList : "ResultSet.Results", // String pointer to result data
 fields : [
 { key: "name" },
 { key: "id" }`
 ],
 metaFields : {
 // oParsedResponse.meta.totalRecords === 1358
 totalRecords : "ResultSet.Total"
 }
 };

 _wgtAutoComplete = new Y.widget.AutoComplete(_domAcNpt, _domAcDiv, _xhr);
 _wgtAutoComplete.maxResultsDisplayed = 10;
 }
 else {
 break;
 }
 }

 Core.Controller.ProfileEdit = _this;
 }());*/

YUI($YO).use('yui3-ext', 'matt_form', 'collection', 'gallery-node-input', 'matt_searchableListOfCheckboxes', 'datasource', 'dataschema-json', function(Y) {
	_initIO(Y);

	function _fnHandleFeatureClick(e) {
		var elTarg = e.target,
				elParent = elTarg.parent().next();

		elParent.first().set('checked', elTarg.get('checked'));
		elParent.toggleVisibility(elTarg.get('checked'));
	}

	var elAdminList = Y.one('#adminList'),
			elBoard = Y.one('#board'),
			elForm = Y.one('#main-content form.profile-edit'),
			elMemberList = Y.one('#memberList'),
			elNetwork = Y.one('#network-list'),
			elRelated = Y.one('#related'),
			elWall = Y.one('#wall'),
			rxQueryHasAnEmptyValue = /=(?![^&]+)/g,
			elCheckbox, oDs, elFields;

	if (elBoard) {elBoard.on('click', _fnHandleFeatureClick);}
	if (elRelated) {elRelated.on('click', _fnHandleFeatureClick);}
	if (elWall) {elWall.on('click', _fnHandleFeatureClick);}

	if (elAdminList || elMemberList) {
		oDs = new Y.DataSource.IO({
			source: '/readSearchables.action?'
		});

		oDs.plug({fn: Y.Plugin.DataSourceJSONSchema, cfg: {
			schema: Y.CheckboxList.SCHEMA
		}});

		elCheckbox = new Y.CheckboxList({boundingBox: elAdminList || elMemberList, datasource: oDs, maxHeight: '21em'});
		elCheckbox.render();
	}
	else {
		if (elNetwork) {
			// viewing a network profile
			elCheckbox = new Y.CheckboxList({boundingBox: elNetwork, maxHeight: '21em'});
			oDs = new Y.DataSource.IO({source:"/readSearchables.action?member=true&key=" + Y.get('#updateSearchableMembers-key').get('value') + '&'});


			oDs.plug({fn: Y.Plugin.DataSourceJSONSchema, cfg: {
				schema: {
					metaFields: {resultn:"resultn"},
					resultListLocator: "results",
					resultFields: ['id', 'isChecked', 'label', 'value']
				}
			}});

			elCheckbox.plug(Y.CheckboxListFilter, {filterSource: oDs});
			elCheckbox.render();
		} else {
			if (elForm) {
				elFields = elForm.all('dd.required');

				elForm.on('submit', function(e) {
					var elIncompleteFld = elFields.find(function(elDd) {
						return Y.Matt.Form.serialize(elDd).match(rxQueryHasAnEmptyValue);
					});

					if (elIncompleteFld) {
						elIncompleteFld.addClass('error');
						e.halt();

						Y.Matt.FormField.focus(elIncompleteFld);

						if (elForm.first().first().hasClass('error')) {
							elForm.first().first().deleteNode();
						}

						elForm.first().prepend(Y.Node.create('<p class="error">You must complete all required fields!</p>'));
					}
				});
			}
		}
	}
});