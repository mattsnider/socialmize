<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="Administration" direct="true"/>

	<template:put name="header" direct="true">Administration Tools</template:put>

	<template:put name="content" direct="true">

        <div class="tabs tabs-round tabs-hasSub clearfix" id="tabs-admin"><ul>

            <?
                // Update the selected tab
                $page = $pageContext->evaluateTemplateText('${' . c('MN_PAGE') . '}');
                $clsDash = $page === 'dash' || ! $page ? 'selected' : '';
                $clsConfig = $page === 'config' || ! $page ? 'selected' : '';
                $clsCustom = $page === 'custom' ? 'selected' : '';
                $clsContent = $page === 'content' ? 'selected' : '';
                $clsMessage = $page === 'message' ? 'selected' : '';
                $clsGroup = $page === 'group' ? 'selected' : '';
                $clsSearchable = $page === 'searchable' ? 'selected' : '';
                $taburl = 'admin.action?' . c('QUERY_KEY_PAGE') . '=';
            ?>

            <li class="first <? echo($clsDash); ?>"><a href="<? echo($taburl); ?>dash">Dashboard</a></li>
            <li class="<? echo($clsConfig); ?>"><a href="<? echo($taburl); ?>config">Configuration</a></li>
            <li class="<? echo($clsContent); ?>"><a href="<? echo($taburl); ?>content">Content</a></li>
            <li class="<? echo($clsCustom); ?>"><a href="<? echo($taburl); ?>custom">Customize</a></li>
            <li class="<? echo($clsMessage); ?>"><a href="<? echo($taburl); ?>message">Message Center</a></li>
            <li class="last <? echo($clsSearchable); ?>"><a href="<? echo($taburl); ?>searchable">Member Manager</a></li>
            
        </ul></div>

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