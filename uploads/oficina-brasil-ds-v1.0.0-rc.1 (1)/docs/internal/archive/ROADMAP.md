# Roadmap de melhorias — Oficina Brasil Design System

Este documento estrutura os aprimoramentos identificados numa autoavaliação
crítica pós-v1 (Ago 2026), antes de começar a implementar qualquer um deles.
Cada item tem: o problema real que motivou ele, escopo concreto, esforço
estimado, dependência de outros itens, e como saber que está "pronto".

Ordem de execução sugerida: **1 → 2 → 3 → 4 → 5 → 6** (as duas primeiras
fases são pré-requisito prático das demais — sem CI, cada correção futura
volta a depender de alguém rodar tudo manualmente e lembrar de conferir).

## ✅ Status: as 6 fases concluídas (Ago 2026)

Todas as fases planejadas foram implementadas, testadas de verdade (não
só configuradas) e validadas com o mesmo rigor: CI real simulado do zero
antes de cada entrega, bugs reintroduzidos de propósito pra confirmar que
as proteções pegam, e nenhuma decisão de infraestrutura/API pública
tomada sem antes ser levada pra fora. Suíte de teste final: 98 testes,
todos passando. Ver cada fase abaixo para o relatório detalhado.

---

## Fase 1 — CI básico (typecheck + build a cada push) ✅ concluída (Ago 2026)

**Problema real**: `typecheck` e `build` só rodam quando alguém lembra de
rodar manualmente. Isso já causou pelo menos um caso concreto nesta sessão
— um erro de tipagem do `useRef` no Checkbox só apareceu no `next build`,
nunca no `tsc --noEmit` isolado; se ninguém tivesse rodado os dois, teria
ido pro repositório quebrado.

**Escopo**:
- [x] Workflow do GitHub Actions (`.github/workflows/ci.yml`): `npm ci` → `npm run typecheck` → `npm run build`
- [x] Rodar em todo push e pull request pra `main`
- [x] Falhar o PR se qualquer etapa falhar (comportamento padrão do GitHub Actions — qualquer step com exit code != 0 falha o job)

**Esforço**: baixo (~1 sessão de trabalho)
**Depende de**: nada — pode começar imediatamente
**Pronto quando**: um PR com erro de tipo proposital falha o CI automaticamente, sem intervenção manual

**Achado durante a execução, fora do escopo original desta fase**: `npm audit`
rodado como parte da validação encontrou **2 vulnerabilidades de alta
severidade no Next.js 14.2.5** (a versão usada desde o início do projeto),
com correção disponível só via upgrade major pro Next.js 16.3.3 — uma
mudança que quebra compatibilidade, não cabe dentro do escopo de "configurar
CI". Registrado como novo item de roadmap (ver Fase 1.5 abaixo) e no log de
decisões, não corrigido silenciosamente nem ignorado.

**Bug de sintaxe pego durante a validação**: a chave `on:` do workflow, sem
aspas, é interpretada por parsers YAML padrão como o booleano `true`, não a
string "on" (pegadinha conhecida do YAML 1.1 com `on/off/yes/no`). O GitHub
Actions tolera isso na prática, mas corrigido pra `"on":` explícito, pra não
depender desse comportamento tolerante — confirmado via `PyYAML` que a chave
vira string corretamente depois da correção.

---

## Fase 1.5 — Upgrade de segurança do Next.js ✅ concluída (Ago 2026)

**Problema real**: `npm audit` encontrado durante a Fase 1 relatou 2
vulnerabilidades de alta severidade no Next.js 14.2.5 — DoS via Image
Optimizer, HTTP request smuggling em rewrites, XSS em cenários com CSP
nonce, entre outras (lista completa via `npm audit` no projeto). Correção
disponível só via `next@16.3.3`, uma mudança major.

