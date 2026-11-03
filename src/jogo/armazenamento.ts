import type { Configuracao } from './tipos'
import type { Historico } from './sorteio'

const PREFIXO = 'impostor:'

const ler = <T,>(chave: string, padrao: T, valido: (valor: unknown) => valor is T): T => {
  try {
    const bruto = localStorage.getItem(PREFIXO + chave)
    if (bruto === null) return padrao
    const valor: unknown = JSON.parse(bruto)
    return valido(valor) ? valor : padrao
  } catch {
    return padrao
  }
}

const gravar = (chave: string, valor: unknown): void => {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor))
  } catch {
    // Sem armazenamento (aba anônima, cota cheia): o jogo segue sem lembrar.
  }
}

const ehListaDeTextos = (valor: unknown): valor is string[] =>
  Array.isArray(valor) && valor.every((item) => typeof item === 'string')

const ehPlacar = (valor: unknown): valor is Placar =>
  typeof valor === 'object' &&
  valor !== null &&
  !Array.isArray(valor) &&
  Object.values(valor).every((pontos) => typeof pontos === 'number')

/** Configuração salva; os campos novos são opcionais porque versões antigas não os gravavam. */
type CamposNovos = 'modo' | 'nivel' | 'impostores' | 'tempoDica'
type ConfiguracaoSalva = Omit<Configuracao, CamposNovos> & Partial<Record<CamposNovos, unknown>>

const ehConfiguracao = (valor: unknown): valor is ConfiguracaoSalva => {
  if (typeof valor !== 'object' || valor === null) return false
  const config = valor as Record<string, unknown>
  return (
    ehListaDeTextos(config.jogadores) &&
    ehListaDeTextos(config.temaIds) &&
    typeof config.rodadas === 'number' &&
    (config.dicaImpostor === 'tema' || config.dicaImpostor === 'nenhuma' || config.dicaImpostor === 'disfarcado') &&
    (config.modoVotacao === 'secreta' || config.modoVotacao === 'grupo')
  )
}

/** Pontos acumulados por nome de jogador. */
export type Placar = Record<string, number>

export const lerHistorico = (): Historico => ler('historico', [], ehListaDeTextos)
export const gravarHistorico = (historico: Historico) => gravar('historico', historico)

export const lerPlacar = (): Placar => ler('placar', {}, ehPlacar)
export const gravarPlacar = (placar: Placar) => gravar('placar', placar)

export const lerConfiguracao = (): Configuracao | null => {
  const salva = ler('configuracao', null, ehConfiguracaoOuNulo)
  if (!salva) return null
  return {
    ...salva,
    modo: salva.modo === 'dupla' ? 'dupla' : 'classico',
    nivel: salva.nivel === 'facil' || salva.nivel === 'medio' ? salva.nivel : 'todos',
    impostores: typeof salva.impostores === 'number' ? salva.impostores : 1,
    tempoDica: typeof salva.tempoDica === 'number' ? salva.tempoDica : 0,
  }
}
export const gravarConfiguracao = (config: Configuracao) => gravar('configuracao', config)

const ehConfiguracaoOuNulo = (valor: unknown): valor is ConfiguracaoSalva | null =>
  valor === null || ehConfiguracao(valor)

export const somarAoPlacar = (
  placar: Placar,
  jogadores: readonly string[],
  pontos: readonly number[],
): Placar => {
  const novo = { ...placar }
  jogadores.forEach((nome, i) => {
    novo[nome] = (novo[nome] ?? 0) + (pontos[i] ?? 0)
  })
  return novo
}
