import { AvisoDeImpostor, CartaoSecreto, PalavraSecreta } from '../componentes/CartaoSecreto'
import { PassarCelular } from '../componentes/PassarCelular'
import { segredoDe } from '../jogo/partida'
import type { Partida } from '../jogo/tipos'

type RevelacaoProps = {
  partida: Partida
  aoConcluir: () => void
}

/** Cada jogador pega o celular, segura o envelope para ver o segredo e passa adiante. */
export const Revelacao = ({ partida, aoConcluir }: RevelacaoProps) => {
  const indice = partida.revelacaoAtual
  const nome = partida.config.jogadores[indice] ?? ''
  const etapa = `${indice + 1} de ${partida.config.jogadores.length}`
  const segredo = segredoDe(partida, indice)

  return (
    <PassarCelular key={indice} nome={nome} indice={indice} etapa={etapa} aviso="Ninguém mais pode olhar a tela.">
      <CartaoSecreto nome={nome} etapa={etapa} aoConcluir={aoConcluir}>
        {segredo.tipo === 'palavra' ? (
          <PalavraSecreta palavra={segredo.palavra} temaNome={partida.temaNome} />
        ) : (
          <AvisoDeImpostor dica={segredo.dica} total={partida.impostores.length} />
        )}
      </CartaoSecreto>
    </PassarCelular>
  )
}
