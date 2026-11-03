export type ModoJogo = 'classico' | 'dupla'
/** Dificuldade máxima das palavras sorteadas. */
export type Nivel = 'facil' | 'medio' | 'todos'
/** O que o impostor recebe: o nome do tema, nada, ou uma palavra parecida sem saber que é o impostor. */
export type DicaImpostor = 'tema' | 'nenhuma' | 'disfarcado'

export type Configuracao = {
  modo: ModoJogo
  nivel: Nivel
  jogadores: readonly string[]
  temaIds: readonly string[]
  dicaImpostor: DicaImpostor
  impostores: number
}

/** As dicas, a discussão e o voto acontecem na mesa, fora do celular. */
export type Etapa = 'revelacao' | 'emJogo' | 'resultado'

export type Partida = {
  config: Configuracao
  temaNome: string
  palavra: string
  /** Índices dos impostores em config.jogadores. */
  impostores: readonly number[]
  /** Palavra parecida entregue aos impostores no modo disfarçado; null nos outros modos. */
  palavraDisfarce: string | null
  /** Ordem sugerida de fala; quem começa nunca é impostor. */
  ordem: readonly number[]
  etapa: Etapa
  revelacaoAtual: number
}

export const MIN_JOGADORES = 3
export const JOGADORES_DUPLA = 2
export const MAX_JOGADORES = 20

/** Até 3 impostores, sempre menos da metade da mesa. */
export const maxImpostores = (totalJogadores: number): number =>
  Math.max(1, Math.min(3, Math.floor((totalJogadores - 1) / 2)))
