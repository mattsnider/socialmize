<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerManageSearchableView extends ControllerPage
{

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S)
	{
		$this->getLog();

		$task = $this->_getParameterAsString($request, c('QUERY_KEY_TASK'), 'invite');

		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'BaseManager');
		$aUserId = $aUser->getId();
		$sId = $S->getId();

		$hd = '';
		$styles = array();

        $request->setAttribute('o', $S);

        // setup query params
        $params = array('ownerId' => $sId, 'memberStatus' => Searchable::$STATUS_ACTIVE);
        $params[c('QK_TYPE')] = Searchable::$TYPE_USER;
        $nameMember = $request->getAttribute(c('MN_NAME_MEMBER'));
        $nameMembers = $request->getAttribute(c('MN_NAME_MEMBER') . 's');

        // find members of the group
        list($members, $membern) = $man->readSearchables($params);

        switch ($task)
		{

            case 'invite':
                $listOfUserIds = array();
                $adminn = 0;

                // iterate on the members and set member states
                foreach ($members as &$o)
				{
			    	$o->setIsMember($man->isMember($S->getId(), $o->getId()));
                    array_push($listOfUserIds, $o->getId());
                    if ($o->isAdmin()) {$adminn += 1;}
                }

                $request->setAttribute('members', $members);
                $request->setAttribute('membern', $membern);
                $membert = array('Showing ');

                // remove pending members from the invite list
                $params['memberStatus'] = Searchable::$STATUS_PENDING;
                list($pending) = $man->readSearchables($params);
                for ($i = count($pending) - 1; 0 <= $i; $i -= 1)
				{
                    array_push($listOfUserIds, $pending[$i]->getId());
                }

				// friends to invite not already in group
                $notInClause = '`searchable_searchable`.`searchableB_id` NOT IN (' . implode(',', $listOfUserIds) . ')';
                $params = array('offset' => null, 'ownerId' => $aUserId, 'sql' => $notInClause, 'memberStatus' => Searchable::$STATUS_ACTIVE);
                $params[c('QK_TYPE')] = Searchable::$TYPE_USER;
                list($friends, $friendn) = $man->readSearchables($params);
                $hd = 'Invite ' . $nameMembers;

                $request->setAttribute('friends', $friends);
                $request->setAttribute('friendn', $friendn);
                $request->setAttribute('adminn', $adminn);
            break;

            case 'message':
                $hd = 'Message ' . $nameMembers;
                $membert = array('Messaging ');
                $styles = array('wall');
            break;

            default:
                return ref('failure');
            break;
        }

        array_push($styles, 'manage');
        array_push($membert, (1 < $membern ? $membern : 'the only'));
        array_push($membert, pluralize($nameMember, $membern));

        $request->setAttribute('membert', implode(' ', $membert));
        $request->setAttribute('action', $task);

        $request->setAttribute(c('QUERY_KEY_TASK'), $task);

        $this->updateHeadAttributes($request, $hd, array(), $styles);

        return ref('success');
	}

    /**
     * True, when searchable exists.
     * @method _hasRequired
     * @param aUser {Searchable} Required. The requester.
     * @param S {Searchable} Required. The requested context.
	 * @param request {HttpServletRequest} Required. The servlet request.
     * @return {Boolean} True, when requirements are met.
	 * @access Protected
	 * @since Release 1.0
	 * @Override
     */
	protected function _hasRequired($aUser, $S, $request)
	{
	    return $S && $S->getId();
	}
}

?>
