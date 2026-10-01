import { test, expect } from '../../../fixtures/api.fixture.js';
import { expectJsonResponse } from '../../../support/api.assertions.js';

const scenarios: { name: string; headers: Record<string, string> }[] = [
  { name: 'missing Authorization', headers: {} },
  {
    name: 'malformed Bearer token',
    headers: { Authorization: 'Bearer invalid-token' },
  },
];

function modifySignature(signature: string): string {
  return (signature[0] === 'A' ? 'B' : 'A') + signature.slice(1);
}

test.describe('401 - GET /api/v1/users/me', () => {
  for (const scenario of scenarios) {
    test(`rejects ${scenario.name}`, async ({ usersClient }) => {
      const response = await usersClient.me(scenario.headers);
      expectJsonResponse(response, 401);
      const body: Record<string, unknown> = await response.json();
      expect(typeof body.message).toBe('string');
    });
  }

  test('rejects a JWT with a modified signature', async ({
    authenticatedUser,
    usersClient,
  }) => {
    const [header, payload, signature] = authenticatedUser.token.split('.');
    const modifiedSignature = modifySignature(signature);
    const response = await usersClient.me({
      Authorization: `Bearer ${header}.${payload}.${modifiedSignature}`,
    });
    expectJsonResponse(response, 401);
    const body: Record<string, unknown> = await response.json();
    expect(typeof body.message).toBe('string');
  });
});
