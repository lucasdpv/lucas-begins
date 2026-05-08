# 🔍 Guia de Troubleshooting - Problemas de Persistência

## Sintomas
- ❌ Curtidas/Favoritos não persistem
- ❌ Após recarregar (Ctrl+R), voltam ao estado anterior
- ❌ Não consegue remover curtidas

---

## 🎯 Passo 1: Verificar Autenticação

### O que fazer:
1. Abra o Console (F12 → Console)
2. Digite: `console.log(firebase.auth().currentUser)`
3. Se retornar `null`, você **NÃO está autenticado!**

### Se não autenticado:
```
❌ Problema: Você precisa estar logado para usar curtidas/favoritos
✅ Solução: Clique no botão de login (canto superior direito)
```

### Se autenticado:
```
✅ Verá algo como: { uid: "xxxx", email: "seu@email.com", ... }
```

---

## 🎯 Passo 2: Rodar o Teste de Diagnóstico

### Acesse: `http://localhost:5173/debug`

Este teste vai:
1. ✅ Verificar autenticação
2. ✅ Tentar escrever em `users/{seu-id}`
3. ✅ Tentar ler seus dados
4. ✅ Listar posts
5. ✅ Tentar incrementar likes

### Resultados Possíveis:

#### ✅ Se todos os testes passarem:
```
O problema NÃO está nas regras do Firestore.
Procure por erros no console (F12) em:
  - [PostService.toggleLike]
  - [useLikeMutation]
  - [userService.toggleFavorite]
  - [useFavoriteMutation]
```

#### ❌ Se "Teste de Escrita - users" falhar:
```
Mensagem típica:
"Missing or insufficient permissions"

Solução:
1. Abra Firebase Console → seu projeto → Firestore
2. Vá para Rules (aba)
3. Adicione/atualize as regras (veja abaixo)
```

#### ❌ Se "Teste Curtida" falhar:
```
Significa que você não pode atualizar posts.

Solução:
Suas regras de posts estão muito restritivas.
Veja "Padrão de Regras Recomendado" abaixo.
```

---

## 🎯 Passo 3: Verificar Regras do Firestore

### Onde encontrar:
1. Firebase Console (https://console.firebase.google.com)
2. Seu projeto
3. Firestore Database
4. Aba **"Rules"**

### Verifique:
- [ ] Existe uma regra para `/users/{userId}`?
- [ ] Existe uma regra para `/posts/{postId}`?
- [ ] Permitem escrita (`allow write`)?

---

## ✅ Padrão de Regras Recomendado

Se nenhuma regra existe, crie assim:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ===== USUÁRIOS =====
    // Cada usuário pode ler/escrever seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // ===== POSTS =====
    // Posts são públicos para leitura
    match /posts/{postId} {
      allow read: if true;
      // Qualquer usuário autenticado pode escrever
      // (modificar likes, adicionar comentários, etc)
      allow update: if request.auth != null;
      // Apenas admins podem criar/deletar posts
      allow create, delete: if false; // Mudar se quiser admin criar
    }

    // ===== COMENTÁRIOS (opcional) =====
    match /posts/{postId}/comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.authorId;
    }

    // ===== ADMINS (para identificar quem é admin) =====
    match /admins/{email} {
      allow read: if request.auth.token.email == email;
    }
  }
}
```

### Como copiar as regras:
1. Firebase Console → Firestore Rules
2. Selecione TUDO (Ctrl+A)
3. Delete tudo
4. Cole o código acima
5. Clique **"Publicar"**

---

## 🎯 Passo 4: Verificar Console por Erros

### Abra a aba de Console (F12):

#### Procure por:
```
[PostService.toggleLike] ❌ ERRO:
[useLikeMutation] ❌ ERRO:
[userService.toggleFavorite] ❌ ERRO:
[useFavoriteMutation] ❌ ERRO:
```

#### Se encontrar um erro, anote:
- O texto completo da mensagem
- Se começa com "Missing or insufficient permissions"
- Se começa com "PERMISSION_DENIED"

### Erros Comuns:

#### 1. "Missing or insufficient permissions"
```
Significa: Suas regras de Firestore não permitem esta operação

Solução:
1. Verifique as regras (veja "Padrão de Regras" acima)
2. Confirme que `allow write` existe
3. Clique Publicar
4. Aguarde 30-60 segundos
5. Teste novamente
```

#### 2. "PERMISSION_DENIED"
```
Mesma coisa que acima - problema nas regras.
```

#### 3. "A transaction failed"
```
Significa: A operação foi bloqueada pela Firestore

Procure por mais detalhes na mensagem de erro.
Se disser "Permission denied", volta ao caso 1.
```

#### 4. Nenhum erro, mas não funciona
```
Pode ser:
1. Listener real-time não está atualizado
2. Cache do React Query está fora de sincronia
3. Problema no navegador

Solução:
- Limpe cache do navegador (Ctrl+Shift+Del)
- Feche todas as abas
- Abra novamente
- Tente de novo
```

---

## 🧪 Teste Prático de Curtida

### Se quer testar manualmente via Console:

```javascript
// Cole no Console (F12) e execute:

// 1. Pegue um postId de um post visível
const postId = "seu-post-id-aqui";

// 2. Pegue seu userId
const userId = firebase.auth().currentUser.uid;

// 3. Importe o serviço
// (nota: isso pode não funcionar direto, é apenas para debug)

// Se quiser testar pelo Firebase Console:
// 1. Vá para Firestore
// 2. Encontre um post
// 3. Manualmente edite likedBy array
// 4. Veja se aparece na UI
```

---

## 🔍 Checklist de Diagnóstico

Siga na ordem:

- [ ] Estou autenticado? (F12 → Console → `firebase.auth().currentUser`)
- [ ] Rodei o teste em `/debug`?
- [ ] Os testes em `/debug` passaram?
- [ ] Se não, qual falhou?
  - [ ] Escrita em users → Veja "Padrão de Regras"
  - [ ] Atualização de posts → Veja "Padrão de Regras"
- [ ] Verifiquei Console por erros (F12)?
- [ ] Atualizei as regras do Firestore?
- [ ] Aguardei 30-60 segundos após publicar regras?
- [ ] Testei novamente?

---

## 🆘 Se Nada Funcionar

### Envie estas informações:

1. **Screenshot do Console (F12)**
   - Procure por erros que começam com `[PostService` ou `[userService`
   - Copie o erro completo

2. **Screenshot do Teste /debug**
   - Qual teste falhou?
   - Qual é a mensagem de erro?

3. **Suas Regras do Firestore**
   - Copie o conteúdo da aba "Rules"

4. **Seu ID de Autenticação**
   - F12 → Console → `firebase.auth().currentUser.uid`

---

## 📊 Exemplo: Erro de Regras

### Se vir isto no /debug:
```
❌ Teste de Escrita - users
Error: Missing or insufficient permissions
```

### E suas regras são:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Sem regra nenhuma!
  }
}
```

### Solução:
Copie o "Padrão de Regras" acima e publique.

---

## ✨ Após Corrigir as Regras

1. Espere 30-60 segundos
2. Recarregue o navegador (Ctrl+R)
3. Teste novamente
4. Se funcionar, tudo pronto! 🎉

---

## 📞 Próximas Ações

Se persistir o problema após fazer tudo:

1. Compartilhe o erro do console
2. Compartilhe suas regras do Firestore
3. Verifique se seu projeto Firebase está ativo (payment method adicionado)

---

**Última atualização:** 2026-05-08
