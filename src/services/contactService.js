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

const COLLECTION_NAME = "messages";

export const contactService = {
  /**
   * Envia uma nova mensagem do formulário de contato
   */
  async sendMessage(formData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...formData,
        status: "new", // new, read, replied
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("[contactService:sendMessage]", error);
      throw error;
    }
  },

  /**
   * Busca todas as mensagens (Para o Admin)
   */
  async getAllMessages() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Converte o timestamp do Firebase para objeto Date do JS
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
    } catch (error) {
      console.error("[contactService:getAllMessages]", error);
      throw error;
    }
  },

  /**
   * Atualiza o status de uma mensagem (Lida, Respondida, etc)
   */
  async updateMessageStatus(id, status) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { status });
      return { success: true };
    } catch (error) {
      console.error("[contactService:updateMessageStatus]", error);
      throw error;
    }
  },

  /**
   * Exclui uma mensagem
   */
  async deleteMessage(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error("[contactService:deleteMessage]", error);
      throw error;
    }
  }
};
