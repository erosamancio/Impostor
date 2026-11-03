import { BookOpen } from 'lucide-react'
import { Botao } from '../componentes/Botao'
import { Envelope } from '../componentes/Envelope'

type InicioProps = {
  podeRepetir: boolean
  aoNovoJogo: () => void
  aoRepetir: () => void
  aoComoJogar: () => void
}

export const Inicio = ({ podeRepetir, aoNovoJogo, aoRepetir, aoComoJogar }: InicioProps) => {
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

      <main className="animar-entrada flex flex-1 flex-col justify-center py-8">
        <Envelope className="mx-auto w-full max-w-[22rem] -rotate-2 drop-shadow-[0_18px_30px_rgb(4_9_22/0.55)]" />
        <h1 className="mt-10 text-[64px] leading-[0.9] font-extrabold tracking-[-0.045em]">Impostor</h1>
        <p className="mt-4 max-w-[22rem] text-lg leading-snug text-pretty text-papel-suave">
          Todos recebem a mesma palavra secreta, menos um. Dê dicas, desconfie e descubra quem está blefando.
        </p>
      </main>

      <div className="flex flex-col gap-2.5">
        {podeRepetir && <Botao onClick={aoRepetir}>Jogar de novo</Botao>}
        <Botao variante={podeRepetir ? 'secundario' : 'principal'} onClick={aoNovoJogo}>
          Novo jogo
        </Botao>
      </div>
    </div>
  )
}
