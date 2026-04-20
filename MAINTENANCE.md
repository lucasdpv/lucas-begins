# 🔧 Guia de Manutenção — Lucas Begins

Este documento servirá como seu manual de operações para manter o blog seguro, atualizado e organizado.

---

## 🔐 Gestão de Administradores

A segurança do blog baseia-se em uma lista VIP de emails autorizados. Atualmente, o sistema verifica se o seu email está na coleção `admins` do Firestore.

### Como adicionar um novo Administrador:
1. Acesse o **[Console do Firebase](https://console.firebase.google.com/)**.
2. Vá em **Firestore Database**.
3. Localize a coleção `admins`.
4. Clique em **Adicionar Documento**.
5. Em **ID do Documento**, coloque o **e-mail exato** da pessoa (ex: `exemplo@gmail.com`).
6. Não é necessário adicionar campos extras dentro do documento, apenas o ID sendo o e-mail já basta para o sistema reconhecê-la como Admin.

---

## 🧹 Limpeza e Integridade de Dados

O blog possui scripts automáticos para evitar duplicatas e garantir que todos os posts tenham URLs amigáveis (Slugs).

### Versionamento de Migração:
Se você notar algum problema com posts antigos ou duplicatas que não estão sendo removidas:
1. Abra o arquivo `src/context/AppProvider.jsx`.
2. Localize a constante `MIGRATION_VERSION` (atualmente `v1.2`).
3. Altere para uma nova versão (ex: `v1.3`).
4. Isso forçará o script `cleanupDuplicates()` a rodar novamente para todos os usuários na próxima vez que acessarem o site.

---

## 💾 Backups

O Firebase não faz backups automáticos no plano gratuito (Spark). Recomenda-se:
- Antes de grandes exclusões, use a função de **Exportar Dados** no console do Firebase (requer configuração de Storage).
- Alternativamente, mantenha uma cópia dos seus artigos em arquivos locais (Markdown) antes de publicá-los.

---

## 🚀 Próximos Passos de Evolução
- **Firebase Storage**: No futuro, podemos migrar o upload de imagens do `imageUrl` (links externos) para o Storage oficial do Firebase, garantindo que as imagens nunca "quebrem".
- **Hospedagem**: Recomendo o **Vercel** ou **Firebase Hosting** para o deploy final. Ambos são gratuitos e extremamente rápidos.

> [!TIP]
> Em caso de erros críticos no banco, você pode resetar os dados básicos chamando a função `seedDatabase()` (que já roda automaticamente se o banco estiver vazio).
