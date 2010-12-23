<?
	$S = $pageContext->findAttribute('S', null);
	$name = 'notify';
	$typeName = $pageContext->evaluateTemplateText('${name' . ucfirst($S->getType()) . '}');
	$lcTypeNames = $pageContext->evaluateTemplateText('${lc_name' . ucfirst($S->getType()) . 's}');
?>
<a name="notify"></a>
<form action="updateSearchableNotification.action" id="form-<? echo($name); ?>" method="post"><fieldset class="panel">
	<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${S.key}" />

	<c:if test="${aUser.id != S.id}"><h3>Notify <q>${S.name}</q></h3></c:if>
	<c:if test="${aUser.id == S.id}"><h3>Notify Me</h3></c:if>

	<p class="copy">${projectNameUC} occasionally notifies <? echo($lcTypeNames); ?> about social events and site changes.
		If you would like to not receive notifications please uncheck the box below:</p>

	<div class="content white"><? if ($S->getEmail()) { ?><dl>
		<dt><label for="<? echo($name); ?>">Send Me Notifications:</label></dt>
		<dd><?
			$attr = array('class' => 'chkbox', 'id' => $name, 'name' => c('QUERY_KEY_CONFIRM'), 'type' => 'checkbox', 'value' => 'on');
			$hasNotify = $S->hasNotify();
			if ($hasNotify) {$attr['checked'] = 'checked';}
			echo(HtmlHelper::createInputTag($attr));
		?></dd>
	</dl><? } ?>

	<c:if test="${!S.email}"><p class="empty">You cannot receive notifications until you setup an email address.</p></c:if>

	<div class="buttons"><?
		$disabled =  $S->getEmail() ? '' : 'disabled="disabled"';
		$cls =  $S->getEmail() ? '' : 'disabled';
		echo '<input class="btn btn-round '.$cls.'" '.$disabled.' type="submit" value=" Update Notifications " />';
	?></div></div>

</fieldset></form>