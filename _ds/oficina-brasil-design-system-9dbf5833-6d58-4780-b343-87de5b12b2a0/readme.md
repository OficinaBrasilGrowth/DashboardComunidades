# Oficina Brasil Design System

The design system behind **Oficina Brasil** — a Brazilian vehicle-repair network platform. The product connects a network of *reparadores* (repair shops / oficinas) with the operations team that manages them: registration, coverage, documents, orders, and the reporting on top of all that. Everything is pt-BR, and every screen in the source is an internal **admin / product** surface, not a marketing site.

The system is unusually **accessibility-first for a brand system**: nearly every component in the source is documented in terms of the WAI-ARIA pattern it follows, which native element it refuses to simulate, and which contrast pair it enforces so consumers never have to think about it. That is the system's defining trait and this project preserves it.

---

## Sources given to me

| Source | Path | What it contained |
| --- | --- | --- |
| Attached codebase | `oficina-brasil-ds 2/` | Only `docs/figma/` — see below |
| Component inventory | `oficina-brasil-ds 2/docs/figma/component-inventory.md` | 45 components, props interfaces **generated from the real `components/*.tsx`** |
| Design tokens | `oficina-brasil-ds 2/docs/figma/design-tokens.json` | W3C DTCG tokens, sourced from the real `lib/tokens.ts` + `app/globals.css` |
| Screenshots | `oficina-brasil-ds 2/docs/figma/screenshots/*.png` | 45 PNGs, one style-guide page per component |

No Figma link and no GitHub repo were provided.

### ⚠️ What was NOT in the handoff

The token file references `lib/tokens.ts`, `app/globals.css`, `lib/contrast-rules.ts`, `lib/use-focus-trap.ts`, `lib/use-popover-position.ts` and `lib/as-child.tsx` — **none of those files were attached.** Also missing: any illustration or photography, and any screenshot of an actual product screen (only the style-guide pages). *(The font binaries and the logo were missing in the original handoff and have since been supplied — see `assets/README.md`.)*

Consequences, all flagged in place:

- **Fonts: resolved.** Figtree (variable, wght 300–900) fornecida pelo time e embarcada em `assets/fonts/`. Só a face mono segue substituída (JetBrains Mono).
- **Icons are substituted.** A Lucide-derived inlined set. See *Iconography*.
- **Logo: resolved.** Wordmark e monograma reais fornecidos pelo time, em `assets/logo*.svg`.
- **Component behaviour** is reconstructed from the documented props + the visible screenshots, not copied from the original implementations.

Reference screenshots are copied into `reference/screenshots/` so a reader without the handoff can still see the ground truth.

---

## Products / surfaces

1. **Admin / produto** — the real product. `AdminPageHeader` exists specifically for "telas admin/produto"; the sample data throughout is reparadores and oficinas. Recreated in `ui_kits/admin/`.
2. **Style guide (documentation site)** — the internal DS site the 45 screenshots come from. Recreated pixel-close in `ui_kits/style-guide/`.

There is no evidence of a marketing site, a mobile app or a public docs site in the handoff, so none were invented.

---

## CONTENT FUNDAMENTALS

**Language: Brazilian Portuguese, always.** Not just translated — idiomatic. The docs write `pra` instead of `para` ("Referência **pra** quem for montar a biblioteca", "`aria-label` é obrigatório **pra** leitores de tela"). Contractions and colloquialisms are normal in explanatory prose.

**Voice: second person "você", never "nós".** "Agora **você** pode acompanhar o status do reparo em tempo real." · "Pressione Ctrl+K em qualquer lugar desta página **pra** abrir." The system speaks to the reader; it does not speak about itself as a team.

**Casing: sentence case everywhere.** Titles, buttons, labels, table headers. "Enviar arquivo", "Limpar filtros", "Selecionar período", "Cadastro concluído". The **only** uppercase in the whole system is the eyebrow label on metric cards ("RESPOSTAS TOTAIS", "TAXA DE CONVERSÃO") — 12px, wide tracking. No Title Case Buttons. No ALL-CAPS headings.

**Tone: engineer-to-engineer, specific, unembellished.** The documentation reads like a design decision log. Three habits define it:

1. **State the decision, then justify it.** "Usa `<input type="checkbox">` nativo, não um `role="checkbox"` simulado — mantém acessibilidade padrão do navegador de graça."
2. **Distinguish from the neighbour.** Every component that resembles another opens by saying how it differs: "Diferente do Toast (temporário, flutua num canto), o Alert é um bloco persistente inline na página."
3. **Admit what was wrong.** Real bugs, real trade-offs, in the docs: "Bug real encontrado durante o teste: clicar numa opção move o foco pro botão da própria opção." · "Radius fixo em 6px no quadrado visual, **não** o token rounded-md do projeto — achado durante teste real."

