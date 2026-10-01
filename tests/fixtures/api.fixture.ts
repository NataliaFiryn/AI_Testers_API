import { test as base, expect } from '@playwright/test';
import { generateRegistrationData } from '../../Generators/registration.generator.js';
import { ApiDocsClient } from '../../src/clients/api-docs.client.js';
import {
  LoginClient,
  type LoginCredentials,
} from '../../src/clients/login.client.js';
import { getLoginCredentials } from '../../src/config/env.js';
import {
  RegistrationClient,
  type RegistrationData,
} from '../../src/clients/registration.client.js';
import { UsersClient } from '../../src/clients/users.client.js';

export interface AuthenticatedUser {
  user: RegistrationData;
  token: string;
}

export const test = base.extend<{
  apiDocsClient: ApiDocsClient;
  loginClient: LoginClient;
  credentials: LoginCredentials;
  registrationClient: RegistrationClient;
  usersClient: UsersClient;
  authenticatedUser: AuthenticatedUser;
}>({
  usersClient: async ({ request }, use) => {
    await use(new UsersClient(request));
  },
  authenticatedUser: [
    async ({ registrationClient, loginClient, usersClient }, use, testInfo) => {
      const user = generateRegistrationData();
      let registered = false;
      let token: string | undefined;
      let cleanupError: string | undefined;
      let stage = 'registration';
      try {
        const registration = await registrationClient.signUp(user);
        registered = registration.status() === 201;
        expect(registration.status(), 'Registration must succeed').toBe(201);
        expect(
          (await registration.text()).length,
          'Registration body must be empty',
        ).toBe(0);

        stage = 'login';
        const login = await loginClient.signIn({
          username: user.username,
          password: user.password,
        });
        expect(login.status(), 'Login must succeed').toBe(200);
        expect(login.headers()['content-type']).toMatch(
          /^application\/json\b/i,
        );
        const body: unknown = await login.json();
        if (typeof body !== 'object' || body === null || Array.isArray(body)) {
          throw new Error('Login must return an object');
        }
        if (
          !('token' in body) ||
          typeof body.token !== 'string' ||
          !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(body.token)
        ) {
          throw new Error('Login must return an access JWT');
        }
        token = body.token;
        expect('mfaRequired' in body && body.mfaRequired === false).toBe(true);
        expect('challengeToken' in body && body.challengeToken === null).toBe(
          true,
        );
        expect(
          'challengeExpiresAt' in body && body.challengeExpiresAt === null,
        ).toBe(true);
        for (const field of [
          'username',
          'email',
          'firstName',
          'lastName',
        ] as const) {
          expect(
            field in body && body[field as keyof typeof body] === user[field],
            `Login must return the generated ${field}`,
          ).toBe(true);
        }
        expect(
          'roles' in body &&
            Array.isArray(body.roles) &&
            body.roles.length === 1 &&
            body.roles[0] === 'ROLE_CLIENT',
        ).toBe(true);
        stage = 'test';
        await use({ user, token });
      } catch {
        // Request errors may contain headers or payloads; never include their cause.
        throw new Error(`Authenticated user fixture failed during ${stage}`);
      } finally {
        if (token) {
          try {
            const response = await usersClient.forget(user.username, {
              Authorization: `Bearer ${token}`,
            });
            if (![204, 404].includes(response.status())) {
              cleanupError = `Account cleanup returned HTTP ${response.status()}`;
            }
          } catch {
            cleanupError = 'Account cleanup request failed';
          }
        } else if (registered) {
          cleanupError =
            'Registered account remains because login did not provide a usable cleanup token';
        }
        if (cleanupError) {
          testInfo.annotations.push({
            type: 'cleanup failure',
            description: cleanupError,
          });
          console.warn(cleanupError);
        }
      }
      if (cleanupError && testInfo.status === testInfo.expectedStatus) {
        throw new Error(cleanupError);
      }
    },
    { timeout: 60_000 },
  ],
  apiDocsClient: async ({ request }, use) => {
    await use(new ApiDocsClient(request));
  },
  registrationClient: async ({ request }, use) => {
    await use(new RegistrationClient(request));
  },
  loginClient: async ({ request }, use) => {
    await use(new LoginClient(request));
  },
  // Playwright requires an object destructuring pattern for fixture dependencies.
  // eslint-disable-next-line no-empty-pattern
  credentials: async ({}, use) => {
    await use(getLoginCredentials());
  },
});

export { expect } from '@playwright/test';
