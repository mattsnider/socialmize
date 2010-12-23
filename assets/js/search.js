/**
 *	Copyright (c) 2007, Matt Snider, LLC. All rights reserved.
 *	Version: 1.0
 */

/**
 *  The Search class manages the business logic of the search page.
 *  @namespace Core.Controller
 *  @class Search
 *  @dependencies library
 */

YUI($YO).use('gallery-node-input', function(Y) {
var _domBasicSearch = Y.one('#basic-query'),
	_domBasicSearchInput;

if (_domBasicSearch) {_domBasicSearchInput = new Y.NodeInput({input: _domBasicSearch, blurText: 'enter a name or keyword'});}
});