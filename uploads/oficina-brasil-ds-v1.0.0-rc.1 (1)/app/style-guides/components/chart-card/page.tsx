import { ChartCard } from '@/components/chart-card'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">ChartCard</h1>
        <p className="text-sm text-muted-foreground">
          Moldura padrão para qualquer gráfico — o card só padroniza borda,
          radius, sombra e cabeçalho. Traga sua própria biblioteca de
          gráficos (Chart.js, Recharts, etc.) para o conteúdo interno.
        </p>
      </div>

      <ChartCard title="Acessos por dia">
        <div style={{ height: 120, background: 'var(--muted)', borderRadius: 8 }} />
      </ChartCard>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface ChartCardProps {
  title: string
  children: ReactNode
}`}</pre>
      </div>
    </div>
  )
}
