import Link from "next/link";
export default function NotFoundPage() { return <div className="empty-state section"><span className="eyebrow">RNT / 404</span><h1>Form not found.</h1><p>This page may have moved. Explore the current concept collection.</p><Link href="/shop" className="button-primary">Browse collection</Link></div>; }
