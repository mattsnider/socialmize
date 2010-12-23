s
<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">${projectNameUC}: Join Network</template:put>

	<template:put name="header" direct="true">${projectNameUC}: Join Network</template:put>

	<template:put name="other" direct="true"><c:import url="../registrationTask/header.jsp"/></template:put>

	<template:put name="content" direct="true">

		<form action="/registration_update_join.action" method="post">
			<fieldset class="panel">
				
				<h3>Join Network</h3>

				<p class="copy">Use the widget below to check the ${lc_nameNetworks} that you believe you should belong to:</p>

				<div class="content white">
					<c:import url="../../snippet/searchableListOfCheckboxes.jsp"/>
				</div>

			</fieldset>
		</form>

	</template:put>
</template:insert>