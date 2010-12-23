<form action="updateSearchableFeatures.action" class="borderTop" method="post"><fieldset class="panel">
	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="access" />
	<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${S.key}" />

	<!-- ----- |  @group Edit Form  | ----- -->

	<?

		$S = $pageContext->findAttribute('S', null);
		$lcmember = $pageContext->evaluateTemplateText('${lc_' . c('MN_NAME_MEMBER') . '}');
		$lcgroup = $pageContext->evaluateTemplateText('${lc_' . c('MN_NAME_GROUP') . '}');
		$fOrM = $pageContext->evaluateTemplateText('${lc_' . c($S->isGroup() ? 'MN_NAME_MEMBER' : 'MN_NAME_FRIEND') . 's}');
		$thisname = $S->isGroup() ? 'This ' . $lcgroup : 'Your profile';
		$thename = $S->isGroup() ? 'the ' . $lcgroup : 'your profile';

	?>

	<h3>Features</h3>

	<p class="copy">${projectNameUC} allows you to customize what features you would like to have on <? echo($thename); ?>.
		<? echo(ucfirst($fOrM)); ?> can always view/use features and you have the option to allow everyone access.
		Below is a list of available features:</p>

	<div class="content white"><dl class="clearfix">

		<?
			$hasMessageBoard = $pageContext->evaluateTemplateText('${' . c('QK_HAS_MESSAGE_BOARD') . '}');
			$hasRelated = $pageContext->evaluateTemplateText('${' . c('QK_HAS_RELATED') . '}');
			$hasWall = $pageContext->evaluateTemplateText('${' . c('QK_HAS_WALL') . '}');

			if ($hasMessageBoard || $hasRelated || $hasWall) {
		?>
		<dt><label for="<? echo(c('QUERY_KEY_RELATED')); ?>">&nbsp;</label></dt>
		<dd>
			<?
				$chkMB = $S->hasMessageBoard() ? 'checked="checked"' : '';
				$chkRelated = $S->hasRelated() ? 'checked="checked"' : '';
				$chkWall = $S->hasWall() ? 'checked="checked"' : '';

				$chkMBPublic = $S->isMessageBoardPublic() ? 'checked="checked"' : '';
				$chkRelatedPublic = $S->isRelatedPublic() ? 'checked="checked"' : '';
				$chkWallPublic = $S->isWallPublic() ? 'checked="checked"' : '';

				$visMBPublic = $S->hasMessageBoard() ? '' : 'style="visibility:hidden;"';
				$visRelatedPublic = $S->hasRelated() ? '' : 'style="visibility:hidden;"';
				$visWallPublic = $S->hasWall() ? '' : 'style="visibility:hidden;"';
			?>

			<? if ($hasRelated) { ?>
			<p><input <? echo($chkRelated); ?> id="<? echo(c('QUERY_KEY_RELATED')); ?>" name="<? echo(c('QUERY_KEY_RELATED')); ?>"
				type="checkbox" /> <label for="<? echo(c('QUERY_KEY_RELATED')); ?>">Show ${lc_nameRelated} ${S.type}s.</label></p>
			<p class="indent" <? echo($visRelatedPublic); ?> ><input <? echo($chkRelatedPublic); ?> id="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_RELATED')); ?>"
				name="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_RELATED')); ?>" type="checkbox" /><label for="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_RELATED')); ?>"><small>Non-${S.memberString}s can see the ${lc_nameRelated} ${S.type}s.</small></label></p>
			<? } ?>

			<? if ($hasMessageBoard) { ?>
			<p><input <? echo($chkMB); ?> id="<? echo(c('QUERY_KEY_MESSAGE_BOARD')); ?>" name="<? echo(c('QUERY_KEY_MESSAGE_BOARD')); ?>"
				type="checkbox" /> <label for="<? echo(c('QUERY_KEY_MESSAGE_BOARD')); ?>">Enable ${lc_nameMessageBoard}.</label></p>
			<p class="indent" <? echo($visMBPublic); ?> ><input <? echo($chkMBPublic); ?> id="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_MESSAGE_BOARD')); ?>"
				name="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_MESSAGE_BOARD')); ?>" type="checkbox" /><label for="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_MESSAGE_BOARD')); ?>"><small>Non-${S.memberString}s can use the ${lc_nameMessageBoard}.</small></label></p>
			<? } ?>

			<? if ($hasWall) { ?>
			<p><input <? echo($chkWall); ?> id="<? echo(c('QUERY_KEY_WALL')); ?>" name="<? echo(c('QUERY_KEY_WALL')); ?>"
				type="checkbox" /> <label for="<? echo(c('QUERY_KEY_WALL')); ?>">Enable ${lc_nameWall}.</label></p>
			<p class="indent" <? echo($visWallPublic); ?> ><input <? echo($chkWallPublic); ?> id="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_WALL')); ?>"
				name="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_WALL')); ?>" type="checkbox" /><label for="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_WALL')); ?>"><small>Non-${S.memberString}s can use the ${lc_nameWall}.</small></label></p>
			<? } ?>
		</dd>
		<? } ?>

	</dl>

	<div class="buttons">
		<input class="btn" type="reset" value="Reset"/>
		<input class="btn btn-round action" type="submit" value="Submit"/>
	</div>

	</div>
