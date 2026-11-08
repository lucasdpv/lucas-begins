# 📜 Histórico de Evolução | BeginsProject

Este documento registra os marcos de desenvolvimento, melhorias de interface e implementações técnicas do portal **BeginsProject**.

---

## 🚀 [v6.6.0] - The Integrated GPU & Lightweight UI Engine Update
*Data: 8 de Novembro de 2026*

### 🧩 Adoção de Bibliotecas Modernas & Leves (`Embla`, `AutoAnimate`, `CVA`)
- **Embla Carousel (`Carousel.tsx`)**:
  - Substituição da lógica manual de timers, gestos e múltiplos estados do carrossel por **`embla-carousel-react`**, **`embla-carousel-fade`** e **`embla-carousel-autoplay`**.
  - Remoção das 3 camadas de `<Image>` em tela cheia com `filter: blur(64px) saturate(150%)` que sobrecarregavam GPUs integradas; substituídas por uma iluminação ambiente leve em `radial-gradient` estático acelerado por hardware.
- **AutoAnimate (`HomePage.tsx` & `ArchivePage.tsx`)**:
  - Substituição dos wrappers `<motion.div layout>` e `<AnimatePresence mode="popLayout">` em cada card das grades de Novidades e Catálogo pelo hook **`useAutoAnimate`** (`@formkit/auto-animate/react`), mantendo animações suaves de filtragem com zero custo de CPU durante a rolagem.
- **Class Variance Authority (`Badge.tsx`)**:
  - Refatoração das variantes de tamanho e estilo utilizando **`class-variance-authority` (`cva`)**.

### ⚡ Otimização de Rolagem (60fps) para Notebooks com GPU Integrada
- **Desmontagem Real de Skeletons (`RetroCardImage.tsx`)**:
  - Corrigido gargalo em que ~40 skeletons com `animate-pulse` permaneciam montados infinitamente atrás das imagens já carregadas (`opacity-0`). Agora o bloco de skeleton é completamente desmontado da árvore DOM assim que `isLoaded && valid` é verdadeiro.
- **Fim dos Re-Renders da Home Durante o Scroll (`HomePage.tsx`)**:
  - Removidos os estados `hoveredRetrocafeIndex`, `hoveredDossieIndex` e `hoveredReviewsIndex` (e o fundo dinâmico `<motion.div className="blur-2xl">` do RetroCafé) que disparavam re-renderização completa da `HomePage` sempre que o ponteiro do mouse cruzava um card durante a rolagem. Todos os efeitos de hover agora rodam em CSS puro (`group-hover:` + `transform-gpu`).
- **Redução de Overdraw & `backdrop-blur` Aninhados**:
  - Substituídos mais de 25 `backdrop-blur-md` / `backdrop-blur-2xl` internos em badges, pílulas de leitura, botão Topo e header fixo por fundos de alta opacidade (`bg-[#090812]/90` e `bg-[#090812]/95`), mantendo a estética escura sem re-amostrar os pixels em movimento a cada frame.
  - Simplificada a máscara CSS `.mag-halftone` em `src/index.css` e removido `content-visibility: auto` (`.deferred-below-fold`) que causava micro-engasgos ao recalcular o layout no meio da rolagem.
- **Scroll Listeners com `requestAnimationFrame`**:
  - `useNavbar.ts`, `BackToTop.tsx` e `PostDetailPage.tsx` agora processam eventos de scroll dentro de `requestAnimationFrame` (`passive: true`) com comparação de estado para evitar reflows síncronos.

### 🌐 SSR Instantâneo na Home & Alinhamento Widescreen nas Matérias
- **Pré-carregamento SSR na Home (`src/app/page.tsx` & `usePostsQuery.ts`)**:
  - `src/app/page.tsx` agora busca em paralelo no servidor (`revalidate = 300`) os dados de Destaques, Top 5, Reviews, Dossiês, RetroCafé e Novidades via Firestore REST API, injetando-os como `initialData` nos hooks do React Query (`usePostsQuery.ts`).
  - O conteúdo markdown completo dos artigos é convertido no servidor diretamente para a string de tempo de leitura (`"X min de leitura"` compatível com `calculateReadingTime` em `src/lib/utils.ts`), reduzindo em ~90% o JSON serializado na Home.
- **Alinhamento de Largura nas Matérias (`PostDetailPage.tsx` & `PostDetailSkeleton.tsx`)**:
  - Removido o limitador interno `max-w-[1520px] mx-auto` da página de matéria e de seu skeleton, alinhando 100% da largura com o container `.layout-container` (`1760px`) da Navbar e da Home.
- **Player do YouTube & Imagens de Artigo (`ArticleRenderer.tsx`)**:
  - Adicionado `loading="lazy"` nativo ao `<iframe>` oficial do YouTube em `ArticleVideo` e restrita a camada `.scanline-overlay` apenas para imagens com `frameStyle === 'crt'`.

---

## 🏆 [v6.5.0] - The Scorecard Verdict & Smart Review Extractor Update
*Data: 6 de Novembro de 2026*

### ⭐ Novo Scorecard "Veredito Begins" (`PostVerdict.tsx` & `schemas.ts`)
- **Crachá na Borda Superior (`VEREDITO BEGINS`)**: O selo de identificação agora fica cravado exatamente sobre a borda superior esquerda do card (`absolute -top-4 left-6 z-30 bg-black text-white border-2 border-white shadow-[3px_3px_0px_#6b21a8]`), mantendo consistência visual direta com os blocos editoriais `:::info-box` de `ArticleRenderer.tsx`.
- **Banner Cinematográfico com Tipografia Refinada**:
  - Arte do jogo integrada ao fundo do cabeçalho com máscara de gradiente suave da esquerda para a direita, preservando a visibilidade dos personagens.
  - Título do jogo formatado em *Title Case* natural (`text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight`) em vez de caixa alta excessiva, acompanhado de subtítulo em violeta suave e frase curta opcional (até 140 caracteres).
- **Coluna Arquitetônica de Pontuação**:
  - Painel lateral dedicado (`lg:col-span-3`) com iluminação radial âmbar, nota em destaque (`8.5/10`), insígnia de classificação automática (*★ Obra-Prima* para `>= 9.0`, *Excelente* para `>= 8.0`, *Recomendado* para `>= 7.0`, *Regular* abaixo de `7.0`) e barra de progresso HUD segmentada em 10 blocos.
- **Grid de Prós & Contras + Modo Híbrido**:
  - Rodapé dividido em duas colunas: **O Que Brilha (Prós)** em verde esmeralda (`✓`) e **O Que Pesa (Contras)** em rosa/vermelho (`✕`).
  - Adicionados os campos `pros: z.array(z.string()).catch([])` e `cons: z.array(z.string()).catch([])` ao `PostSchema` em `src/features/posts/schemas.ts`, mantendo fallback automático para o bloco de *Síntese* caso algum review possua apenas texto corrido.

### 🧠 Migração Completa do Acervo & Extrator Inteligente (`reviewVerdictHelper.ts` & `PostEditorPage.tsx`)
- **Curadoria e Migração das 8 Reviews Publicadas**: Todas as análises existentes no banco (*Chrono Trigger*, *Top Gear*, *Turtles in Time*, *Radiata Stories*, *Jackie Chan Stuntmaster*, *Naruto Ultimate Ninja*, *Diablo 4: Lord of Hatred* e *Lufia and the Fortress of Doom*) tiveram seu texto integral analisado e seus respectivos Prós & Contras mapeados em `src/features/posts/utils/reviewVerdictHelper.ts` (`resolvePostProsCons`).
- **Novo Painel de Veredito no Editor (`PostEditorPage.tsx`)**:
  - Prévia ao vivo da Nota Final com cálculo automático do selo (*Obra-Prima*, *Excelente*, etc.) e da barra de 10 segmentos.
  - Campo de *Frase Curta do Banner* opcional com contador e trava em `140 caracteres` (mais botão rápido *"Deixar sem frase"*).
  - Editor interativo linha a linha para adicionar, editar (com `Enter` para nova linha) e remover itens de **Prós** e **Contras**.
  - Botão **`✨ Gerar Prós & Contras da Análise`** (`generateProsConsFromArticle`): analisa o texto da matéria (via Gemini 2.0 Flash quando configurado ou analisador heurístico contextual em português) e preenche automaticamente de 3 a 4 pontos fortes e 1 a 2 pontos fracos sucintos para revisão do autor.

---

## 💎 [v6.4.0] - The Editorial Refinement & Floating Navigation Update
*Data: 4 de Novembro de 2026*

### 🧭 Pílula de Capítulos & Botão Topo Sincronizados (`ChapterPill.tsx` & `BackToTop.tsx`)
- **Modo Compacto no Celular**: No celular (`< sm`), o indicador de capítulos agora é um botão circular de 40x40px (`w-10 h-10 rounded-full`) exibindo o anel de progresso e o número do capítulo atual (`01`, `02`, etc.), eliminando a barra que ocupava quase toda a largura da tela.
- **Geometria e Baseline Pixel-Perfect**: `ChapterPill` (lado esquerdo) e `BackToTop` (lado direito) agora compartilham exatamente a mesma altura de container (`h-20 md:h-24`), margem inferior (`mb-5 md:mb-7`) e elevação (`h-10 rounded-full`).
- **Auto-Hide por Inatividade Inteligente (2.5s)**: Ao parar de rolar para ler o texto do artigo, ambos os botões desaparecem suavemente juntos após 2,5 segundos, desobstruindo totalmente a visão de leitura. Qualquer rolagem ou toque na tela os traz de volta imediatamente. Se o menu de capítulos estiver aberto, o auto-hide é suspenso.

### ⭐ Redesign Minimalista do Veredito Oficial (`PostVerdict.tsx`)
- **Selo Quadrado com Presença**: O bloco da nota foi movido para o canto superior direito (`float-right ml-4 mb-3 sm:ml-6 sm:mb-4`) em um formato quadrado perfeito (`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl`).
- **Nota Protagonista & Selo `/10` na Quina**: O número (ex: `7.5`) ganha destaque absoluto no centro em tipografia encorpada (`text-4xl sm:text-5xl font-black text-amber-400 font-retro`), acompanhado da tag `/10` encaixada no canto inferior direito.
- **Texto Fluido sem Espaço Vazio**: O parágrafo de veredito flui em volta do bloco de pontuação, expandindo para 100% da largura logo abaixo dele, eliminando a antiga coluna vazia à esquerda.

### 👤 Perfil do Autor Enxuto & Minimalista (`AboutPage.tsx`)
- **Avatar Proporcional com Status Integrado**: Redimensionado para escala moderna (`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl`) com anel verde de status `Online` no canto inferior.
- **Fim dos Cards Empilhados**: Substituídos os 3 blocos gigantes que ocupavam mais de 300px verticais por um cabeçalho horizontal elegante lado a lado no celular e no desktop.
- **Informações Personalizadas**: Foco direto em *Lucas Vieira · Criador do BeginsProject · Plataformas: PlayStation & Nintendo*. Removidas hashtags estáticas e decorativas desnecessárias.

### 🛡️ Prevenção de Hydration Mismatch no SSR (`PostActions.tsx` & `PostComments.tsx`)
- **Montagem Segura do Cliente**: Adicionado guard `isMounted` com `useEffect` para sincronizar os componentes de ações de post e comentários dependentes de autenticação do Firebase.
- **Fim dos Conflitos de Hidratação**: O HTML renderizado pelo servidor (esqueleto em loading) e o primeiro ciclo de renderização no cliente permanecem 100% idênticos, ativando os botões de curtir/favoritar e o formulário de comentários sem disparar avisos no console.

### 📱 Menu Mobile, Carrossel Otimizado & Configurações Next.js
- **Menu de Categorias Enxuto (`MobileMenu.tsx`)**: Removido o item redundante "Todos" da lista de categorias mobile, mantendo apenas as 4 seções editoriais, já que a navegação global é coberta pelo botão "Catálogo Completo".
- **Carrossel Otimizado para Celulares 120Hz (`Carousel.tsx`)**:
  - **Desativação do Ambilight no Mobile**: O efeito difuso de projeção traseira com múltiplos filtros pesados (`blur-2xl/3xl` + `saturate-150`) agora fica restrito a telas médias/grandes (`hidden md:block`), poupando a GPU de celulares intermediários (como Samsung Galaxy M23 e similares) do cálculo de blur contínuo.
  - **Crossfade Leve e Fim do Ken Burns em Telas Pequenas**: A transição de slides no celular passou a usar transição pura de opacidade com aceleração via `transform-gpu`, mantendo o zoom Ken Burns apenas no desktop (`md:scale-[1.04]`).
  - **Fim do Repaint por Blur no Framer Motion**: A troca de títulos agora anima exclusivamente `opacity` e deslocamento vertical (`y`), removendo o filtro `filter: blur()` que causava re-rasterização quadro a quadro no Android.
  - **Suporte Inteligente ao Gesto Touch**: Detecção de arraste melhorada com análise de vetor cartesiano (`|diffX| > |diffY|` e > 45px), impedindo que a rolagem vertical de página dispare trocas acidentais de slides.
  - **Dimensionamento Responsivo de Imagens**: Atualizado o atributo `sizes` do Next.js Image para requisitar resoluções otimizadas no celular em vez de imagens gigantescas de desktop.
- **Desativação do Dev Indicator (`next.config.js`)**: Adicionado `devIndicators: false` para desabilitar o badge de desenvolvimento do Next.js no canto inferior da tela em modo de desenvolvimento.

---

## ⚡ [v6.3.0] - The Hyper-Speed & Visual Polish Update
*Data: 3 de Novembro de 2026*

### 🚀 Aceleração de Entrega de Imagens & Formatos Modernos
- **Next.js Image Pipeline**: Habilitados formatos modernos `image/avif` e `image/webp` no `next.config.js` com tempo mínimo de cache TTL de 30 dias (`minimumCacheTTL: 2592000`).
- **Firebase Storage Cache-Control**: Novo header `public, max-age=31536000, immutable` adicionado em todos os uploads de imagens no `uploadService.ts`, permitindo que os navegadores e CDNs façam cache das imagens por até 1 ano.
- **Compressão Automática em WebP**: Otimização do upload para saída sempre em `.webp` a 0.78 de qualidade e resolução máxima de 1440px (limite de 350KB), acelerando dramaticamente o upload e download das artes de capa.
- **Fim das Requisições Duplicadas**: Removido o hook `useImageFallback` que baixava imagens duas vezes via `new Image()`. Substituído pelo evento nativo `onError` do componente `<Image>` do Next.js.

### 🎨 Shimmer Skeleton Temático & Fim das Caixas Pretas (`RetroCardImage.tsx`)
- **Fim do Vazio Preto**: Criado o componente unificado `RetroCardImage` com skeleton animado suave e paletas temáticas por seção:
  - ☕ **RetroCafé**: Tons de âmbar/laranja com ícone retro em pulso suave.
  - 📖 **Dossiês**: Tons azul/sky com ícone temático de arquivo confidencial.
  - ⭐ **Reviews**: Tons dourados/amber com ícone de veredito oficial.
  - 🎮 **Novidades / Catálogo / Top 5**: Tons roxos e neons.
- **Transição Crossfade Elegante**: As imagens agora entram com fade-in suave (`opacity-0` ➔ `opacity-100` em 700ms) sem estouros visuais repentinos ao terminar o download.

