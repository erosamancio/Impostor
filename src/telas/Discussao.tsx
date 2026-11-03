import { MessagesSquare } from 'lucide-react'
import { Botao } from '../componentes/Botao'
import { Tela } from '../componentes/Tela'

type DiscussaoProps = {
  impostores: number
  aoVotar: () => void
  aoPedirRodada: () => void
}

export const Discussao = ({ impostores, aoVotar, aoPedirRodada }: DiscussaoProps) => (
  <Tela
    rodape={
      <>
        <Botao onClick={aoVotar}>Ir para a votação</Botao>
        <Botao variante="secundario" onClick={aoPedirRodada}>
          Mais uma rodada de dicas
        </Botao>
      </>
    }
  >
    <div className="flex flex-1 flex-col justify-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-envelope text-selo ring-1 ring-vinco">
        <MessagesSquare size={32} strokeWidth={2} />
      </span>
      <h1 className="mt-6 text-[44px] leading-[0.95] font-extrabold tracking-[-0.04em]">Hora de discutir</h1>
      <p className="mt-4 max-w-80 text-lg leading-snug text-papel-suave">
        Quem deu a dica mais estranha? Quem pareceu estar chutando? Conversem e votem quando estiverem prontos.
      </p>
      {impostores > 1 && (
        <p className="mt-6 rounded-2xl bg-envelope px-4 py-3 text-[15px] text-papel ring-1 ring-vinco">
          Nesta partida há <strong className="font-bold text-selo">{impostores} impostores</strong>. Basta pegar um para ele
          tentar o chute.
        </p>
      )}
    </div>
  </Tela>
)
