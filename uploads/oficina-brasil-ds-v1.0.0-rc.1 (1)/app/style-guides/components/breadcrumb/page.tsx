import { Breadcrumb } from '@/components/breadcrumb'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Breadcrumb</h1>
        <p className="text-sm text-muted-foreground">
          <code>&lt;nav aria-label="breadcrumb"&gt;</code> + lista
          ordenada, não uma div genérica com separadores — leitor de tela
          anuncia isso como uma trilha de navegação de verdade. O último
          item nunca é um link (é a página atual), marcado com{' '}
          <code>aria-current="page"</code> — padrão do WAI-ARIA APG
          "breadcrumb" pattern, não inventado aqui.
        </p>
      </div>

      <Breadcrumb
        items={[
          { label: 'Início', href: '/' },
          { label: 'Configurações', href: '/config' },
          { label: 'Usuários' },
        ]}
      />

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface BreadcrumbItem {
  label: string
  href?: string  // omitido = não é um link (ex: o item atual)
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}`}</pre>
      </div>
    </div>
  )
}
