# YonnaCookies_ website 🍪

A mobile-first cookie shop with a working cart, Box Builder, order form and an owner-only orders page.
Built with Next.js (App Router), Tailwind CSS, Framer Motion, Zustand, react-hook-form + zod, and PostgreSQL via Drizzle.

## Updating the site (no coding skills needed beyond editing text)

Everything editable lives in `src/data/`:

| File | What it controls |
| --- | --- |
| `flavors.ts` | The cookie menu. Add a flavor by copying a block, giving it a unique `id`, and pointing `image` at a photo in `public/images/cookies/`. `available: false` shows "Sold out". The Box Builder picks up new flavors automatically. |
| `pricing.ts` | Prices in dollars (single, box of 6, dozen) and the pricing-card copy. |
| `site.ts` | Contact details (⚠️ **email, phone and pickup location are placeholders, so replace them**), Instagram links, pickup time windows, occasions, minimum lead time (`leadDays`), timezone, payment note. |
| `faq.ts` | FAQ questions and answers (look for the `CONFIRM` comments). |
| `reviews.ts` | Customer reviews. The three included are **samples** (tagged "Sample" on the site). Replace them with real ones and set `isPlaceholder: false`. Empty the array to hide the section. |
| `gallery.ts` | Gallery photos and alt text. |
| `images.ts` | Hero photos, box photo and the About photo (add a photo of My'onna here). |

### Swapping in real photos
Drop JPG/PNG files into `public/images/cookies/` using the same file names (or update the paths in `flavors.ts`, `gallery.ts` and `images.ts`).
The photos that ship with the site are **AI-generated stand-ins**, so replace them with My'onna's own cookie photos.

## Orders

1. A customer fills in the order form → `POST /api/orders` validates everything again on the server, recomputes the total from the menu prices, and saves it to the `orders` table.
2. Orders are visible only at **`/admin`** (owner login). The public website can only *create* orders, never read them.
3. Cart contents are stored in the browser (localStorage) until the order is sent.

### Owner login (`/admin`)
Set these environment variables (they're in `.env` for local development, so **change the password**):

```
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=a-long-unique-password
ADMIN_SESSION_SECRET=long-random-string   # optional but recommended
```
There is no public sign-up: only that one account can sign in.

### Email notifications (optional)
New orders can be emailed to My'onna using [Resend](https://resend.com):

```
RESEND_API_KEY=re_xxx
OWNER_EMAIL=where-to-send-orders@example.com
RESEND_FROM="YonnaCookies_ <orders@yourdomain.com>"   # optional
```
If the keys aren't set, nothing is sent (the order is still saved and a log line is written). Keys are only read on the server.

### Adding online payments later
Prices are calculated in cents in `src/lib/pricing.ts`, and orders are created in one place (`src/app/api/orders/route.ts`).
To add Stripe, create a Checkout Session from that route using `snapshot.totalCents` and `snapshot.items`, then redirect the customer to it.

## Developing

```bash
npm install
npx drizzle-kit push      # create the orders table
npm run dev
npx vitest run            # unit tests for the pricing logic
```

Database tables are defined in `src/db/schema.ts`.
