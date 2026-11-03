import { describe, expect, it } from 'vitest'
import { comidasEBebidas } from '../temas/comidas-e-bebidas'
import { avancarDupla, criarPartidaDupla, palavrasIguais, type AcaoDupla, type PartidaDupla } from './dupla'

const config = { jogadores: ['Eros', 'Bia'] as const, nivel: 'todos' as const }
const nova = () => criarPartidaDupla(config, [comidasEBebidas], [], Math.random).partida
const aplicar = (partida: PartidaDupla, acoes: AcaoDupla[]) => acoes.reduce(avancarDupla, partida)

describe('criarPartidaDupla', () => {
  it('dá palavras iguais ou irmãs do mesmo tema, mais ou menos meio a meio', () => {
    let iguais = 0
    const total = 2000
    for (let i = 0; i < total; i++) {
      const partida = nova()
      const [a, b] = partida.palavras
      if (palavrasIguais(partida)) {
        iguais++
        continue
      }
      const irmasDeA = comidasEBebidas.palavras.find((p) => p.texto === a)?.irmas ?? []
      const irmasDeB = comidasEBebidas.palavras.find((p) => p.texto === b)?.irmas ?? []
      expect(irmasDeA.includes(b) || irmasDeB.includes(a), `${a} / ${b}`).toBe(true)
    }
    expect(iguais / total).toBeGreaterThan(0.4)
    expect(iguais / total).toBeLessThan(0.6)
  })
})

describe('fluxo do modo dupla', () => {
  it('mostra as duas palavras, deixa a conversa com a dupla e revela no fim', () => {
    const emJogo = aplicar(nova(), [{ tipo: 'proximaRevelacao' }, { tipo: 'proximaRevelacao' }])
    expect(emJogo.etapa).toBe('emJogo')
    expect(avancarDupla(emJogo, { tipo: 'revelarResultado' }).etapa).toBe('resultado')
  })
})