**O que foi feito**:
- [x] Lidos os guias oficiais de upgrade da v15 e v16 direto do repositório do Next.js (não confiado só em memória de treinamento)
- [x] Checado cada mudança "breaking" contra o código real do projeto antes de assumir que afetava ou não: APIs assíncronas de `cookies`/`headers`/`params` (não usadas), `fetch()` (não usado), Route Handlers (não existem), `next/image` (não usado), middleware (não existe), geração dinâmica de ícone/opengraph-image (não usada) — nenhuma dessas mudanças afetava este projeto
- [x] Upgrade incremental real: 14.2.5 → 15.5.24 (React 18→19) → 16.3.3, testando build a cada passo, não pulando direto
- [x] `@types/react` atualizado pra `^19.2.18`; `@types/react-dom` nunca esteve declarado no projeto (não foi necessário adicionar)
- [x] Testado de verdade com Chrome real via Playwright em cada checkpoint (v15 e v16): Modal (focus trap + Tab cycling), BrandSelect (busca sem acento), DatePicker (navegação por teclado entre meses), DataTable (ordenação), DropdownMenu (posicionamento), Toast — zero erros de JavaScript no console
- [x] `npm audit` final: **0 vulnerabilidades** (eram 2 de alta severidade)
- [x] `engines.node` do `package.json` e `node-version` do CI atualizados pra `20.9.0` (mínimo real exigido pelo Next.js 16, descoberto no próprio guia oficial)
- [x] Simulado o pipeline de CI completo do zero (`rm -rf node_modules && npm ci && npm run typecheck && npm run build`) antes de considerar pronto

**Esforço real**: médio — a leitura cuidadosa dos guias oficiais e a checagem sistemática contra o código real (em vez de assumir o que quebraria) foi o que tomou mais tempo, não a instalação em si
**Pronto quando**: `npm audit` sem vulnerabilidades de alta severidade, build e todas as páginas de style guide continuam funcionando — **confirmado**

---

## Fase 2 — Suíte de teste persistida (converter os scripts descartáveis) ✅ concluída (Ago 2026)

**Problema real**: todo bug real encontrado nesta sessão (BrandSelect
vazando, Checkbox virando círculo, DropdownMenu esticando no flex, Modal
com foco escapando, DataTable não ordenando) foi achado escrevendo um
script de Playwright do zero, rodando uma vez, e descartando depois. Nada
disso persiste — se uma regressão futura reintroduzir o mesmo bug, ninguém
vai saber até notar visualmente nas costas, exatamente como aconteceu com
o FilterBar.

**O que foi feito**:
- [x] `@playwright/test` + `@axe-core/playwright` instalados como devDependencies
- [x] `playwright.config.ts` — `webServer` sobe build de produção real antes dos testes (mesma validação manual feita antes de cada entrega, agora automatizada)
- [x] 66 testes escritos em 7 arquivos: `modal.spec.ts`, `brand-select.spec.ts`, `date-picker.spec.ts`, `dropdown-menu.spec.ts`, `data-table.spec.ts`, `form-controls.spec.ts` (Checkbox/RadioGroup/Switch), `accessibility.spec.ts` (axe-core contra as 35 páginas de style guide + 4 popovers abertos)
- [x] Script `test` adicionado ao `package.json`; script `start` também adicionado (não existia, necessário pro `webServer`)

**Bugs reais encontrados rodando a suíte pela primeira vez** (9 falhas na primeira rodada — investigadas uma a uma, não just corrigidas às cegas):

| Achado | Era bug real ou erro no teste? |
|---|---|
| `Alert` warning: texto sobre tint mede 2.61:1 (precisa 4.5:1) | **Bug real** — corrigido com tom escurecido (4.87:1 medido) |
| `Badge` warning: branco sobre laranja mede 2.92:1 | **Bug real** — corrigido pra texto azulEscuro (5.98:1), mesmo padrão do `success` |
| `Alert` error: texto sobre tint mede 3.93:1 | **Bug real** — corrigido com tom escurecido (4.69:1) |
| `StatComparison`: turquesa "positiva" mede 2.53:1 sobre branco | **Bug real** — a cor foi escolhida numa sessão anterior com a justificativa de "mais legível que verde", nunca medida de verdade. Corrigida pra versão escurecida (4.84:1) |
| `ProgressRing`/`ProgressBar`: sem `aria-label` quando `label` não é passado | **Bug real** — adicionado fallback `"{valor}% concluído"` |
| 32 páginas de doc: blocos `<pre>` roláveis sem foco por teclado | **Bug real, sistêmico** — `tabIndex={0}` adicionado em todas de uma vez |
| Segunda causa do bug do `Alert` warning: `opacity:0.85` no texto de descrição reduzia o contraste **efetivo** renderizado, abaixo do que a cor sozinha sugeria | **Bug real, mais sutil** — opacity removida, cor sólida direto |
| `BrandSelect`: locator ambíguo (texto "São Paulo" também aparece na descrição da página) | Erro no teste — corrigido pra `getByRole('option', ...)` |
| `DatePicker` presets: mesmo problema, "Últimos 7 dias" aparece na descrição E no botão | Erro no teste — corrigido pra `getByRole('button', ...)` |
| `DataTable` estado vazio: teste assumia texto padrão, a página usa `emptyMessage` customizado | Erro no teste — corrigido pra checar o texto real renderizado |
| `DropdownMenu`: foco não voltava pro gatilho | Erro no teste — `getByText` pegou o `<span>` interno (nunca focado), não o `<button>` real. Corrigido pra `getByRole('button', ...)` |

