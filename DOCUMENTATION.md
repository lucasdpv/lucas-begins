# 📜 Documentação Técnica — BeginsProject (v6.3.0)

Este documento detalha a arquitetura de software, o sistema de design **Cyber-Editorial + Streaming Geek** e as decisões de engenharia da versão **v6.3.0**.

---

## 🚀 Tecnologias Core
- **Frontend & SSR**: React 19 + Next.js 16 (App Router + Server Components) + TypeScript 6.
- **Roteamento & Renderização**: Server-Side Rendering (SSR) híbrido com Incremental Static Regeneration (`revalidate = 300`) e Static Site Generation (`generateStaticParams`).
- **Estilização**: Tailwind CSS + CSS Moderno (`interpolate-size`, `text-wrap: balance/pretty`, `content-visibility: auto`, Scroll-Driven Animations).
- **Backend**: Firebase (Cloud Firestore + Authentication + Cloud Storage).
- **Gerenciamento de Dados**: TanStack Query v5 (React Query).
- **Estado Global**: Zustand v5 (`useUIStore`, `useThemeStore`) + Context API (`AuthProvider`).
- **Animações**: Framer Motion + GPU-accelerated CSS transitions.
- **Busca Instantânea**: Fuse.js (tolerância a erros de digitação e acentuação na Spotlight Search Bar da Navbar).
- **Síntese de Áudio**: Web Audio API (efeitos sonoros retrô sintetizados nativamente sem arquivos externos).

---

## 🎨 Design System v6.0: Cyber-Editorial + Streaming Geek

Na versão **v6.0.0**, o portal abandonou as antigas bordas pretas grossas neo-brutalistas em favor de uma estética **Cyber-Editorial + Streaming Geek** inspirada em plataformas modernas (*Netflix*, *Crunchyroll*, *Apple TV+*, *Polygon*, *The Verge*):

### 1. Paleta, Superfícies & Container Widescreen
- **Backdrop Cinematográfico**: Fundo escuro profundo (`#090812`) com malha radial sutil e superfícies translúcidas (`#121024/90` com `backdrop-blur-xl`).
- **Bordas & Arredondamentos**: Bordas finas translúcidas (`border-white/[0.08]` a `border-white/[0.12]`) e cantos arredondados suaves (`rounded-2xl` e `rounded-3xl`).
- **Container Widescreen (`.layout-container`)**: Definido em `src/index.css` com `max-width: 1760px` e paddings laterais responsivos, aproveitando monitores Full HD e Ultrawide na Navbar, `<main>` e Footer.
- **Identidade de Marca**: Logotipo `BEGINSPROJECT` acompanhado do subtítulo oficial **`GAMES · ANIMES · NOSTALGIA`** na Navbar, MobileMenu e Footer.
- **Modo Escuro Padrão (`useThemeStore.ts`)**: O tema escuro está fixado como padrão (`isDark: true`) enquanto a futura refatoração dedicada do sistema de temas Claro/Escuro está planejada no backlog.

### 2. Efeito TV Ambilight (Extensão de Luz da Cena)
- Implementado em `src/features/posts/components/Carousel.tsx` e `src/features/posts/components/PostDetail/PostHero.tsx`.
- Utiliza uma projeção de dupla camada (`-z-10 pointer-events-none`) posicionada fora do container recortado do carrossel:
  - **Camada 1 (Wall Wash Longo)**: `-inset-6 md:-inset-12 lg:-inset-16 blur-[70px] md:blur-[110px] saturate-[1.85] scale-105`.
  - **Camada 2 (Edge Halo Curto)**: `-inset-2 md:-inset-4 blur-[32px] md:blur-[48px] saturate-[1.6]`.
- Na troca de slides do carrossel, a luz ambiente realiza um crossfade suave de `1400ms` sincronizado com a nova arte.
- **Performance (v6.1.0)**: O carrossel só monta o slide atual, o anterior (fade-out), o próximo (pré-carregado) e o da miniatura sob o mouse (`isSlideMounted`). As camadas de luz usam `next/image` com `sizes="96px"`, já que a arte é desfocada, e as miniaturas usam `sizes="144px"`.
- **Cuidado ao evoluir**: desfoques grandes (`blur-[100px]+`) e animações infinitas em elementos grandes custam caro na GPU. Prefira gradientes radiais estáticos (como o fundo global em `ClientLayoutWrapper.tsx`) e nunca anime `top`/`left` em loop.

### 3. Seções Editoriais com Cara de Revista (`src/components/home/MagazineBackdrop.tsx`)
- RetroCafé (`tone="orange"`), Dossiês (`tone="sky"`) e Reviews (`tone="amber"`) usam `<MagazineBackdrop />` como primeira camada do painel: brilho radial no canto, duas retículas (`.mag-halftone` e `.mag-halftone-alt`, em `index.css`) e um filete de 2px na cor da seção.
- Os títulos dessas seções usam `.mag-title` + `.mag-title-orange|sky|amber` (itálico inclinado com sombra deslocada colorida).
- Tudo é estático: não adicione `blur` grande nem animação infinita nessas camadas.

