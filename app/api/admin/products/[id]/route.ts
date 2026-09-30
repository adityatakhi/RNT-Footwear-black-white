import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { connectDb } from "@/lib/server/db";
import { getSession } from "@/lib/server/auth";
import { ProductModel } from "@/models/product";
type ProductVariant = { sku: string; color: string; size: number; price: number; stock: number; reservedStock: number; images: string[] };

const productInput = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().max(180).optional().default(""),
  subtitle: z.string().trim().max(180).optional().default(""),
  category: z.enum(["Road", "Court", "Everyday"]),
  price: z.number().int().min(0).max(10000000),
  colorway: z.string().trim().min(2).max(80),
  tone: z.enum(["chalk", "volt", "ember", "slate"]),
  size: z.number().int().min(1).max(16),
  sku: z.string().trim().min(2).max(64).transform((value) => value.toUpperCase()),
  stock: z.number().int().min(0).max(100000),
  image: z.string().trim().max(500).optional().default(""),
  description: z.string().trim().max(6000).optional().default(""),
  status: z.enum(["draft", "published", "archived"]),
  seoTitle: z.string().trim().max(70).optional().default(""),
  seoDescription: z.string().trim().max(170).optional().default("")
});

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 180);
}

function allowedImage(value: string) {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "images.unsplash.com" || (url.hostname === "res.cloudinary.com" && Boolean(process.env.CLOUDINARY_CLOUD_NAME) && url.pathname.startsWith("/" + process.env.CLOUDINARY_CLOUD_NAME + "/")));
  } catch {
    return false;
  }
}

function originAllowed(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  try {
    return Boolean(host && new URL(origin).host.toLowerCase() === host.toLowerCase());
  } catch {
    return false;
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });
  if (!originAllowed(request)) return NextResponse.json({ error: "Request origin could not be verified." }, { status: 403 });

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Product not found." }, { status: 404 });

  try {
    const parsed = productInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Check the product fields and try again." }, { status: 400 });
    if (!allowedImage(parsed.data.image)) return NextResponse.json({ error: "Use an HTTPS image from the configured image host." }, { status: 400 });

    await connectDb();
    const product = await ProductModel.findById(id);
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const data = parsed.data;
    const slug = slugify(data.slug || data.name);
    if (!slug) return NextResponse.json({ error: "Enter a product name that can be used in a link." }, { status: 400 });
    const variants: ProductVariant[] = (product.variants as unknown as Array<{ toObject: () => ProductVariant }>).map((variant) => variant.toObject());
    const matchingVariant = variants.findIndex((variant: ProductVariant) => variant.sku === data.sku || (variant.size === data.size && variant.color === data.colorway));
    const nextVariant: ProductVariant = {
      sku: data.sku,
      color: data.colorway,
      size: data.size,
      price: data.price,
      stock: data.stock,
      reservedStock: matchingVariant >= 0 ? variants[matchingVariant].reservedStock : 0,
      images: data.image ? [data.image] : []
    };
    if (matchingVariant >= 0) variants[matchingVariant] = { ...variants[matchingVariant], ...nextVariant };
    else variants.push(nextVariant);

    product.set({
      slug,
      name: data.name,
      subtitle: data.subtitle || data.name,
      category: data.category,
      price: data.price,
      colorway: data.colorway,
      tone: data.tone,
      swatches: [{ name: data.colorway, tone: data.tone }],
      sizes: Array.from(new Set<number>(variants.map((variant: ProductVariant) => variant.size))).sort((a, b) => a - b),
      images: data.image ? [data.image] : [],
      description: data.description,
      seoTitle: data.seoTitle || data.name,
      seoDescription: data.seoDescription || data.subtitle || data.name,
      placeholder: data.status !== "published",
      status: data.status,
      variants
    });
    await product.save();
    revalidateTag("catalog", "max");
    return NextResponse.json({ data: product }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "That product link or SKU is already in use." }, { status: 409 });
    }
    return NextResponse.json({ error: "The product could not be updated. Check the database and required fields." }, { status: 503 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });
  if (!originAllowed(request)) return NextResponse.json({ error: "Request origin could not be verified." }, { status: 403 });

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Product not found." }, { status: 404 });

  try {
    await connectDb();
    const product = await ProductModel.findByIdAndUpdate(id, { $set: { status: "archived" } }, { new: true });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    revalidateTag("catalog", "max");
    return NextResponse.json({ success: true, message: "Product removed from the active shop." }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "The product could not be removed. Check the database connection." }, { status: 503 });
  }
}

