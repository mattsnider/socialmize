<?
$S = $pageContext->findAttribute('S', null);
$nameName = c('QUERY_KEY_NAME');
$typeName = $pageContext->evaluateTemplateText('${name' . ucfirst($S->getType()) . '}');
$hasAdmins = '0' !== $pageContext->evaluateTemplateText('${adminn}');
$name = 'admin';
?>

<div class="panel">

	<h3>Current Administrator(s) of <q>${S.name}</q></h3>

	<p class="copy">
		These are the ${nameUsers} who have permission to edit <q>${S.name}</q>.
	</p>

	<? if ($hasAdmins) { ?>
	<ul><c:forEach items="${admins}" var="s">
		<li>${s.nameHTML}</li>
	</c:forEach></ul>
	<? } ?>

	<? if (! $hasAdmins) { ?><p class="empty"><q>${S.name}</q> has no administrators, only site-wide administrators can edit
	this <? echo($typeName); ?>.</p><? } ?>

</div>

<? if ($S->isSuperAdmin()) { ?><form action="updateSearchableAdmins.action" id="form-<? echo($name); ?>" method="post"><fieldset class="panel">
<a name="<? echo($name); ?>"></a>

<h3>Change the Administrator(s) of <q>${S.name}</q></h3>

<p class="copy">Use this form to change the administrators of this <? echo($typeName); ?>.
	Use the widget below check ${lc_nameUsers} you would like to make administrators.
	Unchecking any ${lc_nameUsers} will remove them as administrators.</p>

<div class="content white">
	<c:import url="../snippet/searchableListOfCheckboxes.jsp"/>
</div>

</fieldset></form><? } ?>