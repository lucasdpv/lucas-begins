import React, { useEffect } from 'react';
import { X, MessageCircle, Copy, Share2, Download } from 'lucide-react';
import { Post } from '../../features/posts/schemas';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  isDark: boolean;
}

export default function ShareModal({ isOpen, onClose, post, isDark }: ShareModalProps) {
  const { showToast } = useUIStore();
  const postUrl = window.location.href;

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

  const shareWhatsApp = () => {
    const text = `Confira esse artigo no Lucas Begins: ${post.title}\n\n${postUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    onClose();
  };

  const shareSystem = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || "Dá uma olhada nessa matéria no Lucas Begins!",
          url: postUrl,
        });
        onClose();
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          showToast("Erro ao compartilhar.", "error");
        }
      }
    } else {
      copyToClipboard();
    }
  };

  /**
   * Tenta compartilhar para o Instagram Stories.
   * No mobile, prioriza o compartilhamento de arquivo via API nativa.
   */
  const shareInstagramStories = async () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      try {
        // 1. Tentar compartilhar a imagem (Melhor experiência para Stories)
        if (post.imageUrl) {
          const response = await fetch(post.imageUrl);
          const blob = await response.blob();
          const file = new File([blob], 'share-card.jpg', { type: blob.type });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: post.title,
              text: `Confira: ${postUrl}`,
            });
            onClose();
            return;
          }
        }

        // 2. Fallback: Compartilhamento de texto nativo (Mais confiável que deep link)
        if (navigator.share) {
          await navigator.share({
            title: post.title,
            text: `Leia agora no Lucas Begins: ${post.title}`,
            url: postUrl,
          });
          onClose();
          return;
        }
      } catch (err) {
        console.error("Erro no compartilhamento nativo:", err);
      }
      
      // 3. Se tudo falhar (ex: navegador antigo), copia o link
      copyToClipboard();
      showToast("Link copiado! Abra o Instagram e cole no sticker de Link.", "info");
      onClose();
    } else {
      showToast("No PC: Salve a imagem e envie pelo celular! 📱", "info");
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
                {/* Instagram Stories - Especial */}
                <button
                  onClick={shareInstagramStories}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all group",
                    "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white"
                  )}
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-8 h-8 group-hover:scale-110 transition-transform"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span className="font-retro text-[10px] font-bold uppercase">Stories</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={shareWhatsApp}
                  className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all group bg-green-500 text-black"
                >
                  <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="font-retro text-[10px] font-bold uppercase">WhatsApp</span>
                </button>

                {/* Copiar Link */}
                <button
                  onClick={copyToClipboard}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all group",
                    isDark ? "bg-gray-800" : "bg-gray-100"
                  )}
                >
                  <Copy className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="font-retro text-[10px] font-bold uppercase">Copiar Link</span>
                </button>

                {/* System Share */}
                <button
                  onClick={shareSystem}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all group",
                    isDark ? "bg-purple-900/30 border-purple-500/50" : "bg-purple-100 border-purple-300"
                  )}
                >
                  <Share2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="font-retro text-[10px] font-bold uppercase">Mais Opções</span>
                </button>
              </div>

              {/* Instructions / Footer */}
              <div className={cn(
                "p-4 border-2 border-dashed flex items-start gap-3",
                isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-300 bg-gray-50"
              )}>
                <Download className="w-5 h-5 text-purple-500 shrink-0" />
                <p className="text-[10px] font-medium leading-relaxed opacity-70">
                  DICA: No Instagram, use o sticker de <strong>LINK</strong> e cole a URL para que seus seguidores possam abrir o artigo diretamente!
                </p>
              </div>
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
