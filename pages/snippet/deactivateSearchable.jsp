<?
	$S = $pageContext->findAttribute('S', null);
	$typeName = $pageContext->evaluateTemplateText('${name' . ucfirst($S->getType()) . '}');
?>
<form action="deleteSearchable.action" id="form-deactivate" method="post"><fieldset class="panel">
	<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${S.key}" />

	<? if ($S->isUser()) {
		$buttonMessage = 'Deactivate Your Account';
	?>
		<h3>Deactivate Account</h3>

		<p class="copy">${projectNameUC} is a private social network and only accessible to your peers.
			If you are worried about privacy or feel you are receiving unwanted communication, then we suggest
					<a href="/edit.action?key=${S.key}&task=access">changing your privacy first</a>.</p>

		<p class="copy">If you you still desire to leave ${projectNameUC} then clicking the button below will deactivate
			your account until you decide to login again:</p>

	<? } else {
		$buttonMessage = 'Delete ' . $typeName;
	?>
		<h3>Delete <q>${S.name}</q></h3>
		<p class="copy">Use the button below to delete this <? echo ($typeName); ?>. This operation cannot be undone, so be careful:</p>

		<? if ($S->getMembern()) { 
			?><p class="empty">The button below is disabled, because this <? echo ($typeName); ?> still has ${lc_nameMembers}. <br/>You must remove all ${lc_nameMembers}, but yourself before deleting.</p><?
		}
	} ?>

	<div class="buttons"><?
		$disabled =  $S->getMembern() ? 'disabled="disabled"' : '';
		$cls =  $S->getMembern() ? 'disabled' : '';
		echo '<input class="btn btn-round '.$cls.'" '.$disabled.' type="submit" value="' . $buttonMessage . '"/>';
	?></div>

</fieldset></form>