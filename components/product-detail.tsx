"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Heart, Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice, products } from "@/lib/products";
import { ProductPhoto } from "@/components/product-photo";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/components/store-provider";

export function ProductDetail({ product }: { product: Product }) {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const requestedVariant = search.get("variant")?.toLowerCase();
  const initialVariant = product.swatches.find((swatch) => swatch.name.toLowerCase() === requestedVariant) || product.swatches[0];
  const [selectedTone, setSelectedTone] = useState<Product["tone"]>(initialVariant.tone);
  const [selectedColor, setSelectedColor] = useState(initialVariant.name);
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState(0);
  const [message, setMessage] = useState("");
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const related = useMemo(() => products.filter((item) => item.id !== product.id).slice(0, 3), [product.id]);

  const selectVariant = (swatch: Product["swatches"][number]) => {
    setSelectedTone(swatch.tone);
    setSelectedColor(swatch.name);
    const params = new URLSearchParams(search.toString());
    if (swatch.name === product.swatches[0].name) params.delete("variant");
    else params.set("variant", swatch.name.toLowerCase());
    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`, { scroll: false });
  };

  const add = () => {
    if (!size) {
      setMessage("Choose a UK size to continue.");
      return;
    }
    addToCart({ productId: product.id, slug: product.slug, name: product.name, tone: selectedTone, color: selectedColor, size, price: product.price });
    setMessage("Added to your bag.");
  };

  return (
    <>
      <div className="page-intro product-breadcrumb"><Link href="/shop" className="text-link"><ArrowLeft size={14} /> All footwear</Link></div>
      <div className="section product-detail">
        <div className="product-gallery">
          <div className="gallery-thumbs" aria-label="Product photos">
            {product.images.map((image, index) => <button type="button" key={image} className={`gallery-thumb ${imageIndex === index ? "is-active" : ""}`} aria-label={`Show ${index === 0 ? "product image" : "campaign artwork"}`} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)}><ProductPhoto src={image} alt="" name={product.name} tone={selectedTone} sizes="72px" className="gallery-thumb__photo" /></button>)}
          </div>
          <div className={`gallery-main tone-${selectedTone}`}>
            <ProductPhoto src={product.images[imageIndex]} alt={`${product.name}, ${product.colorway}${imageIndex > 0 ? " campaign artwork" : ""}`} name={product.name} tone={selectedTone} sizes="(max-width: 760px) 95vw, 52vw" className="gallery-main__photo" />
            <span className="gallery-count">{imageIndex === 0 ? "RNT PRODUCT ART" : "ORIGINAL CAMPAIGN ARTWORK"}</span>
          </div>
        </div>

        <div className="product-info">
          <div className="product-info__tag">{product.category.toUpperCase()} / RNT FOOTWEAR</div>
          <h1>{product.name}</h1>
          <p className="product-info__sub">{product.subtitle}</p>
          <div className="product-info__price">{formatPrice(product.price)} <span className="placeholder-inline">{product.priceLabel || (product.placeholder ? "Sample price" : "Price shown in campaign")}</span></div>
          <div className="product-info__label">Colorway <span>{selectedColor}</span></div>
          <div className="swatch-row" role="radiogroup" aria-label="Colorway">
            {product.swatches.map((swatch) => <button key={swatch.name} type="button" className={`swatch ${selectedTone === swatch.tone ? "is-selected" : ""}`} data-tone={swatch.tone} role="radio" aria-checked={selectedTone === swatch.tone} aria-label={swatch.name} onClick={() => selectVariant(swatch)}><i /></button>)}
          </div>
          <div className="product-info__label">Size <span>{product.sizes.length ? <a href="#size-guide">Size guide <ArrowUpRight size={12} /></a> : "Being confirmed"}</span></div>
          {product.sizes.length ? <div className="size-grid" role="radiogroup" aria-label="UK shoe size">{product.sizes.map((value) => <button key={value} type="button" className={`size-button ${size === value ? "is-selected" : ""}`} role="radio" aria-checked={size === value} onClick={() => { setSize(value); setMessage(""); }}>UK {value}</button>)}</div> : <p className="size-availability">Size availability will be added when RNT confirms it.</p>}
          <button className="button-primary product-buy" onClick={add} disabled={!product.sizes.length || !size}>{product.sizes.length ? <>Add to bag <ArrowRight size={15} /></> : "Size availability coming soon"}</button>
          <button className={`product-wishlist ${wishlist.includes(product.id) ? "is-active" : ""}`} onClick={() => toggleWishlist(product.id)}><Heart size={16} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />{wishlist.includes(product.id) ? "Saved to wishlist" : "Save for later"}</button>
          {message && <p className="product-info__message" role="status">{message}</p>}
          <p className="product-info__note">Model, colour and price are shown as provided in the RNT artwork. Sizes, stock and online ordering have not been confirmed.</p>
          <div className="details-accordion">
            <details open><summary>About this shoe <Plus size={14} /></summary><p>{product.description}</p></details>
            <details><summary>Artwork details <Plus size={14} /></summary><ul>{product.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></details>
            <details><summary>Shipping &amp; returns <Plus size={14} /></summary><p>Shipping and returns details will be shared once the RNT store is ready.</p></details>
            <details id="size-guide"><summary>Size guide <Plus size={14} /></summary><p>Size options have not been included in the source artwork yet.</p></details>
          </div>
        </div>
      </div>
      <section className="section section--tight"><div className="section-head"><div><div className="section-kicker">KEEP EXPLORING</div><h2>More from <span>RNT.</span></h2></div><Link href="/shop" className="text-link">Shop all <ArrowUpRight size={15} /></Link></div><div className="product-grid">{related.map((item, index) => <ProductCard key={item.id} product={item} index={index} />)}</div></section>
    </>
  );
}

