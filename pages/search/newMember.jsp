<c:if test="${0 < newFriendn}"><div class="info" id="info-header-newcontact">

	<h2>You have ${newFriendn} new ${lc_nameFriend} requests</h2>

	<div class="content"><ul class="searchList search-results new" id="search-newcontact">
		<c:forEach items="${newFriends}" var="o"><li class="result highlight">
			<?
				$key = c('QUERY_KEY_KEY') . '=' . $pageContext->evaluateTemplateText('${o.key}');
			?>

			${o.nameHTML} has requested to be added as your ${lc_nameFriend}, would you like to:
			<strong><a href="/createSearchableFriend.action?<? echo($key); ?>">accept</a></strong> or
            <strong><a href="/leaveSearchable.action?<? echo($key); ?>">reject</a></strong>.

		</li></c:forEach>
	</ul></div>

</div></c:if>

<c:if test="${0 < newGroupn}"><div class="info" id="info-header-newgroup">

	<h2>You have ${newGroupn} new ${lc_nameGroup} requests</h2>

	<div class="content"><ul class="searchList search-results new" id="search-newgroup">
		<c:forEach items="${newGroups}" var="o"><li class="result highlight">
			<?
				$key = c('QUERY_KEY_KEY') . '=' . $pageContext->evaluateTemplateText('${o.key}');
			?>

			A ${lc_nameMember} of ${o.nameHTML} has invited you to join, would you like to:
			<strong><a href="/joinSearchable.action?<? echo($key); ?>">accept</a></strong> or
            <strong><a href="/leaveSearchable.action?<? echo($key); ?>">reject</a></strong>.

		</li></c:forEach>
	</ul></div>

</div></c:if>
