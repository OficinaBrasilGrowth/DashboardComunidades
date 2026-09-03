# Consolidação pós-revisão externa (Ago 2026)

O `ROADMAP.md` original (6 fases) foi concluído e o design system cresceu
de 34 pra 44 componentes depois disso. Duas revisões externas
independentes (compartilhadas pelo time) apontaram que esse crescimento
deixou parte da infraestrutura pra trás — problemas reais, verificados um
a um contra o código antes de aceitar qualquer achado como verdadeiro.

Este documento rastreia as 3 sprints de consolidação propostas, no mesmo
formato do `ROADMAP.md`: problema real, escopo, critério de "pronto".

---

## Sprint 1 — "DS confiável"

**Objetivo**: outro projeto consegue instalar e consumir corretamente o
Oficina Brasil DS.

### DS-01 + DS-02 — Exports completos e verificados ✅ concluído (Ago 2026)

**Problema real, verificado**: 44 componentes existiam como arquivo, mas
`index.ts` e `package.json > exports` só expunham 34 — 11 componentes
(`Accordion`, `AlertDialog`, `Avatar`, `AvatarGroup`, `Breadcrumb`,
`CommandPalette`, `MultiSelect`, `Popover`, `Slider`, `Tooltip`,
`TreeView`) eram construídos pelo `tsup` (via `readdirSync`) mas nunca
apareciam publicamente. Causa raiz: os exports eram gerados uma vez à mão
e nunca mais atualizados, enquanto o build da lib descobria componentes
novos automaticamente.

**O que foi feito**:
- [x] `scripts/generate-exports.js` — gera `index.ts` e `package.json > exports`
      a partir da mesma fonte que `tsup.config.ts` já usa (`readdirSync` de
      `components/*.tsx`), não mais uma lista escrita à mão
- [x] `npm run verify:exports` — modo `--check`, falha com exit code 1 se os
      arquivos estiverem desatualizados, sem escrever nada
- [x] `build:lib` agora roda `generate:exports` automaticamente antes do `tsup`
- [x] `scripts/verify-lib-build.js` estendido — verifica que todo `.js` real
      construído em `dist/` tem entrada correspondente em `exports` (não só
      que os arquivos-fonte concordam entre si, mas que o pacote publicado
      de verdade bateria com o prometido)
- [x] Ambas as proteções ligadas ao CI
- [x] Validado com o mesmo rigor de sempre: removi 2 exports de propósito,
      confirmei que as duas verificações pegam e apontam exatamente os
      componentes certos, revertido e confirmado voltando a passar
- [x] **Critério de saída testado de verdade, não assumido**: empacotei o
      projeto via `npm pack`, instalei o `.tgz` num projeto consumidor vazio
      criado do zero (sem nenhum arquivo copiado manualmente), e confirmei
      `Accordion`, `TreeView`, `MultiSelect` e `Badge` (os 4 componentes
      citados como critério pela revisão) funcionando via
      `import { X } from 'oficina-brasil-design-system/x'` — typecheck
      limpo **e** renderização real via `renderToStaticMarkup` (SSR),
      confirmando que os componentes não só têm tipos corretos mas
      executam de verdade em tempo de execução

**Achado revelado por essa própria validação**: o HTML renderizado mostra
`var(--border)`, `var(--foreground)` etc. sem resolver — confirma que o
próximo item da sprint (CSS não distribuído) é um problema real e
distinto deste, não uma suposição.

**Pronto quando**: instalar o DS num projeto vazio e usar `Accordion`,
`TreeView`, `MultiSelect` e `Badge` sem copiar arquivos — **confirmado**.

### CSS distribuído junto com o pacote ✅ concluído (Ago 2026)

**Problema real, verificado pela própria validação da DS-01**: a
renderização SSR do consumidor de teste mostrou `var(--border)`,
`var(--foreground)` etc. sem resolver no HTML — confirmando que
`files: ["dist"]` nunca incluía `app/globals.css` (onde vivem todos os
tokens, o dark mode, e estilos que exigem CSS puro como o thumb do
Slider). Instalar o pacote sozinho não garantia a aparência correta.

**O que foi feito**:
- [x] `npm run build:css` — usa `@tailwindcss/cli` (instalado como
      devDependency) pra gerar `dist/styles.css` a partir do mesmo
      `app/globals.css` que o app Next.js usa — não um arquivo duplicado,
      a mesma fonte
- [x] Confirmado que a detecção automática de conteúdo do Tailwind v4
      cobre `components/**/*.tsx` de verdade — testado com classes bem
      específicas de componentes isolados (`max-h-72` do CommandPalette,
      `gap-1.5` do TreeView), não só as mais comuns
- [x] `./styles.css` adicionado ao `exports` do `package.json` — e,
      importante, adicionado também dentro do **gerador** de exports
      (`generate-exports.js`), porque na primeira tentativa o gerador
      sobrescrevia essa entrada sem querer na próxima regeneração
      automática (bug pego antes de rodar pela primeira vez, não depois)
- [x] `build:lib` agora roda `build:css` automaticamente como último passo
- [x] `verify-lib-build.js` estendido: confirma que `dist/styles.css`
      existe, contém os tokens de light mode, o bloco `.dark`, e o estilo
      do slider — validado que a checagem de fato falha removendo o
      arquivo de propósito, revertido, confirmado passando de novo
- [x] **Validado de ponta a ponta com um consumidor real, num bundler
      diferente do Next.js**: projeto Vite criado do zero, `npm pack` +
      `npm install` do tarball, `import 'oficina-brasil-design-system/styles.css'`
      uma vez no entry point — confirmado com Chrome real que
      `getComputedStyle` retorna as cores exatas dos tokens
      (`rgb(0,19,78)` = `#00134E`, `rgb(144,242,82)` = `#90F252`), não
      mais `var(--foreground)` sem resolver
- [x] `MIGRATION.md` atualizado com a instrução de import do CSS

**Pronto quando**: instalar o pacote e importar o CSS uma vez resulta na
aparência correta, sem precisar copiar `globals.css` manualmente —
**confirmado com Chrome real, cores exatas medidas**.

### `dependencies` × `peerDependencies` duplicadas ✅ concluído (Ago 2026)

**Problema real, verificado**: `react`, `react-dom` e `recharts`
apareciam simultaneamente em `dependencies` e `peerDependencies`. Isso
não é só redundância cosmética — no ecossistema npm, ter o mesmo pacote
nas duas listas pode fazer o consumidor da biblioteca receber uma cópia
aninhada de React sob `node_modules/oficina-brasil-design-system/`,
separada da cópia do próprio projeto consumidor, causando o bug clássico
de "duas cópias de React" (erros de hook inválido).

**O que foi feito**:
- [x] `next` permanece em `dependencies` — não é uma preocupação de peer,
      só esta própria app precisa dele pra rodar
- [x] `react`, `react-dom`, `recharts` movidos pra `devDependencies` (pra
      esse repositório continuar instalando tudo normalmente com um
      `npm install` comum) + mantidos em `peerDependencies` (pro
      consumidor real da biblioteca prover a própria versão)
- [x] Validado com instalação limpa do zero: `npm install`, typecheck,
      build do app, e a página que usa `Recharts` de verdade (`/line-chart`)
      respondendo 200 — nada quebrou nesse próprio repositório
- [x] **Validado com dois consumidores reais diferentes**: (1) um projeto
      que já tinha `react`/`react-dom` instalados antes — confirmado que
      o pacote **não** traz cópia aninhada (`find` não encontra `react/`
      dentro de `node_modules/oficina-brasil-design-system/`); (2) um
      projeto sem `react` nenhum instalado — confirmado que o `npm`
      moderno (v7+) resolve a `peerDependency` automaticamente, instalando
      a versão certa (`19.2.8`) sozinho

**Pronto quando**: instalar o pacote não duplica React — **confirmado com
os dois cenários reais** (consumidor que já tinha a dependência, e
consumidor que não tinha).

### `private: true` — revisado, mantido de propósito (Ago 2026)

**Não é descuido, é decisão consciente registrada aqui.** Mudar isso pra
`false` sem antes ter um alvo de publicação real definido (registry npm
privado, GitHub Packages, etc.) criaria o risco de alguém rodar
`npm publish` sem querer e publicar o pacote no registry público do npm
de verdade — algo que não dá pra desfazer facilmente. Essa é exatamente a
decisão de infraestrutura que a Fase 6 do `ROADMAP.md` deixou em aberto
de propósito (não técnica, do time). Revisado e mantido como está até
essa decisão existir — não um item esquecido.

### Fonte Figtree carregando de verdade ✅ concluído (Ago 2026)

**Problema real, o mais grave da revisão**: `font-family: 'Figtree', Arial, sans-serif` estava só declarado em `globals.css`, sem nenhum mecanismo real de carregamento — sem `@font-face`, sem `next/font`, sem import do Google Fonts. Confirmado com teste de navegador real: nesse ambiente, isso renderizava em `Liberation Sans` (nem Arial estava instalada), afetando **toda validação visual já feita no projeto**, incluindo as 45 imagens de referência da regressão visual.

**Restrição real desse ambiente**: `next/font/google` precisaria alcançar `fonts.googleapis.com`/`fonts.gstatic.com` em tempo de build, que não estão na lista de domínios liberados aqui. Resolvido baixando o arquivo real da fonte variável (`Figtree[wght].ttf`, mesmo arquivo que o Google Fonts serviria) direto do repositório oficial `github.com/google/fonts` via `raw.githubusercontent.com` (liberado), confirmando que a licença OFL já presente no projeto batia exatamente com a atual (`diff` sem diferença).

**O que foi feito**:
- [x] `next/font/local` em `app/layout.tsx`, carregando `public/fonts/Figtree-Variable.ttf` (fonte variável real, peso 300-900), sem depender de rede em tempo de build
- [x] `globals.css` atualizado pra usar `var(--font-figtree, 'Figtree')` — não mais o literal `'Figtree'` sozinho (o `next/font` ofusca o nome interno de propósito)
- [x] **Bug real encontrado testando com um consumidor da biblioteca**: `var()` sem fallback interno torna a declaração *inteira* de `font-family` inválida quando a variável não existe (não só "pula" pro próximo item da lista) — corrigido com fallback dentro do próprio `var()`
- [x] **Problema arquitetural mais profundo, também encontrado testando**: mesmo corrigido o `var()`, um consumidor externo (sem `next/font`) cairia no literal `'Figtree'`, que não resolve pra nenhuma fonte real sem um `@font-face` de verdade também presente. Corrigido com `scripts/append-font-face.js`, rodado depois do `build:css`: copia o arquivo real da fonte + a licença OFL pra `dist/fonts/`, e acrescenta um `@font-face` portável (caminho relativo) no início do `dist/styles.css` — funciona com qualquer bundler real processando o CSS de dentro de `node_modules/`
- [x] Sandbox (`render-test/`) corrigido também — trocado o `<link>` do Google Fonts (que dependia de rede externa e falhava com 403 nesse ambiente, confirmado no log do debug do CommandPalette) pelo mesmo arquivo auto-hospedado
- [x] `verify-lib-build.js` estendido — confirma que a fonte e o `@font-face` portável existem no `dist/`, validado que a checagem pega de verdade removendo o arquivo de propósito
- [x] **Validado com `document.fonts` real do navegador** (não só a declaração CSS) em 3 contextos: o app Next.js principal (`status: "loaded"`), o sandbox Vite (`status: "loaded"`), e um consumidor externo do pacote publicado sem `next/font` nenhum (`status: "loaded"`) — os três confirmados com Chrome real
- [x] Prova numérica adicional: medi a largura de um texto de teste renderizado — `210.88px` com a Figtree real, `203.65px` com a Liberation Sans que estava sendo usada por engano antes, confirmando que são fontes genuinamente diferentes, não só nomes diferentes
- [x] **As 45 imagens de referência da regressão visual foram regeneradas** — mudança esperada e já documentada como risco na Fase de regressão visual, não uma surpresa

