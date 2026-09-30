import { test, expect } from '../../fixtures/api.fixture.js';
import { expectJsonResponse } from '../../support/api.assertions.js';

test.describe('400 — POST /api/v1/users/signin', () => {
  for (const field of ['username', 'password'] as const) {
    for (const length of [0, 3, 256]) {
      test(`rejects ${field} with ${length} characters`, async ({
        loginClient,
        credentials,
      }) => {
        const response = await loginClient.signIn({
          ...credentials,
          [field]: 'x'.repeat(length),
        });
        expectJsonResponse(response, 400);
        expect(await response.json()).toEqual({ [field]: expect.any(String) });
      });
    }
  }

  test('reports both invalid fields together', async ({ loginClient }) => {
    const response = await loginClient.signIn({ username: '', password: '' });
    expectJsonResponse(response, 400);
    expect(await response.json()).toEqual({
      username: expect.any(String),
      password: expect.any(String),
    });
  });
});
