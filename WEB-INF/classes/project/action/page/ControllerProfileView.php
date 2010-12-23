<?php
import('project.action.ControllerBase');
import('project.model.ProfileWidget');
import('project.model.ProfileWidgetField');

/**
 * @package project.action.user
 */
class ControllerProfileView extends ControllerBase {

	/**
	 * @Override
	 */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

		// retrieve managers and create active user references
		list($man, $servMember, $servPW) = $this->_getServices($request, 'BaseManager', 'ServiceMember', 'ServiceProfileWidget');
		$sId = $S->getId();
		$isAdmin = $S->isAdmin();

		$styles = array('profile', 'wall');
		$scripts = array('wall', 'profile');

		$widgets = $servPW->getProfileWidgetsBySearchableType($S->getType());
		$servPW->getProfileWidgetsFieldValues($widgets, $sId, false);
		$pws = array();


//		dlog(1);
//		$ids = $man->getChildrenSearchableIds($S->getId(), true);
//		dlog(implode(',', $ids));

		foreach ($widgets as $pw) {
			if ('portrait' === $pw->getTask()) {
				$request->setAttribute(c('MN_WIDGET') . 'Portrait', $pw);
			}
			else {
				array_push($pws, $pw);
			}
		}

		$request->setAttribute(c('MN_WIDGETS'), $pws);

		if ($S->isUser()) {
			// inject the contacts into the User object
			$params = array();
			$params['offset'] = 0;
			$params['limit'] = 6;
			$params[c('QK_TYPE')] = Searchable::$TYPE_USER;
			list($friends, $friendn) = $servMember->readMembers($sId, $params);
			$S->setMembers($friends, $friendn);

			// create an associative array of filtering params
			$params = array();
			$params['offset'] = 0;
			$params['limit'] = c('RESULTS_LIMIT');
			$params[c('QK_TYPE')] = Searchable::$TYPE_GROUP;

			// inject the groups into the User object
			list($groups, $groupn) = $servMember->readMembers($sId, $params, false);
			$S->setGroups($groups, $groupn);
		}
		else {
			// setup query params
			list($aMapDescendents, $aDescendents) = $servMember->readDescendents($sId);

			$members = $aMapDescendents[Searchable::$TYPE_USER];
			$membern = sizeof($members);

			if ($S->isNetwork()) {
				$groups = $aMapDescendents[Searchable::$TYPE_GROUP];
				$groupn = sizeof($groups);

				$networks = $aMapDescendents[Searchable::$TYPE_NETWORK];
				$pnetwork = $servMember->readParent($S->getId());

				$request->setAttribute('pnetwork', $pnetwork);
				$request->setAttribute('networks', $networks);
				$request->setAttribute('networkn', sizeof($networks));
				$request->setAttribute('groups', $groups);
				$request->setAttribute('groupn', $groupn);
			}

			// find the admins of the group
			$params = array(c('QUERY_KEY_LIMIT') => c('RESULTS_LIMIT'), 'admin' => true);
			list($admins, $adminn) = $servMember->readMembers($sId, $params);

			// iterate on the admins to find whether current user is super admin
			for ($i = count($admins) - 1; 0 <= $i; $i -= 1) {
				$a = $admins[$i];
			}

			$isOnlyAdmin = $S->isAdmin() && 1 === sizeof($admins);

			$S->setMembers($members, $membern);
			$request->setAttribute(c('MN_PAGENAME'), ref($S->getType() . 'Profile'));
			$request->setAttribute('isOnlyAdmin', $isOnlyAdmin);
			$request->setAttribute('admins', $admins);
			$request->setAttribute('adminn', sizeof($admins));

			array_push($styles, 'group');
			array_push($scripts, 'group');
		}

		// find the wall post variables
		list($wposts, $wpostn) = $S->hasWall() ? $man->getWallPosts($S) : array(array(), 0);

		// find the wall post variables
		$mbparams = array('limit' => 5, 'S' => $S, 'sId' => $S->getId());
		list($mbposts, $mbpostn) = $S->hasMessageBoard() ? $man->getMessageBoardsByParams($mbparams) : array(array(), 0);

		if ($S->hasRelated()) {
			$rparams = array('nsId' => $S->getId(), 'related' => true);
			$rparams[c('QUERY_KEY_LIMIT')] = 4;

			if ($S->isGroup()) {
				$rparams[c('QUERY_KEY_CATEGORY')] = $S->getCategoryId();
			}

			list($related) = $man->readSearchables($rparams);
			$S->setRelated($related);
		}
		else {
			$S->setRelated(array());
		}

		// set related to false, when there are ZERO results
		if ($S->hasRelated() && 0 === sizeof($S->getRelated())) {
			$S->setFeatures($S->getFeatures() - Searchable::$BITMASK_RELATED);
		}

		// feature attributes
		$request->setAttribute('wallPosts', $wposts);
		$request->setAttribute('wallPostn', $wpostn);
		$request->setAttribute('mbPosts', $mbposts);
		$request->setAttribute('mbPostn', $mbpostn);

		$editClass = $isAdmin ? 'withEdit' : '';
		$profileHD = $this->_getHeader($S->getName(), 'Profile', $isAdmin && $S->getKey() == $aUser->getKey());

		// Core page variables
		$request->setAttribute(c('MN_STYLES'), ref($styles));
		$request->setAttribute(c('MN_SCRIPTS'), ref(array()));

		$request->setAttribute('o', $S);
		$request->setAttribute(c('MN_PARAM_KEY'), ref(c('QUERY_KEY_KEY') . '=' . $S->getKey()));

		$request->setAttribute('viewPrivate', ref($isAdmin || $S->isOpen() || $S->isMember()));
		$request->setAttribute('hd', ref($profileHD));
		$request->setAttribute('editClass', ref($editClass));
		$request->setAttribute('edit', ref(false));
		return ref('success');
	}

	/**
	 * True, when searchable exists.
	 * @method _hasRequired
	 * @param aUser {Searchable} Required. The requester.
	 * @param S {Searchable} Required. The requested context.
	 * @return {Boolean} True, when requirements are met.
	 * @access Protected
	 * @since Release 1.0
	 * @Override
	 */
	protected function _hasRequired($aUser, $S) {
		return $S && $S->getId();
	}
}

?>