<?
$pwf = $pageContext->findAttribute('pwf', null);
$pw = $pageContext->findAttribute('pw', null);
$jsEnabled = $pageContext->findAttribute('jsEnabled', null);
$isRequired = false;

$arr = array('class' => 'displayNone', 'name' => c('QK_SUB_TASK'), 'type' => 'hidden', 'value' => 'pwf');
echo(HtmlHelper::createInputTag($arr));

$arr = array('class' => 'displayNone', 'name' => c('QUERY_KEY_PAGE'), 'type' => 'hidden', 'value' => 'profileWidgetField');
echo(HtmlHelper::createInputTag($arr));

$arr = array('class' => 'displayNone', 'name' => c('QK_PW_ID'), 'type' => 'hidden', 'value' => $pw->getId());
echo(HtmlHelper::createInputTag($arr));

if ($pwf) {
$arr = array('class' => 'displayNone', 'name' => c('QK_PWF_ID'), 'type' => 'hidden', 'value' => $pwf->getId());
echo(HtmlHelper::createInputTag($arr));
$pwfId = $pwf->getId();
$isRequired = $pwf->isRequired();
}
else {
$arr = array('class' => 'displayNone', 'name' => c('QK_CREATE'), 'type' => 'hidden', 'value' => 'T');
echo(HtmlHelper::createInputTag($arr));
$pwfId = 0;
}

$arr = array('class' => 'displayNone', 'name' => c('QK_PW_ORDER'), 'type' => 'hidden', 'value' => $pwf ? $pwf->getOrder() : $pw->getFieldCount() + 1);
echo(HtmlHelper::createInputTag($arr));

$fieldName = '';
$fieldDefault = '';
$isActive = true;
$isHidden = false;
$isPrivate = false;

echo '<ul class="accordion-tabs ' . ($jsEnabled ? 'disclosure hideDisclosure' : '') . '">';
// editing field
if ($pwf) {
$fieldName = htmlentities($pwf->getLabel(), ENT_COMPAT);
$fieldDefault = $pwf->getDefaultValue();
$isActive = $pwf->isActive();
$isHidden = ! $isActive;
$isPrivate = $pwf->isPrivate();

?><li>
<label>Field type</label>
<strong><? echo ($pwf->getType()); ?></strong>
</li><?

}
// new field
else {

?><li><?
$name = c('QK_PW_FIELD_TYPE');
echo(HtmlHelper::createTag('label', array('for' => $name), 'Field type'));

$types = ProfileWidgetField::getTypes();
$options = array('<option>-- Select A Type --</option>');

foreach ($types as $type) {
if (ProfileWidgetField::$TYPE_PORTRAIT !== $type) {
$arr = array('value' => $type);
array_push($options, HtmlHelper::createOptionTag($arr, $type));
}
}

$arr = array('id' => $name, 'name' => $name);
echo(HtmlHelper::createTag('select', $arr, implode('', $options)));

echo('<a class="help" href="faq.action#profile-fields" target="_blank">?</a>');
?></li><?

}

?><li><?
$name = c('QK_PW_NAME');
echo(HtmlHelper::createTag('label', array('for' => $name), 'Field name'));
$arr = array('class' => 'text', 'id' => $name, 'maxlength' => 32, 'name' => $name, 'type' => 'text', 'value' => $fieldName);
echo(HtmlHelper::createInputTag($arr));
?></li>

<li>
	<a class="com_disclosure disclosure" href="javascript://shows more options">Show advanced options</a>
</li>
<?
if ($pwf && (ProfileWidgetField::$TYPE_TEXT_AREA == $pwf->getType() || ProfileWidgetField::$TYPE_TEXT == $pwf->getType())) {
?><li class="indent disclose"><?
$name = c('QK_PWF_DEFAULT');
echo(HtmlHelper::createTag('label', array('for' => $name), 'Default value'));
$arr = array('class' => 'text', 'id' => $name, 'maxlength' => 32, 'name' => $name, 'type' => 'text', 'value' => $fieldDefault);
echo(HtmlHelper::createInputTag($arr));
?></li><?
}
?><li class="chkbox indent disclose"><?
$name = c('QK_PWF_REQUIRED');
echo('<p class="lbl">Is field required?</p>');
$id = $name + 'Yes' + $pwfId;
$arr = array('class' => 'chkbox', 'id' => $id, 'name' => $name, 'type' => 'radio', 'value' => 'T');
if ($isRequired) {$arr['checked'] = 'checked';}
echo(HtmlHelper::createTag('label', array('for'=>$id), 'Yes'));
echo(HtmlHelper::createInputTag($arr));
$id = $name + 'No' + $pwfId;
echo(HtmlHelper::createTag('label', array('for'=>$id), 'No'));
$arr = array('class' => 'chkbox', 'id'=>$id, 'name' => $name, 'type' => 'radio', 'value' => 'F');
if (! $isRequired) {$arr['checked'] = 'checked';}
echo(HtmlHelper::createInputTag($arr));
?></li>

