# ⚙️ Documentação Técnica — BeginsProject

Este documento detalha a arquitetura de software, o sistema de design e as decisões de engenharia da versão **v4.1.0**.

---

## 🚀 Tecnologias Core
- **Frontend**: React 19 + Vite + TypeScript.
- **Estilização**: Tailwind CSS (Design Neo-Brutalista).
- **Backend**: Firebase (Firestore + Auth + Storage).
- **Gerenciamento de Dados**: TanStack Query v5 (React Query).
- **Estado Global**: Zustand (UI/Tema) + Context API (Auth).
- **Animações**: Framer Motion (transitions, dropdowns, lightbox).
- **Busca Aproximada**: Fuse.js (tolerância a erros e acentuação).
- **Síntese de Áudio**: Web Audio API (geração de efeitos sonoros nativos sem arquivos externos de mídia).

---

## 🏗️ Arquitetura de Estado

O projeto utiliza uma abordagem híbrida para máxima performance:

### 1. Zustand (Estado de Interface)
Localizado em `src/store/`, gerencia estados que não precisam de persistência no banco ou que exigem atualizações atômicas:
- **`useUIStore`**: Controla busca, categoria ativa, modais e sistema de Toasts.
- **`useThemeStore`**: Gerencia a alternância entre os temas **Dark** e **SNES (Light)**.

### 2. Context API (Autenticação)
- **`AuthProvider`**: Envolve a aplicação para prover o estado do Firebase Auth (`currentUser`) e métodos de login/logout.
- **`TranslationProvider`**: Gerencia o idioma ativo e injeta/controla o Google Translate Element API de forma transparente.

### 3. TanStack Query (Camada de Dados)
Localizado em `src/features/*/hooks/`, gerencia o cache do servidor:
- **Invalidação Inteligente**: Ao curtir, comentar ou deletar, o sistema invalida as chaves (`postKeys`) para garantir que os dados na tela estejam sempre frescos.
- **Optimistic UI**: Implementado em curtidas e favoritos para dar resposta instantânea ao usuário.

---

## 🧩 Estrutura de Pastas (Modular)

O projeto segue o padrão de **Features**, onde cada funcionalidade importante tem seu próprio ecossistema:

### `src/features/`
- **`admin/`**: Contém componentes exclusivos do painel (Tabs, Inbox) e o hook `useAdminActions`.
- **`posts/`**: Componentes de PostCard, Carousel, Skeletons e os hooks de consulta de posts e categorias.
- **`auth/`**: Componentes de Login e proteção de rotas.

### `src/services/`
- **`PostService.ts`**: Abstração pura do Firestore. Não contém lógica de UI, apenas chamadas de rede.
- **`userService.ts`**: Lógica de gamificação (XP), favoritos e perfis.
- **`uploadService.ts`**: Upload de imagens para o Firebase Storage com conversão automática para WebP.

### `src/lib/`
- **`cropUtils.ts`**: Utilitários de corte de imagem, incluindo `getProxiedUrl` para bypass de CORS no canvas.

---

## 🖼️ Sistema de Imagens Premium (v3.10.0)

### Proporções & Molduras no BlockEditor
O editor de blocos suporta configuração visual de cada bloco de imagem:
- **Aspect**: `original`, `1:1`, `16:9`, `4:5` — serializados no Markdown como `{#aspect-X}`.
- **Frame Style**: `normal`, `crt`, `sticker`, `none` — serializados como `{#frame-Y}`.
- **Scanlines**: `true/false` — serializado como `{#scanlines-false}`.

### CORS Proxy para Corte de Imagens Remotas
Para evitar erros de `canvas tainted` ao cortar imagens do Firebase Storage, usamos um proxy same-origin:
- **Dev**: Vite proxy `/firebase-storage` → `https://firebasestorage.googleapis.com`.
- **Produção**: Rewrite no `vercel.json` com o mesmo padrão de proxy.
- Função utilitária `getProxiedUrl(url)` em `cropUtils.ts` reescreve a URL automaticamente.

### Lightbox de Zoom
Implementado diretamente em `ArticleRenderer.tsx` sem dependências externas. Estado local `isZoomed` por componente `ArticleImage`, com overlay full-screen, backdrop blur, borda neon, ESC para fechar.

---

## 🎮 Gamificação e Regras de Negócio

### Sistema de XP
Os usuários ganham XP por interações, persistido no Firestore:
- **Ler Artigo**: +10 XP
- **Curtir**: +5 XP
- **Comentar**: +20 XP
- **Favoritar**: +15 XP
- **Responder Comentário**: +10 XP

