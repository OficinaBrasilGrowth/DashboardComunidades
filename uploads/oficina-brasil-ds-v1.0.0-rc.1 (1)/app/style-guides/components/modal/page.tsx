'use client'

import { useState } from 'react'
import { Modal } from '@/components/modal'

export default function Page() {
  const [open, setOpen] = useState(false)

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Modal</h1>
        <p className="text-sm text-muted-foreground">
          Diálogo com focus trap de verdade: Tab/Shift+Tab ficam presos
          dentro do diálogo enquanto aberto, o foco move pra dentro ao
          abrir, e volta pro gatilho ao fechar — o Tab nunca escapa pra
          página atrás do overlay.
        </p>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="rounded-lg px-4 py-2 text-sm font-semibold w-fit"
        style={{ backgroundColor: '#18328A', color: '#FFFFFF' }}
      >
        Abrir modal
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Confirmar exclusão">
        Esta ação remove o banner de todas as campanhas ativas. Não dá para desfazer.
      </Modal>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}`}</pre>
      </div>

      <div className="text-xs text-muted-foreground border-l-4 border-emerald-400 pl-4">
        Usa var(--popover) (não branco fixo) — se adapta corretamente aos
        dois temas.
      </div>
    </div>
  )
}
