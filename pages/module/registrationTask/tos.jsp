<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">${projectNameUC}: Terms and Conditions</template:put>

	<template:put name="header" direct="true">${projectNameUC}: Terms and Conditions</template:put>

	<template:put name="other" direct="true"><c:if test="${!isRead}"><c:import url="../registrationTask/header.jsp" /></c:if></template:put>

	<template:put name="content" direct="true">

		<h3 class="${isRead}">Please read and accept the "${projectNameUC} Terms of Service" before continuing (you only need to do this
			once).</h3>

		<div id="termsContent">
			<div class="termsContent">${terms}</div>
		</div>

		<div class="buttons ${isRead}">

			<form action="registration_update_tos.action" method="post">
				<fieldset>
					<input name="terms" type="hidden" value="T"/>
					<input type="submit" value="Agree to Terms"/>
				</fieldset>
			</form>

			<form action="logout.action">
				<fieldset>
					<input type="submit" value="Leave ${projectNameUC}"/>
				</fieldset>
			</form>

		</div>

	</template:put>
</template:insert>