<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">Login</template:put>

	<template:put name="header" direct="true">Welcome to ${projectNameUC}, Please Login</template:put>

	<template:put name="content" direct="true">
		<?
			$task = $pageContext->evaluateTemplateText('${task}');
			$loginCopy = $pageContext->evaluateTemplateText('${loginCopy}');
			$signupCopy = $pageContext->evaluateTemplateText('${signupCopy}');
			$signupClass = '';
			$loginClass = '';
			$signupFormClass = '';
			$loginFormClass = '';

			if ('S' === $task)
			{
				$signupClass .= 'selected';
				$signupFormClass = 'selected';
			}
			else
			{
				$loginClass .= 'selected';
				$loginFormClass = 'selected';
			}
		?>

		<div class="tabs tabs-round clearfix" id="tab-login-bb"><ul id="tab-login">
			<li class="first <? echo($signupClass); ?>" rel="#form-signup"><a href="/login.action?task=S" id="tab-login-signup">Sign Up!</a></li>
			<li class="last <? echo($loginClass); ?>" rel="#form-login"><a  href="/login.action?task=L" id="tab-login-login">Log In!</a></li>
		</ul></div>

		<form action="loginSubmit.action" class="<? echo($signupFormClass); ?>" id="form-signup" method="post"><fieldset class="squareTop">

			<h3>Sign Up!</h3>

			<p class="message ${displayEmailMaskMessage}">${projectNameUC} requires that users signup using emails from the domain, "${emailMask}".</p>

			<? if ($signupCopy) { echo('<div class="copy">' . $signupCopy . '</div>'); } ?>

			<ul>
				<li><label for="form-signup-email">Email</label><input class="txt" id="form-signup-email" name="email" tabIndex="1" type="email" autofocus/></li>
				<li><label for="form-signup-password">Password</label><input class="txt" id="form-signup-password" name="password" tabIndex="2" type="password"/></li>
				<li><label for="form-signup-confirm">Confirm</label><input class="txt" id="form-signup-confirm" name="confirm" tabIndex="3" type="password"/></li>
				<c:if test="${isAdminInvite}">
				<li class="tall">
					<label>Signup Code:</label><input class="txt" maxlength="6" name="code" tabIndex="4" type="text"/>
					<small>This should have been emailed to you.</small>
				</li>
				</c:if>

			</ul>

			<input name="task" type="hidden" value="signup"/>
			<input id="form-signup-jsEnabled" name="jsEnabled" type="hidden" value="false"/>

			<div class="buttons">
				<input class="btn btn-round" tabIndex="9" type="submit" value="Sign Up"/>
			</div>

		</fieldset></form>

		<form action="/loginSubmit.action" class="<? echo($loginFormClass); ?>" id="form-login" method="post"><fieldset class="squareTop">

			<h3>Log In!</h3>

			<? if ($loginCopy) { echo('<div class="copy">' . $loginCopy . '</div>'); } ?>

			<ul>

				<li><label for="form-signup-email">Email or Username</label><input class="txt" id="form-login-email" name="email" tabIndex="1" type="email" autofocus/></li>
				<li><label for="form-login-password">Password</label><input class="txt" id="form-login-password" name="password" tabIndex="2" type="password"/></li>
				<li>Forgot your password? <a href="recoverPassword.action">Recover it.</a></li>

			</ul>

			<input name="task" type="hidden" value="login"/>
			<input id="form-login-jsEnabled" name="jsEnabled" type="hidden" value="false"/>

			<div class="buttons">
				<input class="btn btn-round" tabIndex="3" type="submit" value="Log In"/>
			</div>

		</fieldset></form>

	</template:put>
</template:insert>