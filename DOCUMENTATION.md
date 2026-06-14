# 📜 Documentação Técnica — BeginsProject

Este documento detalha a arquitetura de software, o sistema de design e as decisões de engenharia da versão **v5.1.1** (Next.js, AdSense Fix & LCP Optimization Update).

---

## 🚀 Tecnologias Core
- **Frontend**: React 19 + Next.js 16 (App Router + Server Components) + TypeScript.
- **Roteamento & Renderização**: Server-Side Rendering (SSR) híbrido com Incremental Static Regeneration (ISR) e Static Site Generation (SSG).
- **Estilização**: Tailwind CSS (Design Neo-Brutalist Clássico).
- **Backend**: Firebase (Firestore + Auth + Storage).
- **Gerenciamento de Dados**: TanStack Query v5 (React Query).
- **Estado Global**: Zustand (UI/Tema) + Context API (Auth).
- **Animações**: Framer Motion (transitions, dropdowns, lightbox).
- **Busca Aproximada**: Fuse.js (tolerância a erros e acentuação).
- **Síntese de Áudio**: Web Audio API (geração de efeitos sonoros nativos sem arquivos de mídia).

---

## ⚙️ Arquitetura de Estado e Renderização Híbrida

O projeto foi migrado de um SPA puramente client-side (Vite) para um Framework Fullstack (Next.js), trazendo grandes otimizações:

### 1. SSR & Hydration (Páginas de Posts)
- Na rota `/post/[slug]`, os dados do post são buscados diretamente no servidor usando as APIs REST do Firestore. O HTML é pré-renderizado estaticamente (SSG) no build usando `generateStaticParams`.
- O Next.js atualiza o cache das páginas a cada 5 minutos usando ISR (`revalidate = 300`).
- No lado do cliente, o TanStack Query é inicializado usando o estado hidratado (`initialPost`), proporcionando carregamento instantâneo e zero oscilações de layout.

### 2. Zustand (Estado de Interface)
Localizado em `src/store/`, gerencia estados que não precisam de persistência no banco:
- **`useUIStore`**: Controla busca, categoria ativa, modais e sistema de Toasts.
- **`useThemeStore`**: Gerencia a alternância entre os temas **Dark** (Lua violeta) e **SNES/Light** (Sol amarelo).

### 3. Context API (Autenticação)
- **`AuthProvider`**: Envolve a aplicação para prover o estado do Firebase Auth (`currentUser`) e métodos de login/logout, além de sincronizar os cookies de sessão (`auth_token`, `user_role`) para o middleware do servidor.

### 4. Carregamento Progressivo & Otimizações LCP (v5.1.1)
- **Lazy Queries / Progressive Loading (HomePage)**: As consultas abaixo da dobra como `mostViewedPosts`, `reviewPosts`, `dossiePosts` e `retrocafePosts` têm seu carregamento postergado até que a thread principal do navegador esteja livre (`requestIdleCallback` com fallback de `setTimeout` de 900ms–1200ms). Isso reduz as consultas simultâneas na inicialização do portal de 6 para 2.
- **Otimização LCP (Largest Contentful Paint)**: O prop `priority` de eager-loading é aplicado nos primeiros post cards exibidos nas grades principais da HomePage, ArchivePage e DashboardPage, instruindo o navegador a pré-carregar as imagens acima da dobra imediatamente. Adicionalmente, a primeira imagem inserida no corpo da matéria via `ArticleRenderer.tsx` é renderizada com `loading="eager"` para evitar atrasos na métrica LCP em matérias curtas.

---

## 📂 Estrutura de Pastas (Modular)

O projeto segue uma arquitetura híbrida de Next.js App Router e pastas modulares por features:

### `src/app/`
- Rotas oficiais do Next.js (Server Components). Proporciona roteamento de arquivos físicos, geração de metadados de SEO nativos e scripts de injeção JSON-LD.

### `src/views/`
- Componentes de visualização de páginas clientes (ex: `PostDetailPage.tsx`, `PostEditorPage.tsx`), contendo as regras de hooks e interações.

