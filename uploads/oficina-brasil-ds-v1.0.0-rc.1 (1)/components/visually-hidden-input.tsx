import { InputHTMLAttributes, forwardRef } from 'react'

// Infraestrutura, não um componente de uso isolado — sempre associado a um
// botão-gatilho visível e rotulado que dispara o clique nele via ref (ex:
// FileUploadButton). Visualmente invisível de propósito, mas ainda no DOM
// e anunciável por leitor de tela quando referenciado por um <label> ou
// aria-label. O gatilho visível é quem recebe foco/interação de teclado —
// este input não deve participar da sequência de Tab isoladamente.
//
// tabIndex={-1} colocado DEPOIS do spread de `...props` (não antes) de
// propósito — pra ser definitivo, não sobrescrevível por uma prop
// tabIndex que um consumidor eventualmente passasse. Não afeta o
// disparo programático via `ref.current?.click()` (como o
// FileUploadButton usa) nem a leitura por leitor de tela quando
// referenciado por label/aria-label — tabIndex só controla navegação
// por Tab, não removível/inacessível de outras formas.
export const VisuallyHiddenInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function VisuallyHiddenInput(props, ref) {
    return (
      <input
        ref={ref}
        {...props}
        tabIndex={-1}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      />
    )
  }
)
