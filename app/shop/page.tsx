import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPage } from "@/components/shop-page";
import { getCatalog } from "@/lib/server/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Shop sneakers",
  description: "Browse the RNT footwear collection by category, colour, size, and price.",
  alternates: { canonical: "/shop" }
};

export default async function Page() {
  const products = await getCatalog();
  return (
    <Suspense fallback={<div className="section page-skeleton"><div className="skeleton-line skeleton-line--large" /><div className="skeleton-grid"><i /><i /><i /><i /></div></div>}>
      <ShopPage products={products} />
    </Suspense>
  );
}
