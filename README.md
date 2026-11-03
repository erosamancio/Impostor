# Impostor

Jogo do impostor web voltado pra celular.

Todos recebem a mesma palavra secreta, menos o impostor. O celular passa de mão em mão para cada um ver o seu segredo; depois, dicas, discussão e voto acontecem na mesa, do jeito do grupo. Quando decidirem, um botão revela o impostor e a palavra. Sem anúncios e sem login.

## Rodando localmente

```bash
npm install
npm run dev     # servidor de desenvolvimento
npm test        # testes das regras e dos temas
npm run build   # versão de produção em dist/
```

## Estrutura

- `src/jogo/` regras da partida (funções puras e testadas), sorteio e armazenamento local
- `src/temas/` um arquivo por tema com as palavras, a dificuldade e as palavras irmãs
- `src/telas/` uma tela por etapa da partida
- `src/componentes/` peças visuais compartilhadas
- `PRODUCT.md` e `DESIGN.md` o produto e o visual (Envelope de segurança)

## Temas

Comidas e bebidas, Países, Lugares do Brasil, Lugares da cidade, Animais, Profissões e Esportes. Dá para jogar com um tema ou misturar vários, e filtrar as palavras por dificuldade.

## Modos

- **Clássico** (3 a 20 jogadores): todos recebem a mesma palavra, menos o impostor.
- **Dupla** (2 jogadores): cada um recebe uma palavra do mesmo tema; metade das vezes são iguais, metade são parecidas. Depois das dicas, cada um diz se acha que as palavras são iguais, e o celular revela as duas.

## Opções do clássico

- **Vários impostores**: 2 a partir de 5 jogadores, 3 a partir de 7. Eles não sabem quem é o outro.
- **O que o impostor recebe**: o nome do tema, nada, ou um **disfarce** (uma palavra parecida, sem saber que é o impostor).

A tela **Como jogar** explica as regras dentro do próprio jogo. Cada jogador ganha um personagem desenhado, pela posição na lista.

## Instalar como app

O jogo é um PWA: no iPhone, Safari → Compartilhar → Adicionar à Tela de Início; no Android, menu do Chrome → Instalar app. Depois de aberto uma vez, funciona sem internet.

## Adicionando palavras

Cada palavra de um tema segue os testes do jogo: todo mundo conhece, dá para descrever, dá para adivinhar ouvindo as dicas, e não tem quase-sinônimo no mesmo tema. As palavras irmãs (usadas no Modo dupla) precisam existir no próprio tema; `npm test` confere isso.

## Publicação

Cada push na `main` publica o jogo no GitHub Pages pelo workflow `.github/workflows/publicar.yml`.
