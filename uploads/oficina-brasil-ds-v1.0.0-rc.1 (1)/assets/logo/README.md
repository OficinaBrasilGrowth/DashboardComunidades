# Assets do logo

## Fonte de verdade

Todos os arquivos de wordmark aqui remontam ao `GOB01-IDV-Logo-RGB.eps` —
a **arte original do Adobe Illustrator** (confirmado via metadados do PDF:
"Adobe Illustrator Artwork", Criador "Adobe Illustrator(R) 29.7"), não uma
reconstrução. Isso substituiu uma tentativa de extração anterior a partir
do PDF do guia de marca, que funcionava mas era um passo mais distante da
fonte original.

O EPS era um DOS EPS Binary File (PostScript + prévia TIFF embutida). A
seção PostScript foi extraída diretamente via seus offsets de cabeçalho
binário (bytes 4–11), convertida para PDF via Ghostscript, depois para SVG
via `pdftocairo` — confirmado vetorial (zero imagens embutidas) em cada
etapa.

## O que tem aqui

- `wordmark-verde.svg` / `wordmark-azul.svg` — wordmark completo "OFICINA BRASIL", fundo transparente
- `wordmark-mono-positive.svg` (#0A0A0A) / `wordmark-mono-negative.svg` (#FFFFFF) — variantes monocromáticas
- `on-azul-escuro.svg`, `on-turquesa.svg`, `on-verde.svg`, `on-azul-claro.svg` — as 4 combinações institucionais de fundo do guia de marca (página 40)
- `compact/of-br-verde.svg` / `compact/of-br-azul.svg` — a marca compacta "OF BR", extraída do mesmo arquivo EPS (antes completamente ausente deste projeto)

## Discrepância de cor — resolvida

Os valores RGB reais do arquivo EPS eram **levemente diferentes** dos
códigos hex documentados no PDF do guia de marca:

| | Guia de marca (PDF, página 47) | Arquivo EPS (valores brutos amostrados) |
|---|---|---|
| Verde | `#90F252` | `#90D236` |
| Azul (caixa de fundo) | `#18328A` | `#2A3989` |

**Decisão (Ago 2026): seguir o guia de marca.** Todos os arquivos nesta
pasta usam `#90F252` / `#18328A` — os valores documentados do PDF, não os
valores brutos amostrados do EPS. Confirmado com quem é dono dos arquivos
de marca; a discrepância do EPS é provavelmente deriva de perfil de cor
PDF/EPS durante a conversão CMYK→RGB do Ghostscript na extração, não uma
paleta alternativa intencional. Nenhuma ação adicional necessária nesse
ponto.

## Um bug pego e corrigido durante essa extração

Uma versão inicial dessa extração produziu um wordmark com o "A" final de
"OFICINA" cortado. Causa raiz: 3 dos paths do EPS são definições de máscara
`<clipPath>` que vivem em `<defs>`, não preenchimentos de glifo visíveis —
não têm atributo `fill` direto. Uma passada inicial de filtragem baseada em
cor tratou incorretamente "sem atributo fill" da mesma forma que "cor
errada" e os deletou, o que quebrou a referência de clip-path usada pelo
glifo "A". Corrigido excluindo qualquer coisa dentro de
`<defs>`/`<clipPath>`/`<mask>` da filtragem baseada em cor — só paths de
conteúdo realmente visível são filtrados. Todo arquivo nesta pasta foi
reverificado visualmente depois dessa correção.

## Ainda não coberto

- Variantes do logo "sobre foto" (guia de marca página 40) — dependem de fotografia real, não é um asset estático pra gerar.
- Marca só-ícone sobre outros fundos além de verde/azul (o EPS só tinha essas duas instâncias de cor).
