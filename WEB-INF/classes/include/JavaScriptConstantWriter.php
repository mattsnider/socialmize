<?php

$_C = array(

	/**
	 * HTML class attribute for the project name.
     * @property HTML_KLASS_PROJECT_NAME
     * @var {String} Value of the project class.
     * @const
     * @static
	 */
    'HTML_KLASS_PROJECT_NAME' => 'project',

	/**
	 * HTML id attribute for the project name.
     * @property HTML_ID_PROJECT_NAME
     * @var {String} Value of the project Id.
     * @const
     * @static
	 */
    'HTML_ID_PROJECT_NAME' => 'project',

	/**
	 * Query parameter for username.
     * @property QUERY_KEY_USERNAME
     * @var {String} Username query constant.
     * @const
     * @static
	 */
    'QUERY_KEY_USERNAME' => 'username',

	/**
	 * Query parameter for email.
     * @property QUERY_KEY_EMAIL
     * @var {String} Email query constant.
     * @const
     * @static
	 */
    'QUERY_KEY_EMAIL' => 'email',

	/**
	 * Query parameter for password.
     * @property QUERY_KEY_PASSWORD
     * @var {String} Password query constant.
     * @const
     * @static
	 */
    'QUERY_KEY_PASSWORD' => 'password',

	/**
	 * Session key constant for user.
     * @property SESSION_KEY_USER
     * @var {String} User session key constant.
     * @const
     * @static
	 */
    'SESSION_KEY_USER' => 'user'

);


function writeJavaScriptConstants($constants, $pathToJs, $fileName='constants.js', $prefix='Core.Constants') {
    // does the file exist already
    if (is_file($pathToJs . DIRECTORY_SEPARATOR . $fileName)) {
        unlink($pathToJs . DIRECTORY_SEPARATOR . $fileName);
    }

    $rs = fopen($pathToJs . DIRECTORY_SEPARATOR . $fileName, 'wb');

    $objExists = array();
    $typeExists = array();

    $i = 1;
    $sb = array($prefix . '={};');

    foreach ($constants as $k => $v) {
        $keys = explode('_', $k);
        $obj = strtolower($keys[0]);
        $type = strtolower($keys[1]);
        $name = strtoupper(implode('_', array_slice($keys, 2)));

        // the object has not been attached in JavaScript, so attach it now
        if (FALSE === array_search($obj, $objExists)) {
            $sb[$i] = $prefix . '.' . $obj . '={};';
            array_push($objExists, $obj);
			$i += 1;
        }

        // the object type has not been attached in JavaScript, so attach it now
        if (FALSE === array_search($obj . '.' . $type, $typeExists)) {
            $sb[$i] = $prefix . '.' . $obj . '.' . $type . '={};';
            array_push($typeExists, $obj . '.' . $type);
			$i += 1;
        }

        $sb[$i] = $prefix . '.' . $obj . '.' . $type . '.' . $name . '=' . (is_string($v) ? "'" . $v . "'" : $v) . ';';

        $i += 1;
    }

    fwrite($rs, implode("\n", $sb));
}

$pathToJs = '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'js' . DIRECTORY_SEPARATOR;
$fileName = 'constants.js';
$prefix = 'Core.Constants';

writeJavaScriptConstants($_C, $pathToJs, $fileName, $prefix);

?>