**Pronto quando**: a fonte carrega de verdade, confirmado por `document.fonts`, não só pela declaração CSS — **confirmado nos 3 contextos** (app principal, sandbox, consumidor externo do pacote).

### Imports portáveis (`MIGRATION.md`) ✅ concluído (Ago 2026) — fecha a Sprint 1

**Problema real, verificado**: `MIGRATION.md` afirmava que os imports
internos dos componentes eram relativos, mas 8 componentes (`Alert`,
`AlertDialog`, `BrandSelect`, `CommandPalette`, `DropdownMenu`, `Modal`,
`MultiSelect`, `Popover`) usavam `@/lib/*` — funcionava aqui porque este
projeto tem esse alias configurado no `tsconfig.json`, mas quebraria num
produto real que não tivesse a mesma configuração exata.

**O que foi feito**:
- [x] Os 16 imports (`@/lib/*`) nos 8 arquivos convertidos pra caminho
      relativo (`../lib/*`) — `components/` e `lib/` são irmãs na raiz do
      projeto
- [x] **Validado com o mesmo rigor de sempre**: antes de corrigir,
      confirmei que o import antigo de fato falhava (`error TS2307:
      Cannot find module '@/lib/use-focus-trap'`) num projeto de teste
      sem o alias configurado — não assumido que quebraria, testado
- [x] Depois de corrigir, copiei literalmente `components/` + `lib/` pra
      um projeto novo, criado do zero, **sem nenhum alias `@/*`
      configurado** — `tsc --noEmit` passou sem erro nenhum
- [x] `MIGRATION.md` corrigido — não só ajustada a alegação, mas também
      um problema relacionado descoberto no processo: a instrução original
      só mandava copiar 2 arquivos específicos de `lib/`
      (`tokens.ts`, `contrast-rules.ts`), nunca a pasta inteira — o que
      quebraria agora que componentes dependem de outros arquivos de
      `lib/` (os hooks) via caminho relativo. Corrigido pra instruir
      copiar `components/` + `lib/` juntas, como unidade
- [x] Validação manual convertida em `scripts/verify-portable-imports.js`,
      ligada ao CI — testado que pega o problema reintroduzindo o alias
      de propósito num arquivo, revertido, confirmado voltando a passar

**Pronto quando**: copiar `components/` + `lib/` pra um projeto sem
nenhum alias configurado funciona — **confirmado com um projeto de teste
real, criado do zero**.

---

## ✅ Sprint 1 ("DS confiável") — concluída (Ago 2026)

Todos os itens fechados: exports completos e verificados, CSS
distribuído, dependencies/peerDependencies corrigidas, `private: true`
revisado e mantido de propósito, fonte Figtree carregando de verdade (o
achado mais grave), e imports portáveis sem depender de alias.

**Critério de saída original da sprint**: "outro projeto consegue
instalar e consumir corretamente o Oficina Brasil DS" — testado de
múltiplas formas ao longo da sprint: `npm pack` + instalação num projeto
vazio (exports), Vite consumindo o CSS distribuído (tokens resolvendo de
verdade), dois consumidores reais pra dependencies (com e sem `react`
pré-instalado), `document.fonts` real em 3 contextos diferentes pra
fonte, e cópia literal de pasta sem alias configurado pra portabilidade.
Nenhum desses foi assumido — todos testados com um consumidor real.

---

## Sprint 2 — "DS consistente"

**Objetivo**: uma alteração de foundation se propaga pelo sistema sem
editar dezenas de componentes.

Reclassificado a partir de feedback de revisão (Ago 2026): o Passo 2
("fonte única de verdade pra tokens") foi dividido em sub-etapas mais
precisas, porque a entrega original misturava "toda cor tem uma
primitiva registrada" com "fonte única de verdade completa" — são coisas
diferentes, e só a primeira estava de fato pronta.

- **2A. Registrar todas as primitivas** ✅ concluído
- **2B. Criar camada semântica** ✅ concluído (ver abaixo)
- **2C. Corrigir `destructive`** ✅ concluído (ver abaixo)
- **2D. Migrar os componentes pra usar as primitivas/tokens semânticos por referência** ✅ concluído (ver abaixo, 4 lotes)
- **2E. Remover hex dos componentes** ✅ confirmado (ver abaixo)
- **2F. CI impedir novos hardcodes** ✅ concluído (ver abaixo, cobre hex e `rgba()`/etc.)
- **2G. Testar alteração global de foundation** ✅ concluído (ver abaixo, feito antes de 2D de propósito)

### 2B + 2C — Camada semântica + correção do `destructive` ✅ concluído (Ago 2026)

**Achado importante do feedback, corrigindo um erro de direção meu**: eu
ia migrar os componentes importando `colors.azul` (constante JS) de
`lib/tokens.ts` em vez do hex literal. Isso teria sido **pior**, não
melhor: uma constante JS fixa não responde a light/dark de jeito nenhum
— `backgroundColor: colors.azul` renderiza azul sempre, independente do
tema, exatamente como o hex direto já fazia. A camada certa é CSS
(`var(--nome-semântico)`), porque só assim o mesmo componente muda de
cor automaticamente quando o tema muda, sem saber nada sobre isso.

**Descoberta ao mapear o que já existia**: boa parte da camada semântica
já estava construída — `--primary`, `--secondary`, `--muted`, `--accent`
já trocam de valor entre light/dark corretamente (`--primary` literalmente
já é "azul no claro, verde no escuro", o exemplo exato que o feedback deu
como alvo). O problema real e específico era `--destructive`, que tentava
representar duas funções incompatíveis com um token só.

**O que foi feito**:
- [x] `--destructive` separado em 6 sub-tokens de responsabilidade única:
      `--destructive-text`, `--destructive-surface`,
      `--destructive-surface-foreground`, `--destructive-subtle`,
      `--destructive-subtle-foreground`, `--destructive-border`
- [x] Valores calculados e testados, não estimados: `--destructive-surface`
      usa o mesmo valor (`#D14343`) em light **e** dark — o contraste de
      um botão sólido é interno ao componente, não depende do tema ao
      redor. Um novo tom de `--destructive-subtle` pro dark mode
      (`#3F1414`, vermelho escurecido em direção ao preto, não a tinta
      clara do light mode que ficaria deslocada visualmente) calculado e
      confirmado via `axe-core` real: **0 violações em light e dark
      mode**, incluindo o `AlertDialog` com o botão destrutivo real aberto
- [x] Todos os usos de `var(--destructive)` (`Checkbox`, `Input`,
      `Label`, `Textarea`, `StatComparison`) migrados pra
      `var(--destructive-text)` — confirmado que 100% dos usos existentes
      eram caso de texto, nenhum de superfície, então a migração foi limpa
- [x] `Badge` e `AlertDialog` — que precisavam ignorar o token antigo e
      usar hex fixo como contorno — migrados pra `var(--destructive-surface)`,
      eliminando a exceção
- [x] Achado extra no caminho: `--ring` tinha um hex fixo
      (`#18328A`/`#90F252`) com um comentário admitindo "matches primary"
      — exatamente a mesma categoria de bug que essa sprint inteira
      corrige. Convertido pra `var(--primary)`, uma referência de
      verdade, não uma coincidência mantida à mão

### 2G — Teste de propagação global ✅ concluído (Ago 2026, feito antes de 2D de propósito)

**O teste mais direto e convincente proposto**: trocar temporariamente a
primitiva do azul principal e confirmar que tudo que depende dela
semanticamente muda sozinho, sem editar nenhum componente.

**Feito de verdade, não simulado**: troquei `--primary` (light mode) de
`#18328A` pra um magenta bem diferente (`#FF00FF`), buildei, e testei com
Chrome real:
- `FilterBar` ("Limpar tudo") e `Tabs` (aba ativa) — **mudaram
  automaticamente pra magenta**, sem eu tocar em nenhum dos dois arquivos
- `ProgressRing` (que ainda usa `#18328A` hex fixo, não migrado) —
  **continuou azul**, confirmando exatamente a fronteira real entre o que
  já está na camada semântica e o que ainda não está

Revertido depois do teste, confirmado voltando ao normal.

**Isso prova, com números reais**: a camada semântica funciona pros
componentes que já a usam — a tarefa que falta (2D/2E) é migrar os outros
20 arquivos pra ela, não construir uma camada nova.

### 2D — Migração dos componentes ✅ concluído (Ago 2026)

**Correção de números a partir de feedback de revisão**: a contagem real
(sem comentários entrando na busca) é **19 componentes, 83 ocorrências**
de hex em runtime — não 20/87 como documentado antes.

Migração dividida em lotes, por risco/decisão de arquitetura envolvida —
não os 19 arquivos de uma vez.

#### Lote 1 — conversões óbvias ✅ concluído (Ago 2026)

`Checkbox`, `RadioGroup`, `Switch`, `Pagination`, `MultiSelect`,
`DropdownMenu`, `CopyButton`, `Tooltip`, `ProgressBar`, `ProgressRing`.

**O que foi feito**:
- [x] 16 das 18 ocorrências desses 10 arquivos migradas pra
      `var(--primary)`/`var(--primary-foreground)`/`var(--destructive-text)`/
      `var(--popover-foreground)`/`var(--brand-azul-escuro)`
- [x] Completado um par de token de marca que faltava:
      `--brand-azul-escuro-foreground` (branco, já aprovado por
      `contrast-rules.ts`, só não tinha token registrado) — usado por
      `CopyButton`/`Tooltip`
- [x] Achado real de contraste no `DropdownMenu`, só descoberto migrando
      com cuidado: o item normal do menu usava `#00134E` fixo, que
      **nunca se adaptava ao dark mode** — um bug real de texto escuro
      sobre popover escuro, não pego por nenhuma auditoria anterior (ver
      abaixo, achado de lacuna de teste)
