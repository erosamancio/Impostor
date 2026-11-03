import { Fingerprint } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Avatar } from './Avatar'
import { Botao } from './Botao'
import { Tela } from './Tela'

type CartaoSecretoProps = {
  nome: string
  indice: number
  etapa: string
  /** Texto do botão depois de ver, como "Já vi, passar para Bia". */
  rotuloConcluir: string
  aoConcluir: () => void
  /** A carta: aparece só enquanto o dedo está no envelope. */
  children: ReactNode
}

/**
 * Numa tela só: chama quem deve pegar o celular e guarda o segredo dessa pessoa sob a trama
 * de envelope de segurança, que só se abre enquanto o cartão é pressionado.
 * A carta tem a mesma aparência para todos, impostor ou não, para que ninguém descubra nada pela cor.
 */
export const CartaoSecreto = ({ nome, indice, etapa, rotuloConcluir, aoConcluir, children }: CartaoSecretoProps) => {
  const [visivel, setVisivel] = useState(false)
  const [jaViu, setJaViu] = useState(false)

  useEffect(() => {
    const esconder = () => setVisivel(false)
    document.addEventListener('visibilitychange', esconder)
    window.addEventListener('blur', esconder)
    return () => {
      document.removeEventListener('visibilitychange', esconder)
      window.removeEventListener('blur', esconder)
    }
  }, [])

  const mostrar = () => {
    setVisivel(true)
    setJaViu(true)
  }
  const esconder = () => setVisivel(false)

  return (
    <Tela
      etapa={etapa}
      rodape={
        <Botao disabled={!jaViu} onClick={aoConcluir}>
          {rotuloConcluir}
        </Botao>
      }
    >
      <div className="animar-entrada flex items-center gap-3.5">
        <Avatar nome={nome} indice={indice} tamanho="medio" />
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-papel-suave">Passe o celular para</p>
          <h1 className="truncate text-[34px] leading-none font-extrabold tracking-[-0.035em]">{nome}</h1>
        </div>
      </div>
      <p className="mt-3 mb-4 text-[15px] text-papel-suave">Só {nome} olha. Segure o envelope para abrir.</p>

      <div className="flex flex-1 items-center justify-center">
        <div
          role="button"
          tabIndex={0}
          aria-label="Segure para ver o seu segredo"
          aria-pressed={visivel}
          onPointerDown={mostrar}
          onPointerUp={esconder}
          onPointerLeave={esconder}
          onPointerCancel={esconder}
          onKeyDown={(e) => e.key === ' ' && mostrar()}
          onKeyUp={esconder}
          onContextMenu={(e) => e.preventDefault()}
          className="relative aspect-[3/4] h-[min(27rem,calc(100dvh-20rem))] max-w-full min-h-72 touch-none overflow-hidden rounded-[22px] bg-envelope shadow-carta ring-1 ring-vinco select-none [-webkit-touch-callout:none]"
        >
          <div className="absolute inset-0">{visivel && children}</div>
          <div
            aria-hidden
            className={`trama absolute inset-0 flex flex-col items-center justify-center gap-4 transition-[clip-path] duration-200 ease-(--ease-saida) ${
              visivel ? '[clip-path:inset(0_0_100%_0)]' : '[clip-path:inset(0_0_0_0)]'
            }`}
          >
            <span className="flex size-20 items-center justify-center rounded-full bg-tinta/85 text-selo ring-1 ring-vinco">
              <Fingerprint size={40} strokeWidth={1.75} />
            </span>
            <span className="rounded-full bg-tinta/85 px-4 py-1.5 text-[17px] font-bold">Segure para abrir</span>
          </div>
        </div>
      </div>
    </Tela>
  )
}

type CartaProps = {
  rotulo: string
  destaque: string
  tema: string
  nota?: string
}

/**
 * A carta de dentro do envelope: papel, faixa de correio aéreo, selo e carimbo.
 * Palavra e aviso de impostor usam exatamente o mesmo desenho.
 */
const Carta = ({ rotulo, destaque, tema, nota }: CartaProps) => (
  <div className="carta flex h-full flex-col px-6 pt-8 pb-7 text-tinta">
    <div className="flex items-start justify-between">
      <svg viewBox="0 0 76 64" aria-hidden className="w-[76px] text-[#2a3f73] opacity-60">
        <g fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="30" cy="32" r="26" />
          <circle cx="30" cy="32" r="20" />
          <path d="M54 22 q6-4 11 0 t11 0 M56 32 q6-4 10 0 t10 0 M54 42 q6-4 11 0 t11 0" />
        </g>
        <text x="30" y="30" textAnchor="middle" fontSize="7" fontWeight="800" fill="currentColor" letterSpacing="0.6">
          CORREIO
        </text>
        <text x="30" y="40" textAnchor="middle" fontSize="7" fontWeight="800" fill="currentColor" letterSpacing="0.6">
          SECRETO
        </text>
      </svg>
      <span className="picote -mt-2 -mr-1 flex h-[78px] w-[66px] rotate-3 flex-col items-center justify-center bg-selo p-2">
        <svg viewBox="0 0 40 40" aria-hidden className="size-9">
          <circle cx="20" cy="20" r="17" fill="#0f1a33" />
          <path d="M5 18 q15-9 30 0 q-3 8-9 8 q-4 0-6-4 q-2 4-6 4 q-6 0-9-8z" fill="#ffcd3c" />
        </svg>
        <span className="mt-0.5 text-[9px] font-extrabold tracking-wide">R$ 0,00</span>
      </span>
    </div>

    <div className="flex flex-1 flex-col justify-center">
      <p className="text-[15px] font-semibold text-[#5b6c93]">{rotulo}</p>
      <p className="mt-1 text-[42px] leading-[1.02] font-extrabold tracking-[-0.035em] break-words">{destaque}</p>
      <span className="mt-3 block h-px w-full bg-[#9aa9c9]" />
      {nota && <p className="mt-3 text-[14px] leading-snug text-[#45557c]">{nota}</p>}
    </div>

    <p className="flex items-baseline gap-2 text-[15px]">
      <span className="font-semibold text-[#5b6c93]">Tema</span>
      <span className="font-extrabold">{tema}</span>
    </p>
  </div>
)

/** Carta de quem recebeu uma palavra. */
export const PalavraSecreta = ({ palavra, temaNome, nota }: { palavra: string; temaNome: string; nota?: string }) => (
  <Carta
    rotulo="A sua palavra é"
    destaque={palavra}
    tema={temaNome}
    nota={nota ?? 'Dê dicas que provem que você sabe, sem entregar a palavra.'}
  />
)

/** Carta do impostor. Mesmo papel, tamanho e cor de uma palavra, para não vazar nada de longe. */
export const AvisoDeImpostor = ({ dica, total }: { dica: string | null; total: number }) => (
  <Carta
    rotulo="Você é"
    destaque={total > 1 ? 'um impostor' : 'o impostor'}
    tema={dica ?? 'sem dica'}
    nota={`${total > 1 ? `São ${total} impostores, e vocês não sabem quem é o outro. ` : ''}Ouça as dicas e se misture.`}
  />
)
