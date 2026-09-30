import { test } from '../../fixtures/api.fixture.js';
import { expectAuthenticationError } from '../../support/api.assertions.js';

test.describe('401 — POST /api/v1/users/signin', () => {
  test('rejects an invalid bearer token even with valid credentials', async ({
    loginClient,
    credentials,
  }) => {
    const response = await loginClient.signIn(credentials, {
      Authorization: 'Bearer invalid-token',
    });
    await expectAuthenticationError(response, 401, 'Invalid or expired token');
  });
});
