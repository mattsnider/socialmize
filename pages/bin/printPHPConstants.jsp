<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<html>
<body>
<pre>
array(
	<c:forEach items="${country}" var="c">
		<?
		$c =& $pageContext->getAttribute('c');
		$id = $c['id'];
		$name = $c['name'];
		echo ($id . ' => \'' . $name . '\'');
		?>,
	</c:forEach>
);


array(
	<c:forEach items="${state}" var="c">
		<?
		$c =& $pageContext->getAttribute('c');
		$id = $c['id'];
		$name = $c['name'];
		echo ($id . ' => \'' . $name . '\'');
		?>,
	</c:forEach>
);


array(
	<c:forEach items="${city}" var="c">
		<?
		$c =& $pageContext->getAttribute('c');
		$id = $c['id'];
		$name = $c['name'];
		echo ($id . ' => \'' . $name . '\'');
		?>,
	</c:forEach>
);


array(
	<c:forEach items="${industry}" var="c">
		<?
		$c =& $pageContext->getAttribute('c');
		$id = $c['id'];
		$name = $c['name'];
		echo ($id . ' => \'' . $name . '\'');
		?>,
	</c:forEach>
);
</pre>
</body>
</html>