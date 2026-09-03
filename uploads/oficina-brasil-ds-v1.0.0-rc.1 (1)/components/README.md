# Uma nota sobre prévias visuais neste projeto

Enquanto validava componentes no chat, prévias às vezes foram mostradas
como aproximações em HTML feitas à mão (renderizadas inline na conversa)
em vez do componente React real. Em pelo menos uma ocasião (DatePicker,
Ago 2026), essa aproximação usou um `<span>` simples onde o componente
real usa um `<button>` — spans e buttons não compartilham o mesmo
comportamento padrão de alinhamento de texto, então a prévia mostrou um
bug de desalinhamento que não existia de fato no arquivo `date-picker.tsx`.

**Lição aplicada:** o componente real agora define `text-center`
explicitamente nos botões de célula de dia em vez de depender do estilo
padrão do navegador pra botão — não porque o padrão estivesse errado, mas
porque um design system não deveria depender de comportamento implícito
do navegador que uma refatoração futura (ex: trocar `<button>` por um
`<div role="button">` estilizado) poderia quebrar silenciosamente.

Se uma prévia futura mostrada no chat não bater com o comportamento real
deste arquivo, a fonte de verdade é sempre o código deste repositório, não
a prévia do chat — sinalize isso e será verificado de novo contra o
arquivo real.
