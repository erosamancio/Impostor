import { describe, expect, it } from 'vitest'
import { TEMAS } from '.'

describe.each(TEMAS.map((tema) => [tema.nome, tema] as const))('tema %s', (_, tema) => {
  const textos = tema.palavras.map((p) => p.texto)

  it('não tem palavras repetidas', () => {
    expect(new Set(textos).size).toBe(textos.length)
  })

  it('toda palavra irmã existe no próprio tema e não é a própria palavra', () => {
    for (const p of tema.palavras) {
      expect(p.irmas.length, p.texto).toBeGreaterThan(0)
      for (const irma of p.irmas) {
        expect(textos, `${p.texto} → ${irma}`).toContain(irma)
        expect(irma).not.toBe(p.texto)
      }
    }
  })
})
