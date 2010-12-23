<div class="tabs tabs-sub tabs-round clearfix" id="tabs-config"><ul><?

	// Update the selected tab
	$subpage = $pageContext->evaluateTemplateText('${' . c('QUERY_KEY_TASK') . '}');
	$clsConfig = $subpage === 'configurationSignup' || ! $subpage ? 'selected' : '';
	$clsGeneral = $subpage === 'user' ? 'selected' : '';
	$clsGroup = $subpage === 'group' ? 'selected' : '';
	$clsPending = $subpage === 'pending' ? 'selected' : '';
	$clsNetwork = $subpage === 'network' ? 'selected' : '';
	$subtabURL = 'admin.action?' . c('QUERY_KEY_PAGE') . '=searchable&amp;' . c('QUERY_KEY_TASK') . '=';

	$nameUser = $pageContext->evaluateTemplateText('${nameUser}');
	$nameGroup = $pageContext->evaluateTemplateText('${nameGroup}');
	$nameNetwork = $pageContext->evaluateTemplateText('${nameNetwork}');

	echo '<li class="last '.$clsPending.'"><a href="'.$subtabURL.'pending">Pending Approval</a></li>';
	echo '<li class="'.$clsConfig.'"><a href="'.$subtabURL.'configurationSignup">Sign Up Config</a></li>';
	echo '<li class="'.$clsGeneral.'"><a href="'.$subtabURL.'user">Users</a></li>';
	echo '<li class="'.$clsGroup.'"><a href="'.$subtabURL.'group">Groups</a></li>';
	echo '<li class="first '.$clsNetwork.'"><a href="'.$subtabURL.'network">Networks</a></li>';

?></ul></div>

<c:if test="${'configurationSignup' == task}">
<form action="adminSubmit.action" id="form-configuration" method="post"><fieldset class="panel squareTop">

	<h4>User Sign Up Configuration</h4>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="configurationSignup" />
	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

	<p class="copy">This Form controls what restricts are placed upon the new user Sign Up process.</p>

	<ol>

		<li>
			<label for="admin-invite">
				<input ${checkedAdminInvite} class="chkbox" id="admin-invite" name="<? echo(c('QK_ADMIN_INVITE')); ?>" type="checkbox" value="T"/>
				<span>Only administrators can invite new users.</span>
            </label>
			<small>Activating this prevents users from inviting their friends.</small>
		</li>

		<li>
			<label for="require-registration">
				<input ${checkedRequireRegistration} class="chkbox" id="require-registration" name="<? echo(c('QK_REQUIRE_REGISTRATION')); ?>" type="checkbox" value="T"/>
				<span>Require Email Confirmation For New Users</span>
            </label>
			<small>An email will be sent to new users, which must be responded to before they can login.</small>
		</li>

		<li>
			<label for="require-confirmation">
				<input ${checkedRequireConfirm} class="chkbox" id="require-confirmation" name="<? echo(c('QK_REQUIRE_CONFIRM')); ?>" type="checkbox" value="T"/>
				<span>Require Admin Approval For New Users And Groups</span>
            </label>
			<small>An administrator must approve all new users and groups, before they become available to all ${projectNameUC} users.</small>
		</li>

		<li class="input">
			<label for="form-configuration-mask">
				<span class="label">SignUp - Email Mask</span>
				<input class="txt" id="form-configuration-mask" name="<? echo(c('MN_EMAIL')); ?>" type="text" value="${emailMask}"/>
            </label>
			<small>New users must have an email address coming from the mask domain <br/>(ex. "gmail.com" will only allow users from Gmail to signup).</small>
		</li>

	</ol>

	<div class="buttons"><input class="btn btn-round" type="submit" value=" Update Configuration! " /></div>

</fieldset></form>
</c:if>

<c:if test="${'network' == task}">
<form action="adminSubmit.action" id="form-network" method="post"><fieldset class="panel squareTop">

	<h4>Manage ${projectNameUC} Networks</h4>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="<? echo(c('QUERY_KEY_NETWORK')); ?>" />
	<input name="<? echo(c('QK_SUB_TASK')); ?>" type="hidden" value="<? echo(c('QK_CREATE')); ?>" />
	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

	<p class="copy">Use this feature to add networks to ${projectNameUC}. Networks are administrator managed collections of groups and users.</p>

	<ol>
		<c:forEach items="${networks}" var="o"><li>
			${o.nameHTML}
			[<a class="edit" href="/edit.action?key=${o.key}&<? echo(c('QUERY_KEY_TASK') . '=manage'); ?>">manage</a>]
		</li></c:forEach>

		<li>
			<input class="txt" name="<? echo(c('QUERY_KEY_NAME')); ?>" type="text"/>
			<input class="btn btn-round" type="submit" value=" Add "/>
		</li>
	</ol>

</fieldset></form>
</c:if>

