import { Crosshair } from 'lucide-react'
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
      titulo={partida.impostores.length > 1 ? 'Quem é um impostor?' : 'Quem é o impostor?'}
      subtitulo="Decidam juntos e escolham um suspeito."
      jogadores={partida.config.jogadores}
      aoConfirmar={aoAcusarEmGrupo}
      rotuloConfirmar="Acusar"
    />
  )

const VotoSecreto = ({ partida, aoVotar }: { partida: Partida; aoVotar: (acusado: number) => void }) => {
  const votante = partida.votanteAtual
  const nome = partida.config.jogadores[votante] ?? ''
  const etapa = `Voto ${votante + 1} de ${partida.config.jogadores.length}`

  return (
    <PassarCelular nome={nome} indice={votante} etapa={etapa} aviso="O voto é secreto.">
      <EscolhaDoSuspeito
        titulo={`Seu voto, ${nome}`}
        subtitulo="Em quem você vota como impostor?"
        etapa={etapa}
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
  etapa?: string
  jogadores: readonly string[]
  excluido?: number
  aoConfirmar: (acusado: number) => void
  rotuloConfirmar: string
}

const EscolhaDoSuspeito = ({
  titulo,
  subtitulo,
  etapa,
  jogadores,
  excluido,
  aoConfirmar,
  rotuloConfirmar,
}: EscolhaDoSuspeitoProps) => {
  const [escolhido, setEscolhido] = useState<number | null>(null)

  return (
    <Tela
      titulo={titulo}
      subtitulo={subtitulo}
      etapa={etapa}
      rodape={
        <Botao
          variante="perigo"
          disabled={escolhido === null}
          onClick={() => escolhido !== null && aoConfirmar(escolhido)}
        >
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
                className={`flex min-h-16 w-full items-center gap-3 rounded-2xl px-3 text-left text-[19px] font-bold ring-inset transition-[background-color,box-shadow] duration-150 ${
                  escolhido === i ? 'bg-aereo/12 ring-2 ring-aereo' : 'bg-envelope ring-1 ring-vinco'
                }`}
              >
                <Avatar nome={nome} indice={i} tamanho="medio" />
                <span className="min-w-0 flex-1 truncate">{nome}</span>
                {escolhido === i && <Crosshair size={24} strokeWidth={2.25} className="text-aereo" aria-hidden />}
              </button>
            </li>
          ),
        )}
      </ul>
    </Tela>
  )
}
