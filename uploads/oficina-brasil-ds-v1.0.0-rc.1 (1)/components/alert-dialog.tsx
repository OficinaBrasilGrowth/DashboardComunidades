'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../lib/use-focus-trap'

// Foco padrão no botão seguro "Cancelar", não no destrutivo — pra não
// confirmar sem querer com um Enter apertado logo ao abrir.
//
// Diferente do Modal genérico: usa role="alertdialog" (não "dialog") —
// distinção real do WAI-ARIA pra diálogos que exigem uma resposta antes de
// continuar. Também não fecha ao clicar fora, de propósito — uma
// confirmação destrutiva não deveria ser descartável sem querer com um
// clique acidental fora da caixa, diferente do Modal genérico onde isso é
// esperado. Reaproveita o mesmo useFocusTrap do Modal, mas com
// initialFocusSelector apontando pro botão de Cancelar em vez do
// primeiro elemento focável genérico.
//
// Botão de confirmar usa var(--destructive-surface), não --destructive
// direto — esse token tem uma única responsabilidade (usado como fundo
// sólido com texto branco), diferente de um token genérico que também
// precisasse servir como cor de texto e virasse claro demais no dark
// mode pra essa função.
//
// Portal pra document.body + useId — mesmo motivo do Modal: os ids
// fixos "alert-dialog-title"/"-description" colidiriam com duas
// instâncias montadas ao mesmo tempo, e renderizar no lugar da árvore
// arrisca ficar clipado por overflow/stacking context de um ancestral
// numa aplicação real. `mounted` evita chamar `document.body` durante
// SSR.

export interface AlertDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
}

export function AlertDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
}: AlertDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const [mounted, setMounted] = useState(false)
  useFocusTrap(dialogRef, open, onCancel, '[data-alert-dialog-cancel]')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!open || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'var(--shadow-overlay-backdrop)' }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="rounded-lg p-6 max-w-sm w-full mx-4"
        style={{ backgroundColor: 'var(--popover)', boxShadow: 'var(--shadow-lg)' }}
      >
        <p id={titleId} className="text-base font-bold m-0" style={{ color: 'var(--popover-foreground)' }}>
          {title}
        </p>
        {description && (
          <p id={descriptionId} className="text-sm mt-2 mb-0 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            {description}
          </p>
        )}
        <div className="flex justify-end gap-2.5 mt-5">
          <button
            type="button"
            data-alert-dialog-cancel
            onClick={onCancel}
            className="text-sm rounded-lg px-3.5 py-2 border font-medium"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="text-sm rounded-lg px-3.5 py-2 font-medium"
            style={{ backgroundColor: 'var(--destructive-surface)', color: 'var(--destructive-surface-foreground)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
