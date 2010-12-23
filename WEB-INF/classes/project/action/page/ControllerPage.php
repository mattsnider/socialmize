<?php
import('project.action.ControllerBase');

/**
 * @package project.action.page
 */
class ControllerPage extends ControllerBase {

    /**
     * Adds the script and style attributes to the request.
     * @method updateHeadAttributes
     * @param request {HttpServletRequest} Required; The requesting servlet.
     * @param hd {String} Optional. The title; default is empty string.
     * @param scripts {Array} Optional. A collection of JavaScript filenames; default is empty array.
     * @param styles {Array} Optional. A collection of CSS filenames; default is empty array.
     * @since Release 1.0
     * @access protected
     */
    protected function updateHeadAttributes(&$request, $hd='', $scripts=array(), $styles=array()) {
        $request->setAttribute('hd', $hd);
        $request->setAttribute(c('MN_SCRIPTS'), $scripts);
        $request->setAttribute(c('MN_STYLES'), $styles);
    }
}

// define model names constants
//def('MN_USER', 'user');

// define query parameters constants

?>