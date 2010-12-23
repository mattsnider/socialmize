<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<c:if test="${! empty results}">{"ResultSet":{"total":${count},"Results":[<c:forEach items="${results}" var="r" varStatus="status"><?
	$r =& $pageContext->getAttribute('r');
?>{"id":"<? echo($r['id']); ?>","name":"<? echo($r['name']); ?>"}<c:if test="${status.index != count - 1}">,</c:if>
</c:forEach>]}}
</c:if>
<c:if test="${empty results}">{"ResultSet":{"total":0,"Results":[]}}</c:if>