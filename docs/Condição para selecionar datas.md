## Considerando as opções possíveis para o cenário
As asserções são as seguintes:
- **P** = O nodo 1 está selecionado
- **Q** = O nodo 2 está selecionado
- **R** = O range de data está habilitado

Elas devem ser manipuladas de modo que seja ***S*** verdade:
- **S** = Posso adicionar um nodo

## Montando a tabela verdade da expressão

| P   | Q   | R   | P' + Q + R | P' + Q' + R | P' + Q' + R' | P' + RQ' |     | S   |
| --- | --- | --- | ---------- | ----------- | ------------ | -------- | --- | --- |
| 0   | 0   | 0   | 1          | 1           | 1            | 1 + 0 1  |     | 1   |
| 0   | 0   | 1   | 1          | 1           | 1            | 1 + 1 1  |     | 1   |
| 0   | 1   | 0   | 1          | 1           | 1            | 1 + 0 0  |     | 1   |
| 0   | 1   | 1   | 1          | 1           | 1            | 1 + 1 0  |     | 1   |
| 1   | 0   | 0   | 0          | 1           | 1            | 0 + 0 1  |     | 0   |
| 1   | 0   | 1   | 1          | 1           | 1            | 0 + 1 1  |     | 1   |
| 1   | 1   | 0   | 1          | 0           | 1            | 0 + 0 0  |     | 0   |
| 1   | 1   | 1   | 1          | 1           | 0            | 0 + 1 0  |     | 0   |

### Extraindo as expressões através do método do produto das somas
| P   | Q   | R   | S   | expression   |
| --- | --- | --- | --- | ------------ |
| 1   | 0   | 0   | 0   | P' + Q + R   |
| 1   | 1   | 0   | 0   | P' + Q' + R  |
| 1   | 1   | 1   | 0   | P' + Q' + R' |

A expressão final fica:
	$(¬P∨Q∨R)∧(¬P∨¬Q∨R)∧(¬P∨¬Q∨¬R)$

## Simplificando:
Resolvendo a primeira parte :
	$(¬P∨Q∨R)∧(¬P∨¬Q∨R)$
	
	P' + P'Q' + P'R + QP' + 0 + QR + RP' + RQ' + R (A + AB = A)
	P' + P'R + QP' + QR + RP' + R (A + AB)
	P' + QP' + QR + RP' + R (A + AB)
	P' + QR + R (A + AB)
	P' + R

Agora, juntando o resultado da primeira expressão com a última:
	(P' + R) (P' + Q' + R')
	P'P' + P'Q' + P'R' + RP' + RQ' + RR' (AA = A)
	P' + P'Q' + P'R' + RP' + RQ' + RR' (AA' = 0)
	P' + P'Q' + P'R' + RP' + RQ' (A + AB = A)
	P' + P'R' + RP' + RQ' (A + AB = A)
	P' + RP' + RQ' (A + AB = A)
	P' + RQ'

O resultado final fica:
$$¬P\lor(R \land ¬Q)$$
Portanto, é possível selecionar uma data se:
> *O nodo 1 não está selecionado ou o range de data está habilitado e o nodo 2 não está selecionado*