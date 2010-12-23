<?php
import('project.action.page.ControllerPage');

/**
 * @package project.action.page
 */
class ControllerHomeView extends ControllerPage {

    /**
     * @Override
     */
	public function &executeActually(&$form, &$request, &$response, $aUser, $S) {
		$this->getLog();

		// retrieve managers and create active user references
		list($man) = $this->_getServices($request, 'UserManager');
		$aUserId = $aUser->getId();

		$aUser->setMessages(array(), $man->getMessageCount($aUserId, false));

		// retrieve new contacts
		$params = array();
		$params[c('QUERY_KEY_OFFSET')] = null;
		$params[c('QUERY_KEY_FILTER')] = 22;
		$params['memberId'] = $aUserId;
		$params['memberStatus'] = 'pending';
		list($results) = $man->readSearchables($params);

		$newFriends = array();
		$newGroups = array();

		for ($i = 0, $j = count($results); $i < $j; $i += 1) {
		    $r = $results[$i];

		    if ($r->isUser()) {
		        array_push($newFriends, $r);
		    }
		    else if ($r->isGroup()) {
		        array_push($newGroups, $r);
		    }
		}

		$articles = $man->getNews($aUserId);
		$articles_copy = array();
		$alerts = array();
		foreach ($articles as $o) {
			if ('A' == $o->getType()) {
				array_push($alerts, $o);
			}
			else {
				array_push($articles_copy, $o);
			}
		}
		$articles = $articles_copy;

		$o = new Notification();
		$o->setSearchableById(1);
		$o->setSearchableToId(13);
		$o->setType(c('NotificationTypeNews'));
		$o->setCopy('event');
//		$man->createNotification($o);

		$notifications = $man->getNotificationsBySearchable($aUser);

        $newMessageCount = $request->getAttribute(c('MN_MESSAGEN'));
		$messageText = pluralize($this->_getFeatureCustomName('message'), $newMessageCount);
		
		$cm = $this->_getContentManager($request);
		$welcomeCopy = $cm->fetchContent(ContentManager::$CONTENT_WELCOME);

		$request->setAttribute('o', $aUser);
		$request->setAttribute('newFriends', $newFriends);
		$request->setAttribute('newFriendn', count($newFriends));
		$request->setAttribute('newGroups', $newGroups);
		$request->setAttribute('newGroupn', count($newGroups));
		$request->setAttribute('alerts', $alerts);
		$request->setAttribute('alertn', sizeof($alerts));
		$request->setAttribute('articles', $articles);
		$request->setAttribute('articlen', sizeof($articles));
		$request->setAttribute('messageText', $messageText);
		$request->setAttribute('welcomeCopy', $welcomeCopy);
		$request->setAttribute('notifications', $notifications);

        $this->updateHeadAttributes($request, '', array('home'), array('results', 'home'));
		
		return ref('success');
	}
}
?>
