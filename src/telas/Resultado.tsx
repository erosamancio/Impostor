import { Avatar } from '../componentes/Avatar'
import { Botao } from '../componentes/Botao'
import { Tela } from '../componentes/Tela'
import type { Placar } from '../jogo/armazenamento'
import { calcularPontos, contarVotos, definirVencedor } from '../jogo/partida'
import type { Partida } from '../jogo/tipos'

type ResultadoProps = {
  partida: Partida
  placar: Placar
  aoJogarDeNovo: () => void
  aoSair: () => void
}

export const Resultado = ({ partida, placar, aoJogarDeNovo, aoSair }: ResultadoProps) => {
  const { jogadores } = partida.config
  const vencedor = definirVencedor(partida)
  const pontos = calcularPontos(partida)
  const nomeImpostor = jogadores[partida.impostor] ?? ''
  const votos = partida.config.modoVotacao === 'secreta' ? contarVotos(partida.votos) : null
  const classificacao = jogadores
    .map((nome, indice) => ({ nome, indice, total: placar[nome] ?? 0, ganhou: pontos[indice] ?? 0 }))
    .sort((a, b) => b.total - a.total)

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
      <div
        className={`rounded-3xl p-6 text-center ${vencedor === 'impostor' ? 'bg-perigo/15' : 'bg-sucesso/15'}`}
      >
        <p className="text-5xl" aria-hidden>
          {vencedor === 'impostor' ? '😈' : '🎉'}
        </p>
        <h1 className="mt-2 text-3xl font-black">
          {vencedor === 'impostor' ? 'O impostor venceu!' : 'O grupo venceu!'}
        </h1>
        <p className="mt-2 text-texto-suave">{explicarDesfecho(partida, nomeImpostor)}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Info rotulo="Palavra" valor={partida.palavra} destaque="text-destaque" />
        <Info rotulo="Impostor" valor={nomeImpostor} destaque="text-perigo" />
      </div>

      <h2 className="mt-6 mb-2 text-sm font-extrabold tracking-wider text-texto-suave uppercase">Placar</h2>
      <ol className="flex flex-col gap-1">
        {classificacao.map(({ nome, indice, total, ganhou }) => (
          <li key={nome} className="flex items-center gap-3 rounded-xl bg-superficie px-3 py-2">
            <Avatar nome={nome} indice={indice} />
            <span className="flex-1 truncate font-bold">
              {nome}
              {indice === partida.impostor && <span className="ml-2 text-xs text-perigo">impostor</span>}
            </span>
            {votos && (
              <span className="text-xs text-texto-suave">
                {votos.get(indice) ?? 0} {votos.get(indice) === 1 ? 'voto' : 'votos'}
              </span>
            )}
            <span className={`w-8 text-right text-sm font-bold ${ganhou > 0 ? 'text-sucesso' : 'text-texto-suave/50'}`}>
              +{ganhou}
            </span>
            <span className="w-8 text-right text-xl font-black tabular-nums">{total}</span>
          </li>
        ))}
      </ol>
    </Tela>
  )
}

const explicarDesfecho = (partida: Partida, nomeImpostor: string): string => {
  if (partida.acusado === null) return 'Deu empate na votação e ninguém foi acusado.'
  const nomeAcusado = partida.config.jogadores[partida.acusado] ?? ''
  if (partida.acusado !== partida.impostor) return `Acusaram ${nomeAcusado}, mas era inocente.`
  return partida.chuteCerto
    ? `Pegaram ${nomeImpostor}, mas o chute da palavra estava certo.`
    : `Pegaram ${nomeImpostor} e o chute da palavra estava errado.`
}

const Info = ({ rotulo, valor, destaque }: { rotulo: string; valor: string; destaque: string }) => (
  <div className="rounded-2xl bg-superficie p-3 text-center">
    <p className="text-xs font-bold tracking-wider text-texto-suave uppercase">{rotulo}</p>
    <p className={`mt-1 text-xl font-black break-words ${destaque}`}>{valor}</p>
  </div>
)
