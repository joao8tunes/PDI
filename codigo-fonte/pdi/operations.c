#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <ctype.h>
#include <math.h>


struct pixel
{
	int subPixels[3];    //Considerando o número máximo de subpixels de um pixel.
};

struct line_reader 
{
	/* All members are private. */
	FILE	*f;
	char	*buf;
	size_t	 siz;
};

void lr_init(struct line_reader *lr, FILE *f);
char *next_line(FILE *file);
void lr_free(struct line_reader *lr);
char** str_split(char* a_str, const char a_delim, int *size);
char* str_trim(char* str);



int main (int argc, char *argv[])
{
    if (argc < 3 || argc > 4) {
        printf("\n\tERRO: parâmetros inválidos!\n\tUso: ./operations [operacao] [imagem_entrada] {mascara}\n\t - [operacao] = negativar|filtrar|binarizar|equalizar|contornar|rotacionarEsquerda90|rotacionarDireita90|destacar|histograma\n\t - [imagem_entrada] = *.pbm|*.pgm|*.ppm\n\t - {mascara} (opcional) = int,int,...,int\n\n");
    }
    else {    //Restaurando a matriz para a memória antes de verificar qual a operação. Supondo que a operação exista e esse processo não seja feito sem motivo.
        //LENDO O ARQUIVO:
        FILE *file = fopen(argv[2], "r");
        char *line = NULL, **aux;
        char *code = str_trim(next_line(file));    //P* - código do formato
        char *fileFormat = "pbm";    //Supondo que po formato é 'pbm'.
            
        do {
	        line = str_trim(next_line(file));
        } while (line[0] == '#');    //Possíveis comentátios depois do código.
            
        aux = str_split(line, ' ', NULL);    //Largura e altura juntas na mesma linha, separadas por espaço.

        int width = atoi(str_trim(aux[0])), height = atoi(str_trim(aux[1]));
        struct pixel **matrix;    //Dinâmico porque os compiladores tem limite de memória estática.
        int colorSpace = 1;    //Considerando tipo de imagem PBM (binária) como padrão.
        char **values;
        int numBand = 1, size, i = 0, j = 0, k, curIdxPixel = 0;
            
        if (strcmp(code, "P1") != 0) colorSpace = atoi(str_trim(next_line(file)));    //Se o código não for P1 (PBM), então existe especificação do espaço de cores.
        if (strcmp(code, "P3") == 0) {
            numBand = 3;    //Número de bandas ou "subpixels".
            fileFormat = "ppm";
        }
        else if (strcmp(code, "P2") == 0) fileFormat = "pgm";
        
        matrix = (struct pixel**) malloc(width*height*sizeof(struct pixel*));
        
        //Instanciando matriz de pixels:
        for (i = 0; i < height; ++i) {
			for (j = 0; j < width; ++j) {
			    do { 
                    *(matrix + i*width + j) = (struct pixel*) malloc(numBand*sizeof(struct pixel));
                } while ((*(matrix + i*width + j))->subPixels == NULL);
			}
		}

        i = j = 0;
        			    
        //Lendo cada linha restante do arquivo (matriz):
        while ((line = next_line(file))) {
            line =  str_trim(line);    //Lembrar desse trim, pra não considerar o espaço no final da linha como elemento (valor/número).
            values = str_split(line, ' ', &size);    //size - número de elementos retornados.

            for (k = 0; k < size; k++) {    //Percorrendo elementos da linha atual do arquivo.
                (*(matrix + i*width + j))->subPixels[curIdxPixel] = atoi(values[k]);
                ++curIdxPixel;
                
                if (curIdxPixel >= numBand) {    //Agrupando elementos (sub-pixels) no pixel correspondente.
                    curIdxPixel = 0;
                    j++;

                    if (j >= width) {    //Fim da linha atual da matriz.
                        j = 0;
                        i++;
                    }
                }
            }
        }
        
        fclose(file);
    
        //REALIZANDO OPERAÇÕES:
        if (strcmp(argv[1], "negativar") == 0) {
            for (i = 0; i < height; ++i) {    //Lendo a matriz linha a linha.
			    for (j = 0; j < width; ++j) {    //Lendo a matriz coluna a coluna.
                    //Para cada sub-pixel, inverte (negativa) seu valor com base no espaço de cores definido no arquivo.
                    for (k = 0; k < numBand; ++k) {    
				        (*(matrix + i*width + j))->subPixels[k] = colorSpace - (*(matrix + i*width + j))->subPixels[k];
                    }
			    }
    		}
        }
        else if (strcmp(argv[1], "filtrar") == 0) {
            if (argc != 4) {
                printf("\n\tERRO: parâmetros inválidos; esperava a mascara do filtro!");
                return 0;
            }
            
            aux = str_split(argv[3], ',', &size);    //A máscara (matriz) via Javascript vem no formato '1,1,...,1'; assim, desmenbra e restitui a máscara em C.
            size = sqrt(size);    //Dimensão da máscara.
            int mask[size][size], middle = size/2, l, m;
            float newValue, sum = 0.0f;
            
            k = 0;
            
            //Recuperando a máscara e calculando sua soma:
            for (i = 0; i < size; ++i) {
                for (j = 0; j < size; ++j) {
                    mask[i][j] = atoi(aux[k++]);    //Convertendo valores da matriz em números inteiros.
                    sum += mask[i][j];
                }
            }
            
            //Aplicando a filtragem (convolução):
		    for (i = 0; i+size < height; ++i) {
			    for (j = 0; j+size < width; ++j) {
                    for (m = 0; m < numBand; ++m) {    //Cálculo para cada subpixel.
                        newValue = 0.0;

                        //Processamento realizado com base na máscara:
                        for (k = 0; k < size; ++k) {
                            for (l = 0; l < size; ++l) {
                                newValue += (*(matrix + (i+k)*width + (j+l)))->subPixels[m] * mask[k][l];
                            }
                        }

                        //Atualizando o valor do pixel central da imagem em relação ao centro da máscara baseado no local onde esta foi aplicada:
                        (*(matrix + (i+middle)*width + (j+middle)))->subPixels[m] = (int)(newValue / sum);
                    }
			    }
		    }
        }
        else if (strcmp(argv[1], "binarizar") == 0) {
            int middle = colorSpace/2;
            
		    for (i = 0; i < height; ++i) {
			    for (j = 0; j < width; ++j) {
                    for (k = 0; k < numBand; ++k) {    //Cálculo para cada subpixel.
                        //Verificando se o pixel corresponde à cor preto (valor mínimo do espaço de cores) ou á cor branco (valor máximo):
                        if ((*(matrix + i*width + j))->subPixels[k] > middle) (*(matrix + i*width + j))->subPixels[k] = colorSpace;
                        else (*(matrix + i*width + j))->subPixels[k] = 0;
                    }
			    }
		    }            
        }        
        else if (strcmp(argv[1], "equalizar") == 0) {
            struct pixel **newMatrix = (struct pixel**) malloc(width*height*sizeof(struct pixel*));
		    int numberOfPixels = width*height, idx;
		    float pr[colorSpace][numBand];
		
		    for (idx = 0; idx < colorSpace; ++idx) {    //Para cada índice (intensidade de cor do espaço de cores), verifica sua frequência de incidência na matriz da imagem.
		        for (k = 0; k < numBand; ++k) {    //Cálculo para cada subpixel.
		            pr[idx][k] = 0.0f;    //Inicializando contador.
		
                    //Calculando a frequência de ocorrência de cada tonalidade de cor (espaço de cores) para todos os pixels da imagem:
			        for (i = 0; i < height; ++i) {
				        for (j = 0; j < width; ++j) {
					        if ((*(matrix + i*width + j))->subPixels[k] == idx) ++pr[idx][k];
				        }
			        }
			
			        pr[idx][k] = (float)(pr[idx][k]/numberOfPixels);    //Cálculo da porcentagem.
			        if (idx > 0) pr[idx][k] += pr[idx-1][k];    //Acumulando resultados para a próxima etapa da equalização.
			    }
		    }
		
		    //Não pode ir atualizando a matriz para não interferir em alterações futuras, por isso cria-se uma cópia:
		    for (i = 0; i < height; ++i) {
				for (j = 0; j < width; ++j) {
				    do { 
                        *(newMatrix + i*width + j) = (struct pixel*) malloc(numBand*sizeof(struct pixel));
                    } while ((*(newMatrix + i*width + j))->subPixels == NULL);
                    
                    for (k = 0; k < numBand; ++k) (*(newMatrix + i*width + j))->subPixels[k] = (*(matrix + i*width + j))->subPixels[k];
				}
			}
		
		    for (idx = 0; idx < colorSpace; ++idx) {
		        for (k = 0; k < numBand; ++k) {    //Cálculo para cada subpixel.
			        pr[idx][k] = (int)((colorSpace-1)*pr[idx][k]);    //Calculando o novo valor da tonalidade do pixel com base na porcentagem calculada.
			
                    //Atualizando os valores dos pixels na matriz auxiliar:
			        for (i = 0; i < height; ++i) {
				        for (j = 0; j < width; ++j) {
					        if ((*(matrix + i*width + j))->subPixels[k] == idx) (*(newMatrix + i*width + j))->subPixels[k] = pr[idx][k];
				        }
			        }
			    }
		    }
		
		    matrix = newMatrix;    //Atualizando a matriz da imagem.
        }        
        else if (strcmp(argv[1], "contornar") == 0) {    //Laplaciano.
            int sizeMask = 3, mask[3][3] = {0, 1, 0, 1, -4, 1, 0, 1, 0}, middle = sizeMask/2, l, m;    //Máscara do Laplaciano.
            struct pixel **newMatrix = (struct pixel**) malloc(width*height*sizeof(struct pixel*));
            float newValue;
            
		    //Não pode ir atualizando a matriz para não interferir em alterações futuras, por isso cria-se uma cópia:
		    for (i = 0; i < height; ++i) {
				for (j = 0; j < width; ++j) {
				    do { 
                        *(newMatrix + i*width + j) = (struct pixel*) malloc(numBand*sizeof(struct pixel));
                    } while ((*(newMatrix + i*width + j))->subPixels == NULL);
                    
                    for (k = 0; k < numBand; ++k) (*(newMatrix + i*width + j))->subPixels[k] = (*(matrix + i*width + j))->subPixels[k];
				}
			}
		
		    //Aplicando a filtragem:
		    for (i = 0; i+sizeMask < height; ++i) {
			    for (j = 0; j+sizeMask < width; ++j) {
			        for (m = 0; m < numBand; ++m) {    //Para cada sub-pixel.
				        newValue = 0.0f;
				
                        //Aplicando convolução para encontrar o valor do elemento pivô da matriz com base na máscara do Laplaciano:
				        for (k = 0; k < sizeMask; ++k) {
					        for (l = 0; l < sizeMask; ++l) {
						        newValue += (float)(*(matrix + (i+k)*width + (j+l)))->subPixels[m] * (float)mask[k][l];
					        }
				        }
				        
                        //Atualizando o valor do pixel central da imagem em relação ao centro da máscara baseado no local onde esta foi aplicada:
				        (*(newMatrix + (i+middle)*width + (j+middle)))->subPixels[m] = (int)pow((newValue/4), 2.0);
				    }
			    }
		    }
		
		    matrix = newMatrix;    //Atualizando a matriz da imagem.
        }        
        else if (strcmp(argv[1], "rotacionarEsquerda90") == 0) {
            struct pixel **rotateMatrix = (struct pixel**) malloc(height*width*sizeof(struct pixel*));

            //Como vai rotacionar 90º, largura vira altura e vice-versa para a nova imagem:
            //Prenche a nova imagem com os valores da imagem original, percorrendo a nova imagem de coluna em coluna começando do início, a partir da última linha até a primeira.
		    for (i = 0; i < height; ++i) {    //Largura da nova imagem.
			    for (j = width-1; j >= 0; --j) {    //Altura da nova imagem.
    			    (*(rotateMatrix + j*width + i)) = (*(matrix + i*width + (height-1-j)));
			    }
		    }

		    matrix = rotateMatrix;    //Atualizando a matriz da imagem.
		    int aux = width;
		    width = height;
		    height = aux;        
        }   
        else if (strcmp(argv[1], "rotacionarDireita90") == 0) {
            struct pixel **rotateMatrix = (struct pixel**) malloc(height*width*sizeof(struct pixel*));
        
            //Como vai rotacionar 90º, largura vira altura e vice-versa para a nova imagem:
            //Preenche a nova imagem com os valores da imagem original, percorrendo a nova imagem de coluna em coluna começando do fim, a partir da primeira linha até a última.
		    for (i = 0; i < width; ++i) {    //Altura da nova imagem.
			    for (j = 0; j < height; ++j) {    //Largura da nova imagem.
			        (*(rotateMatrix + i*width + height-1-j)) = (*(matrix + j*width + i));
			    }
		    }
		
		    matrix = rotateMatrix;    //Atualizando a matriz da imagem.
		    int aux = width;
		    width = height;
		    height = aux;
        }
        else if (strcmp(argv[1], "destacar") == 0) {    //Filtro Gama.
            for (i = 0; i < height; ++i) {
			    for (j = 0; j < width; ++j) {
                    for (k = 0; k < numBand; ++k) {    //Para cada sub-pixel.
                        //Aplicando Filtro Gama (gama = 1.03) em toda a imagem:
                        (*(matrix + i*width + j))->subPixels[k] = (int)1*pow((*(matrix + i*width + j))->subPixels[k], 1.03);
                        
                        //Verificando se o novo valor do pixel excede o valor máximo do espaço de cores:
                        if ((*(matrix + i*width + j))->subPixels[k] > colorSpace) (*(matrix + i*width + j))->subPixels[k] = colorSpace;
                    }
			    }
		    }			
        }           
        else if (strcmp(argv[1], "histograma") == 0) {
            int idx;
            struct pixel pr[colorSpace];
            
            for (idx = 0; idx < colorSpace; ++idx) {    //Para cada índice (intensidade de cor do espaço de cores), verifica sua frequência de incidência na matriz da imagem.                
                for (k = 0; k < numBand; ++k) {    //Para cada sub-pixel.
                    pr[idx].subPixels[k] = 0;    //Inicializando contador para a faixa de banda 'k'.

                    //Calculando frequência de cada tonalidade de cor para cada faixa de banda de cor:
                    for (i = 0; i < height; ++i) {
                        for (j = 0; j < width; ++j) {
                            if ((*(matrix + i*width + j))->subPixels[k] == idx) ++pr[idx].subPixels[k];
                        }
                    }
                }
		    }
		    
            //Retornando um arquivo JSON para o PHP:
		    printf("{\"format\":\"%s\", \"numOfBand\":%d, \"colorPerBand\":%d, \"points\":[", fileFormat, numBand, colorSpace);
            printf("%d", pr[0].subPixels[0]);
		    
		    for (k = 1; k < numBand; ++k) {
		        printf(",%d", pr[0].subPixels[k]);
		    }
		    
		    for (idx = 1; idx < colorSpace; ++idx) {
		        for (k = 0; k < numBand; ++k) {
		            printf(",%d", pr[idx].subPixels[k]);
		        }
		    }
		    printf("]}");
		    return 0;
        }
        else if (strcmp(argv[1], "extrairVermelho") == 0) {
            if (numBand == 3) {    //Processamento específico para imagens PPM (RGB).
                for (i = 0; i < height; ++i) {    //Lendo a matriz linha a linha.
                    for (j = 0; j < width; ++j) {    //Lendo a matriz coluna a coluna.
                        (*(matrix + i*width + j))->subPixels[1] = 0;    //Zera (extrai) todos os subpixels da cor verde (índice 1).
                        (*(matrix + i*width + j))->subPixels[2] = 0;    //Zera (extrai) todos os subpixels da cor azul (índice 2).
                    }
                }                
            }
        }
        else if (strcmp(argv[1], "extrairVerde") == 0) {
            if (numBand == 3) {    //Processamento específico para imagens PPM (RGB).
                for (i = 0; i < height; ++i) {    //Lendo a matriz linha a linha.
                    for (j = 0; j < width; ++j) {    //Lendo a matriz coluna a coluna.
                        (*(matrix + i*width + j))->subPixels[0] = 0;    //Zera (extrai) todos os subpixels da cor vermelho (índice 0).
                        (*(matrix + i*width + j))->subPixels[2] = 0;    //Zera (extrai) todos os subpixels da cor azul (índice 2).
                    }
                }                
            }
        }
        else if (strcmp(argv[1], "extrairAzul") == 0) {
            if (numBand == 3) {    //Processamento específico para imagens PPM (RGB).
                for (i = 0; i < height; ++i) {    //Lendo a matriz linha a linha.
                    for (j = 0; j < width; ++j) {    //Lendo a matriz coluna a coluna.
                        (*(matrix + i*width + j))->subPixels[0] = 0;    //Zera (extrai) todos os subpixels da cor vermelho (índice 0).
                        (*(matrix + i*width + j))->subPixels[1] = 0;    //Zera (extrai) todos os subpixels da cor verde (índice 1).
                    }
                }                
            }
        }        
        else if (strcmp(argv[1], "removerVermelho") == 0) {
            if (numBand == 3) {    //Processamento específico para imagens PPM (RGB).
                for (i = 0; i < height; ++i) {    //Lendo a matriz linha a linha.
                    for (j = 0; j < width; ++j) {    //Lendo a matriz coluna a coluna.
                        (*(matrix + i*width + j))->subPixels[0] = 0;    //Zera (extrai) todos os subpixels da cor vermelho (índice 0).
                    }
                }                
            }
        }
        else if (strcmp(argv[1], "removerVerde") == 0) {
            if (numBand == 3) {    //Processamento específico para imagens PPM (RGB).
                for (i = 0; i < height; ++i) {    //Lendo a matriz linha a linha.
                    for (j = 0; j < width; ++j) {    //Lendo a matriz coluna a coluna.
                        (*(matrix + i*width + j))->subPixels[1] = 0;    //Zera (extrai) todos os subpixels da cor verde (índice 1).
                    }
                }                
            }
        }
        else if (strcmp(argv[1], "removerAzul") == 0) {
            if (numBand == 3) {    //Processamento específico para imagens PPM (RGB).
                for (i = 0; i < height; ++i) {    //Lendo a matriz linha a linha.
                    for (j = 0; j < width; ++j) {    //Lendo a matriz coluna a coluna.
                        (*(matrix + i*width + j))->subPixels[2] = 0;    //Zera (extrai) todos os subpixels da cor azul (índice 2).
                    }
                }                
            }
        }
        else if (strcmp(argv[1], "converter") == 0) {    //Converter espaço de cores.
            if (argc != 4) {
                printf("\n\tERRO: parâmetros inválidos; esperava número do espaço de cores!");
                return 0;
            }

            colorSpace = atoi(argv[3])-1;    //Atualizando variável do espaço de cores.
            
            for (i = 0; i < height; ++i) {
                for (j = 0; j < width; ++j) {
                    for (k = 0; k < numBand; ++k) {    //Para cada sub-pixel.
                        //Converterndo os subpixels baseado no valor máximo do espaço de cores:
                        (*(matrix + i*width + j))->subPixels[k] %= colorSpace;
                    }
                }
            }
        }
        else if (strcmp(argv[1], "brilho") == 0) {
            if (argc != 4) {
                printf("\n\tERRO: parâmetros inválidos; esperava número do brilho!");
                return 0;
            }

            int brightness = atoi(argv[3]);
            
            for (i = 0; i < height; ++i) {
                for (j = 0; j < width; ++j) {
                    for (k = 0; k < numBand; ++k) {    //Para cada sub-pixel.
                        //Converterndo os subpixels baseado no valor máximo do espaço de cores:
                        (*(matrix + i*width + j))->subPixels[k] += brightness;

                        //Verificando se os valores dos pixels estão dentro da faixa de tons de cor:
                        if ((*(matrix + i*width + j))->subPixels[k] > colorSpace) (*(matrix + i*width + j))->subPixels[k] = colorSpace;
                        else if ((*(matrix + i*width + j))->subPixels[k] < 0) (*(matrix + i*width + j))->subPixels[k] = 0;
                    }
                }
            }
        }
        else if (strcmp(argv[1], "expandir") == 0) {
            struct pixel **newMatrix = (struct pixel**) malloc(height*width*sizeof(struct pixel*));
        
            //Como vai rotacionar 90º, largura vira altura e vice-versa para a nova imagem:
            //Preenche a nova imagem com os valores da imagem original, percorrendo a nova imagem de coluna em coluna começando do fim, a partir da primeira linha até a última.
            for (i = 0; i < width; ++i) {    //Altura da nova imagem.
                for (j = 0; j < height; ++j) {    //Largura da nova imagem.
                    (*(rotateMatrix + i*width + height-1-j)) = (*(matrix + j*width + i));
                }
            }
        
            matrix = rotateMatrix;    //Atualizando a matriz da imagem.
            int aux = width;
            width = height;
            height = aux;
        }
        else return 0;
        
        //ATUALIZANDO O ARQUIVO:
        file = fopen(argv[2], "w+");    //Sobrescrevendo o arquivo.
        fprintf(file, "%s\n", code);
        fprintf(file, "%d %d\n", width, height);
        if (strcmp(code, "P1") != 0) fprintf(file, "%d\n", colorSpace);

        for (i = 0; i < height; i++) {
	        for (j = 0; j < width; j++) {
                for (k = 0; k < numBand; k++) {
		            fprintf(file, "%d ", (*(matrix + i*width + j))->subPixels[k]);
                }
	        }
	
	        fprintf(file, "\n");    //Quebra de linha.
        }
        
        free(matrix);
        fclose(file);
    }
    
    return 0;
}


 
/*
 * Initializes a line reader _lr_ for the stream _f_.
 * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C
 */
