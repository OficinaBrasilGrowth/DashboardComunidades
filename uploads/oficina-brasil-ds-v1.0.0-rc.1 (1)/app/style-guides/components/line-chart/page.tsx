import { LineChart } from '@/components/line-chart'
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
        <h1 className="text-2xl font-bold mb-2">LineChart</h1>
        <p className="text-sm text-muted-foreground">
          Primeira integração real de gráfico do design system — antes só
          existia o <a href="/style-guides/components/chart-card" className="underline">ChartCard</a>{' '}
          (a moldura), nenhum componente desenhava um gráfico de fato. Usa
          Recharts por baixo, com as cores vindas de{' '}
          <code>var(--chart-1)</code> a <code>var(--chart-5)</code> — tokens
          que já existiam em <code>globals.css</code> desde o início do
          projeto, mas nunca tinham sido usados em lugar nenhum. Confirmado
          com Chrome real que a cor computada da linha é exatamente{' '}
          <code>#18328A</code> (azul), não uma cor padrão do Recharts.
        </p>
      </div>

      <ChartCard title="Receita vs Custo">
        <LineChart
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
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface LineChartSeries {
  key: string
  label: string
}

interface LineChartProps {
  data: Record<string, string | number>[]
  categoryKey: string       // qual campo de "data" vai no eixo X
  series: LineChartSeries[] // cada item vira uma linha, com a próxima cor da paleta
  height?: number           // padrão 280
}`}</pre>
      </div>
    </div>
  )
}
