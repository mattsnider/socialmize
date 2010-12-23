<%@ taglib prefix="c" uri="http://mojavelinux.com/taglibs/phase/core" %>

<?
	$S = $pageContext->findAttribute('S', null);
	$aUser = $pageContext->findAttribute('aUser', null); 
?>

<c:import url="../snippet/updateSearchableEmail.jsp" />

<c:import url="../snippet/updateSearchableNotification.jsp" />

<c:import url="../snippet/updateSearchableName.jsp" />

<? if (! $S->isUser()) { ?><c:import url="../snippet/updateSearchableAdmins.jsp" /> <? } ?>

<? if ($S->isUser()) { ?><c:import url="../snippet/updateUserPassword.jsp" /> <? } ?>

<? if ($S->isSuperAdmin() || $S->getId() == $aUser->getId()) { ?><c:import url="../snippet/deactivateSearchable.jsp" /> <? } ?>