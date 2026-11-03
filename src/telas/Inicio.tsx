import { Botao } from '../componentes/Botao'
import { Tela } from '../componentes/Tela'
import type { Placar } from '../jogo/armazenamento'

type InicioProps = {
  placar: Placar
  podeRepetir: boolean
  aoNovoJogo: () => void
  aoRepetir: () => void
  aoZerarPlacar: () => void
}

export const Inicio = ({ placar, podeRepetir, aoNovoJogo, aoRepetir, aoZerarPlacar }: InicioProps) => {
  const classificacao = Object.entries(placar).sort(([, a], [, b]) => b - a)

  return (
    <Tela
      rodape={
        <>
          {podeRepetir && <Botao onClick={aoRepetir}>Jogar de novo</Botao>}
          <Botao variante={podeRepetir ? 'secundario' : 'principal'} onClick={aoNovoJogo}>
            Novo jogo
          </Botao>
        </>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
        <img src="./icone.svg" alt="" className="size-24" />
        <h1 className="text-6xl font-black tracking-tight">Impostor</h1>
        <p className="max-w-72 text-lg text-texto-suave">
          Todos sabem a palavra secreta, menos um. Dê dicas, desconfie e descubra quem está blefando.
        </p>
      </div>

      {classificacao.length > 0 && (
        <section className="rounded-2xl bg-superficie p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-extrabold tracking-wider text-texto-suave uppercase">Placar da noite</h2>
            <button type="button" onClick={aoZerarPlacar} className="text-sm font-bold text-texto-suave underline">
              Zerar
            </button>
          </div>
          <ol className="flex flex-col gap-1">
            {classificacao.map(([nome, pontos]) => (
              <li key={nome} className="flex justify-between text-lg">
                <span className="truncate font-bold">{nome}</span>
                <span className="font-black tabular-nums">{pontos}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </Tela>
  )
}
