<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">Recover Password</template:put>

	<template:put name="header" direct="true">Recover Your ${projectNameUC} Password</template:put>

	<template:put name="content" direct="true">

		<div class="tabs tabs-round clearfix" id="tab-login-bb"><ul id="tab-login">
			<li class="first" id="#form-signup"><a href="/login.action?task=S" id="tab-login-signup">Sign Up!</a></li>
			<li class="last" id="#form-login"><a  href="/login.action?task=L" id="tab-login-login">Log In!</a></li>
		</ul></div>

		<form action="loginSubmit.action" id="form-recover" method="post"><fieldset class="squareTop">

			<h3>Recover Password!</h3>

			<c:if test="${confirm}"><p>A message has been sent to your email with a new password.</p></c:if>

			<c:if test="${! confirm}">

			<p>We will send you an e-mail containing instructions for how you can recover your password.
				Please enter the email address you used to register for ${projectNameUC}.</p>

			<ul>

				<li><label for="form-recover-email">Email:</label><input class="txt" id="form-recover-email" name="email" tabIndex="1" type="text"/></li>

			</ul>

			<div class="buttons">
				<input class="btn btn-round" tabIndex="2" type="submit" value="Recover Password"/>
			</div>

			<input name="task" type="hidden" value="recoverPassword"/>

			</c:if>

		</fieldset></form>

	</template:put>
</template:insert>
