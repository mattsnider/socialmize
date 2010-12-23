
<!-- ----- |  @group Basic  | ----- -->

<div id="profile-basic" class="profile-container">

	<!-- ----- |  @group Header  | ----- -->

	<h4 class="toggle-open" id="profile-basic-info">Biographical Info</h4>
	<c:if test="${o.isAdmin}">
		<div class="edit">[ <a class="profile-edit" name="profile-edit-basic" href="editprofile.action?task=basic">edit</a> ]</div>
	</c:if>

	<!-- ----- |  @end Header  | ----- -->

	<!-- ----- |  @group Content  | ----- -->

	<c:choose>

		<c:when test="${o.profile.hasBasic}">

            <dl class="clearfix clear profile-dl">

                <c:if test="${! empty o.profile.gender}">
                <dt><label>Gender:</label></dt>
                <dd><a href="searchResult.action?? echo(c('QUERY_KEY_IS_ADV')); ?>=1&sx=${o.profile.genderId}">${o.profile.gender}</a></dd>
                </c:if>

                <c:if test="${! empty o.profile.dobString}">
                <dt><label>Birthday:</label></dt>
                <dd><p>
                    <c:if test="${! empty o.profile.dobMonth}">${o.profile.dobMonth}</c:if>&nbsp;
                    <c:if test="${! empty o.profile.dobDay}">${o.profile.dobDay},</c:if>&nbsp;
                    <c:if test="${! empty o.profile.dobYear}">${o.profile.dobYear}</c:if>
                </p></dd>
                </c:if>

                <c:if test="${! empty o.profile.description}">
                <dt><label>About Me:</label></dt>
                <dd><p>${o.profile.description}</p></dd>
                </c:if>

                <c:if test="${! empty o.profile.interests}">
                <dt><label>Interests & Hobbies:</label></dt>
                <dd><p>${o.profile.interestsAsAnchors}</p></dd>
                </c:if>

                <c:if test="${! empty o.profile.hometownLocation}">
                <dt><label>Hometown:</label></dt>
                <dd><p>${o.profile.hometownLocation}</p></dd>
                </c:if>

            </dl>

		</c:when>

		<c:otherwise><? printEmpty($pageContext->evaluateTemplateText('${o.isAdmin}'), 'Biographical', 'basic'); ?></c:otherwise>

	</c:choose>

	<!-- ----- |  @end Content  | ----- -->
</div>

<!-- ----- |  @end Basic  | ----- -->
