import type { Tema } from '../temas'
import { sortearIndice, type Aleatorio } from './aleatorio'
import { sortearPalavra, type Historico } from './sorteio'
import type { Nivel } from './tipos'

/**
 * Modo dupla: duas pessoas recebem palavras do mesmo tema, que podem ser
 * iguais ou só parecidas. As dicas e as apostas acontecem na conversa; o
 * celular só guarda as palavras e as revela no fim.
 */

export type Jogador = 0 | 1
export type EtapaDupla = 'revelacao' | 'emJogo' | 'resultado'

export type PartidaDupla = {
  jogadores: readonly [string, string]
  temaNome: string
  /** palavras[j] = palavra que o jogador j recebeu. */
  palavras: readonly [string, string]
  etapa: EtapaDupla
  revelacaoAtual: Jogador
  /** Quem dá a primeira dica. */
  primeiro: Jogador
}

export type ConfigDupla = {
  jogadores: readonly [string, string]
  nivel: Nivel
}

export type AcaoDupla = { tipo: 'proximaRevelacao' } | { tipo: 'revelarResultado' }

export const CHANCE_PALAVRAS_IGUAIS = 0.5

export const outro = (jogador: Jogador): Jogador => (jogador === 0 ? 1 : 0)

export const palavrasIguais = (partida: PartidaDupla): boolean => partida.palavras[0] === partida.palavras[1]

export const criarPartidaDupla = (
  config: ConfigDupla,
  temas: readonly Tema[],
  historico: Historico,
  aleatorio: Aleatorio,
): { partida: PartidaDupla; historico: Historico } => {
  const sorteada = sortearPalavra(temas, historico, aleatorio, config.nivel)
  const irmas = sorteada.tema.palavras.find((p) => p.texto === sorteada.palavra)?.irmas ?? []
  const iguais = irmas.length === 0 || aleatorio() < CHANCE_PALAVRAS_IGUAIS
  const segunda = iguais ? sorteada.palavra : (irmas[sortearIndice(irmas.length, aleatorio)] ?? sorteada.palavra)
  const quemRecebeAPrimeira: Jogador = aleatorio() < 0.5 ? 0 : 1
  const palavras: [string, string] =
    quemRecebeAPrimeira === 0 ? [sorteada.palavra, segunda] : [segunda, sorteada.palavra]

  return {
    historico: sorteada.historico,
    partida: {
      jogadores: config.jogadores,
      temaNome: sorteada.tema.nome,
      palavras,
      etapa: 'revelacao',
      revelacaoAtual: 0,
      primeiro: aleatorio() < 0.5 ? 0 : 1,
    },
  }
}

export const avancarDupla = (partida: PartidaDupla, acao: AcaoDupla): PartidaDupla => {
  switch (acao.tipo) {
    case 'proximaRevelacao':
      return partida.revelacaoAtual === 0 ? { ...partida, revelacaoAtual: 1 } : { ...partida, etapa: 'emJogo' }
    case 'revelarResultado':
      return { ...partida, etapa: 'resultado' }
  }
}