### ⏱️ Fim da Piscada / Recarregamento na Home (`HomePage.tsx`)
- **Remoção de Delay Artificial**: Eliminado o temporizador de 900ms em `requestIdleCallback` que provocava saltos de layout e re-renderizações após o primeiro carregamento da Home.
- **Consultas Simultâneas**: Todas as seções iniciam imediatamente e aproveitam o cache em memória do TanStack Query (10 minutos de `staleTime`), mantendo a navegação entre páginas fluida e instantânea.

### 📖 Abertura Sub-Segundo e Aceleração de Artigos (`PostDetailPage.tsx` & `ArticleRenderer.tsx`)
- **Remoção do Bloqueio de Hidratação**: O leitor visualiza o artigo imediatamente no primeiro frame via SSR (`initialPost`), eliminando o breve flash de tela branca.
- **Consultas Otimizadas no "Continue Explorando"**: A consulta de posts recomendados foi enxugada de 32 posts completos para apenas 4 a 6 posts da mesma categoria, carregados de forma diferida.
- **Pré-carregamento de Imagens do Artigo**: As 4 primeiras imagens do corpo do artigo agora carregam com `loading="eager"` e `fetchPriority="high"`, acompanhadas de placeholders pulsantes, acabando com a espera ao rolar a página.

### 🧩 Alívio de GPU & Code-Splitting
- **Clareamento e Otimização do Carrossel Hero**: Redução dos filtros pesados de desfoque (Ambilight) de 3 camadas para 1 camada leve (`blur-2xl`), sem sobrecarga na GPU de celulares e laptops.
- **Code-Splitting de Modais**: `LoginModal`, `CookieConsent` e `ShareModal` migrados para `next/dynamic` (`ssr: false`), reduzindo o tamanho do bundle JavaScript inicial.

---

## 📰 [v6.2.0] - The Magazine & Responsive Update
*Data: 1º de Novembro de 2026*

### 🗞️ Seções Editoriais com Cara de Revista dos Anos 90 (`MagazineBackdrop.tsx`)
- **RetroCafé, Dossiês e Reviews** ganharam fundo inspirado em revistas de games dos anos 90 (Ação Games, SuperGamePower, Herói): retícula colorida (halftone) em dois cantos, brilho suave e um filete fino na cor da seção. Tudo em CSS estático, sem blur nem animação.
- **Títulos de capa**: itálico inclinado com sombra deslocada colorida ("impressão desalinhada") — laranja/magenta no RetroCafé, azul/amarelo no Dossiês e dourado/vermelho no Reviews.
- Removidos o feixe de laser azul dos cards de Dossiê e os selos de "explosão" testados durante o redesign.

### 🃏 Cards em Formato Pôster
- **Dossiês** passou a usar o mesmo pôster vertical do RetroCafé (sem o selo "Arquivo #0X").
- **Recém-Adicionados e Catálogo** trocaram o card horizontal/widescreen pelo pôster: arte ocupando o card, nota e pílulas de views/tempo de leitura no topo, categoria, data, título e subtítulo inteiros embaixo. Curtir e favoritar ficam dentro da matéria.
- Grade de 1 coluna (celular), 2 (tablet) e 4 (a partir de 1280px). Recém-Adicionados mostra 4 matérias; o Catálogo, 8 por página.
- Títulos dos cards de RetroCafé/Dossiê/Top 5/Reviews deixaram de ser cortados com "…" e foram padronizados em tamanho menor.

### 📚 Sumário de Capítulos Refinado (`ChapterPill.tsx`)
- Lista em estilo "Sumário": linha do tempo fina com bolinhas (lidos, atual e próximos), títulos em fonte normal e **tempo estimado de cada capítulo** (200 palavras/minuto, mesma base do `calculateReadingTime`).
- Pílula mais fina mostrando "X de Y · ~N min restantes".
- **No celular**, a lista abre como uma folha que sobe do rodapé, com fundo escurecido; fecha com toque fora, Esc ou arrastando a alça.
- O botão **Topo** (`BackToTop.tsx`) passou a seguir o mesmo visual da pílula (42px, redondo, halo roxo), alinhado na mesma linha.
- Borda amarela de foco do navegador substituída por um brilho roxo.

### 📱 Responsividade (Celular & Tablet)
- **Carrossel**: no celular, sem resumo, sem pílula de curtidas e sem o escurecimento lateral (a arte aparece inteira). As miniaturas e o título grande se ajustam entre 1024 e 1279px; o resumo aparece só a partir de 1280px.
- **Tablet (≥ 1024px)** usa o design de computador (3 colunas nas seções editoriais, miniaturas no carrossel). Abaixo disso as seções empilham com o **Reviews primeiro**.
- **Barra de rolagem personalizada só em computador** (`@media (hover: hover) and (pointer: fine)`): em telas de toque volta a barra nativa, que não ocupa espaço.
- Cabeçalho "Recém-Adicionados" quebra linha em vez de cortar com "…".

### 🐛 Correções
- **"Voltar" após "Ver todos"**: o botão gravava a categoria num estado global e, ao voltar, a home abria presa na tela da categoria. Agora a categoria vai na URL do catálogo (`/archive?categoria=Dossiê`), o que também torna o link compartilhável.
- **`.line-clamp-2` com `!important`** (regra antiga em `index.css`) impedia esconder qualquer texto com esse corte. Removida — o Tailwind 3.4 já fornece o utilitário.
- O cabeçalho da categoria na Home mostra só o nome da categoria (sem "Setor:"); "Ver todos" alinhado à linha do título em todas as seções.
- **Carrossel no computador (≥ 1280px)**: resumo exibido inteiro em área fixa de 4 linhas, deixando todos os slides com a mesma altura e o botão "Ler matéria" sempre no mesmo lugar. Entre 1024 e 1279px a pílula de curtidas/tempo some para o botão não mudar de posição entre slides.

### 🧹 Console Limpo
- **Erro de hydration no menu do usuário** (`NavUserMenu.tsx`): o usuário chega do Firebase depois do HTML do servidor; o menu agora só mostra "Login"/avatar depois de montado, evitando que o React descarte e refaça a página inteira.
- **AdSense**: carregado com `<script async>` simples no `<head>` (via `next/script` recebia `data-nscript`, que o AdSense não aceita).
- **Som de clique**: um único `AudioContext` compartilhado, criado só depois da primeira interação do visitante (antes, cada hover criava um contexto novo e o navegador avisava que o áudio estava bloqueado).
- **Imagens**: removido `quality={40}` (não configurado no Next 16) e a primeira arte do carrossel carrega com `loading="eager"` por ser o maior elemento da tela (LCP).

---

## 🧭 [v6.1.0] - The Categories, Chapters & Performance Update
*Data: 31 de Outubro de 2026*

### 🗂️ Reestruturação das Categorias (11 → 4)
- **Novas categorias oficiais**: `Reviews`, `Dossiê`, `Animes & TV` e `RetroCafé`. As antigas (`Especial`, `Nostalgia`, `Cultura Pop`, `RPG & MMO`, `Retro`, `Notícias`, `Tech & Futuro`, `Artigos`) foram descontinuadas.
- **Migração dos dados**: As 37 matérias reais foram reclassificadas no Firestore (Reviews 7 · Dossiê 10 · Animes & TV 10 · RetroCafé 10). As 3 matérias de teste vindas do antigo `mockData.ts` (SNK NeoGeo, Soulslike, Mídia Física) ficam marcadas para exclusão manual.
- **Fonte única no código (`src/features/posts/utils/categoryInfo.ts`)**: `SITE_CATEGORIES`, descrição de cada categoria (`getCategoryDescription`) e frase curta (`getCategoryTagline`). Navbar, MobileMenu, Catálogo, filtro do Painel e editor de posts deixaram de ler a coleção `categories` do Firestore.
- **Descrição da categoria**: Ao abrir uma categoria no Catálogo ou na Home, um texto curto explica o que o leitor vai encontrar ali.
- **Identidade visual**: `Animes & TV` ganhou cor rosa e ícone de TV; `RetroCafé` passou a usar o ícone de xícara. Os ícones das seções da Home agora são os mesmos do menu de categorias.

### 📚 Pílula Flutuante de Capítulos (`ChapterPill.tsx`)
- Quando o índice de capítulos sai da tela, uma pílula flutuante aparece no canto inferior esquerdo com anel de progresso, `Capítulo X de Y` e o nome do capítulo atual. Ao clicar, abre a lista de capítulos (lidos, atual e próximos) para navegação rápida.
- Renderizada via `createPortal(..., document.body)` para não ser afetada pelo `transform` da animação de entrada das páginas.

### 🧹 Remoções
- **Tradução automática (Google Translate)**: Removidos `TranslationContext`, `LanguageSelector` e os estilos `goog-te-*`. O widget reescrevia o DOM controlado pelo React, causando a tela "tremendo" entre PT e o idioma escolhido e o seletor travado em `PT`. Leitores podem usar a tradução nativa do navegador.
- **Barra de progresso de leitura**: Removida a "EXP Bar" do topo e o texto `LEITURA: X%` do índice (atualizava a cada evento de scroll e conflitava com a tradução).
- **Seed & limpeza automática**: Removidos `SystemInitializer`, `SeedData.ts`, `CleanUp.ts` e `mockData.ts`. O `cleanupDuplicates` rodava no navegador do admin e apagava silenciosamente matérias com títulos repetidos.
- **Catálogo**: Removida a barra de ordenação (Recentes / Mais lidos / Curtidos / Notas) e o link "Catálogo" do rodapé.
- **Dossiês**: Removido o feixe de laser azul animado no hover dos cards.

### 🎨 Interface
- **Catálogo (`ArchivePage.tsx`)**: Removido o campo de busca próprio (redundante com a busca da Navbar), fileira de categorias sem caixa/rótulo, 8 matérias por página (duas fileiras completas) e correção de plural ("1 título encontrado"). Título da página atualizado para "Catálogo Completo".
- **Menu de Categorias (`NavCategoryMenu.tsx`)**: Lista em coluna única com a frase de cada categoria, sem o item "Todos".
- **Cards de Dossiê na Home**: Mesmo visual de pôster dos cards do RetroCafé, nas cores azuis do Dossiê.
- **Recém-Adicionados**: Exibe 4 matérias em vez de 6.
- **Alinhamento de cabeçalhos**: Ícones sempre na linha do título, com o subtítulo alinhado abaixo do título (Home, Catálogo, Continue Explorando e Comentários).

### 🐛 Correções
- **Modal de compartilhar**: A miniatura usava `w-18 h-18`, classes inexistentes no Tailwind 3.4, e a imagem estourava o modal. Corrigida também a grade de botões, que deixava um espaço vazio.
- **Classes Tailwind inválidas**: Corrigidas classes que não geravam CSS (`group-hover:scale-108` nos cards, `active:scale-98`, `py-0.2`, `sm:w-18`/`md:w-22` no veredito, tons como `yellow-350`/`red-450` e outras), restaurando o zoom das imagens ao passar o mouse.
- **Selo de Dossiê**: `CategoryBadge` não reconhecia "Dossiê" no singular e exibia roxo em vez de azul.
- **Editor**: Matérias novas podiam começar com categoria vazia enquanto as categorias carregavam do Firestore.

### ⚡ Performance
- **Carrossel (`Carousel.tsx`)**: Só ficam montados o slide atual, o anterior, o próximo e o da miniatura sob o mouse (antes, 5 imagens grandes + 10 camadas com desfoque pesado). O Ambilight usa uma versão de 96px da arte e as miniaturas usam imagens otimizadas de 144px.
- **Fundo global (`ClientLayoutWrapper.tsx`)**: As 3 manchas de luz com `blur` de 110–130px e `animate-pulse` infinito foram trocadas por gradientes radiais estáticos.
- **Home**: Removida uma consulta paginada ao Firestore que não era exibida e reduzida a busca de recentes de 15 para 4 matérias.

---

## 🚀 [v6.0.0] - The Cyber-Editorial & Streaming Geek Redesign Update
*Data: 30 de Outubro de 2026*

### 🎬 Redesign Completo: Cyber-Editorial + Streaming Geek
- **Nova Identidade Global (`src/index.css`, `Navbar.tsx`, `Footer.tsx`)**: Transição completa do antigo visual neo-brutalista de bordas pretas grossas para uma estética **Cyber-Editorial + Streaming Geek** (inspirada em *Netflix*, *Crunchyroll*, *Polygon* e *The Verge*), com fundo escuro cinematográfico (`#090812`), superfícies translúcidas (`#121024/90`), bordas finas (`border-white/[0.08]`) e cantos arredondados (`rounded-2xl` / `rounded-3xl`).
- **Assinatura Oficial da Marca (`GAMES · ANIMES · NOSTALGIA`)**: Adicionado o subtítulo `GAMES · ANIMES · NOSTALGIA` sob o logotipo `BEGINSPROJECT` na Navbar, no MobileMenu e no Footer.
- **Expansão Widescreen Desktop (`.layout-container`)**: Novo container fluido com `max-width: 1760px` em `ClientLayoutWrapper.tsx`, `Navbar.tsx` e `Footer.tsx` para aproveitar monitores Full HD e Ultrawide, exibindo 6 cards em *Recém-Adicionados* e até 4 colunas no *Catálogo Completo* (`2xl:grid-cols-4`).
- **Padronização da Navbar & Correção da Busca**: Tipografia unificada em 100% dos itens da Navbar (`font-retro font-black text-xs uppercase tracking-widest`), barra de busca central ampla (`flex-1 max-w-md xl:max-w-lg 2xl:max-w-xl`) e dropdown de resultados com largura mínima garantida (`minWidth: 420px`) tanto para usuários logados quanto deslogados.
- **Modo Escuro Fixo Temporário (`useThemeStore.ts`)**: Ocultado o botão de alternância de tema claro/escuro e fixado `isDark: true` até a futura refatoração dedicada do sistema de temas.

### 🌈 Billboard Hero com Efeito TV Ambilight & Crossfade Cinematográfico
- **Extensão de Luz da Cena (Ambilight)**: Substituído o container recortado por uma projeção Ambilight em dupla camada sem `overflow-hidden` (`blur-[110px] saturate-[1.85] -inset-16` + `blur-[48px] saturate-[1.6] -inset-4`) tanto no `Carousel.tsx` quanto no `PostHero.tsx`, espalhando organicamente as cores reais da arte pelo ambiente escuro.
- **Transição Contínua sem Piscar**: Camadas de imagem pré-montadas no `Carousel.tsx` com crossfade suave de `1100ms`, efeito *Ken Burns* sutil (`scale-100` vs `scale-[1.04]`), transição de texto com leve desfoque e dock de miniaturas estável no canto inferior direito.

### 🔥 Trilho "Top 5 Em Alta Hoje" & Séries Originais (`HomePage.tsx`)
- **Numerais Estilo Top 10 (`.netflix-rank`)**: Números gigantes vazados à esquerda dos posters que se preenchem com **dourado sólido (`#fbbf24`)** e brilho âmbar ao passar o mouse, além de fallback gracioso de gradiente (`onError`) para imagens indisponíveis.
- **Séries & Coleções Originais**:
  - **RetroCafé**: Posters verticais `3:4` estilo série original (`EPISÓDIO #01`) com aura laranja reativa.
  - **Dossiês**: Cards widescreen confidenciais (`ARQUIVO #01`) com feixe de laser azul no hover.
  - **Reviews**: Vitrine de vereditos com nota em destaque e máscara de gradiente suave sobre a arte do jogo.

