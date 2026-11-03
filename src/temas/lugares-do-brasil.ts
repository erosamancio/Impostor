import { palavra, type Tema } from './tipos'

export const lugaresDoBrasil: Tema = {
  id: 'lugares-do-brasil',
  nome: 'Lugares do Brasil',
  descricao: 'Cidades e pontos turísticos mais famosos',
  emoji: '🇧🇷',
  palavras: [
    // Cidades
    palavra('Rio de Janeiro', 'facil', ['São Paulo', 'Salvador', 'Búzios']),
    palavra('São Paulo', 'facil', ['Rio de Janeiro', 'Belo Horizonte', 'Curitiba']),
    palavra('Salvador', 'facil', ['Recife', 'Porto Seguro', 'Rio de Janeiro']),
    palavra('Brasília', 'facil', ['Belo Horizonte', 'São Paulo']),
    palavra('Belo Horizonte', 'media', ['Ouro Preto', 'Brasília', 'São Paulo']),
    palavra('Curitiba', 'media', ['Porto Alegre', 'Florianópolis', 'São Paulo']),
    palavra('Porto Alegre', 'media', ['Curitiba', 'Gramado']),
    palavra('Florianópolis', 'facil', ['Balneário Camboriú', 'Curitiba', 'Fernando de Noronha']),
    palavra('Recife', 'media', ['Olinda', 'Salvador', 'Natal']),
    palavra('Natal', 'media', ['Fortaleza', 'Recife']),
    palavra('Fortaleza', 'media', ['Natal', 'Jericoacoara']),
    palavra('Manaus', 'media', ['Amazônia', 'Belém']),
    palavra('Belém', 'dificil', ['Manaus', 'Amazônia']),

    // Cidades turísticas
    palavra('Gramado', 'facil', ['Campos do Jordão', 'Porto Alegre']),
    palavra('Campos do Jordão', 'media', ['Gramado', 'Ouro Preto']),
    palavra('Ouro Preto', 'media', ['Paraty', 'Olinda', 'Belo Horizonte']),
    palavra('Paraty', 'media', ['Ouro Preto', 'Búzios', 'Ilha Grande']),
    palavra('Olinda', 'media', ['Recife', 'Ouro Preto', 'Pelourinho']),
    palavra('Búzios', 'media', ['Arraial do Cabo', 'Paraty', 'Rio de Janeiro']),
    palavra('Arraial do Cabo', 'dificil', ['Búzios', 'Fernando de Noronha']),
    palavra('Porto Seguro', 'media', ['Morro de São Paulo', 'Salvador']),
    palavra('Morro de São Paulo', 'dificil', ['Porto Seguro', 'Ilha Grande']),
    palavra('Balneário Camboriú', 'media', ['Florianópolis', 'Beto Carrero World']),
    palavra('Jericoacoara', 'media', ['Lençóis Maranhenses', 'Fortaleza', 'Porto de Galinhas']),
    palavra('Porto de Galinhas', 'media', ['Jericoacoara', 'Fernando de Noronha']),

    // Natureza
    palavra('Fernando de Noronha', 'facil', ['Porto de Galinhas', 'Ilha Grande', 'Bonito']),
    palavra('Ilha Grande', 'dificil', ['Fernando de Noronha', 'Paraty']),
    palavra('Cataratas do Iguaçu', 'facil', ['Bonito', 'Chapada Diamantina']),
    palavra('Lençóis Maranhenses', 'media', ['Jericoacoara', 'Chapada dos Veadeiros']),
    palavra('Pantanal', 'facil', ['Amazônia', 'Bonito']),
    palavra('Amazônia', 'facil', ['Pantanal', 'Manaus']),
    palavra('Bonito', 'media', ['Pantanal', 'Cataratas do Iguaçu', 'Chapada Diamantina']),
    palavra('Chapada Diamantina', 'dificil', ['Chapada dos Veadeiros', 'Bonito']),
    palavra('Chapada dos Veadeiros', 'dificil', ['Chapada Diamantina', 'Lençóis Maranhenses']),

    // Pontos turísticos
    palavra('Cristo Redentor', 'facil', ['Maracanã', 'Avenida Paulista']),
    palavra('Maracanã', 'facil', ['Cristo Redentor', 'Avenida Paulista']),
    palavra('Avenida Paulista', 'media', ['Maracanã', 'Cristo Redentor']),
    palavra('Pelourinho', 'media', ['Olinda', 'Ouro Preto']),
    palavra('Beto Carrero World', 'facil', ['Balneário Camboriú', 'Gramado']),
  ],
}