<c:if test="${'pending' == task}">
<form action="adminSubmit.action" id="form-pending" method="post"><fieldset class="panel squareTop">

	<h4>Pending Users And ${nameGroups}</h4>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="pending" />
	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

	<p class="copy">Below is a list of all new Users and ${nameGroups} requiring administrator approval. Please evaluate each and apply or deny them.</p>

	<p class="note ${hidePending}">No new Users or ${nameGroups} requiring approval.</p>

	<?
		$page = $pageContext->evaluateTemplateText('${page}');
		$showPending = $pageContext->evaluateTemplateText('${showPending}');
		$pendingSearchables = $pageContext->findAttribute('pending', true);
		$nameType = c('QK_TYPE');

		$href = '/adminSubmit.action?' . c('QUERY_KEY_TASK') . '=pending&' . c('QUERY_KEY_PAGE') . '=' . $page . '&' . c('QUERY_KEY_ID') . '=';

		echo '<ul class="'.$showPending.'">';

		foreach ($pendingSearchables as $s) {
			$sHref = $href . $s->getId() . '&' . $nameType . '=';
			echo '<li>';
			echo '<a href="'.$sHref.'approve" id="form-pending-approve-'.$s->getId().'" name="approve">Approve</a>';
			echo '<span> or </span>';
			echo '<a href="'.$sHref.'deny" id="form-pending-deny-'.$s->getId().'" name="deny">Deny</a>';
			echo $s->getNameHTML() . ' ('.$s->getType().')';
			echo '</li>';
		}

		echo '</ul>';
	?>

</fieldset></form>
</c:if>

<c:if test="${'user' == task}">
<form action="adminSubmit.action" id="form-become" method="post"><fieldset class="panel squareTop">

	<h4>Login As User</h4>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="become" />
	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

	<p class="copy">Use this feature to temporarily login as another user. This is helpful for testing or policing user content. Just start
		typing the user name and wait for autocomplete to complete (this will last until you restart your browser).</p>

	<ol>

		<li>
			<label>Username: <input class="txt" id="admin-become-input"
										 name="<? echo(c('QUERY_KEY_NAME')); ?>" type="text" /></label>
		</li>

	</ol>

	<div class="autocomplete" id="admin-become-input-AC"></div>

	<div class="buttons"><input class="btn btn-round" type="submit" value="Change User" /></div>

</fieldset></form>

<form action="adminSubmit.action" id="form-status" method="post"><fieldset class="panel">

	<h4>Change User Status</h4>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="<? echo(c('QUERY_KEY_STATUS')); ?>" />
	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

	<p class="copy">Use this feature to change the status of a user, such as deleting a user.</p>

	<ol>

		<li>
			<label>Username: <input class="txt" id="status-username" name="<? echo(c('QUERY_KEY_NAME')); ?>" type="text" /></label>
			<div class="autocomplete" id="status-username-AC"></div>
		</li>

		<li>
			<label>Status: <? echo(HtmlHelper::selectTag(c('searchable_status'), 0, array('cls' => 'select',
									'name' => c('QUERY_KEY_STATUS')), array(), false)); ?></label>
		</li>

	</ol>

	<div class="buttons"><input class="btn btn-round" type="submit" value="Update" /></div>

</fieldset></form>
	
<form action="adminSubmit.action" id="form-connect" method="post"><fieldset class="panel">

	<h4>Connect Users</h4>

	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="connect" />
	<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}" />

	<p class="copy">Enter the users you would like to connect below using the autocomplete fields, then select how you want them connected:</p>

	<ol>

		<li>
			<label>User A: <input class="txt" id="connect-usernameA" name="usernameA" type="text" /></label>
			<div class="autocomplete" id="connect-usernameA-AC"></div>
		</li>

		<li>
			<label>User B: <input class="txt" id="connect-usernameB" name="usernameB" type="text" /></label>
			<div class="autocomplete" id="connect-usernameB-AC"></div>
		</li>

		<li>
			<label for="status-A">Make A and User B ${nameFriend}.
			<input checked="true" id="status-A" name="status" type="radio"
				   value="<? echo(Member::$STATUS_CONNECTED); ?>" /></label>
		</li>

		<li>
			<label for="status-B">Make A and User B not ${nameFriend}.
			<input checked="true" id="status-B" name="status" type="radio"
				   value="<? echo(Member::$STATUS_NOT_CONNECTED); ?>" /></label>
		</li>

        <?
            $nameFriend = $pageContext->evaluateTemplateText('${nameFriend}');
            $nameFriend = substr($nameFriend, 0, sizeof($nameFriend) - 2);
        ?>

        <li>
			<label for="status-C">User A requesting that User B becomes their ${lc_nameFriend}.
			<input checked="true" id="status-C" name="status" type="radio"
				   value="<? echo(Member::$STATUS_CONNECTION_REQUESTED_AB); ?>" /></label>
		</li>

		<li>
			<label for="status-D">User B requesting that User A becomes their ${lc_nameFriend}.
			<input checked="true" id="status-D" name="status" type="radio"
				   value="<? echo(Member::$STATUS_CONNECTION_REQUESTED_BA); ?>" /></label>
		</li>

	</ol>

	<div class="buttons"><input class="btn btn-round" type="submit" value="Connect" /></div>

</fieldset></form>
</c:if>

<c:if test="${'group' == task}">
	<div class="panel squareTop">
		<h3>Useful links:</h3>
		<ol>
			<li><a href="/create.action?<? echo(c('QUERY_KEY_TASK') . '=' . Searchable::$TYPE_GROUP); ?>">Create a group</a></li>
			<li><a href="/groups.action">See all groups</a></li>
		</ol>
	</div>
</c:if>