### Estratégia de Busca & Smart Nav
Na **HomePage**, optamos por carregar todos os posts ativos via `useAllPosts()` e filtrar localmente:
- **Smart Navigation**: O menu de categorias agora é dinâmico. Ele verifica se existem posts publicados em cada categoria e oculta as vazias automaticamente.
- **Fuzzy Search**: Integração do Fuse.js para pesquisa tolerante a erros de digitação e ausência de acentos.
- **Vantagem**: Busca e troca de categorias instantâneas (zero delay) e uma interface sempre limpa.

### Novo Mecanismo de Visualizações (v3.10.1)
Para mitigar os erros de permissão de escrita para usuários não autenticados (guests) no Firestore, a contagem de visualizações foi simplificada e blindada:
- **Controle de Duplicados Local**: As postagens já visualizadas pelo usuário são salvas no `localStorage` do navegador sob a chave `retro_viewed_posts`.
- **Gravação Atômica e Leve**: Em vez de armazenar o histórico de IDs de visualizadores em uma array `viewedBy` no banco (o que corria o risco de estolar o limite de 1MB por documento do Firestore), usamos a função `increment(1)` nativa do Firestore.
- **Segurança Otimizada**: Recomenda-se a regra de segurança do Firebase que permite escritas de atualização por usuários anônimos se e somente se o único campo sendo modificado for `views` (`request.resource.data.diff(resource.data).affectedKeys().hasOnly(['views'])`).

---

## 🎨 Design System: Neo-Brutalist Clássico & Temático (v4.0.0 / v4.1.0)

A estética do portal evoluiu para um Neo-Brutalismo clássico marcante, com elementos e decks temáticos inspirados na era retro:

### 1. Diretrizes Visuais Core (v4.0.0)
- **Cantos Retos**: Todos os componentes (cards, modais, botões, inputs e avatares) usam `rounded-none`, abandonando cantos arredondados por completo.
- **Fundos Sólidos**: Transição de efeitos glassmorphic para fundos opacos e sólidos (`bg-[#1f1d35]` no tema escuro e `bg-white` no claro), garantindo contraste máximo.
- **Bordas Pretas & Sombras 2D Offset**: Uso sistemático de `border-2 border-black` com sombras sólidas brutas (`shadow-[4px_4px_0px_rgba(0,0,0,1)]`).
- **Animações de Hover Brutalistas**: Elevação física da sombra para 8px acompanhada de deslocamento de translação e transição da borda para roxo vibrante (`border-purple-500`).
- **Fundo Mais Lidos com Imagem Dinâmica**: Efeito de hover na lista "Mais Lidos" que projeta e suaviza a imagem do post correspondente no fundo direito da seção com máscara gradiente `mask-image`.

### 2. Decks e Painéis Temáticos (v4.1.0)
- **Banca de Revistas (RetroCafé)**: Cards verticais que emulam capas de revistas de videogame dos anos 90, contendo preço decorativo em Cruzeiros (Cr$), código de barras e logotipo estilizado da revista física.
- **Arquivo Confidencial (Dossiês)**: Cards simulando pastas de arquivo manila com abas de categorização numeradas, clipes de papel metálicos no topo, carimbo vermelho "CLASSIFICADO", imagens em formato de fotografia Polaroid real (aspecto 4:3) e um feixe de laser azul de escaneamento que varre verticalmente o card no hover.
- **Reviews com Fade Retro-Moderno**: Cards horizontais bipartidos onde a imagem do jogo ocupa 65% da largura sob uma máscara de gradiente fade (`linear-gradient(to right, transparent, bg-color)`) de 70% de largura, integrando-se suavemente ao texto do card na esquerda (50% de largura). Textura de scanlines restrita à imagem preserva a legibilidade do texto.
- **Score Badges Metálicos Dourados**: Emblemas de nota de análises redesenhados com um gradiente metálico dourado brilhante de alta definição, com borda neobrutalista grossa, que escala, brilha e se eleva no hover.

### 3. Síntese de Áudio Nativa (Web Audio API)
- **Zero Dependência de Arquivos Externos**: Implementado um sintetizador de som leve diretamente em código usando a API de Áudio do navegador.
- **Efeitos Sonoros Retro**:
  - *Clique 8-bit*: Onda quadrada com decaimento rápido de frequência de 800Hz para 150Hz em 80ms para simular a seleção de botões clássicos do NES/SNES.
  - *Som Mecânico / Laser*: Onda triangular simulando um clique de gaveta ou escaneamento de disco mecânico ao abrir pastas e interagir com elementos interativos.

---

## 🌐 Internacionalização & Proteção de Marca

A tradução é fornecida pelo Google Translate Element (via `TranslationContext.tsx`):
- Idiomas suportados: PT, EN, ES, FR, JA, DE.
- O nome da marca **BeginsProject** é protegido contra tradução em todos os componentes via `translate="no"` + classe `notranslate`.

---
**Documentação atualizada em: 28 de Maio de 2026.**
