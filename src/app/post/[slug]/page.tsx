import { Metadata } from "next";
import PostDetailPage from "../../../views/PostDetailPage";

interface Props {
  params: Promise<{ slug: string }>;
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlugOrId(slug);
  
  const titleFromSlug = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const postTitle = post ? post.title : titleFromSlug;
  const postDesc = post ? (post.excerpt || "Leia este artigo completo no BeginsProject.") : "Leia este artigo completo no BeginsProject.";
  const finalTitle = `${postTitle} | BeginsProject`;
  const canonicalUrl = `https://lucasbegins.com.br/post/${slug}`;

  return {
    title: finalTitle,
    description: postDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: finalTitle,
      description: postDesc,
      type: "article",
      url: canonicalUrl,
      images: post?.imageUrl ? [{ url: post.imageUrl }] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  void slug;
  return <PostDetailPage />;
}
