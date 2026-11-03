import { palavra, type Tema } from './tipos'

export const lugaresDaCidade: Tema = {
  id: 'lugares-da-cidade',
  nome: 'Lugares da cidade',
  descricao: 'Lugares que todo mundo frequenta',
  emoji: '🏙️',
  palavras: [
    // Comida e compras
    palavra('padaria', 'facil', ['lanchonete', 'supermercado', 'sorveteria']),
    palavra('supermercado', 'facil', ['feira', 'padaria', 'shopping']),
    palavra('feira', 'facil', ['supermercado', 'açougue']),
    palavra('açougue', 'media', ['feira', 'supermercado']),
    palavra('shopping', 'facil', ['supermercado', 'cinema', 'loja de roupas']),
    palavra('loja de roupas', 'facil', ['shopping', 'lavanderia']),
    palavra('restaurante', 'facil', ['pizzaria', 'lanchonete', 'bar']),
    palavra('pizzaria', 'facil', ['restaurante', 'lanchonete']),
    palavra('lanchonete', 'facil', ['padaria', 'pizzaria', 'restaurante']),
    palavra('sorveteria', 'facil', ['padaria', 'lanchonete']),
    palavra('bar', 'facil', ['boate', 'restaurante']),
    palavra('livraria', 'media', ['biblioteca', 'papelaria']),
    palavra('papelaria', 'media', ['livraria', 'lotérica']),
    palavra('floricultura', 'media', ['pet shop', 'papelaria']),
    palavra('pet shop', 'facil', ['clínica veterinária', 'floricultura']),

    // Serviços
    palavra('farmácia', 'facil', ['hospital', 'supermercado']),
    palavra('hospital', 'facil', ['farmácia', 'clínica veterinária', 'delegacia']),
    palavra('clínica veterinária', 'media', ['pet shop', 'hospital']),
    palavra('banco', 'facil', ['lotérica', 'correios']),
    palavra('lotérica', 'media', ['banco', 'correios']),
    palavra('correios', 'media', ['banco', 'lotérica']),
    palavra('posto de gasolina', 'facil', ['oficina mecânica', 'estacionamento']),
    palavra('oficina mecânica', 'media', ['posto de gasolina', 'lava-jato']),
    palavra('lava-jato', 'media', ['oficina mecânica', 'lavanderia']),
    palavra('lavanderia', 'media', ['lava-jato', 'salão de beleza']),
    palavra('salão de beleza', 'facil', ['barbearia', 'academia']),
    palavra('barbearia', 'facil', ['salão de beleza', 'academia']),
    palavra('academia', 'facil', ['piscina', 'salão de beleza']),
    palavra('hotel', 'facil', ['aeroporto', 'restaurante']),
    palavra('delegacia', 'media', ['corpo de bombeiros', 'prefeitura']),
    palavra('corpo de bombeiros', 'media', ['delegacia', 'hospital']),
    palavra('prefeitura', 'media', ['delegacia', 'cartório']),
    palavra('cartório', 'dificil', ['prefeitura', 'banco']),

    // Transporte
    palavra('aeroporto', 'facil', ['rodoviária', 'estação de metrô']),
    palavra('rodoviária', 'facil', ['aeroporto', 'ponto de ônibus']),
    palavra('estação de metrô', 'media', ['ponto de ônibus', 'rodoviária']),
    palavra('ponto de ônibus', 'facil', ['estação de metrô', 'rodoviária']),
    palavra('estacionamento', 'media', ['posto de gasolina', 'shopping']),

    // Lazer e cultura
    palavra('cinema', 'facil', ['teatro', 'shopping']),
    palavra('teatro', 'media', ['cinema', 'museu', 'circo']),
    palavra('museu', 'media', ['biblioteca', 'teatro']),
    palavra('biblioteca', 'media', ['livraria', 'escola', 'museu']),
    palavra('boate', 'media', ['bar', 'teatro']),
    palavra('parque', 'facil', ['praça', 'zoológico']),
    palavra('praça', 'facil', ['parque', 'igreja']),
    palavra('zoológico', 'facil', ['parque', 'parque de diversões']),
    palavra('parque de diversões', 'facil', ['zoológico', 'circo']),
    palavra('circo', 'media', ['parque de diversões', 'teatro']),
    palavra('estádio', 'facil', ['academia', 'piscina']),
    palavra('piscina', 'facil', ['academia', 'estádio']),

    // Outros
    palavra('escola', 'facil', ['biblioteca', 'faculdade']),
    palavra('faculdade', 'facil', ['escola', 'biblioteca']),
    palavra('igreja', 'facil', ['praça', 'cemitério']),
    palavra('cemitério', 'media', ['igreja', 'hospital']),
  ],
}
