<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">${projectNameUC}: Required Fields</template:put>

	<template:put name="header" direct="true">${projectNameUC}: Required Fields</template:put>

	<template:put name="other" direct="true"><c:import url="../registrationTask/header.jsp" /></template:put>

	<template:put name="content" direct="true">

		<h3>The following are required fields. Please complete them before logging in.</h3>

		<c:import url="../../profile/profileEditFields.jsp"/>

	</template:put>
</template:insert>