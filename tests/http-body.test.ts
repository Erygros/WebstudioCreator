import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PayloadTooLargeError, readLimitedBody } from '../src/lib/http';
test('request body limit applies to actual bytes even without a trustworthy Content-Length', async () => {
  const request = new Request('http://localhost', { method: 'POST', body: 'x'.repeat(100) });
  await assert.rejects(() => readLimitedBody(request, 50), PayloadTooLargeError);
});
test('small valid body survives the bounded reader', async () => {
  const value = 'Creator brief: Grüße';
  const bytes = await readLimitedBody(
    new Request('http://localhost', { method: 'POST', body: value }),
    100,
  );
  assert.equal(new TextDecoder().decode(bytes), value);
});
