import { EmptyState } from '@/components/empty-state'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">EmptyState</h1>
        <p className="text-sm text-muted-foreground">
          O <a href="/style-guides/components/data-table" className="underline">DataTable</a>{' '}
          já tem um estado vazio mínimo embutido (só texto), pra quando não
          há dados numa tabela especificamente. Este é o componente avulso e
          reutilizável pra qualquer outra tela — aceita ícone, título,
          descrição e uma ação opcional.
        </p>
      </div>

      <div className="border rounded-lg">
        <EmptyState
          icon={<span>🔍</span>}
          title="Nenhum resultado encontrado"
          description="Tente ajustar os filtros de busca ou aguarde novos reparadores se cadastrarem na região."
          action={
            <button className="rounded-lg px-4 py-2 text-sm font-semibold" style={{ backgroundColor: '#18328A', color: '#FFFFFF' }}>
              Limpar filtros
            </button>
          }
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode  // normalmente um botão
}`}</pre>
      </div>
    </div>
  )
}