### 4. Cards Pôster (`PostCard` com `variant="vintage"`)
- Usado na seção Novidades (Home) e no Catálogo (`ArchivePage`). A arte ocupa o card inteiro com degradê na parte de baixo; nota (★) no canto esquerdo, views e tempo de leitura no direito; categoria, data, título e subtítulo inteiros embaixo.
- Grade padrão: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`. O Catálogo carrega 8 por página (`usePosts({ pageSize: 8 })`) para fechar fileiras completas.
- RetroCafé e Dossiês usam o mesmo formato, montado direto em `HomePage.tsx`.

### 5. Trilho "Top 5 Em Alta Hoje" (`.netflix-rank`)
- Numerais gigantes posicionados à esquerda de cada poster (`1` a `5`).
- Em repouso, exibem contorno roxo translúcido; no `:hover` do card (`.group:hover .netflix-rank`), preenchem-se com **dourado sólido (`#fbbf24`)**, contorno `#fef08a` e *drop-shadow* âmbar luminoso.

### 6. Modern Web Platform Enhancements
- **Tipografia Equilibrada**: `text-wrap: balance` em títulos (`h1`–`h4`) e `text-wrap: pretty` em parágrafos de leitura (`.article-paragraph`, `.magazine-article`).
- **Animação Intrínseca do Índice de Capítulos**: Uso de `interpolate-size: allow-keywords` e `calc-size(auto, size)` na classe `.toc-collapsible`.
- **Sumário Flutuante de Capítulos (`PostDetail/ChapterPill.tsx`)**: Aparece quando o índice (`#post-toc`) sai da tela e some ao fim de `#article-content`. Cada capítulo traz o tempo estimado (palavras entre títulos `##` ÷ 200, calculado em `PostDetailPage.tsx`); a pílula mostra os minutos restantes. No computador abre um painel acima da pílula; no celular (`< sm`) abre uma folha fixa no rodapé com fundo escurecido, que fecha com toque fora, Esc ou arrastando a alça (`useDragControls`). Tudo é renderizado via `createPortal(..., document.body)` porque a animação de entrada das páginas aplica `transform` em um ancestral, o que faria `position: fixed` rolar junto com o conteúdo — e a folha do celular fica fora do container animado da pílula pelo mesmo motivo.
- **Botão Topo (`BackToTop.tsx`)**: mesma altura (42px), forma e halo da pílula de capítulos, alinhado na mesma linha (`mb-6 md:mb-8`).

### 7. Responsividade
- **Celular (< 640px)**: carrossel sem resumo, sem pílula de curtidas e sem escurecimento lateral; cards em pôster de 1 coluna.
- **Tablet (≥ 1024px)**: usa o design de computador (3 colunas nas seções editoriais, miniaturas no carrossel com tamanho reduzido até 1279px). Abaixo de 1024px as seções editoriais empilham com o Reviews primeiro (`order-1`).
- **Computador (≥ 1280px)**: resumo do carrossel em área fixa de 4 linhas (`line-clamp-4 h-[6.5rem]`) para todos os slides terem a mesma altura.
- **Barra de rolagem**: a barra personalizada (`::-webkit-scrollbar`) só vale com `@media (hover: hover) and (pointer: fine)`; em telas de toque fica a barra nativa, que não ocupa espaço.
- **Cuidado com `line-clamp` + `display` responsivo**: `hidden sm:block` anula o `line-clamp` (que depende de `display: -webkit-box`). Para esconder em telas pequenas, use `max-sm:hidden` / `max-md:hidden`.
- **Content-Visibility Below-the-Fold**: Seções inferiores utilizam `.deferred-below-fold` (`content-visibility: auto; contain-intrinsic-size: auto 520px`).

---

## ⚙️ Arquitetura de Dados & Recomendações Dinâmicas

### 1. SSR & Hydration (`/post/[slug]`)
- Os dados iniciais do post são buscados no servidor via Firestore REST API e passados como `placeholderData` ao TanStack Query no cliente, garantindo SEO completo + atualização em tempo real de comentários e interações pelo SDK do Firebase.

### 2. Recomendações Dinâmicas ("Continue Explorando")
- Em `PostDetailPage.tsx` e `PostRelated.tsx`, o sistema combina três fontes desduplicadas:
  - `usePostsByCategory(post.category, 8)` (mesmo universo/categoria);
  - `useLatestPosts(12)` (lançamentos recentes);
  - `usePopularPosts(12)` (mais curtidos).
- Um algoritmo `seededShuffle` determinístico por `currentPostId` seleciona automaticamente uma combinação única para cada matéria (priorizando 2 títulos da mesma categoria + 1 variado), além de oferecer o botão interativo **"Outras Sugestões"** para sortear novas matérias sem recarregar a página.

