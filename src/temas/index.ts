import { comidasEBebidas } from './comidas-e-bebidas'
import type { Tema } from './tipos'

export type { Tema, Palavra, Dificuldade } from './tipos'

export const TEMAS: readonly Tema[] = [comidasEBebidas]

export const buscarTema = (id: string): Tema | undefined =>
  TEMAS.find((tema) => tema.id === id)
