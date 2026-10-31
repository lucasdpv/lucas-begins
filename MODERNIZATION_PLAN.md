# 🗺️ Roadmap de Modernização Visual, UX & Código — BeginsProject (v6.1.0)

> **Instrução para IA / Agentes Futuros**: Este documento é a fonte oficial da verdade para a evolução e polimento do portal **BeginsProject**. Sempre que retomar o trabalho neste projeto, leia a seção **"📍 Status Atual"** abaixo, verifique as entregas concluídas e consulte o [`BACKLOG.md`](./BACKLOG.md) para as próximas evoluções.

---

## 📍 Status Atual
- **Versão Atual**: `v6.1.0 — The Categories, Chapters & Performance Update`
- **Status**: `Fase 8 Concluída e Documentada! ✅`
- **Última Atualização**: 31 de Outubro de 2026
- **Diretriz Estética**: **Cyber-Editorial + Geek Streaming Portal (Estilo Netflix / Crunchyroll / Polygon / The Verge)** — Fundo profundo cinematográfico (`#090812`), iluminação ambiente estilo **TV Ambilight** sem borda recortada, bordas finas translúcidas (`border-white/[0.08]`), cantos arredondados modernos (`rounded-2xl` / `rounded-3xl`), container widescreen (`1760px`) e foco total nas artes de games, animes e nostalgia.

---

## 🧭 Fase 8 — Categorias, Capítulos & Performance (v6.1.0) (✅ CONCLUÍDA)
- [x] **8.1. Categorias reduzidas de 11 para 4** (`Reviews`, `Dossiê`, `Animes & TV`, `RetroCafé`) com fonte única em `src/features/posts/utils/categoryInfo.ts`, descrições exibidas no Catálogo e na Home e matérias migradas no Firestore.
- [x] **8.2. Pílula flutuante de capítulos** (`PostDetail/ChapterPill.tsx`) no lugar da barra de progresso de leitura.
- [x] **8.3. Remoção da tradução via Google Translate** (`TranslationContext`, `LanguageSelector`), que conflitava com o React.
- [x] **8.4. Remoção do seed/limpeza automática** (`SystemInitializer`, `SeedData`, `CleanUp`, `mockData`).
- [x] **8.5. Catálogo, menu de categorias e cabeçalhos** simplificados e alinhados; cards de Dossiê no formato pôster.
- [x] **8.6. Correção de classes Tailwind inexistentes** (inclui o bug da imagem no modal de compartilhar).
- [x] **8.7. Performance**: carrossel com montagem sob demanda, fundo global sem desfoques animados e menos consultas ao Firestore na Home.

> Pendências desta fase estão na seção **"0. Pendências da v6.1.0"** do [`BACKLOG.md`](./BACKLOG.md).

---

## 🎬 Fase 7 — Redesign Completo: Cyber-Editorial + Streaming Geek (✅ CONCLUÍDA)
- [x] **7.1. Nova Identidade Global (`src/index.css` + `Navbar.tsx` + `Footer.tsx`)**
  - Fundo dark cinematográfico (`#090812`) com mesh radial sutil, header flutuante translúcido (`backdrop-blur-2xl`), assinatura **`GAMES · ANIMES · NOSTALGIA`** sob o logotipo `BEGINSPROJECT` na Navbar, MobileMenu e Footer, e barra de busca central ampla com dropdown glassmórfico (`minWidth: 420px`).
- [x] **7.2. Billboard Hero Panorâmico Estilo Streaming (`Carousel.tsx` + `HomePage.tsx`)**
  - Hero 100% full-width com selo `"Destaque #1"`, botão principal `"▶ Ler Matéria"` e dock de miniaturas fixo e estável no canto inferior direito com barra de progresso ao vivo.
- [x] **7.3. Trilho "Top 5 Em Alta Hoje" Estilo Netflix Top 10 (`HomePage.tsx` + `.netflix-rank`)**
  - Fileira horizontal de 5 colunas com números gigantes vazados (`1` a `5`) que se preenchem com **dourado sólido (`#fbbf24`)** e brilho âmbar ao passar o mouse, além de fallback de gradiente (`onError`) para imagens indisponíveis.
- [x] **7.4. Cards Cyber-Editoriais & Limpeza da Home (`PostCard.tsx` + `HomePage.tsx`)**
  - Cards redesenhados com `rounded-2xl`, `border-white/[0.08]` e brilho colorido por categoria; remoção da barra de pílulas intermediária redundante na Home.
- [x] **7.5. Séries & Coleções Originais (`RetroCafé`, `Dossiês` e `Reviews` em `HomePage.tsx`)**
  - **RetroCafé**: Posters verticais `3:4` estilo série original (`EPISÓDIO #01`) com aura laranja reativa ao hover.
  - **Dossiês**: Cards widescreen confidenciais (`ARQUIVO #01`) com feixe de laser azul no hover.
  - **Reviews**: Vitrine de vereditos com nota em destaque e máscara de gradiente suave sobre a arte do jogo.
