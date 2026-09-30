import type { Metadata } from "next";
import { HomePage } from "@/components/home";
import { getCatalog } from "@/lib/server/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "RNT Footwear — Built for more.",
  description: "Explore the RNT footwear collection: considered sneakers for everyday movement.",
  alternates: { canonical: "/" }
};

export default async function Page() {
  const products = await getCatalog();
  return <HomePage products={products} />;
}
