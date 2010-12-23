<div class="tabs tabs-sub tabs-round clearfix" id="tabs-config"><ul><?

	// Update the selected tab
	$subpage = $pageContext->evaluateTemplateText('${' . c('QUERY_KEY_TASK') . '}');
	$clsStats = $subpage === 'stats' || ! $subpage ? 'selected' : '';
	$clsMore = $subpage === 'more' ? 'selected' : '';
	$subtabURL = 'admin.action?' . c('QUERY_KEY_PAGE') . '=dash&amp;' . c('QUERY_KEY_TASK') . '=';

	echo '<li class="first '.$clsStats.'"><a href="'.$subtabURL.'stats">Statistics</a></li>';
	echo '<li class="'.$clsMore.'"><a href="'.$subtabURL.'more">More to come&hellip;</a></li>';

?></ul></div>

<c:if test="${'stats' == task}">
<form action="adminSubmit.action" id="form-stats" method="post"><fieldset class="panel squareTop">

	<h4>Site Usage Statistics</h4>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="stats" />
	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

	<p class="copy">This panel contains a collection of useful site statistics.</p>

	<dl>
		<dt><strong>User Stats</strong></dt>
		<dd><p>
			There are ${userCount} users total and of those, ${activeUserCount} were active in the last 2 weeks (${userActivePercent}%).
		</p></dd>
		<dt><strong>Last Login</strong></dt>
		<dd><c:forEach items="${lastLoginUsers}" var="o">
			<p>${o.nameHTML} last logged in at ${o.lastLoginDisplay}</p>
		</c:forEach></dd>
		<dt><strong>Last Updated</strong></dt>
		<dd><c:forEach items="${lastUpdatedSearchables}" var="o">
			<p>${o.nameHTML} was updated at ${o.lastUpdated}</p>
		</c:forEach></dd>
		<dt><strong></strong></dt>
		<dd></dd>
	</dl>

</fieldset></form>
</c:if>

<c:if test="${'more' == task}"><p>
	Like I said, more to come.
</p></c:if>