# Reference audit: intercom.com → HelpHeroAI

Method: public pages fetched as markdown (homepage, /pricing, /helpdesk, /ai-agent, /customer-service-platform). `/fin`, `/messenger`, `/about` redirect to fin.ai (not followed). Authenticated app was **not** inspected. CSS, hex values, fonts, animations and mobile layout were **not observable**; the design system below is an informed adaptation, not a measurement.

## Product concept
An AI + human customer-service platform: shared inbox/ticketing, help center, messenger, and a natively integrated AI agent that answers from a shared knowledge base and hands off to humans with full history.

## Target users
Support teams at startups → enterprise (SaaS, fintech, e-commerce).

## Modules observed → HelpHeroAI mapping
| Reference module | HelpHeroAI module | Implemented as |
|---|---|---|
| Inbox / Tickets | **Inbox** | conversations + messages, status, assignment, replies |
| Fin AI agent | **Hero Agent** | answers from Knowledge Hub via Gemini, confidence score, auto-handoff |
| Copilot | **Draft reply** | AI-drafted reply for agents grounded in knowledge |
| Knowledge Hub / Help Center | **Knowledge Hub + public Help Center** | articles, publish toggle, public `/help/[org]` |
| Messenger | **Chat widget page** | public `/chat/[org]` customer chat that creates conversations |
| Reporting | **Reports** | deterministic counts: volume, AI resolution rate, handoffs, CSAT-less |
| Workflows, Outbound, omnichannel, phone/SMS/WhatsApp, 450+ apps | Out of scope v1 | listed in roadmap |

## Pricing model observed
Seats + usage (AI "outcomes" ~ $0.99). Tiers Essential / Advanced / Expert, annual/monthly toggle, 14-day trial, free Lite seats on higher tiers.
HelpHeroAI adaptation (own numbers, placeholders to be confirmed by owner): **Starter / Growth / Scale**, seat limits and monthly AI-resolution credit limits enforced in the app (`lib/plans.ts`).

## User journeys
Sign up → create workspace → add knowledge → test Hero Agent → share chat/help center → agents work inbox → review reports → upgrade.

## Design system (adapted)
Warm paper background, near-black ink, large confident headlines with tight tracking, hairline borders, one saturated blue accent, product UI shown as real components (no fake mockups). Light theme only in v1.

## Could not verify
Hex values, fonts, header/footer markup, animations, responsive behaviour, signed-in app UI, /suite, /about.
