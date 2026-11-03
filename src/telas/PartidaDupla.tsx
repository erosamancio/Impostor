import { Avatar } from '../componentes/Avatar'
import { Carimbo } from '../componentes/Carimbo'
import { CartaoSecreto, PalavraSecreta } from '../componentes/CartaoSecreto'
import { Tela } from '../componentes/Tela'
import { palavrasIguais, type AcaoDupla, type Jogador, type PartidaDupla } from '../jogo/dupla'
import { NaMesa } from './NaMesa'
import { BotoesDoFim } from './Resultado'

type TelaDaDuplaProps = {
  partida: PartidaDupla
  aoAvancar: (acao: AcaoDupla) => void
  aoJogarDeNovo: () => void
  aoSair: () => void
}

export const TelaDaDupla = ({ partida, aoAvancar, aoJogarDeNovo, aoSair }: TelaDaDuplaProps) => {
  switch (partida.etapa) {
    case 'revelacao': {
      const jogador = partida.revelacaoAtual
      const nome = partida.jogadores[jogador]
      return (
        <CartaoSecreto
          key={jogador}
          nome={nome}
          indice={jogador}
          etapa={`${jogador + 1} de 2`}
          rotuloConcluir={jogador === 0 ? `Já vi, passar para ${partida.jogadores[1]}` : 'Já vi, começar a partida'}
          aoConcluir={() => aoAvancar({ tipo: 'proximaRevelacao' })}
        >
          <PalavraSecreta
            palavra={partida.palavras[jogador]}
            temaNome={partida.temaNome}
            nota="A palavra do outro pode ser igual ou só parecida."
          />
        </CartaoSecreto>
      )
    }
    case 'emJogo':
      return (
        <NaMesa
          jogadores={partida.jogadores}
          quemComeca={partida.primeiro}
          aviso="No fim, cada um diz se acha que as palavras são iguais."
          rotuloRevelar="Revelar as palavras"
          aoRevelar={() => aoAvancar({ tipo: 'revelarResultado' })}
        />
      )
    case 'resultado':
      return <ResultadoDupla partida={partida} aoJogarDeNovo={aoJogarDeNovo} aoSair={aoSair} />
  }
}

type ResultadoDuplaProps = {
  partida: PartidaDupla
  aoJogarDeNovo: () => void
  aoSair: () => void
}

const ResultadoDupla = ({ partida, aoJogarDeNovo, aoSair }: ResultadoDuplaProps) => {
  const iguais = palavrasIguais(partida)
  const jogadores: Jogador[] = [0, 1]

  return (
    <Tela rodape={<BotoesDoFim aoJogarDeNovo={aoJogarDeNovo} aoSair={aoSair} />}>
      <section className="flex flex-col items-center pt-2 text-center">
        <div className="-my-6 scale-[0.72]">
          <Carimbo linhas={['PALAVRAS', iguais ? 'IGUAIS' : 'DIFERENTES']} cor={iguais ? 'postal' : 'aereo'} />
        </div>
        <h1 className="mt-2 text-[30px] leading-none font-extrabold tracking-[-0.035em]">
          {iguais ? 'Era a mesma palavra' : 'Eram palavras diferentes'}
        </h1>
      </section>

      <ul className="mt-7 flex flex-col gap-3">
        {jogadores.map((j) => (
          <li key={j} className="carta overflow-hidden rounded-[22px] px-5 pt-7 pb-6 text-tinta shadow-carta">
            <div className="flex items-center gap-3">
              <Avatar nome={partida.jogadores[j]} indice={j} tamanho="medio" />
              <span className="min-w-0 flex-1 truncate text-[17px] font-bold">{partida.jogadores[j]}</span>
            </div>
            <p className="mt-3 text-[34px] leading-[1.05] font-extrabold tracking-[-0.03em] break-words">
              {partida.palavras[j]}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center text-[15px] text-papel-suave">Tema: {partida.temaNome}</p>
    </Tela>
  )
}
