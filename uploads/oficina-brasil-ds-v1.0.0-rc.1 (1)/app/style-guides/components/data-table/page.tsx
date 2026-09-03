'use client'

import { DataTable, type Column } from '@/components/data-table'

interface Reparador {
  id: string
  nome: string
  cidade: string
  status: string
}

const rows: Reparador[] = [
  { id: '1', nome: 'Oficina Brasil SP', cidade: 'São Paulo', status: 'Ativo' },
  { id: '2', nome: 'Auto Center RJ', cidade: 'Rio de Janeiro', status: 'Ativo' },
  { id: '3', nome: 'Mecânica Sul', cidade: 'Porto Alegre', status: 'Pendente' },
]

const columns: Column<Reparador>[] = [
  { key: 'nome', header: 'Nome', sortable: true, accessor: (r) => r.nome },
  { key: 'cidade', header: 'Cidade', sortable: true, accessor: (r) => r.cidade },
  { key: 'status', header: 'Status' },
]

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">DataTable</h1>
        <p className="text-sm text-muted-foreground">
          Cabeçalhos de coluna ordenáveis, estado vazio dedicado, skeleton
          de carregamento em vez de esconder o cabeçalho. Combina com{' '}
          <a href="/style-guides/components/pagination" className="underline">Pagination</a>{' '}
          em vez de ter sua própria paginação — uma tabela não deveria ser
          dona desse estado.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Padrão — clique em "Nome" ou "Cidade" pra ordenar</p>
        <DataTable columns={columns} data={rows} rowKey={(r) => r.id} />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Carregando</p>
        <DataTable columns={columns} data={[]} rowKey={(r) => r.id} loading />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Vazio</p>
        <DataTable columns={columns} data={[]} rowKey={(r) => r.id} emptyMessage="Nenhum reparador cadastrado ainda" />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  sortable?: boolean
  accessor?: (row: T) => string | number  // required if sortable
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T) => string
  loading?: boolean
  emptyMessage?: string
}`}</pre>
      </div>

      <div className="text-xs text-muted-foreground border-l-4 border-amber-400 pl-4">
        As linhas realmente reordenam e o atributo aria-sort do cabeçalho
        atualiza para leitores de tela.
      </div>
    </div>
  )
}
