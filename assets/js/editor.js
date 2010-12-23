
/* @group Editor Utilities */

Core.Util.Editor = function() {
	var REGEX = {
		EMAIL		: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*\.(\w{2}|(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum))$/,
	/*EMAIL		: /^\w(\.?\w)*@\w(\.?[-\w])*\.[a-z]{2,4}$/i,
		PHONE_DASHED: /^\(?\d{3}\)?\s|-\d{3}-\d{4}$/,
		PHONE_PAREN	: /(\d{3})(\d{3})(\d{4})/,
		PHONE_INTER	: /^\d(\d|-){7,20}/, // international*/
		PHONE		: /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/,
		URI			: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
		ZIPCODE		: /^\d{5}([\-]\d{4})?$/
	};

	return {
		/**
		 *	Iterates through the targets siblings, finds all the form fields, and ensures they have value. Also, cleans out DOM whitespaces
		 *	@param	targ {DOMElement}				The input element
		 *	@return	{Boolean}						True, if the length of the value is less than 1500 chars
		 */
		areSiblingFieldsSet: function(targ) {
			var p = targ.parentNode, valid = true;
			var node = p.firstChild;
			while (node.nextSibling) {
				node = node.nextSibling;
				if (node.tagName) {
					var tn = node.tagName.toLowerCase();
					if ('input' == tn || 'select' == tn || 'textarea' == tn) {
						valid = valid && isSet($F(node));
					}
				}
				else if (document.TEXT_NODE == node.nodeType && !/\S/.test(node.nodeValue)) {p.removeChild(node);}
			}
			return valid;
		},


		/**
		 *	Tests if the value of the DOMElement is less than 1500 chars
		 *	@param	targ {DOMElement}				The input element
		 *	@return	{Boolean}						True, if the length of the value is less than 1500 chars
		 */
		isCharLen1500: function(targ) {
			return 1500 >= $F(targ).length;
		},


		/**
		 *	Tests if the value is an email address, in an accepted format
		 *	return	{Boolean}						True, if is a valid email
		 */
		isEmail: function(val) {
			if (isDomElement(val)) {val = $F(val);}
			return REGEX.EMAIL.test(val.trim());
		},


		/**
		 *	Tests if the value is a phone number, in an accepted format
		 *	return	{Boolean}						True, if is a valid phone number
		 */
		isPhone: function(val) {
			if (isDomElement(val)) {val = $F(val);}
			val = val.trim();
			return ! val || REGEX.PHONE.test(val);
		},


		/**
		 *	Tests if the value of the DOMElement is a 4-digit year
		 *	@param	targ {DOMElement}				The input element
		 *	@return	{Boolean}						True, if value is 4-digit year
		 */
		isYear: function(targ) {
			targ.value = $F(targ).stripNonNumeric();
			return 4 == $F(targ).length;
		},


		/**
		 *	Tests if the value is a zipcode, in an accepted format
		 *	return	{Boolean}						True, if is a valid zipcode
		 */
		isZipcode: function(val) {
			if (isDomElement(val)) {val = $F(val);}
			return ! val || REGEX.ZIPCODE.test(val);
		},


		/**
		 *	Removes the 'http://' string from the target input
		 *	@param	targ {DOMElement}				The input element
		 *	@return	{Boolean}						Always evaluates to true
		 */
		stripHTTP: function(targ) {
			targ.value = $F(targ).replace('http://', '').replace('HTTP://', '');
			return true;
		},


		/**
		 *	Removes the HTML tags from the target input
		 *	@param	targ {DOMElement}				The input element
		 *	@return	{Boolean}						Always evaluates to true
		 */
		stripTags: function(targ) {
			targ.value = $F(targ).stripTags();
			return true;
		},


		/**
		 * Toggles the time between current and the month/year select boxes used to represent company history end date
		 *
		 * @method toggleCurrent
	 	 * @param targ {HTMLInputElement} The trigger element
	 	 * @static
		 */
		toggleCurrent: function(targ) {
			var root = Dom.getParent(targ, '', 'timespan'),
				node = Form.getInputs(root, 'hidden', 'current')[0],
				span = root.getElementsByTagName('span');

			node.value = '0' == $F(node)? '1': '0';
			Dom.toggle(span[0]);
			Dom.toggle(span[1]);
			return true;
		},


		/**
		 * Toggles the state when the country select onchange is fired, only shows state select if US (id=229) is choosen
		 *
		 * @method toggleState
	 	 * @param targ {HTMLSelectElement} The trigger element
	 	 * @static
		 */
		toggleState: function(targ) {
			Dom.cleanWhitespace(targ.parentNode);
			Dom[(229 == $F(targ)? 'show': 'hide')](targ.nextSibling);
			return true;
		}
	};
}();
var Editor = Core.Util.Editor;

