# 📜 Documentação Técnica — BeginsProject (v6.1.0)

Este documento detalha a arquitetura de software, o sistema de design **Cyber-Editorial + Streaming Geek** e as decisões de engenharia da versão **v6.1.0**.

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

### 3. Trilho "Top 5 Em Alta Hoje" (`.netflix-rank`)
- Numerais gigantes posicionados à esquerda de cada poster (`1` a `5`).
- Em repouso, exibem contorno roxo translúcido; no `:hover` do card (`.group:hover .netflix-rank`), preenchem-se com **dourado sólido (`#fbbf24`)**, contorno `#fef08a` e *drop-shadow* âmbar luminoso.

### 4. Modern Web Platform Enhancements
- **Tipografia Equilibrada**: `text-wrap: balance` em títulos (`h1`–`h4`) e `text-wrap: pretty` em parágrafos de leitura (`.article-paragraph`, `.magazine-article`).
- **Animação Intrínseca do Índice de Capítulos**: Uso de `interpolate-size: allow-keywords` e `calc-size(auto, size)` na classe `.toc-collapsible`.
- **Pílula Flutuante de Capítulos (`PostDetail/ChapterPill.tsx`)**: Aparece quando o índice (`#post-toc`) sai da tela e some ao fim de `#article-content`. Mostra um anel de progresso por capítulo e abre a lista completa ao clicar. É renderizada via `createPortal(..., document.body)` porque a animação de entrada das páginas aplica `transform` em um ancestral, o que faria `position: fixed` rolar junto com o conteúdo.
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
- O mesmo arquivo expõe `getCategoryDescription` (texto exibido no Catálogo e no cabeçalho `Setor: …` da Home) e `getCategoryTagline` (frase curta do menu de categorias). As chaves são normalizadas (sem acento, sem "s" final), então `Dossiê` e `Dossiês` resolvem para a mesma entrada.
- Navbar, MobileMenu, `ArchivePage`, o filtro do Painel (`TabPosts`) e o editor (`PostEditorPage`) usam `SITE_CATEGORIES`. A coleção `categories` do Firestore só é usada pela aba "Categorias" do Painel.
- Cores e ícones por categoria são resolvidos por palavra-chave em `categoryIcons.tsx`, `Badge.tsx`, `PostCard.tsx`, `PostHero.tsx`, `Carousel.tsx` e `ArchivePage.tsx`.
- O campo `category` de cada post deve conter exatamente um dos nomes de `SITE_CATEGORIES`.

### 4. Carregamento Progressivo & LCP (`HomePage.tsx`)
- Consultas secundárias abaixo da dobra (`mostViewedPosts`, `reviewPosts`, `dossiePosts`, `retrocafePosts`) aguardam `requestIdleCallback` para liberar a thread principal na abertura do site.
- A primeira imagem do carrossel (`idx === 0`) e a capa do artigo (`PostHero.tsx`) utilizam `priority` e `fetchPriority="high"`.

---

## 📂 Estrutura de Pastas

- **`src/app/`**: Rotas do Next.js App Router, metadados dinâmicos (`generateMetadata`), `sitemap.ts` e `robots.ts`.
- **`src/views/`**: Páginas principais (`HomePage`, `ArchivePage`, `PostDetailPage`, `AboutPage`, `ContactPage`, `DashboardPage`, `PrivacyPolicyPage`, `NotFoundPage`, `PostEditorPage`, `AdminDashboard`).
- **`src/features/posts/`**: `Carousel`, `PostCard`, `ArticleRenderer`, `PostDetail/` (`PostHero`, `PostActions`, `PostVerdict`, `PostAuthorBox`, `PostRelated`, `PostComments`, `ChapterPill`), Skeletons, hooks do React Query (`usePostsQuery.ts`) e utilitários de categoria (`utils/categoryInfo.ts`, `utils/categoryIcons.tsx`).
- **`src/components/layout/`**: `Navbar`, `Footer` e subcomponentes (`NavCategoryMenu`, `NavUserMenu`, `MobileMenu`).
- **`src/components/ui/`**: `Badge`, `ShareModal`, `CookieConsent`, `BackToTop`, `Toast`, `ImageUpload`, `ImageCropper`.

---

## 🌐 Idioma
- O portal é publicado apenas em português (`lang="pt-BR"`). A tradução automática via Google Translate foi removida na v6.1.0 porque o widget reescreve nós de texto controlados pelo React, causando oscilação entre idiomas e estado inconsistente. Leitores podem usar a tradução nativa do navegador.

---
**Documentação atualizada em: 31 de Outubro de 2026 (v6.1.0).**
