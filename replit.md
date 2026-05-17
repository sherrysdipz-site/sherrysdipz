# Sherry's Dipz

A premium order-collection web app for Sherry's Dipz — a small-batch Mediterranean dip company. Customers browse the menu, add dips to a cart, and submit their order (pickup or delivery, cash or e-Transfer). No live payment processing.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/sherrys-dipz run dev` — run the frontend (port 22567)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, wouter, framer-motion, react-hook-form + zod
- API: Express 5
- Validation: Zod (`zod/v4`)
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Fonts: Fraunces (serif/display) + DM Sans (body)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for API contracts
- `artifacts/sherrys-dipz/src/` — React frontend
  - `pages/LandingPage.tsx` — hero + product grid
  - `pages/CheckoutPage.tsx` — order form (name, phone, email, pickup/delivery, cash/e-Transfer)
  - `pages/ThankYouPage.tsx` — confirmation + e-Transfer instructions
  - `components/ProductGrid.tsx` — 6 dip products with cart controls
  - `components/CartSlideover.tsx` — slide-in cart panel
  - `context/CartContext.tsx` — cart state (in-memory)
- `artifacts/api-server/src/routes/` — Express route handlers
  - `products.ts` — GET /api/products (hardcoded 6 dips)
  - `orders.ts` — POST /api/orders (validates, calls Sheets + email libs)
  - `lib/sheets.ts` — Google Sheets append (requires integration setup)
  - `lib/email.ts` — Resend email notifications (requires RESEND_API_KEY)

## Products & Prices

| Product | Price |
|---|---|
| Labneh | $12 |
| Hummus | $12 |
| Olive Dip | $10 |
| Matbucha | $12 |
| Tahini | $10 |
| Turkish Eggplant | $15 |

All dips are 8 oz, gluten free.

## Architecture decisions

- No database — orders go directly to Google Sheets (no persistence layer needed for this use case)
- Products hardcoded in both frontend and API server — no DB reads on every page load
- Email and Sheets integrations gracefully degrade if not configured (order still returns 201)
- Cart state is in-memory (React context) — no localStorage, intentionally simple
- e-Transfer email displayed on ThankYouPage when payment method is "etransfer"

## Integrations (to wire up)

- **Resend** — set `RESEND_API_KEY` secret, then fill in `artifacts/api-server/src/lib/resend-client.ts`
- **Google Sheets** — set `GOOGLE_SHEET_ID` env var, connect via Replit OAuth, then fill in `artifacts/api-server/src/lib/sheets-client.ts`
- **Admin email** — set `ADMIN_EMAIL` env var (defaults to sherrys.dipz@gmail.com)
- **From email** — set `FROM_EMAIL` env var (must be a verified Resend domain)

## User preferences

- No live payment processing — cash on pickup/delivery or e-Transfer
- All dips are gluten free (show on site)
- e-Transfer email: mrsizzypops@hotmail.com
- Brand colors: teal (#4F9E8E) + terracotta (#C85A2A) + warm cream background
- Fonts: Fraunces (display) + DM Sans (body)

## Gotchas

- After any `openapi.yaml` change, run `pnpm --filter @workspace/api-spec run codegen` before using updated types
- `@assets/` alias in Vite resolves to `attached_assets/` at the repo root
- The api-server does NOT use PostgreSQL — no DATABASE_URL needed
