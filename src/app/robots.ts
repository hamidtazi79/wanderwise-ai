import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/login",
          "/signup",
          "/checkout",
        ],
      },
    ],
    sitemap: "https://wanderwise.uk/sitemap.xml",
    host: "https://wanderwise.uk",
  };
}