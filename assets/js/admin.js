/**
 * The Admin class manages business logic of the admin.action.
 * @class Admin
 * @dependencies library
 */
YUI($YO).use('node', 'yui3-ext', 'searchable_checkboxes', 'datatype-xml', 'gallery-node-input', 'datasource', 'gallery-admin-field',
			 'gallery-node-form'/*, 'ac-plugin-local', 'ac-widget-local'*/, function(Y) {
	_initIO(Y);

	// constants
	var NAME_DESIGN = 'design',

		// shortcuts
			FormElement = Y.FormElement,
			One = Y.one,

		// local namespace
			_cachedFeatureInputs = null,

		// DOM namespace
			_domChkboxGroup = One('#feature-group'),
			_domChkboxMessageBoard = One('#feature-messageBoard'),
			_domChkboxWall = One('#feature-wall'),
			_domFormContent = One('#form-content'),
			_domFormContentArea = One('#form-content-text'),
			_domFormContentSelect = One('#form-content-select'),
			_domFormCustom = One('#form-custom'),
			_domFormCustomList = _domFormCustom ? _domFormCustom.one('ol') : null,
			_domFormCustomColor = One('#form-custom-color'),
			_domFormEmail = One('#form-email'),
			_domFormEmailBody = One('#form-email-email'),
			_domFormEmailTo = One('#form-email-emails'),
			_domFormEmailSubject = One('#form-email-subject'),
			_domFormFeature = One('#form-features'),
			_domFormFields = One('#form-field'),
			_domFormFieldsFilter = One('#form-field-filter'),
			_domListNews = One('#id_slist_news'),
			_domFormPending = One('#form-pending'),
			_domFormProfanity = One('#form-profanity'),
			_domInputBecome = One("#admin-become-input"),
			_domInputConnectUsernameA = One('#connect-usernameA'),
			_domInputConnectUsernameB = One('#connect-usernameB'),
			_domHelpFixed = One('#help-bg-fixed'),
			_domHelpElastic = One('#help-bg-elastic'),
			_domProfanityLink = One('#profanity-link'),
			_domProfanityTextArea = One('#profanity-textarea'),
			_elFormRegistration = One('#form-registration'),

		// widget namespace
			_wgtAutoCompleteBecome,
			_wgtAutoCompleteConnectA,
			_wgtAutoCompleteConnectB,
		/*
		 _wgtDSAutoComplete = new Y.DataSource({
		 source : "/autocomplete.action",
		 scriptCallbackParam : "callback"
		 }),
		 */
		// event namespace

		/**
		 * Prevents the completion of event.
		 * @method _halt
		 * @param e {Event} Required. The triggered JavaScript event.
		 * @private
		 */
			_halt = function(e) {
				e.halt();
			},

		/**
		 * Fetches the URL when the content changes.
		 * @method _handleChangeContent
		 * @param e {Event} Required. The triggered JavaScript 'change' event.
		 * @private
		 */
			_handleChangeContent = function(e) {
				var name = FormElement.getValue(_domFormContentSelect);
				Y.io('adminAjaxView.action?name=' + name + '&task=renderContent', {on: {success: _handleFetchContent}});
			},

		/**
		 * Fetches the URL when the email changes.
		 * @method _handleChangeEmail
		 * @param e {Event} Required. The triggered JavaScript 'change' event.
		 * @private
		 */
			_handleChangeEmail = function(e) {
				var emailName = FormElement.getValue(_domFormEmailTo);
				Y.io('adminAjaxView.action?email=' + emailName + '&task=renderEmail', {on: {success: _handleFetchEmail}});
			},

		/**
		 * Toggles additional options for section.
		 * @method _handleFeatureChecked
		 * @param e {Event} Required. The triggered JavaScript 'click' event.
		 * @private
		 */
			_handleFeatureChecked = function(e) {
				var targ = e.target,
						item, isShow, cls;

				if ('input' == targ.getTagName()) {
					item = targ.ancestor('li');
					isShow = targ.get('checked');

					if (targ.hasClass('searchable')) {
						cls = targ.get('name').replace('has', '');

						if (! _cachedFeatureInputs) {
							_cachedFeatureInputs = _domFormFeature.all('input[type=checkbox]');
						}

						_cachedFeatureInputs.each(function(npt) {
							if (npt.hasClass(cls)) {
								item = npt.ancestor('li');
								if (isShow) {item.setStyle('opacity', 0);}
								item.animateDisplay(isShow);
							}
						});
					}
					else {
						if (! item.hasClass('sub')) {
							while ((item = item.next()) && item.hasClass('sub')) {
								item.one('input').set('check', isShow);
								item.animateDisplay(isShow);
							}
						}
					}
				}
			},

		/**
		 * Shows the textarea, which is hidden by default.
		 * @method _handleShowTextarea
		 * @private
		 */
			_handleShowTextarea = function(e) {
				var copy = _domProfanityTextArea.toggleDisplay() ? 'Hide' : 'Show';
				e.target.set('innerHTML', e.target.get('innerHTML').replace(/Show|Hide/, copy));
			},

		// request namespace

		/**
		 * Callback function for the AJAX request associated with changing the content message.
		 * @method _handleFetchContent
		 * @param o {XML} Required. The XML response.
		 * @private
		 */
			_handleFetchContent = function(id, o) {
				var body = o.responseXML.getElementsByTagName('body')[0];

				if (body) {
					_domFormContentArea.set('value', Y.DataType.XML.format(body.firstChild));
				}
				else {
					alert('Invalid content chosen, please refresh the page.');
				}
			},

		/**
		 * Callback function for the AJAX request associated with changing the email message.
		 * @method _handleFetchEmail
		 * @param o {XML} Required. The XML response.
		 * @private
		 */
			_handleFetchEmail = function(id, o) {
				var body = o.responseXML.getElementsByTagName('body')[0],
						subject = o.responseXML.getElementsByTagName('subject')[0];

				if (body && subject) {
					_domFormEmailBody.set('value', Y.DataType.XML.format(body.firstChild));
					_domFormEmailSubject.set('value', Y.DataType.XML.format(subject.firstChild));
				}
				else {
					alert('Invalid email chosen, please refresh the page.');
				}
			};
	/*
	 _wgtDSAutoComplete.plug({fn : Y.Plugin.DataSourceJSONSchema, cfg : {
	 schema : { resultListLocator : "query.results.Result" }
	 }});
	 */

	if (_elFormRegistration) {

		_elFormRegistration.on('click', function(e) {
			var elTarg = e.target,
					elRow, elPrevRow, elNextRow, elPrevSpan, elNextSpan, sPrevValue, sNextValue;

			if (elTarg.isTagName('a')) {
				elRow = elTarg.ancestor('tr');

				if (elTarg.hasClass('decrement')) {
					if (elRow.previous()) {
						elRow = elRow.parent().insertBefore(elRow, elRow.previous());
						elPrevRow = elRow;
						elNextRow = elRow.next();
					}
				}
				else {
					if (elTarg.hasClass('increment')) {
						if (elRow.next()) {
							elRow = elRow.parent().insertBefore(elRow.next(), elRow);
							elPrevRow = elRow;
							elNextRow = elRow.next();
						}
					}
				}

				elPrevRow.removeClass('last');
				elNextRow.removeClass('first');

				if (! elNextRow.next()) {
					elNextRow.addClass('last');
				}

				if (! elPrevRow.previous()) {
					elPrevRow.addClass('first');
				}

				// todo: add getFirstText to code-base, write swap content function
				elPrevSpan = elPrevRow.one('span.rank');
				elNextSpan = elNextRow.one('span.rank');
				sNextValue = elPrevSpan.get('innerHTML');
				sPrevValue = elNextSpan.get('innerHTML');
				elPrevSpan.replace(sPrevValue);
				elNextSpan.replace(sNextValue);
				elNextRow.one('input[type=hidden]').set('value', sNextValue);
				elPrevRow.one('input[type=hidden]').set('value', sPrevValue);
			}
		});
	}

	if (_domInputBecome) {
		_domInputBecome.plug(Y.Plugin.ACPlugin, {
			queryTemplate : function (q) { return "";},
			dataSource : _wgtDSAutoComplete
		});

		_wgtAutoCompleteBecome = new Y.ACWidget({ ac : _domInputBecome.ac });
		_wgtAutoCompleteBecome.render();
	}


	if (_domInputConnectUsernameA) {
		_domInputConnectUsernameA.plug(Y.Plugin.ACPlugin, {
			queryTemplate : function (q) { return "";},
			dataSource : _wgtDSAutoComplete
		});

		_wgtAutoCompleteConnectA = new Y.ACWidget({ ac : _domInputConnectUsernameA.ac });
		_wgtAutoCompleteConnectA.render();

		_domInputConnectUsernameB.plug(Y.Plugin.ACPlugin, {
			queryTemplate : function (q) { return "";},
			dataSource : _wgtDSAutoComplete
		});

		_wgtAutoCompleteConnectB = new Y.ACWidget({ ac : _domInputConnectUsernameB.ac });
		_wgtAutoCompleteConnectB.render();
	}
	/*
	 _xhr.scriptQueryAppend = _xhrAll.scriptQueryAppend = 'task=name';
	 _xhr.responseType = _xhrAll.responseType = Y.XHRDataSource.TYPE_JSON;
	 _xhr.responseSchema = _xhrAll.responseSchema = {
	 resultsList : "ResultSet.Results", // String pointer to result data
	 fields : [
	 { key: "name" },
	 { key: "id" }
	 ],
	 metaFields : {
	 // oParsedResponse.meta.totalRecords === 1358
	 totalRecords : "ResultSet.Total"
	 }
	 };
	 _xhrAll.scriptQueryAppend += '&subtask=all';
	 var acBecomeinput = new YAHOO.widget.AutoComplete(_domInputAdminBecome, _domInputAdminBecomeAC, _xhr);
	 acBecomeinput.maxResultsDisplayed = 10;

	 var acConnectUsernameA = new YAHOO.widget.AutoComplete(_D.connectUsernameA, _D.connectUsernameA_AC, _xhr);
	 acConnectUsernameA.maxResultsDisplayed = 10;
	 var acConnectUsernameB = new YAHOO.widget.AutoComplete(_D.connectUsernameB, _D.connectUsernameB_AC, _xhr);
	 acConnectUsernameB.maxResultsDisplayed = 10;
	 var acBecomeinput = new YAHOO.widget.AutoComplete(_domInputAdminBecome, _domInputAdminBecomeAC, _xhr);
	 acBecomeinput.maxResultsDisplayed = 10;
	 var acStatusUsername = new YAHOO.widget.AutoComplete('status-username', 'status-username-AC', _xhrAll);
	 acStatusUsername.maxResultsDisplayed = 10;
	 */

	if (_domHelpFixed) {
		_domHelpFixed.on('click', function() {
			alert('Create a 900 pixel width background image, with the: left column 240, column seperator 20, and right column 640 pixels wide. This design should be repeated vertically, see Design 2. Supports most browsers, but not as many screen resolutions, nor accessibility as fuild background. However, you can implement a pixel perfect column design using this method.');
		});
	}

	if (_domHelpElastic) {
		_domHelpElastic.on('click', function() {
			alert('Create an 1800 width background image, with the column border design along the left side (about 10 pixels wide). This design should be repeated vertically, see Design 1. Supports most browsers and screen resolutions; also supports accessibility for users with poor vision.');
		});
	}

	// customize tab
	if (_domFormCustom) {
		_domFormCustom.on('submit', _halt);
		_domFormCustom.on('change', function(e) {
			var targ = e.target;

			if (targ.get('name') === NAME_DESIGN) {
				_domFormCustomList.last().toggleDisplay('F' === FormElement.getValue(targ));
			}
		});

		_domFormCustomColor.all('a').each(function(lnk) {
			//            CP.addTrigger({trigger:lnk, input:lnk.previousSibling.previousSibling, swatch:lnk.previousSibling});
		});
	}

	if (_domListNews) {
		var searchableCheckboxes = new Y.SearchableCheckboxes({boundingBox: _domListNews, typeToCheck: 'all', hasButton: false});
		searchableCheckboxes.render();
	}

	// pending form
	if (_domFormPending) {
		// pending form
		var wgtFormPending = new Y.NodeForm({elem: _domFormPending});

		_domFormPending.on('click', function(e) {
			var targ = e.target,
					item, list, isLastItem;

			if ('approve' == targ.get('name') || 'deny' == targ.get('name')) {
				item = targ.get('parentNode');
				list = item.get('parentNode');
				isLastItem = ! (item.previous() || item.next());

				e.halt();
				Y.io(targ.get('href'));

				item.deleteNode({end: function() {
					if (isLastItem) {
						list.toggleDisplay(false);
						list.previous().toggleDisplay(true);
					}
				}});
			}
		});
	}

	// profanity form
	if (_domFormProfanity) {
		_domProfanityLink.on('click', _handleShowTextarea);
	}

	if (_domFormFields) {
		_domFormFields.all('dt').each(function(node) {
			var adminField = new Y.AdminField({
				dd: node.next(),
				dt: node
			});
			/*
			 var animBlind = new Y.AnimBlind({
			 boundingBox: node.next(),
			 contentBox: node.next().get('firstChild'),
			 trigger: node.get('lastChild')
			 });
			 animBlind.render();
			 */
		});

		var filters = _domFormFieldsFilter.all('input');

		// attach click handler to the filters
		filters.on('click', function(e) {
			// create a list of checked filters
			var names = [];
			filters.each(function(node) {
				if (node.get('checked')) {
					names.push('profileWidgetIs' + node.get('value'));
				}
			});

			// iterate on the filter containers inside of the filter DOM
			_domFormFields.all('li.sType').each(function(item) {
				var dd = item.ancestor('dd'), show;
				if (dd.hasClass('template')) {return;}

				// iterate on the checkboxes inside of container
				show = Boolean(Y.Array.find(item.all('input.chkbox')._nodes, function(npt) {
					return npt.checked && -1 < Y.Array.indexOf(names, npt.name);
				}));

				// toggle the containers
				dd.toggleDisplay(show);
				dd.previous().toggleDisplay(show);
			});
		});
	}

	if (_domFormEmail) {
		_domFormEmail.on('change', _handleChangeEmail);
	}

	if (_domFormContent) {
		_domFormContentSelect.on('change', _handleChangeContent);
	}

	if (_domFormFeature) {
		_domFormFeature.on('click', _handleFeatureChecked);
	}
});