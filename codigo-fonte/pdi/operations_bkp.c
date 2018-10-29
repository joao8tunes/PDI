#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <ctype.h>
#include <math.h>


struct pixel
{
	int subPixels[3];    //Considerando o número máximo de sub-pixels de um pixel.
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
    if (argc != 3) {
    
    }
    else {    //Restaurando a matriz para a memória antes de verificar qual a operação. Supondo que a operação exista e esse processo não seja feito sem motivo.
        //LENDO O ARQUIVO:
        FILE *file = fopen(argv[2], "r");
        char *line = NULL, **aux;
        char *code = str_trim(next_line(file));    //P* - código do formato
        char *fileFormat = "pbm";    //Supondo que po formato é 'pbm'.
        char rotate = 0;    //Quando essa flag for 1, quer dizer que deve-se usar a matriz 'rotateMatrix' para atualizar o arquivo.
            
        do {
	        line = str_trim(next_line(file));
        } while (line[0] == '#');    //Possíveis comentátios depois do código.
            
        aux = str_split(line, ' ', NULL);    //Largura e altura juntas na mesma linha, separadas por espaço.

        int width = atoi(str_trim(aux[0])), height = atoi(str_trim(aux[1]));
        struct pixel *matrix[height][width], *rotateMatrix[width][height];    //Dinâmico porque os compiladores tem limite de memória estática.
        int colorSpace = 1;    //Considerando tipo de imagem PBM (binária) como padrão.
        char **values;
        int numBand = 1, size, i = 0, j = 0, k, curIdxPixel = 0;
            
        if (strcmp(code, "P1") != 0) colorSpace = atoi(str_trim(next_line(file)));    //Se o código não for P1 (PBM), então existe especificação do espaço de cores.
        if (strcmp(code, "P3") == 0) {
            numBand = 3;    //Número de bandas ou "sub-pixels".
            fileFormat = "ppm";
        }
        else if (strcmp(code, "P2") == 0) fileFormat = "pgm";
        
        //Inicializando matriz de pixels:
        for (i = 0; i < height; ++i) {
			for (j = 0; j < width; ++j) {
			    do { 
                    matrix[i][j] = (struct pixel*) malloc(numBand*sizeof(struct pixel));
                } while (matrix[i][j]->subPixels == NULL);
			}
		}

        i = j = 0;
        			    
        //Lendo cada linha restante do arquivo (matriz):
        while ((line = next_line(file))) {
            line =  str_trim(line);    //Lembrar desse trim, pra não considerar o espaço no final da linha como elemento (valor/número).
            values = str_split(line, ' ', &size);    //size - número de elementos retornados.

            for (k = 0; k < size; k++) {    //Percorrendo elementos da linha atual do arquivo.
                matrix[i][j]->subPixels[curIdxPixel] = atoi(values[k]);
                ++curIdxPixel;
                
                if (curIdxPixel >= numBand) {    //Agrupando elementos (sub-pixels) no pixel correspondente.
                    curIdxPixel = 0;
                    j++;

                    if (j >= width) {
                        j = 0;
                        i++;
                    }
                }
            }
        }
        
        fclose(file);
    
    
        //REALIZANDO OPERAÇÕES:
        if (strcmp(argv[1], "negativar") == 0) {
            for (i = 0; i < height; ++i) {
			    for (j = 0; j < width; ++j) {
                    for (k = 0; k < numBand; k++) {
				        matrix[i][j]->subPixels[k] = colorSpace - matrix[i][j]->subPixels[k];
                    }
			    }
    		}
        }
        else if (strcmp(argv[1], "filtrar") == 0) {
            
        }
        else if (strcmp(argv[1], "binarizar") == 0) {
            int middle = colorSpace/2;
            
		    for (i = 0; i < height; ++i) {
			    for (j = 0; j < width; ++j) {
                    for (k = 0; k < numBand; ++k) {
                        if (matrix[i][j]->subPixels[k] > middle) matrix[i][j]->subPixels[k] = colorSpace;
                        else matrix[i][j]->subPixels[k] = 0;
                    }
			    }
		    }            
        }        
        else if (strcmp(argv[1], "equalizar") == 0) {
            
        }        
        else if (strcmp(argv[1], "contornar") == 0) {
            
        }        
        else if (strcmp(argv[1], "rotacionarEsquerda90") == 0) {
            rotate = 1;
        
		    for (i = 0; i < width; ++i) {
			    for (j = 0; j < height; ++j) {
				    rotateMatrix[i][j] = matrix[j][i];
			    }
		    }
		
		    free(matrix);
		    int aux = width;
		    width = height;
		    height = aux;            
        }   
        else if (strcmp(argv[1], "rotacionarDireita90") == 0) {
            rotate = 1;
        
		    for (i = 0; i < width; ++i) {
			    for (j = 0; j < height; ++j) {
				    rotateMatrix[i][height-1-j] = matrix[j][i];
			    }
		    }
		
		    free(matrix);
		    int aux = width;
		    width = height;
		    height = aux;
        }
        else if (strcmp(argv[1], "destacar") == 0) {
            for (i = 0; i < height; ++i) {
			    for (j = 0; j < width; ++j) {
                    for (k = 0; k < numBand; ++k) {
                        matrix[i][j]->subPixels[k] = (int)1*pow(matrix[i][j]->subPixels[k], 1.03);
                        
                        if (matrix[i][j]->subPixels[k] > colorSpace) matrix[i][j]->subPixels[k] = colorSpace;
                    }
			    }
		    }			
        }           
        else if (strcmp(argv[1], "histograma") == 0) {
            int idx;
            struct pixel pr[colorSpace];
            
            for (idx = 0; idx < colorSpace; ++idx) {    //Para cada índice (intensidade de cor do espaço de cores), verifica sua frequência de incidência na matriz da imagem.                
                for (k = 0; k < numBand; ++k) {
                    pr[idx].subPixels[k] = 0;    //Inicializando contador para a faixa de banda 'k'.

                    for (i = 0; i < height; ++i) {
                        for (j = 0; j < width; ++j) {
                            if (matrix[i][j]->subPixels[k] == idx) ++pr[idx].subPixels[k];
                        }
                    }
                }
		    }
		    
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
        else return 0;
        
        //ATUALIZANDO O ARQUIVO:
        file = fopen(argv[2], "w+");    //Sobrescrevendo o arquivo.
        fprintf(file, "%s\n", code);
        fprintf(file, "%d %d\n", width, height);
        if (strcmp(code, "P1") != 0) fprintf(file, "%d\n", colorSpace);

        for (i = 0; i < height; i++) {
	        for (j = 0; j < width; j++) {
                for (k = 0; k < numBand; k++) {
		            fprintf(file, "%d ", matrix[i][j]->subPixels[k]);
                }
	        }
	
	        fprintf(file, "\n");    //Quebra de linha.
        }
        
        free(matrix);
        free(rotateMatrix);
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
        
        assert(idx == count - 1);
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
