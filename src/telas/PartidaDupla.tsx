import { Check, Equal, EqualNot, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Avatar } from '../componentes/Avatar'
import { Botao } from '../componentes/Botao'
import { Carimbo } from '../componentes/Carimbo'
import { CartaoSecreto, PalavraSecreta } from '../componentes/CartaoSecreto'
import { Cronometro } from '../componentes/Cronometro'
import { PassarCelular } from '../componentes/PassarCelular'
import { Tela } from '../componentes/Tela'
import type { Placar } from '../jogo/armazenamento'
import {
  apostaCerta,
  calcularPontosDupla,
  jogadorDaVez,
  outro,
  palavrasIguais,
  type AcaoDupla,
  type Aposta,
  type Jogador,
  type PartidaDupla,
} from '../jogo/dupla'
import { VezDe } from './Dicas'

type TelaDaDuplaProps = {
  partida: PartidaDupla
  placar: Placar
  /** Segundos por dica; 0 = sem timer. */
  tempoDica: number
  aoAvancar: (acao: AcaoDupla) => void
  aoJogarDeNovo: () => void
  aoSair: () => void
}

export const TelaDaDupla = ({ partida, placar, tempoDica, aoAvancar, aoJogarDeNovo, aoSair }: TelaDaDuplaProps) => {
  switch (partida.etapa) {
    case 'revelacao':
      return <RevelacaoDupla partida={partida} aoConcluir={() => aoAvancar({ tipo: 'proximaRevelacao' })} />
    case 'dicas':
      return <DicasDupla partida={partida} tempoDica={tempoDica} aoAvancar={() => aoAvancar({ tipo: 'proximaVez' })} />
    case 'votacao':
      return (
        <ApostaDupla
          key={partida.votanteAtual}
          partida={partida}
          aoApostar={(aposta) => aoAvancar({ tipo: 'apostar', aposta })}
        />
      )
    case 'chute':
      return (
        <ChuteDupla
          key={partida.chutesPendentes.join()}
          partida={partida}
          aoRegistrar={(acertou) => aoAvancar({ tipo: 'registrarChute', acertou })}
        />
      )
    case 'resultado':
      return <ResultadoDupla partida={partida} placar={placar} aoJogarDeNovo={aoJogarDeNovo} aoSair={aoSair} />
  }
}

const RevelacaoDupla = ({ partida, aoConcluir }: { partida: PartidaDupla; aoConcluir: () => void }) => {
  const jogador = partida.revelacaoAtual
  const nome = partida.jogadores[jogador]
  const etapa = `${jogador + 1} de 2`
  return (
    <PassarCelular key={jogador} nome={nome} indice={jogador} etapa={etapa} aviso="Só você pode ver a sua palavra.">
      <CartaoSecreto nome={nome} etapa={etapa} aoConcluir={aoConcluir}>
        <PalavraSecreta
          palavra={partida.palavras[jogador]}
          temaNome={partida.temaNome}
          nota="A palavra do outro pode ser igual ou só parecida."
        />
      </CartaoSecreto>
    </PassarCelular>
  )
}

type DicasDuplaProps = { partida: PartidaDupla; tempoDica: number; aoAvancar: () => void }

const DicasDupla = ({ partida, tempoDica, aoAvancar }: DicasDuplaProps) => {
  const falando = jogadorDaVez(partida)
  const ultimaVez = partida.vezAtual === 1 && partida.rodadaAtual === partida.totalRodadas
  const chave = `${partida.rodadaAtual}-${partida.vezAtual}`

  return (
    <Tela
      etapa={`Rodada ${partida.rodadaAtual} de ${partida.totalRodadas}`}
      rodape={<Botao onClick={aoAvancar}>{ultimaVez ? 'Hora de apostar' : 'Próximo'}</Botao>}
    >
      <div className="flex flex-1 flex-col justify-center">
        <VezDe
          key={chave}
          nome={partida.jogadores[falando]}
          indice={falando}
          texto="Dê uma dica sobre a sua palavra. Clara demais entrega tudo; vaga demais levanta suspeita."
        />
        {tempoDica > 0 && (
          <div className="mt-8">
            <Cronometro key={chave} segundos={tempoDica} />
          </div>
        )}
      </div>
    </Tela>
  )
}

const ApostaDupla = ({ partida, aoApostar }: { partida: PartidaDupla; aoApostar: (aposta: Aposta) => void }) => {
  const votante = partida.votanteAtual
  const nome = partida.jogadores[votante]
  const etapa = `Aposta ${votante + 1} de 2`
  const [aposta, setAposta] = useState<Aposta | null>(null)

  return (
    <PassarCelular nome={nome} indice={votante} etapa={etapa} aviso="A aposta é secreta.">
      <Tela
        titulo={`Sua aposta, ${nome}`}
        subtitulo={`A palavra de ${partida.jogadores[outro(votante)]} é igual à sua?`}
        etapa={etapa}
        rodape={
          <Botao disabled={aposta === null} onClick={() => aposta && aoApostar(aposta)}>
            Confirmar aposta
          </Botao>
        }
      >
        <div className="grid flex-1 grid-cols-1 content-center gap-3">
          <OpcaoDeAposta
            icone={<Equal size={36} strokeWidth={2.5} />}
            rotulo="Iguais"
            ativa={aposta === 'iguais'}
            aoEscolher={() => setAposta('iguais')}
          />
          <OpcaoDeAposta
            icone={<EqualNot size={36} strokeWidth={2.5} />}
            rotulo="Diferentes"
            ativa={aposta === 'diferentes'}
            aoEscolher={() => setAposta('diferentes')}
          />
        </div>
      </Tela>
    </PassarCelular>
  )
}

