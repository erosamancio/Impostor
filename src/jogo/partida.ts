import type { Tema } from '../temas'
import { sortearIndice, type Aleatorio } from './aleatorio'
import { sortearImpostores, sortearOrdem, sortearPalavra, type Historico } from './sorteio'
import { MIN_JOGADORES, maxImpostores, type Configuracao, type Partida } from './tipos'

export type Acao =
  | { tipo: 'proximaRevelacao' }
  | { tipo: 'proximaVez' }
  | { tipo: 'maisUmaRodada' }
  | { tipo: 'irParaVotacao' }
  | { tipo: 'votar'; acusado: number }
  | { tipo: 'acusarEmGrupo'; acusado: number }
  | { tipo: 'registrarChute'; acertou: boolean }

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
      rodadaAtual: 1,
      totalRodadas: config.rodadas,
      vezAtual: 0,
      votos: Array.from({ length: totalJogadores }, () => null),
      votanteAtual: 0,
      acusado: null,
      chuteCerto: null,
    },
  }
}

export const avancarPartida = (partida: Partida, acao: Acao): Partida => {
  switch (acao.tipo) {
    case 'proximaRevelacao':
      return avancarRevelacao(partida)
    case 'proximaVez':
      return avancarVez(partida)
    case 'maisUmaRodada':
      return {
        ...partida,
        etapa: 'dicas',
        totalRodadas: partida.totalRodadas + 1,
        rodadaAtual: partida.totalRodadas + 1,
        vezAtual: 0,
      }
    case 'irParaVotacao':
      return { ...partida, etapa: 'votacao', votanteAtual: 0 }
    case 'votar':
      return registrarVoto(partida, acao.acusado)
    case 'acusarEmGrupo':
      return definirAcusado(partida, acao.acusado)
    case 'registrarChute':
      return { ...partida, chuteCerto: acao.acertou, etapa: 'resultado' }
  }
}

const avancarRevelacao = (partida: Partida): Partida => {
  const proximo = partida.revelacaoAtual + 1
  if (proximo < partida.config.jogadores.length) {
    return { ...partida, revelacaoAtual: proximo }
  }
  return { ...partida, etapa: 'dicas', rodadaAtual: 1, vezAtual: 0 }
}

const avancarVez = (partida: Partida): Partida => {
  const proximaVez = partida.vezAtual + 1
  if (proximaVez < partida.ordem.length) return { ...partida, vezAtual: proximaVez }
  if (partida.rodadaAtual < partida.totalRodadas) {
    return { ...partida, rodadaAtual: partida.rodadaAtual + 1, vezAtual: 0 }
  }
  return { ...partida, etapa: 'discussao' }
}

const registrarVoto = (partida: Partida, acusado: number): Partida => {
  const votante = partida.votanteAtual
  if (acusado === votante) throw new Error('Ninguém pode votar em si mesmo')

  const votos = partida.votos.map((voto, i) => (i === votante ? acusado : voto))
  const proximoVotante = votante + 1
  if (proximoVotante < partida.config.jogadores.length) {
    return { ...partida, votos, votanteAtual: proximoVotante }
  }
  return definirAcusado({ ...partida, votos }, apurarVotos(votos))
}

/** O mais votado é acusado; empate no topo não acusa ninguém. */
export const apurarVotos = (votos: readonly (number | null)[]): number | null => {
  const contagem = contarVotos(votos)
  const maximo = Math.max(0, ...contagem.values())
  if (maximo === 0) return null
  const lideres = [...contagem].filter(([, total]) => total === maximo)
  return lideres.length === 1 ? (lideres[0]?.[0] ?? null) : null
}

export const contarVotos = (votos: readonly (number | null)[]): Map<number, number> => {
  const contagem = new Map<number, number>()
  for (const voto of votos) {
    if (voto !== null) contagem.set(voto, (contagem.get(voto) ?? 0) + 1)
  }
  return contagem
}

export const ehImpostor = (partida: Partida, jogador: number | null): boolean =>
  jogador !== null && partida.impostores.includes(jogador)

const definirAcusado = (partida: Partida, acusado: number | null): Partida => ({
  ...partida,
  acusado,
  etapa: ehImpostor(partida, acusado) ? 'ultimaChance' : 'resultado',
})

export type Vencedor = 'grupo' | 'impostor'

/** O grupo só vence se acusar um impostor e ele errar o chute da palavra. */
export const definirVencedor = (partida: Partida): Vencedor =>
  ehImpostor(partida, partida.acusado) && !partida.chuteCerto ? 'grupo' : 'impostor'

export const PONTOS = {
  votoCerto: 1,
  impostorEscapou: 2,
  chuteCerto: 1,
} as const

/** pontos[i] = pontos do jogador i nesta partida. */
export const calcularPontos = (partida: Partida): number[] =>
  partida.config.jogadores.map((_, jogador) =>
    ehImpostor(partida, jogador) ? pontosDoImpostor(partida, jogador) : pontosDeQuemSabia(partida, jogador),
  )

const pontosDoImpostor = (partida: Partida, jogador: number): number => {
  if (partida.acusado !== jogador) return PONTOS.impostorEscapou
  return partida.chuteCerto ? PONTOS.chuteCerto : 0
}

const pontosDeQuemSabia = (partida: Partida, jogador: number): number => {
  const alvo = partida.config.modoVotacao === 'secreta' ? (partida.votos[jogador] ?? null) : partida.acusado
  return ehImpostor(partida, alvo) ? PONTOS.votoCerto : 0
}

/** O que cada jogador viu no cartão secreto. */
export type Segredo =
  | { tipo: 'palavra'; palavra: string }
  | { tipo: 'impostor'; dica: string | null }

export const segredoDe = (partida: Partida, jogador: number): Segredo => {
  if (!ehImpostor(partida, jogador)) return { tipo: 'palavra', palavra: partida.palavra }
  if (partida.palavraDisfarce !== null) return { tipo: 'palavra', palavra: partida.palavraDisfarce }
  return { tipo: 'impostor', dica: partida.config.dicaImpostor === 'tema' ? partida.temaNome : null }
}
