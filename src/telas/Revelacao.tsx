import { CartaoSecreto, PalavraSecreta } from '../componentes/CartaoSecreto'
import { PassarCelular } from '../componentes/PassarCelular'
import type { Partida } from '../jogo/tipos'

type RevelacaoProps = {
  partida: Partida
  aoConcluir: () => void
}

/** Cada jogador pega o celular, segura o cartão para ver a palavra e passa adiante. */
export const Revelacao = ({ partida, aoConcluir }: RevelacaoProps) => {
  const indice = partida.revelacaoAtual
  const nome = partida.config.jogadores[indice] ?? ''
  const ehImpostor = indice === partida.impostor

  return (
    <PassarCelular
      key={indice}
      nome={nome}
      indice={indice}
      progresso={`Jogador ${indice + 1} de ${partida.config.jogadores.length}`}
      aviso="Ninguém mais pode olhar a tela."
    >
      <CartaoSecreto nome={nome} alerta={ehImpostor} aoConcluir={aoConcluir}>
        {ehImpostor ? <AvisoDeImpostor partida={partida} /> : <PalavraSecreta palavra={partida.palavra} temaNome={partida.temaNome} />}
      </CartaoSecreto>
    </PassarCelular>
  )
}

const AvisoDeImpostor = ({ partida }: { partida: Partida }) => (
  <>
    <span className="text-lg font-bold text-texto-suave">Você é o</span>
    <span className="text-5xl font-black text-perigo">IMPOSTOR</span>
    <span className="mt-6 text-texto-suave">
      {partida.config.dicaImpostor === 'tema' ? `Tema: ${partida.temaNome}` : 'Sem dica. Boa sorte!'}
    </span>
    <span className="mt-2 text-sm text-texto-suave">Ouça as dicas e tente se misturar.</span>
  </>
)
