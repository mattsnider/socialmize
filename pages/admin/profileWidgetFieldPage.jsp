<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="Profile Widget Field Edit" direct="true"/>

	<template:put name="header" direct="true">Profile Widget Field Edit: "${name}"</template:put>

	<template:put name="content" direct="true">

		<form action="adminSubmit.action" class="profileWidgetField" id="form-field" method="post"><fieldset class="panel">

			<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="field" />

            <c:import url="ajax/profileWidgetFieldAjax.jsp" />

            <div class="buttons"><?
                $pw = $pageContext->findAttribute('pw', null);
                $pwf = $pageContext->findAttribute('pwf', null);
                $arr = array('class' => 'button', 'href' => '/profileWidget.action?' . c('QK_PW_ID') . '=' . $pw->getId() . '&amp;' . c('QK_SHOW_DETAILS') . '=T');
                echo(HtmlHelper::createAnchorTag($arr, 'Back'));

                $arr = array('class' => 'displayNone', 'name' => '');
                echo(HtmlHelper::createTag('button', $arr, ' '));

                if ($pwf) {
                    $arr = array('class' => '', 'name' => c('QK_DELETE'), 'value' => 'T');
                    echo(HtmlHelper::createTag('button', $arr, ' Delete '));
                }

                $arr = array('class' => 'main', 'name' => '');
                echo(HtmlHelper::createTag('button', $arr, ' Save '));
            ?></div>

            <div class="clearfix">&nbsp;</div>

        </fieldset></form>

	</template:put>
</template:insert>
