<form action="/profileSubmit.action" class="profile-edit editor portrait borderTop" enctype="multipart/form-data" method="post"><fieldset>
	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="portrait" />
	<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${S.key}" />

    <?
        $S = $pageContext->findAttribute('S', null);
    ?>   

    <!-- ----- |  @group Validators  | ----- -->

	<!-- ----- |  @end Validators  | ----- -->

	<!-- ----- |  @group Edit Form  | ----- -->

    <dl class="clearfix">

        <dt> </dt>
        <dd>
            <h3>Upload an Image: </h3>
            <p>File size is limited to 2 MB. If your upload does not work, try a smaller picture.</p>
			<p><input class="chk" id="<? echo(c('QK_AGREE')); ?>" name="<? echo(c('QK_AGREE')); ?>" type="checkbox" value="on"/>
			<label for="<? echo(c('QK_AGREE')); ?>">I certify that I have the right to distribute this picture and that it is not pornography.</label></p>
			You can upload a JPG, GIF or PNG file (images 200 x 250 pixels work best).
			<p><input class="input-file" name="<? echo(c('QK_PIC')); ?>" size="30" type="file" /></p>
        </dd>
	</dl>

	<div class="buttons"><input class="btn btn-round action" type="submit" value="Upload" /></div><?

	$widget = $pageContext->findAttribute(c('MN_WIDGET'), null);
	$fields = $widget->getFields();
	$image = $fields[0]->getValue();
	$thumb = '/assets' . $fields[1]->getValue();

	if (! $image) {$image = $S->isUser() ? c('defaultUserImageUri') : c('defaultGroupImageUri');}
	if (! $thumb) {$image = $S->isUser() ? c('defaultUserThumbUri') : c('defaultGroupThumbUri');}

	// this is not a default value
	if (! (c('defaultGroupImageUri') === $image || c('defaultUserImageUri') === $image)) {

	?><dl>
        <dt> </dt>
        <dd>
            <h3>Remove Your Picture: </h3>
			<img alt="<? echo($S->getName()); ?>'s thumbnail" src="<? echo($thumb); ?>" />
			You can remove this picture, but be sure to upload another or we will display a question mark in its place.
        </dd>

    </dl>

	<div class="buttons"><input name="<? echo(c('QK_REMOVE')); ?>" type="submit" value=" Remove Picture " /></div>

	<? } ?>

    <!-- ----- |  @end Edit Form  | ----- -->

</fieldset></form>