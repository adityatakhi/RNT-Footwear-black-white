import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
export async function GET() { const user = await getSession(); return NextResponse.json({ user: user ? { email: user.email, role: user.role } : null }, { headers: { "Cache-Control": "no-store" } }); }