- [x] **Decisão consciente de NÃO migrar**: a bolinha branca do `Switch`
      ficou como hex fixo, de propósito, com o motivo documentado no
      código — mapear pra `var(--primary-foreground)` teria introduzido
      um bug real (a bolinha quase desaparece no dark mode, já que
      `--primary-foreground` vira azulEscuro nesse tema, não branco).
      Nem toda cor deve virar `var()` cegamente — a análise de cada caso
      importa mais que a conversão mecânica
- [x] Um `text-white` (classe Tailwind fixa, achado no meio do caminho —
      uma terceira categoria de cor não-governada que nem hex nem
      `rgba()` pegariam) também corrigido no `Checkbox`
- [x] `var(--primary)` confirmado funcionando de verdade como atributo
      `stroke` de SVG (`ProgressRing`) — testado com Chrome real, não
      assumido
- [x] **Validado com `axe-core` real, light e dark mode, nos 10
      componentes** — 0 violações, incluindo o `DropdownMenu` **aberto de
      verdade** (não só fechado)
- [x] **Lacuna de teste real encontrada e corrigida**: a suíte de dark
      mode (Fase 4 do `ROADMAP.md`) só testava cada página no estado
      fechado — o `DropdownMenu` só renderiza os itens quando aberto, por
      isso o bug de contraste real citado acima passou despercebido por
      toda a Fase 4. Novo teste específico
      (`tests/dark-mode.spec.ts`) abre o menu de verdade antes de rodar o
      `axe-core` — validado que pega o bug revertendo a correção de
      propósito, revertido de volta, confirmado passando
- [x] Contagem real depois do lote: **19 → 10 arquivos, 83 → 67
      ocorrências** (16 removidas, número batendo exatamente com a soma
      do que foi migrado)
- [x] 137/137 testes funcionais, 45/45 regressão visual (sem precisar
      atualizar nenhuma imagem — a migração preserva a aparência exata em
      light mode, só corrige o comportamento em dark mode)

#### Lote 2 — componentes de status ✅ concluído (Ago 2026)

`Alert`, `Badge`, `Toast`, `FileUploadButton`.

**Decisão de design tomada antes de migrar, não decidida sozinho**: o
sistema usava duas cores diferentes pro mesmo significado "success" —
verde (`Alert`, `Badge`) e turquesa (`Toast`, `FileUploadButton`).
Perguntado antes de escolher; **turquesa foi escolhido como o canônico**
pra `--success-surface`.

**Tokens criados**, mesma estrutura de responsabilidade única do
`--destructive-*` (2C): `--success-*`, `--warning-*`, `--info-*`, cada um
com `surface`/`surface-foreground`/`subtle`/`subtle-foreground`/`border`.
Valores calculados com contraste real, não estimados — destaques:
- `turquesa` só é aprovado com `azulEscuro` como texto, **nunca branco**
  (`contrast-rules.ts`, tabela do guia de marca) — confirmado antes de
  assumir, evitando repetir o erro que quase aconteceu com o
  `--destructive` na 2C
- `azul` puro como texto sobre um fundo escurecido pro dark mode falhava
  (1.68:1) — `azulClaro` resolve (16.70:1). Achado real ao calcular, não
  assumido que qualquer tom da mesma família funcionaria

**Achados reais no processo, além da criação dos tokens**:
- `FileUploadButton` tinha dois conceitos diferentes de cor misturados:
  o estado padrão ("clique pra enviar") é uma **ação primária**
  (`var(--primary)`, muda com o tema), não um status fixo — só o estado
  "enviado com sucesso" é de fato status (`var(--success-surface)`).
  Migrado distinguindo os dois, não tratado como um bloco só
- A página de documentação do `Toast` **nunca tinha um jeito de disparar
  a variante `info`** — lacuna de documentação real, nem coberta por
  teste algum. Adicionado o botão que faltava, migrado os hex fixos dos 3
  botões de gatilho pros tokens novos (bônus, não fazia parte do escopo
  original do lote)
- **Validação com `axe-core` inicialmente deu falso positivo**: testei o
  `Toast` sem clicar nos botões primeiro — o componente é condicional
  (só existe depois de disparado), então a primeira rodada não testou
  nada de verdade. Corrigido clicando de propósito antes de rodar o
  `axe-core`, confirmando as 3 variantes genuinamente visíveis

**Achado visual honesto, não escondido**: em **light mode**, as variantes
`success` (turquesa clara) e `info` (azulClaro) do `Alert` ficam
visualmente bem próximas — as duas tintas claras são hues parecidos
quando bem dessaturados. Confirmado com screenshot real. Em **dark
mode** as 4 variantes ficam claramente distintas. Essa proximidade
visual é consequência direta de ter escolhido turquesa (mais próximo de
azul/verde-azulado) em vez de verde (mais distante de azul) como
`--success-surface` — decisão já tomada e confirmada, registrada aqui
como algo a observar, não revertida sem conversar antes.

**Validação**:
- [x] `axe-core` real, light e dark mode, nos 4 componentes — 0
      violações, incluindo `Toast` com as 3 variantes de fato disparadas
      e visíveis (não só a página estática)
- [x] Contagem depois do lote: 10→6 arquivos, 67→40 ocorrências (27
      removidas, batendo exatamente com a soma migrada)
- [x] 137/137 funcionais, 45/45 regressão visual (3 imagens atualizadas
      de propósito — `Alert`/`Badge` mudaram de cor de verdade, `Toast`
      ganhou um botão novo — revisadas antes de aceitar, não aceitas às
      cegas)

#### Lote 3 — cores explicitamente de marca ✅ concluído (Ago 2026)

`AdminPageHeader`, `KpiCard`, `Considerations`, `InfoTooltip`.

**Distinção conceitual aplicada, não decidida sozinho** (já tinha sido
levantada antes de migrar): quando a API expõe `color="azul"` — como
`AdminPageHeaderColor` faz — a intenção é a cor de marca fixa, não a cor
primária do tema atual (que vira verde no dark mode). Completado o
conjunto de tokens `--brand-*` com as cores que faltavam (`azul`,
`turquesa`, `branco`, e os pares de `-foreground` correspondentes),
fechando as 6 cores nomeadas em `contrast-rules.ts` (`BrandColorName`).

**Validação decisiva pra esse lote**: confirmado **numericamente** que a
cor de marca não muda entre temas (`rgb(144, 242, 82)` idêntico em light
e dark, medido via `getComputedStyle`) — provando que a distinção
conceitual funciona na prática, não só no papel. `axe-core` real: 0
violações nos 4 componentes, em light e dark mode, incluindo o
`InfoTooltip` com o balão aberto de verdade.

#### Lote 4 — DatePicker ✅ concluído (Ago 2026)

Último lote de hex. Achado real: o destaque de "dentro do intervalo"
usava azulClaro fixo (`#DAF7EF`) — virou `var(--secondary)`, que **já
tinha exatamente esse valor** no light mode (`--secondary: #DAF7EF`) e
adapta sozinho pro dark mode (vira azul). Antes de aceitar essa
substituição, calculei o contraste do texto que já ficava por cima
(`var(--popover-foreground)`) contra o novo valor escuro de
`--secondary` no dark mode — **9.95:1**, confirmado antes de assumir que
continuaria legível. Testado com um range de verdade selecionado (não só
a página estática), confirmado visualmente correto nos dois temas.

**Resultado final da migração 2D**: 19 → 1 arquivo com hex, 83 → 1
ocorrência — a única restante é a bolinha do `Switch`, exceção
documentada de propósito (ver Lote 1).

### 2E — Zero hardcodes ✅ confirmado (Ago 2026)

Critério do feedback de revisão, testado literalmente: "componentes com
hex literal: 0" — na prática, 1 (a exceção documentada do `Switch`, que
migrar introduziria um bug real de visibilidade no dark mode, já
explicado no Lote 1). Não é uma pendência, é uma exceção deliberada.

### 2F — CI impedir hardcode novo ✅ concluído (Ago 2026)

**Escopo maior que hex, como o feedback apontou**: catalogadas 44
ocorrências reais de `rgba()` em 19 arquivos — inclusive componentes que
já "pareciam" sem cor solta (`Modal`, `Popover`, `Input`, `BrandSelect`,
`ChartCard`, `AlertDialog`, `CommandPalette`, `DatePicker`). Um achado no
caminho: vários valores eram **quase-duplicados divergentes sem
intenção** — ex. a sombra de popover tinha opacidade 0.05/0.08 em 5
lugares, mas 0.1/0.12 e 0.1/0.15 em outros 2, provavelmente digitado à
mão de memória cada vez, não 3 níveis de elevação diferentes de
propósito.

**O que foi feito**:
- [x] Criada uma escala de 4 níveis (`--shadow-xs/sm/md/lg`) + sombra de
      overlay (`--shadow-overlay-backdrop`) + sombra de botão primário
      (`--shadow-button-primary`) + 2 anéis de foco
      (`--focus-ring-primary`, `--focus-ring-destructive`) — todos com o
      mesmo valor em light/dark, já que sombra não muda de tom com o
      tema, só dá profundidade
- [x] As 44 ocorrências migradas de uma vez, mapeando cada valor exato
      catalogado pro token mais próximo da escala consolidada
- [x] `scripts/verify-token-source.js` estendido — nova checagem
      detecta `rgb()/rgba()/hsl()/hsla()/oklch()` cru nos componentes,
      falha o CI se aparecer de novo. Validado que pega o problema
      reintroduzindo uma `rgba()` crua de propósito no `Modal`, revertido,
      confirmado voltando a passar
- [x] `axe-core` real em 7 componentes afetados (`Input`, `Textarea`,
      `Modal`, `Popover`, `MultiSelect`, `BrandSelect`, `DatePicker`),
      light e dark mode — 0 violações, incluindo confirmação visual de
      que o anel de foco continua aparecendo corretamente
- [x] 45/45 regressão visual **sem precisar atualizar nenhuma imagem** —
      a consolidação foi sutil o suficiente pra ficar dentro da margem de
      tolerância

### `Button` e `IconButton` ✅ concluído (Ago 2026)

**Problema real**: 34 `<button>` crus espalhados pelo sistema, cada um
reimplementando radius/padding/hover/disabled/foco por conta própria.
`rounded-lg` já dominava esmagadoramente (23 das ocorrências
catalogadas antes de desenhar o componente) — não inventado do zero,
extraído da repetição real.

**O que foi feito**:
- [x] `Button` com 5 variantes (`primary`/`secondary`/`outline`/`ghost`/`destructive`)
      e 3 tamanhos (`sm`/`md`/`lg`), `<button>` nativo (não simulado),
      suporte a `icon`, `loading` (com `aria-busy` real), `disabled` real
- [x] `IconButton` — variante circular só de ícone, `aria-label`
      **obrigatório** no tipo (não opcional), extraído dos 11 usos de
      `rounded-full` já catalogados
