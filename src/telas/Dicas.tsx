import { Check } from 'lucide-react'
import { Avatar } from '../componentes/Avatar'
import { Botao } from '../componentes/Botao'
import { Cronometro } from '../componentes/Cronometro'
import { Tela } from '../componentes/Tela'
import type { Partida } from '../jogo/tipos'

type DicasProps = {
  partida: Partida
  aoAvancar: () => void
}

export const Dicas = ({ partida, aoAvancar }: DicasProps) => {
  const { ordem, vezAtual, rodadaAtual, totalRodadas, config } = partida
  const jogadorDaVez = ordem[vezAtual] ?? 0
  const ultimaVez = vezAtual === ordem.length - 1 && rodadaAtual === totalRodadas
  const chave = `${rodadaAtual}-${vezAtual}`

  return (
    <Tela
      etapa={`Rodada ${rodadaAtual} de ${totalRodadas}`}
      rodape={<Botao onClick={aoAvancar}>{ultimaVez ? 'Ir para a discussão' : 'Próximo'}</Botao>}
    >
      <VezDe key={chave} nome={config.jogadores[jogadorDaVez] ?? ''} indice={jogadorDaVez} />
      {config.tempoDica > 0 && (
        <div className="mt-6">
          <Cronometro key={chave} segundos={config.tempoDica} />
        </div>
      )}
      <OrdemDeFala jogadores={config.jogadores} ordem={ordem} vezAtual={vezAtual} />
    </Tela>
  )
}

export const VezDe = ({ nome, indice, texto }: { nome: string; indice: number; texto?: string }) => (
  <div className="animar-entrada flex items-center gap-4 pt-2">
    <Avatar nome={nome} indice={indice} tamanho="grande" />
    <div className="min-w-0">
      <p className="text-[15px] font-semibold text-papel-suave">Vez de</p>
      <p className="text-[44px] leading-none font-extrabold tracking-[-0.04em] break-words">{nome}</p>
      <p className="mt-2 text-[15px] leading-snug text-papel-suave">
        {texto ?? 'Diga uma palavra ou frase curta sobre a palavra secreta.'}
      </p>
    </div>
  </div>
)

type OrdemDeFalaProps = { jogadores: readonly string[]; ordem: readonly number[]; vezAtual: number }

export const OrdemDeFala = ({ jogadores, ordem, vezAtual }: OrdemDeFalaProps) => (
  <section aria-label="Ordem de fala" className="mt-8">
    <h2 className="mb-2 text-[15px] font-bold text-papel-suave">Ordem de fala</h2>
    <ol className="flex flex-col gap-1">
      {ordem.map((jogador, posicao) => {
        const jaFalou = posicao < vezAtual
        const daVez = posicao === vezAtual
        return (
          <li
            key={jogador}
            aria-current={daVez ? 'step' : undefined}
            className={`flex min-h-12 items-center gap-3 rounded-xl px-3 transition-opacity ${
              daVez ? 'bg-envelope ring-1 ring-vinco' : ''
            } ${jaFalou ? 'opacity-45' : ''}`}
          >
            <span className="w-5 text-right text-sm font-bold text-papel-suave tabular-nums">{posicao + 1}</span>
            <Avatar nome={jogadores[jogador] ?? ''} indice={jogador} />
            <span className="min-w-0 flex-1 truncate text-[17px] font-semibold">{jogadores[jogador]}</span>
            {jaFalou && <Check size={18} strokeWidth={2.5} className="text-postal" aria-label="já falou" />}
            {daVez && <span className="text-sm font-bold text-selo">falando</span>}
          </li>
        )
      })}
    </ol>
  </section>
)
