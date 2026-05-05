import React, { useState } from "react";
import { Send, Loader2, Gamepad2, User, Mail, MessageSquare } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { contactService } from "../services/contactService";
import { cn } from "../lib/utils";

export default function ContactPage() {
  const { isDark, showToast } = useAppContext();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <Helmet>
        <title>Contato | Lucas Begins</title>
        <meta name="description" content="Fale com o Player 1 do Lucas Begins." />
      </Helmet>

      {/* Efeito de Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Título com Text Shadow Retro */}
        <div className="text-center mb-12">
          <div className="inline-block px-10 py-4 bg-purple-600 border-[6px] border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] mb-8">
             <h1 className="font-retro font-bold text-4xl md:text-6xl text-white uppercase tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                Fale <span className="text-yellow-400">Conosco</span>
             </h1>
          </div>
          <p className={cn(
            "font-retro text-sm uppercase tracking-[0.3em] font-bold drop-shadow-sm",
            isDark ? "text-purple-400" : "text-purple-900"
          )}>
            Insert Coin to Start Conversation
          </p>
        </div>

        {/* Card do Formulário (Estilo Caixa de Diálogo SNES Expandida) */}
        <div className={cn(
          "p-10 md:p-16 border-[8px] shadow-[20px_20px_0px_rgba(0,0,0,1)] relative transition-all",
          isDark 
            ? "bg-gray-900/80 backdrop-blur-sm border-purple-600" 
            : "bg-snes-surface border-snes-dark"
        )}>
          
          <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Nome */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 font-retro text-xs font-bold uppercase tracking-widest opacity-80">
                  <User size={18} className="text-purple-500" /> Player 1 (Nome)
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="DIGITE SEU NOME..."
                  className={cn(
                    "w-full px-6 py-5 border-[6px] font-retro text-sm uppercase outline-none transition-all shadow-[6px_6px_0px_rgba(0,0,0,0.2)] focus:shadow-none focus:translate-x-1 focus:translate-y-1",
                    isDark 
                      ? "bg-gray-800 border-gray-700 text-white focus:border-purple-500" 
                      : "bg-white border-snes-dark/30 text-black focus:border-snes-dark"
                  )}
                />
              </div>

              {/* Email */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 font-retro text-xs font-bold uppercase tracking-widest opacity-80">
                  <Mail size={18} className="text-purple-500" /> E-mail
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="SEU@EMAIL.COM"
                  className={cn(
                    "w-full px-6 py-5 border-[6px] font-retro text-sm uppercase outline-none transition-all shadow-[6px_6px_0px_rgba(0,0,0,0.2)] focus:shadow-none focus:translate-x-1 focus:translate-y-1",
                    isDark 
                      ? "bg-gray-800 border-gray-700 text-white focus:border-purple-500" 
                      : "bg-white border-snes-dark/30 text-black focus:border-snes-dark"
                  )}
                />
              </div>
            </div>

            {/* Mensagem */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 font-retro text-xs font-bold uppercase tracking-widest opacity-80">
                <MessageSquare size={18} className="text-purple-500" /> Mensagem do Quest
              </label>
              <textarea
                required
                rows="6"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="ESCREVA SUA MENSAGEM AQUI..."
                className={cn(
                  "w-full px-6 py-5 border-[6px] font-retro text-sm uppercase outline-none transition-all resize-none shadow-[6px_6px_0px_rgba(0,0,0,0.2)] focus:shadow-none focus:translate-x-1 focus:translate-y-1",
                  isDark 
                    ? "bg-gray-800 border-gray-700 text-white focus:border-purple-500" 
                    : "bg-white border-snes-dark/30 text-black focus:border-snes-dark"
                )}
              />
            </div>

            {/* Botão de Envio (Estilo Retro Button Gigante) */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full flex items-center justify-center gap-4 py-6 border-[6px] font-retro text-2xl font-bold uppercase shadow-[10px_10px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[10px] active:translate-y-[10px] transition-all group",
                  isDark 
                    ? "bg-purple-600 text-white border-black hover:bg-purple-500" 
                    : "bg-snes-accent text-white border-black hover:opacity-90"
                )}
              >
                {isSubmitting ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <Gamepad2 className="w-8 h-8 group-hover:animate-bounce" /> 
                    <span className="drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">PRESS START (ENVIAR)</span>
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
