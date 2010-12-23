<form action="profileUpdate.action" class="profile-edit editor" method="post"><fieldset>
	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="contact" />
	<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${o.key}" />

    <?
		$o = $pageContext->findAttribute('o', null);
	?>

	<!-- ----- |  @group Validators  | ----- -->

	<input class="validator" name="mobile-validator" type="hidden"
		   value="blur||Editor.isPhone||Invalid phone number, try XXX-XXX-XXXX." />
	<input class="validator" name="phone-validator" type="hidden"
		   value="blur||Editor.isPhone||Invalid phone number, try XXX-XXX-XXXX." />
	<input class="validator" name="zipcode-validator" type="hidden"
		   value="blur||Editor.isZipcode||Invalid zipcode, try XXXXX or XXXXX-XXXX." />
	<input class="autocomplete" name="city-validator" type="hidden" value="autocomplete.action?t=city" />
	<input class="validator" name="website-validator" type="hidden" value="keypress||Editor.isCharLen1500||(max 1,500 characters)" />
	<input class="validator" name="website-validator" type="hidden" value="blur||Editor.stripTags||" />
	<input class="validator" name="country-validator" type="hidden" value="change||Editor.toggleState||" />

	<!-- ----- |  @end Validators  | ----- -->

	<!-- ----- |  @group Edit Form  | ----- -->

    <dl class="clearfix">

        <c:if test="${o.isUser}"><dt><label>Email:</label></dt>
        <dd>
            <img alt="email" id="email" src="<html:rewrite page="/assets"/>/images/emails/${o.key}.gif" />
            <br />
            <span><a class="change_email" href="account.action">Change Email</a></span>
        </dd></c:if>

        <c:if test="${o.isGroup}"><dt><label for="<? echo(c('QUERY_KEY_EMAIL')); ?>">Email</label></dt>
        <dd><input class="txt" id="<? echo(c('QUERY_KEY_EMAIL')); ?>" maxlength="255" name="<? echo(c('QUERY_KEY_EMAIL')); ?>"
                   title="Like admin@geekster.com" type="text" value="${o.email}"/></dd></c:if>

        <c:if test="${o.isUser}"><dt><label for="<? echo(c('QUERY_KEY_MOBILE')); ?>">Mobile:</label></dt>
        <dd><input class="txt" id="<? echo(c('QUERY_KEY_MOBILE')); ?>" maxlength="12" name="<? echo(c('QUERY_KEY_MOBILE')); ?>"
                   title="Use XXX-XXX-XXXX or (XXX) XXX-XXXX" type="text" value="${o.profile.formattedMobile}"/></dd></c:if>

        <dt><label for="<? echo(c('QUERY_KEY_PHONE')); ?>">Phone:</label></dt>
        <dd><input class="txt" id="<? echo(c('QUERY_KEY_PHONE')); ?>" maxlength="12" name="<? echo(c('QUERY_KEY_PHONE')); ?>"
                   title="Use XXX-XXX-XXXX or (XXX) XXX-XXXX" type="text" value="${o.profile.formattedPhone}"/></dd>

        <dt>&nbsp;</dt><dd class="divider">&nbsp;</dd>

        <c:if test="${o.isGroup}"><dt><label for="<? echo(c('QUERY_KEY_OFFICE')); ?>">Office:</label></dt>
        <dd><input class="txt" id="<? echo(c('QUERY_KEY_OFFICE')); ?>" maxlength="255" name="<? echo(c('QUERY_KEY_OFFICE')); ?>"
                   title="" type="text" value="${o.profile.office}"/></dd></c:if>

        <dt><label for="<? echo(c('QUERY_KEY_ADDRESS')); ?>">Address:</label></dt>
        <dd><input class="txt" id="<? echo(c('QUERY_KEY_ADDRESS')); ?>" maxlength="100" name="<? echo(c('QUERY_KEY_ADDRESS')); ?>"
                   title="" type="text" value="${o.profile.address}"/></dd>

        <dt><label for="<? echo(c('QUERY_KEY_CITY')); ?>">City:</label></dt>
        <dd><input class="txt" id="<? echo(c('QUERY_KEY_CITY')); ?>" maxlength="64" name="<? echo(c('QUERY_KEY_CITY')); ?>"
                   title="<? echo(c('autocompleteTitle')); ?>" type="text" value="${o.profile.city}"/></dd>

		<?
			$isUs = 229 === $o->getProfile()->getCountryId();
		?>

        <dt><label for="<? echo(c('QUERY_KEY_COUNTRY')); ?>">Country:</label></dt>
        <dd class="country"><?
            echo(HtmlHelper::countryOptionTag($o->getProfile()->getCountryId(),
                 array('cls'=>'select country', 'id'=>c('QUERY_KEY_COUNTRY'), 'name'=>c('QUERY_KEY_COUNTRY'))));
            echo(HtmlHelper::stateOptionTag($o->getProfile()->getStateId(), array('cls'=>'select',
                 'name'=>c('QUERY_KEY_STATE'), 'style'=>($isUs? '': 'display: none;'))));
        ?></dd>

        <dt><label for="<? echo(c('QUERY_KEY_ZIPCODE')); ?>">Zipcode:</label></dt>
        <dd><input class="txt" id="<? echo(c('QUERY_KEY_ZIPCODE')); ?>" maxlength="10" name="<? echo(c('QUERY_KEY_ZIPCODE')); ?>"
                   title="Use 12345 or 12345-6789" type="text" value="${o.profile.zipcode}"/></dd>

        <dt>&nbsp;</dt><dd class="divider">&nbsp;</dd>

        <dt><label for="<? echo(c('QUERY_KEY_WEBSITE')); ?>">Website:</label></dt>
        <dd><textarea class="textarea" cols="30" id="<? echo(c('QUERY_KEY_WEBSITE')); ?>" name="<? echo(c('QUERY_KEY_WEBSITE')); ?>" rows="5"
					  title="This is a place to list websites about you (seperate by comma or 'enter').">${o.profile.website}</textarea></dd>

    </dl>

    <div class="buttons">
        <input class="btn" type="submit" value="Cancel"/>
        <input class="btn action" type="submit" value="Submit"/>
    </div>

	<!-- ----- |  @end Edit Form  | ----- -->

</fieldset></form>
