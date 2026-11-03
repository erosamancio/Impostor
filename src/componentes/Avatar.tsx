/** Cores de selos e carimbos, para cada jogador ter a sua. */
const CORES = ['#ffcd3c', '#ff7a5c', '#6fa8ff', '#46c28a', '#c79bff', '#ffa94d', '#4fd1c5', '#ff8fb7', '#b5d94a', '#9fb3ff']

type AvatarProps = { nome: string; indice: number; tamanho?: 'pequeno' | 'medio' | 'grande' }

const TAMANHOS = {
  pequeno: 'size-9 text-[15px]',
  medio: 'size-12 text-xl',
  grande: 'size-24 text-[44px]',
} as const

export const Avatar = ({ nome, indice, tamanho = 'pequeno' }: AvatarProps) => (
  <span
    aria-hidden
    className={`inline-flex shrink-0 items-center justify-center rounded-full font-extrabold text-tinta ${TAMANHOS[tamanho]}`}
    style={{ backgroundColor: CORES[indice % CORES.length] }}
  >
    {nome.trim().charAt(0).toUpperCase()}
  </span>
)
