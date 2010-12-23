
<!-- ----- |  @group Information  | ----- -->

<div id="profile-information" class="profile-container">

	<!-- ----- |  @group Header  | ----- -->

	<h4 class="toggle-open" id="profile-information-info">Group Details</h4>
	<c:if test="${o.isAdmin}">
		<div class="edit">[ <a class="profile-edit" name="profile-edit-information" href="editprofile.action?task=basic&key=${o.key}">edit</a> ]</div>
	</c:if>

	<!-- ----- |  @end Header  | ----- -->

	<!-- ----- |  @group Content  | ----- -->

    <dl class="clearfix clear profile-dl">

        <dt><label>Name:</label></dt>
        <dd><p>${o.name}</p></dd>

        <dt><label>Category:</label></dt>
        <dd><a href="searchResult.action?<? echo(c('QUERY_KEY_CATEGORY')); ?>=${o.categoryId}"><c:out value="${o.categoryAsString}" escapeXml="true" /></a></dd>

        <dt><label>Description:</label></dt>
        <dd><p><str:replace replace="LF" with="&lt;br /&gt;">${o.profile.description}</str:replace></p></dd>

    </dl>

	<!-- ----- |  @end Content  | ----- -->

</div>

<!-- ----- |  @end Information  | ----- -->
