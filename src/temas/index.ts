import { animais } from './animais'
import { comidasEBebidas } from './comidas-e-bebidas'
import { esportes } from './esportes'
import { lugaresDaCidade } from './lugares-da-cidade'
import { lugaresDoBrasil } from './lugares-do-brasil'
import { paises } from './paises'
import { profissoes } from './profissoes'
import type { Tema } from './tipos'

export type { Tema, Palavra, Dificuldade } from './tipos'

export const TEMAS: readonly Tema[] = [
  comidasEBebidas,
  paises,
  lugaresDoBrasil,
  lugaresDaCidade,
  animais,
  profissoes,
  esportes,
]

export const buscarTema = (id: string): Tema | undefined =>
  TEMAS.find((tema) => tema.id === id)
