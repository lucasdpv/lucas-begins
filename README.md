# 🕹️ BeginsProject - Retro Gaming Journal (v4.1.0)

> **"A essência dos 16-bits em uma experiência web de alta fidelidade, agora com alma de RPG."**

O **BeginsProject** é um jornal digital de luxo dedicado à cultura retro gaming. Na versão 4.1.0, o portal traz um redesign temático completo na homepage para as seções RetroCafé, Dossiês e Reviews, removendo os cards genéricos e substituindo-os por capas de revista vintage, pastas manila confidenciais e decks retro-modernos integrados com fade, acompanhados de efeitos de áudio sintetizados nativamente e animações interativas de alta fidelidade.

---

## 📘 Documentação do Projeto

Para facilitar a gestão e o desenvolvimento, dividimos as informações em guias especializados:

-   **[🕹️ Guia de Onboarding](./ONBOARDING.md)**: Configuração do ambiente e arquitetura TypeScript.
-   **[🔧 Guia de Manutenção](./MAINTENANCE.md)**: Manual de operações, gamificação e ferramentas admin.
-   **[⚙️ Documentação Técnica](./DOCUMENTATION.md)**: Detalhes sobre TanStack Query, Zustand e Estrutura de Features.
-   **[🔥 Guia Firebase](./FIREBASE_GUIDE.md)**: Tutorial passo a passo para integrar seu próprio backend.

---

## ✨ Destaques da Versão 4.1.0 (Retro-Modern Visual Decks)

### 🎨 Redesign Visual da Homepage (Retro-Gaming Decks)
- **RetroCafé (Banca de Revistas)**: Seção estilizada como capas de revistas de videogame físicas dos anos 90, com logotipo, preço simulado em Cruzeiros (Cr$), código de barras e elevação 3D brutalista.
- **Dossiês (Arquivo Confidencial)**: Cards estilizados como pastas manila com clipes metálicos, abas de categoria numeradas, carimbo vermelho "CLASSIFICADO", fotos Polaroid (proporção 4:3) e animação interativa de scanner a laser azul no hover.
- **Reviews (Decks com Fade)**: Cards horizontais integrados onde a arte do jogo (65% de largura) se funde suavemente à área de texto (50% de largura) usando uma máscara de gradiente de 70% de largura. A nota agora é exibida em um badge metálico dourado 3D de destaque.

### 🔊 Feedback Sonoro Retrô Nativo
- Adicionado sistema de efeitos sonoros 8-bit sintetizados via **Web Audio API** (sem arquivos de áudio externos), gerando bipes clássicos de interface de forma instantânea nas interações do menu.

---

## ✨ Destaques da Versão 4.0.0 (Neo-Brutalist Classic)

- **Cantos Retos 90°**: Conversão global para a estética retro pura usando `rounded-none` em todos os cards, modais e botões.
- **Bordas Fortes e Sombras Offset**: Bordas pretas sólidas e sombras brutas 2D com elevação responsiva no hover.
- **Fundo Mais Lidos com Imagem Dinâmica**: Efeito de hover na lista "Mais Lidos" que projeta e suaviza a imagem do post correspondente no fundo direito da seção com máscara gradiente `mask-image`.

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