**Resultado final**: 66/66 testes passando, rodados do zero (`rm -rf .next` antes de cada rodada, sem cache mascarando nada).

**Achado de infraestrutura, não de componente**: o `webServer.url` original apontava pra `/` (raiz), que retorna 404 nesse projeto (não existe página lá — tudo fica sob `/style-guides`). Isso travava o Playwright em timeout de 180s mesmo com build e start funcionando perfeitamente quando testados isolados — descoberto rodando `DEBUG=pw:webserver` e comparando com testes manuais do `build`/`start` isolados.

**Esforço real**: alto — a investigação de cada uma das 9 falhas (decidir se era bug real ou erro de teste, calcular contrastes reais, calcular cores corrigidas) tomou muito mais tempo que escrever os testes em si
**Pronto quando**: `npx playwright test` roda a suíte inteira localmente sem servidor manual — **confirmado, 66/66**

---

## Fase 3 — Ligar a suíte de teste ao CI ✅ concluída (Ago 2026)

**Escopo**:
- [x] Adicionado `npm test` ao workflow da Fase 1, depois de typecheck+build
- [x] Cache de browsers do Playwright no CI (`actions/cache@v4`, chave baseada no hash do `package-lock.json`)
- [x] Otimização real: o `webServer` do Playwright rodava `build && start` toda vez — no CI isso dobraria o tempo, já que o build já roda como passo separado antes. Corrigido pra comando condicional (`process.env.CI`): no CI só faz `start` reaproveitando o build anterior; localmente continua fazendo `build && start` por conveniência de quem só quer rodar `npm test` direto

**Esforço**: baixo, como esperado
**Depende de**: Fase 1 e Fase 2 — ambas já concluídas
**Pronto quando**: um PR que reintroduz um bug já corrigido antes falha o CI sozinho — **validado de verdade**: reintroduzi de propósito o bug de largura fixa do `BrandSelect` (`w-full` → `w-64`), rodei a suíte, o teste de regressão específico falhou mostrando a medida exata da sobreposição (`Received: 544`, `Expected: <= 500`). Revertido o bug de propósito, suíte voltou a passar 100%. Não foi só simulado — a captura de regressão de verdade aconteceu.

---

## Fase 4 — Auditoria sistemática por "categoria de bug recorrente" ✅ concluída (Ago 2026)

**Problema real**: a mesma categoria de bug apareceu várias vezes,
corrigida isoladamente cada vez que apareceu, nunca varrida sistemtica: largura fixa
ignorando o container (`BrandSelect`), radius desproporcional a elementos
pequenos (`Checkbox`), cor hardcoded não se adaptando ao tema (5
componentes diferentes), container se comportando diferente dependendo do
pai (`DropdownMenu`). Não fiz uma varredura dos 33 componentes procurando
essa mesma família de problema — é provável que ainda tenha mais algum.

**O que foi feito**:
- [x] Grep sistemático por larguras/alturas fixas em todos os componentes
      — a maioria são ícones/badges legitimamente de tamanho fixo (não
      bugs); o único candidato real (`DatePicker`, mesmo padrão de
      container do `DropdownMenu`) foi testado dentro do contexto real de
      flex column da própria página de doc — painel abre perfeitamente
      alinhado ao gatilho (diferença de 0px), porque não usa `right-0`
      como o `DropdownMenu` usava. Adicionado como teste de regressão
      permanente.
- [x] Auditoria de dark mode expandida: novo `tests/dark-mode.spec.ts`
      rodando axe-core com `.dark` aplicado contra as 30 páginas com
      componentes de cor — não só a checagem em modo claro que já existia
