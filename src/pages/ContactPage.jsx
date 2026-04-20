import React, { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAppContext } from "../context/AppContext";

/**
 * Página de contato com formulário e card de e-mail.
 */
export default function ContactPage() {
  const { isDark, showToast } = useAppContext();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Mensagem recebida! Nossos pombos correios já estão trabalhando.", "success");
    setFormData({ name: "", email: "", message: "" });
  };

  const inputClass = `w-full p-4 rounded-xl outline-none border-2 font-medium focus:border-purple-500 transition-all ${
    isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-black text-black"
  }`;

  return (
    <div className="animate-in fade-in max-w-5xl mx-auto py-8">
      <Helmet>
        <title>Fale Conosco | Lucas Begins</title>
        <meta name="description" content="Entre em contato para parcerias, pautas ou reclamações." />
      </Helmet>
      <div className="text-center mb-16">
        <h1 className="font-retro font-bold text-5xl md:text-6xl uppercase tracking-widest mb-4 drop-shadow-[3px_3px_0px_rgba(168,85,247,0.5)]">
          Fale <span className="text-purple-500">Conosco</span>
        </h1>
        <p className={`text-xl max-w-2xl mx-auto font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Tem uma pauta incrível? Quer fechar parceria? Ou reclamar da nota do seu jogo favorito?
          Mande o papo reto!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card de E-mail */}
        <div className="md:col-span-1 space-y-6">
          <div className={`p-8 rounded-2xl retro-card ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <div className="w-14 h-14 bg-purple-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="font-retro font-bold text-xl uppercase mb-2">E-mail</h3>
            <p className={`font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              lucasdpv@gmail.com
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className={`md:col-span-2 p-8 md:p-10 rounded-2xl retro-card ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase font-retro opacity-80">
                  Player 1 (Seu Nome)
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                  placeholder="Ex: Mario Bros..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase font-retro opacity-80">E-mail</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                  placeholder="mario@nintendo.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase font-retro opacity-80">Sua Mensagem</label>
              <textarea
                required
                rows="6"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`${inputClass} resize-none`}
                placeholder="Escreva aqui o código secreto..."
              />
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-xl font-retro uppercase text-lg font-bold retro-button"
              >
                <Send className="w-6 h-6" /> Enviar Mensagem
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
