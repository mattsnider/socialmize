<?

$pendingSearchables = $pageContext->findAttribute('pendingSearchables');
$pendingSearchablen = $pageContext->findAttribute('pendingSearchablen');

$nameMembers = $pageContext->findAttribute(c('MN_NAME_MEMBER'));
$S = $pageContext->findAttribute('S');
$sKey = c('QUERY_KEY_KEY') . '=' . $S->getKey() . '&';

echo '<form action="updateMemberPending.action" id="form-updateMemberPending" method="post"><fieldset class="panel">';
echo '<h3>Confirm New '.$nameMembers.' Requests</h3>';

if ($pendingSearchablen) {
	echo '<ul>';

	foreach ($pendingSearchables as $s) {
		$sKey2 = $sKey . c('QUERY_KEY_KEY') . '2=' . $s->getKey();
		echo '<li>'.$s->getNameHTML().'&nbsp;&nbsp;&nbsp;[<a href="/confirmMember.action?'.$sKey2.'">confirm</a>]&nbsp;&nbsp;&nbsp;[<a href="/deleteMember.action?'.$sKey2.'">reject</a>]</li>';
	}

	echo '</ul>';
}
else {
	echo '<p class="empty">There are no pending members requests.</p>';
}

echo '</fieldset></form>';

?>