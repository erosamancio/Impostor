import { describe, expect, it } from 'vitest'
import { comidasEBebidas } from '../temas/comidas-e-bebidas'
import {
  avancarDupla,
  calcularPontosDupla,
  criarPartidaDupla,
  jogadorDaVez,
  palavrasIguais,
  type AcaoDupla,
  type PartidaDupla,
} from './dupla'

const config = { jogadores: ['Eros', 'Bia'] as const, rodadas: 2 }
const nova = () => criarPartidaDupla(config, [comidasEBebidas], [], Math.random).partida
const aplicar = (partida: PartidaDupla, acoes: AcaoDupla[]) => acoes.reduce(avancarDupla, partida)

const comPalavras = (palavras: [string, string]): PartidaDupla => ({ ...nova(), palavras })
const ateVotacao = (partida: PartidaDupla) =>
  aplicar(partida, [
    { tipo: 'proximaRevelacao' },
    { tipo: 'proximaRevelacao' },
    ...Array.from({ length: 4 }, (): AcaoDupla => ({ tipo: 'proximaVez' })),
  ])

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
  it('alterna quem começa a cada rodada e vai para a votação', () => {
    const inicio = aplicar(nova(), [{ tipo: 'proximaRevelacao' }, { tipo: 'proximaRevelacao' }])
    expect(inicio.etapa).toBe('dicas')
    const primeiro = jogadorDaVez(inicio)
    const segunda = aplicar(inicio, [{ tipo: 'proximaVez' }])
    expect(jogadorDaVez(segunda)).not.toBe(primeiro)
    const rodada2 = aplicar(segunda, [{ tipo: 'proximaVez' }])
    expect(rodada2.rodadaAtual).toBe(2)
    expect(jogadorDaVez(rodada2)).not.toBe(primeiro)
    expect(aplicar(rodada2, [{ tipo: 'proximaVez' }, { tipo: 'proximaVez' }]).etapa).toBe('votacao')
  })

  it('palavras iguais: quem apostou "iguais" pontua e ninguém chuta', () => {
    const fim = aplicar(ateVotacao(comPalavras(['pizza', 'pizza'])), [
      { tipo: 'apostar', aposta: 'iguais' },
      { tipo: 'apostar', aposta: 'diferentes' },
    ])
    expect(fim.etapa).toBe('resultado')
    expect(calcularPontosDupla(fim)).toEqual([1, 0])
  })

  it('palavras diferentes: quem apostou "diferentes" chuta a palavra do outro', () => {
    const votada = aplicar(ateVotacao(comPalavras(['pizza', 'lasanha'])), [
      { tipo: 'apostar', aposta: 'diferentes' },
      { tipo: 'apostar', aposta: 'diferentes' },
    ])
    expect(votada.etapa).toBe('chute')
    expect(votada.chutesPendentes).toEqual([0, 1])

    const fim = aplicar(votada, [
      { tipo: 'registrarChute', acertou: true },
      { tipo: 'registrarChute', acertou: false },
    ])
    expect(fim.etapa).toBe('resultado')
    expect(calcularPontosDupla(fim)).toEqual([2, 1])
  })

  it('palavras diferentes e ninguém desconfiou: ninguém pontua', () => {
    const fim = aplicar(ateVotacao(comPalavras(['pizza', 'lasanha'])), [
      { tipo: 'apostar', aposta: 'iguais' },
      { tipo: 'apostar', aposta: 'iguais' },
    ])
    expect(fim.etapa).toBe('resultado')
    expect(calcularPontosDupla(fim)).toEqual([0, 0])
  })
})
