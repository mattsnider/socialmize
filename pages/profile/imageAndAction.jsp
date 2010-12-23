
<!-- ----- |  @group Connection  | ----- -->

<div id="profileImage">
	<a href="${S.rawImage}"><img alt="portrait" class="portrait" id="por-img-0" src="/assets${S.uriImage}" /></a>
</div>

<ul class="actions result"><?

	$S = $pageContext->findAttribute('S', null);
	$aUser = $pageContext->findAttribute('aUser', null);

	if ($S->isUser()) {
		if ($S->getId() === $aUser->getId()) { ?>
			<li><a href="editprofile.action?task=portrait">edit your picture</a></li>
			<li><a href="account.action">edit your account</a></li>
		<? } else {
			$taskContact = $S->isMember() ? 'memberDelete' : 'memberAdd';

			 ?><li><a class="action-contact" href="confirm.action?${qkey}&task=<? echo $taskContact; ?>">
				<c:if test="${S.isMember}">remove ${lc_nameFriend}</c:if>
				<c:if test="${! S.isMember}">become ${lc_nameFriend}s</c:if>
			</a></li>

			<li><?
			 	$href = 'writeMessage.action?' . c('QUERY_KEY_KEY') . 'to=' . $S->getKey() . '&' . c('QUERY_KEY_KEY') . '=' . $aUser->getKey();
			 ?><a class="action-message" href="<? echo($href); ?>">${lc_nameMessage}</a></li>
		<? }
	}
	else if ($S->isGroup()) { ?>

        <c:if test="${hasWall && S.hasWall}">
            <li><a href="wall.action?${qkey}" id="option-view-wall">view ${lc_nameWall}</a></li>
        </c:if>

        <c:if test="${hasMessageBoard && S.hasMessageBoard}">
            <li><a href="messageBoardList.action?${qkey}" id="option-view-messageBoard">view ${lc_nameMessageBoard}</a></li>
        </c:if>

        <c:choose>

            <c:when test="${(S.isMember && ! S.isPrivate) || S.isAdmin}">
                <li><a href="edit.action?${qkey}&<? echo(c('QUERY_KEY_TASK')); ?>=member">invite<c:if test="${S.isAdmin}">/remove</c:if> ${lc_nameFriends}</a></li>
            </c:when>

            <c:when test="${! S.isMember && ! S.isPrivate}">
                <li><a href="/confirm.action?${qkey}&<? echo(c('QUERY_KEY_TASK')); ?>=join" id="option-join-group">join ${lc_nameGroup}</a></li>
            </c:when>

            <c:otherwise> </c:otherwise>

        </c:choose>

        <c:if test="${S.isAdmin}">
			<li><a href="edit.action?${qkey}&task=manage">manage ${lc_nameGroup}</a></li>
            <li><a href="editprofile.action?${qkey}&task=portrait">edit ${lc_nameGroup} picture</a></li>
            <li><a href="writeMessage.action?${qkey}&<? echo(c('QK_TYPE').'='.Searchable::$TYPE_GROUP); ?>">send a ${lc_nameMessage} to ${lc_nameMember}</a></li>
        </c:if>

        <c:if test="${S.isSuperAdmin}">
            <li><a href="edit.action?${qkey}&<? echo(c('QUERY_KEY_TASK')); ?>=manage#admin">add/remove administrators</a></li>
        </c:if>

        <c:if test="${! S.isSuperAdmin && S.isMember}">
            <li><a href="/confirm.action?${qkey}&<? echo(c('QUERY_KEY_TASK')); ?>=leave" id="option-leave-group">leave this ${lc_nameGroup}</a></li>
        </c:if>

        <c:if test="${S.isSuperAdmin}">
            <li><a href="confirm.action?${qkey}&<? echo(c('QUERY_KEY_TASK')); ?>=delete" id="option-delete-group">delete this ${lc_nameGroup}</a></li>
        </c:if>

    <? } else if ($S->isNetwork()) { ?>
		<c:if test="${aUser.isSiteAdmin}">
			<li><a href="/admin.action?page=searchable&task=member">to ${lc_nameNetwork} administration</a></li>
		</c:if>
		<c:if test="${null != pnetwork}"><a href="<?
			$pnetwork = $pageContext->findAttribute('pnetwork', null);
			echo '/profile.action?' . c('QUERY_KEY_KEY') . '=' . $pnetwork->getKey();
		?>">to parent ${lc_nameNetwork}</a></c:if>
        <c:if test="${S.isSuperAdmin}">
            <li><a href="edit.action?${qkey}&<? echo(c('QUERY_KEY_TASK')); ?>=manage#admin">add/remove administrators</a></li>
			<li><a href="edit.action?${qkey}&task=member">add/remove ${lc_nameMembers}</a></li>
            <li><a href="edit.action?${qkey}&<? echo(c('QUERY_KEY_TASK')); ?>=manage">manage settings</a></li>
            <li><a href="writeMessage.action?${qkey}&<? echo(c('QK_TYPE').'='.Searchable::$TYPE_NETWORK); ?>">send a ${lc_nameMessage} to ${lc_nameMember}</a></li>
            <li><a href="confirm.action?${qkey}&<? echo(c('QUERY_KEY_TASK')); ?>=delete" id="option-delete-network">delete this ${lc_nameNetwork}</a></li>
        </c:if>
        <c:if test="${S.isAdmin}">
			<li><a href="/editprofile.action?${qkey}">edit profile</a></li>
            <li><a href="/editprofile.action?${qkey}&task=portrait">edit picture</a></li>
        </c:if>
	<? } else { ?>Error processing data.<? } ?>

</ul>

<!-- ----- |  @ end Connection  | ----- -->
