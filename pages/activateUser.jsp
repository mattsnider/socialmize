<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">Activate User</template:put>

	<template:put name="header" direct="true">Activate Your ${projectNameUC} User</template:put>

	<template:put name="content" direct="true">

		<form action="loginSubmit.action" id="recover" method="post"><fieldset>

			<h3>User Activation!</h3>

			<c:if test="${confirm}"><p>Your account was successfully activated. Please login on the left.</p></c:if>

			<c:if test="${! confirm}">

			<p>No user exists for the provided information. Please check the url provided in your registration email and try again.</p>
			<p>If you never received an email from us, please complete the form below and we'll resend it:</p>

			<ul>

				<li><label>Email:</label><input class="txt" name="email" tabIndex="1" type="text"/></li>

			</ul>

			<div class="buttons">
				<input class="btn btn-round" tabIndex="2" type="submit" value=" Resend Activation Email "/>
			</div>

			<input name="task" type="hidden" value="activateUser"/>

			</c:if>

		</fieldset></form>

	</template:put>
</template:insert>
