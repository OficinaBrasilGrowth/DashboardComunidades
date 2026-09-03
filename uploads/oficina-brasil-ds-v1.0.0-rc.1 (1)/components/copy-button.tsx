'use client'

import { useState } from 'react'

export interface CopyButtonProps {
  value: string
  className?: string
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // A Clipboard API pode falhar (permissões, contexto inseguro) — falha
      // silenciosamente, o botão simplesmente não mostra a confirmação "copiado".
    }
  }

  return (
    <div className={`relative inline-flex ${className ?? ''}`}>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copiar"
        className="p-2.5 rounded-lg transition-colors hover:bg-muted"
        style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>
      {copied && (
        <span
          className="absolute -top-9 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded-lg whitespace-nowrap"
          style={{ backgroundColor: 'var(--brand-azul-escuro)', color: 'var(--brand-azul-escuro-foreground)' }}
        >
          Copiado!
        </span>
      )}
    </div>
  )
}
