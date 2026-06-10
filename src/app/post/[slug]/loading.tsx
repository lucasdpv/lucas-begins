import React from "react";
import PostDetailSkeleton from "../../../features/posts/components/PostDetailSkeleton";

// loading.tsx desativado — o skeleton de rota causava um flash visual indesejado
// entre todas as navegações. O PostDetailPage gerencia seu próprio estado de loading
// com delay de 300ms para evitar skeleton quando há dados em cache (prefetch).
export default function Loading() {
  return <PostDetailSkeleton />;
}
