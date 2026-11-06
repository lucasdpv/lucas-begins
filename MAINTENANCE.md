# 🔧 Guia de Manutenção — BeginsProject (v6.5.0)

Este documento é o manual de operações para manter a gamificação, o conteúdo editorial e a integridade do banco de dados do portal **BeginsProject**.

---

## 🔐 Gestão de Administradores & Roles

A segurança de rotas (no cliente e no `middleware.ts` do Next.js) é baseada em **Roles** dentro do documento do usuário na coleção `users` do Cloud Firestore.

### Como promover um usuário a Admin:
1. Acesse o **Firebase Console > Firestore Database**.
2. Localize o usuário na coleção `users` (pelo UID ou e-mail).
3. Altere o campo `role` de `"user"` para `"admin"`.
4. No próximo carregamento, o botão **Painel** ficará visível na Navbar e as rotas `/admin` e `/editor` serão liberadas pelo middleware.

---

## 📰 Publicação, Proporções de Capa & Títulos Compostos

- **Split Title Automático**: Ao cadastrar um post com `:` (ou ` - `) no título — ex: `Chrono Trigger: A história do RPG perfeito` — o portal separa automaticamente o **Título Principal** (em destaque com `font-retro`) e o **Subtítulo** (colorido dinamicamente conforme a categoria).
- **Proporções de Imagem**: No editor de posts (`PostEditorPage.tsx`), você pode escolher entre `original`, `16:9`, `1:1` e `4:5`, além de molduras especiais (`normal`, `crt`, `sticker`, `none`) nos blocos de imagem do artigo.
- **Suporte a GIFs**: Imagens `.gif` são enviadas diretamente ao Firebase Storage sem compressão WebP para preservar a animação.
- **Capítulos**: Cada linha `## Título` no conteúdo vira um capítulo no índice da matéria e na pílula flutuante de capítulos. Matérias com 2 ou mais capítulos exibem ambos.

---

## 🗂️ Categorias

O portal usa 4 categorias oficiais, definidas no código em `src/features/posts/utils/categoryInfo.ts`:

| Categoria | O que entra |
|---|---|
| **Reviews** | Análise de um jogo, com nota |
| **Dossiê** | A história de um jogo, console ou franquia |
| **Animes & TV** | Animes, desenhos, tokusatsus e TV |
| **RetroCafé** | Crônicas, opiniões, memórias e novidades do próprio portal |

- **Para publicar**: escolha a categoria no editor; a lista já vem restrita às 4 oficiais.
- **Para criar uma nova categoria**: adicione o nome em `SITE_CATEGORIES`, a descrição em `CATEGORY_DESCRIPTIONS` e a frase em `CATEGORY_TAGLINES` (`categoryInfo.ts`). Depois defina ícone (`categoryIcons.tsx`) e cores (`Badge.tsx`, `PostCard.tsx`, `PostHero.tsx`, `Carousel.tsx`, `ArchivePage.tsx`); sem isso, a categoria aparece com o roxo padrão.
- **Para renomear uma categoria**: além do código, é preciso atualizar o campo `category` de todas as matérias que a usam no Firestore.
- A coleção `categories` do Firestore não controla mais o site; ela só aparece na aba "Categorias" do Painel.

---

## 🧪 Dados de Teste
- O portal não cria mais posts nem categorias automaticamente (os antigos `SeedData.ts`, `CleanUp.ts` e `SystemInitializer` foram removidos na v6.1.0). Conteúdo de teste deve ser criado e apagado manualmente pelo Painel.

---

## 🎮 Gestão de Gamificação (XP & Level)

O progresso dos leitores é salvo nos campos `xp` e `level` da coleção `users`:
- **Ler Artigo**: +10 XP
- **Curtir**: +5 XP
- **Favoritar**: +15 XP
- **Comentar**: +20 XP
- **Responder Comentário**: +10 XP

---

## 💾 Segurança & Validação
- **Regras de Views (`firestore.rules`)**: Atualizações anônimas de visualizações são permitidas apenas se alterarem exclusivamente o campo `views` com incremento estrito de `+1`.
- **Zod Schemas (`src/features/posts/schemas.ts`)**: Todos os posts passam por validação Zod com fallbacks seguros (`pros`, `cons`, `score`, `verdict`). Se adicionar um novo campo aos posts no Firestore, lembre-se de incluí-lo no `PostSchema`.
- **Reviews & Scorecard Veredito (`PostVerdict.tsx` & `reviewVerdictHelper.ts`)**: Ao preencher a **Nota Final (0 a 10)** no editor (`PostEditorPage.tsx`), o botão **`✨ Gerar Prós & Contras da Análise`** analisa o texto da matéria e sugere automaticamente de 3 a 4 Prós e 1 a 2 Contras sucintos para revisão. A frase curta do banner é opcional (máx. 140 caracteres).

---
**Atualizado em: 6 de Novembro de 2026 (v6.5.0).**
