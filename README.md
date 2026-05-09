# 🕹️ Lucas Begins - Retro Gaming Journal (v2.3)

> **"A essência dos 16-bits em uma experiência web de alta fidelidade, agora com alma de RPG."**

O **Lucas Begins** é um jornal digital de luxo dedicado à cultura retro gaming. Na versão 2.3, o projeto atingiu maturidade arquitetural com uma estrutura totalmente modular, mantendo o sistema de gamificação onde cada interação aproxima o usuário da era dourada dos videogames.

---

## 📘 Documentação do Projeto

Para facilitar a gestão e o desenvolvimento, dividimos as informações em guias especializados:

-   **[🕹️ Guia de Onboarding](./ONBOARDING.md)**: Configuração do ambiente e arquitetura TypeScript.
-   **[🔧 Guia de Manutenção](./MAINTENANCE.md)**: Manual de operações, gamificação e ferramentas admin.
-   **[⚙️ Documentação Técnica](./DOCUMENTATION.md)**: Detalhes sobre TanStack Query, Zustand e Estrutura de Features.

---

## ✨ Destaques da Versão 2.3

### 🧩 Arquitetura Modular (Features)
Os componentes "gigantes" foram decompostos em unidades menores e especializadas (Admin, Posts, Auth). Isso facilita a manutenção e permite que novas funcionalidades sejam adicionadas sem afetar a estabilidade do core.

### 🎮 Gamificação (XP System)
Sistema de progressão real. Usuários ganham XP ao ler, curtir e comentar, subindo de nível e desbloqueando emblemas de "Veterano". Tudo persistido em tempo real no Firestore.

### 🏠 QG de Comunidade (Dashboard)
Um painel exclusivo para cada usuário gerenciar seu inventário de favoritos, acompanhar seu nível de experiência e personalizar sua identidade (Bio/AKA) com estética Modern Brutalist.

### ⚡ Performance "Instant-Browse"
Implementação de estratégia de carregamento total na Home combinada com filtragem local. A busca global e a troca de categorias agora são instantâneas, sem telas de carregamento intermediárias.

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
    git clone https://github.com/lucasdpv/lucas-begins.git
    cd lucas-begins
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
