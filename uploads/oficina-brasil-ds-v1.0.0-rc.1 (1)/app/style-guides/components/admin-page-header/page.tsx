import { AdminPageHeader } from '@/components/admin-page-header'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">AdminPageHeader</h1>
        <p className="text-sm text-muted-foreground">
          Banner de cabeçalho para telas admin/produto. Vem com 5 variantes
          de cor — uma por cor oficial da marca definida no guia de marca
          da Oficina Brasil.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <AdminPageHeader color="azul" title="Gestão de Clientes" subtitle="Cadastro, produtos e permissões de acesso" />
        <AdminPageHeader color="azulEscuro" title="Relatórios" subtitle="Exportação e histórico" />
        <AdminPageHeader color="verde" title="Campanhas Ativas" subtitle="12 em andamento" />
        <AdminPageHeader color="turquesa" title="Integrações" subtitle="Status das conexões" />
        <AdminPageHeader color="azulClaro" title="Configurações" subtitle="Preferências da conta" />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface AdminPageHeaderProps {
  color: 'azul' | 'azulEscuro' | 'verde' | 'turquesa' | 'azulClaro'
  icon?: ReactNode
  title: string
  subtitle?: string
  actions?: ReactNode
}`}</pre>
      </div>
    </div>
  )
}
