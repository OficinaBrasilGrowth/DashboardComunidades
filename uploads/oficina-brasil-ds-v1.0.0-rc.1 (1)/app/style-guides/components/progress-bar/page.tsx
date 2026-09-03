import { ProgressBar } from '@/components/progress-bar'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">ProgressBar</h1>
        <p className="text-sm text-muted-foreground">
          Usa <code>role="progressbar"</code> nativo do ARIA, com{' '}
          <code>aria-valuenow/min/max</code> — leitor de tela anuncia o
          progresso sem precisar de nenhum texto extra escondido. O valor é
          sempre limitado entre 0 e 100 (testado via Playwright passando 130
          e confirmando que fixa em 100).
        </p>
      </div>

      <div className="flex flex-col gap-5 max-w-sm">
        <ProgressBar value={68} label="Meta mensal" />
        <ProgressBar value={30} label="Capacidade usada" color="#00B7A4" />
        <ProgressBar value={130} label="Acima do limite (fixa em 100)" />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface ProgressBarProps {
  value: number       // 0-100, valores fora do intervalo são limitados
  label?: string
  color?: string      // padrão '#18328A' (azul)
}`}</pre>
      </div>
    </div>
  )
}
