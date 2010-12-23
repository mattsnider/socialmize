<? function printMembers($pageContext, $nameMember, $nameMemberLc, $page, $members=null, $membern=null, $showSeeAll=true) { ?>

<!-- ----- |  @group Friends  | ----- -->


<div class="panel" id="profile-friends">

    <?
        $S = $pageContext->findAttribute('o', null);

		if (null === $membern) {
			$membern = $S->getMembern();
			$members = $S->getMembers();
		}

		$isUser = $S->isUser();
        $url = $page . '.action?' . c('QUERY_KEY_KEY') . '=' . $S->getKey();
    ?>

    <h3><?
    	if ($showSeeAll) {
    		echo '<div class="edit">[ <a href="'.$url.'">See All</a> ]</div>';
		}

    	echo($membern . ' ' . $nameMember);
    ?></h3>

    <?
    	if (! $showSeeAll) {
        	echo '<h4 class="clearfix"><div class="edit">[ <a href="'.$url.'">See All</a> ]</div></h4>';
		}
    ?>

    <div class="content friend-tbl"><?

	if (0 < $membern) {

		for ($i = 0; $i < 6 && $i < $membern; $i += 1) {
			$m = $members[$i];
			$key = $m->getKey();
			$name = $m->getName();

			$kls = 'image';
			if (5 == $i) {$kls .= ' last';}

			echo '<div id="friend-' . $key . '" class="'. $kls . '">';
			echo $m->getThumbnailHTML();
			echo '<div class="text">';
			echo '<a href="profile.action?' . c('QUERY_KEY_KEY') . '=' . $key . '">' . $name . '</a>';
			echo '</div>';
			echo '</div>';

			if (2 == $i && $isUser) {
				echo '<div class="spacer">&nbsp;</div>';
			}
		}

		echo '<div class="clearfix"></div>';

	}
	else {
		echo '<div class="empty">' . $S->getName() . ' has no ' . $nameMemberLc . '.</div>';
	} ?></div>

</div>

<!-- ----- |  @ end  | ----- -->

<? } ?>