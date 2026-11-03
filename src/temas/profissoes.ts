import { palavra, type Tema } from './tipos'

export const profissoes: Tema = {
  id: 'profissoes',
  nome: 'Profissões',
  descricao: 'Profissões com uniforme, ferramenta ou lugar marcante',
  emoji: '👷',
  palavras: [
    // Saúde
    palavra('médico', 'facil', ['enfermeiro', 'dentista', 'veterinário']),
    palavra('enfermeiro', 'facil', ['médico', 'farmacêutico']),
    palavra('dentista', 'facil', ['médico', 'cabeleireiro']),
    palavra('veterinário', 'facil', ['médico', 'adestrador']),
    palavra('farmacêutico', 'media', ['enfermeiro', 'químico']),
    palavra('psicólogo', 'media', ['médico', 'professor']),
    palavra('fisioterapeuta', 'media', ['personal trainer', 'enfermeiro']),
    palavra('personal trainer', 'facil', ['fisioterapeuta', 'jogador de futebol']),

    // Segurança e emergência
    palavra('bombeiro', 'facil', ['policial', 'salva-vidas']),
    palavra('policial', 'facil', ['bombeiro', 'segurança', 'detetive']),
    palavra('segurança', 'facil', ['policial', 'porteiro']),
    palavra('salva-vidas', 'media', ['bombeiro', 'mergulhador']),
    palavra('detetive', 'media', ['policial', 'advogado']),
    palavra('soldado', 'facil', ['policial', 'bombeiro']),

    // Transporte
    palavra('piloto de avião', 'facil', ['comissário de bordo', 'astronauta']),
    palavra('comissário de bordo', 'media', ['piloto de avião', 'garçom']),
    palavra('motorista de ônibus', 'facil', ['taxista', 'caminhoneiro']),
    palavra('taxista', 'facil', ['motorista de ônibus', 'motoboy']),
    palavra('caminhoneiro', 'facil', ['motorista de ônibus', 'motoboy']),
    palavra('motoboy', 'facil', ['carteiro', 'taxista']),
    palavra('carteiro', 'facil', ['motoboy', 'porteiro']),
    palavra('astronauta', 'facil', ['piloto de avião', 'mergulhador']),
    palavra('mergulhador', 'media', ['astronauta', 'salva-vidas', 'pescador']),

    // Comida
    palavra('cozinheiro', 'facil', ['padeiro', 'garçom', 'confeiteiro']),
    palavra('padeiro', 'facil', ['confeiteiro', 'cozinheiro']),
    palavra('confeiteiro', 'media', ['padeiro', 'cozinheiro']),
    palavra('garçom', 'facil', ['cozinheiro', 'barman']),
    palavra('barman', 'media', ['garçom', 'DJ']),
    palavra('açougueiro', 'media', ['padeiro', 'feirante']),
    palavra('feirante', 'media', ['açougueiro', 'vendedor']),
    palavra('pescador', 'facil', ['agricultor', 'mergulhador']),
    palavra('agricultor', 'facil', ['pescador', 'jardineiro']),

    // Obra e casa
    palavra('pedreiro', 'facil', ['pintor', 'engenheiro', 'eletricista']),
    palavra('eletricista', 'facil', ['encanador', 'pedreiro']),
    palavra('encanador', 'facil', ['eletricista', 'pedreiro']),
    palavra('pintor', 'facil', ['pedreiro', 'artista plástico']),
    palavra('marceneiro', 'media', ['pedreiro', 'mecânico']),
    palavra('jardineiro', 'facil', ['agricultor', 'faxineiro']),
    palavra('faxineiro', 'facil', ['jardineiro', 'porteiro']),
    palavra('porteiro', 'facil', ['segurança', 'faxineiro']),
    palavra('mecânico', 'facil', ['eletricista', 'marceneiro']),
    palavra('engenheiro', 'media', ['arquiteto', 'pedreiro']),
    palavra('arquiteto', 'media', ['engenheiro', 'designer']),

    // Escritório e escola
    palavra('professor', 'facil', ['diretor de escola', 'psicólogo']),
    palavra('diretor de escola', 'media', ['professor', 'advogado']),
    palavra('advogado', 'facil', ['juiz', 'detetive']),
    palavra('juiz', 'facil', ['advogado', 'árbitro']),
    palavra('programador', 'facil', ['designer', 'engenheiro']),
    palavra('designer', 'media', ['programador', 'arquiteto', 'fotógrafo']),
    palavra('vendedor', 'facil', ['feirante', 'caixa de supermercado']),
    palavra('caixa de supermercado', 'facil', ['vendedor', 'garçom']),
    palavra('químico', 'dificil', ['farmacêutico', 'cientista']),
    palavra('cientista', 'facil', ['químico', 'astronauta']),

    // Arte e entretenimento
    palavra('cantor', 'facil', ['ator', 'DJ', 'músico']),
    palavra('músico', 'facil', ['cantor', 'DJ']),
    palavra('DJ', 'facil', ['músico', 'barman']),
    palavra('ator', 'facil', ['cantor', 'palhaço', 'youtuber']),
    palavra('palhaço', 'facil', ['ator', 'mágico']),
    palavra('mágico', 'facil', ['palhaço', 'ator']),
    palavra('fotógrafo', 'facil', ['jornalista', 'designer']),
    palavra('jornalista', 'facil', ['fotógrafo', 'youtuber']),
    palavra('youtuber', 'facil', ['jornalista', 'ator']),
    palavra('artista plástico', 'media', ['pintor', 'designer']),
    palavra('cabeleireiro', 'facil', ['manicure', 'barbeiro']),
    palavra('barbeiro', 'facil', ['cabeleireiro', 'manicure']),
    palavra('manicure', 'facil', ['cabeleireiro', 'barbeiro']),
    palavra('adestrador', 'dificil', ['veterinário', 'personal trainer']),

    // Esporte
    palavra('jogador de futebol', 'facil', ['árbitro', 'personal trainer']),
    palavra('árbitro', 'media', ['jogador de futebol', 'juiz']),
  ],
}
