
<!-- ----- |  @group Education  | ----- -->

<div id="profile-education" class="profile-container">

	<!-- ----- |  @group Header  | ----- -->

	<h4 class="toggle-open" id="profile-education-info">Education Info</h4>
	<c:if test="${o.isAdmin}">
		<div class="edit">[ <a class="profile-edit" href="editprofile.action?task=education" name="profile-edit-education">edit</a> ]</div>
	</c:if>

	<!-- ----- |  @end Header  | ----- -->

	<!-- ----- |  @group Content  | ----- -->

    <c:choose>

        <c:when test="${o.profile.hasSchools}">

            <c:forEach items="${o.profile.schools}" var="school" varStatus="status"><dl class="clearfix clear profile-dl">

                <dt><label>${school.attend}, ${school.degree}:</label></dt>
                <dd><p><a href="searchResult.action?? echo(c('QUERY_KEY_IS_ADV')); ?>=1&ug=${school.name}">${school.name}</a>
				        <c:if test="${! empty school.year}"> -
                            <a href="searchResult.action?? echo(c('QUERY_KEY_IS_ADV')); ?>=1&yr=${school.year}">${school.year}</a></c:if></p></dd>

                <c:if test="${! empty school.concentration1}">
                <dt><label>Major:</label></dt>
                <dd><a href="searchResult.action?? echo(c('QUERY_KEY_IS_ADV')); ?>=1&cn=${school.concentration1}">${school.concentration1}</a></dd>
                </c:if>

                <c:if test="${! empty school.concentration2}">
                <dt><label>Major:</label></dt>
                <dd><a href="searchResult.action?? echo(c('QUERY_KEY_IS_ADV')); ?>=1&cn=${school.concentration2}">${school.concentration2}</a></dd>
                </c:if>

                <c:if test="${! empty school.concentration3}">
                <dt><label>Major:</label></dt>
                <dd><a href="searchResult.action?? echo(c('QUERY_KEY_IS_ADV')); ?>=1&cn=${school.concentration3}">${school.concentration3}</a></dd>
                </c:if>

                <dt>&nbsp;</dt><dd>&nbsp;</dd>

            </dl></c:forEach>

        </c:when>

        <c:otherwise><? printEmpty($pageContext->evaluateTemplateText('${o.isAdmin}'), 'Education History', 'education'); ?></c:otherwise>

	</c:choose>

	<!-- ----- |  @end Content  | ----- -->

</div>

<!-- ----- |  @end Education  | ----- -->
