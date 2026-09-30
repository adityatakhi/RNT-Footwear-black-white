"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

const allSizes = [6, 7, 8, 9, 10, 11];
const tones: Product["tone"][] = ["chalk", "volt", "ember", "slate"];

export function ShopPage({ products }: { products: Product[] }) {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const sizes = allSizes.filter((size) => products.some((product) => product.sizes.includes(size)));
  const maxCatalogPrice = Math.max(1, ...products.map((product) => product.price));
  const requestedCategory = search.get("category") || "All";
  const category = categories.includes(requestedCategory) ? requestedCategory : "All";
  const requestedSize = Number(search.get("size") || 0);
  const size = sizes.includes(requestedSize) ? requestedSize : 0;
  const requestedTone = search.get("color") || "";
  const tone = tones.includes(requestedTone as Product["tone"]) ? requestedTone : "";
  const query = search.get("q") || "";
  const requestedSort = search.get("sort") || "featured";
  const sort = ["featured", "price-low", "price-high", "name"].includes(requestedSort) ? requestedSort : "featured";
  const requestedPrice = Number(search.get("price") ?? maxCatalogPrice);
  const maxPrice = Number.isFinite(requestedPrice) ? Math.min(maxCatalogPrice, Math.max(0, requestedPrice)) : maxCatalogPrice;

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(search.toString());
    if (value) params.set(key, value); else params.delete(key);
    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`, { scroll: false });
  };
  const reset = () => router.replace("/shop", { scroll: false });
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const found = products.filter((product) =>
      (category === "All" || product.category === category) &&
      (!size || product.sizes.includes(size)) &&
      (!tone || product.tone === tone) &&
      product.price <= maxPrice &&
      (!needle || `${product.name} ${product.subtitle} ${product.category} ${product.colorway}`.toLowerCase().includes(needle))
    );
    if (sort === "price-low") found.sort((a, b) => a.price - b.price);
    if (sort === "price-high") found.sort((a, b) => b.price - a.price);
    if (sort === "name") found.sort((a, b) => a.name.localeCompare(b.name));
    return found;
  }, [category, maxPrice, products, query, size, sort, tone]);

  return (
    <>
      <div className="page-intro"><div className="eyebrow">RNT / SPORTS COLLECTION 2026</div><h1>Find your <span className="serif-italic">stride.</span></h1><p>Explore the shoes and campaign artwork from RNT.</p></div>
      <div className="section shop-layout">
        <aside className="shop-filters" aria-label="Product filters">
          <div className="filter-group"><h3>Collection</h3>{categories.map((value) => <label key={value} className="filter-option"><input type="radio" name="category" checked={category === value} onChange={() => update("category", value === "All" ? "" : value)} /><span>{value === "All" ? "All shoes" : value}</span></label>)}</div>
          <div className="filter-group"><h3>Colour family</h3>{tones.map((value) => <label key={value} className="filter-option"><input type="radio" name="color" checked={tone === value} onChange={() => update("color", tone === value ? "" : value)} /><span className={`mini-swatch mini-swatch--${value}`} /><span>{value}</span></label>)}</div>
          {sizes.length > 0 && <div className="filter-group"><h3>UK size</h3>{sizes.map((value) => <label key={value} className="filter-option"><input type="radio" name="size" checked={size === value} onChange={() => update("size", size === value ? "" : String(value))} /><span>{value}</span></label>)}<button className="filter-clear" onClick={() => update("size", "")}>Clear size</button></div>}
          {products.length > 0 && <div className="filter-group"><h3>Price up to · ₹{maxPrice.toLocaleString("en-IN")}</h3><input aria-label="Maximum price" type="range" min="0" max={maxCatalogPrice} step="1" value={maxPrice} onChange={(event) => update("price", Number(event.target.value) === maxCatalogPrice ? "" : event.target.value)} /></div>}
          <div className="filter-group"><h3>Size information</h3><p className="filter-note">Available sizes will appear once confirmed.</p></div>
        </aside>
        <div className="shop-results">
          <div className="filter-mobile"><SlidersHorizontal size={15} /><select aria-label="Filter collection" value={category} onChange={(event) => update("category", event.target.value === "All" ? "" : event.target.value)}>{categories.map((value) => <option key={value}>{value}</option>)}</select>
            {sizes.length > 0 && <select aria-label="Filter size" value={size} onChange={(event) => update("size", event.target.value === "0" ? "" : event.target.value)}><option value={0}>All sizes</option>{sizes.map((value) => <option key={value} value={value}>UK {value}</option>)}</select>}
          </div>
          <div className="shop-results__top"><span>{visible.length} shoe{visible.length === 1 ? "" : "s"}{query ? ` for “${query}”` : ""}</span><label>Sort&nbsp; <select value={sort} onChange={(event) => update("sort", event.target.value === "featured" ? "" : event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></label></div>
          {visible.length ? <div className="product-grid">{visible.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div> : <div className="empty-state"><h2>No matching shoes.</h2><p>Try a different collection or search.</p><button className="button-primary" onClick={reset}>Reset filters</button></div>}
        </div>
      </div>
    </>
  );
}
