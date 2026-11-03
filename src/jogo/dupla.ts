import type { Tema } from '../temas'
import { sortearIndice, type Aleatorio } from './aleatorio'
import { sortearPalavra, type Historico } from './sorteio'

/**
 * Modo dupla: duas pessoas recebem palavras do mesmo tema, que podem ser
 * iguais ou só parecidas. Depois das dicas, cada uma aposta se são iguais.
 */

export type Jogador = 0 | 1
export type Aposta = 'iguais' | 'diferentes'
export type EtapaDupla = 'revelacao' | 'dicas' | 'votacao' | 'chute' | 'resultado'

export type PartidaDupla = {
  jogadores: readonly [string, string]
  temaNome: string
  /** palavras[j] = palavra que o jogador j recebeu. */
  palavras: readonly [string, string]
  etapa: EtapaDupla
  revelacaoAtual: Jogador
  /** Quem dá a primeira dica de cada rodada. */
  primeiro: Jogador
  rodadaAtual: number
  totalRodadas: number
  /** 0 = primeiro da rodada falando, 1 = o outro. */
  vezAtual: Jogador
  apostas: readonly [Aposta | null, Aposta | null]
  votanteAtual: Jogador
  /** Quem ainda vai chutar a palavra do outro, em ordem. */
  chutesPendentes: readonly Jogador[]
  /** chutes[j] = se o jogador j acertou a palavra do outro; null = não chutou. */
  chutes: readonly [boolean | null, boolean | null]
}

export type ConfigDupla = {
  jogadores: readonly [string, string]
  rodadas: number
}

export type AcaoDupla =
  | { tipo: 'proximaRevelacao' }
  | { tipo: 'proximaVez' }
  | { tipo: 'apostar'; aposta: Aposta }
  | { tipo: 'registrarChute'; acertou: boolean }

export const CHANCE_PALAVRAS_IGUAIS = 0.5

export const PONTOS_DUPLA = {
  apostaCerta: 1,
  chuteCerto: 1,
} as const

export const outro = (jogador: Jogador): Jogador => (jogador === 0 ? 1 : 0)

export const palavrasIguais = (partida: PartidaDupla): boolean => partida.palavras[0] === partida.palavras[1]

export const criarPartidaDupla = (
  config: ConfigDupla,
  temas: readonly Tema[],
  historico: Historico,
  aleatorio: Aleatorio,
): { partida: PartidaDupla; historico: Historico } => {
  const sorteada = sortearPalavra(temas, historico, aleatorio)
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
      rodadaAtual: 1,
      totalRodadas: config.rodadas,
      vezAtual: 0,
      apostas: [null, null],
      votanteAtual: 0,
      chutesPendentes: [],
      chutes: [null, null],
    },
  }
}

/** Quem está falando agora, levando em conta quem começa a rodada. */
export const jogadorDaVez = (partida: PartidaDupla): Jogador =>
  partida.vezAtual === 0 ? partida.primeiro : outro(partida.primeiro)

export const avancarDupla = (partida: PartidaDupla, acao: AcaoDupla): PartidaDupla => {
  switch (acao.tipo) {
    case 'proximaRevelacao':
      return partida.revelacaoAtual === 0
        ? { ...partida, revelacaoAtual: 1 }
        : { ...partida, etapa: 'dicas' }
    case 'proximaVez':
      return avancarVez(partida)
    case 'apostar':
      return registrarAposta(partida, acao.aposta)
    case 'registrarChute':
      return registrarChute(partida, acao.acertou)
  }
}

const avancarVez = (partida: PartidaDupla): PartidaDupla => {
  if (partida.vezAtual === 0) return { ...partida, vezAtual: 1 }
  if (partida.rodadaAtual < partida.totalRodadas) {
    // Quem começa alterna a cada rodada, para ninguém ficar sempre exposto primeiro.
    return { ...partida, vezAtual: 0, rodadaAtual: partida.rodadaAtual + 1, primeiro: outro(partida.primeiro) }
  }
  return { ...partida, etapa: 'votacao', votanteAtual: 0 }
}

const registrarAposta = (partida: PartidaDupla, aposta: Aposta): PartidaDupla => {
  const votante = partida.votanteAtual
  const apostas: [Aposta | null, Aposta | null] =
    votante === 0 ? [aposta, partida.apostas[1]] : [partida.apostas[0], aposta]
  if (votante === 0) return { ...partida, apostas, votanteAtual: 1 }

  // Só chuta quem apostou "diferentes" quando as palavras eram mesmo diferentes.
  const chutesPendentes = palavrasIguais(partida)
    ? []
    : ([0, 1] as const).filter((j) => apostas[j] === 'diferentes')
  return {
    ...partida,
    apostas,
    chutesPendentes,
    etapa: chutesPendentes.length > 0 ? 'chute' : 'resultado',
  }
}

const registrarChute = (partida: PartidaDupla, acertou: boolean): PartidaDupla => {
  const [quemChutou, ...restantes] = partida.chutesPendentes
  if (quemChutou === undefined) return partida
  const chutes: [boolean | null, boolean | null] =
    quemChutou === 0 ? [acertou, partida.chutes[1]] : [partida.chutes[0], acertou]
  return {
    ...partida,
    chutes,
    chutesPendentes: restantes,
    etapa: restantes.length > 0 ? 'chute' : 'resultado',
  }
}

export const apostaCerta = (partida: PartidaDupla, jogador: Jogador): boolean =>
  partida.apostas[jogador] === (palavrasIguais(partida) ? 'iguais' : 'diferentes')

export const calcularPontosDupla = (partida: PartidaDupla): [number, number] => {
  const pontos = (j: Jogador) =>
    (apostaCerta(partida, j) ? PONTOS_DUPLA.apostaCerta : 0) +
    (partida.chutes[j] ? PONTOS_DUPLA.chuteCerto : 0)
  return [pontos(0), pontos(1)]
}
