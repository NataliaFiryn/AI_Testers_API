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
  type RegistrationRequest,
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
  accountCleanup: (data: RegistrationRequest) => void;
}>({
  usersClient: async ({ request }, use) => {
    await use(new UsersClient(request));
  },
  authenticatedUser: [
    async ({ registrationClient, loginClient }, use) => {
      const user = generateRegistrationData();
      let token: string | undefined;
      let stage = 'registration';
      try {
        const registration = await registrationClient.signUp(user);
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
      }
    },
    { timeout: 60_000 },
  ],
  apiDocsClient: async ({ request }, use) => {
    await use(new ApiDocsClient(request));
  },
  accountCleanup: [
    async ({ loginClient, usersClient }, use, testInfo) => {
      const accounts: RegistrationRequest[] = [];
      const failures: string[] = [];
      try {
        await use((data) => accounts.push({ ...data }));
      } finally {
        for (const account of accounts) {
          try {
            if (
              typeof account.username !== 'string' ||
              typeof account.password !== 'string'
            ) {
              failures.push(
                'Created account has no usable cleanup credentials',
              );
              continue;
            }
            const login = await loginClient.signIn({
              username: account.username,
              password: account.password,
            });
            if (login.status() !== 200) {
              failures.push('Cleanup login returned HTTP ' + login.status());
              continue;
            }
            const body: unknown = await login.json();
            if (
              typeof body !== 'object' ||
              body === null ||
              !('token' in body) ||
              typeof body.token !== 'string' ||
              !body.token
            ) {
              failures.push('Cleanup login did not return an access token');
              continue;
            }
            const response = await usersClient.forget(account.username, {
              Authorization: 'Bearer ' + body.token,
            });
            if (![204, 404].includes(response.status())) {
              failures.push(
                'Account cleanup returned HTTP ' + response.status(),
              );
            }
          } catch {
            // Request errors can contain credentials or authorization headers.
            failures.push('Account cleanup request failed');
          }
        }
        for (const description of failures) {
          testInfo.annotations.push({ type: 'cleanup failure', description });
          console.warn(description);
        }
      }
      if (failures.length && testInfo.status === testInfo.expectedStatus) {
        throw new Error(
          'Failed to clean up ' + failures.length + ' test account(s)',
        );
      }
    },
    { timeout: 120_000 },
  ],
  registrationClient: async ({ request, accountCleanup }, use) => {
    await use(new RegistrationClient(request, accountCleanup));
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
