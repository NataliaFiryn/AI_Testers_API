import { test, expect } from '../../../fixtures/api.fixture.js';
import { expectJsonResponse } from '../../../support/api.assertions.js';

test.describe('200 - GET /api/v1/users/me', () => {
  test('returns the newly registered user profile', async ({
    authenticatedUser,
    usersClient,
  }) => {
    const response = await usersClient.me({
      Authorization: `Bearer ${authenticatedUser.token}`,
    });
    expectJsonResponse(response, 200);
    const body: Record<string, unknown> = await response.json();
    const { username, email, firstName, lastName } = authenticatedUser.user;
    expect({
      username: body.username,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      roles: body.roles,
    }).toEqual({
      username,
      email,
      firstName,
      lastName,
      roles: ['ROLE_CLIENT'],
    });
    expect(Number.isInteger(body.id)).toBe(true);
    for (const field of ['password', 'token', 'refreshToken']) {
      expect(
        Object.hasOwn(body, field),
        `Response must not expose ${field}`,
      ).toBe(false);
    }
  });
});
