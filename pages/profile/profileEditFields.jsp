<?

$S = $pageContext->findAttribute('S', null);
$formAction = $pageContext->evaluateTemplateText('${formAction}');
$task = $pageContext->evaluateTemplateText('${task}');
$widget = $pageContext->findAttribute(c('MN_WIDGET'), null);
$fields = $widget ? $widget->getFields() : $pageContext->findAttribute('fields', null);
if (!$fields) {
$fields = array();
}
if (!$formAction) {
$formAction = 'profileSubmit.action';
}

$bkt = $widget && $widget->isMulti() ? '[]' : '';
$imageMap = array();
$aI = 0;

$hasPrivate = false;
$hasRequired = false;

echo '<form action="' . $formAction . '" class="profile-edit editor borderTop" enctype="multipart/form-data" method="post"><fieldset>';
echo '<input name="' . c('QUERY_KEY_TASK') . '" type="hidden" value="' . $task . '" />';
echo '<input name="' . c('QUERY_KEY_KEY') . '" type="hidden" value="' . $S->getKey() . '" />';

echo '<dl class="">';
$i = 1;

foreach ($fields as $field) {
$privateCls = '';
$requiredCls = '';

echo '<dt><label for="' . $field->getName() . '">';

if ($field->isRequired()) {
echo('<sup>1</sup> ');
$hasRequired = true;
$requiredCls = 'required';
}

if ($field->isPrivate()) {
echo('<sup>2</sup> ');
$hasPrivate = true;
$privateCls = 'required';
}

echo($field->getLabel());
echo ':</label></dt>';

echo '<dd class="' . $field->getType() . ' ' . $field->getName() . ' ' . $requiredCls . ' ' . $privateCls . '">';
$type = $field->getType();
switch ($type) {
case ProfileWidgetField::$TYPE_DATETIME:
$dt = datetime_to_array($field->getValue());
echo(HtmlHelper::monthOptionTag($dt['m'], array('cls' => 'select month', 'name' => $field->getName() . c('QK_MONTH') . $bkt)));
echo(HtmlHelper::dayOptionTag($dt['d'], array('cls' => 'select day', 'name' => $field->getName() . c('QK_DAY') . $bkt)));
echo(HtmlHelper::yearOptionTag(100, 0, $dt['y'], array('cls' => 'select year', 'name' => $field->getName() . c('QK_YEAR') . $bkt)));
break;

case ProfileWidgetField::$TYPE_DATE_RANGE:
$current = '';
$smonth = '';
$syear = '';
$emonth = '';
$eyear = '';
$classNonCurrent = '';
$classCurrent = 'displayNone';

if ($field->getValue()) {
$values = explode('||', $field->getValue());
$start = $values[0];
$end = $values[1];
$current = $values[2] ? 'checked="checked"' : '';
$smonth = preg_replace('/\d{4}\-(\d+)\-.*/', '$1', $start);
$syear = preg_replace('/(\d{4})\-.*/', '$1', $start);

if ($end) {
$emonth = preg_replace('/\d{4}\-(\d+)\-.*/', '$1', $end);
$eyear = preg_replace('/(\d{4})\-.*/', '$1', $end);
}

if ($current) {
$classNonCurrent = 'displayNone';
$classCurrent = '';
}
}

$id = $field->getName() . c('QK_CURRENT') . '-' . $field->getId();

echo '<p>';
echo '<input ' . $current . ' id="' . $id . '" name="' . $field->getName() . c('QK_CURRENT') . $bkt .
'" class="chk" type="checkbox" value="true" />&nbsp;';
echo '<label for="' . $id . '">Check here, if currently ongoing, without an end date.</label>';
echo '</p>';
echo '<span>';
echo(HtmlHelper::monthAbbrOptionTag($smonth, array('name' => $field->getName() . 's' . c('QK_MONTH') . $bkt, 'cls' => 'select month')));
echo('&nbsp;');
echo(HtmlHelper::yearOptionTag(100, 0, $syear, array('name' => $field->getName() . 's' . c('QK_YEAR') . $bkt, 'cls' => 'select')));
echo '</span>';
echo '<span>to&nbsp;</span>';
echo '<span class="' . $classCurrent . '"><strong>present.&nbsp;</strong></span>';
echo '<span class="' . $classNonCurrent . '">';
echo(HtmlHelper::monthAbbrOptionTag($emonth, array('name' => $field->getName() . 'e' . c('QK_MONTH') . $bkt, 'cls' => 'select month')));
echo('&nbsp;');
echo(HtmlHelper::yearOptionTag(100, 0, $eyear, array('name' => $field->getName() . 'e' . c('QK_YEAR') . $bkt, 'cls' => 'select')));
echo '</span>';
break;

case ProfileWidgetField::$TYPE_IMAGE:
if (!array_key_exists($field->getName(), $imageMap)) {
$imageMap[$field->getName()] = 0;
}

$n = $imageMap[$field->getName()];

if ($field->getValue()) {
echo ('<input checked="checked" name="' . $field->getName() . 'chkbox' . $n . '" id="' . $field->getName() . 'chkbox' . $n . $i . '" type="checkbox" value="' . $field->getValue() . '"/>');
echo ('<label for="' . $field->getName() . 'chkbox' . $n . $i . '">&nbsp;Keep the <a href="/assets' . $field->getValue() . '">current image</a>.</label>');
}
echo ('<input class="input-file" name="' . $field->getName() . $n . '" size="30" type="file" />');

$imageMap[$field->getName()] += 1;
break;

case ProfileWidgetField::$TYPE_PORTRAIT:

echo '<dl class="clearfix">';

echo '<dt> </dt>';
echo '<dd>';
echo '<h3>Upload an Image: </h3>';
echo '<p>File size is limited to 2 MB. If your upload does not work, try a smaller picture.</p>';
echo '<p><input class="chk" id="' . c('QK_AGREE') . '" name="' . c('QK_AGREE') . '" type="checkbox" value="on"/>';
echo '<label for="' . c('QK_AGREE') . '">I certify that I have the right to distribute this picture and that it is not pornography.</label></p>';
echo 'You can upload a JPG, GIF or PNG file.';
echo '<p><input class="input-file" name="' . c('QK_PIC') . '" size="30" type="file" /></p>';
echo '</dd>';
echo '</dl>';

echo '<div class="buttons"><input class="btn btn-round action" type="submit" value="Upload" /></div>';

$widget = $pageContext->findAttribute(c('MN_WIDGET'), null);
$fields = $widget->getFields();
$image = $fields[0]->getValue();
$thumb = '/assets' . $fields[1]->getValue();

if (!$image) {
$image = $S->isUser() ? c('defaultUserImageUri') : c('defaultGroupImageUri');
}
if (!$thumb) {
$image = $S->isUser() ? c('defaultUserThumbUri') : c('defaultGroupThumbUri');
}

// this is not a default value
if (!(c('defaultGroupImageUri') === $image || c('defaultUserImageUri') === $image)) {
echo '<dl>';
echo '<dt> </dt>';
echo '<dd>';
echo '<h3>Remove Your Picture: </h3>';
echo '<img alt="' . $S->getName() . '&apos;s thumbnail" src="' . $thumb . '" />';
echo 'You can remove this picture, but be sure to upload another or we will display a question mark in its place.';
echo '</dd>';
echo '</dl>';

echo '<div class="buttons"><input name="' . c('QK_REMOVE') . '" type="submit" value=" Remove Picture " /></div>';
}

break;

case ProfileWidgetField::$TYPE_SELECT:
if ('year' === $field->getName()) {
echo(HtmlHelper::yearOptionTag(100, -8, $field->getValue(), array('cls' => 'select', 'name' => c('QK_YEAR') . $bkt)));
}
else {
echo(HtmlHelper::selectTag(c($field->getName()), $field->getValue(), array('cls' => 'select', 'id' => $field->getName(),
'name' => $field->getName() . $bkt)));
}
break;

case ProfileWidgetField::$TYPE_BOOLEAN:
	echo(HtmlHelper::selectTag(c('__' . $field->getType() . '__'), $field->getValue(), array('cls' => 'select', 'id' => $field->getName(),
		'name' => $field->getName() . $bkt)));
break;

case ProfileWidgetField::$TYPE_AUTOCOMPLETE:
echo '<input class="txt autocomplete" id="' . $type . '-npt-' . $aI . '" maxlength="' . $field->getMaxlength() . '" name="' .
$field->getName() . $bkt . '" type="text" value="' . $field->getValue() . '" />';
echo '<div class="' . $type . '" id="' . $type . '-ac-' . $aI . '"></div>';
$aI += 1;
break;

case ProfileWidgetField::$TYPE_TEXT:
echo '<input class="txt" id="' . $field->getName() . '" maxlength="' . $field->getMaxlength() . '" name="' . $field->getName() . $bkt .
'" type="text" value="' . $field->getValue() . '" />';
break;

case ProfileWidgetField::$TYPE_LIST:
echo '<textarea class="textarea" cols="30" id="' . $field->getName() . '" name="' . $field->getName() . $bkt .
'" rows="5" title="List ' . $field->getName() . ' (seperate by comma or &apos;enter&apos;).">' . $field->getValue() . '</textarea>';
break;

case ProfileWidgetField::$TYPE_TEXT_AREA:
echo '<textarea class="textarea" cols="30" id="' . $field->getName() . '" name="' . $field->getName() . $bkt . '" rows="5">' .
$field->getValue() . '</textarea>';
break;
}
echo '</dd>';

if ($widget && 0 === $i % $widget->getFieldCount()) {
echo '<dt><label>&nbsp;</label></dt><dd class="divider"></dd>';
}
$i += 1;

}

echo '</dl>';

foreach ($imageMap as $v) {
echo '<input name="' . c('QK_SIZE') . '" type="hidden" value="' . $v . '" />';
break;
}

if ($hasRequired) {
echo '<div class="requiredMessage"><strong><sup>1</sup> Fields Are Required</strong></div>';
}

if ($hasPrivate) {
echo '<div class="requiredMessage"><strong><sup>2</sup> Fields Are Private (only visible to site administrators and you)</strong></div>';
}

echo '<div class="buttons">';
echo '<input class="btn" type="reset" value="Reset"/>';
echo '<input class="btn btn-round action" type="submit" value="Save"/>';
echo '</div>';

echo '</fieldset></form>';

?>