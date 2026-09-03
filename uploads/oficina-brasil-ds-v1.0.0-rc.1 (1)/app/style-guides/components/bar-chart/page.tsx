import { BarChart } from '@/components/bar-chart'
import { ChartCard } from '@/components/chart-card'

const data = [
  { mes: 'Jan', receita: 4000, custo: 2400 },
  { mes: 'Fev', receita: 3000, custo: 1398 },
  { mes: 'Mar', receita: 5000, custo: 3800 },
  { mes: 'Abr', receita: 4780, custo: 2908 },
]

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">BarChart</h1>
        <p className="text-sm text-muted-foreground">
          Mesma paleta e mesma lógica de cor do{' '}
          <a href="/style-guides/components/line-chart" className="underline">LineChart</a> —
          ver aquela página pra detalhes de por que <code>var(--chart-N)</code>{' '}
          funciona direto nos atributos SVG do Recharts, sem precisar ler o
          valor computado via JavaScript.
        </p>
      </div>

      <ChartCard title="Receita vs Custo">
        <BarChart
          data={data}
          categoryKey="mes"
          series={[
            { key: 'receita', label: 'Receita' },
            { key: 'custo', label: 'Custo' },
          ]}
          isAnimationActive={false}
        />
      </ChartCard>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface BarChartSeries {
  key: string
  label: string
}

interface BarChartProps {
  data: Record<string, string | number>[]
  categoryKey: string      // qual campo de "data" vai no eixo X
  series: BarChartSeries[] // cada item vira uma série de barras, com a próxima cor da paleta
  height?: number          // padrão 280
}`}</pre>
      </div>
    </div>
  )
}
