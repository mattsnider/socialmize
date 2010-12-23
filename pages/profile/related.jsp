
<!-- ----- |  @group Related  | ----- -->

<c:if test="${hasRelated && o.hasRelated}"><div class="panel" id="profile-related">

    <h3>Related Groups</h3>

    <div class="content"><ul>

        <c:forEach items="${o.related}" var="r">

            <li>
                ${r.nameHTML}<br />
                <small>${r.categoryAsString}</small>
            </li

        </c:forEach>

    </ul></div>

</div></c:if>

<!-- ----- |  @ end Related  | ----- -->
