import { useId, type ReactNode } from 'react'

/**
 * Cada jogador ganha um personagem desenhado, como o retrato de um selo:
 * fundo colorido, rosto e um detalhe que o distingue de longe (chapéu, cabelo, acessório).
 * O personagem vem da posição na lista, então dois jogadores da mesma mesa nunca se repetem até o 12º.
 */

const FUNDOS = [
  '#ffcd3c',
  '#ff7a5c',
  '#6fa8ff',
  '#46c28a',
  '#c79bff',
  '#ffa94d',
  '#4fd1c5',
  '#ff8fb7',
  '#b5d94a',
  '#9fb3ff',
  '#ffd27a',
  '#7fd6a8',
]
const PELES = ['#f2c9a0', '#a86b45', '#e0ac7e', '#7a4a2c', '#f6d5b8', '#c68a5c']
const TINTA = '#0f1a33'

type Detalhe = { atras?: ReactNode; frente: ReactNode; roupa: string }

const DETALHES: readonly Detalhe[] = [
  // Detetive de chapéu
  {
    roupa: '#5b4a3a',
    frente: (
      <>
        <path d="M21 19 q1-11 11-11 q10 0 11 11z" fill="#3b2f26" />
        <rect x="21" y="15" width="22" height="3.5" fill={TINTA} />
        <ellipse cx="32" cy="19.5" rx="17" ry="3.2" fill="#3b2f26" />
      </>
    ),
  },
  // Artista de boina e bigode
  {
    roupa: '#2f3d6b',
    frente: (
      <>
        <ellipse cx="30" cy="19" rx="14" ry="5.5" fill="#d8342b" />
        <circle cx="30" cy="13" r="1.8" fill="#d8342b" />
        <path d="M27 35 q5-3 10 0 q-2 2-5 1 q-3 1-5-1z" fill="#2b1d14" />
      </>
    ),
  },
  // Boné virado para o lado
  {
    roupa: '#d8342b',
    frente: (
      <>
        <path d="M19 26 q0-12 13-12 q13 0 13 12z" fill="#2f6fd6" />
        <path d="M44 24 h9 q1 3-2 3 h-7z" fill="#2459b0" />
        <circle cx="32" cy="14.5" r="1.5" fill="#2459b0" />
      </>
    ),
  },
  // Coque e óculos redondos
  {
    roupa: '#46c28a',
    atras: <circle cx="32" cy="12" r="6" fill="#5a3a22" />,
    frente: (
      <>
        <path d="M19 28 q0-13 13-13 q13 0 13 13 q-3-7-13-7 q-10 0-13 7z" fill="#5a3a22" />
        <g fill="none" stroke={TINTA} strokeWidth="1.6">
          <circle cx="27" cy="30" r="3.6" />
          <circle cx="37" cy="30" r="3.6" />
          <path d="M30.6 30 h2.8" />
        </g>
      </>
    ),
  },
  // Fones de ouvido
  {
    roupa: '#7a5ad8',
    frente: (
      <>
        <path d="M19 27 q0-13 13-13 q13 0 13 13" fill="none" stroke={TINTA} strokeWidth="3" />
        <rect x="15.5" y="25" width="6" height="10" rx="2.5" fill="#ff5a45" />
        <rect x="42.5" y="25" width="6" height="10" rx="2.5" fill="#ff5a45" />
      </>
    ),
  },
  // Coroa
  {
    roupa: '#b23a6b',
    frente: (
      <>
        <path d="M22 20 l-1-10 l6 5 l5-7 l5 7 l6-5 l-1 10z" fill="#ffcd3c" stroke="#c99a12" strokeWidth="1" />
        <circle cx="32" cy="15.5" r="1.5" fill="#ff5a45" />
      </>
    ),
  },
  // Gorro de lã
  {
    roupa: '#2f8f6a',
    frente: (
      <>
        <path d="M19 24 q0-14 13-14 q13 0 13 14z" fill="#ff7a5c" />
        <rect x="18.5" y="21" width="27" height="5" rx="2.5" fill="#e0573c" />
        <circle cx="32" cy="9" r="3.5" fill="#fff4e0" />
      </>
    ),
  },
  // Marias-chiquinhas
  {
    roupa: '#ff8fb7',
    atras: (
      <>
        <circle cx="16" cy="30" r="5.5" fill="#d9a441" />
        <circle cx="48" cy="30" r="5.5" fill="#d9a441" />
      </>
    ),
    frente: <path d="M19 27 q0-13 13-13 q13 0 13 13 q-6-6-13-4 q-7-2-13 4z" fill="#d9a441" />,
  },
  // Cartola e monóculo
  {
    roupa: '#1d2440',
    frente: (
      <>
        <rect x="23" y="4" width="18" height="15" rx="1.5" fill="#1a1a1a" />
        <rect x="23" y="14" width="18" height="3" fill="#ff5a45" />
        <ellipse cx="32" cy="19.5" rx="14" ry="2.6" fill="#1a1a1a" />
        <circle cx="37" cy="30" r="3.8" fill="none" stroke="#c99a12" strokeWidth="1.5" />
        <path d="M40.5 31.5 q2 5 0 9" fill="none" stroke="#c99a12" strokeWidth="1" />
      </>
    ),
  },
  // Cabelo black power
  {
    roupa: '#ffa94d',
    atras: <circle cx="32" cy="24" r="18" fill="#2b1d14" />,
    frente: <path d="M20 25 q2-9 12-9 q10 0 12 9 q-5-4-12-4 q-7 0-12 4z" fill="#2b1d14" />,
  },
  // Bandana e tapa-olho
  {
    roupa: '#3a4f8a',
    frente: (
      <>
        <path d="M19 24 q0-11 13-11 q13 0 13 11z" fill="#d8342b" />
        <path d="M44 22 l7 3 l-6 2z" fill="#d8342b" />
        <circle cx="25" cy="18" r="1.2" fill="#fff4e0" />
        <circle cx="37" cy="17" r="1.2" fill="#fff4e0" />
        <path d="M20 26 L44 33" stroke={TINTA} strokeWidth="1.2" />
        <ellipse cx="37" cy="30" rx="3.6" ry="3.2" fill={TINTA} />
      </>
    ),
  },
  // Chapéu de cozinheiro
  {
    roupa: '#eef1f8',
    frente: (
      <>
        <rect x="22" y="15" width="20" height="6" rx="1" fill="#ffffff" stroke="#c9d3e8" strokeWidth="1" />
        <circle cx="25" cy="12" r="5" fill="#ffffff" />
        <circle cx="32" cy="9" r="6" fill="#ffffff" />
        <circle cx="39" cy="12" r="5" fill="#ffffff" />
      </>
    ),
  },
]

