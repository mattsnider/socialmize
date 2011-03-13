s
<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">${projectNameUC}: Connect with the community</template:put>

	<template:put name="header" direct="true">${projectNameUC}: Connect with the community</template:put>

	<template:put name="other" direct="true"><c:import url="../registrationTask/header.jsp"/></template:put>

	<template:put name="content" direct="true">

		<form action="/registration_update_join.action" method="post">
			<fieldset class="panel">

				<h3 id="id_join_title">Join ${lc_nameNetworks}</h3>
				<h3 class="displayNone">Connect with ${lc_nameUsers} and ${lc_nameGroups}</h3>

				<p class="copy" id="id_join_copy">Use the widget below to check the ${lc_nameNetworks} that you belong to:</p>
				<p class="copy displayNone">Use the widget below to connect with others:</p>

				<div class="content white">
					<div id="id_slist_regnetwork"></div>
				</div>

			</fieldset>
		</form>

	</template:put>
</template:insert>