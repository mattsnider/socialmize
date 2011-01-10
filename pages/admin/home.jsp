<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="Administration" direct="true"/>

	<template:put name="header" direct="true">Administration Tools</template:put>

	<template:put name="content" direct="true">

		<c:choose>

			<c:when test="${'dash' == page}"><c:import url="tab-dashboard.jsp" /></c:when>
			<c:when test="${'content' == page}"><c:import url="tab-content.jsp" /></c:when>
			<c:when test="${'custom' == page}"><c:import url="tab-custom.jsp" /></c:when>
			<c:when test="${'message' == page}"><c:import url="tab-message.jsp" /></c:when>
			<c:when test="${'searchable' == page}"><c:import url="tab-user.jsp" /></c:when>
			<c:otherwise><c:import url="tab-config.jsp" /></c:otherwise>

		</c:choose>

	</template:put>
	
</template:insert>