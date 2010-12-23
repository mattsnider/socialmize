
<!-- ----- |  @group Connection  | ----- -->

<c:if test="${! empty connections}"><div id="profileConnection">

	<div class="info-header"><h2>Connections</h2></div>

	<div class="info-box">

		<div class="normalize">
			<a href="<html:rewrite page="profile.action"/>?key=${o.key}">Aaron</a> ::
			<a href="<html:rewrite page="profile.action"/>?key=${o.key}">Greg</a> ::
			<a href="<html:rewrite page="profile.action"/>?key=${o.key}">You</a>
		</div>

		<div class="normalize">
			<a href="<html:rewrite page="profile.action"/>?key=${o.key}">Randy</a> ::
			<a href="<html:rewrite page="profile.action"/>?key=${o.key}">Bubba</a> ::
			<a href="<html:rewrite page="profile.action"/>?key=${o.key}">You</a>
		</div>

		<div class="normalize">
			<a href="<html:rewrite page="profile.action"/>?key=${o.key}">Sam</a> ::
			<a href="<html:rewrite page="profile.action"/>?key=${o.key}">You</a>
		</div>
	</div>

</div></c:if>

<!-- ----- |  @ end  | ----- -->