### 🔄 Recomendações Dinâmicas & Polimento de Artigos (`PostDetailPage.tsx`)
- **"Continue Explorando" Dinâmico (`PostRelated.tsx`)**: Pool inteligente combinando matérias da mesma categoria (`usePostsByCategory`), recentes (`useLatestPosts(12)`) e populares (`usePopularPosts(12)`), embaralhados de forma única por artigo (`seededShuffle`) + botão interativo **"Outras Sugestões"**.
- **Barra de Progresso de Leitura via Portal**: Movida para `createPortal(..., document.body)` com fundo transparente e remoção do `transform` residual em `@keyframes pageEnter`, corrigindo o bug onde a barra cortava o botão `← VOLTAR AO CATÁLOGO`.
- **Box do Autor e Veredito Responsivos (`PostAuthorBox.tsx`, `PostVerdict.tsx`)**: Removido o `line-clamp-2` que cortava a bio do autor em telas portáteis/mobile e aplicado layout responsivo empilhado (`flex-col sm:flex-row`).

### 🦴 Atualização Completa de Skeletons, Páginas Internas & Overlays
- **Skeletons Cyber-Editoriais**: `CarouselSkeleton.tsx`, `PostSkeleton.tsx` e `PostDetailSkeleton.tsx` atualizados para `rounded-2xl`/`rounded-3xl` e `border-white/[0.08]`.
- **Páginas Internas & Modais**: `ArchivePage.tsx`, `AboutPage.tsx`, `ContactPage.tsx`, `DashboardPage.tsx`, `PrivacyPolicyPage.tsx`, `NotFoundPage.tsx`, `AuthGate.tsx`, `ShareModal.tsx`, `LoginModal.tsx`, `CookieConsent.tsx`, `BackToTop.tsx` e `Toast.tsx` atualizados para o novo Design System.

---

## 🚀 [v5.1.2] - Server Hydration Comments, Hydration Mismatch & Dynamic Sitemap Fix
*Data: 21 de Junho de 2026*

### ⚡ Correção de Comentários no Carregamento
- **placeholderData no usePost**: Alterado o hook de busca de detalhes do post (`usePost` em `usePostsQuery.ts`) para usar `placeholderData` no lugar de `initialData`. Isso corrige o bug em que os comentários ficavam ausentes ao recarregar a página (devido ao `initialPost` gerado pelo SSR do Next.js via API REST não conter a subcoleção de comentários e ser cacheado como "fresco" pelo React Query devido ao `staleTime`). Agora, os dados do SSR servem de placeholder e a consulta real é realizada em segundo plano no cliente pelo SDK do Firebase.

### ⚡ SEO e Correção de Erros de Hidratação
- **Supressão de Hydration Warnings**: Adicionado `suppressHydrationWarning` na tag `<html>` do `layout.tsx` global para evitar falhas de hidratação e mensagens de erro causadas por extensões do navegador (como gerenciadores de senhas ou ferramentas criptográficas que injetam atributos como `data-bry-content-script-syngular`).
- **Remoção de Sitemaps Estáticos**: Removidos os arquivos estáticos obsoletos `public/sitemap.xml` e `public/robots.txt` para que o Next.js possa servir corretamente as rotas dinâmicas configuradas em `sitemap.ts` e `robots.ts`.
- **Redirecionamento 301**: Ajustado o redirecionamento de domínios na Vercel de temporário (307) para permanente (301) e da versão `www` para a versão raiz, resolvendo conflitos de indexação no Google Search Console.

## 🚀 [v5.1.1] - The AdSense data-nscript Tag Resolution & Progressive Loading Performance Update
*Data: 14 de Junho de 2026*

### ⚡ Correção do Google AdSense
- **Remoção do data-nscript**: Substituído o componente `<Script>` do Next.js por uma tag HTML `<script>` padrão no `layout.tsx` para carregar o Google AdSense. Isso impede que o Next.js injete o atributo interno `data-nscript`, eliminando o erro de validação do console do AdSense.

### ⚡ Otimização de Imagens (LCP) & Carregamento Progressivo
- **Priorização de Imagens LCP**: Adicionado suporte para o prop `priority` no `PostCard.tsx` e ativado nas primeiras postagens renderizadas na `HomePage.tsx` (2 primeiros cards), `ArchivePage.tsx` (3 primeiros cards) e `DashboardPage.tsx` (3 primeiros cards). Isso garante que as imagens acima da dobra sejam pré-carregadas imediatamente pelo navegador.
- **Priorização Automática de Artigos**: Atualizado o `ArticleRenderer.tsx` para carregar com `loading="eager"` (prioridade máxima) a primeira imagem encontrada no corpo do post, otimizando o LCP em posts curtos.
- **Desacoplamento e Carregamento Preguiçoso de Queries**: Restaurado e expandido o carregamento progressivo de dados via o hook `isSecondarySectionsReady` na `HomePage.tsx` (usando `requestIdleCallback`/`setTimeout`). As consultas secundárias de `mostViewedPosts` (Mais Lidos), `reviewPosts` (Reviews), `dossiePosts` (Dossiês) e `retrocafePosts` (RetroCafé) agora são postergadas até o navegador ficar ocioso, reduzindo as consultas simultâneas na inicialização do portal de 6 para apenas 2.

---

## 🚀 [v5.1.0] - The Dynamic SEO Description, Analytics Recovery & Portal Modal Update
*Data: 14 de Junho de 2026*

### ⚡ SEO Inteligente & Rastreamento Recuperado
- **Restauração de Rastreamento e Monetização**: Reintegradas as chaves de verificação de propriedade do Google Search Console e Yandex, a tag do Google AdSense e o script do Google Analytics 4 (GA4) diretamente no `layout.tsx` do Next.js via metadados nativos e `<Script>` otimizado. Isso previne perda de métricas e anúncios após a migração do Vite.
- **Resumo Automático de Matérias (Fallback SEO)**: Adicionado um algoritmo que limpa marcações de Markdown (links, títulos, imagens, etc.) do conteúdo da matéria para extrair os primeiros 160 caracteres, servindo como descrição dinâmica para o Google e redes sociais caso o autor não preencha o resumo.
- **Prerendering Estático de Alta Escala**: Aumentado o limite de compilação estática (`generateStaticParams`) de 10 para até 100 posts, garantindo que todo o acervo histórico de matérias seja pré-renderizado estaticamente em tempo de build para tempos de resposta instantâneos.

### 🎨 Bug Fix: Share Modal Fullscreen Portal
- **React Portal no ShareModal**: Refatorado o `ShareModal.tsx` utilizando `createPortal` para renderizar o modal no `document.body` e alterado o índice de profundidade para `z-[150]`. Isso soluciona o bug do modal encolhido e com fundo escuro cortado causado pelo contexto de animação (`transform`) do container principal da página, alinhando-se ao comportamento do `DeleteModal` e `LoginModal`.
- **Prevenção de Crash de SSR**: Corrigido o acesso direto ao objeto global `window.location.href` movendo-o para um estado reativo atualizado em `useEffect` somente após o carregamento client-side, eliminando quebras na compilação do Next.js.

---

## 🚀 [v5.0.0] - The Server-Side Hydration, Structural Security & Visual Polish Update
*Data: 13 de Junho de 2026*

### ⚡ Server-Side Hydration & Next.js SSR Integration
- **SSR Hydration**: Integrada a busca de dados do Firestore REST no servidor com o React Query client-side na rota `/post/[slug]`. O HTML é pré-renderizado estaticamente via Server Components eliminando o uso de skeletons e piscadas de tela indesejadas no carregamento de posts em cache.
- **Remoção de Código Morto**: Excluída a antiga função serverless `/api/og` e a rota legada `/post/:slug` do `vercel.json`, centralizando o tratamento de metadados e SEO no motor nativo do Next.js App Router.
- **Firebase HMR SSR Safe State**: Refatorada a inicialização do Firestore/Firebase no cliente para prevenir o erro de reinicialização múltipla (`initializeFirestore() has already been called`) durante o Hot Module Replacement (HMR) e renderização no servidor.
- **Sanitização de HTML Safe**: Ajustado o sanitizador DOMPurify no renderizador de artigos (`ArticleRenderer.tsx`) para garantir compatibilidade no ambiente de pré-renderização server-side do Next.js.
- **Correção da Build (Vercel)**: Tornou a variável de ambiente `measurementId` (usada pelo Google Analytics) opcional na inicialização do Firebase (`firebase.ts`). Isso corrige o erro fatal de build da Next.js/Vercel (`Missing Firebase environment variables: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`) durante a fase de prerender da rota `/_not-found`.

### 🔒 Segurança de visualizações Firestore (Views Rules Hardening)
- **Incremento Unitário Estrito**: Atualizadas as regras de escrita (`firestore.rules`) para impedir que qualquer usuário (logado ou anônimo) envie valores arbitrários para as visualizações de um post. O Firestore agora rejeita qualquer update de views que não seja exatamente um incremento de +1 (`views == views + 1`).

### 🎨 Paridade Visual & Ícone de Tema
- **Cores Dinâmicas no Cabeçalho de Posts (PostHero)**: O subtítulo e o badge de categoria no cabeçalho principal (`PostHero.tsx`) agora herdam dinamicamente a cor da categoria do post (ex: rosa para Nostalgia e laranja para RetroCafé), alinhando o post de detalhes aos novos cards da home.
- **Fundo do Badge Dinâmico**: O componente `CategoryBadge` em `Badge.tsx` agora resolve sua própria cor de fundo e texto dinamicamente usando `getCategoryBadgeClass`, eliminando o fundo roxo que estava rigidamente codificado no badge.
- **Ícones de Tema Visuais**: Os alternadores de tema na Navbar e no MobileMenu agora mostram o estado atual do sistema (ícone de Lua violeta quando no modo Escuro, ícone de Sol amarelo no modo Claro), fornecendo um feedback visual muito mais claro e sem a sensação de estar "invertido".

### 🧹 Organização do Repositório & Backlog
- **Lista de Pendências (Backlog)**: Criado o arquivo `BACKLOG.md` mapeando tarefas de refatoração futuras, testes de componentes (Vitest/React Testing Library) e testes E2E (Playwright/Cypress).
- **Git Ignore**: Ignorados arquivos locais de cache do TypeScript (`*.tsbuildinfo`) e a pasta de rascunhos temporários (`scratch/`) nas configurações de `.gitignore` para manter o workspace limpo.

---

## 🚀 [v4.9.0] - The Security, Performance & Image Optimization Update
*Data: 11 de Junho de 2026*

### 🔒 Segurança de Rotas (Next.js Middleware)
- **Middleware no Servidor**: Criação de Edge Middleware (`middleware.ts`) para interceptar e bloquear acessos não autorizados de usuários anônimos ou não administradores a `/admin`, `/editor` e `/dashboard`.
- **Cookies de Sessão**: Ajuste do `AuthProvider.tsx` para sincronizar cookies de autenticação (`auth_token` e `user_role`) em tempo real com o estado de login do Firebase.

### 🛡️ Regras de Acesso Firebase
- **Firestore & Storage Rules**: Versionamento e restrição total de acesso às pastas do Firebase Storage e tabelas do Cloud Firestore, garantindo que usuários comuns só editem seus próprios dados e admins tenham controle sobre as matérias.

### ⚡ Performance & Caching com ISR
- **Incremental Static Regeneration**: Adicionado `revalidate = 300` às páginas de detalhes de posts, permitindo cache de até 5 minutos nas páginas geradas.
- **Pré-compilação Estática (SSG)**: Implementado `generateStaticParams` integrado à API REST do Firestore para pré-carregar os caminhos de posts populares em tempo de build, acelerando o tempo de resposta em 10x no primeiro carregamento do leitor.

### 🖼️ Otimização Dinâmica de Imagens
- **Next.js Image no Markdown**: Atualização do renderizador de posts (`ArticleRenderer.tsx`) para usar `<Image>` do Next.js.
- **Prevenção de CLS**: Integrado resizes responsivos, controle inteligente de carregamento (`lazy`) e preservação dinâmica de aspect-ratio pós-carregamento (`onLoad`), evitando saltos visuais nos artigos.

### 🎨 Ajuste de Modal e Backgrounds Globais
- **Modal de Confirmação Fullscreen**: Modificado o `DeleteModal.tsx` para renderizar via React Portal (`createPortal`) direto no `document.body` com `z-[150]`, cobrindo de ponta a ponta a Navbar fixa e o Footer.
- **Preenchimento de Viewport e Overscroll**: Correção no `index.css` aplicando as cores de fundo do tema diretamente nos seletores `html` e `body` com transição de 0.5s, eliminando faixas brancas externas ao rolar ou esticar a página.
- **Regras Mescladas do Storage**: Atualização no `storage.rules` combinando validação de administrador no Firestore para uploads de posts e restrição de escrita por UID em avatares.

---

## 🚀 [v4.8.0] - The Next.js Server-Side SEO & Layout Polish Update
*Data: 10 de Junho de 2026*

### ⚡ Migração para Next.js & Server Components
- **Integração com Next.js**: Migração da arquitetura Vite SPA e rotas client-side para o Next.js App Router.
- **Requisições REST Resilientes**: Desacoplamento da busca de dados do Firestore no servidor usando rotas REST diretas, evitando quedas de servidor relacionadas a dependências gRPC no ambiente de Server Components (RSC).

### 🌐 SEO Dinâmico & Crawlers
- **Geração de Metadados Server-side**: Criação do método `generateMetadata` dinâmico em `[slug]/page.tsx` para prover títulos amigáveis, descrições personalizadas, links canônicos absolutos e imagens Open Graph (`og:image`).
- **Sitemap Dinâmico**: Implementação de rota `/sitemap.xml` para expor automaticamente todos os artigos publicados para indexadores de busca.
- **Configuração de Robots**: Configuração de `/robots.txt` para bloquear o rastreamento de páginas administrativas (como `/admin`, `/editor` e `/dashboard`).

