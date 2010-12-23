
<!-- ----- |  @group Edit Bar  | ----- -->

<ul class="bar bar-admin nr">
	<li><a><input class="btn" name="save" type="submit" value="Save" /></a></li>
	<?
		// hack for group add
		$key = $pageContext->evaluateTemplateText('${o.key}');
		if ($key) {
			echo('<li><a><input class="btn" name="close" type="button" value="Cancel" /></a></li>');
		}
	?>
	<li><a><input class="btn" name="reset" type="reset" value="Reset" /></a></li>
	<?
		$au = $pageContext->findAttribute('aUser', null);
		if ($au->getIsSiteAdmin()) {
			echo('<li><a><input class="btn" name="clear" type="button" value="Clear" /></a></li>');
		}
	?>
</ul>

<!-- ----- |  @end Edit Bar  | ----- -->
