import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { errorService } from "./errorService";
import { Message } from "../types";

const COLLECTION_NAME = "messages";

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const contactService = {
  /**
   * Envia uma nova mensagem do formulário de contato
   */
  async sendMessage(formData: ContactFormData): Promise<{ success: true; id: string }> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...formData,
        status: "new", // new, read, replied
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      errorService.handle(error, "ao enviar mensagem");
      throw error;
    }
  },

  /**
   * Busca todas as mensagens (Para o Admin)
   */
  async getAllMessages(): Promise<Message[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate() || new Date(),
      } as Message));
    } catch (error) {
      errorService.handle(error, "ao buscar mensagens");
      return [];
    }
  },

  /**
   * Atualiza o status de uma mensagem (Lida, Respondida, etc)
   */
  async updateMessageStatus(id: string, status: string): Promise<{ success: true }> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { status });
      return { success: true };
    } catch (error) {
      errorService.handle(error, "ao atualizar status da mensagem");
      throw error;
    }
  },

  /**
   * Exclui uma mensagem
   */
  async deleteMessage(id: string): Promise<{ success: true }> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      errorService.handle(error, "ao excluir mensagem");
      throw error;
    }
  }
};