- [x] Validado com o mesmo rigor da Fase 3: reintroduzi de propósito o bug
      original de dark mode do `KpiCard` — o teste NÃO pegou na primeira
      tentativa (achado real: `addInitScript` não funciona pra aplicar
      `.dark` no `<html>` desse projeto, porque o React reseta o
      `className` desse elemento na hidratação já que o layout raiz o
      controla diretamente). Corrigido aplicando a classe depois do
      `networkidle`, revalidado que aí sim pega o bug reintroduzido

**5 bugs reais de dark mode encontrados na primeira rodada completa**:

| Componente | Cor hardcoded | Contraste real | Causa raiz |
|---|---|---|---|
| `Checkbox`/`Input` (texto de erro) | `#D14343` sobre `#00134E` | 3.81:1 | `--destructive` nunca tinha sido de fato adaptado pro dark mode — mesmo valor idêntico ao claro |
| `FilterBar` ("Limpar tudo") | `#18328A` sobre `#00134E` | 1.54:1 | Hex fixo em vez de `var(--primary)`, que **já estava** corretamente adaptado (vira verde no escuro) mas nunca foi usado |
| `Tabs` (aba ativa) | `#18328A` sobre `#00134E` | 1.54:1 | Mesma causa do FilterBar |
| `StatComparison` (positivo/negativo) | `#008073`/`#D14343` sobre `#122568` (card escuro) | 2.90:1 / 3.08:1 | Cores calculadas inline em JS, nunca tiveram variante de dark mode |

**Correções**: `--destructive` corrigido no `.dark` (novo valor `#DF7B7B`,
passa 4.87-6.03:1 contra os dois fundos escuros do tema); novo token
`--stat-positive` criado (não existia); `FilterBar`/`Tabs` migrados pra
`var(--primary)` em vez de hex fixo; `StatComparison` migrado pros dois
tokens novos. `Textarea`/`Label` corrigidos por consistência mesmo sem
terem sido pegos pelo teste (mesmo padrão do achado do `ProgressBar` na
Fase 2: a página de doc do `Textarea` nunca exercitava o estado de erro —
corrigido adicionando um exemplo real que usa `error`).

**Resultado final**: 97/97 testes passando (66 anteriores + 1 novo teste
de regressão do DatePicker + 30 novos testes de dark mode).

**Esforço real**: médio-alto — a auditoria de largura/altura fixa foi
rápida, mas a de dark mode (a mais valiosa) exigiu descobrir e corrigir um
bug na própria metodologia de teste antes de conseguir confiar nos
resultados
**Pronto quando**: checklist rodado uma vez, achados documentados no log
de decisões — **confirmado**, 5 resolvidos, todos com teste de regressão
permanente cobrindo

---

## Fase 5 — Consistência da assinatura de `onChange` ✅ concluída (Ago 2026)

**Problema real**: `Checkbox` usa `onChange={(e) => ...}` (evento nativo
do DOM), mas `BrandSelect`, `RadioGroup`, `Switch`, `DatePicker` usam
`onChange={(valor) => ...}` (valor direto). Nenhum dos dois padrões está
errado, mas a inconsistência obriga quem usa o design system a lembrar
qual componente segue qual convenção.

**Decisão levada pra fora de mim antes de implementar** (conforme o
próprio escopo desta fase exigia): apresentadas 3 opções — Checkbox
alinha aos demais, os demais alinham ao Checkbox, ou manter como está.
Escolhido: **Checkbox muda pra valor direto**, aceitando que é uma
mudança que quebra compatibilidade.

**O que foi feito**:
- [x] `CheckboxProps.onChange` mudou de `(e: ChangeEvent) => void` pra `(checked: boolean) => void`
- [x] Internamente, o `<input>` nativo continua recebendo o evento real do DOM — só a prop pública que muda, intercept via handler interno (mesmo padrão já usado pra `mask` no `Input`)
- [x] Página de documentação atualizada: exemplo de uso, texto explicando a mudança com link pro `CHANGELOG.md`, bloco de `Props` exibido corrigido
- [x] Teste de regressão específico criado: clicar duas vezes precisa desmarcar — se `onChange` ainda passasse o `Event` nativo pro `setState<boolean>` da página de doc, o estado viraria um objeto sempre "truthy", o checkbox marcaria uma vez e **nunca desmarcaria** no segundo clique. Esse teste garante que o valor é o boolean de verdade, não só que "clicar muda alguma coisa" (o teste antigo não pegaria esse bug específico)

