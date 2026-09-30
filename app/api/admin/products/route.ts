import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { connectDb } from "@/lib/server/db";
import { getSession } from "@/lib/server/auth";
import { ProductModel } from "@/models/product";

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

async function adminOrError() {
  const user = await getSession();
  if (!user) return { error: NextResponse.json({ error: "Sign in to continue." }, { status: 401 }) } as const;
  if (user.role !== "admin") return { error: NextResponse.json({ error: "Administrator access is required." }, { status: 403 }) } as const;
  return { user } as const;
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

export async function GET(request: Request) {
  const auth = await adminOrError();
  if ("error" in auth) return auth.error;

  try {
    await connectDb();
    const url = new URL(request.url);
    const page = Math.max(1, Math.min(10000, Number(url.searchParams.get("page")) || 1));
    const limit = Math.max(1, Math.min(50, Number(url.searchParams.get("limit")) || 20));
    const query = (url.searchParams.get("q") || "").trim().slice(0, 80);
    const status = url.searchParams.get("status") || "active";
    const filter: Record<string, unknown> = {};
    if (status === "active") filter.status = { $in: ["draft", "published"] };
    else if (["draft", "published", "archived"].includes(status)) filter.status = status;
    if (query) {
      const safeQuery = query.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
      filter.$or = [{ name: { $regex: safeQuery, $options: "i" } }, { slug: { $regex: safeQuery, $options: "i" } }, { "variants.sku": { $regex: safeQuery, $options: "i" } }];
    }
    const [items, total] = await Promise.all([
      ProductModel.find(filter).select("slug name subtitle category price colorway tone sizes images placeholder status description seoTitle seoDescription variants createdAt updatedAt").sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      ProductModel.countDocuments(filter)
    ]);
    return NextResponse.json(
      { data: items, total, page, pageSize: limit, pages: Math.max(1, Math.ceil(total / limit)) },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "The product list is unavailable. Check the database connection." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const auth = await adminOrError();
  if ("error" in auth) return auth.error;
  if (!originAllowed(request)) return NextResponse.json({ error: "Request origin could not be verified." }, { status: 403 });

  try {
    const parsed = productInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Check the product fields and try again." }, { status: 400 });
    if (!allowedImage(parsed.data.image)) return NextResponse.json({ error: "Use an HTTPS image from the configured image host." }, { status: 400 });

    await connectDb();
    const data = parsed.data;
    const slug = slugify(data.slug || data.name);
    if (!slug) return NextResponse.json({ error: "Enter a product name that can be used in a link." }, { status: 400 });
    const published = data.status === "published";
    const product = await ProductModel.create({
      slug,
      name: data.name,
      subtitle: data.subtitle || data.name,
      category: data.category,
      price: data.price,
      colorway: data.colorway,
      tone: data.tone,
      swatches: [{ name: data.colorway, tone: data.tone }],
      sizes: [data.size],
      images: data.image ? [data.image] : [],
      description: data.description,
      details: [],
      seoTitle: data.seoTitle || data.name,
      seoDescription: data.seoDescription || data.subtitle || data.name,
      placeholder: !published,
      status: data.status,
      variants: [{
        sku: data.sku,
        color: data.colorway,
        size: data.size,
        price: data.price,
        stock: data.stock,
        reservedStock: 0,
        images: data.image ? [data.image] : []
      }]
    });
    revalidateTag("catalog", "max");
    return NextResponse.json({ data: product }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "That product link or SKU is already in use." }, { status: 409 });
    }
    return NextResponse.json({ error: "The product could not be saved. Check the database and required fields." }, { status: 503 });
  }
}
