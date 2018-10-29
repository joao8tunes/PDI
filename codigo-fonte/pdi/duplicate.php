<?php

$nome_final = 'temp/' . str_replace("/", "", $_POST['time']) . "_" . $_POST['format'] . "_" . str_replace("/", "", $_POST['number']) . '.' . end(explode('.', $_POST['file']));
$_POST['number']++;
exec('cp ' . $_POST['file'] . ' ' . $nome_final);
echo $nome_final;

?>