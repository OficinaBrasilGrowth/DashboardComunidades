// O DataTable já tem um skeleton de carregamento embutido (linhas de
// tabela). Este é o componente avulso e reutilizável pra qualquer outro
// card/seção carregando — usa a animação animate-pulse já embutida no
// Tailwind, não uma reimplementação de shimmer própria.

export interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circle' | 'rect'
}

const variantClass: Record<NonNullable<SkeletonProps['variant']>, string> = {
  text: 'rounded h-4',
  circle: 'rounded-full',
  rect: 'rounded-lg',
}

export function Skeleton({ className, variant = 'rect' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse ${variantClass[variant]} ${className ?? ''}`}
      style={{ backgroundColor: 'var(--muted)' }}
      aria-hidden="true"
    />
  )
}
