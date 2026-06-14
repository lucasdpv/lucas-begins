import React, { Suspense } from "react";
import { Chakra_Petch, Inter } from "next/font/google";
import Script from "next/script";
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

export const viewport = {
  themeColor: "#9333ea",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "BeginsProject | Portal de Games, Reviews e Cultura Pop",
  description: "Reviews, nostalgia e cultura gamer. Onde a era de ouro dos videogames vive.",
  manifest: "/manifest.json",
  verification: {
    google: "rvrfvuhbyFotJwCQUczLpQixiBgPbOsHc5JclnYA_h4",
    yandex: "a0322cb8457934be",
  },
  other: {
    "google-adsense-account": "ca-pub-2196854476924119",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${chakraPetch.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JVB43T20R3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JVB43T20R3');
          `}
        </Script>

        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2196854476924119"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        <Providers>
          <Suspense fallback={null}>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
