import type { Dificuldade, Tema } from '../temas'
import { embaralhar, sortearIndice, type Aleatorio } from './aleatorio'
import type { Nivel } from './tipos'

/** Chaves "temaId:palavra" já sorteadas, para evitar repetição. */
export type Historico = readonly string[]

export type PalavraSorteada = {
  tema: Tema
  palavra: string
  historico: Historico
}

const DIFICULDADES_POR_NIVEL: Record<Nivel, readonly Dificuldade[]> = {
  facil: ['facil'],
  medio: ['facil', 'media'],
  todos: ['facil', 'media', 'dificil'],
}

const chave = (tema: Tema, texto: string) => `${tema.id}:${texto}`

export const sortearPalavra = (
  temas: readonly Tema[],
  historico: Historico,
  aleatorio: Aleatorio,
  nivel: Nivel = 'todos',
): PalavraSorteada => {
  const permitidas = DIFICULDADES_POR_NIVEL[nivel]
  const candidatas = temas.flatMap((tema) =>
    tema.palavras.filter((p) => permitidas.includes(p.dificuldade)).map((p) => ({ tema, palavra: p.texto })),
  )
  if (candidatas.length === 0) throw new Error('Nenhuma palavra nos temas escolhidos')

  const usadas = new Set(historico)
  const ineditas = candidatas.filter((c) => !usadas.has(chave(c.tema, c.palavra)))
  const temasEsgotados = ineditas.length === 0
  const disponiveis = temasEsgotados ? candidatas : ineditas
  const escolhida = disponiveis[sortearIndice(disponiveis.length, aleatorio)]
  if (!escolhida) throw new Error('Falha ao sortear palavra')

  const historicoBase = temasEsgotados ? historicoSem(temas, historico) : historico
  return {
    tema: escolhida.tema,
    palavra: escolhida.palavra,
    historico: [...historicoBase, chave(escolhida.tema, escolhida.palavra)],
  }
}

const historicoSem = (temas: readonly Tema[], historico: Historico): Historico => {
  const prefixos = temas.map((tema) => `${tema.id}:`)
  return historico.filter((item) => !prefixos.some((prefixo) => item.startsWith(prefixo)))
}

/** Sorteia `quantidade` jogadores distintos. */
export const sortearImpostores = (
  totalJogadores: number,
  quantidade: number,
  aleatorio: Aleatorio,
): number[] => {
  const indices = Array.from({ length: totalJogadores }, (_, i) => i)
  return embaralhar(indices, aleatorio).slice(0, quantidade).sort((a, b) => a - b)
}

/** Ordem de fala aleatória em que nenhum impostor começa. */
export const sortearOrdem = (
  totalJogadores: number,
  impostores: readonly number[],
  aleatorio: Aleatorio,
): number[] => {
  const indices = Array.from({ length: totalJogadores }, (_, i) => i)
  const ordem = embaralhar(indices, aleatorio)
  const primeiroInocente = ordem.findIndex((j) => !impostores.includes(j))
  if (primeiroInocente <= 0) return ordem
  const inocente = ordem[primeiroInocente] as number
  ordem[primeiroInocente] = ordem[0] as number
  ordem[0] = inocente
  return ordem
}
