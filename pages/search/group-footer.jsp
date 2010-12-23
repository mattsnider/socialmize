
<div class="clearfix">

	<div id="createGroup">

		<div class="title"><h5>Start a New ${nameGroup}</h5></div>

		<p>Can't find you're ${lc_nameGroup}?<br/>  Start one. (it's easy)</p>

		<form action="create.action">
			<input name="<? echo(c('QUERY_KEY_EDIT')); ?>" type="hidden" value="T" />
			<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="<? echo(Searchable::$TYPE_GROUP); ?>" />
			<input class="btn btn-round" id="create" type="submit" value="Create ${nameGroup}" />
		</form>

	</div>

	<?
	if (hasConstant('category'))
	{
		$groupCategories = c('category');
	?>

	<div id="browseGroup">

		<div class="title"><h5>Find a ${nameGroup}</h5></div>

		<table id="groupTypes" cellpadding="0" cellspacing="0"><tbody>
			<tr><?
				$groupCategories = c('category');
				$i = 0;

				foreach ($groupCategories as $k=>$v) {
					if (0 == $i % 3 && 0 != $i) {echo('</tr><tr>');}
					echo("<td><a href='searchResult.action?type=group&q=" . urlencode($v) . "'>$v</a></td>");
					$i++;
				}
			?></tr>
		</tbody></table>

		<form action="searchResult.action" method="get">
			<input name="<? echo(c('QK_TYPE')); ?>" type="hidden" value="group" />
			<input id="group-footer-search" class="txt input-search" size="30" name="<? echo(c('QUERY_KEY_QUERY')); ?>" type="text" />
			<input class="btn btn-round" id="search" name="search" value="Search Groups" type="submit" />
		</form>

	</div>

	<? } ?>

</div>
