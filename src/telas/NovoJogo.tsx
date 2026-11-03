import { useState, type FormEvent, type ReactNode } from 'react'
import { Avatar } from '../componentes/Avatar'
import { Botao } from '../componentes/Botao'
import { Tela } from '../componentes/Tela'
import { MAX_JOGADORES, MAX_RODADAS, MIN_JOGADORES, MIN_RODADAS, type Configuracao } from '../jogo/tipos'
import { TEMAS } from '../temas'

type NovoJogoProps = {
  configInicial: Configuracao
  aoComecar: (config: Configuracao) => void
  aoVoltar: () => void
}

export const NovoJogo = ({ configInicial, aoComecar, aoVoltar }: NovoJogoProps) => {
  const [config, setConfig] = useState(configInicial)
  const [novoNome, setNovoNome] = useState('')

  const atualizar = (parcial: Partial<Configuracao>) => setConfig((atual) => ({ ...atual, ...parcial }))

  const nomeNormalizado = novoNome.trim()
  const nomeRepetido = config.jogadores.some((j) => j.toLowerCase() === nomeNormalizado.toLowerCase())
  const podeAdicionar = nomeNormalizado.length > 0 && !nomeRepetido && config.jogadores.length < MAX_JOGADORES

  const adicionarJogador = (evento: FormEvent) => {
    evento.preventDefault()
    if (!podeAdicionar) return
    atualizar({ jogadores: [...config.jogadores, nomeNormalizado] })
    setNovoNome('')
  }

  const removerJogador = (nome: string) => atualizar({ jogadores: config.jogadores.filter((j) => j !== nome) })

  const alternarTema = (id: string) => {
    const selecionado = config.temaIds.includes(id)
    atualizar({ temaIds: selecionado ? config.temaIds.filter((t) => t !== id) : [...config.temaIds, id] })
  }

  const faltamJogadores = Math.max(0, MIN_JOGADORES - config.jogadores.length)
  const podeComecar = faltamJogadores === 0 && config.temaIds.length > 0

  return (
    <Tela
      titulo="Novo jogo"
      aoVoltar={aoVoltar}
      rodape={
        <Botao disabled={!podeComecar} onClick={() => aoComecar(config)}>
          {faltamJogadores > 0
            ? `Adicione mais ${faltamJogadores} ${faltamJogadores === 1 ? 'jogador' : 'jogadores'}`
            : config.temaIds.length === 0
              ? 'Escolha um tema'
              : 'Começar'}
        </Botao>
      }
    >
      <Secao titulo={`Jogadores (${config.jogadores.length})`}>
        <ul className="flex flex-col gap-2">
          {config.jogadores.map((nome, i) => (
            <li key={nome} className="flex items-center gap-3 rounded-2xl bg-superficie py-2 pr-2 pl-3">
              <Avatar nome={nome} indice={i} />
              <span className="min-w-0 flex-1 truncate text-lg font-bold">{nome}</span>
              <button
                type="button"
                onClick={() => removerJogador(nome)}
                aria-label={`Remover ${nome}`}
                className="flex size-10 items-center justify-center rounded-full text-xl text-texto-suave active:bg-superficie-alta"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={adicionarJogador} className="mt-2 flex gap-2">
          <input
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Nome do jogador"
            maxLength={16}
            enterKeyHint="done"
            autoCapitalize="words"
            className="min-h-12 min-w-0 flex-1 rounded-2xl border border-borda bg-superficie px-4 text-lg outline-none placeholder:text-texto-suave/60 focus:border-destaque"
          />
          <button
            type="submit"
            disabled={!podeAdicionar}
            className="min-h-12 rounded-2xl bg-superficie-alta px-5 text-lg font-extrabold disabled:opacity-40"
          >
            Adicionar
          </button>
        </form>
        {nomeRepetido && nomeNormalizado && <p className="mt-2 text-sm text-perigo">Esse nome já está na lista.</p>}
      </Secao>

      <Secao titulo="Tema">
        <div className="grid grid-cols-2 gap-2">
          {TEMAS.map((tema) => {
            const ativo = config.temaIds.includes(tema.id)
            return (
              <button
                key={tema.id}
                type="button"
                aria-pressed={ativo}
                onClick={() => alternarTema(tema.id)}
                className={`flex flex-col items-start gap-1 rounded-2xl border-2 p-3 text-left transition-colors ${ativo ? 'border-destaque bg-destaque/10' : 'border-borda bg-superficie'}`}
              >
                <span className="text-3xl">{tema.emoji}</span>
                <span className="font-extrabold leading-tight">{tema.nome}</span>
                <span className="text-xs text-texto-suave">{tema.palavras.length} palavras</span>
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-sm text-texto-suave">Mais temas chegam nas próximas versões.</p>
      </Secao>

      <Secao titulo="Rodadas de dicas">
        <div className="flex items-center justify-between rounded-2xl bg-superficie p-2">
          <BotaoPasso rotulo="Menos rodadas" disabled={config.rodadas <= MIN_RODADAS} onClick={() => atualizar({ rodadas: config.rodadas - 1 })}>
            −
          </BotaoPasso>
          <span className="text-2xl font-black tabular-nums">{config.rodadas}</span>
          <BotaoPasso rotulo="Mais rodadas" disabled={config.rodadas >= MAX_RODADAS} onClick={() => atualizar({ rodadas: config.rodadas + 1 })}>
            +
          </BotaoPasso>
        </div>
      </Secao>

      <Secao titulo="Dica para o impostor">
        <Alternador
          opcoes={[
            { valor: 'tema', rotulo: 'Ver o tema' },
            { valor: 'nenhuma', rotulo: 'Nenhuma' },
          ]}
          valor={config.dicaImpostor}
          aoMudar={(dicaImpostor) => atualizar({ dicaImpostor })}
        />
      </Secao>

      <Secao titulo="Votação">
        <Alternador
          opcoes={[
            { valor: 'secreta', rotulo: 'Secreta' },
            { valor: 'grupo', rotulo: 'Em grupo' },
          ]}
          valor={config.modoVotacao}
          aoMudar={(modoVotacao) => atualizar({ modoVotacao })}
        />
        <p className="mt-2 text-sm text-texto-suave">
          {config.modoVotacao === 'secreta'
            ? 'Cada um vota escondido, passando o celular.'
            : 'Vocês conversam e escolhem juntos um suspeito.'}
        </p>
      </Secao>
    </Tela>
  )
}

const Secao = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <section className="mb-6">
    <h2 className="mb-2 text-sm font-extrabold tracking-wider text-texto-suave uppercase">{titulo}</h2>
    {children}
  </section>
)

type BotaoPassoProps = { rotulo: string; disabled: boolean; onClick: () => void; children: ReactNode }

const BotaoPasso = ({ rotulo, disabled, onClick, children }: BotaoPassoProps) => (
  <button
    type="button"
    aria-label={rotulo}
    disabled={disabled}
    onClick={onClick}
    className="flex size-12 items-center justify-center rounded-xl bg-superficie-alta text-2xl font-black active:scale-95 disabled:opacity-30"
  >
    {children}
  </button>
)

type AlternadorProps<T extends string> = {
  opcoes: readonly { valor: T; rotulo: string }[]
  valor: T
  aoMudar: (valor: T) => void
}

const Alternador = <T extends string>({ opcoes, valor, aoMudar }: AlternadorProps<T>) => (
  <div className="grid grid-flow-col gap-1 rounded-2xl bg-superficie p-1">
    {opcoes.map((opcao) => (
      <button
        key={opcao.valor}
        type="button"
        aria-pressed={opcao.valor === valor}
        onClick={() => aoMudar(opcao.valor)}
        className={`min-h-11 rounded-xl font-extrabold transition-colors ${opcao.valor === valor ? 'bg-destaque text-fundo' : 'text-texto-suave'}`}
      >
        {opcao.rotulo}
      </button>
    ))}
  </div>
)
