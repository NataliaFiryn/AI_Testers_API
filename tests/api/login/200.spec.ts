import { test, expect } from '../../fixtures/api.fixture.js';
import { expectJsonResponse } from '../../support/api.assertions.js';

test.describe('200 — POST /api/v1/users/signin', () => {
  test('authenticates valid credentials without an Authorization header', async ({
    loginClient,
    credentials,
  }) => {
    const response = await loginClient.signIn(credentials);
    expectJsonResponse(response, 200);
    const body: Record<string, unknown> = await response.json();

    expect(body).toMatchObject({
      username: credentials.username,
      email: expect.stringMatching(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      mfaRequired: false,
      challengeToken: null,
      challengeExpiresAt: null,
    });
    // Check token shape without including live tokens in assertion output.
    expect(
      typeof body.token === 'string' &&
        /^[\w-]+\.[\w-]+\.[\w-]+$/.test(body.token),
    ).toBe(true);
    expect(
      typeof body.refreshToken === 'string' && body.refreshToken.length > 0,
    ).toBe(true);
    for (const field of ['firstName', 'lastName']) {
      expect(body[field] === null || typeof body[field] === 'string').toBe(
        true,
      );
    }
    expect(Array.isArray(body.roles)).toBe(true);
    const roles = body.roles as unknown[];
    expect(roles.length).toBeGreaterThan(0);
    for (const role of roles) {
      expect(['ROLE_ADMIN', 'ROLE_CLIENT']).toContain(role);
    }
    expect(body).not.toHaveProperty('password');
  });
});
