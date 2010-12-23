<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="Your Messages" direct="true"/>

	<template:put name="header" direct="true">${hd}</template:put>

	<template:put name="content" direct="true">
        <form action="mailbox.action" class="filter" method="get"><fieldset>
			<input name="<? echo(c('QUERY_KEY_OUT')); ?>" type="hidden" value="<c:if test="${empty param.out}">T</c:if>"/>
			<input class="btn btn-round" type="submit" value="<c:if test="${! out}">Out</c:if><c:if test="${out}">In</c:if>box" />

            <div class="content">

                <span class="actions" id="filter-action">
                    <span>Select: </span>
                    <a href="javascript:void(null);" rel="all">All</a>,
                    <a href="javascript:void(null);" rel="none">None</a>,
                    <a href="javascript:void(null);" rel="read">Read</a>,
                    <a href="javascript:void(null);" rel="replied">Replied</a>,
                    <a href="javascript:void(null);" rel="new">New</a>
                </span>

                <select class="select" id="filter-action-chooser">
                    <option selected="selected" value="">Actions:</option>
                    <c:if test="${! param.out}"><option value="markAllRead">Mark as Read</option></c:if>
                    <c:if test="${! param.out}"><option value="markAllNew">Mark as New</option></c:if>
                    <option value="markAllDeleted">Delete</option>
                </select>

                <input class="txt displayNone" name="<? echo(c('QUERY_KEY_QUERY')); ?>" type="text"
                       value="<c:if test="${! empty param.q}">${param.q}</c:if>">

                <div class="clearfix">&nbsp;</div> <!-- Remove this when adding query back in -->

            </div>

        </fieldset></form>

        <div class="mailbox">

			<form action="submitUser.action" class="displayNone" id="message-form" method="post">
				<input id="message-form-<? echo(c('QUERY_KEY_TASK')); ?>" name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="" />
				<input id="message-form-<? echo(c('QUERY_KEY_FLAG')); ?>" name="<? echo(c('QUERY_KEY_FLAG')); ?>" type="hidden" value=""/>
				<input id="message-form-<? echo(c('QUERY_KEY_MESSAGE_ID')); ?>" name="<? echo(c('QUERY_KEY_MESSAGE_ID')); ?>" type="hidden" value=""/>
				<input id="message-form-<? echo(c('QUERY_KEY_OUT')); ?>" name="<? echo(c('QUERY_KEY_OUT')); ?>" type="hidden" value="<c:if test="${! empty param.out}">T</c:if>"/>
				<input id="message-form-<? echo(c('QUERY_KEY_THREAD')); ?>" name="<? echo(c('QUERY_KEY_THREAD')); ?>" type="hidden" value="" />
				<input id="message-form-<? echo(c('QUERY_KEY_KEY')); ?>" name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value=""/>
				<input type="submit" value=" Submit "/>
			</form>
			
			<c:if test="${0 == messagen}"><div class="panel noresults">You don't have any messages.</div></c:if>

			<c:if test="${0 < messagen}"><table cellspacing="0" cellpadding="0" class="clearfix" id="message-list">

				<colgroup>
					<col class="mailboxTableColState"/>
					<col class="mailboxTableColChkbx"/>
					<col class="mailboxTableColThumb"/>
					<col class="mailboxTableColFrom"/>
					<col class="mailboxTableColSubject"/>
					<col class="mailboxTableColAction"/>
				</colgroup>

				<thead><tr>
						
					<th>&nbsp;</th>

					<th class="mailboxTableColChkbx"><input id="message-chk-all" type="checkbox" /></th>

					<th>&nbsp;</th>

					<th class="border-left">
						<c:if test="${empty param.out}">From</c:if>
						<c:if test="${! empty param.out}">To</c:if>
					</th>

					<th class="border-left">Subject</th>

					<th>&nbsp;</th>

				</tr></thead>

				<tbody><c:forEach items="${messages}" var="o" varStatus="status">
					<tr class="result ${o.recipient.status}" id="message-${o.id}">

						<?
							//$isGroup = $pageContext->evaluateTemplateText('${0 == o.sender.id}');
							$isGroup = false;
							$o = $pageContext->findAttribute('o');
							$out = $pageContext->evaluateTemplateText('${param.out}');
							$user = $out ? $o->getRecipient() : $o->getSender();
							$key = $user->getKey();
							$name = $user->getName();

							// create url query params
							$q = array();
							$q[0] = '?';
							$q[1] = c('QUERY_KEY_MESSAGE_ID');
							$q[2] = '=';
							$q[3] = $pageContext->evaluateTemplateText('${o.id}');
							$q[4] = '&';
							$q[5] = c('QUERY_KEY_KEY');
							$q[6] = '=';
							$q[7] = $key;
							$query = implode('', $q);
						?>

						<td class="mailboxTableColState">&nbsp;</td>

						<td class="selector">
							<input alt="${o.recipient.status}" class="checkbox" id="chk-${status.index}" type="checkbox" />
						</td>

						<td class="portrait">${o.sender.thumbnailHTML}</td>

						<td>
							<div class="name">${o.sender.nameHTML}</div>
							<div class="date">${o.createdDisplay}</div>
						</td>

						<td class="subject">
							<a class="message-subject" href="message.action?<? echo(c('QUERY_KEY_MESSAGE_ID')); ?>=${o.id}">${o.subject}</a><br />
							<a class="message-body" href="message.action?<? echo(c('QUERY_KEY_MESSAGE_ID')); ?>=${o.id}">${o.bodySnippet}</a>
						</td>

						<td class="mailboxTableColAction">
							<a href="confirm.action<? echo($query); ?>&<? echo(c('QUERY_KEY_TASK')); ?>=messageDelete&<? echo(c('QUERY_KEY_OUT')); ?>=<? echo($out); ?>">X</a>
						</td>

					</tr>
				</c:forEach></tbody>

			</table></c:if>
		
		</div>

	</template:put>
</template:insert>