
<form action="adminSubmit.action" id="form-news" method="post"><fieldset class="panel squareTop">

	<h4>Compose a News Article</h4>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="news" />
	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />
	<input id="form-news-<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="" />

	<p class="copy">Use this feature to update all users about news related to ${projectName}. There are currently 3 types of articles: news,
		events, and alerts.</p>

	<div class="content white"><ol>

		<?
		$news = $pageContext->findAttribute(c('MN_ARTICLE'), true);
		$body = '';
		$date = '';
		$expires = '';
		$id = '';
		$title = '';
		$ntype = '';

		if ($news) {
			$body = $news->getBody();
			$date = $news->getDate();
			$expires = $news->getExpires();
			$id = $news->getId();
			$title = $news->getTitle();
			$ntype = $news->getType();
		}
		
		$allUserName = $pageContext->evaluateTemplateText('${nameUsers}');
		$typeSelected = '';

		if (! $body) {
			echo '<li><label for="form-news-types">To:</label>';
			echo '<div id="id_slist_news"></div>';
		}

		?>

		<li class="line"><?
			echo '<label for="news-type">Type:</label>';
			echo(HtmlHelper::selectTag(News::getTypes(), $ntype, array('cls' => 'select', 'id' => 'news-type', 'name' => c('QK_TYPE')), array(), false));
		?></li>
		
		<li class="line"><?
			echo '<label for="news-date">Date:</label>';
			echo '<input class="txt" id="news-date" maxlength="19" name="s'.c('QUERY_KEY_TIME').'" type="text" value="'.$date.'"/>';
			echo '(ex. ' . getDatetime(time()) . ')';
		?></li>

		<li class="line"><?
			echo '<label for="news-expires">Expires:</label>';
			echo '<input class="txt" id="news-expires" maxlength="19" name="e'.c('QUERY_KEY_TIME').'" type="text" value="'.$expires.'"/>';
			echo '(ex. ' . getDatetime(time()) . ')';
		?></li>
		<li><?
			echo '<label for="news-title">Title:</label>';
			echo '<input class="txt" id="news-title" name="'.c('QUERY_KEY_SUBJECT').'" type="text" value="'.$title.'" />';
		?></li>

		<li><?
			echo '<label for="news-body">Text:</label>';
			echo '<textarea class="textarea" cols="35" id="news-body" name="'.c('QUERY_KEY_BODY').'" rows="5">'.$body.'</textarea>';
		?></li>

	</ol>

	<? echo'<input name="'.c('QUERY_KEY_MESSAGE_ID').'" type="hidden" value="'.$id.'" />'; ?>

	<div class="buttons"><input class="btn btn-round" type="submit" value="Post News!" /></div>
	</div>

</fieldset></form>


<div class="post panel" id="news">

	<h3>${projectNameUC} News</h3>

	<div class="content white">

		<c:if test="${0 == articlen}"><div class="empty">No articles, events, or seminars written.</div></c:if>

		<c:if test="${0 < articlen}">
			<ul><c:forEach items="${articles}" var="o">
				<li class="result ${o.typeClass}">

					<div class="title ${o.typeClass}">

						<h5>${o.title}
							<div class="tasks">
								<?
									$query = c('QUERY_KEY_PAGE') . '=message&' . c('QUERY_KEY_TASK') . '=news&' . c('QUERY_KEY_MESSAGE_ID') . '=';
								?>
								<a href="admin.action?<? echo($query); ?>${o.id}" class="action-edit">Edit</a>
								<a href="adminSubmit.action?<? echo($query); ?>${o.id}&<? echo(c('QK_DELETE')); ?>=T" class="action-delete">Delete</a>
							</div>
						</h5>

						<div><strong>${o.dateDT}</strong> and expires <strong>${o.expiresDT}</strong></div>

					</div>

					<div class="text">${o.bodyBr}</div>

				</li>
			</c:forEach></ul>
		</c:if>

	</div>

</div>