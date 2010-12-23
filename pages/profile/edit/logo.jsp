<form action="profileUpdate.action" class="profile-edit editor" method="post" enctype="multipart/form-data"><fieldset>
	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="logo" />
	<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${o.key}" />

    <?
		$o = $pageContext->findAttribute('o', null);
	?>

	<!-- ----- |  @group Validators  | ----- -->
    

    <!-- ----- |  @end Validators  | ----- -->

	<!-- ----- |  @group Edit Form  | ----- -->

    <dl class="clearfix">

        <dt><label for="<? echo(c('QUERY_KEY_TITLE')); ?>">Slogan:</label></dt>
        <dd>
            <input class="txt" id="<? echo(c('QUERY_KEY_TITLE')); ?>" name="<? echo(c('QUERY_KEY_TITLE')); ?>"
                   title="" type="text" value="${o.profile.title}"/>
            <small class="label">Your slogan will appear next to your logo.</small>
        </dd>

        <dt><label for="<? echo(c('QUERY_KEY_LOGO')); ?>">Logo:</label></dt>
        <dd class="logo">
            <img alt="logo" src="<html:rewrite page="/assets" />${o.profile.logoUri}" /><br />
            <small class="label">Logos should be no wider than 300 pixels and no larger than 2mb.</small>
            <input class="input-file" id="<? echo(c('QUERY_KEY_LOGO')); ?>" name="<? echo(c('QUERY_KEY_LOGO')); ?>" type="file" value="" />
        </dd>

    </dl>

    <div class="buttons">
        <input class="btn" type="submit" value="Cancel"/>
        <input class="btn action" type="submit" value="Submit"/>
    </div>

	<!-- ----- |  @end Edit Form  | ----- -->

</fieldset></form>
