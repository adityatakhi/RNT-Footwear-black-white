# Architecture and launch notes

## Request path

```text
Browser
  → Next.js App Router and stateless Route Handlers
  → Redis-compatible cache / rate limiter
  → MongoDB Atlas replica set
  → Cloudinary or object storage for media, served through a CDN
  → Razorpay, email, analytics, and monitoring adapters
```

The home and shop pages read the published catalog from MongoDB when `MONGODB_URI` is configured. Public catalog results use a 60-second shared cache tagged for invalidation after admin changes, and `/api/products` sets short shared-cache headers. Without a database, the storefront shows clearly labeled sample products. Private data is not cached. The cart and wishlist use browser storage only and are never treated as order or inventory records.

## Data and indexes

- `User`: unique normalized email; role and disabled/verified timestamps.
- `Product`: unique slug, draft/published status, category, embedded variants, SEO fields; compound `{ status, categoryId, createdAt }` and sparse unique variant-SKU indexes.
- `Category`: unique slug and status.
- `Order`: immutable line-item price snapshots, address snapshots, payment/order states, unique order number; `{ userId, createdAt }` and `{ orderStatus, createdAt }` indexes.
- `Coupon`: unique normalized code and active/date query index.
- `ThreeDAsset`: product/variant assignment, CDN URLs, format, bytes, optimization status, transform, and material map. Binary model files are not stored in MongoDB.

Inventory helpers use MongoDB sessions and conditional updates. Production reservation expiry, idempotent payment-attempt records, and webhook/order orchestration are still required before checkout can be enabled.

## Security boundaries

- Password hashes are selected only for login verification and checked with bcrypt.
- Session tokens are signed with `AUTH_SECRET`; cookies are HttpOnly, SameSite=Lax, and Secure in production.
- Login requires Redis rate limiting and fails closed without it.
- The account login accepts only verified users; user provisioning and verification mail are not implemented.
- Admin pages and product mutation APIs require an authenticated admin session and same-origin requests. Product management supports paginated search, create, edit, publish/draft, stock checks, and soft archive; archived products remain available for historical order references.
- Checkout rejects malformed input and returns `503`. It does not accept a client total, create a Razorpay order, or mark an order paid.
- Razorpay helper verifies payment and webhook signatures with constant-time comparison. Call it only after persisting an order and payment attempt server-side.
- Request schemas bound strings, item counts, quantities, and size values. Configure trusted proxy headers, CORS, CSRF coverage, and provider-specific limits at deployment.

## Public indexing

Sample product routes are no-index by default. Set `NEXT_PUBLIC_CATALOG_LIVE=true` only after replacing and checking all sample content. Product metadata remains no-index while `placeholder` is true. Private routes are disallowed in `robots.txt` and excluded from the sitemap.

## Release checklist

1. Replace every sample product and policy with approved source data; remove placeholder labels only after review.
2. Configure MongoDB Atlas replica-set transactions, Redis, auth secret, media storage/CDN, email, monitoring, and Razorpay in deployment secrets.
3. Run the one-time `npm run admin:create` provisioning command with a verified admin email and strong password; add account registration/verification/recovery and audit logging before opening customer accounts.
4. Complete idempotent order creation, conditional inventory reservation and expiry, Razorpay signature/webhook state transitions, retries, refunds, shipping, and tax handling.
5. Add consent-aware analytics and error/Web Vitals monitoring; keep third-party scripts out of the page until the required consent and configuration exist.
6. Run unit, browser, accessibility, responsive, Lighthouse, slow-network, reduced-motion, and load tests against deployment-like infrastructure.
7. Set numerical budgets for first-route JS, image payload, fonts, GLB size, LCP, INP, CLS, and API latency from measured assets and hosting.
8. Enable the live catalog indexing switch only when the canonical URLs, product structured data, sitemap, prices, inventory policy, shipping, returns, and contact details are real and verified.

