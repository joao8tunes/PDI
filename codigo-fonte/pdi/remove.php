<?php

if (!file_exists($_POST['file'])) return null;
unlink($_POST['file']);
echo $_POST['file'];

?>