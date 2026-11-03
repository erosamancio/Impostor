export type ModoJogo = 'classico' | 'dupla'
/** Dificuldade máxima das palavras sorteadas. */
export type Nivel = 'facil' | 'medio' | 'todos'
export type ModoVotacao = 'secreta' | 'grupo'
/** O que o impostor recebe: o nome do tema, nada, ou uma palavra parecida sem saber que é o impostor. */
export type DicaImpostor = 'tema' | 'nenhuma' | 'disfarcado'

export type Configuracao = {
  modo: ModoJogo
  nivel: Nivel
  jogadores: readonly string[]
  temaIds: readonly string[]
  rodadas: number
  dicaImpostor: DicaImpostor
  modoVotacao: ModoVotacao
  impostores: number
  /** Segundos por dica; 0 = sem timer. */
  tempoDica: number
}

export type Etapa =
  | 'revelacao'
  | 'dicas'
  | 'discussao'
  | 'votacao'
  | 'ultimaChance'
  | 'resultado'

export type Partida = {
  config: Configuracao
  temaNome: string
  palavra: string
  /** Índices dos impostores em config.jogadores. */
  impostores: readonly number[]
  /** Palavra parecida entregue aos impostores no modo disfarçado; null nos outros modos. */
  palavraDisfarce: string | null
  /** Ordem de fala: índices de config.jogadores. */
  ordem: readonly number[]
  etapa: Etapa
  revelacaoAtual: number
  rodadaAtual: number
  totalRodadas: number
  /** Posição em `ordem` de quem dá a dica agora. */
  vezAtual: number
  /** votos[votante] = acusado, só no modo de votação secreta. */
  votos: readonly (number | null)[]
  votanteAtual: number
  /** null = empate ou ninguém acusado. */
  acusado: number | null
  chuteCerto: boolean | null
}

export const MIN_JOGADORES = 3
export const JOGADORES_DUPLA = 2
export const MAX_JOGADORES = 20
export const MIN_RODADAS = 1
export const MAX_RODADAS = 5
export const TEMPOS_DICA = [0, 20, 30, 45, 60] as const

/** Até 3 impostores, sempre menos da metade da mesa. */
export const maxImpostores = (totalJogadores: number): number =>
  Math.max(1, Math.min(3, Math.floor((totalJogadores - 1) / 2)))
