<?php

// Define o tempo máximo de execução em 0 para as conexões lentas
set_time_limit(0);

// Aqui você faz as validações e/ou pega os dados do banco de dados
$arquivoNome = $_POST['file']; // nome do arquivo que será enviado p/ download

// Verifica se o arquivo não existe
if (!file_exists($arquivoNome)) {
// Exiba uma mensagem de erro caso ele não exista
exit;
}

// Aqui você pode aumentar o contador de downloads
// Definimos o novo nome do arquivo
$novoNome = 'imagem.jpg';
// Configuramos os headers que serão enviados para o browser
header('Content-Description: File Transfer');
header('Content-Disposition: attachment; filename="'.$novoNome.'"');
header('Content-Type: application/octet-stream');
header('Content-Transfer-Encoding: binary');
header('Content-Length: ' . filesize($arquivoNome));
header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
header('Pragma: public');
header('Expires: 0');

// Envia o arquivo para o cliente
echo readfile($arquivoNome);

?>