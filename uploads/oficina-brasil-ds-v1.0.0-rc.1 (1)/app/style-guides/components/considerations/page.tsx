import { Considerations, ConsiderationsContent } from '@/components/considerations'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Considerations</h1>
        <p className="text-sm text-muted-foreground">
          Bloco de análise para o fim de relatórios — uma moldura escura
          azulEscuro contendo um ou mais cards de conteúdo brancos.
          azulEscuro é o fundo escuro aprovado mais próximo definido no
          guia de marca.
        </p>
      </div>

      <Considerations>
        <ConsiderationsContent about="Sobre o alcance">
          A campanha atingiu 38% da base ativa no período, com pico na segunda semana.
        </ConsiderationsContent>
        <ConsiderationsContent about="Sobre o engajamento">
          A taxa de cliques ficou acima da média histórica, puxada pelos estados do Sudeste.
        </ConsiderationsContent>
        <ConsiderationsContent about="Recomendação" size={2}>
          Manter o investimento atual e revisar a segmentação geográfica no próximo ciclo.
        </ConsiderationsContent>
      </Considerations>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface ConsiderationsProps {
  children: ReactNode  // one or more <ConsiderationsContent>
}

interface ConsiderationsContentProps {
  about: string
  children: ReactNode
  size?: 1 | 2  // grid column span
}`}</pre>
      </div>

      <div className="text-xs text-muted-foreground border-l-4 border-emerald-400 pl-4">
        O card de conteúdo interno usa var(--card) (não branco fixo) — se
        adapta corretamente aos dois temas.
      </div>
    </div>
  )
}
