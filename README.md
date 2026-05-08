# 🕹️ Lucas Begins - Retro Gaming Journal (v2.0)

> **"A essência dos 16-bits em uma experiência web de alta fidelidade, agora com alma de RPG."**

O **Lucas Begins** é um jornal digital de luxo dedicado à cultura retro gaming. Na versão 2.0, o projeto evoluiu de um simples blog para uma plataforma de comunidade gamificada, onde cada leitura e interação aproxima o usuário da era dourada dos videogames através de níveis e conquistas.

---

## 📘 Documentação do Projeto

Para facilitar a gestão e o desenvolvimento, dividimos as informações em guias especializados:

-   **[🕹️ Guia de Onboarding](./ONBOARDING.md)**: Configuração do ambiente e arquitetura TypeScript.
-   **[🔧 Guia de Manutenção](./MAINTENANCE.md)**: Manual de operações, gamificação e ferramentas admin.
-   **[⚙️ Documentação Técnica](./DOCUMENTATION.md)**: Detalhes sobre esquemas Zod, queries e stores.

---

## ✨ Destaques da Versão 2.0

### 🎮 Gamificação (XP System)
Sistema de progressão real. Usuários ganham XP ao ler, curtir e comentar, subindo de nível e desbloqueando emblemas de "Veterano". Tudo persistido em tempo real no Firestore.

### 🏠 QG de Comunidade (Dashboard)
Um painel exclusivo para cada usuário gerenciar seu inventário de favoritos, acompanhar seu nível de experiência e personalizar sua identidade (Bio/AKA) com estética Modern Brutalist.

### ⚡ Arquitetura "Turbo-Type"
O projeto foi totalmente migrado para **TypeScript**, utilizando **React Query** para gerenciamento de cache inteligente e **Zustand** para estados globais ultra-leves. Performance extrema com tipagem estática.

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
