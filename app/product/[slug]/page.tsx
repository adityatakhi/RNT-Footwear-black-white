import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getCatalogProduct } from "@/lib/server/catalog";

export const dynamic = "force-dynamic";
const catalogLive = process.env.NEXT_PUBLIC_CATALOG_LIVE === "true";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) return { title: "Product not found", robots: { index: false, follow: false } };

  const indexable = catalogLive && !product.placeholder;
  const title = product.seoTitle || product.name;
  const description = product.seoDescription || product.subtitle;
  return {
    title,
    description,
    alternates: { canonical: "/product/" + product.slug },
    robots: { index: indexable, follow: indexable },
    openGraph: {
      title: title + " — RNT Footwear",
      description,
      type: "website",
      images: product.images[0] ? [{ url: product.images[0], alt: product.name + " footwear" }] : []
    }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) notFound();

  return (
    <Suspense fallback={<div className="section page-skeleton"><div className="skeleton-line skeleton-line--large" /><div className="skeleton-grid"><i /><i /></div></div>}>
      <ProductDetail product={product} />
    </Suspense>
  );
}
