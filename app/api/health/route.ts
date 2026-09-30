import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ status: "ok", service: "rnt-footwear" }, { headers: { "Cache-Control": "no-store" } }); }