void lr_init(struct line_reader *lr, FILE *f)
{
	lr->f = f;
	lr->buf = NULL;
	lr->siz = 0;
}
 
/*
 * Reads the next line. If successful, returns a pointer to the line,
 * and sets *len to the number of characters, at least 1. The result is
 * _not_ a C string; it has no terminating '\0'. The returned pointer
 * remains valid until the next call to next_line() or lr_free() with
 * the same _lr_.
 *
 * next_line() returns NULL at end of file, or if there is an error (on
 * the stream, or with memory allocation).
 * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C 
 */
char *next_line(FILE *file)
{
	struct line_reader lr;
	size_t newsiz;
	int c;
	char *newbuf;
	size_t len;
 
    lr_init(&lr, file);
	len = 0;			/* Start with empty line. */
	for (;;) {
		c = fgetc(lr.f);	/* Read next character. */
		if (ferror(lr.f))
			return NULL;
 
		if (c == EOF) {
			/*
			 * End of file is also end of last line,
		`	 * unless this last line would be empty.
			 */
			if (len == 0)
				return NULL;
			else
				return lr.buf;
		} else {
			/* Append c to the buffer. */
			if (len == lr.siz) {
				/* Need a bigger buffer! */
				newsiz = lr.siz + 4096;
				newbuf = realloc(lr.buf, newsiz);
				if (newbuf == NULL)
					return NULL;
				lr.buf = newbuf;
				lr.siz = newsiz;
			}
			lr.buf[len++] = c;
 
			/* '\n' is end of line. */
			if (c == '\n')
				return lr.buf;
		}
	}
}
 
