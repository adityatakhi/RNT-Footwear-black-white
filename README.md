# RNT Footwear

A responsive RNT footwear storefront and Next.js App Router project. It keeps the original online sneaker concepts and adds the eight user-provided RNT campaign images, plus product pages for the four models and prices identified in those images.

## Run locally

Use Node.js 20.9 or newer.

1. Install packages with npm install.
2. Copy .env.example to .env.local.
3. Add MONGODB_URI and an AUTH_SECRET with at least 32 characters.
4. Add ADMIN_EMAIL and a unique ADMIN_PASSWORD with at least 14 characters.
5. Create the first admin account with npm run admin:create.
6. Start the app with npm run dev, sign in at /account?next=%2Fadmin, and open /admin.

Development sign-in uses an in-memory rate limit when Redis is not configured. Production sign-in requires the configured Upstash Redis service. Keep .env.local private; it is ignored by Git.

## Storefront and product manager

- Mobile home and shop grids show two products per row. Tablet and desktop grids adapt at their own breakpoints.
- The four original online sneaker concepts remain in the catalog.
- The supplied RNT photos are included as original JPEGs, without image filters or crops. Four clear model/colorway/price combinations are listed from their source artwork; sizes and stock remain unconfirmed.
- The admin screen supports adding products, editing details and size stock, publishing drafts, searching, paginating, and archiving products. Each form edit manages one size/SKU variant at a time.
- Public catalogue reads use a 60-second Next.js data cache. Admin changes invalidate that cache. Public shop queries never expose draft or archived products.
- Checkout stays disabled until size availability, stock, payment, shipping and returns are configured.

## Search and performance

Canonical metadata, product-specific titles/descriptions, Open Graph images, robots.txt, a live-catalogue sitemap, and per-product SEO fields are included. Set NEXT_PUBLIC_CATALOG_LIVE=true only after checking public product details and store policies.

The app reuses MongoDB connections, bounds admin catalogue pages to 20 items, uses indexed product queries, and caches public catalogue reads. Images are served through Next.js Image optimization. A 1,000-user capacity cannot be guaranteed from code alone: configure a production CDN, MongoDB replica set, shared Redis, and media CDN, then run load and Web Vitals checks against the deployment.

## Authentication and payment boundaries

Login uses bcrypt password hashes, signed HttpOnly sessions, database-backed role checks, and Redis-backed production rate limits. Admin creation is a one-time local provisioning script; no public sign-up or password-reset flow is connected.

The cart and wishlist are local browser state. Checkout does not create a payment or order. Configure payment, tax, shipping, email, account verification, audit logging, and order persistence before accepting customer accounts or money.
