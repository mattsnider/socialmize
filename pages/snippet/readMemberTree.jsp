<div class="panel squareTop">

	<h3>Network(s) Below <q>${S.name}</q></h3>

	<p class="copy">
		These are the networks that are organized below this one.
	</p>

	<c:if test="${snetworkn}"><ul><c:forEach items="${snetworks}" var="obj">
		<li>${obj.nameHTML} - [<a href="/editprofile.action?<? echo (c('QUERY_KEY_KEY')); ?>=${obj.key}&<? echo (c('QUERY_KEY_TASK') . '=' . c('QUERY_KEY_NETWORK')); ?>">edit</a>]</li>
	</c:forEach></ul></c:if>

	<c:if test="${! snetworkn}"><p class="empty"><q>${S.name}</q> has no networks below it.</p></c:if>

</div>

<div class="panel">

	<h3>Network(s) Above <q>${S.name}</q></h3>

	<p class="copy">
		These are the network(s) organized above <q>${S.name}</q>.
	</p>

	<c:if test="${pnetworkn}"><ul><c:forEach items="${pnetworks}" var="obj">
		<li>${obj.nameHTML} - [<a href="/editprofile.action?<? echo (c('QUERY_KEY_KEY')); ?>=${obj.key}&<? echo (c('QUERY_KEY_TASK') . '=' . c('QUERY_KEY_NETWORK')); ?>">edit</a>]</li>
	</c:forEach></ul></c:if>

	<c:if test="${! pnetworkn}"><p class="empty"><q>${S.name}</q> has no parent networks.</p></c:if>

</div>