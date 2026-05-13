# 🔧 Guia de Manutenção — Lucas Begins (v3.0.0)

Este documento é o seu manual de operações para manter a economia de jogo e a integridade do banco de dados do portal.

---

## 🔐 Gestão de Administradores & Roles

Diferente da versão anterior, a segurança agora é baseada em **Roles** (Papéis) dentro do documento do usuário na coleção `users`.

### Como promover um usuário a Admin:
1. Acesse o **Firestore Database**.
2. Localize o usuário na coleção `users` (pelo UID ou e-mail).
3. Altere o campo `role` de `"user"` para `"admin"`.
4. Isso desbloqueia automaticamente o acesso ao Painel Admin e todas as ferramentas de edição.

---

## 🛠️ Ferramentas Administrativas (Painel de Controle)

A partir da Versão 2.0 foi introduzida a aba **"Ferramentas"** no Painel Admin, eliminando a necessidade de scripts manuais.

### 📊 Normalização de Visualizações
Se as visualizações de um post parecerem irreais (ex: 10.000 views para 2 likes), use esta ferramenta:
1. Vá em **Admin > Ferramentas**.
2. Clique em **"Executar Reset"**.
3. O sistema recalculará as views de todos os posts usando uma fórmula baseada em engajamento real + fator aleatório retro.
4. **Performance**: O processo é executado em paralelo e leva poucos segundos.

---

## 🎮 Gestão de Gamificação (XP & Level)

O progresso dos usuários é armazenado nos campos `xp` e `level` da coleção `users`.

### Recuperação de XP:
Se um usuário relatar perda de nível ou XP:
1. Verifique o histórico de edições de perfil no Firestore.
2. O sistema de proteção (v3.0.0) impede sobrescritas, mas em caso de falha, você pode editar manualmente os campos `xp` e `level` para restaurar o progresso do jogador.

---

## 🧹 Versionamento de Migração
A constante que controla a limpeza de cache e scripts de inicialização agora reside em:
`src/constants.ts` -> `MIGRATION_VERSION`.

Ao subir uma versão que mude drasticamente a estrutura do banco:
1. Altere o valor de `MIGRATION_VERSION` (ex: de `v2.0` para `v2.1`).
2. Isso forçará a limpeza de `localStorage` e re-sincronização para todos os usuários.

---

## 💾 Backups & Segurança
O Firebase não possui backups automáticos no plano Spark.
- **Exportação**: Utilize o Google Cloud Console para exportações programadas se o banco crescer muito.
- **Zod Schemas**: Todos os dados salvos passam pela validação do `src/features/posts/schemas.ts`. Se adicionar um campo novo no Firestore, atualize o Schema ou o dado será ignorado pela interface.

---

> [!TIP]
> O sistema possui um `SystemInitializer.tsx` que garante que as coleções básicas existam. Se deletar o banco por engano, basta abrir o site logado como admin que a estrutura básica será recriada.
