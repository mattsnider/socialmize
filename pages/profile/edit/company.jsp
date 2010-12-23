
<!-- ----- |  @group Company Edit Mode  | ----- -->

<form action="profileUpdate.action" class="profile-edit editor" method="post"><fieldset>
	<input name="<? echo(c('QUERY_KEY_TASK')); ?>" type="hidden" value="company" />
	<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${o.key}" />
	<input name="<? echo(c('QUERY_KEY_FIELD_COUNT')); ?>" type="hidden" value="${o.profile.numCompanies + 1}" />
	<input name="<? echo(c('QUERY_KEY_REQUIRED')); ?>" type="hidden" value="name" />

    <?
        $n = 0;
    ?>

	<!-- ----- |  @group Validators  | ----- -->

	<input class="validator" name="description-validator" type="hidden" value="keypress||Editor.isCharLen1500||(max 1,500 characters)" />
	<input class="validator" name="website-validator" type="hidden" value="blur||Editor.stripHTTP||" />
	<input class="validator" name="country-validator" type="hidden" value="change||Editor.toggleState||" />
	<input class="validator" name="incomplete-validator" type="hidden" value="change||Editor.toggleCurrent||" />
	<input class="autocomplete" name="name-validator" type="hidden" value="autocomplete.action?t=company" />
	<input class="autocomplete" name="name-validator" type="hidden" value="autocomplete.action?t=company" />
	<input class="autocomplete" name="position-validator" type="hidden" value="autocomplete.action?t=position" />
	<input class="autocomplete" name="city-validator" type="hidden" value="autocomplete.action?t=city" />

	<!-- ----- |  @end Validators  | ----- -->

	<!-- ----- |  @group New Company  | ----- -->

    <dl class="clearfix">

        <dt><label for="<? echo($n . '|' . c('QUERY_KEY_NAME')); ?>">Company: </label></dt>
        <dd><input class="txt autocomplete" id="<? echo($n . '|' . c('QUERY_KEY_NAME')); ?>" name="<? echo($n . '|' . c('QUERY_KEY_NAME')); ?>"
                   title="<? echo(c('autocompleteTitle')); ?>" type="text" /></dd>

        <dt><label for="<? echo($n . '|' . c('QUERY_KEY_WEBSITE')); ?>">Website: </label></dt>
        <dd><input class="txt" id="<? echo($n . '|' . c('QUERY_KEY_WEBSITE')); ?>" name="<? echo($n . '|' . c('QUERY_KEY_WEBSITE')); ?>"
				   title="Url like www.mattsnider.com or test.mattsnider.com. ('http://' is not required)" type="text" /></dd>

        <dt><label for="<? echo($n . '|' . c('QUERY_KEY_POSITION')); ?>">Position / Title: </label></dt>
        <dd><input class="txt autocomplete" id="<? echo($n . '|' . c('QUERY_KEY_POSITION')); ?>" name="<? echo($n . '|' . c('QUERY_KEY_POSITION')); ?>"
				   title="<? echo(c('autocompleteTitle')); ?>" type="text" /></dd>

        <dt><label for="<? echo($n . '|' . c('QUERY_KEY_DESCRIPTION')); ?>">Description: </label></dt>
        <dd><textarea class="textarea" cols="30" id="<? echo($n . '|' . c('QUERY_KEY_DESCRIPTION')); ?>" name="<? echo($n . '|' . c('QUERY_KEY_DESCRIPTION')); ?>"
                      rows="5" title="Write a short, free-form description about your work here."> </textarea></dd>

        <dt><label for="<? echo($n . '|' . c('QUERY_KEY_INDUSTRY')); ?>">Industry: </label></dt>
        <dd><? echo(HtmlHelper::selectTag(c('industry'), '', array('cls' => 'select', 'id' => $n . '|' . c('QUERY_KEY_INDUSTRY'), 'name' => $n . '|' . c('QUERY_KEY_INDUSTRY')) )); ?></dd>

        <dt><label for="<? echo($n . '|' . c('QUERY_KEY_CITY')); ?>">City: </label></dt>
        <dd><input class="txt autocomplete" id="<? echo($n . '|' . c('QUERY_KEY_CITY')); ?>" name="<? echo($n . '|' . c('QUERY_KEY_CITY')); ?>"
				   title="<? echo(c('autocompleteTitle')); ?>" type="text" /></dd>

        <dt><label for="<? echo($n . '|' . c('QUERY_KEY_COUNTRY')); ?>">Country:</label></dt>
        <dd class="country"><?
            echo(HtmlHelper::countryOptionTag('', array('cls'=>'select country', 'id'=>$n . '|' . c('QUERY_KEY_COUNTRY'), 'name'=>$n . '|' . c('QUERY_KEY_COUNTRY'))));
            echo(HtmlHelper::stateOptionTag('', array('cls'=>'select', 'name'=>c('QUERY_KEY_STATE'))));
        ?></dd>

        <dt><label for="<? echo($n . '|' . c('QUERY_KEY_COUNTRY')); ?>">Time Period:</label></dt>
        <dd class="timespan">
            <p>
                <input id="<? echo($n . '|' . c('QUERY_KEY_CURRENT')); ?>" name="<? echo($n . '|' . c('QUERY_KEY_CURRENT')); ?>" class="chk" type="checkbox" value="T" />&nbsp;I currently work here.
            </p>
            <?
                echo(HtmlHelper::monthAbbrOptionTag('', array('name'=>$n . '|' . 's' . c('QUERY_KEY_MONTH'), 'cls'=>'select month')));
                echo('&nbsp;');
                echo(HtmlHelper::yearOptionTag(100, 0, '', array('name'=>$n . '|' . 's' . c('QUERY_KEY_YEAR'), 'cls'=>'select')));
            ?>
            to
            <span style="display: none;"><strong>present.</strong></span>
            <span style=""><?
                echo(HtmlHelper::monthAbbrOptionTag('', array('name'=>$n . '|' . 'e' . c('QUERY_KEY_MONTH'), 'cls'=>'select month')));
                echo('&nbsp;');
                echo(HtmlHelper::yearOptionTag(100, 0, '', array('name'=>$n . '|' . 'e' . c('QUERY_KEY_YEAR'), 'cls'=>'select')));
            ?></span>
        </dd>

    </dl>

	<!-- ----- |  @end New Company  | ----- -->

    <!-- ----- |  @group Content Loop  | ----- -->

    <c:forEach items="${o.profile.companies}" var="company" varStatus="status">

        <?
            $company = $pageContext->findAttribute('company', null);
            $n = $pageContext->evaluateTemplateText('${status.index}') + 1;
            $removeUrl = 'profileUpdate.action?' . c('QK_DELETE') . '=T&' . c('QUERY_KEY_TASK') . '=company&' . c('QUERY_KEY_ID') . '=';
        ?>


        <dl class="clearfix">

            <dt>&nbsp;</dt><dd class="divider">&nbsp;</dd>

            <dt><label for="<? echo($n . '|' . c('QUERY_KEY_NAME')); ?>">Company: </label></dt>
            <dd><input class="txt autocomplete" id="<? echo($n . '|' . c('QUERY_KEY_NAME')); ?>" name="<? echo($n . '|' . c('QUERY_KEY_NAME')); ?>"
                       title="<? echo(c('autocompleteTitle')); ?>" type="text" value="${company.name}" /></dd>

            <dt><label for="<? echo($n . '|' . c('QUERY_KEY_WEBSITE')); ?>">Website: </label></dt>
            <dd><input class="txt" id="<? echo($n . '|' . c('QUERY_KEY_WEBSITE')); ?>" name="<? echo($n . '|' . c('QUERY_KEY_WEBSITE')); ?>"
                       title="Url like www.mattsnider.com or test.mattsnider.com. ('http://' is not required)" type="text" value="${company.website}" /></dd>

            <dt><label for="<? echo($n . '|' . c('QUERY_KEY_POSITION')); ?>">Position / Title: </label></dt>
            <dd><input class="txt autocomplete" id="<? echo($n . '|' . c('QUERY_KEY_POSITION')); ?>" name="<? echo($n . '|' . c('QUERY_KEY_POSITION')); ?>"
                       title="<? echo(c('autocompleteTitle')); ?>" type="text" value="${company.position}" /></dd>

            <dt><label for="<? echo($n . '|' . c('QUERY_KEY_DESCRIPTION')); ?>">Description: </label></dt>
            <dd><textarea class="textarea" cols="30" id="<? echo($n . '|' . c('QUERY_KEY_DESCRIPTION')); ?>" name="<? echo($n . '|' . c('QUERY_KEY_DESCRIPTION')); ?>"
                          rows="5" title="Write a short, free-form description about your work here.">${company.description}</textarea></dd>

            <dt><label for="<? echo($n . '|' . c('QUERY_KEY_INDUSTRY')); ?>">Industry: </label></dt>
            <dd><? echo(HtmlHelper::selectTag(c('industry'), $company->getIndustryId(), array('cls' => 'select', 'id' => $n . '|' . c('QUERY_KEY_INDUSTRY'), 'name' => $n . '|' . c('QUERY_KEY_INDUSTRY')) )); ?></dd>

            <dt><label for="<? echo($n . '|' . c('QUERY_KEY_CITY')); ?>">City: </label></dt>
            <dd><input class="txt autocomplete" id="<? echo($n . '|' . c('QUERY_KEY_CITY')); ?>" name="<? echo($n . '|' . c('QUERY_KEY_CITY')); ?>"
                       title="<? echo(c('autocompleteTitle')); ?>" type="text" value="${company.city}" /></dd>

            <?
                $isUs = 229 === $company->getCountryId();
            ?>

            <dt><label for="<? echo($n . '|' . c('QUERY_KEY_COUNTRY')); ?>">Country:</label></dt>
            <dd class="country"><?
                echo(HtmlHelper::countryOptionTag($company->getCountryId(), array('cls'=>'select country', 'id'=>$n . '|' . c('QUERY_KEY_COUNTRY'), 'name'=>$n . '|' . c('QUERY_KEY_COUNTRY'))));
                echo(HtmlHelper::stateOptionTag($company->getStateId(), array('cls'=>'select', 'name'=>$n . '|' . c('QUERY_KEY_STATE'), 'style'=>($isUs? '': 'display: none;'))));
            ?></dd>

            <dt><label for="<? echo($n . '|' . c('QUERY_KEY_CURRENT')); ?>">Time Period:</label></dt>
            <dd class="timespan">
                <p>
                    <input class="chk" ${company.currentChecked} id="<? echo($n . '|' . c('QUERY_KEY_CURRENT')); ?>"
                           name="<? echo($n . '|' . c('QUERY_KEY_CURRENT')); ?>" type="checkbox" value="T" />&nbsp;I currently work here.
                </p>
                <?
                    echo(HtmlHelper::monthAbbrOptionTag($company->getStartMonth('m'), array('name'=>$n . '|' . 's' . c('QUERY_KEY_MONTH'), 'cls'=>'select month')));
                    echo('&nbsp;');
                    echo(HtmlHelper::yearOptionTag(100, 0, $company->getStartYear(), array('name'=>$n . '|' . 's' . c('QUERY_KEY_YEAR'), 'cls'=>'select')));
                ?>
                to
                <span style="<c:if test="${! company.current}">display: none;</c:if>"><strong>present.</strong></span>
                <span style="<c:if test="${company.current}">display: none;</c:if>"><?
                    echo(HtmlHelper::monthAbbrOptionTag($company->getEndMonth('m'), array('name'=>$n . '|' . 'e' . c('QUERY_KEY_MONTH'), 'cls'=>'select month')));
                    echo('&nbsp;');
                    echo(HtmlHelper::yearOptionTag(100, 0, $company->getEndYear(), array('name'=>$n . '|' . 'e' . c('QUERY_KEY_YEAR'), 'cls'=>'select')));
                ?></span>
            </dd>

            <input name="<? echo($n . '|' . c('QUERY_KEY_ID')); ?>" type="hidden" value="${company.id}" />

            <dt>&nbsp;</dt><dd><a href="<? echo($removeUrl); ?>${company.id}">Remove Company</a></dd>

        </dl>

    </c:forEach>

	<!-- ----- |  @end Content Loop  | ----- -->

    <div class="buttons">
        <input class="btn" type="submit" value="Cancel"/>
        <input class="btn action" type="submit" value="Submit"/>
    </div>

</fieldset></form>

<!-- ----- |  @end Company Edit Mode   | ----- -->
