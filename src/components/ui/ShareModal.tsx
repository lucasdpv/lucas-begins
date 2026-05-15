import React, { useEffect, useState } from 'react';
import { X, MessageCircle, Copy, Share2, Download, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Post } from '../../features/posts/schemas';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthProvider';
import { USER_ROLES } from '../../constants';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  isDark: boolean;
}

export default function ShareModal({ isOpen, onClose, post, isDark }: ShareModalProps) {
  const { showToast } = useUIStore();
  const { currentUser } = useAuth();
  const postUrl = window.location.href;
  const isAdmin = currentUser?.role === USER_ROLES.ADMIN;

  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoadingShortUrl, setIsLoadingShortUrl] = useState(false);

  // Fecha com Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      showToast("Link copiado com sucesso! 🎮");
      onClose();
    } catch (err) {
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
    } catch (err) {
      showToast("Erro ao gerar link curto.", "error");
    } finally {
      setIsLoadingShortUrl(false);
    }
  };

  const shareWhatsApp = () => {
    const text = `Confira esse artigo no BeginsProject: ${post.title}\n\n${postUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    onClose();
  };

  const shareSystem = async () => {
    if (navigator.share) {
      try {
        // Simplificamos ao máximo para evitar rejeição do sistema
        await navigator.share({
          title: post.title,
          url: postUrl,
        });
        onClose();
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Share error:", err);
          copyToClipboard();
        }
      }
    } else {
      showToast("Seu navegador não suporta o menu nativo. Link copiado!", "info");
      copyToClipboard();
    }
  };

  /**
   * Kit de Compartilhamento Manual para Instagram
   * Força o download via blob para garantir que funcione em qualquer celular
   */
  const shareInstagramStories = async () => {
    try {
      // 1. Copiar Link (Sempre funciona)
      await navigator.clipboard.writeText(postUrl);
      
      // 2. Download da Imagem
      if (post.imageUrl) {
        try {
          const response = await fetch(post.imageUrl, { mode: 'cors' });
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `lucas-begins-${post.slug || 'artigo'}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          showToast("Link copiado e imagem salva! 📸");
        } catch (corsErr) {
          // Fallback para Desktop/Browsers com restrição de CORS: Abre em nova aba
          window.open(post.imageUrl, '_blank');
          showToast("Link copiado! Salve a imagem que abriu na outra aba. 📸");
        }
      } else {
        showToast("Link copiado! Este post não possui imagem de capa.", "info");
      }
      onClose();
    } catch (err) {
      copyToClipboard();
      showToast("Link copiado!", "info");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "relative w-full max-w-md border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden",
              isDark ? "bg-gray-900 text-white" : "bg-white text-black"
            )}
          >
            {/* Header */}
            <div className="bg-purple-600 p-4 border-b-4 border-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-white" />
                <h2 className="font-retro text-lg font-bold uppercase text-white tracking-widest">Compartilhar</h2>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-black/20 rounded transition-colors">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Preview Card */}
              <div className={cn(
                "p-3 border-2 border-black bg-gray-100 rounded-none mb-4",
                isDark ? "bg-gray-800" : "bg-gray-50"
              )}>
                <div className="flex gap-4">
                  <div className="w-20 h-20 border-2 border-black shrink-0 overflow-hidden bg-purple-900">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-retro font-bold text-purple-500 uppercase mb-1">{post.category}</p>
                    <h3 className="font-retro text-xs md:text-sm font-bold uppercase line-clamp-2 leading-tight">{post.title}</h3>
                    <p className="text-[9px] opacity-60 mt-1 truncate">{postUrl}</p>
                  </div>
                </div>
              </div>

              {/* Share Options */}
              <div className="grid grid-cols-2 gap-4">
                {/* Instagram Kit - Apenas para Admins */}
                {isAdmin && (
                  <button
                    onClick={shareInstagramStories}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all group",
                      "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white"
                    )}
                  >
                    <Download className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    <span className="font-retro text-[10px] font-bold uppercase text-center">Instagram Kit</span>
                  </button>
                )}

                {/* WhatsApp */}
                <button
                  onClick={shareWhatsApp}
                  className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all group bg-green-500 text-black"
                >
                  <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="font-retro text-[10px] font-bold uppercase">WhatsApp</span>
                </button>

                {/* Copiar Link Oficial */}
                <button
                  onClick={copyToClipboard}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all group",
                    isDark ? "bg-gray-800" : "bg-gray-100"
                  )}
                >
                  <Copy className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="font-retro text-[10px] font-bold uppercase text-center">Copiar Oficial</span>
                </button>

                {/* Gerar Link Curto */}
                <button
                  onClick={getShortUrl}
                  disabled={isLoadingShortUrl}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all group",
                    isDark ? "bg-blue-900/40 text-blue-400" : "bg-blue-100 text-blue-700"
                  )}
                >
                  {isLoadingShortUrl ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <LinkIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="font-retro text-[10px] font-bold uppercase text-center">Link Curto</span>
                </button>

                {/* System Share */}
                <button
                  onClick={shareSystem}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all group",
                    isDark ? "bg-purple-900/30 border-purple-500/50" : "bg-purple-100 border-purple-300",
                    !isAdmin ? "col-span-2" : ""
                  )}
                >
                  <Share2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="font-retro text-[10px] font-bold uppercase">Mais Opções</span>
                </button>
              </div>

              {/* Instructions / Footer - Apenas para Admin */}
              {isAdmin && (
                <div className={cn(
                  "p-4 border-2 border-dashed flex items-start gap-3",
                  isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-300 bg-gray-50"
                )}>
                  <Download className="w-5 h-5 text-purple-500 shrink-0" />
                  <p className="text-[10px] font-medium leading-relaxed opacity-70">
                    DICA: Use o <strong>Instagram Kit</strong> para baixar a capa e copiar o link. No Instagram, use o sticker de LINK!
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Deco */}
            <div className="h-2 bg-black/10 flex">
              <div className="flex-1 bg-red-500" />
              <div className="flex-1 bg-yellow-400" />
              <div className="flex-1 bg-blue-500" />
              <div className="flex-1 bg-green-500" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
