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

  // Se for uma imagem, tenta comprimir
  if (file.type.startsWith('image/')) {
    try {
      const options = {
        maxSizeMB: 0.8, // Tenta manter abaixo de 800KB
        maxWidthOrHeight: 1920, // Full HD max
        useWebWorker: true,
        initialQuality: 0.8 // 80% de qualidade
      };
      
      fileToUpload = await imageCompression(file, options);
    } catch (error) {
      console.warn("Falha na compressão, enviando original...", error);
    }
  }

  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
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
