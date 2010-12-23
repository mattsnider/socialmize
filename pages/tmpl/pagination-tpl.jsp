<? function writePagination($pageContext) {
	$total = $pageContext->evaluateTemplateText('${resultn}');

	if (c('RESULTS_LIMIT') < $total) {
		$offset = $pageContext->findAttribute(c('QUERY_KEY_OFFSET'), null);
		$uri = $pageContext->findAttribute(c('QUERY_KEY_URL'), null);
        $query = $pageContext->findAttribute(c('QUERY_KEY_SEARCH'), null);
        $showRating = $pageContext->findAttribute('showRating', null);
		$sort = preg_replace('/.*' . c('QUERY_KEY_SORT') . '=(\w+).*/i', '$1', $query);
		$uri = preg_replace('/\/(\w+).action/i', '/$1.action', $uri);
		$oUri = $uri . '?' . preg_replace('/&?' . c('QUERY_KEY_SORT') . '=\w+/i', '', $query);
		$uri = $uri . '?' . preg_replace('/&?offset=\d+/i', '', $query);

		// pagination constants
		$LIMIT = c('RESULTS_LIMIT');
		$MAX_PAGES = 5;
		$hMax = ceil($MAX_PAGES / 2);

		// pagination variables
		if (! $offset || 0 > $offset) {$offset=0;}
		$numpages = ceil($total / $LIMIT);
		$index = ceil($offset / $LIMIT) + 1;
		$lindex = 0;
		$findex = ($index - $hMax);

		// normalize offset
		if (1 > $index) {$index = 1;}
		if ($numpages < $index) {$index = $numpages;}

	?>

	<ul class="pagination">
		<?/*
		<li class="sort <? if ($sort === 'tdesc') {echo('selected');} ?>"><a href="<? echo($oUri); ?>&<? echo(c('QUERY_KEY_SORT')); ?>=tdesc" title="most recently updated first">
			<img alt="Sort results by time ascending" src="/assets/images/buttons/sortTimeAsc.gif"/></a></li>
		<li class="sort <? if ($sort === 'tasc') {echo('selected');} ?>"><a href="<? echo($oUri); ?>&<? echo(c('QUERY_KEY_SORT')); ?>=tasc" title="most rarely updated first">
			<img alt="Sort results by time descending" src="/assets/images/buttons/sortTimeDesc.gif"/></a></li>

        <? if ($showRating) { ?>
        <li class="sort <? if ($sort === 'rasc') {echo('selected');} ?>"><a href="<? echo($oUri); ?>&<? echo(c('QUERY_KEY_SORT')); ?>=rasc" title="sort lowest to highest rated">
			<img alt="Sort results by rating ascending" src="/assets/images/buttons/sortRatingAsc.gif"/></a></li>
		<li class="sort <? if ($sort === 'rdesc') {echo('selected');} ?>"><a href="<? echo($oUri); ?>&<? echo(c('QUERY_KEY_SORT')); ?>=rdesc" title="sort highest to lowest rated">
			<img alt="Sort results by rating descending" src="/assets/images/buttons/sortRatingDesc.gif"/></a></li>
        <? } ?>
		*/?>

        <?
		if (1 < $findex && $MAX_PAGES < $numpages) {
			?><li class="first"><a href="<? echo($uri); ?>&offset=0">&laquo;</a></li><?

			if ($numpages < $index + $hMax) {
				$findex = $numpages - $MAX_PAGES + 1;
			}
		}
		else {
			$findex = 1;
		}

		if (1 < $index) {
			?><li class="prev"><a href="<? echo($uri); ?>&offset=<? echo(($index-2) * $LIMIT); ?>">&lt;</a></li><?
		}
		
		if (2 < $numpages) {
			$k = $MAX_PAGES;

			// populate values before index
			for ($i=$findex, $j=$index; $i<$j; $i++) {
				?><li><a href="<? echo($uri); ?>&offset=<? echo(($i-1) * $LIMIT); ?>"><? echo($i); ?></a></li><?
				$k--;
			}

			// populate values after index; current index
			for ($i=$index, $j=($numpages > $MAX_PAGES)? $findex + $MAX_PAGES: $numpages; $j>=$i && 0 < $k; $i++) {
				$isIndex = ($i == $index);
				$link = $isIndex? $i: '<a href="' . $uri . '&offset=' . (($i-1) * $LIMIT) . '">' . $i . '</a>';
				$lindex = $i;
				$k--;

				?><li class="<? echo ($i == $index)? 'selected': ''; ?>"><? echo($link); ?></li><?
			}
		}

		// next
		if ($numpages > $index) {
			?><li class="next"><a href="<? echo($uri); ?>&offset=<? echo(($index) * $LIMIT); ?>">&gt;</a></li><?
		}

		// last
		if (2 < $numpages && $lindex < $numpages) {
			?><li class="last"><a href="<? echo($uri); ?>&offset=<? echo(($numpages-1) * $LIMIT); ?>">&raquo;</a></li><?
		}

	?></ul>

<?
	}

} ?>