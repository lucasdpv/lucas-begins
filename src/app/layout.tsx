import React, { Suspense } from "react";
import Script from "next/script";
import Providers from "../components/Providers";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_TWITTER_CARD,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "../lib/siteMetadata";
import "../index.css";

export const viewport = {
  themeColor: "#9333ea",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Portal de Games, Reviews e Cultura Pop`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  keywords: ["BeginsProject", "games", "reviews", "nostalgia gamer", "cultura pop"],
  openGraph: {
    title: `${SITE_NAME} | Portal de Games, Reviews e Cultura Pop`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: DEFAULT_TWITTER_CARD,
    title: `${SITE_NAME} | Portal de Games, Reviews e Cultura Pop`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2196854476924119"
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
