import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { connectDb } from "@/lib/server/db";
import { UserModel } from "@/models/user";
export type AppRole = "customer" | "admin";
export type SessionUser = { userId: string; email: string; role: AppRole };
const cookieName = "rnt_session";
const key = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret || new TextEncoder().encode(secret).length < 32) throw new Error("AUTH_SECRET must contain at least 32 bytes");
  return new TextEncoder().encode(secret);
};
export async function createSession(user: SessionUser) { return new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuer("rnt-footwear").setIssuedAt().setExpirationTime("7d").sign(key()); }
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !process.env.AUTH_SECRET || !process.env.MONGODB_URI) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { issuer: "rnt-footwear" });
    if (typeof payload.userId !== "string" || typeof payload.role !== "string" || !["customer", "admin"].includes(payload.role)) return null;
    await connectDb();
    const user = await UserModel.findOne({ _id: payload.userId, disabledAt: null, emailVerifiedAt: { $ne: null } }).select("email role").lean();
    if (!user || user.role !== payload.role) return null;
    return { userId: String(user._id), email: user.email, role: user.role };
  } catch { return null; }
}
export async function clearSession() { (await cookies()).set(cookieName, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 }); }
