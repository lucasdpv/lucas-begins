# 📋 Backlog de Melhorias e Pendências — BeginsProject

Este arquivo lista as oportunidades de melhoria técnica, segurança, cobertura de testes e otimizações arquiteturais identificadas durante a revisão geral do projeto (pós-migração para Next.js).

---

## 🔒 1. Segurança & Banco de Dados (Firebase)

- [ ] **Deploy da Regra Estrita de Visualizações**
  * **Objetivo**: Aplicar a regra estrita de incremento unitário para as visualizações no Firestore em produção.
  * **Ação**: Executar `firebase deploy --only firestore:rules`.
  * **Status**: Localmente configurado em `firestore.rules`.
- [ ] **Restrição de Origens no CORS (`cors.json`)**
  * **Objetivo**: Substituir o wildcard `*` por origens seguras em produção para proteger os uploads e requisições do Firebase Storage.
  * **Ação**: Modificar `cors.json` para expor apenas `https://lucasbegins.com.br`, as URLs de preview do Vercel e `http://localhost:3000`.

---

## 🛠️ 2. Qualidade de Código & Linting (ESLint 9)

- [ ] **Migração do ESLint para Padrão Next.js**
  * **Objetivo**: Ativar a verificação de código automática (lint) sobre arquivos TypeScript (`.ts`, `.tsx`), que hoje estão sendo ignorados pelo arquivo herdado do Vite.
  * **Ação**: Atualizar o `eslint.config.js` para utilizar a estrutura Flat Config suportada pela dependência `eslint-config-next`.
  * **Exemplo de Configuração**:
    ```javascript
    import { FlatCompat } from "@eslint/eslintrc";
    // ... importar configs de Flat Compat e estender 'next/core-web-vitals'
    ```

---

## 🧪 3. Cobertura de Testes

- [ ] **Testes Unitários de Renderização de Artigos**
  * **Objetivo**: Garantir que as marcações customizadas criadas no editor de posts (ex: `:::pullquote`, `:::info-box`, `:::columns-2`, `@[youtube]`) renderizem as tags HTML esperadas.
  * **Ação**: Criar `src/features/posts/components/ArticleRenderer.test.tsx` utilizando `@testing-library/react`.
- [ ] **Mock de Serviços e Queries (MSW)**
  * **Objetivo**: Testar hooks como `usePost` e mutações offline sem precisar chamar o banco real.
  * **Ação**: Configurar o **Mock Service Worker (MSW)** ou o Firebase Local Emulator Suite para simular respostas do banco durante a execução do `npm run test`.
- [ ] **Testes de Integração E2E (End-to-End)**
  * **Objetivo**: Evitar regressões em fluxos críticos do sistema.
  * **Ação**: Configurar o **Playwright** ou **Cypress** para testar fluxos como:
    * Login de Administrador.
    * Fluxo de criação e salvamento de rascunhos/posts no editor.
    * Envio e exclusão de comentários/respostas.

---

## ⚡ 4. Otimização de Performance & Arquitetura

- [ ] **Otimização de Imagens no Corpo dos Artigos**
  * **Objetivo**: Retornar ao uso da tag `<Image>` do Next.js no corpo das matérias sem sofrer com o colapso de containers no layout float.
  * **Ação**:
    1. Alterar o editor de posts para armazenar as dimensões (largura/altura original) de cada imagem inserida no Firestore.
    2. Modificar o subcomponente `ArticleImage` em `ArticleRenderer.tsx` para passar essas dimensões ao `<Image width={...} height={...}>` do Next.js.
    3. Remover a tag `<img>` nativa, recuperando a compressão automática e as taxas de entrega otimizadas do Next.js Image Optimizer.
- [ ] **Depreciação de Prefixo de Variáveis Legadas (`VITE_`)**
  * **Objetivo**: Simplificar o ecossistema de variáveis de ambiente.
  * **Ação**: Migrar todas as configurações no painel da Vercel para o prefixo `NEXT_PUBLIC_` e remover a injeção duplicada e remapeamento no `next.config.js`.
