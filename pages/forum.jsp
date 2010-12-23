<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">
    <template:put name="title" content="GROUP NAME's Discussion" direct="true"/>
	<template:put name="header" direct="true">${hd}</template:put>
	<template:put name="contentHeader" direct="true">
			<div id="filter"><div class="content">${filter}</div></div>
			<div id="subheader"><h5>${subhd}</h5></div>
	</template:put>
    <template:put name="content" direct="true">
		<div class="forum-list">
			<!-- todo: move these into the contentHeader above -->
			<div class="bar clearfix bar-tab">
				<div class="tabs">
					<div class="activetab"><a href="PROJECT_URL/board.php?uid=2204775522">Discussion Board</a></div>
				</div>
				<div class="backLinks"><a href="PROJECT_URL/group.php?gid=2204775522">Back to Matt's special group</a></div>
			</div>
			
			<div class="bar clearfix bar-filter">
				<label for="sorter">Sort by: <select id="sorter" onchange="goURI(this.value);">
					<option selected="selected" value="PROJECT_URL/board.php?uid=2204775522&amp;f=2">Latest Replies</option>
					<option value="PROJECT_URL/board.php?uid=2204775522&amp;f=8">Newest Topics</option>
					<option value="PROJECT_URL/board.php?uid=2204775522&amp;f=16">Most People</option>
					<option value="PROJECT_URL/board.php?uid=2204775522&amp;f=32">Most Posts</option>
				</select></label>
				<label for="filter">Show: <select id="filter" onchange="goURI(this.value);">
					<option value="PROJECT_URL/board.php?uid=2204775522&amp;f=2">All Topics</option>
					<option value="PROJECT_URL/board.php?uid=2204775522&amp;f=524290">Your Topics</option>
					<option value="PROJECT_URL/board.php?uid=2204775522&amp;f=262146">Your Friends' Topics</option>
				</select></label>
				<div class="filter-actions"><a href="PROJECT_URL/edittopic.php?uid=2204775522&amp;action=8">Start New Topic</a></div>
			</div>
			
			<div class="empty">There are no discussions yet. <a href="PROJECT_URL/edittopic.php?uid=2204775522&amp;action=8">Start the first topic</a>.</div>
		</div>
	</template:put>
</template:insert>
