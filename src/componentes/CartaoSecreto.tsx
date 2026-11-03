import { useEffect, useState, type ReactNode } from 'react'
import { Botao } from './Botao'
import { Tela } from './Tela'

type CartaoSecretoProps = {
  nome: string
  alerta?: boolean
  aoConcluir: () => void
  /** Conteúdo mostrado só enquanto o dedo está no cartão. */
  children: ReactNode
}

/** Cartão que só mostra o segredo enquanto é pressionado e esconde ao trocar de aba. */
export const CartaoSecreto = ({ nome, alerta = false, aoConcluir, children }: CartaoSecretoProps) => {
  const [visivel, setVisivel] = useState(false)
  const [jaViu, setJaViu] = useState(false)

  useEffect(() => {
    const esconder = () => setVisivel(false)
    document.addEventListener('visibilitychange', esconder)
    window.addEventListener('blur', esconder)
    return () => {
      document.removeEventListener('visibilitychange', esconder)
      window.removeEventListener('blur', esconder)
    }
  }, [])

  const mostrar = () => {
    setVisivel(true)
    setJaViu(true)
  }
  const esconder = () => setVisivel(false)

  return (
    <Tela
      titulo={nome}
      subtitulo="Segure o cartão para ver. Solte para esconder."
      rodape={
        <Botao disabled={!jaViu} onClick={aoConcluir}>
          Já vi, passar adiante
        </Botao>
      }
    >
      <div className="flex flex-1 items-center justify-center">
        <div
          role="button"
          tabIndex={0}
          aria-label="Segure para ver sua palavra"
          onPointerDown={mostrar}
          onPointerUp={esconder}
          onPointerLeave={esconder}
          onPointerCancel={esconder}
          onKeyDown={(e) => e.key === ' ' && mostrar()}
          onKeyUp={esconder}
          onContextMenu={(e) => e.preventDefault()}
          className={`flex aspect-[3/4] w-full max-w-80 touch-none flex-col items-center justify-center rounded-3xl border-2 p-6 text-center select-none [-webkit-touch-callout:none] transition-colors duration-100 ${
            visivel
              ? alerta
                ? 'border-perigo bg-perigo/15'
                : 'border-destaque bg-destaque/10'
              : 'border-borda bg-superficie active:bg-superficie-alta'
          }`}
        >
          {visivel ? children : <Verso />}
        </div>
      </div>
    </Tela>
  )
}

const Verso = () => (
  <>
    <span className="text-7xl" aria-hidden>
      🤫
    </span>
    <span className="mt-4 text-xl font-extrabold">Segure para ver</span>
  </>
)

export const PalavraSecreta = ({ palavra, temaNome }: { palavra: string; temaNome: string }) => (
  <>
    <span className="text-lg font-bold text-texto-suave">A palavra é</span>
    <span className="text-4xl font-black break-words text-destaque">{palavra}</span>
    <span className="mt-6 text-texto-suave">Tema: {temaNome}</span>
  </>
)
