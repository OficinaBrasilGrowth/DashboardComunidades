# Prompt 2 (adaptado): Desenvolvimento de Componente — Design System Oficina Brasil

Adicione um componente [NOME DO COMPONENTE] ao projeto usando shadcn/ui,
estilizado com os tokens de marca da Oficina Brasil.

## Contexto fixo do projeto

- Base de UI: **shadcn/ui + Tailwind CSS**, nenhum Ant Design (ou qualquer
  outra biblioteca de componentes) instalado no projeto. Ant Design é
  usado só como *referência* visual/UX durante o desenvolvimento — ver
  Passo 1.5 abaixo — nunca importado.
- Tokens de marca vivem em `lib/tokens.ts` — cores extraídas verbatim do
  `GOB01-GuiaMarca-OficinaBrasil_rev1.pdf` (página 47). Nunca introduzir
  uma cor de marca nova; se uma tela parecer precisar de uma, sinalizar
  pra revisão de design em vez de inventar um valor hex.
- Combinações de cor aprovadas vivem em `lib/contrast-rules.ts`,
  codificando a própria tabela de acessibilidade do guia de marca (página
  48) — não um cálculo WCAG genérico. Sempre checar `isApprovedPairing()`
  antes de escolher uma combinação de fundo/texto. Em particular:
  - Fundo `verde` (#90F252) **nunca** combina com texto branco — só
    `azul` ou `azulEscuro`.
  - `turquesa` (#00B7A4) como texto é aprovado só em tamanhos grandes
    (Figtree Regular >18pt ou Bold <14pt) — nunca pra texto de corpo ou
    rótulos pequenos.
- Tipografia: **Figtree** (Google Fonts), só pesos Regular/Medium/SemiBold/
  Bold — o guia de marca pede explicitamente pra evitar os extremos
  (Light, Black). Arial é o fallback de sistema documentado.
- Border radius, neutros (escala de cinza), e cores destrutivas/de aviso
  **não são especificados** no guia de marca — foram gerados como padrões
  razoáveis em `globals.css` e estão sinalizados lá pra aprovação de
  design. Não tratar como resolvidos; se um componente precisar de um
  novo tom neutro, gerar consistente com a escala existente e sinalizar
  do mesmo jeito.
- Grafismos de marca (recortes de logo, pattern, box com canto único
  arredondado pra fotos, linha de marcação) estão documentados na seção
  4.4 do guia de marca — recorrer a eles antes de inventar um tratamento
  decorativo novo.

## Fluxo de trabalho

### 1. Checar se o componente já existe

Antes de criar qualquer coisa:

- Olhar em `components/ui/` (componentes base do shadcn) e `components/`
  (componentes customizados/de marca) — existe algo com nome ou propósito
  parecido?
- Checar o style guide em `/style-guides` se já foi construído — navegar
  antes de assumir que um componente não existe.

**Decisão:**
- Existe → estender com uma prop/variante nova em vez de duplicar.
- Não existe → seguir pro Passo 1.5.

### 1.5. Checar o Ant Design como referência de UX (passo novo)

Pra componentes com design de interação não-trivial — tabelas de dados com
ordenação/filtro, formulários multi-etapa, seletores de intervalo de data,
comboboxes com busca, estados de validação complexos — olhar como o Ant
Design resolve esse padrão de interação específico antes de desenhar o
seu do zero:

- Densidade de linha e espaçamento em componentes com muito dado
- Onde controles tipo "limpar filtro" ou "resetar" ficam convencionalmente
- Como estados de erro/validação aparecem inline
- Navegação por teclado e ordem de foco pra widgets complexos

**Isso é só referência — nunca importar o Ant Design em si.** Pegar o
padrão de interação, não o estilo visual. A implementação precisa ser
construída com primitivas do shadcn/ui e estilizada inteiramente com os
tokens da Oficina Brasil. Se um padrão genuinamente exigir trabalho
profundo de acessibilidade (ex: a interação por teclado de um seletor de
intervalo de data), reservar tempo real de engenharia pra isso em vez de
pular o detalhe — essa é a troca de não usar uma biblioteca madura
diretamente.

Pular esse passo pra componentes simples de baixa interação (badges,
botões, cards estáticos) — só vale a pena pra componentes com
complexidade de interação de verdade.

### 2. Checar o registro do shadcn por um ponto de partida

```bash
npx shadcn@latest add [nome-do-componente]
```

Se o shadcn tiver uma primitiva base parecida (ex: `Table`, `Popover`,
`Command` pra comboboxes), instalar como ponto de partida em vez de
construir de um arquivo em branco — ainda se constrói comportamento
customizado por cima (conforme Passo 1.5), mas sem precisar reinventar
primitivas que o shadcn já fornece.

### 3. Aplicar tokens de marca

Usar classes do Tailwind que referenciam as variáveis CSS em
`globals.css` (`bg-primary`, `text-secondary-foreground`, etc.) — nunca
um valor hex bruto. Pra qualquer combinação não-padrão (ex: um fundo
`verde`), importar e checar `isApprovedPairing()` de
`lib/contrast-rules.ts` em vez de adivinhar.

```tsx
import { isApprovedPairing } from '@/lib/contrast-rules'

// Antes de usar uma cor de marca como fundo com cor de texto customizada:
// isApprovedPairing('verde', 'azulEscuro') // true
// isApprovedPairing('verde', 'branco')     // false — o guia proíbe isso
```

### 4. Tipografia

Usar Figtree via a configuração de fonte já existente — não introduzir um
import de fonte novo por componente. Ficar em Regular/Medium/SemiBold/
Bold; evitar Light e Black conforme a própria recomendação do guia de
marca.

### 5. Documentar no style guide

Adicionar o componente em
`/app/style-guides/components/[nome-do-componente]/page.tsx` cobrindo:
- Todas as variantes e estados (padrão, hover, desabilitado, carregando)
- Qual combinação de cor de marca foi usada e por quê (citar
  `contrast-rules.ts`)
- Se o padrão de interação do componente foi informado pelo Ant Design
  (conforme Passo 1.5), anotar isso num comentário curto pra futuros
  mantenedores — isso ajuda a explicar "por que isso se comporta como a
  tabela do Ant" sem ninguém assumir que o Ant Design é de fato uma
  dependência.

## Checklist antes de considerar pronto

- [ ] Componente checado contra os existentes — não duplicado
- [ ] Ant Design consultado só pelo padrão de interação, se o componente
      tinha complexidade real — não importado em lugar nenhum
- [ ] Todas as cores são tokens de marca ou combinações aprovadas de `contrast-rules.ts`
- [ ] Nenhum texto branco sobre fundo `verde`
- [ ] Texto `turquesa` usado só em tamanhos grandes
- [ ] Tipografia limitada a Regular/Medium/SemiBold/Bold
- [ ] Documentado em `/style-guides`
