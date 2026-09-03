# Prompt 1 (adaptado): Fundação do Design System — Oficina Brasil

Monte a fundação do design system da Oficina Brasil com shadcn/ui, usando
o guia de marca como única fonte de verdade pros tokens — não um
screenshot genérico ou referência de Pinterest.

## Insumo

`GOB01-GuiaMarca-OficinaBrasil_rev1.pdf` — especificamente:
- Seção 4.2 (Cores), página 47 — as 5 cores oficiais da marca
- Seção 4.2 (Cores), página 48 — a tabela de combinações de cor aprovadas
- Seção 4.3 (Tipografia), páginas 50–52 — Figtree, pesos, fallback de sistema
- Seção 4.4 (Grafismos), páginas 54–59 — recortes do logo, pattern, box, linha de marcação

## Regra fixa para este projeto

**Nunca inferir uma cor de marca a partir de um screenshot ou "vibe".** A
Oficina Brasil tem um guia de marca oficial com valores hex exatos e uma
tabela de acessibilidade já validada pelo time de marca. Qualquer cor
usada na UI precisa remontar a uma das 5 cores documentadas, ou ser
explicitamente sinalizada como "gerada, não especificada pela marca" (ver
Passo 3). Esse é um desvio deliberado do fluxo original do Prompt 1, que
assume que não existe uma referência formal de marca.

## Fluxo de trabalho

### 1. Extrair tokens da fonte de verdade

Cores (verbatim da página 47):

| Nome | Hex | Uso documentado |
|---|---|---|
| azul | `#18328A` | Cor primária da marca |
| azulEscuro | `#00134E` | Fundos institucionais, blocos escuros |
| verde | `#90F252` | Destaque do wordmark — uso comedido |
| turquesa | `#00B7A4` | Acento secundário — divisores, marcadores de seção |
| azulClaro | `#DAF7EF` | Fundo de tinta clara |

Tipografia (verbatim das páginas 50–52):
- Fonte: Figtree (Google Fonts)
- Pesos a usar: Regular, Medium, SemiBold, Bold
- Pesos a evitar: Light, Black (recomendação do próprio guia)
- Fallback de sistema: Arial

Combinações acessíveis (verbatim da página 48) — ver tabela de
"Combinações acessíveis" abaixo. Essa é a própria validação do time de
marca, não um cálculo genérico de contraste — trate como autoritativo.

### 2. Codificar a tabela de combinações acessíveis como código, não só documentação

Esse é o passo que faz essa fundação ser diferente de uma rodada típica de
Prompt 1: a tabela de contraste não é só escrita pra pessoas lembrarem, é
uma função (`isApprovedPairing()`) que componentes podem chamar. Ver
`lib/contrast-rules.ts` — implementar exatamente como a tabela especifica:

| Fundo | Aprovado sempre | Aprovado só em texto grande |
|---|---|---|
| azul | branco, verde, azulClaro | turquesa |
| verde | azul, azulEscuro | — |
| turquesa | azulEscuro | — |
| azulEscuro | verde, branco, azulClaro | turquesa |
| azulClaro | azul, azulEscuro | — |

Regra crítica revelada por essa tabela: **fundo verde nunca combina com
texto branco.**

### 3. Preencher as lacunas que o guia de marca não cobre — e sinalizar cada uma

O guia de marca define 5 cores de marca e tipografia, mas não diz nada
sobre: escala de cinza neutro, border radius (valor numérico), cor de
erro/destrutiva, ou dark mode. Para cada um desses:

- Gerar um padrão razoável (ex: uma escala de cinza neutro padrão, um
  vermelho provisório pra estados destrutivos).
- Escrever um comentário no código no ponto de definição afirmando
  explicitamente que **não** é especificado pela marca e precisa de
  aprovação de design antes de ir pra produção.
- Nunca deixar um valor gerado parecer indistinguível de um oficial —
  futuros mantenedores precisam conseguir diferenciar num piscar de olhos.

### 4. Inicializar o shadcn

```bash
npx shadcn@latest init
```

- Estilo: Default
- Cor base: Neutral (sobrescrita pelos tokens de marca no próximo passo)
- Variáveis CSS: Sim

### 5. Gerar `lib/tokens.ts` e `lib/contrast-rules.ts`

Conforme a estrutura já montada — `tokens.ts` guarda os valores de cor
brutos (com guia-de-marca vs. gerado claramente separados),
`contrast-rules.ts` guarda a função `isApprovedPairing()`.

### 6. Gerar `app/globals.css`

Mapear as variáveis CSS pros tokens de marca, seguindo as combinações
aprovadas — ex: `--primary-foreground` precisa resolver pra uma cor
aprovada pro fundo `--primary` conforme `contrast-rules.ts`, não só
"branco por padrão" como uma configuração genérica de shadcn faria.

Adicionar Figtree via Google Fonts e definir como a família de fonte base,
com Arial como fallback.

### 7. Instalar componentes de demonstração

```bash
npx shadcn@latest add button card badge alert
```

### 8. Construir o style guide

Criar `/app/style-guides/` (layout + configuração de navegação + página
principal) mostrando:
- As 5 cores de marca como amostras com valores hex e uso documentado
- A tabela de combinações aprovadas renderizada visualmente (não só no código)
- Amostras de tipografia em cada peso aprovado
- Componentes de demonstração usando só combinações de cor aprovadas
- Uma seção claramente marcada listando todo valor "gerado, não
  especificado pela marca" do Passo 3, pra ser impossível de passar
  despercebido na revisão de design

## Saída

- `lib/tokens.ts`, `lib/contrast-rules.ts`
- `app/globals.css` com variáveis CSS derivadas da marca
- Figtree instalado com fallback documentado
- `/app/style-guides/` mostrando tokens, combinações, e componentes de demonstração
- Uma lista visível e impossível de ignorar do que ainda precisa de aprovação de design

## Resumo de design (também fornecer depois da configuração)

- **Cor primária:** Azul (#18328A)
- **Fonte:** Figtree (só Regular/Medium/SemiBold/Bold)
- **Estilo:** Confiável, especialista, prática — logotipo condensado em
  negrito, grafismos de recorte de logo em duotone, molduras de foto
  generosas com um único canto arredondado
- **Border radius:** Não especificado pela marca — gerado como 12px, pendente de revisão de design
- **Sensação geral:** Azul primário forte com acento verde de alta energia
  usado com moderação; turquesa como acento secundário/só-texto-grande;
  navy escuro pra peso institucional

## Notas

- Não substituir ou aproximar cores de marca em nenhuma circunstância —
  elas vêm de um guia de marca governado, não de um moodboard.
- Se um design de tela pedir uma combinação de cor que não está na tabela
  de combinações aprovadas, parar e sinalizar — não adivinhar uma taxa de
  contraste.
- Todo valor gerado (não especificado pela marca) precisa continuar
  visivelmente sinalizado no código e no style guide até um designer
  confirmar.
