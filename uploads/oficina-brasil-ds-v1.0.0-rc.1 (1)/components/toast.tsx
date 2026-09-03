'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckIcon } from './icons'

// Empilha num canto fixo, some sozinho depois de um tempo, também
// fechável manualmente.
//
// Acessibilidade: a região do toast usa aria-live="polite" (role="status")
// pra leitores de tela anunciarem novos toasts sem interromper o que a
// pessoa estiver fazendo — não aria-live="assertive", que seria disruptivo
// demais para confirmações rotineiras. Toasts de erro também usam
// deliberadamente a mesma região polite; um erro verdadeiramente urgente e
// bloqueante deveria usar um Modal em vez de um toast que quem usa leitor de
// tela pode não perceber se o foco estiver em outro lugar.

export type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  show: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

const variantStyles: Record<ToastVariant, { bg: string; fg: string }> = {
  success: { bg: 'var(--success-surface)', fg: 'var(--success-surface-foreground)' },
  error: { bg: 'var(--destructive-surface)', fg: 'var(--destructive-surface-foreground)' },
  info: { bg: 'var(--info-surface)', fg: 'var(--info-surface-foreground)' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2"
        style={{ maxWidth: 340 }}
      >
        {toasts.map((t) => {
          const s = variantStyles[t.variant]
          return (
            <div
              key={t.id}
              className="rounded-lg px-4 py-3 text-sm flex items-center gap-2.5"
              style={{
                backgroundColor: s.bg,
                color: s.fg,
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {t.variant === 'success' && <CheckIcon size={15} />}
              <span className="flex-1">{t.message}</span>
              <button
                type="button"
                aria-label="Fechar notificação"
                onClick={() => dismiss(t.id)}
                className="opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
