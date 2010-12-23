<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

<template:put name="title" content="Your Profile" direct="true"/>

<template:put name="header" direct="true">${hd}</template:put>

<template:put name="content" direct="true">

<?
function printEmpty($owner, $title, $task) {
if ($owner) {
echo '<p class="empty"><a href="editprofile.action?' . c('QUERY_KEY_TASK') . '=' . $task . '">Update your ' . $title . ' information</a>.</p>';
}
else {
echo '<p class="empty">This section is incomplete.</p>';
}
}
?>

<div class="profile column-two">

<c:if test="${'group' == o.type || 'network' == o.type}">

	<div class="column-right">

		<c:import url="profile/imageAndAction.jsp"/>

		<c:if test="${'group' == o.type}">
			<c:import url="profile/related.jsp"/>

			<div class="panel" id="profile-groupType">
				<h3>${nameGroup} Access</h3>

				<div class="content">${o.accessMessage}</div>
			</div>

			<c:if test="adminn">
				<div class="panel" id="profile-admins">
					<h3>Administrators</h3>

					<div class="content">
						<ul><c:forEach items="${admins}" var="a">
							<li><a href="profile.action?<? echo(c('QUERY_KEY_KEY')); ?>=${a.key}">${a.name}</a></li>
						</c:forEach></ul>
					</div>
				</div>
			</c:if>
		</c:if>

	</div>

	<div class="column-left">

		<div id="profile-information" class="panel">

			<h3>Information
				<div class="edit">[ <a class="profile-edit" href="editprofile.action?key=${o.key}">edit</a> ]</div>
			</h3>

			<div class="content">

				<c:forEach items="${widgets}" var="w"><c:if test="${w.isActive}">
					<div id="profile-${w.task}" class="profile-container">

						<!-- ----- |  @start Header  | ----- -->

						<h4 class="toggle-open" id="profile-${w.task}-info">${w.name}</h4>
						<c:if test="${o.isAdmin}">
							<div class="edit">[ <a class="profile-edit" name="profile-edit-${w.task}"
												   href="editprofile.action?task=${w.task}&key=${o.key}">edit</a> ]
							</div>
						</c:if>

						<!-- ----- |  @end Header  | ----- -->

						<!-- ----- |  @start Content  | ----- -->

						<dl class="clearfix profile-dl"><c:forEach items="${w.fields}" var="f" varStatus="status">

							<c:if test="${f.showOnProfile}">
								<dt><label>${f.label}</label></dt>
								<dd><p>${f.displayValue}</p></dd>
							</c:if>

							<c:if test="${(status.index + 1) % w.fieldCountDivisor == 0}">
								<dt class="spacer">&nbsp;</dt>
								<dd class="spacer">&nbsp;</dd>
							</c:if>

						</c:forEach></dl>

						<!-- ----- |  @end Content  | ----- -->

					</div>
				</c:if></c:forEach>

				<div class="clearfix"></div>

			</div>

		</div>

		<c:import url="profile/feature/messageBoard.jsp"/>
		<c:import url="profile/members.jsp"/>
		<c:if test="${'network' == o.type}"><?
				$networks = $pageContext->findAttribute('networks', null);
		$networkn = $pageContext->findAttribute('networkn', null);
		$nameNetwork = $pageContext->evaluateTemplateText('${nameNetworks}');
		$nameNetworks = $pageContext->evaluateTemplateText('${lc_nameNetworks}');
		printMembers($pageContext, 'Descendent ' . $nameNetwork, $nameNetworks, 'subnetworks', $networks, $networkn);

		$groups = $pageContext->findAttribute('groups', null);
		$groupn = $pageContext->findAttribute('groupn', null);

		$nameGroup = $pageContext->evaluateTemplateText('${nameGroups}');
		$nameGroups = $pageContext->evaluateTemplateText('${lc_nameGroups}');
		printMembers($pageContext, 'Descendent ' . $nameGroup, $nameGroups, 'groups', $groups, $groupn);

		$nameUser = $pageContext->evaluateTemplateText('${nameUsers}');
		$nameUserLc = $pageContext->evaluateTemplateText('${lc_nameUsers}');
		printMembers($pageContext, 'Descendent ' . $nameUser, $nameUserLc, 'users');
		?></c:if>
		<c:if test="${'network' != o.type}"><?
				$nameMember = $pageContext->evaluateTemplateText('${nameMembers}');
		$nameMemberLc = $pageContext->evaluateTemplateText('${lc_nameMembers}');
		printMembers($pageContext, $nameMember, $nameMemberLc, 'members');
		?></c:if>
		<c:import url="profile/feature/wall.jsp"/>

	</div>

