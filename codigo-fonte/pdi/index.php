<?php
	//Descomente para habilitar a exibição de erros do PHP:
	//ini_set('display_errors', 1); ini_set('log_errors', 1); ini_set('error_log', dirname(__FILE__) . '/error_log.txt'); error_reporting(E_ALL);
?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>PDI - Processamento Digital de Imagens (TP Final)</title>

    <!-- Bootstrap Core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Morris Charts CSS -->
    <link href="css/plugins/morris.css" rel="stylesheet">
    
    <!-- Custom Fonts -->
    <link href="font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    
    <link href="http://hayageek.github.io/jQuery-Upload-File/uploadfile.min.css" rel="stylesheet">
    <!--<link href="http://google-code-prettify.googlecode.com/svn/trunk/src/prettify.css" type="text/css" rel="stylesheet"/>-->
    <link href="css/prettify.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="css/sb-admin.css" rel="stylesheet">
    
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
	<script src="http://hayageek.github.io/jQuery-Upload-File/jquery.uploadfile.min.js"></script>
	
	<!-- jQuery -->
    <script src="js/jquery.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="js/bootstrap.js"></script>
	
	<script src="api/bootstrap-touchspin-master/src/jquery.bootstrap-touchspin.js"></script>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
    <script src="js/prettify.js"></script>
    <script src="api/zeroclipboard-master/dist/ZeroClipboard.js"></script>
    <!--<script src="http://google-code-prettify.googlecode.com/svn/trunk/src/prettify.js" type="text/javascript"></script>-->
</head>

