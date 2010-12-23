<%@ taglib prefix="c" uri="http://mojavelinux.com/taglibs/phase/core" %>

<? $S = $pageContext->findAttribute('S', null); ?>

<? if ($S->isNetwork()) { ?><c:import url="../snippet/readMemberTree.jsp" /><? } ?>

<? if (! $S->isUser()) { ?><c:import url="../snippet/updateMemberPending.jsp" /><? } ?>

<c:import url="../snippet/updateSearchableMembers.jsp" />