/*
 * Frees internal memory used by _lr_.
 * Fonte: http://rosettacode.org/wiki/Read_a_file_line_by_line#C 
 */
void lr_free(struct line_reader *lr)
{
	free(lr->buf);
	lr->buf = NULL;
	lr->siz = 0;
}


//Split: desmenbramento de uma string baseado em um delimitador char.
//Fonte: http://stackoverflow.com/questions/9210528/split-string-with-delimiters-in-c
char** str_split(char* a_str, const char a_delim, int *size)
{
    char** result    = 0;
    size_t count     = 0;
    char* tmp        = a_str;
    char* last_comma = 0;
    char delim[2];
    delim[0] = a_delim;
    delim[1] = 0;

    /* Count how many elements will be extracted. */
    while (*tmp) {
        if (a_delim == *tmp) {
            count++;
            last_comma = tmp;
        }
        
        tmp++;
    }

    /* Add space for trailing token. */
    count += last_comma < (a_str + strlen(a_str) - 1);

    /* Add space for terminating null string so caller knows where the list of returned strings ends. */
    count++;

    result = malloc(sizeof(char*) * count);

    if (result) {
        size_t idx  = 0;
        char* token = strtok(a_str, delim);

        while (token) {
            assert(idx < count);
            *(result + idx++) = strdup(token);
            token = strtok(0, delim);
        }
        
        //assert(idx == count - 1);
        *(result + idx) = 0;
    }
    
    if (size != NULL) *size = (int) count-1;

    return result;
}


//Fonte: http://stackoverflow.com/questions/122616/how-do-i-trim-leading-trailing-whitespace-in-a-standard-way
char* str_trim(char* str) 
{
    char* beg = str;
    char* end = beg + strlen(beg) - 1;

    while (isspace(*beg)) ++beg;
    while (end >= beg && isspace(*end)) --end;
    end[1] = 0;

    return memmove(str, beg, end - beg + 2);
}
