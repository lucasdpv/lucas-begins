# 🕹️ BeginsProject - Retro Gaming Journal (v3.10.0)

> **"A essência dos 16-bits em uma experiência web de alta fidelidade, agora com alma de RPG."**

O **BeginsProject** é um jornal digital de luxo dedicado à cultura retro gaming. Na versão 3.10.0, o portal adiciona um sistema completo de imagens premium no editor de conteúdo, com molduras retrô, lightbox de zoom, re-corte in-context e bypass de CORS para edição de imagens remotas.

---

## 📘 Documentação do Projeto

Para facilitar a gestão e o desenvolvimento, dividimos as informações em guias especializados:

-   **[🕹️ Guia de Onboarding](./ONBOARDING.md)**: Configuração do ambiente e arquitetura TypeScript.
-   **[🔧 Guia de Manutenção](./MAINTENANCE.md)**: Manual de operações, gamificação e ferramentas admin.
-   **[⚙️ Documentação Técnica](./DOCUMENTATION.md)**: Detalhes sobre TanStack Query, Zustand e Estrutura de Features.
-   **[🔥 Guia Firebase](./FIREBASE_GUIDE.md)**: Tutorial passo a passo para integrar seu próprio backend.

---

## ✨ Destaques da Versão 3.10.0

### 🖼️ Editor de Imagens Premium
Suporte completo a proporções livres (`1:1`, `16:9`, `4:5`, `Original`) e 4 estilos de moldura por bloco: retrô normal, CRT retro com scanlines, adesivo e sem moldura. Re-corte in-context sem novo upload, preview dinâmico de aspecto no editor e propagação do aspecto confirmado de volta ao bloco.

### 🔍 Lightbox de Zoom
Clicar em qualquer imagem de artigo abre um overlay full-screen com a imagem em alta qualidade, bordas neon retrô, backdrop blur e suporte a fechar via ESC ou clique.

### 🔧 CORS Proxy para Crop Remoto
Proxy same-origin configurado no Vite (dev) e Vercel (produção) para contornar restrições CORS ao desenhar imagens do Firebase Storage no canvas do editor de corte, eliminando erros de "tainted canvas".

### 🛠️ Painel Admin Refinado
Remoção da aba "Ferramentas". Filtro de posts em destaque (carrossel). Dropdowns customizados com Framer Motion, scrollbar retrô pill-shaped e header do painel com alinhamento vertical perfeito.

### 🌐 Marca Protegida contra Tradução
"BeginsProject" nunca é traduzido por motores de tradução automáticos — protegido em todos os elementos do site com `translate="no"` e classe `notranslate`.

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