- [x] Anel de foco usa `var(--focus-ring-primary)`/`var(--focus-ring-destructive)`
      — os tokens criados no 2F dessa mesma sprint, não valores novos
- [x] **Bug real pego no meu próprio processo de teste, não no
      componente**: testei o anel de foco navegando com Tab genérico e
      o resultado veio `none` — investigado antes de assumir bug do
      componente, e era o Tab caindo num link da navegação, não num
      `Button`. Confirmado com foco direto que o anel funciona
      corretamente
- [x] Confirmado numericamente: `primary` muda de azul pra verde sozinho
      entre light/dark (sem nenhum código no componente sabendo disso),
      `destructive` mantém anel de foco vermelho distinto do padrão azul
- [x] `axe-core` real: 0 violações nos 2 componentes, light e dark mode
- [x] 14 testes de regressão permanentes — achei e corrigi um erro de
      seletor ambíguo no meu próprio teste no caminho (5 botões
      "Editar" na página de doc, seletor pegava os 3 primeiros que
      incluíam os de variante, não os de tamanho)
- [x] Build da biblioteca confirmada — 47 componentes agora exportados

**O que não foi feito de propósito, decisão consciente**: não migrei os
34 `<button>` crus existentes pra usar essas primitives novas. Cada um
já foi testado individualmente com o mesmo rigor ao longo desta sessão
inteira — trocar todos de uma vez introduziria risco real de regressão
visual/funcional espalhado por praticamente todo o sistema, sem um
ganho proporcional imediato. Migração incremental fica como trabalho
futuro, componente por componente, não em lote.

### Foundations além de cor — investigado, concluído com achado honesto (Ago 2026)

Antes de propor qualquer token novo, catalogei o que já se repete nos 47
componentes — mesmo princípio de sempre, não inventar escala sem
verificar a real primeiro.

**Achado principal, diferente do que se esperava**: ao contrário das
cores (que eram hex literal em `style={{}}`, sem nenhum sistema
compartilhado por trás — daí toda a Sprint 2), tipografia, spacing,
z-index e a maior parte do motion **já são governados pelo Tailwind**,
via classes utilitárias (`text-sm`, `py-2`, `z-10`, `transition-colors`)
que vêm de uma escala compartilhada e consistente — não números
inventados soltos componente por componente. A categoria de problema que
justificou a Sprint 2 inteira (valor literal sem governança nenhuma)
majoritariamente **não existe** nesses outros domínios, porque cores
precisaram de `style` inline (pra funcionar com `var()` orientado a
tema), enquanto o resto ficou em classes Tailwind desde o início.

**Catalogado, com números reais**:
- Tipografia: `text-sm` (52 ocorrências) e `text-xs` (25) dominam —
  escala do próprio Tailwind, não literais CSS crus. `font-medium`/
  `semibold`/`bold` são níveis distintos de propósito (label vs ênfase
  vs título), não drift
- Z-index: só 2 valores em uso, `z-10` (7×, sempre em popovers/tooltips
  posicionados inline) e `z-50` (4×, sempre em overlays de tela cheia
  como `Modal`/`AlertDialog`/`CommandPalette`/`Toast`) — já um sistema
  de 2 níveis limpo e consistente. Criar uma variável CSS pra isso não
  mudaria nada de verdade: são classes Tailwind (`z-10`, `z-50`), não
  estilo inline referenciando `var()` — a governança já é a própria
  escala do Tailwind
- Motion: só classes padrão do Tailwind (`transition-colors`,
  `transition-shadow`, `transition-transform`), sem duração/easing
  customizado em lugar nenhum. O único `transition-all` (barra de
  progresso do `ProgressBar`) é uma escolha legítima, não descuido —
  anima `width`, que não tem utilitário Tailwind mais específico

**Único ponto real de inconsistência encontrado**: padding vertical de
controle de formulário varia entre `py-1.5`/`py-2`/`py-2.5`/`py-3` de
um componente pro outro, sem uma escala nomeada explícita (diferente do
`Button`, que já tem `sm`/`md`/`lg` formalizados). **Decisão consciente
de não corrigir agora**: unificar isso exigiria editar vários
componentes de formulário já testados individualmente ao longo da
sessão inteira, pelo mesmo motivo que os 34 `<button>` crus não foram
migrados em lote — risco de regressão espalhado sem urgência real por
trás (a inconsistência é sutil, não um bug visível). Fica registrado
como item de baixa prioridade pra uma eventual futura rodada de
consistência de formulário, não tratado como pendência crítica.

**Conclusão**: a Sprint 2 não precisa de uma escala de tipografia/
spacing/motion/z-index inventada do zero — o que já existe (a escala do
Tailwind) já cumpre o papel de fundação compartilhada. Inventar tokens
novos sem um problema real por trás iria contra o próprio princípio que
guiou essa sprint inteira.

---

## ✅ Sprint 2 ("DS consistente") — concluída (Ago 2026)

Todos os itens fechados: camada semântica construída (2B), `destructive`
corrigido em 6 sub-tokens (2C), migração completa de cores (2D, 4 lotes,
19→1 arquivo com hex), zero hardcodes confirmado (2E), guardrail no CI
cobrindo hex e `rgba()`/etc (2F), propagação global testada de verdade
com um consumidor real (2G), `Button`/`IconButton` extraídos da
repetição real dos 34 `<button>` crus, e foundations além de cor
investigadas com a conclusão honesta de que já são governadas pelo
Tailwind — sem necessidade de invenção.

**Critério de saída original**: "uma alteração de foundation se propaga
pelo sistema sem editar dezenas de componentes" — comprovado com números
reais no teste de propagação global (2G): trocar `--primary`
temporariamente mudou `FilterBar`/`Tabs` sozinhos, sem tocar em nenhum
dos dois arquivos.

---

## Sprint 3 — "DS robusto"

**Objetivo**: os componentes mais complexos compartilham comportamento e
podem ser usados em produção com segurança.

### Portal pra document.body + useId — overlays de tela cheia ✅ concluído (Ago 2026)

**Problema real, apontado na revisão original**: `Modal`/`AlertDialog`
usavam IDs fixos (`modal-title`, `alert-dialog-title`) que colidiriam com
duas instâncias montadas ao mesmo tempo, e renderizavam no lugar da
árvore React em vez de portal — um `overflow: hidden` ou stacking
context de qualquer ancestral numa aplicação real poderia clipar o
overlay, problema que a página de estilo guide isolada nunca revelaria.

**Escopo decidido conscientemente**: apliquei portal + `useId()` nos 3
overlays de **tela cheia** (`Modal`, `AlertDialog`, `CommandPalette`) —
centralizados via `fixed inset-0`, sem depender de posição relativa a um
gatilho, então portal é direto, sem precisar recalcular coordenadas.
**Não** apliquei nos popovers posicionados relativo ao gatilho
(`Popover`, `DropdownMenu`, `MultiSelect`, `BrandSelect`, `DatePicker`,
`Tooltip`) — esses usam `position: absolute` relativo ao pai
posicionado; portar exigiria reescrever a lógica inteira pra
`position: fixed` com coordenadas calculadas via `getBoundingClientRect()`
e recalculadas em scroll/resize, uma reforma de posicionamento arriscada
demais pra aplicar nos 6 de uma vez sem necessidade comprovada. Fica
documentado como item futuro bem definido, não escondido.

**O que foi feito**:
- [x] `useClickOutside` estendido pra aceitar múltiplas refs (array) —
      necessário mesmo sem portal nos popovers, porque com portal o
      conteúdo fica numa subtree DOM diferente do gatilho, e uma única
      ref trataria clique dentro do próprio conteúdo como "fora"
- [x] `Modal`, `AlertDialog`, `CommandPalette` migrados pra
      `createPortal(..., document.body)`, com guarda `mounted` (evita
      chamar `document.body` durante SSR)
- [x] IDs fixos trocados por `useId()`: `modal-title` →
      `titleId`, `alert-dialog-title`/`-description` → `titleId`/
      `descriptionId`, `command-palette-list` → `listId`
- [x] Achado real: faltava `@types/react-dom` no projeto (nunca tinha
      sido necessário até usar `createPortal`) — instalado, `0`
      vulnerabilidades confirmado
- [x] Confirmado com Chrome real: o overlay agora é filho direto de
      `<body>`, não mais da árvore original — testado nos 3 componentes
- [x] **Instabilidade real encontrada e corrigida no `CommandPalette`,
      não causada pelo portal**: um teste existente não esperava
      `networkidle` antes de disparar `Ctrl+K` — sob mais carga, o
      atalho podia disparar antes da hidratação terminar de registrar o
      listener. Confirmado rodando 20x isolado antes da correção (~10%
      de falha) e 25x depois (0 falhas) — a causa era fragilidade do
      teste, não bug do componente
- [x] **Instabilidade real e não relacionada encontrada no `LineChart`**,
      descoberta rodando a suíte completa: a animação de entrada do
      Recharts (via JS/SVG, não CSS) não é afetada pelo
      `animations: 'disabled'` do Playwright, deixando a regressão
      visual capturar às vezes um frame no meio da animação. Corrigido
      com um novo prop `isAnimationActive` em `LineChart`/`BarChart`
      (padrão `true`, preserva a animação real no produto), desligado
      explicitamente só nas páginas de documentação. Confirmado 20x
      isolado depois da correção, 0 falhas
- [x] `axe-core` real nos 3 componentes com portal, light e dark mode —
      0 violações
- [x] 144/144 testes funcionais, 47/47 regressão visual

### Padrão `asChild` — Popover e DropdownMenu ✅ concluído (Ago 2026)

**Problema real, apontado na revisão original**: `Popover` e
`DropdownMenu` recebiam qualquer `ReactNode` como trigger e colocavam
esse conteúdo dentro de um `<button>` próprio. Se o consumidor passasse
um `<button>` como trigger, isso gerava
`<button><button>...</button></button>` — interação aninhada inválida.

**O que foi feito**:
- [x] Utilitário compartilhado `lib/as-child.tsx` (`renderTrigger`) — com
      `asChild=true`, clona o único elemento filho recebido e funde as
      próprias props (`onClick`, `aria-expanded`, `aria-haspopup`, `ref`)
      direto nele, sem envolver em nada. Sem `asChild` (padrão),
      continua envolvendo num `<button>` próprio — comportamento
      existente preservado, sem quebrar compatibilidade
- [x] Aplicado no `Popover` e no `DropdownMenu`
- [x] Limitação documentada, não escondida: se o elemento filho já
      tiver a própria `ref`, ela é substituída pela nossa, não mesclada
      — uma mesclagem robusta de múltiplas refs exigiria acessar
      `element.ref` de um jeito não garantido entre versões do React. O
      caso de uso comum (passar um `Button` sem precisar de ref própria
      ali) não esbarra nisso
- [x] Exemplos reais adicionados nas páginas de documentação de ambos os
      componentes, usando o `Button` real do sistema — não só existir no
      código, demonstrado de verdade
