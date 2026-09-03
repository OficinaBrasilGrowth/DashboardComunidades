'use client'

import { forwardRef, type TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  helperText?: string
}

// Mesmo padrão de erro/texto de ajuda do Input — mantido consistente em
// todo campo de formulário, não só parecido por coincidência.
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, helperText, className, style, rows = 4, ...props },
  ref
) {
  return (
    <div>
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm bg-background transition-shadow outline-none resize-y ${className ?? ''}`}
        style={{
          borderColor: error ? 'var(--destructive-text)' : 'var(--border)',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = error
            ? 'var(--focus-ring-destructive)'
            : 'var(--focus-ring-primary)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none'
        }}
        aria-invalid={!!error}
        aria-describedby={error || helperText ? `${props.id}-message` : undefined}
        {...props}
      />
      {(error || helperText) && (
        <p
          id={`${props.id}-message`}
          className="text-xs mt-1.5 m-0"
          style={{ color: error ? 'var(--destructive-text)' : 'var(--muted-foreground)' }}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  )
})
