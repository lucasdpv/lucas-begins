# 🎮 BeginsProject — Games · Animes · Nostalgia (v6.6.0)

> **"O ponto de encontro entre a nostalgia dos anos 90/2000 e uma experiência de streaming & editorial geek de última geração."**

O **BeginsProject** é um portal editorial e plataforma interativa dedicado a **Games, Animes e Nostalgia Geek**. Na versão **6.6.0**, o portal recebe uma grande engenharia de performance voltada a **notebooks com placa de vídeo integrada (Intel UHD / Iris Xe) e telas HD/Full HD**, adotando bibliotecas modernas e ultra-leves (**Embla Carousel**, **AutoAnimate** e **CVA**), pré-carregamento SSR na Home com redução de ~90% do payload e rolagem a 60fps constantes.

---

## 📘 Documentação do Projeto

Para facilitar a gestão e o desenvolvimento, dividimos as informações em guias especializados:

- **[🗺️ Roadmap de Modernização](./MODERNIZATION_PLAN.md)**: Status atual das entregas, fases concluídas e evolução contínua.
- **[📜 Histórico de Versões](./HISTORY.md)**: Registro completo de todas as versões e marcos técnicos (`v1.0` → `v6.6.0`).
- **[⚙️ Documentação Técnica](./DOCUMENTATION.md)**: Arquitetura Next.js 16 App Router, Design System v6.0, TanStack Query e Zustand.
- **[🕹️ Guia de Onboarding](./ONBOARDING.md)**: Guia rápido para novos desenvolvedores e estrutura modular.
- **[🔧 Guia de Manutenção](./MAINTENANCE.md)**: Manual de operações, gamificação (XP/Level) e administração do Firestore.
- **[📋 Backlog Técnico](./BACKLOG.md)**: Próximos passos planejados (refatoração futura do Light/Dark Mode, testes e infraestrutura).
- **[🔥 Guia Firebase](./FIREBASE_GUIDE.md)**: Configuração de regras de segurança, Auth e Storage.

---

## 🚀 Novidades da Versão 6.6.0 (The Integrated GPU & Lightweight UI Engine Update)

- **Adoção de Bibliotecas Modernas & Leves**:
  - **Embla Carousel (`embla-carousel-react` + `embla-carousel-fade` + `embla-carousel-autoplay`)**: Substituição do carrossel manual em `Carousel.tsx` pelo motor de carrossel do *shadcn/ui*, eliminando 3 camadas `<Image>` duplicadas com `blur-3xl saturate-150` em favor de um único gradiente radial acelerado por GPU.
  - **AutoAnimate (`@formkit/auto-animate`)**: Substituição de `<motion.div layout>` por página nas grades da `HomePage.tsx` e `ArchivePage.tsx`, animando filtros e paginação com ~2 KB e zero sobrecarga durante o scroll.
  - **Class Variance Authority (`cva`)**: Padronização tipada de variantes em componentes base como `Badge.tsx`.
- **Otimização Profunda para Notebooks com GPU Integrada (60fps Scroll)**:
  - **Desmontagem Real de Skeletons (`RetroCardImage.tsx`)**: Corrigido gargalo oculto onde ~40 skeletons `animate-pulse` continuavam rodando infinitamente a 60fps atrás das imagens já carregadas (`opacity-0`); agora o placeholder é desmontado assim que a imagem termina de carregar.
  - **Zero Re-render no Scroll (`HomePage.tsx`)**: Removidos os estados `hoveredRetrocafeIndex`, `hoveredDossieIndex` e `hoveredReviewsIndex` que re-renderizavam toda a árvore da Home quando o cursor cruzava um card durante a rolagem pelo touchpad.
  - **Scroll Listeners com `requestAnimationFrame`**: Throttling por quadro (`passive: true`) em `useNavbar.ts`, `BackToTop.tsx` e `PostDetailPage.tsx`, além da substituição de `backdrop-blur` aninhados por superfícies translúcidas de compositing direto (`bg-[#090812]/90`).
- **SSR Instantâneo na Home & Redução de 90% no Payload (`src/app/page.tsx`)**:
  - Pré-busca paralela via Firestore REST API no servidor (`revalidate = 300`) integrada ao `initialData` do React Query (`usePostsQuery.ts`), eliminando a cascata inicial no navegador sem perder atualização instantânea quando o admin edita matérias.
  - Tempo de leitura pré-calculado no servidor (`calculateReadingTime` em `src/lib/utils.ts`), evitando trafegar o markdown integral dos artigos nos cards da Home.
- **Alinhamento Widescreen nas Matérias & Player YouTube Nativo**:
  - `PostDetailPage.tsx` e `PostDetailSkeleton.tsx` agora utilizam 100% da largura `.layout-container` (`1760px`), alinhados exatamente com a `Navbar` e a `HomePage`.
  - `ArticleRenderer.tsx`: Player oficial do YouTube com `loading="lazy"` nativo e overlay `.scanline-overlay` restrito apenas às imagens com moldura `crt`.

