Core.View.ProfileWidget = function(el) {
	this.node = $(el);
	this.dom = {};

	var f = Dom.getChildByTagAndClass(this.node, 'form', this.CLASS_PROFILE_FORM);
	this.dom.main = Dom.getChildByTagAndClass(this.node, 'div', this.CLASS_PROFILE_WIDGET);

	if (f) {
		var list = f.getElementsByTagName('ul')[0],
			that = this;

		Core.batch(list.getElementsByTagName('input'), function(item) {
			that.dom['btn' + item.name] = item;
		});

		this.dom.table = Dom.getChildByTagAndClass(f, 'table', this.CLASS_PROFILE_TABLE);
		this.dom.thead = Dom.getChildByTagAndClass(this.dom.table, 'thead', this.CLASS_ADD);
		this.dom.addlink = this.dom.thead? this.dom.thead.getElementsByTagName('a')[0]: null;
		this.dom.tbodies = this.dom.table.getElementsByTagName('tbody');

		this.dom.form = f;
	}
};

Core.View.ProfileWidget.prototype = {


	/**
	 * The DOM selector class to identify CLASS_MULTI add rows
	 * @property CLASS_ADD
	 * @type string
	 */
	CLASS_ADD: 'add',


	/**
	 * The DOM selector class to identify CLASS_PROFILE_EDIT that can have multiple tbodies
	 *
	 * @property CLASS_MULTI
	 * @type string
	 */
	CLASS_MULTI: 'multi',


	/**
	 * The DOM selector class to identify profile widgets
	 *
	 * @property CLASS_PROFILE
	 * @type string
	 */
	CLASS_PROFILE: 'profile',


	/**
	 * The DOM selector class to identify the default profile containers
	 *
	 * @property CLASS_PROFILE_CONTAINER
	 * @type string
	 */
	CLASS_PROFILE_CONTAINER: 'profile-container',


	/**
	 * The DOM selector class to identify the default profile edit containers
	 *
	 * @property CLASS_PROFILE_EDIT
	 * @type string
	 */
	CLASS_PROFILE_EDIT: 'profile-edit',


	/**
	 * The DOM selector class to identify the profile form containers
	 *
	 * @property CLASS_PROFILE_FORM
	 * @type string
	 */
	CLASS_PROFILE_FORM: 'profile-form',


	/**
	 * The DOM selector class to identify profile tables
	 * @property CLASS_PROFILE_TABLE
	 * @type string
	 */
	CLASS_PROFILE_TABLE: 'profile-tbl',


	/**
	 * The DOM selector class to identify profile widget containers
	 *
	 * @property CLASS_PROFILE_WIDGET
	 * @type string
	 */
	CLASS_PROFILE_WIDGET: 'profile-widget',


	/**
	 * Fetch the add anchor element
	 *
	 * @method getAnchorAdd
	 * @return {htmlelement} the HTMLAnchorElement
	 * @public
	 */
	getAnchorAdd: function() {
		return this.dom.addlink;
	},


	/**
	 * Fetch the cancel button input elements from the form
	 *
	 * @method getButtonCancel
	 * @return {htmlelement} the HTMLInputElement
	 * @public
	 */
	getButtonClose: function() {
		return this.dom.btnclose;
	},


	/**
	 * Fetch the clear button input elements from the form
	 *
	 * @method getButtonClear
	 * @return {htmlelement} the HTMLInputElement
	 * @public
	 */
	getButtonClear: function() {
		return this.dom.btnclear;
	},


	/**
	 * Fetch the reset button input elements from the form
	 *
	 * @method getButtonReset
	 * @return {htmlelement} the HTMLInputElement
	 * @public
	 */
	getButtonReset: function() {
		return this.dom.btnreset;
	},


	/**
	 * Fetch the save button input elements from the form
	 *
	 * @method getButtonSave
	 * @return {htmlelement} the HTMLInputElement
	 * @public
	 */
	getButtonSave: function() {
		return this.dom.btnsave;
	},


	/**
	 * Fetch the country select elements from the form
	 *
	 * @method getCountrySelects
	 * @return {array} collection of HTMLSelectElements
	 * @public
	 */
	getCountrySelects: function() {
		return $D.getElementsByTagAndClass('country', 'select', this.node);
	},


	/**
	 * Fetch the edit anchors; usually only one, but can be 2 if the profile is empty. Lazily defined
	 *
	 * @method getEditAnchors
	 * @return {array} collection of HTMLAnchorElements
	 * @public
	 */
	getEditAnchors: function() {
		var links = $D.getElementsByTagAndClass(this.CLASS_PROFILE_EDIT, 'a', this.node);
		this.getEditAnchors = function() {return links;};
		return this.getEditAnchors();
	},


	/**
	 * Fetch the form element
	 *
	 * @method getForm
	 * @return {htmlelement} the HTMLFormElement
	 * @public
	 */
	getForm: function() {
		return this.dom.form;
	},


	/**
	 * Fetch the ID attribute from the DOM
	 *
	 * @method getId
	 * @return {string} the form id
	 * @public
	 */
	getId: function() {
		return this.node.id;
	},


	/**
	 * Fetch the main div element
	 *
	 * @method getTable
	 * @return {htmlelement} the HTMLDivElement
	 * @public
	 */
	getMain: function() {
		return this.dom.main;
	},


	/**
	 * Fetch the form table element
	 *
	 * @method getTable
	 * @return {htmlelement} the HTMLTableElement
	 * @public
	 */
	getTable: function() {
		return this.dom.table;
	},


	/**
	 * Fetch the form table tbodies elements
	 *
	 * @method getTbodies
	 * @return {array} collection of the HTMLSectionElement
	 * @public
	 */
	getTbodies: function() {
		return this.dom.tbodies;
	},


	/**
	 * Fetch the form table thead element
	 *
	 * @method getThead
	 * @return {htmlelement} the HTMLSectionElement
	 * @public
	 */
	getThead: function() {
		return this.dom.thead;
	},


	/**
	 * Fetch the widget type form the ID
	 *
	 * @getType
	 * @return {string} the type string
	 * @public
	 */
	getType: function() {
		return this.getId().replace(/.*-/, '');
	},


	/**
	 * Test if this form has admin controls
	 *
	 * @method isAdmin
	 * @return {boolean} true, when this user is an admin
	 * @public
	 */
	isAdmin: function() {
		return ! isUndefined(this.dom.btnClear);
	},


	/**
	 * Test if this form has replicating fields
	 *
	 * @method isMulti
	 * @return {boolean} true, when this form supports multiple tbodies
	 * @public
	 */
	isMulti: function() {
		return Dom.hasClass(this.dom.form, this.CLASS_MULTI);
	}
};


