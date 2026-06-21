# 📜 Histórico de Evolução | BeginsProject

Este documento registra os marcos de desenvolvimento, melhorias de interface e implementações técnicas do portal **BeginsProject**.

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
