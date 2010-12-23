<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="Profile Widget Edit" direct="true"/>

	<template:put name="header" direct="true">Profile Widget Edit: ${profileWidgetName}</template:put>

	<template:put name="content" direct="true">

		<form action="adminSubmit.action" class="standalone" id="form-field" method="post"><fieldset class="panel">

            <h3>${profileWidgetName}</h3>

            <input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="field" />


			<c:import url="ajax/profileWidgetAjax.jsp" /><?
			$pw = $pageContext->findAttribute('pw', null);
			$isShowDetails = $pageContext->evaluateTemplateText('${showDetails}');

			if ($isShowDetails) {
				echo('<h5>Fields</h5>');
				$pageContext->doInclude(dirname($pageContext->getRequest()->getServletPath()) . '/fragment/profileWidget.jsp');
				if ($pw) {
					_renderProfileWidgetFields($pw->getId(), $pw->getFields());
				}
				else {
					_renderProfileWidgetFields(0, array());
				}
			}

			echo('<div class="buttons">');
			$arr = array('class' => 'button prev', 'href' => 'admin.action?' . c('QUERY_KEY_PAGE') . '=content&' . c('QUERY_KEY_TASK') . '=field');
			echo(HtmlHelper::createAnchorTag($arr, ' Back '));

			$href = '/profileWidget.action?';

			if (! $isShowDetails) {
			   $href .= (c('QK_SHOW_DETAILS') . '=T');
			}

			if ($pw) {
				$pwId = $pw->getId();
				$href .= '&amp;' . c('QK_PW_ID') . '=' . $pwId;

				$arr = array('class' => 'button', 'href' => $href);
				echo(HtmlHelper::createAnchorTag($arr, $isShowDetails ? 'Hide Fields' : 'Fields'));

				$arr = array('class' => 'button', 'href' => 'admin.action', 'name' => 'delete', 'value' => 'T');
				echo(HtmlHelper::createTag('button', $arr, ' Delete '));
			}

			$arr = array('class' => 'button edit disabled', 'href' => 'adminSubmit.action');
			echo(HtmlHelper::createTag('button', $arr, ' Save '));
			echo('</div>');
		?>

        </fieldset></form>

	</template:put>
</template:insert>