type OpcaoDeApostaProps = { icone: ReactNode; rotulo: string; ativa: boolean; aoEscolher: () => void }

const OpcaoDeAposta = ({ icone, rotulo, ativa, aoEscolher }: OpcaoDeApostaProps) => (
  <button
    type="button"
    aria-pressed={ativa}
    onClick={aoEscolher}
    className={`flex min-h-32 flex-col items-center justify-center gap-2 rounded-[22px] text-[26px] font-extrabold tracking-[-0.02em] ring-inset transition-[background-color,box-shadow,color] duration-150 ${
      ativa ? 'bg-selo/12 text-selo ring-2 ring-selo' : 'bg-envelope text-papel ring-1 ring-vinco'
    }`}
  >
    <span aria-hidden>{icone}</span>
    {rotulo}
  </button>
)

/** Quem apostou "diferentes" (e acertou) tenta adivinhar a palavra do outro em voz alta. */
const ChuteDupla = ({ partida, aoRegistrar }: { partida: PartidaDupla; aoRegistrar: (acertou: boolean) => void }) => {
  const [revelada, setRevelada] = useState(false)
  const quemChuta = partida.chutesPendentes[0] ?? 0
  const alvo = outro(quemChuta)
  const nome = partida.jogadores[quemChuta]
  const nomeAlvo = partida.jogadores[alvo]

  return (
    <Tela
      etapa="Chute"
      rodape={
        revelada ? (
          <div className="grid grid-cols-2 gap-2.5">
            <Botao variante="sucesso" onClick={() => aoRegistrar(true)}>
              Acertou
            </Botao>
            <Botao variante="secundario" onClick={() => aoRegistrar(false)}>
              Errou
            </Botao>
          </div>
        ) : (
          <Botao onClick={() => setRevelada(true)}>Já chutou, mostrar a palavra</Botao>
        )
      }
    >
      <div className="flex flex-1 flex-col justify-center">
        <Avatar nome={nome} indice={quemChuta} tamanho="grande" />
        <h1 className="mt-6 text-[40px] leading-[0.98] font-extrabold tracking-[-0.04em]">Eram diferentes mesmo!</h1>
        {revelada ? (
          <div className="animar-entrada mt-8 rounded-[22px] bg-envelope p-6 ring-1 ring-vinco">
            <p className="text-[15px] font-semibold text-papel-suave">A palavra de {nomeAlvo} era</p>
            <p className="mt-1 text-[40px] leading-[1.05] font-extrabold tracking-[-0.03em] break-words text-selo">
              {partida.palavras[alvo]}
            </p>
            <p className="mt-4 text-[17px]">O chute de {nome} estava certo?</p>
          </div>
        ) : (
          <p className="mt-4 max-w-80 text-lg leading-snug text-papel-suave">
            {nome}, diga em voz alta qual você acha que é a palavra de {nomeAlvo}. Acertar vale mais 1 ponto.
          </p>
        )}
      </div>
    </Tela>
  )
}

type ResultadoDuplaProps = {
  partida: PartidaDupla
  placar: Placar
  aoJogarDeNovo: () => void
  aoSair: () => void
}

const ResultadoDupla = ({ partida, placar, aoJogarDeNovo, aoSair }: ResultadoDuplaProps) => {
  const iguais = palavrasIguais(partida)
  const pontos = calcularPontosDupla(partida)
  const jogadores: Jogador[] = [0, 1]

  return (
    <Tela
      rodape={
        <>
          <Botao onClick={aoJogarDeNovo}>Jogar de novo</Botao>
          <Botao variante="discreto" onClick={aoSair}>
            Voltar ao início
          </Botao>
        </>
      }
    >
      <section className="flex flex-col items-center pt-4 text-center">
        <Carimbo linhas={['PALAVRAS', iguais ? 'IGUAIS' : 'DIFERENTES']} cor={iguais ? 'postal' : 'aereo'} />
        <h1 className="mt-6 text-[34px] leading-none font-extrabold tracking-[-0.035em]">
          {iguais ? 'Eram a mesma palavra' : 'Eram palavras diferentes'}
        </h1>
      </section>

      <ul className="mt-7 flex flex-col gap-2">
        {jogadores.map((j) => {
          const nome = partida.jogadores[j]
          const chute = partida.chutes[j]
          return (
            <li key={nome} className="rounded-2xl bg-envelope p-4 ring-1 ring-vinco">
              <div className="flex items-center gap-3">
                <Avatar nome={nome} indice={j} />
                <span className="min-w-0 flex-1 truncate text-[17px] font-semibold">{nome}</span>
                <span className={`text-[15px] font-bold tabular-nums ${pontos[j] > 0 ? 'text-postal' : 'text-papel-suave/50'}`}>
                  +{pontos[j]}
                </span>
                <span className="w-9 text-right text-[22px] font-extrabold tabular-nums">{placar[nome] ?? 0}</span>
              </div>
              <p className="mt-3 text-[28px] leading-tight font-extrabold tracking-[-0.025em] break-words text-selo">
                {partida.palavras[j]}
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5 text-[13px] font-semibold">
                <Marca certo={apostaCerta(partida, j)}>Apostou “{partida.apostas[j]}”</Marca>
                {chute !== null && <Marca certo={chute}>Chute {chute ? 'certo' : 'errado'}</Marca>}
              </ul>
            </li>
          )
        })}
      </ul>
    </Tela>
  )
}

const Marca = ({ certo, children }: { certo: boolean; children: ReactNode }) => (
  <li
    className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${certo ? 'bg-postal/15 text-postal' : 'bg-aereo/15 text-aereo'}`}
  >
    {certo ? <Check size={14} strokeWidth={3} aria-hidden /> : <X size={14} strokeWidth={3} aria-hidden />}
    {children}
  </li>
)