/**
 * Copyright (c) 2007, Matt Snider, LLC. All rights reserved.
 * Version: 1.0
 */

/**
 * The Profile class manages the profile page business logic
 * @namespace Core.Biz
 * @class Profile
 * @dependencies library
 */

Core.Biz.Profile = function() {

	//	Module private variables

	var that = null,
		F = function() {},
		isGroup = false,
		widgets = [];


	//	Module dom namespace
	
	var dom = {
		content			: Dom.cleanWhitespace(Dom.cleanWhitespace(Dom.cleanWhitespace($('content')).lastChild).firstChild),
		editBtns		: [],
		forms			: [],
		formsMap 		: [],
		optionForm		: $('profile-actions'),
		portraitDlg		: null,
		profileEditBtn	: $('profile-edit-btn')
	};


	/**
	 * Copies the template tbody of a profile-form element; asserts that the required rows are complete, before creating a new row
	 *
	 * @method copyTemplate
	 * @param table {htmlelement} the form input HTMLTableElement
	 * @return {HTMLTbodyElement} the copied tbody or null
	 * @private
	 */
	var copyTemplate = function(table) {
		var template = Dom.getChildByTagAndClass(table, 'tbody', that.CLASS_TEMPLATE),
			tbody = template.nextSibling,
			hasRequired = true;

		// find first row after template, iterates until it finds a sibling with the 'rows' DOM collection on it
		while (tbody && ! tbody.rows) {tbody = tbody.nextSibling;}

		// fieldsets exists, verify that required fields are filled
		if (tbody) {
			var required = $F(Form.getInputs(table.parentNode, 'hidden', that.DOM_FIELD_NAME_REQUIRED)[0]);

			// iterate through the inputs and assertain the name, year, attend, and degree (required values) to test
			Core.batch(Form.getElements(tbody), function(f) {
				var name = f.name.toLowerCase();
				if (-1 != required.indexOf(name)) {
					var value = $F(f);
					hasRequired = hasRequired && '' !== value && 0 !== value;
				}
			});
		}

		// valid last entry
		if (hasRequired) {
			var node = Dom.insertAfter(template, document._importNode(template, true));
			that.addTbodyEvent(node);
			Dom.removeClass(node, that.CLASS_TEMPLATE);
			return node;
		}

		return null;
	};


	/**
	 * Safely remove the tbody from the profile: clears when first element, otherwise removes from the table
	 *
	 * @method removeTbody
	 * @param tb {DOMElement} DOMElement
	 * @private
	 */
	var removeTbody = function(tb) {
		Dom.cleanWhitespace(tb.parentNode);
		if (that.CLASS_TEMPLATE == tb.previousSibling.className) {
			Form.clear(tb);
		}
		else {
			tb.parentNode.removeChild(tb);
		}
	};


	/**
	 * Executes the function, which should return null or an error condition. Errors are shown relative to the triggering DOMElement.
	 *
	 * @method runCodeAndCheckError
	 * @param targ {htmlelement}
	 * @param func {function} the error check function
	 * @private
	 */
	var runCodeAndCheckError = function(targ, func) {
		var tb = Dom.getParent(targ, 'tbody'),
			ei = func(tb);

		//	Hide all the errors
		var errors = targ.parentNode.getElementsByTagName('small');
		for (var i=0, err; err=errors[i]; i++) {
			$V(err, false);
		}

		//	Show error indexed by ei
		if (ei) {
			ei = parseInt(ei.stripNonNumeric()) - 1;
			var error = errors[ei];
			error.lastDisplay = 'block';
			$V(error, true);
		}
	};



	//	Module event namespace

	var evt = {


		/**
		 * Callback function to add an administrator to the group
		 *
		 * @method onAddAdmin
		 * @param e {Event} the triggering event, onclick
		 * @private
		 */
		onAddAdmin: function(e) {},


		/**
		 * Callback function to add another tbody or display an error if default state has not been met
		 *
		 * @method onAddClick
		 * @param e {Event} The triggering event, onclick
		 * @private
		 */
		onAddClick: function(e, o) {
			var targ 	= Event.element(e),
				table 	= o.getTable(),
				tb 		= copyTemplate(table),
				form 	= o.getForm(),
				err  	= targ.parentNode.getElementsByTagName('small')[0];
			err.lastDisplay = 'block';
			$V(err, isNull(tb));

			// do not try to insert when template row was not added
			if (! isNull(tb)) {
				o.fobj.insertElements(tb);
			}
		},


		/**
		 * Callback function to add another con or display an error if default state has not been met
		 *
		 * @method onConClick
		 * @param e {Event} The trigger event, onclick
		 * @private
		 */
		onConClick: function(e) {
			runCodeAndCheckError(Event.element(e), addCon);
		},


		/**
		 * Callback function to confirm removing yourself from a group and deleting that group
		 *
		 * @method onConfirmRemove
		 * @param e {Event} the triggering event, onclick
		 * @private
		 */
		onConfirmDelete: function(e) {
			Form.getInputs(dom.optionForm, 'hidden', 'action')[0].value = 'delete';
			dom.dialog = Confirm("Are you sure you want to delete this group? This action cannot be undone.", "Delete Group Confirmation",
							that.submitActionForm, cancelDialog, null, {});
		},


		/**
		 * Callback function to confirm removing yourself from a group
		 *
		 * @method onConfirmRemove
		 * @param e {Event} the triggering event, onclick
		 * @private
		 */
		onConfirmRemove: function(e) {
			Form.getInputs(dom.optionForm, 'hidden', 'action')[0].value = 'delete';
			dom.dialog = Confirm("Are you sure you want to remove yourself from this group?", "Leaving Group Confirmation",
							that.submitActionForm, cancelDialog, null, {});
		},


		/**
		 * Callback function to initiate hiding the edit form and showing normal display
		 *
		 * @method onShowEdit
		 * @param e {Event} The trigger event, onclick
		 * @param o {View.ProfileWidget} the profile widget object
		 * @private
		 * @private
		 */
		onHideEdit: function(e, o) {
			var f = o.getForm(),
				d = o.getMain();
			Form.disable(f);
			o.isVisible = false;

			if (! o.out) {
				o.hide = {
					div: new YAHOO.util.Anim(d, { opacity: { from: 0, to: 1 } }, 0.5, YAHOO.util.Easing.easeIn),
					form: new YAHOO.util.Anim(f, { opacity: { from: 1, to: 0 } }, 1, YAHOO.util.Easing.easeOut)
				};

				o.hide.form.onComplete.subscribe(function() {
					Dom.hide(f);
					d.style.opacity = 0;
					Dom.show(d);
					o.hide.div.animate();
					// fix issue where returned html length is greater than existing html
					if (d.scrollHeight > d.offsetHeight) {d.style.height = d.scrollHeight + 'px';}
				});
			}

			o.hide.form.animate();
		},


		/**
		 * Callback function to add another lab/pi combo or display an error if default state has not been met
		 *
		 * @method onLabClick
		 * @param e {Event} The trigger event, onclick
		 * @private
		 */
		onLabClick: function(e) {
			runCodeAndCheckError(Event.element(e), addLab);
		},


		/**
		 * Callback function to remove a tbody
		 *
		 * @method onRemoveClick
		 * @param e {Event} The trigger event, onclick
		 * @private
		 */
		onRemoveClick: function(e) {
			var targ = Event.element(e, 'tbody');
			removeTbody(targ);
		},


		/**
		 * Callback function to initiate showing the edit form and hiding normal display
		 *
		 * @method onShowEdit
		 * @param e {Event} the trigger event, onclick
		 * @param o {View.ProfileWidget} the profile widget object
		 * @private
		 */
		onShowEdit: function(e, o) {
			if (o.isVisible) {return;}
			var f = o.getForm(),
				d = o.getMain();
			Form.enable(f);
			o.isVisible = true;

			if (! o.show) {
				o.show = {
					div: new YAHOO.util.Anim(d, { opacity: { from: 1, to: 0 } }, 1, YAHOO.util.Easing.easeOut),
					form: new YAHOO.util.Anim(f, { opacity: { from: 0, to: 1 } }, 0.5, YAHOO.util.Easing.easeIn)
				};

				o.show.div.onComplete.subscribe(function() {
					Dom.hide(d);
					f.style.opacity = 0;
					Dom.show(f);
					o.show.form.animate();
				});
			}

			o.show.div.animate();

			if (o.isMulti()) {
				var table = o.getTable();
				Dom.cleanWhitespace(table);

				var tb = copyTemplate(table);

				// only insert if copyTemplate returns a DOMNode
				if (! isNull(tb)) {
					o.fobj.insertElements(tb);
				}
			}
		},


		/**
		 * Callback function to initiate showing all the edit forms and hiding all the normal displays
		 *
		 * @method onShowAllEdit
		 * @param e {Event} The trigger event, onclick
		 * @private
		 */
		onShowAllEdit: function(e) {
			Core.batch(widgets, function(o) {
				evt.onShowEdit(null, o);
			});
		}
	};


	/**
	 * Iterate through the concentrations and display next or return error
	 *
	 * @method addCon
	 * @param tb {DOMElement} Any DOMElement, usually a CLASS_PROFILE_TABLE tbody
	 * @private
	 */
	var addCon = function(tb) {
		Dom.cleanWhitespace(tb);
		var row = Dom.getChildByTagAndClass(tb, 'tr', that.CLASS_CON),
			fields = document.getElementsByTagAndClass('autocomplete', 'input', row);

		for (var i=1, con; con=fields[i]; i++) {
			if (! Dom.isDisplayed(con)) {
				if ($F(fields[i-1])) {
					Dom.show(con);
					return null;
				}
				
				return 'E1';
			}
		}

		return 'E2';
	};


	/**
	 * Iterate through the education lab rotations and display next or return error
	 *
	 * @method addLab
	 * @param tb {DOMElement} Any DOMElement, usually a CLASS_PROFILE_TABLE tbody
	 * @private
	 */
	var addLab = function(tb) {
		Dom.cleanWhitespace(tb);
		var lab = Dom.getChildByTagAndClass(tb, 'tr', that.CLASS_LAB);
		var pi = lab.nextSibling;
		lab.lastDisplay = '';
		pi.lastDisplay = '';
		Dom.show(lab);
		Dom.show(pi);
		Dom.cleanWhitespace(lab);
		Dom.cleanWhitespace(pi);
		Dom.cleanWhitespace(lab.lastChild);
		Dom.cleanWhitespace(pi.lastChild);

		for (var i=1, l, p; (l=lab.lastChild.childNodes[i]) && (p=pi.lastChild.childNodes[i]); i++) {
			if (! Dom.isDisplayed(l)) {
				if ($F(l.previousSibling) && $F(p.previousSibling)) {
					Dom.show(l);
					Dom.show(p);
					return null;
				}

				return 'E1';
			}
		}

		return 'E2';
	};

	var onAjaxFailure = function() {
		alert('Sorry, there was a communication error. Please try again.');
	};


	var onAjaxSuccess = function(response) {
		Core.hideLoader('save');
		var o = response.argument,
			form = o.getForm(),
			resp = response.responseText,
			div = o.getMain(),
			title = Dom.getChildByTagAndClass(o.node, 'h4'),
			i = resp.indexOf(o.CLASS_PROFILE_WIDGET),
			j = resp.lastIndexOf('</div>') - 6;

		// changes toggle from closed to open, just in case it is closed
		Dom.removeClass(title, Core.Widget.ToggleManager.CLASS_CLOSED);
		Dom.addClass(title, Core.Widget.ToggleManager.CLASS_OPEN);

		// captures the start and end point of <div class="profile-widget">
		i = resp.indexOf('>', i) + 1;
		j = resp.lastIndexOf('</div>', j);

		resp = resp.substr(i, j-i).trim();
		Dom.replace(div, resp);
		evt.onHideEdit(null, o);

		var empty = Dom.getChildByTagAndClass(div, 'div', 'empty');
		if (empty) {
			var link = empty.getElementsByTagName('a')[0];
			Event.addListener(link, Event.ON_MOUSE_CLICK, evt.onShowEdit);
		}
	};

	var requestSaveProfileFormAndRetrieve = function(o) {
		var form = o.getForm();

		if (Core.showLoader('save')) {
            Form.disable(form);

			if (o.isMulti()) {
				var required = $F(Form.getInputs(form, 'hidden', that.DOM_FIELD_NAME_REQUIRED)[0]),
					k = 0;

				// iterate on the tbodies of the form; but skip the template row
				Core.batch(Array.prototype.slice.call(form.getElementsByTagName('tbody'), 1), function(tb) {
					var fields = Form.getElements(tb),
						hasRequired = true;

					//	iterate through the inputs and assertain the required values are there
					Core.batch(fields, function(f) {
						var name = f.name.toLowerCase();
						if (-1 != required.indexOf(name)) {
							var value = $F(f);
							hasRequired = hasRequired && '' !== value && 0 !== value;
						}
					});

					if (hasRequired) {
						Core.batch(fields, function(f) {
							var name = f.name.replace(/\d+|/, '').replace('|', '');
							f.name = k + '|' + name;
						});

						k++;
					}

					Form.getInputs(form, 'hidden', that.DOM_FIELD_NAME_FIELDSET_COUNT)[0].value = k;
				});
			}

			YAHOO.util.Connect.asyncRequest('POST', form.action, {
                success: onAjaxSuccess,
                failure: onAjaxFailure,
                /*upload: onUploadSuccess,*/
                argument: o,
                abort: 10000
            }, Form.serialize(form));
        }
        else {
            // todo: replace me with a cool message
            Alert("Currently saving, please wait.");
        }
	};

	var onSave = function(form) {
		requestSaveProfileFormAndRetrieve(this);
	};


	var addWord = function(e) {
		var targ = Event.element(e, 'div'),
			element = targ.parentNode.getElementsByTagName('input')[0],
			updater = targ.parentNode.getElementsByTagName('textarea')[0],
			content = Dom.getContentAsString(updater).trim();

		var arr = (content)? content.toLowerCase().split(', '): [],
			input = element.value.trim().split(',');
		if (! input.length) {return;}

		for (var i=0, str; str=input[i]; i++) {
			str = str.toLowerCase().trim();
			if (ArrayUtil.indexOf(arr, str) == -1) {arr.push(str);}
		}

		Dom.replace(updater, arr.join(', '));
		updater.value 		= arr.join(', ');
		element.value 		= '';
	};


	var removeWord = function(e) {
		var targ = Event.element(e, 'div'),
			element = targ.parentNode.getElementsByTagName('input')[0],
			updater = targ.parentNode.getElementsByTagName('textarea')[0],
			content = Dom.getContentAsString(updater).trim();

		var arr = (content)? content.toLowerCase().split(', '): [],
			input = element.value.trim().split(',');
		if (! input.length) {return;}

		for (var i=0,j,str; str = input[i]; i++) {
			str = str.toLowerCase().trim();
			j = ArrayUtil.indexOf(arr, str);
			if (-1 != j) {arr[j] = null;}
		}

		arr = ArrayUtil.compact(arr);
		Dom.replace(updater, arr.join(', '));
		updater.value = arr.join(', ');
		element.value = '';
	};


	var publicationSearch = function(e) {
		var targ = Event.element(e, 'div'),
			input = targ.parentNode.getElementsByTagName('input')[0];
		window.open(
			"http://www.ncbi.nlm.nih.gov/entrez/query.fcgi?cmd=Search&db=pubmed&term="+$F(input).trim().replace(/ /g,"+"),
			"pubmed",
			"location=1,status=1,scrollbars=1"
			);
	};


	var validateAndSubmitPortrait = function(e) {
		var form = dom.portraitDlg.body.getElementsByTagName('form')[0],
			error = document.getElementsByTagAndClass('form-error', 'small', form)[0];

		if (Form.getInputs(form, 'checkbox')[0].checked) {
			form.submit();
			Dom.hide(error);		
		}
		else {
			error.lastDisplay = 'block';
			Dom.show(error);
		}
	};


	//	Public methods and constants

	F.prototype = {


		/**
		 * The DOM selector class to identify the concentration row
		 *
		 * @property CLASS_CON
		 * @type string
		 */
		CLASS_CON: 'con',


		/**
		 * The DOM selector class to toggle country select state on/off
		 *
		 * @property CLASS_COUNTRY
		 * @type string
		 */
		CLASS_COUNTRY: 'country',


		/**
		 * The DOM selector class to identify this is a group profile
		 *
		 * @property CLASS_GROUP
		 * @type string
		 */
		CLASS_GROUP: 'group',


		/**
		 * The DOM selector class to identify the lab rotation row
		 *
		 * @property CLASS_LAB
		 * @type string
		 */
		CLASS_LAB: 'lab',


		/**
		 * The DOM selector class to identify CLASS_TEMPLATE tbodies templates
		 *
		 * @property CLASS_TEMPLATE
		 * @type string
		 */
		CLASS_TEMPLATE: 'template',


		/**
		 * The DOM field name for fieldset-count element of the multi profile-forms
		 *
		 * @property DOM_FIELD_NAME_FIELDSET_COUNT
		 * @type string
		 */
		DOM_FIELD_NAME_FIELDSET_COUNT: 'fieldset-count',


		/**
		 * The DOM field name for required elements of the multi profile-forms
		 *
		 * @property DOM_FIELD_NAME_REQUIRED
		 * @type string
		 */
		DOM_FIELD_NAME_REQUIRED: 'required',


		/**
		 * The DOM selector class to identify ERROR_MISSING_LAB_RATOTATION tbodies templates
		 *
		 * @property ERROR_MISSING_LAB_RATOTATION
		 * @type string
		 */
		ERROR_MISSING_LAB_RATOTATION: 'template',


		/**
		 * The DOM selector ID find the trigger to edit all state
		 *
		 * @property ID_PROFILE_EDIT_ALL
		 * @type string
		 */
		ID_PROFILE_EDIT_ALL: 'profile-edit-all',


		/**
		 * Iterate through the multi tbodies and attach events
		 *
		 * @method addTbodyEvent
		 * @param tb {DOMElement} Any DOMElement
		 * @private
		 */
		addTbodyEvent: function(tb) {
			var anchors = tb.getElementsByTagName('a');

			for (var k=anchors.length-1; 0<=k; k--) {
				var a = anchors[k];

				switch (a.className) {
					case 'con':
						Event.addListener(a, Event.ON_CLICK, evt.onConClick);
						break;

					case 'lab':
						Event.addListener(a, Event.ON_CLICK, evt.onLabClick);
						break;

					case 'remove':
						Event.addListener(a, Event.ON_CLICK, evt.onRemoveClick);
						break;
				}
			}
		},


		/**
		 * Public reference to submit the action form
		 *
		 * @method submitActionForm
		 * @public
		 */
		submitActionForm: function() {
			Form.getInputs(dom.optionForm, 'hidden', 'task')[0].value = 'delete';
			dom.optionForm.submit();
		}
	};

	// update variables
	that = new F();
	isGroup = Dom.hasClass(dom.content, that.CLASS_GROUP);


	// attach non-id referenced Dom elements
	var column = dom.content[isGroup? 'firstChild': 'lastChild'],
		isRequiredState = Dom.hasClass(dom.content, Core.Constants.CLASS_REQUIRED); // for groupProfile
	
	widgets = Dom.getChildrenByTagAndClass(column, 'div', Core.View.ProfileWidget.prototype.CLASS_PROFILE_CONTAINER);

	Event.addListener(that.ID_PROFILE_EDIT_ALL, Event.ON_MOUSE_DOWN, evt.onShowAllEdit);
	Event.addListener(that.ID_PROFILE_EDIT_ALL + '2', Event.ON_MOUSE_DOWN, evt.onShowAllEdit);
	
	Core.batch(widgets, function(w, i) {
		var o = new Core.View.ProfileWidget(w),
			f = o.getForm();

		if (f) {
			var fobj = new Core.Widget.FormManager(f),
				id = o.getId(),
				t = o.getType();

			fobj.init();
			o.fobj = fobj;

			Event.addListener(o.getButtonClose(), Event.ON_CLICK, evt.onHideEdit, o);

			// iterate on the anchors in content and attach events as appropriate
			Core.batch(o.getEditAnchors(), function(l) {
				Event.addListener(l, Event.ON_MOUSE_DOWN, evt.onShowEdit, o);
			});

			if ('profile-information' == id) {
				fobj.attachFormValidatedEvent(function(form) {form.submit();});
			}
			else {
				fobj.attachFormValidatedEvent(onSave, o, true);
			}

			// create group hack
			if (isRequiredState) {
				Event.addListener('information-create', Event.ON_CLICK, function(e) {
					Event.stopEvent(e);
					this.submit();
				}, f, true);
			}


			// administrator block
			if (o.isAdmin()) {
				Event.addListener(o.getButtonClear(), Event.ON_MOUSE_DOWN, function(e) {
					Form.clear(f, ['hidden', 'button', 'reset', 'submit']);
				});
			}

			// multiple entry block
			if (o.isMulti()) {
				Event.addListener(o.getAnchorAdd(), Event.ON_CLICK, evt.onAddClick, o);

				Core.batch(o.getTbodies(), function(tb) {
					that.addTbodyEvent(tb);
				});
			}

			// form is of type institution, add some additional events
			if ('institution' == t) {
				var publication = $('profile-institution-publication'),
					resourceAdd = $('profile-institution-resource-add'),
					resourceRemove = $('profile-institution-resource-remove'),
					skillAdd = $('profile-institution-skill-add'),
					skillRemove = $('profile-institution-skill-remove');

				Event.addListener(skillAdd, Event.ON_MOUSE_CLICK, addWord);
				Event.addListener(skillRemove, Event.ON_MOUSE_CLICK, removeWord);
				Event.addListener(resourceAdd, Event.ON_MOUSE_CLICK, addWord);
				Event.addListener(resourceRemove, Event.ON_MOUSE_CLICK, removeWord);
				Event.addListener(publication, Event.ON_MOUSE_CLICK, publicationSearch);
			}

			widgets[i] = o;
			dom.formsMap[id] = fobj;
		}
	});

	Core.Widget.ToggleManager.addTogglesByTagName('h4', dom.content);
	new Core.Widget.SearchResults($('profile-actions'));

	// the profile is editable
	if (0 < widgets.length) {
		// profile is owned by a group
		if (isGroup) {
			var optAddAdmin = $('option-add-admin'),
				optDelete = $('option-delete-group'),
				optLeave = $('option-leave-group');

			// attach events
			if (optAddAdmin) {Event.addListener(optAddAdmin, Event.ON_MOUSE_DOWN, evt.onAddAdmin);}
			if (optDelete) {Event.addListener(optDelete, Event.ON_MOUSE_DOWN, evt.onConfirmDelete);}
			if (optLeave) {Event.addListener(optLeave, Event.ON_MOUSE_DOWN, evt.onConfirmRemove);}

			Event.addListener('profile-information-keyword-add', Event.ON_MOUSE_CLICK, addWord);
			Event.addListener('profile-information-keyword-remove', Event.ON_MOUSE_CLICK, removeWord);
			Form.Element.onFocusAndBlur($('group-edit-name'), 'YOUR GROUP NAME');
		}

		try {
			dom.portraitDlg = new YAHOO.widget.SimpleDialog("profile-portrait", {
				constraintoviewport: true,
				draggable	: false,
				fixedcenter	: true,
				modal		: true,
				width		: '500px',
				shadow		: true,
				proxyDrag	: true,
				visible		: false
			});
			dom.portraitDlg.render(Dom.getBodyElement());

			Event.addListener('profile-portrait-edit', Event.ON_MOUSE_CLICK, function(){dom.portraitDlg.show();});
		}
		catch(e) {
			// squelch non-fatal exception fire in IE 7
		}

		Event.addListener('profile-portrait-edit-add', Event.ON_MOUSE_CLICK, validateAndSubmitPortrait);
		Event.addListener('profile-portrait-edit-remove', Event.ON_MOUSE_CLICK, function() {
			var form = dom.portraitDlg.body.getElementsByTagName('form')[0];
			Form.getInputs(form, 'checkbox')[0].checked = true;
			Form.getInputs(form, 'file')[0].value = '';
			validateAndSubmitPortrait();
		});
	}

	return that;
}();
