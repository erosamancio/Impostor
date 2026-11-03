import { describe, expect, it } from 'vitest'
import { comidasEBebidas } from '../temas/comidas-e-bebidas'
import { avancarPartida, criarPartida, quemComeca, segredoDe, type Acao } from './partida'
import { sortearOrdem, sortearPalavra } from './sorteio'
import type { Configuracao, Partida } from './tipos'

const config: Configuracao = {
  modo: 'classico',
  nivel: 'todos',
  jogadores: ['Ana', 'Bia', 'Caio', 'Duda'],
  temaIds: [comidasEBebidas.id],
  dicaImpostor: 'tema',
  impostores: 1,
}

const novaPartida = (aleatorio: () => number = Math.random, sobrescrever: Partial<Configuracao> = {}) =>
  criarPartida({ ...config, ...sobrescrever }, [comidasEBebidas], [], aleatorio).partida

/** Fixa o jogador 0 como único impostor. */
const comAnaImpostora = (partida: Partida): Partida => ({
  ...partida,
  impostores: [0],
})

const aplicar = (partida: Partida, acoes: Acao[]) => acoes.reduce(avancarPartida, partida)
const repetir = (acao: Acao, vezes: number): Acao[] => Array.from({ length: vezes }, () => acao)

describe('criarPartida', () => {
  it('exige pelo menos 3 jogadores', () => {
    expect(() => novaPartida(Math.random, { jogadores: ['Ana', 'Bia'] })).toThrow()
  })

  it('sorteia uma palavra do tema e um impostor válido', () => {
    const partida = novaPartida()
    expect(comidasEBebidas.palavras.map((p) => p.texto)).toContain(partida.palavra)
    expect(partida.impostores[0]).toBeGreaterThanOrEqual(0)
    expect(partida.impostores[0]).toBeLessThan(4)
    expect(partida.etapa).toBe('revelacao')
  })
})

describe('sortearOrdem', () => {
  it('inclui todos os jogadores e o impostor nunca começa', () => {
    for (let impostor = 0; impostor < 5; impostor++) {
      for (let tentativa = 0; tentativa < 50; tentativa++) {
        const ordem = sortearOrdem(5, [impostor], Math.random)
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
  it('revela para todos, entrega a partida à mesa e só mostra o resultado quando pedem', () => {
    const inicio = novaPartida()
    const quase = aplicar(inicio, repetir({ tipo: 'proximaRevelacao' }, 3))
    expect(quase).toMatchObject({ etapa: 'revelacao', revelacaoAtual: 3 })

    const emJogo = avancarPartida(quase, { tipo: 'proximaRevelacao' })
    expect(emJogo.etapa).toBe('emJogo')

    expect(avancarPartida(emJogo, { tipo: 'revelarResultado' }).etapa).toBe('resultado')
  })
})

describe('nível de dificuldade', () => {
  it('no nível fácil só sorteia palavras fáceis', () => {
    const faceis = new Set(comidasEBebidas.palavras.filter((p) => p.dificuldade === 'facil').map((p) => p.texto))
    for (let i = 0; i < 300; i++) {
      expect(faceis.has(sortearPalavra([comidasEBebidas], [], Math.random, 'facil').palavra)).toBe(true)
    }
  })

  it('no nível médio nunca sorteia palavras difíceis', () => {
    const dificeis = new Set(comidasEBebidas.palavras.filter((p) => p.dificuldade === 'dificil').map((p) => p.texto))
    for (let i = 0; i < 300; i++) {
      expect(dificeis.has(sortearPalavra([comidasEBebidas], [], Math.random, 'medio').palavra)).toBe(false)
    }
  })
})

describe('vários impostores', () => {
  const seis: Partial<Configuracao> = {
    jogadores: ['A', 'B', 'C', 'D', 'E', 'F'],
    impostores: 2,
  }

  it('sorteia a quantidade pedida, limitada a menos da metade da mesa', () => {
    expect(novaPartida(Math.random, seis).impostores).toHaveLength(2)
    expect(novaPartida(Math.random, { impostores: 3 }).impostores).toHaveLength(1)
  })

  it('nenhum impostor começa a rodada', () => {
    for (let i = 0; i < 200; i++) {
      const partida = novaPartida(Math.random, seis)
      expect(partida.impostores).not.toContain(quemComeca(partida))
    }
  })
})

describe('impostor disfarçado', () => {
  it('o impostor vê uma palavra irmã, como se fosse um jogador comum', () => {
    for (let i = 0; i < 100; i++) {
      const partida = novaPartida(Math.random, { dicaImpostor: 'disfarcado' })
      const impostor = partida.impostores[0] ?? 0
      const segredo = segredoDe(partida, impostor)
      expect(segredo.tipo).toBe('palavra')
      const irmas = comidasEBebidas.palavras.find((p) => p.texto === partida.palavra)?.irmas
      expect(irmas).toContain(segredo.tipo === 'palavra' ? segredo.palavra : '')
    }
  })

  it('sem disfarce, o impostor vê o aviso com ou sem o tema', () => {
    const comTema = comAnaImpostora(novaPartida())
    expect(segredoDe(comTema, 0)).toEqual({
      tipo: 'impostor',
      dica: comidasEBebidas.nome,
    })
    expect(segredoDe(comTema, 1)).toEqual({
      tipo: 'palavra',
      palavra: comTema.palavra,
    })
    const semDica = comAnaImpostora(novaPartida(Math.random, { dicaImpostor: 'nenhuma' }))
    expect(segredoDe(semDica, 0)).toEqual({ tipo: 'impostor', dica: null })
  })
})
