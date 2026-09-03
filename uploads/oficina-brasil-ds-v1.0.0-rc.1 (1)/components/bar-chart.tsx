'use client'

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Mesma paleta e mesma lógica de cor do LineChart — ver line-chart.tsx pra
// detalhes de por que var(--chart-N) funciona direto nos atributos SVG.

const CHART_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

export interface BarChartSeries {
  key: string
  label: string
}

export interface BarChartProps {
  data: Record<string, string | number>[]
  categoryKey: string
  series: BarChartSeries[]
  height?: number
  // Ver line-chart.tsx pro raciocínio completo (tabela de dados
  // associada, alternativa a depender só do tooltip no hover).
  title?: string
  // Ver line-chart.tsx pra detalhes — animação de entrada do Recharts
  // pode deixar a regressão visual instável.
  isAnimationActive?: boolean
}

export function BarChart({ data, categoryKey, series, height = 280, title, isAnimationActive = true }: BarChartProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey={categoryKey} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'var(--muted)' }}
            contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: 8, fontSize: 13 }}
            labelStyle={{ color: 'var(--popover-foreground)' }}
          />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s, i) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} isAnimationActive={isAnimationActive} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
      <table className="sr-only">
        <caption>{title ?? 'Dados do gráfico'}</caption>
        <thead>
          <tr>
            <th scope="col">{categoryKey}</th>
            {series.map((s) => <th key={s.key} scope="col">{s.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <th scope="row">{row[categoryKey]}</th>
              {series.map((s) => <td key={s.key}>{row[s.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
