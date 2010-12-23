<div class="tabs tabs-sub tabs-round clearfix" id="tabs-config"><ul><?

	// Update the selected tab
	$subpage = $pageContext->evaluateTemplateText('${' . c('QUERY_KEY_TASK') . '}');
	$clsProfanity = $subpage === 'profanity' || ! $subpage ? 'selected' : '';
	$clsConfig = $subpage === 'configuration' ? 'selected' : '';
	$clsName = $subpage === 'nameProject' ? 'selected' : '';
	$clsModules = $subpage === 'modules' ? 'selected' : '';
	$clsModuleNames = $subpage === 'nameModules' ? 'selected' : '';
	$subtabURL = 'admin.action?' . c('QUERY_KEY_PAGE') . '=config&amp;' . c('QUERY_KEY_TASK') . '=';

	echo '<li class="first '.$clsName.'"><a href="'.$subtabURL.'nameProject">Project Name</a></li>';
	echo '<li class="'.$clsConfig.'"><a href="'.$subtabURL.'configuration">Configuration</a></li>';
	echo '<li class="'.$clsModules.'"><a href="'.$subtabURL.'modules">Features</a></li>';
	echo '<li class="'.$clsModuleNames.'"><a href="'.$subtabURL.'nameModules">Feature Names</a></li>';
	echo '<li class="last '.$clsProfanity.'"><a href="'.$subtabURL.'profanity">Profanity Filter</a></li>';

?></ul></div>