type AvatarProps = {
  nome: string
  indice: number
  tamanho?: 'pequeno' | 'medio' | 'grande'
}

const TAMANHOS = {
  pequeno: 'size-9',
  medio: 'size-12',
  grande: 'size-24',
} as const

export const Avatar = ({ nome, indice, tamanho = 'pequeno' }: AvatarProps) => {
  const detalhe = DETALHES[indice % DETALHES.length] ?? DETALHES[0]
  const fundo = FUNDOS[indice % FUNDOS.length]
  const pele = PELES[indice % PELES.length]
  const tapaOlho = indice % DETALHES.length === 10
  const recorte = useId()

  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={`Personagem de ${nome}`}
      className={`shrink-0 rounded-full ${TAMANHOS[tamanho]}`}
    >
      <clipPath id={recorte}>
        <circle cx="32" cy="32" r="32" />
      </clipPath>
      <circle cx="32" cy="32" r="32" fill={fundo} />
      <g clipPath={`url(#${recorte})`}>
        {detalhe?.atras}
        <path d="M10 66 q2-20 22-20 q20 0 22 20z" fill={detalhe?.roupa} />
        <rect x="28" y="40" width="8" height="8" rx="3" fill={pele} />
        <circle cx="32" cy="30" r="13" fill={pele} />
        <circle cx="27" cy="30" r="1.8" fill={TINTA} />
        {!tapaOlho && <circle cx="37" cy="30" r="1.8" fill={TINTA} />}
        <circle cx="24" cy="34" r="2" fill="#ff7a5c" opacity="0.35" />
        <circle cx="40" cy="34" r="2" fill="#ff7a5c" opacity="0.35" />
        <path d="M28.5 37 q3.5 2.6 7 0" fill="none" stroke={TINTA} strokeWidth="1.5" strokeLinecap="round" />
        {detalhe?.frente}
      </g>
    </svg>
  )
}
