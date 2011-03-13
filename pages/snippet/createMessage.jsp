<form action="createMessage.action" class="clearfix formMessage" id="form-message" method="post"><fieldset>

	<h3>Send A Message</h3>

	<?
		$showReply = $pageContext->evaluateTemplateText('${isRead}');
		$thread = $pageContext->evaluateTemplateText('${'.c('QUERY_KEY_THREAD').'}');
		$type = $pageContext->evaluateTemplateText('${'.c('QK_TYPE').'}');
		$sendBy = $pageContext->evaluateTemplateText('${'.c('QUERY_KEY_KEY').'By}');
		$sendTo = $pageContext->findAttribute('sendTo', null);

		$S = $pageContext->findAttribute('S', true);
		$typeSelected = $pageContext->evaluateTemplateText('${typeSelected}');

		if ($thread) {echo '<input name="'.c('QUERY_KEY_THREAD').'" type="hidden" value="'.$thread.'"/>';}

		echo '<input id="form-message-key" name="'.c('QUERY_KEY_KEY').'" type="hidden" value="'.$sendBy.'"/>';
		echo '<input name="'.c('QK_TYPE').'" type="hidden" value="'.$type.'"/>';

		if ('admin' == $type) {
			$allUserName = $pageContext->evaluateTemplateText('${nameUsers}');
		}
		else {
			$allUserName = $pageContext->evaluateTemplateText($S && $S->isUser() ? '${nameFriends}' : '${nameMembers}');
		}
	?>

	<dl>
		<? echo '<dt><label for="form-message-to">To:</label></dt>';

		$types = '';

		if (! $S || ! $S->isNetwork()) {
			$types = Searchable::$TYPE_USER;
		}
		else {
			$types = Searchable::getValidTypes();
		}

		echo '<input id="id_slist_type_to_search" type="hidden" value="member"/>';
		echo '<input id="id_slist_type_to_search2" type="hidden" value="'.$types.'"/>';

		if ($sendTo) {
			echo '<dd>';
				echo '<input class="txt disabled" disabled="disabled" id="form-message-to" tabindex="1" name="to" readonly="true" type="text" value="'.$sendTo->getName().'"/>';
				echo '<input name="checkboxes" type="hidden" value="'.$sendTo->getId().'"/>';
				echo '<input name="ids" type="hidden" value="'.$sendTo->getId().'"/>';
			echo'</dd>';
		} else {
			echo '<dd><div class="content white"><div id="id_slist_message_to"></div></div></dd>';
		} ?>
		
		<dt><label for="form-message-subject">Subject:</label></dt>
		<dd><input autocomplete="off" class="txt" id="form-message-subject" tabindex="2" maxlength="120" name="<? echo(c('QUERY_KEY_SUBJECT')); ?>" type="text" value="${subject}"/></dd>
		
		<dt><label for="form-message-message">Message:</label></dt>
		<dd>
			<textarea autocomplete="off" cols="30" id="form-message-message" tabindex="3" name="<? echo(c('QUERY_KEY_BODY')); ?>" rows="5">${body}</textarea>
			<p class="error hidden" id="form-message-error">max 1,000 characters</p>
		</dd>
	</dl>

	<div class="buttons">
		<input class="btn btn-round action" tabindex="4" name="<? echo(c('QUERY_KEY_BUTTON')); ?>" type="submit" value="  <? echo $showReply ? 'Reply' : 'Send'; ?>  "/>
		<input class="btn" tabindex="5" name="<? echo(c('QUERY_KEY_BUTTON')); ?>" type="submit" value="Cancel"/>
	</div>

</fieldset></form>