<body style="zoom: 80%">
    <div id="wrapper">

        <!-- Navigation -->
        <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="index.php">PDI</a>
            </div>
            <!-- Top Menu Items -->
            <!--<ul class="nav navbar-right top-nav">	
                <li class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-paperclip"></i> Arquivo<b class="caret"></b></a>
                    <ul class="dropdown-menu">
                    </ul>
                </li>
            </ul>-->
            <ul class="nav navbar-right top-nav">
                <li>
                	<a id="openFile" title="Abrir imagem"><i class="glyphicon glyphicon-folder-open"></i></a>
                </li>
                <li>
                	<a id="saveFile" title="Salvar imagem"><i class="glyphicon glyphicon-floppy-disk"></i></a>
                </li>
                <li>
                	<a id="duplicateFile" title="Duplicar imagem"><i class="glyphicon glyphicon-duplicate"></i></a>
                </li>
                <li>
                	<a id="convertFile" title="Converter formato da imagem"><i class="glyphicon glyphicon-retweet"></i></a>
                </li>                
                <li>
                    <a id="left90" title="Rotacionar 90º p/ esquerda"><i class="glyphicon glyphicon-arrow-left"></i></a>
                </li>
                <li>
                    <a id="right90" title="Rotacionar 90º p/ direita"><i class="glyphicon glyphicon-arrow-right"></i></a>
                </li>
                <li>
                    <a id="histogram" title="Histograma"><i class="glyphicon glyphicon-stats"></i></a>
                </li>
                <li class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-picture">Formato</i> <b class="caret"></b></a>
                    <ul id="formatos" class="dropdown-menu">
                        <li>
                            <a title="Portable BitMap" name="pbm">PBM (preto e branco)</a>
                        </li>
                        <li>
                            <a title="Portable GrayMap" name="pgm">PGM (tons de cinza)</a>
                        </li>                        
                        <li>
                            <a title="Portable PixMap" name="ppm">PPM (tons de RGB)</a>
                        </li>                        
                    </ul>
                </li>                
                <li>
                	<a id="logout" title="Sair da sessão (remover todas as imagens)"><i class="glyphicon glyphicon-log-out"></i></a>
                </li>
            </ul>
            <!-- Sidebar Menu Items - These collapse to the responsive navigation menu on small screens -->
            <div class="collapse navbar-collapse navbar-ex1-collapse">
                <ul class="nav navbar-nav side-nav" style="width: 8%;">
                    <li>
                        <a id="negativar" role="button" tabindex="0" title="Processar o negativo da imagem"><i class="glyphicon glyphicon-random"></i> Negativar</a>
                    </li>
                    <li>
                        <a id="binarizar" role="button" tabindex="0" title="Binarizar a imagem"><i class="glyphicon glyphicon-adjust"></i> Binarizar</a>
                    </li>
                    <li>
                        <a id="filtrar" role="button" tabindex="0" title="Filtra a imagem com uso de máscara"><i class="glyphicon glyphicon-filter"></i> Filtrar</a>
                    </li>
                    <li>
                        <a id="converter" role="button" tabindex="0" title="Converter o espaço de tons de cor da imagem"><i class="glyphicon glyphicon-signal"></i> Converter</a>
                    </li>           
                    <li>
                        <a id="equalizar" role="button" tabindex="0" title="Equalizar tons de cor da imagem"><i class="glyphicon glyphicon-equalizer"></i> Equalizar</a>
                    </li>
                    <li>
                        <a id="contornar" role="button" tabindex="0" title="Extrair contorno de bordas da imagem (Laplaciano)"><i class="glyphicon glyphicon-road"></i> Contornar</a>
                    </li>
                    <li>
                        <a id="destacar" role="button" tabindex="0" title="Destacar contorno de bordas da imagem (Filtro Gama)"><i class="glyphicon glyphicon-eye-open"></i> Destacar</a>
                    </li>
                    <li>
                        <a id="brilho" role="button" tabindex="0" title="Diminuir/Aumentar tons de cor da imagem (brilho)"><i class="glyphicon glyphicon-asterisk"></i> Brilho</a>
                    </li>
                    <li>
                        <a id="escala" role="button" tabindex="0" title="Diminuir/Aumentar tamanho da imagem"><i class="glyphicon glyphicon-resize-full"></i> Escala</a>
                    </li>                    
                    <li>
                        <a id="extrair" href="javascript:;" data-toggle="collapse" data-target="#data-extrair" title="Extrair banda de cor da imagem"><i class="glyphicon glyphicon-share"></i> Extrair <i class="fa fa-fw fa-caret-down"></i></a>
                        <ul id="data-extrair" class="collapse">
                            <li>
                                <a id="extractRed">Vermelho</a>
                            </li>
                            <li>
                                <a id="extractGreen">Verde</a>
                            </li>
                            <li>
                                <a id="extractBlue">Azul</a>
                            </li>                                          
                        </ul>
                    </li>
                    <li>
                        <a id="remover" href="javascript:;" data-toggle="collapse" data-target="#data-remover" title="Remover banda de cor da imagem"><i class="glyphicon glyphicon-eye-close"></i> Remover <i class="fa fa-fw fa-caret-down"></i></a>
                        <ul id="data-remover" class="collapse">
                            <li>
                                <a id="removeRed">Vermelho</a>
                            </li>
                            <li>
                                <a id="removeGreen">Verde</a>
                            </li>
                            <li>
                                <a id="removeBlue">Azul</a>
                            </li>                                          
                        </ul>
                    </li>                                        
                    <li>
                        <a id="combinar" href="javascript:;" data-toggle="collapse" data-target="#data-combinar" title="Somar/Subtrair/Dividir/Multiplicar duas imagens"><i class="glyphicon glyphicon-refresh"></i> Combinar <i class="fa fa-fw fa-caret-down"></i></a>
                        <ul id="data-combinar" class="collapse">
                            <li>
                                <a>Somar</a>
                            </li>
                            <li>
                                <a>Subtrair</a>
                            </li>
                            <li>
                                <a>Dividir</a>
                            </li>
                            <li>
                                <a>Multiplicar</a>
                            </li>                                                        
                        </ul>
                    </li>                                        
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </nav>

        <div id="page-wrapper">
        	<form id="form_upload_image" action='' method="POST" enctype="multipart/form-data" style="display: none;">
       			<input id="fileUpload" type="file" name="fileUpload"/>
       			<input id="time" type="text" name="time" value=<?php echo time();  ?>/>
       			<input id="number" type="text" name="number" value=0/>
                <input id="format" type="text" name="format"/>
       			<input id="submit_upload" type="submit"/>
       		</form>
       		
            <div class="container-fluid">
                <div id="images" class="row">
                </div>
                <!-- /.row -->

            </div>
            <!-- /.container-fluid -->

        </div>
        <!-- /#page-wrapper -->
        
		<!-- Modal da imagem -->
		<div class="modal fade bs-example-modal-lg" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="nomeModal"></h4>
					</div>
											
					<div id="conteudoModal" class="modal-body"></div>
											    
					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Modal da máscara -->
		<div class="modal fade bs-example-modal-lg" id="myModalMask" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="nomeModalMask">Máscara de filtro</h4>
					</div>
											
					<div id="conteudoModalMask" class="modal-body">
						<b>Dimensão da máscara (matriz quadrada): </b> <input id="spinnerMask" readonly type="text" value="3" name="spinnerMask" data-bts-min="1" data-bts-max="100" data-bts-init-val="" data-bts-step="1" data-bts-decimal="1" data-bts-step-interval="100" data-bts-force-step-divisibility="round" data-bts-step-interval-delay="500" data-bts-prefix="" data-bts-postfix="" data-bts-prefix-extra-class="" data-bts-postfix-extra-class="" data-bts-booster="true" data-bts-boostat="10" data-bts-max-boosted-step="false" data-bts-mousewheel="true" data-bts-button-down-class="btn btn-default" data-bts-button-up-class="btn btn-default">
						<br>
						<b>Máscara: </b>
						<div class="table-responsive">
							<table class="col-md-12 table-bordered table-striped table-condensed cf">
								<tbody id="mask">
									<tr>
										<td><input type="text" class="col-lg-12" value="1" /></td>
										<td><input type="text" class="col-lg-12" value="1" /></td>
										<td><input type="text" class="col-lg-12" value="1" /></td>
									</tr>
									<tr>
										<td><input type="text" class="col-lg-12" value="1" /></td>
										<td><input type="text" class="col-lg-12" value="1" /></td>
										<td><input type="text" class="col-lg-12" value="1" /></td>
									</tr>
									<tr>
										<td><input type="text" class="col-lg-12" value="1" /></td>
										<td><input type="text" class="col-lg-12" value="1" /></td>
										<td><input type="text" class="col-lg-12" value="1" /></td>
									</tr>
								</tbody>														
							</table>
						</div>
					</div>
											    
					<div class="modal-footer">
						<button id="sendMask" type="button" class="btn btn-default" data-dismiss="modal">Processar</button>
						<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
					</div>
				</div>
			</div>
    	</div>

    	<!-- Modal de formulário -->
		<div class="modal fade bs-example-modal-lg" id="myModalForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="nomeModalForm"></h4>
					</div>
											
					<div id="conteudoModalForm" class="modal-body"></div>
											    
					<div class="modal-footer">
						<button id="sendMask" type="button" class="btn btn-default" data-dismiss="modal">Processar</button>
						<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
					</div>
				</div>
			</div>			
		</div>

		<!-- Modal de código -->
		<div class="modal fade bs-example-modal-lg" id="myModalCode" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="nomeModalCode"></h4>
					</div>
											
					<div id="conteudoModalCode" class="modal-body"></div>
											    
					<div class="modal-footer">
						<button id="copyCode" type="button" class="btn btn-default">Copiar</button>
						<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
					</div>
				</div>
			</div>			
		</div>

    	<!-- Modal de valores -->
		<div class="modal fade bs-example-modal-lg" id="myModalValue" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="nomeModalValue"></h4>
					</div>
											
					<div id="conteudoModalValue" class="modal-body">
						<input id="spinnerValue" type="text" value="" name="spinnerValue" data-bts-min="-9007199254740991" data-bts-max="9007199254740991" data-bts-init-val="" data-bts-step="1" data-bts-decimal="1" data-bts-step-interval="100" data-bts-force-step-divisibility="round" data-bts-step-interval-delay="500" data-bts-prefix="" data-bts-postfix="" data-bts-prefix-extra-class="" data-bts-postfix-extra-class="" data-bts-booster="true" data-bts-boostat="10" data-bts-max-boosted-step="false" data-bts-mousewheel="true" data-bts-button-down-class="btn btn-default" data-bts-button-up-class="btn btn-default">
						<br>
						<div id="obsValue"></div>
					</div>
											    
					<div class="modal-footer">
						<button id="proccess" type="button" class="btn btn-default" data-dismiss="modal">Processar</button>
						<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
					</div>
				</div>
			</div>			
		</div>		
    <!-- /#wrapper -->
    
    <script>
    	$.getScript("js/operations.js");
    </script>
</body>

</html>
