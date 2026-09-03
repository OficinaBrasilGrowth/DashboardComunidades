# Prompt 3 (adaptado): Desenvolvimento de Página — Design System Oficina Brasil

Construa a página [NOME DA PÁGINA] a partir do design/screenshot
fornecido, usando componentes de `components/` e tokens de marca de
`lib/tokens.ts` — nunca inventando cores novas ou duplicando um
componente existente.

## Insumo

[SCREENSHOT OU LINK DE REFERÊNCIA]

## Contexto fixo do projeto

- Fonte de verdade de componentes: `components/` (customizados,
  estilizados de marca) e `components/ui/` (primitivas base do shadcn, se
  instaladas). Checar os dois antes de construir qualquer coisa nova.
- Nunca introduzir uma cor fora de `lib/tokens.ts`. Nunca usar uma
  combinação texto/fundo que não esteja aprovada em `lib/contrast-rules.ts`.
- Este projeto tem dois tipos distintos de página — tratar diferente:
  - **Institucional / voltada ao público** (portal, landing pages,
    conteúdo pra reparadores): apoiar na linguagem gráfica da marca —
    recortes de logo, pattern, o box de foto com canto único arredondado,
    a linha de marcação (guia de marca seção 4.4). Essas páginas são onde
    a identidade visual da Oficina Brasil precisa aparecer com força.
  - **Dashboard / densidade administrativa** (ferramentas internas,
    tabelas de dados, filtros): priorizar clareza funcional e densidade
    acima de elementos decorativos de marca. Ainda usar tokens de marca
    pra cor, mas pular tratamentos de pattern/recorte-de-logo aqui — eles
    adicionariam ruído a uma tela cheia de dados.
- Se um screenshot misturar os dois (um dashboard com um cabeçalho de
  marca, por exemplo), aplicar a divisão no nível de seção, não na página
  inteira.

## Fluxo de trabalho

### 1. Identificar que tipo de página é essa

Antes de qualquer coisa, decidir: isso é institucional/voltado ao
público, dashboard/admin, ou uma mistura? Isso determina se os elementos
gráficos de marca da Seção 3 se aplicam.

### 2. Analisar o design visualmente

Identificar a estrutura de layout (colunas, sidebar, grid), seções de UI
(nomear cada uma pelo propósito), e hierarquia de conteúdo (conteúdo
primário vs. de apoio, CTAs).

### 3. Mapear elementos visuais pra componentes existentes

| Elemento visual | Onde olhar primeiro |
|---|---|
| Dropdown / campo com busca | `components/brand-select.tsx` |
| Exibição de estatística/métrica | Checar `components/` por um componente de card antes de construir um |
| Foto com moldura de marca | Usar o padrão de box com canto único arredondado (guia de marca pág. 58) — não inventar um estilo de moldura novo |
| Divisor de seção / acento | Usar o padrão de linha de marcação (guia de marca pág. 59) |
| Botões | Usar só combinações aprovadas — ex: fundo `azul` + texto `branco`, ou fundo `verde` + texto `azulEscuro` (nunca `verde` + `branco`) |

Pra qualquer coisa não coberta por um componente existente: parar,
decidir se é reaproveitável entre páginas (se sim, construir via
**Prompt 2** primeiro), e só construir markup local de página pra
elementos genuinamente únicos.

### 4. Aplicar a linguagem gráfica institucional (só pra páginas voltadas ao público)

Conforme a seção 4.4 do guia de marca:
- **Box**: um único canto arredondado ao emoldurar uma foto; quatro
  cantos arredondados ao emoldurar um destaque de texto.
- **Recorte do logo**: uma forma duotone derivada do logo, usada com
  moderação como tratamento de fundo — nunca mais de uma vez por página,
  nunca ocupada o suficiente pra competir com o conteúdo por cima dela.
- **Pattern**: repetição em mosaico do wordmark, com "Oficina Brasil"
  destacado uma vez numa cor aprovada contrastante — nunca destacado mais
  de uma vez por instância de pattern (regra do próprio guia de marca,
  página 57).
- **Linha de marcação**: uma linha fina usada pra ancorar um destaque ou
  título — usada como apoio, não como foco visual.

Pular tudo acima pra páginas de dashboard/admin (ver Seção 1).

### 5. Construir a página

```tsx
import { BrandSelect } from '@/components/brand-select'
// importar outros componentes existentes conforme necessário

export default function NomeDaPagina() {
  return (
    <div className="flex flex-col gap-8">
      {/* seções */}
    </div>
  )
}
```

Usar classes do Tailwind referenciando as variáveis CSS (`bg-primary`,
`text-secondary-foreground`) — nunca um valor hex bruto, mesmo pra markup
único de página.

### 6. Responsividade

Mobile-first, consistente com o resto do projeto:

```tsx
<div className="flex flex-col md:flex-row gap-6">
  <aside className="hidden md:block md:w-64">{/* ... */}</aside>
  <main className="flex-1">{/* ... */}</main>
</div>
```

### 7. Validar

- Rodar `tsc --noEmit` (ou o script de typecheck do projeto) antes de
  considerar a página pronta — erros de tipo são baratos de pegar aqui,
  caros depois.
- Reconferir toda combinação de cor usada contra `lib/contrast-rules.ts`.

## Checklist antes de considerar pronto

- [ ] Página classificada como institucional, dashboard, ou mista — tratada de acordo
- [ ] Nenhum componente recriado quando um equivalente já existia
- [ ] Nenhuma cor fora de `lib/tokens.ts`; nenhuma combinação fora de `contrast-rules.ts`
- [ ] Elementos gráficos de marca usados só em seções institucionais, e com moderação
- [ ] Wordmark num pattern destacado no máximo uma vez, conforme regra do guia de marca
- [ ] Typecheck passa
