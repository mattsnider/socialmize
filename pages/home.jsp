<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="Your Home" direct="true"/>

	<template:put name="header" direct="true">Welcome to Your ${projectNameUC} Homepage</template:put>

	<template:put name="content" direct="true">

		<c:if test="${1 == aUser.loginCount}"><div class="panel">

			${welcomeCopy}

		</div></c:if>

		<div id="home-notification"><c:import url="snippet/notifications.jsp"/></div>

		<div class="panel" id="mail">

			<div class="empty">Placeholder</div>

		</div>

		<div class="panel" id="account">

			<h3>Your Account</h3>

			<div class="content white minHeight">

				<div class="column">
					<html:link action="/profile"><img class="portrait" src="<html:rewrite page="/assets"/>${aUser.uriImage}" alt="portrait" /></html:link>
				</div>

				<div class="column" id="profile-actions"><ul class="actions">
					<li><a href="profile.action?<? echo(c('QUERY_KEY_KEY')); ?>=${aUser.key}">view your profile</a></li>
					<li><a href="friends.action">see your ${lc_nameFriends}</a></li>
					<li><a href="mailbox.action">${messageCount} new of ${aUser.messagen} ${lc_nameMessages}</a></li>
					<c:if test="${hasGroups}"><li><a href="mygroups.action">see your ${lc_nameGroups}</a></li></c:if>
                    <li><a href="/editprofile.action#access">update your privacy</a></li>
					<li><html:link action="/search">search for people</html:link></li>
				</ul></div>

				<div class="clearfix">&nbsp;</div>

			</div>

		</div>

		<div class="clearfix"></div>

		<div class="post panel" id="news">

			<h3>News</h3>

			<div class="content white">

				<c:if test="${0 == articlen}"><div class="empty">No news or events.</div></c:if>

				<c:if test="${0 < articlen}">
					<ul id="news-list"><c:forEach items="${articles}" var="o">
						<li class="result ${o.typeClass}">

							<div class="title"><a name="news${o.id}"></a>

								<h5><img alt="" src="/assets/images/bg/transparent.gif"/> ${o.title} <div class="date">${o.dateAgo}</div></h5>

							</div>

							<div class="copy">${o.bodyBr}</div>

						</li>
					</c:forEach></ul>
				</c:if>

			</div>

		</div>

	</template:put>
</template:insert>