### 3. Categorias (`src/features/posts/utils/categoryInfo.ts`)
- As categorias oficiais são definidas no código em `SITE_CATEGORIES`: `Reviews`, `Dossiê`, `Animes & TV` e `RetroCafé`.
- O mesmo arquivo expõe `getCategoryDescription` (texto exibido no Catálogo e no cabeçalho da categoria na Home) e `getCategoryTagline` (frase curta do menu de categorias). As chaves são normalizadas (sem acento, sem "s" final), então `Dossiê` e `Dossiês` resolvem para a mesma entrada.
- Navbar, MobileMenu, `ArchivePage`, o filtro do Painel (`TabPosts`) e o editor (`PostEditorPage`) usam `SITE_CATEGORIES`. A coleção `categories` do Firestore só é usada pela aba "Categorias" do Painel.
- Cores e ícones por categoria são resolvidos por palavra-chave em `categoryIcons.tsx`, `Badge.tsx`, `PostCard.tsx`, `PostHero.tsx`, `Carousel.tsx` e `ArchivePage.tsx`.
- O campo `category` de cada post deve conter exatamente um dos nomes de `SITE_CATEGORIES`.
- **Catálogo filtrado pela URL**: os botões "Ver todos" e "Explorar tudo" levam a `/archive?categoria=<nome>`, e o `ArchivePage` lê a categoria de `useSearchParams` (não do estado global), para o "voltar" do navegador funcionar e o link ser compartilhável. Trocar de categoria dentro do catálogo usa `replace`, sem empilhar histórico.

### 4. Carregamento Progressivo & LCP (`HomePage.tsx`)
- Consultas secundárias abaixo da dobra (`mostViewedPosts`, `reviewPosts`, `dossiePosts`, `retrocafePosts`) aguardam `requestIdleCallback` para liberar a thread principal na abertura do site.
- A primeira imagem do carrossel (`idx === 0`) e a capa do artigo (`PostHero.tsx`) utilizam `priority` e `fetchPriority="high"`.

---

## 📂 Estrutura de Pastas

- **`src/app/`**: Rotas do Next.js App Router, metadados dinâmicos (`generateMetadata`), `sitemap.ts` e `robots.ts`.
- **`src/views/`**: Páginas principais (`HomePage`, `ArchivePage`, `PostDetailPage`, `AboutPage`, `ContactPage`, `DashboardPage`, `PrivacyPolicyPage`, `NotFoundPage`, `PostEditorPage`, `AdminDashboard`).
- **`src/features/posts/`**: `Carousel`, `PostCard`, `ArticleRenderer`, `PostDetail/` (`PostHero`, `PostActions`, `PostVerdict`, `PostAuthorBox`, `PostRelated`, `PostComments`, `ChapterPill`), Skeletons, hooks do React Query (`usePostsQuery.ts`) e utilitários de categoria (`utils/categoryInfo.ts`, `utils/categoryIcons.tsx`).
- **`src/components/layout/`**: `Navbar`, `Footer` e subcomponentes (`NavCategoryMenu`, `NavUserMenu`, `MobileMenu`).
- **`src/components/ui/`**: `RetroCardImage`, `Badge`, `ShareModal`, `CookieConsent`, `BackToTop`, `Toast`, `ImageUpload`, `ImageCropper`.
- **`src/components/home/`**: `MagazineBackdrop` (fundo das seções editoriais).

---

## 🖼️ Pipeline de Imagens & Shimmer Skeletons (v6.3.0)
- **`RetroCardImage.tsx`**: Componente unificado para exibição de artes e pôsteres com skeleton animado (`animate-pulse`) em tom temático por categoria (Laranja para RetroCafé, Azul para Dossiês, Âmbar para Reviews, Roxo para Novidades) e fade-in suave (`opacity-0` ➔ `opacity-100` em 700ms). Elimina caixas pretas vazias durante o download de imagens.
- **Next.js Image Formats**: Formatos modernos `image/avif` e `image/webp` configurados no `next.config.js` com `minimumCacheTTL: 2592000` (30 dias).
- **Firebase Cache & WebP Upload**: Headers de `cacheControl: "public, max-age=31536000, immutable"` aplicados no `uploadService.ts` com compressão client-side em `.webp` (qualidade 0.78, limite 1440px / 350KB).
- **Tratamento de Erro Nativo**: Substituição do hook legado `useImageFallback` por handlers nativos `onError` em tags `<Image>`, eliminando requisições duplicadas.

---

## 🌐 Idioma
- O portal é publicado apenas em português (`lang="pt-BR"`). A tradução automática via Google Translate foi removida na v6.1.0 porque o widget reescreve nós de texto controlados pelo React, causando oscilação entre idiomas e estado inconsistente. Leitores podem usar a tradução nativa do navegador.

---
## 🔊 Scripts de Terceiros & Áudio
- **AdSense**: `<script async>` simples no `<head>` de `src/app/layout.tsx` (não usar `next/script`, que adiciona `data-nscript`). O Google Analytics continua com `next/script`.
- **Efeitos sonoros (`HomePage.tsx`)**: use `getAudioContext()`, que reaproveita um único `AudioContext` e só o cria depois da primeira interação do visitante (`navigator.userActivation`).
- **Hydration**: componentes que dependem do usuário logado (que chega do Firebase só no navegador) devem esperar montar antes de renderizar o conteúdo dependente, como faz o `NavUserMenu`.

---
**Documentação atualizada em: 3 de Novembro de 2026 (v6.3.0).**
