"use client";

import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { useStore } from "@/components/store-provider";
import { ProductPhoto } from "@/components/product-photo";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const wished = wishlist.includes(product.id);
  const size = product.sizes[0];
  const imageClassName = `product-card__photo${product.imageFit === "contain" ? " product-card__photo--poster" : ""}`;

  return (
    <article className={`product-card reveal delay-${index % 4}`}>
      <div className={`product-card__visual tone-${product.tone}`}>
        {product.tag && <span className="product-card__tag">{product.tag}</span>}
        <button className={`icon-button product-card__heart ${wished ? "is-active" : ""}`} aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} onClick={() => toggleWishlist(product.id)}>
          <Heart size={18} fill={wished ? "currentColor" : "none"} />
        </button>
        <Link href={`/product/${product.slug}`} className="product-card__art" aria-label={`View ${product.name}`}>
          <ProductPhoto src={product.images[0]} alt={`${product.name}, ${product.colorway}`} name={product.name} tone={product.tone} sizes="(max-width: 760px) 46vw, (max-width: 1100px) 42vw, 25vw" className={imageClassName} />
        </Link>
        <button type="button" className="quick-add" disabled={!size} onClick={() => size && addToCart({ productId: product.id, slug: product.slug, name: product.name, tone: product.tone, color: product.colorway, size, price: product.price })} aria-label={size ? `Quick add ${product.name} in size ${size}` : `Size availability for ${product.name} is not confirmed`}>
          <span>{size ? `Quick add · UK ${size}` : "Sizes coming soon"}</span>
          {size && <ArrowUpRight size={16} />}
        </button>
      </div>
      <div className="product-card__meta">
        <div><Link href={`/product/${product.slug}`} className="product-card__name">{product.name}</Link><p>{product.colorway}</p></div>
        <span className="product-card__price">{formatPrice(product.price)}</span>
      </div>
    </article>
  );
}
