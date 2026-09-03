import { InfoTooltip } from '@/components/info-tooltip'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">InfoTooltip</h1>
        <p className="text-sm text-muted-foreground">
          Dica contextual, 3 variantes de cor × 3 alinhamentos. Cada variante
          define seu próprio par de fundo/texto explícito, independente do
          tema da página — especialmente a variante "on-dark", já que ela é
          feita pra ficar sobre uma superfície já escura, tipo o
          AdminPageHeader ou o Considerations.
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm">Sólido</span>
          <InfoTooltip variant="solid" message="Percentual de conclusão do treinamento" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Fantasma</span>
          <InfoTooltip variant="ghost" message="Percentual de conclusão do treinamento" />
        </div>
        <div className="flex items-center gap-2 bg-[#00134E] px-3 py-2 rounded-lg">
          <span className="text-sm text-white">Sobre escuro</span>
          <InfoTooltip variant="on-dark" message="Percentual de conclusão do treinamento" />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`type InfoTooltipVariant = 'solid' | 'ghost' | 'on-dark'

interface InfoTooltipProps {
  message: string
  variant?: InfoTooltipVariant  // default 'solid'
}`}</pre>
        <p className="text-xs text-muted-foreground mt-2">
          A posição do balão é calculada automaticamente — detecta
          colisão com a borda da viewport e com elementos{' '}
          <code>fixed</code> como a sidebar deste Style Guide, sem
          precisar de uma prop manual de alinhamento.
        </p>
      </div>
    </div>
  )
}
