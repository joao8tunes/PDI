var proccess = "filter";    	

    	$.event.special.rightclick = {
		    bindType: "contextmenu",
		    delegateType: "contextmenu"
		};

		$(document).on("rightclick", "#openFile", function () {
			$("#nomeModalCode").html("<b>Abrir imagem (PHP)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums">//Descomente para habilitar a exibição de erros do PHP:<br>//ini_set("display_errors", 1); ini_set("log_errors", 1); ini_set("error_log", dirname(__FILE__) . "/error_log.txt"); error_reporting(E_ALL);<br><br>$fileName = null;<br>// Pasta onde o arquivo vai ser salvo<br>$_UP["pasta"] = "temp/";<br><br>// Tamanho máximo do arquivo (em Bytes)<br>//$_UP["tamanho"] = 1024 * 1024 * 0.5; // 0.5Mb<br>list($width, $height) = getimagesize($_FILES["fileUpload"]["tmp_name"]);<br>// Array com as extensões permitidas<br>$_UP["extensoes"] = array("jpg", "png", "tif", "pgm", "jpeg", "pbm", "ppm");<br><br>// Renomeia o arquivo? (Se true, o arquivo será salvo como .jpg e um nome único):<br>$_UP["renomeia"] = true;<br><br>// Array com os tipos de erros de upload do PHP<br>$_UP["erros"][0] = "Não houve erro";<br>$_UP["erros"][1] = "O arquivo no upload é maior do que o limite do PHP";<br>$_UP["erros"][2] = "O arquivo ultrapassa o limite de tamanho especifiado no HTML";<br>$_UP["erros"][3] = "O upload do arquivo foi feito parcialmente";<br>$_UP["erros"][4] = "Não foi feito o upload do arquivo";<br><br>// Verifica se houve algum erro com o upload. Se sim, exibe a mensagem do erro<br>if ($_FILES["fileUpload"]["error"] != 0) {<br>	//die("Não foi possível fazer o upload, erro:<br />" . $_UP["erros"][$_FILES["fileUpload"]["error"]]);<br>	exit; // Para a execução do script<br>}<br><br>// Caso o script chegue a esse ponto, não houve erro com o upload e o PHP pode continuar<br>// Faz a verificação da extensão do arquivo<br>$extensao = strtolower(end(explode(".", $_FILES["fileUpload"]["name"])));<br>if (array_search($extensao, $_UP["extensoes"]) === false) {<br>	//echo "Por favor, envie arquivos com as seguintes extensões: jpg, png ou gif";<br>}    // Faz a verificação do tamanho do arquivo<br>//else if ($_UP["tamanho"] < $_FILES["fileUpload"]["size"]) {<br>else if ($width*$height > 1000000) {      //Dimensões máximas suportadas pela ferramenta: total de 1000 x 1000.<br>	//echo "O arquivo enviado é muito grande, envie arquivos de até 2Mb.";<br>}    // O arquivo passou em todas as verificações, hora de tentar movê-lo para a pasta<br>else {<br>	// Primeiro verifica se deve trocar o nome do arquivo<br>	if ($_UP["renomeia"] == true) {<br>		// Cria um nome baseado no UNIX TIMESTAMP atual e com extensão original:<br>		$nome_final = str_replace("/", "", $_POST["time"]) . "_" . $_POST["format"] . "_" . str_replace("/", "", $_POST["number"]) . "." . end(explode(".", $_FILES["fileUpload"]["name"]));<br>		++$_POST["number"];<br>	}<br>	else {<br>		// Mantém o nome original do arquivo<br>		$nome_final = $_FILES["fileUpload"]["name"];<br>	}<br>	// Depois verifica se é possível mover o arquivo para a pasta escolhida<br>	if (move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $_UP["pasta"] . $nome_final)) {<br>		$fileName = $_UP["pasta"] . $nome_final;<br>		$ext = end(explode(".", $_FILES["fileUpload"]["name"]));<br>		<br>        $newFile = str_replace(".".$ext, ".".$_POST["format"], $fileName);<br>        exec("convert " . $fileName . " " . $newFile);<br>		unlink($fileName);<br>		$fileName = $newFile;<br>        <br>        $newFile = str_replace(".".$_POST["format"], ".jpg", $fileName);<br>        exec("convert " . $fileName . " " . $newFile);<br>		unlink($fileName);<br>        $fileName = $newFile;<br>        <br>		// Upload efetuado com sucesso, exibe uma mensagem e um link para o arquivo<br>		//echo "Upload efetuado com sucesso!";<br>		//echo "<br /><a href="" . $_UP["pasta"] . $nome_final . "">Clique aqui para acessar o arquivo</a>";<br>		//Registro no Banco:<br>		//$query = "INSERT INTO temp_image (path) VALUES ("" . $_UP["pasta"] . $nome_final . "");";<br>		//$sucesso = mysql_query($query);<br>	}<br>	else {<br>		// Não foi possível fazer o upload, provavelmente a pasta está incorreta<br>		//echo "Não foi possível enviar o arquivo, tente novamente";<br>	}<br>}<br><br>echo $fileName;</pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});

		$(document).on("rightclick", "#saveFile", function () {
			$("#nomeModalCode").html("<b> Salvar imagem (Javascript)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums">// for non-IE<br>if (!window.ActiveXObject) {<br>    var save = document.createElement("a");<br>    save.href = fileURL;<br>    save.target = "_blank";<br>    save.download = fileName || "unknown";<br>                          <br>    var event = document.createEvent("Event");<br>    event.initEvent("click", true, true);<br>    save.dispatchEvent(event);<br>    (window.URL || window.webkitURL).revokeObjectURL(save.href);<br>}// for IE<br>else if ( !! window.ActiveXObject && document.execCommand) {<br>    var _window = window.open(fileURL, "_blank");<br>    _window.document.close();<br>    _window.document.execCommand("SaveAs", true, fileName || fileURL)<br>    _window.close();<br>}<br><br>//Fonte: http://muaz-khan.blogspot.com.br/2012/10/save-files-on-disk-using-javascript-or.html</pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});		

		$(document).on("rightclick", "#duplicateFile", function () {
			$("#nomeModalCode").html("<b>Duplicar imagem (PHP)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums">$nome_final = "temp/" . str_replace("/", "", $_POST["time"]) . "_" . $_POST["format"] . "_" . str_replace("/", "", $_POST["number"]) . "." . end(explode(".", $_POST["file"]));<br>$_POST["number"]++;<br>exec("cp " . $_POST["file"] . " " . $nome_final);<br>echo $nome_final;</pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});

		$(document).on("rightclick", "#convertFile", function () {
			$("#nomeModalCode").html("<b>Converter formato da imagem (PHP)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums">$ext = end(explode(".", $_POST["file"]));<br>$nome_final = "temp/" . str_replace("/", "", $_POST["time"]) . "_" . $_POST["format"] . "_" . str_replace("/", "", $_POST["number"]) . "." . $ext;<br>$_POST["number"]++;<br>exec("cp " . $_POST["file"] . " " . $nome_final);<br>		<br>$newFile = str_replace(".".$ext, ".".$_POST["format"], $nome_final);<br>exec("convert " . $nome_final . " " . $newFile);<br>unlink($nome_final);<br>$nome_final = $newFile;<br>        <br>$newFile = str_replace(".".$_POST["format"], ".".$ext, $nome_final);<br>exec("convert " . $nome_final . " " . $newFile);<br>unlink($nome_final);<br>$nome_final = $newFile;<br><br>echo $nome_final;</pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});		

		$(document).on("rightclick", "#left90", function () {
			$("#nomeModalCode").html("<b>Rotacionar 90º p/ esquerda (C)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums">#include < STDIO.H ><br>#include < STDLIB.H ><br>#include < STRING.H ><br>#include < ASSERT.H ><br>#include < CTYPE.H ><br>#include < MATH.H ><br><br><br>struct pixel<br>{<br>    int subPixels[3];    //Considerando o número máximo de subpixels de um pixel.<br>};<br><br>struct line_reader <br>{<br>    /* All members are private. */<br>    FILE    *f;<br>    char    *buf;<br>    size_t   siz;<br>};<br><br>void lr_init(struct line_reader *lr, FILE *f);<br>char *next_line(FILE *file);<br>void lr_free(struct line_reader *lr);<br>char** str_split(char* a_str, const char a_delim, int *size);<br>char* str_trim(char* str);<br><br>/*<br> * Initializes a line reader _lr_ for the stream _f_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C<br> */<br>void lr_init(struct line_reader *lr, FILE *f)<br>{<br>    lr->f = f;<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br> <br>/*<br> * Reads the next line. If successful, returns a pointer to the line,<br> * and sets *len to the number of characters, at least 1. The result is<br> * _not_ a C string; it has no terminating "\0". The returned pointer<br> * remains valid until the next call to next_line() or lr_free() with<br> * the same _lr_.<br> *<br> * next_line() returns NULL at end of file, or if there is an error (on<br> * the stream, or with memory allocation).<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>char *next_line(FILE *file)<br>{<br>    struct line_reader lr;<br>    size_t newsiz;<br>    int c;<br>    char *newbuf;<br>    size_t len;<br> <br>    lr_init(&lr, file);<br>    len = 0;            /* Start with empty line. */<br>    for (;;) {<br>        c = fgetc(lr.f);    /* Read next character. */<br>        if (ferror(lr.f))<br>            return NULL;<br> <br>        if (c == EOF) {<br>            /*<br>             * End of file is also end of last line,<br>        `    * unless this last line would be empty.<br>             */<br>            if (len == 0)<br>                return NULL;<br>            else<br>                return lr.buf;<br>        } else {<br>            /* Append c to the buffer. */<br>            if (len == lr.siz) {<br>                /* Need a bigger buffer! */<br>                newsiz = lr.siz + 4096;<br>                newbuf = realloc(lr.buf, newsiz);<br>                if (newbuf == NULL)<br>                    return NULL;<br>                lr.buf = newbuf;<br>                lr.siz = newsiz;<br>            }<br>            lr.buf[len++] = c;<br> <br>            /* "\n" is end of line. */<br>            if (c == "\n")<br>                return lr.buf;<br>        }<br>    }<br>}<br> <br>/*<br> * Frees internal memory used by _lr_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>void lr_free(struct line_reader *lr)<br>{<br>    free(lr->buf);<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br><br><br>//Split: desmenbramento de uma string baseado em um delimitador char.<br>//Fonte: http://stackoverflow.com/questions/9210528/split-string-with-delimiters-in-c<br>char** str_split(char* a_str, const char a_delim, int *size)<br>{<br>    char** result    = 0;<br>    size_t count     = 0;<br>    char* tmp        = a_str;<br>    char* last_comma = 0;<br>    char delim[2];<br>    delim[0] = a_delim;<br>    delim[1] = 0;<br><br>    /* Count how many elements will be extracted. */<br>    while (*tmp) {<br>        if (a_delim == *tmp) {<br>            count++;<br>            last_comma = tmp;<br>        }<br>        <br>        tmp++;<br>    }<br><br>    /* Add space for trailing token. */<br>    count += last_comma < (a_str + strlen(a_str) - 1);<br><br>    /* Add space for terminating null string so caller knows where the list of returned strings ends. */<br>    count++;<br><br>    result = malloc(sizeof(char*) * count);<br><br>    if (result) {<br>        size_t idx  = 0;<br>        char* token = strtok(a_str, delim);<br><br>        while (token) {<br>            assert(idx < count);<br>            *(result + idx++) = strdup(token);<br>            token = strtok(0, delim);<br>        }<br>        <br>        //assert(idx == count - 1);<br>        *(result + idx) = 0;<br>    }<br>    <br>    if (size != NULL) *size = (int) count-1;<br><br>    return result;<br>}<br><br><br>//Fonte: http://stackoverflow.com/questions/122616/how-do-i-trim-leading-trailing-whitespace-in-a-standard-way<br>char* str_trim(char* str) <br>{<br>    char* beg = str;<br>    char* end = beg + strlen(beg) - 1;<br><br>    while (isspace(*beg)) ++beg;<br>    while (end >= beg && isspace(*end)) --end;<br>    end[1] = 0;<br><br>    return memmove(str, beg, end - beg + 2);<br>}<br><br><br><br>//(...)<br><br><br><br>/**************************************/<br>/* LENDO O ARQUIVO (ppm, pgm ou pbm): */<br>/**************************************/<br>FILE *file = fopen(argv[2], "r");<br>char *line = NULL, **aux;<br>char *code = str_trim(next_line(file));    //P* - código do formato<br>char *fileFormat = "pbm";    //Supondo que po formato é "pbm".<br>    <br>do {<br>    line = str_trim(next_line(file));<br>} while (line[0] == "#");    //Possíveis comentátios depois do código.<br>    <br>aux = str_split(line, " ", NULL);    //Largura e altura juntas na mesma linha, separadas por espaço.<br>   <br>int width = atoi(str_trim(aux[0])), height = atoi(str_trim(aux[1]));<br>struct pixel **matrix;    //Dinâmico porque os compiladores tem limite de memória estática.<br>int colorSpace = 1;    //Considerando tipo de imagem PBM (binária) como padrão.<br>char **values;<br>int numBand = 1, size, i = 0, j = 0, k, curIdxPixel = 0;<br>    <br>if (strcmp(code, "P1") != 0) colorSpace = atoi(str_trim(next_line(file)));    //Se o código não for P1 (PBM), então existe especificação do espaço de cores.<br>if (strcmp(code, "P3") == 0) {<br>    numBand = 3;    //Número de bandas ou "subpixels".<br>    fileFormat = "ppm";<br>}<br>else if (strcmp(code, "P2") == 0) fileFormat = "pgm";<br><br>matrix = (struct pixel**) malloc(width*height*sizeof(struct pixel*));<br>        <br>//Instanciando matriz de pixels:<br>for (i = 0; i < height; ++i) {<br>    for (j = 0; j < width; ++j) {<br>        do { <br>            *(matrix + i*width + j) = (struct pixel*) malloc(numBand*sizeof(struct pixel));<br>        } while ((*(matrix + i*width + j))->subPixels == NULL);<br>    }<br>}<br>          <br>i = j = 0;<br>                        <br>//Lendo cada linha restante do arquivo (matriz):<br>while ((line = next_line(file))) {<br>    line =  str_trim(line);    //Lembrar desse trim, pra não considerar o espaço no final da linha como elemento (valor/número).<br>    values = str_split(line, " ", &size);    //size - número de elementos retornados.<br>    <br>    for (k = 0; k < size; k++) {    //Percorrendo elementos da linha atual do arquivo.<br>        (*(matrix + i*width + j))->subPixels[curIdxPixel] = atoi(values[k]);<br>        ++curIdxPixel;<br>          <br>        if (curIdxPixel >= numBand) {    //Agrupando elementos (sub-pixels) no pixel correspondente.<br>            curIdxPixel = 0;<br>            j++;<br>      <br>            if (j >= width) {    //Fim da linha atual da matriz.<br>                j = 0;<br>                i++;<br>            }<br>        }<br>    }<br>}<br><br>fclose(file);<br><br><br><br>//(...)<br><br><br><br>/*****************************************/<br>/* OPERAÇÃO: ROTACIONAR 90º P/ ESQUERDA: */<br>/*****************************************/<br>struct pixel **rotateMatrix = (struct pixel**) malloc(height*width*sizeof(struct pixel*));<br><br>//Como vai rotacionar 90º, largura vira altura e vice-versa para a nova imagem:<br>//Prenche a nova imagem com os valores da imagem original, percorrendo a nova imagem de coluna em coluna começando do início, a partir da última linha até a primeira.<br>for (i = 0; i < height; ++i) {    //Largura da nova imagem.<br>    for (j = width-1; j >= 0; --j) {    //Altura da nova imagem.<br>        (*(rotateMatrix + j*width + i)) = (*(matrix + i*width + (height-1-j)));<br>    }<br>}<br>        <br>matrix = rotateMatrix;    //Atualizando a matriz da imagem.<br>int aux = width;<br>width = height;<br>height = aux;<br><br><br><br>//(...)</pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});

		$(document).on("rightclick", "#right90", function () {
			$("#nomeModalCode").html("<b>Rotacionar 90º p/ direita (C)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums">#include < STDIO.H ><br>#include < STDLIB.H ><br>#include < STRING.H ><br>#include < ASSERT.H ><br>#include < CTYPE.H ><br>#include < MATH.H ><br><br><br>struct pixel<br>{<br>    int subPixels[3];    //Considerando o número máximo de subpixels de um pixel.<br>};<br><br>struct line_reader <br>{<br>    /* All members are private. */<br>    FILE    *f;<br>    char    *buf;<br>    size_t   siz;<br>};<br><br>void lr_init(struct line_reader *lr, FILE *f);<br>char *next_line(FILE *file);<br>void lr_free(struct line_reader *lr);<br>char** str_split(char* a_str, const char a_delim, int *size);<br>char* str_trim(char* str);<br><br>/*<br> * Initializes a line reader _lr_ for the stream _f_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C<br> */<br>void lr_init(struct line_reader *lr, FILE *f)<br>{<br>    lr->f = f;<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br> <br>/*<br> * Reads the next line. If successful, returns a pointer to the line,<br> * and sets *len to the number of characters, at least 1. The result is<br> * _not_ a C string; it has no terminating "\0". The returned pointer<br> * remains valid until the next call to next_line() or lr_free() with<br> * the same _lr_.<br> *<br> * next_line() returns NULL at end of file, or if there is an error (on<br> * the stream, or with memory allocation).<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>char *next_line(FILE *file)<br>{<br>    struct line_reader lr;<br>    size_t newsiz;<br>    int c;<br>    char *newbuf;<br>    size_t len;<br> <br>    lr_init(&lr, file);<br>    len = 0;            /* Start with empty line. */<br>    for (;;) {<br>        c = fgetc(lr.f);    /* Read next character. */<br>        if (ferror(lr.f))<br>            return NULL;<br> <br>        if (c == EOF) {<br>            /*<br>             * End of file is also end of last line,<br>        `    * unless this last line would be empty.<br>             */<br>            if (len == 0)<br>                return NULL;<br>            else<br>                return lr.buf;<br>        } else {<br>            /* Append c to the buffer. */<br>            if (len == lr.siz) {<br>                /* Need a bigger buffer! */<br>                newsiz = lr.siz + 4096;<br>                newbuf = realloc(lr.buf, newsiz);<br>                if (newbuf == NULL)<br>                    return NULL;<br>                lr.buf = newbuf;<br>                lr.siz = newsiz;<br>            }<br>            lr.buf[len++] = c;<br> <br>            /* "\n" is end of line. */<br>            if (c == "\n")<br>                return lr.buf;<br>        }<br>    }<br>}<br> <br>/*<br> * Frees internal memory used by _lr_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>void lr_free(struct line_reader *lr)<br>{<br>    free(lr->buf);<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br><br><br>//Split: desmenbramento de uma string baseado em um delimitador char.<br>//Fonte: http://stackoverflow.com/questions/9210528/split-string-with-delimiters-in-c<br>char** str_split(char* a_str, const char a_delim, int *size)<br>{<br>    char** result    = 0;<br>    size_t count     = 0;<br>    char* tmp        = a_str;<br>    char* last_comma = 0;<br>    char delim[2];<br>    delim[0] = a_delim;<br>    delim[1] = 0;<br><br>    /* Count how many elements will be extracted. */<br>    while (*tmp) {<br>        if (a_delim == *tmp) {<br>            count++;<br>            last_comma = tmp;<br>        }<br>        <br>        tmp++;<br>    }<br><br>    /* Add space for trailing token. */<br>    count += last_comma < (a_str + strlen(a_str) - 1);<br><br>    /* Add space for terminating null string so caller knows where the list of returned strings ends. */<br>    count++;<br><br>    result = malloc(sizeof(char*) * count);<br><br>    if (result) {<br>        size_t idx  = 0;<br>        char* token = strtok(a_str, delim);<br><br>        while (token) {<br>            assert(idx < count);<br>            *(result + idx++) = strdup(token);<br>            token = strtok(0, delim);<br>        }<br>        <br>        //assert(idx == count - 1);<br>        *(result + idx) = 0;<br>    }<br>    <br>    if (size != NULL) *size = (int) count-1;<br><br>    return result;<br>}<br><br><br>//Fonte: http://stackoverflow.com/questions/122616/how-do-i-trim-leading-trailing-whitespace-in-a-standard-way<br>char* str_trim(char* str) <br>{<br>    char* beg = str;<br>    char* end = beg + strlen(beg) - 1;<br><br>    while (isspace(*beg)) ++beg;<br>    while (end >= beg && isspace(*end)) --end;<br>    end[1] = 0;<br><br>    return memmove(str, beg, end - beg + 2);<br>}<br><br><br><br>//(...)<br><br><br><br>/**************************************/<br>/* LENDO O ARQUIVO (ppm, pgm ou pbm): */<br>/**************************************/<br>FILE *file = fopen(argv[2], "r");<br>char *line = NULL, **aux;<br>char *code = str_trim(next_line(file));    //P* - código do formato<br>char *fileFormat = "pbm";    //Supondo que po formato é "pbm".<br>    <br>do {<br>    line = str_trim(next_line(file));<br>} while (line[0] == "#");    //Possíveis comentátios depois do código.<br>    <br>aux = str_split(line, " ", NULL);    //Largura e altura juntas na mesma linha, separadas por espaço.<br>   <br>int width = atoi(str_trim(aux[0])), height = atoi(str_trim(aux[1]));<br>struct pixel **matrix;    //Dinâmico porque os compiladores tem limite de memória estática.<br>int colorSpace = 1;    //Considerando tipo de imagem PBM (binária) como padrão.<br>char **values;<br>int numBand = 1, size, i = 0, j = 0, k, curIdxPixel = 0;<br>    <br>if (strcmp(code, "P1") != 0) colorSpace = atoi(str_trim(next_line(file)));    //Se o código não for P1 (PBM), então existe especificação do espaço de cores.<br>if (strcmp(code, "P3") == 0) {<br>    numBand = 3;    //Número de bandas ou "subpixels".<br>    fileFormat = "ppm";<br>}<br>else if (strcmp(code, "P2") == 0) fileFormat = "pgm";<br><br>matrix = (struct pixel**) malloc(width*height*sizeof(struct pixel*));<br>        <br>//Instanciando matriz de pixels:<br>for (i = 0; i < height; ++i) {<br>    for (j = 0; j < width; ++j) {<br>        do { <br>            *(matrix + i*width + j) = (struct pixel*) malloc(numBand*sizeof(struct pixel));<br>        } while ((*(matrix + i*width + j))->subPixels == NULL);<br>    }<br>}<br>          <br>i = j = 0;<br>                        <br>//Lendo cada linha restante do arquivo (matriz):<br>while ((line = next_line(file))) {<br>    line =  str_trim(line);    //Lembrar desse trim, pra não considerar o espaço no final da linha como elemento (valor/número).<br>    values = str_split(line, " ", &size);    //size - número de elementos retornados.<br>    <br>    for (k = 0; k < size; k++) {    //Percorrendo elementos da linha atual do arquivo.<br>        (*(matrix + i*width + j))->subPixels[curIdxPixel] = atoi(values[k]);<br>        ++curIdxPixel;<br>          <br>        if (curIdxPixel >= numBand) {    //Agrupando elementos (sub-pixels) no pixel correspondente.<br>            curIdxPixel = 0;<br>            j++;<br>      <br>            if (j >= width) {    //Fim da linha atual da matriz.<br>                j = 0;<br>                i++;<br>            }<br>        }<br>    }<br>}<br><br>fclose(file);<br><br><br><br>//(...)<br><br><br><br>/****************************************/<br>/* OPERAÇÃO: ROTACIONAR 90º P/ DIREITA: */<br>/****************************************/<br>struct pixel **rotateMatrix = (struct pixel**) malloc(height*width*sizeof(struct pixel*));<br>     <br>//Como vai rotacionar 90º, largura vira altura e vice-versa para a nova imagem:<br>//Preenche a nova imagem com os valores da imagem original, percorrendo a nova imagem de coluna em coluna começando do fim, a partir da primeira linha até a última.<br>for (i = 0; i < width; ++i) {    //Altura da nova imagem.<br>    for (j = 0; j < height; ++j) {    //Largura da nova imagem.<br>        (*(rotateMatrix + i*width + height-1-j)) = (*(matrix + j*width + i));<br>    }<br>}<br>       <br>matrix = rotateMatrix;    //Atualizando a matriz da imagem.<br>int aux = width;<br>width = height;<br>height = aux;<br><br><br><br>//(...)</pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});

		$(document).on("rightclick", "#histogram", function () {
			$("#nomeModalCode").html("<b>Histograma (C)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums">#include < STDIO.H ><br>#include < STDLIB.H ><br>#include < STRING.H ><br>#include < ASSERT.H ><br>#include < CTYPE.H ><br>#include < MATH.H ><br><br><br>struct pixel<br>{<br>    int subPixels[3];    //Considerando o número máximo de subpixels de um pixel.<br>};<br><br>struct line_reader <br>{<br>    /* All members are private. */<br>    FILE    *f;<br>    char    *buf;<br>    size_t   siz;<br>};<br><br>void lr_init(struct line_reader *lr, FILE *f);<br>char *next_line(FILE *file);<br>void lr_free(struct line_reader *lr);<br>char** str_split(char* a_str, const char a_delim, int *size);<br>char* str_trim(char* str);<br><br>/*<br> * Initializes a line reader _lr_ for the stream _f_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C<br> */<br>void lr_init(struct line_reader *lr, FILE *f)<br>{<br>    lr->f = f;<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br> <br>/*<br> * Reads the next line. If successful, returns a pointer to the line,<br> * and sets *len to the number of characters, at least 1. The result is<br> * _not_ a C string; it has no terminating "\0". The returned pointer<br> * remains valid until the next call to next_line() or lr_free() with<br> * the same _lr_.<br> *<br> * next_line() returns NULL at end of file, or if there is an error (on<br> * the stream, or with memory allocation).<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>char *next_line(FILE *file)<br>{<br>    struct line_reader lr;<br>    size_t newsiz;<br>    int c;<br>    char *newbuf;<br>    size_t len;<br> <br>    lr_init(&lr, file);<br>    len = 0;            /* Start with empty line. */<br>    for (;;) {<br>        c = fgetc(lr.f);    /* Read next character. */<br>        if (ferror(lr.f))<br>            return NULL;<br> <br>        if (c == EOF) {<br>            /*<br>             * End of file is also end of last line,<br>        `    * unless this last line would be empty.<br>             */<br>            if (len == 0)<br>                return NULL;<br>            else<br>                return lr.buf;<br>        } else {<br>            /* Append c to the buffer. */<br>            if (len == lr.siz) {<br>                /* Need a bigger buffer! */<br>                newsiz = lr.siz + 4096;<br>                newbuf = realloc(lr.buf, newsiz);<br>                if (newbuf == NULL)<br>                    return NULL;<br>                lr.buf = newbuf;<br>                lr.siz = newsiz;<br>            }<br>            lr.buf[len++] = c;<br> <br>            /* "\n" is end of line. */<br>            if (c == "\n")<br>                return lr.buf;<br>        }<br>    }<br>}<br> <br>/*<br> * Frees internal memory used by _lr_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>void lr_free(struct line_reader *lr)<br>{<br>    free(lr->buf);<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br><br><br>//Split: desmenbramento de uma string baseado em um delimitador char.<br>//Fonte: http://stackoverflow.com/questions/9210528/split-string-with-delimiters-in-c<br>char** str_split(char* a_str, const char a_delim, int *size)<br>{<br>    char** result    = 0;<br>    size_t count     = 0;<br>    char* tmp        = a_str;<br>    char* last_comma = 0;<br>    char delim[2];<br>    delim[0] = a_delim;<br>    delim[1] = 0;<br><br>    /* Count how many elements will be extracted. */<br>    while (*tmp) {<br>        if (a_delim == *tmp) {<br>            count++;<br>            last_comma = tmp;<br>        }<br>        <br>        tmp++;<br>    }<br><br>    /* Add space for trailing token. */<br>    count += last_comma < (a_str + strlen(a_str) - 1);<br><br>    /* Add space for terminating null string so caller knows where the list of returned strings ends. */<br>    count++;<br><br>    result = malloc(sizeof(char*) * count);<br><br>    if (result) {<br>        size_t idx  = 0;<br>        char* token = strtok(a_str, delim);<br><br>        while (token) {<br>            assert(idx < count);<br>            *(result + idx++) = strdup(token);<br>            token = strtok(0, delim);<br>        }<br>        <br>        //assert(idx == count - 1);<br>        *(result + idx) = 0;<br>    }<br>    <br>    if (size != NULL) *size = (int) count-1;<br><br>    return result;<br>}<br><br><br>//Fonte: http://stackoverflow.com/questions/122616/how-do-i-trim-leading-trailing-whitespace-in-a-standard-way<br>char* str_trim(char* str) <br>{<br>    char* beg = str;<br>    char* end = beg + strlen(beg) - 1;<br><br>    while (isspace(*beg)) ++beg;<br>    while (end >= beg && isspace(*end)) --end;<br>    end[1] = 0;<br><br>    return memmove(str, beg, end - beg + 2);<br>}<br><br><br><br>//(...)<br><br><br><br>/**************************************/<br>/* LENDO O ARQUIVO (ppm, pgm ou pbm): */<br>/**************************************/<br>FILE *file = fopen(argv[2], "r");<br>char *line = NULL, **aux;<br>char *code = str_trim(next_line(file));    //P* - código do formato<br>char *fileFormat = "pbm";    //Supondo que po formato é "pbm".<br>    <br>do {<br>    line = str_trim(next_line(file));<br>} while (line[0] == "#");    //Possíveis comentátios depois do código.<br>    <br>aux = str_split(line, " ", NULL);    //Largura e altura juntas na mesma linha, separadas por espaço.<br>   <br>int width = atoi(str_trim(aux[0])), height = atoi(str_trim(aux[1]));<br>struct pixel **matrix;    //Dinâmico porque os compiladores tem limite de memória estática.<br>int colorSpace = 1;    //Considerando tipo de imagem PBM (binária) como padrão.<br>char **values;<br>int numBand = 1, size, i = 0, j = 0, k, curIdxPixel = 0;<br>    <br>if (strcmp(code, "P1") != 0) colorSpace = atoi(str_trim(next_line(file)));    //Se o código não for P1 (PBM), então existe especificação do espaço de cores.<br>if (strcmp(code, "P3") == 0) {<br>    numBand = 3;    //Número de bandas ou "subpixels".<br>    fileFormat = "ppm";<br>}<br>else if (strcmp(code, "P2") == 0) fileFormat = "pgm";<br><br>matrix = (struct pixel**) malloc(width*height*sizeof(struct pixel*));<br>        <br>//Instanciando matriz de pixels:<br>for (i = 0; i < height; ++i) {<br>    for (j = 0; j < width; ++j) {<br>        do { <br>            *(matrix + i*width + j) = (struct pixel*) malloc(numBand*sizeof(struct pixel));<br>        } while ((*(matrix + i*width + j))->subPixels == NULL);<br>    }<br>}<br>          <br>i = j = 0;<br>                        <br>//Lendo cada linha restante do arquivo (matriz):<br>while ((line = next_line(file))) {<br>    line =  str_trim(line);    //Lembrar desse trim, pra não considerar o espaço no final da linha como elemento (valor/número).<br>    values = str_split(line, " ", &size);    //size - número de elementos retornados.<br>    <br>    for (k = 0; k < size; k++) {    //Percorrendo elementos da linha atual do arquivo.<br>        (*(matrix + i*width + j))->subPixels[curIdxPixel] = atoi(values[k]);<br>        ++curIdxPixel;<br>          <br>        if (curIdxPixel >= numBand) {    //Agrupando elementos (sub-pixels) no pixel correspondente.<br>            curIdxPixel = 0;<br>            j++;<br>      <br>            if (j >= width) {    //Fim da linha atual da matriz.<br>                j = 0;<br>                i++;<br>            }<br>        }<br>    }<br>}<br><br>fclose(file);<br><br><br><br>//(...)<br><br><br><br>/*************************/<br>/* OPERAÇÃO: HISTOGRAMA: */<br>/*************************/<br>int idx;<br>struct pixel pr[colorSpace];<br> <br>for (idx = 0; idx < colorSpace; ++idx) {    //Para cada índice (intensidade de cor do espaço de cores), verifica sua frequência de incidência na matriz da imagem.                <br>    for (k = 0; k < numBand; ++k) {    //Para cada sub-pixel.<br>        pr[idx].subPixels[k] = 0;    //Inicializando contador para a faixa de banda "k".<br>          <br>        //Calculando frequência de cada tonalidade de cor para cada faixa de banda de cor:<br>        for (i = 0; i < height; ++i) {<br>            for (j = 0; j < width; ++j) {<br>                if ((*(matrix + i*width + j))->subPixels[k] == idx) ++pr[idx].subPixels[k];<br>            }<br>        }<br>    }<br>}<br>                 <br>//Retornando um arquivo JSON para o PHP:<br>printf("{\"format\":\"%s\", \"numOfBand\":%d, \"colorPerBand\":%d, \"points\":[", fileFormat, numBand, colorSpace);<br>printf("%d", pr[0].subPixels[0]);<br><br>for (k = 1; k < numBand; ++k) {<br>    printf(",%d", pr[0].subPixels[k]);<br>}<br><br>for (idx = 1; idx < colorSpace; ++idx) {<br>    for (k = 0; k < numBand; ++k) {<br>        printf(",%d", pr[idx].subPixels[k]);<br>    }<br>}<br>printf("]}");<br>return 0;<br><br><br><br>//(...)</pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});

		$(document).on("rightclick", "#logout", function () {
			$("#nomeModalCode").html("<b>Sair da sessão (PHP)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums">$mask = glob("temp/" . str_replace("/", "", $_POST["time"]) . "_*");<br><br>array_map("unlink", $mask);</pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});

		$(document).on("rightclick", "#negativar", function () {
			$("#nomeModalCode").html("<b>Negativar (C)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums">#include < STDIO.H ><br>#include < STDLIB.H ><br>#include < STRING.H ><br>#include < ASSERT.H ><br>#include < CTYPE.H ><br>#include < MATH.H ><br><br><br>struct pixel<br>{<br>    int subPixels[3];    //Considerando o número máximo de subpixels de um pixel.<br>};<br><br>struct line_reader <br>{<br>    /* All members are private. */<br>    FILE    *f;<br>    char    *buf;<br>    size_t   siz;<br>};<br><br>void lr_init(struct line_reader *lr, FILE *f);<br>char *next_line(FILE *file);<br>void lr_free(struct line_reader *lr);<br>char** str_split(char* a_str, const char a_delim, int *size);<br>char* str_trim(char* str);<br><br>/*<br> * Initializes a line reader _lr_ for the stream _f_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C<br> */<br>void lr_init(struct line_reader *lr, FILE *f)<br>{<br>    lr->f = f;<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br> <br>/*<br> * Reads the next line. If successful, returns a pointer to the line,<br> * and sets *len to the number of characters, at least 1. The result is<br> * _not_ a C string; it has no terminating "\0". The returned pointer<br> * remains valid until the next call to next_line() or lr_free() with<br> * the same _lr_.<br> *<br> * next_line() returns NULL at end of file, or if there is an error (on<br> * the stream, or with memory allocation).<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>char *next_line(FILE *file)<br>{<br>    struct line_reader lr;<br>    size_t newsiz;<br>    int c;<br>    char *newbuf;<br>    size_t len;<br> <br>    lr_init(&lr, file);<br>    len = 0;            /* Start with empty line. */<br>    for (;;) {<br>        c = fgetc(lr.f);    /* Read next character. */<br>        if (ferror(lr.f))<br>            return NULL;<br> <br>        if (c == EOF) {<br>            /*<br>             * End of file is also end of last line,<br>        `    * unless this last line would be empty.<br>             */<br>            if (len == 0)<br>                return NULL;<br>            else<br>                return lr.buf;<br>        } else {<br>            /* Append c to the buffer. */<br>            if (len == lr.siz) {<br>                /* Need a bigger buffer! */<br>                newsiz = lr.siz + 4096;<br>                newbuf = realloc(lr.buf, newsiz);<br>                if (newbuf == NULL)<br>                    return NULL;<br>                lr.buf = newbuf;<br>                lr.siz = newsiz;<br>            }<br>            lr.buf[len++] = c;<br> <br>            /* "\n" is end of line. */<br>            if (c == "\n")<br>                return lr.buf;<br>        }<br>    }<br>}<br> <br>/*<br> * Frees internal memory used by _lr_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>void lr_free(struct line_reader *lr)<br>{<br>    free(lr->buf);<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br><br><br>//Split: desmenbramento de uma string baseado em um delimitador char.<br>//Fonte: http://stackoverflow.com/questions/9210528/split-string-with-delimiters-in-c<br>char** str_split(char* a_str, const char a_delim, int *size)<br>{<br>    char** result    = 0;<br>    size_t count     = 0;<br>    char* tmp        = a_str;<br>    char* last_comma = 0;<br>    char delim[2];<br>    delim[0] = a_delim;<br>    delim[1] = 0;<br><br>    /* Count how many elements will be extracted. */<br>    while (*tmp) {<br>        if (a_delim == *tmp) {<br>            count++;<br>            last_comma = tmp;<br>        }<br>        <br>        tmp++;<br>    }<br><br>    /* Add space for trailing token. */<br>    count += last_comma < (a_str + strlen(a_str) - 1);<br><br>    /* Add space for terminating null string so caller knows where the list of returned strings ends. */<br>    count++;<br><br>    result = malloc(sizeof(char*) * count);<br><br>    if (result) {<br>        size_t idx  = 0;<br>        char* token = strtok(a_str, delim);<br><br>        while (token) {<br>            assert(idx < count);<br>            *(result + idx++) = strdup(token);<br>            token = strtok(0, delim);<br>        }<br>        <br>        //assert(idx == count - 1);<br>        *(result + idx) = 0;<br>    }<br>    <br>    if (size != NULL) *size = (int) count-1;<br><br>    return result;<br>}<br><br><br>//Fonte: http://stackoverflow.com/questions/122616/how-do-i-trim-leading-trailing-whitespace-in-a-standard-way<br>char* str_trim(char* str) <br>{<br>    char* beg = str;<br>    char* end = beg + strlen(beg) - 1;<br><br>    while (isspace(*beg)) ++beg;<br>    while (end >= beg && isspace(*end)) --end;<br>    end[1] = 0;<br><br>    return memmove(str, beg, end - beg + 2);<br>}<br><br><br><br>//(...)<br><br><br><br>/**************************************/<br>/* LENDO O ARQUIVO (ppm, pgm ou pbm): */<br>/**************************************/<br>FILE *file = fopen(argv[2], "r");<br>char *line = NULL, **aux;<br>char *code = str_trim(next_line(file));    //P* - código do formato<br>char *fileFormat = "pbm";    //Supondo que po formato é "pbm".<br>    <br>do {<br>    line = str_trim(next_line(file));<br>} while (line[0] == "#");    //Possíveis comentátios depois do código.<br>    <br>aux = str_split(line, " ", NULL);    //Largura e altura juntas na mesma linha, separadas por espaço.<br>   <br>int width = atoi(str_trim(aux[0])), height = atoi(str_trim(aux[1]));<br>struct pixel **matrix;    //Dinâmico porque os compiladores tem limite de memória estática.<br>int colorSpace = 1;    //Considerando tipo de imagem PBM (binária) como padrão.<br>char **values;<br>int numBand = 1, size, i = 0, j = 0, k, curIdxPixel = 0;<br>    <br>if (strcmp(code, "P1") != 0) colorSpace = atoi(str_trim(next_line(file)));    //Se o código não for P1 (PBM), então existe especificação do espaço de cores.<br>if (strcmp(code, "P3") == 0) {<br>    numBand = 3;    //Número de bandas ou "subpixels".<br>    fileFormat = "ppm";<br>}<br>else if (strcmp(code, "P2") == 0) fileFormat = "pgm";<br><br>matrix = (struct pixel**) malloc(width*height*sizeof(struct pixel*));<br>        <br>//Instanciando matriz de pixels:<br>for (i = 0; i < height; ++i) {<br>    for (j = 0; j < width; ++j) {<br>        do { <br>            *(matrix + i*width + j) = (struct pixel*) malloc(numBand*sizeof(struct pixel));<br>        } while ((*(matrix + i*width + j))->subPixels == NULL);<br>    }<br>}<br>          <br>i = j = 0;<br>                        <br>//Lendo cada linha restante do arquivo (matriz):<br>while ((line = next_line(file))) {<br>    line =  str_trim(line);    //Lembrar desse trim, pra não considerar o espaço no final da linha como elemento (valor/número).<br>    values = str_split(line, " ", &size);    //size - número de elementos retornados.<br>    <br>    for (k = 0; k < size; k++) {    //Percorrendo elementos da linha atual do arquivo.<br>        (*(matrix + i*width + j))->subPixels[curIdxPixel] = atoi(values[k]);<br>        ++curIdxPixel;<br>          <br>        if (curIdxPixel >= numBand) {    //Agrupando elementos (sub-pixels) no pixel correspondente.<br>            curIdxPixel = 0;<br>            j++;<br>      <br>            if (j >= width) {    //Fim da linha atual da matriz.<br>                j = 0;<br>                i++;<br>            }<br>        }<br>    }<br>}<br><br>fclose(file);<br><br><br><br>//(...)<br><br><br><br>/************************/<br>/* OPERAÇÃO: NEGATIVAR: */<br>/************************/<br>for (i = 0; i < height; ++i) {    //Lendo a matriz linha a linha.<br>    for (j = 0; j < width; ++j) {    //Lendo a matriz coluna a coluna.<br>        //Para cada sub-pixel, inverte (negativa) seu valor com base no espaço de cores definido no arquivo.<br>        for (k = 0; k < numBand; ++k) {    <br>            (*(matrix + i*width + j))->subPixels[k] = colorSpace - (*(matrix + i*width + j))->subPixels[k];<br>        }<br>    }<br>}<br><br><br><br>//(...)</pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});

		$(document).on("rightclick", "#binarizar", function () {
			$("#nomeModalCode").html("<b> Binarizar (C)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums">#include < STDIO.H ><br>#include < STDLIB.H ><br>#include < STRING.H ><br>#include < ASSERT.H ><br>#include < CTYPE.H ><br>#include < MATH.H ><br><br><br>struct pixel<br>{<br>    int subPixels[3];    //Considerando o número máximo de subpixels de um pixel.<br>};<br><br>struct line_reader <br>{<br>    /* All members are private. */<br>    FILE    *f;<br>    char    *buf;<br>    size_t   siz;<br>};<br><br>void lr_init(struct line_reader *lr, FILE *f);<br>char *next_line(FILE *file);<br>void lr_free(struct line_reader *lr);<br>char** str_split(char* a_str, const char a_delim, int *size);<br>char* str_trim(char* str);<br><br>/*<br> * Initializes a line reader _lr_ for the stream _f_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C<br> */<br>void lr_init(struct line_reader *lr, FILE *f)<br>{<br>    lr->f = f;<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br> <br>/*<br> * Reads the next line. If successful, returns a pointer to the line,<br> * and sets *len to the number of characters, at least 1. The result is<br> * _not_ a C string; it has no terminating "\0". The returned pointer<br> * remains valid until the next call to next_line() or lr_free() with<br> * the same _lr_.<br> *<br> * next_line() returns NULL at end of file, or if there is an error (on<br> * the stream, or with memory allocation).<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>char *next_line(FILE *file)<br>{<br>    struct line_reader lr;<br>    size_t newsiz;<br>    int c;<br>    char *newbuf;<br>    size_t len;<br> <br>    lr_init(&lr, file);<br>    len = 0;            /* Start with empty line. */<br>    for (;;) {<br>        c = fgetc(lr.f);    /* Read next character. */<br>        if (ferror(lr.f))<br>            return NULL;<br> <br>        if (c == EOF) {<br>            /*<br>             * End of file is also end of last line,<br>        `    * unless this last line would be empty.<br>             */<br>            if (len == 0)<br>                return NULL;<br>            else<br>                return lr.buf;<br>        } else {<br>            /* Append c to the buffer. */<br>            if (len == lr.siz) {<br>                /* Need a bigger buffer! */<br>                newsiz = lr.siz + 4096;<br>                newbuf = realloc(lr.buf, newsiz);<br>                if (newbuf == NULL)<br>                    return NULL;<br>                lr.buf = newbuf;<br>                lr.siz = newsiz;<br>            }<br>            lr.buf[len++] = c;<br> <br>            /* "\n" is end of line. */<br>            if (c == "\n")<br>                return lr.buf;<br>        }<br>    }<br>}<br> <br>/*<br> * Frees internal memory used by _lr_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>void lr_free(struct line_reader *lr)<br>{<br>    free(lr->buf);<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br><br><br>//Split: desmenbramento de uma string baseado em um delimitador char.<br>//Fonte: http://stackoverflow.com/questions/9210528/split-string-with-delimiters-in-c<br>char** str_split(char* a_str, const char a_delim, int *size)<br>{<br>    char** result    = 0;<br>    size_t count     = 0;<br>    char* tmp        = a_str;<br>    char* last_comma = 0;<br>    char delim[2];<br>    delim[0] = a_delim;<br>    delim[1] = 0;<br><br>    /* Count how many elements will be extracted. */<br>    while (*tmp) {<br>        if (a_delim == *tmp) {<br>            count++;<br>            last_comma = tmp;<br>        }<br>        <br>        tmp++;<br>    }<br><br>    /* Add space for trailing token. */<br>    count += last_comma < (a_str + strlen(a_str) - 1);<br><br>    /* Add space for terminating null string so caller knows where the list of returned strings ends. */<br>    count++;<br><br>    result = malloc(sizeof(char*) * count);<br><br>    if (result) {<br>        size_t idx  = 0;<br>        char* token = strtok(a_str, delim);<br><br>        while (token) {<br>            assert(idx < count);<br>            *(result + idx++) = strdup(token);<br>            token = strtok(0, delim);<br>        }<br>        <br>        //assert(idx == count - 1);<br>        *(result + idx) = 0;<br>    }<br>    <br>    if (size != NULL) *size = (int) count-1;<br><br>    return result;<br>}<br><br><br>//Fonte: http://stackoverflow.com/questions/122616/how-do-i-trim-leading-trailing-whitespace-in-a-standard-way<br>char* str_trim(char* str) <br>{<br>    char* beg = str;<br>    char* end = beg + strlen(beg) - 1;<br><br>    while (isspace(*beg)) ++beg;<br>    while (end >= beg && isspace(*end)) --end;<br>    end[1] = 0;<br><br>    return memmove(str, beg, end - beg + 2);<br>}<br><br><br><br>//(...)<br><br><br><br>/**************************************/<br>/* LENDO O ARQUIVO (ppm, pgm ou pbm): */<br>/**************************************/<br>FILE *file = fopen(argv[2], "r");<br>char *line = NULL, **aux;<br>char *code = str_trim(next_line(file));    //P* - código do formato<br>char *fileFormat = "pbm";    //Supondo que po formato é "pbm".<br>    <br>do {<br>    line = str_trim(next_line(file));<br>} while (line[0] == "#");    //Possíveis comentátios depois do código.<br>    <br>aux = str_split(line, " ", NULL);    //Largura e altura juntas na mesma linha, separadas por espaço.<br>   <br>int width = atoi(str_trim(aux[0])), height = atoi(str_trim(aux[1]));<br>struct pixel **matrix;    //Dinâmico porque os compiladores tem limite de memória estática.<br>int colorSpace = 1;    //Considerando tipo de imagem PBM (binária) como padrão.<br>char **values;<br>int numBand = 1, size, i = 0, j = 0, k, curIdxPixel = 0;<br>    <br>if (strcmp(code, "P1") != 0) colorSpace = atoi(str_trim(next_line(file)));    //Se o código não for P1 (PBM), então existe especificação do espaço de cores.<br>if (strcmp(code, "P3") == 0) {<br>    numBand = 3;    //Número de bandas ou "subpixels".<br>    fileFormat = "ppm";<br>}<br>else if (strcmp(code, "P2") == 0) fileFormat = "pgm";<br><br>matrix = (struct pixel**) malloc(width*height*sizeof(struct pixel*));<br>        <br>//Instanciando matriz de pixels:<br>for (i = 0; i < height; ++i) {<br>    for (j = 0; j < width; ++j) {<br>        do { <br>            *(matrix + i*width + j) = (struct pixel*) malloc(numBand*sizeof(struct pixel));<br>        } while ((*(matrix + i*width + j))->subPixels == NULL);<br>    }<br>}<br>          <br>i = j = 0;<br>                        <br>//Lendo cada linha restante do arquivo (matriz):<br>while ((line = next_line(file))) {<br>    line =  str_trim(line);    //Lembrar desse trim, pra não considerar o espaço no final da linha como elemento (valor/número).<br>    values = str_split(line, " ", &size);    //size - número de elementos retornados.<br>    <br>    for (k = 0; k < size; k++) {    //Percorrendo elementos da linha atual do arquivo.<br>        (*(matrix + i*width + j))->subPixels[curIdxPixel] = atoi(values[k]);<br>        ++curIdxPixel;<br>          <br>        if (curIdxPixel >= numBand) {    //Agrupando elementos (sub-pixels) no pixel correspondente.<br>            curIdxPixel = 0;<br>            j++;<br>      <br>            if (j >= width) {    //Fim da linha atual da matriz.<br>                j = 0;<br>                i++;<br>            }<br>        }<br>    }<br>}<br><br>fclose(file);<br><br><br><br>//(...)<br><br><br><br>/*************************/<br>/* OPERAÇÃO: BINARIZAR: */<br>/*************************/<br>int middle = colorSpace/2;<br>                    <br>for (i = 0; i < height; ++i) {<br>    for (j = 0; j < width; ++j) {<br>        for (k = 0; k < numBand; ++k) {    //Cálculo para cada subpixel.<br>            //Verificando se o pixel corresponde à cor preto (valor mínimo do espaço de cores) ou á cor branco (valor máximo):<br>            if ((*(matrix + i*width + j))->subPixels[k] > middle) (*(matrix + i*width + j))->subPixels[k] = colorSpace;<br>            else (*(matrix + i*width + j))->subPixels[k] = 0;<br>        }<br>    }<br>}<br><br><br><br>//(...)</pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});

		$(document).on("rightclick", "#brilho", function () {
			$("#nomeModalCode").html("<b> Expandir/Diminuir brilho (C)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums"></pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});

		$(document).on("rightclick", "#escala", function () {
			$("#nomeModalCode").html("<b> Expandir/Diminuir escala (C)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums"></pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});

		$(document).on("rightclick", "#combinar", function () {
			$("#nomeModalCode").html("<b> Somar/Subtrair/Dividir/Multiplicar duas imagens (C)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums"></pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});

		$(document).on("rightclick", "#extrair", function () {
			$("#nomeModalCode").html("<b> Extrair banda de cor (C)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums"></pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});

		$(document).on("rightclick", "#remover", function () {
			$("#nomeModalCode").html("<b> Remover banda de cor (C)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums"></pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});		

		$(document).on("rightclick", "#filtrar", function () {
			$("#nomeModalCode").html("<b> Filtrar (C)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums">#include < STDIO.H ><br>#include < STDLIB.H ><br>#include < STRING.H ><br>#include < ASSERT.H ><br>#include < CTYPE.H ><br>#include < MATH.H ><br><br><br>struct pixel<br>{<br>    int subPixels[3];    //Considerando o número máximo de subpixels de um pixel.<br>};<br><br>struct line_reader <br>{<br>    /* All members are private. */<br>    FILE    *f;<br>    char    *buf;<br>    size_t   siz;<br>};<br><br>void lr_init(struct line_reader *lr, FILE *f);<br>char *next_line(FILE *file);<br>void lr_free(struct line_reader *lr);<br>char** str_split(char* a_str, const char a_delim, int *size);<br>char* str_trim(char* str);<br><br>/*<br> * Initializes a line reader _lr_ for the stream _f_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C<br> */<br>void lr_init(struct line_reader *lr, FILE *f)<br>{<br>    lr->f = f;<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br> <br>/*<br> * Reads the next line. If successful, returns a pointer to the line,<br> * and sets *len to the number of characters, at least 1. The result is<br> * _not_ a C string; it has no terminating "\0". The returned pointer<br> * remains valid until the next call to next_line() or lr_free() with<br> * the same _lr_.<br> *<br> * next_line() returns NULL at end of file, or if there is an error (on<br> * the stream, or with memory allocation).<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>char *next_line(FILE *file)<br>{<br>    struct line_reader lr;<br>    size_t newsiz;<br>    int c;<br>    char *newbuf;<br>    size_t len;<br> <br>    lr_init(&lr, file);<br>    len = 0;            /* Start with empty line. */<br>    for (;;) {<br>        c = fgetc(lr.f);    /* Read next character. */<br>        if (ferror(lr.f))<br>            return NULL;<br> <br>        if (c == EOF) {<br>            /*<br>             * End of file is also end of last line,<br>        `    * unless this last line would be empty.<br>             */<br>            if (len == 0)<br>                return NULL;<br>            else<br>                return lr.buf;<br>        } else {<br>            /* Append c to the buffer. */<br>            if (len == lr.siz) {<br>                /* Need a bigger buffer! */<br>                newsiz = lr.siz + 4096;<br>                newbuf = realloc(lr.buf, newsiz);<br>                if (newbuf == NULL)<br>                    return NULL;<br>                lr.buf = newbuf;<br>                lr.siz = newsiz;<br>            }<br>            lr.buf[len++] = c;<br> <br>            /* "\n" is end of line. */<br>            if (c == "\n")<br>                return lr.buf;<br>        }<br>    }<br>}<br> <br>/*<br> * Frees internal memory used by _lr_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>void lr_free(struct line_reader *lr)<br>{<br>    free(lr->buf);<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br><br><br>//Split: desmenbramento de uma string baseado em um delimitador char.<br>//Fonte: http://stackoverflow.com/questions/9210528/split-string-with-delimiters-in-c<br>char** str_split(char* a_str, const char a_delim, int *size)<br>{<br>    char** result    = 0;<br>    size_t count     = 0;<br>    char* tmp        = a_str;<br>    char* last_comma = 0;<br>    char delim[2];<br>    delim[0] = a_delim;<br>    delim[1] = 0;<br><br>    /* Count how many elements will be extracted. */<br>    while (*tmp) {<br>        if (a_delim == *tmp) {<br>            count++;<br>            last_comma = tmp;<br>        }<br>        <br>        tmp++;<br>    }<br><br>    /* Add space for trailing token. */<br>    count += last_comma < (a_str + strlen(a_str) - 1);<br><br>    /* Add space for terminating null string so caller knows where the list of returned strings ends. */<br>    count++;<br><br>    result = malloc(sizeof(char*) * count);<br><br>    if (result) {<br>        size_t idx  = 0;<br>        char* token = strtok(a_str, delim);<br><br>        while (token) {<br>            assert(idx < count);<br>            *(result + idx++) = strdup(token);<br>            token = strtok(0, delim);<br>        }<br>        <br>        //assert(idx == count - 1);<br>        *(result + idx) = 0;<br>    }<br>    <br>    if (size != NULL) *size = (int) count-1;<br><br>    return result;<br>}<br><br><br>//Fonte: http://stackoverflow.com/questions/122616/how-do-i-trim-leading-trailing-whitespace-in-a-standard-way<br>char* str_trim(char* str) <br>{<br>    char* beg = str;<br>    char* end = beg + strlen(beg) - 1;<br><br>    while (isspace(*beg)) ++beg;<br>    while (end >= beg && isspace(*end)) --end;<br>    end[1] = 0;<br><br>    return memmove(str, beg, end - beg + 2);<br>}<br><br><br><br>//(...)<br><br><br><br>/**************************************/<br>/* LENDO O ARQUIVO (ppm, pgm ou pbm): */<br>/**************************************/<br>FILE *file = fopen(argv[2], "r");<br>char *line = NULL, **aux;<br>char *code = str_trim(next_line(file));    //P* - código do formato<br>char *fileFormat = "pbm";    //Supondo que po formato é "pbm".<br>    <br>do {<br>    line = str_trim(next_line(file));<br>} while (line[0] == "#");    //Possíveis comentátios depois do código.<br>    <br>aux = str_split(line, " ", NULL);    //Largura e altura juntas na mesma linha, separadas por espaço.<br>   <br>int width = atoi(str_trim(aux[0])), height = atoi(str_trim(aux[1]));<br>struct pixel **matrix;    //Dinâmico porque os compiladores tem limite de memória estática.<br>int colorSpace = 1;    //Considerando tipo de imagem PBM (binária) como padrão.<br>char **values;<br>int numBand = 1, size, i = 0, j = 0, k, curIdxPixel = 0;<br>    <br>if (strcmp(code, "P1") != 0) colorSpace = atoi(str_trim(next_line(file)));    //Se o código não for P1 (PBM), então existe especificação do espaço de cores.<br>if (strcmp(code, "P3") == 0) {<br>    numBand = 3;    //Número de bandas ou "subpixels".<br>    fileFormat = "ppm";<br>}<br>else if (strcmp(code, "P2") == 0) fileFormat = "pgm";<br><br>matrix = (struct pixel**) malloc(width*height*sizeof(struct pixel*));<br>        <br>//Instanciando matriz de pixels:<br>for (i = 0; i < height; ++i) {<br>    for (j = 0; j < width; ++j) {<br>        do { <br>            *(matrix + i*width + j) = (struct pixel*) malloc(numBand*sizeof(struct pixel));<br>        } while ((*(matrix + i*width + j))->subPixels == NULL);<br>    }<br>}<br>          <br>i = j = 0;<br>                        <br>//Lendo cada linha restante do arquivo (matriz):<br>while ((line = next_line(file))) {<br>    line =  str_trim(line);    //Lembrar desse trim, pra não considerar o espaço no final da linha como elemento (valor/número).<br>    values = str_split(line, " ", &size);    //size - número de elementos retornados.<br>    <br>    for (k = 0; k < size; k++) {    //Percorrendo elementos da linha atual do arquivo.<br>        (*(matrix + i*width + j))->subPixels[curIdxPixel] = atoi(values[k]);<br>        ++curIdxPixel;<br>          <br>        if (curIdxPixel >= numBand) {    //Agrupando elementos (sub-pixels) no pixel correspondente.<br>            curIdxPixel = 0;<br>            j++;<br>      <br>            if (j >= width) {    //Fim da linha atual da matriz.<br>                j = 0;<br>                i++;<br>            }<br>        }<br>    }<br>}<br><br>fclose(file);<br><br><br><br>//(...)<br><br><br><br>/**********************/<br>/* OPERAÇÃO: FILTRAR: */<br>/**********************/<br>aux = str_split(argv[3], ",", &size);    //A máscara (matriz) via Javascript vem no formato "1,1,...,1"; assim, desmenbra e restitui a máscara em C.<br>size = sqrt(size);    //Dimensão da máscara.<br>int mask[size][size], middle = size/2, l, m;<br>float newValue, sum = 0.0f;<br><br>k = 0;<br>                    <br>//Recuperando a máscara e calculando sua soma:<br>for (i = 0; i < size; ++i) {<br>    for (j = 0; j < size; ++j) {<br>        mask[i][j] = atoi(aux[k++]);    //Convertendo valores da matriz em números inteiros.<br>        sum += mask[i][j];<br>    }<br>}<br>                        <br>//Aplicando a filtragem (convolução):<br>for (i = 0; i+size < height; ++i) {<br>    for (j = 0; j+size < width; ++j) {<br>        for (m = 0; m < numBand; ++m) {    //Cálculo para cada subpixel.<br>            newValue = 0.0;<br>                     <br>            //Processamento realizado com base na máscara:<br>            for (k = 0; k < size; ++k) {<br>                for (l = 0; l < size; ++l) {<br>                    newValue += (*(matrix + (i+k)*width + (j+l)))->subPixels[m] * mask[k][l];<br>                }<br>            }<br>               <br>            //Atualizando o valor do pixel central da imagem em relação ao centro da máscara baseado no local onde esta foi aplicada:<br>            (*(matrix + (i+middle)*width + (j+middle)))->subPixels[m] = (int)(newValue / sum);<br>        }<br>    }<br>}<br><br><br><br>//(...)</pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});

		$(document).on("rightclick", "#converter", function () {
			$("#nomeModalCode").html("<b> Converter (C)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums"></pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});

		$(document).on("rightclick", "#equalizar", function () {
			$("#nomeModalCode").html("<b> Equalizar (C)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums">#include < STDIO.H ><br>#include < STDLIB.H ><br>#include < STRING.H ><br>#include < ASSERT.H ><br>#include < CTYPE.H ><br>#include < MATH.H ><br><br><br>struct pixel<br>{<br>    int subPixels[3];    //Considerando o número máximo de subpixels de um pixel.<br>};<br><br>struct line_reader <br>{<br>    /* All members are private. */<br>    FILE    *f;<br>    char    *buf;<br>    size_t   siz;<br>};<br><br>void lr_init(struct line_reader *lr, FILE *f);<br>char *next_line(FILE *file);<br>void lr_free(struct line_reader *lr);<br>char** str_split(char* a_str, const char a_delim, int *size);<br>char* str_trim(char* str);<br><br>/*<br> * Initializes a line reader _lr_ for the stream _f_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C<br> */<br>void lr_init(struct line_reader *lr, FILE *f)<br>{<br>    lr->f = f;<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br> <br>/*<br> * Reads the next line. If successful, returns a pointer to the line,<br> * and sets *len to the number of characters, at least 1. The result is<br> * _not_ a C string; it has no terminating "\0". The returned pointer<br> * remains valid until the next call to next_line() or lr_free() with<br> * the same _lr_.<br> *<br> * next_line() returns NULL at end of file, or if there is an error (on<br> * the stream, or with memory allocation).<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>char *next_line(FILE *file)<br>{<br>    struct line_reader lr;<br>    size_t newsiz;<br>    int c;<br>    char *newbuf;<br>    size_t len;<br> <br>    lr_init(&lr, file);<br>    len = 0;            /* Start with empty line. */<br>    for (;;) {<br>        c = fgetc(lr.f);    /* Read next character. */<br>        if (ferror(lr.f))<br>            return NULL;<br> <br>        if (c == EOF) {<br>            /*<br>             * End of file is also end of last line,<br>        `    * unless this last line would be empty.<br>             */<br>            if (len == 0)<br>                return NULL;<br>            else<br>                return lr.buf;<br>        } else {<br>            /* Append c to the buffer. */<br>            if (len == lr.siz) {<br>                /* Need a bigger buffer! */<br>                newsiz = lr.siz + 4096;<br>                newbuf = realloc(lr.buf, newsiz);<br>                if (newbuf == NULL)<br>                    return NULL;<br>                lr.buf = newbuf;<br>                lr.siz = newsiz;<br>            }<br>            lr.buf[len++] = c;<br> <br>            /* "\n" is end of line. */<br>            if (c == "\n")<br>                return lr.buf;<br>        }<br>    }<br>}<br> <br>/*<br> * Frees internal memory used by _lr_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>void lr_free(struct line_reader *lr)<br>{<br>    free(lr->buf);<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br><br><br>//Split: desmenbramento de uma string baseado em um delimitador char.<br>//Fonte: http://stackoverflow.com/questions/9210528/split-string-with-delimiters-in-c<br>char** str_split(char* a_str, const char a_delim, int *size)<br>{<br>    char** result    = 0;<br>    size_t count     = 0;<br>    char* tmp        = a_str;<br>    char* last_comma = 0;<br>    char delim[2];<br>    delim[0] = a_delim;<br>    delim[1] = 0;<br><br>    /* Count how many elements will be extracted. */<br>    while (*tmp) {<br>        if (a_delim == *tmp) {<br>            count++;<br>            last_comma = tmp;<br>        }<br>        <br>        tmp++;<br>    }<br><br>    /* Add space for trailing token. */<br>    count += last_comma < (a_str + strlen(a_str) - 1);<br><br>    /* Add space for terminating null string so caller knows where the list of returned strings ends. */<br>    count++;<br><br>    result = malloc(sizeof(char*) * count);<br><br>    if (result) {<br>        size_t idx  = 0;<br>        char* token = strtok(a_str, delim);<br><br>        while (token) {<br>            assert(idx < count);<br>            *(result + idx++) = strdup(token);<br>            token = strtok(0, delim);<br>        }<br>        <br>        //assert(idx == count - 1);<br>        *(result + idx) = 0;<br>    }<br>    <br>    if (size != NULL) *size = (int) count-1;<br><br>    return result;<br>}<br><br><br>//Fonte: http://stackoverflow.com/questions/122616/how-do-i-trim-leading-trailing-whitespace-in-a-standard-way<br>char* str_trim(char* str) <br>{<br>    char* beg = str;<br>    char* end = beg + strlen(beg) - 1;<br><br>    while (isspace(*beg)) ++beg;<br>    while (end >= beg && isspace(*end)) --end;<br>    end[1] = 0;<br><br>    return memmove(str, beg, end - beg + 2);<br>}<br><br><br><br>//(...)<br><br><br><br>/**************************************/<br>/* LENDO O ARQUIVO (ppm, pgm ou pbm): */<br>/**************************************/<br>FILE *file = fopen(argv[2], "r");<br>char *line = NULL, **aux;<br>char *code = str_trim(next_line(file));    //P* - código do formato<br>char *fileFormat = "pbm";    //Supondo que po formato é "pbm".<br>    <br>do {<br>    line = str_trim(next_line(file));<br>} while (line[0] == "#");    //Possíveis comentátios depois do código.<br>    <br>aux = str_split(line, " ", NULL);    //Largura e altura juntas na mesma linha, separadas por espaço.<br>   <br>int width = atoi(str_trim(aux[0])), height = atoi(str_trim(aux[1]));<br>struct pixel **matrix;    //Dinâmico porque os compiladores tem limite de memória estática.<br>int colorSpace = 1;    //Considerando tipo de imagem PBM (binária) como padrão.<br>char **values;<br>int numBand = 1, size, i = 0, j = 0, k, curIdxPixel = 0;<br>    <br>if (strcmp(code, "P1") != 0) colorSpace = atoi(str_trim(next_line(file)));    //Se o código não for P1 (PBM), então existe especificação do espaço de cores.<br>if (strcmp(code, "P3") == 0) {<br>    numBand = 3;    //Número de bandas ou "subpixels".<br>    fileFormat = "ppm";<br>}<br>else if (strcmp(code, "P2") == 0) fileFormat = "pgm";<br><br>matrix = (struct pixel**) malloc(width*height*sizeof(struct pixel*));<br>        <br>//Instanciando matriz de pixels:<br>for (i = 0; i < height; ++i) {<br>    for (j = 0; j < width; ++j) {<br>        do { <br>            *(matrix + i*width + j) = (struct pixel*) malloc(numBand*sizeof(struct pixel));<br>        } while ((*(matrix + i*width + j))->subPixels == NULL);<br>    }<br>}<br>          <br>i = j = 0;<br>                        <br>//Lendo cada linha restante do arquivo (matriz):<br>while ((line = next_line(file))) {<br>    line =  str_trim(line);    //Lembrar desse trim, pra não considerar o espaço no final da linha como elemento (valor/número).<br>    values = str_split(line, " ", &size);    //size - número de elementos retornados.<br>    <br>    for (k = 0; k < size; k++) {    //Percorrendo elementos da linha atual do arquivo.<br>        (*(matrix + i*width + j))->subPixels[curIdxPixel] = atoi(values[k]);<br>        ++curIdxPixel;<br>          <br>        if (curIdxPixel >= numBand) {    //Agrupando elementos (sub-pixels) no pixel correspondente.<br>            curIdxPixel = 0;<br>            j++;<br>      <br>            if (j >= width) {    //Fim da linha atual da matriz.<br>                j = 0;<br>                i++;<br>            }<br>        }<br>    }<br>}<br><br>fclose(file);<br><br><br><br>//(...)<br><br><br><br>/************************/<br>/* OPERAÇÃO: EQUALIZAR: */<br>/************************/<br>struct pixel **newMatrix = (struct pixel**) malloc(width*height*sizeof(struct pixel*));<br>int numberOfPixels = width*height, idx;<br>float pr[colorSpace][numBand];<br>        <br>for (idx = 0; idx < colorSpace; ++idx) {    //Para cada índice (intensidade de cor do espaço de cores), verifica sua frequência de incidência na matriz da imagem.<br>    for (k = 0; k < numBand; ++k) {    //Cálculo para cada subpixel.<br>        pr[idx][k] = 0.0f;    //Inicializando contador.<br>           <br>        //Calculando a frequência de ocorrência de cada tonalidade de cor (espaço de cores) para todos os pixels da imagem:<br>        for (i = 0; i < height; ++i) {<br>            for (j = 0; j < width; ++j) {<br>                if ((*(matrix + i*width + j))->subPixels[k] == idx) ++pr[idx][k];<br>            }<br>        }<br>            <br>        pr[idx][k] = (float)(pr[idx][k]/numberOfPixels);    //Cálculo da porcentagem.<br>        if (idx > 0) pr[idx][k] += pr[idx-1][k];    //Acumulando resultados para a próxima etapa da equalização.<br>    }<br>}<br>      <br>//Não pode ir atualizando a matriz para não interferir em alterações futuras, por isso cria-se uma cópia:<br>for (i = 0; i < height; ++i) {<br>    for (j = 0; j < width; ++j) {<br>        do { <br>            *(newMatrix + i*width + j) = (struct pixel*) malloc(numBand*sizeof(struct pixel));<br>        } while ((*(newMatrix + i*width + j))->subPixels == NULL);<br>        <br>        for (k = 0; k < numBand; ++k) (*(newMatrix + i*width + j))->subPixels[k] = (*(matrix + i*width + j))->subPixels[k];<br>    }<br>}<br>       <br>for (idx = 0; idx < colorSpace; ++idx) {<br>    for (k = 0; k < numBand; ++k) {    //Cálculo para cada subpixel.<br>        pr[idx][k] = (int)((colorSpace-1)*pr[idx][k]);    //Calculando o novo valor da tonalidade do pixel com base na porcentagem calculada.<br>        <br>        //Atualizando os valores dos pixels na matriz auxiliar:<br>        for (i = 0; i < height; ++i) {<br>            for (j = 0; j < width; ++j) {<br>                if ((*(matrix + i*width + j))->subPixels[k] == idx) (*(newMatrix + i*width + j))->subPixels[k] = pr[idx][k];<br>            }<br>        }<br>    }<br>}<br>     <br>matrix = newMatrix;    //Atualizando a matriz da imagem.<br><br><br><br>//(...)</pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});

		$(document).on("rightclick", "#contornar", function () {
			$("#nomeModalCode").html("<b> Contornar (C)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums">#include < STDIO.H ><br>#include < STDLIB.H ><br>#include < STRING.H ><br>#include < ASSERT.H ><br>#include < CTYPE.H ><br>#include < MATH.H ><br><br><br>struct pixel<br>{<br>    int subPixels[3];    //Considerando o número máximo de subpixels de um pixel.<br>};<br><br>struct line_reader <br>{<br>    /* All members are private. */<br>    FILE    *f;<br>    char    *buf;<br>    size_t   siz;<br>};<br><br>void lr_init(struct line_reader *lr, FILE *f);<br>char *next_line(FILE *file);<br>void lr_free(struct line_reader *lr);<br>char** str_split(char* a_str, const char a_delim, int *size);<br>char* str_trim(char* str);<br><br>/*<br> * Initializes a line reader _lr_ for the stream _f_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C<br> */<br>void lr_init(struct line_reader *lr, FILE *f)<br>{<br>    lr->f = f;<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br> <br>/*<br> * Reads the next line. If successful, returns a pointer to the line,<br> * and sets *len to the number of characters, at least 1. The result is<br> * _not_ a C string; it has no terminating "\0". The returned pointer<br> * remains valid until the next call to next_line() or lr_free() with<br> * the same _lr_.<br> *<br> * next_line() returns NULL at end of file, or if there is an error (on<br> * the stream, or with memory allocation).<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>char *next_line(FILE *file)<br>{<br>    struct line_reader lr;<br>    size_t newsiz;<br>    int c;<br>    char *newbuf;<br>    size_t len;<br> <br>    lr_init(&lr, file);<br>    len = 0;            /* Start with empty line. */<br>    for (;;) {<br>        c = fgetc(lr.f);    /* Read next character. */<br>        if (ferror(lr.f))<br>            return NULL;<br> <br>        if (c == EOF) {<br>            /*<br>             * End of file is also end of last line,<br>        `    * unless this last line would be empty.<br>             */<br>            if (len == 0)<br>                return NULL;<br>            else<br>                return lr.buf;<br>        } else {<br>            /* Append c to the buffer. */<br>            if (len == lr.siz) {<br>                /* Need a bigger buffer! */<br>                newsiz = lr.siz + 4096;<br>                newbuf = realloc(lr.buf, newsiz);<br>                if (newbuf == NULL)<br>                    return NULL;<br>                lr.buf = newbuf;<br>                lr.siz = newsiz;<br>            }<br>            lr.buf[len++] = c;<br> <br>            /* "\n" is end of line. */<br>            if (c == "\n")<br>                return lr.buf;<br>        }<br>    }<br>}<br> <br>/*<br> * Frees internal memory used by _lr_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>void lr_free(struct line_reader *lr)<br>{<br>    free(lr->buf);<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br><br><br>//Split: desmenbramento de uma string baseado em um delimitador char.<br>//Fonte: http://stackoverflow.com/questions/9210528/split-string-with-delimiters-in-c<br>char** str_split(char* a_str, const char a_delim, int *size)<br>{<br>    char** result    = 0;<br>    size_t count     = 0;<br>    char* tmp        = a_str;<br>    char* last_comma = 0;<br>    char delim[2];<br>    delim[0] = a_delim;<br>    delim[1] = 0;<br><br>    /* Count how many elements will be extracted. */<br>    while (*tmp) {<br>        if (a_delim == *tmp) {<br>            count++;<br>            last_comma = tmp;<br>        }<br>        <br>        tmp++;<br>    }<br><br>    /* Add space for trailing token. */<br>    count += last_comma < (a_str + strlen(a_str) - 1);<br><br>    /* Add space for terminating null string so caller knows where the list of returned strings ends. */<br>    count++;<br><br>    result = malloc(sizeof(char*) * count);<br><br>    if (result) {<br>        size_t idx  = 0;<br>        char* token = strtok(a_str, delim);<br><br>        while (token) {<br>            assert(idx < count);<br>            *(result + idx++) = strdup(token);<br>            token = strtok(0, delim);<br>        }<br>        <br>        //assert(idx == count - 1);<br>        *(result + idx) = 0;<br>    }<br>    <br>    if (size != NULL) *size = (int) count-1;<br><br>    return result;<br>}<br><br><br>//Fonte: http://stackoverflow.com/questions/122616/how-do-i-trim-leading-trailing-whitespace-in-a-standard-way<br>char* str_trim(char* str) <br>{<br>    char* beg = str;<br>    char* end = beg + strlen(beg) - 1;<br><br>    while (isspace(*beg)) ++beg;<br>    while (end >= beg && isspace(*end)) --end;<br>    end[1] = 0;<br><br>    return memmove(str, beg, end - beg + 2);<br>}<br><br><br><br>//(...)<br><br><br><br>/**************************************/<br>/* LENDO O ARQUIVO (ppm, pgm ou pbm): */<br>/**************************************/<br>FILE *file = fopen(argv[2], "r");<br>char *line = NULL, **aux;<br>char *code = str_trim(next_line(file));    //P* - código do formato<br>char *fileFormat = "pbm";    //Supondo que po formato é "pbm".<br>    <br>do {<br>    line = str_trim(next_line(file));<br>} while (line[0] == "#");    //Possíveis comentátios depois do código.<br>    <br>aux = str_split(line, " ", NULL);    //Largura e altura juntas na mesma linha, separadas por espaço.<br>   <br>int width = atoi(str_trim(aux[0])), height = atoi(str_trim(aux[1]));<br>struct pixel **matrix;    //Dinâmico porque os compiladores tem limite de memória estática.<br>int colorSpace = 1;    //Considerando tipo de imagem PBM (binária) como padrão.<br>char **values;<br>int numBand = 1, size, i = 0, j = 0, k, curIdxPixel = 0;<br>    <br>if (strcmp(code, "P1") != 0) colorSpace = atoi(str_trim(next_line(file)));    //Se o código não for P1 (PBM), então existe especificação do espaço de cores.<br>if (strcmp(code, "P3") == 0) {<br>    numBand = 3;    //Número de bandas ou "subpixels".<br>    fileFormat = "ppm";<br>}<br>else if (strcmp(code, "P2") == 0) fileFormat = "pgm";<br><br>matrix = (struct pixel**) malloc(width*height*sizeof(struct pixel*));<br>        <br>//Instanciando matriz de pixels:<br>for (i = 0; i < height; ++i) {<br>    for (j = 0; j < width; ++j) {<br>        do { <br>            *(matrix + i*width + j) = (struct pixel*) malloc(numBand*sizeof(struct pixel));<br>        } while ((*(matrix + i*width + j))->subPixels == NULL);<br>    }<br>}<br>          <br>i = j = 0;<br>                        <br>//Lendo cada linha restante do arquivo (matriz):<br>while ((line = next_line(file))) {<br>    line =  str_trim(line);    //Lembrar desse trim, pra não considerar o espaço no final da linha como elemento (valor/número).<br>    values = str_split(line, " ", &size);    //size - número de elementos retornados.<br>    <br>    for (k = 0; k < size; k++) {    //Percorrendo elementos da linha atual do arquivo.<br>        (*(matrix + i*width + j))->subPixels[curIdxPixel] = atoi(values[k]);<br>        ++curIdxPixel;<br>          <br>        if (curIdxPixel >= numBand) {    //Agrupando elementos (sub-pixels) no pixel correspondente.<br>            curIdxPixel = 0;<br>            j++;<br>      <br>            if (j >= width) {    //Fim da linha atual da matriz.<br>                j = 0;<br>                i++;<br>            }<br>        }<br>    }<br>}<br><br>fclose(file);<br><br><br><br>//(...)<br><br><br><br>/************************/<br>/* OPERAÇÃO: CONTORNAR: */<br>/************************/<br>int sizeMask = 3, mask[3][3] = {0, 1, 0, 1, -4, 1, 0, 1, 0}, middle = sizeMask/2, l, m;    //Máscara do Laplaciano.<br>struct pixel **newMatrix = (struct pixel**) malloc(width*height*sizeof(struct pixel*));<br>float newValue;<br>    <br>//Não pode ir atualizando a matriz para não interferir em alterações futuras, por isso cria-se uma cópia:<br>for (i = 0; i < height; ++i) {<br>    for (j = 0; j < width; ++j) {<br>        do { <br>            *(newMatrix + i*width + j) = (struct pixel*) malloc(numBand*sizeof(struct pixel));<br>        } while ((*(newMatrix + i*width + j))->subPixels == NULL);<br>        <br>        for (k = 0; k < numBand; ++k) (*(newMatrix + i*width + j))->subPixels[k] = (*(matrix + i*width + j))->subPixels[k];<br>    }<br>}<br>     <br>//Aplicando a filtragem:<br>for (i = 0; i+sizeMask < height; ++i) {<br>    for (j = 0; j+sizeMask < width; ++j) {<br>        for (m = 0; m < numBand; ++m) {    //Para cada sub-pixel.<br>            newValue = 0.0f;<br>    <br>            //Aplicando convolução para encontrar o valor do elemento pivô da matriz com base na máscara do Laplaciano:<br>            for (k = 0; k < sizeMask; ++k) {<br>                for (l = 0; l < sizeMask; ++l) {<br>                    newValue += (float)(*(matrix + (i+k)*width + (j+l)))->subPixels[m] * (float)mask[k][l];<br>                }<br>            }<br>            <br>            //Atualizando o valor do pixel central da imagem em relação ao centro da máscara baseado no local onde esta foi aplicada:<br>            (*(newMatrix + (i+middle)*width + (j+middle)))->subPixels[m] = (int)pow((newValue/4), 2.0);<br>        }<br>    }<br>}<br>       <br>matrix = newMatrix;    //Atualizando a matriz da imagem.<br><br><br><br>//(...)</pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});	

		$(document).on("rightclick", "#destacar", function () {
			$("#nomeModalCode").html("<b> Destacar (C)</b>");
	        $("#conteudoModalCode").html('<pre class="prettyprint linenums">#include < STDIO.H ><br>#include < STDLIB.H ><br>#include < STRING.H ><br>#include < ASSERT.H ><br>#include < CTYPE.H ><br>#include < MATH.H ><br><br><br>struct pixel<br>{<br>    int subPixels[3];    //Considerando o número máximo de subpixels de um pixel.<br>};<br><br>struct line_reader <br>{<br>    /* All members are private. */<br>    FILE    *f;<br>    char    *buf;<br>    size_t   siz;<br>};<br><br>void lr_init(struct line_reader *lr, FILE *f);<br>char *next_line(FILE *file);<br>void lr_free(struct line_reader *lr);<br>char** str_split(char* a_str, const char a_delim, int *size);<br>char* str_trim(char* str);<br><br>/*<br> * Initializes a line reader _lr_ for the stream _f_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C<br> */<br>void lr_init(struct line_reader *lr, FILE *f)<br>{<br>    lr->f = f;<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br> <br>/*<br> * Reads the next line. If successful, returns a pointer to the line,<br> * and sets *len to the number of characters, at least 1. The result is<br> * _not_ a C string; it has no terminating "\0". The returned pointer<br> * remains valid until the next call to next_line() or lr_free() with<br> * the same _lr_.<br> *<br> * next_line() returns NULL at end of file, or if there is an error (on<br> * the stream, or with memory allocation).<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>char *next_line(FILE *file)<br>{<br>    struct line_reader lr;<br>    size_t newsiz;<br>    int c;<br>    char *newbuf;<br>    size_t len;<br> <br>    lr_init(&lr, file);<br>    len = 0;            /* Start with empty line. */<br>    for (;;) {<br>        c = fgetc(lr.f);    /* Read next character. */<br>        if (ferror(lr.f))<br>            return NULL;<br> <br>        if (c == EOF) {<br>            /*<br>             * End of file is also end of last line,<br>        `    * unless this last line would be empty.<br>             */<br>            if (len == 0)<br>                return NULL;<br>            else<br>                return lr.buf;<br>        } else {<br>            /* Append c to the buffer. */<br>            if (len == lr.siz) {<br>                /* Need a bigger buffer! */<br>                newsiz = lr.siz + 4096;<br>                newbuf = realloc(lr.buf, newsiz);<br>                if (newbuf == NULL)<br>                    return NULL;<br>                lr.buf = newbuf;<br>                lr.siz = newsiz;<br>            }<br>            lr.buf[len++] = c;<br> <br>            /* "\n" is end of line. */<br>            if (c == "\n")<br>                return lr.buf;<br>        }<br>    }<br>}<br> <br>/*<br> * Frees internal memory used by _lr_.<br> * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C <br> */<br>void lr_free(struct line_reader *lr)<br>{<br>    free(lr->buf);<br>    lr->buf = NULL;<br>    lr->siz = 0;<br>}<br><br><br>//Split: desmenbramento de uma string baseado em um delimitador char.<br>//Fonte: http://stackoverflow.com/questions/9210528/split-string-with-delimiters-in-c<br>char** str_split(char* a_str, const char a_delim, int *size)<br>{<br>    char** result    = 0;<br>    size_t count     = 0;<br>    char* tmp        = a_str;<br>    char* last_comma = 0;<br>    char delim[2];<br>    delim[0] = a_delim;<br>    delim[1] = 0;<br><br>    /* Count how many elements will be extracted. */<br>    while (*tmp) {<br>        if (a_delim == *tmp) {<br>            count++;<br>            last_comma = tmp;<br>        }<br>        <br>        tmp++;<br>    }<br><br>    /* Add space for trailing token. */<br>    count += last_comma < (a_str + strlen(a_str) - 1);<br><br>    /* Add space for terminating null string so caller knows where the list of returned strings ends. */<br>    count++;<br><br>    result = malloc(sizeof(char*) * count);<br><br>    if (result) {<br>        size_t idx  = 0;<br>        char* token = strtok(a_str, delim);<br><br>        while (token) {<br>            assert(idx < count);<br>            *(result + idx++) = strdup(token);<br>            token = strtok(0, delim);<br>        }<br>        <br>        //assert(idx == count - 1);<br>        *(result + idx) = 0;<br>    }<br>    <br>    if (size != NULL) *size = (int) count-1;<br><br>    return result;<br>}<br><br><br>//Fonte: http://stackoverflow.com/questions/122616/how-do-i-trim-leading-trailing-whitespace-in-a-standard-way<br>char* str_trim(char* str) <br>{<br>    char* beg = str;<br>    char* end = beg + strlen(beg) - 1;<br><br>    while (isspace(*beg)) ++beg;<br>    while (end >= beg && isspace(*end)) --end;<br>    end[1] = 0;<br><br>    return memmove(str, beg, end - beg + 2);<br>}<br><br><br><br>//(...)<br><br><br><br>/**************************************/<br>/* LENDO O ARQUIVO (ppm, pgm ou pbm): */<br>/**************************************/<br>FILE *file = fopen(argv[2], "r");<br>char *line = NULL, **aux;<br>char *code = str_trim(next_line(file));    //P* - código do formato<br>char *fileFormat = "pbm";    //Supondo que po formato é "pbm".<br>    <br>do {<br>    line = str_trim(next_line(file));<br>} while (line[0] == "#");    //Possíveis comentátios depois do código.<br>    <br>aux = str_split(line, " ", NULL);    //Largura e altura juntas na mesma linha, separadas por espaço.<br>   <br>int width = atoi(str_trim(aux[0])), height = atoi(str_trim(aux[1]));<br>struct pixel **matrix;    //Dinâmico porque os compiladores tem limite de memória estática.<br>int colorSpace = 1;    //Considerando tipo de imagem PBM (binária) como padrão.<br>char **values;<br>int numBand = 1, size, i = 0, j = 0, k, curIdxPixel = 0;<br>    <br>if (strcmp(code, "P1") != 0) colorSpace = atoi(str_trim(next_line(file)));    //Se o código não for P1 (PBM), então existe especificação do espaço de cores.<br>if (strcmp(code, "P3") == 0) {<br>    numBand = 3;    //Número de bandas ou "subpixels".<br>    fileFormat = "ppm";<br>}<br>else if (strcmp(code, "P2") == 0) fileFormat = "pgm";<br><br>matrix = (struct pixel**) malloc(width*height*sizeof(struct pixel*));<br>        <br>//Instanciando matriz de pixels:<br>for (i = 0; i < height; ++i) {<br>    for (j = 0; j < width; ++j) {<br>        do { <br>            *(matrix + i*width + j) = (struct pixel*) malloc(numBand*sizeof(struct pixel));<br>        } while ((*(matrix + i*width + j))->subPixels == NULL);<br>    }<br>}<br>          <br>i = j = 0;<br>                        <br>//Lendo cada linha restante do arquivo (matriz):<br>while ((line = next_line(file))) {<br>    line =  str_trim(line);    //Lembrar desse trim, pra não considerar o espaço no final da linha como elemento (valor/número).<br>    values = str_split(line, " ", &size);    //size - número de elementos retornados.<br>    <br>    for (k = 0; k < size; k++) {    //Percorrendo elementos da linha atual do arquivo.<br>        (*(matrix + i*width + j))->subPixels[curIdxPixel] = atoi(values[k]);<br>        ++curIdxPixel;<br>          <br>        if (curIdxPixel >= numBand) {    //Agrupando elementos (sub-pixels) no pixel correspondente.<br>            curIdxPixel = 0;<br>            j++;<br>      <br>            if (j >= width) {    //Fim da linha atual da matriz.<br>                j = 0;<br>                i++;<br>            }<br>        }<br>    }<br>}<br><br>fclose(file);<br><br><br><br>//(...)<br><br><br><br>/***********************/<br>/* OPERAÇÃO: DESTACAR: */<br>/***********************/<br>for (i = 0; i < height; ++i) {<br>    for (j = 0; j < width; ++j) {<br>        for (k = 0; k < numBand; ++k) {    //Para cada sub-pixel.<br>            //Aplicando Filtro Gama (gama = 1.03) em toda a imagem:<br>            (*(matrix + i*width + j))->subPixels[k] = (int)1*pow((*(matrix + i*width + j))->subPixels[k], 1.03);<br>            <br>            //Verificando se o novo valor do pixel excede o valor máximo do espaço de cores:<br>            if ((*(matrix + i*width + j))->subPixels[k] > colorSpace) (*(matrix + i*width + j))->subPixels[k] = colorSpace;<br>        }<br>    }<br>}   <br><br><br><br>//(...)</pre>');
	        prettyPrint();
	        $("#myModalCode").modal();
	        
	        return false;
		});																		
    
	    $(document).on('click', ".imageImg", function () { 
	    	$(".panel-body").removeClass("selecionado");
	    	$(".panel-heading").css('background-color', "#f5f5f5");
	    	$(".panel-heading").css('color', "#000000");
	    	$(".panel-body").css('background-color', "#ffffff");
	    	$(this).find('.panel-body').addClass("selecionado");
			$(this).find('.panel-heading').css('background-color', "#2F4F4F");
			$(this).find('.panel-heading').css('color', "#ffffff");
			$(this).find('.panel-body').css('background-color', "#87CEFA");
		});
		
		$(document).on('click', "#negativar", function () {
			var selectedElement = $(".selecionado");

			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=negativar&file=' + $(selectedElement).find('img').attr('src').split("?")[0],
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});
		
		$(document).on('click', "#binarizar", function () {
			var selectedElement = $(".selecionado");

			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=binarizar&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});
		
		$(document).on('click', "#subtrair", function () {
            var selectedElement = $(".selecionado");
			
			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=subtrair&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});
		
		$(document).on('click', "#somar", function () {
			var selectedElement = $(".selecionado");
			
			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=somar&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});
		
		$(document).on('click', "#converter", function () {
			var selectedElement = $(".selecionado");
			
			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
0
				proccess = "converter";
				$("#nomeModalValue").html("Tons de cor");
				$('#spinnerValue').val(256);
		        $("#obsValue").html('Obs.: Valores limitados entre 1 e 9.007.199.254.740.991');
		        $('#spinnerValue').trigger("touchspin.updatesettings", {min: 1});
		        $("#myModalValue").modal();
			}
		});

		$(document).on('click', "#brilho", function () {
			var selectedElement = $(".selecionado");
			
			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];

				proccess = "brilho";
				$("#nomeModalValue").html("Brilho");
				$('#spinnerValue').val(0);
		        $("#obsValue").html('Obs.: Valores limitados entre -9.007.199.254.740.991 e 9.007.199.254.740.991');
		        $('#spinnerValue').trigger("touchspin.updatesettings", {min: -9007199254740991});
		        $("#myModalValue").modal();
			}
		});		
		
		$(document).on('click', "#expandir", function () {
			var selectedElement = $(".selecionado");
			
			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=expandir&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});	
		
		$(document).on('click', "#equalizar", function () {
			var selectedElement = $(".selecionado");
			
			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=equalizar&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});	
		
		$(document).on('click', "#contornar", function () {
			var selectedElement = $(".selecionado");
			
			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=contornar&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});
        
		$(document).on('click', "#destacar", function () {
			var selectedElement = $(".selecionado");
			
			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=destacar&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});        

		$(document).on('click', "#duplicateFile", function () {
			var selectedElement = $(".selecionado");
			
			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'duplicate.php',
					data: 'number=' + $('#number').val() + '&time=' + $('#time').val() + '&file=' + fileName + '&format=' + $('#format').val(),
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
						
						if (result != null && result != '') {
							$('#images').append($('<div class="col-lg-3 imageImg ampliarImagem"><div class="panel panel-default"><div class="panel-heading text-right"> <b>Imagem ' + parseInt($('#number').val()) + '</b>  <a href="#"><i class="glyphicon glyphicon-remove removerImagem"></i></a></div><div class="panel-body"><img class="imageI centralizar" src="' + result + '"></div></div></div>'));
							$('#number').val(parseInt($('#number').val(), 10)+1);    //Incrementando o contandor de imagens dessa 'sessão'.
						}
						else alert("Erro: falha ao abrir o arquivo especificado!\n\nObservações:\n - Dimensão máxima: 1.000.000 de pixels (largura x altura);\n - Extensões: jpg, jpeg, png, tif, pgm, pbm, ppm.");
					}
				});
    		}
		});
        
		$(document).on('click', "#convertFile", function () {
			var selectedElement = $(".selecionado");
			
			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'convert.php',
					data: 'number=' + $('#number').val() + '&time=' + $('#time').val() + '&file=' + fileName + '&format=' + $('#format').val(),
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
						
						if (result != null && result != '') {
							$('#images').append($('<div class="col-lg-3 imageImg ampliarImagem"><div class="panel panel-default"><div class="panel-heading text-right"> <b>Imagem ' + parseInt($('#number').val()) + '</b>  <a href="#"><i class="glyphicon glyphicon-remove removerImagem"></i></a></div><div class="panel-body"><img class="imageI centralizar" src="' + result + '"></div></div></div>'));
							$('#number').val(parseInt($('#number').val(), 10)+1);    //Incrementando o contandor de imagens dessa 'sessão'.
						}
						else alert("Erro: falha ao abrir o arquivo especificado!\n\nObservações:\n - Dimensão máxima: 1.000.000 de pixels (largura x altura);\n - Extensões: jpg, jpeg, png, tif, pgm, pbm, ppm.");
					}
				});
    		}
		});        
		
		$(document).on('click', "#left90", function () {
			var selectedElement = $(".selecionado");
			
			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=rotacionarEsquerda90&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});
		
		$(document).on('click', "#right90", function () {
			var selectedElement = $(".selecionado");

			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=rotacionarDireita90&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});

		$(document).on('click', "#saveFile", function () {
			var selectedElement = $(".selecionado");

			if (selectedElement[0]) {
				var fileURL = $(selectedElement).find('img').attr('src').split("?")[0], fileName = 'imagem.';
				
				//Fonte: http://muaz-khan.blogspot.com.br/2012/10/save-files-on-disk-using-javascript-or.html

				// for non-IE
			    if (!window.ActiveXObject) {
			        var save = document.createElement('a');
			        save.href = fileURL;
			        save.target = '_blank';
			        save.download = fileName || 'unknown';

			        var event = document.createEvent('Event');
			        event.initEvent('click', true, true);
			        save.dispatchEvent(event);
			        (window.URL || window.webkitURL).revokeObjectURL(save.href);
			    }

			    // for IE
			    else if ( !! window.ActiveXObject && document.execCommand)     {
			        var _window = window.open(fileURL, '_blank');
			        _window.document.close();
			        _window.document.execCommand('SaveAs', true, fileName || fileURL)
			        _window.close();
			    }
			}
		});		
        
		$(document).on('click', "#histogram", function () {
			var selectedElement = $(".selecionado");

			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=histograma&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						var data = jQuery.parseJSON(result);
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
	                    $('#nomeModal').html('<b>Histograma da "' + $(selectedElement).parent().parent().find('.panel-heading').text().trim() + '"</b> <span style="font-size:small;">(formato "' + data['format'] + '", ' + data['colorPerBand'] + ' tons de cor)</span>');
	                    $html = '<div style="width: 100px; height: 100px;"><label><input type="radio" name="mode" value="grouped"> Agrupado</label><br><label><input type="radio" name="mode" value="stacked" checked> Empilhado</label></div>';
	                    
	                    if (data['format'] == 'ppm') $html += '<div style="width: 100px; height: 100px; margin-top: -100px; margin-left: 100px;"><label><input id="redChk" type="checkbox" name="redChk" checked> Red</label><br><label><input id="greenChk" type="checkbox" name="greenChk" checked> Green</label><br><label><input id="blueChk" type="checkbox" name="blueChk" checked> Blue</label></div>';
	                    
	                    $('#conteudoModal').html($html + '<div style="width: 100px; height: 100px; margin-top: -100px; margin-left: 100px;"><input id="pixel" type="text" name="pixel" value="" readonly></div><div id="histogramView"></div><img src="' + $(selectedElement).find('img').attr('src').split("?")[0] + '?number=' + Math.random() + '" class="img-responsive centralizar">');
	                    $('#myModal').modal();
	                    
	                    var n = data['numOfBand'], // number of layers (R, G, B)
	                        m = data['colorPerBand'], // number of samples per layer
	                        colorClassGap = 0,
	                        stack = d3.layout.stack(),
	                        layers = stack(d3.range(n).map(function() { return bumpLayer(); })),
	                        yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
	                        yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });
	                    
	                    var margin = {top: 50, right: 50, bottom: 50, left: 80},
	                        //width = $('#myModal').children().width()*0.98 - margin.left - margin.right,
	                        width = $('#myModal').children().width()*0.98 - margin.right - 10,
	                        height = $(document).height()*0.35 - margin.top - margin.bottom;

	                    var x = d3.scale.ordinal()
	                        .domain(d3.range(m))
	                        .rangeRoundBands([0, width], .08);

	                    var y = d3.scale.linear()
	                        .domain([0, yStackMax])
	                        .range([height, 0]);

	                    var xAxis = d3.svg.axis()
	                        .scale(x)
	                        .tickSize(10)
	                        .tickPadding(3)
	                        .tickValues(d3.range(0, m-1, 10))
	                        .orient("bottom");

	                    var yAxis = d3.svg.axis()
	                        .scale(y)
	                        .orient("left");

	                    var svg = d3.select("#histogramView").append("svg")
	                        .attr("width", width + margin.left + margin.right)
	                        .attr("height", height + margin.top + margin.bottom)
	                      .append("g")
	                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	                    
	                    svg.append("text")      // text label for the x axis
	                        .attr("x", width/2)
	                        .attr("y", height + 30)
	                        .attr("dy", "1em")
	                        .style("text-anchor", "middle")
	                        .text("Tonalidade de Cor");
	                    
	                    svg.append("text")
	                        .attr("transform", "rotate(-90)")
	                        .attr("x", 0 - height/2)
	                        .attr("y", -60)
	                        .attr("dy", "1em")
	                        .style("text-anchor", "middle")
	                        .text("Frequência");
	                    
	                    var layer = svg.selectAll(".layer")
	                        .data(layers)
	                      .enter().append("g")
	                        .attr("class", "layer")
	                        .attr("class", function(d, i) { return band(i); })
	                        .style("fill", function(d, i) { return color(i); });

	                    var rect = layer.selectAll("rect")
	                        .data(function(d) { return d; })
	                      .enter().append("rect")
	                        .attr("x", function(d) { return x(d.x); })
	                        .attr("y", height)
	                        .attr("width", x.rangeBand())
	                        .attr("height", 0);

	                    rect.attr("y", function(d) { return y(d.y0 + d.y); })
	                        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
	                        .attr("index", function(d, i) { return i; })
	                        .attr("value", function(d) { return d.y; });

	                    svg.append("g")
	                        .attr("class", "x axis")
	                        .attr("transform", "translate(0," + height + ")")
	                        .call(xAxis);

	                    svg.append("g")
	                        .attr("class", "y axis")
	                        .attr("transform", "translate(0,0)")
	                        .call(yAxis);

	                    d3.selectAll("input").on("change", change);

	                    $('rect').hover(function () {
	                        $('#pixel').val(($(this).parent().attr('class') + '(' + $(this).attr('index') + ') = ' + $(this).attr('value')).toUpperCase());
	                    });
	                    
	                    $('rect').mouseleave(function () {
	                        $('#pixel').val('');
	                    });

	                    var timeout = setTimeout(function() {
	                      d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
	                    }, 0);

	                    function color(i) {
	                        switch (data['format']) {
	                            case 'ppm': {
	                                switch (i) {
	                                    case 0: return '#ff0000';
	                                    case 1: return '#00ff00';
	                                    case 2: return '#0000ff';
	                                }
	                            } break;
	                            case 'pgm': {
	                                return '#808080';
	                            } break;
	                            default: {    //pbm
	                                switch (i) {
	                                    case 0: return '#000000';
	                                    case 1: return '#ffffff';
	                                }
	                            }
	                        }
	                    }

	                    function band(i) {
	                        switch (data['format']) {
	                            case 'ppm': {
	                                switch (i) {
	                                    case 0: return 'red';
	                                    case 1: return 'green';
	                                    case 2: return 'blue';
	                                }
	                            } break;
	                            case 'pgm': {
	                                return 'gray';
	                            } break;
	                            default: {    //pbm
	                                return 'black';
	                            }
	                        }
	                    }

	                    function change() {
	                      clearTimeout(timeout);
	                      if (this.value === "grouped") transitionGrouped();
	                      else transitionStacked();
	                    }

	                    function transitionGrouped() {
	                      y.domain([0, yGroupMax]);

	                      rect.attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
	                          .attr("width", x.rangeBand() / n)
	                        .attr("y", function(d) { return y(d.y); })
	                          .attr("height", function(d) { return height - y(d.y); });
	                    }

	                    function transitionStacked() {
	                      y.domain([0, yStackMax]);

	                      rect.attr("y", function(d) { return y(d.y0 + d.y); })
	                          .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
	                        .attr("x", function(d) { return x(d.x); })
	                          .attr("width", x.rangeBand());
	                    }

	                    // Inspired by Lee Byron's test data generator.
	                    function bumpLayer() {
	                      var a = [], i;

	                      for (i = 0; i < data['colorPerBand']; ++i) a[i] = data['points'][i+colorClassGap];
	                      colorClassGap += data['colorPerBand'];

	                      return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
	                    }
	                    
	                    $('svg').css('margin-left', '-35px');
	                    $('svg').css('margin-top', '-25px');
	                    
	                    $('#redChk').click(function () {
	                        $('.red').children().toggle();
	                    });
	                    
	                    $('#greenChk').click(function () {
	                        $('.green').children().toggle();
	                    });
	                    
	                    $('#blueChk').click(function () {
	                        $('.blue').children().toggle();
	                    });
					}
				});
    		}
		});        
		
		$(document).on('click', "#filtrar", function () {
			var selectedElement = $(".selecionado");

			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];

				if (fileName != null && fileName != '') $('#myModalMask').modal();
			}
		});
		
		$(document).on('click', "#sendMask", function () {
			var selectedElement = $(".selecionado");
			
			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				var mask = [];

				$("#mask tr").each(function() {
				    var arrayOfThisRow = [];
				    var tableData = $(this).find('td');
				    
				    if (tableData.length > 0) {
				        tableData.each(function() { 
				        	arrayOfThisRow.push($(this).find('input').val()); 
				        });
				        mask.push(arrayOfThisRow);
				    }
				});
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=filtrar&mask=' + JSON.stringify(mask) + '&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});			
			}
		});

		$(document).on('click', "#proccess", function () {
			var selectedElement = $(".selecionado");
			
			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				if (proccess == "converter") {
					$.ajax({
						type: 'POST',
						url: 'operations.php',
						data: 'operation=converter&value=' + $('#spinnerValue').val() + '&file=' + fileName,
						beforeSend: function () {
							$(selectedElement).find('img').attr('src', 'img/loader.gif');
						},
						cache: false,
						success: function(result) {
							$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
						}
					});			
				}
				else if (proccess == "brilho") {
					$.ajax({
						type: 'POST',
						url: 'operations.php',
						data: 'operation=brilho&value=' + $('#spinnerValue').val() + '&file=' + fileName,
						beforeSend: function () {
							$(selectedElement).find('img').attr('src', 'img/loader.gif');
						},
						cache: false,
						success: function(result) {
							$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
						}
					});						
				}
			}
		});		

		$(document).on('click', "#extractRed", function () {
			var selectedElement = $(".selecionado");

			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=extrairVermelho&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});

		$(document).on('click', "#extractGreen", function () {
			var selectedElement = $(".selecionado");

			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=extrairVerde&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});		

		$(document).on('click', "#extractBlue", function () {
			var selectedElement = $(".selecionado");

			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=extrairAzul&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});

		$(document).on('click', "#removeRed", function () {
			var selectedElement = $(".selecionado");

			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=removerVermelho&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});

		$(document).on('click', "#removeGreen", function () {
			var selectedElement = $(".selecionado");

			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=removerVerde&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});		

		$(document).on('click', "#removeBlue", function () {
			var selectedElement = $(".selecionado");

			if (selectedElement[0]) {
				var fileName = $(selectedElement).find('img').attr('src').split("?")[0];
				
				$.ajax({
					type: 'POST',
					url: 'operations.php',
					data: 'operation=removerAzul&file=' + fileName,
					beforeSend: function () {
						$(selectedElement).find('img').attr('src', 'img/loader.gif');
					},
					cache: false,
					success: function(result) {
						$(selectedElement).find('img').attr('src', fileName + '?number=' + Math.random());
					}
				});
			}
		});		
	
		$(document).on('rightclick', ".ampliarImagem", function () {
			var element = $(this);
			
			$('#nomeModal').html('<b>' + $(element).find('.panel-heading').text() + '</b>');
	        $('#conteudoModal').html('<img src="' + $(element).find('img').attr('src').split("?")[0] + '?number=' + Math.random() + '" class="img-responsive centralizar">');       	
	        $('#myModal').modal();
	        return false;
		});
		
		$(document).on('click', ".removerImagem", function () {
			var elementToRemove = $(this).parent().parent().parent().parent();
			
			$.post('remove.php', {file: $(elementToRemove).find('img').attr('src').split("?")[0]})
				.success(function(fileName) {
					if (fileName != null && fileName != '') {
						$(elementToRemove).remove();
					}
				}
			); 
		});
		
		$('#spinnerMask').change(function () {
		    var dimension = $('#spinnerMask').val();
		    	
			$('#mask').empty();
		    	
			for (var i = 0; i < dimension; i++) {
		    	var newRow = '<tr>';
		    	
		    	for (var j = 0; j < dimension; j++) {
		    		newRow += '<td><input type="text" class="col-lg-12" value="1"/></td>';
		    	}
		    	
		    	$('#mask').append(newRow + '</tr>');
			}
		});

		$(document).ready(function()
		{
			var client = new ZeroClipboard($("#copyCode"));
			
			client.on( "copy", function (event) {
			  var clipboard = event.clipboardData;
			  clipboard.setData( "text/plain", $($('#conteudoModalCode').html().replace(/<\/li>/gi, "\n")).text());
			});

            $('#formatos > li').click(function () {
                $('#formatos > li').removeClass('formato_selecionado');
                $(this).addClass('formato_selecionado');
                $('#format').attr('value', $(this).find('a').attr('name'));
            });
            
            $('#formatos > li').click();
            
			$("input[name='spinnerMask']").TouchSpin({});

		    $("input[name='spinnerValue']").TouchSpin({});
			
			$("body").dblclick(function () {
				$(".panel-heading").removeClass("selecionado");
		    	$(".panel-heading").css('background-color', "#f5f5f5");
		    	$(".panel-heading").css('color', "#000000");
		    	$(".panel-body").css('background-color', "#ffffff");
			});		
			
			$("#openFile").click(function(){
			    $("#fileUpload").click();
			});
			
			$("#fileUpload").change(function(){
				$.ajax({
					url: 'upload_image.php',
					type: 'POST',//					data: new FormData($('#form_upload_image')[0], $('#form_upload_image')[1], $('#form_upload_image')[2], $('#formatos > li.formato_selecionado:first').find('a').attr('name')),
					data: new FormData($('#form_upload_image')[0], $('#form_upload_image')[1], $('#form_upload_image')[2], $('#form_upload_image')[3]),
					cache: false,
					processData: false,
					contentType: false,
					success: function(fileName) {
						if (fileName != null && fileName != '') {
							$('#images').append($('<div class="col-lg-3 imageImg ampliarImagem"><div class="panel panel-default"><div class="panel-heading text-right"> <b>Imagem ' + parseInt($('#number').val()) + '</b>  <a href="#"><i class="glyphicon glyphicon-remove removerImagem"></i></a></div><div class="panel-body"><img class="imageI centralizar" src="' + fileName + '" height="auto" width="auto"></div></div></div>'));
							$('#number').val(parseInt($('#number').val(), 10)+1);    //Incrementando o contandor de imagens dessa 'sessão'.
						}
						else alert("Erro: falha ao abrir o arquivo especificado!\n\nObservações:\n - Dimensão máxima: 1.000.000 de pixels (largura x altura);\n - Extensões: jpg, jpeg, png, tif, pgm, pbm, ppm.");
					}
				});
				
				$("#fileUpload").val("");
			});
			
			$("#logout").click(function(){
				$.ajax({
					url: 'logout.php',
					type: 'POST',
					data: new FormData($('#form_upload_image')[0], $('#form_upload_image')[1], $('#form_upload_image')[2]),
					cache: false,
					processData: false,
					contentType: false,
					success: function() {
						$('#images').empty();
						$('#number').val(0);
					}
				}); 
			});
			
	        window.onbeforeunload = function(e) {
	        	$("#logout").click();
	        	//var e = e || window.event;
			    // For IE and Firefox
			    //if (e) e.returnValue = 'Você está saindo da página; caso prossiga, todas as informações dessa sessão serão perdidas!';
			    // For Safari
			    //return 'Você está saindo da página; caso prossiga, todas as informações dessa sessão serão perdidas!';
			};
		});