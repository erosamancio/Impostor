# Impostor

Jogo do impostor web voltado pra celular.

Todos recebem a mesma palavra secreta, menos o impostor. Cada um dá uma dica por rodada, o grupo discute e vota. Se o impostor for pego, ainda pode roubar a vitória adivinhando a palavra. Tudo acontece em um celular só, passado de mão em mão. Sem anúncios e sem login.

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
- **Dupla** (2 jogadores): cada um recebe uma palavra do mesmo tema; metade das vezes são iguais, metade são parecidas. Depois das dicas, cada um aposta "iguais" ou "diferentes". Quem aposta "diferentes" e acerta ainda pode chutar a palavra do outro.

## Opções do clássico

- **Vários impostores**: 2 a partir de 5 jogadores, 3 a partir de 7. Eles não sabem quem é o outro.
- **O que o impostor recebe**: o nome do tema, nada, ou um **disfarce** (uma palavra parecida, sem saber que é o impostor).
- **Tempo por dica**: livre, 20, 30, 45 ou 60 segundos, com contagem na tela. Vale também na dupla.

A tela **Como jogar** explica as regras e a pontuação dentro do próprio jogo.

## Instalar como app

O jogo é um PWA: no iPhone, Safari → Compartilhar → Adicionar à Tela de Início; no Android, menu do Chrome → Instalar app. Depois de aberto uma vez, funciona sem internet.

## Adicionando palavras

Cada palavra de um tema segue os testes do jogo: todo mundo conhece, dá para descrever, dá para adivinhar ouvindo as dicas, e não tem quase-sinônimo no mesmo tema. As palavras irmãs (usadas no Modo dupla) precisam existir no próprio tema; `npm test` confere isso.

## Publicação

Cada push na `main` publica o jogo no GitHub Pages pelo workflow `.github/workflows/publicar.yml`.
