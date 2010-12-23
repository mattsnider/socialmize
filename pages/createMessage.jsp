<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>

<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">${title}</template:put>

	<template:put name="header" direct="true">${hd}</template:put>

	<template:put name="content" direct="true"><div id="message" class="panel squareTop">

		<c:import url="snippet/createMessage.jsp" />

    </div></template:put>

</template:insert>