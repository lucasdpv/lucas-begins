# 🕹️ BeginsProject - Retro Gaming Journal (v3.4.0)

> **"A essência dos 16-bits em uma experiência web de alta fidelidade, agora com alma de RPG."**

O **BeginsProject** é um jornal digital de luxo dedicado à cultura retro gaming. Na versão 3.0.0, o projeto atinge seu ápice estético com uma interface ultra-refinada, navegação inteligente baseada em conteúdo e acessibilidade total para todos os temas.

---

## 📘 Documentação do Projeto

Para facilitar a gestão e o desenvolvimento, dividimos as informações em guias especializados:

-   **[🕹️ Guia de Onboarding](./ONBOARDING.md)**: Configuração do ambiente e arquitetura TypeScript.
-   **[🔧 Guia de Manutenção](./MAINTENANCE.md)**: Manual de operações, gamificação e ferramentas admin.
-   **[⚙️ Documentação Técnica](./DOCUMENTATION.md)**: Detalhes sobre TanStack Query, Zustand e Estrutura de Features.
-   **[🔥 Guia Firebase](./FIREBASE_GUIDE.md)**: Tutorial passo a passo para integrar seu próprio backend.

---

## ✨ Destaques da Versão 3.0.0

### 🎨 UI Ultra-Slim & Premium
Redesign completo do rodapé para uma barra minimalista elegante e revisão de contraste em toda a interface. O modo claro agora conta com legibilidade absoluta em todos os elementos de texto e metadados.

### 🧭 Navegação Inteligente (Smart Nav)
O menu de categorias agora é dinâmico: ele analisa o conteúdo em tempo real e oculta automaticamente seções que ainda não possuem artigos publicados, garantindo um portal sempre vibrante e pronto.

### 🎮 Gamificação & QG (Dashboard)
Sistema de progressão real com XP e níveis. O "Meu QG" permite que cada usuário acompanhe seu progresso, gerencie favoritos e personalize sua identidade com estética Modern Brutalist.

### ⚡ Performance "Instant-Browse"
Utilização estratégica de cache local para filtragem instantânea. A busca global e a troca de categorias acontecem sem atrasos, proporcionando uma experiência de navegação fluida e moderna.

### 🔐 Segurança & Manutenção
Painel Administrativo com ferramentas integradas para normalização de dados e gestão de categorias, protegido por rotas inteligentes que respeitam a hierarquia de acesso.

---

## 🛠️ Tecnologias de Elite

-   **React 19** + **Vite** + **TypeScript**
-   **Firebase** (Auth & Firestore Database)
-   **TanStack React Query v5** (Data Fetching & Cache)
-   **Zustand** (State Management: UI & Theme)
-   **Tailwind CSS** + **Modern Brutalist Design**
-   **Zod** (Validation & Type Safety)
-   **Lucide Icons**

---

## 🚀 Como Executar

1.  **Clone e Instale:**
    ```bash
    git clone https://github.com/lucasdpv/begins-project.git
    cd begins-project
    npm install
    ```

2.  **Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz com suas credenciais do Firebase:
    ```env
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    VITE_FIREBASE_PROJECT_ID=...
    ```

3.  **Inicie o Motor:**
    ```bash
    npm run dev
    ```

---

**Desenvolvido com 💜 por Lucas Vieira.**
*"Insert Coin to Continue"*
