import { test } from 'node:test';
import assert from 'node:assert/strict';
import { products, services, packages, PRICE_VERSION } from '../src/lib/catalog';
import { calculate, type Configuration } from '../src/lib/pricing';
import { bookingSchema } from '../src/lib/booking';
import { repository, assertPermission } from '../src/lib/data/repository';
const config = (productId: string, quantities: Record<string, number> = {}): Configuration => ({
  productId,
  quantities,
  priceVersion: PRICE_VERSION,
});
test('all eight base services and three packages are uniquely configured', () => {
  assert.equal(services.length, 8);
  assert.equal(packages.length, 3);
  assert.equal(new Set(products.map((p) => p.id)).size, 11);
  for (const product of products) {
    assert.equal(
      calculate(config(product.id))[product.period === 'once' ? 'once' : 'monthly'],
      product.price,
    );
    assert.ok(product.scope.length >= 3);
    assert.equal(new Set(product.options.map((o) => o.id)).size, product.options.length);
  }
});
test('mixed one-time and recurring bot services never mix into the deposit', () => {
  const q = calculate(config('custom-stream-bots', { api: 2, hosting: 1, maintenance: 1 }));
  assert.equal(q.once, 17700);
  assert.equal(q.monthly, 2800);
  assert.equal(q.deposit, 8850);
  assert.equal(q.remainder, 8850);
  assert.equal(q.firstPeriod, 20500);
});
test('client prices, stale versions, unknown products and invalid quantities are rejected', () => {
  assert.throws(() => calculate({ ...config('creator-websites'), total: 1 } as never));
  assert.throws(() => calculate({ ...config('creator-websites'), priceVersion: 'old' } as never));
  for (const quantities of [{ pages: -1 }, { pages: 11 }, { pages: 1.5 }, { hacked: 1 }] as Record<
    string,
    number
  >[])
    assert.throws(() => calculate(config('creator-websites', quantities)));
  assert.throws(() => calculate(config('not-a-product')));
});
test('monthly clip allowances and options are calculated as recurring', () => {
  const q = calculate(config('short-form-content', { clips: 4, captions: 1 }));
  assert.equal(q.once, 0);
  assert.equal(q.monthly, 29400);
  assert.equal(q.deposit, 0);
});
test('interest in planned dashboard never creates a paid product flag', () => {
  const q = calculate(config('creator-dashboard', { platforms: 2 }));
  assert.equal(q.comingSoon, true);
  assert.equal(q.monthly, 2900);
  assert.equal(q.once, 0);
});
test('all maximum configurations retain exact integer money and balance', () => {
  for (const p of products) {
    const q = calculate(config(p.id, Object.fromEntries(p.options.map((o) => [o.id, o.max]))));
    assert.ok(Number.isSafeInteger(q.once));
    assert.ok(Number.isSafeInteger(q.monthly));
    assert.equal(q.deposit + q.remainder, q.once);
  }
});
const valid = {
  locale: 'de',
  configuration: config('creator-websites'),
  name: 'Creator Test',
  email: 'creator@example.com',
  phone: '',
  creator: 'NOVA',
  platforms: ['Twitch'],
  links: 'https://example.com/nova',
  description: 'A complete project description for my creator website.',
  serviceBrief: 'Five sections with a violet accent.',
  wishes: '',
  deadline: '',
  payment: 'discuss',
  consent: true,
  website: '',
};
test('briefing validation blocks extra amounts, unsafe URLs, absent consent and empty platforms', () => {
  assert.ok(bookingSchema.safeParse(valid).success);
  for (const change of [
    { total: 1 },
    { links: 'javascript:alert(1)' },
    { consent: false },
    { platforms: [] },
    { website: 'spam' },
    { deadline: '2000-01-01' },
  ])
    assert.ok(!bookingSchema.safeParse({ ...valid, ...change }).success);
});
test('repository is fail-closed until a real adapter is connected', async () => {
  assert.equal(repository.available, false);
  assert.equal(await repository.getVerifiedSession(), null);
  await assert.rejects(() =>
    repository.listOrders({ userId: 'x', projectId: 'webstudio-creator', role: 'customer' }),
  );
  assert.throws(() => assertPermission(null, 'customer'));
  assert.throws(() =>
    assertPermission({ userId: 'x', role: 'customer', projectId: 'webstudio-creator' }, 'admin'),
  );
  assert.throws(() =>
    assertPermission(
      { userId: 'x', role: 'admin', projectId: 'webstudio-expert' } as never,
      'admin',
    ),
  );
});
