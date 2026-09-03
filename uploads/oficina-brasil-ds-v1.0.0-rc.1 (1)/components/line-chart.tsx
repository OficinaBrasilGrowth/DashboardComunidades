'use client'

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Integração real de gráfico — antes disso só existia o ChartCard (a
// moldura), nenhum componente desenhava um gráfico de fato. Usa os tokens
// --chart-1 a --chart-5 do globals.css (já existiam desde o início do
// projeto, mas nunca tinham sido usados em lugar nenhum). As cores são
// passadas como var(--chart-N) direto nos atributos SVG do Recharts — os
// navegadores modernos resolvem CSS custom properties em atributos de
// apresentação SVG que aceitam cor, então isso funciona sem precisar ler
// o valor computado via JS. Confirmado com Chrome real antes de dar como
// certo, não só assumido.

const CHART_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

export interface LineChartSeries {
  key: string
  label: string
}

export interface LineChartProps {
  data: Record<string, string | number>[]
  categoryKey: string
  series: LineChartSeries[]
  height?: number
  // Os valores são expostos via tooltip no hover, sem alternativa pra
  // quem navega sem mouse. `title` opcional dá nome à tabela de dados
  // oculta abaixo — uma tabela de dados associada em vez de tornar cada
  // ponto focável individualmente.
  title?: string
  // A animação de entrada do Recharts (desenha a linha progressivamente)
  // não é controlada pelo `animations: 'disabled'` do Playwright, que só
  // afeta CSS, não a interpolação via JS/SVG que o Recharts usa
  // internamente — isso pode deixar a regressão visual instável,
  // capturando um frame no meio da animação. Padrão `true` preserva a
  // animação real pro produto — só a página de documentação desliga
  // explicitamente.
  isAnimationActive?: boolean
}

export function LineChart({ data, categoryKey, series, height = 280, title, isAnimationActive = true }: LineChartProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey={categoryKey} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: 8, fontSize: 13 }}
            labelStyle={{ color: 'var(--popover-foreground)' }}
          />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              isAnimationActive={isAnimationActive}
            />
          ))}
        </RechartsLineChart>
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
