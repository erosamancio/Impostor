import type { ReactNode } from 'react'

type TelaProps = {
  titulo?: string
  subtitulo?: string
  rodape?: ReactNode
  aoVoltar?: () => void
  children: ReactNode
}

/** Layout padrão: cabeçalho, conteúdo rolável e rodapé fixo com as ações. */
export const Tela = ({ titulo, subtitulo, rodape, aoVoltar, children }: TelaProps) => (
  <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))]">
    {(titulo || aoVoltar) && (
      <header className="mb-4 flex items-start gap-3">
        {aoVoltar && (
          <button
            type="button"
            onClick={aoVoltar}
            aria-label="Voltar"
            className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded-full text-2xl text-texto-suave active:bg-superficie"
          >
            ←
          </button>
        )}
        <div className="min-w-0 pt-1">
          {titulo && <h1 className="text-2xl font-black leading-tight">{titulo}</h1>}
          {subtitulo && <p className="mt-1 text-texto-suave">{subtitulo}</p>}
        </div>
      </header>
    )}
    <main className="animar-entrada flex flex-1 flex-col">{children}</main>
    {rodape && (
      <footer className="sticky bottom-0 -mx-4 mt-6 flex flex-col gap-3 bg-gradient-to-t from-fundo from-70% to-transparent px-4 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        {rodape}
      </footer>
    )}
  </div>
)
