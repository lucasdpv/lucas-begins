# 📋 Backlog de Melhorias e Pendências — BeginsProject (v6.3.0)

Este documento lista as próximas evoluções planejadas, refatorações futuras e melhorias técnicas após o lançamento da **v6.3.0 (The Hyper-Speed & Visual Polish Update)**.

---

## ⚡ Concluído na v6.3.0
- [x] **Renderizar o conteúdo da matéria no servidor (SEO & Performance)**
  * **Concluído**: Removido o bloqueio de hidratação (`if (!isHydrated && initialPost) return null`) em `PostDetailPage.tsx`. A matéria agora renderiza instantaneamente no primeiro frame (SSR puro) sem tela branca.
- [x] **Eliminação de caixas pretas e placeholders de imagem**
  * **Concluído**: Criado `RetroCardImage.tsx` com shimmer skeleton temático e fade-in suave em todas as seções da Home e cards do Catálogo.
- [x] **Fim da piscada e recarregamento da Home**
  * **Concluído**: Consultas simultâneas sem delay artificial, aproveitando o cache em memória do TanStack Query.
- [x] **Pipeline de Imagens com AVIF, WebP e Cache de 1 ano**
  * **Concluído**: `next.config.js` com AVIF/WebP e headers de 1 ano (`immutable`) no Firebase Storage com WebP client-side a 0.78.

---

## 📰 Pendências da v6.2.0 / v6.3.0

- [ ] **Remover o card antigo (`PostCard` com `variant="default"`)**
  * **Contexto**: Desde a v6.2.0 o Catálogo usa o card pôster (`variant="vintage"`); o formato widescreen antigo não é usado em nenhum lugar.
- [ ] **Renomear `variant="vintage"` para `variant="poster"`**
  * **Contexto**: O nome vem do antigo card horizontal e não descreve mais o formato atual.
- [ ] **Verificar no celular de verdade**
  * **Contexto**: A responsividade da v6.2.0 foi testada em telas simuladas (390px, 820px, 1024px, 1440px). Vale abrir o site publicado num celular e num tablet reais, principalmente a folha de capítulos e a barra de rolagem nativa.

---

## 🗂️ 0. Pendências da v6.1.0

- [ ] **Limpeza manual no Painel (Firestore)**
  * Apagar as 3 matérias de teste herdadas do antigo `mockData.ts`: *SNK NeoGeo 2026*, *A Ascensão Contínua dos Soulslike* e *Mídia Física vs O Futuro Digital*.
  * Apagar as 8 categorias antigas da coleção `categories`: Artigos, Especial, RPG & MMO, Notícias, Nostalgia, Tech & Futuro, Retro e Cultura Pop.
- [ ] **Remover a aba "Categorias" do Painel (`TabCategories.tsx`)**
  * **Contexto**: Desde a v6.1.0 as categorias são definidas no código (`categoryInfo.ts`); depois da limpeza acima, a aba perde a função.
- [ ] **Centralizar cores e ícones por categoria**
  * **Contexto**: O mapeamento por palavra-chave está duplicado em `Badge.tsx`, `PostCard.tsx`, `PostHero.tsx`, `Carousel.tsx`, `ArchivePage.tsx` e `categoryIcons.tsx`.
  * **Objetivo**: Mover para `categoryInfo.ts`, de modo que adicionar uma categoria exija editar um único arquivo.
- [ ] **Renderizar o conteúdo da matéria no servidor (SEO)**
  * **Contexto**: `PostDetailPage.tsx` retorna `null` até a hidratação (`if (!isHydrated && initialPost) return null`), então o HTML do servidor chega sem o texto da matéria, apenas com metadados e JSON-LD.
  * **Objetivo**: Renderizar o artigo já no HTML do servidor para melhorar indexação e avaliação do AdSense.
- [ ] **Remover componente sem uso (`src/components/home/HomeEditorialSections.tsx`)**
  * **Contexto**: Não é importado em nenhum lugar desde o redesign da v6.0.0.
