<?php

$ext = end(explode('.', $_POST['file']));
$nome_final = 'temp/' . str_replace("/", "", $_POST['time']) . "_" . $_POST['format'] . "_" . str_replace("/", "", $_POST['number']) . '.' . $ext;
$_POST['number']++;
exec('cp ' . $_POST['file'] . ' ' . $nome_final);
		
$newFile = str_replace('.'.$ext, '.'.$_POST['format'], $nome_final);
exec('convert ' . $nome_final . ' ' . $newFile);
unlink($nome_final);
$nome_final = $newFile;
        
$newFile = str_replace('.'.$_POST['format'], '.'.$ext, $nome_final);
exec('convert ' . $nome_final . ' ' . $newFile);
unlink($nome_final);
$nome_final = $newFile;

echo $nome_final;

?>