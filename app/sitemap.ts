import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/server/catalog";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (process.env.NEXT_PUBLIC_CATALOG_LIVE !== "true") return [];

  const products = await getCatalog();
  const pages: MetadataRoute.Sitemap = ["", "/shop", "/about", "/contact"].map((path) => ({
    url: base + path,
    changeFrequency: "weekly",
    priority: path ? 0.7 : 1
  }));
  const productEntries: MetadataRoute.Sitemap = products
    .filter((product) => !product.placeholder)
    .map((product) => ({
      url: base + "/product/" + product.slug,
      changeFrequency: "weekly",
      priority: 0.8
    }));
  return [...pages, ...productEntries];
}
