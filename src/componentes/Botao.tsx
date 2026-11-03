import type { ButtonHTMLAttributes } from 'react'

type Variante = 'principal' | 'secundario' | 'discreto' | 'perigo' | 'sucesso'

type BotaoProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante
}

const ESTILOS: Record<Variante, string> = {
  principal: 'bg-selo text-tinta shadow-selo',
  secundario: 'bg-envelope-alto text-papel ring-1 ring-vinco ring-inset',
  discreto: 'bg-transparent text-papel-suave',
  perigo: 'bg-aereo text-tinta shadow-carta',
  sucesso: 'bg-postal text-tinta shadow-carta',
}

export const Botao = ({ variante = 'principal', className = '', ...props }: BotaoProps) => (
  <button
    type="button"
    className={`flex min-h-14 w-full items-center justify-center gap-2 rounded-[14px] px-6 text-[17px] font-bold tracking-[-0.01em] transition-[transform,opacity,background-color] duration-150 ease-(--ease-saida) active:scale-[0.97] disabled:pointer-events-none disabled:opacity-35 ${ESTILOS[variante]} ${className}`}
    {...props}
  />
)
