<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerSearchViewList extends ControllerPage {

	/**
	 * @Override
	 */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

		// fetch the request parameters
		$offset = $this->_getParameterAsInteger($request, c('QUERY_KEY_OFFSET'), 0);
		$sort = $this->_getParameterAsString($request, c('QUERY_KEY_SORT'));
		$sort = $this->_getParameterAsString($request, c('QUERY_KEY_SORT'));
		$type = $this->_getParameterAsString($request, c('QK_TYPE'));
		$filterId = $this->_getParameterAsInteger($request, c('QUERY_KEY_FILTER'), 0);
		$status = $this->_getParameterAsInteger($request, c('QUERY_KEY_STATUS'), Searchable::$STATUS_ACTIVE);
		$q = $this->_getParameterAsString($request, c('QUERY_KEY_QUERY'), '', c('PARANOID_ALLOWED_AUTOCOMPLETE'));

		// retrieve managers and create active user references
		list($man, $servMember) = $this->_getServices($request, 'BaseManager', 'ServiceMember');
		$aUserId = $aUser->getId();
		$sId = $S ? $S->getId() : null;
		$isReadMembers = $sId;

		if (false !== strpos($q, 'user name or email')) {
			$q = '';
		} // clear default

		// find URI to dispatch
		$pageName = $this->getPagename($request);
		$this->getLog()->debug("Dispatching pagename: $pageName");

		// default values of search related elements
		$results = array();
		$resultn = 0;
		$filterOpts = c('network');
		$header = 'Your Search';
		$noresults = 'No results for your search.';
		$typeName = 'result';

		$params = array();
		$params[c('QUERY_KEY_OFFSET')] = $offset;
		$params[c('QUERY_KEY_SORT')] = $sort;
		$params[c('QUERY_KEY_STATUS')] = $status;
		$params[c('QUERY_KEY_LIMIT')] = c('RESULTS_LIMIT');
		$isOwner = true;

		// handle URI dispatching
		switch ($pageName) {
			case 'mynetworks':
				$isOwner = false;
			case 'networks':
				$type = Searchable::$TYPE_NETWORK;
				$typeName = $this->_getFeatureCustomName('network');
				break;

			case 'subnetworks':
				$type = Searchable::$TYPE_NETWORK;
				$typeName = $this->_getFeatureCustomName('network');
				break;

			case 'members':
				$type = $S->isNetwork() ? array(Searchable::$TYPE_USER, Searchable::$TYPE_GROUP) : Searchable::$TYPE_USER;
				$typeName = $this->_getFeatureCustomName('member');

				$request->setAttribute(c('MN_PAGENAME'), ref($S->getType() . 'Members'));
				break;

			case 'friends':
				$type = Searchable::$TYPE_USER;

				$typeName = $this->_getFeatureCustomName('friend');
				$typeNameUC = $this->_getFeatureCustomName('friend', true, true);

				$filterOpts = c('user-filter');
				$filterOpts[0] = 'All ' . $typeNameUC;

				// current friends params
				$params[c('QUERY_KEY_FILTER')] = 22;

				$header = $this->_getHeader($S->getName(), $typeNameUC, $aUser->isSiteAdmin());
				$emptymsg .= '<br/>You are searching the ' . strtolower($typeNameUC) . ' of ' . $S->getName() . ' , if you mean to search everyone try <a href="search.action">the site search</a>.';

				$request->setAttribute('filterOpts', $filterOpts);
				break;

			case 'mygroups':
				$isOwner = false;
			case 'groups':
				$type = Searchable::$TYPE_GROUP;
				break;

			case 'users':
				$type = Searchable::$TYPE_USER;
				break;
		}

		if ($type) {
			$params[c('QK_TYPE')] = $type;
		}
		if ($filterId) {
			$params[c('QUERY_KEY_FILTER')] = $filterId;
		}
		if ($q) {
			$params[c('QUERY_KEY_QUERY')] = $q;
		}

		if ($S && $S->isNetwork()) {
			list($aMapDescendents) = $servMember->readDescendents($sId);
			$aTypes = is_array($type) ? $type : array($type);
//			dlog('types='.implode(',', $aTypes));

			$aIds = array();
			$aSearchables = array();

			foreach($aTypes as $sType) {
				$aSearchables = array_merge($aSearchables, $aMapDescendents[$sType]);
			}

			foreach ($aSearchables as $s) {
				array_push($aIds, $s->getId());
			}

			$params['sId'] = $aIds;
//			dlog('ids= '. implode(',', $aIds));
			if (array_key_exists(c('QK_TYPE'), $params)) {unset($params[c('QK_TYPE')]);}
			$isReadMembers = false;
		}

		// retrieve search results
		list($results, $resultn) = $isReadMembers ? $servMember->readMembers($sId, $params, $isOwner) : $man->readSearchables($params);
		$servMember->populateMemberCounts($results);

		// todo: optimize this queries -mes
		if (! $isReadMembers) {
			foreach ($results as &$result) {
				$result->setIsMember($servMember->isMember($result->getId(), $aUser->getId()));
			}
		}

		// there are results
		if ($resultn) {
			$subheader = array('Displaying');
			$r1 = $offset + 1;

			if (c('RESULTS_LIMIT') < $resultn) {
				array_push($subheader, $r1 . '-' . ($offset + c('RESULTS_LIMIT') > $resultn ? $resultn : $offset + c('RESULTS_LIMIT')));
				array_push($subheader, 'of');
			}

			array_push($subheader, (1 < $resultn ? $resultn : 'the only'));
			array_push($subheader, pluralize($typeName, $resultn) . '.');
		}
			// no posts
		else {
			$subheader = array('No ' . $typeName . 's.');
		}

		if ('result' != $typeName) {
			$header = ucfirst($typeName) . ' Search';
		}

		$request->setAttribute('subhd', ref(implode(' ', $subheader)));

		$request->setAttribute(c('MN_PARAM_KEY'), ref($sId ? c('QUERY_KEY_KEY') . '=' . $S->getKey() : FALSE));

		$request->setAttribute('resultn', $resultn);
		$request->setAttribute('results', $results);
		$request->setAttribute('noresults', $noresults);

		$request->setAttribute('isGroup', ref(Searchable::$TYPE_GROUP === $type));
		$request->setAttribute(c('QUERY_KEY_QUERY'), $q);
		$request->setAttribute(c('QUERY_KEY_FILTER'), $filterId);
		$request->setAttribute(c('QUERY_KEY_OFFSET'), $offset);

		// pagination parameters
		$request->setAttribute('showRating', ref(true));

		$this->updateHeadAttributes($request, $header, array('searchResult'), array('results'));

		return 'success';
	}
}

?>