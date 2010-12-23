<!-- ----- |  @group Search Advanced  | ----- -->

<form action="searchResult.action" class="<c:if test="${'A' != task}">none</c:if>" id="search-form-advanced" method="get"><fieldset class="panel">

	<input name="<? echo(c('QUERY_KEY_ADVANCED')); ?>" type="hidden" value="T" />

    <h3>Advanced Search</h3>

	<div class="note">
		<strong>What is Advanced Search?</strong>
		<span>Advanced search allows you to filter the number of results found by comparing against additional criteria. </span>
	</div>

    <dl>

        <dt><label for="<? echo(c('QUERY_KEY_NAME')); ?>">Search for</label></dt>
        <dd class="filter">

            <input class="txt input-search" id="<? echo(c('QUERY_KEY_NAME')); ?>" name="<? echo(c('QUERY_KEY_NAME')); ?>" value=""/>

            <label for="networkFilter">within</label>

            <?
                echo(HtmlHelper::selectTag(c('network'), $pageContext->evaluateTemplateText('${param.network}'),
                                    array('cls' => 'select', 'id' => 'networkFilter', 'name' => c('QUERY_KEY_NETWORK')), array(), false));
            ?>

            <label for="timeFilter">and</label>

            <?
                echo(HtmlHelper::selectTag(c('user-filter'), $pageContext->evaluateTemplateText('${param.time}'),
                                    array('cls' => 'select', 'id' => 'timeFilter', 'name' => c('QUERY_KEY_TIME')), array(), false));
            ?>
            
        </dd>

        <dt><label for="<? echo(c('QUERY_KEY_GENDER')); ?>">Biographical Information</label></dt>
        <dd>

            <div class="column">
                <label for="<? echo(c('QUERY_KEY_GENDER')); ?>">Gender:</label>
                <? echo(HtmlHelper::genderOptionTag(null, array('id'=>c('QUERY_KEY_GENDER'), 'name'=>c('QUERY_KEY_GENDER'), 'cls'=>'select'))); ?>
            </div>

            <div class="column">
                <label for="<? echo(c('QUERY_KEY_INTERESTS')); ?>">Interests:</label>
                <input class="txt" id="<? echo(c('QUERY_KEY_INTERESTS')); ?>" name="<? echo(c('QUERY_KEY_INTERESTS')); ?>" value=""/>
            </div>

            <div class="column">
                <label for="<? echo(c('QUERY_KEY_DESCRIPTION')); ?>">Description:</label>
                <input class="txt" id="<? echo(c('QUERY_KEY_DESCRIPTION')); ?>" name="<? echo(c('QUERY_KEY_DESCRIPTION')); ?>" value=""/>
            </div>
            
        </dd>

        <dt><label for="<? echo(c('QUERY_KEY_CITY')); ?>">Contact Information</label></dt>
        <dd>

            <div class="column">
				<label for="<? echo(c('QUERY_KEY_CITY')); ?>">City</label>
				<input class="txt autocomplete" id="<? echo(c('QUERY_KEY_CITY')); ?>" name="<? echo(c('QUERY_KEY_CITY')); ?>" value=""/>
            </div>

            <div class="column">
				<label for="<? echo(c('QUERY_KEY_STATE')); ?>">State</label>
				<? echo(HtmlHelper::stateOptionTag(null, array('id'=>c('QUERY_KEY_STATE'), 'name'=>c('QUERY_KEY_STATE'), 'cls'=>'select'))); ?>
            </div>

            <div class="column">
				<label for="<? echo(c('QUERY_KEY_COUNTRY')); ?>">Home Country</label>
				<? echo(HtmlHelper::countryOptionTag(null, array('id'=>c('QUERY_KEY_COUNTRY'), 'name'=>c('QUERY_KEY_COUNTRY'), 'cls'=>'select'))); ?>
            </div>

            <div class="column">
				<label for="<? echo(c('QUERY_KEY_EMAIL')); ?>">Email</label>
				<input class="txt" id="<? echo(c('QUERY_KEY_EMAIL')); ?>" name="<? echo(c('QUERY_KEY_EMAIL')); ?>" value=""/>
            </div>

            <div class="column">
				<label for="<? echo(c('QUERY_KEY_PHONE')); ?>">Phone #</label>
				<input class="txt" id="<? echo(c('QUERY_KEY_PHONE')); ?>" name="<? echo(c('QUERY_KEY_COUNTRY')); ?>" value=""/>
            </div>

            <div class="column">
				<label for="<? echo(c('QUERY_KEY_ZIPCODE')); ?>">Zip</label>
				<input class="txt" id="<? echo(c('QUERY_KEY_ZIPCODE')); ?>" name="<? echo(c('QUERY_KEY_ZIPCODE')); ?>" value=""/>
            </div>

        </dd>

        <dt><label for="<? echo(c('QUERY_KEY_COMPANY')); ?>">Work History</label></dt>
        <dd>

            <div class="column">
				<label for="<? echo(c('QUERY_KEY_COMPANY')); ?>">Company</label>
				<input class="txt autocomplete" id="<? echo(c('QUERY_KEY_COMPANY')); ?>" name="<? echo(c('QUERY_KEY_COMPANY')); ?>" value=""/>
            </div>

            <div class="column">
				<label for="<? echo(c('QUERY_KEY_POSITION')); ?>">Position</label>
				<input class="txt autocomplete" id="<? echo(c('QUERY_KEY_POSITION')); ?>" name="<? echo(c('QUERY_KEY_POSITION')); ?>" value=""/>
            </div>

            <div class="column">
				<label for="<? echo(c('QUERY_KEY_INDUSTRY')); ?>">Industry</label>
				<? echo(HtmlHelper::industryOptionTag(null, array('cls'=>'select', 'id'=>c('QUERY_KEY_INDUSTRY'), 'name'=>c('QUERY_KEY_INDUSTRY')))); ?>
            </div>

        </dd>

        <dt><label for="<? echo(c('QUERY_KEY_INSITTUTE')); ?>">Edcuational Information</label></dt>
        <dd>

            <div class="column">
				<label for="<? echo(c('QUERY_KEY_INSITTUTE')); ?>">Institute</label>
				<input class="txt autocomplete" id="<? echo(c('QUERY_KEY_INSITTUTE')); ?>" name="<? echo(c('QUERY_KEY_INSITTUTE')); ?>" value=""/>
            </div>

            <div class="column">
				<label for="<? echo(c('QUERY_KEY_YEAR')); ?>">Class Year</label>
				<? echo(HtmlHelper::yearOptionTag(100, 0, null, array('id'=>c('QUERY_KEY_YEAR'), 'name'=>c('QUERY_KEY_YEAR'), 'cls'=>'select'))); ?>
            </div>

            <div class="column">
				<label for="<? echo(c('QUERY_KEY_CONCENTRATION')); ?>">Concentration</label>
				<? echo(HtmlHelper::industryOptionTag(null, array('cls'=>'select', 'id'=>c('QUERY_KEY_CONCENTRATION'), 'name'=>c('QUERY_KEY_CONCENTRATION')))); ?>
            </div>

        </dd>

    </dl>

    <div class="buttons">
		<input class="btn btn-round" type="submit" value="Advanced Search" />
		<input class="btn" name="" id="search-advanced-clear" type="button" value="Clear" />
    </div>

</fieldset></form>

<!-- ----- |  @end Search Advanced  | ----- -->