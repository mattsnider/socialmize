
<!-- ----- |  @group Contact  | ----- -->

<div id="profile-contact" class="profile-container">

	<!-- ----- |  @group Header  | ----- -->

	<h4 class="toggle-open" id="profile-contact-info">Contact Info</h4>
	<c:if test="${o.isAdmin}">
		<div class="edit">[ <a class="profile-edit" name="profile-edit-contact" href="editprofile.action?task=contact&key=${o.key}">edit</a> ]</div>
	</c:if>

	<!-- ----- |  @end Header  | ----- -->

	<!-- ----- |  @group Content  | ----- -->

	<c:choose>

		<c:when test="${o.profile.isContactEmpty}"><? printEmpty($pageContext->evaluateTemplateText('${o.isAdmin}'), 'Contact', 'contact'); ?></c:when>

		<c:otherwise>

            <dl class="clearfix clear profile-dl">

                <c:if test="o.email">
                <dt><label>Email:</label></dt>
                <dd>

                    <c:if test="${'user' == type}">

                        <c:if test="${! o.isAdmin}"><a class="large-text" href="javascript:void(null);" id="message-send"
                           title="Email's are shown as images for your security. You may click here to send a message to this person.">
                            <img alt= "${o.email}" src="<html:rewrite page="/assets"/>/images/${type}s/email/${o.key}.gif" /></a></c:if>

                        <c:if test="${o.isAdmin}"><img alt= "${o.email}"
                                                    src="<html:rewrite page="/assets"/>/images/${type}s/email/${o.key}.gif" /></c:if>

                    </c:if>

                    <c:if test="${'group' == type}"><p>${o.profile.emailUri}</p></c:if>
                    
                </dd>
                </c:if>

                <c:if test="${! empty o.profile.mobile}">
                <dt><label>Mobile:</label></dt>
                <dd><p>${o.profile.formattedMobile}</p></dd>
                </c:if>

                <c:if test="${! empty o.profile.phone}">
                <dt><label>Phone #:</label></dt>
                <dd><p>${o.profile.formattedPhone}</p></dd>
                </c:if>

                <c:if test="${! empty o.profile.office}">
                <dt><label>Office:</label></dt>
                <dd><p>${o.profile.office}</p></dd>
                </c:if>

                <c:if test="${! empty o.profile.addressLocation}">
                <dt><label>Address:</label></dt>
                <dd><p>${o.profile.addressLocation}</p></dd>
                </c:if>

                <c:if test="${! empty o.profile.homepageUri}">
                <dt><label>Homepage:</label></dt>
                <dd>${o.profile.websiteAsAnchors}</dd>
                </c:if>

                <c:if test="${! empty o.profile.website}">
                <dt><label>Websites:</label></dt>
                <dd>${o.profile.websiteAsAnchors}</dd>
                </c:if>

            </dl>

		</c:otherwise>

	</c:choose>

	<!-- ----- |  @end Content  | ----- -->

</div>

<!-- ----- |  @ end  | ----- -->
