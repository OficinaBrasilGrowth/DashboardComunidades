# Integração — Oficina Brasil Design System

Como instalar e consumir o pacote num projeto real.

## Instalação

Distribuído via [GitHub Packages](https://npm.pkg.github.com), sob o
escopo `@oficinabrasilgrowth`.

Crie um `.npmrc` no projeto consumidor apontando o escopo pro registry:

```
@oficinabrasilgrowth:registry=https://npm.pkg.github.com
```

Autentique com um token do GitHub com permissão `read:packages` (e
`repo`, se o repositório for privado). Depois, instale normalmente:

```bash
npm install @oficinabrasilgrowth/oficina-brasil-design-system
```

## peerDependencies

O pacote não embute React nem Recharts — precisam estar instalados no
projeto consumidor:

```
react: ^19.2.8
react-dom: ^19.2.8
recharts: ^2.12.7   (necessário só se usar LineChart ou BarChart)
```

`node >= 20.9.0`.

## Importar o CSS

O pacote distribui seu próprio CSS compilado (tokens de cor, radius,
fonte da marca). Importe **uma única vez** no ponto de entrada da
aplicação:

```js
import '@oficinabrasilgrowth/oficina-brasil-design-system/styles.css'
```

Sem esse import, os componentes renderizam mas as variáveis CSS não
resolvem.

## Árvore de imports públicos

Import do ponto de entrada principal:

```jsx
import { Button, Badge } from '@oficinabrasilgrowth/oficina-brasil-design-system'
```

Ou por componente individual — útil pra não trazer dependências de
componentes que você não usa (ex: o Recharts, usado só por
`LineChart`/`BarChart`):

```jsx
import { Button } from '@oficinabrasilgrowth/oficina-brasil-design-system/button'
```

## Exemplo mínimo de uso

```jsx
import '@oficinabrasilgrowth/oficina-brasil-design-system/styles.css'
import { Button } from '@oficinabrasilgrowth/oficina-brasil-design-system'

export default function App() {
  return <Button variant="primary">Continuar</Button>
}
```

## Tokens de marca

Se o projeto consumidor precisar customizar ou estender os tokens de
cor, consulte a página **Tokens de design** no Style Guide — os
componentes usam tokens semânticos (`var(--primary)`, etc.) como base.
