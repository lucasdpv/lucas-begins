import HomePage from "../views/HomePage";

export const metadata = {
  title: "BeginsProject | Portal de Games, Reviews e Cultura Pop",
  description: "Reviews, nostalgia e cultura gamer. Onde a era de ouro dos videogames vive.",
  alternates: {
    canonical: "https://lucasbegins.com.br",
  },
  openGraph: {
    title: "BeginsProject | Portal de Games, Reviews e Cultura Pop",
    description: "Reviews, nostalgia e cultura gamer. Onde a era de ouro dos videogames vive.",
    url: "https://lucasbegins.com.br",
    siteName: "BeginsProject",
    images: [
      {
        url: "https://lucasbegins.com.br/og-image.png",
        width: 1200,
        height: 630,
        alt: "BeginsProject | Portal de Games, Reviews e Cultura Pop",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeginsProject | Portal de Games, Reviews e Cultura Pop",
    description: "Reviews, nostalgia e cultura gamer. Onde a era de ouro dos videogames vive.",
    images: ["https://lucasbegins.com.br/og-image.png"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "BeginsProject",
  "url": "https://lucasbegins.com.br",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://lucasbegins.com.br/archive?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BeginsProject",
  "url": "https://lucasbegins.com.br",
  "logo": "https://lucasbegins.com.br/favicon.svg",
  "sameAs": [
    "https://github.com/lucasdpv/begins-project"
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HomePage />
    </>
  );
}
