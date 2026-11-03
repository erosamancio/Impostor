import { Avatar } from '../componentes/Avatar'
import { Botao } from '../componentes/Botao'
import { Carimbo } from '../componentes/Carimbo'
import { Tela } from '../componentes/Tela'
import type { Placar } from '../jogo/armazenamento'
import { calcularPontos, contarVotos, definirVencedor, ehImpostor } from '../jogo/partida'
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
  const varios = partida.impostores.length > 1
  const nomesImpostores = partida.impostores.map((i) => jogadores[i] ?? '')
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
      <section className="flex flex-col items-center pt-4 text-center">
        <Carimbo
          linhas={vencedor === 'grupo' ? ['VITÓRIA DO', 'GRUPO'] : ['VITÓRIA DO', varios ? 'IMPOSTORES' : 'IMPOSTOR']}
          cor={vencedor === 'grupo' ? 'postal' : 'aereo'}
        />
        <h1 className="mt-6 text-[34px] leading-none font-extrabold tracking-[-0.035em]">
          {vencedor === 'grupo' ? 'O grupo venceu' : varios ? 'Os impostores venceram' : 'O impostor venceu'}
        </h1>
        <p className="mt-3 max-w-80 text-[17px] leading-snug text-papel-suave">{explicarDesfecho(partida)}</p>
      </section>

      <dl className="mt-7 grid grid-cols-2 gap-2">
        <Info rotulo="A palavra" valor={partida.palavra} classe="text-selo" />
        <Info rotulo={varios ? 'Impostores' : 'Impostor'} valor={nomesImpostores.join(' e ')} classe="text-aereo" />
        {partida.palavraDisfarce && (
          <div className="col-span-2">
            <Info rotulo="Disfarce dos impostores" valor={partida.palavraDisfarce} classe="text-papel" />
          </div>
        )}
      </dl>

      <section aria-labelledby="titulo-placar" className="mt-7">
        <h2 id="titulo-placar" className="mb-2 text-[15px] font-bold text-papel-suave">
          Placar da noite
        </h2>
        <ol className="flex flex-col gap-1.5">
          {classificacao.map(({ nome, indice, total, ganhou }) => (
            <li key={nome} className="flex min-h-14 items-center gap-3 rounded-xl bg-envelope px-3 ring-1 ring-vinco">
              <Avatar nome={nome} indice={indice} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[17px] font-semibold">{nome}</span>
                {(ehImpostor(partida, indice) || votos) && (
                  <span className="text-[13px] text-papel-suave">
                    {ehImpostor(partida, indice) && <span className="font-bold text-aereo">impostor</span>}
                    {ehImpostor(partida, indice) && votos && ' · '}
                    {votos && `${votos.get(indice) ?? 0} ${votos.get(indice) === 1 ? 'voto' : 'votos'}`}
                  </span>
                )}
              </span>
              <span
                className={`w-9 text-right text-[15px] font-bold tabular-nums ${ganhou > 0 ? 'text-postal' : 'text-papel-suave/50'}`}
              >
                +{ganhou}
              </span>
              <span className="w-9 text-right text-[22px] font-extrabold tabular-nums">{total}</span>
            </li>
          ))}
        </ol>
      </section>
    </Tela>
  )
}

const explicarDesfecho = (partida: Partida): string => {
  if (partida.acusado === null) return 'Deu empate na votação e ninguém foi acusado.'
  const nomeAcusado = partida.config.jogadores[partida.acusado] ?? ''
  if (!ehImpostor(partida, partida.acusado)) return `Acusaram ${nomeAcusado}, mas era inocente.`
  return partida.chuteCerto
    ? `Pegaram ${nomeAcusado}, mas o chute da palavra estava certo.`
    : `Pegaram ${nomeAcusado} e o chute da palavra estava errado.`
}

const Info = ({ rotulo, valor, classe }: { rotulo: string; valor: string; classe: string }) => (
  <div className="h-full rounded-2xl bg-envelope p-4 ring-1 ring-vinco">
    <dt className="text-[13px] font-semibold text-papel-suave">{rotulo}</dt>
    <dd className={`mt-1 text-[22px] leading-tight font-extrabold tracking-[-0.02em] break-words ${classe}`}>{valor}</dd>
  </div>
)
