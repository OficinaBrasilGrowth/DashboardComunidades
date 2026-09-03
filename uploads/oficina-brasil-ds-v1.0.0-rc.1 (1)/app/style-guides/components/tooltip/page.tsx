import { Tooltip } from '@/components/tooltip'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Tooltip</h1>
        <p className="text-sm text-muted-foreground">
          Padrão WAI-ARIA "tooltip" — ativado por hover <strong>e</strong>{' '}
          foco de teclado (foco é fácil de esquecer, mas essencial: quem
          navega só com teclado nunca passa o mouse por cima de nada).
          Diferente do{' '}
          <a href="/style-guides/components/info-tooltip" className="underline">InfoTooltip</a>{' '}
          (que tem um "i" fixo como gatilho e variantes de cor pra usar
          sobre fundos específicos), esse aceita qualquer elemento como
          gatilho.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Passe o mouse, ou dê Tab até o botão</p>
        <Tooltip content="Dica contextual aparece aqui">
          <button className="rounded-lg px-3.5 py-2 border text-sm" style={{ borderColor: 'var(--border)' }}>
            Passe o mouse ou dê Tab
          </button>
        </Tooltip>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface TooltipProps {
  content: string
  children: ReactNode
}`}</pre>
      </div>
    </div>
  )
}