### `src/features/`
- **`admin/`**: Contém componentes exclusivos do painel (Tabs, Inbox) e o hook `useAdminActions`.
- **`posts/`**: Componentes de PostCard, Carousel, Skeletons, renderizador de posts e os hooks de consulta de posts e categorias.
- **`auth/`**: Componentes de Login e proteção de rotas.

### `src/services/`
- **`PostService.ts`**: Abstração pura do Firestore (métodos REST e SDK).
- **`userService.ts`**: Lógica de gamificação (XP), favoritos e perfis.
- **`uploadService.ts`**: Upload de imagens para o Firebase Storage com conversão automática para WebP (com exceção de GIFs).

---

## 🖼️ Sistema de Imagens Premium & Renderização de Artigos

### Proporções & Molduras no BlockEditor
O editor de blocos suporta configuração visual de cada bloco de imagem:
- **Aspect**: `original`, `1:1`, `16:9`, `4:5` - serializados no Markdown como `{#aspect-X}`.
- **Frame Style**: `normal`, `crt`, `sticker`, `none` - serializados como `{#frame-Y}`.
- **Scanlines**: `true/false` - serializado como `{#scanlines-false}`.

### Renderização e Float (ArticleRenderer)
Para evitar o colapso de containers em layouts flutuantes (floats laterais onde o texto contorna a imagem), o `ArticleRenderer.tsx` utiliza tags nativas `<img>` de HTML, garantindo medição física de proporção de forma fluida.
- **Lightbox de Zoom**: Zoom full-screen nativo com backdrop blur e scanlines ao clicar em imagens do artigo.

### CORS Proxy para Corte de Imagens Remotas
Para evitar erros de canvas tainted no canvas do ImageCropper, usamos um proxy local no Next.js:
- Rewrite no `vercel.json` mapeando `/firebase-storage` para `https://firebasestorage.googleapis.com`.

---

## 🎮 Gamificação e Regras de Negócio

### Sistema de XP
Os usuários ganham XP por interações:
- **Ler Artigo**: +10 XP
- **Curtir**: +5 XP
- **Comentar**: +20 XP
- **Favoritar**: +15 XP
- **Responder Comentário**: +10 XP

### Novo Mecanismo de Visualizações e Segurança (v5.0.0)
A contagem de visualizações é executada de forma atômica utilizando `increment(1)` no Firestore:
- **LocalStorage**: Artigos já lidos são registrados localmente no cliente (`retro_viewed_posts`) para evitar incrementos redundantes.
- **Segurança Firestore rules**: As regras de escrita anônimas no Firestore (`firestore.rules`) foram blindadas de forma estrita. Atualizações sem login no campo de views só são autorizadas se alterarem **exclusivamente** o campo `views` e se o incremento for **exatamente +1** (`request.resource.data.views == resource.data.views + 1`), prevenindo manipulação arbitrária de números.

---

## 🎨 Design System: Neo-Brutalist Clássico & Temático

A estética do portal segue um Neo-Brutalismo clássico retro-gaming:
- **Cantos Retos**: Ausência completa de cantos arredondados (`rounded-none`).
- **Bordas Pretas & Sombras 2D Offset**: Uso de `border-2 border-black` com sombras brutalistas offset (`shadow-[4px_4px_0px_rgba(0,0,0,1)]`).
- **Cores por Categoria**: Títulos, subtítulos e badges exibem dinamicamente as cores de sua categoria (amarelo para reviews, azul para dossiês, laranja para retrocafé, rosa para nostalgia, ciano para RPG/MMO e esmeralda para cultura pop), tanto nos cards da home quanto no PostHero de detalhe.
- **Alternador de Tema (Fixo)**: O botão de tema na Navbar e no MobileMenu reflete o estado atual (Lua violeta no Dark Mode, Sol amarelo no Light Mode).
- **Web Audio API**: Geração de som 8-bit e digital para cliques e interações com abas e pastas do site.

---
**Documentação atualizada em: 14 de Junho de 2026.**
