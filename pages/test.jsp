
<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>

<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">Test</template:put>

	<template:put name="header" direct="true">Test</template:put>

	<template:put name="content" direct="true">

	Hello World!

	</template:put>
</template:insert>