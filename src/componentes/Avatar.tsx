const CORES = ['#f5c542', '#ff8a65', '#4fc3f7', '#81c784', '#ba68c8', '#f06292', '#4db6ac', '#ffb74d', '#9575cd', '#e57373']

type AvatarProps = { nome: string; indice: number; tamanho?: 'pequeno' | 'grande' }

export const Avatar = ({ nome, indice, tamanho = 'pequeno' }: AvatarProps) => (
  <span
    aria-hidden
    className={`inline-flex shrink-0 items-center justify-center rounded-full font-black text-fundo ${tamanho === 'grande' ? 'size-20 text-4xl' : 'size-9 text-base'}`}
    style={{ backgroundColor: CORES[indice % CORES.length] }}
  >
    {nome.trim().charAt(0).toUpperCase()}
  </span>
)
