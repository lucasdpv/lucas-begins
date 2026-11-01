# 🕹️ Bem-vindo ao BeginsProject — Guia do Desenvolvedor (v6.2.0)

Este guia foi criado para que você entenda rapidamente como o **BeginsProject** funciona e como contribuir mantendo a consistência visual e arquitetural do portal.

---

## 🌟 1. Visão Geral e Estética (Cyber-Editorial + Streaming Geek)
O **BeginsProject** é um portal dedicado a **Games, Animes e Nostalgia**. Nossa identidade visual combina a imersão de plataformas de streaming (*Netflix*, *Crunchyroll*, *Apple TV+*) com o acabamento de revistas digitais modernas (*Polygon*, *The Verge*):

- **Fundo & Superfícies**: Backdrop escuro cinematográfico (`#090812`), cards em `#121024/90` com `backdrop-blur-xl`, bordas finas translúcidas (`border-white/[0.08]`) e cantos arredondados (`rounded-2xl` / `rounded-3xl`).
- **TV Ambilight**: O carrossel de destaque e a capa das matérias projetam as cores da arte no ambiente ao redor em camadas difusas (`blur-[110px]`).
- **Layout Widescreen**: Utilizamos a classe `.layout-container` (`max-width: 1760px`) para aproveitar telas grandes sem espaços laterais desperdiçados.
- **Tema**: Atualmente o portal opera exclusivamente no **Modo Escuro** (`isDark: true` fixado em `useThemeStore.ts`) até a futura refatoração dedicada do sistema de temas Claro/Escuro.
- **Categorias**: 4 categorias oficiais (`Reviews`, `Dossiê`, `Animes & TV`, `RetroCafé`) definidas em `src/features/posts/utils/categoryInfo.ts`. Veja [MAINTENANCE.md](./MAINTENANCE.md) para adicionar ou renomear.
- **Tailwind 3.4**: Use apenas valores da escala padrão (ex.: `w-16`, `w-20`, `scale-105`) ou valores arbitrários (`w-[4.5rem]`, `scale-[1.08]`). Classes como `w-18` ou `scale-108` não existem nesta versão e são ignoradas sem erro.
- **`line-clamp` + responsivo**: para esconder um texto cortado só no celular, use `max-sm:hidden` (e não `hidden sm:block`, que anula o `line-clamp`).
- **Breakpoints de layout**: celular `< 640px`, tablet com design de computador a partir de `lg` (1024px) e ajustes finos de computador em `xl` (1280px). Teste sempre nas três faixas.

---

## 🛠️ 2. Stack Tecnológica
- **Core**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) + **TypeScript 6**.
- **Data Fetching & Cache**: [@tanstack/react-query v5](https://tanstack.com/query/latest).
- **State Management**: [Zustand v5](https://zustand-demo.pmnd.rs/) (`useUIStore`, `useThemeStore`).
- **Backend**: [Firebase](https://firebase.google.com/) (Cloud Firestore, Authentication e Storage).
- **Estilização & Motion**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/).
- **Validação**: [Zod v4](https://zod.dev/).

---

## 📂 3. Estrutura de Pastas (v6.2.0)

```text
src/
├── app/            # Rotas Next.js App Router (SSR, Metadata, Sitemap, Robots)
├── views/          # Views completas das páginas (HomePage, ArchivePage, PostDetailPage, etc.)
├── features/       # Módulos de domínio
│   ├── posts/      # Carousel, PostCard, ArticleRenderer, PostDetail/*, Skeletons, hooks e schemas
│   ├── auth/       # LoginModal, AuthGate, ProtectedRoute
│   └── admin/      # Painel de Controle, Tabs e ações administrativas
├── services/       # Camada de Dados (postService, userService, uploadService)
├── components/
│   ├── ui/         # Componentes base (Badge, ShareModal, CookieConsent, BackToTop, Toast)
│   └── layout/     # Navbar, Footer, MobileMenu, NavCategoryMenu, NavUserMenu
├── store/          # Zustand Stores (useUIStore, useThemeStore)
├── context/        # AuthProvider (Sessão Firebase + Cookies p/ Middleware)
└── lib/            # Utilitários, router-compat, Firebase init e helpers
```

---

## 🚀 4. Como Rodar o Projeto
1. Instale as dependências: `npm install`
2. Configure o arquivo `.env.local` com as chaves `NEXT_PUBLIC_FIREBASE_*`.
3. Inicie o servidor Next.js: `npm run dev`
4. Acesse `http://localhost:3000`.

---
> [!TIP]
> Para detalhes de arquitetura e Design System, consulte [DOCUMENTATION.md](./DOCUMENTATION.md). Para acompanhar o que já foi feito e os próximos passos, veja [MODERNIZATION_PLAN.md](./MODERNIZATION_PLAN.md) e [BACKLOG.md](./BACKLOG.md).
