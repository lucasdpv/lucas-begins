/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        // Aceita imagens de qualquer domínio externo —
        // necessário pois posts têm imagens de URLs arbitrárias inseridas pelo admin
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/firebase-storage/:path*",
        destination: "https://firebasestorage.googleapis.com/:path*",
      },
    ];
  },
};

export default nextConfig;
