
<!-- ----- |  @group Message Board  | ----- -->

<c:if test="${hasMessageBoard && o.hasMessageBoard}"><div class="panel" id="profile-messageBoard">

    <h3>${nameMessageBoard}</h3>

    <form action="/messageBoardList.action"><p class="filter">
        Search messages
        <input class="txt" name="<? echo(c('QUERY_KEY_QUERY')); ?>" type="text"/>
        <input class="btn btn-round"  type="submit" value="Search"/>
        <input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${o.key}"/>
    </p></form>

    <div class="content messages"><c:choose>

        <c:when test="${mbPostn}"><table>

            <colgroup>
                <col class="messageBoardDate"/>
                <col class="messageBoardTitle"/>
                <col class="messageBoardUser"/>
            </colgroup>

            <thead>
                <td>Date:</td>
                <td>Title:</td>
                <td>Posted By:</td>
            </thead>

            <tbody><c:forEach items="${mbPosts}" var="mb">

                <tr>
                    <td>${mb.shortCreated}</td>
                    <td><a href="/messageBoardView.action?<? echo(c('QUERY_KEY_MESSAGE_ID')); ?>=${mb.id}&<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">${mb.title}</a></td>
                    <td><a href="profile.action?<? echo(c('QUERY_KEY_KEY')); ?>=${mb.creator.key}">${mb.creator.name}</a></td>
                </tr>

            </c:forEach></tbody>

        </table></c:when>

        <c:otherwise>
            <div class="empty">${o.name} does not have any messages posted.</div>
        </c:otherwise>

    </c:choose>

        <h4>
            <div class="edit"><a href="/messageBoardList.action?<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">See All Messages</a></div>
            <a href="/messageBoardView.action?<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">Post a Message</a>
        </h4>

    </div>

</div></c:if>

<!-- ----- |  @ end Message Board   | ----- -->
