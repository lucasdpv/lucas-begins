import { Metadata } from "next";
import PostDetailPage from "../../../views/PostDetailPage";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_TWITTER_CARD,
  SITE_NAME,
  SITE_URL,
} from "../../../lib/siteMetadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300; // Revalida no máximo a cada 5 minutos

export async function generateStaticParams() {
  const projectId = "lucas-begins";
  try {
    // Busca até 100 posts públicos para pre-gerar estaticamente na hora do build
    const queryUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/posts?pageSize=100`;
    const response = await fetch(queryUrl);
    if (response.ok) {
      const data = await response.json();
      const docs = data.documents || [];
      return docs.map((doc: any) => {
        const fields = doc.fields || {};
        // Filtra rascunhos para não gerar estaticamente no build
        if (fields.isDraft?.booleanValue) return null;
        return {
          slug: fields.slug?.stringValue || ""
        };
      }).filter((p: any) => p !== null && p.slug !== "");
    }
  } catch (e) {
    console.error("Erro ao gerar parâmetros estáticos preliminares no build:", e);
  }
  return [];
}

function parseFirestoreValue(value: any): any {
  if (!value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return parseInt(value.integerValue, 10);
  if ('doubleValue' in value) return parseFloat(value.doubleValue);
  if ('booleanValue' in value) return value.booleanValue;
  if ('arrayValue' in value) {
    return (value.arrayValue.values || []).map((val: any) => parseFirestoreValue(val));
  }
  if ('mapValue' in value) {
    const obj: any = {};
    const fields = value.mapValue.fields || {};
    for (const key in fields) {
      obj[key] = parseFirestoreValue(fields[key]);
    }
    return obj;
  }
  if ('timestampValue' in value) return value.timestampValue;
  if ('nullValue' in value) return null;
  return value;
}

function parseFirestoreDocument(doc: any): any {
  if (!doc || !doc.fields) return null;
  const id = doc.name ? doc.name.split("/").pop() : "";
  const result: any = { id };
  for (const key in doc.fields) {
    result[key] = parseFirestoreValue(doc.fields[key]);
  }
  return result;
}

async function fetchPostBySlugOrId(slugOrId: string): Promise<any> {
  const projectId = "lucas-begins";
  
  // 1. Try to query by slug first
  try {
    const queryUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
    const response = await fetch(queryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "posts" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "slug" },
              op: "EQUAL",
              value: { stringValue: slugOrId }
            }
          },
          limit: 1
        }
      }),
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (response.ok) {
      const results = await response.json();
      if (Array.isArray(results) && results.length > 0 && results[0].document) {
        return parseFirestoreDocument(results[0].document);
      }
    }
  } catch (err) {
    console.error("Error querying post by slug REST:", err);
  }
  
  // 2. Fallback: try fetching by document ID directly (for legacy IDs)
  try {
    const docUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/posts/${slugOrId}`;
    const response = await fetch(docUrl, {
      next: { revalidate: 60 }
    });
    if (response.ok) {
      const docData = await response.json();
      return parseFirestoreDocument(docData);
    }
  } catch (err) {
    console.error("Error fetching post by ID REST:", err);
  }
  
  return null;
}

/**
 * Remove marcações do markdown e limita o tamanho do texto para gerar
 * descrições de SEO otimizadas e limpas para os buscadores.
 */
function cleanAndTruncateContent(content: string, maxLength = 160): string {
  if (!content) return "";
  let clean = content
    .replace(/^##\s+(.+)$/gm, "$1") // Remove títulos H2
    .replace(/^---$/gm, "") // Remove divisores
    .replace(/:::[\w-]+(?:\{#[^}]+\})?/g, "") // Remove blocos especiais
    .replace(/@\[youtube\]\([^)]+\)/g, "") // Remove embeds do YouTube
    .replace(/!\[([^\]]*)\]\([^)]+\)(?:\{#[^}]+\})*/g, "$1") // Remove imagens preservando a legenda se houver
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove negritos
    .replace(/\*([^*]+)\*/g, "$1") // Remove itálicos
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links preservando o texto descritivo
    .replace(/\s+/g, " ") // Normaliza múltiplos espaços e quebras de linha
    .trim();

  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength).trim() + "...";
}

function toIsoDate(value: any): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  }
  if (typeof value?.toDate === "function") {
    const parsed = value.toDate();
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  }
  if (typeof value === "object" && typeof value.seconds === "number") {
    const parsed = new Date(value.seconds * 1000);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlugOrId(slug);
  
  const titleFromSlug = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const postTitle = post ? post.title : titleFromSlug;
  
  // Melhora a descrição usando o resumo do post (excerpt) ou gerando um a partir do conteúdo limpo do artigo
  const fallbackDesc = post && post.content 
    ? cleanAndTruncateContent(post.content, 160) 
    : "Leia este artigo completo no BeginsProject.";
  const postDesc = post ? (post.excerpt || fallbackDesc) : "Leia este artigo completo no BeginsProject.";

  const finalTitle = `${postTitle} | ${SITE_NAME}`;
  const canonicalUrl = `/post/${slug}`;
  const imageUrl = post?.imageUrl || DEFAULT_OG_IMAGE;
  const keywords = [
    postTitle,
    post?.category,
    ...(post?.tags || []),
    SITE_NAME,
  ].filter(Boolean) as string[];

  return {
    title: finalTitle,
    description: postDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: finalTitle,
      description: postDesc,
      type: "article",
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post?.title || DEFAULT_OG_IMAGE_ALT,
        },
      ],
      publishedTime: toIsoDate(post?.createdAt),
      modifiedTime: toIsoDate(post?.updatedAt) || toIsoDate(post?.createdAt),
    },
    twitter: {
      card: DEFAULT_TWITTER_CARD,
      title: finalTitle,
      description: postDesc,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPostBySlugOrId(slug);

  const dynamicDesc = post 
    ? (post.excerpt || (post.content ? cleanAndTruncateContent(post.content, 160) : post.title))
    : "Leia este artigo completo no BeginsProject.";

  const postJsonLd = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": dynamicDesc,
    "image": post.imageUrl ? [post.imageUrl] : [],
    "datePublished": post.createdAt || new Date().toISOString(),
    "dateModified": post.updatedAt || post.createdAt || new Date().toISOString(),
    "author": [
      {
        "@type": "Person",
        "name": post.author?.name || "Anônimo",
        "jobTitle": post.author?.role || undefined
      }
    ],
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/favicon.svg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/post/${slug}`
    }
  } : null;

  return (
    <>
      {postJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
        />
      )}
      <PostDetailPage initialPost={post || undefined} />
    </>
  );
}