- [x] **7.6. Catálogo Completo (`ArchivePage.tsx`) & Leitura Cinematográfica (`PostDetailPage.tsx` + `PostHero.tsx`)**
  - Página de arquivo transformada em **Catálogo Completo** com pílulas de gênero/setor, e página de artigo unificada com `PostHero`, `Sinopse` e `Capítulos da Matéria` em acabamento Cyber-Editorial.
- [x] **7.7. Expansão Widescreen Desktop (`ClientLayoutWrapper.tsx` + `Navbar.tsx` + `Footer.tsx` + `HomePage.tsx`)**
  - Container principal, Navbar e Footer expandidos via `.layout-container` (`max-width: 1760px`) em [`src/index.css`](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/index.css), exibindo 6 cards em *Recém-Adicionados* e 4 colunas no *Catálogo Completo* (`2xl:grid-cols-4`).
- [x] **7.8. Padronização Tipográfica da Navbar & Busca Logado/Deslogado (`Navbar.tsx` + `NavCategoryMenu.tsx` + `NavUserMenu.tsx` + `LanguageSelector.tsx`)**
  - Padronização de 100% dos itens da Navbar para `font-retro font-black text-xs uppercase tracking-widest leading-none`.
- [x] **7.9. Remoção Temporária do Botão de Tema, Atualização de Todos os Skeletons, Páginas Internas e Overlays**
  - Modo escuro fixado (`isDark: true`) em [`useThemeStore.ts`](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/store/useThemeStore.ts) e botão ocultado até a futura refatoração dedicada de temas.
  - Atualização de 100% dos Skeletons ([`CarouselSkeleton.tsx`](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/components/CarouselSkeleton.tsx), [`PostSkeleton.tsx`](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/components/PostSkeleton.tsx), [`PostDetailSkeleton.tsx`](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/posts/components/PostDetailSkeleton.tsx)), páginas internas ([`AboutPage.tsx`](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/views/AboutPage.tsx), [`ContactPage.tsx`](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/views/ContactPage.tsx), [`DashboardPage.tsx`](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/views/DashboardPage.tsx), [`PrivacyPolicyPage.tsx`](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/views/PrivacyPolicyPage.tsx), [`NotFoundPage.tsx`](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/views/NotFoundPage.tsx)) e overlays globais ([`LoginModal.tsx`](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/features/auth/components/LoginModal.tsx), [`ShareModal.tsx`](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/components/ui/ShareModal.tsx), [`CookieConsent.tsx`](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/components/ui/CookieConsent.tsx), [`BackToTop.tsx`](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/components/ui/BackToTop.tsx), [`Toast.tsx`](file:///c:/Users/Lucas%20Vieira/Documents/Projetos/lucas-begins/src/components/ui/Toast.tsx)).
- [x] **7.10. Efeito TV Ambilight (Extensão de Luz da Cena) & Transição Cinematográfica (`Carousel.tsx` + `PostHero.tsx`)**
  - Projeção **Ambilight de dupla camada** sem recorte (`blur-[110px] saturate-[1.85] -inset-16` + `blur-[48px] saturate-[1.6] -inset-4`) com crossfade suave de `1.4s` sincronizado com a troca de slides.
- [x] **7.11. Recomendações Dinâmicas em "Continue Explorando" (`PostDetailPage.tsx` + `PostRelated.tsx`)**
  - Pool dinâmico combinando matérias da mesma categoria (`usePostsByCategory`), recentes (`useLatestPosts(12)`) e populares (`usePopularPosts(12)`), embaralhados por matéria (`seededShuffle`) + botão interativo **"Outras Sugestões"**.
- [x] **7.12. Correção da Barra de Leitura via Portal & Responsividade Mobile do Autor/Veredito (`PostDetailPage.tsx` + `PostAuthorBox.tsx` + `PostVerdict.tsx`)**
  - Barra de leitura renderizada via `createPortal(..., document.body)` no topo real do navegador e remoção do `line-clamp-2` que cortava a bio do autor em telas portáteis.

---

## ⚡ Fase 6 — Modern Web Platform Enhancements (`modern-web-guidance`) (✅ CONCLUÍDA)
- [x] **6.1 a 6.6**: `text-wrap: balance/pretty`, `interpolate-size: allow-keywords`, Scroll-Driven EXP Bar, `content-visibility: auto`, `fetchPriority="high"` e máscaras de fade em trilhos horizontais.

---

## 🔮 Próximas Evoluções (Mapeadas no [`BACKLOG.md`](./BACKLOG.md))
1. **Refatoração Futura do Modo Claro / Modo Escuro (Theme Engine v2)**: Criar paleta e tokens dedicados para o Modo Claro antes de reativar o botão de alternância de tema.
2. **Modernização Visual do Painel Admin e Editor de Posts (`AdminDashboard.tsx` / `PostEditorPage.tsx`)**: Opcionalmente aplicar o visual Cyber-Editorial às telas internas de administração.
3. **Ajuste de Conteúdo no Firestore (Via Painel Admin)**: Corrigir typo no subtítulo de *"Batman no SNES"* e atualizar capa de *"Diablo 4 Lord of Hatred"*.
4. **Limpeza de Dependências Legadas & Testes**: Remover pacotes residuais do Vite (`react-helmet-async`, `vite`), atualizar `eslint.config.js` e expandir testes.