/* @end Editor Utilities */

/*
Core.Util.Editor = Class.create();
Core.Util.Editor.prototype = {
	initialize: function(){
		this.valid == true;
		this.imageTypes = ["jpg","jpeg","gif","png"];
	},
	
	checkAgree: function(el){
		return $(el).checked;
	},
	
	isImage: function(src){
		var i = src.lastIndexOf(".");
		if (i == -1) return false;
		var ftype = src.substr(i+1).toLowerCase();
		return this.imageTypes.indexOf(ftype) != -1
	},
	
	_isValidEmail: function(str) {
		var emailRegex =  /^\w(\.?\w)*@\w(\.?[-\w])*\.[a-z]{2,4}$/i;
		str = str.trim();
		return emailRegex.test(str);
	},
	
	hideMessage: function(m){
		m = $(m);
		m.style.display="none";
	},
	
	showMessage: function(m,message){
		m = $(m);
		m.style.display="block";
		m.innerHTML=message;
	},
	
	validate: function(el, type){
		el = $(el);
		var err = $(el.getAttribute("rel"));
		var val = $F(el);
		var regex;
		this.valid = false;
		
		switch (type) {
			case "email":
				this.valid = this._isValidEmail(val);
				break;
			
			case "phone":
				regex = /^\(?\d{3}\)?\s|-\d{3}-\d{4}$/;
				
				if (val == "" || regex.test(val)) {
					this.valid = true;
				}
				else { // no breaks
					regex = /(\d{3})(\d{3})(\d{4})/;
					this.valid = regex.test(val);
					
					if (this.valid) { // change format
						var m = regex.exec(val);
						el.value = m[1]+"-"+m[2]+"-"+m[3];
					}
					else { // international
						regex = /^\d(\d|-){7,20}/;
						this.valid = regex.test(val);
					}
				}
				break;
				
			case "required":
				this.valid = isset(val);
				break;
				
			case "textarea":
				var size = parseInt(stripNonNumeric(el.getAttribute("size")));
				this.valid = (val.length < size);
				break;
				
			case "zipcode":
				regex = /^\d{5}([\-]\d{4})?$/;
				
				if (val == "" || regex.test(val)) {
					this.valid = true;
				}
				break;
		}
		
		err.style.display = (this.valid)? "none": "block";
		if (! this.valid) {window.location.hash = err.name || err.getAttribute("name");}
		return this.valid;
	},
	
	textAreaSizeSampler: function(e, obj) {
		// override previous 1 second sleep
		if (this.timeoutId) {clearTimeout(this.timeoutId);}
		var self = this;
		// wait 1 second to validate
		this.timeoutId = setTimeout(function() {
			editor.validate(self, "textarea");
		}, 1000);
	}
};
*/

Core.Util.Loader = Class.create();

// todo: improve this, should have an array of image elements
Core.Util.Loader.prototype = {
  initialize: function() {
		this.src = new Image();
		this.src.src = "/assets/images/loader.gif";
	},
	
	show: function() {
		this.img.style.display = "block";
	},
	
	addToDocument: function() {
		var body = Dom.getBodyElement();
		this.img = dh.append(body,{
			tag:"img", id:"loading_img", src:this.src.src, style:"position:absolute;top:50px;right:50px;"
		});
		this.show();
	},
	
	addToElement: function(el) {
		el = $(el);
		el.innerHTML = "";
		el.style.display = "block";
		this.img = dh.append(el,{tag:"img", id:"loading_img", src:this.src.src});
		this.show();
	},
	
	hide: function() {
		this.img.style.display = "none";
		this.img.parentNode.removeChild(this.img);
		this.img = null;
	}
};
var loadgfx = new Core.Util.Loader();