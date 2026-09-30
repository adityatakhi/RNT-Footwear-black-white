"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/components/store-provider";

export default function WishlistPage() {
  const { wishlist } = useStore();
  const saved = products.filter((product) => wishlist.includes(product.id));
  return <><div className="page-intro"><div className="eyebrow">RNT / YOUR EDIT</div><h1>Saved <span className="serif-italic">for later.</span></h1><p>Pieces you’ve kept close for another look.</p></div><section className="section">{saved.length ? <div className="product-grid">{saved.map((product, index) => <ProductCard key={product.id} product={product} index={index}/>)}</div> : <div className="empty-state"><h2>Your edit is waiting.</h2><p>Save the forms you like and they’ll stay here on this device.</p><Link href="/shop" className="button-primary">Explore the collection <ArrowUpRight size={15}/></Link></div>}</section></>;
}
