import { useState } from 'react'
import { Avatar } from '../componentes/Avatar'
import { Botao } from '../componentes/Botao'
import { PassarCelular } from '../componentes/PassarCelular'
import { Tela } from '../componentes/Tela'
import type { Partida } from '../jogo/tipos'

type VotacaoProps = {
  partida: Partida
  aoVotar: (acusado: number) => void
  aoAcusarEmGrupo: (acusado: number) => void
}

export const Votacao = ({ partida, aoVotar, aoAcusarEmGrupo }: VotacaoProps) =>
  partida.config.modoVotacao === 'secreta' ? (
    <VotoSecreto key={partida.votanteAtual} partida={partida} aoVotar={aoVotar} />
  ) : (
    <EscolhaDoSuspeito
      titulo="Quem é o impostor?"
      subtitulo="Decidam juntos e escolham um suspeito."
      jogadores={partida.config.jogadores}
      aoConfirmar={aoAcusarEmGrupo}
      rotuloConfirmar="Acusar"
    />
  )

const VotoSecreto = ({ partida, aoVotar }: { partida: Partida; aoVotar: (acusado: number) => void }) => {
  const votante = partida.votanteAtual
  const nome = partida.config.jogadores[votante] ?? ''

  return (
    <PassarCelular
      nome={nome}
      indice={votante}
      progresso={`Voto ${votante + 1} de ${partida.config.jogadores.length}`}
      aviso="O voto é secreto."
    >
      <EscolhaDoSuspeito
        titulo={`Seu voto, ${nome}`}
        subtitulo="Em quem você vota como impostor?"
        jogadores={partida.config.jogadores}
        excluido={votante}
        aoConfirmar={aoVotar}
        rotuloConfirmar="Confirmar voto"
      />
    </PassarCelular>
  )
}

type EscolhaDoSuspeitoProps = {
  titulo: string
  subtitulo: string
  jogadores: readonly string[]
  excluido?: number
  aoConfirmar: (acusado: number) => void
  rotuloConfirmar: string
}

const EscolhaDoSuspeito = ({ titulo, subtitulo, jogadores, excluido, aoConfirmar, rotuloConfirmar }: EscolhaDoSuspeitoProps) => {
  const [escolhido, setEscolhido] = useState<number | null>(null)

  return (
    <Tela
      titulo={titulo}
      subtitulo={subtitulo}
      rodape={
        <Botao disabled={escolhido === null} onClick={() => escolhido !== null && aoConfirmar(escolhido)}>
          {rotuloConfirmar}
        </Botao>
      }
    >
      <ul className="flex flex-col gap-2">
        {jogadores.map((nome, i) =>
          i === excluido ? null : (
            <li key={nome}>
              <button
                type="button"
                aria-pressed={escolhido === i}
                onClick={() => setEscolhido(i)}
                className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-3 text-left text-lg font-bold transition-colors ${
                  escolhido === i ? 'border-perigo bg-perigo/15' : 'border-transparent bg-superficie'
                }`}
              >
                <Avatar nome={nome} indice={i} />
                <span className="flex-1 truncate">{nome}</span>
                {escolhido === i && <span aria-hidden>👉</span>}
              </button>
            </li>
          ),
        )}
      </ul>
    </Tela>
  )
}
