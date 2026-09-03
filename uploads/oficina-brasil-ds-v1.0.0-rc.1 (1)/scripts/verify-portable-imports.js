// Garante que os componentes usam só imports relativos, nunca o alias
// @/ configurado neste projeto Next.js — um componente com import
// aliased quebraria num projeto consumidor real, que não
// necessariamente tem esse mesmo alias configurado. Este teste roda
// essa validação via Node puro (sem precisar de um projeto React
// completo), rápido o suficiente pra rodar no CI a cada mudança.

const fs = require('fs')
const path = require('path')

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

const componentFiles = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.tsx'))
const comAlias = []

for (const file of componentFiles) {
  const content = fs.readFileSync(path.join(componentsDir, file), 'utf-8')
  if (/from ['"]@\//.test(content)) {
    comAlias.push(file)
  }
}

check(
  `nenhum dos ${componentFiles.length} componentes usa o alias @/ internamente (garante que o build da biblioteca funciona independente de alias configurado)`,
  comAlias.length === 0
)
if (comAlias.length > 0) {
  console.error(`  usando alias @/: ${comAlias.join(', ')}`)
}

if (failed) {
  console.error('\nVerificação de portabilidade falhou — um import com alias @/ quebraria o build da biblioteca num ambiente sem esse alias configurado.')
  process.exit(1)
} else {
  console.log('\nComponentes portáveis — nenhuma dependência de alias configurado.')
}