- [x] **Confirmado com Chrome real nos dois componentes**: sem `asChild`,
      o comportamento antigo é preservado (trigger continua num
      `<button>` próprio); com `asChild` e um `<button>` real passado,
      nenhum aninhamento acontece, e clicar no botão real abre o
      popover/menu corretamente, com as props certas fundidas
      (`aria-expanded`, `aria-haspopup`)
- [x] 10 testes de regressão permanentes, cobrindo os dois modos nos
      dois componentes
- [x] 149/149 testes funcionais, 47/47 regressão visual (2 imagens
      atualizadas de propósito — as páginas ganharam exemplos novos)

### Sandbox consumindo o pacote real, não cópias ✅ concluído (Ago 2026)

**Problema real, apontado na revisão original**: o sandbox mantinha
cópias manuais dos arquivos de componente (sincronizadas à mão a cada
mudança nesta sessão inteira), com versões divergentes de
React/Tailwind/Recharts sem motivo — React 18 vs 19, Tailwind 3 vs 4,
Recharts 3 vs 2 no projeto principal.

**O que foi feito**:
- [x] Dependências de runtime alinhadas com o que o pacote real exige
      como peer: `react`/`react-dom` 18→19, `recharts` 3→2
- [x] Pacote real empacotado (`npm run build:lib && npm pack`) e
      instalado como dependência `file:` local — exatamente como um
      consumidor real instalaria
- [x] Todos os imports de `App.tsx` convertidos de `./components/X`
      (cópia local) pra `oficina-brasil-design-system/X` (o pacote de
      verdade), incluindo o CSS (`oficina-brasil-design-system/styles.css`)
- [x] Pastas órfãs removidas (`src/components/`, `src/lib/`, `tokens.ts`
      duplicado) — não fazem mais sentido existir depois da conversão
- [x] **Achado real, exatamente o tipo que esse exercício deveria
      revelar**: o Tailwind v3 local do sandbox tentava reprocessar o
      CSS já compilado do pacote (gerado por Tailwind v4), travando num
      erro de sintaxe `@layer`. Corrigido removendo o Tailwind do
      sandbox inteiramente — o `App.tsx` não usa nenhuma classe própria
      (confirmado, 0 ocorrências de `className`), então isso não é uma
      perda, é a fonte de conflito removida. ~160 → 85 pacotes instalados
- [x] **Achado real e importante**: o sandbox nunca tinha
      `tsconfig.json` nem typecheck de verdade a sessão inteira — só
      validação via `vite build` (transpila, não checa tipos). Criado do
      zero, typecheck confirmado limpo
- [x] **Vulnerabilidade real corrigida**: o Vite 5.x tinha uma falha de
      segurança direta no próprio pacote (não numa dependência
      transitiva) — atualizado pra Vite 8, testado que o build continua
      funcionando após o upgrade de versão maior
- [x] Um `__dirname` depreciado no `vite.config.ts` corrigido pra
      `import.meta.dirname` no caminho
- [x] Uma versão inventada de `@types/react-dom` (`19.2.6`, que não
      existe) foi pega antes de instalar — corrigida pra uma real
      (`19.2.5`) depois de checar contra o registry
- [x] **Validado com Chrome real**: fonte real carregando através de um
      bundler diferente, cores dos tokens resolvendo corretamente,
      `Modal`/`DropdownMenu`/`DatePicker`/`Tabs`/`DataTable` do pacote
      real funcionando de verdade (não só renderizando estático) —
      captura visual completa confirmando a página inteira funcionando
