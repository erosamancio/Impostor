import { useEffect, useState } from 'react'
import { Avatar } from '../componentes/Avatar'
import { Botao } from '../componentes/Botao'
import { Tela } from '../componentes/Tela'
import type { Partida } from '../jogo/tipos'

type RevelacaoProps = {
  partida: Partida
  aoConcluir: () => void
}

/** Cada jogador pega o celular, segura o cartão para ver a palavra e passa adiante. */
export const Revelacao = ({ partida, aoConcluir }: RevelacaoProps) => {
  const [confirmado, setConfirmado] = useState(false)
  const indice = partida.revelacaoAtual
  const nome = partida.config.jogadores[indice] ?? ''
  const total = partida.config.jogadores.length

  const concluir = () => {
    setConfirmado(false)
    aoConcluir()
  }

  if (!confirmado) {
    return (
      <Tela
        subtitulo={`Jogador ${indice + 1} de ${total}`}
        rodape={<Botao onClick={() => setConfirmado(true)}>Sou eu, {nome}</Botao>}
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <Avatar nome={nome} indice={indice} tamanho="grande" />
          <p className="text-xl text-texto-suave">Passe o celular para</p>
          <p className="text-5xl font-black break-words">{nome}</p>
          <p className="max-w-64 text-texto-suave">Ninguém mais pode olhar a tela.</p>
        </div>
      </Tela>
    )
  }

  return <CartaoSecreto key={indice} partida={partida} indice={indice} aoConcluir={concluir} />
}

type CartaoSecretoProps = {
  partida: Partida
  indice: number
  aoConcluir: () => void
}

const CartaoSecreto = ({ partida, indice, aoConcluir }: CartaoSecretoProps) => {
  const [visivel, setVisivel] = useState(false)
  const [jaViu, setJaViu] = useState(false)
  const ehImpostor = indice === partida.impostor
  const nome = partida.config.jogadores[indice] ?? ''

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
              ? ehImpostor
                ? 'border-perigo bg-perigo/15'
                : 'border-destaque bg-destaque/10'
              : 'border-borda bg-superficie active:bg-superficie-alta'
          }`}
        >
          {visivel ? <ConteudoSecreto partida={partida} ehImpostor={ehImpostor} /> : <Verso />}
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

const ConteudoSecreto = ({ partida, ehImpostor }: { partida: Partida; ehImpostor: boolean }) => {
  if (ehImpostor) {
    return (
      <>
        <span className="text-lg font-bold text-texto-suave">Você é o</span>
        <span className="text-5xl font-black text-perigo">IMPOSTOR</span>
        <span className="mt-6 text-texto-suave">
          {partida.config.dicaImpostor === 'tema' ? `Tema: ${partida.temaNome}` : 'Sem dica. Boa sorte!'}
        </span>
        <span className="mt-2 text-sm text-texto-suave">Ouça as dicas e tente se misturar.</span>
      </>
    )
  }
  return (
    <>
      <span className="text-lg font-bold text-texto-suave">A palavra é</span>
      <span className="text-4xl font-black break-words text-destaque">{partida.palavra}</span>
      <span className="mt-6 text-texto-suave">Tema: {partida.temaNome}</span>
    </>
  )
}
