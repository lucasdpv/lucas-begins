import { db } from "./firebase";
import { collection, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from "firebase/firestore";
import { slugify } from "./utils";

/**
 * Script para remover posts com títulos duplicados e garantir URLs amigáveis (slugs).
 */
export async function cleanupDuplicates() {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    const seenTitles = new Set();
    let deleteCount = 0;
    let migrateCount = 0;

    for (const postDoc of snapshot.docs) {
      const data = postDoc.data();
      
      // 1. Limpeza de Duplicatas
      if (seenTitles.has(data.title)) {
        await deleteDoc(doc(db, "posts", postDoc.id));
        deleteCount++;
        continue;
      }
      seenTitles.add(data.title);

      // 2. Migração de Slugs (URLs amigáveis)
      let needsUpdate = false;
      const updates = {};

      if (!data.slug) {
        updates.slug = slugify(data.title);
        needsUpdate = true;
      }

      // 3. Migração de Datas (converter String p/ Date se necessário)
      if (typeof data.createdAt === 'string') {
        updates.createdAt = new Date(data.createdAt);
        needsUpdate = true;
      }

      if (needsUpdate) {
        await updateDoc(doc(db, "posts", postDoc.id), updates);
        migrateCount++;
      }
    }

    if (deleteCount > 0 || migrateCount > 0) {
      console.log(`[CleanUp] Sucesso: ${deleteCount} duplicatas removidas, ${migrateCount} posts migrados para Slugs.`);
    }
  } catch (error) {
    console.error("[CleanUp] Erro ao limpar/migrar posts:", error);
  }
}
