// Verifica de verdade — não só assume — que o build por entry point
// resolve o problema do bundle do Recharts: importar Badge não deveria
// trazer o Recharts junto, já que Badge não depende dele. Roda depois
// do `tsup` (ver package.json, script "verify:lib") e falha o processo
// (exit code 1) se isso parar de ser verdade no futuro.
//
// Também verifica que todo arquivo REALMENTE construído em dist/ tem uma
// entrada correspondente no
// package.json > exports — não só que os arquivos-fonte concordam entre
// si (isso já é checado por generate-exports.js --check), mas que o
// pacote publicado de verdade bateria com o que foi prometido. Essa foi
// a causa raiz do achado da revisão externa: 11 componentes existiam em
// dist/ e nunca apareciam em exports.

const fs = require('fs')
const path = require('path')

const distDir = path.join(__dirname, '..', 'dist')
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'))

function readDist(file) {
  return fs.readFileSync(path.join(distDir, file), 'utf-8')
}

let failed = false

function check(description, condition) {
  if (condition) {
    console.log(`✓ ${description}`)
  } else {
    console.error(`✗ ${description}`)
    failed = true
  }
}

const badge = readDist('badge.js')
check(
  'badge.js não referencia recharts (Badge não depende dele)',
  !badge.includes('recharts')
)

const lineChart = readDist('line-chart.js')
check(
  'line-chart.js referencia recharts como dependência externa (require), não embutida',
  lineChart.includes('require("recharts")') || lineChart.includes("require('recharts')")
)

const checkboxJs = readDist('checkbox.js')
check(
  'checkbox.js preserva "use client" (necessário pra consumidores Next.js App Router)',
  checkboxJs.includes('"use client"')
)

const badgeJs = readDist('badge.js')
check(
  'badge.js NÃO tem "use client" (é um componente puramente estático, não deveria ganhar a diretiva à toa)',
  !badgeJs.includes('"use client"')
)

// Todo .js real em dist/ (exceto index.js, o barrel) precisa ter
// uma entrada em package.json > exports.
const distJsFiles = fs
  .readdirSync(distDir)
  .filter((f) => f.endsWith('.js') && !f.endsWith('.d.ts'))
  .map((f) => f.replace(/\.js$/, ''))
  .filter((name) => name !== 'index')

const exportedNames = Object.keys(pkg.exports)
  .filter((e) => e !== '.' && e !== './styles.css')
  .map((e) => e.replace(/^\.\//, ''))

const semExport = distJsFiles.filter((name) => !exportedNames.includes(name))
check(
  `todos os ${distJsFiles.length} componentes construídos em dist/ têm entrada em package.json > exports`,
  semExport.length === 0
)
if (semExport.length > 0) {
  console.error(`  faltando: ${semExport.join(', ')}`)
}

// O CSS do design system precisa ser distribuído junto com o pacote —
// confirmado com um consumidor real (npm pack + projeto Vite do zero)
// que sem isso as variáveis CSS apareciam sem resolver no navegador.
// Verificado aqui pra não regredir silenciosamente.
const stylesPath = path.join(distDir, 'styles.css')
const stylesExist = fs.existsSync(stylesPath)
check('dist/styles.css existe (CSS distribuído junto com o pacote)', stylesExist)

if (stylesExist) {
  const stylesContent = fs.readFileSync(stylesPath, 'utf-8')
  check('dist/styles.css contém os tokens de light mode (--foreground)', stylesContent.includes('--foreground'))
  check('dist/styles.css contém o bloco de dark mode (.dark)', stylesContent.includes('.dark'))
  check('dist/styles.css contém o estilo do thumb do Slider (.ds-slider)', stylesContent.includes('ds-slider'))
}

check(
  'package.json > exports inclui "./styles.css"',
  pkg.exports['./styles.css'] === './dist/styles.css'
)

// A fonte Figtree precisa funcionar pra qualquer consumidor da
// biblioteca, não só dentro deste app Next.js (onde next/font/local
// cuida disso automaticamente). Achado real testando com um consumidor
// Vite sem next/font: var(--font-figtree) sem fallback
// interno tornava a declaração INTEIRA de font-family inválida, e mesmo
// corrigindo isso, o nome literal 'Figtree' não resolvia pra nenhuma
// fonte real sem um @font-face de verdade também presente no CSS
// distribuído.
const fontFacePath = path.join(distDir, 'fonts', 'Figtree-Variable.ttf')
check('dist/fonts/Figtree-Variable.ttf existe (fonte real copiada pro pacote)', fs.existsSync(fontFacePath))
if (stylesExist) {
  const stylesContent = fs.readFileSync(stylesPath, 'utf-8')
  check(
    'dist/styles.css contém um @font-face portável (funciona sem next/font)',
    stylesContent.includes('@font-face') && stylesContent.includes("url('./fonts/Figtree-Variable.ttf')")
  )
}

if (failed) {
  console.error('\nVerificação do build da biblioteca falhou — o build não está se comportando como esperado.')
  process.exit(1)
} else {
  console.log('\nTodas as verificações do build da biblioteca passaram.')
}