<c:if test="${'profanity' == task}">
<form action="adminSubmit.action" id="form-profanity" method="post"><fieldset class="panel squareTop">

	<h4>Restricted Words Filter</h4>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="profanity" />
	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

	<p class="copy">This Form contains a list of all the words that we automatically remove from user submitted data.
		Many customers use this to restrict profane language.
		The list may contain offensive language and therefore hidden from view.
		Use the following link to edit the restricted word list. <a href="javascript:void(null);" id="profanity-link">Show the restricted word list</a>.</p>

	<?
		$profanity = str_replace('\b', '', c('profanity'));
		$profanity = str_replace('/', '', $profanity);
		$profanity = str_replace('|', '
', $profanity);
	?>
	<div><textarea class="displayNone" cols="10" id="profanity-textarea" name="profanity" rows="20"><? echo($profanity); ?></textarea></div>

	<div class="buttons"><input class="btn btn-round" type="submit" value=" Update Words! " /></div>

</fieldset></form>
</c:if>

<c:if test="${'configuration' == task}">
<form action="adminSubmit.action" id="form-configuration" method="post"><fieldset class="panel squareTop">

	<h4>Configuration</h4>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="configuration" />
	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

	<p class="copy">This Form contains a list of site-wide configuration parameters.</p>

	<ol>

		<li class="input">
			<label for="form-configuration-help">
				<span class="label">Footer - Help URL</span>
				<input class="txt" id="form-configuration-help" name="<? echo(c('QK_HELP_HREF')); ?>" type="text" value="${helpHref}"/>
            </label>
			<small>Most administrators either use the FAQ or an external forum.</small>
		</li>

		<li class="input">
			<label for="form-configuration-contactEmail">
				<span class="label">Footer - Contact Email</span>
				<input class="txt" id="form-configuration-contactEmail" name="<? echo(c('QK_CONTACT_EMAIL')); ?>" type="text" value="${contactEmail}"/>
            </label>
		</li>

	</ol>

	<div class="buttons"><input class="btn btn-round" type="submit" value=" Update Configuration! " /></div>

</fieldset></form>
</c:if>

<c:if test="${'nameProject' == task}">
<form action="adminSubmit.action" id="form-properties" method="post"><fieldset class="panel squareTop">

	<h4>Change Site Name</h4>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="nameProject" />
	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

	<p class="copy">Use this form to rename the project.</p>

	<ol>

		<li>
			<label for="property-projectName">Project Name:
				<input class="txt" id="property-projectName" maxlength="24" name="<? echo(c('QUERY_KEY_NAME')); ?>" type="text" value="${projectNameUC}"/>
            </label>
		</li>

    </ol>

    <div class="buttons"><input type="submit" class="btn btn-round" value=" Update Name "/></div>

</fieldset></form>
</c:if>

<c:if test="${'modules' == task}">
	<form action="adminSubmit.action" id="form-features" method="post"><fieldset class="panel squareTop">

	<h4>Configure Installed Features</h4>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="modules" />
	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

	<p class="copy">Use this form to activate site-wide features and content. Below is a list of content type, followed by features that have been installed.</p>

	<ol>

		<?
			$checkedModules = $pageContext->findAttribute(c('MN_CHECKED_MODULES'), true);
			$checkedSearchables = $pageContext->findAttribute(c('MN_CHECKED_SEARCHABLES'), true);

			foreach ($checkedSearchables as $type=>$state) {
				$id = "feature-$type";
				$name = "has$type";
				$state = $state ? 'checked="checked"' : '';
				echo '<li><label for="' . $id . '">';
				echo '<input class="chkbox searchable" id="' . $id . '" name="' . $name . '" type="checkbox" value="T" ' . $state . '/>';
				echo '<b>Activate ' . ucfirst($type) . ' content type</b>';
				echo '</label></li>';
			}

			echo '<li></li>';

			$checkedSearchables['general'] = true;
			$checkedSearchables['user'] = true;

			foreach ($checkedModules as $module=>$states) {
				$ucname = ucfirst($module);
				$hasModule = $states['general'];

				foreach ($states as $type=>$state) {
					$id = "feature-$module-$type";
					$name = "has$module$type";
					$klass = 'general' == $type ? '' : 'sub';
					if (! ($checkedSearchables[$type] && $hasModule) && $klass) {$klass .= ' displayNone';}
					$state = $state ? 'checked="checked"' : '';
					$text = 'general' == $type ? "Activate $ucname feature" : "Activate $ucname feature for " . ucfirst(str_pluralize($type));
					echo '<li class="' . $klass . '"><label for="' . $id . '">';
					echo '<input class="chkbox ' . $type . '" id="' . $id . '" name="' . $name . '" type="checkbox" value="T" ' . $state . '/>';
					echo '<b>' . $text . '</b>';
					echo '</label></li>';
				}
			}

		?>

    </ol>

    <div class="buttons"><input type="submit" class="btn btn-round" value=" Update Features "/></div>

</fieldset></form>
</c:if>

<c:if test="${'nameModules' == task}">
<form action="adminSubmit.action" id="form-rename" method="post"><fieldset class="panel squareTop">

	<h4>Rename Installed Features</h4>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="nameModules" />
	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

	<p class="copy">${projectNameUC} comes with many powerful features. We have named each of them as generally as possible.
        However, as you customize your site, you may think of more meaningful names. Use this form to update the
        names of site-wide features to better fit your needs.</p>

    <p class="note">Keep in mind that all names should be singular (if possible) and no longer than 32 characters.</p>

    <ol>

        <li>
            <label for="feature-name-friend">Friend</label>
            <input class="txt" id="feature-name-friend" maxlength="32" name="<? echo(c('QK_FRIEND')); ?>" type="text" value="${lc_nameFriend}" />
            <div class="small">A Friend is the term for when users link themselves to each other. Other common names for this feature are: 'teammate', 'contact', 'co-worker'.</div>
        </li>

        <li>
            <label for="feature-name-member">Member</label>
            <input class="txt" id="feature-name-member" maxlength="32" name="<? echo(c('QK_MEMBER')); ?>" type="text" value="${lc_nameMember}" />
            <div class="small">A Member is the term for when users link themselves to a Group. Another common name for this feature is 'affiliate'.</div>
        </li>

        <li>
            <label for="feature-name-message">Message</label>
            <input class="txt" id="feature-name-message" maxlength="32" name="<? echo(c('QK_MESSAGE')); ?>" type="text" value="${lc_nameMessage}" />
            <div class="small">A Message is the term for when users communicate with each other.</div>
        </li>

        <li>
            <label for="feature-name-messageBoard">Message Board</label>
            <input class="txt" id="feature-name-messageBoard" maxlength="32" name="<? echo(c('QK_MESSAGE_BOARD')); ?>" type="text" value="${lc_nameMessageBoard}" />
            <div class="small">The Message Board is a tool that can be enabled on profiles, so that users can have a public dialog about the profile or a related topic.
				Another common name for this feature is 'forum'.</div>
        </li>

        <li>
            <label for="feature-name-related">Related</label>
            <input class="txt" id="feature-name-related" maxlength="32" name="<? echo(c('QK_RELATED')); ?>" type="text" value="${lc_nameRelated}" />
            <div class="small">The Related is a tool that can be enabled on profiles, to show a small list of similar profiles.</div>
        </li>

        <li>
            <label for="feature-name-wall">Wall</label>
            <input class="txt" id="feature-name-wall" maxlength="32" name="<? echo(c('QK_WALL')); ?>" type="text" value="${lc_nameWall}" />
            <div class="small">The Wall is a tool that can be enabled on profiles, so that users can comment on the profile.
				Another common name for this feature is 'comments'.</div>
        </li>

    </ol>

    <ol><?
	$searchableTypes = Searchable::getValidTypes();
	foreach ($searchableTypes as $type) {
		$uctype = ucfirst($type);
		$lctype = $pageContext->evaluateTemplateText('${lc_name'.$uctype.'}');

		echo '<li>';
            echo '<label for="feature-name-'.$type.'">'.$uctype.'</label>';
            echo '<input class="txt" id="feature-name-'.$type.'" maxlength="32" name="'.$type.'" type="text" value="'.$lctype.'" />';

			switch ($type) {
				case Searchable::$TYPE_GROUP:
					echo '<div class="small">A Group is a way to organize users who share a common interest.';
					echo "Other common names for this feature are: 'orginazation', 'team', 'affiliation'.</div>";
				break;

				case Searchable::$TYPE_NETWORK:
					echo '<div class="small">A Network is a way to organize users and groups into common buckets.';
					echo "Other common names for this feature are: 'league', 'office', 'class'.</div>";
				break;

				default:
			}
        echo '</li>';
	}
    ?></ol>

    <div class="buttons"><input type="submit" class="btn btn-round" value=" Update Names "/></div>

</fieldset></form>
</c:if>