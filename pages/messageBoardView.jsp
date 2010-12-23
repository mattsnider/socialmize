<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">${nameInTitle}'s ${nameMessageBoard}</template:put>

	<template:put name="header" direct="true">${hd}</template:put>

	<template:put name="content" direct="true"><div id="messageBoardView">

        <div class="panel" id="profile-wall">

			<div class="nav"><a href="profile.action?<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">back to ${o.name} profile</a></div>

			<c:if test="${null != mb}">

            <div class="colInfo">

                ${mb.creator.nameHTML}
                <small>${mb.createdDisplay}</small>
                ${mb.creator.thumbnailHTML}

                <ul class="actions">
                    <c:if test="${aUser.id == mb.creatorId || o.isAdmin}"><li>${mb.anchorDeleteHTML}</li></c:if>

                    <c:if test="${aUser.id != mb.creatorId}">
                        <li><a class="action-message" href="javascript:void(null);">message author</a></li>
                    </c:if>

                </ul>

                <div class="clearfix">&nbsp;</div>

                <c:if test="${mb.originalId || mb.parentId || mbNextId || mbPrevId || mbChildrenn}">

                   <h5>Related Messages:</h5>

                   <ul class="actions">
                        <c:if test="${mb.originalId != mb.parentId}"><li><a href="/messageBoardView.action?<? echo(c('QUERY_KEY_MESSAGE_ID')); ?>=${mb.originalId}&<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">original message</a></li></c:if>
                        <c:if test="${mb.parentId}"><li><a href="/messageBoardView.action?<? echo(c('QUERY_KEY_MESSAGE_ID')); ?>=${mb.parentId}&<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">parent message</a></li></c:if>
                        <c:if test="${mbPrevId}"><li><a href="/messageBoardView.action?<? echo(c('QUERY_KEY_MESSAGE_ID')); ?>=${mbPrevId}&<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">previous message</a></li></c:if>
                        <c:if test="${mbNextId}"><li><a href="/messageBoardView.action?<? echo(c('QUERY_KEY_MESSAGE_ID')); ?>=${mbNextId}&<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">next message</a></li></c:if>
                        <c:if test="${mbChildrenn}"><c:forEach items="${mbChildren}" var="smb">
                            <li><a href="/messageBoardView.action?<? echo(c('QUERY_KEY_MESSAGE_ID')); ?>=${smb.id}&<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">${smb.shortTitle}</a></li>
                        </c:forEach></c:if>
                    </ul>

                </c:if>

            </div>

            <div class="colMessage">

                <h3>${mb.title}</h3>

                <div class="body">${mb.bodyBr}</div>

            </div>

            <div class="clearfix"> </div>

			</c:if>

        </div>

        <c:if test="${hasMessageBoard && o.hasMessageBoard}"><div class="panel"><a name="reply"> </a>

            <h3>Write Message</h3>

            <form action="/submitMessageBoard.action" method="post" id="wall-form"><fieldset class="content">

                <?
                    $mb = $pageContext->findAttribute('mb', null);

                    if ($mb) {
                        $value = 're: ' . $mb->getTitle();
                        $btnText = 'Reply';
                        $bodyText = '';
                    }
                    else {
                        $title = $pageContext->evaluateTemplateText('${param.title}');
                        $body = $pageContext->evaluateTemplateText('${param.body}');
                        $value = $title ? $title : '';
                        $bodyText = $body ? $body : '';
                        $btnText = 'Post';
                    }
                ?>

                <input name="<? echo(c('QUERY_KEY_KEY')); ?>" value="${o.key}" type="hidden" />
				<? if ($mb) { ?>
                <input name="<? echo(c('QUERY_KEY_ORIGINAL_ID')); ?>" type="hidden" value="${mb.inputOriginalId}" />
                <input name="<? echo(c('QUERY_KEY_PARENT_ID')); ?>" type="hidden" value="${mb.id}" />
				<? } ?>
                <input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="C" />

                <label for="<? echo(c('QK_TITLE')); ?>">Title:</label>
                <input class="txt" maxlength="120" id="<? echo(c('QK_TITLE')); ?>"
                       name="<? echo(c('QK_TITLE')); ?>" type="text" value="<? echo($value); ?>" />

                <label for="<? echo(c('QUERY_KEY_BODY')); ?>">Body:</label>
                <textarea class="textarea" cols="43" id="<? echo(c('QUERY_KEY_BODY')); ?>"
                          name="<? echo(c('QUERY_KEY_BODY')); ?>" rows="4"><? echo($bodyText); ?></textarea><br />
                <small class="form-error">(max 1,000 characters)</small>

                <div class="buttons">
                    <input name="button" class="btn" type="submit" value=" Cancel " />
                    <input class="btn btn-round" type="submit" value=" <? echo($btnText); ?> " />
                </div>

            </fieldset></form>
        </div></c:if>

    </div></template:put>
</template:insert>
