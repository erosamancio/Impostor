import { useState } from 'react'
import { Avatar } from '../componentes/Avatar'
import { Botao } from '../componentes/Botao'
import { Tela } from '../componentes/Tela'
import type { Partida } from '../jogo/tipos'

type UltimaChanceProps = {
  partida: Partida
  aoRegistrar: (acertou: boolean) => void
}

/** O impostor foi pego: ele chuta a palavra em voz alta e o grupo confere. */
export const UltimaChance = ({ partida, aoRegistrar }: UltimaChanceProps) => {
  const [palavraRevelada, setPalavraRevelada] = useState(false)
  const nome = partida.config.jogadores[partida.impostor] ?? ''

  return (
    <Tela
      rodape={
        palavraRevelada ? (
          <div className="grid grid-cols-2 gap-3">
            <Botao variante="perigo" onClick={() => aoRegistrar(true)}>
              Acertou
            </Botao>
            <Botao variante="secundario" onClick={() => aoRegistrar(false)}>
              Errou
            </Botao>
          </div>
        ) : (
          <Botao onClick={() => setPalavraRevelada(true)}>Já chutou, revelar a palavra</Botao>
        )
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <Avatar nome={nome} indice={partida.impostor} tamanho="grande" />
        <p className="text-3xl font-black">
          Pegaram! <span className="text-perigo">{nome}</span> era o impostor.
        </p>
        {palavraRevelada ? (
          <div className="animar-entrada mt-4 flex flex-col items-center gap-1">
            <p className="text-texto-suave">A palavra era</p>
            <p className="text-5xl font-black break-words text-destaque">{partida.palavra}</p>
            <p className="mt-3 text-texto-suave">O chute de {nome} estava certo?</p>
          </div>
        ) : (
          <p className="max-w-72 text-lg text-texto-suave">
            Última chance: {nome}, diga em voz alta qual você acha que é a palavra. Se acertar, rouba a vitória.
          </p>
        )}
      </div>
    </Tela>
  )
}
