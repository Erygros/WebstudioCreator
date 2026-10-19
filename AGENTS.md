# Webstudio Creator

Use only https://github.com/Erygros/WebstudioCreator.git. Work on main unless protected. Inspect remote changes before pushing; never overwrite others' changes. Commit and push each completed development step. Never commit secrets.

Next.js App Router, TypeScript, Tailwind, Motion, Lucide, Zod. All prices in integer EUR cents in src/lib/catalog.ts. Recalculate submitted configurations on the server. DE and EN must stay aligned.

Webstudio Creator is operationally separate from Webstudio Expert. Never import Expert customer data. No invented testimonials, orders, identities, payment details, or working integrations. Database features remain disabled until an actual authenticated repository adapter is connected. SMTP order delivery is an explicit request channel, not database persistence or payment confirmation.

Run npm run typecheck, npm test and npm run build before completing functional work. Document deployment prerequisites in README.md.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
