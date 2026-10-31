/* ============================================================
   CONTEÚDO DO GUIA: lugares, comida e o plano dos dias
   e = esforço (0 nenhum, 1 leve, 2 moderado, 3 puxado)
   k = tipo: 'ver', 'comer' ou 'livre'
   ============================================================ */
const INFO = {
/* Perto de casa */
c01:{n:'Orla do Tejo a pé',k:'ver',e:1,d:'Calçadão plano à beira-rio, cheio de bancos. Dá para ir até a Torre Vasco da Gama e voltar sem perceber.',how:'A pé, saindo de casa.',q:'Passeio Ribeirinho Parque das Nações Lisboa'},
c03:{n:'Teleférico sobre o rio',k:'ver',e:1,d:'Cabine fechada e sentada, uns 10 minutos voando por cima do Tejo, entre o Oceanário e a Torre Vasco da Gama.',how:'A pé. Tem estação nas duas pontas da orla.',hist:'Foi construído para a Expo 98, a exposição mundial que transformou esta antiga zona industrial no bairro onde vocês estão morando.',q:'Telecabine Lisboa Parque das Nações'},
c05:{n:'Torre Vasco da Gama',k:'ver',e:1,d:'A torre em forma de vela, na ponta norte da orla. Hoje é hotel, mas a vista do rio e da ponte de baixo dela já vale.',how:'A pé pela orla, uns 20 minutos.',hist:'Com 145 metros, é o prédio mais alto de Portugal. Foi feita para a Expo 98 e imita a vela de uma caravela.',q:'Torre Vasco da Gama Lisboa'},
c07:{n:'Centro Vasco da Gama',k:'ver',e:1,d:'O shopping colado na estação do Oriente. Supermercado Continente, farmácia, banheiro, cinema e praça de alimentação.',how:'A pé, uns 5 minutos de casa.',q:'Centro Vasco da Gama Lisboa'},
c09:{n:'Parque Tejo e a ponte ao pôr do sol',k:'ver',e:1,d:'Gramado enorme no fim da orla, com a ponte Vasco da Gama atravessando o rio. Melhor no fim da tarde.',how:'A pé pela orla, ou Bolt até o parque.',fact:'A ponte Vasco da Gama tem 12 quilômetros só sobre a água, e mais de 17 no total. Já foi a ponte mais longa da Europa.',q:'Parque Tejo Lisboa'},
c10:{n:'Estação do Oriente',k:'ver',e:1,d:'A estação de metrô, trem e ônibus ao lado de casa. Vale olhar para cima: a cobertura parece uma floresta de aço e vidro.',how:'A pé, uns 5 minutos.',hist:'Projeto do espanhol Santiago Calatrava, inaugurada em 1998 para a Expo. É daqui que saem os trens para o Porto.',q:'Gare do Oriente Lisboa'},
/* Baixa e Chiado */
b01:{n:'Praça do Comércio',k:'ver',e:1,d:'A grande praça amarela aberta para o rio. Plana, enorme, com o Cais das Colunas na beira da água.',how:'Bolt até a praça, uns 20 minutos de casa.',hist:'Ali ficava o palácio real, destruído pelo terremoto e pelo maremoto de 1755. A praça foi reconstruída pelo Marquês de Pombal como a porta de entrada de Lisboa pelo rio.',q:'Praça do Comércio Lisboa'},
b02:{n:'Arco da Rua Augusta, vista',k:'ver',e:1,d:'Elevador até perto do topo e poucos degraus no final. Lá em cima, a Baixa inteira de um lado e o rio do outro.',how:'Fica na própria Praça do Comércio. A entrada é na base do arco.',fact:'Depois do terremoto, o arco levou mais de cem anos para ficar pronto, só em 1873. Lá em cima estão as estátuas de Vasco da Gama e do Marquês de Pombal.',q:'Arco da Rua Augusta Lisboa'},
b03:{n:'Rua Augusta a pé',k:'ver',e:1,d:'Rua de pedestres plana, do Rossio até o arco. Lojas, cafés e gente na rua o tempo todo.',how:'Começa no Rossio ou na Praça do Comércio.',q:'Rua Augusta Lisboa'},
b04:{n:'Rossio e Praça da Figueira',k:'ver',e:1,d:'As duas praças do centro, lado a lado, planas e cheias de vida.',how:'Bolt até o Rossio, ou metrô verde até a estação Rossio.',fact:'O desenho de ondas no chão do Rossio, chamado Mar Largo, é o avô do calçadão de Copacabana. Os portugueses levaram o padrão para o Rio.',q:'Praça Dom Pedro IV Rossio Lisboa'},
b07:{n:'Elevador de Santa Justa',k:'ver',e:2,d:'Elevador de ferro de 1902, ligando a Baixa ao Carmo. A fila pode ser longa: melhor cedo ou no fim da tarde.',how:'Rua de Santa Justa, perto do Rossio. Dica: dá para chegar ao mirante de cima pelo Largo do Carmo, sem fila.',hist:'Tem 45 metros de altura e ainda funciona como transporte público. Ainda hoje, o bilhete faz parte da rede da Carris.',q:'Elevador de Santa Justa Lisboa'},
b08:{n:'Chiado',k:'ver',e:2,d:'O bairro elegante das livrarias, teatros e cafés antigos. Fica no alto, então é melhor chegar de Bolt lá em cima e ir descendo.',how:'Bolt até o Largo do Chiado.',q:'Largo do Chiado Lisboa'},
b09:{n:'Livraria Bertrand',k:'ver',e:1,d:'Na Rua Garrett, no Chiado. Plana, quentinha e com uma seção de livros em português do Brasil também.',how:'Rua Garrett 73, no Chiado.',fact:'Aberta desde 1732, é a livraria mais antiga do mundo ainda funcionando, com certificado do Guinness na parede.',q:'Livraria Bertrand Chiado Lisboa'},
b13:{n:'Ribeira das Naus',k:'ver',e:1,d:'Beira-rio plana com degraus largos de pedra para sentar e ver o Tejo. Ao lado da Praça do Comércio.',how:'A pé, saindo da Praça do Comércio para o lado oeste.',q:'Ribeira das Naus Lisboa'},
v10:{n:'Miradouro de Santa Catarina',k:'ver',e:2,d:'Mirante de frente para a ponte 25 de Abril e o rio. Tem ladeira em volta, então é melhor descer do Bolt na porta.',how:'Bolt até o Miradouro de Santa Catarina.',q:'Miradouro de Santa Catarina Lisboa'},
/* Alfama e Castelo */
a01:{n:'Castelo de São Jorge, de táxi',k:'ver',e:2,b:'must',d:'Táxi até o portão. Lá dentro o chão é de pedra irregular, mas tem banco por todo lado e a vista é a melhor da cidade.',how:'Bolt até a entrada do castelo. Ir de sapato fechado.',hist:'Os mouros ergueram as muralhas, e Dom Afonso Henriques tomou o castelo em 1147. Foi palácio dos reis até o século XVI.',fact:'Tem pavões soltos andando pelos jardins. Eles adoram aparecer na hora da foto.',q:'Castelo de São Jorge Lisboa'},
a02:{n:'Miradouro de Santa Luzia',k:'ver',e:1,d:'Painéis de azulejo, buganvílias e os telhados de Alfama descendo até o rio.',how:'Bolt até o mirante. Do Castelo, são poucos minutos de carro.',q:'Miradouro de Santa Luzia Lisboa'},
a03:{n:'Miradouro da Senhora do Monte',k:'ver',e:1,d:'O mirante mais alto da cidade, com o Castelo bem de frente. Sempre de carro: a ladeira é brava.',how:'Bolt até o mirante.',q:'Miradouro da Senhora do Monte Lisboa'},
a04:{n:'Miradouro da Graça',k:'ver',e:1,d:'Mirante com quiosque de café e sombra de pinheiros. Bom para sentar e tomar uma bica.',how:'Bolt até o Largo da Graça. Fica perto da Senhora do Monte.',q:'Miradouro Sophia de Mello Breyner Andresen Graça Lisboa'},
/* Belém */
e01:{n:'Mosteiro dos Jerónimos',k:'ver',e:1,b:'must',d:'O claustro mais bonito de Portugal, todo rendado em pedra. Fecha às segundas. A fila é longa, então comprem o bilhete pela internet antes.',how:'Bolt até Belém, uns 30 minutos de casa.',hist:'Começou a ser construído em 1501, pago com o dinheiro do comércio de especiarias. Vasco da Gama está enterrado lá dentro.',fact:'Aguentou o terremoto de 1755 quase sem danos, quando metade de Lisboa caiu.',q:'Mosteiro dos Jerónimos Lisboa'},
e02:{n:'Torre de Belém, vista de fora',k:'ver',e:1,d:'Melhor ver de fora, do jardim à beira-rio. Lá dentro é escada estreita em caracol.',how:'Uns 10 minutos a pé do Mosteiro, pela beira-rio.',hist:'Construída entre 1514 e 1519 para defender a entrada do rio. Na época ficava dentro da água.',fact:'Procurem na fachada a cabeça de um rinoceronte de pedra. Foi inspirada num rinoceronte de verdade que chegou da Índia em 1515.',q:'Torre de Belém Lisboa'},
e03:{n:'Padrão dos Descobrimentos',k:'ver',e:1,d:'O monumento em forma de proa na beira-rio, com os navegadores enfileirados.',how:'Do outro lado da avenida, em frente aos Jerónimos. Tem passagem subterrânea.',fact:'No chão tem uma rosa dos ventos gigante com um mapa-múndi. Procurem o Brasil e o ano de 1500.',q:'Padrão dos Descobrimentos Lisboa'},
e05:{n:'MAAT e beira-rio',k:'ver',e:1,d:'Museu de curvas brancas na beira do rio. Dá para subir no telhado pela rampa e ver o rio de cima.',how:'Uns 15 minutos a pé do Padrão pela orla, ou Bolt curto.',q:'MAAT Lisboa'},
e07:{n:'Jardim Botânico Tropical',k:'ver',e:1,d:'Jardim calmo atrás dos Jerónimos, com lago, patos e árvores do mundo inteiro.',how:'A pé, saindo do Mosteiro.',q:'Jardim Botânico Tropical Belém Lisboa'},
/* Centro */
n01:{n:'Gulbenkian, museu e jardim',k:'ver',e:1,b:'must',d:'Uma das melhores coleções de arte da Europa e um jardim calmo com lago. Fecha às terças. Tem cafeteria lá dentro.',how:'Bolt até a Fundação Gulbenkian, uns 15 minutos de casa.',hist:'Calouste Gulbenkian, um magnata armênio do petróleo, passou os últimos anos de vida em Lisboa e deixou tudo para Portugal.',fact:'Não percam a sala das joias de René Lalique, no fim do percurso.',q:'Museu Calouste Gulbenkian Lisboa'},
n02:{n:'Avenida da Liberdade, descendo',k:'ver',e:1,d:'Avenida larga e arborizada, com lojas de luxo e bancos no calçadão. Táxi até o Marquês de Pombal, lá em cima, e descer andando.',how:'Bolt até o Marquês de Pombal.',q:'Avenida da Liberdade Lisboa'},
/* Natal */
x02:{n:'Árvore de Natal na Praça do Comércio',k:'ver',e:1,d:'A grande árvore iluminada da Praça do Comércio.',how:'Bolt até a Praça do Comércio.',warn:'Em 2025, as luzes de Natal de Lisboa acenderam no dia 22 de novembro. Se nesse sábado ainda estiverem apagadas, a praça à noite vale do mesmo jeito. Confiram a data de 2026 mais perto.',q:'Praça do Comércio Lisboa'},
/* Fora de Lisboa */
o01:{n:'Cascais, centro e orla',k:'ver',e:1,d:'Vila à beira-mar, plana no centro, com praias pequenas, ruas de pedestres e a marina.',how:'Trem do Cais do Sodré até Cascais, uns 40 minutos, sai a cada 20 minutos. Ou Bolt direto.',hist:'A família real portuguesa passava os verões aqui desde a década de 1870, e a vila virou o balneário da elite.',q:'Cascais centro'},
o03:{n:'Boca do Inferno',k:'ver',e:1,d:'Falésia onde o mar entra numa gruta e estoura. Mais bonito com mar agitado.',how:'Táxi curto saindo do centro de Cascais, ou 20 minutos a pé pela beira-mar.',fact:'Em 1930, o ocultista inglês Aleister Crowley fingiu o próprio suicídio aqui, deixando um bilhete numa pedra. Apareceu vivo semanas depois, em Berlim.',q:'Boca do Inferno Cascais'},
o05:{n:'Sintra, centro e Palácio Nacional',k:'ver',e:2,d:'O centro histórico de Sintra e o palácio das duas chaminés brancas gigantes.',how:'Trem do Rossio até Sintra, uns 40 minutos. Da estação até o centro, táxi ou tuk-tuk.',hist:'Foi palácio dos reis por quase 600 anos, e é o mais bem conservado da época medieval em Portugal.',fact:'As duas chaminés de 33 metros são da cozinha. Cozinhavam ali banquetes inteiros para a corte.',q:'Palácio Nacional de Sintra'},
o06:{n:'Palácio da Pena',k:'ver',e:3,b:'must',d:'O palácio colorido no alto da serra. Lá em cima tem subida, então peguem o ônibus interno ou o tuk-tuk da entrada até a porta do palácio. Comprem o bilhete com hora marcada pela internet.',how:'Do centro de Sintra, ônibus 434 ou táxi até a entrada do parque.',hist:'Mandado construir pelo rei Dom Fernando II nos anos 1840, sobre as ruínas de um mosteiro. Sintra é Patrimônio da Humanidade desde 1995.',warn:'É o passeio mais puxado da viagem. Juntar com o Palácio Nacional no mesmo dia dá, mas sem pressa e com pausa para almoçar.',q:'Palácio da Pena Sintra'},
o11:{n:'Óbidos',k:'ver',e:2,b:'must',d:'Vila medieval inteira dentro das muralhas, branca com faixas azuis e amarelas. A rua principal é de pedra e tem uma subidinha.',how:'De carro, uma hora pela A8.',hist:'Em 1282, o rei Dom Dinis deu a vila de presente de casamento à rainha Isabel. Depois disso, foi presente de várias rainhas.',fact:'A ginjinha daqui é servida num copinho de chocolate. Bebam e comam o copo.',q:'Óbidos Portugal'},
o21:{n:'Porto',k:'ver',e:2,b:'must',d:'A segunda cidade do país, de granito e azulejo, à beira do Douro.',how:'Trem Alfa Pendular saindo do Oriente, umas 3 horas até Porto Campanhã. Comprar no site da CP com antecedência.',hist:'O centro histórico e a Ribeira são Patrimônio da Humanidade desde 1996.',q:'Ribeira Porto'},
/* Comida */
k08:{n:'Casa do Alentejo',k:'comer',e:0,b:'hidden',d:'Por fora, uma porta comum. Lá dentro, um pátio mourisco lindo e salões de azulejo no andar de cima. Comida alentejana. Aberto a tarde toda.',how:'Rua das Portas de Santo Antão 58, atrás do Rossio.',hist:'É um palácio do século XVII. Desde 1932 funciona como a casa dos alentejanos em Lisboa.',q:'Casa do Alentejo Lisboa'},
k09:{n:'Cantina das Freiras',k:'comer',e:0,d:'Almoço completo por menos de 10 euros, num terraço com vista para o rio.',how:'Travessa do Ferragial 1, no Chiado.',warn:'Só abre de segunda a sexta, no almoço. No sábado vai estar fechada. Troquem pela Casa do Alentejo ou pela Confeitaria Nacional, que ficam ali perto.',q:'Cantina das Freiras Lisboa'},
k11:{n:'Confeitaria Nacional',k:'comer',e:0,d:'Confeitaria de 1829 na Praça da Figueira. Doces, chá e salgadinhos.',how:'Praça da Figueira 18B.',fact:'Foi ela que trouxe o bolo-rei para Portugal, no século XIX, com uma receita de Paris.',q:'Confeitaria Nacional Lisboa'},
k12:{n:'Manteigaria',k:'comer',e:0,d:'Pastel de nata saindo do forno, com canela e açúcar por cima. Come em pé no balcão.',how:'Rua do Loreto 2, no Chiado.',q:'Manteigaria Chiado Lisboa'},
k14:{n:'Time Out Market',k:'comer',e:0,d:'Mercado com dezenas de balcões de comida. Turístico, mas prático: tem de tudo e tem banheiro. Fica lotado no almoço, então cheguem antes das 12h30.',how:'Mercado da Ribeira, Cais do Sodré. Uns 10 minutos a pé da Ribeira das Naus.',q:'Time Out Market Lisboa'},
k22:{n:'Pastéis de Belém',k:'comer',e:0,d:'O original, desde 1837. A fila de fora é para levar: entrem e sentem nos salões dos fundos, que a mesa sai rápido.',how:'Rua de Belém 84, ao lado do Mosteiro.',fact:'A receita veio dos monges dos Jerónimos e só meia dúzia de pessoas sabem fazer. Ela fica guardada numa sala fechada.',q:'Pastéis de Belém Lisboa'},
k23:{n:'Tasca do Gordo',k:'comer',e:0,d:'Espetadas na brasa e um quintal grande e tranquilo.',how:'Em Belém.',q:'Tasca do Gordo Belém Lisboa'},
k25:{n:'Linha 27',k:'comer',e:0,d:'Bochecha de porco com batata assada, desde 1981. Cheio de gente que trabalha por ali no almoço de dia útil.',how:'Em Alcântara, a caminho de Belém.',q:'Linha 27 Alcântara Lisboa'},
k33:{n:'O Cantinho do Alfredo',k:'comer',e:0,d:'Tasca de Campolide com bitoque famoso e cozido às quintas.',how:'Rua General Taborda 44, Campolide.',warn:'Abre de segunda a sábado, então no domingo vai estar fechado. A Gulbenkian tem cafeteria e restaurante lá dentro, uma boa troca para esse dia.',q:'Cantinho do Alfredo Campolide Lisboa'},
k40:{n:'Café Saudade',k:'comer',e:0,d:'Café aconchegante perto da estação de Sintra, com bolos, scones e queijadas.',how:'Perto da estação de trem de Sintra.',q:'Café Saudade Sintra'},
k41:{n:'Cantinho de São Pedro',k:'comer',e:0,d:'Taberna antiga com grelhados, em São Pedro de Sintra.',how:'Táxi curto do centro de Sintra.',q:'Cantinho de São Pedro Sintra'},
k42:{n:'Restaurante Pereira',k:'comer',e:0,d:'Comida portuguesa de todas as regiões, frequentado pelos locais.',how:'No centro de Cascais.',q:'Restaurante Pereira Cascais'},
/* Especiais */
s02:{n:'Livre, decidir na hora',k:'livre',e:0,d:'Espaço em aberto. Decidam no dia, ou só descansem.'},
/* Ideias dos coroas */
'ideia-2':{n:'Freeport, Alcochete',k:'ver',e:1,d:'Outlet enorme ao ar livre, do outro lado da ponte Vasco da Gama. Aberto todo dia das 10h às 22h.',how:'Bolt pela ponte Vasco da Gama, uns 25 minutos de casa. O outlet também tem um ônibus próprio saindo do centro de Lisboa.',q:'Freeport Lisboa Fashion Outlet Alcochete'},
'ideia-4':{n:'Casa do Alentejo',k:'comer',e:0,d:'Mesma casa do outro cartão. O pátio mourisco vale a visita mesmo só para um café.',how:'Rua das Portas de Santo Antão 58.',q:'Casa do Alentejo Lisboa'},
'ideia-5':{n:'Continente',k:'ver',e:1,d:'Supermercado grande dentro do Centro Vasco da Gama. Para abastecer a casa no primeiro dia.',how:'A pé, uns 5 minutos de casa.',q:'Continente Centro Vasco da Gama'},
'ideia-6':{n:'Passeio de tuk-tuk',k:'ver',e:1,d:'O jeito mais confortável de ver as ladeiras de Alfama, Castelo e Graça sem subir nada a pé. Combinem o preço e a duração antes de sair.',how:'Os tuk-tuks ficam na Praça do Comércio e no Rossio. Também dá para reservar pela internet.',q:'Praça do Comércio Lisboa'},
'ideia-7':{n:'Restaurante Laurentina',k:'comer',e:0,d:'O Rei do Bacalhau, aberto desde os anos 1970. Além do bacalhau, tem bife do lombo. Segunda a sábado, almoço e jantar.',how:'Avenida Conde Valbom 71A, Avenidas Novas.',q:'Restaurante Laurentina Lisboa'},
'ideia-8':{n:'El Corte Inglés',k:'ver',e:1,d:'A grande loja de departamentos de Lisboa, com vários andares e um supermercado gourmet.',how:'Avenida António Augusto de Aguiar 31. Metrô São Sebastião, ou Bolt.',q:'El Corte Inglés Lisboa'},
'ideia-9':{n:'Museu do Bonsai',k:'ver',e:1,d:'Museu do Bonsai e da Árvore, com árvores em miniatura: laranjeiras, macieiras, oliveiras. Aberto todo dia, das 10h às 19h.',how:'Estrada Chão de Meninos 12, Sintra. Táxi a partir da estação de Sintra.',fact:'Tem uma murraya chinesa de 112 anos e 1,60 metro de altura.',q:'Museu do Bonsai Sintra'},
'ideia-11':{n:'Loja Moida',k:'ver',e:1,d:'Loja de skincare e maquiagem coreana, aberta em agosto de 2026.',how:'Rua do Carmo 47, no Chiado.',q:'MOIDA Rua do Carmo 47 Lisboa'},
'ideia-12':{n:'Cervejaria Trindade',k:'comer',e:0,d:'Cervejaria histórica, de 1836, dentro do antigo refeitório de um convento, com as paredes cobertas de azulejos. Peçam o bife da casa.',how:'Rua Nova da Trindade 20C, entre o Chiado e o Bairro Alto.',q:'Cervejaria Trindade Lisboa'},
'ideia-14':{n:'Quinta Real de Caxias',k:'ver',e:1,d:'Jardins de palácio inspirados em Versalhes, com cascata, lagos e esculturas. Entrada gratuita.',how:'Trem do Cais do Sodré até Caxias, na linha de Cascais, ou Bolt. Estrada da Gibalta, Oeiras.',warn:'Não achei o horário oficial. Liguem antes para +351 214 115 062, principalmente porque o dia escolhido é uma segunda-feira.',q:'Quinta Real de Caxias'},
'ideia-15':{n:'Palácio Biester',k:'ver',e:2,d:'Palacete romântico em Sintra, com jardins e uma capela.',how:'Em Sintra, perto do centro histórico.',q:'Palácio Biester Sintra'},
'ideia-16':{n:'Restaurante D\'Bacalhau',k:'comer',e:0,d:'Salão enorme no Parque das Nações, com cozinha portuguesa e opções de carne.',how:'A pé, pela orla.',q:'D\'Bacalhau Parque das Nações Lisboa'},
'ideia-17':{n:'Poço, no hotel My Story Tejo',k:'comer',e:0,d:'Almoço no hotel My Story Tejo, onde fica o Poço do Borratém, um poço antigo com painel de azulejo, no bar do lobby. Aberto também para quem não é hóspede.',warn:'Só confirmei o bar do lobby, não o horário de almoço. Liguem para o hotel antes, ou reservem.',how:'Rua dos Condes de Monsanto 2, a um minuto do Rossio.',fact:'Acreditavam que a água do poço curava coceira e doenças do fígado.',q:'My Story Hotel Tejo Lisboa'},
'ideia-18':{n:'Portugália, Vasco da Gama',k:'comer',e:0,d:'A cervejaria clássica, famosa pelo bife à Portugália com molho de mostarda e batata frita. Fica dentro do Centro Vasco da Gama.',how:'A pé, uns 5 minutos de casa.',q:'Portugália Centro Vasco da Gama Lisboa'}
};

