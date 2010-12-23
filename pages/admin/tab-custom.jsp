<div class="tabs tabs-sub tabs-round clearfix" id="tabs-customizations"><ul><?

	// Update the selected tab
	$subpage = $pageContext->evaluateTemplateText('${' . c('QUERY_KEY_TASK') . '}');
	$clsFont = $subpage === 'fonts' || ! $subpage ? 'selected' : '';
	$clsLogo = $subpage === 'logos' ? 'selected' : '';
	$clsThemes = $subpage === 'themes' ? 'selected' : '';
	$clsAdvanced = $subpage === 'adv' ? 'selected' : '';
	$clsProperties = $subpage === 'props' ? 'selected' : '';
	$subtabURL = 'admin.action?' . c('QUERY_KEY_PAGE') . '=custom&amp;' . c('QUERY_KEY_TASK') . '=';

	echo '<li class="first '.$clsFont.'"><a href="'.$subtabURL.'fonts">Fonts &amp; Colors</a></li>';
	echo '<li class="first '.$clsLogo.'"><a href="'.$subtabURL.'logos">Logos &amp; Icons</a></li>';
	echo '<li class="first '.$clsThemes.'"><a href="'.$subtabURL.'themes">Themes &amp; Backgrounds</a></li>';
	echo '<li class="first '.$clsAdvanced.'"><a href="'.$subtabURL.'adv">Advanced</a></li>';

?></ul></div>

<c:if test="${0 < customizationHistoryLength && task == 'adv'}">
<form action="adminSubmit.action" id="form-history" method="post"><fieldset class="panel squareTop">

	<h3>Last 5 Customizations: </h3>

	<p class="copy">You have made customizations to ${projectNameUC}. Clicking on any of these links will rollback your changes, added your current settings to the top-most position in the history queue:</p>

	<ol><c:forEach items="${customizationHistory}" var="obj">

		<?
			$obj = $pageContext->findAttribute('obj', null);
			$split = explode(DIRECTORY_SEPARATOR, $obj);
			$name = $split[(sizeof($split) - 1)];
			$display = preg_replace('/custom(\d+-\d+-\d+)_(\d+)-(\d+)-(\d+)\.css/', '$1 @ $2:$3:$4', $name);
			$url = 'adminSubmit.action?' . c('QUERY_KEY_TASK') . '=history&' . c('QUERY_KEY_PAGE') . '=C&' . c('QUERY_KEY_NAME') . '=' . $name;
		?>

		<li><a href="/<? echo($url); ?>">Revert to modification made on <? echo($display); ?></a>.</li>

	</c:forEach></ol>

</fieldset></form>
</c:if>

