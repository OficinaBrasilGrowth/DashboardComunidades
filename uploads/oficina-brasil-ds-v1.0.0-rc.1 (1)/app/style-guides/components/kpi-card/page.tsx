import { KpiCard } from '@/components/kpi-card'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">KpiCard</h1>
        <p className="text-sm text-muted-foreground">
          Card de estatística/métrica com selo de ícone colorido opcional. As
          cores do selo de ícone sempre são pareadas com a cor de texto
          aprovada por contraste (selo verde nunca recebe ícone branco — ver
          contrast-rules.ts).
        </p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <KpiCard title="Respostas totais" value="1.284" subtitle="+12% vs período anterior" icon={<span>↗</span>} iconColor="green" />
        <KpiCard title="Taxa de conversão" value="24%" icon={<span>%</span>} iconColor="blue" />
        <KpiCard title="Tempo médio" value="3m 12s" iconColor="turquoise" icon={<span>⏱</span>} />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  iconColor?: 'blue' | 'green' | 'turquoise'  // default 'green'
}`}</pre>
      </div>
    </div>
  )
}