/* O plano que os coroas montaram (recebido em 29/10/2026) */
const PLAN = {
'2026-11-14':{N:['c07','ideia-18']},
'2026-11-15':{T:['ideia-5','ideia-18']},
'2026-11-16':{},
'2026-11-17':{M:['ideia-2'],T:['ideia-2']},
'2026-11-18':{M:['c05','c10'],T:['c09','ideia-16']},
'2026-11-19':{M:['e03','e02','e07','e01'],T:['k22','k25','k23']},
'2026-11-20':{M:['o11'],T:['o11']},
'2026-11-21':{M:['s02'],T:['s02'],N:['x02']},
'2026-11-22':{M:['a02','a03','a04'],T:['ideia-17','a01']},
'2026-11-23':{M:['ideia-8'],T:['ideia-7']},
'2026-11-24':{M:['b08','b07','v10'],T:['b13','k14']},
'2026-11-25':{},
'2026-11-26':{M:['ideia-11'],T:['k08']},
'2026-11-27':{M:['ideia-9','ideia-15'],T:['k40']},
'2026-11-28':{M:['b03','b04','b01'],T:['k09']},
'2026-11-29':{M:['n01'],T:['k33']},
'2026-11-30':{M:['ideia-14']},
'2026-12-01':{M:['s02'],T:['c07'],N:['c03']},
'2026-12-02':{M:['n02'],T:['ideia-12']},
'2026-12-03':{M:['ideia-6'],T:['c01'],N:['c07']},
'2026-12-04':{M:['o05'],T:['o06','k41']},
'2026-12-05':{M:['o01'],T:['o03','k42']},
'2026-12-06':{M:['o11'],T:['o11']},
'2026-12-07':{M:['o21']},
'2026-12-08':{M:['o21']},
'2026-12-09':{M:['o21'],T:['s02']},
'2026-12-10':{M:['e02','e03'],T:['e01','e05','k22']},
'2026-12-11':{M:['b01','b02','b08'],T:['b04','b07','b09','ideia-12']},
'2026-12-12':{M:['s02','k11'],T:['s02','k12']},
'2026-12-13':{}
};

