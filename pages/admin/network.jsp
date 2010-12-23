<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="Network Edit" direct="true"/>

	<template:put name="header" direct="true">Network Edit: ${S.name}</template:put>

	<template:put name="content" direct="true">

		<form action="adminSubmit.action" class="standalone" id="form-field" method="post"><fieldset class="panel">

			<p class="copy">Use this form to add children to a network for a hierarchical structure. For example, a League Network might have several
				Division children Networks and each Division Network might have several Team children Networks.</p>

			<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="searchable" />
			<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${S.key}" />
			<input name="<? echo(c('QK_SUB_TASK')); ?>" type="hidden" value="<? echo(c('QK_CREATE')); ?>" />
			<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="<? echo(c('QUERY_KEY_NETWORK')); ?>" />

			<c:if test="${'active' == S.status}"><ol>
				<c:forEach items="${networks}" var="o"><li>
					<a class="edit next" href="/network.action?key=${o.key}">${o.name}</a>
					[<a class="edit" href="/profile.action?key=${o.key}">profile</a>]
					[<a class="edit" href="/editprofile.action?key=${o.key}&<? echo(c('QUERY_KEY_TASK') . '=' . c('QUERY_KEY_NETWORK')); ?>">edit</a>]
				</li></c:forEach>

				<li>
					<input class="txt" name="<? echo(c('QUERY_KEY_NAME')); ?>" type="text"/>
					<input class="btn btn-round" type="submit" value=" Add "/>
				</li>
			</ol></c:if>

			<?
				$S = $pageContext->findAttribute('S', true);
				$P = $pageContext->findAttribute('parent', true);
				$parentId = $P ? $P->getId() : null;
				$parentKey = $P ? $P->getKey() : null;

				echo('<div class="buttons">');
				$query = '?' . c('QUERY_KEY_PAGE') . '=searchable&' . c('QUERY_KEY_TASK') . '=manage';
				$href = $parentId ? 'network.action?' . c('QUERY_KEY_KEY') . '=' . $parentKey : 'admin.action' . $query;

				$arr = array('class' => 'button prev', 'href' => $href);
				echo(HtmlHelper::createAnchorTag($arr, ' Back '));

				if (Searchable::$STATUS_ACTIVE == $S->getStatus()) {
					$query .= '&' . c('QUERY_KEY_TASK') . '=' . c('QK_DELETE') . 'Network&' . c('QUERY_KEY_KEY') . '=' . $parentKey . '&' . c('QK_SUB_TASK') . '=' . c('QK_DELETE');
					$arr = array('class' => 'button', 'href' => 'confirm.action' . $query);
					echo(HtmlHelper::createAnchorTag($arr, ' Delete '));
				}

				echo('</div>');
			?>

		</fieldset></form>

	</template:put>
</template:insert>
