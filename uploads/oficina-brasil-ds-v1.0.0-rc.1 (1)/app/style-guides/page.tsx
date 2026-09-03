import { colors, neutrals } from '@/lib/tokens'
import { contrastTable } from '@/lib/contrast-rules'

const colorLabels: Record<keyof typeof colors, string> = {
  azul: 'Azul',
  azulEscuro: 'Azul escuro',
  verde: 'Verde',
  turquesa: 'Turquesa',
  azulClaro: 'Azul claro',
}

export default function StyleGuidesPage() {
  return (
    <div className="flex flex-col gap-12 max-w-4xl">
      <section className="pb-8 border-b" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-3xl font-bold mb-3">Oficina Brasil Design System</h1>
        <p className="text-muted-foreground max-w-2xl">
          Sistema oficial de design pra produtos digitais da Oficina Brasil:
          tokens de marca, componentes React + TypeScript, e a documentação
          viva de tudo isso — o que você está vendo agora.
        </p>
        <div className="flex flex-wrap gap-3 mt-5">
          <a
            href="/style-guides/components/button"
            className="rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            Ver componentes
          </a>
          <a
            href="#cores-da-marca"
            className="rounded-lg px-4 py-2 text-sm font-semibold border"
            style={{ borderColor: 'var(--border)' }}
          >
            Tokens de design
          </a>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Instruções de instalação e uso em outro projeto: veja{' '}
          <code>INTEGRATION.md</code> na raiz do repositório.
        </p>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
          <div className="rounded-lg border p-4" style={{ borderColor: 'var(--border)' }}>
            <dt className="font-semibold mb-1">Tema oficial</dt>
            <dd className="text-muted-foreground">
              Light. Todo componente é validado e aprovado no tema claro.
            </dd>
          </div>
          <div className="rounded-lg border p-4" style={{ borderColor: 'var(--border)' }}>
            <dt className="font-semibold mb-1">Acessibilidade</dt>
            <dd className="text-muted-foreground">
              Padrões WAI-ARIA, navegação por teclado, e auditoria
              automatizada (axe-core) em todos os componentes.
            </dd>
          </div>
        </dl>
      </section>

      <section id="cores-da-marca">
        <h2 className="text-lg font-semibold mb-1">Cores da marca</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Cada cor abaixo é copiada verbatim do guia de marca oficial da
          Oficina Brasil.
        </p>
        {/* Escala de colunas responsiva: 5 colunas fixas colidiam em
            viewport estreito (nome e hex sobrepostos). */}
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {(Object.keys(colors) as (keyof typeof colors)[]).map((key) => (
            <div key={key}>
              <div
                className="h-16 rounded-lg border"
                style={{ backgroundColor: colors[key] }}
              />
              <p className="text-sm font-semibold mt-2">{colorLabels[key]}</p>
              <p className="text-xs text-muted-foreground">{colors[key]}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          Combinações aprovadas (guia de marca, página 48)
        </h2>
        {/* Wrapper com scroll horizontal próprio — a tabela não depende
            do conteúdo se ajustar à largura da tela em viewport estreito. */}
        <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Fundo</th>
              <th className="py-2">Sempre aprovado</th>
              <th className="py-2">Só texto grande</th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(contrastTable) as (keyof typeof contrastTable)[]).map((bg) => (
              <tr key={bg} className="border-b">
                <td className="py-2 font-medium">{colorLabels[bg]}</td>
                <td className="py-2">{contrastTable[bg].always.join(', ') || '—'}</td>
                <td className="py-2">{contrastTable[bg].largeOnly.join(', ') || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Tipografia — Figtree</h2>
        <p className="text-3xl font-bold" style={{ color: colors.azulEscuro }}>
          Título com destaque
        </p>
        <p className="text-base mt-2" style={{ color: colors.azulEscuro }}>
          Texto de parágrafo em Figtree Regular, seguindo a recomendação do
          guia de evitar os pesos extremos Light e Black.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Componentes de demonstração</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <button
            className="rounded-lg px-5 py-2 text-sm font-semibold"
            style={{ backgroundColor: colors.azul, color: neutrals.white }}
          >
            Botão primário
          </button>
          {/* fundo verde combina com texto azulEscuro, nunca branco — ver contrast-rules.ts */}
          <button
            className="rounded-lg px-5 py-2 text-sm font-semibold"
            style={{ backgroundColor: colors.verde, color: colors.azulEscuro }}
          >
            Botão destaque
          </button>
        </div>
      </section>
    </div>
  )
}
