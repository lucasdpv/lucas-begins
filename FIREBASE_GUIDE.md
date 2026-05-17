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

No Console do Firebase, você deve configurar quem tem permissão para ler ou escrever dados. Na aba **Firestore > Rules**, publique as seguintes regras para dar suporte seguro à nova arquitetura de comentários e posts:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regras de Segurança para Matérias (Posts)
    match /posts/{postId} {
      allow read: if true; // Qualquer leitor pode ler artigos publicamente
      allow write: if request.auth != null; // Admins e editores autenticados gravam
      
      // Regra Crucial: Permissões para a Subcoleção de Comentários
      match /comments/{commentId} {
        allow read: if true; // Qualquer pessoa pode ver a área de comentários
        allow write: if request.auth != null; // Apenas leitores autenticados comentam, respondem ou curtem
      }
    }
    
    // Regras de Segurança para Perfis de Usuários
    match /users/{userId} {
      allow read: if true; // Perfis públicos são visíveis
      allow write: if request.auth != null && (request.auth.uid == userId || request.auth.token.role == 'admin');
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
