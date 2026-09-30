"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/components/store-provider";

const navItems = [{ href: "/shop", label: "Shop" }, { href: "/shop?category=Road", label: "Road" }, { href: "/shop?category=Everyday", label: "Everyday" }, { href: "/about", label: "Our approach" }];

function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { cart } = useStore();
  const router = useRouter();

  const count = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", close);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", close); };
  }, [open]);
  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); router.push(`/shop?q=${encodeURIComponent(query.trim())}`); setSearchOpen(false); };
  return <>
    <div className="announcement"><span>RNT RUF N TUF - SPORTS COLLECTION 2026</span><span className="announcement__right">STYLE KA NAYA ROLL NUMBER</span></div>
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="RNT Footwear home"><span className="wordmark__symbol">R</span><span>RNT<span className="wordmark__light">RUF N TUF</span></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
      <div className="header-actions">
        <button className="icon-button header-search" aria-label="Search products" onClick={() => setSearchOpen((value) => !value)}><Search size={19}/></button>
        <Link className="icon-button header-wishlist" href="/wishlist" aria-label="Wishlist"><Heart size={19}/></Link>
        <Link className="bag-link" href="/cart" aria-label={`Shopping bag, ${count} items`}><ShoppingBag size={19}/><span>Bag</span><b>{String(count).padStart(2, "0")}</b></Link>
        <button className="icon-button mobile-menu-trigger" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X size={21}/> : <Menu size={21}/>}</button>
      </div>
    </header>
    {searchOpen && <form className="search-panel" role="search" onSubmit={submitSearch}><Search size={18}/><label className="sr-only" htmlFor="site-search">Search footwear</label><input id="site-search" autoFocus placeholder="Try “runner” or “court”" value={query} onChange={(event) => setQuery(event.target.value)}/><button type="submit">Search <ArrowUpRight size={15}/></button><button type="button" className="icon-button" aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={18}/></button></form>}
    <div className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}><nav aria-label="Mobile navigation">{navItems.map((item, index) => <Link href={item.href} key={item.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}<ArrowUpRight size={20}/></Link>)}<Link href="/wishlist" onClick={() => setOpen(false)}><span>05</span>Saved pieces<ArrowUpRight size={20}/></Link></nav><div className="mobile-menu__bottom"><span>RNT FOOTWEAR · OBJECTS FOR MOVEMENT</span><Link href="/contact" onClick={() => setOpen(false)}>Contact <ArrowUpRight size={15}/></Link></div></div>
  </>;
}

function Footer() {
  return <footer className="site-footer"><div className="footer-top"><div><Link href="/" className="wordmark wordmark--footer"><span className="wordmark__symbol">R</span><span>RNT<span className="wordmark__light">RUF N TUF</span></span></Link><p>Style ka naya roll number.<br/>Sports shoes by RNT.</p></div><div className="footer-links"><div><span className="footer-label">DISCOVER</span><Link href="/shop">Shop all</Link><Link href="/about">Our approach</Link><Link href="/contact">Contact</Link></div><div><span className="footer-label">YOUR RNT</span><Link href="/account">Account</Link><Link href="/wishlist">Wishlist</Link><Link href="/cart">Shopping bag</Link></div></div><div className="footer-note"><span className="footer-label">FIELD NOTES / 01</span><p>Sports shoes<br/>for every day you’re headed.</p><Link href="/shop" className="text-link">Explore the collection <ArrowUpRight size={15}/></Link></div></div><div className="footer-bottom"><span>© 2026 RNT RUF N TUF</span><span>PRODUCT PRICES AS SHOWN IN RNT CAMPAIGN ARTWORK</span><Link href="/admin">ADMIN PREVIEW <ArrowUpRight size={13}/></Link></div></footer>;
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const { notice, clearNotice } = useStore();
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(clearNotice, 2800); return () => window.clearTimeout(timer); }, [notice, clearNotice]);
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header/><main id="main-content">{children}</main><Footer/><div className={`toast ${notice ? "is-visible" : ""}`} role="status" aria-live="polite">{notice}<span aria-hidden="true">✓</span></div></>;
}

