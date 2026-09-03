import { StatComparison } from '@/components/stat-comparison'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">StatComparison</h1>
        <p className="text-sm text-muted-foreground">
          Card de métrica comparando com um período anterior. A cor
          "positiva" é turquesa, não verde — o guia reserva verde pro
          destaque do wordmark ("uso comedido"), e esse indicador tende a
          aparecer com bastante frequência em qualquer dashboard.{' '}
          <code>positiveDirection</code> existe porque nem toda alta é uma
          coisa boa: receita subindo é positivo, mas custo subindo não é —
          o componente não assume isso sozinho, quem usa decide.
        </p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div style={{ width: 200 }}>
          <StatComparison title="Receita" value="R$ 42.180" changePercent={12.4} />
        </div>
        <div style={{ width: 200 }}>
          <StatComparison title="Custo" value="R$ 8.920" changePercent={7.1} positiveDirection="down" />
        </div>
        <div style={{ width: 200 }}>
          <StatComparison title="Sem mudança" value="120" changePercent={0} />
        </div>
      </div>

      <div className="text-xs text-muted-foreground border-l-4 border-amber-400 pl-4">
        Repare: "Receita" e "Custo" mostram a mesma seta pra cima (ambos os
        valores subiram de verdade), mas cores diferentes — turquesa pra
        Receita (subir é bom) e vermelho pra Custo (subir é ruim, já que{' '}
        <code>positiveDirection="down"</code>).
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface StatComparisonProps {
  title: string
  value: string | number
  previousLabel?: string          // padrão 'vs período anterior'
  changePercent: number           // pode ser negativo
  positiveDirection?: 'up' | 'down'  // padrão 'up'
}`}</pre>
      </div>
    </div>
  )
}