/* Ideias que ficaram guardadas, sem dia */
const SAVED = [];

/* Título, frase e avisos de cada dia */
const DAYINFO = {
'2026-11-14':{t:'Chegou, chegou',s:'Chave na mão e jantar do lado de casa',i:'Dia de chegar, tomar um banho e não inventar moda. O voo pousa às 10:45 e o apartamento só libera às 15h: peçam para deixar as malas antes, se o Carlos deixar.',fx:{M:['Pousam em Lisboa às 10:45, voo TP72'],T:['Check-in no apartamento às 15h']}},
'2026-11-15':{t:'O Claudio chegou',s:'Abastecer a casa e pegar o ritmo',i:'Eu pouso às 09:50. Tarde de supermercado e jantar de novo na Portugália, que ninguém é de ferro.',fx:{M:['Claudio pousa às 09:50, voo BA502']}},
'2026-11-16':{t:'Dia em aberto',s:'Talvez o aniversário',i:'Talvez o aniversário da filha do Sergio. Se não rolar, é dia de descanso.',fx:{X:['Talvez: aniversário da filha do Sergio']}},
'2026-11-17':{t:'Dia de compras',s:'Freeport, do outro lado da ponte',i:'O dia inteiro no outlet. Levem sapato confortável: é tudo ao ar livre e as distâncias entre as lojas são grandes.'},
'2026-11-18':{t:'O quintal de casa',s:'Torre, estação e pôr do sol na ponte',i:'Tudo a pé, perto de casa. Deixem o Parque Tejo para o fim da tarde, que é quando a ponte fica bonita.'},
'2026-11-19':{t:'Belém, o cartão-postal',s:'Mosteiro, torre e pastel de nata',i:'Dia mais cheio, mas plano. Na hora do almoço tem três opções: escolham uma e guardem o pastel para a sobremesa.'},
'2026-11-20':{t:'Óbidos de carro',s:'A vila dentro das muralhas',i:'Uma hora de carro. A rua principal é de pedra e tem subida: vão sem pressa e sentem na primeira ginjinha.'},
'2026-11-21':{t:'Sábado sem relógio',s:'Manhã livre, árvore à noite',i:'Dia para não ter plano. À noite, a árvore da Praça do Comércio.'},
'2026-11-22':{t:'Lisboa lá de cima',s:'Três mirantes, almoço no Poço e o Castelo',i:'Tudo de Bolt, de mirante em mirante, sem subir ladeira a pé. Almoço no Poço, perto do Rossio, e o Castelo fica para a tarde.'},
'2026-11-23':{t:'Corte Inglés e bacalhau',s:'Compras e almoço clássico',i:'Manhã de loja de departamentos e almoço no Laurentina, que fica a uns 10 minutos dali.'},
'2026-11-24':{t:'Chiado de cima a baixo',s:'Do alto do Chiado até o rio',i:'Comecem lá em cima, no Chiado, e venham descendo até a beira-rio. O almoço é no Time Out.'},
'2026-11-25':{t:'Tchau, Claudio',s:'Último dia comigo por aqui',i:'Eu volto para Londres no fim da tarde. Dia em aberto.',fx:{T:['Claudio volta para Londres às 18:35, voo BA511']}},
'2026-11-26':{t:'Chiado e Alentejo',s:'Loja coreana e pátio mourisco',i:'Manhã no Chiado e almoço na Casa do Alentejo, atrás do Rossio.'},
'2026-11-27':{t:'Sintra em miniatura',s:'Bonsai, Biester e café',i:'Trem do Rossio até Sintra. De manhã, o Museu do Bonsai e o Palácio Biester, de táxi entre um e outro. Café na volta, perto da estação.'},
'2026-11-28':{t:'A Baixa, devagar',s:'Rua Augusta, Rossio e a praça',i:'Tudo plano, do Rossio até o rio.'},
'2026-11-29':{t:'Domingo de museu',s:'Gulbenkian, jardim e lago',i:'O museu mais bonito da cidade e um jardim para sentar depois.'},
'2026-11-30':{t:'Jardins de rei',s:'Quinta Real de Caxias',i:'Jardim de palácio em Oeiras, a caminho de Cascais.'},
'2026-12-01':{t:'Feriado em casa',s:'Restauração da Independência',i:'É feriado nacional em Portugal. Adonis e Dayse chegam de manhã. Dia tranquilo, perto de casa, e teleférico à noite.',fx:{M:['Adonis e Dayse pousam às 10:45, voo TP72']}},
'2026-12-02':{t:'Avenida abaixo',s:'Liberdade e Trindade',i:'Desçam a Avenida da Liberdade sem pressa e terminem na Cervejaria Trindade.'},
'2026-12-03':{t:'Tuk-tuk e orla',s:'As ladeiras sem esforço',i:'Manhã de tuk-tuk pelos bairros altos e tarde em casa, na orla.'},
'2026-12-04':{t:'Sintra de palácio',s:'Palácio Nacional e Pena',i:'O dia mais puxado da viagem. Saiam cedo, almocem sentados e não tenham pressa na Pena.'},
'2026-12-05':{t:'Cascais',s:'A vila de veraneio dos reis',i:'Trem pela beira-mar até Cascais. Almoço no Pereira.'},
'2026-12-06':{t:'Óbidos de Natal',s:'A vila vestida de Natal',i:'Em dezembro, Óbidos costuma montar a Vila Natal, com luzes, feirinha e muita gente no fim de semana. A vila é de graça; o parque do evento costuma ter bilhete.'},
'2026-12-07':{t:'Porto, dia 1',s:'Trem até o Porto',i:'Trem saindo do Oriente de manhã, check-in no hotel e primeira volta pela Ribeira.'},
'2026-12-08':{t:'Porto, dia 2',s:'Feriado no Porto',i:'Dia 8 de dezembro é feriado em Portugal. Algumas lojas e museus podem fechar, mas a Ribeira, as caves de vinho do Porto e as ruas ficam cheias de vida.'},
'2026-12-09':{t:'Porto, volta',s:'Trem de volta para Lisboa',i:'Manhã no Porto e trem de volta. A tarde é livre.'},
'2026-12-10':{t:'Belém, segunda dose',s:'Torre, Padrão, Mosteiro e MAAT',i:'A segunda volta por Belém, agora com o MAAT na beira-rio.'},
'2026-12-11':{t:'A Baixa inteira',s:'Praça, arco, Chiado e Trindade',i:'O dia da despedida do centro, terminando na Trindade.'},
'2026-12-12':{t:'Último sábado',s:'Doces e malas',i:'Dia livre, para os últimos pastéis e para fazer as malas.'},
'2026-12-13':{t:'Volta para o Rio',s:'Até a próxima, Lisboa',i:'Check-out até as 11h. Saiam de casa por volta das 9:45, o aeroporto fica a uns 10 minutos.',fx:{M:['Check-out até as 11h. Sair de casa por volta das 9:45','Voo TP73 às 12:55 para o Rio, junto com Adonis e Dayse']}}
};
