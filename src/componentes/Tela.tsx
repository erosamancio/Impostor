import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

type TelaProps = {
  titulo?: string
  subtitulo?: string
  /** Pequeno marcador de etapa no canto, como "Rodada 2 de 3". */
  etapa?: string
  rodape?: ReactNode
  aoVoltar?: () => void
  children: ReactNode
}

/** Layout padrão: barra superior, conteúdo rolável e barra de ações presa embaixo. */
export const Tela = ({ titulo, subtitulo, etapa, rodape, aoVoltar, children }: TelaProps) => (
  <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pt-[max(0.75rem,env(safe-area-inset-top))]">
    {(titulo || aoVoltar || etapa) && (
      <header className="mb-5 flex min-h-11 items-center gap-2">
        {aoVoltar && (
          <button
            type="button"
            onClick={aoVoltar}
            aria-label="Voltar"
            className="-ml-2.5 flex size-11 shrink-0 items-center justify-center rounded-full text-papel-suave transition-colors active:bg-envelope"
          >
            <ArrowLeft size={22} strokeWidth={2.25} />
          </button>
        )}
        {titulo && <h1 className="min-w-0 flex-1 truncate text-[22px] font-extrabold tracking-[-0.02em]">{titulo}</h1>}
        {etapa && (
          <span className="ml-auto shrink-0 rounded-full bg-envelope px-3 py-1 text-sm font-semibold text-papel-suave tabular-nums">
            {etapa}
          </span>
        )}
      </header>
    )}
    {subtitulo && <p className="-mt-3 mb-5 text-[15px] text-papel-suave">{subtitulo}</p>}
    <main className="animar-entrada flex flex-1 flex-col">{children}</main>
    {rodape && (
      <footer className="sticky bottom-0 -mx-5 mt-6 flex flex-col gap-2.5 bg-gradient-to-t from-tinta from-75% to-transparent px-5 pt-8 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        {rodape}
      </footer>
    )}
  </div>
)
