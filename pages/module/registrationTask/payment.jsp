<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">${projectNameUC}: Payment</template:put>

	<template:put name="header" direct="true">${projectNameUC}: Payment</template:put>

	<template:put name="other" direct="true"><c:import url="../registrationTask/header.jsp" /></template:put>

	<template:put name="content" direct="true">

		<h3>Give me your money!.</h3>

		<form action="/registration_update_payment.action" method="post">
			<p>This feature is not enabled yet. You need to dismiss it, to continue to the site.</p>

			<p>
				<button type="submit">Dismiss for now!</button>
			</p>
		</form>

	</template:put>
</template:insert>