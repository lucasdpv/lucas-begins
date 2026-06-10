import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { 
  initializeFirestore, 
  memoryLocalCache
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID as string
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta serviços para uso no App
export const auth = getAuth(app);

// Configuração de cache para performance e offline
// No momento, vamos usar apenas cache em memória para evitar travamentos em escritas pesadas
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache() 
});

// Firebase Storage
export const storage = getStorage(app);

// Google
export const googleProvider = new GoogleAuthProvider();
