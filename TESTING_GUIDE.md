# 🧪 Guia de Teste - Sincronização Firebase

## Configuração Inicial
1. Faça build/start do projeto: `npm run dev`
2. Abra 2 abas do navegador
3. Faça login em ambas com a mesma conta

---

## Teste 1: Sincronização de Curtidas ⭐
**Objetivo:** Verificar se curtidas sincronizam em tempo real

### Passos:
1. **Aba A:** Acesse `/post/[qualquer-post]`
2. **Aba A:** Clique no botão de curtir
3. **Observação:** O contador de likes aumenta na Aba A ✅
4. **Aba B:** Abra o mesmo post em nova aba (ou recarregue)
5. **Observação:** O like aparece sem recarregar? **Isso é o sucesso!**

### Resultado Esperado:
- [ ] Curtida aparece em tempo real em ambas abas
- [ ] Contador reflete corretamente
- [ ] `likedBy[]` array tem o usuário

---

## Teste 2: Sincronização de Favoritos 📌
**Objetivo:** Verificar se favoritos sincronizam corretamente

### Passos:
1. **Aba A:** Em `/post/[qualquer-post]`, clique "Salvar" (ícone de bookmark)
2. **Aba A:** Vá para `/dashboard` 
3. **Observação:** Post aparece em "Inventário de Favoritos" ✅
4. **Aba B:** Abra `/dashboard`
5. **Observação:** Post aparece na seção de favoritos?

### Resultado Esperado:
- [ ] Post aparece em favoritos em ambas abas
- [ ] Removendo de uma aba, desaparece da outra
- [ ] `user.favorites[]` tem o postId

---

## Teste 3: Comentários Simultâneos 💬
**Objetivo:** Verificar se comentários não são perdidos

### Passos:
1. **Aba A e B:** Ambas em `/post/[qualquer-post]` na seção de comentários
2. **Aba A:** Comente algo e envie
3. **Aba B:** Rapidamente comente algo diferente e envie
4. **Aba A:** Recarregue a página
5. **Observação:** Ambos comentários aparecem?

### Resultado Esperado:
- [ ] Ambos comentários aparecem
- [ ] Nenhum comentário é perdido
- [ ] Ordem está correta (mais recente por último)

---

## Teste 4: Persistência Após Recarregar 🔄
**Objetivo:** Verificar se dados persistem no Firebase

### Passos:
1. **Aba A:** Curta 3 posts diferentes
2. **Aba A:** Salve 2 posts como favorito
3. **Aba A:** Comente em um post
4. **Aba A:** Recarregue a página (F5)
5. **Observação:** Curtidas ainda aparecem? Favoritos ainda lá?
6. **Aba A:** Feche completamente
7. **Aba A:** Abra uma nova aba e vá para `/dashboard`
8. **Observação:** Favoritos ainda aparecem?

### Resultado Esperado:
- [ ] Curtidas persistem após recarregar
- [ ] Favoritos aparecem no Dashboard após recarregar
- [ ] Comentários ainda aparecem no post
- [ ] Dados persistem em nova sessão

---

## Teste 5: Sincronização Entre Dispositivos 📱💻
**Objetivo:** Testar sincronização real-time entre diferentes dispositivos/browsers

### Prerequisitos:
- Browser 1: Seu PC/Mac
- Browser 2: Seu celular (na mesma WiFi)

### Passos:
1. **Browser 1:** Faça login e vá para `/post/[qualquer-post]`
2. **Browser 2:** Faça login na mesma conta e vá para o **mesmo post**
3. **Browser 1:** Clique para curtir
4. **Browser 2:** Observe o contador mudar **sem recarregar**?
5. **Browser 2:** Salve o post como favorito
6. **Browser 1:** Verifique se o ícone de favorito muda? **Sem recarregar?**

### Resultado Esperado:
- [ ] Curtida sincroniza em <2 segundos
- [ ] Favorito sincroniza em <2 segundos
- [ ] UI atualiza sem recarregar manualmente

---

