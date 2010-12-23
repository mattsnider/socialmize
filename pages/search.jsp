<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="Search" direct="true"/>

	<template:put name="header" direct="true">${hd}</template:put>

	<template:put name="content" direct="true">

		<?

		$pagename = $pageContext->evaluateTemplateText('${' . c('MN_PAGENAME') . '}');
		if (false === strpos($pagename, 'my')) {
			$types = Searchable::getValidTypes();
			$sb = '';
			$clsAllTab = 'selected';

			foreach ($types as $type) {
				$ucname = ucfirst($type);
				$nameType = $pageContext->evaluateTemplateText('${name'.$ucname.'s}');
				$cls = $type.'s' == $pagename ? 'selected' : '';
				if ($cls) {$clsAllTab = '';}
				$sb .= '<li class="'.$cls.'"><a href="/'.$type.'s.action">'.$nameType.'</a></li>';
			}

			$sb = '<li class="'.$clsAllTab.'"><a href="/search.action">All</a></li>' . $sb;
			echo '<div class="tabs tabs-round"><ul>';
			echo $sb;
			echo '</ul></div>';
		}

		?>

        <form action="searchResult.action" class="<c:if test="${'B' != task}">none</c:if>" id="resultFilter" method="get"><fieldset class="panel squareTop">

			<!--<h3>Basic Search</h3>-->

			<dl>

				<dt><label>Search for: </label></dt>
				<dd><input class="txt input-search" maxlength="256" id="q" name="q" value="" type="text" /></dd>

			</dl>

			<div class="buttons">
				<input class="btn btn-round" type="submit" value="Search" />
			</div>

		</fieldset></form>
    </template:put>

</template:insert>