<li class="chkbox indent disclose"><?
        echo('<p class="lbl">Is field visible?</p>');
	echo(HtmlHelper::createLabelTag(array('for' => 'formFieldActive-' . $pwfId), 'enabled:'));
	$arr = array('class' => 'chkbox', 'id' => 'formFieldActive-' . $pwfId, 'name' => c('QK_PW_STATUS'), 'type' => 'radio', 'value' =>
	Searchable::$STATUS_ACTIVE);
	if ($isActive) {$arr['checked'] = 'checked';}
	echo(HtmlHelper::createInputTag($arr));
	echo(HtmlHelper::createLabelTag(array('for' => 'formFieldHidden-' . $pwfId), 'disabled:'));
	$arr = array('class' => 'chkbox', 'id' => 'formFieldHidden-' . $pwfId, 'name' => c('QK_PW_STATUS'), 'type' => 'radio', 'value' =>
	Searchable::$STATUS_INACTIVE);
	if ($isHidden) {$arr['checked'] = 'checked';}
	echo(HtmlHelper::createInputTag($arr));
	?>
</li>

<li class="chkbox indent disclose"><?
        echo '<p class="lbl">Is field private?</p>';
	$name = c('QK_PW_PRIVATE');
	$id = $name + 'Yes' + $pwfId;
	$arr = array('class' => 'chkbox', 'id' => $id, 'name' => $name, 'type' => 'radio', 'value' => 'T');
	if ($isPrivate) {$arr['checked'] = 'checked';}
	echo(HtmlHelper::createTag('label', array('for'=>$id), 'Yes'));
	echo(HtmlHelper::createInputTag($arr));
	$id = $name + 'No' + $pwfId;
	echo(HtmlHelper::createTag('label', array('for'=>$id), 'No'));
	$arr = array('class' => 'chkbox', 'id'=>$id, 'name' => $name, 'type' => 'radio', 'value' => 'F');
	if (! $isPrivate) {$arr['checked'] = 'checked';}
	echo(HtmlHelper::createInputTag($arr));
	?>
</li>
<?

// additional fields for editing PWF
if ($pwf) {
switch ($pwf->getType()) {
case 'select':
$values = c($pwf->getName());
if (! $values) {$values = array();}
$i = 0;

$arr = array('class' => 'displayNone', 'name' => c('QK_SIZE'), 'type' => 'hidden', 'value' => sizeof($values) + 1);
echo(HtmlHelper::createInputTag($arr));

$arr = array('class' => 'text', 'name' => '', 'type' => 'text', 'value' => '');

?><li><label>Field values</label></li><?

foreach ($values as $key => $value) {
?><li class="sValue indent"><strong><? echo($i); ?>.</strong><?
$arr['name'] = c('QK_PWF_OPTION_NAME') . $i;
$arr['value'] = urlencode($value);
echo(HtmlHelper::createInputTag($arr));
$arrh = array('class' => 'displayNone', 'name' => c('QK_PWF_OPTION_ID') . $i, 'type' => 'hidden', 'value' => $key);
echo(HtmlHelper::createInputTag($arrh));
?></li><?
$i += 1;
}

?><li class="sValue indent"><strong><? echo($i); ?>.</strong><?
$arr['name'] = c('QK_PWF_OPTION_NAME') . $i;
$arr['value'] = '';
echo(HtmlHelper::createInputTag($arr));
?></li><?
break;

case ProfileWidgetField::$TYPE_TEXT_AREA:
case ProfileWidgetField::$TYPE_LIST:
?><li class="indent disclose">
<label>Maximum length (# of characters)</label><?
$options = array(
'255' => '255', // tinytext
'65535' => '65,535', // text
'16777215' => '16,777,215', // mediumtext
'4294967295' => '4,294,967,295' // longtext
);
$currentValue = $pwf->getMaxlength() ? $pwf->getMaxlength() : 65535;
echo(HtmlHelper::selectTag($options, $currentValue, array('name' => c('QK_PW_FIELD_ML')), array(), false));
?></li><?
break;

case ProfileWidgetField::$TYPE_IMAGE:
case ProfileWidgetField::$TYPE_DATETIME:
case ProfileWidgetField::$TYPE_DATE_RANGE:
case ProfileWidgetField::$TYPE_PORTRAIT:
break;

default:
?><li class="indent disclose">
<label>Maximum length (# of characters)</label><?
$options = array(
'2' => '2',
'4' => '4',
'8' => '8',
'16' => '16',
'32' => '32',
'64' => '64',
'128' => '128',
'255' => '255'
);
echo(HtmlHelper::selectTag($options, $pwf->getMaxlength(), array('name' => c('QK_PW_FIELD_ML')), array(), false));
?></li><?
break;
}
}
?></ul>