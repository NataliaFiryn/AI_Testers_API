import { randomBytes } from 'node:crypto';
import {
  generateRegistrationData,
  registrationCountries,
} from '../../../Generators/registration.generator.js';
import { test, expect } from '../../fixtures/api.fixture.js';
import { expectJsonResponse } from '../../support/api.assertions.js';

test.describe('201 - POST /api/v1/users/signup', () => {
  for (const country of registrationCountries) {
    test(`registers a user from ${country} who can sign in with the saved profile`, async ({
      registrationClient,
      loginClient,
    }) => {
      const user = generateRegistrationData({ country });
      const response = await registrationClient.signUp(user);
      expect(response.status()).toBe(201);
      expect(response.headers()['cache-control']).toContain('no-store');
      expect(await response.text()).toBe('');

      const login = await loginClient.signIn(user);
      expectJsonResponse(login, 200);
      expect(await login.json()).toMatchObject({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: ['ROLE_CLIENT'],
        mfaRequired: false,
        token: expect.stringMatching(/^\S+$/),
        refreshToken: expect.stringMatching(/^\S+$/),
      });
    });
  }

  test('accepts minimum field lengths', async ({ registrationClient }) => {
    const user = generateRegistrationData();
    const response = await registrationClient.signUp({
      ...user,
      username: randomBytes(3).toString('base64url'),
      password: user.password.slice(0, 8),
      firstName: user.firstName.slice(0, 4),
      lastName: user.lastName.slice(0, 4),
    });
    expect(response.status()).toBe(201);
    expect(await response.text()).toBe('');
  });

  for (const field of ['username', 'firstName', 'lastName'] as const) {
    test(`accepts the documented 255-character maximum for ${field}`, async ({
      registrationClient,
    }) => {
      const user = generateRegistrationData();
      const response = await registrationClient.signUp({
        ...user,
        [field]: user[field].padEnd(255, 'a'),
      });
      expect(response.status(), await response.text()).toBe(201);
      expect(await response.text()).toBe('');
    });
  }
});
