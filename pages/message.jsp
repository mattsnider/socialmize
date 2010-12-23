<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>

<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" direct="true">${title}</template:put>

	<template:put name="header" direct="true">${hd}</template:put>

	<template:put name="content" direct="true"><div id="message" class="panel squareTop">

		<c:if test="${isRead}"><div class="read">
			<?
			$mAfterId = $pageContext->evaluateTemplateText('${mAfterId}');
			$mBeforeId = $pageContext->evaluateTemplateText('${mBeforeId}');
			$keyMessageId = c('QUERY_KEY_MESSAGE_ID');
			$clsNext = 'msg-next';
			$clsPrev = 'msg-prev';
			if (! $mAfterId) {$clsPrev .= ' hidden';}
			if (! $mBeforeId) {$clsNext .= ' hidden';}
			echo '<a class="'.$clsPrev.'" href="message.action?'.$keyMessageId.'='.$mAfterId.'">&lt;</a>';
			echo '<a class="'.$clsNext.'" href="message.action?'.$keyMessageId.'='.$mBeforeId.'">&gt;</a>';
			?>
			<h3 class="msg-header">${message.subject}</h3>
			<ul class="clearfix"><c:forEach items="${messages}" var="m">

				<li>

					<div class="column thumb">${m.sender.thumbnailHTML}</div>

					<div class="column info">
						<div class="name">${m.sender.nameHTML}</div>
						<div class="date">${m.createdDisplay}</div>
					</div>

					<div class="column body">
						<div class="text">${m.bodyBr}</div>
					</div>

				</li>

			</c:forEach></ul>
		</div></c:if>

		<? if ($pageContext->evaluateTemplateText('${hasReply}')) {
			$m = $pageContext->findAttribute('message', null);

			if ($m) {echo '<div id="messageReply">';}
			?><c:import url="snippet/createMessage.jsp" /><?
			if ($m) {echo '</div>';}

        } ?>

    </div></template:put>

</template:insert>