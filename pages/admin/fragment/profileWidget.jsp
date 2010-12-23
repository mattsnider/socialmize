<?
if (! function_exists('_renderProfileWidget')) {

function _renderProfileWidget($index, $pw, $nameGroup)
{
$fieldType = '';

if ($pw)
{
$isActive = $pw->isActive();
$isHidden = ! $isActive;
$isMulti = $pw->isMulti();
$name = $pw->getName();
$nameTab = $pw->getNameTab();
$id = $pw->getId();
$typeBit = $pw->getSearchableTypeBit();

if (sizeof($pw->getFields()))
{
$fields = $pw->getFields();
$fieldType = $fields[0]->getType();
}
}
else
{
$isActive = true;
$isHidden = false;
$isMulti = false;
$name = '';
$nameTab = '';
$id = '0';
$typeBit = 0;
}

?><ul>

<li>
	<? echo(HtmlHelper::createLabelTag(array('for' => 'formFieldName-' . $index), 'Profile section (widget) name:')); ?>
	<? echo(HtmlHelper::createInputTag(array('class' => 'txt', 'id' => 'formFieldName-' . $index, 'name' => c('QK_PW_NAME'), 'type' => 'text', 'value'
	=> $name))); ?>
	<? echo(HtmlHelper::createInputTag(array('class' => 'displayNone', 'name' => c('QK_SUB_TASK'), 'type' => 'hidden', 'value' => 'pw'))); ?>
	<? echo(HtmlHelper::createInputTag(array('class' => 'displayNone', 'name' => c('QK_PW_ID'), 'type' => 'hidden', 'value' => $id))); ?>
	<? echo(HtmlHelper::createInputTag(array('class' => 'displayNone', 'name' => c('QK_PW_ORDER'), 'type' => 'hidden', 'value' => $index))); ?>
</li>

<li>
	<? echo(HtmlHelper::createLabelTag(array('for' => 'formFieldTab-' . $index), 'Profile edit tab name:')); ?>
	<? echo(HtmlHelper::createInputTag(array('class' => 'txt', 'id' => 'formFieldTab-' . $index, 'name' => c('QK_PW_TAB'), 'type' => 'text', 'value'
	=> $nameTab))); ?>
</li>

<? if (ProfileWidgetField::$TYPE_PORTRAIT === $fieldType)
{
?><p class="portrait-msg">This profile widget is integral to search and many other parts of the site. As a result, we currently only allow you to modify its name.</p><?
}
else
{ ?>

<li class="chkbox">
	<?
            	echo(HtmlHelper::createLabelTag(array('for' => 'formFieldMulti-' . $index), 'Multiple:'));
	$arr = array('class' => 'chkbox', 'id' => 'formFieldMulti-' . $index, 'name' => c('QK_PW_MULTI'), 'type' => 'checkbox', 'value' => 'on');
	if ($isMulti) {$arr['checked'] = 'checked';}
	echo(HtmlHelper::createInputTag($arr));
	?>
</li>

<li class="chkbox">
	<?
        		echo('<p class="lbl">Is widget visible?</p>');
	echo(HtmlHelper::createLabelTag(array('for' => 'formFieldActive-' . $index), 'enabled:'));
	$arr = array('class' => 'chkbox', 'id' => 'formFieldActive-' . $index, 'name' => c('QK_PW_STATUS') . $id, 'type' => 'radio', 'value' =>
	Searchable::$STATUS_ACTIVE);
	if ($isActive) {$arr['checked'] = 'checked';}
	echo(HtmlHelper::createInputTag($arr));
	echo(HtmlHelper::createLabelTag(array('for' => 'formFieldHidden-' . $index), 'disabled:'));
	$arr = array('class' => 'chkbox', 'id' => 'formFieldHidden-' . $index, 'name' => c('QK_PW_STATUS') . $id, 'type' => 'radio', 'value' =>
	Searchable::$STATUS_INACTIVE);
	if ($isHidden) {$arr['checked'] = 'checked';}
	echo(HtmlHelper::createInputTag($arr));
	?>
</li>

<li class="chkbox sType"><?
        		echo('<p class="lbl">What is this widget for?</p>');
	$types = Searchable::getValidTypes();

	foreach ($types as $type) {
	$isType = 'profileWidgetIs' . $type;
	$isChecked = bit_has($typeBit, ProfileWidget::getSearchableTypeBitmask($type));
	echo(HtmlHelper::createLabelTag(array('for' => 'formFieldMulti' . $isType . '-' . $index), $type . ':'));
	$arr = array('class' => 'chkbox', 'id' => 'formFieldMulti' . $isType . '-' . $index, 'name' => $isType, 'type' => 'checkbox', 'value' => 'on');
	if ($isChecked) {$arr['checked'] = 'checked';}
	echo(HtmlHelper::createInputTag($arr));
	}
	?>
</li>

<? } ?>

</ul><?
}

function _renderProfileWidgetFields($pwId, $fields, $isAjax=false) {
echo '<ul class="accordion-tabs">';

foreach ($fields as $key=>$field) {
_renderAccordionTab($pwId, $field->getId(), $field->getLabel(), $isAjax);
}

_renderAccordionTab($pwId, 0, 'Add Another Field', $isAjax);
echo '</ul>';
}

function _renderAccordionTab($pwId, $pwfId, $label, $isAjax) {
echo '<li>';
$id = 'accordion-tabs-' . $pwfId;
if (! $pwfId) {$id .= '-' . $pwId;}
$href = '/profileWidgetField.action?' . c('QK_PWF_ID') . '=' . $pwfId . '&amp;' . c('QK_PW_ID') . '=' . $pwId;
$arr = array('class' => 'next accordion-tabs', 'href' => $href, 'id' => $id);
if ($isAjax) {$arr['class'] .= ' com_slide';}
echo(HtmlHelper::createAnchorTag($arr, $label . '&nbsp;&raquo;'));
echo '</li>';
}

} ?>