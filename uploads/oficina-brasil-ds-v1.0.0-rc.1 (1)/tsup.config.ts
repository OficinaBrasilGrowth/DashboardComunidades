import { defineConfig } from 'tsup'
import { readdirSync } from 'fs'

// Fase 6 do ROADMAP.md — base técnica de pacote real, sem decidir ainda
// COMO isso vai ser consumido (npm privado, workspace de monorepo, ou
// outra coisa — decisão de infraestrutura do time, não técnica, deixada
// em aberto de propósito). O que isso resolve independente dessa decisão:
// hoje o MIGRATION.md manda copiar a pasta components/ inteira; depois
// deste build existir, dá pra apontar qualquer estratégia de consumo pra
// cá em vez de copiar arquivos.
//
// Um entry point por componente (não um bundle único) é o que resolve de
// quebra o problema do bundle do Recharts mencionado no roadmap: hoje,
// como só existe app/style-guides (Next.js, não uma lib), importar
// qualquer coisa efetivamente carrega o projeto inteiro. Com entries
// separados, importar só Badge não traz o LineChart/BarChart (e o
// Recharts que eles dependem) junto — testado de verdade depois do build,
// não só assumido.
const componentEntries = readdirSync('./components')
  .filter((f) => f.endsWith('.tsx'))
  .reduce<Record<string, string>>((acc, file) => {
    const name = file.replace(/\.tsx$/, '')
    acc[name] = `./components/${file}`
    return acc
  }, {})

export default defineConfig({
  tsconfig: './tsconfig.lib.json',
  entry: {
    index: './index.ts',
    ...componentEntries,
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false, // cada entry fica auto-contido — ver comentário acima sobre o motivo
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'recharts'],
})
