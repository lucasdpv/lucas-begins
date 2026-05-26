import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";
import imageCompression from 'browser-image-compression';

/**
 * Faz o upload de um arquivo para o Firebase Storage com compressão automática.
 * @param file O arquivo a ser enviado.
 * @param path O caminho dentro do bucket (ex: 'posts/minha-imagem.jpg').
 * @param onProgress Callback opcional para acompanhar o progresso (0-100).
 * @returns Uma Promise que resolve com a URL de download.
 */
export const uploadFile = async (
  file: File, 
  path: string, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  let fileToUpload: File | Blob = file;
  let finalPath = path;

  // Se for uma imagem, tenta comprimir e converter para WebP
  if (file.type.startsWith('image/')) {
    try {
      const options = {
        maxSizeMB: 0.8, // Tenta manter abaixo de 800KB
        maxWidthOrHeight: 1920, // Full HD max
        useWebWorker: true,
        initialQuality: 0.8, // 80% de qualidade
        fileType: 'image/webp' as any // Força saída em WebP para melhor performance e tamanho
      };
      
      fileToUpload = await imageCompression(file, options);
      // Substitui a extensão original do caminho por .webp
      finalPath = path.replace(/\.[^/.]+$/, "") + ".webp";
    } catch (error) {
      console.warn("Falha na compressão, enviando original...", error);
    }
  }

  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, finalPath);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("Erro no upload:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

// IndexedDB cache helper for non-destructive original image re-cropping
const DB_NAME = "lucas-begins-cache";
const STORE_NAME = "original-images";

const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const cacheOriginalImage = async (url: string, file: Blob): Promise<void> => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(file, url);
  } catch (e) {
    console.warn("Failed to cache original image in IndexedDB", e);
  }
};

export const getCachedOriginalImage = async (url: string): Promise<Blob | null> => {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(url);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn("Failed to get cached original image from IndexedDB", e);
    return null;
  }
};
