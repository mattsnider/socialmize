<?
	$S = $pageContext->findAttribute('S', null);
	$name = c('QUERY_KEY_EMAIL');
	$typeName = $pageContext->evaluateTemplateText('${name' . ucfirst($S->getType()) . '}');
?>
<form action="updateSearchableEmail.action" id="form-<? echo($name); ?>" method="post"><fieldset class="panel squareTop">
	<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${S.key}" />

	<c:if test="${aUser.id != S.id}"><h3>Change the Email of <q>${S.name}</q></h3></c:if>
	<c:if test="${aUser.id == S.id}"><h3>Change Your Email</h3></c:if>

	<p class="copy">This email address is where ${projectNameUC} will send notifications.
		If this is not a valid email address, you will not receive notifications<c:if test="${S.isUser}">, nor will you be able to recover your password if you forget it</c:if>.</p>

	<div class="content white"><dl>
		<dt><label>Current Email:</label></dt>
		<dd><span class="copy"><? echo $S->getEmail() ? $S->getEmail() : 'n/a'; ?></span></dd>
		<dt><label for="<? echo($name); ?>">New Email:</label></dt>
		<dd><input class="txt" id="<? echo($name); ?>" maxlength="255" name="<? echo($name); ?>" type="text" /></dd>
	</dl>

	<div class="buttons"><input class="btn btn-round" type="submit" value=" Change Email " /></div></div>

</fieldset></form>