import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/server/catalog";

export async function GET() {
  const data = await getCatalog();
  return NextResponse.json(
    { data, mode: process.env.MONGODB_URI ? "live" : "sample" },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}
