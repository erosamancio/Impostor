import type { Tema } from '../temas'
import { sortearIndice, type Aleatorio } from './aleatorio'
import { sortearImpostores, sortearOrdem, sortearPalavra, type Historico } from './sorteio'
import { MIN_JOGADORES, maxImpostores, type Configuracao, type Partida } from './tipos'

export type Acao = { tipo: 'proximaRevelacao' } | { tipo: 'revelarResultado' }

export type NovaPartida = { partida: Partida; historico: Historico }

export const criarPartida = (
  config: Configuracao,
  temas: readonly Tema[],
  historico: Historico,
  aleatorio: Aleatorio,
): NovaPartida => {
  const totalJogadores = config.jogadores.length
  if (totalJogadores < MIN_JOGADORES) {
    throw new Error(`O modo clássico precisa de pelo menos ${MIN_JOGADORES} jogadores`)
  }

  const sorteada = sortearPalavra(temas, historico, aleatorio, config.nivel)
  const quantidade = Math.min(Math.max(1, config.impostores), maxImpostores(totalJogadores))
  const impostores = sortearImpostores(totalJogadores, quantidade, aleatorio)
  const irmas = sorteada.tema.palavras.find((p) => p.texto === sorteada.palavra)?.irmas ?? []
  const palavraDisfarce =
    config.dicaImpostor === 'disfarcado' ? (irmas[sortearIndice(irmas.length, aleatorio)] ?? null) : null

  return {
    historico: sorteada.historico,
    partida: {
      config,
      temaNome: sorteada.tema.nome,
      palavra: sorteada.palavra,
      impostores,
      palavraDisfarce,
      ordem: sortearOrdem(totalJogadores, impostores, aleatorio),
      etapa: 'revelacao',
      revelacaoAtual: 0,
    },
  }
}

export const avancarPartida = (partida: Partida, acao: Acao): Partida => {
  switch (acao.tipo) {
    case 'proximaRevelacao': {
      const proximo = partida.revelacaoAtual + 1
      if (proximo < partida.config.jogadores.length) return { ...partida, revelacaoAtual: proximo }
      return { ...partida, etapa: 'emJogo' }
    }
    case 'revelarResultado':
      return { ...partida, etapa: 'resultado' }
  }
}

/** Quem dá a primeira dica: nunca um impostor. */
export const quemComeca = (partida: Partida): number => partida.ordem[0] ?? 0

export const ehImpostor = (partida: Partida, jogador: number): boolean => partida.impostores.includes(jogador)

/** O que cada jogador viu no cartão secreto. */
export type Segredo = { tipo: 'palavra'; palavra: string } | { tipo: 'impostor'; dica: string | null }

export const segredoDe = (partida: Partida, jogador: number): Segredo => {
  if (!ehImpostor(partida, jogador)) return { tipo: 'palavra', palavra: partida.palavra }
  if (partida.palavraDisfarce !== null) return { tipo: 'palavra', palavra: partida.palavraDisfarce }
  return {
    tipo: 'impostor',
    dica: partida.config.dicaImpostor === 'tema' ? partida.temaNome : null,
  }
}
