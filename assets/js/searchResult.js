/**
 *	Copyright (c) 2009, Matt Snider, LLC. All rights reserved.
 *	Version: 1.0
 */

/**
 *  The SearchResult class manages the business logic of all search result pages.
 *  @namespace Core.Controller
 *  @class SearchResult
 *  @dependencies library
 *//*
Core.Controller.SearchResult = (function() {
	// constants
var YU = YAHOO.util,
	E = YU.Event,
	FE = YU.Form.Element,

    // DOM namespace
	_domQuery = $('q'),
	_domQueryGroupFooter = $('group-footer-search'),
	_domResultFilter = $('resultFilter');

    FE.attachFocusAndBlur(_domQuery, 'user name or email');
    FE.attachFocusAndBlur(_domQueryGroupFooter, 'group name or email');

    E.addListener(_domResultFilter, 'submit', function() {
        if (FE.getValue(_domQuery)) {

        }
    });

	return {};
}());*/

YUI($YO).use('gallery-node-input', function(Y) {
	var searchFooter = Y.one('#group-footer-search'),
		blurText = searchFooter ? 'group name or email' : 'user name or email';
	
	new Y.NodeInput({input: '#q', blurText: blurText});
	if (searchFooter) {new Y.NodeInput({input: searchFooter, blurText: blurText});}
});