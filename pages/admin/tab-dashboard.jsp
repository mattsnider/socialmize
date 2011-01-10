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