## 🏆 Novidades da Versão 6.5.0 (The Scorecard Verdict & Smart Review Extractor Update)

- **Novo Scorecard "Veredito Begins" (`PostVerdict.tsx`)**:
  - **Selo Editorial na Borda Superior**: Crachá `VEREDITO BEGINS` cravado na borda superior esquerda (`-top-4 left-6`) seguindo o mesmo padrão clássico das caixas de curiosidades (`magazine-info-box`) da revista.
  - **Banner com Arte & Tipografia Refinada**: Arte de capa em destaque com gradiente lateral suave, título do jogo em *Title Case* equilibrado e suporte a frase curta opcional (até 140 caracteres).
  - **Coluna Arquitetônica de Pontuação**: Painel lateral integrado com nota em destaque (`8.5/10`), pílula de classificação automática (*★ Obra-Prima*, *Excelente*, *Recomendado*) e barra de progresso HUD segmentada em 10 blocos.
  - **Grid Lado a Lado de Prós & Contras**: Seções **"O Que Brilha (Prós)"** em verde esmeralda e **"O Que Pesa (Contras)"** em rosa/vermelho, com suporte híbrido automático para reviews legados.
- **Migração de 100% dos Reviews & Extrator Inteligente (`reviewVerdictHelper.ts` & `PostEditorPage.tsx`)**:
  - Todas as 8 análises publicadas no acervo (*Chrono Trigger*, *Top Gear*, *Turtles in Time*, *Radiata Stories*, *Jackie Chan Stuntmaster*, *Naruto Ultimate Ninja*, *Diablo 4: Lord of Hatred* e *Lufia and the Fortress of Doom*) foram analisadas e migradas com seus Prós e Contras fiéis ao texto de cada matéria.
  - Novo painel de Veredito no Editor (`PostEditorPage.tsx`) com prévia ao vivo do selo/barra de nota, listas dinâmicas de Prós e Contras e botão **`✨ Gerar Prós & Contras da Análise`** que lê o artigo e sugere pontos fortes e fracos sucintos automaticamente.

## 💎 Novidades da Versão 6.4.0 (The Editorial Refinement & Floating Navigation Update)

- **Navegação Flutuante Sincronizada (`ChapterPill.tsx` & `BackToTop.tsx`)**:
  - No celular (`< sm`), o botão de capítulos vira uma badge circular compacta de 40x40px mostrando o progresso e o número do capítulo atual.
  - Alinhamento pixel-perfect de baseline e elevação entre o botão de capítulos (esquerda) e o botão Topo (direita).
  - Auto-hide por inatividade sincronizado: após 2.5s lendo a matéria, ambos os botões desaparecem suavemente juntos, reaparecendo imediatamente com qualquer rolagem ou toque.
- **Redesign do Veredito Oficial (`PostVerdict.tsx`)**:
  - Selo quadrado minimalista (`w-24 sm:w-28 rounded-2xl`) posicionado à direita (`float-right`) com a nota gigante em destaque (`text-4xl sm:text-5xl`) e tag `/10` na quina inferior.
  - O texto do veredito flui em volta do selo, eliminando o espaço vazio.
- **Perfil do Autor Enxuto (`AboutPage.tsx`)**:
  - Redesenho do cabeçalho da página "Sobre Nós" em formato horizontal minimalista com avatar proporcional (`rounded-2xl`), dot verde de status e foco direto no autor, criador e plataformas PlayStation & Nintendo.
- **Prevenção de Hydration Mismatch (`PostActions.tsx` & `PostComments.tsx`)**:
  - Guard `isMounted` implementado para garantir correspondência idêntica entre o HTML gerado no SSR e o primeiro frame do cliente, eliminando avisos no console com autenticação Firebase.
- **Otimizações Mobile & Next.js**:
  - Removido "Todos" da lista de categorias mobile em `MobileMenu.tsx` para evitar redundância com o Catálogo Completo.
  - Dev indicator desativado em `next.config.js` (`devIndicators: false`).

## ⚡ Novidades da Versão 6.3.0

- **Shimmer Skeletons Temáticos (`RetroCardImage.tsx`)**: Fim das caixas pretas durante o carregamento de imagens com fade-in suave ao finalizar o download.
- **Fim da Piscada/Recarregamento na Home**: Consultas secundárias simultâneas com cache inteligente de 10 minutos.
- **Abertura Sub-Segundo de Matérias**: Exibição instantânea via SSR no `PostDetailPage`.
- **Pipeline de Imagens com Formatos Modernos**: Suporte nativo a AVIF/WebP com `minimumCacheTTL` de 30 dias e cache de 1 ano no Firebase Storage.
- **Code-Splitting de Modais**: Modais como `LoginModal`, `CookieConsent` e `ShareModal` agora utilizam `next/dynamic`.

## 📰 Novidades da Versão 6.2.0

