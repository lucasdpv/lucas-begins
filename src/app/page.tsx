import HomePage, { InitialHomeData } from "../views/HomePage";
import { calculateReadingTime } from "../lib/utils";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_TWITTER_CARD,
  SEARCH_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "../lib/siteMetadata";

export const revalidate = 300; // Revalida a Home no servidor a cada 5 minutos (ISR)

export const metadata = {
  title: `${SITE_NAME} | Portal de Games, Reviews e Cultura Pop`,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "games",
    "reviews",
    "nostalgia gamer",
    "cultura pop",
    "retro gaming",
    "análise de jogos",
    "dossiês",
    "artigos sobre videogames",
    "retroCafé",
    "história dos games",
  ],
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
};

function parseFirestoreValue(value: any): any {
  if (!value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return parseInt(value.integerValue, 10);
  if ("doubleValue" in value) return parseFloat(value.doubleValue);
  if ("booleanValue" in value) return value.booleanValue;
  if ("arrayValue" in value) {
    return (value.arrayValue.values || []).map((val: any) => parseFirestoreValue(val));
  }
  if ("mapValue" in value) {
    const obj: any = {};
    const fields = value.mapValue.fields || {};
    for (const key in fields) {
      obj[key] = parseFirestoreValue(fields[key]);
    }
    return obj;
  }
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  return value;
}

function getPostTimestampSeconds(post: any): number {
  const c = post?.createdAt;
  if (!c) return 0;
  if (typeof c === "object" && typeof c.seconds === "number") return c.seconds;
  if (typeof c === "string") {
    const ms = Date.parse(c);
    return Number.isNaN(ms) ? 0 : Math.floor(ms / 1000);
  }
  return 0;
}

async function fetchInitialHomeData(): Promise<InitialHomeData | undefined> {
  const projectId = "lucas-begins";
  try {
    const queryUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/posts?pageSize=100`;
    const response = await fetch(queryUrl, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return undefined;

    const data = await response.json();
    const docs = data.documents || [];
    const allPublished = docs
      .map((doc: any) => {
        if (!doc?.fields) return null;
        const id = doc.name ? doc.name.split("/").pop() : "";
        const parsed: any = { id };
        for (const key in doc.fields) {
          parsed[key] = parseFirestoreValue(doc.fields[key]);
        }
        if (parsed.isDraft) return null;

        // Substitui o markdown completo (pesado) apenas pelo tempo de leitura pré-calculado nos cards da Home
        return {
          ...parsed,
          content: calculateReadingTime(parsed.content || ""),
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => getPostTimestampSeconds(b) - getPostTimestampSeconds(a));

    if (allPublished.length === 0) return undefined;

    return {
      featured: allPublished.filter((p: any) => p.isFeatured).slice(0, 5),
      mostViewed: [...allPublished]
        .sort((a: any, b: any) => (Number(b.views) || 0) - (Number(a.views) || 0))
        .slice(0, 5),
      latest: allPublished.slice(0, 4),
      reviews: allPublished.filter((p: any) => p.category === "Reviews").slice(0, 5),
      dossies: allPublished
        .filter((p: any) => p.category?.toLowerCase().includes("dossi"))
        .slice(0, 3),
      retrocafe: allPublished.filter((p: any) => p.category === "RetroCafé").slice(0, 3),
    };
  } catch (err) {
    console.error("Erro ao pré-carregar dados da Home no servidor:", err);
    return undefined;
  }
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: SEARCH_URL,
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  sameAs: ["https://github.com/lucasdpv/begins-project"],
};

export default async function Page() {
  const initialData = await fetchInitialHomeData();

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
      <HomePage initialData={initialData} />
    </>
  );
}
