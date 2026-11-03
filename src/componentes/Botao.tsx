import type { ButtonHTMLAttributes } from 'react'

type Variante = 'principal' | 'secundario' | 'discreto' | 'perigo'

type BotaoProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante
}

const ESTILOS: Record<Variante, string> = {
  principal: 'bg-destaque text-fundo shadow-[0_4px_0_var(--color-destaque-escuro)] active:translate-y-1 active:shadow-none',
  secundario: 'bg-superficie-alta text-texto border border-borda active:scale-[0.97]',
  discreto: 'bg-transparent text-texto-suave active:scale-[0.97]',
  perigo: 'bg-perigo text-fundo active:scale-[0.97]',
}

export const Botao = ({ variante = 'principal', className = '', ...props }: BotaoProps) => (
  <button
    type="button"
    className={`min-h-14 w-full rounded-2xl px-6 text-lg font-extrabold transition-[transform,box-shadow,opacity] duration-100 disabled:pointer-events-none disabled:opacity-40 ${ESTILOS[variante]} ${className}`}
    {...props}
  />
)
