import { Tabs } from '@/components/tabs'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Tabs</h1>
        <p className="text-sm text-muted-foreground">
          Indicador de sublinhado deslizante. O comportamento de teclado
          segue o padrão "tabs" das WAI-ARIA Authoring Practices: as setas
          Esquerda/Direita movem o foco E ativam a aba (ativação
          automática), Home/End pulam pra primeira/última. Construído com
          suporte a teclado desde o início, não adicionado depois.
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Clique numa aba, depois use as setas ← →</p>
        <Tabs
          items={[
            { key: 'geral', label: 'Geral', content: <p className="text-sm text-muted-foreground">Conteúdo da aba Geral</p> },
            { key: 'seguranca', label: 'Segurança', content: <p className="text-sm text-muted-foreground">Conteúdo da aba Segurança</p> },
            { key: 'notif', label: 'Notificações', content: <p className="text-sm text-muted-foreground">Conteúdo da aba Notificações</p> },
          ]}
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface TabItem {
  key: string
  label: string
  content: ReactNode
}

interface TabsProps {
  items: TabItem[]
  defaultKey?: string  // padrão é items[0].key
}`}</pre>
      </div>
    </div>
  )
}
