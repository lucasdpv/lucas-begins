# 📋 Backlog de Melhorias e Pendências — BeginsProject (v6.0.0)

Este documento lista as próximas evoluções planejadas, refatorações futuras e melhorias técnicas após o lançamento da **v6.0.0 (Cyber-Editorial & Streaming Geek Redesign)**.

---

## 🎨 1. Design System & Interface (Próximos Passos)

- [ ] **Refatoração Completa do Modo Claro / Modo Escuro (Theme Engine v2)**
  * **Contexto**: Na v6.0.0, o botão de alternância de tema foi ocultado temporariamente e o portal foi travado em `isDark: true` (`useThemeStore.ts`) para garantir 100% de fidelidade na estética Cyber-Editorial escura.
  * **Objetivo**: Projetar um **Modo Claro Editorial** dedicado (com variáveis CSS semânticas para superfícies, sombras, bordas e contrastes de badges) em vez de inversões simples de classes, reativando o seletor quando ambos os temas estiverem perfeitos.
- [ ] **Modernização Visual do Painel Admin (`AdminDashboard.tsx`) e Editor de Posts (`PostEditorPage.tsx`)**
  * **Objetivo**: Aplicar o mesmo acabamento Cyber-Editorial (`#121024`, `border-white/[0.08]`, `rounded-2xl`) às abas internas do Painel Administrativo e à tela de criação/edição de matérias (atualmente funcionais e restritas a administradores).
- [ ] **Revisão de Conteúdo no Firestore (Via Painel Admin)**
  * **Objetivo**: Corrigir pequenos erros de digitação em subtítulos antigos cadastrados no Firestore (ex.: *"Batman no SNES"* — `"DEFENIU"` → `"DEFINIU"`, `"JUSS"` → `"JUS"`) e reenviar a imagem de capa da matéria *"Diablo 4 Lord of Hatred"* caso o link externo antigo esteja expirado.

---

## 🔒 2. Segurança & Banco de Dados (Firebase)

- [ ] **Deploy da Regra Estrita de Visualizações (`firestore.rules`)**
  * **Objetivo**: Garantir que a regra local de incremento unitário estrito (`views == views + 1`) esteja publicada no ambiente de produção do Firebase.
  * **Ação**: Executar `firebase deploy --only firestore:rules`.
- [ ] **Restrição de Origens no CORS (`cors.json`)**
  * **Objetivo**: Substituir o wildcard `*` por origens seguras em produção (`https://lucasbegins.com.br`, previews da Vercel e `http://localhost:3000`).

---

## 🛠️ 3. Qualidade de Código, Limpeza de Legado & Linting

- [ ] **Remoção de Dependências Legadas da Migração Vite → Next.js**
  * **Objetivo**: Remover pacotes residuais que não são mais necessários no Next.js 16 App Router (`react-helmet-async`, `react-router-dom`, `vite`, `@vitejs/plugin-react` em `package.json`) após migrar os últimos imports internos para o `router-compat.tsx` nativo.
- [ ] **Migração do ESLint 9 para Padrão Next.js (`eslint.config.js`)**
  * **Objetivo**: Ativar linting completo em arquivos `.ts` e `.tsx` com `eslint-config-next`.
- [ ] **Padronização de Variáveis de Ambiente (`NEXT_PUBLIC_`)**
  * **Objetivo**: Remover o fallback de variáveis antigas `VITE_` no `next.config.mjs` após confirmar que todas as chaves na Vercel utilizam `NEXT_PUBLIC_`.

---

## 🧪 4. Cobertura de Testes Automatizados

- [ ] **Testes Unitários do `ArticleRenderer.tsx` (Vitest + Testing Library)**
  * **Objetivo**: Validar a renderização de blocos customizados (`:::pullquote`, `:::info-box`, `:::columns-2`, `@[youtube]`, molduras `{#frame-crt}`).
- [ ] **Testes E2E de Fluxos Críticos (Playwright)**
  * **Objetivo**: Cobrir busca na Navbar, leitura de artigos, envio de comentários e publicação no editor.
