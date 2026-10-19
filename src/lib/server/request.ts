import 'server-only';
// Supplemental per-process abuse mitigation. Configure a distributed Vercel WAF
// rule before enabling SMTP on a public deployment (see README).
const attempts = new Map<string, { count: number; expires: number }>();
export function requestAllowed(request: Request) {
  const origin = request.headers.get('origin');
  const expected = process.env.SITE_URL
    ? new URL(process.env.SITE_URL).origin
    : `${new URL(request.url).protocol}//${request.headers.get('host') || new URL(request.url).host}`;
  if (!origin || origin !== expected) return false;
  const key =
    request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'local';
  const now = Date.now();
  for (const [k, v] of attempts) if (v.expires < now) attempts.delete(k);
  const value = attempts.get(key);
  if (value && value.count >= 5) return false;
  if (!value && attempts.size >= 10000) return false;
  attempts.set(key, {
    count: (value?.count || 0) + 1,
    expires: value?.expires || now + 15 * 60 * 1000,
  });
  return true;
}
