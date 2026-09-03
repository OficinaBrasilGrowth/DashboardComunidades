import { ChevronRightIcon } from './icons'

// <nav aria-label="breadcrumb"> + lista ordenada, não uma div genérica com
// separadores — leitor de tela anuncia isso como uma trilha de navegação
// de verdade. O último item nunca é um link (é a página atual), marcado
// com aria-current="page" — padrão do WAI-ARIA APG "breadcrumb" pattern,
// não inventado aqui.

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center flex-wrap gap-1.5 text-sm m-0 p-0" style={{ listStyle: 'none' }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1.5">
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="font-medium"
                  style={{ color: isLast ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                >
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className="hover:underline" style={{ color: 'var(--muted-foreground)' }}>
                  {item.label}
                </a>
              )}
              {!isLast && (
                <span aria-hidden="true" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>
                  <ChevronRightIcon size={14} />
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
