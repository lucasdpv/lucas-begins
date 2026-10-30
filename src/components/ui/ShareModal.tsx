import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, MessageCircle, Copy, Share2, Download, Link as LinkIcon, Loader2 } from "lucide-react";
import { Post } from "../../features/posts/schemas";
import { useUIStore } from "../../store/useUIStore";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthProvider";
import { USER_ROLES } from "../../constants";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  isDark: boolean;
}

export default function ShareModal({ isOpen, onClose, post, isDark }: ShareModalProps) {
  const { showToast } = useUIStore();
  const { currentUser } = useAuth();
  const [postUrl, setPostUrl] = useState("");
  const isAdmin = currentUser?.role === USER_ROLES.ADMIN;

  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoadingShortUrl, setIsLoadingShortUrl] = useState(false);

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      setPostUrl(window.location.href);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      showToast("Link copiado com sucesso! 🎮");
      onClose();
    } catch {
      showToast("Erro ao copiar link.", "error");
    }
  };

  const getShortUrl = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      showToast("Link curto copiado! 🔗");
      onClose();
      return;
    }

    setIsLoadingShortUrl(true);
    try {
      const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(postUrl)}`);
      const text = await res.text();
      setShortUrl(text);
      await navigator.clipboard.writeText(text);
      showToast("Link curto gerado e copiado! 🔗");
      onClose();
    } catch {
      showToast("Erro ao gerar link curto.", "error");
    } finally {
      setIsLoadingShortUrl(false);
    }
  };

  const shareWhatsApp = () => {
    const text = `Confira esse artigo no BeginsProject: ${post.title}\n\n${postUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
    onClose();
  };

  const shareSystem = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: postUrl,
        });
        onClose();
      } catch (err: any) {
        if (err.name !== "AbortError") {
          copyToClipboard();
        }
      }
    } else {
      showToast("Seu navegador não suporta o menu nativo. Link copiado!", "info");
      copyToClipboard();
    }
  };

  const shareInstagramStories = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      if (post.imageUrl) {
        try {
          const response = await fetch(post.imageUrl, { mode: "cors" });
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `lucas-begins-${post.slug || "artigo"}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          showToast("Link copiado e imagem salva! 📸");
        } catch {
          window.open(post.imageUrl, "_blank");
          showToast("Link copiado! Salve a imagem que abriu na outra aba. 📸");
        }
      } else {
        showToast("Link copiado! Este post não possui imagem de capa.", "info");
      }
      onClose();
    } catch {
      copyToClipboard();
      showToast("Link copiado!", "info");
      onClose();
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-md rounded-3xl border overflow-hidden",
              isDark
                ? "bg-[#121024]/95 border-white/10 text-white shadow-[0_28px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
                : "bg-white border-slate-200 text-slate-900 shadow-2xl"
            )}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/[0.08] bg-gradient-to-r from-purple-600/20 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/35 flex items-center justify-center text-purple-300">
                  <Share2 className="w-4 h-4" />
                </div>
                <h2 className="font-retro text-base font-black uppercase text-white tracking-widest">
                  Compartilhar Matéria
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Preview Card */}
              <div className="p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                <div className="flex gap-3.5 items-center">
                  <div className="w-18 h-18 rounded-xl border border-white/10 shrink-0 overflow-hidden bg-purple-950/60">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-800" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-retro font-bold text-purple-400 uppercase tracking-widest">
                      {post.category}
                    </span>
                    <h3 className="font-retro text-xs md:text-sm font-bold uppercase line-clamp-2 leading-snug text-white mt-0.5">
                      {post.title}
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400 mt-1 truncate">{postUrl}</p>
                  </div>
                </div>
              </div>

              {/* Share Options */}
              <div className="grid grid-cols-2 gap-3">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={shareInstagramStories}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-white/15 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-lg"
                  >
                    <Download className="w-6 h-6" />
                    <span className="font-retro text-[10px] font-black uppercase tracking-wider">
                      Instagram Kit
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={shareWhatsApp}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="font-retro text-[10px] font-black uppercase tracking-wider">
                    WhatsApp
                  </span>
                </button>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <Copy className="w-6 h-6 text-purple-400" />
                  <span className="font-retro text-[10px] font-black uppercase tracking-wider">
                    Copiar Link
                  </span>
                </button>

                <button
                  type="button"
                  onClick={getShortUrl}
                  disabled={isLoadingShortUrl}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-sky-400/30 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  {isLoadingShortUrl ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <LinkIcon className="w-6 h-6" />
                  )}
                  <span className="font-retro text-[10px] font-black uppercase tracking-wider">
                    Link Curto
                  </span>
                </button>

                <button
                  type="button"
                  onClick={shareSystem}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-purple-500/30 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer",
                    !isAdmin ? "col-span-2" : ""
                  )}
                >
                  <Share2 className="w-6 h-6" />
                  <span className="font-retro text-[10px] font-black uppercase tracking-wider">
                    Mais Opções
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof window === "undefined") return null;
  return createPortal(modalContent, document.body);
}
