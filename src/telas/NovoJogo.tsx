import {
  Briefcase,
  Building2,
  Check,
  Globe2,
  MapPinned,
  Minus,
  PawPrint,
  Plus,
  Trophy,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Avatar } from '../componentes/Avatar'
import { Botao } from '../componentes/Botao'
import { Tela } from '../componentes/Tela'
import {
  JOGADORES_DUPLA,
  MAX_JOGADORES,
  MAX_RODADAS,
  MIN_JOGADORES,
  MIN_RODADAS,
  TEMPOS_DICA,
  maxImpostores,
  type Configuracao,
} from '../jogo/tipos'
import { TEMAS } from '../temas'

const ICONES_DOS_TEMAS: Record<string, LucideIcon> = {
  'comidas-e-bebidas': UtensilsCrossed,
  paises: Globe2,
  'lugares-do-brasil': MapPinned,
  'lugares-da-cidade': Building2,
  animais: PawPrint,
  profissoes: Briefcase,
  esportes: Trophy,
}

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

  const todosSelecionados = config.temaIds.length === TEMAS.length
  const ehDupla = config.modo === 'dupla'
  const minimo = ehDupla ? JOGADORES_DUPLA : MIN_JOGADORES
  const maximo = ehDupla ? JOGADORES_DUPLA : MAX_JOGADORES
  const faltamJogadores = Math.max(0, minimo - config.jogadores.length)
  const sobramJogadores = Math.max(0, config.jogadores.length - maximo)
  const podeComecar = faltamJogadores === 0 && sobramJogadores === 0 && config.temaIds.length > 0
  const limiteImpostores = maxImpostores(Math.max(config.jogadores.length, MIN_JOGADORES))
  const impostores = Math.min(config.impostores, limiteImpostores)

  const rotuloDoBotao =
    faltamJogadores > 0
      ? `Adicione mais ${faltamJogadores} ${faltamJogadores === 1 ? 'jogador' : 'jogadores'}`
      : sobramJogadores > 0
        ? `A dupla é só para 2: remova ${sobramJogadores}`
        : config.temaIds.length === 0
          ? 'Escolha pelo menos um tema'
          : 'Começar'

  return (
    <Tela
      titulo="Novo jogo"
      aoVoltar={aoVoltar}
      rodape={
        <Botao disabled={!podeComecar} onClick={() => aoComecar({ ...config, impostores })}>
          {rotuloDoBotao}
        </Botao>
      }
    >
      <Secao titulo="Modo">
        <div className="grid grid-cols-2 gap-2.5">
          <CartaoDeModo
            ativo={!ehDupla}
            titulo="Clássico"
            descricao="3 ou mais. Todos sabem a palavra, menos o impostor."
            aoEscolher={() => atualizar({ modo: 'classico' })}
          />
          <CartaoDeModo
            ativo={ehDupla}
            titulo="Dupla"
            descricao="Só 2. Palavras iguais ou parecidas: quem percebe?"
            aoEscolher={() => atualizar({ modo: 'dupla' })}
          />
        </div>
      </Secao>

      <Secao titulo="Jogadores" contagem={`${config.jogadores.length}${ehDupla ? ' de 2' : ''}`}>
        {config.jogadores.length > 0 && (
          <ul className="mb-2.5 flex flex-col gap-1.5">
            {config.jogadores.map((nome, i) => (
              <li key={nome} className="flex items-center gap-3 rounded-xl bg-envelope py-1.5 pr-1.5 pl-2 ring-1 ring-vinco">
                <Avatar nome={nome} indice={i} />
                <span className="min-w-0 flex-1 truncate text-[17px] font-semibold">{nome}</span>
                <button
                  type="button"
                  onClick={() => removerJogador(nome)}
                  aria-label={`Remover ${nome}`}
                  className="flex size-10 items-center justify-center rounded-full text-papel-suave active:bg-envelope-alto"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={adicionarJogador} className="flex gap-2">
          <label className="sr-only" htmlFor="novo-jogador">
            Nome do jogador
          </label>
          <input
            id="novo-jogador"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Nome do jogador"
            maxLength={16}
            enterKeyHint="done"
            autoCapitalize="words"
            autoComplete="off"
            className="min-h-12 min-w-0 flex-1 rounded-xl bg-envelope px-4 text-[17px] ring-1 ring-vinco outline-none placeholder:text-papel-suave/75 focus:ring-2 focus:ring-selo"
          />
          <button
            type="submit"
            disabled={!podeAdicionar}
            aria-label="Adicionar jogador"
            className="flex min-h-12 items-center gap-1.5 rounded-xl bg-envelope-alto px-4 text-[17px] font-bold ring-1 ring-vinco transition-opacity disabled:opacity-35"
          >
            <Plus size={18} strokeWidth={2.5} />
            Adicionar
          </button>
        </form>
        {nomeRepetido && nomeNormalizado && <p className="mt-2 text-sm text-aereo">Esse nome já está na lista.</p>}
      </Secao>

      <Secao
        titulo="Temas"
        contagem={`${config.temaIds.length} de ${TEMAS.length}`}
        acao={
          <button
            type="button"
            onClick={() => atualizar({ temaIds: todosSelecionados ? [] : TEMAS.map((t) => t.id) })}
            className="-mr-2 min-h-9 rounded-full px-2 text-[15px] font-semibold text-selo active:bg-envelope"
          >
            {todosSelecionados ? 'Limpar' : 'Marcar todos'}
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-2.5">
          {TEMAS.map((tema) => (
            <SeloDeTema
              key={tema.id}
              nome={tema.nome}
              total={tema.palavras.length}
              Icone={ICONES_DOS_TEMAS[tema.id] ?? Globe2}
              ativo={config.temaIds.includes(tema.id)}
              aoAlternar={() => alternarTema(tema.id)}
            />
          ))}
        </div>
        {config.temaIds.length > 1 && (
          <p className="mt-2.5 text-sm text-papel-suave">A palavra é sorteada entre todos os temas marcados.</p>
        )}
      </Secao>

      <Secao titulo="Palavras">
        <Alternador
          rotulo="Dificuldade das palavras"
          opcoes={[
            { valor: 'facil', rotulo: 'Fáceis' },
            { valor: 'medio', rotulo: 'Até médias' },
            { valor: 'todos', rotulo: 'Todas' },
          ]}
          valor={config.nivel}
          aoMudar={(nivel) => atualizar({ nivel })}
        />
      </Secao>

      <Secao titulo="Dicas">
        <div className="flex flex-col gap-2.5">
          <Contador
            rotulo="Rodadas"
            valor={config.rodadas}
            minimo={MIN_RODADAS}
            maximo={MAX_RODADAS}
            aoMudar={(rodadas) => atualizar({ rodadas })}
          />
          <Alternador
            rotulo="Tempo por dica"
            opcoes={TEMPOS_DICA.map((s) => ({ valor: String(s), rotulo: s === 0 ? 'Livre' : `${s}s` }))}
            valor={String(config.tempoDica)}
            aoMudar={(valor) => atualizar({ tempoDica: Number(valor) })}
          />
        </div>
      </Secao>

      {!ehDupla && (
        <>
          <Secao titulo="Impostores">
            <div className="flex flex-col gap-2.5">
              <Contador
                rotulo="Quantos"
                valor={impostores}
                minimo={1}
                maximo={limiteImpostores}
                aoMudar={(n) => atualizar({ impostores: n })}
                nota={limiteImpostores === 1 ? 'Com 5 ou mais jogadores dá para ter 2.' : undefined}
              />
              <Alternador
                rotulo="O que o impostor recebe"
                opcoes={[
                  { valor: 'tema', rotulo: 'O tema' },
                  { valor: 'nenhuma', rotulo: 'Nada' },
                  { valor: 'disfarcado', rotulo: 'Disfarce' },
                ]}
                valor={config.dicaImpostor}
                aoMudar={(dicaImpostor) => atualizar({ dicaImpostor })}
              />
              <p className="text-sm text-papel-suave">{EXPLICACAO_DA_DICA[config.dicaImpostor]}</p>
            </div>
          </Secao>

          <Secao titulo="Votação">
            <Alternador
              rotulo="Como votar"
              opcoes={[
                { valor: 'secreta', rotulo: 'Secreta' },
                { valor: 'grupo', rotulo: 'Em grupo' },
              ]}
              valor={config.modoVotacao}
              aoMudar={(modoVotacao) => atualizar({ modoVotacao })}
            />
            <p className="mt-2.5 text-sm text-papel-suave">
              {config.modoVotacao === 'secreta'
                ? 'Cada um vota escondido, passando o celular.'
                : 'Vocês conversam e escolhem juntos um suspeito.'}
            </p>
          </Secao>
        </>
      )}
    </Tela>
  )
}

const EXPLICACAO_DA_DICA: Record<Configuracao['dicaImpostor'], string> = {
  tema: 'O impostor sabe o tema da palavra.',
  nenhuma: 'O impostor não recebe nada. Mais difícil para ele.',
  disfarcado: 'O impostor recebe uma palavra parecida e nem sabe que é o impostor.',
}

type SecaoProps = { titulo: string; contagem?: string; acao?: ReactNode; children: ReactNode }

const Secao = ({ titulo, contagem, acao, children }: SecaoProps) => (
  <section className="mb-8">
    <div className="mb-3 flex min-h-9 items-center gap-2">
      <h2 className="text-[19px] font-extrabold tracking-[-0.015em]">{titulo}</h2>
      {contagem && <span className="text-[15px] font-semibold text-papel-suave tabular-nums">{contagem}</span>}
      {acao && <span className="ml-auto">{acao}</span>}
    </div>
    {children}
  </section>
)

type CartaoDeModoProps = { ativo: boolean; titulo: string; descricao: string; aoEscolher: () => void }

const CartaoDeModo = ({ ativo, titulo, descricao, aoEscolher }: CartaoDeModoProps) => (
  <button
    type="button"
    aria-pressed={ativo}
    onClick={aoEscolher}
    className={`flex flex-col items-start rounded-2xl p-3.5 text-left transition-[background-color,box-shadow] duration-150 ${
      ativo ? 'bg-selo text-tinta shadow-selo' : 'bg-envelope ring-1 ring-vinco'
    }`}
  >
    <span className="text-[19px] font-extrabold">{titulo}</span>
    <span className={`mt-1 text-sm leading-snug ${ativo ? 'text-tinta/80' : 'text-papel-suave'}`}>{descricao}</span>
  </button>
)

type SeloDeTemaProps = { nome: string; total: number; Icone: LucideIcon; ativo: boolean; aoAlternar: () => void }

/** Cada tema é um selo picotado: amarelo quando entra no sorteio. */
const SeloDeTema = ({ nome, total, Icone, ativo, aoAlternar }: SeloDeTemaProps) => (
  <button
    type="button"
    aria-pressed={ativo}
    onClick={aoAlternar}
    className={`picote relative flex min-h-[7.5rem] flex-col items-start p-2 text-left transition-colors duration-150 ${
      ativo ? 'bg-selo text-tinta' : 'bg-envelope-alto text-papel'
    }`}
  >
    <span className={`flex h-full w-full flex-col rounded-md p-2.5 ring-1 ${ativo ? 'ring-tinta/25' : 'ring-vinco'}`}>
      <span className="flex items-start justify-between">
        <Icone size={26} strokeWidth={2} />
        <span
          className={`flex size-6 items-center justify-center rounded-full ${ativo ? 'bg-tinta text-selo' : 'ring-1 ring-vinco'}`}
        >
          {ativo && <Check size={15} strokeWidth={3} />}
        </span>
      </span>
      <span className="mt-auto pt-3 text-[16px] leading-tight font-bold">{nome}</span>
      <span className={`text-[13px] tabular-nums ${ativo ? 'text-tinta/75' : 'text-papel-suave'}`}>{total} palavras</span>
    </span>
  </button>
)

type ContadorProps = {
  rotulo: string
  valor: number
  minimo: number
  maximo: number
  aoMudar: (valor: number) => void
  nota?: string
}

const Contador = ({ rotulo, valor, minimo, maximo, aoMudar, nota }: ContadorProps) => (
  <div className="rounded-2xl bg-envelope p-2 pl-4 ring-1 ring-vinco">
    <div className="flex items-center gap-3">
      <span className="flex-1 text-[17px] font-semibold">{rotulo}</span>
      <BotaoPasso rotulo={`Menos: ${rotulo}`} disabled={valor <= minimo} onClick={() => aoMudar(valor - 1)}>
        <Minus size={20} strokeWidth={2.75} />
      </BotaoPasso>
      <span className="w-6 text-center text-2xl font-extrabold tabular-nums" aria-live="polite">
        {valor}
      </span>
      <BotaoPasso rotulo={`Mais: ${rotulo}`} disabled={valor >= maximo} onClick={() => aoMudar(valor + 1)}>
        <Plus size={20} strokeWidth={2.75} />
      </BotaoPasso>
    </div>
    {nota && <p className="mt-1 pb-1 text-sm text-papel-suave">{nota}</p>}
  </div>
)

type BotaoPassoProps = { rotulo: string; disabled: boolean; onClick: () => void; children: ReactNode }

const BotaoPasso = ({ rotulo, disabled, onClick, children }: BotaoPassoProps) => (
  <button
    type="button"
    aria-label={rotulo}
    disabled={disabled}
    onClick={onClick}
    className="flex size-11 items-center justify-center rounded-xl bg-envelope-alto ring-1 ring-vinco transition-[transform,opacity] active:scale-95 disabled:opacity-30"
  >
    {children}
  </button>
)

type AlternadorProps<T extends string> = {
  rotulo: string
  opcoes: readonly { valor: T; rotulo: string }[]
  valor: T
  aoMudar: (valor: T) => void
}

const Alternador = <T extends string>({ rotulo, opcoes, valor, aoMudar }: AlternadorProps<T>) => (
  <div role="radiogroup" aria-label={rotulo} className="grid grid-flow-col gap-1 rounded-2xl bg-envelope p-1 ring-1 ring-vinco">
    {opcoes.map((opcao) => {
      const ativo = opcao.valor === valor
      return (
        <button
          key={opcao.valor}
          type="button"
          role="radio"
          aria-checked={ativo}
          onClick={() => aoMudar(opcao.valor)}
          className={`min-h-11 rounded-xl px-1 text-[15px] font-bold transition-colors duration-150 ${
            ativo ? 'bg-selo text-tinta' : 'text-papel-suave'
          }`}
        >
          {opcao.rotulo}
        </button>
      )
    })}
  </div>
)
