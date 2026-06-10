import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/editor"],
    },
    sitemap: "https://lucasbegins.com.br/sitemap.xml",
  };
}
