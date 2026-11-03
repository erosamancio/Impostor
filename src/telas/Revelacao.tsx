import { AvisoDeImpostor, CartaoSecreto, PalavraSecreta } from '../componentes/CartaoSecreto'
import { segredoDe } from '../jogo/partida'
import type { Partida } from '../jogo/tipos'

type RevelacaoProps = {
  partida: Partida
  aoConcluir: () => void
}

/** Cada jogador pega o celular, segura o envelope para ver o segredo e passa adiante. */
export const Revelacao = ({ partida, aoConcluir }: RevelacaoProps) => {
  const { jogadores } = partida.config
  const indice = partida.revelacaoAtual
  const nome = jogadores[indice] ?? ''
  const proximo = jogadores[indice + 1]
  const segredo = segredoDe(partida, indice)

  return (
    <CartaoSecreto
      key={indice}
      nome={nome}
      indice={indice}
      etapa={`${indice + 1} de ${jogadores.length}`}
      rotuloConcluir={proximo ? `Já vi, passar para ${proximo}` : 'Já vi, começar a partida'}
      aoConcluir={aoConcluir}
    >
      {segredo.tipo === 'palavra' ? (
        <PalavraSecreta palavra={segredo.palavra} temaNome={partida.temaNome} />
      ) : (
        <AvisoDeImpostor dica={segredo.dica} total={partida.impostores.length} />
      )}
    </CartaoSecreto>
  )
}
