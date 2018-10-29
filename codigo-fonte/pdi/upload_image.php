<?php

//Descomente para habilitar a exibição de erros do PHP:
//ini_set('display_errors', 1); ini_set('log_errors', 1); ini_set('error_log', dirname(__FILE__) . '/error_log.txt'); error_reporting(E_ALL);

$fileName = null;
// Pasta onde o arquivo vai ser salvo
$_UP['pasta'] = "temp/";

// Tamanho máximo do arquivo (em Bytes)
//$_UP['tamanho'] = 1024 * 1024 * 0.5; // 0.5Mb
list($width, $height) = getimagesize($_FILES['fileUpload']['tmp_name']);
// Array com as extensões permitidas
$_UP['extensoes'] = array('jpg', 'png', 'tif', 'pgm', 'jpeg', 'pbm', 'ppm');

// Renomeia o arquivo? (Se true, o arquivo será salvo como .jpg e um nome único):
$_UP['renomeia'] = true;

// Array com os tipos de erros de upload do PHP
$_UP['erros'][0] = 'Não houve erro';
$_UP['erros'][1] = 'O arquivo no upload é maior do que o limite do PHP';
$_UP['erros'][2] = 'O arquivo ultrapassa o limite de tamanho especifiado no HTML';
$_UP['erros'][3] = 'O upload do arquivo foi feito parcialmente';
$_UP['erros'][4] = 'Não foi feito o upload do arquivo';

// Verifica se houve algum erro com o upload. Se sim, exibe a mensagem do erro
if ($_FILES['fileUpload']['error'] != 0) {
	//die("Não foi possível fazer o upload, erro:<br />" . $_UP['erros'][$_FILES['fileUpload']['error']]);
	exit; // Para a execução do script
}

// Caso o script chegue a esse ponto, não houve erro com o upload e o PHP pode continuar
// Faz a verificação da extensão do arquivo
$extensao = strtolower(end(explode('.', $_FILES['fileUpload']['name'])));
if (array_search($extensao, $_UP['extensoes']) === false) {
	//echo "Por favor, envie arquivos com as seguintes extensões: jpg, png ou gif";
}    // Faz a verificação do tamanho do arquivo
//else if ($_UP['tamanho'] < $_FILES['fileUpload']['size']) {
else if ($width*$height > 1000000) {      //Dimensões máximas suportadas pela ferramenta: total de 1000 x 1000.
	//echo "O arquivo enviado é muito grande, envie arquivos de até 2Mb.";
}    // O arquivo passou em todas as verificações, hora de tentar movê-lo para a pasta
else {
	// Primeiro verifica se deve trocar o nome do arquivo
	if ($_UP['renomeia'] == true) {
		// Cria um nome baseado no UNIX TIMESTAMP atual e com extensão original:
		$nome_final = str_replace("/", "", $_POST['time']) . "_" . $_POST['format'] . "_" . str_replace("/", "", $_POST['number']) . '.' . end(explode('.', $_FILES['fileUpload']['name']));
		++$_POST['number'];
	}
	else {
		// Mantém o nome original do arquivo
		$nome_final = $_FILES['fileUpload']['name'];
	}
	// Depois verifica se é possível mover o arquivo para a pasta escolhida
	if (move_uploaded_file($_FILES['fileUpload']['tmp_name'], $_UP['pasta'] . $nome_final)) {
		$fileName = $_UP['pasta'] . $nome_final;
		$ext = end(explode('.', $_FILES['fileUpload']['name']));
		
        $newFile = str_replace('.'.$ext, '.'.$_POST['format'], $fileName);
        exec('convert ' . $fileName . ' ' . $newFile);
		unlink($fileName);
		$fileName = $newFile;
        
        $newFile = str_replace('.'.$_POST['format'], '.jpg', $fileName);
        exec('convert ' . $fileName . ' ' . $newFile);
		unlink($fileName);
        $fileName = $newFile;
        
		// Upload efetuado com sucesso, exibe uma mensagem e um link para o arquivo
		//echo "Upload efetuado com sucesso!";
		//echo '<br /><a href="' . $_UP['pasta'] . $nome_final . '">Clique aqui para acessar o arquivo</a>';
		//Registro no Banco:
		//$query = "INSERT INTO temp_image (path) VALUES ('" . $_UP['pasta'] . $nome_final . "');";
		//$sucesso = mysql_query($query);
	}
	else {
		// Não foi possível fazer o upload, provavelmente a pasta está incorreta
		//echo "Não foi possível enviar o arquivo, tente novamente";
	}
}

echo $fileName;

?>