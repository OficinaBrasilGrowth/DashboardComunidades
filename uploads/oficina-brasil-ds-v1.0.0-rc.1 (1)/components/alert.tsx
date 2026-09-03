'use client'

import type { ReactNode } from 'react'
import { CheckIcon } from './icons'

// Diferente do Toast (que é temporário e flutua num canto), o Alert é um
// bloco persistente inline na página — pra avisos que a pessoa precisa
// continuar vendo até resolver ou fechar manualmente, não uma confirmação
// passageira. Mesmas 4 variantes semânticas do Badge/Toast, pelas mesmas
// combinações de cor aprovadas.
//
// Usa var(--{status}-subtle)/var(--{status}-subtle-foreground)/
// var(--{status}-border), com light/dark escolhidos automaticamente
// pelo CSS, sem o componente saber nada sobre tema. 'success' usa
// turquesa em tinta clara — mesma cor canônica usada por
// Toast/FileUploadButton pra --success-surface em todo o sistema.
//
// Correção de contraste real: as cores de texto originais (#E8792A,
// #D14343 puros) sobre os tints claros mediam 2.61:1 e 3.93:1 — os dois
// abaixo do mínimo de 4.5:1 do WCAG AA. Corrigido com versões
// escurecidas (mesmo tom, ~70-90% do brilho original) calculadas pra
// passar com folga: 4.87:1 e 4.69:1 reais, medidas, não estimadas.
// Esses valores hoje vivem em
// var(--warning-subtle-foreground)/var(--destructive-subtle-foreground).
//
// O texto de descrição NÃO usa opacity pra ficar visualmente mais leve
// que o título — opacity reduz o contraste EFETIVO renderizado (a cor
// computada de verdade fica mais clara que a declarada no CSS, já que
// opacity mistura com o fundo), podendo derrubar uma combinação que já
// tinha sido calculada certinho pro texto sólido. Cor sólida direto,
// sem essa pegadinha silenciosa se repetir em variantes futuras.

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps {
  variant?: AlertVariant
  title: string
  children?: ReactNode
  onDismiss?: () => void
}

const variantStyles: Record<AlertVariant, { bg: string; fg: string; border: string }> = {
  info: { bg: 'var(--info-subtle)', fg: 'var(--info-subtle-foreground)', border: 'var(--info-border)' },
  success: { bg: 'var(--success-subtle)', fg: 'var(--success-subtle-foreground)', border: 'var(--success-border)' },
  warning: { bg: 'var(--warning-subtle)', fg: 'var(--warning-subtle-foreground)', border: 'var(--warning-border)' },
  error: { bg: 'var(--destructive-subtle)', fg: 'var(--destructive-subtle-foreground)', border: 'var(--destructive-border)' },
}

export function Alert({ variant = 'info', title, children, onDismiss }: AlertProps) {
  const { bg, fg, border } = variantStyles[variant]
  return (
    <div
      role="alert"
      className="rounded-lg border-l-4 p-4 flex items-start gap-3"
      style={{ backgroundColor: bg, borderColor: border }}
    >
      {variant === 'success' && (
        <span className="mt-0.5 shrink-0" style={{ color: fg }}>
          <CheckIcon size={16} />
        </span>
      )}
      <div className="flex-1">
        <p className="font-semibold text-sm m-0" style={{ color: fg }}>{title}</p>
        {children && (
          <div className="text-sm mt-1" style={{ color: fg }}>
            {children}
          </div>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Fechar aviso"
          onClick={onDismiss}
          className="shrink-0 text-lg leading-none opacity-70 hover:opacity-100"
          style={{ color: fg }}
        >
          ×
        </button>
      )}
    </div>
  )
}
