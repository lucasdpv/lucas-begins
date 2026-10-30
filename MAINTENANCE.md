# 🔧 Guia de Manutenção — BeginsProject (v6.0.0)

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
- **Zod Schemas (`src/features/posts/schemas.ts`)**: Todos os posts passam por validação Zod com fallbacks seguros. Se adicionar um novo campo aos posts no Firestore, lembre-se de incluí-lo no `PostSchema`.

---
**Atualizado em: 30 de Outubro de 2026 (v6.0.0).**
