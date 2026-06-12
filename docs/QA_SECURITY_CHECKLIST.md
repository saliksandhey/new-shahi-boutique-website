# Production QA & Security Checklist

## 1. Authentication & Authorization
- [ ] Ensure Supabase Row Level Security (RLS) is enabled on **all** tables (`profiles`, `products`, `orders`, `cart_items`, etc.).
- [ ] Ensure the `/admin` route is completely protected by `requireAdmin()` middleware or server actions.
- [ ] Test login, logout, and password reset flows. Ensure malicious users cannot forge an `ADMIN` role from the client.

## 2. Server Actions & Checkout Security
- [ ] **Price Manipulation Protection**: Ensure `lib/actions/checkout.ts` ALWAYS recalculates totals using server-fetched `price` and `sale_price` from the Supabase database. Do not trust client-provided totals.
- [ ] **Stock Validation**: Ensure checkout fails gracefully if `quantity` requested exceeds `stock_quantity`.
- [ ] **Coupon Validation**: Verify coupons against `valid_until` dates and `min_purchase_amount` parameters server-side.
- [ ] **Duplicate Orders**: Razorpay Webhooks and the verify step must prevent idempotency issues. Use Supabase `upsert` or unique IDs to prevent double charging.

## 3. File Upload Security
- [ ] Ensure Supabase Storage buckets have strict policies allowing only authenticated admins to upload.
- [ ] Validate image types (`image/jpeg`, `image/png`, `image/webp`) before uploading.
- [ ] Restrict file sizes to a maximum of 2MB to prevent DDOS attacks on bandwidth.
- [ ] Generate UUIDs for filenames to prevent path traversal attacks.

## 4. Error Handling & Monitoring
- [ ] Setup `Sentry` (`@sentry/nextjs`) to capture 500 errors in Server Actions and Next.js APIs.
- [ ] Test the global `error.tsx` boundary by forcefully throwing an error on a page to ensure the UI handles it gracefully.
- [ ] Monitor the `/api/webhooks/razorpay` endpoint for unhandled promises or failed signature validations.

## 5. SEO & Performance
- [ ] Validate `robots.txt` is blocking `/admin` paths.
- [ ] Validate `sitemap.ts` returns a valid XML tree with a status 200.
- [ ] Run Lighthouse audits. Ensure LCP (Largest Contentful Paint) is < 2.5s. Use `next/image` effectively.
- [ ] Ensure Google Fonts (`Inter`, `Playfair Display`) are properly optimized via Next.js `next/font`.
