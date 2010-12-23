<?
$pageContext->doInclude(dirname($pageContext->getRequest()->getServletPath()) . '/fragment/profileWidget.jsp');
$jsEnabled = $pageContext->findAttribute('jsEnabled', null);

function _renderProfileWidgetPane($index, $pw, $nameGroup) {
$fieldType = '';
global $jsEnabled;

if (sizeof($pw->getFields())) {
$fields = $pw->getFields();
$fieldType = $fields[0]->getType();
}

$classUnmodify = ($pw && ProfileWidgetField::$TYPE_PORTRAIT === $fieldType) ? 'unmodify' : '';

?><div class="panel-slide fields"><div class="panel-slide-content <? echo($classUnmodify); ?>"><?
$classUnmodify = _renderProfileWidget($index, $pw, $nameGroup) ? '' : 'unmodify';
$pwId = $pw->getId();

?><div class="buttons"><?

$pwidstr = c('QK_PW_ID') . '=' . $pwId;
$id = 'panel-slide-widget-';
$cls = ProfileWidgetField::$TYPE_PORTRAIT === $fieldType ? 'hidden' : '';
$href = $jsEnabled ? c('JS_HREF') : '/profileWidget.action?' . $pwidstr . '&' . c('QK_SHOW_DETAILS') . '=T';
$arr = array('class' => "button com_slide next com_fieldWidget $cls", 'href' => $href, 'id' => $id . 'field-' . $pwId);
echo(HtmlHelper::createAnchorTag($arr, 'Fields'));
$arr = array('class' => "button com_deleteWidget $cls", 'href' => 'adminSubmit.action?' . $pwidstr . '&' . c('QK_DELETE') . '=T' . '&' . c('QK_SUB_TASK') . '=pw' . '&' . c('QK_IS_AJAX') . '=T', 'id' => $id . 'delete-' . $pwId);
echo(HtmlHelper::createAnchorTag($arr, 'Delete'));
$arr = array('class' => 'button edit disabled com_saveWidget', 'href' => 'adminSubmit.action', 'id' => $id . 'save-' . $pwId);
echo(HtmlHelper::createAnchorTag($arr, 'Save'));
?></div>

<div class="errorWrap displayNone">
	<div class="error">No Error</div>
</div>

</div></div><?
}

function _renderProfileWidgetFieldsPane($pwId, $name, $fields) {
echo '<div class="panel-slide fields subpane hidden"><div class="panel-slide-content">';
echo(HtmlHelper::createTag('h3', null, $name));
_renderProfileWidgetFields($pwId, $fields, true);

echo '<div class="buttons">';
echo '<a class="button com_slide prev" href="javascript://" id="com_slide-back">&laquo; Back</a>';
echo '</div>';

echo '</div></div>';
}

?><form action="adminSubmit.action" id="form-field" method="post"><fieldset class="panel squareTop">

<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="field"/>
<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}"/>

<h4>Custom Profile Field Management</h4>

<p class="copy">This tool is used to manage the ${projectNameUC} custom fields. Through this form can add, remove, and edit the custom fields for
	profiles on your site.</p>

<?
$widgets = $pageContext->findAttribute('widgets', null);
$wsize = sizeof($widgets);
$nameGroup = $pageContext->evaluateTemplateText('${nameGroup}');
$index = 1;
?>

<div id="form-field-filter">
	<h5>Show fields for:</h5>
	<? $searchableTypes = Searchable::getValidTypes();
		foreach ($searchableTypes as $stype) {
			$id = 'form-field-chk-' . $stype;
			echo '<input checked="checked" id="'.$id.'" type="checkbox" value="'.$stype.'"/>';
	echo '<label for="'.$id.'">'.$stype.'</label>';
	} ?>
</div>

<dl class="accordion"><? foreach ($widgets as $pw) {
            $cls = '';
            if (1 === $index) {$cls = 'first';};
            if ($wsize === $index) {$cls = 'last';};
            $href = $jsEnabled ? c('JS_HREF') . 'toggle section' : '/profileWidget.action?' . c('QK_PW_ID') . '=' . $pw->getId();
	$span = '<span>' . $pw->getName() . '</span>';
	?>
	<dt class="<? echo($cls); ?>">
		<a class="com_orderWidget down">&nbsp;</a>
		<a class="com_orderWidget up">&nbsp;</a>
		<?
                $arr = array('class' => 'com_animBlind', 'href' => $href, 'id' => 'com_animBlind-' . $index);
		echo(HtmlHelper::createAnchorTag($arr, $span));
		?>
	</dt>

	<dd>
		<div id="widget-pane-slide-<? echo($index); ?>" class="widget-pane firstChild">
			<div class="widget-pane-slide">

				<?
            $fields = $pw->getFields();
				_renderProfileWidgetPane($index, $pw, $nameGroup, true);
				_renderProfileWidgetFieldsPane($pw->getId(), $pw->getName(), $fields, true);
				$id = 'panel-slide-field-';
				$pwId = $pw->getId();
				?>

				<div class="panel-slide fields hidden subpane">
					<div class="panel-slide-content">
						<div class="widget-dynamic-field" id="<? echo($id . 'content-' . $pwId); ?>"></div>

						<div class="buttons"><?
                    $pwidstr = c('QK_PW_ID') . '=' . $pwId; 
                    $pwfidstr = '&' . c('QK_PWF_ID') . '=777';
                    $arr = array('class' => 'button com_slide prev', 'href' => 'javascript://');
							echo(HtmlHelper::createAnchorTag($arr, '&laquo; Back'));
							$arr = array('class' => 'button com_deleteField', 'href' => 'adminSubmit.action?' . $pwidstr . $pwfidstr . '&' .
							c('QK_DELETE') . '=T' . '&' . c('QK_SUB_TASK') . '=pwf' . '&' . c('QK_IS_AJAX') . '=T', 'id' => $id . 'delete-' . $pwId);
							echo(HtmlHelper::createAnchorTag($arr, 'Delete'));
							$arr = array('class' => 'button edit disabled com_saveField', 'href' => 'adminSubmit.action', 'id' => $id . 'save-' .
							$pwId);
							echo(HtmlHelper::createAnchorTag($arr, 'Save'));
							?>
						</div>

						<div class="errorWrap displayNone">
							<div class="error">No Error</div>
						</div>
					</div>
				</div>

				<div class="clearfix">&nbsp;</div>

			</div>
		</div>
	</dd>

	<?
        $index += 1;
        }
    ?>

	<dt class="template">
		<a class="com_orderWidget down">&nbsp;</a>
		<a class="com_orderWidget up">&nbsp;</a>
		<a class="com_animBlind" href="profileWidget.action?<? echo(c('QK_PW_ID')); ?>=0" id="com_animBlind-0"><span>Click Here To Add Another</span></a>
	</dt>

	<dd class="template">
		<div id="widget-pane-slide-0" class="widget-pane firstChild">
			<div class="widget-pane-slide">

				<?
        $pw = new ProfileWidget();
        _renderProfileWidgetPane($index, $pw, $nameGroup, true);
        ?>

				<div class="clearfix">&nbsp;</div>

			</div>
		</div>
	</dd>

</dl>

</fieldset></form>