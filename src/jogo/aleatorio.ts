/** Retorna um número em [0, 1). Injetável para os testes serem determinísticos. */
export type Aleatorio = () => number

const LIMITE_UINT32 = 2 ** 32

export const aleatorioSeguro: Aleatorio = () => {
  const buffer = new Uint32Array(1)
  crypto.getRandomValues(buffer)
  return (buffer[0] ?? 0) / LIMITE_UINT32
}

export const sortearIndice = (tamanho: number, aleatorio: Aleatorio): number =>
  Math.floor(aleatorio() * tamanho)

export const embaralhar = <T,>(lista: readonly T[], aleatorio: Aleatorio): T[] => {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = sortearIndice(i + 1, aleatorio)
    const atual = copia[i] as T
    copia[i] = copia[j] as T
    copia[j] = atual
  }
  return copia
}
