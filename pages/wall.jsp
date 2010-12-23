<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">${nameInTitle}'s Wall</template:put>

	<template:put name="header" direct="true">${hd}</template:put>

	<template:put name="contentHeader" direct="true">
			<div id="subheader"><h5>${subhd}</h5></div>
	</template:put>

	<template:put name="content" direct="true"><div id="wall">

        <c:if test="${o.isMember}"><div class="panel" id="wallInlineEdit">
            <form action="submitWall.action" method="post" id="wall-form"><div class="content">

				<input name="<? echo(c('QUERY_KEY_KEY')); ?>" value="${o.key}" type="hidden" />
                <input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="C" />
                <textarea class="textarea" cols="43" id="wall-text" name="<? echo(c('QUERY_KEY_BODY')); ?>" rows="4"> </textarea><br />
               	<p class="error hidden">max 1,000 characters</p>

				<div class="actions clearfix">
                    <div class="buttons">
                        <input class="btn btn-round" type="submit" value=" Post " />
                    </div>
                </div>

                <div class="clearfix"></div>

            </div></form>
        </div></c:if>

        <div class="panel" id="profile-wall">

			<div class="nav"><a href="profile.action?<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">back to ${o.name} profile</a></div>

			<c:import url="profile/feature/wall-content.jsp" />

                <div class="clearfix"></div>

		</div>
        
    </div></template:put>
</template:insert>
