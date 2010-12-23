<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="Error - Unauthorized" direct="true"/>

	<template:put name="header" direct="true">${projectNameUC} - Error Page</template:put>

	<template:put name="content" direct="true"><div class="errorPage">
        <h1>Error: Unauthorized Access</h1>
        <p>You are not authorized to view this page. Your activity has been logged for review.<br/>
            <a href="/home.action?<? echo(c('QUERY_KEY_BUTTON')); ?>=cancel">Return to your previous page.</a></p>
        <p>If you believe this to be in error, please send an email using the "Report a Bug" link in the footer.</p>
    </div></template:put>

</template:insert>