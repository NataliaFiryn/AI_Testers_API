import { generateRegistrationData } from '../../../Generators/registration.generator.js';
import { test } from '../../fixtures/api.fixture.js';
import { expectAuthenticationError } from '../../support/api.assertions.js';

test('401 - POST /api/v1/users/signup rejects an invalid Bearer token', async ({
  registrationClient,
}) => {
  const response = await registrationClient.signUp(generateRegistrationData(), {
    Authorization: 'Bearer invalid-token',
  });
  await expectAuthenticationError(response, 401, 'Invalid or expired token');
});
