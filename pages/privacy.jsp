<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="Your Privacy" direct="true"/>

	<template:put name="header" direct="true">${hd}</template:put>

	<template:put name="content" direct="true">

		<form action="submitUser.action" id="form-privacy" method="post"><fieldset class="panel">

			<h3>Change Who Can See Your Profile</h3>

			<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="psearch" />

			<p class="displayNone message" id="form-privacy-saved">Settings Saved!</p>

			<p class="copy">${projectNameUC} is a safe place intended to foster connections between you and your community.
				Therefore, we hope you keep yourself visible to the community. However, if you feel the need for additional privacy,
				we offer the following privacy settings:</p>

			<ol>

				<li>
					<label for="privacy-O">Allow all members of ${projectNameUC} to view your profile.</label>
					<input <c:if test="${'O' == aUser.access}">checked="true"</c:if>  class="chkbox"
						   id="privacy-O" name="<? echo(c('QUERY_KEY_ACCESS')); ?>" type="radio" value="<? echo(Searchable::$ACCESS_OPEN); ?>" />
				</li>

				<li>
					<label for="privacy-C">Allow all members of ${projectNameUC} to view your profile, but hide your contact information and your ${projectNameUC} ${lc_nameFriends}.</label>
					<input <c:if test="${'C' == aUser.access}">checked="true"</c:if>  class="chkbox"
						   id="privacy-C" name="<? echo(c('QUERY_KEY_ACCESS')); ?>" type="radio" value="<? echo(Searchable::$ACCESS_CLOSED); ?>" />
				</li>

				<li>
					<label for="privacy-P">Restrict profile access to only your ${lc_nameFriends}.</label>
					<input <c:if test="${'P' == aUser.access}">checked="true"</c:if>  class="chkbox"
						   id="privacy-P" name="<? echo(c('QUERY_KEY_ACCESS')); ?>" type="radio" value="<? echo(Searchable::$ACCESS_PRIVATE); ?>" />
				</li>

			</ol>

			<div class="buttons"><input class="btn btn-round" type="submit" value="Change Privacy Settings" /></div>

		</fieldset></form>
		
	</template:put>

</template:insert>