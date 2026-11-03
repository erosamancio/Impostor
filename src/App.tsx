import { useState } from 'react'
import { useTelaAcesa } from './componentes/useTelaAcesa'
import { aleatorioSeguro } from './jogo/aleatorio'
import { gravarConfiguracao, gravarHistorico, lerConfiguracao, lerHistorico } from './jogo/armazenamento'
import { avancarDupla, criarPartidaDupla, type AcaoDupla, type PartidaDupla } from './jogo/dupla'
import { avancarPartida, criarPartida, quemComeca, type Acao } from './jogo/partida'
import type { Configuracao, Partida } from './jogo/tipos'
import { TEMAS, buscarTema } from './temas'
import { ComoJogar } from './telas/ComoJogar'
import { Inicio } from './telas/Inicio'
import { NaMesa } from './telas/NaMesa'
import { TelaDaDupla } from './telas/PartidaDupla'
import { NovoJogo } from './telas/NovoJogo'
import { Resultado } from './telas/Resultado'
import { Revelacao } from './telas/Revelacao'

type Navegacao =
  | { tela: 'inicio' }
  | { tela: 'novoJogo' }
  | { tela: 'comoJogar' }
  | { tela: 'partida'; partida: Partida }
  | { tela: 'dupla'; partida: PartidaDupla; config: Configuracao }

const CONFIG_PADRAO: Configuracao = {
  modo: 'classico',
  nivel: 'todos',
  jogadores: [],
  temaIds: TEMAS.map((tema) => tema.id),
  dicaImpostor: 'tema',
  impostores: 1,
}

export const App = () => {
  const [navegacao, setNavegacao] = useState<Navegacao>({ tela: 'inicio' })
  const [ultimaConfig, setUltimaConfig] = useState<Configuracao | null>(lerConfiguracao)

  useTelaAcesa(navegacao.tela === 'partida' || navegacao.tela === 'dupla')

  const comecar = (config: Configuracao) => {
    const temas = config.temaIds.flatMap((id) => buscarTema(id) ?? [])
    gravarConfiguracao(config)
    setUltimaConfig(config)

    const [primeiro, segundo] = config.jogadores
    if (config.modo === 'dupla' && primeiro !== undefined && segundo !== undefined) {
      const dupla = {
        jogadores: [primeiro, segundo] as const,
        nivel: config.nivel,
      }
      const { partida, historico } = criarPartidaDupla(dupla, temas, lerHistorico(), aleatorioSeguro)
      gravarHistorico(historico)
      setNavegacao({ tela: 'dupla', partida, config })
      return
    }

    const { partida, historico } = criarPartida(config, temas, lerHistorico(), aleatorioSeguro)
    gravarHistorico(historico)
    setNavegacao({ tela: 'partida', partida })
  }

  const avancar = (partida: Partida, acao: Acao) =>
    setNavegacao({ tela: 'partida', partida: avancarPartida(partida, acao) })

  const avancarNaDupla = (partida: PartidaDupla, config: Configuracao, acao: AcaoDupla) =>
    setNavegacao({
      tela: 'dupla',
      partida: avancarDupla(partida, acao),
      config,
    })

  const irParaInicio = () => setNavegacao({ tela: 'inicio' })

  switch (navegacao.tela) {
    case 'inicio':
      return (
        <Inicio
          podeRepetir={ultimaConfig !== null}
          aoNovoJogo={() => setNavegacao({ tela: 'novoJogo' })}
          aoRepetir={() => ultimaConfig && comecar(ultimaConfig)}
          aoComoJogar={() => setNavegacao({ tela: 'comoJogar' })}
        />
      )
    case 'comoJogar':
      return <ComoJogar aoVoltar={irParaInicio} />
    case 'novoJogo':
      return <NovoJogo configInicial={ultimaConfig ?? CONFIG_PADRAO} aoComecar={comecar} aoVoltar={irParaInicio} />
    case 'partida':
      return (
        <TelaDaPartida
          partida={navegacao.partida}
          aoAvancar={(acao) => avancar(navegacao.partida, acao)}
          aoJogarDeNovo={() => comecar(navegacao.partida.config)}
          aoSair={irParaInicio}
        />
      )
    case 'dupla':
      return (
        <TelaDaDupla
          partida={navegacao.partida}
          aoAvancar={(acao) => avancarNaDupla(navegacao.partida, navegacao.config, acao)}
          aoJogarDeNovo={() => comecar(navegacao.config)}
          aoSair={irParaInicio}
        />
      )
  }
}

type TelaDaPartidaProps = {
  partida: Partida
  aoAvancar: (acao: Acao) => void
  aoJogarDeNovo: () => void
  aoSair: () => void
}

const TelaDaPartida = ({ partida, aoAvancar, aoJogarDeNovo, aoSair }: TelaDaPartidaProps) => {
  switch (partida.etapa) {
    case 'revelacao':
      return <Revelacao partida={partida} aoConcluir={() => aoAvancar({ tipo: 'proximaRevelacao' })} />
    case 'emJogo': {
      const total = partida.impostores.length
      return (
        <NaMesa
          jogadores={partida.config.jogadores}
          quemComeca={quemComeca(partida)}
          aviso={total > 1 ? `${total} impostores na mesa.` : 'Um impostor na mesa.'}
          rotuloRevelar={total > 1 ? 'Revelar impostores e palavra' : 'Revelar impostor e palavra'}
          aoRevelar={() => aoAvancar({ tipo: 'revelarResultado' })}
        />
      )
    }
    case 'resultado':
      return <Resultado partida={partida} aoJogarDeNovo={aoJogarDeNovo} aoSair={aoSair} />
  }
}
