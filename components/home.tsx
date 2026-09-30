import Link from "next/link";
import { MotionEffects } from "@/components/motion-effects";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductPhoto } from "@/components/product-photo";
import { CampaignGallery } from "@/components/campaign-gallery";
import { products as sampleProducts, type Product } from "@/lib/products";

export function HomePage({ products }: { products: Product[] }) {
  const heroProduct = products[0] ?? sampleProducts[0];
  return (
    <>
      <MotionEffects />
      <section className="hero">
        <div className="hero__copy reveal">
          <div className="eyebrow">RNT SPORTS SHOES · COLLECTION 2026</div>
          <h1>STEP <span>into your stride.</span></h1>
          <p className="hero__description">Style ka naya roll number. Explore the RNT sports collection and find the shoe that feels like you.</p>
          <div className="hero__actions">
            <Link className="button-primary" href="/shop">Explore the collection <ArrowUpRight size={15} /></Link>
            <Link className="button-secondary" href="/about">About RNT <ArrowUpRight size={14} /></Link>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__orbit" aria-hidden="true" />
          <div className="hero__shoe"><ProductPhoto src={heroProduct.images[0]} alt={`${heroProduct.name} ${heroProduct.colorway} sports shoe`} name={heroProduct.name} tone={heroProduct.tone} sizes="(max-width: 760px) 92vw, 54vw" className="hero__shoe-photo" /></div>
          <span className="hero__index">RNT / {heroProduct.name.toUpperCase()}</span>
          <span className="hero__caption">Style meets comfort</span>
        </div>
        <div className="hero__folio"><b>RNT</b> &nbsp; — &nbsp; SPORTS COLLECTION 2026</div>
      </section>

      <section className="section section--tight" aria-labelledby="featured-heading">
        <div className="section-head">
          <div><div className="section-kicker">RNT SPORTS COLLECTION</div><h2 id="featured-heading">Find your <span>stride.</span></h2></div>
          <Link href="/shop" className="text-link">View all shoes <ArrowUpRight size={15} /></Link>
        </div>
        <div className="product-grid">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
      </section>

      <CampaignGallery />

      <section className="story-band rnt-story" aria-labelledby="rnt-story-heading">
        <div className="story-copy">
          <div className="section-kicker">STYLE KA NAYA ROLL NUMBER</div>
          <h2 id="rnt-story-heading">Made for <span>every move.</span></h2>
          <p>The collection artwork brings together sports style, everyday comfort and durable designs. Open each shoe to see its original RNT campaign artwork.</p>
          <Link href="/shop" className="text-link">Shop the collection <ArrowUpRight size={15} /></Link>
        </div>
        <div className="rnt-story__mark" aria-hidden="true">RNT<span>RUF N TUF</span></div>
      </section>

      <div className="home-footnote">
        <span><ArrowDown size={14} /> PRODUCT DETAILS / SOURCE ARTWORK</span>
        <p>Names, colourways and prices shown here come from the RNT images you supplied. Size availability and stock were not included, so adding to bag stays off until those are confirmed. Checkout is not live.</p>
      </div>
    </>
  );
}
