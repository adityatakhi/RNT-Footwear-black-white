import type { Metadata } from "next";
import { getSession } from "@/lib/server/auth";
import { AccountPanel } from "@/components/account-panel";
export const metadata: Metadata = { title: "Your account", robots: { index: false, follow: false } };
export default async function AccountPage() {
  const session = await getSession();
  return <><div className="page-intro"><div className="eyebrow">RNT / YOUR ACCOUNT</div><h1>Your space.</h1><p>Orders, saved addresses, and the pieces you keep close.</p></div><section className="section"><AccountPanel email={session?.email ?? null}/></section></>;
}
