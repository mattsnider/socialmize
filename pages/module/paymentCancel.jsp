<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="FAQ" direct="true"/>

	<template:put name="header" direct="true">Payment Cancelled</template:put>

	<template:put name="content" direct="true">

		<p>You must complete the payment process before continuing to join ${projectNameUC}.
			Please return to the <a href="/registration_view_payment.action">payment page</a> and follow the instructions there.</p>

	</template:put>
</template:insert>
