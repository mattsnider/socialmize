<?
	$S = $pageContext->findAttribute('S', null);
	$name = c('QUERY_KEY_PASSWORD');
?>
<form action="updateUserPassword.action" id="form-<? echo($name); ?>" method="post"><fieldset class="panel">
	<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${S.key}" />

	<h3>Change Your Password</h3>

	<p class="copy">Use this form to change your password.
		Only alpha-numberic characters are allowed.
		Simply type in your old password, then enter the new password twice and submit the form.</p>

	<div class="content white"><dl>
		<dt><label for="o<? echo($name); ?>">Current Password:</label></dt>
		<dd><input autocomplete="off" class="txt" id="o<? echo($name); ?>" maxlength="16" name="o<? echo($name); ?>" type="password" /></dd>
		<dt><label for="n<? echo($name); ?>">New Password:</label></dt>
		<dd><input class="txt" id="n<? echo($name); ?>" maxlength="16" name="n<? echo($name); ?>" type="password" /></dd>
		<dt><label for="c<? echo($name); ?>">Confirm Password:</label></dt>
		<dd><input class="txt" id="c<? echo($name); ?>" maxlength="16" name="c<? echo($name); ?>" type="password" /></dd>
	</dl>

	<div class="buttons"><input class="btn btn-round" type="submit" value=" Change Password " /></div></div>

</fieldset></form>