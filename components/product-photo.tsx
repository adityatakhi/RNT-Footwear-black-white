"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { ProductArt } from "@/components/product-art";

type ProductPhotoProps = {
  src?: string;
  alt: string;
  name: string;
  tone: Product["tone"];
  sizes: string;
  className?: string;
};

export function ProductPhoto({ src, alt, name, tone, sizes, className }: ProductPhotoProps) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <ProductArt tone={tone} name={name} className={className} />;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
