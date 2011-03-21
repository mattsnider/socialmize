<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">${projectNameUC}: Payment</template:put>

	<template:put name="header" direct="true">${projectNameUC}: Payment</template:put>

	<template:put name="other" direct="true"><c:import url="../registrationTask/header.jsp" /></template:put>

	<template:put name="content" direct="true">

		<h3>Please pay your annual league dues.</h3>

		<div style="padding: 0 1.4em;">

		<p>Dues help cover the costs of fields, referees, and other league maintenance.</p>

		<form action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post"><fieldset>
			<INPUT TYPE="hidden" NAME="return" value="http://socialmize.mattsnider.com/registration_update_payment.action">
			<INPUT TYPE="hidden" NAME="invoice" value="${S.id}">

			<input type="hidden" name="cmd" value="_s-xclick">
			<input type="hidden" name="hosted_button_id" value="J9D9ZM7U4TPSE">
			<input type="image" src="https://www.sandbox.paypal.com/WEBSCR-640-20110306-1/en_US/i/btn/btn_subscribeCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
			<img alt="" border="0" src="https://www.sandbox.paypal.com/WEBSCR-640-20110306-1/en_US/i/scr/pixel.gif" width="1" height="1">
		</fieldset></form>

		<p>If you have already paid your dues or wish to pay through some other means, please contact somebody@somewhere.com.
		Once they have confirmed your payment, you will be notified and may proceed to use ${projectNameUC}.</p>

		</div>
		
<!--
		<form action="/registration_update_payment.action" method="post">
			<button type="submit">Skip for now!</button>
		</form>
-->

	</template:put>
</template:insert>