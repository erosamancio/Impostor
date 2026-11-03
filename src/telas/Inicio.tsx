import { BookOpen, RotateCcw } from 'lucide-react'
import { Botao } from '../componentes/Botao'
import { Envelope } from '../componentes/Envelope'
import type { Placar } from '../jogo/armazenamento'

/** Na tela inicial só cabem os primeiros; o placar inteiro aparece no resultado. */
const VISIVEIS_NO_PLACAR = 3

type InicioProps = {
  placar: Placar
  podeRepetir: boolean
  aoNovoJogo: () => void
  aoRepetir: () => void
  aoComoJogar: () => void
  aoZerarPlacar: () => void
}

export const Inicio = ({ placar, podeRepetir, aoNovoJogo, aoRepetir, aoComoJogar, aoZerarPlacar }: InicioProps) => {
  const classificacao = Object.entries(placar).sort(([, a], [, b]) => b - a)
  const lider = classificacao[0]?.[1] ?? 0
  const temPlacar = classificacao.length > 0

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-end">
        <button
          type="button"
          onClick={aoComoJogar}
          className="-mr-2 flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[15px] font-semibold text-papel active:bg-envelope"
        >
          <BookOpen size={18} strokeWidth={2.25} />
          Como jogar
        </button>
      </header>

      <main className={`animar-entrada flex flex-1 flex-col justify-center ${temPlacar ? 'py-4' : 'py-8'}`}>
        <Envelope
          className={`mx-auto w-full -rotate-2 drop-shadow-[0_18px_30px_rgb(4_9_22/0.55)] ${temPlacar ? 'max-w-[15rem]' : 'max-w-[22rem]'}`}
        />
        <h1 className={`${temPlacar ? 'mt-6 text-[52px]' : 'mt-10 text-[64px]'} leading-[0.9] font-extrabold tracking-[-0.045em]`}>Impostor</h1>
        <p className="mt-4 max-w-[22rem] text-lg leading-snug text-pretty text-papel-suave">
          Todos recebem a mesma palavra secreta, menos um. Dê dicas, desconfie e descubra quem está blefando.
        </p>
      </main>

      {temPlacar && (
        <section aria-labelledby="titulo-placar" className="mb-6 rounded-2xl bg-envelope p-4 ring-1 ring-vinco">
          <div className="flex items-center justify-between">
            <h2 id="titulo-placar" className="text-[17px] font-bold">
              Placar da noite
            </h2>
            <button
              type="button"
              onClick={aoZerarPlacar}
              className="-mr-2 flex min-h-9 items-center gap-1 rounded-full px-2 text-sm font-semibold text-papel-suave active:bg-envelope-alto"
            >
              <RotateCcw size={14} strokeWidth={2.5} />
              Zerar
            </button>
          </div>
          <ol className="mt-3 flex flex-col gap-1.5">
            {classificacao.slice(0, VISIVEIS_NO_PLACAR).map(([nome, pontos]) => (
              <li key={nome} className="flex items-baseline gap-3 text-[17px]">
                <span className="min-w-0 flex-1 truncate font-semibold">{nome}</span>
                {pontos === lider && pontos > 0 && (
                  <span className="rounded-full bg-selo px-2 py-0.5 text-xs font-bold text-tinta">na frente</span>
                )}
                <span className="w-8 text-right text-xl font-extrabold tabular-nums">{pontos}</span>
              </li>
            ))}
          </ol>
          {classificacao.length > VISIVEIS_NO_PLACAR && (
            <p className="mt-2 text-sm text-papel-suave">
              e mais {classificacao.length - VISIVEIS_NO_PLACAR} no placar completo do fim da partida
            </p>
          )}
        </section>
      )}

      <div className="flex flex-col gap-2.5">
        {podeRepetir && <Botao onClick={aoRepetir}>Jogar de novo</Botao>}
        <Botao variante={podeRepetir ? 'secundario' : 'principal'} onClick={aoNovoJogo}>
          Novo jogo
        </Botao>
      </div>
    </div>
  )
}
