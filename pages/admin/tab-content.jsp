<div class="tabs tabs-sub tabs-round clearfix" id="tabs-content">
	<ul><?
	// Update the selected tab
	$subpage = $pageContext->evaluateTemplateText('${' . c('QUERY_KEY_TASK') . '}');
		$clsEmail = $subpage === 'email' || ! $subpage ? 'selected' : '';
		$clsContent = $subpage === 'content' ? 'selected' : '';
		$clsField = $subpage === 'field' ? 'selected' : '';
		$clsRegistration = $subpage === 'registration' ? 'selected' : '';
		$subtabURL = 'admin.action?' . c('QUERY_KEY_PAGE') . '=content&amp;' . c('QUERY_KEY_TASK') . '=';

		echo '
		<li class="first '.$clsEmail.'"><a href="'.$subtabURL.'email">Edit Emails</a></li>
		';
		echo '
		<li class="'.$clsContent.'"><a href="'.$subtabURL.'content">Edit Site Copy</a></li>
		';
		echo '
		<li class="first '.$clsRegistration.'"><a href="'.$subtabURL.'registration">Edit Registration</a></li>
		';
		echo '
		<li class="last '.$clsField.'"><a href="'.$subtabURL.'field">Profile Fields</a></li>
		';
		?>
	</ul>
</div>

<c:if test="${'registration' == task}">
	<form action="updateRegistrationTask.action" id="form-registration" method="post">
		<fieldset class="panel squareTop">

			<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="registration"/>
			<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}"/>

			<h4>Edit ${projectNameUC} Registration</h4>

			<p class="copy">This tool is used to manage the registration flow for ${projectNameUC}. Below is a list of
				all available registration modules. Simply turn the ones you need on or off. If there is additional
				steps to activating a module, then they will appear as you active a module.</p>

			<p class="copy">This tool configures registration steps after the user has signed up. To configure what
			steps and approvals the user needs to take before signing up, see
			<a href="/admin.action?page=searchable&task=configurationSignup">User SignUp Configuration</a>.</p>

			<table class="form">
				<thead>
				<tr>
					<th>On</th>
					<th>Off</th>
					<th>Priority</th>
					<th>Description</th>
				</tr>
				</thead>
				<tbody><?
				$registrationTasks = $pageContext->findAttribute('registrationTasks', null);

				for ($i=0, $j=sizeof($registrationTasks); $i<$j && $rTask=$registrationTasks[$i]; $i+=1) {
				$radioName = 'taskEnabled' . $rTask->getId();
				$inputName = c('QK_ORDER') . $rTask->getId();
				$rowClass = 'row';
				if (0 === $i) {$rowClass .= ' first';}
				if ($j-1 === $i) {$rowClass .= ' last';}
				$checkedOn = $rTask->isEnabled() ? 'checked="checked"' : '';
				$checkedOff = $rTask->isEnabled() ? '' : 'checked="checked"';
				echo '
				<tr class="'.$rowClass.'" id="form-registration-'.$rTask->getId().'">';
					echo '
					<td><input '.$checkedOn.' class="radio" name="'.$radioName.'" type="radio" value="T"/></td>
					';
					echo '
					<td><input '.$checkedOff.' class="radio" name="'.$radioName.'" type="radio" value="F"/></td>
					';
					echo '
					<td class="incrementer">';
						echo '<a class="decrement" href="javascript://">-</a>';
						echo '<span class="rank">'.$rTask->getPriority().'</span>';
						echo '<input name="'.$inputName.'" type="hidden" value="'.$rTask->getPriority().'"/>';
						echo '<a class="increment" href="javascript://">+</a>';
						echo '
					</td>
					';
					echo '
					<td>
						<div class="desc">' . $rTask->getDescription() . '</div>
					</td>
					';
					echo '
				</tr>
				';
				}
				?>
				</tbody>
			</table>

			<div class="buttons"><input type="submit" class="btn btn-round" value=" Update "/></div>

		</fieldset>
	</form>
</c:if>

<c:if test="${'email' == task || ! task}">
	<form action="adminSubmit.action" id="form-email" method="post">
		<fieldset class="panel squareTop">

			<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="email"/>
			<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}"/>

			<h4>Edit ${projectNameUC} Emails</h4>

			<p class="copy">This tool is used to manage the automatic emails for ${projectNameUC}.
				Through this form you can change the messages that will be sent to ${projectNameUC} users.</p>

			<select id="form-email-<? echo(c('MN_EMAILS')); ?>" name="<? echo(c('MN_EMAILS')); ?>"><c:forEach items="${emails}" var="obj">
				<?
		$stask = $pageContext->evaluateTemplateText('${subtask}');
				$value = $pageContext->evaluateTemplateText('${obj}');
				echo ('
				<option
				');
				echo ($stask === $value ? 'selected="selected" ' : '');
				echo ('value="' . $value . '">' . $value . '</option>');
				?>
			</c:forEach></select>

			<label class="small">Subject/Message</label>
			<input class="txt" id="form-email-<? echo(c('MN_SUBJECT')); ?>" name="<? echo(c('MN_SUBJECT')); ?>" value="${subject}"/>
			<textarea cols="10" id="form-email-<? echo(c('MN_EMAIL')); ?>" name="<? echo(c('MN_EMAIL')); ?>" rows="5">${email}</textarea>

			<div class="buttons"><input type="submit" class="btn btn-round" value=" Update "/></div>

		</fieldset>
	</form>
</c:if>

<c:if test="${'content' == task}">
	<form action="adminSubmit.action" class="singleTextarea" id="form-content" method="post">
		<fieldset class="panel squareTop">

			<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="content"/>
			<input name="<? echo(c('QUERY_KEY_PAGE')); ?>" type="hidden" value="${page}"/>

			<h4>Edit ${projectNameUC} Content</h4>

			<p class="copy">This form allows administrators to modify the content of certain parts of ${projectNameUC}.</p>

			<select id="form-content-select" name="contents"><c:forEach items="${contents}" var="obj">
				<?
		$stask = $pageContext->evaluateTemplateText('${subtask}');
				$value = $pageContext->evaluateTemplateText('${obj}');
				echo ('
				<option
				');
				echo ($stask === $value ? 'selected="selected" ' : '');
				echo ('value="' . $value . '">' . $value . '</option>');
				?>
			</c:forEach></select>
			<textarea cols="5" id="form-content-text" name="content" rows="5">${currentContent}</textarea>

			<div class="buttons"><input class="btn btn-round" type="submit" value=" Change Content! "/></div>

		</fieldset>
	</form>
</c:if>

<c:if test="${'field' == task}"><c:import url="tab-field.jsp"/></c:if>