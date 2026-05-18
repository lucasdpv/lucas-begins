import React, { useEffect } from "react";
import { Shield } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";
import { cn } from "../lib/utils";

export default function PrivacyPolicyPage() {
  const { isDark } = useThemeStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className={cn("max-w-4xl mx-auto space-y-12 animate-fade-in", isDark ? "text-gray-300" : "text-gray-700")}>
      <Helmet>
        <title>Política de Privacidade | BeginsProject</title>
        <link rel="canonical" href="https://lucasbegins.com.br/privacy" />
        <meta name="description" content="Política de Privacidade do portal BeginsProject." />
      </Helmet>

      <header className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className={cn("p-4 rounded-2xl", isDark ? "bg-purple-500/10" : "bg-purple-100")}>
            <Shield className={cn("w-12 h-12", isDark ? "text-purple-400" : "text-purple-600")} />
          </div>
        </div>
        <h1 className={cn("font-retro text-4xl md:text-5xl font-black uppercase tracking-tighter", isDark ? "text-white text-glow" : "text-black")}>
          Política de <span className={isDark ? "text-purple-400" : "text-purple-600"}>Privacidade</span>
        </h1>
        <p className="font-retro uppercase tracking-widest text-xs opacity-70">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
      </header>

      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("p-8 md:p-10 rounded-2xl retro-card space-y-8 text-sm md:text-base leading-relaxed", isDark ? "bg-gray-800/50" : "bg-white")}
      >
        <section className="space-y-4">
          <h2 className={cn("font-retro text-2xl font-bold uppercase", isDark ? "text-white" : "text-black")}>1. Coleta de Informações</h2>
          <p>O <strong>BeginsProject</strong> coleta informações para fornecer uma experiência melhor a todos os nossos usuários. As informações coletadas incluem dados fornecidos ativamente por você (como nome e email durante o cadastro) e dados coletados automaticamente (como cookies de navegação e endereço IP).</p>
        </section>

        <section className="space-y-4">
          <h2 className={cn("font-retro text-2xl font-bold uppercase", isDark ? "text-white" : "text-black")}>2. Uso de Cookies e Anúncios (Google AdSense)</h2>
          <p>Utilizamos cookies de terceiros para veicular anúncios com base em visitas anteriores dos usuários ao nosso site ou a outros sites na internet. O Google e seus parceiros usam cookies de publicidade para veicular anúncios com base na sua navegação.</p>
          <p>Você pode desativar a publicidade personalizada acessando as <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-purple-500 hover:underline">Configurações de anúncios do Google</a>.</p>
        </section>

        <section className="space-y-4">
          <h2 className={cn("font-retro text-2xl font-bold uppercase", isDark ? "text-white" : "text-black")}>3. Segurança dos Dados (Firebase)</h2>
          <p>Para o sistema de autenticação, utilizamos o <strong>Firebase Authentication</strong> (provido pelo Google). Suas credenciais de login e dados pessoais associados são armazenados e trafegados utilizando os mais altos padrões de criptografia da indústria. Nós não temos acesso à sua senha em momento algum.</p>
        </section>

        <section className="space-y-4">
          <h2 className={cn("font-retro text-2xl font-bold uppercase", isDark ? "text-white" : "text-black")}>4. Compartilhamento de Dados</h2>
          <p>Não vendemos, trocamos ou transferimos para terceiros as suas informações pessoalmente identificáveis. Isso não inclui parceiros de hospedagem e terceiros que nos auxiliam na operação do nosso site, desde que as partes concordem em manter essas informações confidenciais.</p>
        </section>

        <section className="space-y-4">
          <h2 className={cn("font-retro text-2xl font-bold uppercase", isDark ? "text-white" : "text-black")}>5. Consentimento</h2>
          <p>Ao utilizar o nosso portal, você concorda com a nossa Política de Privacidade online.</p>
        </section>
      </motion.article>
    </div>
  );
}
