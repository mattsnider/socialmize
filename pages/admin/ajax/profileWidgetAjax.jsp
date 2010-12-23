<?
$pw = $pageContext->findAttribute('pw', null);

$arr = array('class' => 'displayNone', 'name' => c('QUERY_KEY_PAGE'), 'type' => 'hidden', 'value' => 'profileWidget');
echo(HtmlHelper::createInputTag($arr));

$nameGroup = $pageContext->evaluateTemplateText('${nameGroup}');
$pageContext->doInclude(dirname($pageContext->getRequest()->getServletPath()) . '/fragment/profileWidget.jsp');
$pw = $pageContext->findAttribute('pw', null);
_renderProfileWidget(1, $pw, $nameGroup);
?>