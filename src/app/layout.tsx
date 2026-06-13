import React, { Suspense } from "react";
import { Chakra_Petch, Inter } from "next/font/google";
import Providers from "../components/Providers";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import "../index.css";

// Carrega as fontes via next/font para garantir paridade local ↔ produção
const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-retro",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "BeginsProject | Portal de Games, Reviews e Cultura Pop",
  description: "Reviews, nostalgia e cultura gamer. Onde a era de ouro dos videogames vive.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${chakraPetch.variable} ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>
          <Suspense fallback={null}>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
