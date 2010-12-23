<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>

<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">${title}</template:put>

	<template:put name="header" direct="true">Confirm Action</template:put>

	<template:put name="content" direct="true">
		<form action="/${action}.action" id="form-news" method="post"><fieldset class="panel">

			<h3>${confirmTitle}</h3>

			<p class="copy">${confirmText}</p>

			<div class="buttons">
				<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="confirm" />
				<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="${task}" />
				${inputs}
				<input class="btn btn-round action" type="submit" value="Yes"/>
				<input class="btn" name="<? echo(c('QUERY_KEY_BUTTON')); ?>" type="submit" value="No"/>
			</div>

		</fieldset></form>
	</template:put>

</template:insert>