<?
$registrationTasks = $pageContext->findAttribute('registrationTasks', null);
$regIndex = $pageContext->findAttribute('regIndex', null);

echo '<div class="yui3-macprefradio">';
	echo '<ul class="yui3-macprefradio-content">';
		$i = 0;
		$j = sizeof($registrationTasks);

		$offset = $j * .5;
		$width = (100 - $offset) / $j;
		$style = 'style="width:'.$width.'%"';

		foreach ($registrationTasks as $regTask) {
			$cls = 'yui3-macprefradio-button';

			if (0 === $i) {
				$cls .= ' yui3-macprefradio-left';
			} else if ($j === $i + 1) {
				$cls .= ' yui3-macprefradio-right';
			} else {
				$cls .= ' yui3-macprefradio-center';
			}

			if ($i === $regIndex) {
				$cls .= ' checked';
			} else if ($i < $regIndex) {
				$cls .= ' done';
			} else {
				$cls .= ' disabled';
			}

			$i += 1;

			$copy = 'Step '.($i).' of '.$j.'<br/>'.$regTask->getName();

			echo '<div title="Step '.($i).' of '.$j.'" class="'.$cls.'" '.$style.'><span>'.$copy.'</span></div>';
		}
	echo '</ul>';
echo '</div>';
?>