- **Seções com cara de revista dos anos 90**: RetroCafé, Dossiês e Reviews com retícula colorida e títulos de capa inclinados (`MagazineBackdrop.tsx`).
- **Cards em formato pôster** nas Novidades, no Catálogo e no Dossiês, com títulos inteiros.
- **Sumário de capítulos** com tempo de cada capítulo e, no celular, lista que sobe do rodapé; botão Topo no mesmo visual.
- **Celular e tablet revisados**: carrossel mais limpo no celular, design de computador a partir de 1024px e barra de rolagem nativa em telas de toque.
- **Correção**: o "voltar" do navegador depois de "Ver todos" volta para a home normal (a categoria agora vai na URL do catálogo).

## 🧭 Novidades da Versão 6.1.0

- **4 categorias oficiais**: `Reviews`, `Dossiê`, `Animes & TV` e `RetroCafé`, definidas em `src/features/posts/utils/categoryInfo.ts`, cada uma com uma descrição exibida no Catálogo e na Home.
- **Pílula flutuante de capítulos** (`ChapterPill.tsx`): navegação rápida entre os capítulos durante a leitura das matérias.
- **Mais leve**: carrossel montando só os slides necessários, fundo sem desfoques animados e menos consultas ao Firestore na Home.
- **Removido**: tradução automática via Google Translate (use a tradução nativa do navegador), barra de progresso de leitura e scripts de seed/limpeza automática.

Detalhes completos no [Histórico de Versões](./HISTORY.md).

---

## ✨ Destaques da Versão 6.0.0 (Cyber-Editorial & Streaming Geek Redesign)

### 🌈 Billboard Hero Cinematográfico com Efeito TV Ambilight
- **Extensão de Luz da Cena (Ambilight)**: Projeção luminosa em dupla camada sem recorte (`blur-[110px] saturate-[1.85]`) atrás do carrossel principal (`Carousel.tsx`) e da capa das matérias (`PostHero.tsx`), espalhando as cores reais de cada arte pelo fundo escuro (`#090812`).
- **Crossfade Ultra-Suave (`1100ms`–`1400ms`)**: Camadas de imagem pré-montadas com transição contínua, efeito *Ken Burns* sutil e dock de miniaturas fixo no canto inferior direito com barra de progresso ao vivo.

### 🎬 Trilhos de Streaming & Expansão Widescreen (`1760px`)
- **Container Widescreen (`.layout-container`)**: Aproveitamento total de monitores Full HD e Ultrawide (`max-width: 1760px`) na Navbar, conteúdo principal e Footer.
- **Top 5 Em Alta Hoje**: Trilho horizontal com numerais gigantes vazados (`.netflix-rank`) que se preenchem com **dourado sólido (`#fbbf24`)** e *glow* âmbar ao passar o mouse.
- **Séries & Coleções Originais**:
  - **RetroCafé**: Posters verticais `3:4` estilo série original (`EPISÓDIO #01`) com aura laranja reativa.
  - **Dossiês**: Posters verticais no mesmo formato do RetroCafé, com aura azul (atualizado na v6.1.0/v6.2.0).
  - **Reviews**: Vitrine de análises com nota em destaque e máscara de gradiente suave.

### 🔄 Recomendações Dinâmicas ("Continue Explorando")
- **Pool Inteligente por Universo**: Combina matérias da mesma categoria (`usePostsByCategory`), lançamentos recentes (`useLatestPosts`) e populares (`usePopularPosts`) com embaralhamento determinístico por artigo (`seededShuffle`) + botão interativo **"Outras Sugestões"** para sortear novas recomendações em tempo real.

### 🦴 Fidelidade Total de Skeletons & Páginas Internas
- **100% dos Skeletons e Páginas Atualizados**: `CarouselSkeleton`, `PostSkeleton`, `PostDetailSkeleton`, `ArchivePage` (*Catálogo Completo*), `PostDetailPage`, `AboutPage`, `ContactPage`, `DashboardPage` (*Meu QG*), `PrivacyPolicyPage`, `NotFoundPage` e modais/overlays (`LoginModal`, `ShareModal`, `CookieConsent`, `BackToTop`, `Toast`) padronizados no acabamento Cyber-Editorial (`rounded-2xl`/`rounded-3xl`, `border-white/[0.08]`, glassmorphism).

---

## 🛠️ Stack Tecnológica

- **Next.js 16 (App Router + SSR/ISR)** + **React 19** + **TypeScript 6**
- **Firebase** (Authentication, Cloud Firestore & Storage)
- **TanStack React Query v5** (Cache, Prefetching & Progressive Loading)
- **Zustand v5** (Gerenciamento de Estado: UI & Tema)
- **Tailwind CSS** + **Framer Motion** (Design System Cyber-Editorial + Streaming Geek)
- **Zod v4** + **DOMPurify** (Validação de Schemas & Sanitização SSR-Safe)

---

## 🚀 Como Executar

1. **Clone e Instale:**
   ```bash
   git clone https://github.com/lucasdpv/begins-project.git
   cd begins-project
   npm install
   ```

2. **Variáveis de Ambiente (`.env.local`):**
   Configure suas credenciais do Firebase no arquivo `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   ```

3. **Inicie o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000`.

---

**Desenvolvido com 💜 por Lucas Vieira.**
*"Games · Animes · Nostalgia"*
