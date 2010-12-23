
<!-- ----- |  @group Company  | ----- -->

<div id="profile-company" class="profile-container">

	<!-- ----- |  @group Header  | ----- -->

	<h4 class="toggle-open" id="profile-company-info">Work Info</h4>
	<c:if test="${o.isAdmin}">
		<div class="edit">[ <a class="profile-edit" name="profile-edit-company" href="editprofile.action?task=company">edit</a> ]</div>
	</c:if>

	<!-- ----- |  @end Header  | ----- -->

	<!-- ----- |  @group Content  | ----- -->

	<c:choose>

		<c:when test="${o.profile.hasCompanies}">

            <c:forEach items="${o.profile.companies}" var="company" varStatus="status"><dl class="clearfix clear profile-dl">

                <dt><label>Company:</label></dt>
                <dd><a href="searchResult.action?? echo(c('QUERY_KEY_IS_ADV')); ?>=1&wc=${company.name}">${company.name}</a></dd>

                <c:if test="${! empty company.website}">
                <dt><label>Website:</label></dt>
                <dd><a href="http://${company.website}" target="_blank">${company.website}</a></dd>
                </c:if>

                <c:if test="${! empty company.ticker}">
                <dt><label>Ticker:</label></dt>
                <dd><p>${company.ticker}</p></dd>
                </c:if>

                <c:if test="${0 < company.industryId}">
                <dt><label>Industry:</label></dt>
                <dd><a href="searchResult.action?? echo(c('QUERY_KEY_IS_ADV')); ?>=1&wi=${company.industryId}">${company.industry}</a></dd>
                </c:if>

                <c:if test="${0 < company.positionId}">
                <dt><label>Title:</label></dt>
                <dd><a href="searchResult.action?? echo(c('QUERY_KEY_IS_ADV')); ?>=1&wp=${company.positionId}">${company.position}</a></dd>
                </c:if>

                <c:if test="${! empty company.time}">
                <dt><label>Time Period:</label></dt>
                <dd><p>${company.time}</p></dd>
                </c:if>

                <c:if test="${! empty company.location}">
                <dt><label>Location:</label></dt>
                <dd><p>${company.location}</p></dd>
                </c:if>

                <c:if test="${! empty company.description}">
                <dt><label>Description:</label></dt>
                <dd><p>${company.description}</p></dd>
                </c:if>

                <dt>&nbsp;</dt><dd>&nbsp;</dd>

            </dl></c:forEach>

		</c:when>
        
        <c:otherwise><? printEmpty($pageContext->evaluateTemplateText('${o.isAdmin}'), 'Work History', 'company'); ?></c:otherwise>

	</c:choose>

	<!-- ----- |  @end Content  | ----- -->
</div>

<!-- ----- |  @end Company  | ----- -->
