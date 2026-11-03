import { useState } from 'react'
import { Avatar } from '../componentes/Avatar'
import { Botao } from '../componentes/Botao'
import { CartaoSecreto, PalavraSecreta } from '../componentes/CartaoSecreto'
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

type TelaDaDuplaProps = {
  partida: PartidaDupla
  placar: Placar
  aoAvancar: (acao: AcaoDupla) => void
  aoJogarDeNovo: () => void
  aoSair: () => void
}

export const TelaDaDupla = ({ partida, placar, aoAvancar, aoJogarDeNovo, aoSair }: TelaDaDuplaProps) => {
  switch (partida.etapa) {
    case 'revelacao':
      return <RevelacaoDupla partida={partida} aoConcluir={() => aoAvancar({ tipo: 'proximaRevelacao' })} />
    case 'dicas':
      return <DicasDupla partida={partida} aoAvancar={() => aoAvancar({ tipo: 'proximaVez' })} />
    case 'votacao':
      return <ApostaDupla key={partida.votanteAtual} partida={partida} aoApostar={(aposta) => aoAvancar({ tipo: 'apostar', aposta })} />
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
  return (
    <PassarCelular
      key={jogador}
      nome={nome}
      indice={jogador}
      progresso={`Jogador ${jogador + 1} de 2`}
      aviso="Só você pode ver a sua palavra."
    >
      <CartaoSecreto nome={nome} aoConcluir={aoConcluir}>
        <PalavraSecreta palavra={partida.palavras[jogador]} temaNome={partida.temaNome} />
        <span className="mt-2 text-sm text-texto-suave">A palavra do outro pode ser igual ou só parecida.</span>
      </CartaoSecreto>
    </PassarCelular>
  )
}

const DicasDupla = ({ partida, aoAvancar }: { partida: PartidaDupla; aoAvancar: () => void }) => {
  const falando = jogadorDaVez(partida)
  const nome = partida.jogadores[falando]
  const ultimaVez = partida.vezAtual === 1 && partida.rodadaAtual === partida.totalRodadas

  return (
    <Tela
      subtitulo={`Rodada ${partida.rodadaAtual} de ${partida.totalRodadas}`}
      rodape={<Botao onClick={aoAvancar}>{ultimaVez ? 'Hora de apostar' : 'Próximo'}</Botao>}
    >
      <div
        key={`${partida.rodadaAtual}-${partida.vezAtual}`}
        className="animar-entrada flex flex-1 flex-col items-center justify-center gap-3 text-center"
      >
        <Avatar nome={nome} indice={falando} tamanho="grande" />
        <p className="text-texto-suave">Vez de</p>
        <p className="text-5xl font-black break-words">{nome}</p>
        <p className="max-w-72 text-texto-suave">
          Dê uma dica sobre a sua palavra. Clara demais entrega tudo; vaga demais levanta suspeita.
        </p>
      </div>
    </Tela>
  )
}

const ApostaDupla = ({ partida, aoApostar }: { partida: PartidaDupla; aoApostar: (aposta: Aposta) => void }) => {
  const votante = partida.votanteAtual
  const nome = partida.jogadores[votante]
  const [aposta, setAposta] = useState<Aposta | null>(null)

  return (
    <PassarCelular nome={nome} indice={votante} progresso={`Aposta ${votante + 1} de 2`} aviso="A aposta é secreta.">
      <Tela
        titulo={`Sua aposta, ${nome}`}
        subtitulo={`A palavra de ${partida.jogadores[outro(votante)]} é igual à sua?`}
        rodape={
          <Botao disabled={aposta === null} onClick={() => aposta && aoApostar(aposta)}>
            Confirmar aposta
          </Botao>
        }
      >
        <div className="grid flex-1 grid-cols-1 content-center gap-3">
          <OpcaoDeAposta emoji="🤝" rotulo="Iguais" ativa={aposta === 'iguais'} aoEscolher={() => setAposta('iguais')} />
          <OpcaoDeAposta emoji="🔀" rotulo="Diferentes" ativa={aposta === 'diferentes'} aoEscolher={() => setAposta('diferentes')} />
        </div>
      </Tela>
    </PassarCelular>
  )
}

type OpcaoDeApostaProps = { emoji: string; rotulo: string; ativa: boolean; aoEscolher: () => void }

const OpcaoDeAposta = ({ emoji, rotulo, ativa, aoEscolher }: OpcaoDeApostaProps) => (
  <button
    type="button"
    aria-pressed={ativa}
    onClick={aoEscolher}
    className={`flex min-h-28 flex-col items-center justify-center gap-1 rounded-3xl border-2 text-2xl font-black transition-colors ${
      ativa ? 'border-destaque bg-destaque/10' : 'border-borda bg-superficie'
    }`}
  >
    <span className="text-4xl" aria-hidden>
      {emoji}
    </span>
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
      rodape={
        revelada ? (
          <div className="grid grid-cols-2 gap-3">
            <Botao onClick={() => aoRegistrar(true)}>Acertou</Botao>
            <Botao variante="secundario" onClick={() => aoRegistrar(false)}>
              Errou
            </Botao>
          </div>
        ) : (
          <Botao onClick={() => setRevelada(true)}>Já chutou, revelar</Botao>
        )
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <Avatar nome={nome} indice={quemChuta} tamanho="grande" />
        <p className="text-3xl font-black">Eram diferentes mesmo!</p>
        {revelada ? (
          <div className="animar-entrada mt-2 flex flex-col items-center gap-1">
            <p className="text-texto-suave">A palavra de {nomeAlvo} era</p>
            <p className="text-5xl font-black break-words text-destaque">{partida.palavras[alvo]}</p>
            <p className="mt-3 text-texto-suave">O chute de {nome} estava certo?</p>
          </div>
        ) : (
          <p className="max-w-72 text-lg text-texto-suave">
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
      <div className="rounded-3xl bg-superficie p-6 text-center">
        <p className="text-5xl" aria-hidden>
          {iguais ? '🤝' : '🔀'}
        </p>
        <h1 className="mt-2 text-3xl font-black">{iguais ? 'As palavras eram iguais' : 'As palavras eram diferentes'}</h1>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {jogadores.map((j) => {
          const nome = partida.jogadores[j]
          const acertouAposta = apostaCerta(partida, j)
          const chute = partida.chutes[j]
          return (
            <li key={nome} className="rounded-2xl bg-superficie p-4">
              <div className="flex items-center gap-3">
                <Avatar nome={nome} indice={j} />
                <span className="flex-1 truncate text-lg font-bold">{nome}</span>
                <span className={`text-sm font-bold ${pontos[j] > 0 ? 'text-sucesso' : 'text-texto-suave/50'}`}>+{pontos[j]}</span>
                <span className="w-8 text-right text-xl font-black tabular-nums">{placar[nome] ?? 0}</span>
              </div>
              <p className="mt-2 text-2xl font-black break-words text-destaque">{partida.palavras[j]}</p>
              <p className="mt-1 text-sm text-texto-suave">
                Apostou “{partida.apostas[j]}” {acertouAposta ? '✓' : '✗'}
                {chute !== null && ` · chute ${chute ? 'certo ✓' : 'errado ✗'}`}
              </p>
            </li>
          )
        })}
      </ul>
    </Tela>
  )
}
