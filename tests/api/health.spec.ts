import { test, expect } from '../fixtures/api.fixture.js';

test('GET /health zwraca status usługi', async ({ healthClient }) => {
  const response = await healthClient.getHealth();

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
  expect(await response.json()).toEqual({ status: 'ok' });
});
