<!-- ----- |  @group Education Edit Mode  | ----- -->

<?
	// todo: figure out how to pass variables through a c:import -mes
	// note: DO NOT DELETE CONCENTRATION WRAPPER DIVS, REQUIRED FOR AUTOCOMPLETE -mes
?>

<form action="profileUpdate.action" class="profile-edit editor" method="post"><fieldset>
	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="education" />
	<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${o.key}" />
	<input name="<? echo(c('QUERY_KEY_FIELD_COUNT')); ?>" type="hidden" value="${o.profile.numSchools + 1}" />
	<input name="<? echo(c('QUERY_KEY_REQUIRED')); ?>" type="hidden" value="name||year||attend|degree" />

    <?
        $n = 0;
    ?>

    <!-- ----- |  @group Validators  | ----- -->

	<input class="autocomplete" name="name-validator" type="hidden" value="autocomplete.action?t=school" />
	<input class="autocomplete" name="con1-validator" type="hidden" value="autocomplete.action?t=con" />
	<input class="autocomplete" name="con2-validator" type="hidden" value="autocomplete.action?t=con" />
	<input class="autocomplete" name="con3-validator" type="hidden" value="autocomplete.action?t=con" />
	<input class="autocomplete" name="con4-validator" type="hidden" value="autocomplete.action?t=con" />
	<input class="autocomplete" name="con5-validator" type="hidden" value="autocomplete.action?t=con" />

	<!-- ----- |  @end Validators  | ----- -->

	<!-- ----- |  @group New Education  | ----- -->

    <dl class="clearfix">

        <dt><label for="<? echo($n . '|' . c('QUERY_KEY_NAME')); ?>">Institute / Year: <small>(required)</small></label></dt>
        <dd class="eduName">
            <input class="txt autocomplete" id="<? echo($n . '|' . c('QUERY_KEY_NAME')); ?>" name="<? echo($n . '|' . c('QUERY_KEY_NAME')); ?>"
                   title="<? echo(c('autocompleteTitle')); ?>" type="text" />
            <? echo(HtmlHelper::yearOptionTag(100, -8, '', array('cls'=>'select', 'name'=>$n . '|' . c('QUERY_KEY_YEAR')) )); ?>
        </dd>

        <dt><label for="<? echo($n . '|' . c('QUERY_KEY_ATTEND')); ?>">Attended for: <small>(required)</small></label></dt>
        <dd class="country"><?
            echo (HtmlHelper::selectTag(c('attend'), 1, array('cls' => 'select', 'id' => $n . '|' . c('QUERY_KEY_ATTEND'), 'name' => $n . '|' . c('QUERY_KEY_ATTEND')), array(), false));
            echo (HtmlHelper::selectTag(c('degree'), 10, array('cls' => 'select', 'name' => $n . '|' . c('QUERY_KEY_DEGREE')), array(), false));
        ?></dd>

        <dt><label for="<? echo($n . '|' . c('QUERY_KEY_CONCENTRATION')); ?>1">Major and/or Concentration:</label></dt>
        <dd class="multi">
            <input class="txt autocomplete" name="<? echo($n . '|' . c('QUERY_KEY_CONCENTRATION')); ?>1" id="<? echo($n . '|' . c('QUERY_KEY_CONCENTRATION')); ?>1"
                   title="<? echo(c('autocompleteTitle')); ?>" />

            <input class="txt autocomplete" name="<? echo($n . '|' . c('QUERY_KEY_CONCENTRATION')); ?>2"
                   title="<? echo(c('autocompleteTitle')); ?>" />

            <input class="txt autocomplete" name="<? echo($n . '|' . c('QUERY_KEY_CONCENTRATION')); ?>3"
                   title="<? echo(c('autocompleteTitle')); ?>" />
        </dd>

    </dl>

	<!-- ----- |  @end New Education  | ----- -->

    <!-- ----- |  @group Content Loop  | ----- -->

    <c:forEach items="${o.profile.schools}" var="education" varStatus="status">
        
        <?
            $education = $pageContext->findAttribute('education', null);
            $n = $pageContext->evaluateTemplateText('${status.index}') + 1;
            $removeUrl = 'profileUpdate.action?' . c('QK_DELETE') . '=T&' . c('QUERY_KEY_TASK') . '=education&' . c('QUERY_KEY_ID') . '=';
        ?>

        <dl class="clearfix">

            <dt>&nbsp;</dt><dd class="divider">&nbsp;</dd>
    
            <dt><label for="<? echo($n . '|' . c('QUERY_KEY_NAME')); ?>">Institute / Year: <small>(required)</small></label></dt>
            <dd class="eduName">
                <input class="txt autocomplete" id="<? echo($n . '|' . c('QUERY_KEY_NAME')); ?>" name="<? echo($n . '|' . c('QUERY_KEY_NAME')); ?>"
                       title="<? echo(c('autocompleteTitle')); ?>" type="text" value="${education.name}" />
                <? echo(HtmlHelper::yearOptionTag(100, -8, $education->getYear(), array('cls'=>'select', 'name'=>$n . '|' . c('QUERY_KEY_YEAR')) )); ?>
            </dd>

            <dt><label for="<? echo($n . '|' . c('QUERY_KEY_ATTEND')); ?>">Attended for: <small>(required)</small></label></dt>
            <dd class="country"><?
                echo (HtmlHelper::selectTag(c('attend'), $education->getAttendId(), array('cls' => 'select', 'id' => $n . '|' . c('QUERY_KEY_ATTEND'), 'name' => $n . '|' . c('QUERY_KEY_ATTEND')), array(), false));
                echo (HtmlHelper::selectTag(c('degree'), $education->getDegreeId(), array('cls' => 'select', 'name' => $n . '|' . c('QUERY_KEY_DEGREE')), array(), false));
            ?></dd>

            <dt><label for="<? echo($n . '|' . c('QUERY_KEY_CONCENTRATION')); ?>1">Major and/or Concentration:</label></dt>
            <dd class="multi">
                <input class="txt autocomplete" name="<? echo($n . '|' . c('QUERY_KEY_CONCENTRATION')); ?>1" id="<? echo($n . '|' . c('QUERY_KEY_CONCENTRATION')); ?>1"
                       title="<? echo(c('autocompleteTitle')); ?>" value="${education.concentration1}" />

                <input class="txt autocomplete" name="<? echo($n . '|' . c('QUERY_KEY_CONCENTRATION')); ?>2"
                       title="<? echo(c('autocompleteTitle')); ?>" value="${education.concentration2}" />

                <input class="txt autocomplete" name="<? echo($n . '|' . c('QUERY_KEY_CONCENTRATION')); ?>3"
                       title="<? echo(c('autocompleteTitle')); ?>" value="${education.concentration3}" />
            </dd>

            <input name="$n . '|' . <? echo(c('QUERY_KEY_ID')); ?>" type="hidden" value="${education.id}" />

            <dt>&nbsp;</dt><dd><a href="<? echo($removeUrl); ?>${education.id}">Remove School</a></dd>

        </dl>

    </c:forEach>

	<!-- ----- |  @end Content Loop  | ----- -->

    <div class="buttons">
        <input class="btn" type="submit" value="Cancel"/>
        <input class="btn action" type="submit" value="Submit"/>
    </div>

</fieldset></form>

<!-- ----- |  @end Education Edit Mode   | ----- -->