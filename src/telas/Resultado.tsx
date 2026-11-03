import { Avatar } from '../componentes/Avatar'
import { Botao } from '../componentes/Botao'
import { Carimbo } from '../componentes/Carimbo'
import { Tela } from '../componentes/Tela'
import type { Partida } from '../jogo/tipos'

type ResultadoProps = {
  partida: Partida
  aoJogarDeNovo: () => void
  aoSair: () => void
}

export const Resultado = ({ partida, aoJogarDeNovo, aoSair }: ResultadoProps) => {
  const { jogadores } = partida.config
  const varios = partida.impostores.length > 1

  return (
    <Tela rodape={<BotoesDoFim aoJogarDeNovo={aoJogarDeNovo} aoSair={aoSair} />}>
      <section className="flex flex-col items-center pt-2 text-center">
        <div className="-my-6 scale-[0.72]">
          <Carimbo linhas={['REVELADO', varios ? 'IMPOSTORES' : 'IMPOSTOR']} cor="aereo" />
        </div>
        <h1 className="mt-2 text-[30px] leading-none font-extrabold tracking-[-0.035em]">
          {varios ? 'Os impostores eram' : 'O impostor era'}
        </h1>
        <ul className="mt-5 flex flex-wrap justify-center gap-5">
          {partida.impostores.map((i) => (
            <li key={i} className="animar-entrada flex flex-col items-center gap-2">
              <Avatar nome={jogadores[i] ?? ''} indice={i} tamanho="grande" />
              <span className="text-[26px] leading-none font-extrabold tracking-[-0.03em] text-aereo">
                {jogadores[i]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="carta mt-8 overflow-hidden rounded-[22px] px-6 pt-8 pb-7 text-tinta shadow-carta">
        <p className="text-[15px] font-semibold text-[#5b6c93]">A palavra era</p>
        <p className="mt-1 text-[38px] leading-[1.05] font-extrabold tracking-[-0.035em] break-words">
          {partida.palavra}
        </p>
        <p className="mt-3 flex items-baseline gap-2 text-[15px]">
          <span className="font-semibold text-[#5b6c93]">Tema</span>
          <span className="font-extrabold">{partida.temaNome}</span>
        </p>
        {partida.palavraDisfarce && (
          <p className="mt-4 border-t border-[#9aa9c9] pt-3 text-[15px]">
            <span className="font-semibold text-[#5b6c93]">
              {varios ? 'Os impostores receberam' : 'O impostor recebeu'}{' '}
            </span>
            <span className="font-extrabold">{partida.palavraDisfarce}</span>
          </p>
        )}
      </div>
    </Tela>
  )
}

export const BotoesDoFim = ({ aoJogarDeNovo, aoSair }: { aoJogarDeNovo: () => void; aoSair: () => void }) => (
  <>
    <Botao onClick={aoJogarDeNovo}>Jogar de novo</Botao>
    <Botao variante="discreto" onClick={aoSair}>
      Voltar ao início
    </Botao>
  </>
)
