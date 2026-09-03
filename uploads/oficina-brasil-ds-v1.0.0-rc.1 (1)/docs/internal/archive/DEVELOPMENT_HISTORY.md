# Histórico de desenvolvimento (documento interno)

> **Este arquivo é uso interno, não documentação pública do produto.**
> Registra o histórico de construção do Oficina Brasil Design System —
> versões internas 2.x, rodadas de revisão, e as correções feitas em
> cada uma — antes do congelamento de escopo pra v1.0.0. Não é linkado
> do README público nem da navegação do Style Guide. O `CHANGELOG.md`
> público começa na v1.0.0; este arquivo é a continuação, pra quem
> precisar entender uma decisão técnica específica tomada durante a
> construção.

---

# Changelog

## 2.29.0 — Agosto 2026

### Correções do 5º handoff "Correções pendentes v2.28.0" (ver `CONSOLIDATION.md`)

- **FIX-01**: `BrandSelect` — clique no próprio gatilho pra fechar
  ainda usava `setOpen` direto, terceiro caminho de fechamento
  esquecido na correção anterior. `openMenu()` extraído como função
  própria, reaproveitada no gatilho — todo caminho de abrir/fechar
  passa por `openMenu()`/`close()` agora
- **TECH-01**: `tsconfig.lib.json` já existia mas nunca tinha sido
  conectado a um script. Novo `typecheck:lib`, validado com um erro de
  tipo real introduzido de propósito num componente arquivado — `tsc`
  normal não pegava, `typecheck:lib` pegou. Adicionado ao CI
- **DOC-01**: 3ª recorrência de contagens desatualizadas no README —
  dessa vez implementado o guardrail automatizado
  (`scripts/verify-readme-counts.js`), não só corrigido o número.
  Pegou uma divergência real dentro da própria sessão que o criou
  (161→162 depois de um teste novo)

`axe-core` real 0 violações. 2 testes novos. 162/162 funcionais, 46/46
visual sem atualizar imagem nenhuma.

## 2.28.0 — Agosto 2026

### Correções do 4º handoff "Correções pendentes v2.27.0" (ver `CONSOLIDATION.md`)

- **FIX-01**: `BrandSelect` tinha o mesmo tipo de fechamento
  inconsistente já corrigido no `MultiSelect` — `close()` centralizado,
  `useEscapeKey` (listener no document, funciona com foco em qualquer
  elemento interno), busca sempre limpa em qualquer caminho de
  fechamento
- **API-01**: `MultiSelect` tinha `label` obrigatório e
  `ariaLabelledBy` opcional ao mesmo tempo — contradição real de
  contrato. Corrigido com união discriminada, exigindo exatamente um
  dos dois em tempo de compilação
- **DOC-01**: bloco de Props do `MultiSelect` na documentação
  atualizado pra refletir a união discriminada
- **DOC-02**: contagens do README sincronizadas (150→157, 227→234) —
  2ª recorrência desse tipo de item, recomendação de guardrail
  automatizado registrada mas não implementada (fora do escopo)

### Achados reais no processo
- `tsconfig.json` não inclui `components/` diretamente no compilador —
  só `app`/`lib`. Descoberto ao tentar confirmar que a união
  discriminada rejeitava cenários inválidos: um teste colocado direto
  em `components/` ficou invisível pro `tsc`, mesmo com erro óbvio.
  Corrigido movendo o teste temporário pra `app/`. Não corrigido no
  tsconfig (fora do escopo), registrado como ponto cego real
- Erro cometido e corrigido: uma edição de texto apagou a linha de
  abertura de um `test.describe` existente, deixando o corpo órfão —
  pego contando `describe(`/`})` antes de rodar qualquer teste

`axe-core` real 0 violações. 6 testes novos. 161/161 funcionais, 46/46
visual (1 imagem atualizada — Props do multi-select mudou de verdade).

## 2.27.0 — Agosto 2026

### Correções do 3º handoff "Correções pendentes v2.26.0" (ver `CONSOLIDATION.md`)

- **FIX-01**: `BrandSelect` tinha o mesmo bug de Enter-com-menu-fechado
  já corrigido no `MultiSelect` no handoff anterior — na hora, só o
  `MultiSelect` foi citado, o `BrandSelect` ficou de fora por engano.
  Corrigido separando `handleTriggerKeyDown`/`handleListKeyDown`, mesmo
  padrão já usado no `MultiSelect`
- **FIX-02**: `MultiSelect` ganhou nome acessível (prop `label`
  obrigatória, ou `ariaLabelledBy` opcional) e `aria-controls` ligando
  o combobox à listbox via `useId()`. Adicionado à auditoria
  `axe-core` (fechado e aberto) — estava genuinamente ausente antes
- **DOC-01**: contagens do README sincronizadas (140→150 testes no
  gate, 217→227 no total) — confirmado com `playwright test --list`
  sem filtro antes de publicar, não só aritmética

### Processo usado nessa rodada
Implementei os 3 itens de uma vez, validação completa **uma vez só no
final** (não a cada correção) — mudança de processo combinada
explicitamente pra acelerar o ritmo de entrega. Testes manuais restritos
aos 2 cenários que o próprio handoff pediu pra confirmar.

`axe-core` real no `MultiSelect` (fechado e aberto): 0 violações. 6
testes de regressão novos. 157/157 funcionais, 46/46 visual sem
atualizar imagem nenhuma.

## 2.26.0 — Agosto 2026

### Correções do handoff "Correções pendentes" (base v2.25.0, ver `CONSOLIDATION.md`)

- **FIX-01**: `grid-cols-5` fixo na home do Style Guide corrigido pra
  responsivo (1→2→3→5 colunas conforme viewport); tabela de
  combinações aprovadas ganhou wrapper `overflow-x-auto`
- **FIX-02**: testes de dark mode separados do gate de release —
  `test:functional` agora exclui `"dark mode:"`, novo script
  `test:dark-mode` roda só eles
- **FIX-03**: `VisuallyHiddenInput` ganhou `tabIndex={-1}` (não
  sobrescrevível) — achado que eu mesmo já tinha documentado sem
  corrigir numa rodada anterior, por estar fora daquele escopo
- **FIX-04**: `BrandSelect`/`MultiSelect` tinham `<span role="button">`
  aninhado dentro do `<button>` do gatilho (inválido, sem teclado).
  `BrandSelect`: "×" virou botão real irmão do gatilho. `MultiSelect`:
  gatilho virou `<div role="combobox">`, liberando os "×" de cada chip
  pra serem botões reais validamente aninhados
- **FIX-05**: `MIGRATION.md` corrigido de 45→46 componentes

### Bug real encontrado e corrigido durante o teste da própria correção
Depois de reestruturar o `MultiSelect`, o cenário de Tab+Enter pra
remover um chip não funcionava — o menu abria em vez do chip sair. O
`keydown` do botão de remover propagava pro `div` pai, que interceptava
`Enter` incondicionalmente com `preventDefault()`, suprimindo a
remoção. Corrigido checando `e.target === e.currentTarget`.

### Testes antigos corrigidos por mudança estrutural legítima
2 arquivos de teste usavam `button[aria-haspopup=listbox]` pro
`MultiSelect`, que deixou de ser `<button>` — corrigidos pra
`[role=combobox]`. Um 4º uso do mesmo seletor, no teste do `FilterBar`
(que usa `BrandSelect`, ainda `<button>`), não foi tocado.

`axe-core` real 0 violações. 24 testes de regressão novos + 3
seletores corrigidos. 150/150 funcionais (gate sem dark mode), 46/46
visual sem atualizar imagem nenhuma.

## 2.25.0 — Agosto 2026

### Implementação das 3 decisões de escopo confirmadas com o time (ver `CONSOLIDATION.md`)

