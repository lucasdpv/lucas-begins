import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { 
  initializeFirestore, 
  memoryLocalCache
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => {
    const suffix = key.replace(/([A-Z])/g, "_$1").toUpperCase();
    return `NEXT_PUBLIC_FIREBASE_${suffix} (or VITE_FIREBASE_${suffix})`;
  });

if (missingVars.length > 0) {
  throw new Error(`Missing Firebase environment variables: ${missingVars.join(", ")}`);
}

const firebaseConfig = requiredEnvVars as Record<string, string>;

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
