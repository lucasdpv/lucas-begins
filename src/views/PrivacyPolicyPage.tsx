"use client";

import React, { useEffect } from "react";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";
import { cn } from "../lib/utils";

export default function PrivacyPolicyPage() {
  const { isDark } = useThemeStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-10 space-y-10">
      <header className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-2xl bg-purple-500/15 border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
            <Shield className="w-10 h-10 text-purple-400" />
          </div>
        </div>
        <h1 className="font-retro text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
          Política de{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
            Privacidade
          </span>
        </h1>
        <p className="font-mono uppercase tracking-[0.25em] text-[11px] text-slate-400">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>
      </header>

      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "p-6 sm:p-10 md:p-12 rounded-3xl border space-y-8 text-sm md:text-base leading-relaxed",
          isDark
            ? "bg-[#121024]/90 border-white/[0.08] text-slate-200 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)]"
            : "bg-white border-slate-200 text-slate-700 shadow-xl"
        )}
      >
        <section className="space-y-3">
          <h2 className="font-retro text-xl md:text-2xl font-black uppercase text-purple-300">
            1. Coleta de Informações
          </h2>
          <p className="article-paragraph">
            O <strong className="text-white notranslate" translate="no">BeginsProject</strong> coleta informações para fornecer uma experiência melhor a todos os nossos usuários. As informações coletadas incluem dados fornecidos ativamente por você (como nome e e-mail durante o cadastro) e dados coletados automaticamente (como cookies de navegação e endereço IP).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-retro text-xl md:text-2xl font-black uppercase text-purple-300">
            2. Uso de Cookies e Anúncios (Google AdSense)
          </h2>
          <p className="article-paragraph">
            Utilizamos cookies de terceiros para veicular anúncios com base em visitas anteriores dos usuários ao nosso site ou a outros sites na internet. O Google e seus parceiros usam cookies de publicidade para veicular anúncios com base na sua navegação.
          </p>
          <p className="article-paragraph">
            Você pode desativar a publicidade personalizada acessando as{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noreferrer"
              className="text-purple-400 hover:underline font-semibold"
            >
              Configurações de anúncios do Google
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-retro text-xl md:text-2xl font-black uppercase text-purple-300">
            3. Segurança dos Dados (Firebase)
          </h2>
          <p className="article-paragraph">
            Para o sistema de autenticação, utilizamos o <strong className="text-white">Firebase Authentication</strong> (provido pelo Google). Suas credenciais de login e dados pessoais associados são armazenados e trafegados utilizando os mais altos padrões de criptografia da indústria. Nós não temos acesso à sua senha em momento algum.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-retro text-xl md:text-2xl font-black uppercase text-purple-300">
            4. Compartilhamento de Dados
          </h2>
          <p className="article-paragraph">
            Não vendemos, trocamos ou transferimos para terceiros as suas informações pessoalmente identificáveis. Isso não inclui parceiros de hospedagem e terceiros que nos auxiliam na operação do nosso site, desde que as partes concordem em manter essas informações confidenciais.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-retro text-xl md:text-2xl font-black uppercase text-purple-300">
            5. Consentimento
          </h2>
          <p className="article-paragraph">
            Ao utilizar o nosso portal, você concorda com a nossa Política de Privacidade online.
          </p>
        </section>
      </motion.article>
    </div>
  );
}
