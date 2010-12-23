<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">${nameGroup} Creation</template:put>

	<template:put name="header" direct="true">${nameGroup} Creation</template:put>

	<template:put name="content" direct="true">
		<div id="create">

			<div class="panel">

				<h3>Create A New ${nameGroup}</h3>

				<form action="/createSearchable.action" method="post">
					<fieldset class="content"><?
            
						$name = $pageContext->evaluateTemplateText('${param.' . c('QUERY_KEY_NAME') . '}');
						$email = $pageContext->evaluateTemplateText('${param.' . c('QUERY_KEY_EMAIL') . '}');
						$catId = $pageContext->evaluateTemplateText('${param.' . c('QUERY_KEY_CATEGORY') . '}');

						$aUser = $pageContext->findAttribute('aUser', null);

						echo '<input name="'.c('QUERY_KEY_TASK').'" type="hidden" value="create"/>';

						echo '<label for="'.c('QUERY_KEY_NAME').'">Name:</label>';
						echo '<input class="txt" maxlength="64" id="'.c('QUERY_KEY_NAME').'" name="'.c('QUERY_KEY_NAME').'" type="text" value="'.$name.'"/>';

						echo '<label for="'.c('QUERY_KEY_EMAIL').'">Email:</label>';
						echo '<input class="txt" maxlength="128" id="'.c('QUERY_KEY_EMAIL').'" name="'.c('QUERY_KEY_EMAIL').'" type="text" value="'.$email.'"/>';

						echo '
						<div class="buttons">';
							echo '<input class="btn btn-round" type="submit" value=" Create "/>';
							echo '<input name="button" class="btn" type="submit" value=" Cancel "/>';
							echo '
						</div>
						';

						?>
					</fieldset>
				</form>

			</div>

		</div>
	</template:put>
</template:insert>
