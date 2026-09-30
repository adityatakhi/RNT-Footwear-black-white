import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/server/db";
import { createSession } from "@/lib/server/auth";
import { UserModel } from "@/models/user";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { loginSchema } from "@/lib/server/validation";

export async function POST(request: Request) {
  const ip = request.headers.get("x-real-ip") || "unknown";
  try {
    const limit = await checkRateLimit("login", ip, 5, 900);
    if (!limit.configured) return NextResponse.json({ error: "Sign-in is temporarily unavailable." }, { status: 503 });
    if (!limit.allowed) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Check the email and password fields." }, { status: 400 });
    await connectDb();
    const user = await UserModel.findOne({ email: parsed.data.email, disabledAt: null }).select("+passwordHash").lean();
    const valid = user && await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!valid || !user.emailVerifiedAt) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    const token = await createSession({ userId: String(user._id), email: user.email, role: user.role });
    const response = NextResponse.json({ user: { email: user.email, role: user.role } });
    response.cookies.set("rnt_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch {
    return NextResponse.json({ error: "Sign-in is unavailable until database, Redis, and authentication settings are configured." }, { status: 503 });
  }
}
