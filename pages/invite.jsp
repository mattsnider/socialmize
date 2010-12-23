<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="Invite" direct="true"/>

	<template:put name="header" direct="true">Invite Your Friends</template:put>

	<template:put name="content" direct="true">

	<form action="submitUser.action" id="form-invite" method="post"><fieldset class="panel">

		<h3>Invite Your Friends To ${projectNameUC}</h3>

		<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="invite" />

		<p id="error-email" class="message ${errorDisplay}">Your Message Was Sent.</p>

		<p class="copy">Invite your friends to ${projectNameUC}. Simply include a comma separated list of emails and a short note.</p>

		<ol>

			<li>
				<label for="form-invite-email">${projectNameUC} Email Addresses:</label>
				<span><input class="txt" id="form-invite-email" maxlength="255" name="<? echo(c('QUERY_KEY_EMAIL')); ?>" type="text" />
					<small>(seperate addresses with commas)</small></span>
			</li>

			<li class="textarea">
				<label for="form-invite-note">Note:</label>
				<textarea cols="48" id="form-invite-note" name="<? echo(c('QUERY_KEY_BODY')); ?>" rows="10">${text}</textarea>
			</li>

		</ol>

		<div class="buttons"><input class="btn btn-round" type="submit" value=" Invite! " /></div>

	</fieldset></form>

	<div class="panel" id="panel-example">

		<h3>Example Email</h3>

		<ol class="clearfix">

			<li>
				<span><strong>${aUser.name} Invites You to Join ${projectNameUC}</strong></span>
				<label>Subject:</label>
			</li>

			<li>
				<span><b id="example-text">${text}</b><br /><br /><b>Getting started is easy:
					<a href="${projectUrl}/login.action" target="_blank">${projectUrl}/login.action</a></b>
				</span>
				<label>Message:</label>
			</li>

		</ol>
		
	</div>

	</template:put>
</template:insert>