- [ ] **Tradução real (opcional, futuro)**
  * **Objetivo**: Se houver público internacional, gerar uma versão em inglês das matérias no momento da publicação (DeepL/LLM), salvar no Firestore e servir em rotas `/en/...`, com `next-intl` para os textos da interface. Não reintroduzir widgets que reescrevem o DOM (Google Translate).

---

## 🎨 1. Design System & Interface (Próximos Passos)

- [ ] **Refatoração Completa do Modo Claro / Modo Escuro (Theme Engine v2)**
  * **Contexto**: Desde a v6.0.0, o botão de alternância de tema foi ocultado temporariamente e o portal foi travado em `isDark: true` (`useThemeStore.ts`) para garantir 100% de fidelidade na estética Cyber-Editorial escura.
  * **Objetivo**: Projetar um **Modo Claro Editorial** dedicado (com variáveis CSS semânticas para superfícies, sombras, bordas e contrastes de badges) em vez de inversões simples de classes, reativando o seletor quando ambos os temas estiverem perfeitos.
- [ ] **Modernização Visual do Painel Admin (`AdminDashboard.tsx`) e Editor de Posts (`PostEditorPage.tsx`)**
  * **Objetivo**: Aplicar o mesmo acabamento Cyber-Editorial (`#121024`, `border-white/[0.08]`, `rounded-2xl`) às abas internas do Painel Administrativo e à tela de criação/edição de matérias (atualmente funcionais e restritas a administradores).
- [ ] **Revisão de Conteúdo no Firestore (Via Painel Admin)**
  * **Objetivo**: Corrigir pequenos erros de digitação em subtítulos antigos cadastrados no Firestore (ex.: *"Batman no SNES"* — `"DEFENIU"` → `"DEFINIU"`, `"JUSS"` → `"JUS"`) e reenviar a imagem de capa da matéria *"Diablo 4 Lord of Hatred"* caso o link externo antigo esteja expirado.

---

## 🔒 2. Segurança & Banco de Dados (Firebase)

- [ ] **Deploy da Regra Estrita de Visualizações (`firestore.rules`)**
  * **Objetivo**: Garantir que a regra local de incremento unitário estrito (`views == views + 1`) esteja publicada no ambiente de produção do Firebase.
  * **Ação**: Executar `firebase deploy --only firestore:rules`.
- [ ] **Restrição de Origens no CORS (`cors.json`)**
  * **Objetivo**: Substituir o wildcard `*` por origens seguras em produção (`https://lucasbegins.com.br`, previews da Vercel e `http://localhost:3000`).

---

## 🛠️ 3. Qualidade de Código, Limpeza de Legado & Linting

- [ ] **Remoção de Dependências Legadas da Migração Vite → Next.js**
  * **Objetivo**: Remover pacotes residuais que não são mais necessários no Next.js 16 App Router (`react-helmet-async`, `react-router-dom`, `vite`, `@vitejs/plugin-react` em `package.json`) após migrar os últimos imports internos para o `router-compat.tsx` nativo.
- [ ] **Migração do ESLint 9 para Padrão Next.js (`eslint.config.js`)**
  * **Objetivo**: Ativar linting completo em arquivos `.ts` e `.tsx` com `eslint-config-next`.
- [ ] **Padronização de Variáveis de Ambiente (`NEXT_PUBLIC_`)**
  * **Objetivo**: Remover o fallback de variáveis antigas `VITE_` no `next.config.mjs` após confirmar que todas as chaves na Vercel utilizam `NEXT_PUBLIC_`.

---

## 🧪 4. Cobertura de Testes Automatizados

- [ ] **Testes Unitários do `ArticleRenderer.tsx` (Vitest + Testing Library)**
  * **Objetivo**: Validar a renderização de blocos customizados (`:::pullquote`, `:::info-box`, `:::columns-2`, `@[youtube]`, molduras `{#frame-crt}`).
- [ ] **Testes E2E de Fluxos Críticos (Playwright)**
  * **Objetivo**: Cobrir busca na Navbar, leitura de artigos, envio de comentários e publicação no editor.
