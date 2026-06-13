# 🌏 Guia Universal: Integração Firebase para Projetos Web

Este guia fornece os passos fundamentais para conectar qualquer aplicação frontend moderna (React, Vue, Vite, Vanilla JS) ao ecossistema Firebase.

---

## 1. Configuração no Console do Firebase

O Console é onde você gerencia o backend da sua aplicação.

1. **Criar Projeto**: Acesse o [Firebase Console](https://console.firebase.google.com/) e clique em "Adicionar Projeto".
2. **Ativar Módulos**: No menu lateral, ative os serviços necessários para o seu sistema:
   - **Authentication**: Para gestão de usuários e login.
   - **Firestore Database**: Banco de dados NoSQL para armazenar documentos.
   - **Storage**: Para armazenamento de arquivos (imagens, vídeos, etc).
3. **Registrar App**: Na página inicial do projeto, clique no ícone **Web (</>)**. Após registrar, você receberá o objeto `firebaseConfig` contendo suas chaves de API.

---

## 2. Segurança e Variáveis de Ambiente (`.env`)

**Nunca** coloque suas chaves de API diretamente no código-fonte que será enviado para um repositório público (como GitHub).

1. Na raiz do seu projeto, crie um arquivo chamado `.env.local` (ou apenas `.env`).
2. Adicione suas chaves seguindo o padrão do seu framework (ex: Vite usa `VITE_`, Create React App usa `REACT_APP_`):

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def
```

> **Importante**: Certifique-se de que o arquivo `.env` está listado no seu `.gitignore`.

---

## 3. Inicialização no Código

Instale o SDK do Firebase via terminal:

```bash
npm install firebase
```

Crie um arquivo de configuração (ex: `src/lib/firebase.ts` ou `src/firebase.js`):

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as instâncias para uso no projeto
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

---

## 4. Regras de Segurança (Firestore Rules)
No Console do Firebase, você deve configurar quem tem permissão para ler ou escrever dados. Na aba **Firestore Database > Regras**, publique as seguintes regras atualizadas para a nova arquitetura do blog:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Função auxiliar para verificar se o usuário é administrador (pelo email na coleção admins)
    function isAdmin() {
      return request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }

    // Regras para a coleção de posts
    match /posts/{postId} {
      // Qualquer um pode ler posts públicos
      allow read: if resource.data.isDraft == false;
      // Apenas administradores e autores autenticados podem ver rascunhos
      allow read: if request.auth != null && 
        (isAdmin() || resource.data.author.id == request.auth.uid);
      
      // Criar e Deletar posts: Apenas administradores
      allow create, delete: if isAdmin();
      
      // Atualizar posts: Administradores podem atualizar tudo.
      // Leitores anônimos só podem incrementar o contador de "views".
      allow update: if isAdmin() || 
        (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['views']));
         
      // Subcoleção de comentários dos posts
      match /comments/{commentId} {
        // Leitura pública de comentários
        allow read: if true;
        // Criação: Usuário logado salvando a si mesmo como autor
        allow create: if request.auth != null && request.resource.data.authorId == request.auth.uid;
        // Atualização/Exclusão: Apenas o dono do comentário ou Admin
        allow update, delete: if request.auth != null && 
          (resource.data.authorId == request.auth.uid || isAdmin());
      }
    }
    
    // Coleção de perfis de usuário
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Coleção de categorias
    match /categories/{catId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Coleção de admins
    match /admins/{email} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    // Coleção de mensagens (Contato)
    match /messages/{messageId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
  }
}
```

---

## 5. Regras do Firebase Storage (Storage Rules)
Na aba **Storage > Regras** do console, publique o conjunto de regras abaixo para controlar com segurança o upload de imagens de capa de posts e fotos de perfil:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Imagens de Posts (Capa e Conteúdo)
    match /posts/{allPaths=**} {
      allow read: if true;
      // Permite escrita apenas se o usuário for um administrador registrado no Firestore
      allow write: if request.auth != null && 
        firestore.exists(/databases/(default)/documents/admins/$(request.auth.token.email));
    }

    // Avatares de Usuários
    // Restringe para que cada usuário possa enviar e modificar apenas a sua própria pasta de avatar (uid)
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId; 
    }
  }
}
```

---

## 5. Exemplo de Uso Simples

Para salvar um documento em uma coleção:

```javascript
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

async function salvarDado() {
  try {
    const docRef = await addDoc(collection(db, "usuarios"), {
      nome: "João Silva",
      email: "joao@exemplo.com",
      timestamp: new Date()
    });
    console.log("Documento escrito com ID: ", docRef.id);
  } catch (e) {
    console.error("Erro ao adicionar documento: ", e);
  }
}
```

---
