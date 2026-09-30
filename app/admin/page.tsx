import type { Metadata } from "next";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/server/auth";
import { AdminProducts } from "@/components/admin-products";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Store admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return (
      <>
        <div className="page-intro">
          <div className="eyebrow">RNT / ADMIN</div>
          <h1>Restricted <span className="serif-italic">access.</span></h1>
          <p>The store back office is available only to an authenticated administrator.</p>
        </div>
        <section className="section">
          <div className="account-gate">
            <div className="checkout-card__icon"><LockKeyhole size={19} /></div>
            <h2>Admin access required</h2>
            <p>Set up the database and administrator account first, then sign in to manage the catalogue.</p>
            <Link href="/account?next=%2Fadmin" className="text-link">Sign in as admin <ArrowUpRight size={14} /></Link>
            <p className="filter-note">Setup steps are in the project README.</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="page-intro">
        <div className="eyebrow">RNT / BACK OFFICE</div>
        <h1>Store <span className="serif-italic">admin.</span></h1>
        <p>Signed in as {session.email}. Product changes are tied to your administrator account.</p>
      </div>
      <section className="section">
        <AdminProducts />
      </section>
    </>
  );
}
