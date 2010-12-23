<form action="profileUpdate.action" class="profile-edit editor" method="post"><fieldset>
	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="basic" />
	<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${o.key}" />

    <?
        $o = $pageContext->findAttribute('o', null);
    ?>

    <!-- ----- |  @group Validators  | ----- -->

	<input class="validator" name="about-validator" type="hidden" value="blur||Editor.stripTags||" />
	<input class="validator" name="about-validator" type="hidden" value="keypress||Editor.isCharLen1500||(max 1,500 characters)" />
	<input class="validator" name="interests-validator" type="hidden" value="blur||Editor.stripTags||" />
	<input class="validator" name="interests-validator" type="hidden" value="keypress||Editor.isCharLen1500||(max 1,500 characters)" />
	<input class="validator" name="month-validator" type="hidden"
		   value="blur||Editor.areSiblingFieldsSet||Please complete, choose a month, day, and year" />
	<input class="validator" name="day-validator" type="hidden"
		   value="blur||Editor.areSiblingFieldsSet||Please complete, choose a month, day, and year" />
	<input class="validator" name="year-validator" type="hidden"
		   value="blur||Editor.areSiblingFieldsSet||Please complete, choose a month, day, and year" />
	<input class="validator" name="hcountry-validator" type="hidden" value="change||Editor.toggleState||" />
	<input class="autocomplete" name="hcity-validator" type="hidden" value="autocomplete.action?t=city" />

	<!-- ----- |  @end Validators  | ----- -->

	<!-- ----- |  @group Edit Form  | ----- -->

    <dl class="clearfix">

        <? if ($o->isUser()) { ?>
        <dt><label for="<? echo(c('QUERY_KEY_GENDER')); ?>">Gender:</label></dt>
        <dd class="timespan"><?
            echo(HtmlHelper::genderOptionTag($o->getProfile()->getGender(), array('cls'=>'select', 'id'=>c('QUERY_KEY_GENDER'), 'name'=>c('QUERY_KEY_GENDER'))));
        ?></dd>
        
        <dt><label for="<? echo(c('QUERY_KEY_MONTH')); ?>">Birthday:</label></dt>
        <dd class="timespan"><?
            echo(HtmlHelper::monthOptionTag($o->getProfile()->getFormattedDob('m'), array('cls'=>'select', 'id'=>c('QUERY_KEY_MONTH'), 'name'=>c('QUERY_KEY_MONTH'))));
            echo(HtmlHelper::dayOptionTag($o->getProfile()->getDobDay(), array('cls'=>'select', 'name'=>c('QUERY_KEY_DAY'))));
            echo(HtmlHelper::yearOptionTag(100, 13, $o->getProfile()->getDobYear(), array('cls'=>'select', 'name'=>c('QUERY_KEY_YEAR'))));
        ?></dd>

        <dt><label for="<? echo('h' . c('QUERY_KEY_CITY')); ?>">Hometown:</label></dt>
        <dd><input class="txt autocomplete" id="<? echo('h' . c('QUERY_KEY_CITY')); ?>" name="<? echo('h' . c('QUERY_KEY_CITY')); ?>"
				   title="<? echo(c('autocompleteTitle')); ?>" type="text" value="${o.profile.hometownCity}" /></dd>

		<?
			$isUs = 229 == $o->getProfile()->getHometownCountryId();
		?>

        <dt><label for="<? echo('h' . c('QUERY_KEY_COUNTRY')); ?>">Country:</label></dt>
        <dd class="country"><?
            echo(HtmlHelper::countryOptionTag($o->getProfile()->getHometownCountryId(),
                 array('cls'=>'select country', 'id'=>'h' . c('QUERY_KEY_COUNTRY'), 'name'=>'h' . c('QUERY_KEY_COUNTRY'))));
            echo(HtmlHelper::stateOptionTag($o->getProfile()->getHometownStateId(), array('cls'=>'select',
                 'name'=>'h' . c('QUERY_KEY_STATE'), 'style'=>($isUs? '': 'display: none;'))));
        ?></dd>
        <? } ?>

        <? if ($o->isGroup()) { ?>
        <dt><label for="<? echo(c('QUERY_KEY_CATEGORY')); ?>">Category: <small>(required)</small></label></dt>
        <dd><?
            $aUser =& $pageContext->findAttribute('aUser', null);
            echo(HtmlHelper::selectTag($o->getCategories($aUser->getNetworkId()), $o->getCategoryId(),
                                    array('cls' => 'select', 'id' => c('QUERY_KEY_CATEGORY'), 'name' => c('QUERY_KEY_CATEGORY')), array(), false));
        ?></dd>

        <dt><label for="<? echo(c('QUERY_KEY_NAME')); ?>">Group Name: <small>(required)</small></label></dt>
        <dd><input class="txt" id="<? echo(c('QUERY_KEY_NAME')); ?>" name="<? echo(c('QUERY_KEY_NAME')); ?>"
                   title="" type="text" value="${o.name}"/></dd>
        <? } ?>

        <dt><label for="<? echo(c('QUERY_KEY_DESCRIPTION')); ?>"><? echo($o->isGroup() ? 'Description' : 'About Me'); ?>:</label></dt>
        <dd><textarea class="textarea" cols="30" id="<? echo(c('QUERY_KEY_DESCRIPTION')); ?>" name="<? echo(c('QUERY_KEY_DESCRIPTION')); ?>" rows="5"
				      title="Write a short, free-form description about yourself.">${o.profile.description}</textarea></dd>

        <? if ($o->isUser()) { ?>
        <dt><label for="<? echo(c('QUERY_KEY_INTERESTS')); ?>">Interests &amp; Hobbies:</label></dt>
        <dd><textarea class="textarea" cols="30" id="<? echo(c('QUERY_KEY_INTERESTS')); ?>" name="<? echo(c('QUERY_KEY_INTERESTS')); ?>" rows="5"
					  title="This is a place to list websites about you (seperate by comma or 'enter').">${o.profile.interests}</textarea></dd>
        <? } ?>

        <dt>&nbsp;</dt><dd class="divider">&nbsp;</dd>

        <?
            $hasMessageBoard = $pageContext->evaluateTemplateText('${' . c('QK_HAS_MESSAGE_BOARD') . '}');
            $hasRelated = $pageContext->evaluateTemplateText('${' . c('QK_HAS_RELATED') . '}');
            $hasWall = $pageContext->evaluateTemplateText('${' . c('QK_HAS_WALL') . '}');

            if ($hasMessageBoard || $hasRelated || $hasWall) {
        ?>
        <dt><label for="<? echo(c('QUERY_KEY_RELATED')); ?>">Features:</label></dt>
        <dd>
            <?
                $chkMB = $o->hasMessageBoard() ? 'checked="checked"' : '';
                $chkRelated = $o->hasRelated() ? 'checked="checked"' : '';
                $chkWall = $o->hasWall() ? 'checked="checked"' : '';

                $chkMBPublic = $o->isMessageBoardPublic() ? 'checked="checked"' : '';
                $chkRelatedPublic = $o->isRelatedPublic() ? 'checked="checked"' : '';
                $chkWallPublic = $o->isWallPublic() ? 'checked="checked"' : '';

                $visMBPublic = $o->hasMessageBoard() ? '' : 'style="visibility:hidden;"';
                $visRelatedPublic = $o->hasRelated() ? '' : 'style="visibility:hidden;"';
                $visWallPublic = $o->hasWall() ? '' : 'style="visibility:hidden;"';
            ?>

            <? if ($hasRelated) { ?>
            <p><input <? echo($chkRelated); ?> id="<? echo(c('QUERY_KEY_RELATED')); ?>" name="<? echo(c('QUERY_KEY_RELATED')); ?>"
                type="checkbox" /> <label for="<? echo(c('QUERY_KEY_RELATED')); ?>">Show ${lc_nameRelated} ${o.type}s.</label></p>
            <p class="indent" <? echo($visRelatedPublic); ?> ><input <? echo($chkRelatedPublic); ?> id="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_RELATED')); ?>"
                name="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_RELATED')); ?>" type="checkbox" /><label for="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_RELATED')); ?>"><small>Non-${o.memberString}s can see the ${lc_nameRelated} ${o.type}s.</small></label></p>
            <? } ?>

            <? if ($hasMessageBoard) { ?>
            <p><input <? echo($chkMB); ?> id="<? echo(c('QUERY_KEY_MESSAGE_BOARD')); ?>" name="<? echo(c('QUERY_KEY_MESSAGE_BOARD')); ?>"
                type="checkbox" /> <label for="<? echo(c('QUERY_KEY_MESSAGE_BOARD')); ?>">Enable ${lc_nameMessageBoard}.</label></p>
            <p class="indent" <? echo($visMBPublic); ?> ><input <? echo($chkMBPublic); ?> id="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_MESSAGE_BOARD')); ?>"
                name="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_MESSAGE_BOARD')); ?>" type="checkbox" /><label for="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_MESSAGE_BOARD')); ?>"><small>Non-${o.memberString}s can use the ${lc_nameMessageBoard}.</small></label></p>
            <? } ?>

            <? if ($hasWall) { ?>
            <p><input <? echo($chkWall); ?> id="<? echo(c('QUERY_KEY_WALL')); ?>" name="<? echo(c('QUERY_KEY_WALL')); ?>"
                type="checkbox" /> <label for="<? echo(c('QUERY_KEY_WALL')); ?>">Enable ${lc_nameWall}.</label></p>
            <p class="indent" <? echo($visWallPublic); ?> ><input <? echo($chkWallPublic); ?> id="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_WALL')); ?>"
                name="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_WALL')); ?>" type="checkbox" /><label for="<? echo(c('QUERY_KEY_ACCESS')); ?><? echo(c('QUERY_KEY_WALL')); ?>"><small>Non-${o.memberString}s can use the ${lc_nameWall}.</small></label></p>
            <? } ?>
        </dd>
        <? } ?>

        <? if ($o->isGroup()) { ?>

        <dt><label for="<? echo(c('QUERY_KEY_ACCESS')); ?>-open">Group Access:</label></dt>
        <dd>
            <?
                $chkOpen = $o->isOpen() ? 'checked="checked"' : '';
                $chkClosed = $o->isClosed() ? 'checked="checked"' : '';
                $chkPrivate = $o->isPrivate() ? 'checked="checked"' : '';
            ?>
            <p><input <? echo($chkOpen); ?> id="<? echo(c('QUERY_KEY_ACCESS')); ?>-open" name="<? echo(c('QUERY_KEY_ACCESS')); ?>" type="radio" value="O" />
                <label for="<? echo(c('QUERY_KEY_ACCESS')); ?>-open">This ${lc_nameGroup} is open.</label></p>
            <p class="copy">Anyone can join and invite others to join. Anyone can see the ${lc_nameGroup} information, the ${lc_nameMessageBoard} and the ${lc_nameWall}.</p>
            <p><input  <? echo($chkClosed); ?> id="<? echo(c('QUERY_KEY_ACCESS')); ?>-closed" name="<? echo(c('QUERY_KEY_ACCESS')); ?>" type="radio" value="C" />
                <label for="<? echo(c('QUERY_KEY_ACCESS')); ?>-closed">This ${lc_nameGroup} is closed.</label></p>
            <p class="copy">Administrative approval is required for new ${lc_nameMembers} to join. Anyone can see the ${lc_nameGroup} information,
                but only ${lc_nameMembers} can see the ${lc_nameMessageBoard} and the ${lc_nameWall}.</p>
            <p><input  <? echo($chkPrivate); ?> id="<? echo(c('QUERY_KEY_ACCESS')); ?>-private" name="<? echo(c('QUERY_KEY_ACCESS')); ?>" type="radio" value="P" />
                <label for="<? echo(c('QUERY_KEY_ACCESS')); ?>-private">This ${lc_nameGroup} is secret.</label></p>
            <p class="copy">The ${lc_nameGroup} will not appear in search results or in the profiles of its ${lc_nameMembers}. ${nameMembers} must be invited,
                and only ${lc_nameMembers} can see the ${lc_nameGroup} information, the ${lc_nameMessageBoard}, and the ${lc_nameWall}.</p>
        </dd>
        <? } ?>

    </dl>

    <div class="buttons">
        <input class="btn" type="submit" value="Cancel"/>
        <input class="btn action" type="submit" value="Submit"/>
    </div>

    <!-- ----- |  @end Edit Form  | ----- -->

</fieldset></form>
