export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">VisuallyHiddenInput</h1>
        <p className="text-sm text-muted-foreground">
          Infraestrutura, não um componente de uso isolado — pense nele
          como uma peça interna do{' '}
          <a href="/style-guides/components/file-upload-button" className="underline">FileUploadButton</a>,
          que é o exemplo canônico e o único uso real desse componente em
          outro lugar do sistema. Nunca use um <code>VisuallyHiddenInput</code>{' '}
          sozinho, sem um botão visível e rotulado ao lado que dispare o
          clique nele (via <code>ref</code>) — o padrão certo é: o botão
          visível recebe o foco e a interação de teclado normalmente, e o
          input escondido só existe pra abrir o seletor de arquivo nativo
          do navegador por trás.
        </p>
      </div>

      <div className="text-xs text-muted-foreground border-l-4 border-amber-400 pl-4">
        O input existe pra ser disparado programaticamente pelo gatilho
        visível (<code>inputRef.current?.click()</code>), não pra fazer
        parte da sequência de Tab por conta própria.
      </div>

      <div className="border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground">
        (invisível de propósito — veja o FileUploadButton para o gatilho visível)
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`// Aceita todos os atributos nativos de <input>, encaminhados via ref.
// Sempre passe um aria-label (ou associe um <label>) já que ele
// não tem texto visível próprio para leitores de tela anunciarem.`}</pre>
      </div>
    </div>
  )
}
