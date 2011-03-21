<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="Edit Your Profile" direct="true"/>

	<template:put name="header" direct="true">${hd}</template:put>

	<template:put name="content" direct="true">

		<?
		$S = $pageContext->findAttribute('S', null);
		$widgets = $pageContext->findAttribute(c('MN_WIDGETS'), null);
		$widget = $pageContext->findAttribute(c('MN_WIDGET'), null);
		$fields = $widget ? $widget->getFields() : array();

		// Update the selected tab
		$task = $pageContext->evaluateTemplateText('${task}');
		$paramKey = c('QUERY_KEY_KEY') . '=' . $S->getKey() . '&amp;' . c('QUERY_KEY_TASK') . '=';
		$taburl = 'editprofile.action?' . $paramKey;
		$profileurl = 'profile.action?' . $paramKey;
		$i = 1;
		$j = sizeof($widgets);

		$typeName = $pageContext->evaluateTemplateText('${lc_name' . ucfirst($S->getType()) . '}');
		if ('User' == $typeName) {$typeName = 'account';}
		?>

		<div id="id_test">My name is <var class="name">INSERT NAME HERE</var>. I enjoy <var class="activity">INSERT ACTIVITY HERE</var>. I like to play <var class="sport">INSERT SPORT HERE</var>.</div>

		<div class="breadcrumb">
			<a href="<? echo $profileurl; ?>">back to profile</a>
		</div>

		<div class="tabs tabs-round ${S.type} clearfix">
			<ul><?

			foreach ($widgets as $w) {
                $className = 1 === $i ? 'first' : ($i === $j ? 'last' : '');
                $classSelect = $w->getNameTask() === $task ? 'selected' : '';
				$i += 1;

				echo '
				<li class="'.$className . ' ' . $classSelect.'">';
					echo'<a href="'.$taburl . $w->getNameTask().'">'.$w->getNameTab().'</a>';
					echo '
				</li>
				';
				}

				?>
			</ul>
		</div>

		<? if ('portrait' == strtolower($widget->getNameTab())) { ?>

		<c:import url="edit/portrait.jsp"/>

		<? } else {
		$hasRequired = false;

		?><c:import url="profileEditFields.jsp"/><?
		} ?>

	</template:put>

</template:insert>