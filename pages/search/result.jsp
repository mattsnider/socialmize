<?
function result($pageContext, $o) {
	$name = $o->getName();
	$key = $o->getKey();
	$isMember = $o->isMember();

	$aUserKey = $pageContext->evaluateTemplateText('${aUser.key}');
	$aUserId = $pageContext->evaluateTemplateText('${aUser.id}');
	$q = $pageContext->evaluateTemplateText('${q}');
	$S = $pageContext->findAttribute('S', null);

    $membern = $o->getMembern();

    $matches = array();
	$matchstr = '';

    $qKey = c('QUERY_KEY_KEY') . '=' . $key;

	$memberUrl = ($o->isUser() ? 'friends' : 'members') . '.action?' . $qKey;
	$memberName = $pageContext->evaluateTemplateText('${lc_name' . ($o->isUser() ? 'Friend' : 'Member') . '}');
	$memberName = pluralize($memberName, $membern);

    // calculate what matched
//	if ($q) {
//		$skills = explode(', ', $institution->getSkills());
//		$resources = explode(', ', $institution->getResources());
//		$posName = strpos(strtolower($name), $q);
//		$posFocus = strpos(strtolower($institution->getFocus()), $q);
//		$posSkill = array_search($q, $skills);
//		$posResource = array_search($q, $resources);
//
//		if ($posSkill || 0 === $posSkill) {array_push($matches, '<a href="' . c('ASEARCH') . '&sk=' . $q . '">skill</a>');}
//		if ($posResource || 0 === $posResource) {array_push($matches, '<a href="' . c('ASEARCH') . '&rs=' . $q . '">resource</a>');}
//		if ($posName || 0 === $posName) {array_push($matches, '<a href="' . c('ASEARCH') . '&name=' . $q . '">username</a>');}
//		if ($posFocus || 0 === $posFocus) {array_push($matches, '<a href="' . c('ASEARCH') . '&rf=' . $q . '">focus</a>');}
//
//		$matchstr = implode(', ', $matches);
//	}
?>

<div class="image"><? echo($o->getThumbnailHTML()); ?></div>

<div class="info">
	<div class="name"><? echo($o->getNameHTML()); ?></div>
	<div><? if  (! $o->isPrivate() || $o->isMember()) {
		echo '<a href="'.$memberUrl.'">';
		echo $membern . ' ' . $memberName;
		echo '</a>';
	} ?></div>
	<div class="date">Updated <? echo(getTimeAgo($o->getModified())); ?></div>
</div>

<ul class="actions"><? if  (! $o->isPrivate() || $o->isMember()) { ?>

	<? if ($aUserKey != $key && $o->isUser()) { ?>

		<? /*if ($o->isGroup() && $o->isAdmin()) { ?>
			<li><a class="action-member" href="sumbitGroup?<? echo($qKey); ?>&action=remove">remove ${lc_nameMember}</a></li>
		<? }*/ ?>

        <? if ($o->isUser()) { ?>

	<? /*
            <li><a class="action-contact" href="confirm.action?<? echo($qKey); ?>&task=<? echo $isMember? 'memberDelete': 'memberAdd'; ?>">
                <? echo $isMember? 'remove': 'add'; ?> ${lc_nameFriends}
            </a></li>
	*/ ?>
	
            <? if (! $isMember) { ?><li><a class="action-contact" href="confirm.action?<? echo($qKey); ?>&task=<? echo $isMember? 'memberDelete': 'memberAdd'; ?>">
                add ${lc_nameFriends}
            </a></li><? } ?>

            <li><?
            	$href = 'writeMessage.action?' . c('QUERY_KEY_KEY') . 'to=' . $o->getKey() . '&' . c('QUERY_KEY_KEY') . '='
            	?>
				<a class="action-message" href="<? echo($href); ?>${aUser.key}">write ${lc_nameMessage}</a>
            </li>

	    <? } ?>

	<? } ?>

	<li><?
		echo '<a href="'.$memberUrl.'">view '.$memberName.'</a>';
	?></li>

<? } ?></ul>

<? } ?>