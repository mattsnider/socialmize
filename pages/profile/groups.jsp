<!-- ----- |  @group Groups  | ----- -->

<div class="panel" id="profile-group">
    <?
        $uri = array();
        $uri[c('QUERY_KEY_KEY')] = $pageContext->evaluateTemplateText('${o.key}');
        $uri = array_toquerystring($uri);
    ?>

    <h3>${nameGroups}</h3>

    <h4>
        <div class="edit">[ <a href="groups.action?<? echo($uri); ?>">See All</a> ]</div>
        <a href="groups.action?<? echo($uri); ?>">${o.groupn} ${lc_nameGroups}</a>
    </h4>

    <div class="content wall-list">

        <c:if test="${! empty o.groups}"><dl>

            <c:forEach items="${o.groups}" var="g">

                <dt>${g.thumbnailHTML}</dt>

                <dd>

                    <div class="wall-header">
                        <p><a href="profile.action?<? echo(c('QUERY_KEY_KEY')); ?>=${g.key}">${g.name}</a></p>
                        <small><a href="searchResult.action?cat=${g.categoryId}"><c:out value="${g.categoryAsString}" escapeXml="true" /></a></small>
                    </div>

                    <div class="wall-text">
                        <p><label>Access:</label>&nbsp;${g.accessName}<br/>
                        <label>Size:</label>&nbsp;
                        <a href="searchResult.action?<? echo(c('QUERY_KEY_KEY')); ?>=${g.key}&<? echo(c('QK_TYPE')); ?>=user"><?
                            $count = $pageContext->evaluateTemplateText('${g.membern}');
                            $nameMember = $pageContext->evaluateTemplateText('${lc_nameMember}');
                            echo ($count . ' ' . pluralize($nameMember, $count));
                        ?></a></p>
                        <small>update on ${g.created}</small>
                    </div>
                    
                </dd>


            </c:forEach>

        </dl></c:if>

        <c:if test="${empty o.groups}">
            <div class="empty">${o.name} does not belong to any groups.</div>
        </c:if>

        <div class="clearfix"></div>

    </div>

</div>

<!-- ----- |  @ end Groups  | ----- -->