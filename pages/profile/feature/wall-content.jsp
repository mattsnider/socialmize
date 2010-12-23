
<!-- ----- |  @group Content  | ----- -->

<div class="content wall-list" id="wall-list">

    <c:if test="${! empty wallPosts}"><dl class="clearfix">

        <c:forEach items="${wallPosts}" var="wp">

            <dt>${wp.poster.thumbnailHTML}</dt>

            <dd>

                <div class="wall-header">
                    <p><a href="profile.action?<? echo(c('QUERY_KEY_KEY')); ?>=${wp.poster.key}">${wp.poster.name}</a> wrote</p>
                    <small>${wp.created}</small>
                </div>

                <div class="wall-text">

                    <p>${wp.bodyBr}</p>

                    <c:choose>
                        <c:when test="${aUser.key == wp.poster.key}">
                            <a class="action-delete" href="/submitWall.action?<? echo(c('QUERY_KEY_POST_ID')); ?>=${wp.id}&<? echo(c('QUERY_KEY_TASK')); ?>=D&<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">delete</a>
                        </c:when>
                        <c:otherwise>
							<a class="action-message" href="writeMessage.action?<? echo c('QUERY_KEY_KEY'); ?>to=${o.key}&<? echo c('QUERY_KEY_KEY'); ?>=${aUser.id}">${lc_nameMessage}</a>
						</c:otherwise>
                    </c:choose>

                </div>

            </dd>
        
        </c:forEach>

    </dl></c:if>

    <c:if test="${empty wallPosts}">
        <div class="empty">No posts for this ${o.type}.</div>
    </c:if>

</div>

<!-- ----- |  @end Content  | ----- -->