<c:if test="${'fonts' == task || ! task}">
<form action="adminSubmit.action" id="form-custom-color" method="post"><fieldset class="panel squareTop">

	<?
		$c = $pageContext->findAttribute('customization', null);
		$colorBg = $c['colorBg'];
		$colorHd1 = $c['colorHd1'];
		$colorHd2 = $c['colorHd2'];
		$colorHd3 = $c['colorHd3'];
		$colorHd4 = $c['colorHd4'];
		$colorLabel = $c['colorLabel'];
		$colorLink = $c['colorLink'];
		$colorText = $c['colorText'];
		$colorVisited = $c['colorVisited'];
	?>

	<h3>Customize Site Colors</h3>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="color" />

	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

	<p class="copy">Use this form to update site colors. Colors are in hexidecimal format where the (r, g, b) ranges from 00 to FF (255). For example, full red would be FF0000, full green is 00FF00, and purple would be 990099:</p>

	<ol>

		<li>
			<label for="custom-color-1">Background:
				<input class="txt" id="custom-color-1" maxlength="6" name="<? echo(c('QUERY_KEY_COLOR_BG')); ?>" type="text" value="<? echo($colorBg); ?>"/>
                <strong class="swatch" style="background:#<? echo($colorBg); ?>"></strong>
                <a class="paintIcon" href="#"><img alt="palette icon" src="/assets/images/icons/paint.png"/></a>
            </label>
		</li>

		<li>
			<label for="custom-color-2">Headers - Site:
				<input class="txt" id="custom-color-2" maxlength="6" name="<? echo(c('QUERY_KEY_COLOR_HD')); ?>1" type="text" value="<? echo($colorHd1); ?>" />
                <strong class="swatch" style="background:#<? echo($colorHd1); ?>"></strong>
                <a class="paintIcon" href="#"><img alt="palette icon" src="/assets/images/icons/paint.png"/></a>
            </label>
		</li>

		<li>
			<label for="custom-color-4">Headers - Sections:
				<input class="txt" id="custom-color-4" maxlength="6" name="<? echo(c('QUERY_KEY_COLOR_HD')); ?>3" type="text" value="<? echo($colorHd3); ?>" />
                <strong class="swatch" style="background:#<? echo($colorHd3); ?>"></strong>
                <a class="paintIcon" href="#"><img alt="palette icon" src="/assets/images/icons/paint.png"/></a>
            </label>
		</li>

		<li>
			<label for="custom-color-6">Labels:
				<input class="txt" id="custom-color-6" maxlength="6" name="<? echo(c('QUERY_KEY_COLOR_LABEL')); ?>" type="text" value="<? echo($colorLabel); ?>" />
                <strong class="swatch" style="background:#<? echo($colorLabel); ?>"></strong>
                <a class="paintIcon" href="#"><img alt="palette icon" src="/assets/images/icons/paint.png"/></a>
            </label>
		</li>

		<li>
			<label for="custom-color-7">Links:
				<input class="txt" id="custom-color-7" maxlength="6" name="<? echo(c('QUERY_KEY_COLOR_LINK')); ?>" type="text" value="<? echo($colorLink); ?>" />
                <strong class="swatch" style="background:#<? echo($colorLink); ?>"></strong>
                <a class="paintIcon" href="#"><img alt="palette icon" src="/assets/images/icons/paint.png"/></a>
            </label>
		</li>

		<li>
			<label for="custom-color-9">Links - Visited:
				<input class="txt" id="custom-color-9" maxlength="9" name="<? echo(c('QUERY_KEY_COLOR_VISITED')); ?>" type="text" value="<? echo($colorVisited); ?>" />
                <strong class="swatch" style="background:#<? echo($colorVisited); ?>"></strong>
                <a class="paintIcon" href="#"><img alt="palette icon" src="/assets/images/icons/paint.png"/></a>
            </label>
		</li>

		<li>
			<label for="custom-color-3">Subheader - Site:
				<input class="txt" id="custom-color-3" maxlength="6" name="<? echo(c('QUERY_KEY_COLOR_HD')); ?>2" type="text" value="<? echo($colorHd2); ?>" />
                <strong class="swatch" style="background:#<? echo($colorHd2); ?>"></strong>
                <a class="paintIcon" href="#"><img alt="palette icon" src="/assets/images/icons/paint.png"/></a>
            </label>
		</li>

		<li>
			<label for="custom-color-5">Subheader - Sections:
				<input class="txt" id="custom-color-5" maxlength="6" name="<? echo(c('QUERY_KEY_COLOR_HD')); ?>4" type="text" value="<? echo($colorHd4); ?>" />
                <strong class="swatch" style="background:#<? echo($colorHd4); ?>"></strong>
                <a class="paintIcon" href="#"><img alt="palette icon" src="/assets/images/icons/paint.png"/></a>
            </label>
		</li>

		<li>
			<label for="custom-color-8">Text:
				<input class="txt" id="custom-color-8" maxlength="6" name="<? echo(c('QUERY_KEY_COLOR_TEXT')); ?>" type="text" value="<? echo($colorText); ?>" />
                <strong class="swatch" style="background:#<? echo($colorText); ?>"></strong>
                <a class="paintIcon" href="#"><img alt="palette icon" src="/assets/images/icons/paint.png"/></a>
            </label>
		</li>

	</ol>

    <div class="buttons"><input type="submit" class="btn btn-round" value=" Post "/></div>

</fieldset></form>

<form action="adminSubmit.action" id="form-custom-font" method="post"><fieldset class="panel">

	<h3>Choose Your Site's Font</h3>

	<p class="copy">Coming soon.</p>
</fieldset></form>
</c:if>

