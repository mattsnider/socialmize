<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">${nameInTitle}'s Message Board</template:put>

	<template:put name="header" direct="true">${hd}</template:put>

    <template:put name="content" direct="true"><div id="messageBoardList">

        <c:import url="tmpl/pagination-tpl.jsp"/>

        <form method="get" action="messageBoardList.action"><fieldset>
            <span>Search messages for</span>
            <input class="txt" name="<? echo(c('QUERY_KEY_QUERY')); ?>" type="text" value="${q}"/>
            <select name="<? echo(c('QUERY_KEY_FILTER')); ?>">
                <?
                    $filter = $pageContext->findAttribute(c('QUERY_KEY_FILTER'), null);
                    $selExclude = 1 == $filter ? 'selected="selected"' : '';
                    $selReplies = 2 == $filter ? 'selected="selected"' : '';
                    $pageContext->setAttribute('selExclude', $selExclude);
                    $pageContext->setAttribute('selReplies', $selReplies);
                ?>
                <option>All Messages</option>
                <option value="1" ${selExclude}>Exclude Replies</option>
                <option value="2" ${selReplies}>Only Replies</option>
            </select>
            <input class="btn btn-round" type="submit" value="Search"/>
            <input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${o.key}"/>
            <div class="center">&laquo; <a href="/messageBoardView.action?<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">Start Topic</a> &raquo;</div>
        </fieldset></form>

        <h2><? writePagination($pageContext); ?>${subhd}</h2>

        <div class="panel" id="profile-wall">
		
			<div class="nav"><a href="profile.action?<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">back to ${o.name} profile</a></div>

            <div class="content messages wall-list"><c:choose>

                <c:when test="${resultn}"><dl class="clearfix"><c:forEach items="${results}" var="mb">

                    <dt>${mb.creator.thumbnailHTML}</dt>
                    
                    <dd>

                        <div class="wall-header">
                             <p>${mb.creator.nameHTML}<br/>March 2, 2008 at 17:07:47</p>
                            <h5>${mb.title}</h5>
                        </div>

                        <div class="wall-text">

                            <p>${mb.shortBody}</p>

                            <ul class="actions">

                                <li><a href="/messageBoardView.action?<? echo(c('QUERY_KEY_MESSAGE_ID')); ?>=${mb.id}&<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">read</a></li>
                                <li><a href="/messageBoardView.action?<? echo(c('QUERY_KEY_MESSAGE_ID')); ?>=${mb.id}&<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}#reply">reply</a></li>

                                <c:if test="${aUser.id == mb.creatorId || o.isAdmin}"><li>${mb.anchorDeleteHTML}</li></c:if>

                                <c:if test="${aUser.id != mb.creatorId}">
			<li><a class="action-message" href="writeMessage.action?<? echo c('QUERY_KEY_KEY'); ?>to=${o.key}&<? echo c('QUERY_KEY_KEY'); ?>=${aUser.id}">${lc_nameMessage}</a></li></c:if>
                                
                            </ul>

                        </div>

                    </dd>

                </c:forEach></dl></c:when>

                <c:otherwise>
                    <div class="empty">${o.name} does not have any messages posted.</div>
                </c:otherwise>

            </c:choose></div>

		</div>
        
        <h2 class="bar-footer"><? writePagination($pageContext); ?></h2>

    </div></template:put>
</template:insert>
