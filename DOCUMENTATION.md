# ⚙️ Documentação Técnica — Lucas Begins

Este documento detalha a arquitetura de software e as decisões de engenharia tomadas no projeto.

---

## 🏗️ Arquitetura de Estado (Context API)

O projeto utiliza um **Estado Global Centralizado** via `AppProvider.jsx`. Isso evita o *prop drilling* e garante que informações como o usuário logado e o tema estejam disponíveis em qualquer nível da aplicação.

- **`AppContext`**: Define os tipos de dados.
- **`AppProvider`**: Gerencia a lógica de autenticação (Firebase Auth), tema (Dark/SNES) e integra os hooks de dados. Protegido ferozmente contra "Render Hell" através da **memoização completa (`useMemo`)** do seu objeto de `value`.

---

## 🪝 Hooks Customizados (A Camada de Dados)

Toda a interação com o Firestore foi abstraída em hooks para manter os componentes de UI limpos.

### 1. `usePosts.js`
- **Função**: CRUD completo da coleção `posts`.
- **Destaque (Performance)**: Implementa paginação infinita através de **Cursores Nativos do Firestore** (`getDocs` + `startAfter`), reduzindo brutalmente o custo por leitura da base de dados.
- **Optimistic UI**: Curtidas, criação e exclusão de comentários refletem na tela instantaneamente, atualizando o *cache local* do React antes mesmo do servidor responder.
- **Segurança Anticolisão**: O algoritmo de geração de Slugs (`slugify`) inclui um hash alfanumérico garantindo que títulos idênticos gerem rotas Web (`URL`) absolutamente únicas.

### 2. `useCategories.js`
- **Função**: Gerencia a coleção `categories`.
- **Regra de Negócio**: Impede a exclusão de categorias que possuem posts vinculados.

### 3. `useToast.js`
- **Função**: Gerenciador de notificações UI.
- **Estado**: Singleton que garante que apenas um aviso apareça por vez, com autolimpeza de timer.

### 4. `useImageFallback.js`
- **Função**: Garante que imagens de posts ou avatares quebrados sejam substituídas por placeholders elegantes ou ícones retro.
- **Implementação**: Hook utilitário que monitora erros de carregamento (`onError`) no DOM.

---

## 🧩 Mapa de Componentes Principais

### `Navbar.jsx`
O centro de comando. Gerencia:
- Busca em tempo real.
- Troca de tema dinâmico (Dark/Lavender).
- Gatilho do `LoginModal`.

### `PostDetailPage.jsx`
A experiência de leitura imersiva.
- **ArticleRenderer**: Processa Markdown em HTML seguro com estilização retro.
- **Comentários**: Sistema de feedback com cooldown (30s) para evitar spam.

### `AdminPage.jsx` & `PostEditorPage.jsx`
O CMS customizado para administradores.
- **Dashboard**: Visão geral de posts e categorias.
- **Editor**: Suporte a Markdown, upload de capas e salvamento automático (Drafts) no `localStorage`.

### `ProtectedRoute.jsx`
A sentinela.
- Envolve rotas sensíveis (Admin/Editor) e verifica o `role` do usuário no Firebase antes de renderizar.

---

## 📊 Estrutura de Dados (Firestore)

### Coleção `posts`
```json
{
  "title": "String",
  "slug": "String (ex: review-do-jogo-a7m9p)",
  "content": "String (Markdown)",
  "category": "String",
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp",
  "likes": "Number",
  "likedBy": "Array (UIDs)",
  "author": {
    "name": "String",
    "role": "String (Editor Chefe/Colaborador)",
    "avatar": "URL",
    "bio": "String",
    "aka": "String",
    "level": "Number"
  },
  "comments": [
    {
      "id": "Number (Timestamp)",
      "authorId": "String (UID)",
      "author": "String",
      "authorAvatar": "URL",
      "text": "String",
      "createdAt": "String (ISO)"
    }
  ]
}
```

---

## 🎨 Design System
O projeto utiliza **Tailwind CSS** para layout e utilitários, combinado com **CSS Variables** injetadas dinamicamente via `App.jsx`. Isso permite a troca de "skins" (Dark/Light) sem recarregar a página ou re-renderizar componentes pesados.

---
**Desenvolvido com foco em escalabilidade e performance.**