## Teste 6: XP e Level Up 🎮
**Objetivo:** Verificar se XP é sincronizado

### Passos:
1. **Aba A:** Vá para `/dashboard` e anote o XP atual
2. **Aba B:** Também vá para `/dashboard`
3. **Aba A:** Curta um post (deve ganhar +5 XP)
4. **Aba B:** Recarregue ou espere ~3 segundos
5. **Observação:** XP aumentou em 5?

### Resultado Esperado:
- [ ] XP aumenta corretamente ao curtir (+5)
- [ ] XP aumenta ao salvar favorito (+15)
- [ ] XP sincroniza entre abas
- [ ] Level up ocorre quando atingir limite

---

## Teste 7: Error Handling 🚨
**Objetivo:** Testar comportamento com erros

### Passos:
1. **DevTools:** Abra Console (F12)
2. **Aba A:** Desconecte da internet (ou use DevTools para simular)
3. **Aba A:** Tente curtir um post
4. **Observação:** Erro é tratado graciosamente?
5. **Aba A:** Reconecte à internet
6. **Aba A:** Tente curtir novamente
7. **Observação:** Funciona normalmente?

### Resultado Esperado:
- [ ] Erro não trava a UI
- [ ] Toast/mensagem de erro aparece
- [ ] Depois de reconectar, operações funcionam normalmente
- [ ] Cache não fica corrompido

---

## Teste 8: Race Conditions 🏃
**Objetivo:** Testar segurança em operações simultâneas

### Passos:
1. **DevTools Console:** `performance.mark('start')`
2. **Aba A:** Rapidamente clique curtir + descurtir + curtir (3 vezes)
3. **Console:** `performance.mark('end')`
4. **Firebase Console:** Verifique documento do post
5. **Observação:** `likedBy[]` tem apenas o usuário? `likes` count está correto?

### Resultado Esperado:
- [ ] Após múltiplos cliques rápidos, estado é consistente
- [ ] `likedBy[]` não tem duplicatas
- [ ] `likes` count corresponde ao tamanho de `likedBy[]`
- [ ] Sem race conditions

---

## Verificação no Firebase Console 🔍

Depois de qualquer teste, verifique os dados no Firebase:

### Para Curtidas:
```
Posts Collection → [postId] → likedBy (array)
Posts Collection → [postId] → likes (number)
```
✅ Deve ter apenas usuários únicos  
✅ Likes count = tamanho do array

### Para Favoritos:
```
Users Collection → [userId] → favorites (array)
```
✅ Deve ter apenas postIds únicos  
✅ Sem duplicatas

### Para Comentários:
```
Posts Collection → [postId] → comments (array)
```
✅ Todos os comentários aparecem  
✅ Nenhum duplicado

---

## Checklist Final ✅

- [ ] Teste 1: Curtidas sincronizam
- [ ] Teste 2: Favoritos sincronizam
- [ ] Teste 3: Comentários não são perdidos
- [ ] Teste 4: Dados persistem
- [ ] Teste 5: Sincroniza entre dispositivos
- [ ] Teste 6: XP sincroniza
- [ ] Teste 7: Erros são tratados
- [ ] Teste 8: Sem race conditions

---

## Logs para Debug

Se algo não funcionar, verifique os console logs:

```javascript
// Em useUserProfile - Real-time listener
"[useUserProfile] Real-time update for user [userId]"

// Em useLikeMutation
"[useLikeMutation] Triggered"
"[useLikeMutation] Action result: liked/unliked"

// Em useFavoriteMutation
"[useFavoriteMutation] Triggered"
"[useFavoriteMutation] Action result: added/removed"

// Erros
"[useCommentMutation] Error:"
"[useLikeMutation] Error:"
```

---

## Contatos para Suporte

Se encontrar problemas:

1. Verifique os logs no console
2. Verifique Firebase Console → Firestore
3. Verifique Network tab (F12 → Network)
4. Verifique regras de segurança do Firestore

---

**Última atualização:** 2026-05-08  
**Status:** Pronto para teste ✅
