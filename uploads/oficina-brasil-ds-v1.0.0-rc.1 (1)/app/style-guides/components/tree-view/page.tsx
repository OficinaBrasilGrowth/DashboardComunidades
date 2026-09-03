import { TreeView } from '@/components/tree-view'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">TreeView</h1>
        <p className="text-sm text-muted-foreground">
          Padrão WAI-ARIA "treeview" — o mais complexo dos padrões de
          teclado do design system: setas Cima/Baixo movem entre itens{' '}
          <em>visíveis</em> (não conta filhos colapsados), seta Direita
          expande um nó fechado (ou entra no primeiro filho se já aberto),
          Esquerda colapsa um nó aberto (ou volta pro pai se já fechado),
          Home/End vão pro primeiro/último item visível.{' '}
          <code>role="tree"</code> no container, <code>role="treeitem"</code>{' '}
          em cada nó, <code>role="group"</code> envolvendo os filhos.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Clique num item, ou use as setas do teclado</p>
        <TreeView
          data={[
            {
              key: 'docs', label: 'Documentos', children: [
                { key: 'contratos', label: 'Contratos', children: [
                  { key: 'c1', label: 'Contrato A' },
                  { key: 'c2', label: 'Contrato B' },
                ]},
                { key: 'notas', label: 'Notas fiscais' },
              ]
            },
            { key: 'fotos', label: 'Fotos' },
          ]}
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface TreeNode {
  key: string
  label: string
  children?: TreeNode[]
}

interface TreeViewProps {
  data: TreeNode[]
  defaultExpandedKeys?: string[]
}`}</pre>
      </div>
    </div>
  )
}