**Never marketing.** No "poderoso", no "simples e elegante", no exclamation marks, no promises. Provenance over pitch: "extraído da repetição real de vários `<button>` crus já espalhados pelo sistema, **não inventado do zero**."

**Emphasis is bold or backticks, never italics-for-drama.** Code identifiers always go in backticks — prop names, CSS vars, ARIA attributes, file paths.

**Emoji: essentially not used.** Zero emoji in any component label, button, badge or heading. The only emoji-shaped things in the source are two placeholder glyphs inside coloured icon wells (the 🔍 in the `EmptyState` demo, a mark in the `Considerations` header) — placeholders where a real icon belongs. **Don't add emoji.** Use `<Icon />`.

**Microcopy patterns to reuse:**

- Empty: "Nenhum resultado encontrado" / "Nenhum reparador cadastrado ainda"
- Success: "Cadastro concluído" + "Sua oficina já pode receber pedidos."
- Warning: "Documento pendente" + "Envie o comprovante de endereço para continuar."
- Error: "Falha no pagamento" · "Formato de email inválido" · "Campo obrigatório"
- Actions: "Limpar", "Aplicar", "Limpar tudo", "Limpar filtros", "Enviar arquivo", "Excluir"
- Ranges: "1-5 de 100" · "+12% vs período anterior" · "Últimos 7 dias"
- Money: `R$ 42.180` (dot thousands separator, space after R$)
- Phone: `(11) 99999-9999`
- Dates: `01/08 - 15/08`, month names lowercase in the calendar ("janeiro")

**The vibe:** a competent, unglamorous Brazilian operations tool that has clearly been argued over. Confident, plain, slightly dry, and quietly proud of its accessibility work.

---

## VISUAL FOUNDATIONS

### Colour

Five brand colours, all cool, all documented with a job: `azul #18328A` (primary — buttons, links, active nav, chart series 1) · `azulEscuro #00134E` (institutional dark blocks, **every heading**, the only approved dark background) · `verde #90F252` (wordmark accent, "uso comedido" — appears as a KPI icon seal and the Considerations mark, never a large surface) · `turquesa #00B7A4` (secondary accent: section markers, dividers, chart series 2) · `azulClaro #DAF7EF` (light tint background, the `secondary` button fill).

Neutrals are **blue-tinted greys**, not neutral greys — `#F5F6FA → #1D2340` all carry blue. That's what makes the whole UI read cool even when it's mostly white.

Semantics are minimal and honest about their origin: `destructive #D14343` and `warning #E8792A` exist, but the tinted backgrounds and their text colours (`--warning-tint` / `--warning-tint-foreground`) are documented as **generated**, because the brand guide defines no warning/error tone. Several tokens exist purely to pass WCAG AA: `--success-surface #008476` is turquesa darkened so white text passes 4.60:1 (base turquesa fails at 2.53:1); `--warning-tint-foreground #A2551D` is computed against its tint. **This is the system's signature: contrast pairs are baked into components, not left to consumers.**

Positive stats are **turquesa**, not green — green is reserved for the wordmark.

Dark mode exists as a real second scope: `#00134E` page, `#122568` card, `#233B62` borders, plus separate destructive/positive values. Components use `var(--card)` / `var(--popover)` rather than fixed white specifically so they survive it.

### Type

One family does everything — display and body share the same face; only weight and size separate them. Headings are **bold (700) azulEscuro with slight negative tracking**; body is **regular 14px/1.6 gray-600**. 14px is the base for body, labels, table cells and inputs alike. 24px+ appears only in page titles and metric values. Labels are semibold 14px azulEscuro. Captions and helper text are 12px `--text-muted`. Code is 13px mono in a `--gray-50` block.

**The display/body face is Figtree** — the real brand font, supplied by the team and embarked as a variable font (`assets/fonts/Figtree-VariableFont_wght.ttf`, roman + italic, axis `wght` 300–900, OFL). A geometric-humanist sans with a tall x-height and a single-storey `g`; declared once in `tokens/fonts.css` and exposed as `--font-sans` / `--font-display`. Weights in use: 400 body · 500 medium · 600 labels and card titles · 700 headings · 800 wordmark.

> **Still substituted:** the code face. The handoff defined no mono family, so **JetBrains Mono** stands in at 13px. Send the real one if there is one.

### Spacing & layout

2px base scale; 4/8/12/16/20/24 carry almost all the work. Control heights are a hard 32 / 40 / 48px (sm/md/lg) across every button and field. Card padding is 20px (24px for dialogs). Label→control is 6px, field→field 16px, section→section 32px. Sidebars are a fixed 256px; prose columns cap at 672px. Both shells are **fixed sidebar + scrolling content** — the sidebar never scrolls with the page. Dashboards are 3–4 equal KPI columns; forms are two columns above \~880px.

