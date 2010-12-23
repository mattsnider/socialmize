<?
	$S = $pageContext->findAttribute('S', null);
	$nameName = c('QUERY_KEY_NAME');
	$typeName = $pageContext->evaluateTemplateText('${name' . ucfirst($S->getType()) . '}');
?>
<form action="updateSearchableName.action" id="form-<? echo($nameName); ?>" method="post"><fieldset class="panel">
	<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${S.key}" />

	<c:if test="${aUser.id != S.id}"><h3>Change the Name of <q>${S.name}</q></h3></c:if>
	<c:if test="${aUser.id == S.id}"><h3>Change Your Name</h3></c:if>

	<p class="copy">Use this form to change the name of this <? echo($typeName); ?>. Only alpha-numberic characters, space, underscore, and dash are allowed in names.</p>

	<div class="content white">
	
	<c:if test="${S.isUser}">
		<p class="copy">We recommend the following guidelines when changing your username:</p>
		<ul>
			<li>Use your real name, so that other users can find you</li>
			<li>Example: Enter your first name and the first letter of your last name</li>
		</ul>
	</c:if>

	<dl>
		<dt><label>Current Name:</label></dt>
		<dd><span class="copy">${S.name}</span></dd>
		<dt><label for="<? echo($nameName); ?>">New Name:</label></dt>
		<dd><input class="txt" id="<? echo($nameName); ?>" maxlength="45" name="<? echo($nameName); ?>" type="text" /></dd>
	</dl>

	<div class="buttons"><input class="btn btn-round" type="submit" value=" Change Name " /></div>

	</div>

</fieldset></form>