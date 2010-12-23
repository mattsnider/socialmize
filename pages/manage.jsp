
<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>

<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">${hd}</template:put>

	<template:put name="header" direct="true">${hd}</template:put>

	<template:put name="content" direct="true">

		<div id="subheader">
			<div class="anchor"><a href="profile.action?<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}">back to ${o.name}</a></div>
			<h3>${membert}</h3>
		</div>

		<c:if test="${'invite' == task}"><div class="column-two">

			<div class="column-left">
				
				<ul><c:forEach items="${members}" var="m">
					<li>
						<c:if test="${o.isAdmin && aUser.id != m.id}"><div>

							<c:if test="${! m.isAdmin || o.isSuperAdmin}">
								<a href="submitManage.action?<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}&u<? echo(c('QUERY_KEY_KEY')); ?>=${m.key}&<? echo(c('QUERY_KEY_TASK')); ?>=remove">Remove</a>
							</c:if>

							<c:if test="${o.isSuperAdmin}"> |
								<c:if test="${m.isAdmin}">
									<a href="submitManage.action?<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}&u<? echo(c('QUERY_KEY_KEY')); ?>=${m.key}&<? echo(c('QUERY_KEY_TASK')); ?>=removeAdmin">Remove Admin</a>
								</c:if>
								<c:if test="${! m.isAdmin}">
									<a href="submitManage.action?<? echo(c('QUERY_KEY_KEY')); ?>=${o.key}&u<? echo(c('QUERY_KEY_KEY')); ?>=${m.key}&<? echo(c('QUERY_KEY_TASK')); ?>=addAdmin">Add Admin</a>
								</c:if>
							</c:if>
							
						</div></c:if>

                        ${m.nameHTML}
					</li>
				</c:forEach></ul>
				
			</div>

			<div class="column-right">

				<form action="submitMember.action" method="post"><fieldset>

					<label>Invite Your ${nameFriends}:</label>

					<ul class="checklist clearfix"><c:forEach items="${friends}" var="m" varStatus="status">
						<li>
                            <input id="friend-${m.id}" name="friend-${status.index}" type="checkbox" value="${m.key}" />
                            <label for="friend-${m.id}">${m.name}</label>
                        </li>
					</c:forEach></ul>

					<div class="buttons"><input class="btn btn-round" type="submit" value="Invite To Join!" /></div>

					<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="invite" />
					<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${o.key}" />
					<input name="<? echo(c('QK_SIZE')); ?>" type="hidden" value="${friendn}" />
					
				</fieldset></form>

			</div>

			<div class="clearfix">&nbsp;</div>

            <c:if test="${o.isSuperAdmin && 1 < adminn}"><div>

                <form action="submitManage.action" class="change" method="post"><fieldset>

                    <h4>Change Master Admin</h4>

                    <p class="copy">You are currently the Master Administrator of this group. Only the Master Administrator can add/remove other administrators.
                        If you no longer desire this responsibility, you can use the form below to give it to another administrator.
                        Keep in mind that this cannot be undone, except by the user with whom you switch rolls.</p>

                    <ul>
                        <c:forEach items="${members}" var="m">
                            <c:if test="${m.isAdmin && m.id != aUser.id}"><li>
                                <label><input name="u<? echo(c('QUERY_KEY_KEY')); ?>" type="radio" value="${m.key}" />
                                ${m.name}</label>
                            </li></c:if>
                        </c:forEach>
                    </ul>

                    <div class="buttons"><input class="btn btn-round" type="submit" value="Change Master Administrator" /></div>

                    <input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="change" />
                    <input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${o.key}" />

                </fieldset></form>

                <div class="clearfix">&nbsp;</div>

            </div></c:if>

		</div></c:if>

		<c:if test="${'message' == task}"><div id="wall">
			<div id="wallInlineEdit"><form action="submitManage.action" method="post" id="wall-form">

                <input name="<? echo(c('QUERY_KEY_KEY')); ?>" value="${o.key}" type="hidden" />
                <input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="message" />
                <textarea class="textarea" cols="43" id="wall-text" name="<? echo(c('QUERY_KEY_BODY')); ?>"
                          rows="4">Write something...</textarea><br />
                <small class="form-error">max 1,000 characters</small>

                <div class="actions clearfix">
                    <div class="buttons">
                        <input value=" Post " class="btn btn-round" name="submitWall" type="submit" />
                    </div>
                </div>

            </form></div>
		</div></c:if>

	</template:put>

</template:insert>
