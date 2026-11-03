export type ModoJogo = 'classico' | 'dupla'
export type ModoVotacao = 'secreta' | 'grupo'
export type DicaImpostor = 'tema' | 'nenhuma'

export type Configuracao = {
  modo: ModoJogo
  jogadores: readonly string[]
  temaIds: readonly string[]
  rodadas: number
  dicaImpostor: DicaImpostor
  modoVotacao: ModoVotacao
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
  /** Índice do impostor em config.jogadores. */
  impostor: number
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
