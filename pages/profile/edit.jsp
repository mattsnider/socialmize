<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="Edit Settings" direct="true"/>

	<template:put name="header" direct="true">${hd}</template:put>

	<template:put name="content" direct="true">

        <?
            $S = $pageContext->findAttribute('S', null);

            // Update the selected tab
            $task = $pageContext->evaluateTemplateText('${task}');
            $paramKey = c('QUERY_KEY_KEY') . '=' . $S->getKey() . '&amp;' . c('QUERY_KEY_TASK') . '=';
            $taburl = 'edit.action?' . $paramKey;
            $profileurl = 'profile.action?' . $paramKey;

			$typeName = $pageContext->evaluateTemplateText('${lc_name' . ucfirst($S->getType()) . '}');
			if ('User' == $typeName) {$typeName = 'account';}
        ?>

		<div class="breadcrumb">
			<a href="<? echo $profileurl; ?>">back to profile</a>
		</div>

        <div class="tabs tabs-round ${S.type} clearfix"><ul>

            <li class="right <? echo(c('QUERY_KEY_ACCESS') == $task ? 'selected' : ''); ?>"><a href="<? echo($taburl); ?>access">privacy settings</a></li>
            <? if (! $S->isUser()) { ?><li class="<? echo('member' == $task ? 'selected' : ''); ?>"><a href="<? echo($taburl); ?>member">manage ${lc_nameMembers}</a></li><? } ?>
            <li class="<? echo('manage' == $task ? 'selected' : ''); ?>"><a href="<? echo($taburl); ?>manage"><? echo($typeName); ?> settings</a></li>

        </ul></div>

        <? if (c('QUERY_KEY_ACCESS') == $task) { ?>

            <c:import url="edit/access.jsp" />

        <? } else if ('manage' == $task) { ?>

            <c:import url="edit/manage.jsp" />

        <? } else if ('member' == $task) { ?>

            <c:import url="edit/member.jsp" />

        <? } ?>

    </template:put>
    
</template:insert>