**Esforço**: baixo tecnicamente, como esperado — o trabalho real foi a decisão em si, não a implementação
**Depende de**: nada tecnicamente
**Pronto quando**: todos os componentes de formulário seguem a mesma convenção, documentado como breaking change — **confirmado**, suíte completa (98 testes agora) passando, incluindo o teste específico de regressão da assinatura

---

## Fase 6 — Estrutura de pacote real (não "copiar a pasta") ✅ concluída (Ago 2026)

**Problema real**: hoje o `MIGRATION.md` manda copiar a pasta
`components/` inteira pro repositório de produto. Funciona pra uma
primeira migração, mas não escala — toda atualização futura do design
system vira copiar e colar de novo, sem versionamento, sem
`npm install @oficina-brasil/ds`.

**Escopo decidido com o time antes de implementar**: apresentadas 4
opções (pacote npm privado, workspace de monorepo, só preparar a base
técnica, ou não fazer nada agora). Escolhido: **preparar a base técnica
(build + exports), decisão de publicação fica pra depois** — mesmo
princípio da Fase 5, não decidir sozinho o que é infraestrutura do time.

**O que foi feito**:
- [x] `tsup` configurado com **um entry point por componente** (34 arquivos), não um bundle único — isso é o que resolve o problema do Recharts, não uma opção cosmética
- [x] `tsconfig.lib.json` dedicado — achado real: o `tsconfig.json` principal tem `incremental: true` (adicionado automaticamente pelo Next.js 16), que quebra a geração de múltiplos `.d.ts` separados do `tsup`. Corrigido com um tsconfig próprio pro build da lib, sem essa opção
- [x] `package.json` com `exports` map completo (gerado programaticamente via Python, não digitado à mão — 34 componentes × 3 formatos cada), `sideEffects: false`, `main`/`module`/`types`, e `react`/`react-dom`/`recharts` movidos pra `peerDependencies`
- [x] Confirmado que `"use client"` é preservado nos componentes que precisam (`Checkbox`, `Modal`) e corretamente ausente nos que não usam (`Badge`) — não assumido, checado byte a byte no output
- [x] **Prova concreta, não suposição**: `badge.js` tem zero referências a `recharts` (1.81KB); `line-chart.js` referencia `recharts` como `require()` externo, não embutido — exatamente o problema do roadmap, resolvido de verdade
- [x] Validação convertida em script permanente (`scripts/verify-lib-build.js`, rodado via `npm run verify:lib`) — mesmo princípio de "toda checagem manual vira teste persistido" aplicado o roadmap inteiro. Validado que o script de fato falha quando deveria: corrompi `badge.js` de propósito, o script pegou e saiu com código 1; revertido, voltou a passar
- [x] Ligado ao CI: `build:lib` + `verify:lib` adicionados ao workflow depois do build do app
- [x] `MIGRATION.md` atualizado com a nova opção (mantendo "copiar arquivos" como alternativa válida, não substituída)
- [x] `esbuild` (dependência transitiva do `tsup`) veio com uma vulnerabilidade de baixa severidade — corrigida via `overrides` no `package.json`, `npm audit` confirmado limpo antes de seguir

**Esforço real**: alto, como o roadmap já esperava — a maior parte do
tempo foi a configuração do `tsconfig` dedicado (erro não óbvio) e gerar
o `exports` map de forma confiável pra 34 componentes
**Depende de**: Fase 5 (resolvida antes, como o roadmap pedia — não fazia
sentido publicar uma v1 de pacote sabendo que uma breaking change viria logo depois)
**Pronto quando**: o roadmap original dizia "`npm install` funciona a
partir de um pacote publicado" — esse critério foi conscientemente
reduzido de escopo pela decisão do time (só base técnica, sem publicar
ainda). Critério real desta rodada: `npm run build:lib && npm run
verify:lib` provam que a estrutura funciona e resolve o problema
documentado — **confirmado**, com o app Next.js e a suíte de 98 testes
inalterados (nada quebrou preparando isso)

---

## Fora de escopo deste roadmap

Itens já cobertos no `CHANGELOG.md` (leitor de tela real, licença
jurídica, fotografia do produto) continuam como pendências separadas, não
duplicadas aqui.
