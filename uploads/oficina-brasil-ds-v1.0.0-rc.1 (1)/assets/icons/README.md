# Assets de ícones — arquivos fonte reais (substitui extração anterior)

## O que tem aqui

35 ícones, fornecidos diretamente pelo time de design como arquivos fonte
SVG reais (não reconstruídos a partir do PDF). Isso substitui inteiramente
a tentativa anterior de extração via PDF — nenhum ícone traçado/aproximado
permanece neste projeto.

## O que mudou em relação aos arquivos originais

Os arquivos fonte tinham a cor da marca fixa via um bloco `<style>` inline
(`.cls-1 { fill: #18328a }`). Pra um design system, um ícone não deveria
carregar uma cor embutida — ele deveria herdar qualquer cor que o
componente consumidor definir, pra poder ser usado com qualquer combinação
aprovada de `lib/contrast-rules.ts` (Azul, AzulEscuro, Verde, Turquesa,
branco) dependendo do contexto.

Cada ícone foi convertido pra usar `fill="currentColor"` em vez disso. Isso
significa:

```tsx
// Renderiza em Azul (herda de um pai com text-primary, por exemplo)
<ToolsIcon className="text-primary" />

// Renderiza em Verde — mas conforme contrast-rules.ts, ícones Verde sobre
// fundo claro precisam de texto azulEscuro por perto, não branco, mesma
// regra de antes
<ToolsIcon className="text-brand-verde" />
```

Nenhuma outra mudança foi feita nos paths — mesmas formas, mesma estrutura
de arquivo, só desacoplado de uma cor fixa.

## Os nomes ainda são propostos, não confirmados

O time de design mandou os arquivos com nome genérico (`GOB01-icone01.svg`
até `GOB01-icone35.svg`) — nenhum nome semântico foi incluído. Os nomes
usados aqui (`tools.svg`, `map-pin.svg`, `ev-charging-station.svg`, etc.)
são minha melhor interpretação visual, com a mesma ressalva de antes.
**Por favor confirmem ou renomeiem isso** antes de tratar como definitivo
no código — especialmente os que tenho menos confiança:
`fax-document` (ícone 08), `car-ev-battery` vs `ev-charger-with-car` (qual
é qual?), e `play-filled-square` vs `play-arrow` (dois ícones de play
diferentes no conjunto — confirmar qual é usado onde).

## O que isso substitui

A pasta `assets/icons/` anterior (extraída do PDF, 36 ícones, um deles uma
aproximação via potrace de um megafone) foi completamente substituída.
Nada daquela extração foi mantido — esses arquivos fonte reais são
estritamente melhores em fidelidade, tamanho de arquivo (~4KB em média vs
~30KB), e correção.

## Ainda não coberto

- Só uma lógica de cor está montada (`currentColor`) — sem arquivos
  estáticos separados de Azul/Verde/Turquesa, de propósito (ver acima). Se
  um pipeline de build precisar especificamente de assets estáticos
  pré-coloridos (ex: pra templates de email que não suportam
  `currentColor`), isso é uma etapa de exportação separada.
- Nenhum `aria-label` ou nome acessível adicionado — isso é uma decisão de
  produto por uso, não algo pra embutir no arquivo de ícone compartilhado.
