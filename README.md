# HelpHeroAI

AI + human customer support SaaS: shared inbox, Knowledge Hub, grounded AI agent ("Hero Agent"), draft replies, public help center and chat page, reports, plans and billing. Next.js 15 · React 19 · TypeScript · Tailwind · Supabase · Gemini.

Reference audit and product mapping: [docs/AUDIT.md](docs/AUDIT.md).

## Setup
1. `npm install`
2. Create a Supabase project, then run [supabase/schema.sql](supabase/schema.sql) in the SQL editor (tables, RLS, `create_workspace` function).
3. Supabase → Auth → URL config: set Site URL to your domain and add `<domain>/auth/callback` to redirect URLs.
4. Copy `.env.example` to `.env.local` and fill it in.
5. `npm run dev`. Tests: `npm test`. Typecheck/build: `npm run build`.

## Environment variables
See `.env.example`. `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY` and `BILLING_WEBHOOK_SECRET` are server only: never prefix with `NEXT_PUBLIC_`.

## How the AI works
Deterministic keyword retrieval (`lib/retrieval.ts`) picks up to 3 articles. If none match, the conversation is handed to a person without calling the AI. Otherwise Gemini answers as validated JSON (answer, confidence, sources). Below 60% confidence, or on any AI error, the chat is handed off. Each AI reply counts against the plan's monthly limit. Reports are plain SQL-style counts, not AI.

## Billing
Plan changes happen only through `POST /api/billing/webhook` (header `x-helphero-signature` = hex HMAC-SHA256 of the raw body with `BILLING_WEBHOOK_SECRET`), body `{"org_id","plan","status","customer_ref"?}`, or by an admin updating `organizations` with the service role. Returning from a payment link never activates anything. The billing page appends `client_reference_id=<org id>` to payment links; your payment provider must be configured to call the webhook (a small adapter is needed if the provider signs differently, e.g. Stripe's own signature scheme).

## Deploy to Vercel
Import the repo, add all env vars from `.env.example`, deploy. Set `NEXT_PUBLIC_SITE_URL`. Add the Vercel domain to Supabase redirect URLs.

## Not included in v1
Email/SMS/WhatsApp channels, workflows, outbound messages, team invites, file uploads, per-seat enforcement, rate limiting on the public chat endpoint (add before public launch), and a provider-specific payment webhook.
