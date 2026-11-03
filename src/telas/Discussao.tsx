import { Botao } from '../componentes/Botao'
import { Tela } from '../componentes/Tela'

type DiscussaoProps = {
  aoVotar: () => void
  aoPedirRodada: () => void
}

export const Discussao = ({ aoVotar, aoPedirRodada }: DiscussaoProps) => (
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
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <span className="text-7xl" aria-hidden>
        🕵️
      </span>
      <h1 className="text-4xl font-black">Hora de discutir</h1>
      <p className="max-w-72 text-lg text-texto-suave">
        Quem deu a dica mais estranha? Quem pareceu estar chutando? Conversem e decidam quando votar.
      </p>
    </div>
  </Tela>
)
