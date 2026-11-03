import { Download } from 'lucide-react'
import type { ReactNode } from 'react'
import { Botao } from '../componentes/Botao'
import { Tela } from '../componentes/Tela'

type ComoJogarProps = { aoVoltar: () => void }

const PASSOS_CLASSICO = [
  {
    titulo: 'Cada um vê o seu segredo',
    texto:
      'O celular passa de mão em mão. Quem está com ele segura o envelope para ver a palavra. Quem é impostor não recebe a palavra: vê só o tema, ou nada.',
  },
  {
    titulo: 'Dicas na mesa',
    texto:
      'O celular mostra quem começa. Daí em diante é com vocês: cada um diz uma palavra ou frase curta sobre a palavra secreta, quantas voltas quiserem.',
  },
  {
    titulo: 'Discussão e voto',
    texto: 'Conversem, desconfiem e votem em quem parece estar blefando, do jeito que preferirem.',
  },
  {
    titulo: 'Revelar',
    texto: 'Quando decidirem, toquem em revelar. O celular mostra quem era o impostor e qual era a palavra.',
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
      </dl>
    </Secao>

    <Secao titulo="Dupla" nota="Para 2 pessoas">
      <p className="text-[15px] leading-relaxed text-papel-suave">
        Cada um recebe uma palavra do mesmo tema. Às vezes são iguais, às vezes só parecidas. Vocês trocam dicas e, no
        fim, cada um diz se acha que as palavras são iguais. Depois revelem as duas no celular.
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