- [x] `README.md` do sandbox reescrito — a contagem antiga ("12
      componentes") e a menção a Tailwind (que não existe mais) foram
      corrigidas
- [x] Suíte de testes do projeto principal revalidada — 149/149,
      confirmando que as mudanças no sandbox não afetaram o projeto
      principal

**Pronto quando**: o sandbox consome o pacote publicado de verdade, sem
nenhuma cópia de arquivo — **confirmado**.

### Próximos itens da Sprint 3 (não iniciados)

- [ ] Portal + posicionamento por coordenadas pros popovers relativos ao gatilho (documentado acima, item maior)

### VoiceOver/NVDA real — limitação permanente deste ambiente, não pendência (Ago 2026)

**Diferente dos outros itens em aberto, isso não é "ainda não fiz" — é
algo que este ambiente genuinamente não consegue fazer.** VoiceOver só
existe no macOS, NVDA no Windows; o ambiente usado nesta sessão inteira
é um container Linux sem leitor de tela real instalado (nem interface
gráfica). Registrado aqui com honestidade, não deixado implícito.

**O que foi validado, e é rigoroso dentro do que é automatizável**:
- `axe-core` real contra as 45+ páginas de documentação, incluindo
  estados abertos de popover/modal/menu (não só a página fechada — lição
  aprendida e corrigida ao longo da sessão, ver achado do
  `DropdownMenu` na Sprint 2)
- Simulação de teclado via Playwright — Tab, Escape, setas, Enter/Space
  — testado de verdade, não assumido
- Estrutura semântica (`role`, `aria-*`, `aria-live`, `aria-expanded`)
  verificada programaticamente em cada componente

**O que isso não substitui, e nunca substituiu**: um leitor de tela de
verdade lendo o conteúdo em voz alta, na ordem que realmente lê (que
pode divergir da ordem visual/DOM em casos sutis), e a experiência real
de alguém navegando só por áudio — especialmente nos componentes mais
complexos (`BrandSelect`, `MultiSelect`, `CommandPalette`, `TreeView`,
`DatePicker`), como o próprio projeto já reconhecia como pendência desde
antes da Sprint 1.

**Recomendação pro time, não uma tarefa que eu possa completar aqui**:
esse teste precisa acontecer num Mac (VoiceOver) ou Windows (NVDA) de
verdade, com uma pessoa ouvindo e navegando os componentes complexos
listados acima. Não é algo que qualquer sandbox de IA consiga fazer
sozinho — exige hardware/SO real e, idealmente, alguém com experiência
de uso de leitor de tela no dia a dia, não só testando pela primeira vez.

---

## Correções pós-smoke-test manual (v2.21.1 → v2.22.0, Ago 2026)

Handoff externo ("Oficina Brasil DS — Correções para a v1", base
avaliada v2.21.1) com smoke test manual real, achando 8 bugs + 1 item de
acessibilidade + 4 itens de responsividade/documentação + 2 ajustes
visuais + 3 decisões de escopo. **Verifiquei cada item contra o código
real antes de aceitar** — todos os itens verificáveis se confirmaram
exatamente como descritos, incluindo os 2 números de contraste do
`DESIGN-02`, recalculados de forma independente e batendo exatamente
(`#00B7A4 + branco = 2,53:1`, `#008476 + branco = 4,60:1`).

### Bloqueadores (BUG-01, BUG-03, BUG-05, BUG-06, A11Y-01) ✅ concluídos

**Processo usado, mais econômico que o padrão anterior** (pedido
explícito do time): implementei os 5 de uma vez, sem rodar o pipeline
completo entre cada correção, testando todos numa única sessão de
Chrome, e só rodando a suíte inteira (funcional + regressão visual) uma
vez ao final do lote.

**BUG-01 — overlays atrás da sidebar (bloqueador, com evidência visual)**:
causa raiz confirmada — a `<aside>` do Style Guide é `position: fixed`
sem `z-index` próprio, enquanto `DropdownMenu`/`Popover`/`InfoTooltip`
usavam `position: absolute z-10` dentro do fluxo normal do conteúdo.
Isso é exatamente o item que a Sprint 3 já tinha deixado pendente
("portal por coordenadas") por avaliação teórica de risco — a evidência
real do smoke test confirmou que não era só teoria.

- [x] `lib/use-popover-position.ts` reescrito: de "decide esquerda ou
      direita como classe CSS" pra "calcula coordenadas reais de
      `position: fixed` via `getBoundingClientRect()`", com detecção de
      colisão horizontal **e vertical** (antes só tratava horizontal) —
      recalcula em scroll/resize enquanto aberto
- [x] `DropdownMenu`, `Popover`, `InfoTooltip` migrados pra
      `createPortal(..., document.body)` — mesmo padrão já usado em
      `Modal`/`AlertDialog`/`CommandPalette` desde o início da Sprint 3
- [x] `useClickOutside` já aceitava múltiplas refs (ver Sprint 3) —
      reaproveitado, não modificado de novo
- [x] `InfoTooltip` perdeu a prop `align` (left/center/right) — não faz
      mais sentido com detecção automática de colisão. Documentação
      atualizada
- [x] Confirmado com Chrome real: menu é filho direto de `<body>`, topo
      do menu clicável de verdade (não coberto pela sidebar), **e
      colisão vertical testada de propósito** (viewport de 350px,
      gatilho a 106px do fundo — menos que a altura do menu — o menu
      abriu para cima, inteiro dentro da viewport)

**BUG-03 — MultiSelect, Enter com menu fechado (bloqueador)**: causa raiz
confirmada — `handleKeyDown` (que trata Enter como seleção) estava
anexado direto no botão gatilho sem checar `open`, chamando
`toggle(filtered[0])` mesmo com o menu fechado. Separado em
`handleTriggerKeyDown` (fechado: Enter/Espaço abrem) e
`handleListKeyDown` (aberto: Enter seleciona a opção destacada).

**BUG-04 — MultiSelect, busca não limpa (alta prioridade, corrigido
junto por estar no mesmo arquivo/mesma função)**: causa raiz confirmada
— `useClickOutside` só chamava `setOpen(false)`, nunca `setQuery('')`
(diferente do `useEscapeKey`, que já limpava os dois). Centralizado numa
função `close()` só, usada pelos dois caminhos de fechamento.

**BUG-05 — Tooltip/InfoTooltip sem Escape (bloqueador)**: causa raiz
confirmada — nenhum dos dois tinha `useEscapeKey`. Adicionado nos dois,
sem tirar o foco do gatilho (diferente do `Popover`, que devolve foco ao
fechar — aqui o foco já está no gatilho, é assim que o tooltip abre por
teclado).

**BUG-06 — DataTable sem ordenação por teclado (bloqueador)**: causa raiz
confirmada — `<th onClick>` direto, sem `<button>` interno, não entra na
sequência de Tab. Corrigido com `<button>` real dentro do `<th>`,
ganhando foco/Enter/Espaço de graça, sem código de teclado adicional.
**Achado real ao rodar a suíte de testes existente**: 2 testes antigos
falharam depois dessa mudança — não porque a ordenação quebrou, mas
porque os testes clicavam no `<th>` inteiro (que pode ter uma área maior
que o `<button>` inline dentro dele), e o clique podia cair fora do
botão. Corrigidos pra mirar o `<button>` real, mais um teste novo
específico de teclado (Tab alcança, Enter percorre asc/desc/none).

**A11Y-01 — gráficos dependem de hover (bloqueador)**: `LineChart` e
`BarChart` ganharam uma tabela de dados (`<table className="sr-only">`)
associada, com os mesmos dados das séries — visualmente oculta, mas
disponível pra tecnologias assistivas, seguindo a recomendação do
relatório de não exigir que cada ponto/barra seja focável individualmente.

**Validação do lote**:
- [x] `axe-core` real nas 8 páginas afetadas — 0 violações
- [x] 22 testes de regressão novos (`tests/smoke-test-fixes.spec.ts`),
      um cenário por bug reportado, estável em 2 rodadas
- [x] 161/161 testes funcionais, 47/47 regressão visual (2 imagens
      atualizadas — mudança estrutural sutil no `DropdownMenu` ao
      remover um wrapper que não é mais necessário sem posicionamento
      relativo, e a documentação do `InfoTooltip` que perdeu a prop
      `align`)
- [x] Build da biblioteca confirmada — 47 componentes

**Erro real que cometi e corrigi no caminho**: escrevi um teste de
regressão pro `BUG-02` (DatePicker, prioridade Alta, não bloqueador,
ainda não implementado nesse lote) por engano, junto com os testes dos
bloqueadores reais. Pego antes de rodar a suíte — removido do arquivo,
já que testaria um comportamento que ainda não existe.

### Decisões de escopo confirmadas com o time, uma de cada vez

Perguntei e recebi confirmação explícita pras 3 decisões da seção 5 do
relatório, individualmente, não em lote:

1. **Dark mode fora do escopo oficial da v1** — arquitetura de tokens
   continua funcionando por baixo; testes automatizados de dark mode
   continuam rodando (não removidos); só a alegação oficial de suporte
   sai da documentação/catálogo
2. **`LogoCutout` fora do escopo público da v1** — removido da nav/docs
   e dos exports públicos; código arquivado, não apagado
3. **Light mode como único tema oficial de release da v1**

*(Implementação dessas 3 decisões: pendente, próxima etapa.)*

### Itens de Alta prioridade (BUG-02, BUG-07, BUG-08) ✅ concluídos

Mesmo processo econômico do lote de bloqueadores: os 3 implementados de
uma vez, testados juntos numa sessão de Chrome (incluindo viewport
mobile de verdade pro BUG-08), suíte completa rodada uma vez ao final.

**BUG-02 — DatePicker não fecha ao clicar fora**: reaproveitados os
mesmos hooks `useClickOutside`/`useEscapeKey` já testados no resto do
DS, não uma lógica nova. Os dois caminhos de fechamento sem aplicar
(clique fora e Esc) descartam o rascunho (`draft`) e restauram pro
último valor de fato aplicado (`value`) — só o botão "Aplicar" grava o
rascunho de verdade. Esc também devolve o foco ao gatilho, clique fora
não força foco (o clique já foi uma intenção explícita de ir pra outro
lugar). Confirmado: clique fora fecha, reabrir não mostra o rascunho
descartado, Esc fecha e mantém o foco no gatilho.

**BUG-07 — FilterBar demo não aplicava categoria**: causa raiz
confirmada — a demo tinha `value={null}` e `onChange={() => {}}`
fixos, um stub que nunca refletia escolha nenhuma. Corrigido conectando
o `BrandSelect` ao mesmo array de filtros ativos que os chips já usavam
— escolher uma categoria cria/atualiza o chip de verdade, removê-lo
também limpa a seleção do Select. Bug era da composição da página de
demonstração, não do `BrandSelect` (que já passava no smoke test
isolado, como o próprio relatório observou).

**BUG-08 — Style Guide sem responsividade mobile**: sidebar vira drawer
abaixo do breakpoint `md` — fora da tela por padrão
(`-translate-x-full`), revelada por um botão de menu que só existe
nesse breakpoint, com backdrop e fechamento por Esc (reaproveitando
`useEscapeKey`). **Achado extra no caminho, não pedido explicitamente
mas parte do mesmo bug**: o `DataTable` usava `overflow-hidden` no
wrapper externo só pra clipar os cantos arredondados — sem um wrapper
interno com scroll próprio, uma tabela mais larga que a viewport mobile
ficaria cortada, não rolável. Adicionado `<div className="overflow-x-auto">`
interno, mantendo o clipping de cantos no wrapper externo.

**Validação do lote**:
- [x] `axe-core` real em desktop (3 páginas) e mobile com o menu aberto
      — 0 violações em todos os cenários
- [x] Confirmado com Chrome real em viewport mobile de verdade (375px):
      sidebar fora da tela por padrão, conteúdo ocupa a largura toda,
      botão de menu abre/fecha o drawer, Esc fecha
- [x] **Instabilidade real encontrada e corrigida no próprio teste**: o
      teste do drawer lia a posição da sidebar imediatamente após o
      clique, pegando um frame no meio da transição CSS
      (`transition-transform`) — x intermediário tipo -41 em vez de 0
      ou -256. Corrigido esperando a transição terminar antes de
      checar, confirmado 5x estável depois
- [x] 8 testes de regressão novos, 168/168 testes funcionais, 47/47
      regressão visual (1 imagem atualizada — conteúdo real do
      `FilterBar` mudou)
- [x] Build da biblioteca confirmada

### Itens de Baixa prioridade / design (UX-01, DOC-01, DOC-02, DESIGN-01, DESIGN-02) ✅ concluídos

Mesmo processo econômico dos lotes anteriores.

**UX-01 — padding da seta do seletor de linhas**: `Pagination` ganhou
`pr-7` (assimétrico, só no lado da seta nativa do `<select>`) — os
outros controles do DS usam padding simétrico porque não têm essa seta
embutida do navegador.

**DOC-01 — nomenclatura Select vs BrandSelect**: sidebar corrigida pra
"BrandSelect", reposicionada na ordem alfabética certa (entre
"BarChart" e "Breadcrumb"). Confirmado: título da página e item ativo
da sidebar batem.

**DOC-02 — documentação do VisuallyHiddenInput**: reescrita tanto a
página de doc quanto o comentário do componente real, removendo a frase
"alcançável por teclado" que podia sugerir uso isolado na sequência de
Tab. **Achado real fora do escopo desse ticket, documentado mas não
corrigido**: o componente não tem `tabIndex={-1}`, então pode gerar uma
parada extra e confusa no Tab quando usado via `FileUploadButton` — não
mudei o comportamento sem isso ser pedido, só anotei.

**DESIGN-01 — Badge warning**: `--warning-surface` trocado de
`#E8792A` pra `#A2551D` (reaproveitando um tom **já registrado** como
`warning-subtle-foreground`, não um valor novo) com texto branco —
unifica a linguagem visual com as outras variantes do Badge, que já
usavam branco sobre fundo saturado.

**DESIGN-02 — texto branco em superfícies turquesa**: `--success-surface`
atualizado pra `#008476` + branco (4,60:1, calculado). Criado o par
`--brand-turquesa-surface`/`-foreground`, mantendo `--brand-turquesa`
(a primitive pura) intocada, como pedido — usado por `AdminPageHeader`/
`KpiCard`. **Achado real no processo, não escondido**: o subtítulo do
`AdminPageHeader` usava `opacity-85`, que reduzia o contraste EFETIVO
do texto branco — com o turquesa mais escuro, isso passou a falhar
`axe-core` de verdade. Mesma categoria de bug já corrigida no `Alert`
antes neste projeto (Fase 2 do ROADMAP.md). Corrigido removendo a
opacity.

**Validação do lote**:
- [x] `axe-core` real em 9 páginas — 0 violações, incluindo depois da
      correção da opacity do `AdminPageHeader`
- [x] Confirmado com Chrome real: cores computadas de cada variante
      batendo com o esperado
- [x] **Instabilidade real de ambiente identificada e resolvida**: uma
      primeira rodada de atualização de imagens usou um processo de
      servidor antigo que tinha ficado travado numa chamada anterior —
      isso gerou referências desatualizadas (sem "BrandSelect" na
      navegação), causando falhas amplas na revalidação seguinte.
      Identificado comparando a captura ATUAL (correta) contra a
      referência salva (desatualizada), não aceito às cegas. Processos
      residuais eliminados, build refeito do zero, imagens regeneradas
      corretamente — confirmado 12/12 estável em 3 rodadas depois
- [x] 22 testes de regressão novos (total agora: 44 no arquivo
      `smoke-test-fixes.spec.ts`), 172/172 testes funcionais, 47/47
      regressão visual
- [x] Build da biblioteca confirmada

### Implementação das 3 decisões de escopo ✅ concluída (Ago 2026)

**1. Dark mode fora do escopo oficial da v1**: arquitetura de tokens
continua funcionando por baixo (confirmado com Chrome real: `document.documentElement.classList.add('dark')`
ainda muda as cores computadas de verdade), testes automatizados de
dark mode continuam rodando sem alteração. Adicionada seção explícita
no `README.md` ("Tema oficial da v1: light mode") e nota de escopo no
`MIGRATION.md`, junto da menção técnica de que o CSS distribuído
contém tokens de dark mode — deixando claro que existir tecnicamente
não é o mesmo que estar validado como requisito de release.

**2. `LogoCutout` fora do escopo público da v1**: movido de
`components/logo-cutout.tsx` pra `components/_archive/logo-cutout.tsx`
— não apagado, só saiu da pasta que `scripts/generate-exports.js` varre
automaticamente (`readdirSync` não-recursivo), então sai dos exports
públicos sem precisar mexer no script gerador. Removido da navegação
(a seção inteira "Grafismos de marca" só tinha esse componente, removida
também, não só o item). Página de documentação removida (rota órfã sem
link nenhum). **Achado real no processo**: a página `/comunidade`
(exemplo institucional construído numa fase anterior) usava o
`LogoCutout` de verdade, não só a documentação — corrigido removendo o
uso de lá também, senão o build quebraria (import apontando pro caminho
antigo) e o componente arquivado continuaria sendo exposto publicamente
de outro jeito. Testes que referenciavam a página removida
(`accessibility.spec.ts`, `visual-regression.spec.ts`) atualizados,
imagem de referência órfã removida. Confirmado com Chrome real: rota
antiga retorna 404, sidebar não mostra mais o item nem a seção,
`/comunidade` continua funcionando sem o grafismo.

**3. Light mode como único tema oficial de release**: declarado
explicitamente no `README.md`, junto da decisão 1.

**Achado adicional, fora do escopo original mas corrigido no
processo**: o `README.md` tinha contagens de teste completamente
desatualizadas (181/136/45, de uma fase muito anterior da sessão) —
corrigidas pros números reais atuais (217/171/46).

**Validação**:
- [x] Typecheck, build, e as 3 verificações de integridade confirmando
      `46 componentes` (47 → 46, `LogoCutout` de fato removido)
- [x] Confirmado com Chrome real: rota do `LogoCutout` dá 404, sidebar
      sem o item, `/comunidade` funcionando, dark mode tecnicamente
      ativo por baixo
- [x] 171/171 testes funcionais, 46/46 regressão visual (contagens
      reduzidas em 1 cada, correto — a página removida saiu das duas
      suítes)
- [x] Build da biblioteca confirmada — arquivo arquivado não vaza pro
      pacote publicado

Com isso, tanto o relatório de smoke test manual quanto as 3 decisões
de escopo confirmadas estão implementados e testados por completo.

---

## Correções pendentes pós-v2.25.0 (handoff "Correções pendentes", Ago 2026)

Segundo handoff externo, com escopo explícito de não reabrir arquitetura
nem refazer componentes já aprovados — 5 itens (`FIX-01` a `FIX-05`).
Verifiquei cada um contra o código real antes de aceitar, todos se
confirmaram.

### FIX-01 — Responsividade da home do Style Guide ✅ concluído

Causa raiz confirmada: `grid-cols-5` fixo (sem breakpoint nenhum) no
grid de "Cores da marca", e a tabela de "Combinações aprovadas" sem
nenhuma estratégia de overflow — os dois problemas exatos do relatório.
Corrigido: grid responsivo (`grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`)
e wrapper `overflow-x-auto` na tabela, mesmo padrão já usado no
`DataTable` desde o `BUG-08` da rodada anterior.

### FIX-02 — Dark mode fora do gate de release ✅ concluído

Causa raiz confirmada: a documentação já dizia que dark mode era "fora
do oficial" (rodada anterior), mas `test:functional` — o script que o
CI roda como gate — continuava incluindo os testes de
`tests/dark-mode.spec.ts` no mesmo comando (`--grep-invert "regressão
visual"` não excluía dark mode). Corrigido: `test:functional` agora
exclui explicitamente (`--grep-invert "regressão visual|dark mode:"`),
e um novo script `test:dark-mode` roda só esses testes, separadamente,
não bloqueando release. Contagem confirmada: 140 (gate) + 31 (dark
mode) = 171 (total, batendo com antes da separação).

### FIX-03 — VisuallyHiddenInput sem tabIndex ✅ concluído

Esse é um achado que eu mesmo já tinha documentado numa rodada anterior
(ao corrigir só a documentação do `DOC-02`) sem corrigir o
comportamento, por estar fora do escopo daquele ticket específico.
Agora corrigido: `tabIndex={-1}` adicionado, colocado **depois** do
spread de `...props` de propósito (não sobrescrevível por uma prop que
um consumidor eventualmente passasse). Confirmado com Chrome real: Tab
a partir do `FileUploadButton` pula direto pro próximo elemento real da
página, sem parar no input escondido.

### FIX-04 — Limpar/remover acessível por teclado ✅ concluído

Causa raiz confirmada nos dois componentes: o "×" de limpar
(`BrandSelect`) e de remover chip (`MultiSelect`) eram
`<span role="button">` **aninhados dentro do `<button>` do próprio
gatilho** — interativo dentro de interativo, inválido em HTML, sem
`tabIndex` nem tratamento de teclado.

- **`BrandSelect`**: só tem um "×" único, então a correção foi puxá-lo
  pra fora como um `<button>` real, **irmão** do gatilho (não mais
  filho), posicionado por cima via `absolute`
- **`MultiSelect`**: tem **múltiplos** chips, cada um com seu próprio
  "×" — puxar cada um pra fora individualmente não fazia sentido
  estruturalmente. Corrigido convertendo o gatilho de `<button>` pra
  `<div role="combobox">`, recriando manualmente o Enter/Espaço que um
  `<button>` nativo já dava de graça — isso libera os "×" de cada chip
  pra serem `<button>` reais, validamente aninhados dentro de um `<div>`

**Bug real encontrado e corrigido durante o teste da própria correção**:
depois de reestruturar o `MultiSelect`, testei o cenário exato do
`FIX-04` (Tab até o botão de remover, Enter pra remover) e o chip **não
saía** — em vez disso, o menu abria sozinho. Investigando: o `keydown`
do botão de remover (um filho) propagava pro `div` pai, que interceptava
`Enter` incondicionalmente e chamava `preventDefault()` **antes** do
navegador traduzir a tecla em clique no botão focado — suprimindo a
remoção de verdade e disparando `openMenu()` no lugar por engano.
Corrigido checando `e.target === e.currentTarget` no handler do
container, garantindo que ele só reage a teclas pressionadas nele
mesmo, não em algo dentro dele.

**Testes antigos quebrados por uma mudança estrutural legítima, não por
regressão de comportamento**: como o gatilho do `MultiSelect` deixou de
ser `<button>`, dois arquivos de teste anteriores
(`tests/slider-multi-select.spec.ts`,
`tests/smoke-test-fixes.spec.ts`) usavam o seletor
`button[aria-haspopup=listbox]`, que parou de encontrar o elemento.
Corrigidos pra `[role=combobox]` — só o seletor mudou, o comportamento
testado continua o mesmo. **Cuidado tomado**: um 4º uso desse mesmo
seletor, dentro do teste do `FilterBar`, referenciava o `BrandSelect`
(que continua `<button>`, não mudou) — não foi tocado, só as 3
ocorrências genuinamente do `MultiSelect`.

**Validação**: `axe-core` real em `BrandSelect`/`MultiSelect`/
`FileUploadButton` — 0 violações, incluindo com o "×" visível de
verdade (valor selecionado). Confirmado com Chrome real: Tab alcança o
botão de limpar/remover nos dois componentes, Enter executa a ação de
verdade, nenhum elemento interativo aninhado inválido restante.

### FIX-05 — Documentação sincronizada ✅ concluído

Confirmado e corrigido: `MIGRATION.md` dizia "45 componentes", corrigido
pra 46. Verificadas as outras ocorrências de contagens antigas em
`CHANGELOG.md`/`CONSOLIDATION.md` — são registros históricos legítimos
de versões passadas (ex: "47 componentes" numa entrada de changelog de
quando o `Button`/`IconButton` foram adicionados, antes do `LogoCutout`
ser removido depois), não desatualização — não foram tocadas, mudar
isso seria revisionismo do histórico do projeto. O checklist de "Portal
+ posicionamento por coordenadas" mencionado como possivelmente
desatualizado foi conferido contra o código real: ainda é genuinamente
pendente (`BrandSelect`, `DatePicker`, `MultiSelect`, `Tooltip`
standalone continuam sem portal), o item já estava correto.

### Validação completa do handoff

- [x] Typecheck, build, `verify:exports`/`verify:portable`/`verify:tokens`
- [x] `axe-core` real em todas as páginas afetadas — 0 violações
- [x] 24 testes de regressão novos (`tests/correcoes-pendentes-v2-25.spec.ts`
      com 8, mais 2 novos em `slider-multi-select.spec.ts`), mais 3
      seletores corrigidos em testes existentes
- [x] 150/150 testes funcionais (gate de release, sem dark mode),
      46/46 regressão visual, sem precisar atualizar nenhuma imagem
- [x] Build da biblioteca confirmada — 46 componentes

---

## Handoff "Correções pendentes v2.26.0" (Ago 2026)

Terceiro handoff externo, status inicial já indicando "apenas 2
correções funcionais/acessíveis e 1 ajuste de documentação" — os itens
anteriores já tinham sido resolvidos. Verifiquei os 3 contra o código
real antes de aceitar, todos se confirmaram.

### FIX-01 — BrandSelect, Enter com o menu fechado ✅ concluído

Causa raiz confirmada: exatamente o mesmo padrão de bug já corrigido no
`MultiSelect` (`BUG-03` do primeiro handoff) — um `handleKeyDown` só,
usado tanto no gatilho fechado quanto na busca aberta. Enter com o
Select fechado selecionava `filtered[0]` direto, sem nunca abrir a
lista. **Na hora do primeiro handoff, só o `MultiSelect` foi citado
como afetado — o `BrandSelect` ficou de fora por engano**, apesar de
compartilhar a mesma estrutura de handler único. Corrigido separando em
`handleTriggerKeyDown` (fechado: Enter/Espaço abrem) e
`handleListKeyDown` (aberto: Enter seleciona a opção destacada, Esc
fecha, setas navegam) — mesmo padrão já usado no `MultiSelect`.

### FIX-02 — MultiSelect, semântica ARIA do combobox ✅ concluído

Causa raiz confirmada: o `<div role="combobox">` (criado na correção do
`FIX-04` do primeiro handoff, pra permitir os "×" de remover chip como
botões reais) tinha `aria-expanded`/`aria-haspopup`, mas nenhum nome
acessível (`aria-label`/`aria-labelledby`) nem `aria-controls` ligando
com a listbox. Confirmado também: `multi-select` genuinamente ausente
de `tests/accessibility.spec.ts`, nos dois estados.

- [x] Nova prop `label: string` — **obrigatória, não opcional**, mesmo
      raciocínio já usado no `IconButton` (Sprint 3): nome acessível
      não é opcional pra um widget interativo, forçar isso em tempo de
      compilação é mais barato que descobrir depois numa auditoria.
      `ariaLabelledBy` opcional, pra quando já existe um `<label>`
      visível associado
- [x] `useId()` gerando um id estável pra listbox, conectado via
      `aria-controls` no combobox e `id` na `<ul role="listbox">`
- [x] Único uso real do componente (`app/style-guides/components/multi-select/page.tsx`)
      atualizado com a prop nova
- [x] `multi-select` adicionado em `tests/accessibility.spec.ts`, nos
      dois estados (fechado, já cobria; aberto, novo cenário) — mesmo
      padrão já usado pra `Select`/`DatePicker`/`Modal`/`DropdownMenu`

**Validação decisiva**: `axe-core` real (não confiança na estrutura só)
confirmando **0 violações fechado e aberto** — a auditoria que
literalmente faltava.

### DOC-01 — README com contagens desatualizadas ✅ concluído

Confirmado e corrigido: README dizia "140 testes" pro `test:functional`
(cresceu pra 150 na rodada anterior, mas esse número específico não
tinha sido atualizado) e "217" pro total (real: 227 — confirmado com
`npx playwright test --list` sem nenhum filtro, não só aritmética,
antes de publicar o número).

### Validação completa do handoff

- [x] Typecheck, build, `verify:exports`/`verify:portable`/`verify:tokens`
- [x] `axe-core` real no `MultiSelect`, fechado e aberto — 0 violações
- [x] 5 testes de regressão novos (`FIX-01`/`FIX-02` desta rodada, no
      mesmo arquivo `tests/correcoes-pendentes-v2-25.spec.ts`), mais 1
      cenário novo em `accessibility.spec.ts`
- [x] 157/157 testes funcionais (gate de release), 46/46 regressão
      visual **sem precisar atualizar nenhuma imagem** — exatamente o
      que o handoff pediu ("sem atualizar referências se não houver
      mudança visual esperada")
- [x] Build da biblioteca confirmada — 46 componentes

**Processo usado nessa rodada**: implementei os 3 itens de uma vez, sem
parar pra validar entre cada um — só testei manualmente com Chrome real
os dois cenários que o próprio handoff pediu pra confirmar
("repetir manualmente apenas: BrandSelect por Enter e MultiSelect por
teclado"), e rodei a suíte completa **uma vez só**, no final.

---

## Handoff "Correções pendentes v2.28.0" (Ago 2026)

Quarto handoff externo — "os dois bloqueadores do handoff anterior
passaram na revisão de código". 4 itens (`FIX-01` a `DOC-02`).
Verifiquei todos contra o código real antes de aceitar.

### FIX-01 — BrandSelect: fechamento inconsistente ✅ concluído

Causa raiz confirmada nos dois cenários exatos do relatório:
`useClickOutside` só chamava `setOpen(false)`, sem limpar `query`; e
`Escape` só era tratado dentro de `handleListKeyDown`, que só recebe o
evento quando o foco está especificamente no campo de busca — com
Shift+Tab movendo o foco pro botão "Limpar seleção" ou pro gatilho
(ambos dentro do popover aberto), Escape parava de fechar. Mesmo padrão
de bug já resolvido no `MultiSelect`, replicado aqui: `close()`
centralizado (`setOpen(false)` + `setQuery('')`), `useClickOutside` e
`useEscapeKey` chamando a mesma função — e os três caminhos de seleção
(Enter na lista, clique na opção) também passaram a reaproveitar
`close()` em vez de duplicar a lógica de fechamento em cada um.

**Confirmado com Chrome real, os dois cenários exatos do relatório**:
busca digitada → clique fora → reabrir → campo vazio; menu aberto →
Shift+Tab até "Limpar seleção" → Escape → fecha de verdade, com o valor
já selecionado preservado sem alteração.

### API-01 — MultiSelect: contrato de nome acessível contraditório ✅ concluído

Causa raiz confirmada: `label: string` obrigatório **e**
`ariaLabelledBy?: string` opcional ao mesmo tempo — mas a renderização
já tratava como alternativas mutuamente exclusivas. Um consumidor que só
queria `ariaLabelledBy` continuava obrigado a passar um `label`
redundante, silenciosamente ignorado.

Corrigido com união discriminada (`{ label: string; ariaLabelledBy?: undefined } | { label?: undefined; ariaLabelledBy: string }`),
exigindo exatamente uma das duas em tempo de compilação — a opção
recomendada pelo relatório, não a alternativa mais simples de remover
`ariaLabelledBy`.

**Achado real no processo**: fui confirmar que o guardrail pegava de
verdade os 2 cenários inválidos (as duas props juntas, nenhuma das
duas), e descobri que `tsconfig.json`'s `include` **não cobre
`components/` diretamente** — só `app` e `lib`. Um arquivo de teste
colocado direto em `components/` fica invisível pro compilador (mesmo
com um erro de tipo óbvio, sem relação nenhuma com este componente,
não relatado). Tive que mover o teste temporário pra dentro de `app/`
pra confirmar de verdade — só então os dois cenários inválidos
falharam com as mensagens de erro corretas, e os dois válidos
passaram. **Isso não foi corrigido** (fora do escopo pedido), mas fica
registrado: qualquer componente que não seja importado por nenhuma
página de documentação tem seus tipos silenciosamente não verificados
por `tsc --noEmit`. Na prática, os 46 componentes atuais são todos
importados por sua própria página de doc, então não há problema
concreto hoje — mas é um ponto cego real do setup atual.

### DOC-01 — Página do MultiSelect com Props desatualizadas ✅ concluído

Bloco de `Props` reescrito refletindo a união discriminada real, com
uma nota explicando quando usar `label` vs `ariaLabelledBy`.

### DOC-02 — README com contagens defasadas de novo ✅ concluído

**Segunda vez que esse tipo de item aparece** — a contagem de
`test:functional` tinha crescido de 150 pra 157 (rodada anterior) sem o
README ser atualizado, e o total mudou de 227 pra 234 (não só a soma —
confirmado via `npx playwright test --list` sem filtro, não aritmética,
como o próprio relatório pediu). **Achado real no processo**: minha
primeira tentativa de rodar os filtros de grep retornou `0 tests in 0
files` — um problema de escape de aspas no meu próprio comando bash,
não um problema real do projeto. Descobri isso testando um arquivo
específico primeiro (que funcionou), depois sem filtro nenhum (que
também funcionou, `234`), isolando que o problema era especificamente
nos meus filtros de grep com aspas duplas — refeito com aspas simples,
confirmado `157 + 46 + 31 = 234`.

**Recomendação pro time, não implementada agora**: essa é a 2ª
recorrência do mesmo tipo de desatualização. Dado que já existe
`verify:exports`/`verify:portable`/`verify:tokens` como guardrails
automatizados pra categorias de deriva conhecidas, um
`verify:readme-counts` que compara os números do README contra
`playwright test --list` de verdade evitaria uma 3ª ocorrência — não
construí isso agora por estar fora do escopo pedido nesse handoff.

### Validação completa do handoff

- [x] Typecheck, build, `verify:exports`/`verify:portable`/`verify:tokens`
- [x] `axe-core` real em `select`/`multi-select`/`filter-bar` — 0 violações
- [x] Confirmado com Chrome real os 2 cenários exatos do `FIX-01`
- [x] Confirmado com um teste de compilação real (dentro de `app/`,
      não invisível como `components/` sozinho) que a união
      discriminada do `API-01` rejeita os 2 cenários inválidos e aceita
      os 2 válidos
- [x] 6 testes de regressão novos
- [x] **Erro cometido e corrigido no processo**: ao inserir os testes
      novos no meio do arquivo `correcoes-pendentes-v2-25.spec.ts`, uma
      substituição de texto acabou apagando a linha de abertura de um
      `test.describe` existente (`FIX-02 (v2.26.0)`), deixando o corpo
      dele órfão — pego contando `test.describe(` vs `})` no arquivo
      antes de rodar qualquer teste (8 e 8, mas só depois de notar a
      divergência inicial), corrigido restaurando a linha, revalidado
      com o arquivo inteiro rodando 17/17
- [x] 161/161 testes funcionais, 46/46 regressão visual (1 imagem
      atualizada — o bloco de Props do `multi-select` mudou de verdade,
      conteúdo real do `DOC-01`)
- [x] Build da biblioteca confirmada — 46 componentes

---

## Handoff "Correções pendentes v2.29.0" (Ago 2026)

Quinto handoff externo — "as pendências da v2.27.0 foram implementadas".
3 itens (`FIX-01`, `TECH-01`, `DOC-01`). Verifiquei os 3 contra o código
real antes de aceitar.

### FIX-01 — BrandSelect: fechamento pelo próprio gatilho preservava a busca ✅ concluído

Causa raiz confirmada: a rodada anterior centralizou Esc, clique fora e
seleção em `close()`, mas o clique no **próprio gatilho** pra fechar
ainda usava `setOpen((o) => !o)` direto — terceiro caminho de
fechamento sem selecionar, esquecido na correção anterior. Extraído
`openMenu()` como função própria (antes só inline dentro de
`handleTriggerKeyDown`), reaproveitada também no `onClick` do gatilho —
agora todo caminho de abrir usa `openMenu()`, todo caminho de fechar
sem selecionar usa `close()`.

**Confirmado com Chrome real, o cenário exato do relatório**: abrir →
digitar busca → clicar no próprio gatilho pra fechar → reabrir → campo
vazio.

### TECH-01 — Typecheck não cobre components/ diretamente ✅ concluído

Achado confirmado: `tsconfig.lib.json` **já existia** no projeto (não
foi criado agora), mas nunca tinha sido conectado a nenhum script —
ficava disponível só se alguém lembrasse de rodar manualmente.

**Validado com o critério de aceite exato do relatório**: introduzi um
erro de tipo real e temporário no `LogoCutout` arquivado (não importado
por nenhuma página — candidato perfeito, já que é exatamente o cenário
de "componente arquivado" que o relatório citou como risco). Confirmado:
`npm run typecheck` normal não pegava (código 0), `tsc -p
tsconfig.lib.json` pegava de verdade (código 2). Revertido o erro de
teste, confirmado os dois gates limpos depois.

- [x] Script `typecheck:lib` adicionado, usando o `tsconfig.lib.json` já existente
- [x] Passo correspondente adicionado no CI, logo depois do `typecheck` normal

### DOC-01 — README com contagens defasadas pela 3ª vez ✅ concluído, com guardrail automatizado

**Terceira recorrência do mesmo tipo de item** (v2.26.0, v2.27.0,
v2.28.0) — dessa vez implementado o guardrail recomendado desde a
rodada anterior, não só corrigido o número manualmente de novo.

- [x] `scripts/verify-readme-counts.js` criado — compara os números do
      README contra a saída real de `npx playwright test --list` (com
      os mesmos filtros de grep que `test:functional`/`test:visual`/
      `test:dark-mode` usam de verdade), não soma feita à mão
- [x] Testado que pega divergência de verdade: introduzi um número
      errado de propósito, o script falhou; revertido, voltou a passar
- [x] Script `verify:readme-counts` adicionado ao `package.json`, e o
      passo correspondente no CI, junto das outras verificações
      estáticas (`verify:tokens`, etc.)

**Prova real e não planejada de que o guardrail funciona**: depois de
adicionar o teste de regressão obrigatório do `FIX-01`, a contagem de
testes funcionais cresceu de 161 pra 162 — e o guardrail recém-criado
**pegou essa divergência dentro da própria sessão que o construiu**,
antes de eu ter chance de esquecer de atualizar o número. Corrigido pro
valor final (162 funcional, 239 total).

### Validação completa do handoff

- [x] `npx tsc --noEmit` e `npx tsc -p tsconfig.lib.json --noEmit` — limpos
- [x] `node scripts/verify-readme-counts.js` — passa limpo
- [x] `axe-core` real no `BrandSelect` — 0 violações
- [x] 2 testes de regressão novos (1 pro `FIX-01`, mais o teste
      obrigatório do terceiro caminho de fechamento)
- [x] 162/162 testes funcionais, 46/46 regressão visual **sem precisar
      atualizar nenhuma imagem**
- [x] Build da biblioteca confirmada — 46 componentes

---

## Nota sobre o congelamento de componentes novos

A revisão sugeriu congelar componentes novos até o fim das Sprints 1 e 2.
Concordamos com o espírito, mas com uma correção cirúrgica: automatizar a
geração de exports (feito acima, DS-01) já neutraliza a categoria
específica de bug que motivou a sugestão — um componente novo agora
aparece no pacote sozinho, sem depender de alguém lembrar de atualizar
2 arquivos à mão. Os outros débitos (hex hardcoded, botão cru, APIs de
overlay divergentes) continuam existindo e ainda pesam contra adicionar
mais componentes antes da Sprint 2, mas o risco específico de "export
esquecido" já não se repete mais.
