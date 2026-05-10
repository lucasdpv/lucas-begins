import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  memoryLocalCache
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string
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
