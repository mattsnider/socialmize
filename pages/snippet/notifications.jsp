<?

function printIgnoreLink($nId) {
	echo '<a class="action dismiss" href="/deleteNotification.action?'.c('QUERY_KEY_ID').'='.$nId.'">ignore</a></dd>';
}

foreach (Notification::$TYPES as $type) {
	include 'features/notification/' . $type . '.jsp';
}

?>

<div class="panel squareTop notification">

	<h3>Notifications</h3>

	<?
		$cls = '';
		$notifications = $pageContext->findAttribute('notifications', null);

		if (sizeof($notifications)) {
	?><ul><? foreach ($notifications as $n) {
		$functionName = 'renderNotification' . ucfirst($n->getType());

		if (function_exists($functionName)) {
			call_user_func($functionName, $n, $pageContext);
		}
	} ?></ul>

	<?
		$cls = 'displayNone';
	}

	 echo '<div class="empty '.$cls.'">Nothing to report, you have no new notifications.</div>';
	 ?>

</div>