<!-- ----- |  @group Search Basic  | ----- -->

<form action="searchResult.action" class="<c:if test="${'B' != task}">none</c:if>" id="search-form-basic" method="get"><fieldset class="panel">

    <!--<h3>Basic Search</h3>-->

    <dl>

        <dt><label>Search for: </label></dt>
        <dd><input class="txt input-search" maxlength="256" id="basic-query" name="q" value="" type="text" /></dd>

    </dl>

    <div class="buttons">
        <input class="btn btn-round" type="submit" value="Search" />
    </div>

</fieldset></form>

<!-- ----- |  @end Search Basic  | ----- -->