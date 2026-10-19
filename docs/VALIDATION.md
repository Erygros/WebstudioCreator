# Validation — 19 October 2026

Environment: Windows, Node.js 24.19.0, Next.js 16.4.2. No production secrets, SMTP connection or Supabase project were used.

- `npm run typecheck`: passed with strict typing and unused-local/parameter checks enabled.
- `npm test`: 11 tests passed. Includes integer pricing, recurring charges, option boundaries, client tampering, briefing validation, bounded request bodies, a fail-closed repository and migration/RLS execution in isolated PGlite PostgreSQL.
- `npm run build`: passed; Next.js production build with server-rendered locale routes and Node.js API handlers.
- `TEST_BASE_URL=http://127.0.0.1:3001 npm run test:http`: passed against production mode. 50 localised pages, 404 routes, valid server pricing, invalid price payloads, origin rejection and disabled unconfigured delivery.
- Browser: desktop at 1440 × 1050 and mobile at 390 × 844; both colour schemes inspected. Service search filters immediately; search result opens the correct service. Interactive preview tabs, Discord channels and live option selection exercised.
- Browser: Discord service with moderation option transfers a EUR 78 one-time configuration into the enquiry flow; expected deposit EUR 39 and balance EUR 39. Completed service selection, options, service-specific brief and review using local test input. Send remains disabled even after acknowledgement because SMTP is absent. No enquiry was sent.
- Browser: English and German rendering, client-navigation document language updates, active custom preview tab and 390 px page width checked. No horizontal overflow in the inspected home, service and enquiry views.

Not verified: real SMTP acceptance/delivery, provider bounce handling, Vercel deployment/domain, real Supabase auth/storage/RLS integration, legal production approval or actual payments. These remain configuration/integration requirements, not completed features. Browser screenshots are local QA artifacts and not customer references.
