import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const pages = [
  '',
  'services',
  'pricing',
  'packages',
  'projects',
  'faq',
  'contact',
  'order',
  'confirmation',
  'login',
  'register',
  'reset-password',
  'imprint',
  'privacy',
  'terms',
  'portal',
  'admin',
];
const services = [
  'creator-websites',
  'stream-overlays',
  'discord-service',
  'creator-dashboard',
  'channel-optimization',
  'short-form-content',
  'sponsoring-mediakits',
  'custom-stream-bots',
];
let checked = 0;
for (const locale of ['de', 'en'])
  for (const slug of [...pages, ...services.map((s) => 'services/' + s)]) {
    const r = await fetch(`${base}/${locale}/${slug}`);
    assert.equal(r.status, 200, `${locale}/${slug}`);
    const body = await r.text();
    assert.ok(body.includes(`lang="${locale}"`));
    assert.ok(body.includes('Webstudio'));
    checked++;
  }
for (const url of [
  '/fr',
  '/de/no-such-page',
  '/en/services/unknown',
  '/de/services/creator-websites/extra',
])
  assert.equal((await fetch(base + url)).status, 404, url);
const config = {
  productId: 'custom-stream-bots',
  quantities: { hosting: 1, api: 2 },
  priceVersion: '2026-10-19.1',
};
const post = (route, body, origin = base) =>
  fetch(base + route, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(body),
  });
const valid = await post('/api/quote', config);
assert.equal(valid.status, 200);
const quote = await valid.json();
assert.equal(quote.once, 17700);
assert.equal(quote.monthly, 900);
assert.equal(quote.deposit, 8850);
for (const bad of [
  { ...config, total: 1 },
  { ...config, quantities: { api: 99 } },
  { ...config, priceVersion: 'old' },
])
  assert.equal((await post('/api/quote', bad)).status, 400);
assert.equal((await post('/api/contact', {}, 'https://untrusted.example')).status, 429);
// This smoke test deliberately targets the default disconnected environment.
assert.equal((await post('/api/contact', {})).status, 503);
assert.equal((await post('/api/booking', {})).status, 503);
console.log(
  `HTTP checks passed: ${checked} public/localised routes, 404s, quotes, tampering and fail-closed delivery.`,
);
