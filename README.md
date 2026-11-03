# 🎮 BeginsProject — Games · Animes · Nostalgia (v6.3.0)

> **"O ponto de encontro entre a nostalgia dos anos 90/2000 e uma experiência de streaming & editorial geek de última geração."**

O **BeginsProject** é um portal editorial e plataforma interativa dedicado a **Games, Animes e Nostalgia Geek**. Na versão **6.3.0**, o portal atinge maturidade de alta performance com carregamento instantâneo de artigos, entrega de imagens em formatos modernos (AVIF/WebP) com cache persistente de 1 ano, shimmer skeleton temático e otimização total de GPU.

---

## 📘 Documentação do Projeto

Para facilitar a gestão e o desenvolvimento, dividimos as informações em guias especializados:

- **[🗺️ Roadmap de Modernização](./MODERNIZATION_PLAN.md)**: Status atual das entregas, fases concluídas e evolução contínua.
- **[📜 Histórico de Versões](./HISTORY.md)**: Registro completo de todas as versões e marcos técnicos (`v1.0` → `v6.3.0`).
- **[⚙️ Documentação Técnica](./DOCUMENTATION.md)**: Arquitetura Next.js 16 App Router, Design System v6.0, TanStack Query e Zustand.
- **[🕹️ Guia de Onboarding](./ONBOARDING.md)**: Guia rápido para novos desenvolvedores e estrutura modular.
- **[🔧 Guia de Manutenção](./MAINTENANCE.md)**: Manual de operações, gamificação (XP/Level) e administração do Firestore.
- **[📋 Backlog Técnico](./BACKLOG.md)**: Próximos passos planejados (refatoração futura do Light/Dark Mode, testes e infraestrutura).
- **[🔥 Guia Firebase](./FIREBASE_GUIDE.md)**: Configuração de regras de segurança, Auth e Storage.

---

## ⚡ Novidades da Versão 6.3.0 (The Hyper-Speed & Visual Polish Update)

- **Shimmer Skeletons Temáticos (`RetroCardImage.tsx`)**: Fim das caixas pretas durante o carregamento de imagens. Cada seção exibe um placeholder com pulso e tons temáticos (Laranja no RetroCafé, Azul em Dossiês, Dourado em Reviews e Roxo no Catálogo) com fade-in suave ao finalizar o download.
- **Fim da Piscada/Recarregamento na Home**: Consultas secundárias simultâneas com cache inteligente de 10 minutos, eliminando saltos de layout tardios.
- **Abertura Sub-Segundo de Matérias**: Remoção do bloqueio de hidratação no `PostDetailPage` com exibição instantânea via SSR.
- **Imagens da Matéria Aceleradas**: As 4 primeiras imagens do corpo do artigo carregam antecipadamente (`loading="eager"` / `fetchPriority="high"`).
- **Pipeline de Imagens com Formatos Modernos**: Suporte nativo a AVIF/WebP com `minimumCacheTTL` de 30 dias e cache de 1 ano no Firebase Storage (`cacheControl: immutable`).
- **Code-Splitting de Modais**: Modais como `LoginModal`, `CookieConsent` e `ShareModal` agora utilizam carregamento dinâmico (`next/dynamic`), enxugando o bundle JavaScript inicial.

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
