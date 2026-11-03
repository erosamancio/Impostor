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

## Modos

- **Clássico** (3 a 20 jogadores): todos recebem a mesma palavra, menos o impostor.
- **Dupla** (2 jogadores): cada um recebe uma palavra do mesmo tema; metade das vezes são iguais, metade são parecidas. Depois das dicas, cada um aposta "iguais" ou "diferentes". Quem aposta "diferentes" e acerta ainda pode chutar a palavra do outro.
- `src/telas/` uma tela por etapa da partida
- `src/componentes/` peças visuais compartilhadas

## Adicionando palavras

Cada palavra de um tema segue os testes do jogo: todo mundo conhece, dá para descrever, dá para adivinhar ouvindo as dicas, e não tem quase-sinônimo no mesmo tema. As palavras irmãs (usadas no Modo dupla) precisam existir no próprio tema; `npm test` confere isso.

## Publicação

Cada push na `main` publica o jogo no GitHub Pages pelo workflow `.github/workflows/publicar.yml`.
