import { Skeleton } from '@/components/skeleton'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Skeleton</h1>
        <p className="text-sm text-muted-foreground">
          O <a href="/style-guides/components/data-table" className="underline">DataTable</a>{' '}
          já tem um skeleton de carregamento embutido (linhas de tabela).
          Este é o componente avulso e reutilizável pra qualquer outro
          card/seção carregando — usa a animação <code>animate-pulse</code>{' '}
          já embutida no Tailwind, não uma reimplementação própria de
          shimmer. Confirmado via Playwright que a animação de fato aplica
          (não só a classe presente no HTML).
        </p>
      </div>

      <div className="flex flex-col gap-3 max-w-sm">
        <Skeleton variant="text" className="w-48" />
        <Skeleton variant="text" className="w-32" />
        <div className="flex items-center gap-3 mt-2">
          <Skeleton variant="circle" className="w-10 h-10" />
          <Skeleton variant="rect" className="w-40 h-10" />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circle' | 'rect'  // padrão 'rect'
}`}</pre>
      </div>
    </div>
  )
}
