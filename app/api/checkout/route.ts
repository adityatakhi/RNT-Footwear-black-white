import { NextResponse } from "next/server";
import { checkoutRequestSchema } from "@/lib/server/validation";
export async function POST(request: Request) {
  const parsed = checkoutRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid checkout details." }, { status: 400 });
  return NextResponse.json({ error: "Checkout is disabled until live catalog, inventory, order persistence, tax/shipping rules, and payment verification are configured." }, { status: 503 });
}
