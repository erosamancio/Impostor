import { Fingerprint } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Botao } from './Botao'
import { Tela } from './Tela'

type CartaoSecretoProps = {
  nome: string
  etapa?: string
  aoConcluir: () => void
  /** Conteúdo mostrado só enquanto o dedo está no cartão. */
  children: ReactNode
}

/**
 * O segredo fica sob a trama de envelope de segurança, que só se abre enquanto o cartão é pressionado.
 * O cartão tem a mesma aparência para todos, impostor ou não, para que ninguém descubra nada pela cor.
 */
export const CartaoSecreto = ({ nome, etapa, aoConcluir, children }: CartaoSecretoProps) => {
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
      titulo={nome}
      etapa={etapa}
      rodape={
        <Botao disabled={!jaViu} onClick={aoConcluir}>
          Já vi, fechar e passar
        </Botao>
      }
    >
      <p className="mb-5 text-[15px] text-papel-suave">Segure o envelope para abrir. Solte para fechar.</p>
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
          className="relative aspect-[3/4] w-full max-w-80 touch-none overflow-hidden rounded-[22px] bg-envelope shadow-carta ring-1 ring-vinco select-none [-webkit-touch-callout:none]"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-7 text-center">
            {visivel && children}
          </div>
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

/** Conteúdo do cartão para quem recebeu uma palavra. */
export const PalavraSecreta = ({ palavra, temaNome, nota }: { palavra: string; temaNome: string; nota?: string }) => (
  <>
    <span className="text-[15px] font-semibold text-papel-suave">A sua palavra é</span>
    <span className="mt-2 text-[40px] leading-[1.05] font-extrabold tracking-[-0.03em] break-words text-selo">{palavra}</span>
    <span className="mt-6 rounded-full bg-tinta px-3 py-1 text-sm font-semibold text-papel-suave">{temaNome}</span>
    {nota && <span className="mt-4 text-sm text-papel-suave">{nota}</span>}
  </>
)

/** Conteúdo do cartão para o impostor. Mesmo tamanho e cor de uma palavra, para não vazar nada de longe. */
export const AvisoDeImpostor = ({ dica, total }: { dica: string | null; total: number }) => (
  <>
    <span className="text-[15px] font-semibold text-papel-suave">Você é</span>
    <span className="mt-2 text-[40px] leading-[1.05] font-extrabold tracking-[-0.03em] text-selo">
      {total > 1 ? 'um impostor' : 'o impostor'}
    </span>
    <span className="mt-6 rounded-full bg-tinta px-3 py-1 text-sm font-semibold text-papel-suave">
      {dica ? dica : 'Sem dica'}
    </span>
    <span className="mt-4 text-sm text-papel-suave">
      {total > 1 ? `São ${total} impostores, e vocês não sabem quem é o outro. ` : ''}Ouça as dicas e se misture.
    </span>
  </>
)
