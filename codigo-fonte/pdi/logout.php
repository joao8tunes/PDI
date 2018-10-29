<?php

$mask = glob('temp/' . str_replace("/", "", $_POST['time']) . "_*");

array_map('unlink', $mask);

?>