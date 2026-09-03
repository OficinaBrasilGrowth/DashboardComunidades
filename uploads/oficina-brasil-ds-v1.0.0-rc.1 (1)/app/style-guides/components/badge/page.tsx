import { Badge } from '@/components/badge'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Badge</h1>
        <p className="text-sm text-muted-foreground">
          Variantes semânticas em vez de cores de marca cruas — quem usa o
          Badge não precisa saber qual combinação de fundo/texto é aprovada
          conforme <code>contrast-rules.ts</code>, o componente já resolve
          isso por dentro. "success" usa verde + azulEscuro (nunca branco
          sobre verde — regra inegociável do guia).
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="neutral">Rascunho</Badge>
        <Badge variant="info">Em análise</Badge>
        <Badge variant="success">Ativo</Badge>
        <Badge variant="warning">Pendente</Badge>
        <Badge variant="error">Cancelado</Badge>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface BadgeProps {
  children: ReactNode
  variant?: 'neutral' | 'info' | 'success' | 'warning' | 'error'  // padrão 'neutral'
}`}</pre>
      </div>
    </div>
  )
}
