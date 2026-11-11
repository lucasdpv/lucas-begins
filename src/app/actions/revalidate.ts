"use server";

import { revalidatePath, updateTag } from "next/cache";

/**
 * Invalida o cache ISR da Home após criar/editar/excluir um post.
 * Sem isso, a Home continuaria servindo a versão em cache (até 5 min) e o
 * carrossel/novidades não refletiriam a alteração recém-salva.
 *
 * A tag "posts" é a mesma usada no fetch de src/app/page.tsx.
 */
export async function revalidateHomeCache(): Promise<void> {
  updateTag("posts");
  revalidatePath("/");
}
