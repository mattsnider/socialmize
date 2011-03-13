<?
$S = $pageContext->findAttribute('S', null);

$typeName = $pageContext->evaluateTemplateText('${name' . ucfirst($S->getType()) . '}');
$projectNameUC = $pageContext->evaluateTemplateText('${projectNameUC}');
$lcnameFriends = $pageContext->evaluateTemplateText('${lc_nameFriends}');
$lcnameNetworks = $pageContext->evaluateTemplateText('${lc_nameNetworks}');
$lcnameNetwork = $pageContext->evaluateTemplateText('${lc_nameNetwork}');
$nameFriends = $pageContext->evaluateTemplateText('${nameFriends}');
$nameGroup = $pageContext->evaluateTemplateText('${nameGroup}');
$nameGroups = $pageContext->evaluateTemplateText('${nameGroups}');
$nameUsers = $pageContext->evaluateTemplateText('${nameUsers}');

$sName = $S->getName();
?>
<form action="updateSearchableMembers.action" method="post">
	<fieldset class="panel squareTop"><?

		echo '<a name="panel-members"></a>';

		echo '<h3>'.$typeName.' Members</h3>';

		if ($S->isGroup()) {

		if ($S->isAdmin()) {

		echo '<p class="copy">This is a list of all the active '.$nameUsers.' on '.$projectNameUC.'. ';
			echo 'As an administrator you can invite anyone to join <q>'.$sName.'</q>. Once invited they will have to accept your invitation.</p>';

		echo '<p class="copy">Those '.$nameUsers.' who are already members are checked, and will no longer be members if you uncheck them. ';
			echo 'Administrators and those '.$nameUsers.' who have pending invites for this '.$nameGroup.' are disabled.</p>';

		} else {

		echo '<p class="copy">This is a list of all your '.$nameFriends.'. ';
			echo 'By using the form below you can invite any of them to join <q>'.$sName.'</q>. Once invited they will have to accept your invitation.
		</p>';

		echo '<p class="copy">Your '.$nameFriends.' who are also members or have pending invites are already checked. ';
			}

			} else {
			echo '

		<p class="copy">'.$projectNameUC.' allows you to organize '.$nameGroups.' and '.$nameFriends.' into '.$lcnameNetworks.'. ';
			echo 'Below is a list of '.$nameGroups.' and '.$nameFriends.' in '.$projectNameUC.'. ';
			echo 'The checked ones are directly members of this '.$lcnameNetwork.'. ';
			echo 'The disabled ones are members of children '.$lcnameNetworks.' and '.$nameGroups.', and cannot be removed here.</p>';
		}

		?>

		<div class="content white">
			<div id="id_slist_members"></div>
		</div>

	</fieldset>
</form>