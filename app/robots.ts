import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const live = process.env.NEXT_PUBLIC_CATALOG_LIVE === "true";
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return { rules: { userAgent: "*", allow: live ? "/" : [], disallow: live ? ["/account", "/admin", "/cart", "/checkout", "/wishlist", "/api/"] : "/" }, sitemap: live ? `${base}/sitemap.xml` : undefined };
}