<c:if test="${'logos' == task}">
<form action="adminSubmit.action" enctype="multipart/form-data" id="form-custom-logo" method="post"><fieldset class="panel squareTop">

	<?
		$c = $pageContext->findAttribute('customization', null);
	?>

	<h3>Customize Logo and Favicon</h3>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="logo" />

	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

	<p class="copy">Use this form to update site logos. The main logo should be no larger than 200x35px and the favicon must be a 16x16px "ico" file:</p>

	<ol>

		<li class="ckbx">
			<label for="custom-banner">
				<input ${checkedUseBanner} class="chkbox" id="custom-banner" name="<? echo(c('QK_USE_BANNER')); ?>" type="checkbox" value="T"/>
				<span>Use Banner Logo Layout</span>
            </label>
			<small>Turn this on if your logo is wider than 50% of the header.</small>
		</li>

		<li>
			<label for="custom-logo">Logo Image (200x35px):
				<input id="custom-logo" name="<? echo(c('QUERY_KEY_LOGO')); ?>" type="file" /></label>
		</li>

		<li>
			<label for="custom-icon">Favicon Image (16x16px):
				<input id="custom-icon" name="<? echo(c('QUERY_KEY_FAVICON')); ?>" type="file" /></label>
		</li>

	</ol>\

	<div class="buttons"><input type="submit" class="btn btn-round" value=" Post "/></div>

</fieldset></form>
</c:if>

<c:if test="${'themes' == task}">
<form action="adminSubmit.action" enctype="multipart/form-data" id="form-custom" method="post"><fieldset class="panel squareTop">

	<h3>Customize Background Image</h3>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="themes" />

	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

	<p class="copy">Use this form to update the background image. Please choose one of the following 2 designs. You may upload an image (gif, jpg, or png) instead of using the default:</p>

	<ol>

		<li>
			<label for="custom-bg-1">Elastic Background:
				<input checked="true" id="custom-bg-1" name="<? echo(c('QUERY_KEY_BGTYPE')); ?>" type="radio" value="1"/></label>
			<a class="help" href="#" id="help-bg-elastic">[?]</a>
		</li>

		<li>
			<label for="custom-bg-2">Fixed Background:
				<input id="custom-bg-2" name="<? echo(c('QUERY_KEY_BGTYPE')); ?>" type="radio" value="2" /></label>
			<a class="help" href="#" id="help-bg-fixed">[?]</a>
		</li>

		<li class="hr">
			<label for="custom-ds-1">Default Design:
				<input checked="true" id="custom-ds-1" name="<? echo(c('QUERY_KEY_DESIGN')); ?>" type="radio" value="T" /></label>
			<a class="help" href="#" id="help-ds-default">[?]</a>
		</li>

		<li>
			<label for="custom-ds-2">Upload Custom Background:
				<input id="custom-ds-2" name="<? echo(c('QUERY_KEY_DESIGN')); ?>" type="radio" value="F" /></label>
		</li>

		<li class="hr displayNone">
			<label for="custom-ds-2B">Upload Image: <input id="custom-ds-2B" name="<? echo(c('QUERY_KEY_FILE')); ?>" type="file" /></label>
			<a class="help" href="#" id="help-ds-custom">[?]</a>
		</li>

	</ol>

	<div class="buttons"><input type="submit" class="btn btn-round" value=" Post "/></div>

</fieldset></form>

<form action="adminSubmit.action" id="form-custom-theme" method="post"><fieldset class="panel">

	<h3>Choose Your Site's Theme</h3>

	<p class="copy">Coming soon.</p>
</fieldset></form>
</c:if>

<c:if test="${'adv' == task}">
<form action="adminSubmit.action" enctype="multipart/form-data" id="form-manage" method="post"><fieldset class="panel squareTop">

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="adv" />

	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

    <h3>Manage Your Styles Manually</h3>

    <p class="copy">Download ${projectNameUC} styles to your computer so that you may edit them or save them as a backup. Use the upload button to restore ${projectNameUC} to your local copy.</p>

    <ol>

        <li><label><a href="/download.action?task=custom">Download ${projectNameUC} styles</a></label></li>

        <li><label>Upload a backup "custom.css" <input name="<? echo(c('QUERY_KEY_BACKUP')); ?>" type="file"/></label></li>

    </ol>

	<div class="buttons"><input type="submit" class="btn btn-round" value=" Upload "/></div>

</fieldset></form>
</c:if>

<div class="layer" id="layer_ColorPicker" style="visibility: hidden">

    <div id="container_ColorPicker"></div>

    <div id="buttons_ColorPicker" class="buttons">
        <input class="btn btn-round" type="button" value=" Save "/>
        <input class="btn" type="button" value=" Cancel "/>
    </div>
</div>