import { useState } from 'react'
import { Avatar } from '../componentes/Avatar'
import { Botao } from '../componentes/Botao'
import { Tela } from '../componentes/Tela'
import type { Partida } from '../jogo/tipos'

type UltimaChanceProps = {
  partida: Partida
  aoRegistrar: (acertou: boolean) => void
}

/** Um impostor foi pego: ele chuta a palavra em voz alta e o grupo confere. */
export const UltimaChance = ({ partida, aoRegistrar }: UltimaChanceProps) => {
  const [palavraRevelada, setPalavraRevelada] = useState(false)
  const acusado = partida.acusado ?? 0
  const nome = partida.config.jogadores[acusado] ?? ''
  const artigo = partida.impostores.length > 1 ? 'um impostor' : 'o impostor'

  return (
    <Tela
      etapa="Última chance"
      rodape={
        palavraRevelada ? (
          <div className="grid grid-cols-2 gap-2.5">
            <Botao variante="perigo" onClick={() => aoRegistrar(true)}>
              Acertou
            </Botao>
            <Botao variante="sucesso" onClick={() => aoRegistrar(false)}>
              Errou
            </Botao>
          </div>
        ) : (
          <Botao onClick={() => setPalavraRevelada(true)}>Já chutou, mostrar a palavra</Botao>
        )
      }
    >
      <div className="flex flex-1 flex-col justify-center">
        <Avatar nome={nome} indice={acusado} tamanho="grande" />
        <h1 className="mt-6 text-[40px] leading-[0.98] font-extrabold tracking-[-0.04em]">
          Pegaram! <span className="text-aereo">{nome}</span> era {artigo}.
        </h1>
        {palavraRevelada ? (
          <div className="animar-entrada mt-8 rounded-[22px] bg-envelope p-6 ring-1 ring-vinco">
            <p className="text-[15px] font-semibold text-papel-suave">A palavra era</p>
            <p className="mt-1 text-[40px] leading-[1.05] font-extrabold tracking-[-0.03em] break-words text-selo">
              {partida.palavra}
            </p>
            <p className="mt-4 text-[17px]">O chute de {nome} estava certo?</p>
          </div>
        ) : (
          <p className="mt-4 max-w-80 text-lg leading-snug text-papel-suave">
            Última chance: {nome}, diga em voz alta qual você acha que é a palavra. Se acertar, rouba a vitória.
          </p>
        )}
      </div>
    </Tela>
  )
}
