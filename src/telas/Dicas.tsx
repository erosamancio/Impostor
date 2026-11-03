import { Avatar } from '../componentes/Avatar'
import { Botao } from '../componentes/Botao'
import { Tela } from '../componentes/Tela'
import type { Partida } from '../jogo/tipos'

type DicasProps = {
  partida: Partida
  aoAvancar: () => void
}

export const Dicas = ({ partida, aoAvancar }: DicasProps) => {
  const { ordem, vezAtual, rodadaAtual, totalRodadas, config } = partida
  const jogadorDaVez = ordem[vezAtual] ?? 0
  const nome = config.jogadores[jogadorDaVez] ?? ''
  const ultimaVez = vezAtual === ordem.length - 1 && rodadaAtual === totalRodadas

  return (
    <Tela
      subtitulo={`Rodada ${rodadaAtual} de ${totalRodadas}`}
      rodape={<Botao onClick={aoAvancar}>{ultimaVez ? 'Ir para a discussão' : 'Próximo'}</Botao>}
    >
      <div key={`${rodadaAtual}-${vezAtual}`} className="animar-entrada flex flex-col items-center gap-3 py-6 text-center">
        <Avatar nome={nome} indice={jogadorDaVez} tamanho="grande" />
        <p className="text-texto-suave">Vez de</p>
        <p className="text-5xl font-black break-words">{nome}</p>
        <p className="max-w-72 text-texto-suave">Diga uma palavra ou frase curta sobre a palavra secreta.</p>
      </div>

      <ol className="mt-4 flex flex-col gap-1">
        {ordem.map((jogador, posicao) => {
          const jaFalou = posicao < vezAtual
          const daVez = posicao === vezAtual
          return (
            <li
              key={jogador}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 ${daVez ? 'bg-superficie-alta' : ''} ${jaFalou ? 'opacity-40' : ''}`}
            >
              <span className="w-5 text-right text-sm font-bold text-texto-suave tabular-nums">{posicao + 1}</span>
              <Avatar nome={config.jogadores[jogador] ?? ''} indice={jogador} />
              <span className="flex-1 truncate font-bold">{config.jogadores[jogador]}</span>
              {jaFalou && <span aria-label="já falou">✓</span>}
            </li>
          )
        })}
      </ol>
    </Tela>
  )
}
