import { randomUUID } from 'node:crypto';
import { test } from '../../fixtures/api.fixture.js';
import { expectAuthenticationError } from '../../support/api.assertions.js';

test.describe('422 — POST /api/v1/users/signin', () => {
  test('rejects an incorrect password for an existing user', async ({
    loginClient,
    credentials,
  }) => {
    const response = await loginClient.signIn({
      ...credentials,
      password: randomUUID(),
    });
    await expectAuthenticationError(
      response,
      422,
      'Invalid username/password supplied',
    );
  });

  test('rejects an unknown username', async ({ loginClient, credentials }) => {
    const response = await loginClient.signIn({
      ...credentials,
      username: `missing-${randomUUID()}`,
    });
    await expectAuthenticationError(
      response,
      422,
      'Invalid username/password supplied',
    );
  });

  for (const field of ['username', 'password'] as const) {
    for (const value of [undefined, null]) {
      test(`rejects ${value === null ? 'null' : 'omitted'} ${field}`, async ({
        loginClient,
        credentials,
      }) => {
        const response = await loginClient.signIn({
          ...credentials,
          [field]: value,
        });
        await expectAuthenticationError(
          response,
          422,
          'Invalid username/password supplied',
        );
      });
    }
  }

  for (const length of [4, 255]) {
    test(`accepts ${length}-character fields for validation but rejects unknown credentials`, async ({
      loginClient,
    }) => {
      const response = await loginClient.signIn({
        username: 'z'.repeat(length),
        password: 'z'.repeat(length),
      });
      await expectAuthenticationError(
        response,
        422,
        'Invalid username/password supplied',
      );
    });
  }
});
