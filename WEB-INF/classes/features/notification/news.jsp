<? function renderNotificationNews($n, $pageContext) {

	echo '<li>';
	echo 'New '.$n->getCopy().' posted by the <strong>'.$n->getSearchableBy()->getNameHTML().'</strong>';
	echo ' &ndash; ';
	echo '<a class="action accept" href="/home.action#news'.$n->getRelatedId().'">view</a>';
	echo ' or ';
	printIgnoreLink($n->getId());
	echo '<div class="date">'.getTimeAgo($n->getCreated()).'</div>';
	echo '</li>';

} ?>