- **Dark mode fora do escopo oficial da v1**: arquitetura de tokens e
  testes automatizados continuam funcionando por baixo — só a alegação
  de suporte oficial saiu da documentação. Seção nova no `README.md`
  ("Tema oficial da v1: light mode"), nota de escopo no `MIGRATION.md`
- **`LogoCutout` fora do escopo público**: movido pra
  `components/_archive/logo-cutout.tsx` (não apagado) — saiu da pasta
  que o gerador de exports varre automaticamente, então sai do pacote
  público sem mexer no script. Removido da navegação (seção "Grafismos
  de marca" inteira, não só o item) e da documentação
- **Achado real no processo**: a página `/comunidade` usava o
  `LogoCutout` de verdade (não só a documentação) — corrigido removendo
  o uso de lá também, senão o build quebraria
- **Light mode como único tema oficial de release**: declarado
  explicitamente no `README.md`

### Achado adicional fora do escopo original, corrigido no processo
`README.md` tinha contagens de teste completamente desatualizadas
(181/136/45, de uma fase muito anterior) — corrigidas pros números
reais (217/171/46).

Componentes: 46 → 46 (net zero na contagem total do projeto, mas
`LogoCutout` saiu e nada substituiu). Confirmado com Chrome real: rota
antiga do `LogoCutout` retorna 404, `/comunidade` continua funcionando,
dark mode continua tecnicamente ativo por baixo. 171/171 funcionais,
46/46 visual (contagens corretamente reduzidas em 1 — a página removida
saiu das duas suítes).

Com essa versão, tanto o relatório de smoke test manual quanto as 3
decisões de escopo estão implementados e testados por completo.

## 2.24.0 — Agosto 2026

### Correções dos itens de Baixa prioridade/design do smoke test manual (ver `CONSOLIDATION.md`)

- **UX-01**: padding assimétrico (`pr-7`) no seletor de linhas do `Pagination`, acomodando a seta nativa
- **DOC-01**: nomenclatura "Select" → "BrandSelect" na sidebar, batendo com o título real da página
- **DOC-02**: documentação do `VisuallyHiddenInput` reescrita, removendo frase ambígua sobre "alcançável por teclado". Achado real fora do escopo, documentado não corrigido: falta `tabIndex={-1}`
- **DESIGN-01**: `--warning-surface` do Badge trocado pra um tom já registrado (`#A2551D`, reaproveitado de `warning-subtle-foreground`) com texto branco, unificando com as demais variantes
- **DESIGN-02**: `--success-surface` atualizado pra `#008476` + branco (4,60:1). Novo par `--brand-turquesa-surface`/`-foreground`, mantendo a primitive pura `--brand-turquesa` intocada. **Achado real no processo**: `AdminPageHeader` tinha `opacity-85` no subtítulo reduzindo o contraste efetivo — mesma categoria de bug já corrigida no `Alert` antes, corrigido removendo a opacity

### Instabilidade real de ambiente identificada e resolvida
Uma rodada de atualização de imagens de regressão visual usou um
processo de servidor antigo que tinha ficado travado — gerou referências
desatualizadas, causando falhas amplas na revalidação seguinte. Raiz
identificada comparando a captura atual (correta) contra a referência
salva (desatual), não aceita às cegas. Processos residuais eliminados,
build refeito do zero, confirmado estável em 3 rodadas depois.

Com essa versão, todos os itens do relatório de smoke test manual estão
implementados e testados — resta só a implementação das 3 decisões de
escopo já confirmadas com o time.

`axe-core` real (0 violações, 9 páginas), 22 testes de regressão novos
(total: 44), 172/172 funcionais, 47/47 visual.

## 2.23.0 — Agosto 2026

### Correções dos 3 itens de Alta prioridade do smoke test manual (ver `CONSOLIDATION.md`)

- **BUG-02** (DatePicker não fecha ao clicar fora): reaproveitados
  `useClickOutside`/`useEscapeKey` já testados no resto do DS. Clique
  fora e Esc descartam o rascunho não aplicado, restaurando o último
  valor de fato aplicado — só "Aplicar" grava de verdade
- **BUG-07** (FilterBar demo não aplicava categoria): `value={null}` +
  `onChange={() => {}}` fixos corrigidos, conectados ao array de filtros
  ativos real
- **BUG-08** (Style Guide sem responsividade mobile): sidebar vira
  drawer abaixo do breakpoint `md`, com botão de menu, backdrop, e
  fechamento por Esc. **Achado extra no caminho**: `DataTable` usava
  `overflow-hidden` só pra cantos arredondados, sem scroll próprio —
  tabela larga ficaria cortada em mobile, não rolável. Corrigido com
  wrapper interno `overflow-x-auto`

Validação: `axe-core` real (0 violações, desktop e mobile com menu
aberto), 8 testes de regressão novos. **Instabilidade real pega no
próprio teste**: leitura de posição da sidebar coincidia com o meio da
transição CSS — corrigido esperando a transição terminar, 5x estável
depois. 168/168 funcionais, 47/47 visual.

## 2.22.0 — Agosto 2026

### Correções dos 5 bloqueadores do smoke test manual (ver `CONSOLIDATION.md`)

Handoff externo com smoke test real (base avaliada: v2.21.1). Verifiquei
cada item contra o código antes de aceitar — todos se confirmaram.

- **BUG-01** (overlays atrás da sidebar fixed sem z-index): `lib/use-popover-position.ts`
  reescrito pra calcular coordenadas reais de `position: fixed` com
  colisão horizontal e vertical (antes só horizontal); `DropdownMenu`,
  `Popover`, `InfoTooltip` migrados pra `createPortal`. `InfoTooltip`
  perdeu a prop `align` (substituída por detecção automática)
- **BUG-03** (MultiSelect: Enter com menu fechado selecionava direto):
  separado o tratamento de teclado por estado open/closed
- **BUG-04** (MultiSelect: busca não limpa no clique-fora): centralizada
  função `close()` única
- **BUG-05** (Tooltip/InfoTooltip sem Escape): adicionado `useEscapeKey`
  nos dois
- **BUG-06** (DataTable sem ordenação por teclado): `<th onClick>` →
  `<button>` real dentro do `<th>`. 2 testes antigos corrigidos (miravam
  o `<th>` inteiro, não o botão)
- **A11Y-01** (gráficos dependem de hover): `LineChart`/`BarChart`
  ganharam tabela de dados `sr-only` associada

Validação: `axe-core` real (0 violações, 8 páginas), 22 testes de
regressão novos, 161/161 funcionais, 47/47 visual.

### Decisões de escopo confirmadas
Dark mode fora do escopo oficial (arquitetura/testes mantidos),
`LogoCutout` fora do escopo público (arquivado), light mode como único
tema de release — implementação pendente.

### Erro pego a tempo
Um teste de regressão do BUG-02 (não implementado nesse lote) foi
escrito por engano junto com os bloqueadores — removido antes de rodar
a suíte.

## 2.21.1 — Agosto 2026

### Documentação: VoiceOver/NVDA marcado como limitação, não pendência
- O `CONSOLIDATION.md` tratava teste real de leitor de tela como um
  item "não iniciado" da Sprint 3, como se fosse só uma questão de
  tempo. Corrigido: este é um limite real e permanente do ambiente
  usado nesta sessão (container Linux sem VoiceOver/NVDA, que só
  existem em macOS/Windows) — não algo que ficaria "concluído" numa
  rodada futura da mesma forma que os outros itens
- Documentado com clareza o que a validação automatizada (`axe-core`,
  simulação de teclado via Playwright, estrutura semântica) cobre e o
  que ela não substitui — a experiência real de navegação só por áudio
- Recomendação registrada pro time: esse teste precisa de hardware/SO
  real (Mac ou Windows) e idealmente alguém com experiência de uso de
  leitor de tela no dia a dia

## 2.21.0 — Agosto 2026

### Sandbox consumindo o pacote real, não cópias (ver `CONSOLIDATION.md`)
- Dependências alinhadas com o que o pacote real exige como peer:
  React 18→19, Recharts 3→2
- Pacote empacotado (`npm pack`) e instalado como dependência `file:`
  local — exatamente como um consumidor real faria
- Todos os imports de `App.tsx` convertidos pra
  `oficina-brasil-design-system/*`, incluindo o CSS
- Pastas órfãs removidas (`src/components/`, `src/lib/`, `tokens.ts`
  duplicado)
- **Achado real**: Tailwind v3 local tentava reprocessar o CSS já
  compilado do pacote (Tailwind v4), erro de sintaxe `@layer`. Removido
  o Tailwind inteiramente do sandbox — `App.tsx` não usa nenhuma classe
  própria, então não é perda, é a fonte de conflito eliminada
- **Achado real**: sandbox nunca teve `tsconfig.json`/typecheck de
  verdade — criado do zero, confirmado limpo
- **Vulnerabilidade real corrigida**: falha de segurança direta no
  próprio Vite 5.x (não transitiva) — atualizado pra Vite 8
- `__dirname` depreciado corrigido no `vite.config.ts`
- Versão inventada de `@types/react-dom` pega antes de instalar,
  corrigida pra uma real
- Validado com Chrome real: fonte, cores dos tokens, e múltiplos
  componentes interativos (`Modal`, `DropdownMenu`, `DatePicker`,
  `Tabs`, `DataTable`) funcionando de verdade através do pacote
- `README.md` do sandbox reescrito, contagem antiga corrigida
- Suíte do projeto principal revalidada: 149/149

## 2.20.0 — Agosto 2026

### Padrão `asChild` — Popover e DropdownMenu (ver `CONSOLIDATION.md`)
- Achado real de revisão externa: sem `asChild`, passar um `<button>`
  como trigger gerava `<button><button>...</button></button>` —
  interação aninhada inválida
- Novo utilitário compartilhado `lib/as-child.tsx` — clona o elemento
  filho e funde as props direto nele, sem envolver em nada. Sem
  `asChild` (padrão), comportamento antigo preservado
- Aplicado no `Popover` e `DropdownMenu`, com exemplos reais nas páginas
  de documentação usando o `Button` do sistema
- Limitação documentada: ref existente no filho é substituída, não
  mesclada — não afeta o caso de uso comum
- Confirmado com Chrome real: sem `asChild` preserva comportamento
  antigo; com `asChild` e um `<button>` real, zero aninhamento, props
  corretas fundidas
- 10 testes de regressão permanentes
- 149/149 funcionais, 47/47 visual (2 imagens atualizadas — páginas
  ganharam exemplos novos)

## 2.19.0 — Agosto 2026

### Portal + useId nos overlays de tela cheia — início da Sprint 3 (ver `CONSOLIDATION.md`)
- `Modal`, `AlertDialog`, `CommandPalette` agora renderizam via
  `createPortal(..., document.body)`, não mais no lugar da árvore React
  — evita clipagem por `overflow`/stacking context de um ancestral numa
  aplicação real
- IDs fixos (`modal-title`, `alert-dialog-title`, `command-palette-list`)
  trocados por `useId()` — evita colisão com múltiplas instâncias
- `useClickOutside` estendido pra aceitar múltiplas refs — necessário
  porque com portal o conteúdo fica numa subtree DOM diferente do
  gatilho
- Escopo decidido conscientemente: só overlays de tela cheia por agora
  (centralizados via `fixed inset-0`, portal direto). Popovers
  posicionados relativo ao gatilho (`Popover`, `DropdownMenu`,
  `MultiSelect`, `BrandSelect`, `DatePicker`, `Tooltip`) exigiriam
  reescrever a lógica de posicionamento pra coordenadas calculadas via
  `getBoundingClientRect()` — documentado como item futuro, não
  arriscado agora sem necessidade comprovada

### Duas instabilidades reais encontradas e corrigidas no caminho
- **`CommandPalette`**: um teste existente não esperava `networkidle`
  antes de disparar `Ctrl+K` — sob carga, o atalho podia disparar antes
  da hidratação terminar. Confirmado ~10% de falha antes da correção,
  0% depois (25 rodadas)
- **`LineChart`/`BarChart`**: a animação de entrada do Recharts (JS/SVG)
  não é afetada pelo `animations: 'disabled'` do Playwright, deixando a
  regressão visual instável. Novo prop `isAnimationActive` (padrão
  `true`, preserva a animação real no produto), desligado só nas
  páginas de documentação

### Achado no caminho
- `@types/react-dom` nunca tinha sido instalado (não era necessário até
  usar `createPortal`) — adicionado, `0` vulnerabilidades confirmado

`axe-core` real nos 3 componentes com portal, light/dark: 0 violações.
144/144 funcionais, 47/47 visual.

## 2.18.0 — Agosto 2026

### Foundations além de cor — investigado, Sprint 2 concluída (ver `CONSOLIDATION.md`)

**Achado principal, antes de propor qualquer token novo**: catalogado o
que já se repete nos 47 componentes (mesmo princípio de sempre) —
diferente das cores (hex literal em `style={{}}`, sem sistema nenhum por
trás), tipografia, spacing, z-index e motion **já são governados pelo
Tailwind** via classes utilitárias (`text-sm`, `py-2`, `z-10`,
`transition-colors`), não números inventados soltos. A categoria de
problema que justificou a Sprint 2 inteira majoritariamente não existe
nesses outros domínios.

- Tipografia: `text-sm`/`text-xs` dominam (52/25 ocorrências), escala do
  próprio Tailwind
- Z-index: só 2 valores (`z-10` popovers, `z-50` overlays de tela
  cheia), já um sistema limpo e consistente
- Motion: só classes padrão do Tailwind, sem duração customizada; o
  único `transition-all` é escolha legítima (anima `width`)
- Único ponto real de inconsistência: padding vertical de formulário
  varia sem escala nomeada — registrado como item de baixa prioridade,
  não corrigido agora pelo mesmo motivo dos 34 `<button>` crus (risco de
  regressão espalhado sem urgência real)

**Conclusão**: não inventamos tokens novos sem necessidade real — isso
iria contra o princípio que guiou a sprint inteira.

### 🎉 Sprint 2 de consolidação concluída

Todos os itens fechados: camada semântica (2B), `destructive` corrigido
em 6 sub-tokens (2C), migração completa de cores (2D, 19→1 arquivo com
hex), zero hardcodes (2E), guardrail no CI cobrindo hex e `rgba()` (2F),
propagação global testada com consumidor real (2G), `Button`/`IconButton`,
e foundations investigadas. Ver `CONSOLIDATION.md` para o relatório
completo de cada item.

## 2.17.0 — Agosto 2026

### `Button` e `IconButton` (ver `CONSOLIDATION.md`)
- Extraídos da repetição real dos 34 `<button>` crus já catalogados —
  `rounded-lg` já dominava esmagadoramente (23 ocorrências), não uma
  escolha nova
- `Button`: 5 variantes (primary/secondary/outline/ghost/destructive),
  3 tamanhos, `<button>` nativo, `icon`, `loading` com `aria-busy` real
- `IconButton`: variante circular só de ícone, `aria-label` obrigatório
  no tipo (não opcional) — extraído dos 11 usos de `rounded-full` já
  catalogados
- Anel de foco usa `var(--focus-ring-primary)`/`var(--focus-ring-destructive)`,
  os tokens criados no 2F desta mesma sprint
- **Achado no meu próprio processo de teste**: testei o anel de foco
  navegando com Tab genérico e o resultado veio vazio — investigado
  antes de assumir bug do componente, era o Tab caindo em outro
  elemento. Confirmado com foco direto que funciona corretamente
- Confirmado numericamente: `primary` muda de azul pra verde sozinho
  entre temas, `destructive` mantém anel de foco vermelho distinto
- `axe-core` real: 0 violações, light e dark mode
- 14 testes de regressão permanentes (achei e corrigi um seletor
  ambíguo no meu próprio teste no caminho)
- Build da biblioteca: 47 componentes agora exportados

### Decisão consciente, não migração em lote
Os 34 `<button>` crus existentes **não** foram migrados pra usar as
primitives novas nesta versão — cada um já foi testado individualmente
ao longo da sessão inteira, e trocar todos de uma vez introduziria risco
de regressão espalhado sem ganho proporcional imediato. Fica como
trabalho futuro incremental, componente por componente.

Componentes: 45 → 47 (46 de UI + `icons.tsx`)

## 2.16.0 — Agosto 2026

### Lotes 3+4 do 2D, 2E, 2F — fecha a migração de cores da Sprint 2 (ver `CONSOLIDATION.md`)

**Lote 3** (`AdminPageHeader`, `KpiCard`, `Considerations`, `InfoTooltip`):
- Completado o conjunto `--brand-*` (azul, turquesa, branco + pares de
  foreground) — as 6 cores nomeadas de `contrast-rules.ts` agora têm token
- Confirmado numericamente que cor de marca não muda entre temas
  (`rgb(144,242,82)` idêntico em light/dark) — validando a distinção
  conceitual "cor de marca fixa" vs "cor semântica de tema"

**Lote 4** (`DatePicker`, último lote de hex):
- Achado real: "dentro do intervalo" usava azulClaro fixo — virou
  `var(--secondary)`, que já tinha esse valor exato no light mode.
  Calculado o contraste do texto por cima contra o novo valor escuro do
  dark mode (9.95:1) antes de aceitar a substituição
- **Resultado: 19→1 arquivo com hex, 83→1 ocorrência** (só a bolinha do
  `Switch`, exceção documentada de propósito)

**2E** — confirmado: 0 hex não-intencional (1 exceção deliberada, documentada)

**2F** — escopo ampliado pra além de hex, como apontado:
- Catalogadas 44 ocorrências reais de `rgba()` em 19 arquivos —
  inclusive componentes que "pareciam" limpos (`Modal`, `Popover`, `Input`)
- Achado: vários valores eram quase-duplicados divergentes sem intenção
  (drift de digitar à mão), não níveis de elevação diferentes de propósito
- Criada escala de 4 níveis de sombra + overlay + 2 anéis de foco, as 44
  ocorrências migradas de uma vez
- `verify-token-source.js` estendido — detecta `rgb()/rgba()/hsl()/hsla()/oklch()`
  cru, validado que pega o problema reintroduzido de propósito
- `axe-core` real em 7 componentes afetados, light/dark: 0 violações
- 45/45 regressão visual sem precisar atualizar imagem nenhuma

Com isso, a migração de cores da Sprint 2 (2A-2G) está completa. Restam:
`Button`/`IconButton` e foundations além de cor.

## 2.15.0 — Agosto 2026

### Lote 2 do 2D — componentes de status (ver `CONSOLIDATION.md`)
- Novos tokens `--success-*`, `--warning-*`, `--info-*` (surface/
  surface-foreground/subtle/subtle-foreground/border), mesma estrutura do
  `--destructive-*` da 2C
- **Decisão de design perguntada antes de migrar**: sistema usava verde
  (`Alert`/`Badge`) e turquesa (`Toast`/`FileUploadButton`) pro mesmo
  significado "success" — **turquesa escolhido como canônico**
- `Alert`, `Badge`, `Toast`, `FileUploadButton` migrados
- Valores calculados com contraste real: turquesa só aprovado com
  azulEscuro (nunca branco, confirmado em `contrast-rules.ts` antes de
  assumir); azul puro falhava como texto sobre fundo escurecido no dark
  mode (1.68:1) — azulClaro resolve (16.70:1)
- **Achado real**: `FileUploadButton` misturava ação primária (estado
  padrão) com status (sucesso) — migrado distinguindo os dois conceitos
- **Lacuna de documentação encontrada e corrigida**: página do `Toast`
  nunca tinha botão pra disparar a variante `info` — adicionado
- **Falso positivo pego a tempo**: testei `Toast` sem clicar nos botões
  primeiro (componente condicional, só existe depois de disparado) —
  corrigido clicando de propósito antes do `axe-core`
- **Achado visual honesto, registrado, não escondido**: `success` e
  `info` do `Alert` ficam visualmente próximos em light mode (turquesa
  clara vs azulClaro são hues parecidos bem dessaturados) — consequência
  da escolha de turquesa, já confirmada
- Validado com `axe-core` real em light/dark, 0 violações, incluindo as 3
  variantes do `Toast` de fato disparadas e visíveis
- Contagem: 10→6 arquivos, 67→40 ocorrências
- 137/137 funcionais, 45/45 visual (3 imagens atualizadas, revisadas antes)

## 2.14.0 — Agosto 2026

### Correção de números (feedback de revisão)
- `--destructive` tem **6** sub-tokens, não 5 (contagem corrigida em toda a documentação)
- Contagem real de hex em componentes: **19 arquivos, 83 ocorrências** (não 20/87 — número anterior incluía menções em comentários)

### Lote 1 do 2D — conversões óbvias (ver `CONSOLIDATION.md`)
- `Checkbox`, `RadioGroup`, `Switch`, `Pagination`, `MultiSelect`,
  `DropdownMenu`, `CopyButton`, `Tooltip`, `ProgressBar`, `ProgressRing`
  migrados pra tokens semânticos (`var(--primary)`,
  `var(--destructive-text)`, `var(--brand-azul-escuro)`)
- Novo token completado: `--brand-azul-escuro-foreground` (branco, já
  aprovado por `contrast-rules.ts`, faltava o registro)
- **Achado real de contraste no `DropdownMenu`**: item normal do menu
  usava hex fixo que nunca se adaptava ao dark mode — corrigido
- **Lacuna de teste real corrigida**: a suíte de dark mode só testava
  páginas fechadas — o `DropdownMenu` só renderiza itens quando aberto,
  por isso o bug acima nunca foi pego antes. Novo teste abre o menu de
  verdade antes de checar contraste
- **Decisão consciente de não migrar**: a bolinha branca do `Switch`
  ficou como hex fixo de propósito — migrar pra `var(--primary-foreground)`
  teria introduzido um bug real de visibilidade no dark mode
- Achado extra: um `text-white` (classe Tailwind, não hex) também
  corrigido no `Checkbox` — uma terceira categoria de cor não-governada
- **Validado com `axe-core` real em light e dark mode nos 10 componentes,
  incluindo o `DropdownMenu` aberto de verdade**: 0 violações
- Contagem depois do lote: 19→10 arquivos, 83→67 ocorrências
- 137/137 testes funcionais, 45/45 regressão visual (sem precisar
  atualizar imagens — aparência idêntica em light mode)

### Ainda pendente (ver `CONSOLIDATION.md`)
- Lote 2 (Alert/Badge/Toast/FileUploadButton — precisa de tokens novos de success/warning/info)
- Lote 3 (AdminPageHeader/KpiCard/Considerations/InfoTooltip — tokens de marca fixa, não semânticos de tema)
- Lote 4 (DatePicker)
- 2F precisa cobrir `rgba()`/`hsl()`/etc, não só hex — achado real em 8 arquivos que "pareciam" limpos

## 2.13.0 — Agosto 2026

### Camada semântica + `destructive` corrigido — Sprint 2 (ver `CONSOLIDATION.md`)
- **Reclassificação a partir de feedback de revisão**: o item "fonte
  única de verdade pra tokens" foi dividido em sub-etapas mais precisas
  (2A-2G) — a entrega anterior só cobria "toda cor tem primitiva
  registrada" (2A), não "fonte única de verdade completa"
- **`--destructive` separado em 6 sub-tokens de responsabilidade única**:
  `--destructive-text`, `--destructive-surface`,
  `--destructive-surface-foreground`, `--destructive-subtle`,
  `--destructive-subtle-foreground`, `--destructive-border` — o token
  antigo tentava representar texto e superfície ao mesmo tempo, forçando
  o `AlertDialog` a ignorá-lo e usar hex fixo
- Novo tom de `--destructive-subtle` calculado pro dark mode (vermelho
  escurecido em direção ao preto, não a tinta clara do light mode) —
  **validado com `axe-core` real: 0 violações em light e dark mode**,
  incluindo o `AlertDialog` com o botão destrutivo aberto de verdade
- `Checkbox`, `Input`, `Label`, `Textarea`, `StatComparison`, `Badge` e
  `AlertDialog` migrados pros novos tokens — eliminando a exceção que
  forçava hex fixo
- Achado extra: `--ring` tinha hex fixo coincidindo manualmente com
  `--primary` — convertido pra `var(--primary)`, referência de verdade
- **Teste de propagação global feito de verdade** (não simulado): troquei
  `--primary` temporariamente por magenta, confirmei que `FilterBar` e
  `Tabs` mudaram sozinhos (sem tocar nos componentes), e que
  `ProgressRing` (ainda não migrado) continuou na cor antiga — provando
  com números reais a fronteira exata entre o que já funciona e o que
  falta migrar
- **Correção de direção importante**: a proposta original desta sprint
  era migrar componentes pra importar constantes JS de `lib/tokens.ts`
  — corrigido a tempo: isso não resolveria nada, já que uma constante JS
  fixa não responde a light/dark. A camada certa é CSS (`var()`)

Ainda pendente: migrar os 20 componentes restantes com hex literal pra
usar tokens semânticos por referência (2D/2E), e reforçar o CI pra
impedir hex novo nos componentes (2F).

## 2.12.0 — Agosto 2026

### Fonte única de verdade pra tokens — início da Sprint 2 (ver `CONSOLIDATION.md`)
- 6 cores geradas pro dark mode (achadas por revisão externa, números
  exatos confirmados contra o código) registradas em `lib/tokens.ts` —
  antes existiam só espalhadas em `globals.css`, sem primitiva central
- Novo `npm run verify:tokens`, ligado ao CI — garante que todo hex usado
  no CSS ou nos componentes tem uma primitiva registrada, pega drift
  futuro automaticamente
- **Achado de design, não só de token**: `InfoTooltip` e `CopyButton`
  usavam um preto genérico (`#0A0A0A`) sem relação com a marca — unificado
  pra `azulEscuro` (`#00134E`), consistente com o `Tooltip` e o resto do
  sistema, testado visualmente com Chrome real
- Inconsistência de maiúscula/minúscula corrigida (`#18328a` → `#18328A`,
  `#ffffff` → `#FFFFFF`) no CSS do Slider

### Ainda pendente da Sprint 2 (ver `CONSOLIDATION.md`)
- Migrar os 21 componentes pra importar as primitivas em vez de repetir
  hex literal (essa versão só garante que toda cor *tem* uma primitiva,
  não que os componentes a *usam por referência*)
- Separar `--destructive` em tokens de texto vs. superfície
- `Button`/`IconButton`
- Foundations além de cor (tipografia, spacing, shadows, motion, z-index)

## 2.11.0 — Agosto 2026

### Imports portáveis — fecha a Sprint 1 de consolidação (ver `CONSOLIDATION.md`)
- 8 componentes (`Alert`, `AlertDialog`, `BrandSelect`, `CommandPalette`,
  `DropdownMenu`, `Modal`, `MultiSelect`, `Popover`) usavam o alias
  `@/lib/*` internamente — funcionava aqui, mas quebraria num produto
  real sem esse alias configurado. Convertido pra caminho relativo
  (`../lib/*`)
- **Validado nos dois sentidos**: confirmei que o import antigo de fato
  falhava (`error TS2307`) num projeto de teste sem alias, e que depois
  da correção, copiar `components/` + `lib/` literalmente pra um projeto
  novo (sem nenhuma configuração de alias) passa no `tsc --noEmit` sem erro
- `MIGRATION.md` corrigido — e um problema relacionado descoberto no
  processo: a instrução original só mandava copiar 2 arquivos específicos
  de `lib/`, nunca a pasta inteira, o que quebraria agora que componentes
  dependem de outros arquivos dela (os hooks) via caminho relativo
- Novo `npm run verify:portable`, ligado ao CI — confirma que nenhum
  componente usa o alias `@/` internamente

### 🎉 Sprint 1 de consolidação concluída
Todos os itens do plano original fechados: exports completos, CSS
distribuído, dependencies corrigidas, `private` revisado, fonte Figtree
carregando de verdade, e imports portáveis. Ver `CONSOLIDATION.md` para
o relatório completo de cada item, incluindo os achados reais e como cada
um foi validado com consumidores reais, não assumido.

## 2.10.0 — Agosto 2026

### Fonte Figtree carregando de verdade (Sprint 1 de consolidação — ver `CONSOLIDATION.md`)
- **O achado mais grave da revisão externa**: `font-family: 'Figtree'`
  estava só declarado em `globals.css`, sem nenhum mecanismo real de
  carregamento — confirmado com teste de navegador real que isso
  renderizava em `Liberation Sans`, afetando toda validação visual já
  feita no projeto, incluindo as 45 imagens de referência da regressão visual
- `next/font/local` implementado em `app/layout.tsx`, carregando o
  arquivo real da fonte variável (`Figtree[wght].ttf`, baixado do
  repositório oficial `github.com/google/fonts` — `fonts.googleapis.com`
  não está acessível neste ambiente de build)
- **Dois bugs reais encontrados testando com um consumidor externo do
  pacote**: `var(--font-figtree)` sem fallback interno invalidava a
  declaração inteira de `font-family`; e mesmo corrigido, um consumidor
  sem `next/font` não tinha a fonte resolvendo pra nada real. Corrigidos
  com `var(--font-figtree, 'Figtree')` + um novo
  `scripts/append-font-face.js` que copia a fonte real e a licença OFL
  pro `dist/` e injeta um `@font-face` portável no CSS distribuído
- Sandbox (`render-test/`) corrigido também — trocado o `<link>` do
  Google Fonts (dependia de rede externa, falhava com 403 nesse ambiente)
  pela mesma fonte auto-hospedada
- `verify:lib` estendido — confirma que a fonte e o `@font-face` portável
  existem no pacote publicado
- **Validado com `document.fonts` real do navegador em 3 contextos**: app
  principal, sandbox, e um consumidor externo do pacote sem `next/font`
  — os três confirmados `status: "loaded"`, não só a declaração CSS
- **As 45 imagens de referência da regressão visual foram regeneradas**
  — mudança esperada, já documentada como risco desde a criação da
  suíte visual, não uma surpresa

Com esta versão, restam apenas correções de documentação (`MIGRATION.md`)
pra fechar a Sprint 1 inteira de consolidação.

## 2.9.0 — Agosto 2026

### Dependências corrigidas (Sprint 1 de consolidação — ver `CONSOLIDATION.md`)
- `react`, `react-dom`, `recharts` não aparecem mais em `dependencies` E
  `peerDependencies` ao mesmo tempo — movidos pra `devDependencies` (esse
  repositório continua instalando tudo normalmente) + mantidos em
  `peerDependencies` (consumidor real da biblioteca provê a própria versão)
- **Validado com dois consumidores reais diferentes**: um projeto que já
  tinha `react` instalado (confirmado sem cópia duplicada aninhada) e um
  projeto sem `react` nenhum (confirmado que o npm moderno resolve a
  peer dependency sozinho, instalando a versão certa)
- `private: true` **revisado e mantido de propósito** — não é descuido;
  mudar isso exige primeiro decidir um alvo real de publicação (decisão
  de infraestrutura do time, deixada em aberto desde a Fase 6), não só
  remover a flag

## 2.8.0 — Agosto 2026

### CSS distribuído junto com o pacote (Sprint 1 de consolidação — ver `CONSOLIDATION.md`)
- Novo `npm run build:css` (usa `@tailwindcss/cli`) — gera
  `dist/styles.css` a partir do mesmo `app/globals.css` que o app Next.js
  usa, com todos os tokens (light + dark mode) e estilos que exigem CSS
  puro (thumb do Slider)
- Quem consumir o pacote agora importa isso uma vez:
  `import 'oficina-brasil-design-system/styles.css'`
- `build:lib` roda `build:css` automaticamente como último passo
- `verify:lib` estendido — confirma que o CSS existe e contém os tokens
  essenciais, falha o CI se regredir
- **Validado com um consumidor real, num bundler diferente do Next.js**:
  projeto Vite criado do zero, pacote instalado via `npm pack` +
  `npm install`, confirmado com Chrome real que as cores dos tokens
  resolvem corretamente (`rgb(0,19,78)` = `#00134E`, medido via
  `getComputedStyle`, não assumido)
- Achado corrigido antes de causar problema: o gerador de exports
  (`generate-exports.js`) sobrescrevia a entrada `./styles.css` do
  `package.json` sem querer a cada regeneração automática — corrigido
  incluindo essa entrada dentro do próprio gerador

## 2.7.0 — Agosto 2026

### Correção crítica de distribuição (Sprint 1 de consolidação — ver `CONSOLIDATION.md`)
- **11 componentes que existiam mas nunca eram exportados publicamente**
  (`Accordion`, `AlertDialog`, `Avatar`, `AvatarGroup`, `Breadcrumb`,
  `CommandPalette`, `MultiSelect`, `Popover`, `Slider`, `Tooltip`,
  `TreeView`) — achado por revisão externa, verificado contra o código
  antes de aceitar, corrigido
- `index.ts` e `package.json > exports` agora são **gerados
  automaticamente** (`npm run generate:exports`) a partir da mesma fonte
  que `tsup.config.ts` já usava — não mais uma lista escrita à mão que
  ficava desatualizada
- Novo `npm run verify:exports` — falha o CI se os arquivos gerados
  ficarem desatualizados de novo
- `scripts/verify-lib-build.js` estendido — confirma que todo componente
  realmente construído em `dist/` tem entrada em `exports`
- **Validado de ponta a ponta com um consumidor real**: empacotei via
  `npm pack`, instalei o `.tgz` num projeto vazio criado do zero, e
  confirmei os 4 componentes citados pela revisão (`Accordion`,
  `TreeView`, `MultiSelect`, `Badge`) funcionando via import por
  subcaminho — typecheck limpo e renderização real via SSR

### Achados documentados, ainda não corrigidos (ver `CONSOLIDATION.md`)
- CSS do design system não é distribuído junto com o pacote (`globals.css`
  fica de fora, componentes referenciam `var(--foreground)` etc. sem
  nenhum CSS definindo isso)
- `react`/`react-dom`/`recharts` duplicados em `dependencies` e
  `peerDependencies`
- Fonte Figtree declarada mas nunca carregada de fato (sem `next/font`,
  `@font-face` ou import do Google Fonts) — **isso significa que toda
  validação visual feita até agora, incluindo as imagens de referência da
  regressão visual, foi renderizada numa fonte substituta, não a Figtree
  real**
- `MIGRATION.md` afirma que imports internos são relativos, mas 8
  arquivos usam o alias `@/lib/*`

## 2.6.0 — Agosto 2026

### Testes de regressão visual (novo)
- `tests/visual-regression.spec.ts` — 45 páginas de documentação
  comparadas pixel a pixel a cada rodada (`toHaveScreenshot`), pegando
  mudanças visuais não intencionais que nem o teste funcional (comportamento)
  nem o axe-core (contraste/acessibilidade) cobrem
- Novos scripts: `npm run test:visual` (só regressão visual, 45 testes) e
  `npm run test:functional` (só comportamento, 136 testes) — a suíte
  completa junta passou de 5 minutos, então o CI roda os dois em passos
  separados agora

### Achado real de calibração
- O `maxDiffPixelRatio` inicial (2%) era **12x mais permissivo** do que o
  necessário — validado reintroduzindo de propósito uma cor errada real
  no `Badge` (info virando vermelho), que só moveu 0,17% dos pixels da
  página inteira e o teste passou mesmo assim. Recalibrado pra 0,05%,
  revalidado que aí sim pega o mesmo bug, revertido e confirmado
  passando de novo

### Duas limitações conhecidas, documentadas no próprio arquivo de teste
- A página do `DatePicker` foi **excluída de propósito** da regressão
  visual — mostra o mês atual dinamicamente, o que quebraria a imagem de
  referência toda vez que o mês virasse, por um motivo que não tem nada a
  ver com bug real
- As imagens de referência foram geradas no Chromium deste sandbox de
  desenvolvimento, não pelo `npx playwright install chromium` que o CI
  real usa — a primeira rodada no GitHub Actions pode falhar por
  diferença sutil de renderização entre as duas builds, não por bug de
  verdade. Se isso acontecer, a imagem de referência precisa ser
  regenerada rodando no próprio CI, não só localmente

## 2.5.0 — Agosto 2026

### Novos componentes
- **`AvatarGroup`** — empilha avatares com sobreposição real, indicador "+N" de excedente, reaproveita o `Avatar` existente
- **`Accordion`** — modo single (padrão) ou `allowMultiple`, estrutura semântica WAI-ARIA completa (`aria-expanded`, `aria-controls`, `role="region"`)
- **`TreeView`** — o padrão de teclado mais complexo do design system (WAI-ARIA "treeview"): Cima/Baixo navegam só itens visíveis, Direita expande/desce, Esquerda colapsa/sobe pro pai, Home/End
- **`CommandPalette`** — atalho global Ctrl+K/Cmd+K, busca sem acento, reaproveita `useFocusTrap`, `useEscapeKey` e `normalizeText` já existentes

### Bugs reais encontrados e corrigidos durante a construção
- **`AvatarGroup`**: usei `ringColor` como propriedade CSS inline — não
  existe, é só convenção de classe do Tailwind. Corrigido com a sintaxe
  de valor arbitrário (`ring-[var(--background)]`)
- **`CommandPalette`**: esqueci de sincronizar o hook `use-escape-key.ts`
  pro ambiente de teste, causando um erro 500 real de compilação
  (`Failed to resolve import`) que inicialmente pareceu ser um bug de
  lógica de teclado. Investigado a fundo (inspecionei a resposta HTTP
  real do erro) antes de corrigir — não assumido

### Validação do TreeView
5 cenários de teclado testados manualmente antes de considerar pronto,
incluindo os mais delicados: pular filhos colapsados (não descer neles),
descer múltiplos níveis até um neto, e subir de um neto direto pro pai
(não pro avô) com uma única tecla. Todos os 5 viraram testes de regressão
permanentes.

Componentes: 40 → 44

## 2.4.0 — Agosto 2026

### Novos componentes
- **`Slider`** — usa `<input type="range">` nativo, navegação por teclado de graça (setas, Home/End); estilo do thumb via CSS global (`globals.css`, classe `.ds-slider`), já que pseudo-elementos de thumb exigem prefixo de fornecedor
- **`MultiSelect`** — seleção múltipla com chips removíveis, busca sem acento, reaproveita lógica do `BrandSelect`

### Refatoração interna
- `normalizeText` (busca sem acento) extraído do `BrandSelect` pro utilitário compartilhado `lib/normalize-text.ts`, reaproveitado pelo `MultiSelect`
- `BrandSelect` também migrado pra usar o hook `useClickOutside` já existente, em vez do `useEffect` próprio duplicado
- Confirmado que o `BrandSelect` continua idêntico depois das duas refatorações — os 4 testes de regressão originais dele continuam passando, 2x seguidas

### Bug real encontrado e corrigido durante a construção
- **`MultiSelect`: `Escape` não fechava depois de clicar numa opção.**
  Clicar numa opção move o foco pro botão da própria opção — que não
  tinha nenhum `onKeyDown` de Escape (só o gatilho e o campo de busca
  tinham). Mesmo padrão de bug já corrigido no `Popover` (Fase anterior) —
  corrigido com um listener no `document`, que funciona independente de
  onde o foco estiver. Confirmado com o cenário exato que revelou o bug:
  captura de tela mostrando o dropdown ainda aberto depois do Escape,
  revertido e reconfirmado fechando corretamente.
- Essa foi a **3ª ocorrência** da mesma categoria de bug nesta sessão
  (`DropdownMenu` original, `Popover`, agora `MultiSelect`) — extraído
  pro hook compartilhado `lib/use-escape-key.ts`, com `Popover` e
  `MultiSelect` migrados pra usá-lo, em vez de deixar a lição só
  documentada sem aplicar. Confirmado que os dois continuam idênticos
  depois da migração (testes de regressão passando 2x seguidas)

Componentes: 38 → 40

## 2.3.0 — Agosto 2026

### Novos componentes
- **`Avatar`** — imagem com fallback pra iniciais quando não há `src` ou a imagem falha ao carregar
- **`Popover`** — genérico, aceita qualquer conteúdo (diferente do `DropdownMenu`, que é fixo em itens de menu)
- **`Tooltip`** — genérico, ativado por hover e foco de teclado (diferente do `InfoTooltip`, que tem variantes de cor fixas)

### Refatoração interna
- Lógica de "fecha ao clicar fora" e de posicionamento (evitar sair da
  tela / esticar dentro de flex column) extraída do `DropdownMenu` pros
  hooks compartilhados `lib/use-click-outside.ts` e
  `lib/use-popover-position.ts`, reaproveitados pelo novo `Popover`.
  Confirmado que o `DropdownMenu` continua idêntico depois da refatoração
  — os 4 testes de regressão originais dele continuam passando, 2x seguidas

### Bugs reais encontrados e corrigidos durante a construção

- **`Popover`: Escape não fechava.** Diferente do `DropdownMenu` (que move
  o foco pro primeiro item ao abrir), o Popover aceita conteúdo arbitrário
  e não força foco pra dentro dele — um `onKeyDown` no próprio conteúdo
  nunca recebia o evento, porque o foco continuava no botão gatilho.
  Corrigido com um listener no `document`, independente de onde o foco
  estiver.

- **`Avatar`: condição de corrida de hidratação SSR.** Para uma imagem que
  falha muito rápido (testado de verdade com um 404 same-origin, não uma
  URL inventada), o evento nativo de erro do navegador pode disparar
  *antes* do React terminar de hidratar e anexar o listener de `onError`
  — a imagem quebrada ficava exibida pra sempre, mesmo o navegador já
  sabendo que tinha falhado (confirmado via `img.complete === true` e
  `img.naturalWidth === 0`). Corrigido checando esse estado direto no
  `ref` assim que o componente monta, além do `onError` continuar
  cobrindo falhas que aconteçam depois da hidratação.

### Ambos os bugs acima só apareceram testando de verdade com Chrome

Nenhum dos dois seria pego só por revisão de código — o Popover "parecia"
correto (o padrão de Escape já tinha funcionado em outros componentes) e
o Avatar "parecia" correto (a lógica de `onError` é o jeito certo de fazer
isso, só falhava numa janela de tempo específica entre o carregamento do
HTML e a hidratação do React).

Componentes: 35 → 38

## 2.2.0 — Agosto 2026

### Novos componentes
- **`AlertDialog`** — confirmação destrutiva, distinta do `Modal` genérico:
  usa `role="alertdialog"` (não `role="dialog"`), foco padrão no botão
  seguro "Cancelar" (não no destrutivo, evitando confirmar sem querer com
  Enter), e não fecha ao clicar fora, de propósito
- **`Breadcrumb`** — trilha de navegação semântica (`<nav
  aria-label="breadcrumb">`), último item marcado `aria-current="page"`,
  não é um link

### Refatoração interna
- Lógica de focus trap extraída do `Modal` pro hook compartilhado
  `lib/use-focus-trap.ts`, reaproveitado pelo `AlertDialog` — evita
  duplicar ~30 linhas de lógica não-trivial. Confirmado que o `Modal`
  continua funcionando de forma idêntica: os 4 testes de regressão
  originais do Modal continuam passando depois da refatoração

### Achado corrigido durante a construção
- O botão de confirmar do `AlertDialog` quase usou `var(--destructive)`
  como fundo — a mesma armadilha já documentada na Fase 4 do
  `ROADMAP.md` (essa variável foi ajustada pra funcionar como cor de
  *texto*, não de fundo sólido, no dark mode). Corrigido pra hex fixo
  `#D14343`, mesmo padrão que o `Badge` já usa

Componentes: 33 → 35

## 2.1.0 — Agosto 2026

### Infraestrutura de pacote (base técnica, publicação ainda não decidida)
- Novo script `npm run build:lib` — builda a biblioteca via `tsup` com
  **um entry point por componente** (34 arquivos), não um bundle único.
  Resolve o problema do bundle do Recharts: importar `Badge` não traz o
  Recharts junto — confirmado que `dist/badge.js` (1.81KB) tem zero
  referências a `recharts`
- Novo script `npm run verify:lib` — verifica automaticamente o
  tree-shaking real e a preservação de `"use client"`, não só assume
- `react`, `react-dom` e `recharts` agora também declarados como
  `peerDependencies` (além de `dependencies`, necessário pro app Next.js
  deste próprio repositório continuar funcionando)
- CI atualizado: `build:lib` + `verify:lib` rodam depois do build do app
- `MIGRATION.md`: nova seção com a opção de biblioteca, mantendo "copiar
  arquivos" como alternativa igualmente válida
- **O que ainda falta decidir** (fora do escopo técnico, decisão do
  time): como isso é publicado/consumido no repositório de produto —
  pacote npm privado, workspace de monorepo, ou outra forma. Ver
  `ROADMAP.md`, Fase 6

Com esta versão, as 6 fases do `ROADMAP.md` de melhorias pós-v1 estão
concluídas.

## 2.0.0 — Agosto 2026

### ⚠️ Mudança que quebra compatibilidade

- **`Checkbox`: `onChange` agora recebe o valor booleano direto, não o
  evento nativo do DOM.**

  ```tsx
  // Antes (1.4.0 e anteriores)
  <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />

  // Agora (2.0.0+)
  <Checkbox checked={checked} onChange={setChecked} />
  ```

  Motivo: alinhar com `BrandSelect`, `RadioGroup`, `Switch` e
  `DatePicker`, que já usavam valor direto — `Checkbox` era o único com a
  convenção diferente. Decisão de API pública levada pra fora antes de
  implementar, não decidida unilateralmente — ver `ROADMAP.md`, Fase 5.

  Se você usa `Checkbox` num projeto que já migrou desse design system,
  procure por `onChange={(e) =>` nos usos de `Checkbox` especificamente
  (os outros componentes de formulário não mudaram) e ajuste pra receber o
  valor direto.

## 1.4.0 — Agosto 2026

### Correções de dark mode (achadas por auditoria sistemática — Fase 4 do ROADMAP.md)
- `Checkbox`/`Input`/`Textarea`: texto e borda de erro agora usam
  `var(--destructive)`, que passa a ter um valor próprio e correto pro
  dark mode (`#DF7B7B`) — o valor antigo era idêntico ao modo claro e
  media só 3.81:1 contra os fundos escuros do tema
- `Label`: asterisco de campo obrigatório também migrado pra
  `var(--destructive)`
- `FilterBar`/`Tabs`: cor de destaque migrada de hex fixo pra
  `var(--primary)` — o token já estava corretamente adaptado pro dark
  mode (vira verde), só nunca tinha sido usado por esses dois componentes
- `StatComparison`: novo token `--stat-positive` criado; indicadores
  positivo/negativo agora se adaptam ao tema corretamente
- Novo arquivo de teste `tests/dark-mode.spec.ts` — 30 páginas checadas
  com axe-core em dark mode real, não só modo claro

### Testes
- Novo teste de regressão confirmando que o `DatePicker` não tem o mesmo
  bug de posicionamento que já afetou o `DropdownMenu`
- Suíte completa: 97 testes (era 66)

## 1.3.0 — Agosto 2026

### CI
- Testes E2E (Playwright Test + axe-core) ligados ao workflow do GitHub
  Actions — roda depois de typecheck + build, com cache de browsers
- Otimização: o comando do `webServer` do Playwright agora é condicional
  (`CI` vs local) pra não buildar o projeto duas vezes no pipeline
- Validado de verdade que o CI pega regressões: bug de largura fixa do
  `BrandSelect` foi reintroduzido de propósito, a suíte falhou mostrando a
  medida exata da sobreposição, revertido e confirmado voltando a passar —
  ver `ROADMAP.md`, Fase 3

## 1.2.0 — Agosto 2026

### Testes
- Suíte de teste persistida com Playwright Test (66 testes, 7 arquivos) —
  ver `ROADMAP.md`, Fase 2, para o relatório completo de bugs encontrados
- Auditoria de acessibilidade automatizada (axe-core) rodando contra as 35
  páginas de style guide + 4 popovers abertos

### Correções de acessibilidade e contraste (achadas pela suíte de teste)
- `Alert`: cores de texto warning/error corrigidas — mediam 2.61:1 e
  3.93:1 (abaixo do mínimo 4.5:1 do WCAG AA), agora 4.87:1 e 4.69:1
- `Alert`: removida uma `opacity:0.85` no texto de descrição que reduzia o
  contraste efetivo renderizado abaixo do que a cor sozinha sugeria
- `Badge`: variante warning trocou texto branco por azulEscuro — branco
  sobre laranja media 2.92:1
- `StatComparison`: cor "positiva" (turquesa) escurecida — a original
  media 2.53:1 sobre fundo branco
- `ProgressBar`/`ProgressRing`: agora geram um `aria-label` padrão quando
  ninguém passa a prop `label`, evitando um `role="progressbar"` sem nome
  acessível
- 32 páginas de documentação: blocos de código roláveis (`<pre>`) agora
  são alcançáveis por teclado (`tabIndex={0}`)

## 1.1.0 — Agosto 2026

### Segurança
- **Next.js atualizado de 14.2.5 para 16.3.3** (via 15.5.24 como passo
  intermediário) — corrige 2 vulnerabilidades de alta severidade
  encontradas via `npm audit` (DoS via Image Optimizer, HTTP request
  smuggling em rewrites, XSS com CSP nonce, entre outras). `npm audit`
  final: 0 vulnerabilidades.
- React atualizado de 18.3.1 para 19.2.8 (exigido pelo Next.js 15+)
- Guias oficiais de upgrade lidos e cada mudança "breaking" checada contra
  o código real do projeto antes de assumir impacto — nenhuma das mudanças
  documentadas (APIs assíncronas de cookies/headers/params, next/image,
  middleware, Route Handlers) afeta este projeto, que não usa nenhuma
  dessas funcionalidades
- Testado com Chrome real via Playwright em cada checkpoint do upgrade —
  ver `ROADMAP.md`, Fase 1.5, para o relatório completo

### Infraestrutura
- CI configurado via GitHub Actions (`.github/workflows/ci.yml`) — roda
  `npm ci` → `typecheck` → `build` em todo push/PR — ver `ROADMAP.md`, Fase 1

## 1.0.0 — Agosto 2026

Primeira versão fechada do design system Oficina Brasil, pronta para
handoff ao time de desenvolvimento.

### Fundação
- Tokens de marca (cores, tipografia, radius) extraídos verbatim do guia
  oficial (`GOB01-GuiaMarca-OficinaBrasil_rev1.pdf`)
- Regras de contraste da página 48 codificadas como função (`lib/contrast-rules.ts`)
- Fonte Figtree (SIL OFL) — ver `licenses/`

### Assets reais
- Wordmark completo em todas as variantes de cor do guia + monocromáticas
- Marca compacta "OF BR", extraída do arquivo original do Illustrator (EPS)
- 35 ícones da marca, convertidos para `currentColor`
- Favicon/ícones de app gerados (16/32/48/180/192/512px + `.ico` multi-resolução)

### Componentes (33)
AdminPageHeader, Alert, Badge, BarChart, BrandSelect, ChartCard, Checkbox,
Considerations, CopyButton, DataTable, DatePicker, DropdownMenu,
EmptyState, FileUploadButton, FilterBar, InfoTooltip, Input, KpiCard, Label,
LineChart, LogoCutout, Modal, Pagination, ProgressBar, ProgressRing, RadioGroup, Skeleton, StatComparison, Switch, Tabs,
Textarea, Toast, VisuallyHiddenInput.

### Acessibilidade
- Auditoria automatizada (axe-core): 0 violações WCAG 2 A/AA em todos os
  estados testados (página em repouso + cada popover aberto)
- Navegação por teclado testada de verdade via Playwright em todos os
  componentes interativos (Modal com focus trap, BrandSelect, DatePicker
  com navegação completa por setas, DropdownMenu, Tabs)
- **Não incluído**: teste com leitor de tela real (VoiceOver/NVDA) — a
  auditoria automatizada não substitui isso

### Dark mode e responsivo
- Dark mode testado em duas rodadas em todos os componentes: 5 bugs de
  texto invisível corrigidos na primeira (KpiCard, ChartCard, DataTable,
  Pagination, Label), e as 3 superfícies que ficavam brancas fixas mesmo
  em dark mode (Modal, DatePicker, Considerations) ajustadas na segunda —
  8 correções reais no total, 0 problemas visuais conhecidos restantes
- Responsivo testado em viewport mobile (375px); 1 bug de menu saindo da
  tela encontrado e corrigido

### Pronto para handoff
- `README.md` — visão geral, início rápido, estrutura do projeto
- `MIGRATION.md` — o que copiar (e o que não copiar) para o repositório de produto
- `CHANGELOG.md` — este arquivo
- `.gitignore` — configurado para Next.js
- `package.json` corrigido — `react`/`react-dom`/`next` movidos para
  `dependencies` (estavam incorretamente em `devDependencies`), versionado como `1.0.0`
- `licenses/` — licença OFL da Figtree incluída e aprovada
- Build de produção (`next build`) validado de ponta a ponta — todas as
  26 rotas geram sem erro

### Documentação
- 20 páginas de style guide navegável (`/style-guides`), uma por componente
- Log de decisões de design (`/style-guides/needs-review`) — resolvido,
  adiado, e não adotado, cada um com justificativa

### Pendências conhecidas (não resolvidas nesta versão)
- Teste com leitor de tela real
- Variante do logo "sobre foto" (depende de fotografia real do produto)
- Sem dono formal do design system, versionamento contínuo, ou CI automatizado definidos
