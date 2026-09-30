import { describe, expect, it } from "vitest";
import { formatPrice, getProduct, products } from "@/lib/products";
describe("editable catalog", () => {
  it("uses stable, unique product identifiers and slugs", () => {
    expect(new Set(products.map((product) => product.id)).size).toBe(products.length);
    expect(new Set(products.map((product) => product.slug)).size).toBe(products.length);
  });
  it("keeps every sample size attached to a valid product", () => {
    expect(products.every((product) => product.sizes.length > 0 && product.sizes.every((size) => Number.isInteger(size) && size > 0))).toBe(true);
    expect(getProduct("strata-runner")?.placeholder).toBe(true);
  });
  it("formats prices with the configured Indian currency", () => {
    expect(formatPrice(8490)).toContain("8,490");
    expect(formatPrice(8490)).toContain("₹");
  });
});
