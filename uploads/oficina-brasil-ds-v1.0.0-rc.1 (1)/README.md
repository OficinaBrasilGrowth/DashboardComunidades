# Oficina Brasil Design System

Sistema oficial de design para produtos digitais da Oficina Brasil:
tokens de marca, assets (logo, ícones) e componentes React + TypeScript,
construídos a partir do guia de marca oficial.

## Instalação

Distribuído via [GitHub Packages](https://npm.pkg.github.com) (registry
privado, não npm público), sob o escopo `@oficinabrasilgrowth`.

Crie um `.npmrc` no seu projeto apontando o escopo pro registry certo:

```
@oficinabrasilgrowth:registry=https://npm.pkg.github.com
```

Autentique com um token do GitHub com permissão `read:packages` (e
`repo`, se o repositório for privado) — veja a
[documentação oficial do GitHub Packages para npm](https://docs.github.com/pt/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).
Depois, instale normalmente:

```bash
npm install @oficinabrasilgrowth/oficina-brasil-design-system
```

## Importação do CSS

O pacote distribui seu próprio CSS compilado, incluindo tokens de cor,
radius e a fonte da marca. Importe uma única vez no ponto de entrada da
aplicação:

```js
import '@oficinabrasilgrowth/oficina-brasil-design-system/styles.css'
```

## Uso básico

```jsx
import { Button } from '@oficinabrasilgrowth/oficina-brasil-design-system'

function Exemplo() {
  return <Button variant="primary">Continuar</Button>
}
```

## Imports por componente

Cada componente também pode ser importado individualmente pelo próprio
subcaminho, útil para não trazer dependências de componentes que você
não usa (ex: gráficos):

```jsx
import { Badge } from '@oficinabrasilgrowth/oficina-brasil-design-system/badge'
```

## Componentes

Accordion, AdminPageHeader, Alert, AlertDialog, Avatar, AvatarGroup,
Badge, BarChart, BrandSelect, Breadcrumb, Button, ChartCard, Checkbox,
CommandPalette, Considerations, CopyButton, DataTable, DatePicker,
DropdownMenu, EmptyState, FileUploadButton, FilterBar, IconButton,
InfoTooltip, Input, KpiCard, Label, LineChart, Modal, MultiSelect,
Pagination, Popover, ProgressBar, ProgressRing, RadioGroup, Skeleton,
Slider, StatComparison, Switch, Tabs, Textarea, Toast, Tooltip,
TreeView, VisuallyHiddenInput.

A documentação de cada componente — exemplo funcional, variantes,
props, comportamento de teclado e notas de acessibilidade — está no
[Style Guide](#documentação--style-guide).

## Tokens / Foundations

Cores, radius e demais fundamentos são expostos como tokens CSS
semânticos (`var(--primary)`, `var(--foreground)`, `var(--border)`,
etc.), documentados na página **Tokens de design** do Style Guide.
Componentes usam esses tokens semânticos como base.

## Tema suportado

**Tema oficial: Light.** Todos os componentes são validados e
aprovados no tema claro.

## Acessibilidade

Componentes seguem os padrões WAI-ARIA para seu respectivo papel
(dialog, listbox, combobox, menu, etc.), com navegação por teclado e
gestão de foco correspondente. A biblioteca é auditada com testes
automatizados de acessibilidade (axe-core) e testes funcionais de
navegação por teclado.

**Known limitations**: nenhum componente foi validado com leitor de
tela real (VoiceOver/NVDA) — a auditoria de acessibilidade atual é
automatizada (axe-core) e por simulação de teclado. Recomendamos
validação manual com leitor de tela real antes de uso em fluxos
críticos de acessibilidade.

## Compatibilidade / peerDependencies

```
react: ^19.2.8
react-dom: ^19.2.8
recharts: ^2.12.7   (apenas para LineChart/BarChart)
node: >=20.9.0
```

## Documentação / Style Guide

O catálogo navegável de tokens e componentes, com exemplos ao vivo,
fica disponível rodando o projeto localmente e acessando
`/style-guides`.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra `http://localhost:3000/style-guides`.

### Validação

```bash
npm run typecheck      # tipos do app e do que ele importa
npm run typecheck:lib  # tipos de todos os componentes da biblioteca
npm run test:functional # comportamento e acessibilidade (light mode)
npm run test:visual     # regressão visual (screenshot comparado)
npm run verify:lib      # integridade do build da biblioteca
npm run verify:pack     # conteúdo real do tarball de publicação
```

O pacote é validado por testes funcionais, regressão visual, auditoria
de acessibilidade automatizada e typecheck (incluindo um typecheck
dedicado da biblioteca, cobrindo todos os componentes independente de
serem usados pelo app de documentação). Consulte a saída de cada
comando para os resultados atuais — os números mudam conforme a suíte
evolui.

## Contribuição

Ao adicionar ou alterar um componente: confira se já existe algo
parecido, aplique os tokens e regras de contraste já definidos, e
valide com `npm run typecheck`, `npm run typecheck:lib` e os testes
antes de abrir a mudança.

## Licença

Proprietária/fechada (`UNLICENSED`) — ver [`LICENSE`](./LICENSE) na
raiz do repositório. Uso restrito a projetos e equipes autorizados
internamente. A fonte Figtree, distribuída junto do pacote, é
licenciada separadamente sob a [SIL Open Font License 1.1](./licenses/FIGTREE-OFL.txt)
— essa parte específica permanece livre pra uso conforme a OFL, mesmo
com o restante do pacote sendo proprietário.
