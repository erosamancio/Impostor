import { Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Avatar } from '../componentes/Avatar'
import { Botao } from '../componentes/Botao'
import { Tela } from '../componentes/Tela'

type NaMesaProps = {
  jogadores: readonly string[]
  quemComeca: number
  /** Linha que lembra o que está em jogo, como "2 impostores na mesa". */
  aviso: string
  rotuloRevelar: string
  aoRevelar: () => void
}

/** Depois que todos viram o segredo, o celular sai de cena: dicas, conversa e voto são na mesa. */
export const NaMesa = ({ jogadores, quemComeca, aviso, rotuloRevelar, aoRevelar }: NaMesaProps) => {
  const [confirmando, setConfirmando] = useState(false)

  useEffect(() => {
    if (!confirmando) return
    const id = window.setTimeout(() => setConfirmando(false), 4000)
    return () => window.clearTimeout(id)
  }, [confirmando])

  return (
    <Tela
      rodape={
        <Botao
          variante={confirmando ? 'perigo' : 'principal'}
          onClick={() => (confirmando ? aoRevelar() : setConfirmando(true))}
        >
          <Eye size={20} strokeWidth={2.25} aria-hidden />
          {confirmando ? 'Toque de novo para revelar' : rotuloRevelar}
        </Botao>
      }
    >
      <div className="flex flex-1 flex-col justify-center">
        <h1 className="text-[44px] leading-[0.95] font-extrabold tracking-[-0.04em]">Agora é com vocês</h1>
        <p className="mt-3 text-lg leading-snug text-papel-suave">
          Deem as dicas, discutam e votem do jeito de vocês. Quando decidirem, revelem aqui.
        </p>

        <div className="mt-8 flex items-center gap-4 rounded-[22px] bg-envelope p-4 ring-1 ring-vinco">
          <Avatar nome={jogadores[quemComeca] ?? ''} indice={quemComeca} tamanho="medio" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-papel-suave">Quem começa as dicas</p>
            <p className="truncate text-[24px] leading-tight font-extrabold tracking-[-0.02em]">
              {jogadores[quemComeca]}
            </p>
          </div>
        </div>

        <ul aria-label="Na mesa" className="mt-6 flex flex-wrap gap-x-3 gap-y-4">
          {jogadores.map((nome, i) => (
            <li key={nome} className="flex w-16 flex-col items-center gap-1.5">
              <Avatar nome={nome} indice={i} tamanho="medio" />
              <span className="w-full truncate text-center text-[13px] font-semibold text-papel-suave">{nome}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[15px] font-semibold text-selo">{aviso}</p>
      </div>
    </Tela>
  )
}
