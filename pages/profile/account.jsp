
<!-- ----- |  @group Account  | ----- -->

<div id="profile-account" class="profile-container">

    <h4 class="toggle-open" id="profile-account-info">Account Info</h4>

    <c:if test="${o.isAdmin}">
        <div class="edit">[ <a href="/edit.action?task=manage&key=${o.key}">edit</a> ] </div>
    </c:if>

    <dl class="clearfix profile-dl">

        <dt><label>Name:</label></dt>
        <dd><a href="searchResult.action?<? echo(c('QUERY_KEY_QUERY')); ?>=${o.name}">${o.name}</a></dd>

        <dt><label>Last Update:</label></dt>
        <dd><p><c:choose>
            <c:when test="${empty o.modified}">'N/A'</c:when>
            <c:otherwise>${o.lastUpdated}</c:otherwise>
        </c:choose></p></dd>

    </dl>

</div>

<!-- ----- |  @ end  | ----- -->