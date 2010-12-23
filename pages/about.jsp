<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">About ${projectNameUC}</template:put>

	<template:put name="header" direct="true">About ${projectNameUC}</template:put>

	<template:put name="content" direct="true">

		<div id="content">${about}</div>

	</template:put>
</template:insert>