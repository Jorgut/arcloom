# Arcloom

Arcloom is a Chinese-first discovery catalog for design and development resources. The repository keeps the marketplace website separate from the existing React component package and Agent Skill.

## Repository map

- `apps/web/` — static catalog website and Vercel serverless submission endpoints.
- `packages/react/` — `@jorgut/liquid-glass` component library.
- `skills/liquid-glass-design/` — Agent Skill for deciding, implementing, and reviewing glass interfaces.
- `component-library.json` — discovery metadata for the React package.

## Deploy the website

Create or import a Vercel project from this repository and set **Root Directory** to `apps/web`. Use the **Other** framework preset and leave the Build Command blank. The site is static and has no frontend package installation requirement; Vercel discovers the `api/` functions beside the static files.

The public catalog works without database credentials. Online creator submissions remain disabled until all required server environment variables are configured and the database migration is applied.

### Enable creator submissions

1. Create a Supabase project and run [`apps/web/supabase/migrations/202611030001_resource_submissions.sql`](apps/web/supabase/migrations/202611030001_resource_submissions.sql) in its SQL editor.
2. In Vercel, set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `ARCLOOM_IP_HASH_SECRET` for the intended deployment environments. Generate the HMAC secret randomly (at least 32 characters) and keep it server-only. Never expose the service key to browser code.
3. Complete the operator contact and retention details in `apps/web/privacy.html` and `apps/web/terms.html`.
4. Set `ARCLOOM_SUBMISSIONS_ENABLED=true` only after the migration and privacy/contact details are ready. Redeploy.
5. Review and approve submissions manually in the Supabase dashboard. A submission never grants Arcloom resale or republication rights.

The API validates same-origin HTTPS requests and resource URLs, requires explicit rights confirmation, discards the honeypot field, and limits each HMAC-fingerprinted IP to five accepted submissions per rolling 24 hours. The raw IP is not written to the submissions table. Before broad public promotion, add a CAPTCHA or managed abuse-control service suited to the target region and monitor function/database logs.

## Current launch boundary

- The catalog currently lists three resources from the project's own Liquid Glass package and skill. Their source, authorship, and MIT license are shown; no external catalog assets are copied into this repository.
- Favorites stay in the visitor's browser.
- There are no user accounts, paid listings, checkout, subscriptions, creator payouts, or payment callbacks in this version.
- The site can be deployed as a public **catalog preview** after hosting is configured. It is not a live commerce/SaaS marketplace. WeChat Pay/Alipay require merchant enrollment, product authorization, keys, callback verification, refunds, and a real order/entitlement flow before any payment button can be enabled.
- Mainland China launch readiness (hosting reachability, business/ICP requirements, privacy compliance, and payment eligibility) has not been verified.

## Existing component package

The root npm workspace scripts continue to build and check `@jorgut/liquid-glass`. The website is an independently deployable static application; selecting `apps/web` as Vercel's root directory leaves the library package build untouched.
