<?php
	$connect = mysql_connect("localhost", "root", "1234");
	
	if (!$connect) die ("<h1>Falha na conexão com o Banco de Dados!</h1>");
	
	$db = mysql_select_db("pdi");
?>