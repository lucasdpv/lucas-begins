# 🕹️ Bem-vindo ao Lucas Begins — Guia do Desenvolvedor

Este guia foi criado para que você entenda rapidamente como o projeto funciona e como você pode contribuir de forma eficiente.

---

## 🌟 1. Visão Geral e Estética
O **Lucas Begins** não é apenas um blog; é uma experiência visual. Nossa estética é focada no **Retro-Hardware**, com sombras sólidas, bordas grossas e efeitos de *scanline*.

- **Temas**: Temos um modo Escuro (padrão) e um modo Claro ("Lavender Retro" inspirado no SNES).
- **UX**: Interações devem ser rápidas, com micro-animações e feedback visual imediato (Optimistic UI).

---

## 🛠️ 2. Stack Tecnológica
*   **Core**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) (para um build ultra-rápido).
*   **Roteamento**: [React Router 7](https://reactrouter.com/en/main).
*   **Backend**: [Firebase](https://firebase.google.com/) (Firestore para dados, Auth para login).
*   **Estilo**: [Tailwind CSS](https://tailwindcss.com/) + **CSS Variables** (para o sistema de temas).
*   **Ícones**: [Lucide React](https://lucide.dev/).
*   **Segurança**: Sanitização de HTML com `dompurify`.

---

## 📂 3. Estrutura de Pastas
Para manter a escalabilidade, seguimos esta organização:

```text
src/
├── api/            # Funções serverless (ex: geração de imagens Open Graph)
├── components/
│   ├── ui/         # Componentes base (Botões, Cards, Modais) - "O nosso UI Kit"
│   ├── layout/     # Navbar, Footer, Containers
│   └── editor/     # Componentes complexos do CMS/Editor
├── services/       # Camada de Dados (Funções puras que chamam o Firebase)
├── hooks/          # A ponte entre UI e Services (ex: usePosts, useAuth)
├── context/        # Estado Global (AppProvider gerencia Tema e Usuário)
├── pages/          # Páginas completas da aplicação
└── index.css       # Design System (Definição de variáveis retro e animações)
```

---

## 🎨 4. O Sistema de Design (Como Estilizar)
**Não use cores fixas do Tailwind (ex: `bg-purple-500`) para elementos de marca.**

Sempre prefira as nossas **CSS Variables** definidas em `index.css`. Isso garante que o componente mude de cor automaticamente ao trocar o tema.

*   **Cards**: Use a classe `.retro-card`.
*   **Botões**: Use a classe `.retro-button`.
*   **Cores**: Use variáveis como `var(--retro-border-color)`.

---

## 🧠 5. Fluxo de Trabalho (O "Jeito Lucas Begins")

### A. Adicionando uma nova funcionalidade de dados:
1.  Crie a lógica de busca/escrita em `src/services/`.
2.  Exponha isso através de um Hook em `src/hooks/`.
3.  Consuma no componente de UI.

### B. Autenticação e Admin:
O sistema de Admin é baseado em uma coleção `admins` no Firestore. Se o e-mail do usuário logado estiver lá, ele ganha acesso ao editor.
*   Use o componente `<ProtectedRoute>` para envolver rotas privadas.

### C. SEO:
Cada página usa `react-helmet-async` para definir títulos e metas dinâmicos. Não esqueça de atualizar o `Helmet` ao criar uma nova página!

---

## 🚀 6. Como Rodar o Projeto
1.  Instale as dependências: `npm install`
2.  Crie um arquivo `.env.local` baseado no `.env.example` com as chaves do Firebase.
3.  Inicie o servidor: `npm run dev`

---

## 📝 7. Próximos Desafios (Onde Atuar?)
*   **Migração TypeScript**: Estamos movendo o projeto gradualmente para TS.
*   **Performance**: Melhorar o carregamento de imagens pesadas no blog.
*   **Novas Features**: Implementar um sistema de "Reações" em tempo real nos posts.

---
> [!TIP]
> Em caso de dúvida sobre a arquitetura, leia o arquivo [DOCUMENTATION.md](./DOCUMENTATION.md). Para manutenção do banco, veja [MAINTENANCE.md](./MAINTENANCE.md).
