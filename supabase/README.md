# Prepared Supabase integration

No remote database has been connected or changed. Use a **new, dedicated Creator Supabase project**. The `webstudio_creator` schema contains only Creator records, checked project identifiers, composite foreign keys, protected memberships and RLS on every table. Never import or point this at Expert client data.

Apply the migration after review. Expose this custom schema through the Supabase Data API only when an authenticated adapter exists. Provision admin memberships through a trusted server / SQL console, never browser metadata. `service_role` keys bypass RLS and must remain server-only. RLS is the last defence, not a replacement for checking a verified session in the adapter.

The default repository throws for every data operation and returns no authenticated session. Adding environment keys does not activate it. Implement `CreatorRepository` with an SSR Supabase client, verified user (`getUser`), membership lookup, ownership checks and explicit project filters. Then wire each portal feature to this adapter. Keep finance and administrative mutations server-side, audit them and reprice orders transactionally from a published price version.

Storage buckets are intentionally not created yet. Before uploads are enabled, create a private Creator-only bucket, validate MIME signatures and size, scan uploads, restrict object access by an owned order path, and issue short-lived signed download URLs only after session and ownership verification. File table access alone never authorises a blob download. Do not use a public bucket.

No payment provider, subscription activation, invoice issuance or email-log persistence is simulated. The present SMTP channel stores the full enquiry in the dedicated operator inbox. On database integration, use transactional order creation plus an outbox and idempotency key to support reliable delivery and retries.
