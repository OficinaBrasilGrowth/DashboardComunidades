// lib/tokens.ts é a fonte única de verdade pra cores primitivas — todo
// hex usado em globals.css ou nos componentes precisa ter uma primitiva
// correspondente registrada aqui, não repetido manualmente.
//
// Não regera o globals.css inteiro automaticamente (é um arquivo denso em
// comentários explicando POR QUE cada cor foi escolhida — regenerar isso
// arriscaria perder esse contexto). Em vez disso, verifica que todo hex
// usado no CSS tem uma primitiva correspondente em tokens.ts — pega
// drift futuro (alguém adiciona uma cor nova direto no CSS sem registrar
// aqui) sem precisar de codegen completo.

const fs = require('fs')
const path = require('path')

const tokensPath = path.join(__dirname, '..', 'lib', 'tokens.ts')
const globalsCssPath = path.join(__dirname, '..', 'app', 'globals.css')
const componentsDir = path.join(__dirname, '..', 'components')

let failed = false

function check(description, condition) {
  if (condition) {
    console.log(`✓ ${description}`)
  } else {
    console.error(`✗ ${description}`)
    failed = true
  }
}

// Extrai todo valor hex de 6 dígitos declarado dentro de tokens.ts —
// não interpreta o TS de verdade, só varre por literais de string hex,
// suficiente pra essa checagem.
const tokensContent = fs.readFileSync(tokensPath, 'utf-8')
const tokenHexValues = new Set(
  (tokensContent.match(/#[0-9A-Fa-f]{6}/g) || []).map((h) => h.toUpperCase())
)

// Extrai todo valor hex usado em globals.css.
const cssContent = fs.readFileSync(globalsCssPath, 'utf-8')
const cssHexValues = new Set((cssContent.match(/#[0-9A-Fa-f]{6}/g) || []).map((h) => h.toUpperCase()))

const semPrimitivaCss = [...cssHexValues].filter((hex) => !tokenHexValues.has(hex))

check(
  `todos os ${cssHexValues.size} valores hex usados em globals.css têm primitiva correspondente em lib/tokens.ts`,
  semPrimitivaCss.length === 0
)
if (semPrimitivaCss.length > 0) {
  console.error(`  sem primitiva registrada: ${semPrimitivaCss.join(', ')}`)
  console.error('  adicione a cor em lib/tokens.ts antes de usar em globals.css')
}

// Mesma checagem pros componentes — achado real de revisão externa: 21
// arquivos de componente têm hex direto no código. Nem todo hex precisa
// virar import de tokens.ts (às vezes um valor fixo é a escolha certa —
// ver comentários em badge.tsx sobre fundo sólido de botão), mas TODO
// valor usado precisa pelo menos ter uma primitiva registrada em algum
// lugar central, não ser inventado ali na hora.
// Remove comentários de linha (//...) antes de escanear por hex — evita
// falso positivo de uma cor só MENCIONADA em texto explicativo (ex: "o
// padrão antigo usava #14142A, trocamos pra X") ser tratada como uso real
// que precisa de primitiva registrada.
function stripLineComments(code) {
  return code
    .split('\n')
    .map((line) => line.replace(/\/\/.*$/, ''))
    .join('\n')
}

const componentFiles = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.tsx'))
const hexPorArquivo = {}
for (const file of componentFiles) {
  const rawContent = fs.readFileSync(path.join(componentsDir, file), 'utf-8')
  const content = stripLineComments(rawContent)
  const hexes = (content.match(/#[0-9A-Fa-f]{6}/g) || []).map((h) => h.toUpperCase())
  const semPrimitiva = hexes.filter((hex) => !tokenHexValues.has(hex))
  if (semPrimitiva.length > 0) {
    hexPorArquivo[file] = [...new Set(semPrimitiva)]
  }
}

const totalSemPrimitiva = Object.keys(hexPorArquivo).length
check(
  `nenhum componente usa cor hex sem primitiva registrada em lib/tokens.ts`,
  totalSemPrimitiva === 0
)
if (totalSemPrimitiva > 0) {
  for (const [file, hexes] of Object.entries(hexPorArquivo)) {
    console.error(`  ${file}: ${hexes.join(', ')}`)
  }
}

// O guardrail precisa cobrir rgb()/rgba()/hsl()/hsla()/oklch() além de
// hex — cor hardcoded pode se esconder em qualquer uma dessas sintaxes,
// não só hex literal, mesmo em componentes que já "parecem" limpos.
// Sem essa checagem, seria possível confirmar "0 hex hardcoded" e ainda
// ter cor solta escondida em outra sintaxe.
const colorFunctionPattern = /\b(rgb|rgba|hsl|hsla|oklch)\([^)]*\)/g
const semTokenPorArquivo = {}
for (const file of componentFiles) {
  const rawContent = fs.readFileSync(path.join(componentsDir, file), 'utf-8')
  const content = stripLineComments(rawContent)
  const matches = content.match(colorFunctionPattern) || []
  if (matches.length > 0) {
    semTokenPorArquivo[file] = [...new Set(matches)]
  }
}
const totalComFuncaoDeCor = Object.keys(semTokenPorArquivo).length
check(
  'nenhum componente usa rgb()/rgba()/hsl()/hsla()/oklch() cru (2F) — deve referenciar var(--shadow-*)/var(--focus-ring-*) etc.',
  totalComFuncaoDeCor === 0
)
if (totalComFuncaoDeCor > 0) {
  for (const [file, matches] of Object.entries(semTokenPorArquivo)) {
    console.error(`  ${file}: ${matches.join(', ')}`)
  }
}

if (failed) {
  console.error('\nVerificação de fonte única de tokens falhou.')
  process.exit(1)
} else {
  console.log('\nToda cor utilizada possui uma primitiva registrada — isso NÃO significa fonte única de verdade completa (componentes ainda podem usar hex literal em vez de referenciar a primitiva por nome).')
}
