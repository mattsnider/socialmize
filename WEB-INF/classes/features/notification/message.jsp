<? function renderNotificationMessage($n,$pageContext) {

	echo '<li>';
	echo '<strong>';
	echo $n->getSearchableBy()->getNameHTML();
	echo '</strong> sent you a '.$pageContext->evaluateTemplateText('${nameMessage}').' &ndash; ';
	echo '<a class="action accept" href="/message.action?'.c('QUERY_KEY_MESSAGE_ID').'='.$n->getRelatedId().'">read</a>';
	echo ' or ';
	printIgnoreLink($n->getId());
	echo '<div class="date">'.getTimeAgo($n->getCreated()).'</div>';
	echo '</li>';

} ?>