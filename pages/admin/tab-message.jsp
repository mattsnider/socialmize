<div class="tabs tabs-sub tabs-round clearfix" id="tabs-content"><ul><?
	// Update the selected tab
	$subpage = $pageContext->evaluateTemplateText('${' . c('QUERY_KEY_TASK') . '}');
	$clsMessage = $subpage === 'message' || ! $subpage ? 'selected' : '';
	$clsNews = $subpage === 'news' ? 'selected' : '';
	$subtabURL = 'admin.action?' . c('QUERY_KEY_PAGE') . '=message&amp;' . c('QUERY_KEY_TASK') . '=';

	echo '<li class="first '.$clsMessage.'"><a href="'.$subtabURL.'message">Message Users</a></li>';
	echo '<li class="last '.$clsNews.'"><a href="'.$subtabURL.'news">Site News</a></li>';
?></ul></div>

<c:if test="${'message' == task}"><div class="panel squareTop"><c:import url="../snippet/createMessage.jsp" /></div></c:if>
<c:if test="${'news' == task}"><c:import url="tab-news.jsp" /></c:if>