### 📐 Recorte e Aspecto de Imagens Dinâmico
- **Correção de "Scroll Jump" nos Uploads**: Integração do `ImageCropper.tsx` com React Portals para injetar o modal de recorte diretamente no `document.body`, solucionando o bug onde a página sofria rolagem vertical abrupta ao selecionar um arquivo.
- **Reversão do Aspecto Forçado**: Remoção do bloqueio fixo de proporção `16:9` no componente de upload de capa ([PostEditorPage.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/views/PostEditorPage.tsx#L257-L265)) e nos estilos, devolvendo a liberdade ao editor de escolher e salvar proporções variadas (Original, 1:1, 16:9, 4:5).
- **Correção de Proporção no Mobile**: Ajuste do validador Zod ([schemas.ts](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/schemas.ts#L50-L55)) para usar `'original'` como fallback de aspecto de imagem de capa, restaurando o comportamento original em que imagens sem proporção travada se comportam como quadrado no celular e banner no computador.

### 🧹 Limpeza de Cache de Post
- **Invalidação Otimista no Salvamento**: Inclusão da invalidação automática da chave `['postBySlug']` no React Query ([usePostsQuery.ts](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/hooks/usePostsQuery.ts#L225-L232)) ao salvar/publicar alterações, forçando a página de detalhes a carregar dados novos instantaneamente.

---

## 🩹 [v4.7.1] - The Vintage Card Footer & Reviews Polish Update
*Data: 09 de Junho de 2026*

### 🃏 Rodapé do Card Vintage — Refinamento Visual
- **Consistência de Opacidade dos Ícones**: Removida a `opacity-70` dos ícones `Eye` (visualizações) e `MessageSquare` (comentários) no rodapé do card vintage, igualando o peso visual aos ícones de ação (`Heart`, `Bookmark`) do lado direito.
- **Espaçamento Uniforme**: Padronizado o `gap-1.5` em todos os pares ícone+número do rodapé, garantindo alinhamento visual perfeito e consistência horizontal.

### 🎮 Cards de Reviews — Tipografia e Profundidade
- **Títulos Maiores**: Aumentados os tamanhos de fonte dos títulos (`h4`) nos cards de Reviews de `text-[11px]` para `text-sm` (14px), e os subtítulos de `text-[10px]` para `text-[11px]`, tornando o texto muito mais legível.
- **Text-Shadow Neo-Brutalist**: Adicionada sombra sólida de texto (`text-shadow: 2px 2px 0px rgba(0,0,0,0.9)`) no título principal de cada review card, criando o efeito de profundidade neo-brutalist. Subtítulos recebem shadow mais sutil (`1px 1px`). No modo claro a opacidade é reduzida para não pesar o visual.

---

## 🎨 [v4.7.0] - The Neoretro Arcade Redesign Update
*Data: 09 de Junho de 2026*

### 🌌 Design de Fusão Neon Retro-Futurista (Glassmorphism & Cyberpunk)
- **Tipografia Premium**: Integração das fontes Google Fonts `Syne` e `Outfit` para títulos e corpo de texto modernos.
- **Sistema de Cards de Vidro**: Introdução das classes `.glass-card-premium` com efeitos de `backdrop-blur-md`, bordas com brilho neon translúcido e sombras suaves.
- **Scrollbar Neon Customizada**: Nova scrollbar ultrafina com cantos arredondados e cor roxo-neon pulsante.
- **Micro-Animações e Efeitos**: Flutuação dinâmica (`animate-float`) nos elementos decorativos e scan line (CRT) sutil nos cards.

### 🧩 Componentização e Refatoração Estrutural
- **Navbar em Cápsula Flutuante**: Redesenhada como cápsula flutuante translúcida com barra de busca expansível com brilho dinâmico no foco.
- **Footer Premium Multifuncional**: Nova organização em 3 colunas com widgets de monitoramento de sistema e badges neon interativas para redes sociais.
- **Carrossel sem Overlaps**: Correção do modo de animação para `wait` no Framer Motion, garantindo que o slide anterior some antes do próximo iniciar.
- **Cards e Skeletons Reestilizados**: Redesenho completo com skeletons em sincronia exata para CLS zero.
- **Otimização Mobile**: Ajuste responsivo de fontes e margens para rolagem fluida.

---

## 🩹 [v4.6.2] - The Split Title Hierarchy & Card Spacing Tuning Update
*Data: 08 de Junho de 2026*

### 🏷️ Inversão de Hierarquia no Split Title
- **Inversão de Destaque**: Modificamos a apresentação de títulos compostos (ex: `Título: Subtítulo`) em todo o portal. O Título Principal (nome do jogo/série) agora assume o papel de cabeçalho principal em fonte retrô destacada, enquanto o Subtítulo atua como texto secundário complementar.
- **Colorização Dinâmica**: Os subtítulos agora utilizam `font-sans` com peso semibold e são coloridos dinamicamente de acordo com a categoria temática do artigo (amarelo para reviews, azul para dossiês, laranja para retrocafé, roxo para especial, etc.), criando um visual muito mais harmonioso e legível.
- **Propagação no Sistema**: Atualizamos as regras de hierarquia e estilo em:
  - [PostCard.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/components/PostCard.tsx) (todas as variantes).
  - [Carousel.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/components/Carousel.tsx) (carrossel de destaque).
  - [PostHero.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/components/PostDetail/PostHero.tsx) (tela de detalhe da matéria).
  - [CategoryRow.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/components/CategoryRow.tsx) (seções da página inicial).
  - [HomePage.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/pages/HomePage.tsx) (seções secundárias).
  - [PostEditorPage.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/pages/PostEditorPage.tsx) (prévia dinâmica do editor de posts).

### 📐 Ajuste Fino de Espaçamento e Margens (Vintage Card)
- **Ajuste de Altura Física**: Aumentamos as alturas dos cards vintage em [PostCard.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/components/PostCard.tsx) e [PostSkeleton.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/components/PostSkeleton.tsx) de forma sincronizada para evitar cortes em títulos longos:
  - Mobile: de `170px` para `176px`.
  - Tablet (`sm`): de `185px` para `190px`.
  - Desktop (`md`): de `195px` para `200px`.
- **Margens Internas Compactas**: Reduzimos as margens inferiores do cabeçalho, bloco de título e resumo (`mb-1.5` e `mb-1`) para otimizar a distribuição do espaço vertical disponível.
- **Paddings de Segurança**: Ajustamos as margens de preenchimento (`pb-3` no mobile, `pb-3.5` no desktop) para garantir que os botões de ação (likes, favoritos, visualizações) no rodapé nunca fiquem colados ou cortados pela borda externa do card.

---

## 🩹 [v4.6.1] - The Vintage Card Mobile Visibility Update
*Data: 08 de Junho de 2026*

### 📱 Correção de Visibilidade nos Cards Vintage no Mobile
- **Aumento das Alturas dos Cards**: Ajustamos as alturas físicas dos cards da variante `vintage` no [PostCard.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/components/PostCard.tsx) de forma proporcional para garantir que todos os elementos (título em duas linhas, data, resumo e botões de ação) caibam confortavelmente sem sofrer cortes:
  - Mobile: de `150px` para `170px`.
  - Tablet (`sm`): de `165px` para `185px`.
  - Desktop (`md`): de `180px` para `195px`.
- **Sincronização nos Skeletons**: Atualizamos as dimensões de altura e paddings idênticos no [PostSkeleton.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/components/PostSkeleton.tsx) para assegurar estabilidade visual durante o carregamento de dados (CLS nulo).
- **Otimização de Padding e Margens**: Reduzimos o padding vertical do bloco de conteúdo no mobile de `p-3` para `py-2 px-3` (ganhando 8px adicionais) e ajustamos a margem inferior do resumo de `mb-2` para `mb-1.5 sm:mb-2` para melhor distribuição dos elementos.

---

## 🏷️ [v4.6.0] - The Split Title & SEO Optimization Update
*Data: 02 de Junho de 2026*

### 🏷️ Divisão Dinâmica de Títulos (Split Title)
- **Utilitário `splitTitle`**: Adicionada a função helper [splitTitle](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/lib/utils.ts) que divide o título do post no caractere `:` (ou outros delimitadores comuns como ` - `, ` – ` e ` | `) em duas partes: Título Principal (nome do jogo/série) e Subtítulo (chamada principal).
- **Cards de Posts Otimizados**: Atualizado o [PostCard.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/components/PostCard.tsx) para renderizar o Título Principal menor e com a cor temática da categoria, e o Subtítulo em fonte normal em destaque em todas as variantes (Default, Compact, Vintage).
- **Visual Banca de Revistas & Arquivos**: Seções customizadas como **RetroCafé**, **Dossiês** e **Reviews** na [HomePage.tsx](file:///c:/Users/Lucas%2520Vieira/Documents/Projetos/lucas-begins/src/pages/HomePage.tsx) e na [CategoryRow.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/components/CategoryRow.tsx) atualizadas para utilizar a divisão, dando um visual de banca de revista retro e de relatórios secretos consistente.
- **Carrossel & Hero**: Atualizados o [Carousel.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/components/Carousel.tsx) e o [PostHero.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/components/PostDetail/PostHero.tsx) para renderizar o título em duas linhas separadas, aumentando consideravelmente a harmonia e o apelo visual.
- **Painel de Criação Inteligente**: Atualizada a página [PostEditorPage.tsx](file:///c:/Users/Lucas%2520Vieira/Documents/Projetos/lucas-begins/src/pages/PostEditorPage.tsx) para incluir uma dica visual abaixo do campo de título e uma **prévia em tempo real** da divisão do título à medida que o autor escreve.

### 🌐 Otimizações de SEO & Canônicos (Google Search Console Fixes)
- **Canônica Padrão Estática**: Adicionada a tag `<link rel="canonical" href="https://lucasbegins.com.br/" />` diretamente no [index.html](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/index.html) para informar aos robôs do Google a URL principal do portal em rastreamentos que não executam JavaScript.
- **Canônica Absoluta e Limpa nos Artigos**: Atualizado o [PostDetailPage.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/pages/PostDetailPage.tsx) para gerar URLs canônicas limpas e absolutas baseadas no slug do post, descartando `window.location.href` que causava duplicidade de indexação por conta de query parameters (ex: do Google Searchbox e compartilhamento de redes sociais) e subdomínios `www`.

---

## 👾 [v4.5.0] - The Animated Retro GIF Update
*Data: 31 de Maio de 2026*

### 🎞️ Suporte Completo a GIFs Animados nos Posts
- **Exceção de Compressão no Upload**: Atualizado o [uploadService.ts](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/services/uploadService.ts) para identificar arquivos `image/gif` e ignorar a compressão e conversão para WebP, mantendo a animação do arquivo GIF original ao ser enviado para o Firebase Storage.
- **Upload Direto sem Recorte (Direct Upload Flow)**: Modificado o [ImageUpload.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/components/ui/ImageUpload.tsx) para realizar o upload direto de GIFs assim que selecionados pelo editor, ignorando o passo de crop (o corte manual de imagem transformaria o GIF animado em um frame estático).
- **Interface Inteligente**: Ocultado o botão "Ajustar Recorte" para imagens que sejam GIFs na visualização de mídia enviada do editor.

---

## 🩹 [v4.4.1] - The Mobile Overlay Positioning Update
*Data: 31 de Maio de 2026*

### 📱 Correção de Posicionamento de Overlays no Mobile
- **Fix de Elementos Fixos (WebKit/iOS)**: Movemos os overlays globais `<BackToTop />`, `<CookieConsent />` e `<LoginModal />` para fora do container principal flexbox no [App.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/App.tsx). Isso impede que navegadores WebKit/iOS calculem incorretamente a posição `fixed` com base no fluxo do flexbox, resolvendo o bug do botão de topo travado no meio da tela.
- **Alinhamento de Segurança**: Adicionada a classe `items-end` no container do [BackToTop.tsx](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/components/ui/BackToTop.tsx) para reforçar a ancoragem vertical.

---

## 🧹 [v4.4.0] - The Code Cleanup & Mobile Ordering Update
*Data: 30 de Maio de 2026*

### 🧹 Remoção de Código Morto (Dead Code Cleanup)
- **Eliminação de Lixo e Avisos**: Removemos dezenas de imports, variáveis e parâmetros locais declarados mas nunca utilizados em mais de 10 arquivos do projeto, resultando em builds mais limpos e eliminando warnings do compilador.
- **Simplificação de Componentes**:
  - Removido o cálculo de `heroStyle` e prop do `PostHero` (imagens agora utilizam `objectPosition` nativo).
  - Removido o parâmetro não utilizado `flip` em `getCroppedImg`.
  - Simplificada a assinatura de `incrementPostViews` e chamadas associadas, removendo os parâmetros sem uso `userId` e `viewerId`.

### 📱 Reordenação de Seções no Mobile
- **Foco Responsivo na Home**: As seções do feed secundário da Home foram reordenadas via CSS Grid (com `order` e `contents`) para que, em dispositivos móveis, a seção **Reviews** seja exibida no topo, logo acima de **RetroCafé** e **Dossiês**, mantendo a diagramação de colunas intacta no desktop.

---

## 🦴 [v4.3.0] - The Skeleton Fidelity Update
*Data: 30 de Maio de 2026*

### 🖼️ Skeletons Fiéis ao Design Real

- **`CarouselSkeleton` Reescrito do Zero**: O skeleton do bloco principal da homepage foi completamente refatorado para espelhar fielmente a estrutura, espaçamentos e visual do `Carousel` real e do painel "Mais Lidos". As novidades incluem:
  - Bordas brutalistas `border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]` idênticas ao componente real.
  - Hero com `bg-gray-900` + gradiente cinematográfico `from-gray-950 via-gray-950/55` + overlay de scanlines CRT.
  - Placeholder do badge de categoria com `border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]`.
  - Título animado em 2 linhas (`h-9 md:h-11`) e excerpt em 2 linhas proporcionais.
  - Row de metadados (♥ likes · ⏱ tempo de leitura) com as mesmas dimensões do original.
  - Setas de navegação com `rounded-xl bg-black/60 border border-white/20` — idênticas ao `Carousel`.
  - Dots de progresso dentro do container correto (`rounded-2xl backdrop-blur-md border border-white/15`).
  - Sidebar "Mais Lidos" desktop com 5 itens, placeholder amber para números de ranking (`bg-amber-400/20`), 2 linhas de título e linha de views — espelhando o painel real.
  - Headers das seções "Em Destaque" e "Mais Lidos" com barra lateral colorida (purple/amber) e subtítulo, iguais ao layout real.

- **`PostSkeleton` Variant Vintage Refatorada**: A variante `vintage` (usada no feed "Últimas Notícias" da HomePage) foi reescrita para ser um espelho exato do `PostCard` variant vintage:
  - Color strip lateral `w-3 shrink-0 border-r-2 border-black` animado com `animate-pulse`.
  - Thumbnail `w-32 sm:w-40 md:w-48` com overlay de scanlines CRT dentro do placeholder.
  - Header row com badge de categoria `border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]` (igual ao real) + data à direita.
  - Título em 2 linhas (`h-4`) e excerpt visível apenas em `sm+`, exatamente como no card real.
  - Footer com views/comentários à esquerda e botões de ação quadrados `w-6 h-6 border border-black/20` à direita.

- **Animação `shimmer-sweep`**: Adicionada `@keyframes shimmer-sweep` e a utility class `.animate-shimmer-sweep` ao `index.css` global, criando um efeito de varredura de luz suave sobre os placeholders do hero do carrossel para comunicar visualmente o estado de carregamento.

---

## 🖤 [v4.2.0] - The Clean & Precise Horizontal Feed Update

*Data: 29 de Maio de 2026*

### 📰 Refatoração e Simplificação do Feed (Últimas Notícias)
- **Design Vintage Horizontal Limpo**: Redesenhamos a variante `vintage` de cards horizontais (`PostCard.tsx`) para eliminar elementos poluídos como o código de barras, o laser scanner móvel (`scanner-beam`) e textos técnicos redundantes (`BG-SYS-v4.1` / `S-XX`), garantindo um visual editorial premium e focado.
- **Resolução de Overlaps de Texto**: 
  - Resolvido o encolhimento de flexbox adicionando a classe `shrink-0` a todos os filhos diretos do bloco de conteúdo (cabeçalho, título `h3`, resumo `p` e rodapé), impedindo que as caixas de texto colapsassem e gerassem sobreposição de letras.
  - Fixado o resumo com a classe de clamp `line-clamp-2` direta, solucionando problemas de mesclagem do Tailwind CSS no desktop.
  - Removida a diretiva `flex-grow` do título `h3` para evitar desalinhamento interno de cartões com títulos curtos.
- **Aumento Proporcional de Altura**: Aumentamos a altura física dos cartões horizontais para acomodar o texto confortavelmente sem transbordamento:
  - Mobile: `h-[150px]` (antes `140px`)
  - Tablet: `h-[165px]` (antes `150px`)
  - Desktop: `h-[180px]` (antes `160px`)
- **Ajuste de Gaps e Paddings**: Otimizado o padding do bloco de texto para `p-3 sm:py-3 sm:px-4` e reduzidas as margens verticais internas (`mb-1` no cabeçalho e título; `mb-2` no resumo), ganhando mais espaço livre para leitura.

### 🖼️ Layout de Grade & Skeletons
- **Home em 2 Colunas no Desktop**: Reduzimos o grid de Últimas Notícias na `HomePage.tsx` de 3 colunas (`lg:grid-cols-3`) para 2 colunas (`lg:grid-cols-2`). Isso assegura cerca de 500px de largura para cada card horizontal no desktop, eliminando o esmagamento de texto.
- **Skeletons Vintage Coesos**: Adicionado suporte para `variant="vintage"` no `PostSkeleton.tsx`, aplicando as novas dimensões de altura e paddings idênticos aos cards reais para zerar layout shifts no carregamento.
- **Visual Padrão no Arquivo**: Revertido o card da `ArchivePage.tsx` para `variant="default"` (vertical), que se ajusta perfeitamente ao grid de 3 colunas da página sem espremer o conteúdo.

---

## 🖤 [v4.1.0] - The Retro-Modern Visual Decks Update
*Data: 28 de Maio de 2026*

### 🎨 Redesign Visual da Homepage (RetroCafé, Dossiês e Reviews)
- **Visual Banca de Revistas (RetroCafé)**: Redesenhada a seção para exibir matérias como capas de revistas físicas dos anos 90, com logotipo estilizado, preço em Cruzeiros, código de barras e elevação 3D.
- **Visual Arquivo Confidencial (Dossiês)**: Transformada a seção em pastas manila confidenciais com clipes metálicos, abas salientes numeradas, carimbo "CLASSIFICADO", fotos Polaroid ampliadas em proporção 4:3 e scanner laser azul interativo.
- **Visual Decks Retro-Modernos com Fade (Reviews)**: Redesenhada a coluna de análises com cards horizontais divididos onde a arte do jogo (com 65% de largura) se integra ao texto na esquerda (50% de largura) através de um degradê de máscara (fade) suave e contínuo de 70% de largura. A imagem possui textura de scanlines limitada à sua área para preservar a leitura.
- **Notas Metálicas Douradas em 3D**: O selo de nota das reviews foi promovido a um badge com degradê metálico brilhante (dourado/gold) e contornos neobrutalistas marcantes que escala, brilha e se eleva no hover.
- **Feedback Sonoro Retrô**: Adicionada síntese de som nativa via Web Audio API, com cliques 8-bit suaves ao interagir com RetroCafé/Dossiês e bipe digital de menu clássico nas reviews.
- **Otimização de Espaço e Layout**: Cabeçalhos alinhados com tipografia reduzida para maximizar o crescimento dos cards e preenchimento de espaços vazios com linhas conectoras pontilhadas e status do sistema retro-gaming.

---

## 🖤 [v4.0.0] - The Neo-Brutalist Classic Edition
*Data: 28 de Maio de 2026*

### 🎨 Redesign Completo: Neo-Brutalismo Clássico
- **Cantos 90°**: Remoção de todos os arredondamentos do portal. Todos os cards, modais, inputs, botões, avatares e painéis agora usam `rounded-none`, entregando uma estética de painel de HQ clássico.
- **Fundos Sólidos**: Transição de efeitos glassmorphic translúcidos para fundos opacos e sólidos (`bg-[#1f1d35]` no modo escuro e `bg-white` no claro), garantindo contraste máximo e identidade visual forte.
- **Bordas Pretas & Sombras Offset 2D**: Todos os cards usam `border-2 border-black` com sombras brutalistas offset (`shadow-[4px_4px_0px_rgba(0,0,0,1)]`). Hover unificado que eleva a sombra para 8px e muda a cor para roxo vibrante (`rgba(168,85,247,1)`).
- **Cor de Fundo Principal**: Fundo global definido como `#111827` (Tailwind gray-900) no modo escuro, com gradiente radial de iluminação superior em roxo que dissipa suavemente para a base sem escurecer ao rolar.

### 🃏 Restauração do Layout Clássico dos Cards
- **PostCard**: Imagem de altura fixa (`h-56 md:h-64`) com borda inferior preta grossa, título grande (`text-lg md:text-xl`), sinopse maior (`text-sm md:text-base`) e scanlines CRT com opacidade aprimorada no hover.
- **Rodapé do Card**: Data e tempo de leitura empilhados à esquerda; HUD com curtidas, favoritos e autenticação à direita — fiel ao layout editorial clássico.
- **Badges Unificados**: `CategoryBadge` sempre roxo (`bg-purple-600 text-white`) em todo o portal, alinhando-se à identidade visual clássica.

### 🖼️ Imagem de Fundo Dinâmica com Fade (Mais Lidos)
- **Hover Interativo**: Ao passar o mouse sobre qualquer item da lista desktop "Mais Lidos", a imagem do post correspondente aparece no fundo do painel, ocupando a metade direita da caixa.
- **Fade Gradiente**: Máscara CSS `linear-gradient(to right, transparent, black)` aplicada via `mask-image` e `-webkit-mask-image` cria uma transição perfeita de transparente para sólido da esquerda para a direita.
- **Animação Suave**: Keyframe `@keyframes bgFadeIn` e classe `.animate-bg-fade` no `index.css` para a transição de opacidade ao trocar de post.
- **Fallback de Mouse-Leave**: Ao tirar o mouse do painel, o foco retorna para o primeiro item da lista.

### 📰 Cabeçalhos de Seção Restaurados
- Todos os cabeçalhos de seção da `HomePage` seguem o padrão clássico: barra indicadora lateral `w-1.5 self-stretch`, título `text-2xl md:text-3xl font-black uppercase`, subtítulo `text-[9px] tracking-[0.3em]`.
- Botões de atalho "Ver mais" removidos de RetroCafé, Dossiês e Reviews para cabeçalhos limpos e focados.

### 📱 Responsividade Aprimorada para Tablets
- Media query de mobile corrigida de `max-width: 768px` para `max-width: 767px`, garantindo que tablets de 8" em portrait (768px) utilizem o layout editorial completo de desktop: colunas, imagens flutuadas e grid 2 colunas.

---

## 🎨 [v3.10.1] - The Modern Visual & Robust Views Update
*Data: 27 de Maio de 2026*

### 🎨 Modernização Visual & Micro-animações
- **Feed Clean & Moderno**: Removidos os números de ordenação sequencial nos cards de notícias da Home para um visual mais limpo e editorial.
- **Indicadores de Categoria Estilizados**: Implementados novos indicadores de categoria estilo "dots" (bolinhas com a cor correspondente de cada categoria) na barra lateral.
- **Números de Destaque Flutuantes**: O ranking de posts mais lidos agora exibe números estilizados em marca d'água grande de fundo que se iluminam dinamicamente no hover.
- **Auras de Brilho no Modo Escuro**: Adicionados auras de brilho neon (ambient glows) no background do portal no modo escuro, com proteção estrita de overflow-hidden para evitar rolagem horizontal indesejada no mobile.
- **Alternador de Tema Animado**: O botão de sol/lua agora possui micro-animações dinâmicas de rotação e pulo (scale bounce) no clique.
- **Autoplay Carousel Progress**: Adicionada uma barra de progresso suave no topo do carrossel indicando o tempo restante de exibição de cada slide em autoplay.
- **Remoção de Chanfros**: Removidos os chanfros (cartridge grooves) das bordas dos cards da HomePage para um design mais limpo e premium.

### 👁️ Novo Mecanismo de Visualizações (Views Bug Fix)
- **Views Atômicas para Todos (Guests & Offline)**: Resolvido o erro de permissão que impedia a contagem de visualizações de usuários não logados (guests) ou no carregamento offline.
- **Prevenção contra Bloat de Documento**: Eliminada a antiga array `viewedBy` que armazenava IDs de visualizadores e corria o risco de estourar o limite de 1MB por post no Firestore.
- **Duplicidade Controlada via LocalStorage**: Substituição por verificação local no cliente usando `localStorage` (`retro_viewed_posts`), permitindo incrementos de visualização leves e atômicos (`increment(1)`) direto no Firestore.
- **Guia de Regras Firestore**: Atualizado o `FIREBASE_GUIDE.md` com a regra de segurança recomendada que permite atualizações anônimas somente se o único campo alterado for `views`.

### 📱 Ajustes Responsivos & Mobile
- **Fix de Transbordo Mobile**: Envelopamento dos glows absolutos em containers com `overflow-hidden`, prevenindo o vazamento do layout horizontal e impedindo que a tela seja movida para o lado revelando fundos brancos.

---

## 🖼️ [v3.10.0] - The Premium Media & Admin UX Update
*Data: 26 de Maio de 2026*

### 🖼️ Editor de Imagens Premium (BlockEditor + Cropper)
- **Proporções Livres**: Adicionados seletores de aspecto de imagem no editor de blocos — `Original`, `1:1`, `16:9` e `4:5`. A escolha de proporção é propagada até o `ImageCropper` e persiste no Markdown com a tag `{#aspect-X}`.
- **Estilos de Moldura Retrô**: Implementados 4 estilos de frame editáveis por bloco no `BlockEditor.tsx`, serializados como `{#frame-Y}` no Markdown: `normal` (card retrô com borda roxa), `crt` (moldura de TV com scanlines e glow), `sticker` (borda branca com sombra sólida), e `none` (imagem limpa, sem frame).
- **Scanlines Toggle**: Adicionado toggle de pixel-art para ativar/desativar o efeito de scanlines CRT em blocos de imagem individualmente, controlado pela flag `{#scanlines-false}` no Markdown.
- **Re-Crop In-Context**: Adicionado botão **Recortar** (`Crop` icon) no overlay de imagens já enviadas dentro de `ImageUpload.tsx`, permitindo ao editor cortar, reencadrar e atualizar a imagem diretamente sem novo upload.
- **Fix de Segunda Abertura do Cropper**: Corrigido o bug crítico que impedia a confirmação do corte na segunda abertura do `ImageCropper` (CORS caching de canvas). A solução injeta um parâmetro `?nocache=` baseado em timestamp nas URLs de imagem remotas ao carregar na tela de crop.
- **Aspect Ratio Preview no Editor**: O placeholder/preview de imagem no `ImageUpload.tsx` agora aplica dinamicamente as classes de aspecto CSS (`aspect-square`, `aspect-video`, `aspect-[4/5]`), sincronizando visualmente o editor com a proporção selecionada.
- **Propagação de Aspecto do Cropper**: O aspecto confirmado no `ImageCropper` é propagado de volta ao `BlockEditor` via `onAspectConfirmed`, atualizando automaticamente a configuração do bloco.

### 📰 Article Renderer Premium (Lightbox & Frames)
- **Zoom Lightbox**: Implementado lightbox full-screen autocontido dentro de `ArticleRenderer.tsx`. Clicar em qualquer imagem padrão abre o overlay com a imagem em resolução original, backdropblur, borda neon, scanlines e suporte a fechar via tecla ESC ou clique externo.
- **Renderização de Molduras**: `ArticleImage` agora interpreta as tags `{#frame-...}` do Markdown para aplicar estilos CSS distintos: card retrô normal, moldura CRT com bisel cinza, sombra inset e glow roxo, borda de adesivo branca ou sem moldura.
- **Escala Inteligente por Proporção**: Imagens `original` com aspecto landscape (`>= 1.2`) crescem até a largura total da coluna com altura máxima capped. Imagens portrait ou quadradas são limitadas a `320px` / `384px` para evitar blocos verticais gigantes no conteúdo.
- **Responsividade Aprimorada**: Limites de altura e largura dinâmicos para imagens centralizadas em ambos desktop e mobile, mantendo o layout do artigo equilibrado.

### 🔧 CORS Proxy para Corte de Imagens Remotas
- **Proxy Local (Vite)**: Configurado proxy `/firebase-storage` no `vite.config.js` mapeando para `https://firebasestorage.googleapis.com`, permitindo canvas tainted-free draw de imagens de produção durante o desenvolvimento.
- **Proxy de Produção (Vercel)**: Adicionada rewrite correspondente no `vercel.json` para que o mesmo proxy funcione em produção sem depender de CORS do Firebase Storage diretamente.
- **`getProxiedUrl` Helper**: Nova função em `cropUtils.ts` que reescreve URLs do Firebase Storage para o caminho proxy same-origin `/firebase-storage`, resolvendo bloqueios de `Access-Control-Allow-Origin` no canvas.

### 🛠️ Painel Admin — Remoção de Ferramentas & Filtros Avançados
- **Remoção da Aba Ferramentas**: Aba "Ferramentas" completamente removida do painel administrativo — componentes, estados, hooks e referências. Arquivo `TabTools.tsx` deletado.
- **Filtro de Carrossel**: Adicionado filtro de **Destaques (Carrossel)** ao lado do filtro de categoria na listagem de posts (`TabPosts.tsx`), permitindo filtrar diretamente os posts em destaque.
- **Custom Select Dropdowns**: Os seletores nativos `<select>` de Categoria e Carrossel foram substituídos por dropdowns customizados com Framer Motion (`AnimatePresence`), fechamento automático ao clicar fora, overlay de scanlines, bordas neon e animações suaves.

### 🎨 Scrollbar Retrô nos Dropdowns
- **`.retro-scrollbar` (CSS)**: Criada classe utilitária global em `index.css` com largura de 8px, thumb arredondado em estilo pill (`border-radius: 9999px`) nas cores roxa/cinza por tema, combinando com os dropdowns `rounded-xl`.
- **Fix de Overflow Arredondado**: `overflow-hidden` aplicado no container externo do dropdown (`motion.div`) para garantir que a scrollbar nunca vaze fora das bordas curvas.

### 🌐 Proteção de Marca contra Tradução
- **`translate="no"` + `notranslate`**: Adicionados atributos HTML e classe CSS de proteção em todos os elementos que exibem o nome "BeginsProject" — Navbar (header logo), Footer (mobile e desktop), AboutPage (bio e citação) e PrivacyPolicyPage — evitando que motores de tradução (Google Translate, etc.) alterem o nome da marca.

### 🎛️ Alinhamento do Header do Painel Admin
- **Centralização Vertical**: O botão de voltar (←), o título "Painel de Controle" e o botão "+ Nova Publicação" foram alinhados verticalmente ao centro de forma consistente.
- **Badge Flutuante**: O badge "Admin Mode Active" foi refatorado para posicionamento `absolute`, flutuando acima do título sem deslocar o alinhamento dos outros elementos.

### 📱 Mobile Preview Fixes (PostEditorPage & PostDetailPage)
- **Badge de Preview Responsivo**: Reduzido font-size e padding do badge "Modo de Pré-Visualização" em mobile para evitar sobreposição com o conteúdo.
- **Padding Top no Preview Container**: Aumentado o padding superior em mobile de `p-4` para `pt-14` para dar espaço ao badge flutuante.
- **Botão de Voltar Desabilitado em Preview**: O botão "Voltar à Seleção" fica com opacidade reduzida e cursor `not-allowed` dentro do preview mode, prevenindo perda acidental de progresso não salvo.

---

## ⚡ [v3.9.4] - Service Worker & Image Load Optimization Update
*Data: 22 de Maio de 2026*

### ⚡ Performance & Cache Optimization (PWA & Service Worker)
- **Automatic Blank Screen Recovery**: Adicionado um script de auto-recuperação inline no `<head>` do `index.html` que captura falhas de carregamento de recursos críticos (como assets do Vite retornando 404 durante novos deploys) e recarrega a página automaticamente (com limite de recarregamento a cada 10 segundos para evitar loops infinitos).
- **Network-First para Navegação (HTML)**: Alterada a estratégia de cache do Service Worker para o `/` e `index.html` de *Stale-While-Revalidate* para *Network-First*. Isso garante que usuários online sempre recebam a última versão do HTML apontando para os assets corretos, eliminando por completo o bug da "tela branca" após novos deploys.
- **Cache-First para Assets Estáticos**: Otimizada a estratégia de cache de arquivos na pasta `/assets/` para usar *Cache-First*, já que os arquivos compilados pelo Vite contêm hashes únicos e são imutáveis.
- **Cache de Imagens do Firebase Storage**: Configurado cache dedicado e persistente para o domínio `firebasestorage.googleapis.com` com estratégia *Cache-First*. Isso traz carregamento instantâneo de imagens de posts após a primeira visita e suporte offline para mídia do blog, mantendo o cache intacto mesmo após atualizações do app.

### 🖼️ Media & Upload Optimizations
- **Conversão Automática para WebP no Upload**: O `uploadService.ts` agora força a compressão de qualquer imagem enviada para o formato WebP (`fileType: 'image/webp'`) e altera consistentemente a extensão do arquivo para `.webp`. Isso reduz o consumo de banda, economiza espaço no Firebase Storage e acelera o carregamento das páginas.

---

## 🎨 [v3.9.3] - Post Hero Score Badge Styling Fix
*Data: 22 de Maio de 2026*

### 🎨 Visual & Spacing Refinements
- **Square Score Badge in Post Hero**: Replaced the custom rounded score `div` in the article header hero (`PostHero.tsx`) with the official `ScoreBadge` component. This removes the rounded corners, rendering a straight-edged (rounded-none), neo-brutalist rating badge that perfectly matches the styling of `CategoryBadge`.

---

## 🎨 [v3.9.2] - Carousel Score Alignment Polish
*Data: 22 de Maio de 2026*

### 🎨 Visual & Spacing Refinements
- **Carousel Badge Pairing**: Repositioned the review score badge (`ScoreBadge`) in the main carousel (`Carousel.tsx`) to sit directly next to the category badge (`CategoryBadge`) above the post title on both mobile and desktop. This aligns the layout with modern editorial styles, solves stats row clutter, and ensures perfect symmetry for ratings.

---

## 🎨 [v3.9.1] - UI Harmonics & Mobile Layout Polish
*Data: 22 de Maio de 2026*

### 🎨 Visual & Spacing Refinements (Post Details & Hero)
- **Author-Style Post Verdict**: Redesigned the post verdict review box (`PostVerdict.tsx`) to match the exact visual style of the "Escrito por" box (Author Box). The score rating is now contained in a responsive tilted card (`-rotate-2 group-hover:rotate-0`) with thick borders, a solid neo-brutalist shadow (`shadow-[4px_4px_0px_rgba(0,0,0,1)]`), and a `/10` tag matching the author level badge.
- **Header Clean-up**: Removed the unnecessary "Redação Begins" secondary title and star icon from the verdict card to offer a cleaner quote aesthetic.
- **Text Readability (Rivers of Space Defused)**: Removed `text-align: justify` and auto-hyphenation from article paragraphs globally (`index.css`), replacing them with standard left alignment. This completely eliminates empty justification gaps ("buracos") and awkward word breaks (like "es-condia") when text wraps next to floated elements.
- **Unconstrained Floated Images**: Updated image wrapping inside `ArticleRenderer.tsx` to prevent stretch/aspect-ratio distortions of floated images, changing the container from flex-layout to standard block layout on floated layouts.
- **Proportional Image Scaling (No Cropping)**: Removed `object-cover` and height constraints from all article content images (both floated and full-width) and changed container elements to a standard block layout. Content images now behave exactly like major media sites—scaling proportionally with auto-height to preserve the entire gameplay screenshot or graphic details (e.g. HUD elements) without stretching, distortion, or cropping.
- **Carousel Typography & Stats Alignment**: Expanded the text content width in the main carousel (`Carousel.tsx`) to 90% on mobile to allow titles to flow naturally in fewer lines. Restructured the stats row into a single flat flex row, centering the likes, read time, and score badge. Balanced the score badge's visual alignment by applying a subtle offset (`translate-y-[-1px]`) to compensate for its thick bottom shadow and added a permanent dot divider between stats.
- **Mobile Hero Tuning**: Restructured the mobile hero layout (`PostHero.tsx`) to place the category and score badges side-by-side in a single row instead of stacking them, freeing up vertical space. Adjusted title line-height to `leading-snug` and tracking to `tracking-tight` on mobile to prevent overlapping and text squishing.

---

## ⚡ [v3.9.0] - The Zero-Waste Query Engine & Fuzzy Search Update
*Data: 20 de Maio de 2026*

### ⚡ Otimização do Mecanismo de Consulta (Firestore)
- **Consultas Cirúrgicas e Limitadas**: Refatoração das funções `getMostViewedPosts`, `getTopReviews` e `getPostsByCategory` no [postService.ts](file:///c:/Users/Lucas Vieira/Documents/Projetos/lucas-begins/src/services/postService.ts) para realizar consultas diretas no Firestore com cláusulas `orderBy`, `where` e `limit`, reduzindo drasticamente o consumo de banda de rede e as cotas de leitura de documentos no banco.

### 🔍 Busca Aproximada com Fuse.js
- **Tolerância a Erros e Acentuação**: Integração da biblioteca `fuse.js` no hook [usePostsFilter.ts](file:///c:/Users/Lucas Vieira/Documents/Projetos/lucas-begins/src/hooks/usePostsFilter.ts) para habilitar pesquisa inteligente. O motor agora faz correspondência difusa aproximada com base em pesos nos campos `title` (peso 0.7), `excerpt` (peso 0.3), `category` (peso 0.2) e `tags` (peso 0.2), lidando de forma transparente com erros de digitação (ex: "zleda" -> "zelda") e ausência de acentos (ex: "dossie" -> "dossiê").

---

## 🌎 [v3.8.0] - The Premium Translation System & Mobile UX Update
*Data: 18 de Maio de 2026*

### 🌎 Dynamic Page Translation Engine
- **Hybrid Context Provider (`TranslationContext.tsx`)**: Injeção e encapsulamento dinâmico e assíncrono da API do Google Translate em segundo plano. Permite tradução em tempo real de toda a página (incluindo artigos do Firebase Markdown e comentários de leitores) sem travar a performance inicial do portal.
- **LocalStorage & Cookie Sync**: Sincronização automática das escolhas de idioma salvas no `localStorage` e nos cookies nativos `googtrans` (`/pt/en`, `/pt/es`, etc.) para garantir transições suaves entre rotas no React SPA sem perder a tradução ativa.
- **Resets e Overrides Estritos (`index.css`)**: Injeção de resets globais robustos com seletores curinga (`[class*="VIpgJd-ZVi9od"]` e `.skiptranslate`) para ocultar por completo as barras azuis nativas, tooltips, popups e o balão flutuante azul "G" do Google Translate, garantindo uma revista digital visualmente limpa.

### 🎮 Custom Language Selector Component (`LanguageSelector.tsx`)
- **Retro Gaming Badges**: Desenvolvimento de uma identidade visual premium inspirada em consoles de videogame antigos. Os idiomas são indicados por lindas tags com estilo de console (ex: `[PT]`, `[EN]`), contornando a limitação nativa do Windows que falha na renderização de emojis de bandeiras (substituindo-os por letras encavaladas como `BR PT`).
- **Pixel-Perfect Alignment**: O gatilho do dropdown no desktop utiliza um ícone vetorial de Globo (`Globe` de 18px) e compartilha das mesmas classes de padding, bordas e física de mola do Framer Motion (`AnimatePresence`) que o botão de troca de tema (Sol/Lua), mantendo a proporção geométrica da barra de ferramentas.
- **Recursive Translation Block (`notranslate`)**: Inclusão de atributos `className="notranslate" translate="no"` nos contêineres do seletor de idiomas para blindar as siglas de siglas traduzidas erroneamente pelo motor do Google (impedindo que `ja` vire "já/already" ou `de` vire "of").

### 📱 Mobile Drawer UX & Social Rhythm Optimization
- **Smart Mobile Layout Reordering (`MobileMenu.tsx`)**: Reorganização estrutural completa da gaveta lateral mobile para priorizar a descoberta de conteúdo. O menu expansível de **Categorias** foi movido do rodapé para o topo (logo abaixo do perfil do usuário), enquanto as páginas secundárias "Sobre Nós" e "Idioma" foram alocadas na base como utilitários secundários.
- **Consistent Social Order**: Reordenação global dos ícones sociais em todo o site (Navbar mobile, rodapé desktop, rodapé mobile e drawer lateral) para seguir estritamente a sequência de marca solicitada: **Instagram, Threads e depois o X (Twitter)**.

### 🔧 TypeScript & Integrity
- **Debug Page Build Fix (`DebugPage.tsx`)**: Correção do escapamento de string para a rota `{docId}` literal na visualização de rascunhos de posts, zerando quaisquer warnings ou erros no compilador de tipos do portal (`npx tsc --noEmit` completado com 0 erros).

---

## 💎 [v3.7.0] - The Zero-Waste Firestore Reads & Cursor Pagination Update
*Data: 17 de Maio de 2026*

### 🚀 Firestore Read Decoupling (getAllPosts Eradication)
- **Zero-Waste Free Quota Architecture**: Refatoração arquitetural profunda de toda a busca de dados do portal. A chamada global massiva de `useAllPosts()` (que baixava a base de dados inteira com todos os conteúdos ricos em Markdown a cada página ou carregamento do menu) foi eliminada e substituída por consultas cirúrgicas, indexadas e leves. Isso reduz as leituras do Firestore em até **95%**, garantindo que o portal seja extremamente escalável e permaneça seguro no nível gratuito para sempre.
- **Lazy Loaded Search in Navbar**: A busca global na Navbar agora é totalmente "lazy". O hook `useAllPosts` só dispara a busca na base do Firestore se o usuário focar, clicar ou digitar no campo de busca da Navbar.
- **Popular Recommendation Engine (Post Detail)**: Substituição de filtros em memória por uma busca indexada rápida de relacionados (`usePopularPosts(4)`) baseada no ranking de curtidas, otimizando em 90% a carga inicial da página de detalhes.
- **Section-Targeted Queries (Home Page)**: Refatoração de todos os painéis e carrosséis da Home Page. Agora, as seções de Destaques (`useFeaturedPosts`), Mais Vistos (`useMostViewedPosts`), Melhores Notas (`useTopReviews`) e Dossiês (`usePostsByCategory`) possuem consultas diretas e limitadas no banco de dados, poupando centenas de leituras a cada recarregamento.
- **Real Firestore Cursor Pagination (Archive Page)**: Implementação de paginação nativa baseada em cursores (`startAfter` e limites de carregamento). O feed de artigos completos agora utiliza rolagem por estágios retro-gaming com o botão estilizado **"INICIAR PRÓXIMA FASE (CARREGAR MAIS)"**, descartando a pesada paginação em memória e baixando estritamente 6 posts por clique.
- **Lightweight Profile Inventory (Dashboard)**: O QG do usuário (Dashboard) agora carrega o inventário de favoritos sob demanda (`usePostsByIds`) usando a query otimizada `where(documentId(), \"in\", favorites)`, além de obter o total de comentários instantaneamente através de uma Collection Group Query (`useUserCommentsCount`), sanando de vez o cálculo incorreto trazido pelo modelo de subcoleções.

---

## 💎 [v3.6.0] - The Social Threads & Emoji Shortcuts Update
*Data: 17 de Maio de 2026*

### 💬 Social Comment System (Likes & Nested Threads)
- **Comment Likes & Heart Reactions**: Usuários logados agora podem curtir e descurtir comentários individuais com botões animados de Coração (Heart), exibindo o contador de curtidas em tempo real.
- **Threaded Nested Replies**: Implementação de sistema de respostas encadeadas (threads) de nível único de profundidade. As respostas são renderizadas de forma recuada com linhas conectoras verticais pontilhadas retro, garantindo uma estética arcade limpa e legível.
- **Reply Likes & Moderation**: Adicionada capacidade de curtir respostas específicas e exclusão de respostas pelos respectivos autores ou administradores do portal.
- **Emoji Quick Shortcuts Dock**: Inserção de uma barra horizontal de atalhos rápidos de emojis retro-gaming (👾, 🎮, 🏆, 🔥, etc.) tanto no campo principal de comentário quanto no formulário inline de resposta, permitindo inserção rápida em um único toque (ideal para celulares).
- **Social Gamification Integration**: Sincronização automática com o sistema de XP. Responder a um comentário concede **+10 XP** ao usuário, e curtir posts/respostas concede **+2 XP**, impulsionando a participação ativa da comunidade.
- **Atualizações Otimistas nos Likes de Comentários e Respostas (Optimistic Updates)**: Implementação do recurso `onMutate` do TanStack Query nas ações de curtir comentários (`useLikeCommentMutation`) e respostas (`useLikeReplyMutation`). Agora a interface responde instantaneamente (0ms de atraso) pintando o coração de rosa neon e incrementando o contador no momento exato do clique. Caso a conexão falhe, o cache é automaticamente revertido para o estado anterior (rollback) e um toast amigável avisa o usuário. Isso traz uma sensação extrema de fluidez e reatividade local ao portal.
- **Bomba-Relógio de 1MB Defusada (Firestore Subcollections)**: Refatoração completa da persistência de comentários. Em vez de salvar comentários em uma array aninhada dentro do documento do post (que correria o risco de estourar o limite de 1MB por documento do Firestore), as interações agora são armazenadas de forma totalmente escalável em uma subcoleção isolada `/posts/{postId}/comments/{commentId}`. Isso reduz consideravelmente o tamanho dos posts retornados nas listagens gerais, otimiza o consumo de banda de rede e torna o portal infinitamente escalável.

---

## 💎 [v3.5.0] - The Dynamic Post Visibility Update
*Data: 17 de Maio de 2026*

### ⚙️ Post Visibility Control
- **Hide / Show Toggle**: Adicionada funcionalidade de ocultar/mostrar artigos diretamente no painel administrativo. Administradores agora contam com um botão visual de alternância (olho/olho riscado) na coluna de ações da listagem de posts.
- **Visual Status Badges**: Introdução de um selo de status "Oculto" neo-brutalista e esmaecimento de linha para artigos ocultos/rascunhos na tabela administrativa, garantindo identificação instantânea do status do artigo.
- **Direct Access Guard**: Bloqueio completo contra visualização direta de posts ocultos. Leitores comuns que tentarem acessar a URL/slug de um post oculto serão apresentados com a tela de erro "Post não encontrado", blindando o conteúdo em desenvolvimento.
- **Clean Filters Integration**: Harmonização em todo o site (favoritos do dashboard, carrosséis, listagens e busca) para ignorar automaticamente posts ocultos, oferecendo uma experiência limpa para o leitor.

---

## 💎 [v3.4.0] - The Editorial Flow & Data Integrity Update
*Data: 16 de Maio de 2026*

### 🛠️ Block Editor: Logic & Persistence
- **Component Integrity**: Refatoração do parser Markdown para respeitar a individualidade de blocos de texto consecutivos. Agora, componentes de texto separados no editor permanecem independentes após o preview.
- **Enhanced Info Box**: Implementação de suporte a **títulos customizados** em boxes de informação. O cabeçalho preto agora é editável e permite personalização total por bloco.
- **Author Citations**: Pullquotes agora suportam **citação de autores**. Foi adicionado um campo dedicado no editor que renderiza o nome do autor com alinhamento à direita e estética de revista editorial.
- **Multi-line Consistency**: Estabilização do suporte a múltiplas linhas e listas (bullet points) dentro de boxes de informação e pullquotes, garantindo que a formatação não se perca ao alternar modos de edição.

### 🎨 Editorial Aesthetics & Alignment
- **Professional Justification**: Implementação de `text-align: justify` e hifenização automática em todos os parágrafos de artigos, eliminando bordas irregulares e otimizando o fluxo visual ao redor de imagens flutuantes.
- **Smart Float Alignment**: Refinamento das margens de imagens flutuantes (`margin-top`) para um encaixe perfeito com a primeira linha do parágrafo adjacente.
- **Visual Depth**: Adição de sombras sólidas e bordas de alto contraste nos títulos de boxes de informação, reforçando a estética de recordatórios de HQ.

### 🔗 Robust Link Handling
- **Double-Link Prevention**: Implementação de estratégia de tokenização para processamento de links, eliminando conflitos entre links manuais Markdown e auto-links de URLs puras.
- **Intelligent Truncation**: Sistema de encurtamento de links que preserva o hostname para limpeza visual, mantendo a URL completa funcional no atributo `href`.

---


## 💎 [v3.2.0] - The Cockpit UX & Responsive Discovery
*Data: 15 de Maio de 2026*

### 🛸 Navbar: Cockpit "Command Center"
- **Unified Cockpit Design**: Redesign radical da barra de navegação para uma estética de "Centro de Comando". Centralização da barra de busca como peça de destaque, equilibrada por blocos de branding à esquerda e utilitários à direita.
- **Improved Spatial Hierarchy**: Introdução de divisores verticais sutis para separar zonas de Branding, Navegação e Ferramentas, eliminando a poluição visual e melhorando o rastreio ocular.
- **Utility Slot Upgrades**: Transformação dos ícones sociais em "Action Slots" com molduras quadradas neo-brutalistas, cores de marca permanentes e efeitos de brilho (glow) dinâmicos.
- **UX Refinements**: Adição de scanlines decorativas no campo de busca e otmigação do contraste dos placeholders para legibilidade absoluta em todos os temas.

### 📱 Mobile Responsive Mastery
- **Horizontal Discovery Modules**: Re-engenharia das seções de "Reviews" e "Dossiês" para smartphones. Agora funcionam como módulos de rolagem horizontal com *snap-scrolling*, permitindo navegação fluida sem estender excessivamente o feed vertical.
- **Smart Mobile Top Bar**: Fixação da lógica de visibilidade mobile. Apenas Logo, Busca e Menu Hambúrguer permanecem visíveis, com todas as outras ferramentas integradas de forma limpa dentro do menu lateral.
- **Balanced Alignment**: Implementação de `justify-between` global para garantir que elementos mobile fiquem perfeitamente ancorados nos cantos, eliminando deslocamentos visuais.

### 🛠️ Estabilidade & Sintaxe
- **JSX Architecture Fix**: Correção de aninhamentos complexos de `div` e `AnimatePresence` que causavam quebras no layout mobile durante a transição para o novo design centralizado.
- **Version Bump**: Atualização global para v3.2.0, focada em design de elite e acessibilidade mobile.

---

## 🧩 [v3.1.0] - The Block Master & Drag Update
*Data: 14 de Maio de 2026*

### 🧱 Editor de Blocos (Block Editor)
- **Drag-and-Drop Reordering**: Implementação de sistema de arraste e solte (`framer-motion`) para reordenação fluida de blocos de conteúdo, facilitando a montagem da estrutura do post.
- **Floating Toolbar**: Substituição dos controles estáticos por uma barra de ferramentas flutuante no topo de cada bloco, contendo ações de movimentação e exclusão rápida.
- **Enhanced Safety**: Adição de divisor visual no botão de exclusão para prevenir cliques acidentais e remoção do conflito visual com seletores de imagem.
- **Unified Controls**: Centralização da lógica de blocos para garantir que capas e imagens de conteúdo sigam o mesmo padrão de recorte (16:9).

### 🖼️ Mídia & Upload
- **Global Image Stability**: Correção de bug crítico que disparava salvamento precoce do post durante o recorte de fotos. Agora todos os botões de modal são protegidos (`type="button"`).
- **Aspect Ratio Sync**: Padronização de todas as imagens do corpo do texto para a proporção **16:9**, espelhando a estética das imagens de capa.

### ⚙️ UX & Navegação
- **Bottom Preview Toggle**: Adição de botões secundários de "Editar/Preview" no rodapé da página de edição e pré-visualização, otimizando o workflow em matérias extensas.
- **Smooth Navigation**: Implementação de scroll automático para o topo ao trocar de abas no rodapé, garantindo uma revisão sem interrupções.

### 🛠️ Manutenção
- **Version Bump**: Atualização global para v3.1.0, focada em produtividade e estabilidade do CMS.

---

## ⚖️ [v3.0.1] - The Legal & SEO Update
*Data: 13 de Maio de 2026*

### ✨ Legal & Privacidade
- **Política de Privacidade**: Criação da página oficial de privacidade (`/privacy`) abordando uso de Cookies (Google AdSense), armazenamento do Firebase Auth e LGPD.
- **Cookie Consent Banner**: Implementação de um banner global, animado com framer-motion e design Neo-Brutalista, persistindo a aprovação do usuário no `localStorage`.
- **Login Disclaimer**: Adição do termo de consentimento e link direto no Modal de Login para blindar o site juridicamente.

### 🌐 SEO & Indexação
- **Sitemap & Robots**: Atualização do `robots.txt` bloqueando rotas administrativas (`/admin`, `/editor`, `/dashboard`) e correção do `sitemap.xml` para apontar para as rotas corretas do React.

---

## 🎨 [v3.0.0] - The Ultimate UI Polish & Dynamic Navigation
*Data: 13 de Maio de 2026*

### ✨ UI/UX: Refinamento Minimalista
- **Slim Footer Bar**: Redesign radical do rodapé para uma estética ultra-slim e minimalista, reduzindo a altura e removendo poluição visual para um fechamento de página mais elegante.
- **Light Mode Accessibility**: Grande revisão de contraste no Modo Claro. Subtítulos agora usam `slate-700` para melhor leitura, metadados tiveram opacidade aumentada e cabeçalhos dinâmicos corrigidos para evitar invisibilidade em fundos claros.
- **Search Visibility**: Otimização completa dos campos de busca com placeholders e ícones de alto contraste, garantindo que a funcionalidade seja imediatamente legível no modo claro.
- **Social Icon Overhaul**: Transição de efeitos de hover estáticos para dinâmicos (Purple/Pink) que se adaptam ao tema e fornecem feedback visual premium.

### ⚙️ Navegação Inteligente
- **Dynamic Category Menu**: Implementação de lógica de filtragem em tempo real no Navbar. Categorias vazias (sem posts publicados) são ocultadas automaticamente, garantindo que o usuário nunca encontre seções sem conteúdo.
- **Refined Section Labels**: Remoção de efeitos de "glow" (brilho) em textos sobre fundos claros para garantir nitidez absoluta em telas de alta resolução.

### 🛠️ Documentação & Firebase
- **Firebase Universal Guide**: Criação de um guia mestre em Markdown para facilitar a replicação da infraestrutura de backend em outros projetos.
- **Version Jump**: Atualização global para v3.0.0, marcando o amadurecimento final da interface do portal.

---

## 💎 [v2.7.0] - The Seamless Glass Update
*Data: 12 de Maio de 2026*

### ✨ Redesign: Seamless Glass Navbar
- **Glassmorphism Overhaul**: Transição do cabeçalho rígido para uma estética "Seamless Glass" (vidro contínuo), utilizando transparências suaves (`bg-white/10`) e desfoque de fundo (`backdrop-blur`) para um visual ultra-premium e leve.
- **Integrated Control Dock**: Substituição dos balões e recipientes monolíticos por um sistema de "Nodos Flutuantes". Agora os controles de busca, redes sociais e menu de usuário integram-se de forma fluida à barra, eliminando divisores físicos (pipes) e bordas excessivas.
- **Readability & Typography**: Implementação de tipografia extra-bold (`font-black`) em todos os elementos de navegação para garantir acessibilidade e clareza, mantendo a identidade visual forte do projeto.
- **Glass Login Button**: Redesign completo do botão de Login, abandonando o estilo Neo-Brutalista pesado por um botão de vidro roxo translúcido que se alinha perfeitamente ao novo ritmo horizontal.

### 🔍 UX & Busca
- **Hybrid Search Bar**: Refinamento do campo de busca com fundo de baixo contraste que ganha destaque apenas no foco, proporcionando uma navegação menos intrusiva.
- **Horizontal Rhythm**: Ajuste preciso de gaps e paddings para garantir que a interface se comporte de forma equilibrada tanto para usuários logados (Admin/User) quanto para visitantes.

---

## 📱 [v2.6.0] - The Social Connection Update
*Data: 12 de Maio de 2026*

### 🌐 Integração com Redes Sociais
- **Social Hub**: Implementação de links diretos para Instagram e Threads no cabeçalho (Navbar) e rodapé (Footer), facilitando o engajamento do público.
- **Mobile Connectivity**: Adição de atalhos de redes sociais no menu lateral mobile para acesso rápido em dispositivos móveis.
- **Unified Icons**: Padronização dos ícones de redes sociais com estética retro e efeitos de hover dinâmicos.

### 🛠️ Refinamento de Rodapé & Estabilidade
- **Multiplayer Hub Cleanup**: Limpeza da seção social do rodapé, removendo ícones não utilizados (YouTube/Twitch) e adicionando selo de "Em Breve" para o X (Twitter).
- **Merge Stability**: Resolução de conflitos críticos entre as branches de desenvolvimento, garantindo a integridade dos sistemas de Cropper e Compressão de imagens.
- **Version Bump**: Atualização global para v2.6.0.

---

## 🎨 [v2.5.0] - The Advanced Media & Interactivity Update
*Data: 11 de Maio de 2026*

### ✂️ Edição de Mídia & Cropper
- **Interactive Image Cropping**: Integração da biblioteca `react-easy-crop`. Agora é possível ajustar zoom e posição da imagem antes do upload.
- **Molduras Inteligentes**: Suporte a corte circular para avatares e proporção 16:9 para capas de posts, garantindo visual consistente em todo o site.
- **Smart Compression v2**: Otimização automática (max 1MB) integrada ao fluxo de edição, economizando storage e acelerando o carregamento.

### 📟 Nova Experiência 404
- **BIOS Terminal Interface**: Redesign interativo da página 404 que simula um boot de sistema retrô com logs animados e comandos (`GOTO_HOME`, `REBOOT`).
- **Estabilidade de Animação**: Correção de bugs de renderização no loop de logs para evitar crashes abruptos.

### 🌐 SEO & Social Media
- **Advanced Metadata**: Implementação de metadados dinâmicos para SEO e redes sociais (Twitter Cards / OpenGraph).
- **Social Preview**: Posts agora exibem capas, títulos e resumos profissionais ao serem compartilhados.

### 🛠️ Manutenção
- **Version Bump**: Atualização global para v2.5.0.

---

## ⚔️ [v2.5.1] - The RPG & Terminal Update
*Data: 11 de Maio de 2026*

### 💬 RPG Contact System
- **Dialogue Box UI**: Redesign completo da página de contato. Agora utiliza uma caixa de diálogo estilo SNES com avatar animado.
- **Typing Effect**: Implementação de efeito de digitação de texto para as mensagens do Game Master (Player 1).
- **Gamified Form**: Campos de entrada renomeados para "Nickname", "Canal de Comunicação" e "Detalhes da Missão".

### 🔍 Subtle & Premium Search
- **Polished UI**: Redesign da barra de busca para um visual mais sutil e integrado à Navbar.
- **Improved UX**: Feedback visual suave ao focar no campo e transições fluidas no mobile com efeito de desfoque (backdrop-blur).
- **Theme Sync**: Cores e bordas ajustadas para perfeita harmonia com os modos claro e escuro.

---
## 🖼️ [v2.4.0] - The Image Hosting & Performance Update
*Data: 10 de Maio de 2026*

### ☁️ Firebase Image Hosting
- **Native Storage Integration**: Implementação de sistema de upload direto para o Firebase Storage, eliminando a dependência de URLs externas.
- **Auto Image Compression**: Integração da biblioteca `browser-image-compression` para otimizar imagens automaticamente antes do envio, economizando até 80% de espaço sem perda perceptível de qualidade.

### ✨ Novo Media Selector (UX/UI)
- **Unified Component**: Novo componente `ImageUpload` unificado que gerencia tanto Upload de arquivos quanto Links de URL com sistema de abas.
- **Drag & Drop & Preview**: Suporte a arrastar-e-soltar e visualização em tamanho real (Full-size Preview) com overlay de ações.
- **Layout Compacto**: Redesign do formulário no `PostEditor` e `Dashboard`, reduzindo espaços vazios e unificando a estética Neo-Brutalista arredondada.

### 🛠️ Estabilidade & Correções
- **Preview Lock**: Bloqueio de interações (curtidas, comentários, links) durante o modo de visualização para evitar inconsistências de dados.
- **Dashboard Fixes**: Resolução de crash ao carregar o ID do perfil e remoção de campos redundantes.
- **CORS Config**: Adição do arquivo `cors.json` para configuração correta do bucket do Firebase.

---

## 🚀 [v2.3.1] - UX & Navigation Fix
*Data: 09 de Maio de 2026*

### ✨ Melhorias de Navegação
- **Native Link Support**: Refatoração dos componentes `PostCard` e `Carousel` utilizando o padrão **Stretched Link**. Isso permite que o card inteiro seja um link real (`<a>`), habilitando funcionalidades nativas como "Abrir em nova aba" (botão do meio) e "Ctrl + Clique".
- **Limpeza de Lógica**: Remoção de navegação imperativa via código (`navigate`) na Home, favorecendo o comportamento declarativo e mais performático do navegador.

### 🛠️ Correções e Ajustes
- **Import Fixes**: Correção de caminhos de importação quebrados após a refatoração modular.
- **Merge Resolution**: Consolidação da branch após resolução de conflitos, garantindo a integridade da arquitetura v2.3.0.


## 🧩 [v2.3.0] - Architecture & Stability Overhaul
*Data: 09 de Maio de 2026*

### 🏛️ Arquitetura Modular
- **Decomposition of "God Components"**: Refatoração completa da `AdminPage` e `PostDetailPage` (antes com 1000+ linhas) em componentes atômicos e especializados.
- **Hooks Dedicados**: Centralização da lógica de mensagens e ações administrativas no hook `useAdminActions`, garantindo que o contador de mensagens nunca mais fique zerado ao entrar no painel.
- **Tipagem Estrita**: Resolução de erros de TypeScript em mutações de Like, Favoritos e Comentários, garantindo maior segurança na comunicação com o Firebase.

### ✨ UI/UX & Navbar
- **Meu Painel (Admin)**: Substituição do ícone de engrenagem pelo botão textual "MEU PAINEL", seguindo a mesma identidade visual premium do "MEU QG".
- **Navegação Inteligente**: Ajuste na Navbar para limpar a busca automaticamente ao selecionar categorias, além de garantir o scroll para o topo da página.

### 🚀 Performance & Robustez
- **Fetch Local Estratégico**: Transição da Home para o hook `useAllPosts`, permitindo busca global e filtragem de categorias instantâneas na memória, sem dependência de índices complexos do Firebase para consultas paginadas.
- **Sorting Resiliente**: Nova lógica de ordenação no `PostService` que suporta diversos formatos de timestamp e datas, prevenindo falhas de exibição na Home.


## 🛰️ [v2.1.0] - The Stability & Sync Update
*Data: 08 de Maio de 2026*

### 🚀 Sincronização Multi-Dispositivo
- **Firestore Server-First**: Desativação da persistência local agressiva para garantir que favoritos e XP sejam sincronizados instantaneamente entre Celular, Tablet e Desktop.
- **Cache Inteligente**: Redução do `staleTime` para zero no perfil do usuário, forçando a re-sincronização da "verdade do banco" a cada nova sessão ou navegação.
- **Linkagem Inteligente**: Implementado sistema de busca por ID/Slug na `PostDetailPage`, garantindo que favoritos antigos sempre levem ao post correto.

### 🪙 Refinamento de Gamificação
- **XP Justo**: Correção na lógica de Favoritos e Likes; agora o bônus de XP só é concedido na primeira interação (adicionar), evitando abusos de XP infinito.
- **Persistência de Novos Jogadores**: Agora o sistema cria automaticamente o documento do usuário ao ganhar o primeiro XP, eliminando a perda de progresso em contas novas.
- **Ajuste de Regras**: Recompensa por Comentário atualizada para **+20 XP** conforme a nova tabela de economia de jogo.

---

## 🏆 [v2.0.0] - The Community & Maintenance Update
*Data: 08 de Maio de 2026*

### 🎮 Sistema de Gamificação (XP & Level)
- **Progressão em Tempo Real**: Implementação de sistema de XP e Níveis para todos os usuários logados.
- **Recompensas por Ação**: Ganhos de XP automatizados e persistentes: Ler Artigo (+10 XP), Curtir (+5 XP), Comentar (+20 XP), Favoritar (+15 XP).
- **Sincronização Persistente**: Correção de bug crítico de sobrescrita; agora o progresso de Nível e XP é protegido contra perdas durante atualizações de perfil.

### 🏠 QG do Usuário (Dashboard 2.0)
- **Acesso Universal**: Liberação da rota `/dashboard` para todos os usuários autenticados, transformando-a no centro de comando do leitor.
- **Customização de Perfil**: Nova funcionalidade de edição de perfil (Nome, AKA, Bio, Avatar) disponível para todos os jogadores diretamente no Dashboard.
- **Interface Viva**: Dashboard agora exibe estatísticas em tempo real e barra de progresso de XP sincronizada instantaneamente com o Firestore.

### 🛠️ Ferramentas de Manutenção (Admin)
- **Aba de Ferramentas**: Nova seção administrativa dedicada à integridade e saúde do banco de dados.
- **Normalização de Dados**: Implementação de ferramenta para resetar contadores de visualizações inflados, ajustando-os para valores realistas baseados no engajamento real.

### 🛡️ Estabilidade & Segurança
- **Migração TypeScript**: Refatoração completa da arquitetura do projeto de JavaScript para TypeScript, garantindo tipagem estática e maior robustez contra bugs de tempo de execução.
- **Anti-Loop de Visualizações**: Implementação de trava técnica via `useRef` para impedir o consumo excessivo de cota do Firebase por múltiplos incrementos de views.
- **Refatoração de Permissões**: Novo `ProtectedRoute` com lógica de hierarquia inteligente, permitindo que Admins acessem áreas de usuários sem restrições.
- **Correções de Código**: Resolução de erros de referência e importação no `AdminPage` e `PostDetailPage`.

---

## 🎡 [v1.10.0] - Curation System & Manual Featured
*Data: 07 de Maio de 2026*

### ⚙️ Funcionalidades & Curadoria
- **Destaques Manuais**: Implementação de sistema de curadoria que permite aos administradores selecionar manualmente até 5 artigos para o carrossel da home.
- **Regra dos 5**: Lógica de validação em tempo real que impede a seleção de mais de 5 itens, com feedback visual (toasts) e bloqueio de interface.
- **Persistência isFeatured**: Adição do campo `isFeatured` ao modelo de posts no Firestore para persistência do estado de destaque.

### ✨ UI/UX & Painel Admin
- **Ações Centralizadas**: Agrupamento do botão de alternância de destaque (estrela) dentro da coluna de ações na tabela administrativa para melhor fluxo de trabalho.
- **Feedback Visual**: Implementação de ícones de estrela com preenchimento dourado e brilho neon para identificar artigos destacados no painel.
- **Editor Integrado**: Adição de checkbox de destaque na página de edição de artigos, respeitando as mesmas regras de limite.

### 🐛 Estabilidade & Performance
- **Correção de Cache (HMR)**: Resolução de conflitos de estado global que causavam erros de referência após atualizações de código.
- **Otimização de Contexto**: Refatoração do `AppProvider` para garantir que o estado dos posts e ações de curadoria sejam propagados corretamente para toda a aplicação.

---

## 🛠️ [v1.9.0] - Refactoring & Code Stability
*Data: 07 de Maio de 2026*

### ⚙️ Arquitetura & Estabilidade
- **Centralização de Erros**: Criação do `errorService.js` para padronizar o tratamento de exceções e traduzir erros do Firebase para mensagens amigáveis ao usuário.
- **Remoção de Logs**: Limpeza global de `console.log`, `console.error` e `console.warn` em todo o projeto, garantindo um console 100% limpo em produção.
- **Refatoração de Skeletons**: Correção de erros de referência (`ReferenceError`) e otimização da sintaxe nos componentes de carregamento.

### ✨ UI/UX & Refinamento
- **RetroSeparator Universal**: Implementação de um componente de separador padronizado com estética Neo-Brutalista para garantir visibilidade em todos os temas.
- **Consistência Mobile**: Revisão e padronização dos textos no menu mobile (Drawer) para alinhamento com a versão Desktop.
- **Correção de Fontes (CORS)**: Ajuste nas políticas de carregamento do Google Fonts via `index.html` e Service Worker (`sw.js`).

---

## 🦴 [v1.8.0] - Universal Skeleton Overhaul
*Data: 07 de Maio de 2026*

### ✨ UI/UX & Carregamento
- **Skeletons de Próxima Geração**: Redesign completo de todos os estados de carregamento (Home, Sobre, Artigos) para espelhar perfeitamente o design Neo-Brutalista.
- **Layout Mirroring**: Skeletons agora utilizam bordas rígidas, sombras sólidas (`shadow-[4px_4px_0px_rgba(0,0,0,1)]`) e labels flutuantes para consistência visual absoluta.
- **Zero Layout Shift**: Introdução do `CarouselSkeleton` na página inicial, simulando o carrossel e a sidebar em tempo real durante o fetch de dados.
- **Otimização de Percepção**: Placeholders de texto e blocos de conteúdo agora respeitam milimetricamente as dimensões dos componentes renderizados.

---

## 🕹️ [v1.7.0] - Neo-Brutalist & Stability Overhaul
*Data: 06 de Maio de 2026*

### 🎨 Design & Estética Neo-Brutalista
- **"Hard Edge" UI**: Transição para uma estética de console retro com cantos 100% retos (`rounded-none`) em cards de posts e containers principais.
- **Solid Shadows**: Implementação de sombras pretas sólidas e espessas (`shadow-[4px_4px_0px_rgba(0,0,0,1)]`) para criar profundidade tátil.
- **Refinamento de Sidebar**: Redesign da barra lateral "Mais Acessados" com foco em legibilidade e harmonia visual.
- **Botões "Moda Antiga"**: Retorno das bordas arredondadas (`rounded-xl`) exclusivamente para elementos de controle (Navbar e botões de ação), garantindo conforto visual e tátil.

### ⚙️ Estabilidade & Core
- **Contador de Acessos Universal**: Otimização do sistema de views para contabilizar acessos de usuários anônimos e logados de forma transparente.
- **Login Padronizado**: Re-estilização do acesso via AuthGate para seguir o padrão visual de botões premium do sistema.
- **Hierarquia de Ações**: Reorganização da barra de ferramentas do artigo para priorizar a experiência de leitura e interação social.

---

## 📱 [v1.6.1] - Mobile & Tablet UX Masterclass
*Data: 06 de Maio de 2026*

### ✨ UI/UX Responsivo
- **Redesign do Mobile Menu**: Substituição de cards pesados por um layout flat e minimalista para perfil de usuário e painel admin.
- **Accordion de Categorias**: Implementação de menu colapsável para categorias no mobile, economizando espaço vertical.
- **Busca Overlay (Fluída)**: Nova transição de pesquisa que sobrepõe a Navbar sem causar "pulos" de layout, garantindo 100% de fluidez.
- **Otimização iPad Pro**: Ajuste dos breakpoints para `xl` (1280px), garantindo que tablets de alta resolução recebam a interface mobile otimizada.
- **Acessibilidade Tátil**: Aumento dos alvos de toque e refinamento dos botões de Admin e Sair no menu.

---

## 🎨 [v1.6.0] - Premium Retro Overhaul & Admin UX
*Data: 05 de Maio de 2026*

### ✨ UI/UX & Redesign
- **Admin Inbox 2.0**: Implementação de linhas expansíveis no Inbox com visual de card detalhado e animações *slide-in*.
- **Sistema Universal de Modais**: Substituição de alertas do sistema por modais customizados com estética retrô, sombras 3D e feedback tátil.
### 🎨 Design & UX
- **Páginas de Contato e Sobre**: Redesign completo com caixas de diálogo estilo SNES, sombras sólidas e alinhamento reto para maior harmonia.
- **Sistema de Skeletons**: Atualização de todos os estados de carregamento (About, Admin, Contact) para espelhar perfeitamente os novos layouts 7xl.
- **Legibilidade Aprimorada**: Remoção global de `text-justify` em artigos e na página Sobre para evitar "rios de branco" e melhorar a leitura no mobile.
- **Visual Polish (Glow & DropCap)**: Implementação de efeito neon glow nos títulos e refinamento da letra capitular (Drop Cap) para um visual de revista de luxo.
- **Veredito Responsivo**: Redesign da seção de nota para garantir que o selo de score permaneça circular e bem posicionado em todas as telas.

### ⚙️ Funcionalidades & Backend
- **Integração Gmail Direct**: Botão "Responder Agora" que redireciona automaticamente para a aba de composição do Gmail Web.
- **Stats Sincronizadas**: Mensagens agora carregam no mount do Admin, mantendo os contadores de estatísticas sempre atualizados.
- **Correção de Data/Hora**: Ajuste no utilitário de formatação de data para suportar objetos nativos do JS e evitar "Data Desconhecida".

### 🐛 Estabilização
- **Limpeza de Debug Logs**: Remoção de mensagens excessivas no console para uma performance mais limpa.
- **Permissões Firebase**: Atualização das regras de segurança para permitir envio público de mensagens e leitura administrativa protegida.

---

## 🎨 [v1.5.1] - Modernização Visual & UX de Busca
*Data: 05 de Maio de 2026*

### ✨ UI/UX
- **Mega Menu de Categorias**: Redesign do dropdown de categorias para um formato de grade (2 colunas) com ícones e ponteiro indicador.
- **Busca com Memória (Cancelar)**: Implementação da funcionalidade de "Cancelar Busca" que retorna o usuário para a página anterior ao clicar no botão 'X'.
- **Refinamento de Alinhamento**: Ajuste fino no posicionamento dos elementos da Navbar e botões de ação.
- **Botão de Limpar Busca no Desktop**: Adicionado botão de cancelamento dinâmico na barra de pesquisa desktop.

---

## 🚀 [v1.5.0] - Refinamento de UX & PWA
*Data: 05 de Maio de 2026*

### ✨ UI/UX Mobile
- **Nova Busca Expansível**: Implementação de lupa na Navbar mobile que se expande com animação fluida, removendo a necessidade de abrir o menu para pesquisar.
- **Gaveta de Navegação (Drawer)**: Redesign do menu mobile para o formato lateral fixo com bloqueio de scroll no fundo.
- **Aesthetics Revert**: Restauração das cores sólidas (`bg-gray-900`) e bordas roxas para um visual mais focado e profissional.

### ⚙️ Funcionalidades & Performance
- **Busca Global**: Implementação de busca e filtragem em todo o banco de dados (Firebase), superando a limitação da paginação inicial.
- **Debounce de Pesquisa**: Adição de atraso inteligente de 400ms na busca para economizar recursos e evitar piscadas na tela.
- **Cache Local de Posts**: Sistema que carrega todos os posts uma única vez durante a busca e filtra instantaneamente na memória.
- **PWA Ready**: Configuração de manifestos, ícones de alta resolução e suporte para instalação como aplicativo nativo.

### 🐛 Correções de Bugs
- Fim do loop infinito no carregamento de posts.
- Correção de duplicidade de cartões na página inicial.
- Ajuste no "falso negativo" (mensagem de nenhum post encontrado) durante o carregamento de categorias.

---

## 🎨 [v1.4.0] - Modernização Premium & Glassmorphism
*Data: 04 de Maio de 2026*

### ✨ UI/UX
- **Deep Dark Theme**: Transição do visual retro rígido para um tema escuro profundo e moderno.
- **Glassmorphism**: Aplicação de efeitos de desfoque de fundo e transparência em cards de títulos para melhor legibilidade.
- **Tipografia**: Ajustes na hierarquia visual usando fontes como *Outfit* e *Inter*.
- **Newsletter**: Implementação de seção de captura de emails no rodapé.

---

## 🎨 [v1.3.0] - Interatividade & Melhorias Visuais
*Data: 04 de Maio de 2026*

### ✨ Features
- **Feedback Tátil**: Animações de clique e hover aprimoradas para simular botões de consoles clássicos.
- **Sistemas de Comentários**: Implementação de sistema de discussão e likes em tempo real.

---

## 🛠️ [v1.2.0] - Infraestrutura & CMS
*Data: 03 de Maio de 2026*

### ⚙️ Backend (Firebase)
- **Painel Administrativo**: Criação da interface de editor chefe para criação e edição de posts.
- **Sistema de Likes/Comentários**: Implementação de interações sociais em tempo real.
- **Slug System**: Geração automática de URLs amigáveis para SEO baseadas no título dos posts.

---

## 🏗️ [v1.1.0] - Fundação & Core
*Data: 01 de Maio de 2026*

### ⚙️ Arquitetura
- **React + Vite**: Setup inicial da aplicação com foco em performance de carregamento.
- **Tailwind CSS**: Estruturação do sistema de design baseado em variáveis de CSS customizáveis.
- **Context API**: Centralização de estados globais (Tema, Usuário, Posts).

---

> **Legenda:**
> - ✨ **UI/UX**: Melhorias visuais e de experiência do usuário.
> - ⚙️ **Funcionalidades**: Novas ferramentas e lógica de programação.
> - 🐛 **Correções**: Resolução de bugs e otimizações técnicas.
