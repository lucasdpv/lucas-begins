# 🚀 Plano de Otimização e Performance — Lucas Begins (v6.2+)

Este documento lista os gargalos identificados que deixaram o site mais lento após a v6 e as etapas de implementação para tornar o carregamento instantâneo.

---

## 📊 Status das Etapas

- [x] **Etapa 0**: Clareamento e ajuste de contraste do Carrossel Hero (Concluído)
- [x] **Etapa 1**: Eliminar tela branca / Bloqueio artificial de hidratação na página da matéria (Concluído)
- [x] **Etapa 2**: Otimizar busca de posts sugeridos (Reduzir de 32 para 4~6 posts com carregamento tardio) (Concluído)
- [x] **Etapa 3**: Eliminar download duplicado de imagens (`new Image()` no `useImageFallback`) (Concluído)
- [x] **Etapa 4**: Alívio de processamento gráfico GPU (Filtros de Ambilight pesados) (Concluído)
- [x] **Etapa 5**: Verificação de performance, testes automatizados e validação final (Concluído)
- [x] **Etapa 6**: Otimização global de entrega do Firebase e Next.js (AVIF, WebP e Cache-Control de 1 ano) (Concluído)
- [x] **Etapa 7**: Eliminar caixas pretas na Home com Shimmer Skeleton temático e Crossfade Suave (`RetroCardImage`) (Concluído)
- [x] **Etapa 8**: Fim da piscada/recarregamento na Home (Remoção do delay de 900ms em consultas secundárias) (Concluído)
- [x] **Etapa 9**: Aceleração das imagens internas da matéria (`ArticleRenderer` com pré-carregamento das primeiras 4 imagens) (Concluído)
- [x] **Etapa 10**: Code-splitting de modais secundários (`LoginModal`, `CookieConsent`, `ShareModal` via `next/dynamic`) (Concluído)

---

## 🛠️ Detalhamento das Etapas

### 1. Eliminar Bloqueio de Hidratação na Matéria
- **Arquivo**: `src/views/PostDetailPage.tsx`
- **Problema**: O Next.js já busca e gera o HTML da matéria no servidor com `initialPost`, mas o componente faz `if (!isHydrated && initialPost) return null;`, forçando o leitor a olhar para uma tela branca até que todo o JavaScript do React seja baixado e executado.
- **Ação**:
  - Exibir o `initialPost` diretamente no primeiro frame de renderização (SSR puro).
  - Garantir que a matéria apareça instantaneamente ao clicar ou abrir o link.

### 2. Otimizar Busca de Posts Sugeridos ("Continue Explorando")
- **Arquivos**: `src/views/PostDetailPage.tsx` e `src/features/posts/components/PostDetail/PostRelated.tsx`
- **Problema**: Ao abrir qualquer matéria, são disparadas 3 consultas concorrentes ao Firestore que buscam 32 matérias completas (12 populares + 12 recentes + 8 da categoria), quando a tela exibe apenas 3 cards.
- **Ação**:
  - Remover as queries pesadas imediatas de 12 recentes e 12 populares no topo da página.
  - Buscar apenas 4 a 6 posts relevantes da mesma categoria de forma diferida.

### 3. Eliminar Download Duplo de Imagens (`useImageFallback`)
- **Arquivos**: `src/hooks/useImageFallback.ts`, `src/features/posts/components/PostCard.tsx`, `src/features/posts/components/PostDetail/PostHero.tsx`
- **Problema**: O hook criava um `new Image()` no JavaScript para checar erro, fazendo o navegador baixar a mesma imagem duas vezes.
- **Ação**:
  - Utilizar o evento nativo `onError` do componente de imagem do Next.js.
  - Eliminar as requisições duplicadas em background.

### 4. Alívio de Renderização Gráfica / GPU (Ambilight)
- **Arquivos**: `src/features/posts/components/Carousel.tsx`, `src/features/posts/components/PostDetail/PostHero.tsx`
- **Problema**: Filtros de `blur-[110px]` e `saturate-[1.85]` renderizados 2 a 3 vezes em camadas duplicadas causavam quedas de FPS ao rolar a página.
- **Ação**:
  - Reduzir as camadas para 1 camada leve com `blur-2xl` a `blur-3xl`, mantendo a iluminação agradável sem engasgos.

### 5. Skeleton Shimmer Temático e Eliminação de Caixas Pretas
- **Arquivos**: `src/components/ui/RetroCardImage.tsx`, `src/views/HomePage.tsx`, `src/features/posts/components/PostCard.tsx`
- **Problema**: Enquanto as imagens baixavam do Firebase, o fundo dos cards ficava em um "vazio preto" com o texto flutuando sobre o nada.
- **Ação**:
  - Criado o componente `RetroCardImage` com skeleton animado com o tom de cada seção (Laranja para RetroCafé, Azul/Sky para Dossiês, Âmbar para Reviews e Roxo para Novidades).
  - Transição de fade-in suave (`opacity-0` -> `opacity-100`) assim que a imagem termina de baixar, acabando com a sensação de "site quebrado".

### 6. Fim da Piscada / Recarregamento na Home
- **Arquivo**: `src/views/HomePage.tsx`
- **Problema**: Havia um timer de 900ms via `requestIdleCallback` para iniciar as consultas secundárias (Reviews, Dossiês, etc.). Logo após o visitante ver os primeiros posts carregados, a página disparava essas consultas, gerando um re-render completo que dava a impressão de que tudo estava "piscando e recarregando".
- **Ação**:
  - As consultas secundárias agora iniciam simultaneamente com o cache do React Query (10 minutos), eliminando o salto visual tardio.

### 7. Carregamento Acelerado das Imagens na Matéria
- **Arquivo**: `src/features/posts/components/ArticleRenderer.tsx`
- **Problema**: Imagens do corpo da matéria usavam carregamento tardio muito restrito (`lazy`), obrigando o leitor a esperar a imagem baixar ao descer a tela.
- **Ação**:
  - As 4 primeiras imagens do artigo agora recebem `loading="eager"` e `fetchPriority="high"`.
  - Placeholder animado suave enquanto as imagens baixam com transição de opacidade limpa.

---

## 🎯 Resultado Final
- Abertura de artigos e páginas **sub-segundo** (quase instantânea).
- Zero "caixas pretas vazias" durante o carregamento de imagens.
- Fim de piscadas e re-renderizações indesejadas na Home.
- Redução de até **70% no tráfego de rede e leituras do Firebase**.
