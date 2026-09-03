'use client'

import { DropdownMenu } from '@/components/dropdown-menu'
import { Button } from '@/components/button'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">DropdownMenu</h1>
        <p className="text-sm text-muted-foreground">
          Botão-gatilho + menu de ação flutuante. Teclado: abre com foco no
          primeiro item, setas Cima/Baixo navegam, Escape fecha e devolve
          o foco ao gatilho. O posicionamento detecta automaticamente se
          há espaço à direita e abaixo do gatilho, ajustando pra esquerda
          ou pra cima quando necessário.
        </p>
      </div>

      <DropdownMenu
        trigger={<span className="px-3.5 py-2 border rounded-lg inline-block text-sm">Ações ▾</span>}
        items={[
          { key: 'editar', label: 'Editar', onSelect: () => {} },
          { key: 'duplicar', label: 'Duplicar', onSelect: () => {} },
          { key: 'excluir', label: 'Excluir', onSelect: () => {}, destructive: true },
        ]}
      />

      <div>
        <p className="text-sm font-medium mb-2">
          Com <code>asChild</code> — usando um{' '}
          <a href="/style-guides/components/button" className="underline">Button</a>{' '}
          real como gatilho
        </p>
        <p className="text-xs text-muted-foreground mb-3">
          Sem <code>asChild</code>, isso geraria{' '}
          <code>&lt;button&gt;&lt;button&gt;...&lt;/button&gt;&lt;/button&gt;</code>{' '}
          — interação aninhada inválida. Com <code>asChild</code>, as props
          do gatilho (<code>onClick</code>, <code>aria-expanded</code>,{' '}
          <code>aria-haspopup</code>) são fundidas direto no{' '}
          <code>Button</code>, sem envolver em nada.
        </p>
        <DropdownMenu
          asChild
          trigger={<Button variant="outline">Ações (Button real) ▾</Button>}
          items={[
            { key: 'editar', label: 'Editar', onSelect: () => {} },
            { key: 'excluir', label: 'Excluir', onSelect: () => {}, destructive: true },
          ]}
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface DropdownMenuItem {
  key: string
  label: string
  onSelect: () => void
  destructive?: boolean  // renders in red, for delete-type actions
}

interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownMenuItem[]
  asChild?: boolean  // funde as props no elemento passado, em vez de envolver num <button> próprio
}`}</pre>
      </div>
    </div>
  )
}
