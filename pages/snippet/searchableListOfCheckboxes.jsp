<?
$filters = $pageContext->findAttribute('listFilters', null);
$checkboxes = $pageContext->findAttribute('listCheckboxes', null);
$checkboxSize = $pageContext->findAttribute('listCheckboxSize', null);
$S = $pageContext->findAttribute('S', null);
$buttons = $pageContext->findAttribute('listButtons', null);

$nameFilter = c('QUERY_KEY_FILTER');
$nameKey = c('QUERY_KEY_KEY');
$nameLimit = c('QUERY_KEY_LIMIT');
$nameOffset = c('QUERY_KEY_OFFSET');
$nameQuery = c('QUERY_KEY_QUERY');
$nameIds = c('QUERY_KEY_ID').'s';
$nameParams = 'params';
$limit = $pageContext->evaluateTemplateText('${' . $nameLimit . '}');
$offset = $pageContext->evaluateTemplateText('${' . $nameOffset . '}');
$searchCopy = $pageContext->evaluateTemplateText('${' . $nameQuery . '}');
$ids = $pageContext->evaluateTemplateText('${' . $nameIds . '}');
$aParams = $pageContext->evaluateTemplateText('${' . $nameParams . '}');

$currentUrl = $pageContext->evaluateTemplateText('${pagename}');
$boxId = $pageContext->evaluateTemplateText('${listBoxId}');
$useFilter = $filters && sizeof($filters);
$useSearch = $pageContext->evaluateTemplateText('${listUseSearch}');
$submitCopy = $pageContext->evaluateTemplateText('${listSubmitCopy}');

if (! $submitCopy) {
	$submitCopy = 'Submit';
}

// convert params to a string
$sParams = http_build_query($aParams);

$clsEmpty = 'empty';
$clsList = 'list';

if ($checkboxSize) {
$clsEmpty .= ' displayNone';
}
else {
$clsList .= ' displayNone';
}

sizeof($checkboxes);

$href = $currentUrl . '.action?' . $sParams . '&' . c('QUERY_KEY_LIMIT') . '=' . $limit . '&' . c('QUERY_KEY_QUERY') . '=' . $searchCopy .
'&' . c('QUERY_KEY_OFFSET') . '=';

echo '<div class="'.$clsList.'" id="'.$boxId.'">';

echo '<input id="'.$boxId.$nameLimit.'" name="'.$nameLimit.'" type="hidden" value="'.$limit.'"/>';
echo '<input id="'.$boxId.$nameOffset.'" name="'.$nameOffset.'" type="hidden" value="'.$offset.'"/>';
echo '<input id="'.$boxId.$nameIds.'" name="'.$nameIds.'" type="hidden" value="'.$ids.'"/>';
echo '<input id="'.$boxId.$nameParams.'" name="'.$nameParams.'" type="hidden" value="'.$sParams.'" />';

foreach ($aParams as $name=>$value) {
echo '<input id="'.$boxId.$name.'" name="'.$name.'" type="hidden" value="'.$value.'"/>';
}

if ($useSearch) {
echo '<div class="filter" id="'.$boxId.'filterBox">';
echo '<label for="'.$boxId.$nameQuery.'">name or keyword:</label>';
echo '<input autocomplete="off" class="txt" id="'.$boxId.$nameQuery.'" name="'.$nameQuery.'" type="text" value="'.$searchCopy.'"/>';
echo '<input class="btn btn-round" id="'.$boxId.'filterButton" type="button" value="Filter">';
echo '</div>';
}

if ($useFilter) {
echo '<dl class="checkbox-list clearfix" id="'.$boxId.'filterType">';
foreach ($filters as $filter) {
echo '<dd><input name="'.$nameFilter.'[]" type="checkbox" value="'.$filter.'" id="'.$boxId.'chk'.$filter.'" checked="checked"></dd>';
echo '<dt><label for="'.$boxId.'chk'.$filter.'">'.$filter.'</label></dt>';
}
echo '</dl>';
}

echo '<div id="'.$boxId.'results">';

echo '<div id="'.$boxId.'list">';
echo '<ul>';
foreach ($checkboxes as $chkbox) {
$id = $chkbox['id'];
$type = $chkbox['type']; // should be same as filters
$checked = $chkbox['checked'];
$disabled = $chkbox['disabled'];
$name = $chkbox['name'];

$attrs = '';
$cls = $type;

if ($checked) {
$attrs .= ' checked="checked"';
}

if ($disabled) {
$cls .= ' disabled';
$attrs .= ' disabled="disabled"';
}

echo '<li class="'.$cls.'">';
echo '<input id="'.$boxId.'checkbox' . $id . '" '.$attrs.' name="checkboxes[]" type="checkbox" value="' . $id . '"/>';
echo '<label for="'.$boxId.'checkbox' . $id . '">' . $name . '</label>';
echo '</li>';
}
echo '</ul>';
echo '</div>';

if ($checkboxSize < $limit) {

echo '<div class="links">';
if ($offset) {
echo '<a class="previous ' . $clsPrevious . '" href="' . $href . ($offset - $limit) . '#panel-members" id="'.$boxId.'previous">Previous</a>';
}
if ($checkboxSize > $offset + $limit) {
echo '<a class="next ' . $clsNext . '" href="' . $href . ($offset + $limit) . '#panel-members" id="'.$boxId.'next">Next</a>';
}
echo '</div>';

}

echo '<div class="buttons">';
if ($buttons) {
	foreach ($buttons as $button) {
		echo HtmlHelper::createInputTag($button);
	}
}
echo '<input class="btn btn-round action" type="submit" value="'.$submitCopy.'"/>';
echo '</div>';

echo '</div>';

echo '</div>';

echo '<div class="'.$clsEmpty.'" id="'.$boxId.'empty">There are no results matching <q>'.$searchCopy.'</q>. Please try another search.</div>';
?>