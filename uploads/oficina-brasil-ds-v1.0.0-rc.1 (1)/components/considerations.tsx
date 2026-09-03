import type { ReactNode } from 'react'

export interface ConsiderationsProps {
  children: ReactNode
}

// Moldura escura envolvendo os cards ConsiderationsContent. Usa o
// azulEscuro da Oficina Brasil como fundo — não há um neutro escuro
// equivalente documentado pra essa marca, azulEscuro é o fundo escuro
// aprovado mais próximo.
export function Considerations({ children }: ConsiderationsProps) {
  return (
    <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--brand-azul-escuro)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ backgroundColor: 'var(--brand-verde)', color: 'var(--brand-verde-foreground)' }}
        >
          ✎
        </span>
        <p className="font-bold m-0" style={{ color: 'var(--brand-azul-escuro-foreground)' }}>Considerações</p>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {children}
      </div>
    </div>
  )
}

export interface ConsiderationsContentProps {
  about: string
  children: ReactNode
  /** Quantas colunas do grid esse card deve ocupar, espelhando a prop `size` original. */
  size?: 1 | 2
}

export function ConsiderationsContent({ about, children, size = 1 }: ConsiderationsContentProps) {
  return (
    <div
      className="rounded-lg p-4"
      style={{ gridColumn: size === 2 ? 'span 2' : undefined, boxShadow: 'var(--shadow-xs)', backgroundColor: 'var(--card)' }}
    >
      <p className="font-semibold m-0 mb-1" style={{ color: 'var(--card-foreground)' }}>{about}</p>
      <p className="text-sm m-0" style={{ color: 'var(--muted-foreground)' }}>{children}</p>
    </div>
  )
}
