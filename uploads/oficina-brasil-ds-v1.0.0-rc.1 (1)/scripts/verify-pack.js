#!/usr/bin/env node
// Valida o conteúdo real do tarball que `npm pack`/`npm publish` gerariam
// — não confia que `dist/` existe ou está correto, confia no que o
// tarball de fato conteria. Roda via `npm pack --dry-run --json`, que
// não escreve nenhum arquivo em disco, só reporta a lista real.
//
// Fecha um bloqueador real de release: em checkout limpo, sem alguém
// lembrar de rodar `build:lib` manualmente antes de empacotar, o tarball
// sairia sem `dist/` (só os arquivos que o "files" do package.json
// aponta, se existirem em disco) — quebrando silenciosamente pra quem
// instalar. O `prepack` (ver package.json) já corrige a causa raiz
// automatizando o build antes do pack; este script é a confirmação
// depois, checando o resultado de verdade.

const { execSync } = require('child_process')
const path = require('path')

const raiz = path.join(__dirname, '..')

console.log('Rodando `npm pack --dry-run` pra inspecionar o tarball real...')
const saidaCompleta = execSync('npm pack --dry-run --json', { encoding: 'utf-8', cwd: raiz })
// Achado real ao escrever este script: `npm pack` dispara o prepack de
// verdade (build:lib + verify:lib) antes de listar os arquivos — exatamente
// o comportamento que este script existe pra confirmar. Mas isso mistura
// a saída de texto do build (tailwindcss, tsup, etc.) ANTES do JSON de
// verdade no mesmo stdout, quebrando um JSON.parse() ingênuo. Extrai só o
// array JSON real, procurando pelo primeiro `[` até o último `]`.
const inicioJson = saidaCompleta.indexOf('[')
const fimJson = saidaCompleta.lastIndexOf(']')
if (inicioJson === -1 || fimJson === -1) {
  throw new Error(`Não encontrei um array JSON na saída de "npm pack --dry-run --json":\n${saidaCompleta}`)
}
const saida = saidaCompleta.slice(inicioJson, fimJson + 1)
const [pacote] = JSON.parse(saida)
const caminhos = pacote.files.map((f) => f.path)

function existe(regex, descricao) {
  const achou = caminhos.some((c) => regex.test(c))
  console.log(achou ? `✓ ${descricao}` : `✗ ${descricao}`)
  return achou
}

let tudoOk = true

tudoOk = existe(/^dist\/index\.js$/, 'entry point principal (dist/index.js)') && tudoOk
tudoOk = existe(/^dist\/index\.mjs$/, 'entry point principal ESM (dist/index.mjs)') && tudoOk
tudoOk = existe(/^dist\/index\.d\.ts$/, 'tipos do entry point principal (dist/index.d.ts)') && tudoOk
tudoOk = existe(/^dist\/badge\.js$/, 'pelo menos um componente real construído (dist/badge.js, como amostra)') && tudoOk
tudoOk = existe(/^dist\/.*\.d\.ts$/, 'algum arquivo de tipos .d.ts em dist/') && tudoOk
tudoOk = existe(/^dist\/styles\.css$/, 'CSS distribuído (dist/styles.css)') && tudoOk
tudoOk = existe(/^dist\/fonts\/.*\.ttf$/, 'fonte real copiada (dist/fonts/*.ttf)') && tudoOk
tudoOk = existe(/^dist\/fonts\/OFL\.txt$/, 'licença da fonte copiada junto (dist/fonts/OFL.txt)') && tudoOk
tudoOk = existe(/^package\.json$/, 'package.json presente') && tudoOk
tudoOk = existe(/^README\.md$/, 'README.md presente') && tudoOk

// Confirma que TODOS os 46 componentes (não só a amostra do badge acima)
// realmente estão no tarball — não só que "algum" arquivo existe.
const distJsNoTarball = caminhos.filter((c) => /^dist\/[^/]+\.js$/.test(c) && c !== 'dist/index.js')
console.log(`  (${distJsNoTarball.length} componentes individuais encontrados em dist/*.js dentro do tarball)`)
if (distJsNoTarball.length < 40) {
  console.log(`✗ esperava pelo menos 40 componentes individuais em dist/, achou só ${distJsNoTarball.length} — build da lib pode estar incompleto`)
  tudoOk = false
}

console.log(`\nTotal de arquivos no tarball: ${caminhos.length}, tamanho empacotado: ${(pacote.size / 1024).toFixed(0)}kb`)

if (!tudoOk) {
  console.error('\nO tarball real está incompleto — algo essencial não seria publicado. Rode `npm run build:lib` e tente de novo.')
  process.exit(1)
}

console.log('\nTarball real contém tudo que é essencial pra instalação/uso.')
