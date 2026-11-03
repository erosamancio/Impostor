import { useState, type ReactNode } from 'react'
import { Avatar } from './Avatar'
import { Botao } from './Botao'
import { Tela } from './Tela'

type PassarCelularProps = {
  nome: string
  indice: number
  etapa: string
  aviso: string
  /** O que aparece depois que a pessoa certa confirma que pegou o celular. */
  children: ReactNode
}

/** Pede para passar o celular a alguém e só mostra o conteúdo depois que essa pessoa confirma. */
export const PassarCelular = ({ nome, indice, etapa, aviso, children }: PassarCelularProps) => {
  const [confirmado, setConfirmado] = useState(false)
  if (confirmado) return children

  return (
    <Tela etapa={etapa} rodape={<Botao onClick={() => setConfirmado(true)}>Sou eu, {nome}</Botao>}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Avatar nome={nome} indice={indice} tamanho="grande" />
        <p className="mt-6 text-lg text-papel-suave">Passe o celular para</p>
        <p className="mt-1 text-[52px] leading-none font-extrabold tracking-[-0.035em] break-words">{nome}</p>
        <p className="mt-5 max-w-64 text-[15px] text-papel-suave">{aviso}</p>
      </div>
    </Tela>
  )
}
