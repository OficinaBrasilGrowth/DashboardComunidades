import { Popover } from '@/components/popover'
import { Button } from '@/components/button'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Popover</h1>
        <p className="text-sm text-muted-foreground">
          Diferente do{' '}
          <a href="/style-guides/components/dropdown-menu" className="underline">DropdownMenu</a>{' '}
          (menu de ação com itens fixos) ou do{' '}
          <a href="/style-guides/components/info-tooltip" className="underline">InfoTooltip</a>{' '}
          (dica com variantes de cor fixas): este é genérico, aceita
          qualquer <code>children</code> como conteúdo. Reaproveita os
          mesmos hooks de posicionamento e click-outside já testados no
          DropdownMenu (<code>lib/use-popover-position.ts</code>,{' '}
          <code>lib/use-click-outside.ts</code>), não duplica a lógica.
        </p>
      </div>

      <div>
        <Popover
          trigger={
            <span className="px-3.5 py-2 border rounded-lg inline-block text-sm" style={{ borderColor: 'var(--border)' }}>
              Abrir Popover
            </span>
          }
        >
          <p className="text-sm m-0" style={{ color: 'var(--popover-foreground)' }}>
            Qualquer conteúdo pode ir aqui dentro.
          </p>
        </Popover>
      </div>

      <div className="text-xs text-muted-foreground border-l-4 border-amber-400 pl-4">
        Achado real durante o teste: o foco não entra automaticamente no
        conteúdo (diferente do DropdownMenu, que foca o primeiro item) —
        por isso <code>Escape</code> usa um listener no <code>document</code>,
        não um <code>onKeyDown</code> no próprio conteúdo, que nunca
        receberia o evento nesse caso.
      </div>

      <div>
        <p className="text-sm font-medium mb-2">
          Com <code>asChild</code> — usando um{' '}
          <a href="/style-guides/components/button" className="underline">Button</a>{' '}
          real como gatilho
        </p>
        <p className="text-xs text-muted-foreground mb-3">
          Sem <code>asChild</code>, isso geraria{' '}
          <code>&lt;button&gt;&lt;button&gt;...&lt;/button&gt;&lt;/button&gt;</code>{' '}
          — interação aninhada inválida. Mesmo utilitário compartilhado
          (<code>lib/as-child.tsx</code>)
          que o <a href="/style-guides/components/dropdown-menu" className="underline">DropdownMenu</a>{' '}
          usa.
        </p>
        <Popover asChild trigger={<Button variant="secondary">Abrir (Button real)</Button>}>
          <p className="text-sm m-0" style={{ color: 'var(--popover-foreground)' }}>
            Sem nenhum botão aninhado por baixo.
          </p>
        </Popover>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  width?: number  // padrão 240
  asChild?: boolean  // funde as props no elemento passado, em vez de envolver num <button> próprio
}`}</pre>
      </div>
    </div>
  )
}
