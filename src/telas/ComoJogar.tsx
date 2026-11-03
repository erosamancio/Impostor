import { Download } from 'lucide-react'
import type { ReactNode } from 'react'
import { Botao } from '../componentes/Botao'
import { Tela } from '../componentes/Tela'

type ComoJogarProps = { aoVoltar: () => void }

const PASSOS_CLASSICO = [
  {
    titulo: 'Cada um vê o seu segredo',
    texto:
      'O celular passa de mão em mão. Segure o envelope para ver a palavra. Quem é impostor não recebe a palavra: vê só o tema, ou nada.',
  },
  {
    titulo: 'Rodadas de dicas',
    texto:
      'Na ordem que aparece na tela, cada pessoa diz uma palavra ou frase curta sobre a palavra secreta. Clara o bastante para provar que sabe, vaga o bastante para não entregar.',
  },
  {
    titulo: 'Discussão e voto',
    texto: 'Conversem sobre as dicas e votem em quem parece estar blefando, em segredo ou todos juntos.',
  },
  {
    titulo: 'Última chance',
    texto:
      'Se pegarem um impostor, ele tenta adivinhar a palavra em voz alta. Acertou, rouba a vitória. Errou, o grupo vence.',
  },
] as const

export const ComoJogar = ({ aoVoltar }: ComoJogarProps) => (
  <Tela titulo="Como jogar" aoVoltar={aoVoltar} rodape={<Botao onClick={aoVoltar}>Entendi</Botao>}>
    <Secao titulo="Clássico" nota="3 a 20 pessoas, um celular só">
      <ol className="flex flex-col gap-5">
        {PASSOS_CLASSICO.map((passo, i) => (
          <li key={passo.titulo} className="flex gap-4">
            <span className="picote flex size-11 shrink-0 items-center justify-center bg-selo p-2 text-[19px] font-extrabold text-tinta tabular-nums">
              {i + 1}
            </span>
            <div>
              <h3 className="text-[17px] font-bold">{passo.titulo}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-papel-suave">{passo.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </Secao>

    <Secao titulo="Variações">
      <dl className="flex flex-col gap-4">
        <Termo nome="Vários impostores">
          Com 5 pessoas ou mais, dá para ter 2 impostores, e com 7 ou mais, 3. Eles não sabem quem é o outro.
        </Termo>
        <Termo nome="Impostor disfarçado">
          O impostor recebe uma palavra parecida, como “moqueca” no lugar de “feijoada”, e nem sabe que é o impostor.
        </Termo>
        <Termo nome="Tempo por dica">Um relógio na tela marca quanto tempo cada pessoa tem para dar a dica.</Termo>
      </dl>
    </Secao>

    <Secao titulo="Pontos">
      <ul className="flex flex-col divide-y divide-vinco overflow-hidden rounded-2xl bg-envelope ring-1 ring-vinco">
        <Ponto valor={2}>Impostor que não foi pego</Ponto>
        <Ponto valor={1}>Impostor pego que acertou a palavra</Ponto>
        <Ponto valor={1}>Quem votou em um impostor</Ponto>
      </ul>
    </Secao>

    <Secao titulo="Dupla" nota="Para 2 pessoas">
      <p className="text-[15px] leading-relaxed text-papel-suave">
        Cada um recebe uma palavra do mesmo tema. Às vezes são iguais, às vezes só parecidas. Depois das dicas, cada um
        aposta em segredo se as palavras são iguais. Acertar a aposta vale 1 ponto. Quem acertar que eram diferentes ainda
        tenta adivinhar a palavra do outro, por mais 1 ponto.
      </p>
    </Secao>

    <Secao titulo="Instalar no celular">
      <div className="flex gap-4 rounded-2xl bg-envelope p-4 ring-1 ring-vinco">
        <Download size={22} strokeWidth={2.25} className="mt-0.5 shrink-0 text-selo" aria-hidden />
        <p className="text-[15px] leading-relaxed text-papel-suave">
          No iPhone, abra no Safari, toque em Compartilhar e depois em “Adicionar à Tela de Início”. No Android, abra o
          menu do Chrome e toque em “Instalar app”. Depois de instalado, o jogo funciona sem internet.
        </p>
      </div>
    </Secao>
  </Tela>
)

const Secao = ({ titulo, nota, children }: { titulo: string; nota?: string; children: ReactNode }) => (
  <section className="mb-9">
    <div className="mb-4 flex items-baseline justify-between gap-3">
      <h2 className="text-[26px] font-extrabold tracking-[-0.03em]">{titulo}</h2>
      {nota && <span className="text-sm text-papel-suave">{nota}</span>}
    </div>
    {children}
  </section>
)

const Termo = ({ nome, children }: { nome: string; children: ReactNode }) => (
  <div>
    <dt className="text-[17px] font-bold">{nome}</dt>
    <dd className="mt-1 text-[15px] leading-relaxed text-papel-suave">{children}</dd>
  </div>
)

const Ponto = ({ valor, children }: { valor: number; children: ReactNode }) => (
  <li className="flex min-h-13 items-center gap-3 px-4 py-3">
    <span className="flex-1 text-[15px]">{children}</span>
    <span className="text-xl font-extrabold text-postal tabular-nums">+{valor}</span>
  </li>
)
