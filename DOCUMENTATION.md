# ⚙️ Documentação Técnica — Lucas Begins

Este documento detalha a arquitetura de software e as decisões de engenharia tomadas no projeto.

---

## 🏗️ Arquitetura de Estado (Context API)

O projeto utiliza um **Estado Global Centralizado** via `AppProvider.jsx`. Isso evita o *prop drilling* e garante que informações como o usuário logado e o tema estejam disponíveis em qualquer nível da aplicação.

- **`AppContext`**: Define os tipos de dados.
- **`AppProvider`**: Gerencia a lógica de autenticação (Firebase Auth), tema (Dark/SNES) e integra os hooks de dados.

---

## 🪝 Hooks Customizados (A Camada de Dados)

Toda a interação com o Firestore foi abstraída em hooks para manter os componentes de UI limpos.

### 1. `usePosts.js`
- **Função**: CRUD completo da coleção `posts`.
- **Destaque**: Implementa carregamento infinito (pagination) e filtragem por categoria.
- **Segurança**: As operações de `delete` verificam se o usuário é o autor ou admin.

### 2. `useCategories.js`
- **Função**: Gerencia a coleção `categories`.
- **Regra de Negócio**: Impede a exclusão de categorias que possuem posts vinculados.

### 3. `useToast.js`
- **Função**: Gerenciador de notificações UI.
- **Estado**: Singleton que garante que apenas um aviso apareça por vez, com autolimpeza de timer.

---

## 🧩 Mapa de Componentes Principais

### `Navbar.jsx`
O centro de comando. Gerencia:
- Busca em tempo real.
- Troca de tema dinâmico.
- Gatilho do `LoginModal`.

### `PostEditorPage.jsx`
O CMS customizado.
- **Auto-Save**: Salva rascunhos no `localStorage` para evitar perda de dados.
- **Markdown**: Utiliza o motor do `BlockEditor` para transformar texto em HTML retro.

### `ProtectedRoute.jsx`
A sentinela.
- Envolve rotas sensíveis e verifica permissões antes de renderizar qualquer conteúdo.

---

## 📊 Estrutura de Dados (Firestore)

### Coleção `posts`
```json
{
  "title": "String",
  "slug": "String (URL index)",
  "content": "String (Markdown)",
  "category": "String",
  "createdAt": "Timestamp",
  "likes": "Number",
  "likedBy": "Array (UIDs)",
  "comments": [
    {
      "author": "String",
      "text": "String",
      "createdAt": "String (ISO)"
    }
  ]
}
```

---

## 🎨 Design System
O projeto utiliza uma combinação de **Tailwind CSS** para utilitários e **CSS-in-JS (dinâmico)** no `App.jsx` para injetar variáveis que dependem do tema (como as cores do SNES e as sombras sólidas).

---
**Desenvolvido com foco em escalabilidade e performance.**
