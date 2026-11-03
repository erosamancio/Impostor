import { describe, expect, it } from 'vitest'
import { comidasEBebidas } from '../temas/comidas-e-bebidas'
import type { Aleatorio } from './aleatorio'
import { apurarVotos, avancarPartida, calcularPontos, criarPartida, definirVencedor, type Acao } from './partida'
import { sortearOrdem, sortearPalavra } from './sorteio'
import type { Configuracao, Partida } from './tipos'

const sequencia = (valores: number[]): Aleatorio => {
  let i = 0
  return () => valores[i++ % valores.length] ?? 0
}

const config: Configuracao = {
  jogadores: ['Ana', 'Bia', 'Caio', 'Duda'],
  temaIds: [comidasEBebidas.id],
  rodadas: 2,
  dicaImpostor: 'tema',
  modoVotacao: 'secreta',
}

const novaPartida = (aleatorio: Aleatorio = Math.random, sobrescrever: Partial<Configuracao> = {}) =>
  criarPartida({ ...config, ...sobrescrever }, [comidasEBebidas], [], aleatorio).partida

const aplicar = (partida: Partida, acoes: Acao[]) => acoes.reduce(avancarPartida, partida)
const repetir = (acao: Acao, vezes: number): Acao[] => Array.from({ length: vezes }, () => acao)

describe('criarPartida', () => {
  it('exige pelo menos 3 jogadores', () => {
    expect(() => novaPartida(Math.random, { jogadores: ['Ana', 'Bia'] })).toThrow()
  })

  it('sorteia uma palavra do tema e um impostor válido', () => {
    const partida = novaPartida()
    expect(comidasEBebidas.palavras.map((p) => p.texto)).toContain(partida.palavra)
    expect(partida.impostor).toBeGreaterThanOrEqual(0)
    expect(partida.impostor).toBeLessThan(4)
    expect(partida.etapa).toBe('revelacao')
  })
})

describe('sortearOrdem', () => {
  it('inclui todos os jogadores e o impostor nunca começa', () => {
    for (let impostor = 0; impostor < 5; impostor++) {
      for (let tentativa = 0; tentativa < 50; tentativa++) {
        const ordem = sortearOrdem(5, impostor, Math.random)
        expect([...ordem].sort()).toEqual([0, 1, 2, 3, 4])
        expect(ordem[0]).not.toBe(impostor)
      }
    }
  })
})

describe('sortearPalavra', () => {
  it('não repete palavras até esgotar o tema', () => {
    let historico: readonly string[] = []
    const vistas = new Set<string>()
    for (let i = 0; i < comidasEBebidas.palavras.length; i++) {
      const sorteada = sortearPalavra([comidasEBebidas], historico, Math.random)
      expect(vistas.has(sorteada.palavra)).toBe(false)
      vistas.add(sorteada.palavra)
      historico = sorteada.historico
    }
    const depoisDeEsgotar = sortearPalavra([comidasEBebidas], historico, Math.random)
    expect(depoisDeEsgotar.historico).toHaveLength(1)
  })
})

describe('fluxo da partida', () => {
  it('passa pela revelação de todos e pelas rodadas até a discussão', () => {
    const inicio = novaPartida()
    const dicas = aplicar(inicio, repetir({ tipo: 'proximaRevelacao' }, 4))
    expect(dicas.etapa).toBe('dicas')

    const segundaRodada = aplicar(dicas, repetir({ tipo: 'proximaVez' }, 4))
    expect(segundaRodada.rodadaAtual).toBe(2)
    expect(segundaRodada.etapa).toBe('dicas')

    const discussao = aplicar(segundaRodada, repetir({ tipo: 'proximaVez' }, 4))
    expect(discussao.etapa).toBe('discussao')

    const extra = avancarPartida(discussao, { tipo: 'maisUmaRodada' })
    expect(extra).toMatchObject({ etapa: 'dicas', rodadaAtual: 3, totalRodadas: 3, vezAtual: 0 })
  })

  it('voto secreto que acerta o impostor leva à última chance', () => {
    // impostor = índice 0 (aleatório sempre 0)
    const partida = aplicar(novaPartida(sequencia([0])), [{ tipo: 'irParaVotacao' }])
    expect(partida.impostor).toBe(0)
    const votada = aplicar(partida, [
      { tipo: 'votar', acusado: 1 }, // Ana (impostora) vota na Bia
      { tipo: 'votar', acusado: 0 },
      { tipo: 'votar', acusado: 0 },
      { tipo: 'votar', acusado: 0 },
    ])
    expect(votada.acusado).toBe(0)
    expect(votada.etapa).toBe('ultimaChance')

    const errou = avancarPartida(votada, { tipo: 'registrarChute', acertou: false })
    expect(errou.etapa).toBe('resultado')
    expect(definirVencedor(errou)).toBe('grupo')
    expect(calcularPontos(errou)).toEqual([0, 1, 1, 1])

    const acertou = avancarPartida(votada, { tipo: 'registrarChute', acertou: true })
    expect(definirVencedor(acertou)).toBe('impostor')
    expect(calcularPontos(acertou)).toEqual([1, 1, 1, 1])
  })

  it('impostor que escapa ganha 2 pontos', () => {
    const partida = aplicar(novaPartida(sequencia([0]), { modoVotacao: 'grupo' }), [
      { tipo: 'irParaVotacao' },
      { tipo: 'acusarEmGrupo', acusado: 2 },
    ])
    expect(partida.etapa).toBe('resultado')
    expect(definirVencedor(partida)).toBe('impostor')
    expect(calcularPontos(partida)).toEqual([2, 0, 0, 0])
  })

  it('não deixa ninguém votar em si mesmo', () => {
    const partida = aplicar(novaPartida(), [{ tipo: 'irParaVotacao' }])
    expect(() => avancarPartida(partida, { tipo: 'votar', acusado: 0 })).toThrow()
  })
})

describe('apurarVotos', () => {
  it('acusa o mais votado e ninguém em caso de empate', () => {
    expect(apurarVotos([1, 2, 1, 1])).toBe(1)
    expect(apurarVotos([1, 0, 1, 0])).toBeNull()
    expect(apurarVotos([null, null])).toBeNull()
  })
})
