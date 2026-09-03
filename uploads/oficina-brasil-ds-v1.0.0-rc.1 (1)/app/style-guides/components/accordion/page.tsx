import { Accordion } from '@/components/accordion'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Accordion</h1>
        <p className="text-sm text-muted-foreground">
          Cabeçalho clicável com seta que gira, painel expande/colapsa.
          Estrutura semântica segue o padrão "accordion" das WAI-ARIA
          Authoring Practices: cada cabeçalho é um{' '}
          <code>&lt;button aria-expanded aria-controls&gt;</code>, cada
          painel tem <code>role="region" aria-labelledby</code> — não uma{' '}
          <code>&lt;div&gt;</code> genérica com <code>onClick</code>.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Padrão — só uma seção aberta por vez</p>
        <Accordion
          items={[
            { key: 'a', title: 'Como funciona o pagamento?', content: 'Aceita cartão e PIX.' },
            { key: 'b', title: 'Posso cancelar quando quiser?', content: 'Sim, sem multa.' },
            { key: 'c', title: 'Tem período de teste?', content: 'Sim, 14 dias grátis.' },
          ]}
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">allowMultiple — mais de uma seção aberta ao mesmo tempo</p>
        <Accordion
          allowMultiple
          items={[
            { key: 'x', title: 'Seção X', content: 'Conteúdo X.' },
            { key: 'y', title: 'Seção Y', content: 'Conteúdo Y.' },
          ]}
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface AccordionItem {
  key: string
  title: string
  content: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean       // padrão false
  defaultOpenKeys?: string[]
}`}</pre>
      </div>
    </div>
  )
}
