<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="Search" direct="true"/>

	<template:put name="header" direct="true">${hd}</template:put>

	<template:put name="content" direct="true">

		<?

		$pagename = $pageContext->evaluateTemplateText('${' . c('MN_PAGENAME') . '}');
		$panelClass = '';
		if (false === strpos($pagename, 'my') && 'friends' != $pagename) {
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
			$panelClass = 'squareTop';
		}

		?>
        
        <form action="${url}" class="filter" id="resultFilter" method="get"><fieldset class="panel <? echo $panelClass; ?>">

			<c:if test="${null != S}">
            	<input name="<? echo(c('QUERY_KEY_KEY')); ?>" type="hidden" value="${S.key}"/>
			</c:if>

            <div class="query">

                <label for="q">Searching for </label>
                <input class="txt input-search" maxlength="256" id="q" name="<? echo(c('QUERY_KEY_QUERY')); ?>"
                       <c:if test="${! empty param.q}">value="${param.q}"</c:if> type="text" />

                <c:if test="${filterOpts}">

                    <label for="filter-n">within</label>

                    <?
                        $filterId = $pageContext->evaluateTemplateText('${' . c('QUERY_KEY_FILTER') . '}');
                        $filters = $pageContext->evaluateTemplateText('${filterOpts}');
                        echo(HtmlHelper::selectTag($filters, $filterId, array('cls' => 'select', 'id' => 'filter-n', 'name' => c('QUERY_KEY_FILTER')),
                                                    array(), false));
                    ?>

                </c:if>

                <input class="btn btn-round" type="submit" value="Search"/>
				<c:if test="${! empty param.q}"><?
					$url = $pageContext->evaluateTemplateText('${url}');
					$key = $pageContext->evaluateTemplateText('${param.key}');
					if ($key) {$url .= '?' . c('QUERY_KEY_KEY') . '=' . $key;}
					echo '<a href="' . $url . '" title="Cancel the current search">X</a>';
				?></c:if>

            </div>

			<c:if test="${null != S}"><div class="forward">
				<?
					$page = preg_replace('/my|member/i', '', $pageContext->evaluateTemplateText('${'.c('MN_PAGENAME').'}'));
					if ('friends' == $page) {$page = Searchable::$TYPE_USER . 's';}
					$ucname = ucfirst($page);
					$name = $pageContext->evaluateTemplateText('${lc_'.c('MN_PAGENAME').'}');
					$nameMember = $pageContext->evaluateTemplateText('${lc_name'.$ucname.'}');
					echo '<a href="/'.$page.'.action">search all '.$nameMember.' &raquo;</a>';
				?>
			</div><div class="back">
				<a href="/profile.action?<? echo(c('QUERY_KEY_KEY')); ?>=${S.key}">&laquo; back to profile</a>
			</div></c:if>

        </fieldset></form>

        <c:import url="tmpl/pagination-tpl.jsp"/><c:import url="search/result.jsp" /><c:choose>

        <c:when test="${0 < resultn}">

            <h2><? writePagination($pageContext); ?>${subhd}</h2>

            <div class="searchList column clearfix search-results" id="searchList">

			<c:forEach items="${results}" var="r">

                <div class="result clearfix">

                    <?
                    // do this until we get EL on struts tags
                    $o = $pageContext->getAttribute('r', true);
                    result($pageContext, $o);
                    ?>

                </div>

            </c:forEach></div>

            <div class="bar bar-footer" style="clear: both;"><? writePagination($pageContext); ?></div>
            <c:if test="${isGroup}"><c:import url="search/group-footer.jsp"/></c:if>
            
        </c:when>

        <c:otherwise>
            <p class="panel noresults">${noresults}</p>
            <c:if test="${isGroup}"><c:import url="search/group-footer.jsp"/></c:if>
        </c:otherwise>

	</c:choose></template:put>

</template:insert>