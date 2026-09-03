// O CSS distribuído (dist/styles.css) usa var(--font-figtree, 'Figtree')
// como font-family. Essa variável só existe dentro DESTE app Next.js
// (gerada pelo next/font/local em app/layout.tsx) — um consumidor externo
// da biblioteca não tem next/font, então cairia no fallback 'Figtree'
// literal, que não resolveria pra nenhuma fonte real instalada.
//
// Esse script roda depois do `tailwindcss` (ver build:css no
// package.json): copia o arquivo real da fonte pra dist/fonts/ e
// acrescenta um @font-face portável (caminho relativo) no início do CSS
// gerado — funciona quando um bundler real (Vite, webpack) processa o
// dist/styles.css de dentro de node_modules/, resolvendo o url()
// relativo corretamente. Testado de verdade com um consumidor Vite
// sem next/font, não só assumido que bundlers resolvem isso.

const fs = require('fs')
const path = require('path')

const distDir = path.join(__dirname, '..', 'dist')
const distFontsDir = path.join(distDir, 'fonts')
const sourceFontPath = path.join(__dirname, '..', 'public', 'fonts', 'Figtree-Variable.ttf')
const sourceLicensePath = path.join(__dirname, '..', 'licenses', 'FIGTREE-OFL.txt')
const stylesPath = path.join(distDir, 'styles.css')

fs.mkdirSync(distFontsDir, { recursive: true })
fs.copyFileSync(sourceFontPath, path.join(distFontsDir, 'Figtree-Variable.ttf'))
// A OFL exige que a licença acompanhe a fonte redistribuída — copiada
// junto com o binário dentro do próprio pacote publicado, não só na
// pasta licenses/ do repositório fonte (que não vai pro pacote).
fs.copyFileSync(sourceLicensePath, path.join(distFontsDir, 'OFL.txt'))

const fontFaceBlock = `/* @font-face portável — funciona sem next/font, pra qualquer consumidor
   da biblioteca. Gerado por scripts/append-font-face.js. */
@font-face {
  font-family: 'Figtree';
  src: url('./fonts/Figtree-Variable.ttf') format('truetype-variations');
  font-weight: 300 900;
  font-display: swap;
}

`

const currentCss = fs.readFileSync(stylesPath, 'utf-8')
fs.writeFileSync(stylesPath, fontFaceBlock + currentCss)

console.log('✓ @font-face portável adicionado a dist/styles.css, fonte + licença OFL copiadas pra dist/fonts/')
