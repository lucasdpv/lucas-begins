# ⚙️ Documentação Técnica — Lucas Begins

Este documento detalha a arquitetura de software, o sistema de design e as decisões de engenharia da versão **v2.3.0+**.

---

## 🚀 Tecnologias Core
- **Frontend**: React 19 + Vite + TypeScript.
- **Estilização**: Tailwind CSS (Design Neo-Brutalista).
- **Backend**: Firebase (Firestore + Auth).
- **Gerenciamento de Dados**: TanStack Query v5 (React Query).
- **Estado Global**: Zustand (UI/Tema) + Context API (Auth).

---

## 🏗️ Arquitetura de Estado

O projeto utiliza uma abordagem híbrida para máxima performance:

### 1. Zustand (Estado de Interface)
Localizado em `src/store/`, gerencia estados que não precisam de persistência no banco ou que exigem atualizações atômicas:
- **`useUIStore`**: Controla busca, categoria ativa, modais e sistema de Toasts.
- **`useThemeStore`**: Gerencia a alternância entre os temas **Dark** e **SNES (Light)**.

### 2. Context API (Autenticação)
- **`AuthProvider`**: Envolve a aplicação para prover o estado do Firebase Auth (`currentUser`) e métodos de login/logout.

### 3. TanStack Query (Camada de Dados)
Localizado em `src/features/*/hooks/`, gerencia o cache do servidor:
- **Invalidação Inteligente**: Ao curtir, comentar ou deletar, o sistema invalida as chaves (`postKeys`) para garantir que os dados na tela estejam sempre frescos.
- **Optimistic UI**: Implementado em curtidas e favoritos para dar resposta instantânea ao usuário.

---

## 🧩 Estrutura de Pastas (Modular)

O projeto segue o padrão de **Features**, onde cada funcionalidade importante tem seu próprio ecossistema:

### `src/features/`
- **`admin/`**: Contém componentes exclusivos do painel (Tabs, Inbox, Ferramentas) e o hook `useAdminActions`.
- **`posts/`**: Componentes de PostCard, Carousel, Skeletons e os hooks de consulta de posts e categorias.
- **`auth/`**: Componentes de Login e proteção de rotas.

### `src/services/`
- **`PostService.ts`**: Abstração pura do Firestore. Não contém lógica de UI, apenas chamadas de rede.
- **`userService.ts`**: Lógica de gamificação (XP), favoritos e perfis.

---

## 🎮 Gamificação e Regras de Negócio

### Sistema de XP
Os usuários ganham XP por interações, persistido no Firestore:
- **Ler Artigo**: +10 XP
- **Curtir**: +5 XP
- **Comentar**: +20 XP
- **Favoritar**: +15 XP

### Estratégia de Busca (Fetch-All)
Na **HomePage**, optamos por carregar todos os posts ativos via `useAllPosts()` e filtrar localmente no frontend. 
- **Vantagem**: Busca e troca de categorias instantâneas (zero delay).
- **Escalabilidade**: Ideal para blogs de até ~500 artigos. Para volumes maiores, o `PostService.getPaginatedPosts` está preparado para transição para paginação infinita.

---

## 🎨 Design System: Neo-Brutalist

A estética do portal é inspirada no movimento Neo-Brutalista com toques de consoles retro:
- **Bordas**: `border-4 border-black` ou `border-purple-600`.
- **Sombras**: Sombras sólidas 2D (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`).
- **Cores SNES**: Paleta baseada no cinza e roxo clássico do Super Nintendo.

---
**Documentação atualizada em: 09 de Maio de 2026.**
