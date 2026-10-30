"use client";

import React, { useState, useEffect } from "react";
import { Send, Loader2, Gamepad2, User, Mail, MessageSquare, ChevronRight, Sparkles } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import { contactService } from "../services/contactService";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { useTranslation } from "../context/TranslationContext";

const DIALOGUE_TRANSLATIONS: Record<string, string> = {
  pt: "Fala galera!!! Eu sou o Lucas, o Player 1 deste portal. Você encontrou um bug ou quer propor uma nova matéria? Envie sua mensagem abaixo e eu responderei em breve! 🎮",
  en: "Hey guys!!! I'm Lucas, the Player 1 of this portal. Did you find a bug or want to propose a new stage? Send your message below and I will reply soon! 🎮",
  es: "¡Hola a todos!!! Soy Lucas, el Player 1 de este portal. ¿Encontraste un error o quieres proponer una nueva fase? ¡Envía tu mensaje abajo y te responderé pronto! 🎮",
  fr: "Salut tout le monde!!! Je suis Lucas, le Player 1 de ce portail. Vous avez trouvé un bug ou vous voulez proposer un nouveau niveau ? Envoyez votre message ci-dessous et je vous répondrai bientôt ! 🎮",
  de: "Hallo Leute!!! Ich bin Lucas, der Player 1 dieses Portals. Habt ihr einen Bug gefunden oder wollt ihr ein neues Level vorschlagen? Sendet eure Nachricht unten und ich werde bald antworten! 🎮",
  ja: "やあ、みんな！！！僕はルーカス、このポータルのプレイヤー1だよ。バグを見つけたか、新しいステージを提案したい？下にメッセージを送ね。すぐに返信するよ！🎮",
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
    }, 25);
    return () => clearInterval(interval);
  }, [fullText]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    } catch {
      showToast("ERRO NO SISTEMA. TENTE NOVAMENTE.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-6 md:py-12 relative flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-retro font-black uppercase tracking-widest bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Canal Direto Begins
          </span>
          <h1 className="font-retro font-black text-3xl md:text-5xl text-white uppercase tracking-tight">
            Fale <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Conosco</span>
          </h1>
        </div>

        {/* RPG Dialogue Box (Cyber-Editorial Glass) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 md:p-8 rounded-3xl border flex flex-col md:flex-row items-center gap-6 relative overflow-hidden",
            isDark
              ? "bg-[#121024]/90 border-purple-500/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.75)]"
              : "bg-white border-purple-200 shadow-lg"
          )}
        >
          <div className="shrink-0 flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-2xl bg-purple-600/20 border border-purple-400/40 shadow-[0_0_25px_rgba(168,85,247,0.3)] flex items-center justify-center">
              <Gamepad2 className="w-10 h-10 text-purple-300" />
            </div>
            <span className="bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full font-retro text-[10px] font-black uppercase tracking-wider">
              Player 1
            </span>
          </div>

          <div
            className="flex-1 w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 md:p-6 relative min-h-[100px] flex items-center notranslate"
            translate="no"
          >
            <p className="font-retro text-sm md:text-base text-slate-100 leading-relaxed tracking-wide">
              {dialogText}
              {isTyping && <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-1" />}
            </p>
            {!isTyping && (
              <div className="absolute bottom-3 right-3 animate-bounce">
                <ChevronRight className="w-5 h-5 text-amber-400 rotate-90" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Contact Form Card */}
        <div
          className={cn(
            "p-6 sm:p-10 md:p-12 rounded-3xl border relative overflow-hidden",
            isDark
              ? "bg-[#121024]/90 border-white/[0.08] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)]"
              : "bg-white border-slate-200 shadow-xl"
          )}
        >
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="font-retro text-xs font-black uppercase tracking-widest text-purple-300 flex items-center gap-2">
                  <User size={15} className="text-purple-400" /> Seu Nome / Nickname
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={cn(
                    "w-full px-4 py-3.5 rounded-xl border font-sans font-medium text-sm outline-none transition-all",
                    isDark
                      ? "bg-white/[0.04] border-white/10 focus:border-purple-500 text-white placeholder:text-slate-500"
                      : "bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900"
                  )}
                  placeholder="Digite seu nome..."
                />
              </div>

              <div className="space-y-2.5">
                <label className="font-retro text-xs font-black uppercase tracking-widest text-purple-300 flex items-center gap-2">
                  <Mail size={15} className="text-purple-400" /> Seu E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    "w-full px-4 py-3.5 rounded-xl border font-sans font-medium text-sm outline-none transition-all",
                    isDark
                      ? "bg-white/[0.04] border-white/10 focus:border-purple-500 text-white placeholder:text-slate-500"
                      : "bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900"
                  )}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="font-retro text-xs font-black uppercase tracking-widest text-purple-300 flex items-center gap-2">
                <MessageSquare size={15} className="text-purple-400" /> Mensagem
              </label>
              <textarea
                required
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className={cn(
                  "w-full px-4 py-3.5 rounded-xl border font-sans font-medium text-sm outline-none transition-all resize-none",
                  isDark
                    ? "bg-white/[0.04] border-white/10 focus:border-purple-500 text-white placeholder:text-slate-500"
                    : "bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900"
                )}
                placeholder="Escreva sua sugestão, parceria ou feedback..."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-purple-400/50 bg-purple-600 hover:bg-purple-500 font-retro text-sm font-black uppercase tracking-widest text-white shadow-[0_12px_30px_rgba(168,85,247,0.4)] hover:scale-[1.01] active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Mensagem</span>
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