### Backgrounds

**Flat colour only.** White pages, `--gray-50` for sunken areas and table header bands, solid brand colour for header banners, `azulEscuro` for the Considerations frame. **No gradients anywhere. No background images, no full-bleed photography, no hand-drawn illustration, no repeating pattern, no texture, no grain, no noise.** Colour blocks and 1px lines do all the work. (If the brand does use imagery elsewhere, it wasn't in the handoff — see `assets/README.md`.)

### Borders, cards, shadows

The default card: **white fill, 1px `--border-subtle` (#E9EBF3), 12px radius, `--shadow-sm`** — a barely-there lift, not a floating card. Radius is 12px basically everywhere (10px for tighter inner blocks, 6px for the checkbox square only, pill for badges and chips and circular icon buttons). Borders are 1px, and 1.5px on the small painted controls (checkbox, radio) so the stroke reads at 18–20px.

Shadows are **always neutral** — `rgba(10,10,10,α)`, never a blue-tinted glow — and there are exactly four: `xs` (1/2px, subtle lift), `sm` (4/12px, cards), `md` (10/24px, popovers and toasts), `lg` (20/25px, modals). **No inner shadows anywhere.** Elevation is communicated by shadow, never by a darker background.

Accents are **left bars, not left-border cards**: Alerts and doc notes use a 3–4px coloured left edge on a tinted or plain background. Tabs use a 2px azul underline. Nothing uses a coloured left border on a rounded card as decoration.

### Transparency & blur

Almost none. **No backdrop blur, no frosted glass, no protection gradients.** The three uses of alpha: modal overlay `rgba(0,19,78,.45)` (azulEscuro at 45%), white-at-78–86% for subtitles on coloured banners, and the focus ring (`rgba(24,50,138,.28)`). Labels sit on solid capsules or plain colour, never on a gradient scrim.

### Motion

Short and functional: 80ms (hover colour), 120ms (border, focus), 180ms (switch knob, chevron rotation), 240ms (toast entry, progress fill). Easing is `cubic-bezier(.2,.8,.3,1)` — ease-out. **Nothing bounces, nothing overshoots, nothing slides in from far away.** The only entry animation is an 8px rise + fade on toasts. Skeletons pulse opacity (never a shimmer sweep). Chart entry animation exists but is switchable off, because the docs page turns it off for stable visual regression.

### States

- **Hover:** primary darkens (`#18328A → #132A73`); secondary tint deepens; ghost and outline gain a `--gray-50` wash. Never opacity fades, never lighten.
- **Press:** darkens further (`#0F2260`). **No scale/shrink transform.**
- **Focus:** a 3px soft ring (`--ring-primary`), red (`--ring-destructive`) on a field in error. Focus is never removed.
- **Disabled:** primary → `#A3ABC9` (blue-grey) with white text; ghost/outline → muted text on transparent. Not opacity.
- **Selected:** azulClaro fill + semibold + a check (select options, calendar range), or full azul fill + white text (active nav item, calendar range edge).

### Imagery

None in the handoff beyond the logo. Where people appear, they are **initials avatars on a `--gray-100` disc**, not photos. No image treatment, warmth, or grain is specified — don't invent one.

### Data visualisation

Fixed palette in fixed order: `--chart-1..5` = azul, turquesa, verde, laranja, azulEscuro. Square (unrounded) bars, 2.5px lines with 3px dots, **dashed** grid lines in `--gray-200`, axis text 11px `--gray-400`, legend centred below the plot. Every chart also renders a visually hidden data table so values are reachable without a mouse.

---

## ICONOGRAPHY

**Logo.** Duas construções reais em `assets/`: o wordmark **OFICINA / BRASIL** empilhado em duas linhas e o monograma **OF / BR** na mesma construção. O desenho é **lettering fechado — não existe fonte por trás dele**, só o SVG. Letras de largura estreita, cantos cortados, feitura geométrico-técnica; nada a ver com a Figtree, que é a face de interface. Consequência prática: **o logo nunca se redigita.** Não recomponha o wordmark em uma linha, não o reescreva em Figtree, não estenda o mesmo estilo a outras palavras ("Oficina Brasil Pro", nomes de módulo) — para isso use Figtree. Use `-white` sobre azul, azulEscuro e turquesa; a versão escura (`#00134E`) sobre branco, azulClaro e verde.

**Style:** monoline outline icons, **2px stroke on a 24px grid**, round caps and joins, no fill, rendered at 16px in controls (13–15px inside table headers, breadcrumbs and chips; 18–22px in header banners). Icons always take `currentColor`, so they inherit the control's text colour. There is no icon font and no SVG sprite in the handoff.

**Where icons appear:** leading slot on a button (`icon` prop), the whole content of an `IconButton`, chevrons for accordion/select/tabs/breadcrumb/pagination direction, the × on dismissible chips and dialogs, the check in checkbox and selected options, the arrow in a KPI seal or StatComparison delta, and the round icon well in `EmptyState` and `Considerations`.

> **Substitution flagged:** the handoff contained no icon assets — no font, no sprite, no SVG files. The glyph shapes in the screenshots (pencil, magnifier, trash, calendar, chevrons, upload, bell, sliders) match **Lucide** at stroke 2, which is also the default for the Next.js/Tailwind stack the source describes. The system therefore ships a small **Lucide-derived inlined set** in `components/core/Icon.jsx` (`<Icon name="upload" />`), covering exactly the glyphs the system actually uses. It is **not** loaded from a CDN, so consumers have no external dependency. If the real product uses a different set, send it and `Icon.jsx` is the single file to swap.

**Emoji as icons: no.** Two emoji-shaped placeholders appear in the source demos (inside the EmptyState icon well and the Considerations header seal) — they are placeholders, not a pattern. Use `<Icon />`.

**Unicode as icons: sparingly, and only as typographic decoration** — the DropdownMenu trigger label in the source ends with a literal `▾`, and keyboard hints use `↑↓←→`. Never use unicode for a functional control glyph.

**Intentional addition:** `Icon` is not in the source's 45-component inventory. The source passes raw `ReactNode` icons, which left consumers with no canonical glyph source. `Icon` is a thin wrapper only — it adds no new visual language.

---

## Index

### Root

| File | What |
| --- | --- |
| `readme.md` | This guide |
| `SKILL.md` | Agent-Skills front matter, for use in Claude Code |
| `styles.css` | Global entry point — `@import` list only |
| `thumbnail.html` | Homepage tile |
| `tokens/` | `fonts` · `colors` · `typography` · `spacing` · `radius` · `shadow` · `motion` · `base` |
| `guidelines/` | 22 foundation specimen cards (Colors / Type / Spacing / Brand) |
| `components/` | 47 components in 6 groups (below) |
| `ui_kits/` | `style-guide/` and `admin/` |
| `assets/` | `logo*.svg` (wordmark + monograma OF/BR) e `fonts/` (Figtree) — ver `assets/README.md` |
| `reference/screenshots/` | The 45 source screenshots, for provenance |

### Components

All 45 families from the source inventory are implemented, plus 2 intentional additions. Each directory has `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md` and one `@dsCard` HTML.

**`components/core/`** — Button · IconButton · Badge · Avatar · AvatarGroup · CopyButton · Skeleton · Label · VisuallyHiddenInput · Icon *(addition)*

**`components/forms/`** — Input · Textarea · Checkbox · RadioGroup · Switch · Slider · BrandSelect · MultiSelect · DatePicker · FileUploadButton

**`components/feedback/`** — Alert · AlertDialog · Modal · Toast *(+ ToastProvider, useToast)* · Tooltip · InfoTooltip · EmptyState · ProgressBar · ProgressRing

**`components/navigation/`** — Tabs · Breadcrumb · Pagination · DropdownMenu · Popover · Accordion · TreeView · CommandPalette

**`components/data/`** — DataTable · FilterBar · KpiCard · StatComparison · ChartCard · BarChart · LineChart

**`components/layout/`** — AdminPageHeader · Considerations *(+ ConsiderationsContent, documented in the source's props)*

#### Intentional additions

- **`Icon`** — the source passes bare `ReactNode` icons and ships no glyph set, so consumers had nothing to reach for. Thin wrapper over an inlined Lucide-derived set.
- **`ConsiderationsContent`** — not a separate entry in the inventory, but its props interface (`about`, `children`, `size`) is documented under `Considerations`; it is exported so the pairing is usable.

Charts are **hand-rolled SVG**, not Recharts. The source uses Recharts; a kit component can't ship an npm dependency, so `BarChart`/`LineChart` reproduce the visuals and keep the documented props (`isAnimationActive`, `title` for the hidden data table) as no-op-compatible.

### UI kits

- **`ui_kits/style-guide/`** — the documentation site, recreated from the screenshots. Sidebar + live demos + props blocks + coloured notes.
- **`ui_kits/admin/`** — 5 admin screens (Dashboard, Gestão de Clientes, Novo reparador, Relatórios, Configurações) composed entirely from the components. Read its README for the honest scope note.

### Slides

None. No slide template or deck was provided, so no sample slides were invented.
