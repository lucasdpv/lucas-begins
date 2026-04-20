// --- CATEGORIAS INICIAIS ---
export const INITIAL_CATEGORIES = ["Notícias", "Artigos", "Nostalgia", "Reviews", "Indies"];

// --- POSTS INICIAIS (MOCK DATA) ---
export const initialPosts = [
  {
    id: 1,
    title: "O Retorno do Gigante: A SNK Anuncia o Novo NeoGeo para 2026",
    excerpt:
      "A indústria parou com o anúncio de hoje: a SNK vai relançar a lendária plataforma NeoGeo, mantendo a arquitetura clássica mas com suporte para o futuro.",
    content:
      "Há rumores circulando há anos nos fóruns mais obscuros da internet, mas finalmente aconteceu. A SNK confirmou hoje de manhã que o 'NeoGeo Renaissance' chegará às lojas no final de 2026. Numa época em que o mercado foca exaustivamente em serviços de assinatura, modelos puramente digitais e consoles portáteis, a gigante dos arcades decidiu nadar contra a maré.\n\n![Salão de Arcades Clássico](https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80)\n\nO novo sistema não será um mero emulador barato de plástico como vimos em outros mini-consoles. A SNK promete uma arquitetura baseada em FPGA, capaz de rodar os jogos originais em cartucho com uma precisão de hardware de 100%. Terá suporte nativo para os antigos monitores CRT (para os puristas), bem como saídas HDMI 4K com os filtros de scanline mais avançados já vistos.\n\nAlém disso, e talvez a maior surpresa de todas: três novos jogos estão atualmente em desenvolvimento ativo para a plataforma, marcando um verdadeiro renascimento do sistema de 16-bits que, nos anos 90, era considerado o \"Rolls-Royce\" dos videogames caseiros.",
    category: "Notícias",
    date: "19 Abr 2026",
    likes: 542,
    score: 9.8,
    verdict: "Hype Máximo",
    imageUrl:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    gradient: "from-red-600 to-black",
    author: { name: "Lucas 'Pixel' Silva", role: "Editor Chefe" },
    comments: [
      {
        id: 101,
        authorId: 2,
        author: "PlayerOne",
        text: "Vou ter que vender um rim, mas vou comprar com certeza! Viva a SNK!",
      },
    ],
  },
  {
    id: 2,
    title: "A Magia dos 16-bits: Porque Chrono Trigger é Eterno",
    excerpt:
      "Revisitamos o clássico da Square. Com múltiplos finais, uma trilha sonora inesquecível e combate inovador, continua sendo o padrão de ouro dos RPGs.",
    content:
      "Lançado originalmente em 1995 para o Super Nintendo, Chrono Trigger não é apenas um jogo; é uma obra de arte atemporal. A colaboração sem precedentes entre Hironobu Sakaguchi (Final Fantasy), Yuji Horii (Dragon Quest) e Akira Toriyama (Dragon Ball) criou uma tempestade perfeita de design de videogames.\n\n![Controles e cartuchos da era SNES](https://images.unsplash.com/photo-1531525645387-7f14be1bfc75?auto=format&fit=crop&w=800&q=80)\n\nHoje em dia, com gráficos fotorrealistas dominando o topo das vendas, a pixel art vibrante e expressiva deste título de 16-bits prova que uma direção artística coesa supera sempre a força bruta do hardware.\n\nNeste artigo retrospectivo, exploramos o quão revolucionário foi o sistema de combate 'Active Time Battle' na tela (sem transições lentas), a forma brilhante como a viagem no tempo foi implementada sem confundir a narrativa e, claro, a trilha sonora de Yasunori Mitsuda que ainda hoje arrepia qualquer fã.\n\n![Setup Nostálgico](https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&w=800&q=80)",
    category: "Reviews",
    date: "18 Abr 2026",
    likes: 142,
    score: 10,
    verdict: "Obra-Prima",
    imageUrl:
      "https://images.unsplash.com/photo-1531525645387-7f14be1bfc75?auto=format&fit=crop&w=1200&q=80",
    gradient: "from-purple-600 to-blue-600",
    author: { name: "Mariana 'Indie' Santos", role: "Colunista" },
    comments: [],
  },
  {
    id: 3,
    title: "A Ascensão Contínua dos Soulslike: De King's Field a 2026",
    excerpt:
      "Como a filosofia de design punitivo mas recompensador dos anos 2000 moldou a indústria de jogos atual e porque não nos cansamos de sofrer.",
    content:
      "Se olharmos com atenção para trás, a essência do que hoje chamamos 'Soulslike' tem raízes profundas que antecedem até mesmo Demon's Souls. Numa época em que os tutoriais não seguravam a mão do jogador (alguém se lembra de King's Field no PS1?), a exploração era genuína e assustadora.\n\nA FromSoftware conseguiu engarrafar essa sensação de mistério constante e a transformou num gênero que hoje, em 2026, domina as tabelas de vendas.\n\n![Gamer focado e ambiente tenso](https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80)\n\nEmbora os gráficos e a escala de mundo aberto tenham evoluído drasticamente, o núcleo duro da experiência — tentativa, erro, frustração, aprendizado e o derradeiro e inigualável triunfo — é uma carta de amor direta às noites passadas tentando decifrar padrões de chefões implacáveis nas nossas antigas televisões de tubo.",
    category: "Artigos",
    date: "15 Abr 2026",
    likes: 89,
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    gradient: "from-yellow-700 to-red-900",
    author: { name: "Sofia 'Tarnished' Costa", role: "Analista Senior" },
    comments: [
      {
        id: 103,
        authorId: 99,
        author: "Tarnished99",
        text: "Concordo plenamente. A dificuldade é uma ferramenta de imersão.",
      },
    ],
  },
  {
    id: 4,
    title: "Mídia Física vs O Futuro Digital: O que realmente perdemos?",
    excerpt:
      "Soprar o cartucho funcionava? Um olhar nostálgico sobre as caixas, os manuais e a sensação de propriedade na era do download.",
    content:
      "Todos nós o fizemos. A tela congelava, tirávamos o cartucho do console com todo o cuidado, dávamos aquele sopro mágico (que a própria Nintendo avisava nos manuais para não fazer) e, como por artes mágicas, o jogo voltava a funcionar. \n\n![Coleção de Mídia Física e Consoles](https://images.unsplash.com/photo-1580234797602-22c37b4a6217?auto=format&fit=crop&w=800&q=80)\n\nA era da mídia física tinha um encanto tátil e ritualístico que o download digital imediato simplesmente não consegue replicar.\n\nTer a caixa na mão ao sair da loja, ler avidamente o manual de instruções colorido durante a viagem de carro para casa, ou emprestar aquele jogo incrível a um amigo no recreio da escola eram rituais quase sagrados. Hoje, a conveniência do digital domina, não ocupa espaço na prateleira e não risca. Mas perdemos algo intangível: a magia de realmente 'possuir' e manusear o nosso jogo.",
    category: "Nostalgia",
    date: "10 Abr 2026",
    likes: 256,
    imageUrl:
      "https://images.unsplash.com/photo-1627384113972-f4c03d279abf?auto=format&fit=crop&w=1200&q=80",
    gradient: "from-gray-700 to-gray-900",
    author: { name: "Lucas 'Pixel' Silva", role: "Editor Chefe" },
    comments: [],
  },
];
