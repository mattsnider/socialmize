<?php

/**
 * Compares the data of two files.
 * @method fileDateCompareTo
 * @param a {File} Required. Left hand file.
 * @param b {File} Required. Right hand file.
 * @static
 */
function fileDateCompareTo($a, $b) {
    return ($a[1] < $b[1]) ? -1 : 0;
}

/**
 * Creates an array of files in a directory.
 * @method loadFiles
 * @param dir {String} Required. The directory location.
 * @param sort {Integer} Optional. The sort order; default is 0.
 * @param exclude {Array} Optional. A collection of filenames to exclude.
 * @static
 */
function loadFiles($dir, $sort=0, $exclude=array()) {
    $files = array();
    $rs =  opendir($dir);
    if (! $rs) {die('Cannot list files for ' . $dir);}

    $ignoreMap = array(
        '.' => true,
        '..' => true
    );

    if (sizeof($exclude)) {
        foreach ($exclude as $v) {
            $ignoreMap[$v] = true;
        }
    }
    
    while ($filename = readdir($rs)) {
        if (array_key_exists($filename, $ignoreMap) && $ignoreMap[$filename]) {continue;}
        $lastModified = filemtime($dir . $filename);
        $files[] = array($dir . $filename, $lastModified);
    }

    switch($sort) {
        case 3: // sort by date DESC
            usort($files, 'fileDateCompareTo');
            $files = array_reverse($files);
        break;
        
        case 2: // sort by date ASC
            usort($files, 'fileDateCompareTo');
        break;

        case 1:
            $files = array_reverse($files);
        break;

        default: // do nothing for now
        break;
    }

    return $files;
}

?>