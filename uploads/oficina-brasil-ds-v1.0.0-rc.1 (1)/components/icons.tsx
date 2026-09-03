// Componentes de ícone compartilhados para o design system.
//
// CalendarIcon e CheckIcon usam os dados de path exatos do conjunto real de
// ícones da marca (assets/icons/calendar.svg, check.svg) — não redesenhados.
//
// ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon e UploadIcon são
// affordances genéricas de interface sem equivalente no conjunto de 35
// ícones da marca — desenhados à mão como glifos simples e neutros (não são
// assets de marca, só iconografia padrão de interface), dimensionados pra
// combinar com as convenções de ícone de UI baseado em traço.

interface IconProps {
  size?: number
  className?: string
  style?: React.CSSProperties
}

export function CalendarIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 92.877 93.881" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d="M26.739 25.331a6.31 6.31 0 0 0 6.337-6.337V6.337C33.076 2.772 30.215 0 26.739 0s-6.337 2.861-6.337 6.337v12.568c0 3.565 2.771 6.426 6.337 6.426m39.368 0a6.31 6.31 0 0 0 6.337-6.337V6.337C72.444 2.772 69.583 0 66.107 0S59.77 2.861 59.77 6.337v12.568c0 3.565 2.771 6.426 6.337 6.426" />
      <path d="M85.881 12.673h-8.209v6.232c0 6.337-5.138 11.58-11.58 11.58s-11.58-5.243-11.58-11.58v-6.232H38.289v6.232c0 6.337-5.138 11.58-11.58 11.58s-11.58-5.243-11.58-11.58v-6.232H6.921A6.877 6.877 0 0 0 0 19.594V86.96c0 3.865 3.161 6.921 6.921 6.921h79.035a6.877 6.877 0 0 0 6.921-6.921V19.609c0-3.865-3.161-6.921-7.026-6.921zM32.282 72.924c0 1.378-1.183 2.577-2.577 2.577h-8.509c-1.378 0-2.577-1.183-2.577-2.577v-6.621c0-1.378 1.183-2.577 2.577-2.577h8.509a2.567 2.567 0 0 1 2.577 2.577zm0-19.1c0 1.378-1.183 2.577-2.577 2.577h-8.509a2.567 2.567 0 0 1-2.577-2.577v-6.621c0-1.378 1.183-2.577 2.577-2.577h8.509c1.378 0 2.577 1.183 2.577 2.577zm20.957 19.1c0 1.378-1.183 2.577-2.577 2.577h-8.509c-1.378 0-2.577-1.183-2.577-2.577v-6.621a2.567 2.567 0 0 1 2.577-2.577h8.509a2.567 2.567 0 0 1 2.577 2.577zm0-19.1c0 1.378-1.183 2.577-2.577 2.577h-8.509a2.567 2.567 0 0 1-2.577-2.577v-6.621a2.567 2.567 0 0 1 2.577-2.577h8.509c1.378 0 2.577 1.183 2.577 2.577zm20.883 19.1c0 1.378-1.183 2.577-2.577 2.577h-8.404c-1.378 0-2.577-1.183-2.577-2.577v-6.621c0-1.378 1.183-2.577 2.577-2.577h8.404a2.567 2.567 0 0 1 2.577 2.577zm0-19.1c0 1.378-1.183 2.577-2.577 2.577h-8.404a2.567 2.567 0 0 1-2.577-2.577v-6.621c0-1.378 1.183-2.577 2.577-2.577h8.404c1.378 0 2.577 1.183 2.577 2.577z" />
    </svg>
  )
}

export function CheckIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 79.273 69.925" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d="M2.326 45.953c-3.101-3.101-3.101-8.134 0-11.235s8.134-3.101 11.25 0l15.25 15.25L65.078 3.08c2.682-3.46 7.655-4.105 11.115-1.423 3.461 2.681 4.105 7.655 1.423 11.115L36.211 66.326c-.3.449-.644.869-1.034 1.273-3.101 3.101-8.134 3.101-11.25 0L2.311 45.983z" />
    </svg>
  )
}

// Genérico — não é um asset de marca.
export function ChevronDownIcon({ size = 14, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

// Genérico — não é um asset de marca.
export function ChevronLeftIcon({ size = 14, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

// Genérico — não é um asset de marca.
export function ChevronRightIcon({ size = 14, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

// Genérico — não é um asset de marca.
export function UploadIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 8l-5-5-5 5" />
      <path d="M12 3v12" />
    </svg>
  )
}

// Genérico — não é um asset de marca.
export function EditIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

// Genérico — não é um asset de marca.
export function TrashIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

// Genérico — não é um asset de marca.
export function SearchIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

// Genérico — não é um asset de marca.
export function FilterIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}
