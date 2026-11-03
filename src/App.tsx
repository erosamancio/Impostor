import { useState } from 'react'
import { useTelaAcesa } from './componentes/useTelaAcesa'
import { aleatorioSeguro } from './jogo/aleatorio'
import {
  gravarConfiguracao,
  gravarHistorico,
  gravarPlacar,
  lerConfiguracao,
  lerHistorico,
  lerPlacar,
  somarAoPlacar,
  type Placar,
} from './jogo/armazenamento'
import { avancarDupla, calcularPontosDupla, criarPartidaDupla, type AcaoDupla, type PartidaDupla } from './jogo/dupla'
import { avancarPartida, calcularPontos, criarPartida, type Acao } from './jogo/partida'
import type { Configuracao, Partida } from './jogo/tipos'
import { TEMAS, buscarTema } from './temas'
import { Dicas } from './telas/Dicas'
import { Discussao } from './telas/Discussao'
import { Inicio } from './telas/Inicio'
import { TelaDaDupla } from './telas/PartidaDupla'
import { NovoJogo } from './telas/NovoJogo'
import { Resultado } from './telas/Resultado'
import { Revelacao } from './telas/Revelacao'
import { UltimaChance } from './telas/UltimaChance'
import { Votacao } from './telas/Votacao'

type Navegacao =
  | { tela: 'inicio' }
  | { tela: 'novoJogo' }
  | { tela: 'partida'; partida: Partida }
  | { tela: 'dupla'; partida: PartidaDupla; config: Configuracao }

const CONFIG_PADRAO: Configuracao = {
  modo: 'classico',
  nivel: 'todos',
  jogadores: [],
  temaIds: TEMAS.map((tema) => tema.id),
  rodadas: 2,
  dicaImpostor: 'tema',
  modoVotacao: 'secreta',
}

export const App = () => {
  const [navegacao, setNavegacao] = useState<Navegacao>({ tela: 'inicio' })
  const [ultimaConfig, setUltimaConfig] = useState<Configuracao | null>(lerConfiguracao)
  const [placar, setPlacar] = useState<Placar>(lerPlacar)

  useTelaAcesa(navegacao.tela === 'partida' || navegacao.tela === 'dupla')

  const comecar = (config: Configuracao) => {
    const temas = config.temaIds.flatMap((id) => buscarTema(id) ?? [])
    gravarConfiguracao(config)
    setUltimaConfig(config)

    const [primeiro, segundo] = config.jogadores
    if (config.modo === 'dupla' && primeiro !== undefined && segundo !== undefined) {
      const dupla = { jogadores: [primeiro, segundo] as const, rodadas: config.rodadas, nivel: config.nivel }
      const { partida, historico } = criarPartidaDupla(dupla, temas, lerHistorico(), aleatorioSeguro)
      gravarHistorico(historico)
      setNavegacao({ tela: 'dupla', partida, config })
      return
    }

    const { partida, historico } = criarPartida(config, temas, lerHistorico(), aleatorioSeguro)
    gravarHistorico(historico)
    setNavegacao({ tela: 'partida', partida })
  }

  const somarPontos = (jogadores: readonly string[], pontos: readonly number[]) => {
    const novoPlacar = somarAoPlacar(placar, jogadores, pontos)
    gravarPlacar(novoPlacar)
    setPlacar(novoPlacar)
  }

  const avancar = (partida: Partida, acao: Acao) => {
    const proxima = avancarPartida(partida, acao)
    if (proxima.etapa === 'resultado' && partida.etapa !== 'resultado') {
      somarPontos(proxima.config.jogadores, calcularPontos(proxima))
    }
    setNavegacao({ tela: 'partida', partida: proxima })
  }

  const avancarNaDupla = (partida: PartidaDupla, config: Configuracao, acao: AcaoDupla) => {
    const proxima = avancarDupla(partida, acao)
    if (proxima.etapa === 'resultado' && partida.etapa !== 'resultado') {
      somarPontos(proxima.jogadores, calcularPontosDupla(proxima))
    }
    setNavegacao({ tela: 'dupla', partida: proxima, config })
  }

  const zerarPlacar = () => {
    gravarPlacar({})
    setPlacar({})
  }

  const irParaInicio = () => setNavegacao({ tela: 'inicio' })

  switch (navegacao.tela) {
    case 'inicio':
      return (
        <Inicio
          placar={placar}
          podeRepetir={ultimaConfig !== null}
          aoNovoJogo={() => setNavegacao({ tela: 'novoJogo' })}
          aoRepetir={() => ultimaConfig && comecar(ultimaConfig)}
          aoZerarPlacar={zerarPlacar}
        />
      )
    case 'novoJogo':
      return <NovoJogo configInicial={ultimaConfig ?? CONFIG_PADRAO} aoComecar={comecar} aoVoltar={irParaInicio} />
    case 'partida':
      return (
        <TelaDaPartida
          partida={navegacao.partida}
          placar={placar}
          aoAvancar={(acao) => avancar(navegacao.partida, acao)}
          aoJogarDeNovo={() => comecar(navegacao.partida.config)}
          aoSair={irParaInicio}
        />
      )
    case 'dupla':
      return (
        <TelaDaDupla
          partida={navegacao.partida}
          placar={placar}
          aoAvancar={(acao) => avancarNaDupla(navegacao.partida, navegacao.config, acao)}
          aoJogarDeNovo={() => comecar(navegacao.config)}
          aoSair={irParaInicio}
        />
      )
  }
}

type TelaDaPartidaProps = {
  partida: Partida
  placar: Placar
  aoAvancar: (acao: Acao) => void
  aoJogarDeNovo: () => void
  aoSair: () => void
}

const TelaDaPartida = ({ partida, placar, aoAvancar, aoJogarDeNovo, aoSair }: TelaDaPartidaProps) => {
  switch (partida.etapa) {
    case 'revelacao':
      return <Revelacao partida={partida} aoConcluir={() => aoAvancar({ tipo: 'proximaRevelacao' })} />
    case 'dicas':
      return <Dicas partida={partida} aoAvancar={() => aoAvancar({ tipo: 'proximaVez' })} />
    case 'discussao':
      return (
        <Discussao
          aoVotar={() => aoAvancar({ tipo: 'irParaVotacao' })}
          aoPedirRodada={() => aoAvancar({ tipo: 'maisUmaRodada' })}
        />
      )
    case 'votacao':
      return (
        <Votacao
          partida={partida}
          aoVotar={(acusado) => aoAvancar({ tipo: 'votar', acusado })}
          aoAcusarEmGrupo={(acusado) => aoAvancar({ tipo: 'acusarEmGrupo', acusado })}
        />
      )
    case 'ultimaChance':
      return <UltimaChance partida={partida} aoRegistrar={(acertou) => aoAvancar({ tipo: 'registrarChute', acertou })} />
    case 'resultado':
      return <Resultado partida={partida} placar={placar} aoJogarDeNovo={aoJogarDeNovo} aoSair={aoSair} />
  }
}
