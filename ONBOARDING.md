# 🕹️ Bem-vindo ao Lucas Begins — Guia do Desenvolvedor

Este guia foi criado para que você entenda rapidamente como o projeto funciona e como você pode contribuir de forma eficiente.

---

## 🌟 1. Visão Geral e Estética
O **Lucas Begins** não é apenas um blog; é uma experiência visual. Nossa estética é focada no **Retro-Hardware**, com sombras sólidas, bordas grossas e efeitos de *scanline*.

- **Temas**: Temos um modo Escuro (padrão) e um modo Claro ("Lavender Retro" inspirado no SNES).
- **UX**: Interações devem ser rápidas, com micro-animações e feedback visual imediato (Optimistic UI).

---

## 🛠️ 2. Stack Tecnológica (The "Modern Powerhouse")
*   **Core**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + **TypeScript** (6.0+).
*   **Data Fetching & Cache**: [@tanstack/react-query](https://tanstack.com/query/latest) (Nossa fonte da verdade para dados do Firebase).
*   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Gerencia UI Store e Theme Store de forma ultra-veloz).
*   **Backend**: [Firebase](https://firebase.google.com/) (Firestore para dados, Auth para login).
*   **Estilo**: [Tailwind CSS](https://tailwindcss.com/) + **CSS Variables** (Sistema de temas Modern Brutalist).
*   **Validation**: [Zod](https://zod.dev/) (Garante que os dados do Firestore respeitem nossos Schemas).

---

## 📂 3. Estrutura de Pastas (v3.0.0)
Seguimos uma organização modular para facilitar a manutenção:

```text
src/
├── features/       # Módulos de domínio (ex: posts)
│   └── posts/      # Components, hooks (React Query) e Schemas (Zod) do domínio
├── services/       # Camada de Dados (Funções puras que chamam o Firestore)
├── hooks/          # Hooks globais e utilitários (ex: useUserQuery)
├── components/
│   ├── ui/         # Componentes base (Botões, Cards, Skeletons)
│   └── layout/     # Navbar, Footer, ProtectedRoute
├── store/          # Zustand Stores (useUIStore, useThemeStore)
├── context/        # AuthProvider (Gerenciamento de sessão Firebase)
├── pages/          # Páginas completas (agora em .tsx)
└── lib/            # Utilitários, configurações do Firebase e Zod schemas
```

---

## 🎨 4. O Sistema de Design (Modern Brutalist)
**Identidade Visual**: Bordas sólidas de 4px, sombras pretas puras e paleta SNES (Roxo, Amarelo, Cinza).

*   **Classes Utilitárias**: Use `BRUTAL_DESIGN` (em `src/constants.ts`) para sombras e bordas padronizadas.
*   **Responsividade**: O projeto é mobile-first. Teste sempre em resoluções de 375px.

---

## 🧠 5. Fluxo de Trabalho (O "Novo Jeito Lucas Begins")

### A. Adicionando dados:
1.  Defina o Schema Zod em `src/features/[feature]/schemas.ts`.
2.  Crie a função de chamada em `src/services/`.
3.  Crie o Hook do React Query em `src/features/[feature]/hooks/`.
4.  Consuma usando `{ data, isLoading } = useMyHook()`.

### B. Autenticação & Roles:
O acesso é gerido pelo `AuthProvider`. O `ProtectedRoute` verifica se o usuário tem o `role === 'admin'` para áreas sensíveis.
*   **Dashboard**: Acessível para todos os usuários logados (`role: user`).

### C. SEO & Helmet:
Continuamos usando `react-helmet-async`. Cada página deve definir seu SEO logo no início do componente.

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
