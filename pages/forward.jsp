<?
	// these are commented because I want to clear the 'POST' variables, not pass the request directly to the next page
	// <%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
	// <c:redirect context="/">${uri}</c:redirect>
?>
<html>
<head>
	<meta http-equiv="refresh" content="0;url=<html:rewrite page="" />${uri}" />
	<title>Universal Redirect</title>
</head>

<body>
	<input type="hidden" value="${pageName}" /> <!-- first value for pageName is always NULL -->
	<h2>Your data has been saved and you are now being redirected to the &ldquo;${pageName}&rdquo;.</h2>
	<a href="<html:rewrite page="" />${uri}">Or go to the ${pageName} immediately.</a>
</body>
</html>