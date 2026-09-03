'use client'

import { useState } from 'react'
import { DatePicker, type DateRange } from '@/components/date-picker'

export default function Page() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null })

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">DatePicker</h1>
        <p className="text-sm text-muted-foreground">
          Seletor de intervalo de datas, nomes de mês/dia em pt-BR: grid de
          calendário, navegação de mês, seleção de intervalo, ações
          Limpar/Aplicar. Suporte completo a teclado: Left/Right/Up/Down
          movem por dia/semana, Home/End pulam pro início/fim da linha,
          PageUp/PageDown mudam de mês — incluindo atravessar limites de
          mês. Também inclui campos de texto de digitação direta
          Início/Término (a digitação fica sincronizada com o calendário e
          vice-versa), uma dica explícita "escolha a data final" depois de
          escolher a data inicial, e atalhos rápidos de período (Últimos 7
          dias, Últimos 30 dias, Este mês, Mês passado).
        </p>
      </div>

      <DatePicker value={range} onChange={setRange} />

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface DateRange {
  start: Date | null
  end: Date | null
}

interface DatePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
}`}</pre>
      </div>

      <div className="text-xs text-muted-foreground border-l-4 border-amber-400 pl-4">
        NÃO usa a estrutura formal ARIA role="grid" — uma auditoria com
        axe-core encontrou que role="grid" sem role="row" envolvendo cada
        semana viola aria-required-children/aria-required-parent. Usa botões
        simples com aria-label descritivo (data completa) + aria-pressed em
        vez disso — totalmente operável por teclado, só não reivindicando
        conformidade ARIA grid estrita.
      </div>
    </div>
  )
}
