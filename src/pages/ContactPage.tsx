import React, { useState, useEffect } from "react";
import { Send, Loader2, Gamepad2, User, Mail, MessageSquare, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import { contactService } from "../services/contactService";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../context/TranslationContext";

const DIALOGUE_TRANSLATIONS: Record<string, string> = {
  pt: "Fala galera!!! Eu sou o Lucas, o Player 1 deste portal. Você encontrou um bug ou quer propor uma nova fase? Envie sua mensagem abaixo e eu responderei em breve! 🎮",
  en: "Hey guys!!! I'm Lucas, the Player 1 of this portal. Did you find a bug or want to propose a new stage? Send your message below and I will reply soon! 🎮",
  es: "¡Hola a todos!!! Soy Lucas, el Player 1 de este portal. ¿Encontraste un error o quieres proponer una nueva fase? ¡Envía tu mensagem abajo y te responderé pronto! 🎮",
  fr: "Salut tout le monde!!! Je suis Lucas, le Player 1 de ce portail. Vous avez trouvé un bug ou vous voulez proposer un nouveau niveau ? Envoyez votre message ci-dessous et je vous répondrai bientôt ! 🎮",
  de: "Hallo Leute!!! Ich bin Lucas, der Player 1 dieses Portals. Habt ihr einen Bug gefunden oder wollt ihr ein neues Level vorschlagen? Sendet eure Nachricht unten und ich werde bald antworten! 🎮",
  ja: "やあ、みんな！！！僕はルーカス、このポータルのプレイヤー1だよ。バグを見つけたか、新しいステージを提案したい？下にメッセージを送ね。すぐに返信するよ！🎮"
};

export default function ContactPage() {
  const { isDark } = useThemeStore();
  const { showToast } = useUIStore();
  const { language } = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const fullText = DIALOGUE_TRANSLATIONS[language] || DIALOGUE_TRANSLATIONS.pt;

  useEffect(() => {
    let i = 0;
    setIsTyping(true);
    setDialogText("");
    const interval = setInterval(() => {
      setDialogText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [fullText]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (formData.name.trim().length < 2) {
      showToast("Nome muito curto. Use pelo menos 2 caracteres.", "error");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showToast("E-mail inválido.", "error");
      return false;
    }
    if (formData.message.trim().length < 10) {
      showToast("Mensagem muito curta. Escreva pelo menos 10 caracteres.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    
    try {
      await contactService.sendMessage(formData);
      showToast("MENSAGEM ENVIADA! QUEST COMPLETED.", "success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      showToast("ERRO NO SISTEMA. TENTE NOVAMENTE.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 relative overflow-hidden flex flex-col items-center">
      <Helmet>
        <title>Quest Log: Contato | BeginsProject</title>
        <link rel="canonical" href="https://lucasbegins.com.br/contact" />
        <meta name="description" content="Fale com o Player 1 do BeginsProject." />
      </Helmet>

      {/* Efeito de Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      <div className="w-full max-w-4xl space-y-12 relative z-10">
        
        {/* RPG Dialogue Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 md:p-8 border-[6px] border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-6 relative",
            isDark ? "bg-blue-900/40" : "bg-blue-600"
          )}
        >
          {/* NPC Avatar Area */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-purple-500 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center p-1">
               <Gamepad2 className="w-12 h-12 text-white animate-bounce" />
            </div>
            <span className="bg-yellow-400 text-black border-2 border-black px-3 py-1 font-retro text-[10px] font-bold uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              Player 1
            </span>
          </div>

          {/* Dialogue Text */}
          <div 
            className="flex-1 bg-black/40 border-4 border-black/20 p-4 md:p-6 relative min-h-[120px] notranslate"
            translate="no"
          >
            <p className="font-retro text-sm md:text-lg text-white leading-relaxed tracking-wide">
              {dialogText}
              {isTyping && <span className="inline-block w-2 h-4 bg-white animate-pulse ml-1" />}
            </p>
            {!isTyping && (
              <div className="absolute bottom-2 right-2 animate-bounce">
                <ChevronRight className="w-6 h-6 text-yellow-400 rotate-90" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Quest Input Card */}
        <div className={cn(
          "p-8 md:p-12 border-[8px] border-black shadow-[15px_15px_0px_rgba(0,0,0,1)] relative overflow-hidden",
          isDark ? "bg-gray-800" : "bg-snes-surface"
        )}>
          <div className="absolute -top-1 -right-1 bg-yellow-400 text-black border-b-4 border-l-4 border-black px-6 py-2 font-retro font-bold text-xs uppercase z-20">
            Quest: Enviar Mensagem
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nome */}
              <div className="space-y-3 group">
                <label className="font-retro text-[10px] font-bold uppercase tracking-widest text-purple-500 flex items-center gap-2">
                  <User size={14} /> Nickname / Nome
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-5 py-4 border-4 font-retro text-xs uppercase outline-none transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1",
                      isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-snes-dark text-black"
                    )}
                    placeholder="DIGITE SEU NOME..."
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3 group">
                <label className="font-retro text-[10px] font-bold uppercase tracking-widest text-purple-500 flex items-center gap-2">
                  <Mail size={14} /> Canal de Comunicação (Email)
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    "w-full px-5 py-4 border-4 font-retro text-xs uppercase outline-none transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1",
                    isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-snes-dark text-black"
                  )}
                  placeholder="SEU@EMAIL.COM"
                />
              </div>
            </div>

            {/* Mensagem */}
            <div className="space-y-3 group">
              <label className="font-retro text-[10px] font-bold uppercase tracking-widest text-purple-500 flex items-center gap-2">
                <MessageSquare size={14} /> Detalhes da Missão (Mensagem)
              </label>
              <textarea
                required
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className={cn(
                  "w-full px-5 py-4 border-4 font-retro text-xs uppercase outline-none transition-all resize-none shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1",
                  isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-snes-dark text-black"
                )}
                placeholder="CONTE-ME SEU PLANO..."
              />
            </div>

            {/* Botão Start */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full flex items-center justify-center gap-4 py-5 border-[6px] font-retro text-xl font-bold uppercase shadow-[10px_10px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[10px] active:translate-y-[10px] transition-all relative group overflow-hidden",
                  isDark ? "bg-purple-600 text-white border-black" : "bg-purple-600 text-white border-black"
                )}
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                {isSubmitting ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <Send className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    <span>PRESS START TO SEND</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
