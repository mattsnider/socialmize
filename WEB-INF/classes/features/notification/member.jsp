<? function renderNotificationMember($n, $pageContext) {

$isUser = $n->getSearchableBy()->isUser();
$href = $isUser ? 'createSearchableFriend.action?' : 'joinSearchable.action?';
$href .= c('QUERY_KEY_KEY') . '=' . $n->getSearchableBy()->getKey();
$href .= '&' . c('QUERY_KEY_ID') . '=' . $n->getId();
echo '<li><strong>';
echo $n->getSearchableBy()->getNameHTML();
echo '</strong> wants ';
echo $isUser ? 'to be your friend' : 'you to become a member';
echo ' &ndash; <a class="action accept" href="/'.$href.'">accept</a>';
echo ' or ';
printIgnoreLink($n->getId());
echo '<div class="date">'.getTimeAgo($n->getCreated()).'</div></li>';

} ?>