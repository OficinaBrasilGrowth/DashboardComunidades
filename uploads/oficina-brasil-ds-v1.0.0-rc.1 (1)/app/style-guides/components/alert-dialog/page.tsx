'use client'

import { useState } from 'react'
import { AlertDialog } from '@/components/alert-dialog'

export default function Page() {
  const [open, setOpen] = useState(false)

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">AlertDialog</h1>
        <p className="text-sm text-muted-foreground">
          Foco padrão no botão seguro "Cancelar", não no destrutivo.
          Diferente do{' '}
          <a href="/style-guides/components/modal" className="underline">Modal</a>{' '}
          genérico: usa <code>role="alertdialog"</code> (distinção real do
          WAI-ARIA), e não fecha ao clicar fora — uma confirmação
          destrutiva não deveria ser descartável sem querer com um clique
          acidental. Reaproveita o mesmo hook de focus trap do Modal
          (extraído pra <code>lib/use-focus-trap.ts</code> quando este
          componente foi construído), não duplicado.
        </p>
      </div>

      <div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg px-4 py-2 text-sm font-semibold"
          style={{ backgroundColor: 'var(--destructive-surface)', color: 'var(--destructive-surface-foreground)' }}
        >
          Excluir conta
        </button>
        <AlertDialog
          open={open}
          onCancel={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          title="Excluir conta?"
          description="Essa ação não pode ser desfeita. Todos os dados serão perdidos permanentemente."
          confirmLabel="Excluir"
        />
      </div>

      <div className="text-xs text-muted-foreground border-l-4 border-amber-400 pl-4">
        O botão de confirmar usa <code>var(--destructive-surface)</code> —
        antes precisava ignorar o token de destructive e usar hex fixo,
        porque um único token (<code>--destructive</code>) tentava
        representar cor de <em>texto</em> e cor de <em>fundo sólido</em> ao
        mesmo tempo, funções incompatíveis (a versão clareada pro dark mode
        funcionava como texto, mas falhava contraste como fundo com texto
        branco por cima). Corrigido na raiz: separado em{' '}
        <code>--destructive-text</code>,{' '}
        <code>--destructive-surface</code>,{' '}
        <code>--destructive-surface-foreground</code>,{' '}
        <code>--destructive-subtle</code> e{' '}
        <code>--destructive-border</code>, cada um com responsabilidade
        única. Mesmo padrão que o{' '}
        <a href="/style-guides/components/badge" className="underline">Badge</a>{' '}
        também usa agora.
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface AlertDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string  // padrão 'Confirmar'
  cancelLabel?: string   // padrão 'Cancelar'
}`}</pre>
      </div>
    </div>
  )
}
