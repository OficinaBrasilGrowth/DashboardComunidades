import { ProgressRing } from '@/components/progress-ring'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">ProgressRing</h1>
        <p className="text-sm text-muted-foreground">
          Anel de progresso via SVG (stroke-dasharray/stroke-dashoffset) —
          mesmo truque padrão de qualquer indicador circular, sem
          biblioteca externa. Mesmo <code>role="progressbar"</code> do{' '}
          <a href="/style-guides/components/progress-bar" className="underline">ProgressBar</a>,
          pra acessibilidade consistente entre os dois.
        </p>
      </div>

      <div className="flex items-center gap-6">
        <ProgressRing value={42} />
        <ProgressRing value={85} color="#00B7A4" />
        <ProgressRing value={100} size={80} strokeWidth={8} />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface ProgressRingProps {
  value: number         // 0-100, valores fora do intervalo são limitados
  size?: number          // padrão 64 (px)
  strokeWidth?: number   // padrão 6
  color?: string         // padrão '#18328A' (azul)
  label?: string
}`}</pre>
      </div>
    </div>
  )
}
