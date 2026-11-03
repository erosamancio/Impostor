import { useState, type ReactNode } from 'react'
import { Avatar } from './Avatar'
import { Botao } from './Botao'
import { Tela } from './Tela'

type PassarCelularProps = {
  nome: string
  indice: number
  progresso: string
  aviso: string
  /** O que aparece depois que a pessoa certa confirma que pegou o celular. */
  children: ReactNode
}

/** Pede para passar o celular a alguém e só mostra o conteúdo depois que essa pessoa confirma. */
export const PassarCelular = ({ nome, indice, progresso, aviso, children }: PassarCelularProps) => {
  const [confirmado, setConfirmado] = useState(false)
  if (confirmado) return children

  return (
    <Tela subtitulo={progresso} rodape={<Botao onClick={() => setConfirmado(true)}>Sou eu, {nome}</Botao>}>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <Avatar nome={nome} indice={indice} tamanho="grande" />
        <p className="text-xl text-texto-suave">Passe o celular para</p>
        <p className="text-5xl font-black break-words">{nome}</p>
        <p className="max-w-64 text-texto-suave">{aviso}</p>
      </div>
    </Tela>
  )
}
