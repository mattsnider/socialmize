<template:put name="subheader" direct="true">${subhd}<c:import url="tmpl/pagination-tpl.jsp"/></template:put>

<div class="searchList column clearfix search-results" id="searchList"><c:forEach items="${results}" var="r">

	<div class="result clearfix">

		<?
		// do this until we get EL on struts tags
		$o =& $pageContext->getAttribute('r');
		def('o', null);
		def('o', $o);
		?>

		<c:choose>
			<c:when test="${'user' == type}"><c:import url="search/result-user.jsp" /></c:when>
			<c:when test="${'group' == type}"><c:import url="search/result-group.jsp" /></c:when>
			<c:otherwise>Error processing data.</c:otherwise>
		</c:choose>

	</div>

</c:forEach></div>

<div class="column filters" id="search-filters" style="display:none;"><div class="content">

	<form id="filters-people" name="filters-people" action="" method="post">

		<fieldset id="filters-institution">

			<legend><span>Institution</span></legend>

			<div class="filters-control">

				<label for="dp" id="label_dp">Department</label>

				<?
					$deptId = $pageContext->evaluateTemplateText('${dm}');
					echo(HtmlHelper::departmentOptionTag($deptId, array('cls'=>'select', 'id'=>'db', 'name'=>'dm', 'type'=>'text')));
				?>

				<label for="in" id="label_in">School</label>

				<input class="txt autcomplete" id="in" name="ug" type="text"
					   <c:if test="${! empty param.ug}">value="${param.ug}"</c:if> />

				<div class="autocomplete" id="filters-school-ac"></div>

				<label for="co" id="label_co">Company</label>

				<input class="txt autcomplete" id="co" name="wc" type="text"
					   <c:if test="${! empty param.wc}">value="${param.wc}"</c:if> />

				<div class="autocomplete" id="filters-company-ac"></div>

			</div>

		</fieldset>

		<!-- <fieldset id="filters-keyword">

			<legend><span>Other Criteria</span></legend>

			<div class="filter-control">
				<label for="kw" id="label_kw">Keyword</label>
				<input class="txt" id="kw" name="kw" type="text" value="" />
			</div>

		</fieldset> -->

		<div class="filters-btns">
			<input type="submit" value="Filter Search Results" name="" id="" class="btn btn-round"/>
		</div>

	</form>
		
</div></div>

<div class="bar bar-footer" style="clear: both;"><c:import url="tmpl/pagination-tpl.jsp"/><h5>Answer to Life, the Universe, and Everything: 42!</h5></div>
