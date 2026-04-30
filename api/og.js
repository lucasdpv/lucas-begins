import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, limit } from "firebase/firestore";

// Valida as variáveis de ambiente antes de inicializar
const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
];
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`[og.js] Variável de ambiente obrigatória não definida: ${key}`);
  }
}

// Inicializa o Firebase usando as variáveis de ambiente do Vercel
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    // The Vercel rewrite passes the slug as a query parameter (?slug=xyz)
    let slug = req.query.slug;

    if (!slug) {
      // Se não conseguir achar o slug, fallback
      const originalPath = req.headers['x-invoke-path'] || req.url;
      slug = originalPath.split('/').pop().split('?')[0];
    }

    if (!slug) {
      return res.status(400).send("Slug not found");
    }

    const q = query(collection(db, "posts"), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).send("Post not found");
    }

    const post = snapshot.docs[0].data();
    const siteUrl = `https://${req.headers.host}`;
    const postUrl = `${siteUrl}/post/${slug}`;
    const defaultImage = `${siteUrl}/og-image.jpg`; // Fallback image

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>${post.title} | Lucas Begins</title>
        <meta name="description" content="${post.excerpt || post.title}" />
        
        <!-- Open Graph -->
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Lucas Begins" />
        <meta property="og:title" content="${post.title}" />
        <meta property="og:description" content="${post.excerpt || post.title}" />
        <meta property="og:image" content="${post.imageUrl || defaultImage}" />
        <meta property="og:url" content="${postUrl}" />
        
        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${post.title}" />
        <meta name="twitter:description" content="${post.excerpt || post.title}" />
        <meta name="twitter:image" content="${post.imageUrl || defaultImage}" />
        
        <!-- Redirect normal users to the real React app just in case -->
        <meta http-equiv="refresh" content="0;url=${postUrl}" />
      </head>
      <body>
        <script>
           // Fallback redirect for browsers executing JS
           window.location.replace("${postUrl}");
        </script>
      </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache por 1 hora no CDN do Vercel
    return res.status(200).send(html);
  } catch (error) {
    console.error("Error generating OG tags:", error);
    return res.status(500).send("Internal Server Error");
  }
}
