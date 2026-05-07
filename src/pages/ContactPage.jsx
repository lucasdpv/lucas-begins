import React, { useState } from "react";
import { Send, Loader2, Gamepad2, User, Mail, MessageSquare } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import { contactService } from "../services/contactService";
import { cn } from "../lib/utils";

export default function ContactPage() {
  const { isDark } = useThemeStore();
  const { showToast } = useUIStore();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    
    try {
      await contactService.sendMessage(formData);
      showToast("MENSAGEM ENVIADA! PLAYER 1 LOGADO COM SUCESSO.", "success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      showToast("ERRO NO SISTEMA. TENTE NOVAMENTE.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 md:py-12 px-4 relative overflow-hidden">
      <Helmet>
        <title>Contato | Lucas Begins</title>
        <meta name="description" content="Fale com o Player 1 do Lucas Begins." />
      </Helmet>

      {/* Efeito de Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Título com Text Shadow Retro */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block px-6 md:px-10 py-3 md:py-4 bg-purple-600 border-4 md:border-[6px] border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_rgba(0,0,0,1)] mb-6 md:mb-8">
             <h1 className="font-retro font-bold text-2xl md:text-6xl text-white uppercase tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] md:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                Fale <span className="text-yellow-400">Conosco</span>
             </h1>
          </div>
          <p className={cn(
            "font-retro text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold drop-shadow-sm",
            isDark ? "text-purple-400" : "text-purple-900"
          )}>
            Insert Coin to Start Conversation
          </p>
        </div>

        {/* Card do Formulário (Estilo Caixa de Diálogo SNES Expandida) */}
        <div className={cn(
          "p-6 md:p-16 border-4 md:border-[8px] shadow-[10px_10px_0px_rgba(0,0,0,1)] md:shadow-[20px_20px_0px_rgba(0,0,0,1)] relative transition-all",
          isDark 
            ? "bg-gray-900/80 backdrop-blur-sm border-purple-600" 
            : "bg-snes-surface border-snes-dark"
        )}>
          
          <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Nome */}
              <div className="space-y-3 md:space-y-4">
                <label className="flex items-center gap-3 font-retro text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-80">
                  <User size={16} className="text-purple-500" /> Player 1 (Nome)
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="DIGITE SEU NOME..."
                  className={cn(
                    "w-full px-4 md:px-6 py-4 md:py-5 border-4 md:border-[6px] font-retro text-xs md:text-sm uppercase outline-none transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.2)] focus:shadow-none focus:translate-x-1 focus:translate-y-1",
                    isDark 
                      ? "bg-gray-800 border-gray-700 text-white focus:border-purple-500" 
                      : "bg-white border-snes-dark/30 text-black focus:border-snes-dark"
                  )}
                />
              </div>

              {/* Email */}
              <div className="space-y-3 md:space-y-4">
                <label className="flex items-center gap-3 font-retro text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-80">
                  <Mail size={16} className="text-purple-500" /> E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="SEU@EMAIL.COM"
                  className={cn(
                    "w-full px-4 md:px-6 py-4 md:py-5 border-4 md:border-[6px] font-retro text-xs md:text-sm uppercase outline-none transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.2)] focus:shadow-none focus:translate-x-1 focus:translate-y-1",
                    isDark 
                      ? "bg-gray-800 border-gray-700 text-white focus:border-purple-500" 
                      : "bg-white border-snes-dark/30 text-black focus:border-snes-dark"
                  )}
                />
              </div>
            </div>

            {/* Mensagem */}
            <div className="space-y-3 md:space-y-4">
              <label className="flex items-center gap-3 font-retro text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-80">
                <MessageSquare size={16} className="text-purple-500" /> Mensagem do Quest
              </label>
              <textarea
                required
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="ESCREVA SUA MENSAGEM AQUI..."
                className={cn(
                  "w-full px-4 md:px-6 py-4 md:py-5 border-4 md:border-[6px] font-retro text-xs md:text-sm uppercase outline-none transition-all resize-none shadow-[4px_4px_0px_rgba(0,0,0,0.2)] focus:shadow-none focus:translate-x-1 focus:translate-y-1",
                  isDark 
                    ? "bg-gray-800 border-gray-700 text-white focus:border-purple-500" 
                    : "bg-white border-snes-dark/30 text-black focus:border-snes-dark"
                )}
              />
            </div>

            {/* Botão de Envio (Estilo Retro Button Gigante) */}
            <div className="pt-4 md:pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full flex items-center justify-center gap-3 md:gap-4 py-4 md:py-6 border-4 md:border-[6px] font-retro text-sm md:text-2xl font-bold uppercase shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[6px] md:active:translate-x-[10px] active:translate-y-[6px] md:active:translate-y-[10px] transition-all group",
                  isDark 
                    ? "bg-purple-600 text-white border-black hover:bg-purple-500" 
                    : "bg-snes-accent text-white border-black hover:opacity-90"
                )}
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" />
                ) : (
                  <>
                    <Gamepad2 className="w-5 h-5 md:w-8 md:h-8 group-hover:animate-bounce shrink-0" /> 
                    <span className="drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] md:drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] truncate">PRESS START (ENVIAR)</span>
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
