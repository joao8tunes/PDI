<?php

ini_set('memory_limit', '-1');
set_time_limit(0);
//Descomente para habilitar a exibição de erros do PHP:
//ini_set('display_errors', 1); ini_set('log_errors', 1); ini_set('error_log', dirname(__FILE__) . '/error_log.txt'); error_reporting(E_ALL);

function startsWith($haystack, $needle) {
    // search backwards starting from haystack length characters from the end
    return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
}

if (!file_exists($_POST['file'])) {
    echo null;
	return;
}
	
//Conversão:
$fileFormat = explode("_", $_POST['file'])[1];
$newFile = str_replace('.jpg', '.'.$fileFormat, $_POST['file']);
exec('convert -compress none ' . $_POST['file'] . ' ' . $newFile);

//Processamento da operação (em C):
if (isset($_POST['mask'])) $stringJson = exec("./operations " . $_POST['operation'] . " " . $newFile . " " . str_replace("[", "", str_replace("]", "", $_POST['mask'])));
else if (isset($_POST['value'])) $stringJson = exec("./operations " . $_POST['operation'] . " " . $newFile . " " . $_POST['value']);
else $stringJson = exec("./operations " . $_POST['operation'] . " " . $newFile);

//Desconversão:
exec('convert ' . $newFile . ' ' . $_POST['file']);
unlink($newFile);
echo $stringJson;

?>