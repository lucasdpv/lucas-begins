import { db } from "./firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { initialPosts, INITIAL_CATEGORIES } from "../data/mockData";
import { slugify } from "./utils";

/**
 * Script utilitário para migrar os dados mockados para o Firestore.
 * Evita que o usuário comece com o blog vazio.
 */
export async function seedDatabase() {
  try {
    // 1. Verifica se já existem posts
    const postsCol = collection(db, "posts");
    const snapshot = await getDocs(postsCol);

    if (snapshot.empty) {
      // Sobe os posts iniciais
      for (const post of initialPosts) {
        // eslint-disable-next-line no-unused-vars
        const { id, ...postData } = post;
        await addDoc(postsCol, {
          ...postData,
          slug: slugify(postData.title),
          createdAt: serverTimestamp()
        });
      }
    }

    // 2. Verifica categorias
    const catCol = collection(db, "categories");
    const catSnapshot = await getDocs(catCol);
    
    if (catSnapshot.empty) {
      for (const cat of INITIAL_CATEGORIES) {
        await addDoc(catCol, { name: cat });
      }
    }

  } catch (error) {
  }
}
