import { unstable_cache } from "next/cache";
import { products as sampleProducts, getProduct as getSampleProduct, type Product } from "@/lib/products";
import { connectDb } from "@/lib/server/db";
import { ProductModel } from "@/models/product";

type CatalogRow = {
  _id: unknown;
  slug: string;
  name: string;
  subtitle?: string;
  category?: Product["category"];
  price?: number;
  colorway?: string;
  tone?: Product["tone"];
  swatches?: Product["swatches"];
  sizes?: number[];
  tag?: string;
  description?: string;
  details?: string[];
  images?: string[];
  seoTitle?: string;
  seoDescription?: string;
  placeholder?: boolean;
  variants?: Array<{ size: number; price: number; color: string; images?: string[]; stock?: number }>;
};

function toProduct(row: CatalogRow): Product {
  const variants = row.variants ?? [];
  const tone: Product["tone"] = row.tone && ["chalk", "volt", "ember", "slate"].includes(row.tone) ? row.tone : "chalk";
  const images = row.images?.length ? row.images : variants.flatMap((variant) => variant.images ?? []);
  return {
    id: String(row._id), slug: row.slug, name: row.name, subtitle: row.subtitle ?? "",
    category: row.category ?? "Everyday", price: row.price ?? variants[0]?.price ?? 0,
    colorway: row.colorway ?? variants[0]?.color ?? "Chalk / Black", tone,
    swatches: row.swatches?.length ? row.swatches : [{ name: row.colorway ?? "Chalk / Black", tone }],
    sizes: row.sizes?.length ? row.sizes : variants.map((variant) => variant.size),
    tag: row.tag, description: row.description ?? "", details: row.details ?? [], images,
    imageFit: images.some((image) => image.startsWith("/campaigns/")) ? "contain" : undefined,
    placeholder: row.placeholder ?? false
  };
}

const getCachedCatalog = unstable_cache(
  async () => {
    await connectDb();
    const rows = await ProductModel.find({ status: "published", placeholder: false }).sort({ createdAt: -1 }).limit(500).lean();
    return (rows as unknown as CatalogRow[]).map(toProduct);
  },
  ["rnt-public-catalog-v1"],
  { revalidate: 60, tags: ["catalog"] }
);

const getCachedProduct = unstable_cache(
  async (slug: string) => {
    await connectDb();
    const row = await ProductModel.findOne({ slug, status: "published", placeholder: false }).lean();
    return row ? toProduct(row as unknown as CatalogRow) : null;
  },
  ["rnt-public-product-v1"],
  { revalidate: 60, tags: ["catalog"] }
);

export async function getCatalog(): Promise<Product[]> {
  if (!process.env.MONGODB_URI) return sampleProducts;
  try {
    const merged = new Map(sampleProducts.map((product) => [product.slug, product]));
    for (const product of await getCachedCatalog()) merged.set(product.slug, product);
    return [...merged.values()];
  } catch (error) {
    console.error("Public product catalog is unavailable.", error);
    return sampleProducts;
  }
}

export async function getCatalogProduct(slug: string): Promise<Product | null> {
  if (!process.env.MONGODB_URI) return getSampleProduct(slug) ?? null;
  try {
    return (await getCachedProduct(slug)) ?? getSampleProduct(slug) ?? null;
  } catch (error) {
    console.error("Product detail is unavailable.", error);
    return getSampleProduct(slug) ?? null;
  }
}
