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

/** Ordem de fala aleatória em que o impostor nunca começa. */
export const sortearOrdem = (
  totalJogadores: number,
  impostor: number,
  aleatorio: Aleatorio,
): number[] => {
  const indices = Array.from({ length: totalJogadores }, (_, i) => i)
  const ordem = embaralhar(indices, aleatorio)
  if (ordem[0] !== impostor) return ordem

  const troca = 1 + sortearIndice(ordem.length - 1, aleatorio)
  ordem[0] = ordem[troca] as number
  ordem[troca] = impostor
  return ordem
}
