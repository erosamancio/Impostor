---
name: Impostor
description: Envelope de segurança. O celular é um envelope lacrado; o segredo fica sob uma trama que só se abre enquanto o dedo está nela.
colors:
  tinta: "#0f1a33"
  envelope: "#172647"
  envelope-alto: "#20325c"
  vinco: "#31497c"
  trama: "#1d2e57"
  trama-forte: "#2a3f73"
  papel: "#eef1f8"
  papel-suave: "#a7b6d8"
  selo: "#ffcd3c"
  selo-escuro: "#c99a12"
  aereo: "#ff5a45"
  postal: "#46c28a"
typography:
  wordmark:
    fontFamily: Bricolage Grotesque Variable
    fontSize: 64px
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: -0.045em
  segredo:
    fontFamily: Bricolage Grotesque Variable
    fontSize: 40px
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -0.03em
  titulo:
    fontFamily: Bricolage Grotesque Variable
    fontSize: 22px
    fontWeight: 800
    letterSpacing: -0.02em
  corpo:
    fontFamily: Bricolage Grotesque Variable
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.4
  apoio:
    fontFamily: Bricolage Grotesque Variable
    fontSize: 15px
    fontWeight: 600
rounded:
  botao: 14px
  cartao: 16px
  envelope: 22px
  pilula: 9999px
spacing:
  gutter: 20px
  pilha: 10px
  secao: 36px
components:
  button-principal:
    backgroundColor: "{colors.selo}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.botao}"
    height: 56px
  button-secundario:
    backgroundColor: "{colors.envelope-alto}"
    textColor: "{colors.papel}"
    rounded: "{rounded.botao}"
    height: 56px
  button-perigo:
    backgroundColor: "{colors.aereo}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.botao}"
    height: 56px
  cartao:
    backgroundColor: "{colors.envelope}"
    textColor: "{colors.papel}"
    rounded: "{rounded.cartao}"
    padding: 16px
  selo-de-tema:
    backgroundColor: "{colors.selo}"
    textColor: "{colors.tinta}"
    padding: 16px
---

# Impostor: Envelope de segurança

## Visão geral

O jogo inteiro acontece num celular que passa de mão em mão, quase sempre à noite, numa mesa. A interface trata o celular como um envelope de segurança: por fora, azul-tinta escuro e papel; por dentro, um segredo coberto pela trama azul com a palavra IMPOSTOR repetida, que só se abre enquanto o dedo segura o cartão.

O mundo é o do correio: selo amarelo picotado, faixa de correio aéreo vermelha e azul, carimbo postal. O amarelo do selo é a única cor de ação. O vermelho aéreo marca o impostor revelado; o verde postal marca palavras iguais.

## Cores

- **tinta** é o fundo de tudo. Escuro para não iluminar a mesa nem quem está ao lado.
- **envelope / envelope-alto / vinco** são as superfícies e bordas, sempre com `ring-1 ring-vinco` em vez de sombra pesada.
- **papel** é o texto principal; **papel-suave** o de apoio. Nunca cinza neutro: tudo puxa para o azul.
- **selo** é a ação principal, a palavra secreta e os destaques. Uma cor de ação só.
- **aereo** é o impostor revelado e a confirmação de revelar. **postal** é acerto.

## Tipografia

Uma família só, Bricolage Grotesque variável, servida localmente (funciona offline). Pesos 400 a 800. Títulos grandes com tracking negativo; números com `tabular-nums`. Sem rótulos em caixa alta acima de títulos.

## Elevação e forma

Sombras difusas e azuladas (`shadow-carta`, `shadow-selo`), nunca sombra dura deslocada. Cantos: 14px nos botões, 16px nos cartões, 22px no envelope secreto. A borda picotada (`.picote`) aparece só em coisas que são selos: temas e números de passo.

## Movimento

Entrada curta (`surgir`, 360ms, ease-saida) em cada tela. A trama do envelope sobe por clip-path em 200ms. O carimbo do resultado é o único momento de movimento forte. Tudo respeita `prefers-reduced-motion`.

## Carta aberta e personagens

- A carta de dentro do envelope é papel claro com faixa de correio aéreo, carimbo "Correio secreto" e selo. Palavra e aviso de impostor usam o mesmo desenho, com o mesmo tamanho de texto e uma nota de duas linhas, para não vazar nada de longe.
- Cada jogador é um personagem desenhado em SVG (12 ao todo), como o retrato de um selo: fundo colorido, rosto e um detalhe que distingue de longe.

## Regras do jogo que viram regras de design

- **O cartão do impostor é idêntico ao de quem sabe a palavra.** Mesma cor, mesmo tamanho, mesmo amarelo. Nada de vermelho, nada de vibração. De longe ninguém pode distinguir.
- **Uma pessoa por vez.** A mesma tela chama quem deve pegar o celular e guarda o segredo dessa pessoa.
- **O celular sai de cena.** Dicas, discussão e voto são na mesa; o app só mostra quem começa e revela no fim, com um toque de confirmação.
- **Ações embaixo, ao alcance do polegar.** O rodapé é fixo, com degradê para tinta.

## Faça e não faça

- Faça: ícones Lucide, um botão principal por tela, texto em português do Brasil curto e direto.
- Não faça: emoji como ícone, texto em degradê, sombras duras, cor diferente para o impostor no cartão secreto, anúncios.
