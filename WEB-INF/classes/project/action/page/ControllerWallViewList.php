<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerWallViewList extends ControllerPage {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$log = $this->getLog();

		// retrieve managers and create active user references
		list($man, $gm) = $this->_getServices($request, 'BaseManager', 'GroupManager');
		$aUserId = $aUser->getId();
		$sId = $S->getId();
        $name = $S->getName();

        // fetch the wall posts
        list($wposts, $wpostn) = $gm->getWallPosts($S);
        $headText = ucfirst($request->getAttribute('lc_nameWall'));

        if ($wpostn) {
            $subheader = array('Displaying');
            array_push($subheader, (1 < $wpostn ? $wpostn : 'the only'));
            array_push($subheader, pluralize($headText . ' Post', $wpostn));
        }
        else {
            $subheader = array('No results.');
            $message = ref(array());
        }
        $hd = $this->_getHeader($S->getName(), $headText);

        $request->setAttribute('o', $S);
        $request->setAttribute('nameInTitle', $name);
        $request->setAttribute('subhd', ref(implode(' ', $subheader)));
        $request->setAttribute('wallPosts', $wposts);

        $this->updateHeadAttributes($request, $hd, array('group', 'wall'), array('messages', 'group', 'wall'));

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
	    return $S && $S->getId() && $S->hasWall() && ($S->isMember() || $S->isWallPublic());
	}
}

?>