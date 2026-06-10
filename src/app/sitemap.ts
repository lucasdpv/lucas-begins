import { MetadataRoute } from "next";

const BASE_URL = "https://lucasbegins.com.br";

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

async function fetchAllPublicPosts(): Promise<any[]> {
  const projectId = "lucas-begins";
  const posts: any[] = [];
  let pageToken = "";
  
  do {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/posts?pageSize=100${pageToken ? `&pageToken=${pageToken}` : ""}`;
      const response = await fetch(url, {
        next: { revalidate: 3600 } // Cache sitemap fetches for 1 hour
      });
      if (!response.ok) break;
      const data = await response.json();
      
      if (data.documents) {
        for (const doc of data.documents) {
          const parsed = parseFirestoreDocument(doc);
          if (parsed && !parsed.isDraft) {
            posts.push(parsed);
          }
        }
      }
      
      pageToken = data.nextPageToken || "";
    } catch (err) {
      console.error("Error fetching all posts for sitemap:", err);
      break;
    }
  } while (pageToken);
  
  return posts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Routes
  const staticRoutes = ["", "/about", "/archive", "/contact", "/privacy"].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Dynamic Posts
  const posts = await fetchAllPublicPosts();
  const dynamicRoutes = posts.map((post) => {
    const slug = post.slug || post.id;
    let lastMod = new Date();
    if (post.updatedAt) {
      lastMod = new Date(post.updatedAt);
    } else if (post.createdAt) {
      lastMod = new Date(post.createdAt);
    }
    
    return {
      url: `${BASE_URL}/post/${slug}`,
      lastModified: lastMod,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...dynamicRoutes];
}
