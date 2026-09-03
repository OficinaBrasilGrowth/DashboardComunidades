// Gera index.ts e o `exports` do package.json a partir da MESMA fonte que
// tsup.config.ts já usa (readdirSync de components/*.tsx), em vez de
// manter isso como lista escrita à mão em 2 lugares diferentes.
//
// Causa raiz corrigida aqui: até essa correção, o tsup builda qualquer
// componente novo automaticamente (readdirSync), mas o index.ts e o
// package.json exports eram digitados manualmente uma vez e nunca mais
// atualizados — resultado real encontrado por revisão externa: 11 dos 44
// componentes existentes (Accordion, AlertDialog, Avatar, AvatarGroup,
// Breadcrumb, CommandPalette, MultiSelect, Popover, Slider, Tooltip,
// TreeView) nunca tinham sido exportados publicamente, mesmo já existindo
// como arquivo real em dist/ depois do build.
//
// Rode com `node scripts/generate-exports.js` pra escrever os arquivos, ou
// `node scripts/generate-exports.js --check` pra só validar se estão em
// dia sem escrever nada (usado por verify-lib-build.js).

const fs = require('fs')
const path = require('path')

const COMPONENTS_DIR = path.join(__dirname, '..', 'components')
const INDEX_PATH = path.join(__dirname, '..', 'index.ts')
const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json')

function getComponentNames() {
  return fs
    .readdirSync(COMPONENTS_DIR)
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => f.replace(/\.tsx$/, ''))
    .sort()
}

function buildIndexContent(names) {
  const exportLines = names.map((name) => `export * from './components/${name}'`).join('\n')
  return `// GERADO AUTOMATICAMENTE — não edite à mão.
// Rode \`npm run generate:exports\` depois de adicionar/remover um
// componente.
//
// Barrel de conveniência — permite 'import { Badge } from "@oficinabrasilgrowth/oficina-brasil-design-system"'
// em vez de 'import { Badge } from "@oficinabrasilgrowth/oficina-brasil-design-system/badge"'.
//
// Para quem se importa com tree-shaking granular (ex: uma tela que só usa
// Badge não deveria trazer o Recharts junto por causa do LineChart/
// BarChart), prefira os imports de subcaminho — cada componente é um
// entry point próprio no build. Este barrel existe só por conveniência.

${exportLines}
`
}

function buildExportsMap(names) {
  const exportsMap = {
    '.': {
      types: './dist/index.d.ts',
      import: './dist/index.mjs',
      require: './dist/index.js',
    },
    // CSS distribuído junto com o pacote — gerado por `npm run build:css`,
    // não pelo tsup. Precisa estar aqui, não só no package.json manualmente,
    // senão a próxima regeneração automática apaga essa entrada sem querer (esse
    // exato bug foi encontrado e corrigido nesta mesma sessão, antes de
    // rodar pela primeira vez).
    './styles.css': './dist/styles.css',
  }
  for (const name of names) {
    exportsMap[`./${name}`] = {
      types: `./dist/${name}.d.ts`,
      import: `./dist/${name}.mjs`,
      require: `./dist/${name}.js`,
    }
  }
  return exportsMap
}

function main() {
  const checkOnly = process.argv.includes('--check')
  const names = getComponentNames()

  const newIndexContent = buildIndexContent(names)
  const currentIndexContent = fs.existsSync(INDEX_PATH) ? fs.readFileSync(INDEX_PATH, 'utf-8') : null

  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8'))
  const newExportsMap = buildExportsMap(names)
  const currentExportsJson = JSON.stringify(pkg.exports)
  const newExportsJson = JSON.stringify(newExportsMap)

  const indexInSync = currentIndexContent === newIndexContent
  const exportsInSync = currentExportsJson === newExportsJson

  if (checkOnly) {
    if (indexInSync && exportsInSync) {
      console.log(`✓ index.ts e package.json exports em dia (${names.length} componentes)`)
      process.exit(0)
    }
    if (!indexInSync) console.error('✗ index.ts está desatualizado — rode `npm run generate:exports`')
    if (!exportsInSync) console.error('✗ package.json exports está desatualizado — rode `npm run generate:exports`')
    process.exit(1)
  }

  fs.writeFileSync(INDEX_PATH, newIndexContent)
  pkg.exports = newExportsMap
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2) + '\n')
  console.log(`✓ index.ts e package.json exports gerados (${names.length} componentes)`)
}

main()