</c:if>

<c:if test="${'user' == o.type}">

	<div class="column-left">

		<c:import url="profile/imageAndAction.jsp"/>

		<c:if test="${viewPrivate}">
			<c:import url="profile/connection.jsp"/>
			<c:import url="profile/members.jsp"/>
			<?
			$nameFriend = $pageContext->evaluateTemplateText('${nameFriends}');
			$nameFriendLc = $pageContext->evaluateTemplateText('${lc_nameFriends}');
			printMembers($pageContext, $nameFriend, $nameFriendLc, 'friends', null, null, false);

			$S = $pageContext->findAttribute('S');
			$nameGroup = $pageContext->evaluateTemplateText('${nameGroups}');
			$nameGroupLc = $pageContext->evaluateTemplateText('${lc_nameGroups}');
			printMembers($pageContext, $nameGroup, $nameGroupLc, 'groups', $S->getGroups(), $S->getGroupn(), false);
			?>
		</c:if>

	</div>

	<div class="column-right">

		<div class="panel" id="profile-information">

			<h3>Information
				<div class="edit">[ <a class="profile-edit" href="editprofile.action?key=${o.key}">edit</a> ]</div>
			</h3>

			<div class="content">

				<c:import url="profile/account.jsp"/>

				<c:if test="${viewPrivate}">

					<c:forEach items="${widgets}" var="w"><c:if test="${w.isActive && (! empty w.fields || S.id == aUser.id)}">
						<div id="profile-${w.task}" class="profile-container">

							<!-- ----- |  @start Header  | ----- -->

							<h4 class="toggle-open" id="profile-${w.task}-info">${w.name}</h4>
							<c:if test="${o.isAdmin}">
								<div class="edit">[ <a class="profile-edit" name="profile-edit-${w.task}"
													   href="editprofile.action?task=${w.task}&key=${o.key}">edit</a> ]
								</div>
							</c:if>

							<!-- ----- |  @end Header  | ----- -->

							<!-- ----- |  @start Content  | ----- -->

							<c:if test="${! empty w.fields}">
								<dl class="clearfix profile-dl"><c:forEach items="${w.fields}" var="f" varStatus="status">

									<c:if test="${f.showOnProfile}">
										<dt><label>${f.label}</label></dt>
										<dd><p>${f.displayValue}</p></dd>
									</c:if>

									<c:if test="${(status.index + 1) % w.fieldCountDivisor == 0}">
										<dt class="spacer">&nbsp;</dt>
										<dd class="spacer">&nbsp;</dd>
									</c:if>

								</c:forEach></dl>
							</c:if>

							<c:if test="${empty w.fields}"><p class="empty">
								<a href="editprofile.action?task=${w.task}&key=${o.key}">Edit this section out</a>
							</p></c:if>

							<!-- ----- |  @end Content  | ----- -->

						</div>
					</c:if></c:forEach>
				</c:if>

			</div>

		</div>

		<c:import url="profile/feature/messageBoard.jsp"/>
		<c:import url="profile/feature/wall.jsp"/>

	</div>

</c:if>

</div>

</template:put>

</template:insert>