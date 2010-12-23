
<!-- ----- |  @group Profile Wall  | ----- -->

<c:if test="${hasWall && o.hasWall}"><div class="panel" id="profile-wall">

    <h3>Profile ${lc_nameWall}</h3>

    <h4>
        <div class="edit">
			<c:if test="${o.isMember}"><a href="wall.action?<? echo(c('QUERY_KEY_EDIT')); ?>=T&<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">Write Something</a>
			<span class="pipe">|</span></c:if>
			<a href="wall.action?<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">See All</a>
        </div>
        <a href="wall.action?<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">Displaying ${wallPostn} ${lc_nameWall} <c:if test="${1 == wallPostn}">post</c:if><c:if test="${1 != wallPostn}">posts</c:if></a>.
    </h4>

    <c:import url="profile/feature/wall-content.jsp" />

    <div class="clearfix"></div>

</div></c:if>

<!-- ----- |  @ end Profile Wall | ----- -->
