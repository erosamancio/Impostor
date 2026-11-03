export type Dificuldade = 'facil' | 'media' | 'dificil'

export type Palavra = {
  texto: string
  dificuldade: Dificuldade
  /** Palavras parecidas do mesmo tema, usadas no Modo dupla. */
  irmas: readonly string[]
}

export type Tema = {
  id: string
  nome: string
  descricao: string
  emoji: string
  palavras: readonly Palavra[]
}

export const palavra = (
  texto: string,
  dificuldade: Dificuldade,
  irmas: readonly string[],
): Palavra => ({ texto, dificuldade, irmas })
