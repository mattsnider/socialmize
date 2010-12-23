<?php
import('project.action.ControllerBase');
import('project.service.ServiceRegistration');
import('include.CustomCSSManager');
import('project.model.ProfileWidget');
import('project.model.ProfileWidgetField');

/**
 * @package project.action.admin
 */
class ControllerAdmin extends ControllerBase {

	/**
	 * @Overide
	 */
	protected function _isAuthorized($S, $request, $aUser) {
		return $aUser->isSiteAdmin() || 'revert' == $this->_getParameterAsString($request, C('QUERY_KEY_TASK'));
	}
}

// define model names constants
def('MN_ARTICLE', 'article');
def('MN_EMAIL', 'email');
def('MN_EMAILS', 'emails');
def('MN_SUBJECT', 'subject');
def('MN_ARTICLES', 'articles');
def('MN_ARTICLES_LENGTH', 'articlen');

def('MN_CHECKED_GROUP', 'checkedGroup');
def('MN_CHECKED_NETWORK', 'checkedNetwork');
def('MN_CHECKED_MODULES', 'checkedModules');
def('MN_CHECKED_SEARCHABLES', 'checkedSearchables');

def('MN_CUSTOMIZATION', 'customization');
def('MN_CUSTOMIZATION_HISTORY', 'customizationHistory');
def('MN_CUSTOMIZATION_HISTORY_LENGTH', 'customizationHistoryLength');

def('MN_USER', 'user');

// define query parameters constants
def('QK_FRIEND', 'friend');
def('QK_GROUP', 'group');
def('QK_MEMBER', 'member');
def('QK_MESSAGE', 'message');
def('QK_MESSAGE_BOARD', 'messageBoard');
def('QK_RELATED', 'related');
def('QK_WALL', 'wall');

def('QK_ADMIN_INVITE', 'adminInvite');
def('QK_REQUIRE_REGISTRATION', 'requireRegistration');
def('QK_REQUIRE_TERMS', 'requireTerms');
def('QK_REQUIRE_CONFIRM', 'requireConfirm');

def('QK_USE_BANNER', 'useBanner');

def('QK_CONTACT_EMAIL', 'contactEmail');
def('QK_HELP_HREF', 'helpHref');

def('QK_PW_ID', 'profileWidgetId');
def('QK_PW_MULTI', 'profileWidgetMulti');
def('QK_PW_NAME', 'profileWidgetName');
def('QK_PW_ORDER', 'profileWidgetOrder');
def('QK_PW_PRIVATE', 'profileWidgetPrivate');
def('QK_PW_STATUS', 'profileWidgetStatus');
def('QK_PW_TAB', 'profileWidgetTab');
def('QK_PW_FIELD_TYPE', 'profileWidgetFieldType');
def('QK_PW_FIELD_ML', 'profileWidgetFieldMaxLength');
def('QK_PWF_ID', 'profileWidgetFieldId');
def('QK_PWF_DEFAULT', 'profileWidgetFieldDefaultValue');
def('QK_PWF_OPTION_NAME', 'profileWidgetFieldOptionName');
def('QK_PWF_OPTION_ID', 'profileWidgetFieldOptionId');
def('QK_PWF_REQUIRED', 'profileWidgetFieldRequired');

?>