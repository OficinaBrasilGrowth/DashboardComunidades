import type { ReactNode } from 'react'

// O DataTable já tem um estado vazio mínimo embutido (só texto), pra quando
// não há dados numa tabela especificamente. Este é o componente avulso e
// reutilizável pra qualquer outra tela (ex: "nenhuma notificação ainda",
// "nenhum reparador cadastrado") — aceita ícone, título, descrição e uma
// ação opcional (normalmente um botão), sem repetir a lógica do DataTable.

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      {icon && (
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
        >
          {icon}
        </div>
      )}
      <p className="font-semibold text-base m-0" style={{ color: 'var(--foreground)' }}>{title}</p>
      {description && (
        <p className="text-sm mt-1.5 mb-0 max-w-sm" style={{ color: 'var(--muted-foreground)' }}>
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