</fieldset></form>

<form action="updateSearchableAccess.action" method="post"><fieldset class="panel">
	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="access" />
	<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${S.key}" />

	<!-- ----- |  @group Edit Form  | ----- -->

	<h3>Profile Access <a name="access"></a></h3>

	<p class="copy">${projectNameUC} gives you control over who can view <? echo($thename); ?>. Please change the settings below to what is most comfortable for you:</p>

	<div class="content white"><dl>

		<?
			$chkOpen = $S->isOpen() ? 'checked="checked"' : '';
			$chkClosed = $S->isClosed() ? 'checked="checked"' : '';
			$chkPrivate = $S->isPrivate() ? 'checked="checked"' : '';
		?>

		<dt><label for="<? echo(c('QUERY_KEY_ACCESS')); ?>-open">&nbsp;</label></dt>
		<dd>
			<p><input <? echo($chkOpen); ?> id="<? echo(c('QUERY_KEY_ACCESS')); ?>-open" name="<? echo(c('QUERY_KEY_ACCESS')); ?>" type="radio" value="O" />
				<label for="<? echo(c('QUERY_KEY_ACCESS')); ?>-open"><? echo ($thisname); ?> is open.</label>
			</p>
			<p class="copy"><?
				if ($S->isGroup()) {
					echo('Anyone can join and invite others to join.');
				} ?>
				Anyone can see <? echo($thename); ?> information, ${lc_nameMessageBoard}, and ${lc_nameWall}.</p>
			<p><input  <? echo($chkClosed); ?> id="<? echo(c('QUERY_KEY_ACCESS')); ?>-closed" name="<? echo(c('QUERY_KEY_ACCESS')); ?>" type="radio" value="C" />
				<label for="<? echo(c('QUERY_KEY_ACCESS')); ?>-closed"><? echo($thisname); ?> is closed.</label></p>
			<p class="copy"><?
				if ($S->isGroup()) {
					echo('Administrative approval is required for a new ' . $lcmember . ' to join.');
				} ?>
				Anyone can see <? echo($thename); ?> information, but only <? echo($fOrM); ?> can see the ${lc_nameMessageBoard} and ${lc_nameWall}.</p>
			<p><input  <? echo($chkPrivate); ?> id="<? echo(c('QUERY_KEY_ACCESS')); ?>-private" name="<? echo(c('QUERY_KEY_ACCESS')); ?>" type="radio" value="P" />
				<label for="<? echo(c('QUERY_KEY_ACCESS')); ?>-private"><? echo ($thisname); ?> is private.</label></p>
			<p class="copy"><?
				if ($S->isGroup()) {
					echo('The ' . $lcgroup . ' will not appear in search results or in the profiles of its ' . $fOrM . '. Administrative approval is required for new ' . $lcmember . ' to join.');
				} ?>
				Only <? echo($fOrM); ?> can see <? echo($thename); ?> information, ${lc_nameMessageBoard}, and ${lc_nameWall}.</p>
		</dd>

	</dl>

	<div class="buttons">
		<input class="btn" type="reset" value="Reset"/>
		<input class="btn btn-round action" type="submit" value="Submit"/>
	</div>

	</div>

    <!-- ----- |  @end Edit Form  | ----- -->

</fieldset></form>
